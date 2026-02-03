import WhatsappGoldRateJob from '../entities/WhatsappGoldRateJob.js';
import { aryScrapeGoldRate } from './scrapers.js';
import { aryTracker } from './trackers.js';

export const aryWhatsappGoldRateJob = new WhatsappGoldRateJob(aryScrapeGoldRate, aryTracker);
