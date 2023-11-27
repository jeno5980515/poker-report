import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './reducers/filter/filterSlice'

export default configureStore({
  reducer: {
		filter: filterReducer
	},
})