import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'isauthorized',
  initialState: {
    value: false,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = true
    },
    decrement: (state) => {
      state.value = false
    },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement} = counterSlice.actions

export default counterSlice.reducer