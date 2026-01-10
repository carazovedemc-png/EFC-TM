// Основные переменные
let currentPage = 'home';

// Инициализация
document.addEventListener('DOMContentLoaded', async function() {
    // Скрываем лоадер
    document.getElementById('loader').style.display = 'none';
    
    try {
        // Показываем анимацию приветствия (симуляция)
        showWelcomeAnimation();
        
        // Инициализируем приложение
        initializeApp();
        setupEventListeners();
        setupProfileButtons();
        
        // Устанавливаем активную страницу
        switchPage('home');
        
    } catch (error) {
        console.error('Ошибка:', error);
        switchPage('home');
    }
});

function initializeApp() {
    // Загружаем конфигурацию
    loadAppConfig();
    
    // Загружаем контент
    loadUpcomingFights();
    loadFightArchive();
    loadFighters();
}

function loadAppConfig() {
    document.getElementById('app-title').textContent = APP_CONFIG.appName;
    const logoImg = document.getElementById('app-logo');
    logoImg.src = APP_CONFIG.logoUrl;
    logoImg.onerror = function() {
        this.src = 'https://via.placeholder.com/40/FF6B6B/FFFFFF?text=EFC';
    };
}

function showWelcomeAnimation() {
    const welcomeEl = document.getElementById('telegram-welcome');
    const avatarEl = document.getElementById('welcome-avatar');
    const nameEl = document.getElementById('welcome-name');
    const idEl = document.getElementById('welcome-id');
    
    // Тестовые данные
    const userName = "Тестовый Пользователь";
    const userId = "123456789";
    
    if (avatarEl) {
        avatarEl.src = 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=' + userName.charAt(0);
    }
    
    if (nameEl) nameEl.textContent = userName;
    if (idEl) idEl.textContent = `ID: ${userId}`;
    
    // Показываем анимацию
    welcomeEl.classList.add('active');
    
    // Скрываем через 2.5 секунды
    setTimeout(() => {
        welcomeEl.classList.remove('active');
    }, 2500);
}

function loadUpcomingFights() {
    const container = document.querySelector('.fights-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    APP_CONFIG.upcomingFights.forEach(fight => {
        const fightCard = document.createElement('div');
        fightCard.className = 'fight-card';
        fightCard.innerHTML = `
            <h3>${fight.fighters.join(' vs ')}</h3>
            <p><i class="far fa-calendar"></i> ${fight.date} ${fight.time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${fight.place}</p>
            <p><i class="fas fa-ticket-alt"></i> Билет: ${fight.ticketPrice} руб.</p>
            <button class="btn-primary buy-ticket-btn" data-fight-id="${fight.id}" style="margin-top: 10px;">
                Купить билет
            </button>
        `;
        container.appendChild(fightCard);
    });
}

