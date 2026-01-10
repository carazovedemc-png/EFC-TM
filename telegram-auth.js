class TelegramAuth {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.user = null;
        this.isInitialized = false;
    }

    async init() {
        if (!this.tg) {
            console.log('Режим разработки: Telegram не обнаружен');
            return this.initDevMode();
        }

        try {
            this.tg.expand();
            this.tg.ready();
            
            await this.loadUserData();
            this.saveUserToStorage();
            this.isInitialized = true;
            
            console.log('Telegram Auth: Успешно');
            return this.user;
            
        } catch (error) {
            console.error('Telegram Auth: Ошибка', error);
            return this.initDevMode();
        }
    }

    async loadUserData() {
        if (!this.tg || !this.tg.initDataUnsafe) {
            throw new Error('Нет данных Telegram');
        }

        const tgUser = this.tg.initDataUnsafe.user;
        
        if (!tgUser) {
            throw new Error('Нет данных пользователя');
        }

        this.user = {
            id: tgUser.id,
            first_name: tgUser.first_name || 'Пользователь',
            last_name: tgUser.last_name || '',
            username: tgUser.username || `user_${tgUser.id}`,
            photo_url: tgUser.photo_url || null,
        };

        // Загружаем сохраненные данные
        const savedUser = this.getUserFromStorage();
        if (savedUser && savedUser.id === this.user.id) {
            this.user = { ...savedUser, ...this.user };
        }

        return this.user;
    }

    initDevMode() {
        const savedUser = this.getUserFromStorage();
        if (savedUser) {
            this.user = savedUser;
        } else {
            this.user = {
                id: Date.now(),
                first_name: 'Тестовый',
                last_name: 'Пользователь',
                username: 'test_user',
                photo_url: null,
            };
        }

        this.saveUserToStorage();
        this.isInitialized = true;
        return this.user;
    }

    saveUserToStorage() {
        if (!this.user) return;
        try {
            localStorage.setItem('tg_user', JSON.stringify(this.user));
            localStorage.setItem('tg_user_id', this.user.id.toString());
        } catch (error) {
            console.error('Ошибка сохранения', error);
        }
    }

    getUserFromStorage() {
        try {
            const userData = localStorage.getItem('tg_user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            return null;
        }
    }

    getUser() {
        return this.user || this.getUserFromStorage();
    }

    getUserId() {
        return this.user?.id || localStorage.getItem('tg_user_id');
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
        
        const name = this.user.first_name || this.user.username || 'U';
        const initial = name.charAt(0).toUpperCase();
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=FF6B6B&color=fff&size=200`;
    }

    showWelcomeAnimation() {
        const welcomeEl = document.getElementById('telegram-welcome');
        const avatarEl = document.getElementById('welcome-avatar');
        const nameEl = document.getElementById('welcome-name');
        const idEl = document.getElementById('welcome-id');
        
        if (!welcomeEl || !this.user) return;
        
        // Устанавливаем данные
        const avatarUrl = this.getUserAvatar();
        if (avatarUrl && avatarEl) {
            avatarEl.src = avatarUrl;
            avatarEl.onerror = function() {
                this.src = 'https://via.placeholder.com/200/FF6B6B/FFFFFF?text=' + 
                          (window.TelegramAuth.user?.first_name?.charAt(0) || 'U');
            };
        }
        
        if (nameEl) nameEl.textContent = this.getUserName();
        if (idEl) idEl.textContent = `ID: ${this.user.id}`;
        
        // Показываем анимацию
        welcomeEl.classList.add('active');
        
        // Скрываем через 2.5 секунды
        setTimeout(() => {
            welcomeEl.classList.remove('active');
        }, 2500);
    }
}

// Создаем глобальный экземпляр
window.TelegramAuth = new TelegramAuth();