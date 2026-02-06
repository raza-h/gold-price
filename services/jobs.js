import { WhatsappGoldRateJob } from '../entities/index.js';
import { goldPkScrapeGoldRate } from './scrapers.js';
import { goldPkTracker } from './trackers.js';

export const goldPkWhatsappGoldRateJob = new WhatsappGoldRateJob(goldPkScrapeGoldRate, goldPkTracker);
