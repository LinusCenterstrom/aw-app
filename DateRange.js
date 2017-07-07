import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { pure } from "recompose";
import { Text, View } from "react-native";
import moment from "moment-with-locales-es6";

export default pure(({startDate, endDate, style = {
    text: {}, container: {}
}, ...props}) => {
    const mStartDate = moment(startDate);
    const mEndDate = moment(endDate);

    const now = new Date();
    let dateDiff = mStartDate.diff(now, "days");
    const iconName = "calendar-o";
    let today = false;
    let showIcon = true;

    if(dateDiff === 0) {
        today = true;
    }
    else if(dateDiff > 7 || dateDiff < -7){
        dateDiff = mStartDate.format("DD/MM");
        showIcon = false;
    }

    const iconSize = style.text.fontSize || 16;

    return (
        <View {...props} style={{
            ...style.container
        }} >
            <Text style={style.text}>
                {!today && dateDiff}{"\u200A"}
                {today ? "Idag" : showIcon && <Icon name={iconName} size={iconSize}>
                </Icon>
                }
                {"\u200A"} | {"\u200A"}
                {mStartDate.format("HH")} - {mEndDate.format("HH")}                
            </Text>
        </View>
    );
});