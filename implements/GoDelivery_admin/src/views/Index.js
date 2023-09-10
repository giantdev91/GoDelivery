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
import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import HeaderCard from "components/Headers/HeaderCard";
import DashboardHeader from "components/Dashboard/dashboardHeader";
import DashboardMonthlyStatusRow from "components/Dashboard/dashboardMonthlyStatusRow";
import DashboardDailyStatusRow from "components/Dashboard/dashboardDailyStatusRow";
import StatusBadge from "components/Dashboard/statusBadge";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    NavItem,
    NavLink,
    Nav,
    Progress,
    Table,
    Container,
    Row,
    Col,
} from "reactstrap";

// core components
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

const Index = (props) => {
    const [activeNav, setActiveNav] = useState(1);
    const [chartExample1Data, setChartExample1Data] = useState("data1");

    if (window.Chart) {
        parseOptions(Chart, chartOptions());
    }

    const toggleNavs = (e, index) => {
        e.preventDefault();
        setActiveNav(index);
        setChartExample1Data("data" + index);
    };
    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <CardTitle
                            tag="h1"
                            className="text-uppercase text-dark mt-4"
                        >
                            Dashboard
                        </CardTitle>
                        <CardTitle tag="h4" className="">
                            Welcome back Admin
                        </CardTitle>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <DashboardHeader />
                <DashboardMonthlyStatusRow />
                <DashboardDailyStatusRow />
            </Container>
        </>
    );
};

export default Index;
