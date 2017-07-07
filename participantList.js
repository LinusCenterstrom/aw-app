import React from "react";
import PropTypes from "prop-types";
import { ScrollView, View, Text } from "react-native";
import { Loader } from "./loader";
import { sortBy } from "lodash";

const ParticipantList = ({Participants, isLoading, ...props}) => {
    const canceledStyle = {
        textDecorationLine: "line-through",
        color: "red"
    };
    return  isLoading ? <Loader /> :
            <ScrollView {...props} >
                {
                    sortBy(Participants, x => x.Canceled === "true").map(part => {
                        return (
                            <View key={part.EventParticipantID}>
                                <Text style={part.Canceled === "true" ? canceledStyle : null}>
                                    {part.PersonName}
                                </Text>
                            </View>
                        );
                    })
                }
            </ScrollView>;
};

ParticipantList.propTypes = {
    Participants : PropTypes.array,
    isLoading: PropTypes.bool.isRequired
};

export default (ParticipantList);