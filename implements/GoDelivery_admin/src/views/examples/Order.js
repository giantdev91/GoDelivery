import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
} from "reactstrap";
import APIService from "../../service/APIService";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TotalOrdersCard from "components/Common/TotalOrdersCard";
import { formatedDate } from "utils/commonFunction";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function CustomTabPanel(props) {
    const { children, tabIndex, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={tabIndex !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {tabIndex === index && <div>{children}</div>}
        </div>
    );
}

const Order = () => {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(undefined);
    const [tabIndex, setTabIndex] = useState(0);
    const [row, setRow] = useState(undefined);
    const [columns, setColumns] = useState([]);

    const fetchOrderList = (tab) => {
        let status = "0";
        switch (tab) {
            case 0:
                status = "0";
                break;
            case 1:
                status = "1,2";
                break;
            case 2:
                status = "3";
                break;
            case 3:
                status = "4";
                break;
            default:
                status = "0";
                break;
        }
        APIService.post("/order/list", { status: status })
            .then((res) => {
                setOrderData(res.data.data);
            })
            .catch((err) => console.log("error: ", err));
    };

    const tabChange = (event, newValue) => {
        setTabIndex(newValue);
        fetchOrderList(newValue);
    };

    useEffect(() => {
        fetchOrderList(0);
    }, []);

    useEffect(() => {
        const rows = orderData
            ? orderData.map((order, index) => ({
                  index: index,
                  id: order.id,
                  sender: `${order.client.name} (${order.client.phone})`,
                  receiver: `${order.receiverName}(${order.receiver})`,
                  from: order.from,
                  to: order.to,
                  price: `${order.price} MZN`,
                  rate: order.rate,
                  created: formatedDate(new Date(order.createdAt)),
                  deliveryMan: `${order.delivery_man?.name}(${order.delivery_man?.phone})`,
                  cancelledBy: order.canceledBy,
                  cancelReason: order.cancelReason,
              }))
            : [];
        setRow(rows);

        let columns = [];

        switch (tabIndex) {
            case 0:
                columns = [
                    {
                        name: "Sender",
                        selector: (row) => row.sender,
                    },
                    {
                        name: "Receiver",
                        selector: (row) => row.receiver,
                    },
                    {
                        name: "From",
                        selector: (row) => row.from,
                    },
                    {
                        name: "To",
                        selector: (row) => row.to,
                    },
                    {
                        name: "Price",
                        selector: (row) => row.price,
                    },
                    {
                        name: "Created",
                        selector: (row) => row.created,
                    },
                ];
                break;
            case 1:
                columns = [
                    {
                        name: "Sender",
                        selector: (row) => row.sender,
                    },
                    {
                        name: "Receiver",
                        selector: (row) => row.receiver,
                    },
                    {
                        name: "From",
                        selector: (row) => row.from,
                    },
                    {
                        name: "To",
                        selector: (row) => row.to,
                    },
                    {
                        name: "Delivery man",
                        selector: (row) => row.deliveryMan,
                    },
                    {
                        name: "Price",
                        selector: (row) => row.price,
                    },
                    {
                        name: "Created",
                        selector: (row) => row.created,
                    },
                ];
                break;
            case 2:
                columns = [
                    {
                        name: "Sender",
                        selector: (row) => row.sender,
                    },
                    {
                        name: "Receiver",
                        selector: (row) => row.receiver,
                    },
                    {
                        name: "From",
                        selector: (row) => row.from,
                    },
                    {
                        name: "To",
                        selector: (row) => row.to,
                    },
                    {
                        name: "Delivery man",
                        selector: (row) => row.deliveryMan,
                    },
                    {
                        name: "Price",
                        selector: (row) => row.price,
                    },
                    {
                        name: "Rate",
                        selector: (row) => row.rate,
                    },
                    {
                        name: "Created",
                        selector: (row) => row.created,
                    },
                ];
                break;
            case 3:
                columns = [
                    {
                        name: "Sender",
                        selector: (row) => row.sender,
                    },
                    {
                        name: "Receiver",
                        selector: (row) => row.receiver,
                    },
                    {
                        name: "From",
                        selector: (row) => row.from,
                    },
                    {
                        name: "To",
                        selector: (row) => row.to,
                    },
                    {
                        name: "Delivery man",
                        selector: (row) => row.deliveryMan,
                    },
                    {
                        name: "Price",
                        selector: (row) => row.price,
                    },
                    {
                        name: "Created",
                        selector: (row) => row.created,
                    },
                    {
                        name: "Cancelled By",
                        selector: (row) => row.cancelledBy,
                    },
                    {
                        name: "Reason",
                        selector: (row) => row.cancelReason,
                    },
                ];
                break;
            default:
                columns = [
                    {
                        name: "Sender",
                        selector: (row) => row.sender,
                    },
                    {
                        name: "Receiver",
                        selector: (row) => row.receiver,
                    },
                    {
                        name: "From",
                        selector: (row) => row.from,
                    },
                    {
                        name: "To",
                        selector: (row) => row.to,
                    },
                    {
                        name: "Price",
                        selector: (row) => row.price,
                    },
                    {
                        name: "Created",
                        selector: (row) => row.created,
                    },
                ];
                break;
        }

        setColumns(columns);
    }, [orderData, tabIndex]);

    return (
        <>
            <Container fluid>
                <Row className="mt-3">
                    <Col className="col-md-9 mb-2 mb-xl-2">
                        <CardTitle
                            tag="h1"
                            className="text-uppercase text-dark mt-4"
                        >
                            Orders
                        </CardTitle>
                    </Col>
                    <Col className="col-md-3 mb-2 mb-xl-2">
                        <TotalOrdersCard />
                    </Col>
                </Row>
                <Row className="">
                    <Col>
                        <Tabs
                            value={tabIndex}
                            onChange={tabChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="Pending" {...a11yProps(0)} />
                            <Tab label="Processing" {...a11yProps(1)} />
                            <Tab label="Completed" {...a11yProps(2)} />
                            <Tab label="Canceled" {...a11yProps(3)} />
                        </Tabs>
                    </Col>
                </Row>
                <CustomTabPanel tabIndex={tabIndex} index={0}>
                    {/* Pending */}
                    <Row className="mt-3">
                        <Col className="mb-5 mb-xl-0">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Pending</h3>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <DataTable
                                        columns={columns}
                                        data={row}
                                        pagination
                                        responsive="true"
                                        striped="true"
                                        pointerOnHover="true"
                                        highlightOnHover="true"
                                        fixedHeader="true"
                                        onRowClicked={(row) => {
                                            navigate(
                                                `/admin/order/detail/${row.id}`
                                            );
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CustomTabPanel>
                <CustomTabPanel tabIndex={tabIndex} index={1}>
                    {/* Processing */}
                    <Row className="mt-3">
                        <Col className="mb-5 mb-xl-0">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Processing</h3>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <DataTable
                                        columns={columns}
                                        data={row}
                                        pagination
                                        responsive="true"
                                        striped="true"
                                        pointerOnHover="true"
                                        highlightOnHover="true"
                                        fixedHeader="true"
                                        onRowClicked={(row) => {
                                            navigate(
                                                `/admin/order/detail/${row.id}`
                                            );
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CustomTabPanel>
                <CustomTabPanel tabIndex={tabIndex} index={2}>
                    {/* Completed */}
                    <Row className="mt-3">
                        <Col className="mb-5 mb-xl-0">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Completed</h3>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <DataTable
                                        columns={columns}
                                        data={row}
                                        pagination
                                        responsive="true"
                                        striped="true"
                                        pointerOnHover="true"
                                        highlightOnHover="true"
                                        fixedHeader="true"
                                        onRowClicked={(row) => {
                                            navigate(
                                                `/admin/order/detail/${row.id}`
                                            );
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CustomTabPanel>
                <CustomTabPanel tabIndex={tabIndex} index={3}>
                    {/* Canceled */}
                    <Row className="mt-3">
                        <Col className="mb-5 mb-xl-0">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Canceled</h3>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <DataTable
                                        columns={columns}
                                        data={row}
                                        pagination
                                        responsive="true"
                                        striped="true"
                                        pointerOnHover="true"
                                        highlightOnHover="true"
                                        fixedHeader="true"
                                        onRowClicked={(row) => {
                                            navigate(
                                                `/admin/order/detail/${row.id}`
                                            );
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CustomTabPanel>
            </Container>
        </>
    );
};

export default Order;
