import {NextResponse} from "next/server";
// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};
export class ResponseBuilder {
    static ok(response: object): NextResponse {
        return new NextResponse(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    static error(statusCode: number = 503, message: string = "Неизвестная ошибка в системе"): NextResponse {
        return new NextResponse(JSON.stringify({error: message}), {
            status: statusCode,
            headers: { 'Content-Type': 'application/json' }
        })
    }

}