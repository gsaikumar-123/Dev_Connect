import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionsReducer from "./connectionsSlice";
import requestsReducer from "./requestsSlice";
import chatReducer from "./chatSlice";

const appStore = configureStore({
    reducer:{
        user : userReducer,
        feed : feedReducer,
        connections : connectionsReducer,
        requests : requestsReducer,
        chat: chatReducer
    }
});

if (typeof window !== 'undefined') {
    window.__APP_STORE__ = appStore;
}

export default appStore;