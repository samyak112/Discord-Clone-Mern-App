import { configureStore } from '@reduxjs/toolkit'
import auth from './counterSlice'
import options from './options_slice'

export default configureStore({
  reducer: {
    isauthorized: auth,
    selected_option:options,
  },
})