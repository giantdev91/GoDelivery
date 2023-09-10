import React from "react";
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import DailyOrder from "./dailyOrder";
import DailyRevenue from "./dailyRevenue";

const DashboardDailyStatusRow = () => {
    return (
        <>
            {/* second row information start */}
            <Row className="mb-4">
                <Col className="col-md-6">
                    <DailyOrder />
                </Col>
                <Col className="col-md-6">
                    <DailyRevenue />
                </Col>
            </Row>
            {/* second row information end */}
        </>
    );
};

export default DashboardDailyStatusRow;
