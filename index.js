import { config } from 'dotenv';
import twilio from 'twilio';
import cron from 'node-cron';
import { scrapeARYGoldRate } from './services/scrapers.js';
import { getUniqueStrings } from './utils.js';

config();

const THRESHOLD = process.env.THRESHOLD || 5000;
const CRON_OPTIONS = { timezone: "Asia/Karachi" };
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const from_number = `whatsapp:${process.env.TWILIO_FROM_NUMBER}`;

let notified_gold_rate = null;

const whatsappARYGoldRateJob = async () => {
    console.log("STARTING JOB");
    try {
        const { rate = null, weight = null } = await scrapeARYGoldRate() ?? {};

        if (!rate) {
            return;
        }

        const notification = `Gold rate is Rs. ${rate?.toLocaleString()} per ${weight}`;

        if (!notified_gold_rate || Math.abs(notified_gold_rate - rate) >= THRESHOLD) {
            notified_gold_rate = rate;

            const messages = await client.messages.list({ to: from_number });
            const recipients = getUniqueStrings(messages.map((message) => message?.from));

            const promises = [];

            recipients.forEach((to_number) => {
                promises.push(client.messages.create({
                    from: from_number,
                    to: to_number,
                    body: notification,
                }));
            });

            await Promise.all(promises);
        }
        console.log("SUCCESS COMPLETING JOB!");
    } catch (err) {
        console.error('ERROR SENDING NOTIFICATION:', err);
    }
};

cron.schedule("*/5 17-20 * * 1-5", whatsappARYGoldRateJob, CRON_OPTIONS);

cron.schedule("*/15 12-16,21-23,0-2 * * 1-5", whatsappARYGoldRateJob, CRON_OPTIONS);

cron.schedule("0 5-14 * * 1-5", whatsappARYGoldRateJob, CRON_OPTIONS);

console.log("SUCCESS SCHEDULING JOB!");
