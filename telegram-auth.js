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
        
        if (nameEl) nameEl.textContent = this.getUserName();
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