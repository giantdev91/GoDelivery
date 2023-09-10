import React, { useEffect, useState } from "react";
import HeaderCard from "components/Headers/HeaderCard";
import APIService from "../../service/APIService";

const TotalMotorsCard = () => {
    const [value, setValue] = useState("");

    const getTotalUsers = () => {
        APIService.get("/motor/totalcount").then((res) => {
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
            title="TOTAL BIKERS"
            value={value}
            icon={
                <img
                    alt="..."
                    src={require("../../assets/img/icons/motor.png")}
                />
            }
        />
    );
};

export default TotalMotorsCard;
