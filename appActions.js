import { GetEvent, GetParticipants } from "./api";
import { makeActionCreator } from "./actionHelpers";

const APP_SETSTATUS = "APP_SETSTATUS";
const APP_STATUS = "APP_STATUS";
const APP_BEGIN_POLLING = "APP_BEGIN_POLLING";
const APP_POLLING_COMPLETE = "APP_POLLING_COMPLETE";
const APP_IS_POLLING = "APP_IS_POLLING";

function setAppStateStatus(status){
    return function(dispatch){
        dispatch(
            {
                type: APP_SETSTATUS,
                status
            }
        );
    };
}

function startPolling(){
    return function(dispatch){
        dispatch({
            type: APP_BEGIN_POLLING
        });


        let events = null;
        let participants = null;

        GetEvent({
            success: (eventResult) => {
                events = eventResult;

                GetParticipants(events.map(x => x.EventID), function(eventParticipants){
                    participants = eventParticipants;

                    dispatch({
                        type: APP_POLLING_COMPLETE,
                        events,
                        participants
                    });

                });

            }
        });


    };
}

export const getAppStateStatus = makeActionCreator(APP_STATUS);


export {
    APP_SETSTATUS,
    APP_STATUS,
    setAppStateStatus,
    APP_BEGIN_POLLING,
    APP_POLLING_COMPLETE,
    APP_IS_POLLING,
    startPolling
};