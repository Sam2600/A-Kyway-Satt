import React from 'react'
import { App } from '../App';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { DebtList } from '../pages/debts/DebtList';
import {createBrowserRouter} from "react-router-dom";
import { AddDebt } from '../pages/debts/AddDebt';

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/debt-list",
                element: <DebtList />,
            },
            {
                path: "/add-debt",
                element: <AddDebt />
            }
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
]);
