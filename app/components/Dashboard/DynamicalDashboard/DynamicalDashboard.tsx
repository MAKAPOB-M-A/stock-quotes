'use client'
import React, {useEffect, useRef, useState} from "react";
import {Button, Card, CardActions, CardContent, CircularProgress, Typography} from "@mui/material";
import {Box, createTheme, ThemeProvider} from "@mui/system";
import dynamic from "next/dynamic";
import {Fetcher} from "../../../utilites/fetch";
import {Price} from "../../../data/DataSource";
import {DashboardData, DashboardProps, TickerCurrentData} from "../types";
import {computeSmaDynamic, computeSmaHistorical} from "../../../utilites/compute";
import {Price as HistoryPrice} from "../../../generated/prisma/index"

const Chart = dynamic(() => import("../charts/Chart"), {ssr: false});

const SMA_PERIOD = Number(process.env.NEXT_PUBLIC_SMA_PERIOD_MINUTES);
const DYNAMIC_DASHBOARD_LENGTH = Number(process.env.NEXT_PUBLIC_DYNAMIC_DASHBOARD_LENGTH);
const DYNAMIC_DASHBOARD_REFRESH_DURATION = Number(process.env.NEXT_PUBLIC_DYNAMIC_DASHBOARD_REFRESH_DURATION);
const DASHBOARD_CURRENCY = process.env.NEXT_PUBLIC_DASHBOARD_CURRENCY;

export default function DynamicalDashboard(props: DashboardProps) {
    const [prices, setPrices] = useState<DashboardData[]>([])
    const [sma, setSma] = useState<DashboardData[]>([])
    const [currentPrice, setCurrentPrice] = useState<TickerCurrentData>({})
    const latestPriceRef = useRef(currentPrice); // создаем ref для хранения последнего значения
    const latestPricesRef = useRef(prices); // создаем ref для хранения последнего значения
    const latestSmaRef = useRef(sma); // создаем ref для хранения последнего значения

    const updatePrice = async ()=>
        Fetcher.fetch<Price>(`api/price/ticker/?ticker=${props.ticker}`)
            .then(res => {
                if(latestPriceRef.current.current != null){
                    if(res.updated != latestPriceRef.current.current?.updated) {
                        const dif = res.price - latestPriceRef.current.current?.price
                        setCurrentPrice({current: res, previous: latestPriceRef.current.current, percentChange: ((dif/latestPriceRef.current.current.price)*100).toFixed(2), absoluteChange: dif.toFixed(2), isPositive: dif > 0})
                        appendPrice(res)
                    }
                } else {
                    setCurrentPrice({...latestPriceRef.current, current: res})
                    appendPrice(res)
                }
            })
    const appendPrice = (price: Price)=>{
        latestPricesRef.current.push({x: new Date(price.updated), y: price.price})
        latestSmaRef.current.push({x: new Date(price.updated), y: computeSmaDynamic(latestPricesRef.current, SMA_PERIOD)})

        if (latestPricesRef.current.length >  DYNAMIC_DASHBOARD_LENGTH )
        {
            latestPricesRef.current.shift();
        }
        if (latestSmaRef.current.length >  DYNAMIC_DASHBOARD_LENGTH )
        {
            latestSmaRef.current.shift();
        }
        setSma(latestSmaRef.current)
        setPrices(latestPricesRef.current)

    }
    useEffect(() => {
        latestPriceRef.current = currentPrice;
        latestPricesRef.current = prices;
        latestSmaRef.current = sma;
    }, [currentPrice, prices, sma]);


    useEffect(()=> {
        Fetcher.fetch<HistoryPrice[]>(`api/history/ticker/?ticker=${props.ticker}&limit=${DYNAMIC_DASHBOARD_LENGTH}`)
            .then(res => {

                const dashboardPrices = res.map(item => {
                    return {
                        x: new Date(Number(item.datetime)),
                        y: item.price
                    }
                })
                console.log(dashboardPrices);
                setPrices(dashboardPrices)
                setSma(computeSmaHistorical(dashboardPrices, SMA_PERIOD, "min"))
            })
        Fetcher.fetch<Price>(`api/price/ticker/?ticker=${props.ticker}`)
            .then(res => {
                setCurrentPrice({...currentPrice, current: res})
            })

        const timer = setInterval(updatePrice, DYNAMIC_DASHBOARD_REFRESH_DURATION);
        return () => clearInterval(timer);
    }, [])

    return (
        <Card style={{minHeight: "800px"}} sx={{ minWidth: 275, backgroundColor: "#D2D2D2" }}>
            {currentPrice.current == null ?
                <Box
                    sx={{minHeight: 800, display:"flex", justifyContent: "center", alignItems: "center", backgroundColor: "inherit"}} >
                    <CircularProgress color="inherit" />
                </Box>
                :
                <Box
                    sx={{
                        backgroundColor: "#D2D2D2",
                        boxShadow: 1,
                        borderRadius: 2,
                        minWidth: 300,
                        padding: 8,
                    }}
                >
                    <Box sx={{ color: '#46505A' }}>Ticker: {props.ticker}</Box>
                    <Box sx={{ color: '#173A5E', fontSize: 34, fontWeight: 'medium' }}>
                        {currentPrice.current.price} {DASHBOARD_CURRENCY}.
                    </Box>
                    {currentPrice.previous && (
                        <>
                            <Box
                                sx={{
                                    color: currentPrice.isPositive? '#009688': '#ff6369',
                                    display: 'inline',
                                    fontWeight: 'bold',
                                    mx: 0.5,
                                    fontSize: 14,
                                }}
                            >
                                {currentPrice.percentChange}%
                            </Box>

                            <Box sx={{ color: currentPrice.isPositive? '#009688': '#ff6369', display: 'inline', fontSize: 14 }}>
                                {currentPrice.absoluteChange} p.
                            </Box>
                        </>
                    )}
                    <Chart chartData={[
                        {data: prices, title: "Price", color: "black"},
                        {data: sma, title: "SMA", color: "blue", type: "spline"},
                    ]}></Chart>
                </Box>
            }
        </Card>
    );
}
