import type { Locale } from "./translations";

type DirectoryCopy = {
    index: string; heading: string; intro: string;
    practice: string; essay: string; world: string; loopforge: string;
    about: string; soon: string; aboutMessage: string; footer: string;
};

export const directoryCopy: Record<Locale, DirectoryCopy> = {
    en: {
        index: "Selected work", heading: "Systems, economies & imagined worlds.",
        intro: "Three paths into how things work — and what makes them worth building.",
        practice: "Professional practice", essay: "Essays & interactive models", world: "A playable study",
        loopforge: "An artificial brain factory. Explore the game, its engine and a live prototype. In English.",
        about: "About", soon: "Coming soon",
        aboutMessage: "A little more about the person behind these projects. This page is still taking shape.",
        footer: "Work, research & experiments",
    },
    fr: {
        index: "Travaux choisis", heading: "Systèmes, économies et mondes imaginés.",
        intro: "Trois voies pour comprendre comment les choses fonctionnent — et ce qui mérite d’être construit.",
        practice: "Pratique professionnelle", essay: "Essais et modèles interactifs", world: "Une étude jouable",
        loopforge: "Une usine de cerveaux artificiels. Découvrez le jeu, son moteur et un prototype jouable. En anglais.",
        about: "À propos", soon: "À venir",
        aboutMessage: "Un peu plus sur la personne derrière ces projets. Cette page prend encore forme.",
        footer: "Travaux, recherche et expériences",
    },
    es: {
        index: "Trabajos seleccionados", heading: "Sistemas, economías y mundos imaginados.",
        intro: "Tres caminos para entender cómo funcionan las cosas y qué merece la pena construir.",
        practice: "Práctica profesional", essay: "Ensayos y modelos interactivos", world: "Un estudio jugable",
        loopforge: "Una fábrica de cerebros artificiales. Explora el juego, su motor y un prototipo jugable. En inglés.",
        about: "Acerca de", soon: "Próximamente",
        aboutMessage: "Un poco más sobre la persona detrás de estos proyectos. Esta página aún está tomando forma.",
        footer: "Trabajo, investigación y experimentos",
    },
    ru: {
        index: "Избранные работы", heading: "Системы, экономики и придуманные миры.",
        intro: "Три направления о том, как всё устроено — и что стоит создавать.",
        practice: "Профессиональная практика", essay: "Эссе и интерактивные модели", world: "Игровое исследование",
        loopforge: "Фабрика искусственных мозгов. Игра, устройство движка и рабочий прототип. На английском.",
        about: "Обо мне", soon: "Скоро",
        aboutMessage: "Немного больше о человеке, который стоит за этими проектами. Страница ещё готовится.",
        footer: "Работа, исследования и эксперименты",
    },
    zh: {
        index: "精选项目", heading: "系统、经济与想象中的世界。",
        intro: "从三个方向探索事物如何运作，以及什么值得创造。",
        practice: "专业实践", essay: "文章与交互模型", world: "可玩的研究",
        loopforge: "一座人工大脑工厂。探索游戏、引擎设计和可玩的原型。英文内容。",
        about: "关于我", soon: "即将推出",
        aboutMessage: "了解这些项目背后的人。本页正在筹备中。",
        footer: "工作、研究与实验",
    },
    th: {
        index: "ผลงานคัดสรร", heading: "ระบบ เศรษฐกิจ และโลกในจินตนาการ",
        intro: "สามเส้นทางสู่ความเข้าใจว่าสิ่งต่าง ๆ ทำงานอย่างไร และอะไรที่ควรค่าแก่การสร้าง",
        practice: "งานวิชาชีพ", essay: "บทความและแบบจำลองเชิงโต้ตอบ", world: "การศึกษาผ่านเกม",
        loopforge: "โรงงานสมองประดิษฐ์ สำรวจเกม การออกแบบเอนจิน และต้นแบบที่เล่นได้ เนื้อหาภาษาอังกฤษ",
        about: "เกี่ยวกับ", soon: "เร็ว ๆ นี้",
        aboutMessage: "เรื่องราวเพิ่มเติมของผู้สร้างโครงการเหล่านี้ หน้านี้กำลังอยู่ระหว่างการจัดทำ",
        footer: "งาน การวิจัย และการทดลอง",
    },
};
