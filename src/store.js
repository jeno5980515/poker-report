import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './reducers/filter/filterSlice'
import settingReducer from './reducers/setting/settingSlice'
import preflopReducer from './reducers/preflop/preflopSlice'

export default configureStore({
  reducer: {
		filter: filterReducer,
		setting: settingReducer,
		preflop: preflopReducer
	},
})