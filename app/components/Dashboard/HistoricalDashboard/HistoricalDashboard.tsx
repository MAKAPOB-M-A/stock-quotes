'use client'
import React, {useEffect, useRef, useState} from "react";
import {Button, Card, CardActions, CardContent, CircularProgress, Typography} from "@mui/material";
import {Box, createTheme, ThemeProvider} from "@mui/system";
import dynamic from "next/dynamic";
import {Fetcher} from "../../../utilites/fetch";
import {DashboardData, DashboardProps, TickerCurrentData} from "../types";
import {computeSmaHistorical} from "../../../utilites/compute";
import {Price} from "../../../generated/prisma/index"
const StockChart = dynamic(() => import("../charts/StockChart"), {ssr: false});

const SMA_PERIOD = Number(process.env.NEXT_PUBLIC_SMA_PERIOD_MINUTES);

export default function HistoricalDashboard(props: DashboardProps) {
    const [prices, setPrices] = useState<DashboardData[] | null>(null);
    const [sma, setSma] = useState<DashboardData[]| null>(null)




    useEffect(()=> {
        Fetcher.fetch<Price[]>(`api/history/ticker/?ticker=${props.ticker}`)
            .then(res => {

                const dashboardPrices = res.map(item => {
                    return {
                        x: new Date(Number(item.datetime)),
                        y: item.price
                    }
                })
                setPrices(dashboardPrices)
                setSma(computeSmaHistorical(dashboardPrices, SMA_PERIOD, "min"))
            })

    }, [])
    return (
        <Card style={{minHeight: "800px"}} sx={{ minWidth: 275, backgroundColor: "#D2D2D2" }}>
            {prices == null || sma == null  ?
                <Box
                    sx={{minHeight: 800, display:"flex", justifyContent: "center", alignItems: "center", backgroundColor: "#D2D2D2"}}
                >
                    <CircularProgress color="inherit" />
                </Box>
                :
                <Box
                    sx={{
                        backgroundColor: "#D2D2D2",
                        boxShadow: 1,
                        borderRadius: 2,
                        minWidth: 300,
                        padding: 8
                    }}
                >
                    <Box sx={{  color: '#46505A' }}>Ticker: {props.ticker}</Box>
                    <StockChart chartData={[
                        {data: prices, title: "Price", color: "black"},
                        {data: sma, title: "SMA", color: "blue", type: "spline"},
                    ]}></StockChart>
                </Box>
            }
        </Card>
    );
}
