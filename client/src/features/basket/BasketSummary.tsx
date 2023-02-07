import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
// import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/utils/util";
import { useAppSelector } from "../../app/store/configureStore";

interface Props {
  subTotal?: number
}

//passed in subTotal for orderDetail page
export default function BasketSummary({ subTotal }: Props) {
  //context
  // const { basket } = useStoreContext()

  //redux
  const { basket } = useAppSelector(state => state.basket)

  // for basket
  if (subTotal === undefined) {
    //use ?? => if subtotal is null, set it to be 0
    subTotal = basket?.items.reduce(
      (sum, item) => sum + (item.quantity * item.price), 0) ?? 0
  }

  const deliveryFee = subTotal > 10000 ? 0 : 500;

  return (
    <>
      <TableContainer component={Paper} variant={'outlined'}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{currencyFormat(subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee*</TableCell>
              <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">{currencyFormat(subTotal + deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}