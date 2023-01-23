import { Button, ButtonGroup, Typography } from "@mui/material"
// import { useSelector, useDispatch } from "react-redux"
// import { CounterState, DECREMENT_COUNTER, INCREMENT_COUNTER, decrement, increment } from "./CounterReducer"
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import { decrement, increment } from "./CounterSlice"

const ContactPage = () => {
  const dispatch = useAppDispatch()
  const { data, title } = useAppSelector(state => state.counter)
  return (
    <>
      <Typography variant="h2">
        {title}
      </Typography>
      <Typography variant="h5">
        {data}
      </Typography>
      <ButtonGroup>
        <Button onClick={() => dispatch(decrement(1))} variant='contained' color='error'>decrease</Button>
        <Button onClick={() => dispatch(increment(1))} variant='contained' color='primary'>increase</Button>
        <Button onClick={() => dispatch(increment(5))} variant='contained' color='secondary'>increment by 5</Button>
      </ButtonGroup>
    </>

  )
}

export default ContactPage