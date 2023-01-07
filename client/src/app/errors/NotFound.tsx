import { Button, Container, Divider, Paper, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Container component={Paper} sx={{ height: '400px' }}>
      <Typography gutterBottom variant='h3' sx={{ textAlign: 'center' }}>Not found your page</Typography>
      <Divider />
      <Button fullWidth component={Link} to='/catalog'>Go back to store</Button>
    </Container>
  )
}

export default NotFound