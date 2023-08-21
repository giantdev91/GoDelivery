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
import DataTable from "react-data-table-component";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Table,
    Container,
    Row,
    Col,
    Button,
    Input,
    Label,
} from "reactstrap";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import APIService from "../../service/APIService";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";

const Deliveryman = () => {
    const [modal, setModal] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [motor, setMotor] = useState("");

    const toggle = () => setModal(!modal);

    const [deliverymanData, setDeliverymanData] = useState(undefined);
    const [row, setRow] = useState(undefined);

    const fetchDeliverymanList = () => {
        APIService.post("/deliveryman/deliverymanlist").then((res) => {
            console.log("response:", res);
            if (res.status === 200) {
                console.log("a", res.data);
                setDeliverymanData(res.data.data);
            }
        });
    };
    useEffect(() => {
        fetchDeliverymanList();
    }, []);

    const registerNewUser = () => {
        APIService.post("/deliveryman/signup", {
            phone: newPhone,
            name: newUsername,
            password: "123456",
            motor: motor,
        })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setModal(false);
                    NotificationManager.success("Save Success");
                    fetchDeliverymanList();
                }
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    };

    useEffect(() => {
        const rows = deliverymanData
            ? deliverymanData.map((client) => ({
                  phone: client.phone,
                  name: client.name,
                  motor: client.motor,
                  startedAt: new Date(client.createdAt).toLocaleString(),
                  status: client.status === 0 ? "Idle" : "Processing",
                  completeOrder: client.orders.filter(
                      (order) => order.status === 3
                  ).length,
                  rate:
                      client.orders.length > 0
                          ? (
                                client.orders.reduce(
                                    (total, order) => total + order.rate,
                                    0
                                ) /
                                client.orders.filter((order) => order.rate)
                                    .length
                            ).toFixed(2)
                          : 0,
                  // Add more fields based on your data
              }))
            : [];
        setRow(rows);
    }, [deliverymanData]);

    const columns = [
        {
            name: "Phone",
            selector: (row) => row.phone,
        },
        {
            name: "Name",
            selector: (row) => row.name,
        },
        {
            name: "Motorcycle",
            selector: (row) => row.motor,
        },
        {
            name: "Started At",
            selector: (row) => row.startedAt,
        },
        {
            name: "Status",
            selector: (row) => row.status,
        },
        {
            name: "Complete Orders",
            selector: (row) => row.completeOrder,
        },
        {
            name: "Rate",
            selector: (row) => row.rate,
        },
        // Add more columns based on your data
    ];

    return (
        <>
            {/* <Header /> */}
            {/* Page content */}
            <Container fluid>
                {/* Table */}
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                        <h1>Delivery man Register</h1>
                    </ModalHeader>
                    <ModalBody>
                        <Label>Phone Number</Label>
                        <Input
                            placeholder="Phone"
                            value={newPhone}
                            onChange={(e) => {
                                setNewPhone(e.target.value);
                            }}
                        />
                        <Label className="mt-2">User Name</Label>
                        <Input
                            placeholder="user name"
                            value={newUsername}
                            onChange={(e) => {
                                setNewUsername(e.target.value);
                            }}
                        />
                        <Label className="mt-2">Motorcycle</Label>
                        <Input
                            placeholder="motorcycle"
                            value={motor}
                            onChange={(e) => {
                                setMotor(e.target.value);
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={registerNewUser}>
                            REGISTER
                        </Button>{" "}
                        <Button color="secondary" onClick={toggle}>
                            CANCEL
                        </Button>
                    </ModalFooter>
                </Modal>
                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Delivery man</h3>
                                    </div>
                                    <div className="col text-right">
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={toggle}
                                            size="md"
                                        >
                                            REGISTER
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <DataTable
                                columns={columns}
                                data={row}
                                pagination
                            />
                        </Card>
                    </Col>
                </Row>{" "}
            </Container>
        </>
    );
};

export default Deliveryman;
