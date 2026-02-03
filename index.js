import { config } from 'dotenv';
import { CRON_OPTIONS } from './constants.js';
import { aryWhatsappGoldRateJob } from './services/jobs.js';
import cron from 'node-cron';

config();

cron.schedule("*/5 17-20 * * 1-5", aryWhatsappGoldRateJob.run, CRON_OPTIONS);

cron.schedule("*/1 12-16,21-23,0-2 * * 1-5", aryWhatsappGoldRateJob.run, CRON_OPTIONS);

cron.schedule("0 5-14 * * 1-5", aryWhatsappGoldRateJob.run, CRON_OPTIONS);

console.log("SUCCESS SCHEDULING JOBS!");
