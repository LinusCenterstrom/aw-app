/* global require */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ScrollView, View, Image, Text } from "react-native";
import { dateRange } from "./dateHelper";
import ParticipantList from "./participantList";
import { connect } from "react-redux";
import { createBooking, cancelParticipant } from "./eventActions";
import Signup from "./Signup";

class EventDetails extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let { ImageUrl, Participants, Description, Details, ObjectName, EventID, PeriodStart, PeriodEnd, participantsLoading } = this.props.ev;
        let { changePending } = this.props;
        let source;

        if(ImageUrl && typeof(ImageUrl) == "string"){
            source = {
                uri: ImageUrl
            };
        }
        else
        {
            source = require("./images/nopic1.png");
        }

        return (
            <ScrollView style={{backgroundColor: "#fff"}} >
                <View style={{marginBottom: 20}}>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1}}>
                        <Image
                            source = {source}
                            style= {{height: 80, resizeMode:"contain"}}
                        />
                        </View>
                        <Text style={{fontSize: 25, paddingLeft: 10, flex: 4}}>
                            {Description}
                            {"\n"}
                            <Text style={{fontSize: 18}}>
                            {dateRange(PeriodStart, PeriodEnd)}
                            {"\n"}
                            {Details &&
                                Details
                            }
                            </Text>                    
                            {ObjectName != Description && 
                            <Text style={{fontSize: 14, color: "#ccc", flex: 1}}>
                                {"\n"}
                                ({ObjectName})
                            </Text>
                            }
                        </Text>
                    </View>
                    {
                        <Signup eventID={EventID} participantsLoading={changePending} participants={Participants} modifyingBooking={changePending || false} />
                    }
                   
                   
                    <View style={{paddingTop: 10}}>
                        <Text style={{fontSize:24, textDecorationLine:"underline"}}>Deltagare</Text>
                        <ParticipantList isLoading={participantsLoading} eventID={EventID} Participants={Participants} />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

EventDetails.propTypes = {
    ev: PropTypes.object,
    contact : PropTypes.object.isRequired,
    createBooking: PropTypes.func.isRequired,
    cancelParticipant: PropTypes.func.isRequired,
    bookingStatus: PropTypes.number.isRequired,
    thisPart: PropTypes.object,
    changePending: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    const ev = state.eventState.events.find(x => x.EventID === state.eventState.openEvent);
    const contact = state.contactState.selectedContact;
    var part = ev.Participants ? ev.Participants.find(x => x.PersonID === contact.PersonID) : null; 
    return {
        ev: ev,
        contact: contact,
        thisPart: part,
        bookingStatus: part ? part.Canceled === "true" ? 2 : 1 : 0,
        changePending: (ev.creatingBooking || ev.cancelingBooking) ? true : false
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createBooking: (eventID, contact, comment, participant) => dispatch(createBooking(eventID, contact, comment, participant)),
        cancelParticipant: (eventID, contact, comment, participant) => dispatch(cancelParticipant(eventID, contact, comment, participant))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    EventDetails
);