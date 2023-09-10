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
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    CardBody,
} from "reactstrap";
import APIService from "../../service/APIService";
import HeaderCard from "components/Headers/HeaderCard";
import TotalUsersCard from "components/Common/TotalUsersCard";
import { formatedDate } from "utils/commonFunction";

const Client = () => {
    const [searchKey, setSearchKey] = useState("");
    const [clientData, setClientData] = useState(undefined);
    const [row, setRow] = useState(undefined);

    const getClientList = () => {
        APIService.post("/client/searchclient", { searchKey: searchKey }).then(
            (res) => {
                if (res.status === 200) {
                    setClientData(res.data.data);
                }
            }
        );
    };
    useEffect(() => {
        getClientList();
    }, []);

    useEffect(() => {
        console.log("clientData", clientData);
        const rows = clientData
            ? clientData.map((client) => ({
                  phone: client.phone,
                  name: client.name,
                  startedAt: formatedDate(new Date(client.createdAt)),
                  totalSpent:
                      client.orders.reduce(
                          (total, order) => total + order.price,
                          0
                      ) + " MZN",
                  totalOrders: client.orders.length,
                  // Add more fields based on your data
              }))
            : [];
        setRow(rows);
    }, [clientData]);

    useEffect(() => {
        getClientList();
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
            name: "Started At",
            selector: (row) => row.startedAt,
        },
        {
            name: "Total Spent",
            selector: (row) => row.totalSpent,
        },
        {
            name: "Total Orders",
            selector: (row) => row.totalOrders,
        },
        // Add more columns based on your data
    ];

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
                            Clients
                        </CardTitle>
                    </Col>
                    <Col className="col-md-3 mb-2 mb-xl-2">
                        <TotalUsersCard />
                    </Col>
                </Row>
                {/* Table */}
                <Row className="">
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col-md-4">
                                        {/* <h3 className="mb-0">Clients</h3> */}
                                        <CardTitle
                                            tag="h2"
                                            className="text-uppercase text-danger mb-0"
                                        >
                                            Clients
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
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <DataTable
                                    columns={columns}
                                    data={row}
                                    pagination
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Client;
