import { createSlice } from "@reduxjs/toolkit";

// Stores an array of accepted connection user objects (or null before load)
const connectionsSlice = createSlice({
    name : "connections",
    initialState : null,
    reducers : {
        addConnections : (state,action)=>{
            return action.payload; // replace with fetched list
        },
        clearConnections : ()=>{
            return null;
        },
        removeConnectionById : (state,action)=>{
            if(!state) return state;
            return state.filter(u => u._id !== action.payload);
        }
    }
});

export const {addConnections,clearConnections,removeConnectionById} = connectionsSlice.actions;
export default connectionsSlice.reducer;