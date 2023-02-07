// import { createStore } from 'redux'
// import counterReducer from '../../features/contact/CounterReducer'
import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from '../../features/contact/CounterSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { basketSlice } from '../../features/basket/BasketSlice'
import { catalogSlice } from '../../features/catalog/CatalogSlice'
import { accountSlice } from '../../features/account/AccountSlice'

/**
 * Store creator for old-style redux
 */
// export function configureStore() {
//   return createStore(counterReducer)
// }

/**
 * Store creator for redux/toolkit
 */
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    basket: basketSlice.reducer,
    catalog: catalogSlice.reducer,
    account: accountSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

/** defind typed useDispatch and useSelector, so no need to define it when used in comp */
//define a type of useAppDispatch hook that it return a dispatch which knows thunk
export const useAppDispatch = () => useDispatch<AppDispatch>()
//define type of useAppSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
