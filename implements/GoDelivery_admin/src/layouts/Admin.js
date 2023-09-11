import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import Sidebar from "components/Sidebar/Sidebar.js";
import { NotificationContainer } from "react-notifications";

import routes from "routes.js";

const Admin = (props) => {
    const mainContent = React.useRef(null);
    const location = useLocation();

    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        mainContent.current.scrollTop = 0;
    }, [location]);

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === "/admin") {
                return (
                    <Route
                        path={prop.path}
                        element={prop.component}
                        key={key}
                        exact
                    />
                );
            } else {
                return null;
            }
        });
    };

    return (
        <>
            <Sidebar
                {...props}
                routes={routes}
                logo={{
                    innerLink: "/admin/index",
                    imgSrc: require("../assets/img/brand/logo.png"),
                    imgAlt: "...",
                }}
            />
            <div className="main-content" ref={mainContent}>
                <NotificationContainer />
                <Routes>
                    {getRoutes(routes)}
                    <Route
                        path="*"
                        element={<Navigate to="/admin/index" replace />}
                    />
                </Routes>
                <Container fluid>{/* <AdminFooter /> */}</Container>
            </div>
        </>
    );
};

export default Admin;
