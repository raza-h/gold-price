import { scrapeARYGoldRate } from './scrapers.js';
import { twilioClient } from './twilio.js';
import { getNotifiedGoldRate, setNotifiedGoldRate } from './tracker.js';
import { FROM_NUMBER, THRESHOLD } from '../constants.js';
import { getUniqueStrings } from '../utils.js';

export const whatsappARYGoldRateJob = async () => {
    const notifiedGoldRate = getNotifiedGoldRate();

    console.log("STARTING ARY GOLD RATE JOB");
    try {
        const { rate = null, weight = null } = await scrapeARYGoldRate() ?? {};

        if (!rate) {
            return;
        }

        const notification = `Gold rate is Rs. ${rate?.toLocaleString()} per ${weight}`;

        if (!notifiedGoldRate || Math.abs(notifiedGoldRate - rate) >= THRESHOLD) {
            setNotifiedGoldRate(rate);

            const messages = await twilioClient.messages.list({ to: FROM_NUMBER });
            const recipients = getUniqueStrings(messages.map((message) => message?.from));

            const promises = [];

            recipients.forEach((to_number) => {
                promises.push(twilioClient.messages.create({
                    from: FROM_NUMBER,
                    to: to_number,
                    body: notification,
                }));
            });

            await Promise.all(promises);
            console.log('SUCCESS COMPLETING JOB, NOTIFICATIONS SENT!');
        } else {
            console.log("SUCCESS COMPLETING JOB, NO NOTIFICATIONS SENT!");
        }
    } catch (err) {
        console.error('ERROR SENDING NOTIFICATION:', err);
    }
};
