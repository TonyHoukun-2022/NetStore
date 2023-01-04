import { AppBar, Toolbar, Typography, Switch } from "@mui/material"

interface Props {
  darkMode: boolean,
  handleTheme: () => void
}

const Header = ({ darkMode, handleTheme }: Props) => {
  return (
    //margin bottom is 4*8 = 32px
    <AppBar position='static' sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant='h6'>
          NetStore
        </Typography>
        <Switch checked={darkMode} onChange={handleTheme} />
      </Toolbar>
    </AppBar>
  )
}

export default Header