import type { Locale } from "./translations";

type LauncherCopy = {
    dataScience: string; gameEngines: string;
    index: string; welcome: string; intro: string; navigation: string;
    professional: string; cv: string; cvDescription: string; viewCv: string;
    sanctuary: string; loopforge: string; about: string; aboutDescription: string;
    footer: string; pauseMotion: string; resumeMotion: string; reducedMotion: string;
};

export const launcherCopy: Record<Locale, LauncherCopy> = {
    en: {
        dataScience: "Data Science", gameEngines: "Game Engines and LLMs",
        index: "Personal index", welcome: "A few ways in",
        intro: "Work, ideas and things in progress.", navigation: "Explore Stepan’s work",
        professional: "Experience & practice", cv: "Professional CV",
        cvDescription: "Data science & production systems. In English.", viewCv: "View CV",
        sanctuary: "An essay on games, players and the economics between them.",
        loopforge: "An artificial brain factory. A game, an engine, an experiment.",
        about: "About", aboutDescription: "A little more about me. Coming soon.",
        footer: "A place for a few different things.", pauseMotion: "Pause motion", resumeMotion: "Resume motion", reducedMotion: "Reduced motion",
    },
    fr: {
        dataScience: "Science des données", gameEngines: "Moteurs de jeux et LLM",
        index: "Index personnel", welcome: "Quelques portes d’entrée",
        intro: "Travaux, idées et projets en cours.", navigation: "Explorer les travaux de Stepan",
        professional: "Expérience et pratique", cv: "CV professionnel",
        cvDescription: "Science des données et systèmes de production. En anglais.", viewCv: "Voir le CV",
        sanctuary: "Un essai sur les jeux, les joueurs et l’économie qui les relie.",
        loopforge: "Une usine de cerveaux artificiels. Un jeu, un moteur, une expérience.",
        about: "À propos", aboutDescription: "Un peu plus sur moi. À venir.",
        footer: "Une place pour des choses différentes.", pauseMotion: "Mettre en pause", resumeMotion: "Reprendre l’animation", reducedMotion: "Animations réduites",
    },
    es: {
        dataScience: "Ciencia de datos", gameEngines: "Motores de juegos y LLM",
        index: "Índice personal", welcome: "Algunas puertas de entrada",
        intro: "Trabajo, ideas y proyectos en marcha.", navigation: "Explorar el trabajo de Stepan",
        professional: "Experiencia y práctica", cv: "CV profesional",
        cvDescription: "Ciencia de datos y sistemas de producción. En inglés.", viewCv: "Ver CV",
        sanctuary: "Un ensayo sobre juegos, jugadores y la economía que los conecta.",
        loopforge: "Una fábrica de cerebros artificiales. Un juego, un motor, un experimento.",
        about: "Acerca de", aboutDescription: "Un poco más sobre mí. Próximamente.",
        footer: "Un lugar para cosas distintas.", pauseMotion: "Pausar animación", resumeMotion: "Reanudar animación", reducedMotion: "Movimiento reducido",
    },
    ru: {
        dataScience: "Наука о данных", gameEngines: "Игровые движки и LLM",
        index: "Личный указатель", welcome: "Несколько направлений",
        intro: "Работа, идеи и то, что ещё в процессе.", navigation: "Работы Степана",
        professional: "Опыт и практика", cv: "Профессиональное резюме",
        cvDescription: "Наука о данных и производственные системы. На английском.", viewCv: "Смотреть резюме",
        sanctuary: "Эссе об играх, игроках и экономике между ними.",
        loopforge: "Фабрика искусственных мозгов. Игра, движок, эксперимент.",
        about: "Обо мне", aboutDescription: "Ещё немного обо мне. Скоро.",
        footer: "Место для разных увлечений.", pauseMotion: "Остановить анимацию", resumeMotion: "Включить анимацию", reducedMotion: "Анимация ограничена",
    },
    zh: {
        dataScience: "数据科学", gameEngines: "游戏引擎与大语言模型",
        index: "个人索引", welcome: "从这里出发",
        intro: "工作、想法，以及正在进行的探索。", navigation: "探索 Stepan 的作品",
        professional: "经验与实践", cv: "职业简历",
        cvDescription: "数据科学与生产系统。英文内容。", viewCv: "查看简历",
        sanctuary: "一篇探讨游戏、玩家与两者之间经济关系的文章。",
        loopforge: "一座人工大脑工厂。一款游戏、一个引擎、一次实验。",
        about: "关于我", aboutDescription: "多了解我一点。即将推出。",
        footer: "容纳不同探索的一方空间。", pauseMotion: "暂停动画", resumeMotion: "恢复动画", reducedMotion: "已减少动态效果",
    },
    th: {
        dataScience: "วิทยาการข้อมูล", gameEngines: "เอนจินเกมและโมเดลภาษาขนาดใหญ่",
        index: "ดัชนีส่วนตัว", welcome: "เลือกเส้นทางของคุณ",
        intro: "งาน แนวคิด และสิ่งที่กำลังสร้าง", navigation: "สำรวจผลงานของ Stepan",
        professional: "ประสบการณ์และการทำงาน", cv: "ประวัติการทำงาน",
        cvDescription: "วิทยาการข้อมูลและระบบการผลิต เนื้อหาภาษาอังกฤษ", viewCv: "ดูประวัติ",
        sanctuary: "บทความว่าด้วยเกม ผู้เล่น และเศรษฐกิจที่เชื่อมโยงกัน",
        loopforge: "โรงงานสมองประดิษฐ์ เกม เอนจิน และการทดลอง",
        about: "เกี่ยวกับ", aboutDescription: "เรื่องราวของฉันเพิ่มเติม เร็ว ๆ นี้",
        footer: "พื้นที่สำหรับสิ่งที่หลากหลาย", pauseMotion: "หยุดภาพเคลื่อนไหว", resumeMotion: "เล่นภาพเคลื่อนไหวต่อ", reducedMotion: "ลดการเคลื่อนไหว",
    },
};
