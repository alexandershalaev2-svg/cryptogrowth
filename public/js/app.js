// ===== GLOBAL STATE =====
let currentUser = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        if (window.location.pathname.includes('dashboard')) {
            loadDashboard();
        }
    }
});

// ===== AUTH FUNCTIONS =====

function showLogin() {
    const modal = document.getElementById('auth-modal');
    document.getElementById('modal-title').textContent = 'Вход';
    document.getElementById('auth-btn').textContent = 'Войти';
    document.getElementById('auth-form').onsubmit = handleLogin;
    modal.style.display = 'block';
}

function showRegister() {
    const modal = document.getElementById('auth-modal');
    document.getElementById('modal-title').textContent = 'Регистрация';
    document.getElementById('auth-btn').textContent = 'Создать аккаунт';
    document.getElementById('auth-form').onsubmit = handleRegister;
    modal.style.display = 'block';
}

function closeModal(modalId) {
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
        const msg = modal.querySelector('#' + modalId + '-msg') || modal.querySelector('p[id$="-msg"]');
        if (msg) msg.textContent = '';
    } else {
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.style.display = 'none';
        const authMsg = document.getElementById('auth-msg');
        if (authMsg) authMsg.textContent = '';
        const authForm = document.getElementById('auth-form');
        if (authForm) authForm.reset();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const referral = document.getElementById('referral').value;

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, referral: referral || null })
        });
        const data = await res.json();
        
        if (res.ok) {
            document.getElementById('auth-msg').style.color = '#00fff7';
            document.getElementById('auth-msg').textContent = data.message + '. Ваш реферальный код: ' + data.referralCode;
            setTimeout(() => {
                showLogin();
            }, 2000);
        } else {
            document.getElementById('auth-msg').style.color = '#e94560';
            document.getElementById('auth-msg').textContent = data.error;
        }
    } catch (err) {
        document.getElementById('auth-msg').style.color = '#e94560';
        document.getElementById('auth-msg').textContent = 'Ошибка соединения с сервером';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            currentUser = data;
            localStorage.setItem('currentUser', JSON.stringify(data));
            closeModal();
            window.location.href = '/dashboard.html';
        } else {
            document.getElementById('auth-msg').style.color = '#e94560';
            document.getElementById('auth-msg').textContent = data.error;
        }
    } catch (err) {
        document.getElementById('auth-msg').style.color = '#e94560';
        document.getElementById('auth-msg').textContent = 'Ошибка соединения с сервером';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '/index.html';
}

// ===== DASHBOARD FUNCTIONS =====

async function loadDashboard() {
    if (!currentUser) {
        window.location.href = '/index.html';
        return;
    }

    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-balance').textContent = '$' + (currentUser.balance || 0).toFixed(2);
    document.getElementById('user-profit').textContent = '$' + (currentUser.profit || 0).toFixed(2);
    document.getElementById('referral-code').textContent = currentUser.referral_code || 'N/A';

    try {
        const res = await fetch('/api/user/' + currentUser.id);
        const data = await res.json();

        if (data.investments && data.investments.length > 0) {
            document.getElementById('active-plans-count').textContent = data.investments.length;
            renderInvestments(data.investments);
        } else {
            document.getElementById('active-plans-count').textContent = '0';
            document.getElementById('investments-list').innerHTML = '<p>У вас пока нет активных инвестиций.</p>';
        }

        await loadTransactions(data.id);
    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

function renderInvestments(investments) {
    const container = document.getElementById('investments-list');
    container.innerHTML = '';

    investments.forEach(inv => {
        const card = document.createElement('div');
        card.className = 'investment-card';
        const startDate = inv.start_date ? new Date(inv.start_date).toLocaleDateString() : 'N/A';
        const endDate = inv.end_date ? new Date(inv.end_date).toLocaleDateString() : 'N/A';
        card.innerHTML = `
            <div class="plan-info">
                <h4>${inv.plan_name}</h4>
                <p>Ставка: ${inv.daily_rate}% в день</p>
                <p>Начало: ${startDate}</p>
                <p>Окончание: ${endDate}</p>
            </div>
            <div class="plan-amount">$${parseFloat(inv.amount).toFixed(2)}</div>
        `;
        container.appendChild(card);
    });
}

async function loadTransactions(userId) {
    try {
        const res = await fetch('/api/transactions/' + userId);
        const transactions = await res.json();
        
        const tbody = document.getElementById('transactions-body');
        
        if (!transactions || transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#a0a0c0;">Транзакций пока нет.</td></tr>';
            return;
        }

        tbody.innerHTML = transactions.map(tx => {
            const typeLabels = {
                'deposit': 'Депозит',
                'withdraw': 'Вывод',
                'profit': 'Прибыль',
                'referral': 'Реферал'
            };
            const statusClass = tx.status === 'completed' ? 'status-completed' : 'status-pending';
            const statusLabels = {
                'completed': 'Выполнено',
                'pending': 'В обработке'
            };
            const date = tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'N/A';
            
            return `<tr>
                <td>${typeLabels[tx.type] || tx.type}</td>
                <td>$${parseFloat(tx.amount).toFixed(2)}</td>
                <td>${date}</td>
                <td class="${statusClass}">${statusLabels[tx.status] || tx.status}</td>
            </tr>`;
        }).join('');
    } catch (err) {
        console.error('Error loading transactions:', err);
        const tbody = document.getElementById('transactions-body');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#e94560;">Ошибка загрузки</td></tr>';
    }
}

// ===== DEPOSIT/WITHDRAW MODALS =====

function showDepositModal() {
    const modal = document.getElementById('deposit-modal');
    if (!modal) return;
    modal.style.display = 'block';
}

function showWithdrawModal() {
    const modal = document.getElementById('withdraw-modal');
    if (!modal) return;
    modal.style.display = 'block';
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
