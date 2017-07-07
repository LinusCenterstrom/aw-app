import React from "react";
import { View } from "react-native";
import { Button } from "react-native-material-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createBooking, cancelParticipant } from "./eventActions";

const buttonStyle = {
    container: {
        borderWidth: 1,
        marginRight: 1,
        borderRadius: 5,
        borderColor: "#ccc"
    }
};

const mapStateToProps = state => ({
    contact: state.contactState.selectedContact
});

const mapDispatchToProps = dispatch => ({
    participate: (eventID, contact, participant) => dispatch(createBooking(eventID, contact, "", participant)),
    decline: (eventID, contact, participant) => dispatch(cancelParticipant(eventID, contact, "", participant))
});

const Signup = ({
    eventID, participantsLoading = true, participants, contact, participate, decline, modifyingBooking, ...props
}) => {
    let confirmed = false, declined = false;
    const participant = participants && participants.find(x => x.PersonID === contact.PersonID);
    if(participant){
        confirmed = participant.Canceled !== "true";
        declined = !confirmed;
    }
    return (
        <View {...props} style={{flexDirection: "row", width: "100%"}}>
            <View style={{flex: 1}}>
                <Button text="" disabled={modifyingBooking || participantsLoading} raised={confirmed} style={buttonStyle} primary icon="check" onPress={confirmed ? null : () => participate(eventID, contact, participant)} />
            </View>
            <View style={{flex: 1}}>
                <Button text="" disabled={modifyingBooking || participantsLoading} raised={declined} style={buttonStyle} accent icon="cancel" onPress={declined ? null : () => decline(eventID, contact, participant)} />
            </View>
        </View>
    );
};

Signup.propTypes = {
    participantsLoading: PropTypes.bool,
    participants: PropTypes.array,
    eventID: PropTypes.number.isRequired,
    participate: PropTypes.func.isRequired,
    decline: PropTypes.func.isRequired,
    contact: PropTypes.object.isRequired,
    modifyingBooking: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);