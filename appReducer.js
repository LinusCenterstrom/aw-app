import { APP_STATUS, APP_SETSTATUS, APP_BEGIN_POLLING, APP_POLLING_COMPLETE } from "./appActions";
function appReducer(state = {
    status: "active",
    isPolling: false
}, action){
    switch(action.type){
        case APP_STATUS:
           return {
                ...state,
                status: "active"
            };
        case APP_SETSTATUS:
            return { 
                ...state,
                status: action.status
            };
        case APP_BEGIN_POLLING:
         console.log("APP_BEGIN_POLLING");
            return { 
                ...state,
                isPolling: true
            };
        case APP_POLLING_COMPLETE:
        console.log("APP_POLLING_COMPLETE");
            return { 
                ...state,
                isPolling: false,
                events: action.events,
                participants: action.participants
            };
        default:
            return state;
    }
}

export default appReducer;