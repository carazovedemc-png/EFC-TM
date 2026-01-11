/**
 * Обработка Telegram Web App кнопок
 */
class TelegramWebAppHandler {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.headerHeight = 0;
        this.isBotFather = false;
        this.backButtonHandler = null;
    }

    init() {
        if (!this.tg) return;
        
        // Определяем, открыто ли в BotFather или в полноэкранном режиме
        this.detectEnvironment();
        
        // Устанавливаем высоту для учета кнопок Telegram
        this.setHeaderHeight();
        
        // Показываем кнопку назад только когда нужно
        this.setupBackButton();
        
        // Настраиваем тему
        this.setupTheme();
        
        console.log('Telegram Web App Handler: Инициализирован');
    }
    
    detectEnvironment() {
        // Проверяем, есть ли кнопки Telegram (меню, закрыть и т.д.)
        const viewportHeight = this.tg.viewportHeight;
        const windowHeight = window.innerHeight;
        
        // Если есть разница, значит есть элементы интерфейса Telegram
        this.isBotFather = (viewportHeight !== windowHeight);
        
        console.log('Detected environment:', {
            viewportHeight,
            windowHeight,
            isBotFather: this.isBotFather,
            platform: this.tg.platform
        });
    }
    
    setHeaderHeight() {
        // Устанавливаем высоту заголовка в зависимости от платформы
        let height = 0;
        
        if (this.tg.platform === 'ios') {
            height = 44; // iOS статус бар + навигация
        } else if (this.tg.platform === 'android') {
            height = 56; // Android статус бар + панель навигации
        } else if (this.isBotFather) {
            height = 60; // BotFather кнопки
        }
        
        this.headerHeight = height;
        
        // Устанавливаем CSS переменную
        document.documentElement.style.setProperty('--telegram-header-height', `${height}px`);
        
        console.log('Telegram header height set to:', height);
    }
    
    setupBackButton() {
        // Показываем кнопку назад только когда открыто модальное окно
        this.tg.BackButton.hide();
        
        // Храним текущий обработчик
        this.backButtonHandler = null;
    }
    
    showBackButton(callback) {
        if (!this.tg) return;
        
        // Убираем предыдущий обработчик
        if (this.backButtonHandler) {
            this.tg.BackButton.offClick(this.backButtonHandler);
        }
        
        // Устанавливаем новый обработчик
        this.backButtonHandler = callback;
        this.tg.BackButton.onClick(callback);
        this.tg.BackButton.show();
    }
    
    hideBackButton() {
        if (!this.tg) return;
        
        this.tg.BackButton.hide();
        
        // Убираем обработчик
        if (this.backButtonHandler) {
            this.tg.BackButton.offClick(this.backButtonHandler);
            this.backButtonHandler = null;
        }
    }
    
    setupTheme() {
        if (!this.tg) return;
        
        // Устанавливаем тему Telegram
        const theme = this.tg.colorScheme;
        document.body.classList.toggle('telegram-dark', theme === 'dark');
        document.body.classList.toggle('telegram-light', theme === 'light');
    }
    
    getHeaderHeight() {
        return this.headerHeight;
    }
    
    isInTelegram() {
        return !!this.tg;
    }
    
    isFullScreen() {
        return this.tg && this.tg.isFullscreen;
    }
}

// Создаем глобальный экземпляр
window.TelegramWebAppHandler = new TelegramWebAppHandler();