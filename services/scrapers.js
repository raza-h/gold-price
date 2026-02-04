import { CheerioWebBaseLoader as WebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"

export const aryScrapeGoldRate = async () => {
    try {
        const loader = new WebBaseLoader('https://arynews.tv/gold-rates-today-in-pakistan', {
            selector: 'h5',
        });
        const docs = await loader.load();
        const text = docs?.[0]?.pageContent;
        const goldRates = text?.split('Per ')?.slice(1);
        const formattedGoldRates = goldRates?.map((rate) => ({
            weight: rate?.split('Rs. ')?.[0],
            rate: parseInt(rate?.split('Rs. ')?.[1]?.split('/')?.[0]?.split(', ')?.join('')),
        }))

        return { rate: formattedGoldRates?.[0]?.rate, weight: formattedGoldRates?.[0]?.weight };
    } catch (err) {
        console.error('ERROR SCRAPING:', err);
    }
};

export const goldPkScrapeGoldRate = async () => {
    try {
        const loader = new WebBaseLoader('https://gold.pk', {
            selector: 'p',
        });
        const docs = await loader.load();
        const text = docs?.[0]?.pageContent;
        const targetText = text?.split('>')?.[0];
        const goldRates = targetText?.split(')')?.slice(0, -1);
        const formattedGoldRates = goldRates?.map((rateAndWeight) => {
            const [rate, weight] = rateAndWeight?.split('24 Karat Gold Rate (');
            return {
                weight: weight,
                rate: parseFloat(rate?.split('Rs.')?.[1]?.trim()),
            }
        })

        return { rate: formattedGoldRates?.[0]?.rate, weight: formattedGoldRates?.[0]?.weight };
    } catch (err) {
        console.error('ERROR SCRAPING:', err);
    }
}
