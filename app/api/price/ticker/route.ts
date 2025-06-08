
import {NextRequest} from "next/server";
import {ResponseBuilder} from "../../../utilites/ResponseBuilder";
import {PriceRepository} from "../../../db/PriceRepository";
import {DataSource} from "../../../data/DataSource";
import cron from "node-cron";
import prisma from "../../../lib/prisma";
import container from "../../../ioc/IocContainer";

const dataSource = container.resolve<DataSource>("DataSource")
cron.createTask('* * * * *', async () => {
    console.log('Start refresh price for tickers');
    const tickers = await prisma.symbol.findMany();
    for (const ticker of tickers) {
        const currentPriceTicker = await dataSource.getCurrentForTicker(ticker.symbol);
        await PriceRepository.refreshPriceForTicker(ticker.symbol, currentPriceTicker)
    }
}).start()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')
    if (ticker != null) {
        let currentPriceTicker;
        try {
            currentPriceTicker = await dataSource.getCurrentForTicker(ticker);
            await PriceRepository.refreshPriceForTicker(ticker, currentPriceTicker)

        } catch (error: unknown ) {
            console.error(error);
            return ResponseBuilder.error(400, "Unexpected error");
        }

        return ResponseBuilder.ok(currentPriceTicker)
    }
    return ResponseBuilder.error(400, "Ticker was not found")
}

