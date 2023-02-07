import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Table, TableHead, TableRow, TableCell, TableBody, Box, TableContainer, Paper } from "@mui/material";
import { removeBasketItemAsync, addBasketItemAsync } from "./BasketSlice";
import { BasketItem } from "../../app/models/basket";
import { useAppDispatch } from "../../app/store/configureStore";

interface Props {
  items?: BasketItem[]
  status?: string
  isBasket?: boolean
}

export default function BasketTable({ items, status, isBasket = true }: Props) {
  const dispatch = useAppDispatch()

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            {isBasket && <TableCell align="right"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((item) => (
            <TableRow
              key={item.productId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="td" scope="row">
                <Box display='flex' alignItems='center'>
                  <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 10 }} />
                  <span>{item.name}</span>
                </Box>
              </TableCell>
              <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>

              <TableCell align="center">
                {isBasket && <LoadingButton
                  loading={status === `pendingRemoveItem${item.productId}remove`}
                  onClick={() => dispatch(
                    removeBasketItemAsync({
                      productId: item.productId,
                      quantity: 1,
                      name: 'remove'
                    }))}
                  color='error'
                >
                  <Remove />
                </LoadingButton>}

                {item.quantity}

                {isBasket && <LoadingButton
                  loading={status === `pendingAddItem${item.productId}`}
                  onClick={() => dispatch(addBasketItemAsync({ productId: item.productId }))}
                  color='success'
                >
                  <Add />
                </LoadingButton>
                }
              </TableCell>

              <TableCell align="right">
                ${(item.price / 100 * item.quantity).toFixed(2)}
              </TableCell>

              {isBasket &&
                <TableCell align="right">
                  <LoadingButton
                    loading={status === `pendingRemoveItem${item.productId}delete`}
                    onClick={() => dispatch(
                      removeBasketItemAsync({
                        productId: item.productId,
                        quantity: item.quantity,
                        name: 'delete'
                      }))}
                    color='error'
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  )
}