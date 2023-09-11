import React from "react";
import { CardTitle, Container, Row, Col } from "reactstrap";
import Chart from "chart.js";
import DashboardHeader from "components/Dashboard/dashboardHeader";
import DashboardMonthlyStatusRow from "components/Dashboard/dashboardMonthlyStatusRow";
import DashboardDailyStatusRow from "components/Dashboard/dashboardDailyStatusRow";

import { chartOptions, parseOptions } from "variables/charts.js";

const Dashboard = () => {
    if (window.Chart) {
        parseOptions(Chart, chartOptions());
    }

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

export default Dashboard;
