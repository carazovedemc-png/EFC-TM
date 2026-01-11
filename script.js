// Основные переменные
let currentPage = 'home';
let activeFilters = {
    weight: [],
    sport: []
};
let bannerInterval;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Сразу скрываем загрузчик
        document.getElementById('loader').style.display = 'none';
        
        // Инициализируем Telegram Auth (синхронно)
        window.TelegramAuth.init();
        
        // Показываем анимацию приветствия
        window.TelegramAuth.showWelcomeAnimation();
        
        // Обновляем профиль
        updateProfileDisplay();
        
        // Настраиваем кнопки профиля
        setupProfileButtons();
        
        // Инициализируем приложение
        initializeApp();
        setupEventListeners();
        
        // Устанавливаем активную страницу
        switchPage('home');
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        // В случае ошибки все равно продолжаем
        initializeApp();
        setupEventListeners();
        switchPage('home');
        document.getElementById('loader').style.display = 'none';
    }
});

function initializeApp() {
    // Загружаем конфигурацию
    loadAppConfig();
    
    // Загружаем контент
    loadBanners();
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

function loadBanners() {
    const container = document.querySelector('.banner-container');
    if (!container) return;
    
    const activeBanners = APP_CONFIG.banners.filter(banner => banner.active);
    if (activeBanners.length === 0) return;
    
    container.innerHTML = '';
    
    // Создаем слайды для каждого баннера
    activeBanners.forEach((banner, index) => {
        const bannerSlide = document.createElement('div');
        bannerSlide.className = `banner-slide ${index === 0 ? 'active' : ''}`;
        bannerSlide.innerHTML = `
            <img src="${banner.imageUrl}" alt="Баннер" 
                 onerror="this.src='https://via.placeholder.com/800x400/333/fff?text=EFC+Баннер'">
        `;
        
        if (banner.link && banner.link !== '#') {
            bannerSlide.addEventListener('click', () => {
                if (banner.link.startsWith('http')) {
                    window.open(banner.link, '_blank');
                }
            });
        }
        
        container.appendChild(bannerSlide);
    });
    
    // Запускаем карусель если баннеров больше одного
    if (activeBanners.length > 1) {
        startBannerCarousel();
    }
}

function startBannerCarousel() {
    const slides = document.querySelectorAll('.banner-slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    // Очищаем предыдущий интервал если есть
    if (bannerInterval) clearInterval(bannerInterval);
    
    bannerInterval = setInterval(() => {
        // Скрываем текущий слайд
        slides[currentSlide].classList.remove('active');
        
        // Увеличиваем индекс слайда
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Показываем следующий слайд
        slides[currentSlide].classList.add('active');
        
    }, 15000); // 15 секунд
}

function loadUpcomingFights() {
    const container = document.querySelector('.fights-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    APP_CONFIG.upcomingFights.forEach((fight, index) => {
        const fightCard = document.createElement('div');
        fightCard.className = 'fight-card';
        fightCard.style.animationDelay = `${index * 0.1}s`;
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
    
    APP_CONFIG.fightArchive.forEach((video, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.style.animationDelay = `${index * 0.1}s`;
        
        videoCard.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" 
                 onerror="this.src='https://via.placeholder.com/400x225/333/fff?text=Бой'">
            <h3>${video.title}</h3>
            <p class="video-description">${video.description}</p>
            <div class="video-date">${video.date}</div>
        `;
        
        videoCard.addEventListener('click', function() {
            if (video.videoUrl) {
                window.open(video.videoUrl, '_blank');
            }
        });
        
        container.appendChild(videoCard);
    });
}

function loadFighters() {
    const container = document.getElementById('fighters-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    let fighterIndex = 0;
    
    // Сначала бойцы вне категорий
    if (APP_CONFIG.fighters.no_category) {
        APP_CONFIG.fighters.no_category.forEach(fighter => {
            const card = createFighterCard(fighter);
            card.dataset.category = 'no_category';
            card.dataset.weight = fighter.weight_class.toLowerCase().replace(' ', '_');
            card.dataset.sport = fighter.sport.toLowerCase();
            card.style.animationDelay = `${fighterIndex * 0.05}s`;
            container.appendChild(card);
            fighterIndex++;
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
                    card.dataset.weight = category.id;
                    card.dataset.sport = fighter.sport.toLowerCase();
                    card.style.animationDelay = `${fighterIndex * 0.05}s`;
                    container.appendChild(card);
                    fighterIndex++;
                });
            });
        }
        
        // Виды спорта
        if (APP_CONFIG.fighters.categories.sports) {
            APP_CONFIG.fighters.categories.sports.forEach(category => {
                category.fighters.forEach(fighter => {
                    const card = createFighterCard(fighter);
                    card.dataset.category = category.id;
                    card.dataset.weight = fighter.weight_class.toLowerCase().replace(' ', '_');
                    card.dataset.sport = category.id;
                    card.style.animationDelay = `${fighterIndex * 0.05}s`;
                    container.appendChild(card);
                    fighterIndex++;
                });
            });
        }
    }
    
    // Применяем текущие фильтры
    applyFiltersToFighters();
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
    
    // Обработчик клика на карточку бойца
    card.addEventListener('click', function() {
        if (fighter.link && fighter.link.trim() !== '') {
            window.open(fighter.link, '_blank');
        } else {
            showNotification('Нет данных о бойце');
        }
    });
    
    return card;
}

function updateProfileDisplay() {
    const auth = window.TelegramAuth;
    const user = auth.getUser();
    
    if (user) {
        const userName = document.getElementById('user-name');
        const userId = document.getElementById('user-id');
        const userAvatar = document.getElementById('user-avatar');
        
        if (userName) {
            // Очищаем контейнер имени
            userName.innerHTML = '';
            
            // Создаем контейнер для имени и значка
            const nameContainer = document.createElement('div');
            nameContainer.className = 'user-name-container';
            
            // Текст с именем
            const nameText = document.createElement('span');
            nameText.textContent = auth.getUserName();
            nameContainer.appendChild(nameText);
            
            // Добавляем значок
            const userIdNum = parseInt(auth.getUserId());
            let badgeType = '';
            
            if (APP_CONFIG.admins.includes(userIdNum)) {
                badgeType = 'admin';
            } else if (APP_CONFIG.trainers.includes(userIdNum)) {
                badgeType = 'trainer';
            } else if (APP_CONFIG.contracts[auth.getUserId()]) {
                badgeType = 'fighter';
            }
            
            if (badgeType) {
                const badge = document.createElement('div');
                badge.className = `user-badge badge-${badgeType}`;
                
                let icon = '';
                switch(badgeType) {
                    case 'admin':
                        icon = '<svg class="badge-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2L4,5V11.09C4,16.14 7.41,20.85 12,22C16.59,20.85 20,16.14 20,11.09V5L12,2Z"/></svg>';
                        break;
                    case 'fighter':
                        icon = '<svg class="badge-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5C13.66,5 15,6.34 15,8C15,9.66 13.66,11 12,11C10.34,11 9,9.66 9,8C9,6.34 10.34,5 12,5M18,13.66C18,15.5 16.5,17 14.66,17H9.34C7.5,17 6,15.5 6,13.66V12H18V13.66Z"/></svg>';
                        break;
                    case 'trainer':
                        icon = '<svg class="badge-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/></svg>';
                        break;
                }
                
                badge.innerHTML = icon;
                nameContainer.appendChild(badge);
            }
            
            // Вставляем контейнер в элемент имени
            userName.appendChild(nameContainer);
        }
        
        if (userId) {
            userId.textContent = `ID: ${auth.getUserId()}`;
        }
        
        if (userAvatar) {
            const avatarUrl = auth.getUserAvatar();
            userAvatar.src = avatarUrl;
            userAvatar.onerror = function() {
                this.src = 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=' + 
                          (user.first_name?.charAt(0) || 'U');
            };
        }
    }
}

function setupProfileButtons() {
    const auth = window.TelegramAuth;
    const userId = auth.getUserId();
    const userIdNum = parseInt(userId);
    
    // Мои билеты
    document.getElementById('my-tickets-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            showMyTickets();
        }, 200);
    });
    
    // Мои бои - с проверкой контракта
    document.getElementById('my-fights-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            if (APP_CONFIG.contracts[userId] || APP_CONFIG.admins.includes(userIdNum) || APP_CONFIG.trainers.includes(userIdNum)) {
                showMyFightsModal();
            } else {
                showNotification('У вас не подписан контракт для участия в боях');
            }
        }, 200);
    });
    
    // Анкета/Контракт
    const contractBtn = document.getElementById('contract-btn');
    if (contractBtn) {
        if (APP_CONFIG.contracts[userId]) {
            document.getElementById('contract-btn-title').textContent = 'Мой контракт';
            document.getElementById('contract-btn-subtitle').textContent = 'Просмотреть контракт';
            
            contractBtn.addEventListener('click', function(e) {
                animateButtonClick(e.target);
                setTimeout(() => {
                    window.open(APP_CONFIG.contracts[userId], '_blank');
                }, 200);
            });
        } else {
            contractBtn.addEventListener('click', function(e) {
                animateButtonClick(e.target);
                setTimeout(() => {
                    showApplicationForm();
                }, 200);
            });
        }
    }
    
    // Пользовательское соглашение
    document.getElementById('agreement-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            window.open(APP_CONFIG.agreementUrl, '_blank');
        }, 200);
    });
    
    // Техподдержка
    document.getElementById('support-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            window.open(APP_CONFIG.supportUrl, '_blank');
        }, 200);
    });
    
    // Админ панель
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) {
        if (APP_CONFIG.admins.includes(userIdNum)) {
            adminBtn.style.display = 'flex';
            adminBtn.addEventListener('click', function(e) {
                animateButtonClick(e.target);
                setTimeout(() => {
                    showAdminPanel();
                }, 200);
            });
        } else {
            adminBtn.style.display = 'none';
        }
    }
}

function animateButtonClick(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

function showMyTickets() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const tickets = JSON.parse(localStorage.getItem('efc_tickets') || '[]');
    
    let ticketsHTML = '';
    if (tickets.length === 0) {
        ticketsHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6); padding: 20px;">Билетов пока нет</p>';
    } else {
        ticketsHTML = tickets.map(ticket => `
            <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px; margin-bottom: 10px; animation: slideUp 0.5s ease-out;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <strong style="color: white;">${ticket.fighters || 'Бой'}</strong>
                    <span style="color: #FF6B6B; font-weight: bold;">${ticket.price || 0} руб.</span>
                </div>
                <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">
                    <p><i class="far fa-calendar"></i> ${ticket.date || 'Не указано'} ${ticket.time || ''}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${ticket.place || 'Не указано'}</p>
                </div>
            </div>
        `).join('');
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-ticket-alt"></i> Мои билеты</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${ticketsHTML}
                <div style="margin-top: 20px;">
                    <button class="btn-secondary" id="clear-tickets-btn">
                        <i class="fas fa-trash"></i> Очистить все билеты
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Показываем модалку с анимацией
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Очистка билетов
    modal.querySelector('#clear-tickets-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            if (confirm('Удалить все билеты?')) {
                localStorage.removeItem('efc_tickets');
                closeModal(modal);
                showNotification('Билеты удалены');
            }
        }, 200);
    });
    
    // Закрытие модалки
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

function showMyFightsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const userId = window.TelegramAuth.getUserId();
    const fights = APP_CONFIG.userFights[userId] || [];
    
    let fightsHTML = '';
    if (fights.length === 0) {
        fightsHTML = `
            <div class="no-fights">
                <i class="fas fa-fist-raised" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>У вас пока нет запланированных боев</p>
            </div>
        `;
    } else {
        fightsHTML = '<div class="fights-list-container">';
        fights.forEach((fight, index) => {
            let statusText = '';
            let statusClass = '';
            
            if (fight.status === 'upcoming') {
                statusText = 'Предстоящий';
                statusClass = 'upcoming';
            } else if (fight.status === 'completed') {
                statusText = 'Завершен';
                statusClass = 'completed';
            } else {
                statusText = 'Отменен';
                statusClass = 'cancelled';
            }
            
            fightsHTML += `
                <div class="fight-item" style="animation-delay: ${index * 0.1}s">
                    <h3>Против: ${fight.opponent}</h3>
                    <div class="fight-details">
                        <i class="far fa-calendar"></i>
                        <span>${fight.date} ${fight.time}</span>
                    </div>
                    <div class="fight-details">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${fight.place}</span>
                    </div>
                    <div class="fight-details">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>Гонорар: ${fight.reward} руб.</span>
                    </div>
                    <div class="fight-status ${statusClass}">${statusText}</div>
                </div>
            `;
        });
        fightsHTML += '</div>';
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-fist-raised"></i> Мои бои</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${fightsHTML}
                <div style="margin-top: 20px;">
                    <button class="btn-secondary" id="close-fights-btn">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Показываем модалку с анимацией
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Закрытие модалки
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('#close-fights-btn').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

function showApplicationForm() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
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
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Показываем модалку с анимацией
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Обработчики
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('#close-form-btn').addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    // Отправка анкеты
    modal.querySelector('#submit-application-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
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
            closeModal(modal);
            showNotification('✅ Анкета сформирована! Откройте Telegram для отправки.');
        }, 200);
    });
}

function showAdminPanel() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const tickets = JSON.parse(localStorage.getItem('efc_tickets') || '[]');
    const applications = JSON.parse(localStorage.getItem('efc_applications') || '[]');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-crown"></i> ADMIN PANEL</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
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
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Показываем модалку с анимацией
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Очистка данных
    modal.querySelector('#clear-all-data-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            if (confirm('УДАЛИТЬ ВСЕ ДАННЫЕ?\n\nВсе билеты и анкеты будут удалены.')) {
                localStorage.clear();
                closeModal(modal);
                showNotification('Все данные удалены');
            }
        }, 200);
    });
    
    modal.querySelector('#close-admin-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            closeModal(modal);
        }, 200);
    });
    
    // Закрытие модалки
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            animateButtonClick(e.currentTarget);
            const page = this.getAttribute('data-page');
            
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            switchPage(page);
        });
    });
    
    // Покупка билетов
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('buy-ticket-btn')) {
            animateButtonClick(e.target);
            const fightId = e.target.getAttribute('data-fight-id');
            setTimeout(() => {
                buyTicket(fightId);
            }, 200);
        }
    });
    
    // Кнопка фильтра на странице бойцов
    const filterBtn = document.getElementById('open-filter-modal-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            animateButtonClick(e.target);
            setTimeout(() => {
                showFilterModal();
            }, 200);
        });
    }
    
    // Анимация при нажатии на кнопки
    document.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('btn-primary') || 
            e.target.classList.contains('btn-secondary') ||
            e.target.classList.contains('profile-btn') ||
            e.target.classList.contains('filter-btn-main') ||
            e.target.classList.contains('nav-btn')) {
            e.target.style.transform = 'scale(0.95)';
        }
    });
    
    document.addEventListener('mouseup', function(e) {
        if (e.target.classList.contains('btn-primary') || 
            e.target.classList.contains('btn-secondary') ||
            e.target.classList.contains('profile-btn') ||
            e.target.classList.contains('filter-btn-main') ||
            e.target.classList.contains('nav-btn')) {
            e.target.style.transform = '';
        }
    });
}

function showFilterModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-filter"></i> Фильтр бойцов</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="filter-section">
                    <h3>Весовая категория</h3>
                    <div class="filter-group">
                        <div class="filter-option ${activeFilters.weight.includes('light') ? 'active' : ''}">
                            <input type="checkbox" id="weight-light" ${activeFilters.weight.includes('light') ? 'checked' : ''}>
                            <label for="weight-light">Легкий вес</label>
                        </div>
                        <div class="filter-option ${activeFilters.weight.includes('middle') ? 'active' : ''}">
                            <input type="checkbox" id="weight-middle" ${activeFilters.weight.includes('middle') ? 'checked' : ''}>
                            <label for="weight-middle">Средний вес</label>
                        </div>
                        <div class="filter-option ${activeFilters.weight.includes('heavy') ? 'active' : ''}">
                            <input type="checkbox" id="weight-heavy" ${activeFilters.weight.includes('heavy') ? 'checked' : ''}>
                            <label for="weight-heavy">Тяжелый вес</label>
                        </div>
                        <div class="filter-option ${activeFilters.weight.includes('super_heavy') ? 'active' : ''}">
                            <input type="checkbox" id="weight-super_heavy" ${activeFilters.weight.includes('super_heavy') ? 'checked' : ''}>
                            <label for="weight-super_heavy">Супертяжелый вес</label>
                        </div>
                    </div>
                </div>
                
                <div class="filter-section">
                    <h3>Вид спорта</h3>
                    <div class="filter-group">
                        <div class="filter-option ${activeFilters.sport.includes('mma') ? 'active' : ''}">
                            <input type="checkbox" id="sport-mma" ${activeFilters.sport.includes('mma') ? 'checked' : ''}>
                            <label for="sport-mma">MMA</label>
                        </div>
                        <div class="filter-option ${activeFilters.sport.includes('boxing') ? 'active' : ''}">
                            <input type="checkbox" id="sport-boxing" ${activeFilters.sport.includes('boxing') ? 'checked' : ''}>
                            <label for="sport-boxing">Бокс</label>
                        </div>
                        <div class="filter-option ${activeFilters.sport.includes('wrestling') ? 'active' : ''}">
                            <input type="checkbox" id="sport-wrestling" ${activeFilters.sport.includes('wrestling') ? 'checked' : ''}>
                            <label for="sport-wrestling">Борьба</label>
                        </div>
                        <div class="filter-option ${activeFilters.sport.includes('hosting') ? 'active' : ''}">
                            <input type="checkbox" id="sport-hosting" ${activeFilters.sport.includes('hosting') ? 'checked' : ''}>
                            <label for="sport-hosting">Хостинг</label>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 25px; display: flex; gap: 10px;">
                    <button class="btn-primary" id="apply-filters-btn">
                        <i class="fas fa-check"></i> Применить
                    </button>
                    <button class="btn-secondary" id="reset-filters-btn">
                        <i class="fas fa-times"></i> Сбросить
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Показываем модалку с анимацией
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Обработчики чекбоксов
    modal.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                this.classList.toggle('active');
                
                // Анимация нажатия
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
    
    // Применить фильтры
    modal.querySelector('#apply-filters-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            const selectedWeights = [];
            const selectedSports = [];
            
            modal.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                if (checkbox.id.startsWith('weight-')) {
                    selectedWeights.push(checkbox.id.replace('weight-', ''));
                } else if (checkbox.id.startsWith('sport-')) {
                    selectedSports.push(checkbox.id.replace('sport-', ''));
                }
            });
            
            activeFilters.weight = selectedWeights;
            activeFilters.sport = selectedSports;
            
            applyFiltersToFighters();
            closeModal(modal);
        }, 200);
    });
    
    // Сбросить фильтры
    modal.querySelector('#reset-filters-btn').addEventListener('click', function(e) {
        animateButtonClick(e.target);
        setTimeout(() => {
            activeFilters.weight = [];
            activeFilters.sport = [];
            
            modal.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            modal.querySelectorAll('.filter-option').forEach(option => {
                option.classList.remove('active');
            });
            
            applyFiltersToFighters();
        }, 200);
    });
    
    // Закрытие модалки
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

function applyFiltersToFighters() {
    const fighters = document.querySelectorAll('.fighter-card');
    
    fighters.forEach(fighter => {
        const fighterWeight = fighter.dataset.weight;
        const fighterSport = fighter.dataset.sport;
        
        let weightMatch = activeFilters.weight.length === 0 || activeFilters.weight.includes(fighterWeight);
        let sportMatch = activeFilters.sport.length === 0 || activeFilters.sport.includes(fighterSport);
        
        if (weightMatch && sportMatch) {
            fighter.style.display = 'flex';
            fighter.style.animation = 'slideUp 0.5s ease-out';
        } else {
            fighter.style.display = 'none';
        }
    });
}

function buyTicket(fightId) {
    const fight = APP_CONFIG.upcomingFights.find(f => f.id == fightId);
    if (!fight) return;
    
    const message = `🎫 ХОЧУ КУПИТЬ БИЛЕТ EFC™\n\n🥊 Бой: ${fight.fighters.join(' vs ')}\n📅 Дата: ${fight.date}\n🕒 Время: ${fight.time}\n📍 Место: ${fight.place}\n💰 Цена: ${fight.ticketPrice} руб.\n\nПрошу связаться со мной для покупки билета!`;
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/EDEM_CR?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
    
    // Сохраняем билет
    const tickets = JSON.parse(localStorage.getItem('efc_tickets') || '[]');
    tickets.push({
        id: Date.now(),
        fighters: fight.fighters,
        date: fight.date,
        time: fight.time,
        place: fight.place,
        price: fight.ticketPrice,
        purchaseDate: new Date().toLocaleDateString('ru-RU')
    });
    localStorage.setItem('efc_tickets', JSON.stringify(tickets));
    
    showNotification('✅ Билет куплен! Откройте Telegram для подтверждения.');
}

function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    currentPage = page;
    
    if (page === 'fighters') {
        setTimeout(() => {
            loadFighters();
        }, 300);
    }
}

function showNotification(message) {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="notification-text">${message}</div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Показываем с анимацией
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    });
    
    // Автозакрытие через 4 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }
    }, 4000);
}

// Устанавливаем активную кнопку при загрузке
document.querySelector('.nav-btn[data-page="home"]').classList.add('active');