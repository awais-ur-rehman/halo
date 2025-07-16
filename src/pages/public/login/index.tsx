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
    <div className="h-screen w-screen">
      <h1 className="absolute top-4 left-4 text-lg font-extrabold text-white">
        HALO.
      </h1>

      <div className="bg-black h-full w-full flex justify-center items-center">
        <Earth3D />
        <div className="absolute bg-transparent w-[40%] right-20 flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
