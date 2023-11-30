import { createSlice } from '@reduxjs/toolkit'

const initState = 'X'

export const turnActionSlice = createSlice({
  name: 'turnAction',
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

export const { reset, set } = turnActionSlice.actions

export default turnActionSlice.reducer