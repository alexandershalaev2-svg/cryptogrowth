// ===== AI CHAT BOT (Lightweight, Browser-based) =====
const chatResponses = {
    'привет': 'Привет! 👋 Добро пожаловать в CryptoGrowth Protocol! Чем могу помочь?',
    'hello': 'Hello! 👋 Welcome to CryptoGrowth Protocol! How can I help you?',
    'btc': 'Мы принимаем только BTC (Bitcoin). Отправляйте BTC на наш адрес в разделе "Пополнить". Минимальный депозит — $100.',
    'депозит': 'Депозит можно внести в BTC. Выберите план (Starter, Pro или VIP) и отправьте BTC на наш адрес. TX Hash подтвердится автоматически.',
    'вывод': 'Вывод средств осуществляется в BTC на ваш кошелёк. Заявка обрабатывается в течение 24 часов.',
    'прибыль': 'Прибыль начисляется каждый час автоматически! Starter — 0.3%/день, Pro — 0.7%/день, VIP — 1.2%/день.',
    'план': 'У нас 3 плана:\n• Starter — 0.3%/день, 30 дней, от $100\n• Pro — 0.7%/день, 60 дней, от $500\n• VIP — 1.2%/день, 90 дней, от $5,000',
    'реферал': 'Реферальная программа даёт 10% от депозита каждого приглашённого! Поделитесь своим реферальным кодом.',
    'сколько': 'CryptoGrowth Protocol уже выплатил более $1.2M инвесторам. Присоединяйтесь к 8,400+ инвесторам!',
    'безопасно': 'Да, абсолютно безопасно! Мы используем умный трейдинг и майнинг для генерации стабильной прибыли.',
    'как': 'Как начать? Зарегистрируйтесь, внесите BTC, выберите план и получайте прибыль каждый час! 🚀',
    'спасибо': 'Пожалуйста! Если будут вопросы — пишите, мы всегда поможем! 😊',
    'help': 'Я могу помочь с:\n• Депозитом и выводом\n• Выбором плана\n• Реферальной программой\n• Начислением прибыли\nПросто спросите!',
    'работает': 'Да, CryptoGrowth работает 24/7! Прибыль начисляется каждый час автоматически.',
    'кошелёк': 'Ваш BTC кошелёк для вывода можно указать в разделе "Вывод". Используйте адрес сети Bitcoin.',
    'подтверждение': 'TX Hash подтверждается автоматически через блокчейн Bitcoin. Обычно это занимает 1-3 подтверждения сети.',
    'минимум': 'Минимальный депозит для Starter плана — $100 эквивалент в BTC.',
    'vip': 'VIP план даёт максимальную прибыль — 1.2% в день! Минимальный депозит — $5,000.',
    'pro': 'Pro Trader план — 0.7% в день, 60 дней. Минимальный депозит — $500. Самый популярный план! 🌟',
};

const defaultResponses = [
    'Спасибо за вопрос! Для подробной информации свяжитесь с нашей поддержкой или посмотрите раздел FAQ.',
    'Отличный вопрос! Наш менеджер ответит вам в ближайшее время. А пока могу сказать, что CryptoGrowth — надёжная платформа!',
    'Мы обрабатываем ваш запрос. Обычно ответы приходят в течение 5 минут.',
    'Интересный вопрос! Рекомендую посмотреть наши планы инвестирования — там всё подробно описано.',
    'CryptoGrowth Protocol работает 24/7. Прибыль начисляется каждый час автоматически! 🚀',
];

function getAIResponse(message) {
    const msg = message.toLowerCase().trim();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(chatResponses)) {
        if (msg.includes(key)) {
            return response;
        }
    }
    
    // Return random default response
    return getRandomItem(defaultResponses);
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Chat UI
function initChat() {
    // Create chat button
    const chatBtn = document.createElement('button');
    chatBtn.className = 'chat-toggle-btn';
    chatBtn.innerHTML = '💬';
    chatBtn.onclick = toggleChat;
    document.body.appendChild(chatBtn);

    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.id = 'chat-window';
    chatWindow.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-left">
                <span class="chat-bot-avatar">🤖</span>
                <div>
                    <div class="chat-bot-name">CryptoGrowth AI</div>
                    <div class="chat-bot-status">Онлайн</div>
                </div>
            </div>
            <button class="chat-close-btn" onclick="toggleChat()">✕</button>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="chat-message bot">
                <div class="chat-bubble">
                    Привет! 👋 Я AI-ассистент CryptoGrowth Protocol. Чем могу помочь?
                </div>
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Введите сообщение..." maxlength="500">
            <button id="chat-send-btn" onclick="sendMessage()">➤</button>
        </div>
    `;
    document.body.appendChild(chatWindow);

    // Enter key to send
    const input = document.getElementById('chat-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;
    
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
        chatWindow.classList.add('show');
        const input = document.getElementById('chat-input');
        if (input) input.focus();
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;

    const message = input.value.trim();
    const messagesContainer = document.getElementById('chat-messages');

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `<div class="chat-bubble">${escapeHtml(message)}</div>`;
    messagesContainer.appendChild(userMsg);

    // Clear input
    input.value = '';

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Show typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-message bot';
    typingMsg.id = 'typing-indicator';
    typingMsg.innerHTML = `<div class="chat-bubble typing"><span>.</span><span>.</span><span>.</span></div>`;
    messagesContainer.appendChild(typingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Generate AI response
    setTimeout(() => {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();

        const response = getAIResponse(message);
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerHTML = `<div class="chat-bubble">${response}</div>`;
        messagesContainer.appendChild(botMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 800 + Math.random() * 700); // Random delay 0.8-1.5s
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize chat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
} else {
    initChat();
}
