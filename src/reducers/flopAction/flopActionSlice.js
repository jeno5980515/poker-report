import { createSlice } from '@reduxjs/toolkit'

const initState = 'X-R1.8-C'

export const flopActionSlice = createSlice({
  name: 'flopAction',
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

export const { reset, set } = flopActionSlice.actions

export default flopActionSlice.reducer