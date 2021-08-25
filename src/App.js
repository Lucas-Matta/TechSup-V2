import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import AuthProvider from './contexts/user';

function App() {
  return(
    <AuthProvider>
        <BrowserRouter>
              <ToastContainer autoClose={3000} />     
              <Routes />
        </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
