import React from "react";
import { Picker, View } from "react-native";
import PropTypes from "prop-types";
import { pure } from "recompose";

const SelectUser = (props) => {
    const {contacts, onValueChange, value} = props;
    return <View style={{maxWidth: 140}}>
            <Picker value={value} 
                onValueChange={(val) => {
                    const contact = val === -1 ? null : contacts.find(x => x.CustomerContactID === val);
                    onValueChange(contact);
                                }
                              }
            selectedValue={value}>
                        <Picker.Item label="Vem är du?" value={-1} /> 
                        {contacts.map(x => <Picker.Item key={x.CustomerContactID} label={x.ContactName} value={x.CustomerContactID} />)}
            </Picker>
        </View>;
           
};

SelectUser.propTypes = {
    contacts : PropTypes.array.isRequired,
    onValueChange : PropTypes.func.isRequired,
    value : PropTypes.number.isRequired
};

export default pure(SelectUser);