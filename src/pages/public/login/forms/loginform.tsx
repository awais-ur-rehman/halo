import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "../../../../components/common/Button";
import { Input } from "../../../../components/common/Input";
import { useAuth } from "../../../../hook/useAuth";
import type { LoginFormData } from "../../../../types/auth";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoginPending, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-[20px] bg-white/10 border border-white/10 p-2">
      <div className="rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white  mb-2">Sign In</h2>
          <p className="text-white/60 ">Access your Halo dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
            />

            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
            />
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {(loginError as Error).message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoginPending}
          >
            {isLoginPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};
