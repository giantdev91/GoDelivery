import Dashboard from "views/dashboard";
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
        component: <Dashboard />,
        layout: "/admin",
    },
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
