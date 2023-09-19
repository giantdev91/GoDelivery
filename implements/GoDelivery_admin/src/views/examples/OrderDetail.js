import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Container,
    Row,
    Col,
    Button,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    CardHeader,
    CardTitle,
} from "reactstrap";

import APIService from "../../service/APIService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import DeliverymanDetailHeader from "components/DeliverymanDetail/DeliverymanDetailHeader";
import DeliverymanDetailMonthlyStatus from "components/DeliverymanDetail/DeliverymanDetailMonthlyStatus";
import DeliverymanDetailDailyStatus from "components/DeliverymanDetail/DeliverymanDetailDailyStatus";
import { useNavigate } from "react-router-dom";

const MapWrapper = ({ orderDetail }) => {
    const mapRef = React.useRef(null);
    React.useEffect(() => {
        let google = window.google;
        let map = mapRef.current;
        var myLatlng;
        if (orderDetail.status != 0) {
            let lat = orderDetail.delivery_man.locationLatitude;
            let lng = orderDetail.delivery_man.locationLongitude;
            myLatlng = new google.maps.LatLng(lat, lng);
        }

        const fromLatlng = new google.maps.LatLng(
            orderDetail.fromX,
            orderDetail.fromY
        );
        const toLatlng = new google.maps.LatLng(
            orderDetail.toX,
            orderDetail.toY
        );
        const mapOptions = {
            zoom: 15,
            center: orderDetail.status == 0 ? fromLatlng : myLatlng,
            scrollwheel: false,
            zoomControl: true,
            // styles: [
            //     {
            //         featureType: "administrative",
            //         elementType: "labels.text.fill",
            //         stylers: [{ color: "#444444" }],
            //     },
            //     {
            //         featureType: "landscape",
            //         elementType: "all",
            //         stylers: [{ color: "#f2f2f2" }],
            //     },
            //     {
            //         featureType: "poi",
            //         elementType: "all",
            //         stylers: [{ visibility: "off" }],
            //     },
            //     {
            //         featureType: "road",
            //         elementType: "all",
            //         stylers: [{ saturation: -100 }, { lightness: 45 }],
            //     },
            //     {
            //         featureType: "road.highway",
            //         elementType: "all",
            //         stylers: [{ visibility: "simplified" }],
            //     },
            //     {
            //         featureType: "road.arterial",
            //         elementType: "labels.icon",
            //         stylers: [{ visibility: "off" }],
            //     },
            //     {
            //         featureType: "transit",
            //         elementType: "all",
            //         stylers: [{ visibility: "off" }],
            //     },
            //     {
            //         featureType: "water",
            //         elementType: "all",
            //         stylers: [{ color: "#5e72e4" }, { visibility: "on" }],
            //     },
            // ],
        };

        map = new google.maps.Map(map, mapOptions);
        const deliveryManWindow = new google.maps.InfoWindow({
            content:
                '<div class="info-window-content"><h2>Delivery man</h2></div>',
        });
        const fromWindow = new google.maps.InfoWindow({
            content:
                '<div class="info-window-content"><h2>Pick up location</h2></div>',
        });
        const toWindow = new google.maps.InfoWindow({
            content:
                '<div class="info-window-content"><h2>Drop off location</h2></div>',
        });

        if (orderDetail.status != 0) {
            const marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                animation: google.maps.Animation.DROP,
                title: "Delivery man",
            });
            google.maps.event.addListener(marker, "click", function () {
                deliveryManWindow.open(map, marker);
            });
        }

        const fromMarker = new google.maps.Marker({
            position: fromLatlng,
            map,
            animation: google.maps.Animation.DROP,
            title: "Pick up location",
        });
        const toMarker = new google.maps.Marker({
            position: toLatlng,
            map,
            animation: google.maps.Animation.DROP,
            title: "Drop off location",
        });

        google.maps.event.addListener(fromMarker, "click", function () {
            fromWindow.open(map, fromMarker);
        });
        google.maps.event.addListener(toMarker, "click", function () {
            toWindow.open(map, toMarker);
        });

        //render route
        // Create a DirectionsRenderer object to display the route on the map
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
        });
        const fromToRouteRequest = {
            origin: fromLatlng,
            destination: toLatlng,
            travelMode: google.maps.TravelMode.DRIVING, // You can change this to other modes like 'WALKING' or 'BICYCLING'
        };

        directionsService.route(
            fromToRouteRequest,
            function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    // Display the route on the map
                    directionsRenderer.setDirections(response);
                } else {
                    console.error("Directions request failed:", status);
                }
            }
        );
    }, []);
    return (
        <>
            <div
                style={{ height: `600px` }}
                className="map-canvas"
                id="map-canvas"
                ref={mapRef}
            ></div>
        </>
    );
};

const OrderDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState({});

    const getOrderDetail = () => {
        APIService.post(`/order/getById`, { orderID: id }).then((res) => {
            const response = res.data;
            if (response.status) {
                setData(response.data);
            }
        });
    };

    useEffect(() => {
        getOrderDetail();
    }, [id]);
    return (
        <>
            <Container fluid className="order-detail">
                <Row className="mt-3">
                    <Col className="col-md-9">
                        <h1 className="text-uppercase text-dark mt-4">
                            Order details
                        </h1>
                    </Col>
                    <Col className="col-md-3">
                        <Card className="shadow">
                            <CardBody>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <h3 className="text-danger">DISTANCE</h3>
                                    <h1>{data.distance} KM</h1>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <CardBody>
                                {data.delivery_man && (
                                    <MapWrapper orderDetail={data} />
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="col-md-5 d-flex">
                        <Card className="shadow flex-grow-1">
                            <CardHeader className="border-bottom-0">
                                <CardTitle
                                    tag="h2"
                                    className="text-danger mb-0"
                                >
                                    Locations
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="location-block">
                                    <div>
                                        <img
                                            src={require("../../assets/img/icons/from-icon.png")}
                                        />
                                    </div>
                                    <div>
                                        <h2>From</h2>
                                        <p>{data.from}</p>
                                    </div>
                                </div>
                                <div className="location-block">
                                    <div>
                                        <img
                                            src={require("../../assets/img/icons/to-icon.png")}
                                        />
                                    </div>
                                    <div>
                                        <h2>To</h2>
                                        <p>{data.to}</p>
                                    </div>
                                </div>
                                <div className="mt-3 ml-4">
                                    <p>
                                        <strong>Distance: </strong>
                                        {data.distance} Km
                                    </p>
                                    <p>
                                        <strong>Price: </strong> MZN{" "}
                                        {data.price}
                                    </p>
                                    <p>
                                        <strong>Duration: </strong>
                                        {data.spentTime} min
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="col-md-7 d-flex">
                        <Card className="shadow flex-grow-1">
                            <CardHeader className="border-bottom-0">
                                <CardTitle
                                    tag="h2"
                                    className="text-danger mb-0"
                                >
                                    Delivery man
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div
                                    className="location-block "
                                    style={{ gap: "3em" }}
                                >
                                    <div className="avatar-area">
                                        {data?.delivery_man?.avatar && (
                                            <img
                                                src={data?.delivery_man?.avatar}
                                            />
                                        )}
                                        {!data?.delivery_man?.avatar && (
                                            <img
                                                src={require("../../assets/img/common/delivery-man.png")}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h2>
                                            {data?.delivery_man &&
                                                data?.delivery_man?.name}
                                        </h2>
                                        <h4>
                                            {data?.delivery_man &&
                                                data?.delivery_man?.phone}
                                        </h4>
                                        <h4>
                                            {data?.delivery_man?.motor?.plate}
                                        </h4>
                                    </div>
                                </div>
                                <div
                                    className="location-block mt-4"
                                    style={{ gap: "3em" }}
                                >
                                    <div>
                                        <h2>Sender: </h2>
                                        <h4>
                                            {data.client && data?.client.name}
                                        </h4>
                                        <h4>
                                            {data.client && data?.client.phone}
                                        </h4>
                                    </div>
                                    <div>
                                        <h2>Receiver: </h2>
                                        <h4>{data.receiverName}</h4>
                                        <h4>{data.receiver}</h4>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default OrderDetail;
