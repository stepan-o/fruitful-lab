import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ArrowLeft } from "lucide-react";
import EngravedScene from "@/components/production-systems/EngravedScene";
import ProfileMotion from "@/components/production-systems/ProfileMotion";
import LoopBlueprint from "@/components/production-systems/LoopBlueprint";
import ScenarioExplorer from "@/components/production-systems/ScenarioExplorer";
import ProfileActions from "@/components/production-systems/ProfileActions";
import { sources, linkedInUrl } from "@/lib/production-systems/content";
import styles from "./profile.module.css";

const canonical = "https://www.fruitfulab.net/stepanoskin/production-systems";
const title = "Stepan Oskin — Data Science & Production Systems";
const description = "Data science across the full stack: experimentation, generative production pipelines, and catalog optimization. A professional profile and systems perspective by Stepan Oskin.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "profile", firstName: "Stepan", lastName: "Oskin", locale: "en_US" },
  twitter: { card: "summary", title, description },
};

const capabilities = [
  { number: "01", title: "Measurement & experimentation", body: "Translate product goals into observable outcomes. Design item-level experiments, exposure records, custom success metrics, and decision rules that remain meaningful across a catalog.", tags: "Metric design · A/B testing · Causal reasoning" },
  { number: "02", title: "Generative production pipelines", body: "Connect code, visual, and content generation to a repeatable production process: structured inputs, evaluation, editorial review, versioned assets, and controlled release.", tags: "Generation · Evaluation · Asset provenance" },
  { number: "03", title: "Full-stack implementation", body: "Build the interfaces, services, data models, and integrations that make the system usable. Carry the measurement contract from the user interaction to the analytical dataset.", tags: "Python · SQL · TypeScript · React / Next.js" },
  { number: "04", title: "Reliable operation", body: "Make releases reproducible and failures diagnosable. Account for permissions, data quality, delivery cost, observability, and rollback alongside model and product quality.", tags: "APIs · PostgreSQL · CI · Versioned delivery" },
];

function SourceNote({ id, children }: { id: string; children: React.ReactNode }) {
  return <a className={styles.sourceNote} href={`#source-${id}`}>{children}<span className={styles.srOnly}> — source note</span></a>;
}

