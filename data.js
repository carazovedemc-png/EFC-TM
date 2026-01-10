// Конфигурация приложения EFC™
const APP_CONFIG = {
    // Основные настройки
    appName: "EFC™",
    logoUrl: "https://via.placeholder.com/50/FF6B6B/FFFFFF?text=EFC",
    
    // Ссылка на пользовательское соглашение
    agreementUrl: "https://telegra.ph/POLZOVATELSKOE-SOGLASHENIE-po-ispolzovaniyu-programm-11-06",
    
    // Техподдержка
    supportUrl: "https://t.me/EDEM_CR",
    
    // Администраторы (Telegram ID)
    admins: [
        123456789, // Пример ID администратора
    ],
    
    // Пользователи с доступом к ставкам (18+)
    betsAllowedUsers: [
        123456789, // Пример ID
    ],
    
    // КОНТРАКТЫ БОЙЦОВ
    // Telegram ID: ссылка на контракт
    contracts: {
        // Пример:
        // 123456789: "https://example.com/contract.jpg",
    },
    
    // БОИ БОЙЦОВ
    // Telegram ID: массив боев
    userFights: {
        // Пример:
        // 123456789: [
        //     {
        //         id: 1,
        //         opponent: "Иван Иванов",
        //         date: "15.12.2024",
        //         time: "18:00",
        //         place: "Школьный спортзал №1",
        //         reward: 5000,
        //         status: "upcoming" // upcoming, completed, cancelled
        //     }
        // ]
    },
    
    // ВСЕ БОЙЦЫ EFC™
    fighters: {
        // БОЙЦЫ ВНЕ КАТЕГОРИЙ (показываются всегда)
        "no_category": [
            {
                id: 1,
                name: "Иван Петров",
                rank: "#1 ВНЕ КАТЕГОРИЙ",
                record: "21-1-0", // победы-поражения-ничьи
                photo: "https://via.placeholder.com/100/FF6B6B/FFFFFF?text=IP",
                sport: "MMA",
                weight_class: "Тяжелый вес",
                description: "Чемпион EFC™"
            },
            {
                id: 2,
                name: "Алексей Сидоров",
                rank: "#2 ВНЕ КАТЕГОРИЙ",
                record: "18-3-1",
                photo: "https://via.placeholder.com/100/4ECDC4/FFFFFF?text=AS",
                sport: "Бокс",
                weight_class: "Средний вес",
                description: "Претендент на титул"
            }
        ],
        
        // КАТЕГОРИИ БОЙЦОВ
        "categories": {
            // Весовые категории
            "weight_classes": [
                {
                    id: "light",
                    name: "Легкий вес",
                    fighters: [
                        {
                            id: 3,
                            name: "Дмитрий Козлов",
                            rank: "#1 Легкий вес",
                            record: "15-2-0",
                            photo: "https://via.placeholder.com/100/FFD166/000000?text=DK",
                            sport: "MMA",
                            weight_class: "Легкий вес",
                            description: "Специалист по грэпплингу"
                        }
                    ]
                },
                {
                    id: "middle",
                    name: "Средний вес",
                    fighters: [
                        {
                            id: 4,
                            name: "Сергей Иванов",
                            rank: "#1 Средний вес",
                            record: "12-4-0",
                            photo: "https://via.placeholder.com/100/06D6A0/FFFFFF?text=SI",
                            sport: "Бокс",
                            weight_class: "Средний вес",
                            description: "Нокаутер"
                        }
                    ]
                }
            ],
            
            // Виды спорта
            "sports": [
                {
                    id: "mma",
                    name: "MMA",
                    fighters: [
                        {
                            id: 5,
                            name: "Михаил Смирнов",
                            rank: "#1 MMA",
                            record: "10-0-0",
                            photo: "https://via.placeholder.com/100/118AB2/FFFFFF?text=MS",
                            sport: "MMA",
                            weight_class: "Полутяжелый вес",
                            description: "Непобежденный"
                        }
                    ]
                },
                {
                    id: "boxing",
                    name: "Бокс",
                    fighters: [
                        {
                            id: 6,
                            name: "Антон Волков",
                            rank: "#1 Бокс",
                            record: "20-5-0",
                            photo: "https://via.placeholder.com/100/9D50BB/FFFFFF?text=AV",
                            sport: "Бокс",
                            weight_class: "Тяжелый вес",
                            description: "Опытный боксер"
                        }
                    ]
                },
                {
                    id: "hosting",
                    name: "Хостинг",
                    fighters: [
                        {
                            id: 7,
                            name: "Ислям Нариманович",
                            rank: "Тренер по хостингу",
                            record: "Тренер",
                            photo: "https://via.placeholder.com/100/FF6B6B/FFFFFF?text=IN",
                            sport: "Хостинг",
                            weight_class: "Тренер",
                            description: "Тренер по хостингу"
                        }
                    ]
                },
                {
                    id: "wrestling",
                    name: "Борьба",
                    fighters: [
                        {
                            id: 8,
                            name: "Олег Борисов",
                            rank: "#1 Борьба",
                            record: "14-3-0",
                            photo: "https://via.placeholder.com/100/FF8E53/FFFFFF?text=OB",
                            sport: "Борьба",
                            weight_class: "Тяжелый вес",
                            description: "Мастер борьбы"
                        }
                    ]
                }
            ]
        }
    },
    
    // БАННЕРЫ
    banners: [
        {
            id: 1,
            imageUrl: "https://images.unsplash.com/photo-1546716425-71f33c8d6c3e?w=800&h=400&fit=crop",
            link: "#fight1",
            active: true
        },
        {
            id: 2,
            imageUrl: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&h=400&fit=crop",
            link: "#tournament",
            active: true
        },
        {
            id: 3,
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
            link: "#tickets",
            active: true
        }
    ],
    
    // АРХИВ БОЕВ (бывшие видео боев)
    fightArchive: [
        {
            id: 1,
            title: "Финал турнира 2024 - Иванов vs Петров",
            thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aaca258?w=400&h=225&fit=crop",
            videoUrl: "https://youtu.be/dQw4w9WgXcQ",
            description: "Захватывающий финальный бой сезона 2024",
            date: "10.11.2024"
        },
        {
            id: 2,
            title: "Полуфинал. Группа А - Сидоров vs Козлов",
            thumbnail: "https://images.unsplash.com/photo-1519861531473-920034658307?w=400&h=225&fit=crop",
            videoUrl: "https://youtu.be/dQw4w9WgXcQ",
            description: "Жесткий бой с неожиданной развязкой",
            date: "03.11.2024"
        }
    ],
    
    // ПРЕДСТОЯЩИЕ БОИ (для всех)
    upcomingFights: [
        {
            id: 1,
            fighters: ["Алексей Сидоров", "Дмитрий Козлов"],
            date: "15.12.2024",
            time: "18:00",
            place: "Школьный спортзал №1",
            ticketPrice: 300
        },
        {
            id: 2,
            fighters: ["Михаил Петров", "Сергей Иванов"],
            date: "20.12.2024",
            time: "19:00",
            place: "Школьный спортзал №2",
            ticketPrice: 350
        }
    ],
    
    // ТИПЫ ТРЕНИРОВОК ДЛЯ АНКЕТЫ
    trainingTypes: [
        {
            id: "hosting",
            name: "Хостинг (Ислям Нариманович)",
            description: "Тренировки по хостингу"
        },
        {
            id: "mma",
            name: "MMA",
            description: "Смешанные единоборства"
        },
        {
            id: "boxing",
            name: "Бокс",
            description: "Классический бокс"
        },
        {
            id: "wrestling",
            name: "Борьба",
            description: "Спортивная борьба"
        }
    ]
};