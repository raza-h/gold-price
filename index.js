import { config } from 'dotenv';
import { CRON_OPTIONS } from './constants.js';
import { goldPkWhatsappGoldRateJob } from './services/jobs.js';
import cron from 'node-cron';

config();

cron.schedule("*/5 18-21 * * 1-5", goldPkWhatsappGoldRateJob.run, CRON_OPTIONS);

cron.schedule("*/15 13-17,22-23,0-3 * * 1-5", goldPkWhatsappGoldRateJob.run, CRON_OPTIONS);

cron.schedule("0 4-12 * * 1-5", goldPkWhatsappGoldRateJob.run, CRON_OPTIONS);

cron.schedule("*/15 0-3 * * 6", goldPkWhatsappGoldRateJob.run, CRON_OPTIONS);

console.log("SUCCESS SCHEDULING JOBS!");
