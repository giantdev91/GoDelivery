/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import axios from "axios";

import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    Table,
    Container,
    Row,
    Col,
    Button,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import APIService from "../../service/APIService";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TotalOrdersCard from "components/Common/TotalOrdersCard";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <div>{children}</div>}
        </div>
    );
}

const Order = () => {
    const [orderData, setOrderData] = useState(undefined);
    const [value, setValue] = useState(0);
    useEffect(() => {
        APIService.post("/order/list").then((res) => {
            setOrderData(res.data.data);
        });
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            {/* <Header /> */}
            {/* Page content */}
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
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Pending" {...a11yProps(0)} />
                        <Tab label="Processing" {...a11yProps(1)} />
                        <Tab label="Completed" {...a11yProps(2)} />
                        <Tab label="Canceled" {...a11yProps(3)} />
                    </Tabs>
                </Row>
                <CustomTabPanel value={value} index={0}>
                    {/* Pending */}
                    <Row className="mt-5">
                        <Col className="mb-5 mb-xl-0">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Pending</h3>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <Table
                                    className="align-items-center table-flush"
                                    responsive
                                >
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Sender</th>
                                            <th scope="col">Reciever</th>
                                            <th scope="col">from</th>
                                            <th scope="col">To</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Created</th>
                                        </tr>
                                    </thead>
                                    {orderData !== undefined
                                        ? orderData.map((object) => {
                                              const date = new Date(
                                                  object.createdAt
                                              );
                                              const dateString =
                                                  date.toLocaleString();
                                              const date1 = new Date(
                                                  object.expectationTime
                                              );
                                              const dateString1 =
                                                  date.toLocaleString();
                                              return object.status === 0 ? (
                                                  <tbody>
                                                      <tr>
                                                          <td>
                                                              {
                                                                  object.client
                                                                      .phone
                                                              }
                                                          </td>
                                                          <td>
                                                              {object.receiver}
                                                          </td>
                                                          <td>{object.from}</td>
                                                          <td>{object.to}</td>
                                                          <td>
                                                              {object.price} MT
                                                          </td>
                                                          <td>{dateString}</td>
                                                      </tr>
                                                  </tbody>
                                              ) : null;
                                          })
                                        : null}
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    {/* Processing */}
                    <Row className="mt-5">
                        <Col className="mb-5 mb-xl-0">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Processing</h3>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <Table
                                    className="align-items-center table-flush"
                                    responsive
                                >
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Sender</th>
                                            <th scope="col">Reciever</th>
                                            <th scope="col">from</th>
                                            <th scope="col">To</th>
                                            <th scope="col">Delivery man</th>
                                            <th scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    {orderData !== undefined
                                        ? orderData.map((object) => {
                                              const date = new Date(
                                                  object.createdAt
                                              );
                                              const dateString =
                                                  date.toLocaleString();
                                              const date1 = new Date(
                                                  object.expectationTime
                                              );
                                              const dateString1 =
                                                  date1.toLocaleString();
                                              if (
                                                  object.status === 1 ||
                                                  object.status === 2
                                              )
                                                  return (
                                                      <tbody>
                                                          <tr>
                                                              <td>
                                                                  {
                                                                      object
                                                                          .client
                                                                          .phone
                                                                  }
                                                              </td>
                                                              <td>
                                                                  {
                                                                      object.receiver
                                                                  }
                                                              </td>
                                                              <td>
                                                                  {object.from}
                                                              </td>
                                                              <td>
                                                                  {object.to}
                                                              </td>
                                                              <td>
                                                                  {
                                                                      object
                                                                          .delivery_man
                                                                          .name
                                                                  }
                                                                  (
                                                                  {
                                                                      object
                                                                          .delivery_man
                                                                          .phone
                                                                  }
                                                                  )
                                                              </td>
                                                              <td>
                                                                  {object.price}{" "}
                                                                  MT
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  );
                                              else return null;
                                          })
                                        : null}
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    {/* Completed */}
                    <Row className="mt-5">
                        <Col className="mb-5 mb-xl-0">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Completed</h3>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <Table
                                    className="align-items-center table-flush"
                                    responsive
                                >
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Sender</th>
                                            <th scope="col">Reciever</th>
                                            <th scope="col">from</th>
                                            <th scope="col">To</th>
                                            <th scope="col">Delivery man</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Rate</th>
                                        </tr>
                                    </thead>
                                    {orderData !== undefined
                                        ? orderData.map((object) => {
                                              const date = new Date(
                                                  object.createdAt
                                              );
                                              const dateString =
                                                  date.toLocaleString();
                                              const date1 = new Date(
                                                  object.expectationTime
                                              );
                                              const dateString1 =
                                                  date1.toLocaleString();
                                              if (object.status === 3)
                                                  return (
                                                      <tbody>
                                                          <tr>
                                                              <td>
                                                                  {
                                                                      object
                                                                          .client
                                                                          .phone
                                                                  }
                                                              </td>
                                                              <td>
                                                                  {
                                                                      object.receiver
                                                                  }
                                                              </td>
                                                              <td>
                                                                  {object.from}
                                                              </td>
                                                              <td>
                                                                  {object.to}
                                                              </td>
                                                              <td>
                                                                  {
                                                                      object
                                                                          .delivery_man
                                                                          .name
                                                                  }
                                                                  (
                                                                  {
                                                                      object
                                                                          .delivery_man
                                                                          .phone
                                                                  }
                                                                  )
                                                              </td>
                                                              <td>
                                                                  {object.price}{" "}
                                                                  MT
                                                              </td>
                                                              <td>
                                                                  {object.rate}
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  );
                                              else return null;
                                          })
                                        : null}
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    {/* Canceled */}
                    <Row className="mt-5">
                        <Col className="mb-5 mb-xl-0">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Canceled</h3>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <Table
                                    className="align-items-center table-flush"
                                    responsive
                                >
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Sender</th>
                                            <th scope="col">Reciever</th>
                                            <th scope="col">from</th>
                                            <th scope="col">To</th>
                                            <th scope="col">Delivery man</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Canceled By</th>
                                            <th scope="col">Cancel Reason</th>
                                        </tr>
                                    </thead>
                                    {orderData !== undefined
                                        ? orderData.map((object) => {
                                              const date = new Date(
                                                  object.createdAt
                                              );
                                              const dateString =
                                                  date.toLocaleString();
                                              const date1 = new Date(
                                                  object.expectationTime
                                              );
                                              const dateString1 =
                                                  date1.toLocaleString();
                                              if (object.status === 4)
                                                  return (
                                                      <tbody>
                                                          <tr>
                                                              <td>
                                                                  {
                                                                      object
                                                                          .client
                                                                          .phone
                                                                  }
                                                              </td>
                                                              <td>
                                                                  {
                                                                      object.receiver
                                                                  }
                                                              </td>
                                                              <td>
                                                                  {object.from}
                                                              </td>
                                                              <td>
                                                                  {object.to}
                                                              </td>
                                                              <td>
                                                                  {
                                                                      object
                                                                          .delivery_man
                                                                          .name
                                                                  }
                                                                  (
                                                                  {
                                                                      object
                                                                          .delivery_man
                                                                          .phone
                                                                  }
                                                                  )
                                                              </td>
                                                              <td>
                                                                  {object.price}{" "}
                                                                  MT
                                                              </td>
                                                              <td>
                                                                  {object.canceledBy ==
                                                                  0
                                                                      ? "client"
                                                                      : "delivery man"}
                                                              </td>
                                                              <td>
                                                                  {
                                                                      object.cancelReason
                                                                  }
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  );
                                              else return null;
                                          })
                                        : null}
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </CustomTabPanel>
            </Container>
        </>
    );
};

export default Order;
