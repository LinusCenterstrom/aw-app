import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { connect } from "react-redux";
import { loadComments, expandComments, contractComments, addEventComment } from "./eventActions";
import { Loader } from "./loader";

const Expander = ({expanded, onExpand, onContract}) => {
    return (
        <Button
            onPress={expanded ? onContract : onExpand}
            title={expanded ? "Visa senaste.." : "Visa alla.."}
            />

    );
};

Expander.propTypes = {
    expanded: PropTypes.bool,
    onExpand: PropTypes.func.isRequired,
    onContract: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    padding:0, margin:0
  },
  dateText: {
    fontSize: 14,
    fontStyle:"italic",
    padding:0, margin:0
  },
  commentInputBox:{
    fontSize:14,
    borderStyle: "solid", 
    borderWidth: 1, 
    borderColor:"#000000",
    padding:10
  }
});

class EventComments extends Component{
     constructor(props){
        super(props);
         this.state = {
            text: ""
        };
    }

    componentDidMount(){
        this.props.loadComments(this.props.eventID);
    }


    render()
    {
        let { comments, commentsLoading, expanded, onExpand, onContract, onCommentSubmit, commentPendingAdd } = this.props;
        
        
        let commentView = null;

        if(!commentsLoading){
            commentView = (expanded ? comments : comments.filter((item, i) => { return i <= 3; })).map((post) => 
                    { 
                        return (
                            <View key={post.Id}>
                                    <View style={{flexDirection:"row", padding:0, paddingTop: 10,justifyContent:"space-between",margin:0}}>
                                        <Text style={styles.titleText}>
                                            {post.PersonName}{"\n"}{"\n"}
                                        </Text>
                                        <Text style={styles.dateText}>
                                            {post.Created}
                                        </Text> 
                                    </View>
                                    <View style={{flexDirection:"row", padding:0, margin:0}}>
                                        <Text>{post.Text}</Text>
                                    </View>
                            </View>
                        ); 
                    }
                );
        }
        
        let pendingAdd = commentPendingAdd ? <Loader/> : null;

        return(commentsLoading ? <Loader />  :
            <View>
                <View style={{paddingTop: 10, paddingBottom:10}}>
                    <TextInput
                        placeholder="Skriv något..."
                        onChangeText={(text) => this.setState({text})}
                        multiline={true}
                        numberOfLines={4}
                        value={this.state.text}
                        blurOnSubmit={false}
                    />
                    <Button style={{paddingBottom:10}} title={"Skicka"} color="#841584" onPress={onCommentSubmit} />
                    {pendingAdd}
                </View>

                {commentView}
                <Expander expanded={expanded} onExpand={onExpand} onContract={onContract}  />
            </View>
        );
    }
}

EventComments.propTypes = {
    loadComments: PropTypes.func.isRequired,
    eventID:PropTypes.number.isRequired,
    comments: PropTypes.array,
    commentsLoading: PropTypes.bool.isRequired,
    expanded: PropTypes.bool,
    onExpand: PropTypes.func.isRequired,
    onContract: PropTypes.func.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
    commentPendingAdd:PropTypes.bool
};

const mapStateToProps = state => ({
    commentsLoading: state.eventState.commentsLoading,
    comments: state.eventState.comments,
    expanded: state.eventState.commentsExpanded,
    commentPendingAdd: state.eventState.commentPendingAdd
});

const mapDispatchToProps = dispatch => ({
    loadComments: (eventID) => dispatch(loadComments(eventID)),
    onExpand: () => dispatch(expandComments()),
    onContract: () => dispatch(contractComments()),
    onCommentSubmit: (eventID, contact, comment) => dispatch(addEventComment(eventID, contact, comment))
});

export default connect(mapStateToProps, mapDispatchToProps)(EventComments);