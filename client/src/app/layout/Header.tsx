import { AppBar, Toolbar, Typography, Switch, ListItem, List, IconButton, Badge, Box } from "@mui/material"
import { ShoppingCart } from '@mui/icons-material'
import { Link, NavLink } from "react-router-dom"
import { useAppSelector } from "../store/configureStore"
// import { useStoreContext } from "../context/StoreContext"

interface Props {
  darkMode: boolean,
  handleTheme: () => void
}

const midLinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' },
]

const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' },
]

const navStyles = {
  textDecoration: 'none',
  color: 'inherit',
  typography: 'h6',
  '&:hover': {
    color: 'grey.500'
  },
  '&.active': {
    color: 'text.secondary'
  }
}

const Header = ({ darkMode, handleTheme }: Props) => {
  //use context
  // const { basket } = useStoreContext()

  //use redux
  const { basket } = useAppSelector(state => state.basket)

  const itemCount = basket?.items.reduce(
    (sum, item) => sum + item.quantity, 0
  )

  return (
    //margin bottom is 4*8 = 32px
    <AppBar position='static' sx={{ mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* navbar left  */}
        <Box display='flex' alignItems='center'>
          <Typography
            variant='h6'
            component={NavLink}
            to='/'
            sx={navStyles}
          >
            NetStore
          </Typography>
          <Switch checked={darkMode} onChange={handleTheme} />
        </Box>
        {/* navbar mid  */}
        <List sx={{ display: 'flex' }}>
          {midLinks.map(({ title, path }) => (
            //customise as NavLink, which has active class to styling
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={navStyles}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        {/* navbar right  */}
        <Box display='flex' alignItems='center'>
          <IconButton component={Link} to='/basket' size='large' sx={{ color: 'inherit' }}>
            <Badge badgeContent={itemCount} color='secondary'>
              <ShoppingCart />
            </Badge>
          </IconButton>
          <List sx={{ display: 'flex' }}>
            {rightLinks.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={path}
                sx={navStyles}
              >
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>

      </Toolbar>
    </AppBar >
  )
}

export default Header