import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { Line } from "react-chartjs-2";
import APIService from "../../service/APIService";

const chartOption = {
    scales: {
        yAxes: [
            {
                ticks: {
                    callback: function (value) {
                        if (!(value % 10)) {
                            return value;
                        }
                    },
                },
            },
        ],
    },
    tooltips: {
        callbacks: {
            label: function (item, data) {
                var label = data.datasets[item.datasetIndex].label || "";
                var yLabel = item.yLabel;
                var content = "";

                if (data.datasets.length > 1) {
                    content += label;
                }

                content += yLabel;
                return content;
            },
        },
    },
};

let defaultChartData = {
    labels: [],
    datasets: [
        {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ],
};

const DailyOrder = () => {
    const [chartData, setChartData] = useState(defaultChartData);

    const getChartData = () => {
        APIService.post("/statistics/dailyOrders")
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setChartData((prevState) => ({
                        ...prevState,
                        labels: response.data.map(
                            (obj) =>
                                `${obj.order_date.split("-")[1]}-${
                                    obj.order_date.split("-")[2]
                                }`
                        ),
                        datasets: [
                            {
                                data: response.data.map(
                                    (obj) => obj.order_count
                                ),
                            },
                        ],
                    }));
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    useEffect(() => {
        getChartData();
    }, []);

    return (
        <>
            <Card className="status-row-card">
                <CardHeader className="border-bottom-0">
                    <CardTitle tag="h2" className="text-danger mb-0">
                        Orders per day
                    </CardTitle>
                    <CardTitle tag="h4" className="mb-0">
                        &nbsp;
                    </CardTitle>
                </CardHeader>
                <CardBody style={{ overflow: "inherit" }}>
                    {/* Chart */}
                    <div className="chart" style={{ height: "300px" }}>
                        <Line data={chartData} options={chartOption} />
                    </div>
                </CardBody>
            </Card>
        </>
    );
};

export default DailyOrder;
