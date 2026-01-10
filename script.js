// Основные переменные
let currentPage = 'home';
let bannerInterval = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', async function() {
    document.getElementById('loader').style.display = 'none';
    
    try {
        await window.TelegramAuth.init();
        window.TelegramAuth.showWelcomeAnimation();
        
        initializeApp();
        setupEventListeners();
        updateProfileDisplay();
        setupProfileButtons();
        checkAdminStatus();
        
        switchPage('home');
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        initializeApp();
        setupEventListeners();
        switchPage('home');
    }
});

function initializeApp() {
    loadAppConfig();
    
    setTimeout(() => {
        loadUpcomingFights();
        loadFightArchive();
        loadFighters();
    }, 100);
}

function loadAppConfig() {
    document.getElementById('app-title').textContent = APP_CONFIG.appName;
    const logoImg = document.getElementById('app-logo');
    logoImg.src = APP_CONFIG.logoUrl;
    logoImg.onerror = function() {
        this.src = 'https://via.placeholder.com/50/FF6B6B/FFFFFF?text=EFC';
    };
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
            <button class="btn-primary buy-ticket-btn" data-fight-id="${fight.id}">
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
            <a href="${video.videoUrl}" target="_blank" class="video-link">
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" 
                     onerror="this.src='https://via.placeholder.com/400x225/333/fff?text=Бой'">
                <h3>${video.title}</h3>
                <p class="video-description">${video.description}</p>
                <div class="video-date">${video.date}</div>
            </a>
        `;
        container.appendChild(videoCard);
    });
}

function loadFighters() {
    const container = document.getElementById('fighters-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Бойцы вне категорий
    const noCategory = document.createElement('div');
    noCategory.className = 'fighters-category';
    noCategory.innerHTML = `
        <h3 class="category-title"><i class="fas fa-crown"></i> Вне категорий</h3>
        <div id="no-category-fighters"></div>
    `;
    container.appendChild(noCategory);
    
    // Загружаем бойцов вне категорий
    const noCategoryContainer = document.getElementById('no-category-fighters');
    APP_CONFIG.fighters.no_category.forEach(fighter => {
        noCategoryContainer.appendChild(createFighterCard(fighter));
    });
    
    // Весовые категории
    const weightCategory = document.createElement('div');
    weightCategory.className = 'fighters-category';
    weightCategory.innerHTML = `
        <h3 class="category-title"><i class="fas fa-weight"></i> Весовые категории</h3>
        <div id="weight-category-fighters"></div>
    `;
    container.appendChild(weightCategory);
    
    const weightContainer = document.getElementById('weight-category-fighters');
    APP_CONFIG.fighters.categories.weight_classes.forEach(category => {
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'category-title';
        categoryTitle.style.fontSize = '1.1rem';
        categoryTitle.innerHTML = `<i class="fas fa-tag"></i> ${category.name}`;
        weightContainer.appendChild(categoryTitle);
        
        category.fighters.forEach(fighter => {
            fighter.category = category.id;
            weightContainer.appendChild(createFighterCard(fighter));
        });
    });
    
    // Виды спорта
    const sportCategory = document.createElement('div');
    sportCategory.className = 'fighters-category';
    sportCategory.innerHTML = `
        <h3 class="category-title"><i class="fas fa-dumbbell"></i> Виды спорта</h3>
        <div id="sport-category-fighters"></div>
    `;
    container.appendChild(sportCategory);
    
    const sportContainer = document.getElementById('sport-category-fighters');
    APP_CONFIG.fighters.categories.sports.forEach(category => {
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'category-title';
        categoryTitle.style.fontSize = '1.1rem';
        categoryTitle.innerHTML = `<i class="fas fa-running"></i> ${category.name}`;
        sportContainer.appendChild(categoryTitle);
        
        category.fighters.forEach(fighter => {
            fighter.category = category.id;
            sportContainer.appendChild(createFighterCard(fighter));
        });
    });
}

function createFighterCard(fighter) {
    const card = document.createElement('div');
    card.className = 'fighter-card';
    card.dataset.category = fighter.category || 'no_category';
    
    card.innerHTML = `
        <div class="fighter-photo">
            <img src="${fighter.photo}" alt="${fighter.name}" 
                 onerror="this.src='https://via.placeholder.com/100/333/FFFFFF?text=${fighter.name.charAt(0)}'">
        </div>
        <div class="fighter-info">
            <div class="fighter-rank">${fighter.rank}</div>
            <div class="fighter-name">${fighter.name}</div>
            <div class="fighter-record">${fighter.record}</div>
            <div class="fighter-details">
                <span class="fighter-sport">${fighter.sport}</span>
                <span class="fighter-weight">${fighter.weight_class}</span>
            </div>
            ${fighter.description ? `<div class="fighter-description">${fighter.description}</div>` : ''}
        </div>
    `;
    
    return card;
}

function updateProfileDisplay() {
    const auth = window.TelegramAuth;
    const user = auth.getUser();
    
    if (user) {
        const userName = document.getElementById('user-name');
        const userId = document.getElementById('user-id');
        const userAvatar = document.getElementById('user-avatar');
        
        if (userName) userName.textContent = auth.getUserName();
        if (userId) userId.textContent = `ID: ${auth.getUserId()}`;
        
        if (userAvatar) {
            const avatarUrl = auth.getUserAvatar();
            userAvatar.src = avatarUrl;
            userAvatar.onerror = function() {
                this.src = 'https://via.placeholder.com/200/FF6B6B/FFFFFF?text=' + 
                          (user.first_name?.charAt(0) || 'U');
            };
        }
    }
}

function checkAdminStatus() {
    const auth = window.TelegramAuth;
    const userId = parseInt(auth.getUserId());
    
    if (APP_CONFIG.admins.includes(userId)) {
        document.getElementById('admin-btn').style.display = 'flex';
    }
}

function setupProfileButtons() {
    const auth = window.TelegramAuth;
    const userId = auth.getUserId();
    
    // Ставки
    const betsBtn = document.getElementById('bets-btn');
    if (betsBtn) {
        if (APP_CONFIG.betsAllowedUsers.includes(parseInt(userId))) {
            betsBtn.style.display = 'flex';
            betsBtn.addEventListener('click', () => {
                alert('Функция ставок в разработке');
            });
        }
    }
    
    // Мои бои
    const myFightsBtn = document.getElementById('my-fights-btn');
    myFightsBtn.addEventListener('click', () => {
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
    updateContractButton();
    
    contractBtn.addEventListener('click', () => {
        if (APP_CONFIG.contracts[userId]) {
            showContract();
        } else {
            showApplicationForm();
        }
    });
    
    // Пользовательское соглашение
    document.getElementById('agreement-btn').addEventListener('click', () => {
        window.open(APP_CONFIG.agreementUrl, '_blank');
    });
    
    // Техподдержка
    document.getElementById('support-btn').addEventListener('click', () => {
        window.open(APP_CONFIG.supportUrl, '_blank');
    });
    
    // Мои билеты
    document.getElementById('my-tickets-btn').addEventListener('click', showMyTickets);
    
    // Админ панель
    document.getElementById('admin-btn').addEventListener('click', showAdminPanel);
}

function updateContractButton() {
    const userId = window.TelegramAuth.getUserId();
    const title = document.getElementById('contract-btn-title');
    const subtitle = document.getElementById('contract-btn-subtitle');
    
    if (APP_CONFIG.contracts[userId]) {
        title.textContent = 'Мой контракт';
        subtitle.textContent = 'Просмотреть контракт';
    }
}

function showMyTickets() {
    const modal = document.getElementById('tickets-modal');
    const container = document.getElementById('tickets-list');
    
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    
    if (tickets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <p>Билетов пока нет</p>
            </div>
        `;
    } else {
        container.innerHTML = tickets.map(ticket => `
            <div class="ticket-item">
                <div class="ticket-header">
                    <div class="ticket-fighters">${ticket.fighters.join(' vs ')}</div>
                    <div class="ticket-price">${ticket.price} руб.</div>
                </div>
                <div class="ticket-details">
                    <p><i class="far fa-calendar"></i> ${ticket.date} ${ticket.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${ticket.place}</p>
                    <p><i class="far fa-clock"></i> Куплен: ${ticket.purchaseDate} ${ticket.purchaseTime}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Очистка билетов
    document.getElementById('clear-tickets-btn').addEventListener('click', clearTickets);
    
    modal.classList.add('active');
}

function clearTickets() {
    if (confirm('Вы уверены, что хотите удалить все билеты?')) {
        localStorage.removeItem('tickets');
        showMyTickets();
        alert('Все билеты удалены');
    }
}

function showMyFights() {
    const userId = window.TelegramAuth.getUserId();
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
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-edit"></i> Анкета для участия в боях</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p style="text-align: center; margin-bottom: 25px; color: rgba(255,255,255,0.7);">
                    Заполните анкету для участия в школьных боях EFC™
                </p>
                
                <div class="form-section">
                    <h3 class="form-section-title"><i class="fas fa-user"></i> Личная информация</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="app-fullname">ФИО *</label>
                            <input type="text" id="app-fullname" class="form-input" placeholder="Иванов Иван Иванович" required>
                        </div>
                        <div class="form-group">
                            <label for="app-birthdate">Дата рождения *</label>
                            <input type="date" id="app-birthdate" class="form-input" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="app-height">Рост (см) *</label>
                            <input type="number" id="app-height" class="form-input" placeholder="180" required>
                        </div>
                        <div class="form-group">
                            <label for="app-weight">Вес (кг) *</label>
                            <input type="number" id="app-weight" class="form-input" placeholder="75" required>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3 class="form-section-title"><i class="fas fa-dumbbell"></i> Спортивные данные</h3>
                    <div class="form-group">
                        <label for="app-experience">Опыт в единоборствах</label>
                        <textarea id="app-experience" class="form-textarea" placeholder="Опыт тренировок, участие в соревнованиях..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="app-achievements">Достижения в спорте</label>
                        <textarea id="app-achievements" class="form-textarea" placeholder="Награды, звания, разряды..."></textarea>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3 class="form-section-title"><i class="fas fa-heartbeat"></i> Состояние здоровья</h3>
                    <div class="form-group">
                        <label for="app-health">Состояние здоровья, противопоказания *</label>
                        <textarea id="app-health" class="form-textarea" placeholder="Хронические заболевания, травмы, ограничения..." required></textarea>
                        <div class="form-note">* Обязательно укажите все медицинские противопоказания</div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3 class="form-section-title"><i class="fas fa-phone"></i> Контактная информация</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="app-contact">Контактный телефон *</label>
                            <input type="tel" id="app-contact" class="form-input" placeholder="+7 (999) 123-45-67" required>
                        </div>
                        <div class="form-group">
                            <label for="app-email">Email</label>
                            <input type="email" id="app-email" class="form-input" placeholder="email@example.com">
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3 class="form-section-title"><i class="fas fa-calendar-alt"></i> Интересующие секции (необязательно)</h3>
                    <div class="form-group">
                        <label for="training-type">Выберите интересующие направления</label>
                        <select id="training-type" class="form-select">
                            <option value="">Не выбрано</option>
                            ${APP_CONFIG.trainingTypes.map(type => 
                                `<option value="${type.id}">${type.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <button class="btn-primary" id="submit-application-btn">
                        <i class="fas fa-paper-plane"></i> Отправить анкету в Telegram
                    </button>
                    <button class="btn-secondary" id="clear-form-btn" style="margin-top: 10px;">
                        <i class="fas fa-eraser"></i> Очистить форму
                    </button>
                </div>
                
                <p style="text-align: center; margin-top: 20px; color: rgba(255,255,255,0.6); font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> После отправки анкеты мы свяжемся с вами в Telegram
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Обработчики
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    document.getElementById('submit-application-btn').addEventListener('click', submitApplication);
    document.getElementById('clear-form-btn').addEventListener('click', () => {
        modal.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
    });
}

function submitApplication() {
    const auth = window.TelegramAuth;
    
    const application = {
        fullName: document.getElementById('app-fullname')?.value,
        birthDate: document.getElementById('app-birthdate')?.value,
        height: document.getElementById('app-height')?.value,
        weight: document.getElementById('app-weight')?.value,
        achievements: document.getElementById('app-achievements')?.value,
        healthInfo: document.getElementById('app-health')?.value,
        experience: document.getElementById('app-experience')?.value,
        contact: document.getElementById('app-contact')?.value,
        email: document.getElementById('app-email')?.value,
        trainingType: document.getElementById('training-type')?.value,
        submissionDate: new Date().toLocaleString('ru-RU'),
        userId: auth.getUserId(),
        userName: auth.getUserName()
    };
    
    if (!application.fullName || !application.birthDate || !application.contact) {
        alert('Заполните обязательные поля!');
        return;
    }
    
    const message = `📋 НОВАЯ АНКЕТА EFC™
    
👤 Пользователь: ${application.userName}
🆔 ID: ${application.userId}
📅 Дата подачи: ${application.submissionDate}

📝 Личные данные:
• ФИО: ${application.fullName}
• Дата рождения: ${application.birthDate}
• Рост: ${application.height} см
• Вес: ${application.weight} кг

🥊 Спортивные данные:
• Опыт: ${application.experience || 'Не указано'}
• Достижения: ${application.achievements || 'Не указаны'}

❤️ Состояние здоровья:
${application.healthInfo}

📞 Контакты:
• Телефон: ${application.contact}
• Email: ${application.email || 'Не указан'}

${application.trainingType ? `🎯 Интересующие секции: ${APP_CONFIG.trainingTypes.find(t => t.id === application.trainingType)?.name || application.trainingType}` : ''}`;
    
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/EDEM_CR?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
    
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));
    
    document.querySelector('.modal.active').remove();
    alert('✅ Анкета сформирована! Откройте Telegram для отправки.');
}

