import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"
import LandingPage from '../pages/LandingPage'
import SignUp from '../pages/Signup/SignUp';
import LogIn from '../pages/Login/LogIn';
import Layout from "../pages/Layout";
import EditProfile from "../pages/EditProfile/EditProfile";
import ViewProfile from "../pages/ViewProfile/ViewProfile";
import Dashboard from "../pages/dashboard/dashboard";
import Discover from "../pages/Discover/Discover";
import Connections from "../pages/Connections/Connections";
import SentRequests from "../pages/ConnectionRequests/SentRequests";
import ReceivedRequests from "../pages/ConnectionRequests/ReceivedRequests";
import BlockedUsers from "../pages/BlockedUsers/BlockedUsers";
import SendProposal from "../pages/Proposals/SendProposal";
import ChatWrapper from "../pages/Conversation/ChatWrapper";
import ReceivedProposals from "../pages/Proposals/ReceivedProposals";
import ProposalsWrapper from "../pages/Proposals/ProposalsWrapper";
import Sessions from "../pages/Sessions/Sessions";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";


const PublicRouter = () => {
    const user = useSelector(state => state.user);
    const authLoading = useSelector(state => state.ui.authLoading);

    if(authLoading)
        return <Loader />
        
    if (user) {
        return <Navigate to={"/dashboard"} replace />
    }
    else {
        return <Outlet />
    }
}

const ProtectedRouter = () => {
    const user = useSelector(state => state.user);
    const authLoading = useSelector(state => state.ui.authLoading);

    if(authLoading)
        return <Loader />

    if (user) {
        return <Outlet />
    }
    else {
        return <Navigate to={"/"} replace />
    }
}

const AppRouter = createBrowserRouter([
    {
        element: <PublicRouter />,
        children: [
            {
                path: "/login",
                element: <LogIn />
            },
            {
                path: "/signup",
                element: <SignUp />
            }
        ]
    },
    {
        element: <ProtectedRouter />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "/edit-profile",
                        element: <EditProfile />
                    },
                    {
                        path: "/profile/:userId",
                        element: <ViewProfile isOwnProfile={false} />
                    },
                    {
                        path: "/profile",
                        element: <ViewProfile isOwnProfile={true} />
                    },
                    {
                        path: "/discover",
                        element: <Discover />
                    },
                    {
                        path: "/connections",
                        element: <Connections />
                    },
                    {
                        path: "/requests",
                        children: [
                            {
                                path: "sent",
                                element: <SentRequests />
                            },
                            {
                                path: "received",
                                element: <ReceivedRequests />
                            }
                        ]
                    },
                    {
                        path: "/blocked-users",
                        element: <BlockedUsers />
                    },
                    {
                        path: "/send-proposal/:receiverId",
                        element: <SendProposal />
                    },
                    {
                        path: "/proposals",
                        element: <ProposalsWrapper />
                    },
                    {
                        path: "/proposals/:tab",
                        element: <ProposalsWrapper />
                    },
                    {
                        path: "/conversations",
                        element: <ChatWrapper />
                    },
                    {
                        path: "/conversations/:userId/:tab",
                        element: <ChatWrapper />
                    },
                    {
                        path: "/sessions",
                        element: <Sessions />
                    },
                    {
                        path: "/account",
                        element: <Settings />
                    }
                ]
            }
        ]
    },
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default AppRouter