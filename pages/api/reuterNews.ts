import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';

const scrapeGuardianNews = async () => {
    const url = 'https://www.theguardian.com/international';

    // Configure headers to mimic a real browser
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    };

    try {
        // Fetch the HTML with headers
        const { data } = await axios.get(url, { headers });

        // Load the HTML into Cheerio
        const $ = cheerio.load(data);

        // Initialize an array for headlines and their corresponding links
        const newsItems: { title: string; link: string }[] = [];

        // Common base URL for constructing absolute links
        const baseUrl = 'https://www.theguardian.com';

        // Try multiple selectors in one loop for efficiency
        $('div[data-link-name="article"], .js-headline-text, a[data-link-name="article"]').each((_, element) => {
            const title = $(element).find('a').text().trim() || $(element).text().trim();
            let link = $(element).find('a').attr('href') || $(element).closest('a').attr('href');

            if (title && link) {
                // Ensure the link is a full URL
                if (!link.startsWith('http')) {
                    link = baseUrl + link; // Construct the full URL
                }
                newsItems.push({ title, link });
            }
        });

        return newsItems;

    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const newsItems = await scrapeGuardianNews();
            res.status(200).json(newsItems);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch news' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;
