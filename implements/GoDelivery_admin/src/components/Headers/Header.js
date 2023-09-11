import React from "react";
import { Card, CardBody, CardImg, CardTitle, CardText } from "reactstrap";

class Header extends React.Component {
    render() {
        return (
            <>
                <div className="card-deck">
                    <Card>
                        <CardImg
                            alt="..."
                            src={
                                require("../../assets/img/theme/sketch.jpg")
                                    .default
                            }
                            top
                        />
                        <CardBody>
                            <CardTitle>Card title</CardTitle>
                            <CardText>
                                This is a wider card with supporting text below
                                as a natural lead-in to additional content. This
                                content is a little bit longer.
                            </CardText>
                            <CardText>
                                <small className="text-muted">
                                    Last updated 3 mins ago
                                </small>
                            </CardText>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardImg
                            alt="..."
                            src={
                                require("../../assets/img/theme/sketch.jpg")
                                    .default
                            }
                            top
                        />
                        <CardBody>
                            <CardTitle>Card title</CardTitle>
                            <CardText>
                                This card has supporting text below as a natural
                                lead-in to additional content.
                            </CardText>
                            <CardText>
                                <small className="text-muted">
                                    Last updated 3 mins ago
                                </small>
                            </CardText>
                        </CardBody>
                    </Card>
                </div>
            </>
        );
    }
}

export default Header;
