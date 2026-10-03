export const locales = ["en", "fr", "es", "ru", "zh", "th"] as const;

export type Locale = (typeof locales)[number];

export const localeCookieName = "stepanoskin_locale_v1";

export const localeNames: Record<Locale, string> = {
    en: "English",
    fr: "Français",
    es: "Español",
    ru: "Русский",
    zh: "中文",
    th: "ไทย",
};

type Translation = {
    language: string;
    menuEyebrow: string;
    menuTitle: string;
    gameMonetization: string;
    gameMonetizationDescription: string;
    productionSystems: string;
    productionSystemsDescription: string;
    enter: string;
    available: string;
    systemOnline: string;
    soundOn: string;
    soundOff: string;
    backToMenu: string;
};

export const translations: Record<Locale, Translation> = {
    en: {
        language: "Language",
        menuEyebrow: "Main menu",
        menuTitle: "Select a path",
        gameMonetization: "Game Monetization",
        gameMonetizationDescription: "Revenue systems players value.",
        productionSystems: "Data Science & Production Systems",
        productionSystemsDescription: "Professional profile and methodology. In English.",
        enter: "Enter",
        available: "Available",
        systemOnline: "System online",
        soundOn: "Sound on",
        soundOff: "Sound off",
        backToMenu: "Back to menu",
    },
    fr: {
        language: "Langue",
        menuEyebrow: "Menu principal",
        menuTitle: "Choisissez une voie",
        gameMonetization: "Monétisation des jeux",
        gameMonetizationDescription: "Des systèmes de revenus appréciés des joueurs.",
        productionSystems: "Science des données et systèmes de production",
        productionSystemsDescription: "Profil professionnel et méthodologie. En anglais.",
        enter: "Entrer",
        available: "Disponible",
        systemOnline: "Système en ligne",
        soundOn: "Son activé",
        soundOff: "Son désactivé",
        backToMenu: "Retour au menu",
    },
    es: {
        language: "Idioma",
        menuEyebrow: "Menú principal",
        menuTitle: "Elige una ruta",
        gameMonetization: "Monetización de videojuegos",
        gameMonetizationDescription: "Sistemas de ingresos que los jugadores valoran.",
        productionSystems: "Ciencia de datos y sistemas de producción",
        productionSystemsDescription: "Perfil profesional y metodología. En inglés.",
        enter: "Entrar",
        available: "Disponible",
        systemOnline: "Sistema en línea",
        soundOn: "Sonido activado",
        soundOff: "Sonido desactivado",
        backToMenu: "Volver al menú",
    },
    ru: {
        language: "Язык",
        menuEyebrow: "Главное меню",
        menuTitle: "Выберите направление",
        gameMonetization: "Монетизация игр",
        gameMonetizationDescription: "Системы дохода, которые ценят игроки.",
        productionSystems: "Наука о данных и производственные системы",
        productionSystemsDescription: "Профессиональный профиль и методология. На английском.",
        enter: "Войти",
        available: "Доступно",
        systemOnline: "Система в сети",
        soundOn: "Звук включён",
        soundOff: "Звук выключен",
        backToMenu: "Назад в меню",
    },
    zh: {
        language: "语言",
        menuEyebrow: "主菜单",
        menuTitle: "选择方向",
        gameMonetization: "游戏商业化",
        gameMonetizationDescription: "打造玩家认可的营收系统。",
        productionSystems: "数据科学与生产系统",
        productionSystemsDescription: "专业简介与方法论。英文版。",
        enter: "进入",
        available: "可用",
        systemOnline: "系统在线",
        soundOn: "声音开启",
        soundOff: "声音关闭",
        backToMenu: "返回菜单",
    },
    th: {
        language: "ภาษา",
        menuEyebrow: "เมนูหลัก",
        menuTitle: "เลือกเส้นทาง",
        gameMonetization: "การสร้างรายได้จากเกม",
        gameMonetizationDescription: "ระบบรายได้ที่ผู้เล่นเห็นคุณค่า",
        productionSystems: "วิทยาการข้อมูลและระบบการผลิต",
        productionSystemsDescription: "ประวัติการทำงานและแนวทางการทำงาน เนื้อหาภาษาอังกฤษ",
        enter: "เข้าสู่",
        available: "พร้อมใช้งาน",
        systemOnline: "ระบบออนไลน์",
        soundOn: "เปิดเสียง",
        soundOff: "ปิดเสียง",
        backToMenu: "กลับไปที่เมนู",
    },
};

export function isLocale(value: string): value is Locale {
    return locales.includes(value as Locale);
}
