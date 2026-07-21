import { combineReducers } from "@reduxjs/toolkit";

import JobsReducer from "./slices/job-slice";

export default combineReducers({
    JobsReducer,
});