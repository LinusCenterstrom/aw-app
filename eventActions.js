import { GetEvent, CreateBooking, CancelParticipant, GetParticipants, LoadEventComments, AddEventComment } from "./api";
import { makeActionCreator } from "./actionHelpers";

const LOAD_EVENTS = "LOAD_EVENTS";
const LOAD_PARTICIPANTS = "LOAD_PARTICIPANTS";
const SHOW_EVENT_DETAILS = "SHOW_EVENT_DETAILS";
const HIDE_EVENT_DETAILS = "HIDE_EVENT_DETAILS";
const EVENTS_LOADED = "EVENTS_LOADED";
const PARTICIPANTS_LOADED = "PARTICIPANTS_LOADED";
const CREATING_BOOKING = "CREATING_BOOKING";
const BOOKING_CREATED = "BOOKING_CREATED";
const CANCELING_PARTICIPANT = "CANCELING_PARTICIPANT";
const PARTICIPANT_CANCELED = "PARTICIPANT_CANCELED";
const EXPAND_COMMENTS = "EXPAND_COMMENTS";
const CONTRACT_COMMENTS = "CONTRACT_COMMENTS";
const EVENT_LOADCOMMENTS = "EVENT_LOADCOMMENTS";
const EVENT_COMMENTSLOADED = "EVENT_COMMENTSLOADED"; 
const EVENT_ADDCOMMENT = "EVENT_ADDCOMMENT";
const EVENT_COMMENTADDED = "EVENT_COMMENTADDED";

function createBooking(eventID, contact, comment, participant){
    return function(dispatch){
        dispatch({
            type: CREATING_BOOKING,
            eventID
        });

        CreateBooking(eventID, contact, comment, {
            success: () => {
                dispatch({
                    type: BOOKING_CREATED,
                    eventID
                });
                return dispatch(loadParticipants([eventID]));
            }
        }, participant);
    };
}

function cancelParticipant(eventID, contact, comment, participant){
    return function(dispatch){
        dispatch({
            type: CANCELING_PARTICIPANT,
            eventID
        });
        setTimeout(() =>
        CancelParticipant(eventID, contact, comment, {
            success : () => {
                dispatch({
                    type: PARTICIPANT_CANCELED,
                    eventID
                });
                return dispatch(loadParticipants([eventID]));
            }
        }, participant), 3000);
    };
}

function loadParticipants(eventIDs){
    return function(dispatch) {
        dispatch({
            type: LOAD_PARTICIPANTS,
            eventIDs
        });
        setTimeout(function() {
        GetParticipants(eventIDs, function(participants){
            dispatch({
                type: PARTICIPANTS_LOADED,
                participants,
                eventIDs
            });
        });
        }, 3000);
    };
}

function loadEvents(skipParticipants = false){
    return function(dispatch) {
        dispatch({
            type: LOAD_EVENTS
        });

        GetEvent({
            success: (events) => {
                dispatch({
                    type: EVENTS_LOADED,
                    events
                });

                if(!skipParticipants){
                    return dispatch(loadParticipants(events.map(x => x.EventID)));
                }
            }
        });
    };
}

function loadComments(eventID){
    return function(dispatch){
        dispatch({
                    type: EVENT_LOADCOMMENTS
                });

        setTimeout(function() {
        LoadEventComments(eventID, function(comments){
            dispatch({
                type: EVENT_COMMENTSLOADED,
                comments
            });
        });
        }, 3000);
    };
}

function addEventComment(eventID, contact, comment){
 return function(dispatch) {
        dispatch({
            type: EVENT_ADDCOMMENT
        });
        setTimeout(function() {
        AddEventComment(eventID, contact, comment, function(a,b,c){
            dispatch({
                type: EVENT_COMMENTADDED,
                a,b,c
            });

            return dispatch(loadComments(eventID));
        });
          }, 3000);
    };
}

export const showEventDetails = makeActionCreator(SHOW_EVENT_DETAILS, "ev");
export const hideEventDetails = makeActionCreator(HIDE_EVENT_DETAILS);

export const expandComments = makeActionCreator(EXPAND_COMMENTS);
export const contractComments = makeActionCreator(CONTRACT_COMMENTS);

export {
    LOAD_EVENTS,
    LOAD_PARTICIPANTS,
    SHOW_EVENT_DETAILS,
    HIDE_EVENT_DETAILS,
    CANCELING_PARTICIPANT,
    PARTICIPANT_CANCELED,
    EVENTS_LOADED,
    PARTICIPANTS_LOADED,
    CREATING_BOOKING,
    BOOKING_CREATED,
    loadParticipants,
    loadEvents,
    createBooking,
    cancelParticipant,
    EXPAND_COMMENTS,
    CONTRACT_COMMENTS,
    loadComments,
    EVENT_LOADCOMMENTS,
    EVENT_COMMENTSLOADED,
    addEventComment,
    EVENT_ADDCOMMENT,
    EVENT_COMMENTADDED
};
