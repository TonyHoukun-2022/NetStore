import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import agent from '../../app/api/agent'
import { Order } from '../../app/models/order'
import { RootState } from '../../app/store/configureStore'

interface OrderState {
  orders: Order[] | null
  status: string
  ordersLoaded: boolean
}

//initialState of orders
// const initialState: OrderState = {
//   order: null,
//   status: 'idle',
// }

//creating an entity adapter for fetching the orders
export const ordersAdapter = createEntityAdapter<Order>()

//fetching the list of Orders from API Server
export const fetchOrdersAsync = createAsyncThunk<Order[], void>('orders/fetchOrdersAsync', async (_, thunkAPI) => {
  try {
    return await agent.Orders.list()
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})

//fetching the single Order {id} from API Server
export const getOrderByIdAsync = createAsyncThunk<Order, number>('orders/getOrderByIdAsync', async (orderId: number, thunkAPI) => {
  try {
    return await agent.Orders.getOrderById(orderId)
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})

export const orderSlice = createSlice({
  name: 'orders',
  initialState: ordersAdapter.getInitialState<OrderState>({
    orders: null,
    status: 'none',
    ordersLoaded: false,
  }),
  reducers: {
    clearOrders: (state) => {
      state.orders = null
      state.status = 'none'
      state.ordersLoaded = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrdersAsync.pending, (state) => {
      state.status = 'pendingFetchOrders'
    })
    builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
      ordersAdapter.setAll(state, action.payload)
      state.status = 'fulfilledFetchOrders'
      state.ordersLoaded = true
      state.orders = action.payload
    })
    builder.addCase(fetchOrdersAsync.rejected, (state, action) => {
      state.status = 'none'
      console.log(action.payload)
    })

    //cases for fetching order by id
    builder.addCase(getOrderByIdAsync.pending, (state, action) => {
      state.status = 'pendingGetOrderById'
    })
    builder.addCase(getOrderByIdAsync.fulfilled, (state, action) => {
      ordersAdapter.upsertOne(state, action.payload)
      state.status = 'fulfilledGetOneOrder'
    })
    builder.addCase(getOrderByIdAsync.rejected, (state, action) => {
      state.status = 'none'
      console.log(action.payload)
    })
  },
})

export const orderSelector = ordersAdapter.getSelectors((state: RootState) => state.orders)
export const { clearOrders } = orderSlice.actions
