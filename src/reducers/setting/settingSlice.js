import { createSlice } from '@reduxjs/toolkit'

const initState = 'NL500'

export const settingSlice = createSlice({
  name: 'setting',
  initialState: initState,
  reducers: {
    reset: (state) => {
			return initState
    },
    set: (state, action) => {
			return action.payload
    },
  },
})

export const { reset, set } = settingSlice.actions

export default settingSlice.reducer