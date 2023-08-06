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
// core components
import Header from "components/Headers/Header.js";

const Order = () => {
  const [orderData, setOrderData] = useState(undefined);
  useEffect(() => {
    axios.post(`http://localhost:3000/order/list`).then((res) => {
      setOrderData(res.data.data);
    });
  }, []);

  return (
    <>
      {/* <Header /> */}
      {/* Page content */}
      <Container fluid>
        {/* Pending */}
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Pending</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Sender</th>
                    <th scope="col">Reciever</th>
                    <th scope="col">from</th>
                    <th scope="col">To</th>
                    <th scope="col">Goods content</th>
                    <th scope="col">Expectation time</th>
                    <th scope="col">Created</th>
                  </tr>
                </thead>
                {orderData !== undefined
                  ? orderData.map((object) => {
                      const date = new Date(object.createdAt);
                      const dateString = date.toLocaleString();
                      const date1 = new Date(object.expectationTime);
                      const dateString1 = date.toLocaleString();
                      return object.status === 0 ? (
                        <tbody>
                          <tr>
                            <td>{object.sender}</td>
                            <td>{object.receiver}</td>
                            <td>{object.from}</td>
                            <td>{object.to}</td>
                            <td>{object.description}</td>
                            <td>{dateString1}</td>
                            <td>{dateString}</td>
                          </tr>
                        </tbody>
                      ) : null;
                    })
                  : null}
              </Table>
            </Card>
          </Col>
        </Row>
        {/* Processing */}
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Processing</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Sender</th>
                    <th scope="col">Reciever</th>
                    <th scope="col">from</th>
                    <th scope="col">To</th>
                    <th scope="col">Goods content</th>
                    <th scope="col">Expectation time</th>
                    <th scope="col">Delivery man</th>
                    <th scope="col">Spent Time</th>
                  </tr>
                </thead>
                {orderData !== undefined
                  ? orderData.map((object) => {
                      const date = new Date(object.createdAt);
                      const dateString = date.toLocaleString();
                      const date1 = new Date(object.expectationTime);
                      const dateString1 = date1.toLocaleString();
                      if (object.status === 2 || object.status === 3)
                        return (
                          <tbody>
                            <tr>
                              <td>{object.sender}</td>
                              <td>{object.receiver}</td>
                              <td>{object.from}</td>
                              <td>{object.to}</td>
                              <td>{object.description}</td>
                              <td>{dateString1}</td>
                              <td>{object.deliverymanID}</td>
                              <td>{object.spentTime}</td>
                            </tr>
                          </tbody>
                        );
                      else return null;
                    })
                  : null}
              </Table>
            </Card>
          </Col>
        </Row>
        {/* Completed */}
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Completed</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Sender</th>
                    <th scope="col">Reciever</th>
                    <th scope="col">from</th>
                    <th scope="col">To</th>
                    <th scope="col">Goods content</th>
                    <th scope="col">Expectation time</th>
                    <th scope="col">Spent Time</th>
                  </tr>
                </thead>
                {orderData !== undefined
                  ? orderData.map((object) => {
                      const date = new Date(object.createdAt);
                      const dateString = date.toLocaleString();
                      const date1 = new Date(object.expectationTime);
                      const dateString1 = date1.toLocaleString();
                      if (object.status === 4)
                        return (
                          <tbody>
                            <tr>
                              <td>{object.sender}</td>
                              <td>{object.receiver}</td>
                              <td>{object.from}</td>
                              <td>{object.to}</td>

                              <td>{object.description}</td>
                              <td>{dateString1}</td>
                              <td>{object.spentTime}</td>
                            </tr>
                          </tbody>
                        );
                      else return null;
                    })
                  : null}
              </Table>
            </Card>
          </Col>
        </Row>
        {/* Canceled */}
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Canceled</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Sender</th>
                    <th scope="col">Reciever</th>
                    <th scope="col">from</th>
                    <th scope="col">To</th>
                    <th scope="col">Goods content</th>
                    <th scope="col">Expectation time</th>
                    <th scope="col">CreatedAt</th>
                  </tr>
                </thead>
                {orderData !== undefined
                  ? orderData.map((object) => {
                      const date = new Date(object.createdAt);
                      const dateString = date.toLocaleString();
                      const date1 = new Date(object.expectationTime);
                      const dateString1 = date1.toLocaleString();
                      if (object.status === 5)
                        return (
                          <tbody>
                            <tr>
                              <td>{object.sender}</td>
                              <td>{object.receiver}</td>
                              <td>{object.from}</td>
                              <td>{object.to}</td>

                              <td>{object.description}</td>
                              <td>{dateString1}</td>
                              <td>{dateString}</td>
                            </tr>
                          </tbody>
                        );
                      else return null;
                    })
                  : null}
              </Table>
            </Card>
          </Col>
        </Row>
        {/* Failed */}
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Failed</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Sender</th>
                    <th scope="col">Reciever</th>
                    <th scope="col">from</th>
                    <th scope="col">To</th>
                    <th scope="col">Goods content</th>
                    <th scope="col">Expectation time</th>
                    <th scope="col">CreatedAt</th>
                  </tr>
                </thead>
                {orderData !== undefined
                  ? orderData.map((object) => {
                      const date = new Date(object.createdAt);
                      const dateString = date.toLocaleString();
                      const date1 = new Date(object.expectationTime);
                      const dateString1 = date1.toLocaleString();
                      if (object.status === 1)
                        return (
                          <tbody>
                            <tr>
                              <td>{object.sender}</td>
                              <td>{object.receiver}</td>
                              <td>{object.from}</td>
                              <td>{object.to}</td>
                              <td>{object.description}</td>
                              <td>{dateString1}</td>
                              <td>{dateString}</td>
                            </tr>
                          </tbody>
                        );
                      else return null;
                    })
                  : null}
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Order;
