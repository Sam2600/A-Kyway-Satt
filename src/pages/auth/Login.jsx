import React, { useState } from "react";
import { supabase } from "../../database/SupabaseClient";
import {
  Button,
  Card,
  Input,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { storeAuthSession } from "../../states/features/auth/authSlice";
import { scrollToTop } from "../../utils/helper_functions/helper";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

export const Login = () => {
  //
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const [serverError, setserverError] = useState("");

  // UseForm hook
  const { register, formState, handleSubmit } = useForm();

  // Useful Form states
  const { errors, isSubmitting } = formState;

  const onError = (errors, e) => {
    console.log(e);
    console.log(errors);
    scrollToTop();
  };

  const onSubmit = async (data) => {
    //
    let { email, password } = data;

    await supabase.auth.signInWithPassword({ email, password })
      .then(response => response?.data)
      .then(data => {
        dispatch(storeAuthSession(data?.user))
        navigate("/");
      })
      .catch(error => {
          setserverError(error?.message);
          scrollToTop();
        });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col gap-2 text-center mb-14">
          <Typography variant="h3" color="blue-gray">
            Login
          </Typography>
          <Typography className="text-gray-600 font-normal text-[18px]">
            Enter your email and password to sign in
          </Typography>
        </div>
        {serverError && (
          <p className="text-white bg-red-500 p-3 -mt-5 mb-9 rounded-md">
            {serverError}
          </p>
        )}
        <form
          className="space-y-4"
          method="POST"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-4 flex justify-between"
            >
              Your Email
              <p className="block font-semibold mb-[2px] text-red-500">
                {errors?.email?.message}
              </p>
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },

                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Please enter a valid email format",
                },

                // Validate for multiple conditions
                validate: {
                  notAdmin: (value) =>
                    value !== "admin@gmail.com" ||
                    "Please try with different email",
                  badDomain: (value) =>
                    !value.endsWith("customMail.com") || "Bad domain for email",
                  noScriptTags: (value) =>
                    !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(
                      value
                    ) || "Script tags are not allowed",
                },
              })}
            />
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-4 flex justify-between"
            >
              Password
              <p className="block font-semibold mb-[2px] text-red-500">
                {errors?.password?.message}
              </p>
            </Typography>
            <Input
              type={passwordShown ? "text" : "password"}
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },

                // Validate for multiple conditions
                validate: {
                  tooShort: (value) =>
                    value.length > 7 || "Password is too short",
                },
              })}
            />
            <Button
              disabled={isSubmitting}
              className="mt-6 flex justify-center items-center"
              size="lg"
              fullWidth
              type="submit"
            >
              {isSubmitting ? <Spinner /> : "LOGIN"}
            </Button>
            <Typography
              variant="small"
              className="text-center mt-4 text-gray-600"
            >
              Not a member?{" "}
              {!isSubmitting && (
                <NavLink
                  className="hover:underline text-blue-500"
                  to={"/register"}
                >
                  {"Sign up"}
                </NavLink>
              )}
            </Typography>
          </div>
        </form>
      </Card>
    </div>
  );
};
