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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DailyRevenue = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [calendarView, setCalendarView] = useState(false);
    const [value, onChange] = useState(new Date());

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

    const fetchData = (date) => {
        APIService.post("/statistics/dailyRevenue", {
            date: formatedDate(date),
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
                    setTotal(sum);
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    useEffect(() => {
        fetchData(new Date());
    }, []);

    return (
        <>
            <Card className="status-row-card shadow">
                <CardHeader className="border-bottom-0">
                    <Row>
                        <Col>
                            <CardTitle tag="h2" className="text-danger mb-0">
                                Daily Revenue
                            </CardTitle>
                            <CardTitle tag="h4" className="mb-0">
                                {strFormatedDate(value)}
                                <a
                                    className="ml-5"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setCalendarView(!calendarView);
                                    }}
                                >
                                    Change Date
                                </a>
                                <div
                                    style={{
                                        position: "absolute",
                                        zIndex: "100",
                                        display: calendarView
                                            ? "block"
                                            : "none",
                                    }}
                                >
                                    <DatePicker
                                        selected={value}
                                        onChange={(val) => {
                                            onChange(val);
                                            fetchData(val);
                                            setCalendarView(!calendarView);
                                        }}
                                        inline
                                    />
                                </div>
                            </CardTitle>
                        </Col>
                        <Col>
                            <CardTitle
                                tag="h1"
                                className="mb-0 my-auto text-right"
                            >
                                MZN {Number(total.toFixed(2)).toLocaleString()}
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
                                    <td>{`MZN ${Number(
                                        Number(item.price).toFixed(2)
                                    ).toLocaleString()}`}</td>
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
