import { useRouteError } from "react-router-dom";
import { Typography, Card } from "@material-tailwind/react";

export const ErrorPage = () => {
    const error = useRouteError();
    console.log(error)

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="p-8 shadow-lg max-w-md text-center">
                <Typography variant="h1" className="text-red-600 font-bold">
                Error founded
                </Typography>
                <Typography variant="h5" className="mt-4 text-gray-800">
                {error?.message || "Oops! Something went wrong."}
                </Typography>
            </Card>
        </div>
    );
};
