// ===== LIVE PAYOUTS TICKER =====
const payoutNames = [
    'Алексей М.', 'Мария К.', 'Дмитрий В.', 'Елена С.', 'Сергей П.',
    'Анна Б.', 'Иван Т.', 'Ольга Н.', 'Николай Д.', 'Татьяна Л.',
    'Андрей Г.', 'Наталья Р.', 'Павел Ш.', 'Ирина Ф.', 'Михаил З.',
    'Екатерина О.', 'Владимир Ч.', 'Светлана Я.', 'Артём Е.', 'Юлия М.',
    'Максим В.', 'Дарья К.', 'Роман С.', 'Алина П.', 'Кирилл Б.',
    'Виктория Л.', 'Егор Н.', 'Полина Г.', 'Тимур Д.', 'Анастасия Р.',
    'Жанна Ш.', 'Олег Ф.', 'Ксения З.', 'Борис О.', 'Лариса Ч.',
    'Григорий Я.', 'Валентина Е.', 'Станислав М.', 'Маргарита К.',
    'Фарид С.', 'Диана П.', 'Руслан Б.', 'Карина Л.', 'Александр Н.'
];

const payoutAmounts = [0.0012, 0.0034, 0.0056, 0.0089, 0.0123, 0.0156, 0.0234, 0.0345, 0.0456, 0.0567, 0.0789, 0.0891, 0.1234, 0.1567, 0.2345, 0.3456, 0.4567, 0.5678, 0.7891, 1.2345, 2.3456, 3.4567, 5.6789];

const payoutEmails = [
    'a***@gmail.com', 'm***@yahoo.com', 'd***@outlook.com', 'e***@mail.ru',
    's***@gmail.com', 'a***@yandex.ru', 'i***@gmail.com', 'o***@hotmail.com',
    'n***@gmail.com', 't***@mail.ru', 'a***@gmail.com', 'n***@yandex.ru',
    'p***@gmail.com', 'i***@outlook.com', 'm***@gmail.com', 'e***@mail.ru',
    'v***@gmail.com', 's***@yahoo.com', 'a***@gmail.com', 'y***@mail.ru'
];

const payoutMethods = ['BTC', 'BTC', 'BTC', 'BTC', 'BTC']; // All BTC

function formatBTC(amount) {
    return amount.toFixed(8);
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAmount() {
    return parseFloat((Math.random() * 0.5 + 0.001).toFixed(6));
}

function createPayoutNotification() {
    const name = getRandomItem(payoutNames);
    const amount = getRandomAmount();
    const email = getRandomItem(payoutEmails);
    const method = getRandomItem(payoutMethods);
    const minutesAgo = Math.floor(Math.random() * 15) + 1;

    const notification = document.createElement('div');
    notification.className = 'payout-notification';
    notification.innerHTML = `
        <div class="payout-icon">₿</div>
        <div class="payout-info">
            <div class="payout-text">
                <span class="payout-name">${name}</span> получил(а)
                <span class="payout-amount">${formatBTC(amount)} ${method}</span>
            </div>
            <div class="payout-meta">
                <span class="payout-email">${email}</span>
                <span class="payout-time">${minutesAgo} мин. назад</span>
            </div>
        </div>
    `;

    // Add to container
    let container = document.getElementById('payouts-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'payouts-container';
        container.className = 'payouts-container';
        
        // Insert before footer on landing page, or after stats on dashboard
        const footer = document.querySelector('footer');
        if (footer) {
            document.body.insertBefore(container, footer);
        } else {
            document.body.appendChild(container);
        }
    }

    container.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Show payouts every 3-8 seconds randomly
function startPayouts() {
    // Show first one quickly
    setTimeout(() => createPayoutNotification(), 2000);
    
    // Then random intervals
    setInterval(() => {
        const delay = Math.random() * 5000 + 3000; // 3-8 seconds
        setTimeout(() => createPayoutNotification(), delay);
    }, 8000);
}

// Start on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPayouts);
} else {
    startPayouts();
}
