import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { Line, Bar } from "react-chartjs-2";
import APIService from "../../service/APIService";
import { calendarLabels } from "../../utils/commonFunction";

const defaultPriceValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const chartOption = {
    scales: {
        yAxes: [
            {
                ticks: {
                    callback: function (value) {
                        if (!(value % 10)) {
                            return "MZN " + value / 1000 + "k";
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

                content += "MZN " + Number((yLabel / 1000).toFixed(3)) + "k";
                return content;
            },
        },
    },
};

let defaultChartData = {
    labels: calendarLabels,
    datasets: [
        {
            data: defaultPriceValue,
        },
    ],
};

const MonthlyRevenue = ({ deliverymanId }) => {
    const [chartData, setChartData] = useState(defaultChartData);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const getChartData = () => {
        if (deliverymanId) {
            APIService.post("/statistics/annualRevenue", {
                year: new Date().getFullYear(),
                deliverymanId: deliverymanId,
            })
                .then((res) => {
                    const response = res.data;
                    if (response.success) {
                        const defaultPriceValue = [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        ];
                        const sum = response.data.reduce(
                            (accumulator, currentObject) => {
                                return accumulator + currentObject.priceSum;
                            },
                            0
                        );
                        setTotalRevenue(sum);
                        const month = new Date().getMonth() + 1;
                        const labels = calendarLabels.slice(0, month);
                        let priceValue = defaultPriceValue.slice(0, month);
                        response.data.filter((obj) => {
                            priceValue[obj.month - 1] = obj.priceSum;
                        });

                        setChartData((prevState) => ({
                            ...prevState,
                            labels: labels,
                            datasets: [
                                {
                                    data: priceValue,
                                },
                            ],
                        }));
                    }
                })
                .catch((err) => console.log("error: ", err));
        }
    };

    useEffect(() => {
        getChartData();
    }, [deliverymanId]);

    return (
        <>
            <Card className="status-row-card shadow">
                <CardHeader className="border-bottom-0">
                    <CardTitle tag="h2" className="text-danger mb-0">
                        Revenue
                    </CardTitle>
                    <CardTitle tag="h4" className="mb-0">
                        MZN{" "}
                        {Number(
                            Number(totalRevenue).toFixed(2)
                        ).toLocaleString()}
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

export default MonthlyRevenue;
