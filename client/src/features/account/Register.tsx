import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
// import requestAgent from '../../app/api/agent';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import requestAgent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { history } from '../..';


export default function Register() {
  /**
   * Apply react-hook-form to manipulate formdata
   */
  const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm({
    mode: 'all'
  })

  const handleApiErrors = (errors: any) => {
    console.log(errors)
    if (errors) {
      errors.forEach((er: string) => {
        if (er.includes('Password')) {
          //setError(registeredfieldName, {error text})
          setError('password', { message: er })
        } else if (er.includes('Email')) {
          setError('email', { message: er })
        } else if (er.includes('Username')) {
          setError('username', { message: er })
        }
      })
    }
  }


  return (

    <Container
      component={Paper}
      maxWidth="sm"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) =>
          requestAgent.Account.register(data)
            .then(() => {
              toast.success('Registration successful - now you can login')
              history.push('/login')
            })
            .catch(error => handleApiErrors(error))
        )}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          autoFocus
          {...register(
            'username',
            {
              required: "username is required"
            }
          )}

          error={!!errors.username}
          //error text shows under field
          helperText={
            errors?.username?.message?.toString()
          }
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          {...register(
            'email',
            {
              required: "email is required",
              pattern: {
                //regex coming from regexlib
                value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                message: 'Not a valid email address'
              }
            }
          )}
          error={!!errors.email}
          //error text shows under field
          helperText={
            errors?.email?.message?.toString()
          }
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...register(
            'password',
            {
              required: "password is required",
              pattern: {
                //regex coming from regexlib
                value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                message: 'Password does not meet complexity requirement'
              }
            }
          )}
          error={!!errors.password}
          helperText={
            errors?.password?.message?.toString()
          }
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to='/login'>
              {"Already have an account? Sign In"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}