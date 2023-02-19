import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import { toast } from "react-toastify";

interface Props {
  roles?: string[]
}

export const ProtectedRoutes = ({ roles }: Props) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.account);
  // const user = localStorage.getItem('user')

  if (!user) {
    <Navigate to="/login" state={{ from: location }} />
  }

  //if user roles passed in and user.roles array fetch from api not include any of the roles passed in
  if (roles && !roles.some(r => user?.roles?.includes(r))) {
    toast.error('Not authorised to access this area')
    return <Navigate to="/catalog" />
  }

  return <Outlet />
};