export default function ProductionSystemsPage() {
  return (
    <div className={styles.page} lang="en">
      <a className={styles.skip} href="#profile">Skip to profile</a>
      <header className={styles.header}>
        <Link className={styles.identity} href="/stepanoskin" aria-label="Stepan Oskin — all presentations">
          <span className={styles.monogram} aria-hidden="true">SO</span>
          <span>Stepan Oskin<span className={styles.identitySub}>Data science & systems</span></span>
        </Link>
        <nav className={styles.navigation} aria-label="Profile navigation">
          <a href="#experience">Experience</a>
          <a href="#approach">Approach</a>
          <a href="#references">References</a>
        </nav>
        <Link className={styles.backLink} href="/stepanoskin"><ArrowLeft size={15} aria-hidden="true" /><span>Presentations</span></Link>
      </header>

      <ProfileMotion>
        <section className={styles.hero} aria-labelledby="profile-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Professional profile <span>/</span> 2026</p>
            <h1 id="profile-title">Stepan Oskin<span>Data science, <br />across the full stack.</span></h1>
            <p className={styles.intro}>I design and build systems that turn digital production into a measurable learning loop.</p>
            <p className={styles.heroDetail}>From the metric and the experiment to the application, the data pipeline, and the next release.</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href={linkedInUrl}>Connect on LinkedIn <ArrowUpRight size={17} aria-hidden="true" /></a>
              <a className={styles.textLink} href="#experience">Explore my work <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
            <div className={styles.currentRole}><span aria-hidden="true" />Currently at <strong>Prodigy Education</strong></div>
          </div>
          <LoopBlueprint />
        </section>

        <div className={styles.focusStrip} aria-label="Areas of focus">
          <span>Experimentation</span><span>Generative pipelines</span><span>Catalog optimization</span><span>Production engineering</span>
        </div>

        <section className={styles.section} id="experience" aria-labelledby="experience-title">
          <div className={styles.sectionLabel}><span>01 / Background</span><h2 id="experience-title">Grounded in <br />production.</h2><EngravedScene scene="operator" /></div>
          <div className={styles.sectionContent}>
            <article className={styles.role}>
              <div className={styles.rowHeading}><h3>Prodigy Education</h3><span className={styles.badge}>Current</span></div>
              <p className={styles.roleFocus}>Data science · Experimentation · Math education</p>
              <p>My current work includes developing an in-house production experimentation system for a substantial catalog of learning content, with concurrent item-level A/B tests and custom success metrics.</p>
              <p>The transferable challenge is connecting decisions about individual items to the objectives of the wider product—while making the experimentation infrastructure reliable enough to use in practice.</p>
            </article>
            <div className={styles.workGrid}>
              <article>
                <p className={styles.smallLabel}>Independent implementation</p>
                <h3>Fruitful Lab</h3>
                <p>A working full-stack sandbox: typed decision tools, event instrumentation, backend APIs, and versioned media delivery.</p>
                <Link className={styles.textLink} href="/tools">Explore the tools <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </article>
              <article>
                <p className={styles.smallLabel}>Published research · 2022</p>
                <h3>Applied machine learning</h3>
                <p>Co-author of research on residential land-use classification: integrating urban datasets and engineering features from housing-market dynamics.</p>
                <a className={styles.textLink} href="https://www.jtlu.org/index.php/jtlu/article/view/1905">Read the publication <ArrowUpRight size={16} aria-hidden="true" /></a>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="capabilities-title">
          <div className={styles.sectionLabel}><span>02 / Capabilities</span><h2 id="capabilities-title">One system. <br />The whole stack.</h2><p>Data science is the connecting discipline: what to measure, what to infer, and what to change.</p><EngravedScene scene="cabinet" /></div>
          <div className={styles.capabilities}>
            {capabilities.map(capability => <article key={capability.number} className={styles.capability}>
              <span className={styles.capabilityNumber}>{capability.number}</span>
              <div><h3>{capability.title}</h3><p>{capability.body}</p><p className={styles.tags}>{capability.tags}</p></div>
            </article>)}
          </div>
        </section>

        <section className={styles.applicationSection} id="applications" aria-labelledby="applications-title">
          <div className={styles.applicationHeading}><div className={styles.applicationIntro}>
            <p className={styles.eyebrow}>03 / A transferable architecture</p>
            <h2 id="applications-title">Different catalogs. <br /><em>The same design problem.</em></h2>
            <p>A lesson, a game encounter, a product selector, or a troubleshooting guide can each become a versioned, measurable unit of improvement.</p>
          </div>
          <EngravedScene scene="board" /></div>
          <ScenarioExplorer />
        </section>

        <section className={`${styles.section} ${styles.longForm}`} id="approach" aria-labelledby="approach-title">
          <div className={styles.sectionLabel}><span>04 / Method</span><h2 id="approach-title">Make the loop <br />trustworthy.</h2><EngravedScene scene="inspection" compact /></div>
          <div className={styles.sectionContent}>
            <p className={styles.sectionLead}>The central question: which change to which item is most likely to improve the overall outcome—and what evidence would justify shipping it?</p>
            <div className={styles.methods}>
              <article><h3>Define the decision before the model.</h3><p>Agree on the product objective, item-level signals, guardrails, and minimum useful effect. Start with a baseline that can be understood and challenged. <SourceNote id="google">[1]</SourceNote></p></article>
              <article><h3>Preserve the chain of evidence.</h3><p>Connect item identity, content version, assignment, actual exposure, and outcome. Check missing events and allocation mismatches before interpreting a result. <SourceNote id="microsoft">[2]</SourceNote></p></article>
              <article><h3>Design for uncertainty and interaction.</h3><p>Choose the randomization unit to match the question. Account for repeat users, concurrent tests, multiple comparisons, and stopping rules. Treat sparse data as uncertainty; inspect effects across stable segments. <SourceNote id="microsoft">[2]</SourceNote></p></article>
              <article><h3>Evaluate the portfolio, then release.</h3><p>A local gain can shift demand elsewhere or degrade a shared experience. Evaluate the overall objective and guardrails, retain a rollback path, and feed findings into the next production brief. <SourceNote id="microsoft">[2]</SourceNote></p></article>
            </div>
            <blockquote className={styles.quote} cite="https://developers.google.com/machine-learning/guides/rules-of-ml">
              <p>“First, design and implement metrics.”</p>
              <footer>Google · Rules of Machine Learning, Rule 2 <SourceNote id="google">[1]</SourceNote></footer>
            </blockquote>
          </div>
        </section>

        <section className={`${styles.section} ${styles.longForm}`} id="production" aria-labelledby="production-title">
          <div className={styles.sectionLabel}><span>05 / Production perspective</span><h2 id="production-title">Generation is <br />one stage.</h2><EngravedScene scene="release" compact /></div>
          <div className={styles.sectionContent}>
            <p className={styles.sectionLead}>A production pipeline gives generated work a specification, a quality bar, a delivery path, and a way to learn from use.</p>
            <ol className={styles.pipeline}>
              <li><span>01</span><div><h3>Specify</h3><p>Define the user need, source material, constraints, and evaluation criteria.</p></div></li>
              <li><span>02</span><div><h3>Produce & validate</h3><p>Generate candidates; check behavior, content, accessibility, and provenance. Review where judgment matters.</p></div></li>
              <li><span>03</span><div><h3>Version & deliver</h3><p>Package approved assets with stable identities. Release through a controlled, observable application.</p></div></li>
              <li><span>04</span><div><h3>Measure & improve</h3><p>Evaluate outcomes against the baseline. Update the item, the production recipe, or the allocation of effort.</p></div></li>
            </ol>
            <p className={styles.bodyNote}>This pattern is emerging across sectors. Duolingo describes shared, AI-assisted course production; Roblox describes generation of interactive 3D objects; Adobe connects creative performance insights with generation of new variants. These are industry reference points for the approach. <SourceNote id="duolingo">[3]</SourceNote> <SourceNote id="roblox">[4]</SourceNote> <SourceNote id="adobe">[5]</SourceNote></p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.references}`} id="references" aria-labelledby="references-title">
          <div className={styles.sectionLabel}><span>06 / Reading & evidence</span><h2 id="references-title">References.</h2><p>Primary sources behind the methodology and industry context. Checked October 2026.</p><EngravedScene scene="folio" compact /></div>
          <div><ol className={styles.sourceList}>
            {sources.map((source, index) => <li id={`source-${source.id}`} key={source.id}>
              <span className={styles.sourceNumber}>[{index + 1}]</span>
              <div><a href={source.url}>{source.title}<ArrowUpRight size={14} aria-hidden="true" /></a><p className={styles.sourcePublisher}>{source.publisher}</p><p>{source.note}</p></div>
            </li>)}
          </ol>
          <details className={styles.artSources}><summary>About the engraved studies</summary><p>Procedural drawings after the cabinet and chessboard in <a href="https://commons.wikimedia.org/wiki/File:Tuerkischer_schachspieler_windisch4.jpg">Windisch’s 1783 engraving</a> and vector figure studies derived from <a href="https://commons.wikimedia.org/wiki/File:Racknitz_-_The_Turk_3.jpg">Racknitz’s 1789 interior plate</a>. Racknitz proposed a reconstruction; these illustrations freely reinterpret the plates as metaphors for contemporary systems work. The workshop instruments and their motion are original compositions.</p></details></div>
        </section>

        <section className={styles.contact} aria-labelledby="contact-title">
          <div><p className={styles.eyebrow}>Continue the conversation</p><h2 id="contact-title">From a useful question <br />to a working system.</h2><p>Data science, experimentation, and the engineering that connects them.</p></div>
          <EngravedScene scene="rest" compact />
          <ProfileActions />
          <p className={styles.printNote}>Full presentation and references: <a href={canonical}>{canonical}</a></p>
        </section>
      </ProfileMotion>
      <footer className={styles.footer}><span>Stepan Oskin <span>/</span> Fruitful Lab</span><Link href="/stepanoskin">All presentations <ArrowUpRight size={14} aria-hidden="true" /></Link><span>Professional profile · English</span></footer>
    </div>
  );
}
