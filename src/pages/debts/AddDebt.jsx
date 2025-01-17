import {
   Card,
   Input,
   Checkbox,
   Button,
   Typography,
   Select,
   Option,
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
  
export const AddDebt = () => {
   return (
      <Card className="items-center" color="transparent" shadow={false}>
         <Typography variant="h4" color="blue-gray">
            Register Your Debt 
         </Typography>
         <Typography color="gray" className="mt-1 font-normal">
            Make beautiful debt history with your friends {":)"} 
         </Typography>
         <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-1 flex flex-col gap-6">
               <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Your Name
               </Typography>
               <Input
                  size="lg"
                  placeholder="name@mail.com"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                     className: "before:content-none after:content-none",
                  }}
               />
               <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Taker Name
               </Typography>
               <Select>
                  <Option>Mg Mg</Option>
                  <Option>Ko Ko</Option>
                  <Option>Hla Hla</Option>
                  <Option>Pa Pa</Option>
                  <Option>Wah Wah</Option>
               </Select>
               <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Your Email
               </Typography>
               <Input
                  size="lg"
                  placeholder="name@mail.com"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                     className: "before:content-none after:content-none",
                  }}
               />
               <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Password
               </Typography>
               <Input
                  type="password"
                  size="lg"
                  placeholder="********"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                     className: "before:content-none after:content-none",
                  }}
               />
            </div>
            <Checkbox
               label={
                  <Typography
                     variant="small"
                     color="gray"
                     className="flex items-center font-normal"
                  >
                     I agree the
                     <NavLink
                        to={"#"}
                     className="font-medium transition-colors hover:text-gray-900"
                     >
                     &nbsp;Terms and Conditions
                     </NavLink>
                  </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
            />
            <Button className="mt-6" fullWidth>
               Register
            </Button>
         </form>
      </Card>
   );
 }