import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
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
} from "reactstrap";

import APIService from "../../service/APIService";
import TotalMotorsCard from "components/Common/TotalMotorsCard";
import { toast } from "react-toastify";
import { formatedDate } from "utils/commonFunction";
import { useParams } from "react-router-dom";
import DeliverymanDetailHeader from "components/DeliverymanDetail/DeliverymanDetailHeader";
import DeliverymanDetailMonthlyStatus from "components/DeliverymanDetail/DeliverymanDetailMonthlyStatus";
import DeliverymanDetailDailyStatus from "components/DeliverymanDetail/DeliverymanDetailDailyStatus";

const DeliverymanDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

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

    useEffect(() => {
        getDeliverymanDetail();
    }, []);
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
                                <Button color="success">ACTIVE</Button>
                                <Button color="warning">INACTIVE</Button>
                                <Button color="default">SUSPEND</Button>
                                <Button color="primary">EDIT</Button>
                                <Button color="danger">DELETE</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DeliverymanDetail;
