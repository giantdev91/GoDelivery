import React, { useEffect, useState } from "react";
import HeaderCard from "components/Headers/HeaderCard";
import APIService from "../../service/APIService";

const TotalUsersCard = () => {
    const [value, setValue] = useState("");

    const getTotalUsers = () => {
        APIService.get("/client/totalcount").then((res) => {
            const response = res.data;
            if (response.success) {
                setValue(Number(response.data.totalcount).toLocaleString());
            }
        });
    };

    useEffect(() => {
        getTotalUsers();
    });

    return (
        <HeaderCard
            title="TOTAL USERS"
            value={value}
            icon={
                <img
                    alt="..."
                    src={require("../../assets/img/icons/user.png")}
                />
            }
        />
    );
};

export default TotalUsersCard;
