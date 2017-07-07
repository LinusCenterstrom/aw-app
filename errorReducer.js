import { HIDE_ERROR_MESSAGE, SHOW_ERROR_MESSAGE } from "./errorActions";
function eventReducer(state = {
}, action){
    switch(action.type){
        case HIDE_ERROR_MESSAGE:
            if(state.error){
                return {
                    ...state,
                    error: null
                };
            }
            else{
                return state;
            }
        case SHOW_ERROR_MESSAGE:
            return {
                ...state,
                error: action.message
            };
        default:
            return state;
    }
}

export default eventReducer;