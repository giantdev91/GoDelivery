import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Table,
    Badge,
} from "reactstrap";
import APIService from "../../service/APIService";
import { strFormatedDate, formatedDate } from "../../utils/commonFunction";
const DailyRevenue = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);

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

    const fetchData = () => {
        APIService.post("/statistics/dailyRevenue", {
            date: formatedDate(new Date()),
        })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setData(response.data);
                    const sum = response.data.reduce(
                        (accumulator, currentObject) => {
                            return (
                                accumulator +
                                (currentObject.status == 3
                                    ? currentObject.price
                                    : 0)
                            );
                        },
                        0
                    );
                    console.log("sum ========> ", sum);
                    setTotal(sum);
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Card className="status-row-card">
                <CardHeader className="border-bottom-0">
                    <Row>
                        <Col>
                            <CardTitle tag="h2" className="text-danger mb-0">
                                Daily Revenue
                            </CardTitle>
                            <CardTitle tag="h4" className="mb-0">
                                {strFormatedDate(new Date())}
                            </CardTitle>
                        </Col>
                        <Col>
                            <CardTitle
                                tag="h1"
                                className="mb-0 my-auto text-right"
                            >
                                MZN {Number(total).toLocaleString()}
                            </CardTitle>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Table
                        className="align-items-center table-flush"
                        responsive
                    >
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Delivery man</th>
                                <th scope="col">Bike Plate</th>
                                <th scope="col">Order Completed</th>
                                <th scope="col">Order Cancelled</th>
                                <th scope="col">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        {item.delivery_man?.name}
                                    </th>
                                    <td>{item.delivery_man?.motor?.plate}</td>
                                    <td>
                                        {item.status == 3 &&
                                            getStatusBadge(item.status)}
                                    </td>
                                    <td>
                                        {item.status == 4 &&
                                            getStatusBadge(item.status)}
                                    </td>
                                    <td>{`MZN ${item.price}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </>
    );
};

export default DailyRevenue;
