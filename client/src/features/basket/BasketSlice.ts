import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Basket } from '../../app/models/basket'
import requestAgent from '../../app/api/agent'

export interface BasketState {
  basket: Basket | null
  status: string
}

const initialState: BasketState = {
  basket: null,
  status: 'none',
}

//making async request in redux (redux cannot allow using side effect to do async )
// <ReturnType, parameterType>
export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number; quantity?: number }>(
  'basket/addBasketItemAsync',
  //payload creator function, retirm basket when fulfill
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await requestAgent.Basket.addItem(productId, quantity)
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  }
)

export const removeBasketItemAsync = createAsyncThunk<void, { productId: number; quantity: number; name?: string }>(
  'basket/removeBasketItemAsync',
  //payload creator, return void when fulfill
  async ({ productId, quantity }, thunkAPI) => {
    try {
      await requestAgent.Basket.removeItem(productId, quantity)
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  }
)

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  //reducer functions for mutating states
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload
    },
    removeItem: (state, action) => {
      const { productId, quantity } = action.payload

      const itemIndex = state.basket?.items.findIndex((i) => i.productId === productId)

      if (itemIndex === -1 || itemIndex === undefined) return

      state.basket!.items[itemIndex].quantity -= quantity

      if (state.basket!.items[itemIndex].quantity === 0) {
        state.basket?.items.splice(itemIndex, 1)
      }
    },
  },
  //put asyncThunk (api request) functions in extraReducer
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      // console.log(action)
      state.status = `pendingAddItem${action.meta.arg.productId}`
    })
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.status = 'fulfilledAddItem'
      //action payload from the return of addBaketItemAsync thunk function
      state.basket = action.payload
    })
    builder.addCase(addBasketItemAsync.rejected, (state, action) => {
      console.log(action.payload)
      state.status = 'none'
    })
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = `pendingRemoveItem${action.meta.arg.productId}${action.meta.arg.name}`
    })
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg

      const itemIndex = state.basket?.items.findIndex((i) => i.productId === productId)

      if (itemIndex === -1 || itemIndex === undefined) return

      state.basket!.items[itemIndex].quantity -= quantity

      if (state.basket!.items[itemIndex].quantity === 0) {
        state.basket?.items.splice(itemIndex, 1)
      }
      state.status = 'fulfilledRemoveItem'
    })
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      console.log(action.payload)
      state.status = 'none'
    })
  },
})

export const { setBasket, removeItem } = basketSlice.actions
