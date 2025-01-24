import React from 'react'
import { App } from '../App';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { DebtList } from '../pages/debts/DebtList';
import {createBrowserRouter, redirect} from "react-router-dom";
import { AddDebt } from '../pages/debts/AddDebt';
import { ErrorPage } from '../pages/error/ErrorPage';
import { NotFound } from '../pages/notFound/NotFound';

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                loader: async () => redirect('/debt-list'),
            },
            {
                path: "/debt-list",
                element: <DebtList />,
            },
            {
                path: "/add-debt",
                element: <AddDebt />
            },
            {
                path: "/update-debt/:debt",
                element: <AddDebt />
            },
        ]
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/*",
        element: <NotFound />
    },
]);
