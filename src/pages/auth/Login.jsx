import React, { useState } from "react";
import { supabase } from "../../database/SupabaseClient"
import {
  Button,
  Card,
  Input,
  Typography,
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";

export const Login = () => {

  // UseForm hook
  const { register, formState, handleSubmit, reset } = useForm();

  // Useful Form states
  const { errors, isSubmitting } = formState;

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setserverError] = useState("");

  const onSubmit = async (data) => {
    //
    setLoading(true);

    let { email, password } = data;
  
    let response = await supabase.auth.signInWithPassword({ email, password });

    console.log(response);
  };

  const onError = (errors, e) => {
    setSuccess(false);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6">
        <Typography variant="h4" className="text-center mb-4">
          Login
        </Typography>
        <form className="space-y-4" method="POST" onSubmit={handleSubmit(onSubmit, onError)}>
          <Input
            label="Email"
            size="lg"
            type="email"
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
                  !value.endsWith("customMail.com") ||
                  "Bad domain for email",
                noScriptTags: (value) =>
                  !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(
                    value
                  ) || "Script tags are not allowed",
              },
            })}
          />
          <Input
            label="Password"
            size="lg"
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },

              // Validate for multiple conditions
              validate: {
                tooShort: (value) =>
                  value.length > 7 ||
                  "Password too short",
              },
            })}
          />
          <Button
            size="lg"
            fullWidth
            type="submit"
          >
            Login
          </Button>
        </form>
        <Typography
          variant="small"
          className="text-center mt-4 text-gray-600"
        >
          Not a member? {" "} <NavLink className="hover:underline text-blue-500" to={"/register"}>{" Sign up "}</NavLink>
        </Typography>
      </Card> 
    </div>
  );
}
