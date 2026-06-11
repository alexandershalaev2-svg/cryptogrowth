const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// --- НАСТРОЙКА БАЗЫ ДАННЫХ (SQLite) ---
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./crypto_growth.db');

db.serialize(() => {
    // Таблица пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        balance REAL DEFAULT 0,
        profit REAL DEFAULT 0,
        referral_code TEXT UNIQUE,
        referred_by INTEGER
    )`);

    // Таблица депозитов (планов)
    db.run(`CREATE TABLE IF NOT EXISTS investments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        plan_name TEXT,
        amount REAL,
        daily_rate REAL,
        start_date TEXT,
        end_date TEXT,
        status TEXT DEFAULT 'active',
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Таблица транзакций
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        amount REAL,
        tx_hash TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Таблица аналитики
    db.run(`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        ip TEXT,
        user_agent TEXT,
        page TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Админ аккаунт (email: admin@crypto.com, pass: admin123)
    const adminPass = bcrypt.hashSync('admin123', 10);
    db.run(
        "INSERT OR IGNORE INTO users (email, password, referral_code) VALUES (?, ?, ?)",
        ['admin@crypto.com', adminPass, 'ADMIN001']
    );
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- TRACK VISITS & REGISTRATIONS ---
function trackVisit(req, page) {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    db.run(
        "INSERT INTO analytics (type, ip, user_agent, page) VALUES (?, ?, ?, ?)",
        ['visit', ip, userAgent.substring(0, 500), page]
    );
}

// Track every page visit
app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/css/') || req.path.startsWith('/js/')) {
        return next();
    }
    trackVisit(req, req.path);
    next();
});

// --- API ENDPOINTS ---

// 1. Регистрация
app.post('/api/register', (req, res) => {
    const { email, password, referral } = req.body;
    const referralCode = uuidv4().substring(0, 8).toUpperCase();
    
    // Проверка реферала
    let referred_by = null;
    if (referral) {
        db.get("SELECT id FROM users WHERE referral_code = ?", [referral], (err, row) => {
            if (row) referred_by = row.id;
        });
    }

    const hash = bcrypt.hashSync(password, 10);
    db.run(
        "INSERT INTO users (email, password, referral_code, referred_by) VALUES (?, ?, ?, ?)",
        [email, hash, referralCode, referred_by],
        function(err) {
            if (err) return res.status(400).json({ error: 'Email уже занят' });
            res.json({ message: 'Регистрация успешна', referralCode });
        }
    );
});

// 2. Вход
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ error: 'Неверный email или пароль' });
        }
        res.json({ 
            id: user.id, 
            email: user.email, 
            balance: user.balance, 
            profit: user.profit,
            referral_code: user.referral_code 
        });
    });
});

// 3. Получение данных пользователя
app.get('/api/user/:id', (req, res) => {
    db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        db.all("SELECT * FROM investments WHERE user_id = ? AND status = 'active'", [req.params.id], (err, investments) => {
            res.json({ ...user, investments });
        });
    });
});

// 4. Создание депозита
app.post('/api/invest', (req, res) => {
    const { userId, planName, amount, txHash } = req.body;
    // Расчет плана
    let dailyRate = 0.3; // Starter
    let durationDays = 30;
    if (planName === 'Pro') { dailyRate = 0.7; durationDays = 60; }
    if (planName === 'VIP') { dailyRate = 1.2; durationDays = 90; }

    const startDate = new Date().toISOString();
    const endDate = new Date(new Date().setDate(new Date().getDate() + durationDays)).toISOString();

    const id = uuidv4();
    
    db.run(
        "INSERT INTO investments (user_id, plan_name, amount, daily_rate, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, 'active')",
        [userId, planName, amount, dailyRate, startDate, endDate],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            // Запись транзакции
            db.run(
                "INSERT INTO transactions (user_id, type, amount, tx_hash, status) VALUES (?, 'deposit', ?, ?, 'completed')",
                [userId, amount, txHash]
            );

            // Начисление на баланс (визуально)
            db.run("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, userId]);

            // Реферальный бонус (10% первому рефереру)
            db.get("SELECT referred_by FROM users WHERE id = ?", [userId], (err, rowData) => {
                if (rowData && rowData.referred_by) {
                    const bonus = amount * 0.10;
                    db.run("UPDATE users SET balance = balance + ? WHERE id = ?", [bonus, rowData.referred_by]);
                }
            });

            res.json({ message: 'Инвестиция создана', investmentId: id });
        }
    );
});

// 5. Начисление процентов (Cron job каждый час)
setInterval(() => {
    console.log('Начисление процентов...');
    db.all("SELECT * FROM investments WHERE status = 'active'", [], (err, investments) => {
        if (err) return;
        
        investments.forEach(inv => {
            // Рассчитываем долю за час (daily_rate / 24)
            const hourlyProfit = (inv.amount * inv.daily_rate) / 100 / 24;
            
            if (hourlyProfit > 0) {
                // 1. Обновляем баланс пользователя
                db.run("UPDATE users SET balance = balance + ?, profit = profit + ? WHERE id = ?", 
                    [hourlyProfit, hourlyProfit, inv.user_id]);
                
                // 2. Записываем транзакцию
                db.run("INSERT INTO transactions (user_id, type, amount, status) VALUES (?, 'profit', ?, 'completed')",
                    [inv.user_id, hourlyProfit]);
            }
        });
    });
}, 3600000); // 1 час

// 6. Вывод средств
app.post('/api/withdraw', (req, res) => {
    const { userId, amount, wallet } = req.body;
    db.get("SELECT balance FROM users WHERE id = ?", [userId], (err, user) => {
        if (err || user.balance < amount) {
            return res.status(400).json({ error: 'Недостаточно средств' });
        }
        
        db.run("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, userId]);
        db.run(
            "INSERT INTO transactions (user_id, type, amount, tx_hash, status) VALUES (?, 'withdraw', ?, ?, 'pending')",
            [userId, amount, wallet]
        );
        res.json({ message: 'Заявка на вывод создана', status: 'pending' });
    });
});

// 7. Получение транзакций пользователя
app.get('/api/transactions/:userId', (req, res) => {
    db.all(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
        [req.params.userId],
        (err, transactions) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(transactions || []);
        }
    );
});

// 8. Проверка BTC TX хеша через blockchain API
const https = require('https');

function fetchBlockchainAPI(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'CryptoGrowth/1.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

app.get('/api/verify-tx/:txHash', async (req, res) => {
    const { txHash } = req.params;
    const OUR_BTC_ADDRESS = '364MXZqZRGd8Bsnkssv93S2qd4WL5mZc5U';

    try {
        // Try blockchain.info API
        let txData = await fetchBlockchainAPI(`https://blockchain.info/rawtx/${txHash}?cors=true&format=json`);
        
        if (!txData || txData.error) {
            // Try blockchair.com as fallback
            txData = await fetchBlockchainAPI(`https://api.blockchair.com/bitcoin/dashboards/transactions?key=public_${txHash}`);
        }

        if (!txData) {
            return res.json({ found: false, message: 'TX Hash не найден в блокчейне' });
        }

        // Extract transaction data
        const confirmations = txData.confirmations || 0;
        const valueSatoshi = txData.value || 0;
        const valueBTC = valueSatoshi / 100000000;
        const usdValue = valueBTC * (btcPriceUSD || 63702);

        // Check if any output goes to our address
        let sentToUs = false;
        let sentAmount = 0;
        
        if (txData.out && Array.isArray(txData.out)) {
            for (const output of txData.out) {
                if (output.addr === OUR_BTC_ADDRESS) {
                    sentToUs = true;
                    sentAmount += output.value / 100000000;
                }
            }
        }

        if (!sentToUs) {
            return res.json({
                found: true,
                sentToUs: false,
                confirmations,
                amountBTC: valueBTC,
                message: `Транзакция найдена, но не на наш адрес. Отправьте на: ${OUR_BTC_ADDRESS}`
            });
        }

        if (confirmations < 1) {
            return res.json({
                found: true,
                sentToUs: true,
                confirmations,
                amountBTC: valueBTC,
                usdValue,
                message: '⏳ Транзакция получена, ожидает подтверждений сети...',
                verified: false
            });
        }

        // Fully verified!
        res.json({
            found: true,
            sentToUs: true,
            confirmations,
            amountBTC: valueBTC,
            usdValue,
            message: `✅ TX подтверждена! ${confirmations} подтверждений. Отправлено: ${valueBTC.toFixed(8)} BTC (~$${usdValue.toFixed(2)})`,
            verified: true
        });

    } catch (err) {
        res.json({ found: false, message: 'Ошибка проверки блокчейна' });
    }
});

