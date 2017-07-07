import { GetEvent, CreateBooking, CancelParticipant, GetParticipants } from "./api";
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

export const showEventDetails = makeActionCreator(SHOW_EVENT_DETAILS, "ev");
export const hideEventDetails = makeActionCreator(HIDE_EVENT_DETAILS);

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
    cancelParticipant
};
