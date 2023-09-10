/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";

import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Client from "views/examples/Client";
import Deliveryman from "views/examples/Deliveryman";
import Order from "views/examples/Order";
import SysSetting from "views/examples/SysSetting";
import Motorcycle from "views/examples/Motorcycle";
import BroadcastMessage from "views/examples/BroadcastMessage";

var routes = [
    {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: <Index />,
        layout: "/admin",
    },

    // {
    //   path: "/tables",
    //   name: "Tables",
    //   icon: "ni ni-bullet-list-67 text-red",
    //   component: <Tables />,
    //   layout: "/admin",
    // },
    {
        path: "/deliveryman",
        name: "Delivery man",
        icon: "ni ni-single-02 text-red",
        component: <Deliveryman />,
        layout: "/admin",
    },
    {
        path: "/client",
        name: "Clients",
        icon: "ni ni-single-02 text-red",
        component: <Client />,
        layout: "/admin",
    },
    {
        path: "/order",
        name: "Order",
        icon: "ni ni-box-2 text-primary",
        component: <Order />,
        layout: "/admin",
    },
    {
        path: "/liveTracking",
        name: "Live Tracking",
        icon: "ni ni-square-pin text-danger",
        component: <Order />,
        layout: "/admin",
    },
    {
        path: "/motorcycle",
        name: "Motorcycle",
        icon: "ni ni-delivery-fast text-danger",
        component: <Motorcycle />,
        layout: "/admin",
    },
    {
        path: "/broadcastMessage",
        name: "Broadcast Message",
        icon: "ni ni-email-83 text-dark",
        component: <BroadcastMessage />,
        layout: "/admin",
    },
    {
        path: "/setting",
        name: "Setting",
        icon: "ni ni-settings text-light",
        component: <SysSetting />,
        layout: "/admin",
    },
    // {
    //   path: "/register",
    //   name: "Register",
    //   icon: "ni ni-circle-08 text-pink",
    //   component: <Register />,
    //   layout: "/auth",
    // },

    // {
    //   path: "/login",
    //   name: "Login",
    //   icon: "ni ni-key-25 text-info",
    //   component: <Login />,
    //   layout: "/auth",
    // },
];
export default routes;
