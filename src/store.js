import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './reducers/filter/filterSlice'
import settingReducer from './reducers/setting/settingSlice'
import preflopReducer from './reducers/preflop/preflopSlice'
import flopActionReducer from './reducers/flopAction/flopActionSlice'
import turnActionReducer from './reducers/turnAction/turnActionSlice'

export default configureStore({
  reducer: {
		filter: filterReducer,
		setting: settingReducer,
		preflop: preflopReducer,
		flopAction: flopActionReducer,
		turnAction: turnActionReducer
	},
})