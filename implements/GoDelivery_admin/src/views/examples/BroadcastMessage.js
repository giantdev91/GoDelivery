// import { url } from "../../utils/secrets";

import DataTable from "react-data-table-component";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    Table,
    Container,
    Row,
    Col,
    Button,
    Pagination,
    PaginationItem,
    PaginationLink,
    CardFooter,
} from "reactstrap";
import APIService from "../../service/APIService";
import HeaderCard from "components/Headers/HeaderCard";

const BroadcastMessage = () => {
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
