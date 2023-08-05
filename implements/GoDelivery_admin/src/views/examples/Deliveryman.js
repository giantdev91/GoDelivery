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
} from "reactstrap";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

const Deliveryman = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [deliverymanData, setDeliverymanData] = useState(undefined);
  const [row, setRow] = useState(undefined);
  useEffect(() => {
    axios
      .post(`http://localhost:4000/deliveryman/deliverymanlist`)
      .then((res) => {
        console.log("response:", res);
        if (res.status === 200) {
          console.log("a", res.data);
          setDeliverymanData(res.data.data);
        }
      });
  }, []);

  useEffect(() => {
    const rows = deliverymanData
      ? deliverymanData.map((client) => ({
          phone: client.phone,
          name: client.name,
          startedAt: new Date(client.createdAt).toLocaleString(),
          status: client.status === 0 ? "Idle" : "Processing",
          completeOrder: client.orders.filter((order) => order.status === 4)
            .length,
          rate:
            client.orders.length > 0
              ? (
                  client.orders.reduce(
                    (total, order) => total + order.rate,
                    0
                  ) / client.orders.length
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
          <ModalHeader toggle={toggle}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
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
                      size="sm"
                    >
                      Register
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <DataTable columns={columns} data={row} pagination />
            </Card>
          </Col>
        </Row>{" "}
      </Container>
    </>
  );
};

export default Deliveryman;
