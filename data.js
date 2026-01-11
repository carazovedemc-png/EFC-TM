// Конфигурация приложения EFC™
const APP_CONFIG = {
    // Основные настройки
    appName: "𝙀𝙁𝘾™",
    logoUrl: "https://sun9-79.userapi.com/s/v1/ig2/Iwgs_SLJiCG0rCQiHerqheqgN93PxCMUoU8j3cto1xpKXjBaQDLpwSL9d4cmtAoAh5UTCClI-QTmUjzo3oQ-UTxv.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=vBvlWP12ZXV3-6fRHQiaQfpPXYJBFIu_vV-oThtYMy0&cs=640x0",
    
    // Ссылка на пользовательское соглашение
    agreementUrl: "https://telegra.ph/POLZOVATELSKOE-SOGLASHENIE-po-ispolzovaniyu-programm-11-06",
    
    // Техподдержка
    supportUrl: "https://t.me/EDEM_CR",
    
    // Администраторы (Telegram ID)
    admins: [
        1745639675, // Ваш ID администратора
    ],
    
    // Бойцы (Telegram ID)
    fighters: [
        1745639675, // Ваш ID бойца
    ],
    
    // Тренеры (Telegram ID)
    trainers: [
        1745639675, // Ваш ID тренера
    ],
    
    // Пользователи с доступом к ставкам (18+)
    betsAllowedUsers: [
        1745639675, // Ваш ID
    ],
    
    // КОНТРАКТЫ БОЙЦОВ
    // Telegram ID: ссылка на контракт
    contracts: {
        1745639675: "https://telegra.ph/CONTRACT-01-11-5", // Ваш контракт
    },
    
    // БОИ БОЙЦОВ
    // Telegram ID: массив боев
    userFights: {
        1745639675: [
            {
                id: 1,
                opponent: "Рустем Гильманов",
                date: "20.1.2026",
                time: "16:30",
                place: "Школьный спортзал",
                reward: 500,
                status: "upcoming" // upcoming, completed, cancelled
            },
            {
                id: 2,
                opponent: "Джемодинов Демирель",
                date: "14.12.2026",
                time: "16:30",
                place: "Школьный спортзал",
                reward: 500,
                status: "completed"
            }
        ]
    },
    
    // ВСЕ БОЙЦЫ EFC™
    fighters: {
        // БОЙЦЫ ВНЕ КАТЕГОРИЙ (показываются всегда)
        "no_category": [
            {
                id: 1,
                name: "Ислам Махачев",
                rank: "#1 ВНЕ КАТЕГОРИЙ",
                record: "28-1-0", // победы-поражения-ничьи
                photo: "https://sun9-71.userapi.com/s/v1/ig2/OLD1CSZwWQALul3lvE2a-dgxNsysn5aIHru7ruY884BOBPV9Rv9CN_3yCKRcYC2BhVZtR8I5unnuKIud7zKR1hA2.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,888x888&from=bu&u=TKhlpm8D_0mKDvxJqPds49m33by4h7CaRKlR59TqBX0&cs=640x0",
                sport: "MMA",
                weight_class: "Лёгкий вес",
                description: "Чемпион EFC™",
                link: "https://telegra.ph/Islam-Mahachev-01-10",
                badges: ["fighter"],
                gender: "male" // Добавлено поле gender
            },
            {
                id: 2,
                name: "Алексей Сидоров",
                rank: "#2 ВНЕ КАТЕГОРИЙ",
                record: "18-3-1",
                photo: "https://via.placeholder.com/100/4ECDC4/FFFFFF?text=AS",
                sport: "Бокс",
                weight_class: "Средний вес",
                description: "Претендент на титул",
                link: "", // Пустая строка - нет ссылки
                badges: ["fighter"],
                gender: "male" // Добавлено поле gender
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
                            description: "Специалист по грэпплингу",
                            link: "https://example.com/fighter/3",
                            badges: ["fighter"],
                            gender: "male" // Добавлено поле gender
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
                            description: "Нокаутер",
                            link: "https://example.com/fighter/4",
                            badges: ["fighter"],
                            gender: "male" // Добавлено поле gender
                        }
                    ]
                },
                {
                    id: "heavy",
                    name: "Тяжелый вес",
                    fighters: [
                        {
                            id: 9,
                            name: "Антон Громов",
                            rank: "#1 Тяжелый вес",
                            record: "14-2-0",
                            photo: "https://via.placeholder.com/100/9D50BB/FFFFFF?text=AG",
                            sport: "MMA",
                            weight_class: "Тяжелый вес",
                            description: "Силовой боец",
                            link: "https://example.com/fighter/9",
                            badges: ["fighter"],
                            gender: "male" // Добавлено поле gender
                        }
                    ]
                },
                {
                    id: "super_heavy",
                    name: "Супертяжелый вес",
                    fighters: [
                        {
                            id: 10,
                            name: "Максим Титан",
                            rank: "#1 Супертяжелый вес",
                            record: "10-0-0",
                            photo: "https://via.placeholder.com/100/FF8E53/FFFFFF?text=MT",
                            sport: "Борьба",
                            weight_class: "Супертяжелый вес",
                            description: "Непобедимый гигант",
                            link: "https://example.com/fighter/10",
                            badges: ["fighter"],
                            gender: "male" // Добавлено поле gender
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
                            description: "Непобежденный",
                            link: "https://example.com/fighter/5",
                            badges: ["fighter"],
                            gender: "male" // Добавлено поле gender
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
                            description: "Опытный боксер",
                            link: "https://example.com/fighter/6",
                            badges: ["fighter"],
                            gender: "male" // Добавлено поле gender
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
                            description: "Тренер по хостингу",
                            link: "https://example.com/fighter/7",
                            badges: ["trainer"],
                            gender: "male" // Добавлено поле gender
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
                            description: "Мастер борьбы",
                            link: "https://example.com/fighter/8",
                            badges: ["fighter"],
                            gender: "male" // Добавлено поле gender
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
            imageUrl: "https://sun9-2.userapi.com/s/v1/ig2/-23lLxLyFhE7viOEUD86RzLxMRlwKIdoIZF5PGYY_DsXHQsbXqrw5TwgurrXUBQCNPY5tJurX7CWsqWwPlyHFemD.jpg?quality=95&as=32x16,48x23,72x35,108x53,160x78,240x117,360x176,480x235,540x264,640x313,720x352,964x471&from=bu&u=tgC8ayUUqzwUxJInHliFRTCgWqCaoN5HbE1qrkfkLDc&cs=640x0",
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