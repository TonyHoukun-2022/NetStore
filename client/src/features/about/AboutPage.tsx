import { useState } from 'react'
import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material"
import requestAgent from "../../app/api/agent"

const AboutPage = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const getValidationError = () => {
    requestAgent.TestErrors.getValidationError()
      .then(() => console.log('shout not see this'))
      .catch(errArr => setValidationErrors(errArr))
  }

  return (
    <Container>
      <Typography gutterBottom variant="h2">Errors for testing purpuse</Typography>
      <ButtonGroup fullWidth>
        <Button variant="contained" onClick={() => requestAgent.TestErrors.get400Error().catch(error => console.log(error.response))}>Test 400 error</Button>
        <Button variant="contained" onClick={() => requestAgent.TestErrors.get401Error().catch(error => console.log(error.response))}>Test 401 error</Button>
        <Button variant="contained" onClick={() => requestAgent.TestErrors.get404Error().catch(error => console.log(error.response))}>Test 404 error</Button>
        <Button variant="contained" onClick={() => requestAgent.TestErrors.get500Error().catch(error => console.log(error.response))}>Test 500 error</Button>
        <Button variant="contained" onClick={getValidationError}>Test validation error</Button>
      </ButtonGroup>

      {validationErrors.length > 0 &&
        <Alert severity='error'>
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map(er => (
              <ListItem key={er}>
                <ListItemText>{er}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      }
    </Container>
  )
}

export default AboutPage