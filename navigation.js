import { hideEventDetails, loadEvents, loadParticipants } from "./eventActions";
import { selectContact } from "./contactActions";

const SELECT_CONTACT = "SELECT_CONTACT";
const EVENT_LIST = "EVENT_LIST";
const EVENT_DETAILS = "EVENT_DETAILS";

const GetNavigation = (state = {
    contactState: {},
    eventState: {}
}) => {
    if(!state.contactState.selectedContact || state.contactState.reselect)
    {
        return {
            title : "MN AW",
            currentView: SELECT_CONTACT
        };
    }

    const { openEvent, events } = state.eventState;
    if(openEvent){
        return {
            title: events.find(x => x.EventID === openEvent).Description,
            action: hideEventDetails(),
            currentView: EVENT_DETAILS,
            onRefresh: loadParticipants([openEvent])
        };
    }
    else
    {
        return {
            title: "AW listan",
            action: selectContact(null),
            currentView: EVENT_LIST,
            onRefresh: loadEvents()
        };
    }
};

function GetBackHandler(store){
    return function(){
        const nav = GetNavigation(store.getState());
        if(nav.action){
            store.dispatch(nav.action);
            return true;
        }
        else {
            return false;
        }
    };
}

export {
    GetNavigation,
    SELECT_CONTACT,
    EVENT_LIST,
    EVENT_DETAILS,
    GetBackHandler
};