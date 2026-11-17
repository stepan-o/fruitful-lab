import type { Chapter, EvidenceSource } from "./types";
import media from "./rivals-media.json";

export const rivalsSources: EvidenceSource[] = [
  { id: "rivals-reveal", title: "Marvel Games and NetEase Games announce their collaboration · March 2024", url: "https://www.neteasegames.com/news/MarvelRivals/20250331/36929_1145895.html", note: "Credits development to NetEase and describes six-player teams, destructive environments and the Rocket/Groot team-up." },
  { id: "rivals-launch", title: "NetEase Games · Dooms’ Rise launch announcement", url: "https://www.neteasegames.com/news/MarvelRivals/20250331/36929_1198455.html", note: "6 December 2024. The count of eight maps covers Quick Match and Competitive. The release also lists a Conquest map and a practice range." },
  { id: "rivals-hero", title: "Marvel Rivals · Jeff the Land Shark", url: "https://www.marvelrivals.com/heroes/0qmdlat6ntsoy/index.html", note: "The official Strategist profile describes Joyful Splash, Healing Bubble and Jeff’s dive. Ability tuning can change between patches." },
  { id: "rivals-comic", title: "Marvel Comics · It’s Jeff!", url: "https://share.marvel.com/comics/discover/2402/its-jeff", note: "Marvel credits writer Kelly Thompson and artist team Gurihiru on the Infinity Comic. The game adapts the dolphin disguise from the comic." },
  { id: "rivals-costume", title: "Antonia Haynes · Jeff’s Incognito Dolphin", url: "https://esportsinsider.com/best-marvel-rivals-skins", note: "Identifies the comic reference, credits the game image to NetEase and distinguishes the 1,400-Unit costume from its 1,600-Unit bundle." },
  { id: "rivals-art", title: "NetEase visual team · Art Vision, GUI & Video", url: "https://www.marvelrivals.com/devdiaries/20250421/40954_1228989.html", note: "Art director Dino and the design team discuss their process. The official companion film shows the discarded gallery design." },
  { id: "rivals-gallery-history", title: "Justin Wagner · How the hero gallery changed", url: media["rivals-wheel"].sourceUrl, note: "21 April 2025. Distinguishes the early wheel, shipped Heroes grid and pre-battle selection arc. The author also describes his own difficulty finding a healer." },
  { id: "rivals-prices", title: "Marvel Rivals · The launch economy", url: "https://www.marvelrivals.com/devdiaries/20241205/40954_1198123.html", note: "5 December 2024. Launch currencies, five-piece bundles, optional cosmetics and Season 0 pass. Its cash-pack examples are explicitly for US Steam." },
  { id: "rivals-settlement", title: "Marvel Rivals · What survives a season change?", url: "https://www.marvelrivals.com/m/devdiaries/20241225/40954_1202068.html", note: "December 2024 rules for returning to a purchased pass, page unlocks, automatic redemption and the exception for purchased Chrono Tokens." },
  { id: "rivals-return", title: "Marvel Rivals · Season 0 battle pass returns", url: "https://www.marvelrivals.com/devdiaries/20250513/40954_1233900.html", note: "Published 13 May 2025. The return ran 15–29 May at 590 Lattice, with all rewards on the paid track." },
  { id: "rivals-event", title: "Marvel Rivals · Van Dyne’s Grand Opening", url: media["rivals-van-dyne"].sourceUrl, note: "The official December 2025 update dates the two-week offer and gives its 100- and 2,400-Unit endpoints." },
  { id: "rivals-event-play", title: "TechRadar · How the anniversary balloon purchase worked", url: "https://www.techradar.com/gaming/marvel-rivals-now-has-a-gacha-mini-game-featuring-a-limited-time-psylocke-bundle-heres-how-it-works", note: "Describes the balloon selection, the rising cost of attempts and receipt of the full set when the costume is found." },
  { id: "rivals-results", title: "NetEase investor relations · FY2024 results", url: "https://ir.netease.com/node/14871", note: "20 February 2025. NetEase reports cumulative registrations at two milestones. Its financial statements aggregate the games business." },
  { id: "rivals-season-eleven", title: "Marvel Rivals · Season 11 launch notes", url: media["rivals-incursion"].sourceUrl, note: "13 November 2026 release. Separates Nightcrawler, the new story, store offers, rank reward and the ten costume sets in The Incursion." },
];

