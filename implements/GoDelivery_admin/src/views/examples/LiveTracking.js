import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Row, Col } from "reactstrap";

import APIService from "../../service/APIService";
import HeaderCard from "components/Headers/HeaderCard";

const MapWrapper = ({ data }) => {
    const mapRef = React.useRef(null);
    React.useEffect(() => {
        let google = window.google;
        let map = mapRef.current;
        const myLatlng = new google.maps.LatLng(
            data[0].locationLatitude,
            data[0].locationLongitude
        );

        const mapOptions = {
            zoom: 7,
            center: myLatlng,
            scrollwheel: false,
            zoomControl: true,
        };
        map = new google.maps.Map(map, mapOptions);

        data.map((deliveryMan) => {
            const latLng = new google.maps.LatLng(
                deliveryMan.locationLatitude,
                deliveryMan.locationLongitude
            );
            const popupWindow = new google.maps.InfoWindow({
                content: `<div class="info-window-content"><h4>${deliveryMan.name}</h4><p>${deliveryMan.phone}</p></div>`,
            });
            const marker = new google.maps.Marker({
                position: latLng,
                map: map,
                animation: google.maps.Animation.DROP,
                title: `${deliveryMan.name} (${deliveryMan.phone})`,
            });
            google.maps.event.addListener(marker, "click", function () {
                popupWindow.open(map, marker);
            });
        });
    }, []);
    return (
        <>
            <div
                style={{ height: `700px` }}
                className="map-canvas"
                id="map-canvas"
                ref={mapRef}
            ></div>
        </>
    );
};

const LiveTracking = () => {
    const id = 4;
    const [data, setData] = useState([]);
    const [activeMotors, setActiveMotors] = useState(0);

    const getAllDeliverymanList = () => {
        APIService.post(`/deliveryman/deliverymanlist`).then((res) => {
            const response = res.data;
            if (response.success) {
                console.log("data: ", response.data);
                const activeMotorsCount = response.data.filter(
                    (deliveryMan) => deliveryMan.motor
                ).length;
                console.log("activeMotorsCount: ", activeMotorsCount);
                setActiveMotors(activeMotorsCount);
                setData(response.data);
            }
        });
    };

    useEffect(() => {
        getAllDeliverymanList();
    }, []);
    return (
        <>
            <Container fluid className="order-detail">
                <Row className="mt-3">
                    <Col className="col-md-9">
                        <h1 className="text-uppercase text-dark mt-4">
                            Live Tracking
                        </h1>
                    </Col>
                    <Col className="col-md-3">
                        <HeaderCard
                            title="ACTIVE MOTORCYCLE"
                            value={activeMotors}
                            icon={
                                <img
                                    alt="..."
                                    src={require("../../assets/img/icons/motor.png")}
                                />
                            }
                        />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <CardBody>
                                {data.length > 0 && <MapWrapper data={data} />}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LiveTracking;
