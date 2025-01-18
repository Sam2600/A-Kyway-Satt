import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   AuthSession: null,
}

export const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      storeAuthSession: (state, action) => {
         state.AuthSession = action.payload
      },
   },
})

// Action creators are generated for each case reducer function
export const { storeAuthSession } = authSlice.actions

export default authSlice.reducer