export default function sitemap() {
  const baseUrl = "https://chidchanun.online";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    }
  ];
}
