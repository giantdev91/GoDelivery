import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Container,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Col,
    Button,
    Input,
    Label,
    FormGroup,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import APIService from "../../service/APIService";
import TotalMotorsCard from "components/Common/TotalMotorsCard";
import { toast } from "react-toastify";
import { formatedDate } from "utils/commonFunction";

const Deliveryman = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [searchKey, setSearchKey] = useState("");

    const confirmModalToggle = () => setConfirmModal(!confirmModal);
    const toggle = () => setModal(!modal);

    const [deliverymanData, setDeliverymanData] = useState([]);
    const [selectedDeliveryman, setSelectedDeliveryman] = useState({});
    const [row, setRow] = useState([]);
    const [phoneError, setPhoneError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const fetchDeliverymanList = () => {
        APIService.post("/deliveryman/deliverymanlist", {
            searchKey: searchKey,
        }).then((res) => {
            if (res.status === 200) {
                setDeliverymanData(res.data.data);
            }
        });
    };

    const validateForm = () => {
        let flag = true;
        if (!selectedDeliveryman.phone) {
            setPhoneError(true);
            flag = false;
        } else {
            setPhoneError(false);
        }
        if (!selectedDeliveryman.name) {
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
                id: selectedDeliveryman.id,
                phone: selectedDeliveryman.phone,
                name: selectedDeliveryman.name,
                password: "123456",
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
                        fetchDeliverymanList();
                    }
                })
                .catch((err) => {
                    console.log("error: ", err);
                });
        }
    };

    const handleUpdateButton = (idx) => {
        setSelectedDeliveryman(deliverymanData[idx]);
        toggle();
    };

    const handleDelete = () => {
        APIService.post("/deliveryman/delete", {
            id: selectedDeliveryman.id,
        })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    confirmModalToggle();
                    fetchDeliverymanList();
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    useEffect(() => {
        const rows = deliverymanData
            ? deliverymanData.map((data, index) => ({
                  id: data.id,
                  index: index,
                  phone: data.phone,
                  name: data.name,
                  motor: data.motor?.plate,
                  startedAt: formatedDate(new Date(data.createdAt)),
                  status: data.status === 0 ? "Idle" : "Processing",
                  completeOrder: data.orders.filter(
                      (order) => order.status === 3
                  ).length,
                  rate:
                      data.orders.length > 0
                          ? (
                                data.orders.reduce(
                                    (total, order) => total + order.rate,
                                    0
                                ) /
                                data.orders.filter((order) => order.rate).length
                            ).toFixed(2)
                          : 0,
                  // Add more fields based on your data
              }))
            : [];
        setRow(rows);
    }, [deliverymanData]);

    useEffect(() => {
        fetchDeliverymanList();
    }, []);

    useEffect(() => {
        fetchDeliverymanList();
    }, [searchKey]);

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
        {
            name: "Control",
            selector: (row) => (
                <>
                    <Button
                        color="info"
                        size="sm"
                        onClick={() => {
                            handleUpdateButton(row.index);
                        }}
                    >
                        Update
                    </Button>
                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => {
                            setSelectedDeliveryman(deliverymanData[row.index]);
                            confirmModalToggle();
                        }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
        // Add more columns based on your data
    ];

    return (
        <>
            <Container fluid>
                <Row className="mt-3">
                    <Col className="col-md-9 mb-2 mb-xl-2">
                        <CardTitle
                            tag="h1"
                            className="text-uppercase text-dark mt-4"
                        >
                            Delivery man
                        </CardTitle>
                    </Col>
                    <Col className="col-md-3 mb-2 mb-xl-2">
                        <TotalMotorsCard />
                    </Col>
                </Row>
                <Row className="">
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col-md-4">
                                        <CardTitle
                                            tag="h2"
                                            className="text-uppercase text-danger mb-0"
                                        >
                                            Delivery man
                                        </CardTitle>
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fa fa-search" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Search..."
                                                value={searchKey}
                                                onChange={(e) =>
                                                    setSearchKey(e.target.value)
                                                }
                                            />
                                        </InputGroup>
                                    </div>
                                    <div className="col text-right">
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={() => {
                                                setSelectedDeliveryman({});
                                                toggle();
                                            }}
                                            size="md"
                                        >
                                            REGISTER
                                        </Button>
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
                                            `/admin/deliveryman/detail/${row.id}`
                                        );
                                    }}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>{" "}
            </Container>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    <h1>Delivery man Register</h1>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Phone Number</Label>
                        <Input
                            placeholder="Phone"
                            className={phoneError ? "is-invalid" : ""}
                            value={selectedDeliveryman.phone}
                            onChange={(e) => {
                                setSelectedDeliveryman((prevState) => ({
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
                            value={selectedDeliveryman.name}
                            onChange={(e) => {
                                setSelectedDeliveryman((prevState) => ({
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

export default Deliveryman;
