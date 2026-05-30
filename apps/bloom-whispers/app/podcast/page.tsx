import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlitterField } from "@/components/GlitterField";
import styles from "./PodcastPage.module.css";

const rssFeedUrl = "https://feeds.redcircle.com/285bb6f0-e185-4625-84ae-e69aa6bafa9e";
const spotifyUrl = "https://open.spotify.com/show/0iIlU2mfu9Nowa1qVu0qhc";
const appleUrl = "https://podcasts.apple.com/us/podcast/bloom-whispers/id1738589218";
const redCircleUrl = "https://redcircle.com/shows/bloom-whispers";

const episodes = [
  {
    episode: 8,
    title: "Incense and Florals: Exploring Ancient Practices and Modern Creations",
    shortTitle: "Incense and Florals",
    date: "Aug 19, 2024",
    duration: "44 min",
    category: "Rituals, Floral History",
    summary:
      "A conversation with Alisa of Flora Botanical Incense about ancient incense traditions, natural materials, and floral-inspired ritual.",
    audioUrl: "https://audio2.redcircle.com/episodes/3c7774ef-24bb-4963-a4ca-9171b6c9e53d/stream.mp3",
    image: "/assets/podcast-cover-t1-e1.png",
  },
  {
    episode: 7,
    title: "Decoding Tarot's Floral Secrets: The Symbols You’ve Been Missing",
    shortTitle: "Tarot's Floral Secrets",
    date: "Aug 18, 2024",
    duration: "33 min",
    category: "Symbolism, Stories",
    summary:
      "Gina joins Susy to explore roses, pomegranate blossoms, and the quiet flower symbols tucked inside Tarot cards.",
    audioUrl: "https://audio2.redcircle.com/episodes/e0a8a7ea-7881-45b6-8c74-9defb87a83c6/stream.mp3",
    image: "/assets/quiz-result-hellebore.png",
  },
  {
    episode: 6,
    title: "Forest Therapy: Elizabeth Mintun on Nature's Healing Power",
    shortTitle: "Forest Therapy",
    date: "Jul 31, 2024",
    duration: "42 min",
    category: "Nature, Healing",
    summary:
      "Psychotherapist Elizabeth Mintun shares the roots of forest bathing and practical ways nature can support daily wellbeing.",
    audioUrl: "https://audio2.redcircle.com/episodes/955faaeb-c403-468d-8da3-3c7399e7859c/stream.mp3",
    image: "/assets/journal-arch.png",
  },
  {
    episode: 5,
    title: "Harnessing Flower Energy: Healing with Yvette Timmins",
    shortTitle: "Harnessing Flower Energy",
    date: "Jul 17, 2024",
    duration: "42 min",
    category: "Flower Therapy",
    summary:
      "Florist and energy healer Yvette Timmins talks about sunflowers, roses, flower energy, and small healing practices.",
    audioUrl: "https://audio2.redcircle.com/episodes/88477bb4-8da0-4b04-a585-32c59e97e896/stream.mp3",
    image: "/assets/flower-pink-rose.png",
  },
  {
    episode: 4,
    title: "Understanding the Essence of Flowers with Botanist Roxana Khoshravesh",
    shortTitle: "The Essence of Flowers",
    date: "Jul 3, 2024",
    duration: "39 min",
    category: "Botany, Meaning",
    summary:
      "Botanist Roxana Khoshravesh explores what a flower is, why flowers matter, and how plants survive and communicate.",
    audioUrl: "https://audio2.redcircle.com/episodes/44d30aea-d22d-485a-8a81-abf2a713fe3a/stream.mp3",
    image: "/assets/flower-white-bloom.png",
  },
  {
    episode: 3,
    title: "Floral Frequencies: Laura Ashley Explores the Healing Power of Flower Energy",
    shortTitle: "Floral Frequencies",
    date: "Apr 12, 2024",
    duration: "28 min",
    category: "Flower Essences",
    summary:
      "Laura Ashley shares how floral essences can become gentle allies for healing, self-discovery, and everyday ritual.",
    audioUrl: "https://audio2.redcircle.com/episodes/f887d055-9a2e-4e21-8d92-78178fff605f/stream.mp3",
    image: "/assets/quiz-result-camellia.png",
  },
  {
    episode: 2,
    title: "Unveiling the Healing Power of Flowers with Amelia South",
    shortTitle: "The Healing Power of Flowers",
    date: "Apr 5, 2024",
    duration: "51 min",
    category: "Herbalism, Wellness",
    summary:
      "Herbalist Amelia South guides us through chamomile, roses, violets, calendula, bee balm, and nature's gentle remedies.",
    audioUrl: "https://audio2.redcircle.com/episodes/275f9371-1220-4cb1-b65b-eb0c8c01802c/stream.mp3",
    image: "/assets/quiz-result-iris.png",
  },
  {
    episode: 1,
    title: "Awakening Healing & Creativity: Lotus Flower Wisdom With Laurie Morse",
    shortTitle: "Lotus Flower Wisdom",
    date: "Mar 28, 2024",
    duration: "40 min",
    category: "Lotus, Creativity",
    summary:
      "Laurie Morse joins Susy for a conversation on lotus symbolism, intentional creativity, resilience, and inner light.",
    audioUrl: "https://audio2.redcircle.com/episodes/a0edaf72-9ea8-451d-8cbe-181cfbd11547/stream.mp3",
    image: "/assets/quiz-result-love-in-a-mist.png",
  },
] as const;

