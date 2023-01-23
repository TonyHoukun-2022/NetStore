import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { Product } from '../../app/models/product'
import requestAgent from '../../app/api/agent'
import { RootState } from '../../app/store/configureStore'

/** createEntityAdapter => for better crud */
const productsAdapter = createEntityAdapter<Product>()

/** AsyncThunk */
//<ReturnType, parameter type>
export const fetchProductsAsync = createAsyncThunk<Product[]>('catalog/fetchProductsAsync', async (_, thunkAPI) => {
  try {
    return await requestAgent.Catalog.listProducts()
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data })
  }
})

export const getOneProductAsync = createAsyncThunk<Product, number>('catalog/getOneProductAsync', async (productId, thunkAPI) => {
  try {
    return await requestAgent.Catalog.getProductDetail(productId)
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data })
  }
})

export const catalogSlice = createSlice({
  name: 'catalog',
  /**
   * initialState = {
   *  ids: [] (auto-generate)
   *  entities: {} (auto)
   *  productloaded.
   *  status
   * }
   */
  initialState: productsAdapter.getInitialState({
    productLoaded: false,
    status: 'none',
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = 'pendingFetchProducts'
    })
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      //crud functions of entity adapter
      productsAdapter.setAll(state, action.payload)
      state.status = 'fulfilledFetchProducts'
      state.productLoaded = true
    })
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      console.log(action.payload)
      state.status = 'none'
    })
    builder.addCase(getOneProductAsync.pending, (state) => {
      state.status = 'pendingGetOneProduct'
    })
    builder.addCase(getOneProductAsync.fulfilled, (state, action) => {
      //upsert product into entities field stored in the state
      productsAdapter.upsertOne(state, action.payload)
      state.status = 'fulfilledGetOneProduct'
    })
    builder.addCase(getOneProductAsync.rejected, (state, action) => {
      console.log(action.payload)
      state.status = 'none'
    })
  },
})

/**
 * productSelectors has following methods: 
 * 
 * selectIds: returns the state.ids array.
   selectEntities: returns the state.entities lookup table.
   selectAll: maps over the state.ids array, and returns an array of entities in the same order.
   selectTotal: returns the total number of entities being stored in this state.
   selectById: given the state and an entity ID, returns the entity with that ID or undefined.
 */
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)
