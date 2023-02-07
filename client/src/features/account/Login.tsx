import { useMemo } from 'react';
import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import requestAgent from '../../app/api/agent';
import { useForm, FieldValues } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import { signIn } from './AccountSlice';


export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const from = useMemo(() => {
    const state = location.state as { from: Location }
    if (state && state.from && state.from.pathname) {
      return state.from?.pathname
    }
    return null
  }, [location])

  /**
   * Apply react-hook-form to manipulate formdata
   */
  const { register, handleSubmit, formState: { isSubmitting, errors, isValid } } = useForm({
    mode: 'all'
  })

  const loginUser = async (data: FieldValues) => {
    // try {
    //   await requestAgent.Account.login(data)
    // } catch (error) {
    //   console.log(error)
    // }
    try {
      await dispatch(signIn(data))
      navigate(from || "/catalog")
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Use local state to manipulate form data
   */
  //set default state with initial values
  // const [values, setValues] = useState({
  //   username: '',
  //   password: ''
  // })

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   requestAgent.Account.login(values)
  // };

  // const handleInputChange = (event: any) => {
  //   const { name, value } = event.target
  //   //update states when each of two fields is changed
  //   setValues({
  //     ...values,
  //     //override the field which has the target.name with the new value
  //     [name]: value
  //   })
  // }

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
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit(loginUser)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          //to indentify field
          // name="username"
          autoFocus
          // onChange={handleInputChange}
          // value={values.username}
          {...register(
            'username',
            {
              required: "username is required"
            }
          )}
          //if errors.username is existed => true
          // !! cast username into a boolean
          //error => inputField turns into red color
          error={!!errors.username}
          //error text shows under field
          helperText={
            errors?.username?.message?.toString()
          }
        />
        <TextField
          margin="normal"
          fullWidth
          // name="password"
          label="Password"
          type="password"
          // onChange={handleInputChange}
          // value={values.password}
          {...register(
            'password',
            {
              required: "password is required"
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
          Sign In
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to='/register'>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}