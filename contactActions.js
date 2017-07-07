import { GetContacts } from "./api";
import { makeActionCreator } from "./actionHelpers";

const SELECT_CONTACT = "SELECT_CONTACT";
const LOAD_CONTACTS = "LOAD_CONTACTS";
const CONTACTS_LOADED = "CONTACTS_LOADED";

function loadContacts(){
    return function(dispatch){
        dispatch(
            {
                type: LOAD_CONTACTS
            }
        );

        GetContacts({
           success: contacts => dispatch({
                type: CONTACTS_LOADED,
                contacts
           })
        });
    };
}
export const selectContact = makeActionCreator(SELECT_CONTACT, "contact");

export {
    loadContacts,
    SELECT_CONTACT,
    LOAD_CONTACTS,
    CONTACTS_LOADED
};