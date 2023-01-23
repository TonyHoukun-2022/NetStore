/** Example 
 * for applying 
 * redux/toolkit */

import { createSlice } from "@reduxjs/toolkit"

export interface CounterState {
  data: number
  title: string
}

const initialState: CounterState = {
  data: 42,
  title: 'redux counter with redux/toolkit',
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  //redux toolkit can mutate state 
  //action creators
  reducers: {
    increment: (state, action) => {
      state.data += action.payload
    },
    decrement: (state, action) => {
      state.data -= action.payload
    }
  }
})

//export action creators out
export const { increment, decrement } = counterSlice.actions