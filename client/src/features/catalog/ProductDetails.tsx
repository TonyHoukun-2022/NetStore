import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Divider, Grid, TableBody, TableCell, TableContainer, TableRow, Typography, Table, TextField } from "@mui/material"
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
// import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/BasketSlice";
import { getOneProductAsync, productSelectors } from "./CatalogSlice";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  //use context
  // const { basket, setBasket, removeItem } = useStoreContext()

  //use redux
  const { basket, status } = useAppSelector(state => state.basket)
  const { status: productStatus } = useAppSelector(state => state.catalog)

  const dispatch = useAppDispatch()

  const product = useAppSelector(state => productSelectors.selectById(state, id!))
  const [qty, setQty] = useState(0)

  const item = basket?.items.find(item => item.productId === product?.id)

  useEffect(() => {
    if (item) setQty(item.quantity)
    if (!product) dispatch(getOneProductAsync(parseInt(id!)))
  }, [id, item, dispatch, product])

  const handleInputChange = (event: any) => {
    if (event.target.value >= 0) {
      let qtyInNum = parseInt(event.target.value)
      setQty(qtyInNum)
    }
  }

  const handleUpdateCart = () => {
    //if not item found or request qty > the current quantity in the basketItem
    if (!item || qty > item.quantity) {
      const updatedQty = item ? qty - item.quantity : qty
      dispatch(addBasketItemAsync({ productId: product?.id!, quantity: updatedQty }))
    } else {
      //when item && qty < item.quantity
      const updatedQty = item.quantity - qty
      dispatch(removeBasketItemAsync({ productId: product?.id!, quantity: updatedQty }))
    }
  }

  if (productStatus === 'pendingGetOneProduct') return <LoadingComponent message="loading product" />

  if (!product) return <NotFound />

  return (
    <Grid container spacing={6}>
      {/* 1 item a line when screen < sx  */}
      {/* 2 items a line when > sx  */}
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: '100%', height: 'auto' }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">
          {product.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color='secondary'>
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity In Stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant='outlined'
              type='number'
              label='Quantity in Cart'
              fullWidth
              value={qty}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              loading={status.includes(`pending`)}
              disabled={item?.quantity === qty || (!item && qty === 0)}
              onClick={handleUpdateCart}
              sx={{ height: '55px', color: 'wheat' }}
              color='primary'
              size='large'
              variant="contained"
              fullWidth
            >
              {item ? 'Update quantity' : 'Add to cart'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}


export default ProductDetails