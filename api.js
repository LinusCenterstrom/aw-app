import soap from "soap-everywhere";
import { cfg } from "./apiConfig";
import { showErrorMessage } from "./errorActions";
import moment from "moment-with-locales-es6";

//fulfix för timeout i options verkade inte funka
function SetRequestTimeout (timeout) {
    var proxied = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        this.timeout = timeout;
        this.ontimeout = function(e) {
            showErrorMessage(getErrorMessage(DEFAULT_ERROR_MESSAGE, e));
        };
        return proxied.apply(this, [].slice.call(arguments));
    };
}

const constants = {
    CategoryID : "46069",
    EventDetailsQuestionID: "19066",
    CustomerID : "1670672"
};

const DEFAULT_ERROR_MESSAGE = "Ett fel uppstod vid anslutning mot LegaOnline, var god kontrollera din nätverksanslutning : ";
const getErrorMessage = (message) => DEFAULT_ERROR_MESSAGE + message;

function log(...args){
    console.log(args);
}

const makeCall = (funcName, success, error, data, shouldFlattenResponse, logResponse) => {
    GetAuthToken({
        success: function(tknResp){
            data.authToken = tknResp;
            if(!data.sort)
                data.sort = "";
            soap.createClient(cfg.url, function(err, client){
                if(err){
                    showErrorMessage(getErrorMessage(err));
                    if(error){
                        error(err);
                    }
                    else{
                        log("error", err);
                    }
                }
                else{
                    client[funcName]({
                        ...data
                    }, function(err, result){
                        if(err){
                            log(err);
                            log(client.lastRequest);
                            showErrorMessage(getErrorMessage(err));
                            if(error){
                                error(result);
                            }
                        }
                        else if(success){
                            let resp = sanitizeResponse(funcName, result);
                            if(shouldFlattenResponse){
                                resp = flattenResponse(funcName.replace("Get", ""), resp);
                            }
                            if(logResponse){
                                log(resp);
                            }
                            resp.ApiTimestamp = new Date();
                            success(resp);
                        }
                    });
                }
            });
        }
    });
};

const sanitizeResponse = (callName, resp) => resp[callName + "Result"];

let cachedToken = null;
let tokenLoading = false;
let tokenListeners = [];

const GetAuthToken = (newOpts) => {
    if(tokenLoading === true) {
        tokenListeners.push(newOpts);
        return;
    }

    if(cachedToken !== null)
    {
        if((new Date() - cachedToken.created) > 1000 * 60 * 30)
        {
            cachedToken = null;
        }
        else
        {
            if(newOpts.success)
            {
                newOpts.success(cachedToken.value);
            }
            return;
        }
    }

    tokenLoading = true;
    tokenListeners.push(newOpts);

    soap.createClient(cfg.url, function(err, client){
        if(err){
            log("unable to create client", err);
            showErrorMessage(getErrorMessage(err));
            return;
        }
        client.GetAuthToken({
            userID: cfg.userID,
            hash: cfg.hash
        }, function(err, result){
            const apiToken = err ? null : sanitizeResponse("GetAuthToken", result);
            for(let i = 0; i < tokenListeners.length; i++)
            {
                const opts = tokenListeners[i];
                if(err){
                    if(opts.error)
                    {
                        opts.error(err);
                    }
                    else{
                        log("token error", err);
                    }
                }
                else if(opts.success){ 
                    if(i === 0)
                    {
                        cachedToken = {
                            value : apiToken,
                            created: new Date()
                        };
                    }
                    opts.success(apiToken);
                }
            }
            tokenListeners = [];
            tokenLoading = false;
        });
    });
};

const token = (name, value) => "<" + name + ">" + value + "</" + name + ">";

const Filter = (prop, condition, value) => (
    "<Filter>"+
        token("FilterName", prop) +
        token("FilterCondition", condition) + 
        token("FilterValue", value) +
    "</Filter>"    
);

const Filtering = (filters) => {
    let res = "<Filtering>";
    for(let i = 0; i < filters.length; i++){
        res += filters[i];
    }

    res += "</Filtering>";
    return res;
};

