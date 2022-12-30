export class TimeScale {
    async fetch() {
        const url = "https://timescale-production.up.railway.app/market-history/BITMEX/XBTUSD/1d/2022-12-01";
        return await fetch(url, { method: 'get' }).then((response) => response.json());
    }
}
