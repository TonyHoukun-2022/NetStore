import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";
import { Routes, Route } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import { ToastContainer } from "react-toastify";
// import Header from "./Header";
import 'react-toastify/dist/ReactToastify.css'
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
// import { useStoreContext } from "../context/StoreContext";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/BasketSlice";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import { getCurrentUser } from "../../features/account/AccountSlice";
import { ProtectedRoutes } from "./ProtectedRoute";
import OrdersPage from "../../features/orders/OrdersPage";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Inventory from "../../features/admin/Inventory";

function App() {
  /** use context */
  // const { setBasket } = useStoreContext()

  /** use redux/toolkit */
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  //memorize the initApp for every render, so the initApp in useEffect dependency not changes
  const initApp = useCallback(async () => {
    try {
      //run only when buyerid in Cookie
      await dispatch(fetchBasketAsync())
      //run only when user token existed 
      await dispatch(getCurrentUser())
    } catch (error) {
      console.log(error)
    }
  }, [dispatch])

  useEffect(() => {
    setLoading(true)
    initApp().then(() => setLoading(false))
  }, [initApp])

  // useEffect(() => {
  //   const buyerId = getCookie('buyerId')
  //   if (buyerId) {
  //     setLoading(true)
  //     requestAgent.Basket.get()
  //       /** set basket to app context */
  //       // .then(basket => setBasket(basket))

  //       /** set basket with redux */
  //       //dispatch(action(payload))
  //       .then(basket => dispatch(setBasket(basket)))
  //       .catch(error => console.log(error))
  //       .finally(() => setLoading(false))
  //   }
  // }, [dispatch])

  //get current user when refresh page && localstorage has 'user' token


  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light'
  const theme = createTheme({
    palette: {
      mode: paletteType,
      //customise background default color
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <LoadingComponent message='initial loading...' />

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar />
      {/* for deleting all default padding and margin */}
      <CssBaseline />
      <Header
        darkMode={darkMode}
        handleTheme={handleThemeChange}
      />
      <Routes>
        {/* similar to path='/' */}
        <Route index element={<HomePage />} />
        <Route
          path="*"
          element={
            <Container sx={{ mt: 4 }}>
              <Routes>
                <Route path="catalog" element={<Catalog />} />
                <Route path="catalog/:id" element={<ProductDetails />} />
                <Route path='about' element={<AboutPage />} />
                <Route path='contact' element={<ContactPage />} />
                <Route path='basket' element={<BasketPage />} />
                {/* authenticated routes */}
                <Route element={<ProtectedRoutes />}>
                  <Route path='checkout' element={<CheckoutWrapper />} />
                  <Route path='orders' element={<OrdersPage />} />
                </Route>
                {/* admin route  */}
                <Route element={<ProtectedRoutes roles={['Admin']} />}>
                  <Route path='inventory' element={<Inventory />} />
                </Route>
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='server-error' element={<ServerError />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Container>
          }
        />
      </Routes>

    </ThemeProvider>
  );
}

export default App;
