import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { Line, Bar } from "react-chartjs-2";
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2,
} from "variables/charts.js";

const DailyOrder = () => {
    const [chartExample1Data, setChartExample1Data] = useState("data1");

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
                        <Line
                            data={chartExample1[chartExample1Data]}
                            options={chartExample1.options}
                            getDatasetAtEvent={(e) => console.log(e)}
                        />
                    </div>
                </CardBody>
            </Card>
        </>
    );
};

export default DailyOrder;
