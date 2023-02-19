import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { User } from '../../app/models/user'
import { FieldValues } from 'react-hook-form'
import requestAgent from '../../app/api/agent'
import { history } from '../..'
import { toast } from 'react-toastify'
import { setBasket } from '../basket/BasketSlice'

interface AccountState {
  user: User | null
}

const initialState: AccountState = {
  user: null,
}

//async thunks
export const signIn = createAsyncThunk<User, FieldValues>('account/signIn', async (data, thunkAPI) => {
  try {
    const userDto = await requestAgent.Account.login(data)

    //{ basket, user:{email, token}} = userDto
    const { basket, ...user } = userDto

    if (basket) thunkAPI.dispatch(setBasket(basket))
    //data in localstorage will not be wiped out after refresh page, as opposed to data in session storage

    localStorage.setItem('user', JSON.stringify(user))

    return user
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})

export const getCurrentUser = createAsyncThunk<User>(
  'account/getCurrentUser',
  async (_, thunkAPI) => {
    //set user with token in redux state
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
    try {
      //request attached authorization token defined in axios.request interceptor
      const userDto = await requestAgent.Account.getCurrentUser()

      //{ basket, user:{email, token}} = userDto
      const { basket, ...user } = userDto

      if (basket) thunkAPI.dispatch(setBasket(basket))

      //set the updated token
      localStorage.setItem('user', JSON.stringify(user))

      return user
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  },
  {
    condition: () => {
      //if no user stored in local storage, stop making getCurrentUser action
      //only when localstorage has user item, this action can be executed
      if (!localStorage.getItem('user')) return false
    },
  }
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null
      localStorage.removeItem('user')
      history.push('/')
    },
    setUser: (state, action) => {
      //atob => transfter base 64 code of the payload inside the jwt token
      let jwtPayload = JSON.parse(atob(action.payload.token.split('.')[1]))
      let roles = jwtPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      state.user = {
        ...action.payload,
        roles: typeof roles === 'string' ? [roles] : roles,
      }
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    //token wrong or session expired
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.user = null
      localStorage.removeItem('user')
      toast.error('Session expired - please login again')
      history.push('/')
    })
    //since the return type of two thunks are the same, so can use addMatcher
    builder.addMatcher(isAnyOf(signIn.fulfilled, getCurrentUser.fulfilled), (state, action) => {
      //atob => transfter base 64 code of the payload inside the jwt token
      let jwtPayload = JSON.parse(atob(action.payload.token.split('.')[1]))
      let roles = jwtPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      state.user = {
        ...action.payload,
        roles: typeof roles === 'string' ? [roles] : roles,
      }
    })
    builder.addMatcher(isAnyOf(signIn.rejected), (state, action) => {
      throw action.payload
    })
  },
})

export const { signOut, setUser } = accountSlice.actions
