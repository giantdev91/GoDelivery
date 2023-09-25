import React, { useEffect, useState } from "react";
import HeaderCard from "components/Headers/HeaderCard";
import APIService from "../../service/APIService";

const TotalRevenueCard = () => {
    const [value, setValue] = useState("");

    const getTotalUsers = () => {
        APIService.get("/order/totalRevenue").then((res) => {
            const response = res.data;
            if (response.success) {
                setValue(
                    Number(Number(response.data).toFixed(2)).toLocaleString()
                );
            }
        });
    };

    useEffect(() => {
        getTotalUsers();
    });

    return (
        <HeaderCard
            title="REVENUE"
            value={value}
            icon={<p className="valueText mb-0 text-left">MZN</p>}
        />
    );
};

export default TotalRevenueCard;
