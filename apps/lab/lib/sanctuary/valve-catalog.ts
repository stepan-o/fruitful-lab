export type ValveGame = {title:string; year:string; url:string; note?:string};
const steam=(id:number)=>`https://store.steampowered.com/app/${id}/`;

/** Checked 8 October 2026. Historical releases, not the date of every current store package. */
export const valveGames: ValveGame[] = [
 {title:"Half-Life",year:"1998",url:steam(70)},
 {title:"Team Fortress Classic",year:"1999",url:steam(20)},
 {title:"Counter-Strike",year:"2000",url:steam(10),note:"Valve release; began as a 1999 community mod."},
 {title:"Ricochet",year:"2000",url:steam(60)},
 {title:"Deathmatch Classic",year:"2001",url:steam(40)},
 {title:"Day of Defeat",year:"2003",url:steam(30),note:"Commercial release of the community mod."},
 {title:"Counter-Strike: Condition Zero",year:"2004",url:steam(80),note:"Includes Deleted Scenes; developed across several teams."},
 {title:"Counter-Strike: Source",year:"2004",url:steam(240)},
 {title:"Half-Life 2",year:"2004",url:steam(220)},
 {title:"Half-Life: Source",year:"2004",url:steam(280),note:"Source-engine version of Half-Life."},
 {title:"Half-Life 2: Deathmatch",year:"2004",url:steam(320)},
 {title:"Day of Defeat: Source",year:"2005",url:steam(300)},
 {title:"Half-Life 2: Lost Coast",year:"2005",url:steam(340),note:"A short playable technology showcase."},
 {title:"Half-Life Deathmatch: Source",year:"2006",url:steam(360)},
 {title:"Half-Life 2: Episode One",year:"2006",url:steam(380)},
 {title:"Half-Life 2: Episode Two",year:"2007",url:steam(420)},
 {title:"Portal",year:"2007",url:steam(400)},
 {title:"Team Fortress 2",year:"2007",url:steam(440)},
 {title:"Portal: Still Alive",year:"2008",url:"https://www.xbox.com/en-GB/games/store/portal-still-alive/br30gbnh63f9",note:"Xbox edition with additional puzzles."},
 {title:"Left 4 Dead",year:"2008",url:steam(500),note:"Originated at Turtle Rock, acquired by Valve during development."},
 {title:"Left 4 Dead 2",year:"2009",url:steam(550)},
 {title:"Alien Swarm",year:"2010",url:steam(630)},
 {title:"Portal 2",year:"2011",url:steam(620)},
 {title:"Counter-Strike: Global Offensive",year:"2012",url:"https://store.steampowered.com/app/730/",note:"Later succeeded by Counter-Strike 2."},
 {title:"Dota 2",year:"2013",url:steam(570)},
 {title:"The Lab",year:"2016",url:steam(450390),note:"A collection of short VR experiences."},
 {title:"Artifact",year:"2018",url:steam(583950),note:"The original version is now called Artifact Classic."},
 {title:"Dota Underlords",year:"2020",url:steam(1046930),note:"Early access in 2019; full launch in 2020."},
 {title:"Half-Life: Alyx",year:"2020",url:steam(546560)},
 {title:"Artifact Foundry",year:"2021",url:steam(1269260),note:"Unfinished redesign made available free; development ended."},
 {title:"Aperture Desk Job",year:"2022",url:steam(1902490),note:"A playable short introducing Steam Deck controls."},
 {title:"Counter-Strike 2",year:"2023",url:steam(730)},
];

export const valveCollaborations: ValveGame[] = [
 {title:"Half-Life 2: Update",year:"2015",url:steam(290930),note:"Community mod led by Filip Victor; Steam also credits Valve."},
 {title:"Aperture Hand Lab",year:"2019",url:steam(868020),note:"Cloudhead Games, developed in collaboration with Valve."},
];
export const valveInDevelopment: ValveGame = {title:"Deadlock",year:"In development",url:steam(1422450),note:"Limited playtest; no announced release date as of 8 October 2026."};
