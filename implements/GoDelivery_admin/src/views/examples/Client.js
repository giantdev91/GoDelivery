// import { url } from "../../utils/secrets";

import DataTable from "react-data-table-component";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
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

const Client = () => {
    const [clientData, setClientData] = useState(undefined);
    const [row, setRow] = useState(undefined);
    useEffect(() => {
        APIService.post("/client/searchclient").then((res) => {
            if (res.status === 200) {
                setClientData(res.data.data);
            }
        });
    }, []);

    useEffect(() => {
        console.log("clientData", clientData);
        const rows = clientData
            ? clientData.map((client) => ({
                  phone: client.phone,
                  name: client.name,
                  startedAt: new Date(client.createdAt).toLocaleString(),
                  totalSpent:
                      client.orders.reduce(
                          (total, order) => total + order.price,
                          0
                      ) + "MT",
                  totalOrders: client.orders.length,
                  // Add more fields based on your data
              }))
            : [];
        setRow(rows);
    }, [clientData]);

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
                {/* Table */}
                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Clients</h3>
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
                </Row>
            </Container>
        </>
    );
};

export default Client;
