# CryptoGrowth Protocol

HYIP (High Yield Investment Program) crypto investment platform with referral system.

## Quick Start

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## Features

- User registration/login with bcrypt password hashing
- 3 investment plans: Starter (0.3%/day), Pro (0.7%/day), VIP (1.2%/day)
- Hourly profit auto-compounding
- Referral program (10% bonus on referred user's deposit)
- Deposit/Withdraw functionality
- Transaction history
- Dark neon UI design

## Default Admin Account

- Email: `admin@crypto.com`
- Password: `admin123`

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (file-based, no setup required)
- **Frontend:** Vanilla HTML/CSS/JS
- **Security:** bcryptjs for password hashing

## Project Structure

```
cryptogrowth-protocol/
├── server.js          # Express server + API endpoints
├── package.json
├── public/
│   ├── index.html     # Landing page
│   ├── dashboard.html # User dashboard
│   ├── css/style.css  # Dark neon theme
│   └── js/app.js      # Frontend logic
└── crypto_growth.db   # SQLite database (auto-created)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | User login |
| GET | `/api/user/:id` | Get user data + active investments |
| POST | `/api/invest` | Create investment plan |
| POST | `/api/withdraw` | Request withdrawal |
| GET | `/api/transactions/:userId` | Get user transactions |

## Plans

| Plan | Daily Rate | Duration | Min Deposit |
|------|-----------|----------|-------------|
| Starter | 0.3% | 30 days | $100 |
| Pro | 0.7% | 60 days | $500 |
| VIP | 1.2% | 90 days | $5,000 |
