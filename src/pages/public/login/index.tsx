import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Earth3D } from "../../../components/Earth3d";
import { LoginForm } from "./forms/loginform";
import { useAuth } from "../../../hook/useAuth";
import { ROUTES } from "../../../routes";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-screen w-screen bg-white  flex p-4">
      <div className="h-full w-1/2 flex justify-center items-center rounded-[12px]">
        <Earth3D />
      </div>

      <div className="h-full w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};
