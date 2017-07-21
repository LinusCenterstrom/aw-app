import {
    LOAD_EVENTS,
    LOAD_PARTICIPANTS,
    SHOW_EVENT_DETAILS,
    HIDE_EVENT_DETAILS,
    EVENTS_LOADED,
    PARTICIPANTS_LOADED,
    CREATING_BOOKING,
    BOOKING_CREATED,
    CANCELING_PARTICIPANT,
    PARTICIPANT_CANCELED,
    EXPAND_COMMENTS,
    CONTRACT_COMMENTS,
    EVENT_LOADCOMMENTS,
    EVENT_COMMENTSLOADED,
    EVENT_ADDCOMMENT,
    EVENT_COMMENTADDED
} from "./eventActions";

const modifyEvent = (evs, eventID, update) => {
    const newEvents = evs.map(ev => {
        if(ev.EventID === eventID) {
            return {
                ...ev,
                ...update
            };
        }
        else {
            return ev;
        }
    });
    return newEvents;
};

function eventReducer(state = {
    openEvent: null,
    events: null,
    eventsLoading: false,
    comments:[],
    commentsLoading: false,
    commentsExpanded: false
}, action){
    switch(action.type) {
        case LOAD_EVENTS: 
            return {
                ...state,
                eventsLoading : true
            };
        case LOAD_PARTICIPANTS: {
            const toLoad = action.eventIDs.toDictionary(x => x);
            return {
                ...state,
                events: state.events.map(ev => {
                    if(toLoad[ev.EventID])
                    {
                        return {
                            ...ev,
                            participantsLoading: true    
                        };
                    } else {
                        return ev;
                    }
                })
            };
        }
        case SHOW_EVENT_DETAILS:
            return {
                ...state,
                openEvent: action.ev
            };
        case HIDE_EVENT_DETAILS:
            return {
                ...state,
                openEvent: null
            };
        case EVENTS_LOADED: 
            return {
                ...state,
                eventsLoading: false,
                events: action.events
            };
        
        case PARTICIPANTS_LOADED: {
            const partsLookup = action.participants.toLookup(x => x.EventID);
            const eventIDs = action.eventIDs.toDictionary(x => x);
            return {
                ...state,
                events: state.events.map(ev => {
                    if(partsLookup[ev.EventID])
                    {
                        return { 
                            ...ev,
                            Participants: partsLookup[ev.EventID],
                            participantsLoading: false
                        };
                    }
                    else if(eventIDs[ev.EventID]){
                        return {
                            ...ev,
                            Participants: [],
                            participantsLoading: false
                        };
                    }
                    else{
                        return ev;
                    }
                })
            };
        }

        case CREATING_BOOKING : {
            return {
                ...state,
                events: modifyEvent(state.events, action.eventID, (ev) => {
                    ev.creatingBooking = true;
                    ev.modifyingBooking = true;
                    return ev;
                })
            };
        }

        case BOOKING_CREATED : {
            return {
                ...state,
                events: modifyEvent(state.events, action.eventID, {
                    creatingBooking: false,
                    modifyingBooking: false
                })
            };
        }

        case CANCELING_PARTICIPANT: {
            var newState = {
                ...state,
                events: modifyEvent(state.events, action.eventID, {
                    cancelingParticipant: true,
                    modifyingBooking: true
                })
            };
            return newState;
        }

        case PARTICIPANT_CANCELED: {
            return {
                ...state,
                events: modifyEvent(state.events, action.eventID, {
                    creatingBooking: false,
                    modifyingBooking: false
                })
            };
        }

        case EXPAND_COMMENTS:{
            return{
                ...state,
                commentsExpanded: true
            };
        }
    
        case CONTRACT_COMMENTS:{
            return{
                ...state,
                commentsExpanded: false
            };
        }

        case EVENT_LOADCOMMENTS:{
           return {
                ...state,
                commentsLoading: true
            };
        }


        case EVENT_COMMENTSLOADED:{
            console.log(action);
             return {
                ...state,
                commentsLoading: false,
                comments: action.comments
            };
        }

        case EVENT_ADDCOMMENT:{
            return{
                ...state,
                commentPendingAdd: true
            };   
        }

        case EVENT_COMMENTADDED:{
             console.log(action);
            return{
                ...state,
                commentPendingAdd: false
            };
        }

        default:
            return state;
    }
}

export default eventReducer;