import twilio from 'twilio';
import { config } from 'dotenv';

config();

export default twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
