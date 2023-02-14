import axios, { AxiosHeaders, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { history } from '../..'
import { PaginatedResponse } from '../models/pagination'
import { store } from '../store/configureStore'

//mocking slow response (for testing purpose)
const delay = () => new Promise((resolve) => setTimeout(resolve, 500))

//develop mode => pick up env variable from .env.development
//production mode => variable from .env.production
axios.defaults.baseURL = process.env.REACT_APP_API_URL
//allow user set cookie
axios.defaults.withCredentials = true

const resBody = (res: AxiosResponse) => res.data

//send token along with request
axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token
  if (token && config.headers) (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
  return config
})

//set axios interceptor for response
axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') await delay()
    //shoud use sml case for reading header name
    const pagination = response.headers['pagination']
    if (pagination) {
      response.data = new PaginatedResponse(response.data, JSON.parse(pagination))
      // console.log(response)
      return response
    }
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { data, status } = error.response!
    switch (status) {
      //400 => validation or bad-request
      case 400:
        //validation error
        if (data.errors) {
          const errorArr: string[] = []
          for (let key in data.errors) {
            // console.log(data.errors[key])
            errorArr.push(data.errors[key])
          }
          // flatten an array, to reduce the nesting of an array.
          throw errorArr.flat()
        }
        //for 400 bad-request
        toast.error(data.title)
        break
      case 401:
        toast.error(data.title)
        break
      case 500:
        //redirect to ServerError comp (use history.push outside react comp)
        history.push({
          pathname: '/server-error',
        })
        break
      default:
        break
    }
    return Promise.reject(error)
  }
)

/**
 * 
   const res = await axios.get('https://httpbin.org/get', { params: { answer: 42 } });
   =>
   axios.get('https://httpbin.org/get?answer=42')`
 */
//request helper
const requests = {
  get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(resBody),
  post: (url: string, body: {}) => axios.post(url, body).then(resBody),
  put: (url: string, body: {}) => axios.put(url, body).then(resBody),
  delete: (url: string) => axios.delete(url).then(resBody),
}

//catalog requests
const Catalog = {
  //url => baseUrl + 'products'
  listProducts: (params: URLSearchParams) => requests.get('products', params),
  getProductDetail: (id: number) => requests.get(`products/${id}`),
  fetchFilters: () => requests.get('products/filters'),
}

//basket requests
const Basket = {
  get: () => requests.get('basket'),
  addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

//account requests for login and register
const Account = {
  login: (values: any) => requests.post('account/login', values),
  register: (values: any) => requests.post('account/register', values),
  getCurrentUser: () => requests.get('account/currentuser'),
  getAddress: () => requests.get('account/savedAddress'),
}

const Orders = {
  list: () => requests.get('orders'),
  getOrderById: (id: number) => requests.get(`orders/${id}`),
  create: (values: any) => requests.post('orders', values),
}

const Payment = {
  createPaymentIntent: () => requests.post('payment', {}),
}

//TestErrors
const TestErrors = {
  get400Error: () => requests.get('buggy/bad-request'),
  get401Error: () => requests.get('buggy/unauthorize'),
  get404Error: () => requests.get('buggy/not-found'),
  get500Error: () => requests.get('buggy/server-error'),
  getValidationError: () => requests.get('buggy/validation-error'),
}

const requestAgent = {
  Catalog,
  TestErrors,
  Basket,
  Account,
  Orders,
  Payment,
}

export default requestAgent
