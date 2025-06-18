import { createBrowserRouter, Outlet } from "react-router-dom"
import LandingPage from '../pages/LandingPage'
import SignUp from '../pages/SignUp';
import LogIn from '../pages/Login';

const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    }, {
        path: "/signup",
        element: <SignUp />
    }, {
        path: "/login",
        element: <LogIn />
    }
]);

export default AppRouter