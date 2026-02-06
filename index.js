import cron from 'node-cron';
import { winstonLogger } from './config/index.js';
import { config } from 'dotenv';
import { CRON_OPTIONS } from './constants.js';
import { goldPkWhatsappGoldRateJob } from './services/jobs.js';

config();

cron.schedule("*/5 18-21 * * 1-5", goldPkWhatsappGoldRateJob.run, CRON_OPTIONS);

cron.schedule("*/15 13-17,22-23,0-3 * * 1-5", goldPkWhatsappGoldRateJob.run, CRON_OPTIONS);

cron.schedule("0 4-12 * * 1-5", goldPkWhatsappGoldRateJob.run, CRON_OPTIONS);

cron.schedule("*/15 0-3 * * 6", goldPkWhatsappGoldRateJob.run, CRON_OPTIONS);

winstonLogger.info("SUCCESS SCHEDULING JOBS!");
