/**
 * Telegram Mini Apps - Система автоматической авторизации
 */
class TelegramAuth {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.user = null;
        this.isInitialized = false;
    }

    init() {
        try {
            if (this.tg) {
                // Запуск в Telegram
                this.tg.expand();
                this.tg.ready();
                
                // Получаем данные пользователя
                this.loadUserFromTelegram();
            } else {
                // Режим разработки (браузер)
                this.loadUserFromStorage();
            }
            
            this.isInitialized = true;
            this.saveUserToStorage();
            
            console.log('Telegram Auth: Успешно', this.user);
            return this.user;
            
        } catch (error) {
            console.error('Telegram Auth: Ошибка', error);
            return this.createTestUser();
        }
    }

    loadUserFromTelegram() {
        if (!this.tg?.initDataUnsafe?.user) {
            throw new Error('Нет данных пользователя Telegram');
        }

        const tgUser = this.tg.initDataUnsafe.user;
        
        this.user = {
            id: tgUser.id,
            first_name: tgUser.first_name || 'Пользователь',
            last_name: tgUser.last_name || '',
            username: tgUser.username || `user_${tgUser.id}`,
            photo_url: tgUser.photo_url || null,
            language_code: tgUser.language_code || 'ru',
            is_premium: tgUser.is_premium || false
        };
    }

    loadUserFromStorage() {
        try {
            const savedUser = localStorage.getItem('tg_user');
            if (savedUser) {
                this.user = JSON.parse(savedUser);
                return;
            }
        } catch (e) {
            console.error('Ошибка загрузки пользователя из localStorage:', e);
        }
        
        // Если нет сохраненного пользователя, создаем тестового
        this.createTestUser();
    }

    createTestUser() {
        this.user = {
            id: 1745639675,
            first_name: 'Тестовый',
            last_name: 'Пользователь',
            username: 'test_user',
            photo_url: null,
            language_code: 'ru',
            is_premium: false
        };
        
        return this.user;
    }

    saveUserToStorage() {
        if (this.user) {
            localStorage.setItem('tg_user', JSON.stringify(this.user));
        }
    }

    getUser() {
        return this.user;
    }

    getUserId() {
        return this.user?.id || '';
    }

    getUserName() {
        if (!this.user) return 'Гость';
        
        if (this.user.first_name && this.user.last_name) {
            return `${this.user.first_name} ${this.user.last_name}`;
        }
        return this.user.first_name || this.user.username || 'Пользователь';
    }

    getUserAvatar() {
        if (!this.user) return null;
        
        if (this.user.photo_url) {
            return this.user.photo_url;
        }
        
        // Генерируем аватар на основе имени
        const name = this.user.first_name || this.user.username || 'U';
        const initial = name.charAt(0).toUpperCase();
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=FF6B6B&color=fff&size=200`;
    }

    isInTelegram() {
        return !!this.tg;
    }

    showWelcomeAnimation() {
        const welcomeEl = document.getElementById('telegram-welcome');
        if (!welcomeEl) return;
        
        const avatarEl = document.getElementById('welcome-avatar');
        const nameEl = document.getElementById('welcome-name');
        const idEl = document.getElementById('welcome-id');
        
        // Устанавливаем данные
        const avatarUrl = this.getUserAvatar();
        if (avatarUrl && avatarEl) {
            avatarEl.src = avatarUrl;
        }
        
        if (nameEl) {
            nameEl.innerHTML = '';
            const nameText = document.createElement('span');
            nameText.textContent = this.getUserName();
            nameEl.appendChild(nameText);
            
            // Добавляем значок в приветствии
            const userIdNum = parseInt(this.getUserId());
            let badgeType = '';
            
            if (APP_CONFIG.admins.includes(userIdNum)) {
                badgeType = 'admin';
            } else if (APP_CONFIG.trainers.includes(userIdNum)) {
                badgeType = 'trainer';
            } else if (APP_CONFIG.contracts[this.getUserId()]) {
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
                nameEl.appendChild(badge);
            }
        }
        
        if (idEl) idEl.textContent = `ID: ${this.getUserId()}`;
        
        // Показываем анимацию
        welcomeEl.classList.add('active');
        
        // Скрываем через 2 секунды
        setTimeout(() => {
            welcomeEl.classList.remove('active');
        }, 2000);
    }
    
    // Методы для работы с ролями
    isAdmin() {
        const userId = parseInt(this.getUserId());
        return APP_CONFIG.admins.includes(userId);
    }
    
    isTrainer() {
        const userId = parseInt(this.getUserId());
        return APP_CONFIG.trainers.includes(userId);
    }
    
    isFighter() {
        const userId = this.getUserId();
        return APP_CONFIG.contracts.hasOwnProperty(userId);
    }
    
    getUserRole() {
        if (this.isAdmin()) return 'admin';
        if (this.isTrainer()) return 'trainer';
        if (this.isFighter()) return 'fighter';
        return 'user';
    }
}

// Создаем глобальный экземпляр
window.TelegramAuth = new TelegramAuth();