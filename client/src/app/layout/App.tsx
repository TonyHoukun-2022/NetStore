import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
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
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../utils/util";
import requestAgent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import CheckoutPage from "../../features/checkout/CheckoutPage";

function App() {
  const { setBasket } = useStoreContext()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const buyerId = getCookie('buyerId')
    if (buyerId) {
      setLoading(true)
      requestAgent.Basket.get()
        //set basket to app context
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }
  }, [setBasket])

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
      <CssBaseline />
      <Header
        darkMode={darkMode}
        handleTheme={handleThemeChange}
      />
      <Container>
        <Routes>
          {/* similar to path='/' */}
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="catalog/:id" element={<ProductDetails />} />
          <Route path='about' element={<AboutPage />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='basket' element={<BasketPage />} />
          <Route path='checkout' element={<CheckoutPage />} />
          <Route path='server-error' element={<ServerError />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
      {/* for deleting all default padding and margin */}

    </ThemeProvider>
  );
}

export default App;
