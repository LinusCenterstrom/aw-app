/* global require */
import React from "react";
import { Image, View, Text, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Loader } from "./loader";
import DateRange from "./DateRange";
import PropTypes from "prop-types";
import { pure } from "recompose";
import Signup from "./Signup";

const StatusIcon = ({name, color, children}) => (
    <Icon size = {14} name={name} color={color}>
        {children}
    </Icon>        
);

StatusIcon.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    children: PropTypes.node
};

const ParticipantStatus = ({
    confirmed, declined, ...props
}) => (
    <Text {...props}>
        {confirmed > 0 &&
            <StatusIcon name="user" color="#1ba819" > {confirmed} </StatusIcon>
        }
        {declined > 0 &&
            <StatusIcon name="user" color="#c10909" > {declined} </StatusIcon>
        }
    </Text>
);

ParticipantStatus.propTypes = {
    confirmed: PropTypes.number.isRequired,
    declined: PropTypes.number.isRequired
};

const Ev = (props) => { 
    let { ImageUrl, participantsLoading } = props;
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
        <TouchableHighlight activeOpacity={0.4} style={props.style} underlayColor="#d1e2ff" onPress={() => props.onEventPressed(props.EventID)}>
            <View style={{backgroundColor: "#fff", height: "100%", width: "100%"}}>
                <View style={{flex: 2, justifyContent: "center"}}>
                    <Image
                        source = {source}
                        style= {{width: undefined, height: "100%", resizeMode: "stretch"}}
                    />
                </View>
                <View style={{flex:2}} >
                    <DateRange startDate={props.PeriodStart} endDate={props.PeriodEnd} style={{
                        container: {backgroundColor: "#80B214", paddingHorizontal: 5},
                        text: {color: "white", fontSize: 16, textAlign: "center"}
                    }} />                    
                    <Text style={{fontSize: 18, paddingHorizontal: 5}} numberOfLines={2} ellipsizeMode="tail">
                        {props.Description}
                        {"\n"}                    
                    </Text>
                    <Text style={{fontSize: 12, paddingHorizontal: 5}} numberOfLines={2} ellipsizeMode="tail">
                        {props.Details &&
                            props.Details
                        }
                    </Text>
                </View>
                <View style={{flex: 1, flexDirection: "row", padding:5}}>
                    <Signup eventID={props.EventID} participantsLoading={participantsLoading} participants={props.Participants} modifyingBooking={props.modifyingBooking || false} />
                </View>
                <View style={{padding: 5, height: "auto"}}>
                {participantsLoading || !props.Participants ?
                    <Loader /> :                
                    <ParticipantStatus {...{
                        confirmed: props.Participants.filter(x => x.Canceled === "false").length,
                        declined: props.Participants.filter(x => x.Canceled === "true").length,
                    }}  />
                }
                </View>
            </View>
        </TouchableHighlight>
    );
};

const datePropTypes = PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
]).isRequired;

Ev.propTypes = {
    ImageUrl : PropTypes.any,
    Description : PropTypes.string,
    Details : PropTypes.string,
    ObjectName : PropTypes.string,
    PeriodStart : datePropTypes,
    PeriodEnd : datePropTypes,
    EventID : PropTypes.number.isRequired,
    contact : PropTypes.object.isRequired,
    onEventPressed : PropTypes.func.isRequired,
    Participants : PropTypes.array,
    participantsLoading: PropTypes.bool,
    style: PropTypes.object,
    modifyingBooking: PropTypes.bool
};

export default pure(Ev);

