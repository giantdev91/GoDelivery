import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import RecentOrderCard from "./recentOrderCard";
import MonthlyRevenue from "./monthlyRevenue";
import MonthlyOrder from "./monthlyOrder";

const DeliverymanDetailMonthlyStatus = ({ id }) => {
    useEffect(() => {}, [id]);
    return (
        <>
            <Row className="mt-3">
                <Col className="col-md-4">
                    <RecentOrderCard deliverymanId={id} />
                </Col>
                <Col className="col-md-4">
                    <MonthlyRevenue deliverymanId={id} />
                </Col>
                <Col className="col-md-4">
                    <MonthlyOrder deliverymanId={id} />
                </Col>
            </Row>
        </>
    );
};

export default DeliverymanDetailMonthlyStatus;
