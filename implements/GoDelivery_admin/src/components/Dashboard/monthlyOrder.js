import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { Line } from "react-chartjs-2";
import APIService from "../../service/APIService";
import { calendarLabels } from "../../utils/commonFunction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const defaultValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
    labels: calendarLabels,
    datasets: [
        {
            data: defaultValue,
        },
    ],
};

const MonthlyOrder = () => {
    const [chartData, setChartData] = useState(defaultChartData);
    const [totalOrders, setTotalOrders] = useState(0);
    const [calendarView, setCalendarView] = useState(false);
    const [value, onChange] = useState(new Date());

    const getChartData = (date) => {
        APIService.post("/statistics/annualOrders", {
            year: date.getFullYear(),
        })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    const sum = response.data.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.orderSum;
                        },
                        0
                    );
                    setTotalOrders(sum);
                    const month =
                        date.getFullYear() == new Date().getFullYear()
                            ? new Date().getMonth() + 1
                            : 12;
                    const labels = calendarLabels.slice(0, month);
                    let orderCounts = defaultValue.slice(0, month);
                    response.data.filter((obj) => {
                        orderCounts[obj.month - 1] = obj.orderSum;
                    });
                    setChartData((prevState) => ({
                        ...prevState,
                        labels: labels,
                        datasets: [
                            {
                                data: orderCounts,
                            },
                        ],
                    }));
                }
            })
            .catch((err) => console.log("error: ", err));
    };

    useEffect(() => {
        getChartData(new Date());
    }, []);

    return (
        <>
            <Card className="status-row-card shadow">
                <CardHeader className="border-bottom-0">
                    <CardTitle tag="h2" className="text-danger mb-0">
                        Orders per month
                    </CardTitle>
                    <CardTitle tag="h4" className="mb-0">
                        <span>{value.getFullYear()}</span>
                        <a
                            className="ml-5"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setCalendarView(!calendarView);
                            }}
                        >
                            Change Year
                        </a>
                        <div
                            style={{
                                position: "absolute",
                                zIndex: "100",
                                display: calendarView ? "block" : "none",
                            }}
                        >
                            <DatePicker
                                selected={value}
                                showYearPicker
                                dateFormat="yyyy"
                                onChange={(val) => {
                                    onChange(val);
                                    getChartData(val);
                                    setCalendarView(!calendarView);
                                }}
                                inline
                            />
                        </div>
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

export default MonthlyOrder;
