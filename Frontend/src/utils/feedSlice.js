import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name : "feed",
    initialState : [],
    reducers:{
        addFeed : (state,action)=>{
            return action.payload;
        },
        removeFromFeed : (state,action)=>{
            const newState = state.filter((r)=>r._id !== action.payload);
            return newState;
        }
    }
});


export const {addFeed,removeFromFeed} = feedSlice.actions;
export default feedSlice.reducer;