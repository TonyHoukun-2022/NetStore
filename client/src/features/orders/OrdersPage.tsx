import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material"
import { useEffect, useState } from "react"
import requestAgent from "../../app/api/agent"
import { Order } from "../../app/models/order"
import LoadingComponent from "../../app/layout/LoadingComponent"
import { currencyFormat } from "../../app/utils/util"
import OrderDetailed from "./OrderDetail"


const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(0)

  useEffect(() => {
    setLoading(true)
    requestAgent.Orders.list()
      .then(orders => setOrders(orders))
      .catch(error => console.log(error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingComponent message="loading orders ..." />

  //if an order has selected
  if (selectedOrderNumber > 0) return (
    <OrderDetailed
      order={orders?.find(o => o.id === selectedOrderNumber)!}
      setSelectedOrder={setSelectedOrderNumber}
    />
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Order Status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order: Order) => (
            <TableRow
              key={order.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="right">{currencyFormat(order.total)}</TableCell>
              <TableCell align="right">{order.orderDate.split('T')[0]}</TableCell>
              <TableCell align="right">{order.orderStatus}</TableCell>
              <TableCell align="right">
                <Button onClick={() => setSelectedOrderNumber(order.id)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default OrdersPage