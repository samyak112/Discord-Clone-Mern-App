import { createSlice } from '@reduxjs/toolkit'

export const options = createSlice({
    name: 'selected_option',
    initialState: {
      value: 0,
      option_name:'ONLINE',
      status:false,
      text:"No one's around to play with Wumpus.",
    },
    reducers: {
      change_option: (state,action) => {
        state.value = action.payload
      },
      change_option_name: (state,action) => {
        state.option_name = action.payload
      },
      option_status: (state,action) => {
        state.status = action.payload
      },
      option_text: (state,action) => {
        state.text = action.payload
      },
    },
  })

  // Action creators are generated for each case reducer function
export const { change_option,change_option_name,option_status,option_text} = options.actions


export default options.reducer