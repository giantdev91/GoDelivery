import React from "react";
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import StatusBadge from "./statusBadge";

const RecentOrderCard = () => {
    return (
        <>
            <Card className="status-row-card">
                <CardHeader className="border-bottom-0">
                    <CardTitle tag="h2" className="text-danger mb-0">
                        Recent Orders
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <div>
                        <Row>
                            <Col className="col-md-3">
                                <h3 className="text-primary">#3093220</h3>
                            </Col>
                            <Col className="col-md-3">
                                <StatusBadge
                                    statusLabel="Processing"
                                    statusClass="success"
                                />
                            </Col>
                            <Col className="col-md-6">
                                <h2 className="text-right ">MZN 2,000.00</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-md-6">
                                <h3 className="text-primary">
                                    Armando Microsse
                                </h3>
                            </Col>
                            <Col className="col-md-6 my-auto">
                                <h6 className="text-right text-light">
                                    1st Aug 2023 12:20 PM - 10km
                                </h6>
                            </Col>
                        </Row>
                        <hr className="mt-0 mb-3" />
                    </div>
                    <div>
                        <Row>
                            <Col className="col-md-3">
                                <h3 className="text-primary">#3093220</h3>
                            </Col>
                            <Col className="col-md-3">
                                <StatusBadge
                                    statusLabel="Processing"
                                    statusClass="success"
                                />
                            </Col>
                            <Col className="col-md-6">
                                <h2 className="text-right ">MZN 2,000.00</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-md-6">
                                <h3 className="text-primary">
                                    Armando Microsse
                                </h3>
                            </Col>
                            <Col className="col-md-6 my-auto">
                                <h6 className="text-right text-light">
                                    1st Aug 2023 12:20 PM - 10km
                                </h6>
                            </Col>
                        </Row>
                        <hr className="mt-0 mb-3" />
                    </div>
                    <div>
                        <Row>
                            <Col className="col-md-3">
                                <h3 className="text-primary">#3093220</h3>
                            </Col>
                            <Col className="col-md-3">
                                <StatusBadge
                                    statusLabel="Processing"
                                    statusClass="success"
                                />
                            </Col>
                            <Col className="col-md-6">
                                <h2 className="text-right ">MZN 2,000.00</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-md-6">
                                <h3 className="text-primary">
                                    Armando Microsse
                                </h3>
                            </Col>
                            <Col className="col-md-6 my-auto">
                                <h6 className="text-right text-light">
                                    1st Aug 2023 12:20 PM - 10km
                                </h6>
                            </Col>
                        </Row>
                        <hr className="mt-0 mb-3" />
                    </div>
                    <div>
                        <Row>
                            <Col className="col-md-3">
                                <h3 className="text-primary">#3093220</h3>
                            </Col>
                            <Col className="col-md-3">
                                <StatusBadge
                                    statusLabel="Processing"
                                    statusClass="success"
                                />
                            </Col>
                            <Col className="col-md-6">
                                <h2 className="text-right ">MZN 2,000.00</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-md-6">
                                <h3 className="text-primary">
                                    Armando Microsse
                                </h3>
                            </Col>
                            <Col className="col-md-6 my-auto">
                                <h6 className="text-right text-light">
                                    1st Aug 2023 12:20 PM - 10km
                                </h6>
                            </Col>
                        </Row>
                        <hr className="mt-0 mb-3" />
                    </div>
                    <div>
                        <Row>
                            <Col className="col-md-3">
                                <h3 className="text-primary">#3093220</h3>
                            </Col>
                            <Col className="col-md-3">
                                <StatusBadge
                                    statusLabel="Processing"
                                    statusClass="success"
                                />
                            </Col>
                            <Col className="col-md-6">
                                <h2 className="text-right ">MZN 2,000.00</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-md-6">
                                <h3 className="text-primary">
                                    Armando Microsse
                                </h3>
                            </Col>
                            <Col className="col-md-6 my-auto">
                                <h6 className="text-right text-light">
                                    1st Aug 2023 12:20 PM - 10km
                                </h6>
                            </Col>
                        </Row>
                        <hr className="mt-0 mb-3" />
                    </div>
                    <div>
                        <Row>
                            <Col className="col-md-3">
                                <h3 className="text-primary">#3093220</h3>
                            </Col>
                            <Col className="col-md-3">
                                <StatusBadge
                                    statusLabel="Processing"
                                    statusClass="success"
                                />
                            </Col>
                            <Col className="col-md-6">
                                <h2 className="text-right ">MZN 2,000.00</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-md-6">
                                <h3 className="text-primary">
                                    Armando Microsse
                                </h3>
                            </Col>
                            <Col className="col-md-6 my-auto">
                                <h6 className="text-right text-light">
                                    1st Aug 2023 12:20 PM - 10km
                                </h6>
                            </Col>
                        </Row>
                        <hr className="mt-0 mb-3" />
                    </div>
                </CardBody>
            </Card>
        </>
    );
};

export default RecentOrderCard;
