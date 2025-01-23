import React, { useState } from "react";
import { supabase } from "../../database/SupabaseClient";
import {
  Card,
  Input,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { storeAuthSession } from "../../states/features/auth/authSlice";
import { scrollToTop } from "../../utils/helper_functions/helper";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

export const Register = () => {
  //
  const dispatch = useDispatch();

  const [success, setSuccess] = useState("");
  const [serverError, setserverError] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  // UseForm hook
  const { register, formState, handleSubmit, watch, reset } = useForm();

  // Useful Form states
  const { errors, isSubmitting } = formState;

  const onError = (errors, e) => {
    console.log(e);
    console.log(errors);
    scrollToTop();
  };

  const onSubmit = async (data) => {
    // Destructure data
    let { name, email, password } = data;

    let options = {
      data: {
        name: name,
      },
    };

    let response = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (response?.error) {
      setserverError(response?.error?.message);
      scrollToTop();
    } else {
      dispatch(storeAuthSession(response?.data?.session));
      setSuccess("Registered successfully. Please check mail");
      reset();
      scrollToTop();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <div className="text-center">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Register
          </Typography>
          <Typography className="mb-8 text-gray-800 font-normal text-[18px]">
            Have fun taking debt note {":)"}
          </Typography>
        </div>
        {serverError && (
          <p className="text-white text-center bg-red-500 p-3 -mt-5 mb-9 rounded-md">
            {serverError}
          </p>
        )}
        {success && (
          <p className="text-white text-center bg-green-500 p-3 -mt-5 mb-9 rounded-md">
            {success}
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
              Your Name
              <p className="block font-semibold mb-[2px] text-red-500">
                {errors?.name?.message}
              </p>
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              {...register("name", {
                required: {
                  value: true,
                  message: "Name is required",
                },

                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only alphabetic characters are allowed",
                },
              })}
            />
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
                  tooShort: (value) => value.length > 7 || "Password too short",
                },
              })}
            />
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-4 flex justify-between"
            >
              <span className="flex"> Confirm Password </span>
              <p className="block font-semibold mb-[2px] text-red-500">
                {errors?.confirm_password?.message}
              </p>
            </Typography>
            <Input
              type={passwordShown ? "text" : "password"}
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
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
              {...register("confirm_password", {
                required: {
                  value: true,
                  message: "Confirm password is required",
                },
                validate: {
                  matches: (value) =>
                    value === watch("password") || "Passwords do not match",
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
              {isSubmitting ? <Spinner /> : "REGISTER"}
            </Button>
            <Typography
              variant="small"
              className="text-center mt-4 text-gray-600"
            >
              Alredy created an account?{" "}
              {!isSubmitting && (
                <NavLink
                  className="hover:underline text-blue-500"
                  to={"/login"}
                >
                  {" Login "}
                </NavLink>
              )}
            </Typography>
          </div>
        </form>
      </Card>
    </div>
  );
};
