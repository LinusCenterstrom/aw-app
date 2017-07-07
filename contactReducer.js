import {
    CONTACTS_LOADED,
    LOAD_CONTACTS,
    SELECT_CONTACT
} from "./contactActions";

function contactReducer(state = {
    contactsLoading: true
}, action){
    switch(action.type){
        case CONTACTS_LOADED:
            return {
                ...state,
                contacts: action.contacts,
                contactsLoading: false
            };
        case LOAD_CONTACTS:
            return {
                ...state,
                contactsLoading: true
            };
        case SELECT_CONTACT:
            return {
                ...state,
                selectedContact: action.contact
            };
        default: 
            return state;
    }
}

export default contactReducer;