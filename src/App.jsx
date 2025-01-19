import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "./database/SupabaseClient";
import { Outlet, useNavigate } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { storeAuthSession } from "./states/features/auth/authSlice";

export const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect to login if not authenticated
  useEffect(() => {
    //
    supabase.auth.getSession().then(
      ({
        data: {
          session: { user },
        },
      }) => {
        if (user) {
          dispatch(storeAuthSession(user));
        } else {
          dispatch(storeAuthSession(null));
          localStorage.clear();
          navigate("/login");
        }
      }
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(storeAuthSession(session));
      } else {
        dispatch(storeAuthSession(null));
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, navigate]);

  return (
    <>
      <NavigationBar />
      <div className="p-14">
        <Outlet />
      </div>
    </>
  );
};
