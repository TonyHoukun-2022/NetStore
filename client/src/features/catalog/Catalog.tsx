import ProductList from "./ProductList";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setPageNumber, setProductParams } from "./CatalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";

const sortOpts = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceDescend', label: 'Price - Hight to low' },
  { value: 'price', label: 'Price - Low to high' }
]

export default function Catalog() {
  const { products, brands, types, filtersLoaded, metaData } = useProducts()
  const { productParams } = useAppSelector(state => state.catalog)
  const dispatch = useAppDispatch()

  if (!filtersLoaded) return <LoadingComponent message="loading products..." />

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            selectedVal={productParams.orderBy}
            options={sortOpts}
            onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={brands}
            checkedItems={productParams.brands}
            onChange={(items: string[]) => dispatch(setProductParams({ brands: items }))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={types}
            checkedItems={productParams.types}
            onChange={(items: string[]) => dispatch(setProductParams({ types: items }))}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      {/* second row */}
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        {metaData &&
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))}
          />}
      </Grid>
    </Grid>
  )
}