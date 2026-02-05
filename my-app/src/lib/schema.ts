const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timax.xyz';

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Organization" as const,
    name: "TiMax",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "TiMax ist eine KI-gestützte Plattform zur Transkription von Videos und Audios sowie zur automatischen Textgenerierung für Marketing-Teams.",
  };
}

export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "SoftwareApplication" as const,
    name: "TiMax",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    description: "KI-gestützte Plattform zur Transkription von Videos und Audios sowie zur automatischen Textgenerierung.",
    offers: {
      "@type": "Offer" as const,
      price: "0",
      priceCurrency: "EUR",
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "WebSite" as const,
    name: "TiMax",
    url: siteUrl,
    description: "Transformiere Videos und Audios in kraftvolle Texte mit KI-gestützter Transkription und intelligenter Textgenerierung.",
    inLanguage: "de-DE",
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${siteUrl}${item.url}` }),
    })),
  };
}

export function getWebPageSchema(page: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "WebPage" as const,
    name: page.name,
    description: page.description,
    url: `${siteUrl}${page.path}`,
    inLanguage: "de-DE",
    isPartOf: {
      "@type": "WebSite" as const,
      name: "TiMax",
      url: siteUrl,
    },
  };
}
