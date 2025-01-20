import {
   Card,
   Input,
   Button,
   Typography,
   Spinner,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { scrollToTop } from "../../utils/helper_functions/helper";
import { supabase } from "../../database/SupabaseClient";
import { useForm, Controller } from "react-hook-form";

export const AddDebt = () => {
   //
   const [search, setSearch] = useState("");
   const [me, setMe] = useState({});
   const [userList, setUserList] = useState([]);
   const [itemList, setItemList] = useState([]);

   const getUsers = async () => {
      const { data, error } = await supabase.from("pub_users").select(`id, name`);
      setUserList(data);

      if (error) {
         console.log(error);
         setUserList([]);
      }
   };

   const getItems = async () => {
      const { data, error } = await supabase.from("items").select(`id, name`);
      setItemList(data);

      if (error) {
         console.log(error);
         setItemList([]);
      }
   };

   const getMe = async () => {
      await supabase.auth
         .getSession()
         .then((resp) => resp?.data)
         .then((data) => data?.session)
         .then((session) => setMe(session?.user));
   };

   useEffect(() => {
      getMe();

      /**
       * @date 2025/01/19
       * @desctiption This is temporary code to reduce db fetching
       */
      if (!userList.length) {
         getUsers();
      }

      if (!itemList.length) {
         getItems();
      }
   }, [search]);


   const [success, setSuccess] = useState("");
   const [serverError, setserverError] = useState("");

   // UseForm hook
   const { register, formState, handleSubmit, reset } = useForm();

   // Useful Form states
   const { errors, isSubmitting } = formState;

   const onError = (errors, e) => {
      console.log(e);
      console.log(errors);
      scrollToTop();
   };

   const onSubmit = async (data) => {
      const updatData = {
         ...data,
         pay_to_user_id: me?.id,
         updated_at: new Date().toISOString(), // Use the current timestamp in ISO 8601 format
      };

      let { error } = await supabase.from("debts").insert(updatData);

      if (error?.message && error?.code) {
         console.log(error);
         setserverError(error?.message);
      } else {
         setSuccess("Debt is created successfully");
         reset();
      }
   };

   return (
      <Card className="items-center" color="transparent" shadow={false}>
         <Typography variant="h4" color="blue-gray">
         Register Your Debt
         </Typography>
         <Typography color="gray" className="mt-1 font-normal">
         Make beautiful debt history with your friends {":)"}
         </Typography>
         {serverError && (
            <p className="text-white bg-red-500 p-3 mt-6 rounded-md">
               {serverError}
            </p>
         )}
         {success && (
            <p className="text-white bg-green-500 p-3 mt-6 rounded-md">
               {success}
            </p>
         )}
         <form
         method="POST"
         onSubmit={handleSubmit(onSubmit, onError)}
         className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
         >
         <div className="mb-8 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3 flex justify-between">
               Taker Name
               <p className="block font-semibold mb-[2px] text-red-500">
                  {errors?.pay_from_user_id?.message}
               </p>
            </Typography>
            <select
               className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900 !border-t-blue-gray-200 focus:!border-t-gray-900"
               {...register("pay_from_user_id", {
                  required: {
                     value: true,
                     message: "Debt taker is required",
                  },
               })}
            >
               <option value=""></option>
               {userList?.map((user) => {

                  if (user?.id == me?.id) return null;

                  return (
                     <option
                        className="pt-[9px] pb-2 px-3 rounded-md leading-tight cursor-pointer select-none hover:bg-blue-gray-50 focus:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 outline outline-0 transition-all"
                        key={user?.id}
                        value={user?.id}
                     >
                        {user?.name}
                     </option>
                  );
               })}
            </select>
            <Typography variant="h6" color="blue-gray" className="-mb-3 flex justify-between">
               Item
               <p className="block font-semibold mb-[2px] text-red-500">
                  {errors?.item_id?.message}
               </p>
            </Typography>
            <select
               className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900 !border-t-blue-gray-200 focus:!border-t-gray-900"
               {...register("item_id", {
                  required: {
                     value: true,
                     message: "Item is required",
                  },
               })}
            >
               <option value=""></option>
               {itemList?.map((item) => {
                  return (
                  <option key={item?.id} value={item?.id?.toString()}>
                     {item?.name}
                  </option>
                  );
               })}
            </select>
            <Typography variant="h6" color="blue-gray" className="-mb-3 flex justify-between">
                  Amount
                  <p className="block font-semibold mb-[2px] text-red-500">
                  {errors?.amount?.message}
               </p>
            </Typography>
            <Input
               {...register("amount", {
                  required: {
                  value: true,
                  message: "Amount is required"
               },
               pattern: {
                  value: /^\d+$/,
                  message: "Only numeric characters are allowed",
               },
               })}
               size="lg"
               placeholder="********"
               className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
               labelProps={{
               className: "before:content-none after:content-none",
               }}
            />
         </div>
         <Button disabled={isSubmitting} type="submit" className="mt-6 flex justify-center items-center" fullWidth>
            {isSubmitting ? <Spinner /> : "REGISTER"}
         </Button>
         </form>
      </Card>
   );
};
