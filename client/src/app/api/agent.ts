import axios, { AxiosResponse, AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { history } from '../..'

//mocking slow response (for testing purpose)
const delay = () => new Promise((resolve) => setTimeout(resolve, 500))

axios.defaults.baseURL = 'http://localhost:5000/api/'

const resBody = (res: AxiosResponse) => res.data

//set axios interceptor
axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    //slow connection for testing loading
    await delay()
    // Do something with response data
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

//request helper
const requests = {
  get: (url: string) => axios.get(url).then(resBody),
  post: (url: string, body: {}) => axios.post(url, body).then(resBody),
  put: (url: string, body: {}) => axios.put(url, body).then(resBody),
  delete: (url: string) => axios.delete(url).then(resBody),
}

//catalog requests
const Catalog = {
  //url => baseUrl + 'products'
  listProducts: () => requests.get('products'),
  getProductDetailL: (id: number) => requests.get(`products/${id}`),
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
}

export default requestAgent
