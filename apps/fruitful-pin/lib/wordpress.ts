export type WordPressConnection = {
  baseUrl?: string;
  enabled: boolean;
};

export function getWordPressConnection(): WordPressConnection {
  const baseUrl = process.env.WORDPRESS_API_BASE_URL?.replace(/\/$/, "");

  return {
    baseUrl,
    enabled: Boolean(baseUrl),
  };
}
