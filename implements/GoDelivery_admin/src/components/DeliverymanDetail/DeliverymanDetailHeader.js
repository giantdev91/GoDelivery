import React, { useEffect, useState } from "react";
import { Row, Col, Badge } from "reactstrap";
import HeaderCard from "components/Headers/HeaderCard";

const DeliverymanDetailHeader = ({ deliverymanDetail }) => {
    const [totalOrders, setTotalOrders] = useState("");
    const [totalRevenue, setTotalRevenue] = useState("");

    const calculateTotalInfo = () => {
        if (deliverymanDetail.orders) {
            const sum = deliverymanDetail.orders.reduce(
                (accumulator, currentObject) => {
                    return (
                        accumulator +
                        (currentObject.status == 3 ? currentObject.price : 0)
                    );
                },
                0
            );
            setTotalRevenue(Number(sum).toLocaleString());
            setTotalOrders(
                Number(deliverymanDetail.orders.length).toLocaleString()
            );
        }
    };

    useEffect(() => {
        calculateTotalInfo();
    }, [deliverymanDetail]);

    return (
        <>
            <Row className="mt-3">
                <Col className="col-md-8">
                    <h1 className="text-uppercase text-dark mt-4">
                        {deliverymanDetail.name}
                        <Badge className="ml-5" color="success">
                            Active
                        </Badge>
                        {/* <Badge className="ml-5" color="warning">Inactive</Badge>
                        <Badge className="ml-5" color="default">Suspended</Badge> */}
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "0.5em",
                        }}
                    >
                        <a href="/admin/deliveryman">Delivery man</a>
                        <span style={{ color: "#5e72e4", fontSize: "1.5em" }}>
                            {" "}
                            {" > "}{" "}
                        </span>
                        <a href="#">{deliverymanDetail.name}</a>
                    </div>
                    <Row className="mt-3">
                        <Col className="col-md-4">
                            <HeaderCard
                                title="TOTAL ORDERS"
                                value={totalOrders}
                                icon={
                                    <img
                                        alt="..."
                                        src={require("../../assets/img/icons/order.png")}
                                    />
                                }
                            />
                        </Col>
                        <Col className="col-md-4">
                            <HeaderCard
                                title="REVENUE"
                                value={totalRevenue}
                                icon={
                                    <p className="valueText mb-0 text-left">
                                        MZN
                                    </p>
                                }
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="col-md-4">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            height: "100%",
                            gap: "2em",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "flex-end",
                            }}
                        >
                            <h3 className="text-danger">MOTORCYCLE</h3>
                            <h1>{deliverymanDetail?.motor?.plate}</h1>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <img
                                // src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                                src={
                                    !deliverymanDetail.avatar
                                        ? require("../../assets/img/common/delivery-man.png")
                                        : deliverymanDetail.avatar
                                }
                                style={{
                                    borderRadius: "10em",
                                    width: "10em",
                                }}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default DeliverymanDetailHeader;
