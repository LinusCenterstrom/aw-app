import React from "react";
import { ActivityIndicator } from "react-native";
import { pure, branch } from "recompose";

const Loader = pure((props) => <ActivityIndicator {...props} />);

const WithLoader = (test = x => x.loading, right) => {
    return branch(test, Loader, right);
};

export {
    Loader, WithLoader
};

