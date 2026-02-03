import { config } from 'dotenv';
import twilio from 'twilio';

config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const twilioClient = client;
