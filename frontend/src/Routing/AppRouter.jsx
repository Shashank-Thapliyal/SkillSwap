import { createBrowserRouter, Outlet } from "react-router-dom"
import LandingPage from '../pages/LandingPage'
import SignUp from '../pages/Signup/SignUp';
import LogIn from '../pages/Login/LogIn';
import Layout from "../pages/Layout";
import EditProfile from "../pages/EditProfile/EditProfile";
import ViewProfile from "../pages/ViewProfile/ViewProfile";

const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    }, 
    {
        element : <Layout/>,
        children:[ {
            path : "/edit-profile",
            element : <EditProfile />
        },
        {
            path : "/profile/:userId",
            element : <ViewProfile   isOwnProfile={false}/>
        },{
            path : "/profile",
            element : <ViewProfile isOwnProfile={true} />
        }
    ]
    }
    ,{
        path: "/signup",
        element: <SignUp />
    }, {
        path: "/login",
        element: <LogIn />
    }
]);

export default AppRouter