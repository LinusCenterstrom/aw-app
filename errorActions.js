const SHOW_ERROR_MESSAGE = "SHOW_ERROR_MESSAGE";
const HIDE_ERROR_MESSAGE  = "HIDE_ERROR_MESSAGE";

let hideTimeout;

function showErrorMessage(message){
    return function(dispatch){
        dispatch({
            type: SHOW_ERROR_MESSAGE,
            message
        });

        if(hideTimeout){
            clearTimeout(hideTimeout);
        }

        hideTimeout = setTimeout(function(){
            dispatch(hideErrorMessage());
        }, 3000);
    };
}

function hideErrorMessage(){
    return function(dispatch){
        dispatch({
            type: HIDE_ERROR_MESSAGE
        });
    };
}

export {
    SHOW_ERROR_MESSAGE,
    HIDE_ERROR_MESSAGE,
    showErrorMessage,
    hideErrorMessage
};