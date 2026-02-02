import { config } from 'dotenv';
import twilio from 'twilio';
import cron from 'node-cron';
import { scrapeARYGoldRate } from './services/scrapers.js';
import { getUniqueStrings } from './utils.js';

config();

const THRESHOLD = process.env.THRESHOLD || 5000;
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const from_number = `whatsapp:${process.env.TWILIO_FROM_NUMBER}`;
let prev_gold_rate = null;

cron.schedule(
    "0 0,9,12,15,18,21 * * *",
    async () => {
        console.log("STARTING JOB");
        try {
            const { rate = null, weight = null } = await scrapeARYGoldRate() ?? {};

            const notification = `Gold rate is Rs. ${rate?.toLocaleString()} per ${weight}`;

            if (!prev_gold_rate || Math.abs(prev_gold_rate - rate) >= THRESHOLD) {
                prev_gold_rate = rate;

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
    },
    { timezone: "Asia/Karachi" }
);

console.log("SUCCESS SCHEDULING JOB!");
