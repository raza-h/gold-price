import { config } from "dotenv";

config();

export const THRESHOLD = process.env.THRESHOLD || 5000;
export const CRON_OPTIONS = { timezone: "Asia/Karachi" };
export const FROM_NUMBER = `whatsapp:${process.env.TWILIO_FROM_NUMBER}`;
