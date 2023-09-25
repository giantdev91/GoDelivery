import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Badge,
} from "reactstrap";
import APIService from "../../service/APIService";
import { formatDateAndTime } from "../../utils/commonFunction";

const RecentOrderCard = ({ deliverymanId }) => {
    const [recentOrders, setRecentOrders] = useState([]);

    const fetchRecentOrders = () => {
        if (deliverymanId) {
            APIService.post("/order/recent", { deliverymanId: deliverymanId })
                .then((res) => {
                    setRecentOrders(res.data.data);
                })
                .catch((err) => console.log("error: ", err));
        } else {
            setRecentOrders([]);
        }
    };

    useEffect(() => {
        fetchRecentOrders();
    }, [deliverymanId]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 0:
                return <Badge color="warning">Pending</Badge>;
                break;
            case 1:
                return <Badge color="info">Processing</Badge>;
                break;
            case 2:
                return <Badge color="info">Processing</Badge>;
                break;
            case 3:
                return <Badge color="success">Completed</Badge>;
                break;
            case 4:
                return <Badge color="danger">Cancelled</Badge>;
                break;
        }
    };

    return (
        <>
            <Card className="status-row-card shadow">
                <CardHeader className="border-bottom-0">
                    <CardTitle tag="h2" className="text-danger mb-0">
                        Recent Orders
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    {recentOrders.map((order, index) => {
                        if (index < 10) {
                            return (
                                <div key={index} className="recent-orders-row">
                                    <Row>
                                        <Col className="col-md-7 status-row">
                                            <span className="text-primary">
                                                {order.orderNo}
                                            </span>
                                            {getStatusBadge(order.status)}
                                        </Col>
                                        <Col className="col-md-5 text-right">
                                            <span className="text-right ">
                                                MZN{" "}
                                                {Number(
                                                    Number(order.price).toFixed(
                                                        2
                                                    )
                                                ).toLocaleString()}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="col-md-6">
                                            <h3 className="text-primary">
                                                {order.client.name}
                                            </h3>
                                        </Col>
                                        <Col className="col-md-6 my-auto">
                                            <h5 className="text-right text-light">
                                                {`${formatDateAndTime(
                                                    new Date(order.createdAt)
                                                )} - ${order.distance} Km`}
                                            </h5>
                                        </Col>
                                    </Row>
                                    <hr className="mt-0 mb-3" />
                                </div>
                            );
                        }
                    })}
                </CardBody>
            </Card>
        </>
    );
};

export default RecentOrderCard;
