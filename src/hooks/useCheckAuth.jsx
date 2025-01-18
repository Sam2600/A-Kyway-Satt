import { supabase } from '../database/SupabaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { storeAuthSession } from '../states/features/auth/authSlice';
import { useEffect } from 'react';

export const useCheckAuth = () => {
   
   const authSession = useSelector((state) => state.auth.AuthSession)
   const dispatch = useDispatch()

   useEffect(() => {
   
      supabase.auth.getSession().then(({ data: { session } }) => {
         dispatch(storeAuthSession(session));
      })
   
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
         dispatch(storeAuthSession(session));
      })
   
      return () => subscription.unsubscribe()
   }, [])

   console.log(authSession)

   return authSession ? true : false;
}
