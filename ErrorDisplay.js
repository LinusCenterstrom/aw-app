import React from "react";
import { Button } from "react-native-material-ui";
import { Text, Modal, View } from "react-native";
import { connect } from "react-redux";
import { hideErrorMessage } from "./errorActions";

const mapDispatchToProps = dispatch => ({
    onClose : () => { dispatch(hideErrorMessage()); }
});

export default connect(null, mapDispatchToProps)(({message, onClose}) => {
    return <Modal onRequestClose={onClose} transparent={true} animationType={"slide"} style={{alignSelf:"center"}} >
        <View style={{padding:20, backgroundColor:"#ccc"}}>
            <Text>
                Ett fel uppstod
            </Text>
            <Text style={{marginTop: 20}}>
                {message}
            </Text>
            <Button accent raised text="Stäng" onPress={onClose} />
        </View>
    </Modal>;
});
