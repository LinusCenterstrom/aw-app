import { Toolbar } from "react-native-material-ui";
import React from "react";
import { pure } from "recompose";

export default pure(({
    title, onBackPress, onRefreshPress
}) => {
    return <Toolbar leftElement={onBackPress ? "arrow-back" : null} onLeftElementPress={onBackPress || null}
                    centerElement={title} rightElement={onRefreshPress ? "refresh" : null} onRightElementPress = {onRefreshPress || null} />;
});