import { config } from 'dotenv';
import twilio from 'twilio';

config();

export default twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
