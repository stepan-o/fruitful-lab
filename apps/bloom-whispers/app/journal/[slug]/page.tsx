import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalPostTemplate } from "@/components/JournalPostTemplate";
import { getAllJournalPosts, getJournalPost, getPrimaryJournalPath } from "@/lib/journalPosts";
import { CANONICAL_URL, SITE_NAME } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllJournalPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);

  if (!post) {
    return {};
  }

  const canonicalPath = getPrimaryJournalPath(post);

  return {
    title: post.seoTitle,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      images: [
        {
          url: post.heroImage,
          alt: post.heroImageAlt,
        },
      ],
      type: "article",
      url: `${CANONICAL_URL}${canonicalPath}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.description,
      images: [
        {
          url: post.heroImage,
          alt: post.heroImageAlt,
        },
      ],
    },
  };
}

export default async function JournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getJournalPost(slug);

  if (!post) {
    notFound();
  }

  const canonicalPath = getPrimaryJournalPath(post);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.heroImage,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    mainEntityOfPage: `${CANONICAL_URL}${canonicalPath}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JournalPostTemplate post={post} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]) }}
      />
    </>
  );
}
