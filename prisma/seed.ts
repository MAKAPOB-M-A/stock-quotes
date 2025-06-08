import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.SymbolCreateInput[] = [
    {
        symbol: "GOLD",
    },
    {
        symbol: "PLATINUM",
    },
    {
        symbol: "RUB_USD",
    },
    {
        symbol: "RUB_EUR",
    },
];

export async function main() {
    for (const u of userData) {
        await prisma.symbol.create({ data: u });
    }
}

main();


