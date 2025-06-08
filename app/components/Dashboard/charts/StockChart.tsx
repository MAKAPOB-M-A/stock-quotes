'use client'

// @ts-ignore
import CanvasJSReact from "@canvasjs/react-stockcharts";
import {Box} from "@mui/system";
import {DashboardData} from "../types";

function StockChart(props: {
    chartData: ({
        data: DashboardData[]} &
        { title: string,
            type?: string,
            color?: string,
        })[]
}) {


    const getOptions = (): object => {
        return props.chartData.reduce<any>((acc, cur) => {
                const axisY:any ={
                    title: cur.title,
                    includeZero: false
                }
                if(cur.color) {
                    axisY.lineColor = cur.color
                    axisY.tickColor = cur.color
                    axisY.titleFontColor = cur.color
                }
                const data:any ={
                    type: cur.type? cur.type : "line",
                    dataPoints: cur.data,
                    color: cur.color
                }
                if(cur.color) {
                    axisY.lineColor = cur.color
                    axisY.tickColor = cur.color
                    axisY.titleFontColor = cur.color
                }
                acc.charts[0].axisY.push(axisY)
                acc.charts[0].data.push(data)
                return acc;
            },
            {
                backgroundColor: "#D2D2D2",
                charts: [{
                    axisY:[],
                    axisX:{
                        valueFormatString: "hh:mm:ss",

                    },

                    data: []
                }]
            })
    }

    return (
        <Box>
            <CanvasJSReact.CanvasJSStockChart options={getOptions()}/>
        </Box>
    );
}

export default StockChart