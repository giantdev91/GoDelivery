import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Container,
    Row,
    Col,
    Button,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
} from "reactstrap";

import APIService from "../../service/APIService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import DeliverymanDetailHeader from "components/DeliverymanDetail/DeliverymanDetailHeader";
import DeliverymanDetailMonthlyStatus from "components/DeliverymanDetail/DeliverymanDetailMonthlyStatus";
import DeliverymanDetailDailyStatus from "components/DeliverymanDetail/DeliverymanDetailDailyStatus";
import { useNavigate } from "react-router-dom";

const DeliverymanDetail = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [data, setData] = useState({});
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    const [phoneError, setPhoneError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const toggle = () => setModal(!modal);
    const confirmModalToggle = () => setConfirmModal(!confirmModal);

    const getDeliverymanDetail = () => {
        APIService.get(`/deliveryman/${id}`)
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setData(response.data);
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    const updateDeliverymanStatus = (userStatus) => {
        APIService.post("/deliveryman/updateUserStatus", {
            deliverymanId: id,
            userStatus: userStatus,
        })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    getDeliverymanDetail();
                    toast.success("Update Success!", {
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
    };

    const validateForm = () => {
        let flag = true;
        if (!data.phone) {
            setPhoneError(true);
            flag = false;
        } else {
            setPhoneError(false);
        }
        if (!data.name) {
            setNameError(true);
            flag = false;
        } else {
            setNameError(false);
        }
        return flag;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        } else {
            APIService.post("/deliveryman/signup", {
                id: data.id,
                phone: data.phone,
                name: data.name,
            })
                .then((res) => {
                    const response = res.data;
                    if (response.success) {
                        toggle();
                        toast.success("Save Success!", {
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
                .catch((err) => {
                    console.log("error: ", err);
                });
        }
    };

    const handleDelete = () => {
        APIService.post("/deliveryman/delete", {
            id: data.id,
        })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    confirmModalToggle();
                    navigate(`/admin/deliveryman`);
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    useEffect(() => {
        getDeliverymanDetail();
    }, [id]);

    return (
        <>
            <Container fluid>
                <DeliverymanDetailHeader deliverymanDetail={data} />
                <DeliverymanDetailMonthlyStatus id={data.id} />
                <DeliverymanDetailDailyStatus id={data.id} />
                <Row className="mt-3 mb-5">
                    <Col className="col-md-12">
                        <Card className="shadow">
                            <CardBody className="text-right">
                                <Button
                                    color="success"
                                    onClick={() => updateDeliverymanStatus(0)}
                                >
                                    ACTIVE
                                </Button>
                                <Button
                                    color="warning"
                                    onClick={() => updateDeliverymanStatus(1)}
                                >
                                    INACTIVE
                                </Button>
                                <Button
                                    color="default"
                                    onClick={() => updateDeliverymanStatus(2)}
                                >
                                    SUSPEND
                                </Button>
                                <Button color="primary" onClick={toggle}>
                                    EDIT
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={confirmModalToggle}
                                >
                                    DELETE
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    <h1>Delivery man Information</h1>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Phone Number</Label>
                        <Input
                            placeholder="Phone"
                            className={phoneError ? "is-invalid" : ""}
                            value={data.phone}
                            onChange={(e) => {
                                setData((prevState) => ({
                                    ...prevState,
                                    phone: e.target.value,
                                }));
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>User Name</Label>
                        <Input
                            placeholder="user name"
                            className={nameError ? "is-invalid" : ""}
                            value={data.name}
                            onChange={(e) => {
                                setData((prevState) => ({
                                    ...prevState,
                                    name: e.target.value,
                                }));
                            }}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave}>
                        SAVE
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        CANCEL
                    </Button>
                </ModalFooter>
            </Modal>

            {/* delete delivery man dialog */}
            <Modal isOpen={confirmModal} toggle={confirmModalToggle}>
                <ModalHeader toggle={confirmModalToggle}>
                    <h1>Are you sure?</h1>
                </ModalHeader>
                <ModalBody>
                    <h3>Do you want to delete this delivery man?</h3>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleDelete}>
                        CONFIRM
                    </Button>{" "}
                    <Button color="secondary" onClick={confirmModalToggle}>
                        CANCEL
                    </Button>
                </ModalFooter>
            </Modal>
            {/* delete delivery man dialog */}
        </>
    );
};

export default DeliverymanDetail;
