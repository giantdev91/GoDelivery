import React, { useEffect, useState } from "react";
import HeaderCard from "components/Headers/HeaderCard";
import APIService from "../../service/APIService";

const TotalOrdersCard = () => {
    const [value, setValue] = useState("");

    const getTotalUsers = () => {
        APIService.post("/order/totalcount").then((res) => {
            const response = res.data;
            if (response.success) {
                setValue(Number(response.data).toLocaleString());
            }
        });
    };

    useEffect(() => {
        getTotalUsers();
    });

    return (
        <HeaderCard
            title="TOTAL ORDERS"
            value={value}
            icon={
                <img
                    alt="..."
                    src={require("../../assets/img/icons/order.png")}
                />
            }
        />
    );
};

export default TotalOrdersCard;
