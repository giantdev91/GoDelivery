import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Input,
    CardBody,
    Label,
} from "reactstrap";
import APIService from "../../service/APIService";
import { NotificationManager } from "react-notifications";

const SysSetting = () => {
    const [sysSetting, setSysSetting] = useState({});
    const [basePriceError, setBasePriceError] = useState(false);
    const [priceError, setPriceError] = useState(false);

    useEffect(() => {
        APIService.get("/sysSetting/get").then((res) => {
            if (res.status === 200) {
                const data = res.data.data;
                if (data) {
                    setSysSetting(data);
                }
            }
        });
    }, []);

    const validateForm = () => {
        var validFlag = true;
        if (!sysSetting.basePrice) {
            setBasePriceError(true);
            validFlag = false;
        } else {
            setBasePriceError(false);
        }
        if (!sysSetting.price) {
            setPriceError(true);
            validFlag = false;
        } else {
            setPriceError(false);
        }
        return validFlag;
    };

    const saveSetting = () => {
        if (validateForm) {
            APIService.post("/sysSetting/save", sysSetting).then((res) => {
                if (res.status === 200) {
                    if (res.data.success) {
                        const data = res.data.data;
                        if (data) {
                            NotificationManager.success("Save Success");
                            setSysSetting(data);
                        }
                    }
                }
            });
        }
    };

    return (
        <>
            {/* Page content */}
            <Container fluid>
                {/* Table */}
                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">System Setting</h3>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label>
                                                    For distances under 4KM,
                                                    this price applies.
                                                </Label>
                                                <Input
                                                    placeholder="Base Price"
                                                    value={sysSetting.basePrice}
                                                    valid={basePriceError}
                                                    onChange={(e) => {
                                                        setSysSetting(
                                                            (prev) => ({
                                                                ...prev,
                                                                basePrice:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        );
                                                    }}
                                                    type="number"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label>
                                                    For distances exceeding 4KM,
                                                    this price per distance
                                                    applies.
                                                </Label>
                                                <Input
                                                    placeholder="Price"
                                                    valid={priceError}
                                                    value={sysSetting.price}
                                                    onChange={(e) => {
                                                        setSysSetting(
                                                            (prev) => ({
                                                                ...prev,
                                                                price: e.target
                                                                    .value,
                                                            })
                                                        );
                                                    }}
                                                    type="number"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            size="md"
                                            onClick={saveSetting}
                                        >
                                            SAVE
                                        </Button>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SysSetting;
