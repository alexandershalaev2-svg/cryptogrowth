// ===== AI CHAT BOT (Lightweight, Browser-based) =====
const chatResponses = {
    // Russian responses
    'привет': 'Привет! 👋 Добро пожаловать в CryptoGrowth Protocol! Чем могу помочь?',
    'здравствуй': 'Здравствуйте! 👋 Добро пожаловать в CryptoGrowth Protocol! Чем могу помочь?',
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
    'работает': 'Да, CryptoGrowth работает 24/7! Прибыль начисляется каждый час автоматически.',
    'кошелёк': 'Ваш BTC кошелёк для вывода можно указать в разделе "Вывод". Используйте адрес сети Bitcoin.',
    'подтверждение': 'TX Hash подтверждается автоматически через блокчейн Bitcoin. Обычно это занимает 1-3 подтверждения сети.',
    'минимум': 'Минимальный депозит для Starter плана — $100 эквивалент в BTC.',
    'vip': 'VIP план даёт максимальную прибыль — 1.2% в день! Минимальный депозит — $5,000.',
    'pro': 'Pro Trader план — 0.7% в день, 60 дней. Минимальный депозит — $500. Самый популярный план! 🌟',
    'помощь': 'Я могу помочь с:\n• Депозитом и выводом\n• Выбором плана\n• Реферальной программой\n• Начислением прибыли\nПросто спросите!',
    
    // English responses
    'hello': 'Hello! 👋 Welcome to CryptoGrowth Protocol! How can I help you?',
    'hi': 'Hi there! 👋 Welcome to CryptoGrowth Protocol! How can I help you?',
    'hey': 'Hey! 👋 Welcome to CryptoGrowth Protocol! How can I help you?',
    'btc': 'We only accept BTC (Bitcoin). Send BTC to our address in the "Deposit" section. Minimum deposit — $100.',
    'deposit': 'You can deposit in BTC. Choose a plan (Starter, Pro or VIP) and send BTC to our address. TX Hash will be verified automatically.',
    'withdraw': 'Withdrawals are made in BTC to your wallet. Request is processed within 24 hours.',
    'profit': 'Profit is credited every hour automatically! Starter — 0.3%/day, Pro — 0.7%/day, VIP — 1.2%/day.',
    'plan': 'We have 3 plans:\n• Starter — 0.3%/day, 30 days, from $100\n• Pro — 0.7%/day, 60 days, from $500\n• VIP — 1.2%/day, 90 days, from $5,000',
    'referral': 'Referral program gives you 10% of every invited person\'s deposit! Share your referral code.',
    'how much': 'CryptoGrowth Protocol has paid out over $1.2M to investors. Join 8,400+ investors!',
    'safe': 'Yes, absolutely safe! We use smart trading and mining to generate stable profit.',
    'how': 'How to start? Register, deposit BTC, choose a plan and earn profit every hour! 🚀',
    'thanks': 'You\'re welcome! If you have questions — just ask, we\'re always here to help! 😊',
    'help': 'I can help with:\n• Deposits and withdrawals\n• Plan selection\n• Referral program\n• Profit earning\nJust ask!',
    'working': 'Yes, CryptoGrowth works 24/7! Profit is credited every hour automatically.',
    'wallet': 'Your BTC withdrawal wallet address can be set in the "Withdraw" section. Use Bitcoin network address.',
    'confirm': 'TX Hash is verified automatically through Bitcoin blockchain. Usually takes 1-3 network confirmations.',
    'minimum': 'Minimum deposit for Starter plan is $100 equivalent in BTC.',
    'vip': 'VIP plan gives maximum profit — 1.2% per day! Minimum deposit — $5,000.',
    'pro': 'Pro Trader plan — 0.7% per day, 60 days. Minimum deposit — $500. Most popular plan! 🌟',
    'doing': 'We\'re doing great! Thanks for asking! 😊 CryptoGrowth Protocol is working 24/7. How can I help you?',
    'speak': 'Yes! I can speak English! 🇬🇧 Ask me anything about deposits, withdrawals, plans, or profits.',
    'english': 'Yes! I can speak English! 🇬🇧 Ask me anything about deposits, withdrawals, plans, or profits.',
};

const defaultResponsesRu = [
    'Спасибо за вопрос! Для подробной информации свяжитесь с нашей поддержкой или посмотрите раздел FAQ.',
    'Отличный вопрос! Наш менеджер ответит вам в ближайшее время. А пока могу сказать, что CryptoGrowth — надёжная платформа!',
    'Мы обрабатываем ваш запрос. Обычно ответы приходят в течение 5 минут.',
    'Интересный вопрос! Рекомендую посмотреть наши планы инвестирования — там всё подробно описано.',
    'CryptoGrowth Protocol работает 24/7. Прибыль начисляется каждый час автоматически! 🚀',
];

const defaultResponsesEn = [
    'Thanks for your question! For more details check our FAQ or contact support.',
    'Great question! Our manager will reply shortly. Meanwhile, CryptoGrowth is a reliable platform!',
    'We\'re processing your request. Answers usually come within 5 minutes.',
    'Interesting question! I recommend checking our investment plans — everything is described there.',
    'CryptoGrowth Protocol works 24/7. Profit is credited every hour automatically! 🚀',
];

function isEnglish(text) {
    // Check for Cyrillic characters — if text contains Cyrillic, it's Russian
    const cyrillicPattern = /[\u0400-\u04FF]/;
    if (cyrillicPattern.test(text)) return false;
    
    // If no Cyrillic, check for English indicators
    const englishWords = ['the', 'is', 'in', 'to', 'for', 'you', 'your', 'how', 'what', 'can', 'plan', 'deposit', 'withdraw', 'profit', 'help', 'thanks', 'hello', 'hi', 'hey', 'btc', 'safe', 'working', 'wallet', 'minimum', 'english', 'speak', 'doing', 'much', 'referral', 'confirm', 'day', 'per', 'from', 'are', 'my', 'me', 'get', 'give', 'money', 'invest', 'start', 'need', 'want', 'good', 'great', 'best', 'very', 'just', 'also', 'only', 'more', 'about', 'when', 'where', 'which', 'who', 'will', 'would', 'there', 'their', 'they', 'been', 'have', 'has', 'had', 'not', 'with', 'that', 'this', 'but', 'and', 'or', 'so', 'at', 'by', 'on', 'as', 'it', 'be', 'are', 'was', 'were'];
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return false;
    
    let englishCount = 0;
    for (const word of words) {
        if (englishWords.includes(word)) englishCount++;
    }
    // If more than 40% of words are English function/content words, treat as English
    return englishCount > words.length * 0.4;
}

function getAIResponse(message) {
    const msg = message.toLowerCase().trim();
    const useEnglish = isEnglish(message);
    const responses = useEnglish ? defaultResponsesEn : defaultResponsesRu;
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(chatResponses)) {
        if (msg.includes(key)) {
            return response;
        }
    }
    
    // Return random default response in the detected language
    return getRandomItem(responses);
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
                <div class="chat-bubble" id="chat-greeting"></div>
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Введите сообщение..." maxlength="500">
            <button id="chat-send-btn" onclick="sendMessage()">➤</button>
        </div>
    `;
    document.body.appendChild(chatWindow);

    // Set language-appropriate greeting
    const greetingEl = document.getElementById('chat-greeting');
    if (greetingEl) {
        greetingEl.textContent = 'Hello! 👋 I am the CryptoGrowth AI assistant. How can I help you?';
    }
    
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
