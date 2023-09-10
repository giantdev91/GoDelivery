import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardFooter,
    Container,
    Row,
    Col,
    Button,
    FormGroup,
    Input,
} from "reactstrap";
import APIService from "../../service/APIService";
import { ToastContainer, toast } from "react-toastify";

const BroadcastMessage = () => {
    const defaultNotificationData = {
        title: "",
        content: "",
    };
    const [systemNotification, setSystemNotification] = useState({});
    const [errorFlag, setErrorFlag] = useState(defaultNotificationData);

    const validateForm = () => {
        let flag = true;
        if (!systemNotification.title) {
            flag = false;
            setErrorFlag((prevState) => ({
                ...prevState,
                title: true,
            }));
        } else {
            setErrorFlag((prevState) => ({
                ...prevState,
                title: false,
            }));
        }

        if (!systemNotification.content) {
            flag = false;
            setErrorFlag((prevState) => ({
                ...prevState,
                content: true,
            }));
        } else {
            setErrorFlag((prevState) => ({
                ...prevState,
                content: false,
            }));
        }

        return flag;
    };

    const handleSave = () => {
        if (validateForm()) {
            APIService.post("/systemNotification/save", systemNotification)
                .then((res) => {
                    const response = res.data;
                    if (response.success) {
                        setSystemNotification(defaultNotificationData);
                        toast.success("Send Success!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    }
                })
                .catch((err) => console.log("error: ", err));
        }
    };

    return (
        <>
            <Container fluid>
                <Row className="mt-3">
                    <Col className="col-md-9 mb-2 mb-xl-2">
                        <CardTitle
                            tag="h1"
                            className="text-uppercase text-dark mt-4"
                        >
                            Broadcast Message
                        </CardTitle>
                    </Col>
                </Row>
                {/* Table */}
                <Row className="">
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        {/* <h3 className="mb-0">Clients</h3> */}
                                        <CardTitle
                                            tag="h2"
                                            className="text-uppercase text-danger mb-0"
                                        >
                                            Write a message
                                        </CardTitle>
                                        <CardBody>
                                            <FormGroup>
                                                <Input
                                                    className={
                                                        errorFlag.title
                                                            ? "is-invalid"
                                                            : ""
                                                    }
                                                    placeholder="title"
                                                    value={
                                                        systemNotification[
                                                            "title"
                                                        ]
                                                    }
                                                    onChange={(e) => {
                                                        setSystemNotification(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                title: e.target
                                                                    .value,
                                                            })
                                                        );
                                                    }}
                                                />
                                                <Input
                                                    value={
                                                        systemNotification[
                                                            "content"
                                                        ]
                                                    }
                                                    className={`${
                                                        errorFlag.content
                                                            ? "is-invalid"
                                                            : ""
                                                    } mt-3`}
                                                    placeholder="Message..."
                                                    type="textarea"
                                                    onChange={(e) => {
                                                        setSystemNotification(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                content:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        );
                                                    }}
                                                    style={{ height: "400px" }}
                                                />
                                            </FormGroup>
                                        </CardBody>
                                        <CardFooter>
                                            <Row>
                                                <Col className="text-right">
                                                    <Button
                                                        className="text-right"
                                                        color="primary"
                                                        href="#pablo"
                                                        size="md"
                                                        onClick={handleSave}
                                                    >
                                                        SEND
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </div>
                                </Row>
                            </CardHeader>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default BroadcastMessage;