const latestEpisode = episodes[0];
const recentEpisodes = episodes.slice(1, 4);

export const metadata: Metadata = {
  title: "Podcast",
  description:
    "Listen to the Bloom Whispers podcast, with conversations about flower meanings, folklore, botanical wisdom, healing, ritual, and nature.",
};

export default function PodcastPage() {
  return (
    <article className={styles.podcastPage}>
      <section className={styles.hero}>
        <GlitterField className="site-glitter--section" />
        <Image className={styles.heroRoseLeft} src="/assets/flower-pink-rose.png" alt="" width={600} height={600} priority />
        <Image className={styles.heroBloomRight} src="/assets/journal-right-floral-edge.png" alt="" width={900} height={900} priority />
        <div className={styles.heroCopy}>
          <p>The Podcast</p>
          <h1>The Bloom Whispers Podcast</h1>
          <span aria-hidden="true">✦</span>
          <p>Stories of flowers, folklore, and the quiet magic they bring to our lives.</p>
        </div>
      </section>

      <section className={styles.bodySection}>
        <div className={styles.layout}>
          <main className={styles.mainColumn}>
            <section className={styles.latestCard} aria-labelledby="latest-podcast-heading">
              <div className={styles.latestArt}>
                <Image src="/assets/podcast-cover-t1-e1.png" alt="Bloom Whispers podcast cover" width={900} height={900} />
              </div>
              <div className={styles.latestCopy}>
                <p className={styles.eyebrow}>Latest Episode</p>
                <h2 id="latest-podcast-heading">Ep. {latestEpisode.episode} - {latestEpisode.shortTitle}</h2>
                <p>{latestEpisode.summary}</p>
                <div className={styles.metaLine}>
                  <span>{latestEpisode.duration}</span>
                  <span aria-hidden="true">|</span>
                  <span>{latestEpisode.date}</span>
                  <span aria-hidden="true">|</span>
                  <span>{latestEpisode.category}</span>
                </div>
                <audio
                  className={styles.latestAudio}
                  controls
                  preload="none"
                  src={latestEpisode.audioUrl}
                  aria-label={`Play episode ${latestEpisode.episode}: ${latestEpisode.title}`}
                />
                <div className={styles.latestActions}>
                  <a className={styles.primaryButton} href={latestEpisode.audioUrl}>
                    <span aria-hidden="true">▶</span>
                    Open Audio
                  </a>
                  <a className={styles.textLink} href={redCircleUrl}>
                    View Episode Details
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </section>

            <section className={styles.episodeSection} aria-labelledby="all-episodes-heading">
              <div className={styles.sectionHeading}>
                <h2 id="all-episodes-heading">All Episodes</h2>
                <span aria-hidden="true" />
              </div>
              <div className={styles.episodeList}>
                {episodes.map((episode) => (
                  <article className={styles.episodeRow} id={`episode-${episode.episode}`} key={episode.audioUrl}>
                    <a className={styles.episodeThumb} href={episode.audioUrl} aria-label={`Listen to ${episode.title}`}>
                      <Image src={episode.image} alt="" width={320} height={240} />
                    </a>
                    <div>
                      <h3>Ep. {episode.episode} - {episode.title}</h3>
                      <p className={styles.episodeMeta}>
                        {episode.date}
                        <span aria-hidden="true">•</span>
                        {episode.duration}
                        <span aria-hidden="true">•</span>
                        {episode.category}
                      </p>
                      <p>{episode.summary}</p>
                      <audio
                        className={styles.episodeAudio}
                        controls
                        preload="none"
                        src={episode.audioUrl}
                        aria-label={`Play episode ${episode.episode}: ${episode.title}`}
                      />
                    </div>
                    <a className={styles.listenLink} href={episode.audioUrl}>
                      Open Audio
                      <span aria-hidden="true">→</span>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <aside className={styles.sidebar} aria-label="Podcast sidebar">
            <section className={styles.sidebarCard}>
              <div className={styles.sidebarHeading}>
                <h2>About the Podcast</h2>
                <span aria-hidden="true">✦</span>
              </div>
              <p>
                Bloom Whispers is a storytelling podcast about flowers and the meanings they carry. Each episode
                explores the legends, language, and little-known magic behind the blooms that surround us every day.
              </p>
            </section>

            <section className={styles.sidebarCard}>
              <div className={styles.sidebarHeading}>
                <h2>Listen On</h2>
                <span aria-hidden="true">✦</span>
              </div>
              <div className={styles.platformGrid}>
                <a href={spotifyUrl}><span>●</span> Spotify</a>
                <a href={appleUrl}><span>●</span> Apple Podcasts</a>
                <a href={redCircleUrl}><span>●</span> RedCircle</a>
                <a href={rssFeedUrl}><span>●</span> RSS Feed</a>
              </div>
            </section>

            <section className={`${styles.sidebarCard} ${styles.quizCard}`}>
              <h2>Get your flower message</h2>
              <p>Take the gentle quiz and receive one bloom, one reflection, and one small ritual for your season.</p>
              <Link href="/flower-message-quiz">
                Take the Flower Quiz
                <span aria-hidden="true">✦</span>
              </Link>
            </section>

            <section className={styles.sidebarCard}>
              <div className={styles.sidebarHeading}>
                <h2>Recent Episodes</h2>
                <span aria-hidden="true">✦</span>
              </div>
              <div className={styles.recentList}>
                {recentEpisodes.map((episode) => (
                  <a href={episode.audioUrl} key={episode.audioUrl}>
                    <Image src={episode.image} alt="" width={120} height={120} />
                    <span>
                      <strong>Ep. {episode.episode} - {episode.shortTitle}</strong>
                      <small>{episode.date} • {episode.duration}</small>
                    </span>
                    <i aria-hidden="true">▶</i>
                  </a>
                ))}
              </div>
            </section>

            <section className={`${styles.sidebarCard} ${styles.promoCard}`}>
              <div>
                <p className={styles.eyebrow}>Be a Guest</p>
                <h2>Bring your flower story to the garden.</h2>
                <p>Have folklore, botanical knowledge, creative work, or a flower-connected story to share?</p>
                <Link href="/contact#be-a-guest">
                  Apply to be a guest
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <Image src="/assets/flower-white-bloom.png" alt="" width={600} height={760} />
            </section>
          </aside>
        </div>
      </section>
    </article>
  );
}
