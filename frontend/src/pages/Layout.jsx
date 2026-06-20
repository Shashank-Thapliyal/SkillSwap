import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux';

const Layout = () => {
  const user = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Layout