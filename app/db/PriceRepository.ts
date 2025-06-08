import prisma from "../lib/prisma";
import {Price} from "../data/DataSource";
import {type Symbol, type Price as HistoryPrice, Prisma} from "../generated/prisma/index"
export class PriceRepository {

    public static async refreshPriceForTicker(ticker: string, price: Price) {
        let symbol = await prisma.symbol.findUnique({ where: { symbol: ticker } });
        if(!symbol) {
            symbol = await prisma.symbol.create({
                data: {
                    symbol: ticker
                }
            });
        }
        await this.refreshPriceForSymbol(symbol, price);

    }
    public static async refreshPriceForSymbol(symbol: Symbol, price: Price)  {
            const existingPrice = await prisma.price.findFirst({
                where: {
                    AND: [{ symbol_id: symbol.id }, { datetime: price.updated }]
                },
                select: { id: true }
            });

            if (!existingPrice) {
                await prisma.price.create({
                    data: {
                        symbol_id: symbol.id,
                        price: price.price,
                        datetime: price.updated
                    }
                });
            }
    }
    public static async getHistoryForTicker(ticker: string): Promise<HistoryPrice[]>  {
        const symbol = await prisma.symbol.findUniqueOrThrow({ where: { symbol: ticker } });
        const options: Prisma.PriceFindManyArgs = {
            where: { symbol_id: symbol.id},
            orderBy: [
                {
                    datetime: 'asc',
                }
            ],
        }
        const prices = await prisma.price.findMany(options);
        return prices;
    }

    public static async getHistoryForTickerLimited(ticker: string, limit: number | undefined = undefined): Promise<HistoryPrice[]>  {
        const symbol = await prisma.symbol.findUniqueOrThrow({ where: { symbol: ticker } });
        const options: Prisma.PriceFindManyArgs = {
            where: { symbol_id: symbol.id},
            orderBy: [
                {
                    datetime: 'desc',
                }
            ],
        }
        if (typeof limit !== 'undefined') {
            options.take = limit;
        }
        const prices = await prisma.price.findMany(options);
        return prices.reverse();

    }

}