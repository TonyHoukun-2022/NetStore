import React from 'react';
import ReactDOM from 'react-dom/client';
//global style
import '../src/app/layout/style.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { StoreProvider } from './app/context/StoreContext';
// import { configureStore } from './app/store/configureStore';
import { store } from './app/store/configureStore';
import { Provider } from 'react-redux';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// const store = configureStore()

//allow access history obj outside of react comp
export const history = createBrowserHistory()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* @ts-expect-error */}
    <HistoryRouter history={history}>
      {/* Context*/}
      <StoreProvider>
        {/* Redux provider */}
        <Provider store={store}>
          <App />
        </Provider>
      </StoreProvider>
    </HistoryRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
