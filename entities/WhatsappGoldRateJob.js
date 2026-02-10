import Tracker from './Tracker.js';
import { twilioClient, winstonLogger } from '../config/index.js';
import { FROM_NUMBER, THRESHOLD } from '../constants.js';
import { getUniqueStrings } from '../utils.js';

class WhatsappGoldRateJob {
    constructor(scraper = async () => { }, tracker = new Tracker()) {
        this.scraper = scraper;
        this.tracker = tracker;
        this.run = this.run.bind(this);
    }

    async run() {
        try {
            winstonLogger.info("STARTING GOLD RATE JOB");

            const notifiedGoldRate = await this.tracker.getNotifiedGoldRate();

            const { rate = null, weight = null } = await this.scraper() ?? {};

            if (!rate) {
                return;
            }

            winstonLogger.info(`RECORDED RATE: ${notifiedGoldRate}`);
            winstonLogger.info(`CURRENT RATE: ${rate}`);
            winstonLogger.info(`CURRENT DIFFERENCE: ${Math.abs(notifiedGoldRate - rate)}`);

            const notification = `Gold rate is Rs. ${rate?.toLocaleString()} per ${weight}`;

            if (!notifiedGoldRate || Math.abs(notifiedGoldRate - rate) >= THRESHOLD) {
                await this.tracker.setNotifiedGoldRate(rate);

                const messages = await twilioClient.messages.list({ to: FROM_NUMBER });
                const recipients = getUniqueStrings(messages.map((message) => message?.from));

                const promises = [];

                recipients.forEach((to_number) => {
                    promises.push(twilioClient.messages.create({
                        from: FROM_NUMBER,
                        to: to_number,
                        body: notification,
                        /* Instead of body, we can also use content templates with parameters like this.
                            // contentSid: process.env.TWILIO_TEMPLATE_SID,
                            // contentVariables: JSON.stringify({ rate, weight }),
                        */
                    }));
                });

                await Promise.all(promises);
                winstonLogger.info('SUCCESS COMPLETING JOB, NOTIFICATIONS SENT!');
            } else {
                winstonLogger.info("SUCCESS COMPLETING JOB, NO NOTIFICATIONS SENT!");
            }
        } catch (err) {
            winstonLogger.error('ERROR SENDING NOTIFICATION:', err);
        }

    }
}

export default WhatsappGoldRateJob;
