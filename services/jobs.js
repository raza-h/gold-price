import WhatsappGoldRateJob from '../entities/WhatsappGoldRateJob.js';
import { goldPkScrapeGoldRate } from './scrapers.js';
import { goldPkTracker } from './trackers.js';

export const goldPkWhatsappGoldRateJob = new WhatsappGoldRateJob(goldPkScrapeGoldRate, goldPkTracker);
