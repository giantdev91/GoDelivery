import Dashboard from "views/dashboard";
import Client from "views/examples/Client";
import Deliveryman from "views/examples/Deliveryman";
import DeliverymanDetail from "views/examples/DeliverymanDetail";
import Order from "views/examples/Order";
import OrderDetail from "views/examples/OrderDetail";
import SysSetting from "views/examples/SysSetting";
import Motorcycle from "views/examples/Motorcycle";
import BroadcastMessage from "views/examples/BroadcastMessage";

var routes = [
    {
        showSide: true,
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: <Dashboard />,
        layout: "/admin",
    },
    {
        showSide: true,
        path: "/deliveryman",
        name: "Delivery man",
        icon: "ni ni-single-02 text-red",
        component: <Deliveryman />,
        layout: "/admin",
    },
    {
        showSide: false,
        path: "/deliveryman/detail/:id",
        name: "Delivery man",
        icon: "ni ni-single-02 text-red",
        component: <DeliverymanDetail />,
        layout: "/admin",
    },
    {
        showSide: true,
        path: "/client",
        name: "Clients",
        icon: "ni ni-single-02 text-red",
        component: <Client />,
        layout: "/admin",
    },
    {
        showSide: true,
        path: "/order",
        name: "Order",
        icon: "ni ni-box-2 text-primary",
        component: <Order />,
        layout: "/admin",
    },
    {
        showSide: false,
        path: "/order/detail/:id",
        name: "Order",
        icon: "ni ni-box-2 text-primary",
        component: <OrderDetail />,
        layout: "/admin",
    },
    {
        showSide: true,
        path: "/liveTracking",
        name: "Live Tracking",
        icon: "ni ni-square-pin text-danger",
        component: <Order />,
        layout: "/admin",
    },
    {
        showSide: true,
        path: "/motorcycle",
        name: "Motorcycle",
        icon: "ni ni-delivery-fast text-danger",
        component: <Motorcycle />,
        layout: "/admin",
    },
    {
        showSide: true,
        path: "/broadcastMessage",
        name: "Broadcast Message",
        icon: "ni ni-email-83 text-dark",
        component: <BroadcastMessage />,
        layout: "/admin",
    },
    {
        showSide: true,
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
