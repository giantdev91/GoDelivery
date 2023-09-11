import React from "react";
import { Row, Col } from "reactstrap";
import RecentOrderCard from "./recentOrderCard";
import MonthlyRevenue from "./monthlyRevenue";
import MonthlyOrder from "./monthlyOrder";

const DashboardMonthlyStatusRow = () => {
    return (
        <>
            {/* second row information start */}
            <Row className="mb-4">
                <Col className="col-md-4">
                    <RecentOrderCard />
                </Col>
                <Col className="col-md-4">
                    <MonthlyRevenue />
                </Col>
                <Col className="col-md-4">
                    <MonthlyOrder />
                </Col>
            </Row>
            {/* second row information end */}
        </>
    );
};

export default DashboardMonthlyStatusRow;
