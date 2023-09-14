import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
    Card,
    CardHeader,
    CardTitle,
    Container,
    Row,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    Button,
    Label,
    CardBody,
    FormGroup,
} from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import APIService from "../../service/APIService";
import TotalMotorsCard from "components/Common/TotalMotorsCard";
import { toast } from "react-toastify";

const Motorcycle = () => {
    const [searchKey, setSearchKey] = useState("");
    const [motorData, setMotorData] = useState(undefined);
    const [selectedMotor, setSelectedMotor] = useState({});
    const [plateError, setPlateError] = useState(false);
    const [row, setRow] = useState(undefined);
    const [modal, setModal] = useState(false);
    const [deliverymans, setDeliverymans] = useState([]);
    const [selectedDeliveryman, setSelectedDeliveryman] = useState("");

    const [confirmModal, setConfirmModal] = useState(false);

    const toggle = () => setModal(!modal);
    const confirmModalToggle = () => setConfirmModal(!confirmModal);

    const getDeliverymans = () => {
        APIService.get("/deliveryman/unassigned")
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setDeliverymans(response.data);
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    const getMotors = () => {
        APIService.post("/motor/list", { searchKey: searchKey }).then((res) => {
            if (res.status === 200) {
                setMotorData(res.data.data);
            }
        });
    };

    const handleUpdateButton = (idx) => {
        setSelectedMotor(motorData[idx]);
        setSelectedDeliveryman(motorData[idx].delivery_man?.id);
        setModal(true);
    };

    const handleSave = () => {
        if (!selectedMotor.plate) {
            setPlateError(true);
            return;
        } else {
            setPlateError(false);
            const deliverymanId = selectedDeliveryman;
            APIService.post("/motor/save", {
                ...selectedMotor,
                deliverymanId,
            })
                .then((res) => {
                    const response = res.data;
                    if (response.success) {
                        setModal(false);
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
                        getMotors();
                    }
                })
                .catch((err) => console.log("error: ", err));
        }
    };

    const handleDelete = () => {
        APIService.post("/motor/delete", {
            id: selectedMotor.id,
        })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    confirmModalToggle();
                    getMotors();
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    const columns = [
        {
            name: "Plate",
            selector: (row) => row.plate,
        },
        {
            name: "Chassis",
            selector: (row) => row.chassis,
        },
        {
            name: "Brand",
            selector: (row) => row.brand,
        },
        {
            name: "Model",
            selector: (row) => row.model,
        },
        {
            name: "Engine",
            selector: (row) => row.engine,
        },
        {
            name: "Color",
            selector: (row) => row.color,
        },
        {
            name: "Delivery man",
            selector: (row) =>
                row.deliveryman
                    ? `${row.deliveryman.name}(${row.deliveryman.phone})`
                    : "",
        },
        {
            name: "Control",
            selector: (row) => (
                <>
                    <Button
                        color="info"
                        onClick={() => {
                            handleUpdateButton(row.index);
                        }}
                        size="sm"
                    >
                        Update
                    </Button>
                    <Button
                        color="danger"
                        onClick={() => {
                            setSelectedMotor(motorData[row.index]);
                            confirmModalToggle();
                        }}
                        size="sm"
                    >
                        Delete
                    </Button>
                </>
            ),
        },
        // Add more columns based on your data
    ];

    useEffect(() => {
        getMotors();
        getDeliverymans();
    }, []);

    useEffect(() => {
        const rows = motorData
            ? motorData.map((motor, index) => ({
                  id: motor.id,
                  plate: motor.plate,
                  chassis: motor.chassis,
                  brand: motor.brand,
                  model: motor.model,
                  engine: motor.engine,
                  color: motor.color,
                  deliveryman: motor.delivery_man,
                  index: index,
              }))
            : [];
        setRow(rows);
    }, [motorData]);

    useEffect(() => {
        getMotors();
    }, [searchKey]);

    return (
        <>
            <Container fluid>
                <Row className="mt-3">
                    <Col className="col-md-9 mb-2 mb-xl-2">
                        <CardTitle
                            tag="h1"
                            className="text-uppercase text-dark mt-4"
                        >
                            Motorcycle
                        </CardTitle>
                    </Col>
                    <Col className="col-md-3 mb-2 mb-xl-2">
                        <TotalMotorsCard />
                    </Col>
                </Row>

                <Card className="shadow">
                    <CardHeader className="border-0">
                        <Row>
                            <div className="col-md-4">
                                <CardTitle
                                    tag="h2"
                                    className="text-uppercase text-danger mb-0"
                                >
                                    MOTORCYCLE
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
                                        setSelectedMotor({});
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
                        />
                    </CardBody>
                </Card>
            </Container>
            {/* motor register modal */}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    <h1>Motorcycle</h1>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Plate</Label>
                        <Input
                            className={plateError ? "is-invalid" : ""}
                            value={selectedMotor.plate}
                            onChange={(e) => {
                                setSelectedMotor((prevState) => ({
                                    ...prevState,
                                    plate: e.target.value,
                                }));
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Chassis</Label>
                        <Input
                            value={selectedMotor.chassis}
                            onChange={(e) => {
                                setSelectedMotor((prevState) => ({
                                    ...prevState,
                                    chassis: e.target.value,
                                }));
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Brand</Label>
                        <Input
                            value={selectedMotor.brand}
                            onChange={(e) => {
                                setSelectedMotor((prevState) => ({
                                    ...prevState,
                                    brand: e.target.value,
                                }));
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Model</Label>
                        <Input
                            value={selectedMotor.model}
                            onChange={(e) => {
                                setSelectedMotor((prevState) => ({
                                    ...prevState,
                                    model: e.target.value,
                                }));
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Engine</Label>
                        <Input
                            value={selectedMotor.engine}
                            onChange={(e) => {
                                setSelectedMotor((prevState) => ({
                                    ...prevState,
                                    engine: e.target.value,
                                }));
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Color</Label>
                        <Input
                            value={selectedMotor.color}
                            onChange={(e) => {
                                setSelectedMotor((prevState) => ({
                                    ...prevState,
                                    color: e.target.value,
                                }));
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Delivery man</Label>
                        <Input
                            type="select"
                            value={selectedDeliveryman}
                            onChange={(e) => {
                                setSelectedDeliveryman(e.target.value);
                            }}
                        >
                            <option value="">Select Delivery man</option>
                            {deliverymans.map((deliveryman, index) => (
                                <option key={index} value={deliveryman.id}>
                                    {`${deliveryman.name}(${deliveryman.phone})`}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave}>
                        SAVE
                    </Button>{" "}
                    <Button color="secondary" onClick={toggle}>
                        CANCEL
                    </Button>
                </ModalFooter>
            </Modal>
            {/* motor register modal */}

            {/* delete motor dialog */}
            <Modal isOpen={confirmModal} toggle={confirmModalToggle}>
                <ModalHeader toggle={confirmModalToggle}>
                    <h1>Are you sure?</h1>
                </ModalHeader>
                <ModalBody>
                    <h3>Do you want to delete this motor?</h3>
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
            {/* delete motor dialog */}
        </>
    );
};

export default Motorcycle;
