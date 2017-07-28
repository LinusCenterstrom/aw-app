import React from "react";
import { View, BackHandler, AppState } from "react-native";
import { applyAsArrayPrototypes } from "csharp-enumeration-functions";
import moment from "moment-with-locales-es6";
import { ThemeProvider } from "react-native-material-ui";
import { Loader } from "./loader";
import SelectUser from "./selectUser";
import EventDetails from "./eventDetails";
import { loadEvents } from "./eventActions";
import EventList from "./EventList";
import PropTypes from "prop-types";
import { connect, Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import eventReducer from "./eventReducer";
import contactReducer from "./contactReducer";
import thunk from "redux-thunk";
import { loadContacts, selectContact } from "./contactActions";
import errorReducer from "./errorReducer";
import ErrorDisplay from "./ErrorDisplay.js";
import { SetRequestTimeout } from "./api.js";
import Navbar from "./Navbar.js";
import { EVENT_DETAILS, EVENT_LIST, SELECT_CONTACT, GetBackHandler, GetNavigation } from "./navigation";
import storage from "redux-storage";
import createEngine from "redux-storage-engine-reactnativeasyncstorage";
import { setAppStateStatus, startPolling } from "./appActions";
import appReducer from "./appReducer";
import BackgroundTimer from "react-native-background-timer";

SetRequestTimeout(3000);

const reducers = storage.reducer(combineReducers(
  {
    eventState: eventReducer,
    contactState: contactReducer,
    errorState: errorReducer,
    appState: appReducer
  }
));

const engine = createEngine("AW-DATA");
const storageMiddleware = storage.createMiddleware(engine);
const store = createStore(reducers, applyMiddleware(thunk, storageMiddleware));
moment.locale("sv");

const load = storage.createLoader(engine);
load(store);

applyAsArrayPrototypes();
BackHandler.addEventListener("hardwareBackPress", GetBackHandler(store));

const uiTheme = {
  palette: {
    primaryColor: "#80B214",
    accentColor: "#FF2113"
  },
  toolbar: {
    container: {
      height: 50,
      marginBottom: 5,
      backgroundColor: "#80B214"
    }
  }
};

class App extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    AppState.addEventListener("change", this._handleAppStateChange);
    this.props.loadEvents();
    this.props.loadContacts();
    BackgroundTimer.setTimeout(() => {
      // this will be executed once after 10 seconds
      // even when app is the the background
        console.log("tic");
      }, 1000);

  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.props.appStatus.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
    } else if (this.props.appStatus.match(/active/) && (nextAppState === "inactive" || nextAppState === "background")) {
      console.log("App has gone to the background!");
     
    }
    this.props.setAppStatus(nextAppState);
  }


  _startPoll(){
console.log("_startPoll");
      let asd = BackgroundTimer.setTimeout(() => {
      // this will be executed once after 10 seconds
      // even when app is the the background
        console.log("tac");
      }, 10000);
      

  }
  
  render() {
    const { selectedContact, selectContact, contacts, contactsLoading, error, activeView, backAction, dispatch, title, onRefresh } = this.props;

    return (
        <ThemeProvider uiTheme={uiTheme}>
          
          <View style={{paddingTop: 40, padding:10, backgroundColor: "#eff0f2", flex:1, paddingBottom: 50}}>
              <Navbar title={title} onBackPress={backAction ? () => dispatch(backAction) : null} onRefreshPress={onRefresh ? () => dispatch(onRefresh) : null} />
              {error && 
                <ErrorDisplay message={error} />
              }
              <View style={error ? {opacity: 0.4} : null}>
              {
                activeView === SELECT_CONTACT ? 
                contactsLoading ? <Loader /> : <SelectUser onValueChange={selectContact} contacts={contacts} value={selectedContact ? selectedContact.CustomerContactID : -1} />
                : activeView === EVENT_DETAILS ? 
                <View>
                    <EventDetails />
                </View>
                : activeView === EVENT_LIST ? <EventList contact={selectedContact} />
                : null
              }
              </View>
          </View>
        </ThemeProvider>
    );
  }
}

const mapStateToProps = state => { 
  const nav = GetNavigation(state);
  return {
    selectedContact: state.contactState.selectedContact,
    contacts: state.contactState.contacts,
    contactsLoading: state.contactState.contactsLoading,
    error: state.errorState.error,
    activeView: nav.currentView,
    backAction: nav.action,
    title: nav.title,
    onRefresh: nav.onRefresh,
    appStatus: state.appState.status,
    isPolling: state.appState.isPolling
  };
};

const mapDispatchToProps = dispatch => (
  {
      loadEvents: () => dispatch(loadEvents()),
      loadContacts: () => dispatch(loadContacts()),
      selectContact: (contact) => dispatch(selectContact(contact)),
      dispatch: dispatch,
      setAppStatus: (state) => dispatch(setAppStateStatus(state)),
      startPolling: () => dispatch(startPolling())
  }
);
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

const Wrapper = () => <Provider store={store} ><ConnectedApp /></Provider>;

App.propTypes = {
  loadEvents: PropTypes.func.isRequired,
  loadContacts: PropTypes.func.isRequired,
  selectedContact: PropTypes.object,
  selectContact: PropTypes.func.isRequired,
  contacts: PropTypes.array,
  contactsLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  activeView: PropTypes.string,
  backAction: PropTypes.object,
  title: PropTypes.string.isRequired,
  onRefresh: PropTypes.func,
  appStatus: PropTypes.string.isRequired,
  setAppStatus: PropTypes.func.isRequired,
  isPolling: PropTypes.bool.isRequired,
  startPolling: PropTypes.func.isRequired
};

export default Wrapper;