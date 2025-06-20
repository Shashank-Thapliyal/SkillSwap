import { RouterProvider } from 'react-router-dom'
import AppRouter from './Routing/AppRouter.jsx'
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Provider, useDispatch } from "react-redux"
import { Appstore } from '../store/store.js';
import { useEffect } from 'react';
import { setUser } from '../store/userSlice.js';
import api from './api/api.js';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    ( async () => {
        const loggedInUser = await api.get("/auth/me");
        if (loggedInUser.status === 200)
          dispatch(setUser(loggedInUser.data));
      }
    )();
  }, [])

  return ( 

    <>
      <RouterProvider router={AppRouter} />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>

  )
}

export default App
