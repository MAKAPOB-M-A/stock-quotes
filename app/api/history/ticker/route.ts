import {NextRequest} from "next/server";
import {ResponseBuilder} from "../../../utilites/ResponseBuilder";
import {PriceRepository} from "../../../db/PriceRepository";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')
    let limit = searchParams.get('limit')
    if (ticker != null) {
        let limitNum: number | undefined = undefined;
        if( limit != null){
            limitNum = Number(limit)
            const prices = await PriceRepository.getHistoryForTickerLimited(ticker, limitNum)
            if(!prices) {
                console.error(`No prices found for ticker ${ticker}`)
                return ResponseBuilder.error(400, `No prices found for ticker ${ticker}`)
            }
            return ResponseBuilder.ok(prices)
        }
        const prices = await PriceRepository.getHistoryForTicker(ticker)
        if(!prices) {
            console.error(`No prices found for ticker ${ticker}`)
            return ResponseBuilder.error(400, `No prices found for ticker ${ticker}`)
        }
        return ResponseBuilder.ok(prices)
    }
    return ResponseBuilder.error(400, `Ticker ${ticker} was not found`)
}


