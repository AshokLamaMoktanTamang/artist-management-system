import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { ToastContainer } from 'react-toastify';

import './styles.scss'
import './index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      hideProgressBar={false}
      newestOnTop={false}
      autoClose={5000}
      closeOnClick={true}
      limit={3}
      rtl={false}
      draggable={false}
      pauseOnHover
      theme="dark"
      className={'toastContainer'}
    />
  </StrictMode>
);
