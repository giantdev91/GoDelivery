import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import DailyOrder from "./dailyOrder";
import DailyRevenue from "./dailyRevenue";

const DeliverymanDetailDailyStatus = ({ id }) => {
    useEffect(() => {}, [id]);
    return (
        <>
            <Row className="mt-3">
                <Col className="col-md-6">
                    <DailyOrder deliverymanId={id} />
                </Col>
                <Col className="col-md-6">
                    <DailyRevenue deliverymanId={id} />
                </Col>
            </Row>
        </>
    );
};

export default DeliverymanDetailDailyStatus;
