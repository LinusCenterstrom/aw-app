import { pure } from "recompose";
import React from "react";
import { View } from "react-native";

export default pure(
    ({style = {}, ...props}) => {
        if(!style.borderWidth)
            style.borderWidth = 1;
        if(!style.borderBottomColor)
            style.borderColor = "#ccc";
        if(!style.width && !style.flex)
            style.width = "100%";
        if(style.margin === undefined && style.marginTop === undefined)
            style.marginTop = 1;
        if(!style.margin && !style.marginBottom)
            style.marginBottom = 1;
        style.borderStyle = "dotted";
        return <View style={style} {...props} />;
    }
);