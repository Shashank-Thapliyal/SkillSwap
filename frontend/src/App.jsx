import { RouterProvider } from 'react-router-dom'
import AppRouter from './Routing/AppRouter.jsx'
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from '../store/userSlice.js';
import api from './api/api.js';
import { connectSocket } from '../store/socketSlice.js';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const loggedInUser = await api.get("/auth/me");
        if (loggedInUser.status === 200) {
          dispatch(setUser(loggedInUser.data));
          dispatch(connectSocket(loggedInUser.data))
        }
      } catch (error) {
        console.log(error)
      }
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