function showContract() {
    const userId = window.TelegramAuth.getUserId();
    const contractUrl = APP_CONFIG.contracts[userId];
    
    if (!contractUrl) {
        alert('Контракт не найден!');
        return;
    }
    
    window.open(contractUrl, '_blank');
}

function showAdminPanel() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    // Статистика
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const totalRevenue = tickets.reduce((sum, t) => sum + (t.price || 0), 0);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-crown"></i> ADMIN PANEL</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-value">${tickets.length}</div>
                        <div class="stat-label">Билетов продано</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${totalRevenue}</div>
                        <div class="stat-label">Выручка (руб.)</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${applications.length}</div>
                        <div class="stat-label">Анкет получено</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${Object.keys(APP_CONFIG.contracts).length}</div>
                        <div class="stat-label">Контрактов</div>
                    </div>
                </div>
                
                <div class="admin-actions">
                    <button class="admin-btn" id="view-applications-btn">
                        <i class="fas fa-list"></i> Просмотр анкет (${applications.length})
                    </button>
                    <button class="admin-btn" id="clear-data-btn">
                        <i class="fas fa-trash"></i> Очистить все данные
                    </button>
                    <button class="admin-btn" id="export-data-btn">
                        <i class="fas fa-download"></i> Экспорт данных
                    </button>
                    <button class="admin-btn" id="manage-fighters-btn">
                        <i class="fas fa-users"></i> Управление бойцами
                    </button>
                    <button class="admin-btn" id="manage-contracts-btn">
                        <i class="fas fa-file-contract"></i> Управление контрактами
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Обработчики
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Функции админ панели
    document.getElementById('view-applications-btn').addEventListener('click', () => {
        if (applications.length === 0) {
            alert('Анкет нет');
            return;
        }
        
        let message = '📋 Все анкеты:\n\n';
        applications.forEach((app, i) => {
            message += `${i+1}. ${app.fullName} (ID: ${app.userId})\n`;
            message += `   Телефон: ${app.contact}\n`;
            message += `   Дата: ${app.submissionDate}\n\n`;
        });
        
        alert(message);
    });
    
    document.getElementById('clear-data-btn').addEventListener('click', () => {
        if (confirm('УДАЛИТЬ ВСЕ ДАННЫЕ?\n\nБудут удалены:\n• Все билеты\n• Все анкеты\n• Статистика')) {
            localStorage.clear();
            modal.remove();
            alert('Все данные удалены');
            location.reload();
        }
    });
    
    document.getElementById('export-data-btn').addEventListener('click', () => {
        const data = {
            tickets: tickets,
            applications: applications,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `efc_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Данные экспортированы');
    });
    
    document.getElementById('manage-fighters-btn').addEventListener('click', () => {
        alert('Функция управления бойцами в разработке');
    });
    
    document.getElementById('manage-contracts-btn').addEventListener('click', () => {
        alert('Функция управления контрактами в разработке');
    });
}

function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
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
        
        if (e.target.closest('.video-link')) {
            e.preventDefault();
            window.open(e.target.closest('.video-link').href, '_blank');
        }
    });
    
    // Закрытие модалок
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close')) {
            e.target.closest('.modal').classList.remove('active');
        }
        
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
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
        purchaseDate: new Date().toLocaleDateString('ru-RU'),
        purchaseTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
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
    
    setTimeout(() => {
        if (page === 'videos') {
            loadFightArchive();
        } else if (page === 'home') {
            loadUpcomingFights();
        } else if (page === 'fighters') {
            loadFighters();
        }
    }, 100);
}

window.addEventListener('load', function() {
    document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
});