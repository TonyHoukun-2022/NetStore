import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";
import { Routes, Route } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
// import Header from "./Header";

function App() {
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

  return (
    <ThemeProvider theme={theme}>
      {/* for deleting all default padding and margin */}
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
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
