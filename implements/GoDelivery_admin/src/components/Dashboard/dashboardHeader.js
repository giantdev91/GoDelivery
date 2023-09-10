import React from "react";
import { Row, Col } from "reactstrap";
import HeaderCard from "components/Headers/HeaderCard";
import TotalUsersCard from "components/Common/TotalUsersCard";
import TotalOrdersCard from "components/Common/TotalOrdersCard";
import TotalRevenueCard from "components/Common/TotalRevenueCard";
import TotalMotorsCard from "components/Common/TotalMotorsCard";

const DashboardHeader = () => {
    return (
        <>
            {/* header cards start */}
            <Row className="mt-3 mb-4">
                <Col className="col-md-3 ">
                    <TotalOrdersCard />
                </Col>
                <Col className="col-md-3 ">
                    <TotalUsersCard />
                </Col>
                <Col className="col-md-3 ">
                    <TotalMotorsCard />
                </Col>
                <Col className="col-md-3 ">
                    <TotalRevenueCard />
                </Col>
            </Row>
            {/* header cards end */}
        </>
    );
};

export default DashboardHeader;
