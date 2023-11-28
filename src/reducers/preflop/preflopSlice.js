import { createSlice } from '@reduxjs/toolkit'

const initState = 'F-F-F-R2.5-F-C'

export const preflopSlice = createSlice({
  name: 'preflop',
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

export const { reset, set } = preflopSlice.actions

export default preflopSlice.reducer