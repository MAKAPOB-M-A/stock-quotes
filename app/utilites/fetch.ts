
export class Fetcher {
    public static async fetch<T>(
        input: string | URL | globalThis.Request,
        init?: RequestInit,
    ): Promise<T> {
        return fetch(input, init)
            .then((res) => res.json() as T)
    }
}