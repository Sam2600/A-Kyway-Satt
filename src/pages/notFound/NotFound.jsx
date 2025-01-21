import { Typography, Card, Button } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="flex flex-col space-y-5 p-8 shadow-lg max-w-xl text-center">
                <Typography variant="h3" className="text-red-600 font-bold">
                    Page doesn't exist yet!
                </Typography>
                <Typography variant="h5" className="mt-4 text-gray-800">
                    Comming soon, stay tune {":)"}
                </Typography>
                <NavLink to={"/"}>
                    <Button>Go Back</Button>
                </NavLink>
            </Card>
        </div>
    );
};