export const rivalsChapter: Omit<Chapter, "visual"> = {
  id: "marvel-rivals",
  part: 0,
  title: "Marvel Rivals and the shark in a dolphin suit",
  lede: "Anyone can play the shark. What makes the dolphin worth buying?",
  paragraphs: [
    "Jeff can disappear under the floor. For a moment, all anyone sees of the little blue shark is a dorsal fin travelling across dry land. When he surfaces, he can send a stream of water into an injured teammate to heal them. Someone at NetEase had to make the fin readable in the middle of a six-against-six fight. Someone also had to work out how a shark would look dressed as a dolphin. The first piece of work came with the game. The second went in the shop.",
    "Rockstar built up the meaning of a place over successive visits to Los Santos. NetEase could start a match with two people who already knew each other from somewhere else. Put Rocket Raccoon on Groot’s shoulder and a relationship from Guardians of the Galaxy becomes a move two strangers can perform together. When Marvel Rivals opened in December 2024, either stranger could take either part. All 33 launch heroes were available from the outset.",
    "A favourite character gives a newcomer somewhere to start. Finding that character among three dozen faces is a different design problem. An early gallery shown by art director Dino’s team put the portraits on a wheel. Hulk got room to be enormous. Looking for someone else meant following the wheel around him. The released game kept two answers to the problem. You could browse a grid in the gallery, while the screen before a fight kept a sweep of faces around the hero you were about to play.",
    "Those screens ask different things of a pair of eyes. At leisure, I might stop on a face I have never seen in a comic. With five people waiting, I may already know exactly which healer I need. A grid lets me remember where to look. A curve draws my eye back to the figure I have chosen. An interface decision that buys the illustrator another moment with Hulk can also cost the player another moment finding Jeff.",
    "The pink disguise had a life before the shop. Kelly Thompson and the artists Gurihiru gave Jeff a largely wordless series of his own. In the game’s version of the dolphin gag, his blue face sticks out through a pink hood. Both animals have to be visible for the joke to work. A reader who remembers the comic gets a little reunion. Someone who has never opened it can get the joke at a glance.",
    "At launch, NetEase sold a version of the joke for several occasions. The costume could appear throughout a match. An emote let its owner perform for nearby players. A spray left a mark on a surface, a nameplate dressed up a player’s identity, and a short animation gave the match’s most valuable player a curtain call. One purchase could reach people who had never opened the shop. That audience was part of what made the five pieces worth making.",
    "The season pass sold a different relationship to time. In the short opening season, 490 Lattice bought access to a track with five costumes. A player still earned tokens through tasks and events to claim rewards. The purchased pass stayed in the account after the season ended. Coming back to it could still mean earning tokens again to open its pages. In May 2025, someone who had missed the original sale got two weeks to buy in at 590 Lattice. The freedom to finish later and the opportunity to start later had different terms.",
    "A year after launch, Psylocke’s Daring Daifuku costume appeared behind balloons in an anniversary event. A lucky first pick delivered the whole set for 100 Units. Miss, and the next pick cost more. By 2,400 Units the set was guaranteed. The art could be admired in advance. The bill would become clear one balloon at a time. A shopper who had once compared two posted prices now had to decide what to do after spending money and coming away without the costume.",
    "NetEase counted more than ten million registrations in the first 72 hours and more than forty million by its February 2025 results. Each new arrival could fill a place on somebody’s team. Only some needed to buy a costume for that costume to find an audience. The company reported revenue for its games business as a whole. The registrations tell us how many accounts the invitation reached. How much Jeff’s wardrobe paid for is a question those accounts cannot answer.",
    "When Nightcrawler arrived in November 2026, the same update gave him a story, put his Steadfast Swordsman outfit on sale and offered a different costume for reaching Gold rank. A newcomer could learn to teleport. A regular could dress a favourite X-Man for the occasion. A competitor could wear something that said where they had placed. All three gave artists work to do. Only one of those routes put a price on the outfit.",
    "A studio can make tomorrow’s game by adding a new face to tonight’s team. It can also spend those years building an adventure with a beginning and an end. Turn from Jeff’s wardrobe to Diablo IV and Baldur’s Gate 3, and the question changes. Once the player has paid for a whole world, what still belongs to the evening they bought, and what will its makers sell next?",
  ],
  sections: [
    { at: 2, title: "Finding a face before the match" },
    { at: 4, title: "Where a costume gets seen" },
    { at: 6, title: "How long does the offer last?" },
    { at: 8, title: "Who pays for the next arrival?" },
  ],
  paragraphCitations: {
    0: ["rivals-hero", "rivals-reveal", "rivals-prices"], 1: ["rivals-reveal", "rivals-launch"],
    2: ["rivals-art", "rivals-gallery-history"], 3: ["rivals-gallery-history"],
    4: ["rivals-comic", "rivals-costume"], 5: ["rivals-prices", "rivals-costume"],
    6: ["rivals-prices", "rivals-settlement", "rivals-return"], 7: ["rivals-event", "rivals-event-play"],
    8: ["rivals-results"], 9: ["rivals-season-eleven"],
  },
  exhibits: [
    { afterParagraph: 2, kind: "rivals-interface" }, { afterParagraph: 5, kind: "rivals-wallet" },
    { afterParagraph: 7, kind: "rivals-anniversary" }, { afterParagraph: 9, kind: "rivals-season" },
  ],
  sources: rivalsSources.map(source => source.id),
  evidence: "The screen studies distinguish a development concept from two published captures of the released interface. The purchase comparison uses historical offers and states its wallet assumptions. The anniversary range gives the possible endpoints. Expected spend needs a probability distribution. Registrations are cumulative publisher figures and supply neither a payer count nor title-level revenue. The reading of visibility, timing and comic recognition is the author’s.",
};