// 9. Analytics API (admin only, password protected)
const ADMIN_PASSWORD = 'crypto2026';

app.get('/api/analytics', (req, res) => {
    const authHeader = req.headers['x-admin-password'];
    if (!authHeader || authHeader !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Доступ запрещён. Нужен пароль.' });
    }
    const result = {};
    
    // Total visits
    db.get("SELECT COUNT(*) as count FROM analytics WHERE type = 'visit'", [], (err, row) => {
        result.totalVisits = row ? row.count : 0;
        
        // Total registrations
        db.get("SELECT COUNT(*) as count FROM analytics WHERE type = 'register'", [], (err, row) => {
            result.totalRegistrations = row ? row.count : 0;
            
            // Unique visitors (unique IPs)
            db.get("SELECT COUNT(DISTINCT ip) as count FROM analytics WHERE type = 'visit'", [], (err, row) => {
                result.uniqueVisitors = row ? row.count : 0;
                
                // Registrations today
                db.get("SELECT COUNT(*) as count FROM analytics WHERE type = 'register' AND created_at >= datetime('now', '-1 day')", [], (err, row) => {
                    result.registrationsToday = row ? row.count : 0;
                    
                    // Visits today
                    db.get("SELECT COUNT(*) as count FROM analytics WHERE type = 'visit' AND created_at >= datetime('now', '-1 day')", [], (err, row) => {
                        result.visitsToday = row ? row.count : 0;
                        
                        // New users count (from users table)
                        db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
                            result.totalUsers = row ? row.count : 0;
                            
                            // Active investments
                            db.get("SELECT COUNT(*) as count FROM investments WHERE status = 'active'", [], (err, row) => {
                                result.activeInvestments = row ? row.count : 0;
                                
                                // Total deposited
                                db.get("SELECT COALESCE(SUM(amount), 0) as sum FROM investments", [], (err, row) => {
                                    result.totalDeposited = row ? row.sum : 0;
                                    
                                    // Total withdrawn
                                    db.get("SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE type = 'withdraw'", [], (err, row) => {
                                        result.totalWithdrawn = row ? row.sum : 0;
                                        
                                        // Recent registrations (last 10)
                                        db.all(
                                            "SELECT u.email, u.balance, a.created_at FROM analytics a JOIN users u ON u.id = (SELECT id FROM users WHERE referral_code = (SELECT referral_code FROM analytics WHERE type = 'register' ORDER BY id DESC LIMIT 1)) WHERE a.type = 'register' ORDER BY a.created_at DESC LIMIT 10",
                                            [], (err) => {
                                                res.json(result);
                                            }
                                        );
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
