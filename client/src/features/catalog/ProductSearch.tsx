import { useCallback, useState } from 'react'
import { TextField, debounce } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import { setProductParams } from "./CatalogSlice"

const ProductSearch = () => {
  const { productParams } = useAppSelector(state => state.catalog)
  const dispatch = useAppDispatch()

  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm)

  //after stop changing textfield for 1.5 sec, dispatch
  const search = debounce((event: any) => {
    dispatch(setProductParams({ searchTerm: event.target.value }))
  }, 1500)

  const debouncedSearch = useCallback((event: any) => search(event), [])

  return (
    <TextField
      autoFocus
      label='Search products'
      variant="outlined"
      fullWidth
      value={searchTerm || ''}
      onChange={event => {
        setSearchTerm(event.target.value)
        debouncedSearch(event)
      }}
    />
  )
}

export default ProductSearch