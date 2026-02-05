# Gold Price Notification Cron ⏰

A Node.js cron job that fetches gold prices and sends notifications when prices change. Designed for automating gold price alerts via your preferred notification channel.

## Features

- ✨ Fetches live gold prices from API
- 📱 Sends alerts when price thresholds are crossed
- ⚙️ Configurable via `.env` variables
- 🚀 Lightweight Node.js setup
- 🔄 Automated scheduling with cron

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Notification Channels](#notification-channels)
- [Contributing](#contributing)
- [License](#license)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/raza-h/gold-price.git
cd gold-price
yarn       # or npm i
yarn dev   # or npm run dev
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Twilio Configuration (for Whatsapp notifications)
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+15551234567
TWILIO_TEMPLATE_SID=HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Price Alert Configuration
THRESHOLD=5000
```

## Project Structure

```
.
├── constants.js       # Configuration constants
├── index.js           # Cron setup
├── utils.js           # Helper functions (formatting)
├── services/          # Modules handling gold price retrieval and processing
│   ├── jobs.js        # Instances of jobs responsible for sending notifications
│   └── twilio.js      # Twilio configuration
│   ├── trackers.js    # Instances of in-memory tracking states
│   └── scrapers.js    # Web scraping functions for different websites
├── entities/
│   └── Tracker.js               # Implementation for in-memory state for previous notified gold rate
│   └── WhatsappGoldRateJob.js   # Implementation for sending whatsapp messages via Twilio
├── .env.example       # Example environment variables
├── .gitignore
├── package.json
├── yarn.lock
└── README.md
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `TWILIO_SID` | Twilio account SID for SMS | Yes | - |
| `TWILIO_AUTH_TOKEN` | Twilio authentication token | Yes | - |
| `TWILIO_FROM_NUMBER` | Twilio phone number (sender) | Yes | - |
| `TWILIO_TEMPLATE_SID` | Price change threshold for alerts | No | - |
| `THRESHOLD` | Price change threshold for alerts | No | `5000` |

## Notification Channels

### Whatsapp (Twilio)

Configure Twilio credentials in `.env`:

```env
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+15551234567
THRESHOLD=5000
TWILIO_TEMPLATE_SID=HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Cron Schedules

I've set up three cron schedules based on three sessions:
- Asian Session (Tokyo/Shanghai): 4:00 AM – 1:00 PM PKT. This session is usually calmer but can see movement based on Chinese and Japanese economic data.
- European Session (London): 1:00 PM – 10:00 PM PKT. This is a highly liquid period as the London market opens.
- North American Session (New York): 6:00 PM – 3:00 AM PKT. This session often brings high volatility due to U.S. economic news releases.

Low Priority: 4:00 AM - 1:00 PM (check every hour)
High Priority: 1:00 PM - 6:00 PM and 10:00 PM to 3:00 AM (check every 15 minutes)
Very High Priority: 6:00 PM - 10:00 PM (check every 5 minutes)
Break: 3:00 AM to 4:00 AM


```javascript
// Every 5 minutes from 6-10 PM on weekdays
*/5 18-21 * * 1-5

// Every 15 minutes from 1-6 PM and 10 PM - 3 AM
*/15 13-17,22-23,0-3 * * 1-5

// Every hour from 4 AM - 12 PM
0 4-12 * * 1-5

// Every 15 minutes from 12-3 AM on Saturday (last 3 hours before market closes on the weekend)
*/15 0-3 * * 6
```

## Troubleshooting

### Common Issues

**Notification failures:**
- Check Twilio account balance
- Check if sending is restricted due to Free Plan
- Check if whatsapp sender and content template is configured for sending messages outside the 24-hour messaging window. I can help you set up an alternative that I use to save costs (Reach out via LinkedIn or email)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT License