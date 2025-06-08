import {Price} from "../../data/DataSource";

export type DashboardProps = {
    ticker: string,
}

export type TickerCurrentData = {
    current?: Price;
    previous?: Price;
    absoluteChange?: string;
    percentChange?: string;
    isPositive?: boolean;
}

export type DashboardData = {
    x: Date;
    y: number;
}

