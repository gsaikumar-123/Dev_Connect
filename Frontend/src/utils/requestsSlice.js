import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
    name : "requests",
    initialState : null,
    reducers:{
        addRequests : (state,action)=>{
            return action.payload;
        },
        removeRequest : (state,action)=>{
            const newState = state.filter((r)=>r._id !== action.payload);
            return newState;
        }
    }
});

export const {addRequests,removeRequest} = requestsSlice.actions;
export default requestsSlice.reducer;