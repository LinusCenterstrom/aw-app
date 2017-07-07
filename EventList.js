import React from "react";
import { connect } from "react-redux";
import { showEventDetails } from "./eventActions";
import { Loader } from "./loader";
import { FlatList } from "react-native";
import Ev from "./Event";
import PropTypes from "prop-types";

const listItemStyle = {
    width: "48%",
    height: 300,
    marginBottom: 10
};

const listItemStyleAlt = {
    width: "48%",
    height: 300,
    marginLeft: "4%",
    marginBottom: 10
};

const EventList = ({events, contact, onEventPressed, loading}) => {
    return loading ? <Loader /> : (
        <FlatList
            horizontal={false}
            numColumns={2}
            data={events}
            keyExtractor={ev => ev.EventID}
            renderItem={({item, index}) => <Ev {...item} style={index % 2 === 0 ? listItemStyle : listItemStyleAlt} contact={contact} onEventPressed={onEventPressed} />} 
        >
        </FlatList>
    );
};

EventList.propTypes = {
    events: PropTypes.array,
    contact: PropTypes.object.isRequired,
    onEventPressed: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    events: state.eventState.events,
    loading: state.eventState.eventsLoading,
    contact: state.contactState.selectedContact
});

const mapDispatchToProps = (dispatch) => ({
    onEventPressed: ev => dispatch(showEventDetails(ev))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventList);