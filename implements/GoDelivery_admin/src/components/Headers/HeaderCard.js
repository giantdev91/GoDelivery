import { Card, CardBody, Row, Col } from "reactstrap";

const HeaderCard = ({ title, value, icon }) => {
    return (
        <Card className="shadow">
            <CardBody className="py-2">
                <Row className="mt-2">
                    <Col className="md-6">{icon}</Col>
                    <Col className="md-6">
                        <p className="valueText mb-0">{value}</p>
                    </Col>
                </Row>
                <h2 className="text-danger">{title}</h2>
            </CardBody>
        </Card>
    );
};

export default HeaderCard;
