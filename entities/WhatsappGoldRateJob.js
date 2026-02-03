import twilioClient from '../services/twilio.js';
import { FROM_NUMBER, THRESHOLD } from '../constants.js';
import { getUniqueStrings } from '../utils.js';
import Tracker from './Tracker.js';

class WhatsappGoldRateJob {
    constructor(scraper = async () => { }, tracker = new Tracker()) {
        this.scraper = scraper;
        this.tracker = tracker;
        this.run = this.run.bind(this);
    }

    async run() {
        const notifiedGoldRate = this.tracker.getNotifiedGoldRate();

        console.log("STARTING GOLD RATE JOB");

        try {
            const { rate = null, weight = null } = await this.scraper() ?? {};

            if (!rate) {
                return;
            }

            const notification = `Gold rate is Rs. ${rate?.toLocaleString()} per ${weight}`;

            if (!notifiedGoldRate || Math.abs(notifiedGoldRate - rate) >= THRESHOLD) {
                this.tracker.setNotifiedGoldRate(rate);

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

    }
}

export default WhatsappGoldRateJob;