function loadFightArchive() {
    const container = document.querySelector('.videos-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    APP_CONFIG.fightArchive.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" 
                 onerror="this.src='https://via.placeholder.com/400x225/333/fff?text=Бой'">
            <h3>${video.title}</h3>
            <p class="video-description">${video.description}</p>
            <div class="video-date">${video.date}</div>
        `;
        container.appendChild(videoCard);
    });
}

function loadFighters() {
    const container = document.getElementById('fighters-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Сначала бойцы вне категорий
    if (APP_CONFIG.fighters.no_category) {
        APP_CONFIG.fighters.no_category.forEach(fighter => {
            const card = createFighterCard(fighter);
            card.dataset.category = 'no_category';
            container.appendChild(card);
        });
    }
    
    // Затем бойцы из категорий
    if (APP_CONFIG.fighters.categories) {
        // Весовые категории
        if (APP_CONFIG.fighters.categories.weight_classes) {
            APP_CONFIG.fighters.categories.weight_classes.forEach(category => {
                category.fighters.forEach(fighter => {
                    const card = createFighterCard(fighter);
                    card.dataset.category = category.id;
                    container.appendChild(card);
                });
            });
        }
        
        // Виды спорта
        if (APP_CONFIG.fighters.categories.sports) {
            APP_CONFIG.fighters.categories.sports.forEach(category => {
                category.fighters.forEach(fighter => {
                    const card = createFighterCard(fighter);
                    card.dataset.category = category.id;
                    container.appendChild(card);
                });
            });
        }
    }
}

function createFighterCard(fighter) {
    const card = document.createElement('div');
    card.className = 'fighter-card';
    
    card.innerHTML = `
        <div class="fighter-photo">
            <img src="${fighter.photo}" alt="${fighter.name}" 
                 onerror="this.src='https://via.placeholder.com/70/333/FFFFFF?text=${fighter.name.charAt(0)}'">
        </div>
        <div class="fighter-info">
            <div class="fighter-rank">${fighter.rank}</div>
            <div class="fighter-name">${fighter.name}</div>
            <div class="fighter-record">${fighter.record}</div>
            <div class="fighter-details">
                ${fighter.sport} • ${fighter.weight_class}
            </div>
        </div>
    `;
    
    return card;
}

function setupProfileButtons() {
    // Мои билеты
    document.getElementById('my-tickets-btn').addEventListener('click', showMyTickets);
    
    // Мои бои
    document.getElementById('my-fights-btn').addEventListener('click', function() {
        const userId = "123456789"; // Тестовый ID
        if (APP_CONFIG.contracts[userId]) {
            if (APP_CONFIG.userFights && APP_CONFIG.userFights[userId]) {
                showMyFights();
            } else {
                alert('У вас пока нет запланированных боев');
            }
        } else {
            alert('У вас нет контракта с EFC™');
        }
    });
    
    // Анкета/Контракт
    const contractBtn = document.getElementById('contract-btn');
    const userId = "123456789"; // Тестовый ID
    
    if (APP_CONFIG.contracts[userId]) {
        document.getElementById('contract-btn-title').textContent = 'Мой контракт';
        document.getElementById('contract-btn-subtitle').textContent = 'Просмотреть контракт';
        
        contractBtn.addEventListener('click', function() {
            window.open(APP_CONFIG.contracts[userId], '_blank');
        });
    } else {
        contractBtn.addEventListener('click', function() {
            showApplicationForm();
        });
    }
    
    // Пользовательское соглашение
    document.getElementById('agreement-btn').addEventListener('click', function() {
        window.open(APP_CONFIG.agreementUrl, '_blank');
    });
    
    // Техподдержка
    document.getElementById('support-btn').addEventListener('click', function() {
        window.open(APP_CONFIG.supportUrl, '_blank');
    });
    
    // Админ панель
    if (APP_CONFIG.admins.includes(123456789)) {
        document.getElementById('admin-btn').style.display = 'flex';
        document.getElementById('admin-btn').addEventListener('click', showAdminPanel);
    }
}

function showMyTickets() {
    const modal = document.getElementById('tickets-modal');
    const container = document.getElementById('tickets-list');
    
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    
    if (tickets.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6); padding: 20px;">Билетов пока нет</p>';
    } else {
        container.innerHTML = tickets.map(ticket => `
            <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <strong style="color: white;">${ticket.fighters.join(' vs ')}</strong>
                    <span style="color: #4ECDC4; font-weight: bold;">${ticket.price} руб.</span>
                </div>
                <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">
                    <p><i class="far fa-calendar"></i> ${ticket.date} ${ticket.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${ticket.place}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Очистка билетов
    document.getElementById('clear-tickets-btn').addEventListener('click', function() {
        if (confirm('Удалить все билеты?')) {
            localStorage.removeItem('tickets');
            modal.classList.remove('active');
            alert('Билеты удалены');
        }
    });
    
    modal.classList.add('active');
}

function showMyFights() {
    const userId = "123456789";
    const fights = APP_CONFIG.userFights[userId] || [];
    
    let message = 'Ваши бои:\n\n';
    fights.forEach(fight => {
        message += `🥊 Против: ${fight.opponent}\n`;
        message += `📅 Дата: ${fight.date} ${fight.time}\n`;
        message += `📍 Место: ${fight.place}\n`;
        message += `💰 Гонорар: ${fight.reward} руб.\n`;
        message += `📊 Статус: ${fight.status === 'upcoming' ? 'Предстоящий' : 
                                  fight.status === 'completed' ? 'Завершен' : 'Отменен'}\n\n`;
    });
    
    alert(message);
}

function showApplicationForm() {
    let formHTML = `
        <div class="modal-header">
            <h2><i class="fas fa-edit"></i> Анкета для участия</h2>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p style="text-align: center; margin-bottom: 20px; color: rgba(255,255,255,0.7);">
                Заполните анкету для участия в боях EFC™
            </p>
            
            <div class="form-group">
                <label>ФИО *</label>
                <input type="text" id="app-fullname" class="form-input" placeholder="Иванов Иван Иванович" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Дата рождения *</label>
                    <input type="date" id="app-birthdate" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Рост (см) *</label>
                    <input type="number" id="app-height" class="form-input" placeholder="180" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Вес (кг) *</label>
                    <input type="number" id="app-weight" class="form-input" placeholder="75" required>
                </div>
                <div class="form-group">
                    <label>Телефон *</label>
                    <input type="tel" id="app-contact" class="form-input" placeholder="+7 (999) 123-45-67" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>Состояние здоровья *</label>
                <textarea id="app-health" class="form-textarea" placeholder="Хронические заболевания, травмы..." required></textarea>
            </div>
            
            <div class="form-group">
                <label>Опыт в единоборствах</label>
                <textarea id="app-experience" class="form-textarea" placeholder="Опыт тренировок, соревнования..."></textarea>
            </div>
            
            <div style="margin-top: 25px;">
                <button class="btn-primary" id="submit-application-btn">
                    <i class="fas fa-paper-plane"></i> Отправить анкету в Telegram
                </button>
                <button class="btn-secondary" id="close-form-btn" style="margin-top: 10px;">
                    <i class="fas fa-times"></i> Закрыть
                </button>
            </div>
        </div>
    `;
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            ${formHTML}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Обработчики
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-form-btn').addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Отправка анкеты
    document.getElementById('submit-application-btn').addEventListener('click', function() {
        const fullName = document.getElementById('app-fullname').value;
        const birthDate = document.getElementById('app-birthdate').value;
        const contact = document.getElementById('app-contact').value;
        
        if (!fullName || !birthDate || !contact) {
            alert('Заполните обязательные поля!');
            return;
        }
        
        const message = `📋 НОВАЯ АНКЕТА EFC™\n\n👤 ${fullName}\n📅 ${birthDate}\n📞 ${contact}`;
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/EDEM_CR?text=${encodedMessage}`;
        
        window.open(telegramUrl, '_blank');
        modal.remove();
        alert('✅ Анкета сформирована! Откройте Telegram для отправки.');
    });
}

function showAdminPanel() {
    const modal = document.getElementById('admin-modal');
    const container = document.getElementById('admin-content');
    
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: white; margin-bottom: 15px;">Статистика</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px; text-align: center;">
                    <div style="font-size: 1.8rem; font-weight: bold; color: #FF6B6B;">${tickets.length}</div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Билетов</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px; text-align: center;">
                    <div style="font-size: 1.8rem; font-weight: bold; color: #4ECDC4;">${applications.length}</div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Анкет</div>
                </div>
            </div>
        </div>
        
        <div>
            <button class="btn-primary" id="clear-all-data-btn" style="margin-bottom: 10px;">
                <i class="fas fa-trash"></i> Очистить все данные
            </button>
            <button class="btn-secondary" id="close-admin-btn">
                <i class="fas fa-times"></i> Закрыть
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Очистка данных
    document.getElementById('clear-all-data-btn').addEventListener('click', function() {
        if (confirm('УДАЛИТЬ ВСЕ ДАННЫЕ?\n\nВсе билеты и анкеты будут удалены.')) {
            localStorage.clear();
            modal.classList.remove('active');
            alert('Все данные удалены');
        }
    });
    
    document.getElementById('close-admin-btn').addEventListener('click', function() {
        modal.classList.remove('active');
    });
}

function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            switchPage(page);
        });
    });
    
    // Фильтр бойцов
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterFighters(category);
        });
    });
    
    // Покупка билетов
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('buy-ticket-btn')) {
            const fightId = e.target.getAttribute('data-fight-id');
            buyTicket(fightId);
        }
    });
    
    // Закрытие модалок
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

function filterFighters(category) {
    const fighters = document.querySelectorAll('.fighter-card');
    
    fighters.forEach(fighter => {
        if (category === 'all' || fighter.dataset.category === category) {
            fighter.style.display = 'flex';
        } else {
            fighter.style.display = 'none';
        }
    });
}

function buyTicket(fightId) {
    const fight = APP_CONFIG.upcomingFights.find(f => f.id == fightId);
    if (!fight) return;
    
    const ticket = {
        id: Date.now(),
        fightId: fightId,
        fighters: fight.fighters,
        date: fight.date,
        time: fight.time,
        place: fight.place,
        price: fight.ticketPrice,
        purchaseDate: new Date().toLocaleDateString('ru-RU')
    };
    
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    tickets.push(ticket);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    
    alert(`✅ Билет куплен! ${fight.ticketPrice} руб.`);
}

function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        setTimeout(() => targetPage.classList.add('active'), 10);
    }
    
    currentPage = page;
    
    if (page === 'fighters') {
        loadFighters();
    }
}