function flattenResponse(propName, resp){
    if(resp && resp.length == 1){
        let inner = resp[0];
        if(inner[propName])
            return inner[propName];
        return inner;
    }
}

function GetEventQuestions(eventIds, success, error) {
    if(!eventIds.length)
        return [];
    makeCall("GetEventQuestion", success, error, {
        filter: Filtering([Filter("QuestionID", "=", constants.EventDetailsQuestionID), Filter("EventID", "IN", eventIds.join(","))])
    }, true);
}

function GetContacts(opts) {
    const {success, error} = opts;
    makeCall("GetCustomerContact", function(contacts){
        if(contacts && contacts.length) {
            makeCall("GetPerson", function(persons){
                var personDic = persons.toDictionary(x => x.CustomerContactID);
                for(var i = 0; i < contacts.length; i++){
                    contacts[i].PersonID = personDic[contacts[i].CustomerContactID].PersonID;
                }
                success(contacts);
            }, error, {
                filter : Filtering(Filter("CustomerContactID", "IN", contacts.map(x => x.CustomerContactID).join(","))),
                includeAttributes : "false"
            }, true);
        }else{
            success(contacts);
        }
    }, error, {
        filter: Filtering(Filter("CustomerID", "=", constants.CustomerID))
    }, true);
}

const GetEvent = (opts) => {
    const {success, error} = opts;
    makeCall("GetEvent", function(evs){
        if(evs && evs.length)
        {
            if(evs.length) {
                let eventIds = evs.map(ev => ev.EventID);
                GetEventQuestions(eventIds, function(questions){
                    var qDic = questions.toDictionary(x => x.EventID);
                    for(var i = 0; i < evs.length; i++){
                        var ev = evs[i];
                        var qAnswer = qDic[ev.EventID];
                        if(qAnswer && typeof(qAnswer.AnswerText) === "string"){
                            ev.Details = qAnswer.AnswerText;
                        }
                    }
                    success(evs);
                });
            }
        }
    }, error, {
        filter:  Filtering([Filter("CategoryID", ">=", constants.CategoryID), Filter("PeriodStart", ">=", moment().format("YYYY-MM-DD"))]),
    }, true);
};

function GetParticipants(eventIds, success, error) {
    if(!eventIds || !eventIds.length){
        success([]);
    }
    makeCall("GetEventParticipant", success, error, {
        filter: Filtering(
            eventIds.length === 1 
                                ? Filter("EventID", "=", "" + eventIds[0])            
                                : Filter("EventID", "IN", eventIds.join(","))
        )
    }, true);
}

function setParticipantCanceled(participant, canceled, opts){
    makeCall("SetEventParticipant", opts.success, opts.error, {
        eventParticipant : {
            EventParticipant : {
                EventParticipantID: participant.EventParticipantID,
                Canceled : canceled ? "true" : "false"
            }
        }
    });
}

function CreateBooking(eventID, contact, comment, opts = {}, participant){
    if(participant){
        setParticipantCanceled(participant, false, opts);
        return;
    }
    const person = opts.person || {};        
    makeCall("CreateSubEventBooking", function(resp){
    if(opts.success)
        opts.success(resp);
    }, opts.error, {
        bookingInfo: {
            EventID: eventID,
            CustomerID: constants.CustomerID,
            CustomerContactID : contact.CustomerContactID,
            Notes: comment,
            SubEventPersons: {
                SubEventPerson : {
                    PersonID : contact.PersonID,
                    CustomerContactID : contact.CustomerContactID,
                    CustomerID : constants.CustomerID,
                    ...person
                }
            }
        }
    });
}

function CancelParticipant(eventID, contact, comment, opts = {}, participant){
    if(participant){
        setParticipantCanceled(participant, true, opts);
    }
    else {
        CreateBooking(eventID, contact, comment, {
            ...opts,
            person: { Canceled : "true" }
        });
    }
}

export {   
    GetAuthToken, GetEvent, GetContacts, CreateBooking, CancelParticipant, GetParticipants, SetRequestTimeout
};