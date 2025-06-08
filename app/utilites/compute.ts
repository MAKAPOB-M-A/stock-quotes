import {DashboardData} from "../components/Dashboard/types";

export const computeSmaDynamic = (prices: DashboardData[], periodInSeconds: number) => {

    const pricesFiltered = prices
        .filter(price => price.x.getTime() - Date.now() < periodInSeconds * 1000);
    return Number((pricesFiltered
            .reduce<number>((prev, cur) => cur.y + prev, 0)
            / pricesFiltered.length).toFixed(2))
}


export const computeSmaHistorical = (prices: DashboardData[], period: number, type: "min"|"s" = "s"):DashboardData[] => {
    const result: DashboardData[] = [];
    const periodInMillis = type == "s"?  period * 1000 : period * 60 * 1000
    for (let i = 0; i < prices.length; i++) {
        let sum = 0;
        let count = 0;

        for (let j = i; j >= 0 && prices[i].x.getTime() - prices[j].x.getTime() <= periodInMillis; j--) {
            sum += prices[j].y;
            count++;
        }

        if (count > 0) {
            const averageY = sum / count;

            result.push({
                x: prices[i].x,
                y: Number(averageY.toFixed(2))
            });
        }
    }

    return result;
}