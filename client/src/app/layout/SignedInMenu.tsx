import { useState, MouseEvent } from 'react'
import { Button, Menu, Fade, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/configureStore';
import { signOut } from '../../features/account/AccountSlice';
import { clearBasket } from '../../features/basket/BasketSlice';
import { Link } from 'react-router-dom';
import { clearOrders } from '../../features/orders/orderSlice';

const SignedInMenu = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.account)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        color='inherit'
        sx={{ typography: 'h6' }}
      >
        {user?.email}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem component={Link} to='/orders'>My orders</MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(signOut())
            dispatch(clearBasket())
            dispatch(clearOrders())
          }}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SignedInMenu