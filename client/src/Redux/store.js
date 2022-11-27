import { configureStore } from '@reduxjs/toolkit'
import auth from './counterSlice'
import options from './options_slice'
import page from './current_page'

export default configureStore({
  reducer: {
    isauthorized: auth,
    selected_option:options,
    current_page:page
  },
})