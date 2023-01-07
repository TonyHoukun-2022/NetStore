import { Button, Container, Divider, Paper, Typography } from '@mui/material'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ServerError = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  return (
    <Container component={Paper}>
      {state.error ? (
        <>
          <Typography variant='h5' gutterBottom>Server error</Typography>
          <Divider />
          <Typography>{state.error.state.title || 'internal server error'}</Typography>
        </>
      ) : (
        <Typography variant='h5' gutterBottom>Server error</Typography>
      )}
      <Button onClick={() => navigate('/catalog')}>Go back to store</Button>
    </Container>
  )
}

export default ServerError