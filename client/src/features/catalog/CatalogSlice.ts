import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { Product, ProductParams } from '../../app/models/product'
import requestAgent from '../../app/api/agent'
import { RootState } from '../../app/store/configureStore'
import { MetaData } from '../../app/models/pagination'

interface CatalogState {
  productsLoaded: boolean
  filtersLoaded: boolean
  status: string
  brands: string[]
  types: string[]
  productParams: ProductParams
  metaData: MetaData | null
}

/** createEntityAdapter => for better crud */
const productsAdapter = createEntityAdapter<Product>()

function getAxiosParams(productParams: ProductParams) {
  const params = new URLSearchParams()
  params.append('pageNumber', productParams.pageNumber.toString())
  params.append('pageSize', productParams.pageSize.toString())
  params.append('orderBy', productParams.orderBy)
  if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm)
  if (productParams.brands.length > 0) params.append('brands', productParams.brands.toString())
  if (productParams.types.length > 0) params.append('types', productParams.types.toString())

  return params
}

/** AsyncThunk */
//<ReturnType, parameter type, {type of state}>
export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>('catalog/fetchProductsAsync', async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
  try {
    //return action.payload when this action creator is fulfilled
    const res = await requestAgent.Catalog.listProducts(params)
    thunkAPI.dispatch(setMetaData(res.metaData))
    return res.items
  } catch (error: any) {
    //return action.payload when this action creator is rejected
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

export const fetchFilters = createAsyncThunk('catalog/fetchFilters', async (_, thunkApi) => {
  try {
    return requestAgent.Catalog.fetchFilters()
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data })
  }
})

const initialProductParams = () => {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: 'name',
    brands: [],
    types: [],
  }
}

export const catalogSlice = createSlice({
  name: 'catalog',
  /**
   * initialState = {
   *  ids: [] (auto-generate)
   *  entities: {} (auto)
   *  && other props defined in the bracket
   * }
   */
  initialState: productsAdapter.getInitialState<CatalogState>({
    productsLoaded: false,
    filtersLoaded: false,
    status: 'none',
    brands: [],
    types: [],
    productParams: initialProductParams(),
    metaData: null,
  }),
  reducers: {
    setProductParams: (state, action) => {
      state.productsLoaded = false
      //whenever click on any of filters or ordering opt, reset page to 1
      state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 }
    },
    setPageNumber: (state, action) => {
      state.productsLoaded = false
      state.productParams = { ...state.productParams, ...action.payload }
    },
    resetProductParams: (state) => {
      state.productParams = initialProductParams()
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload
    },
    setProduct: (state, action) => {
      productsAdapter.upsertOne(state, action.payload)
      state.productsLoaded = false
    },
    removeProduct: (state, action) => {
      //action.payload is id
      productsAdapter.removeOne(state, action.payload)
      state.productsLoaded = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = 'pendingFetchProducts'
    })
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      //crud functions of entity adapter
      productsAdapter.setAll(state, action.payload)
      state.status = 'fulfilledFetchProducts'
      state.productsLoaded = true
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
    builder.addCase(fetchFilters.pending, (state) => {
      state.status = 'pendingFetchFilters'
    })
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.brands = action.payload.brands
      state.types = action.payload.types
      state.filtersLoaded = true
      state.status = 'fulfilledFetchFilters'
    })
    builder.addCase(fetchFilters.rejected, (state, action) => {
      state.status = 'none'
      console.log(action.payload)
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

export const { setProductParams, resetProductParams, setMetaData, setPageNumber, setProduct, removeProduct } = catalogSlice.actions
