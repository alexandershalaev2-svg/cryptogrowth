# Как выложить CryptoGrowth в интернет

## Способ 1: Render.com (Бесплатно, рекомендуется)

### Шаг 1: Создайте репозиторий на GitHub
1. Зайдите на github.com → создайте новый репозиторий
2. Загрузите все файлы проекта:
```bash
cd d:\cheat\cryptogrowth-protocol
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_НИК/cryptogrowth.git
git push -u origin main
```

### Шаг 2: Разверните на Render
1. Зайдите на render.com → зарегистрируйтесь
2. Нажмите "New +" → "Web Service"
3. Подключите ваш GitHub репозиторий
4. Настройте:
   - **Name**: cryptogrowth-protocol
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: (leave blank)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Нажмите "Create Web Service"
6. Через 2-3 минуты сайт будет доступен по ссылке вида:
   `https://cryptogrowth-protocol.onrender.com`

### Шаг 3: Готово!
- Поделитесь ссылкой с пользователями
- Сайт будет работать 24/7 (бесплатный план имеет небольшой sleep после простоя)

---

## Способ 2: Railway.app (Бесплатно)

1. Зайдите на railway.app → зарегистрируйтесь
2. Нажмите "New Project" → "Deploy from GitHub"
3. Выберите ваш репозиторий
4. Нажмите "Deploy"
5. Готово! Ссылка будет вида: `https://cryptogrowth-protocol.railway.app`

---

## Способ 3: Vercel (Бесплатно)

1. Установите Vercel: `npm i -g vercel`
2. Перейдите в папку проекта: `cd d:\cheat\cryptogrowth-protocol`
3. Запустите: `vercel deploy`
4. Следуйте инструкциям
5. Сайт будет доступен по ссылке вида: `https://cryptogrowth-protocol.vercel.app`

---

## Способ 4: Купите домен и хостинг (Платно, профессионально)

### Купите домен:
- reg.ru (для РФ) — ~200₽/год
- namecheap.com (международный) — ~$10/год

### Хостинг:
- **Timeweb.cloud** — от 200₽/мес
- **Beget.com** — от 150₽/мес
- **DigitalOcean** — от $4/мес

### Инструкция для Timeweb:
1. Купите домен и VPS хостинг
2. Установите Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
```
3. Установите PM2 (менеджер процессов):
```bash
npm install -g pm2
```
4. Загрузите файлы на сервер через FTP/SFTP
5. Запустите:
```bash
cd /path/to/cryptogrowth-protocol
npm install
pm2 start server.js --name cryptogrowth
pm2 save
pm2 startup
```
6. Настройте Nginx как reverse proxy (опционально)

---

## Рекомендация

Для начала используйте **Render.com** или **Railway.app** — бесплатно, быстро, без настройки серверов.
Когда наберёте первых пользователей — купите домен и переедьте на платный хостинг.
