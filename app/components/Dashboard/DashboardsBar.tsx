import DynamicalDashboard from "./DynamicalDashboard/DynamicalDashboard";
import {Grid} from "@mui/material";
import HistoricalDashboard from "./HistoricalDashboard/HistoricalDashboard";


export default function DashboardsBar() {

  return (
    <div>
        <Grid container spacing={4} >
            {/* Блок дашбордов для проверки реальной интеграции через Exchange*/}
            {/*<Grid size={6} >*/}
            {/*    <DynamicalDashboard ticker={"EUR"}></DynamicalDashboard>*/}
            {/*</Grid>*/}
            {/*<Grid size={6}>*/}
            {/*    <HistoricalDashboard ticker={"EUR"}></HistoricalDashboard>*/}
            {/*</Grid>*/}
            {/*<Grid size={6}>*/}
            {/*    <DynamicalDashboard ticker={"AMD"}></DynamicalDashboard>*/}
            {/*</Grid>*/}
            {/*<Grid size={6}>*/}
            {/*    <HistoricalDashboard ticker={"AMD"}></HistoricalDashboard>*/}
            {/*</Grid>*/}

            <Grid size={6} >
                <DynamicalDashboard ticker={"RUB_USD"}></DynamicalDashboard>
            </Grid>
            <Grid size={6}>
                <HistoricalDashboard ticker={"RUB_USD"}></HistoricalDashboard>
            </Grid>
            <Grid size={6}>
                <DynamicalDashboard ticker={"GOLD"}></DynamicalDashboard>
            </Grid>
            <Grid size={6}>
                <HistoricalDashboard ticker={"GOLD"}></HistoricalDashboard>
            </Grid>
            <Grid size={6}>
                <DynamicalDashboard ticker={"RUB_EUR"}></DynamicalDashboard>
            </Grid>
            <Grid size={6}>
                <HistoricalDashboard ticker={"RUB_EUR"}></HistoricalDashboard>
            </Grid>
            <Grid size={6}>
                <DynamicalDashboard ticker={"PLATINUM"}></DynamicalDashboard>
            </Grid>
            <Grid size={6}>
                <HistoricalDashboard ticker={"PLATINUM"}></HistoricalDashboard>
            </Grid>


        </Grid>
    </div>
  );
}
