const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timax.xyz';

// ============================================
// ORGANIZATION & BASIC SCHEMAS
// ============================================

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Organization" as const,
    "@id": `${siteUrl}/#organization`,
    name: "TiMax",
    url: siteUrl,
    logo: {
      "@type": "ImageObject" as const,
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    description: "TiMax ist eine KI-gestützte Plattform zur Transkription von Videos und Audios sowie zur automatischen Textgenerierung für Marketing-Teams.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint" as const,
      contactType: "customer service",
      email: "info@timax.app",
      availableLanguage: ["German", "English"],
    },
  };
}

export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "SoftwareApplication" as const,
    "@id": `${siteUrl}/#application`,
    name: "TiMax",
    operatingSystem: "Web Browser",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Content Creation",
    description: "KI-gestützte Plattform zur Transkription von Videos und Audios sowie zur automatischen Textgenerierung für Marketing und Content Creation.",
    offers: {
      "@type": "Offer" as const,
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Automatische Video-Transkription",
      "Automatische Audio-Transkription",
      "KI-gestützte Textgenerierung",
      "Social Media Post Erstellung",
      "Blog-Artikel Generierung",
      "Newsletter Content",
      "Intelligente Inhaltsstrukturierung",
    ],
    screenshot: `${siteUrl}/opengraph-image`,
    softwareVersion: "1.0",
    aggregateRating: {
      "@type": "AggregateRating" as const,
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "WebSite" as const,
    "@id": `${siteUrl}/#website`,
    name: "TiMax",
    url: siteUrl,
    description: "Transformiere Videos und Audios in kraftvolle Texte mit KI-gestützter Transkription und intelligenter Textgenerierung.",
    inLanguage: "de-DE",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction" as const,
      target: {
        "@type": "EntryPoint" as const,
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ============================================
// PAGE & NAVIGATION SCHEMAS
// ============================================

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
    "@id": `${siteUrl}${page.path}/#webpage`,
    name: page.name,
    description: page.description,
    url: `${siteUrl}${page.path}`,
    inLanguage: "de-DE",
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@id": `${siteUrl}/#organization`,
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split('T')[0],
  };
}

// ============================================
// FAQ SCHEMA (for AI SEO)
// ============================================

export function getFAQSchema() {
  const faqs = [
    {
      question: "Was ist TiMax?",
      answer: "TiMax ist eine KI-gestützte Plattform, die Videos und Audios automatisch in Text transkribiert und daraus Marketing-Inhalte wie Social Media Posts, Blog-Artikel oder Newsletter generiert."
    },
    {
      question: "Welche Dateiformate werden unterstützt?",
      answer: "TiMax unterstützt die gängigsten Audio- und Videoformate: MP3, MP4, WAV, M4A und WebM. Die maximale Dateigröße beträgt 100MB pro Upload."
    },
    {
      question: "Wie funktioniert die Transkription?",
      answer: "TiMax verwendet die OpenAI Whisper API für hochpräzise automatische Spracherkennung. Einfach Datei hochladen und innerhalb weniger Minuten erhalten Sie ein vollständiges Transkript."
    },
    {
      question: "Welche Texte kann ich generieren?",
      answer: "Mit TiMax können Sie aus Ihren Transkripten verschiedene Textformate erstellen: Social Media Posts (LinkedIn, Instagram, Twitter/X), Blog-Artikel, Newsletter, Pressemitteilungen, Zusammenfassungen und mehr."
    },
    {
      question: "Ist TiMax DSGVO-konform?",
      answer: "Ja, TiMax ist vollständig DSGVO-konform. Alle Daten werden sicher verarbeitet, und Sie haben volle Kontrolle über Ihre Inhalte. Dateien werden nach 90 Tagen Inaktivität automatisch gelöscht."
    },
    {
      question: "In welcher Sprache funktioniert TiMax?",
      answer: "TiMax ist primär auf Deutsch ausgerichtet. Die Transkription unterstützt über 50 Sprachen, die Benutzeroberfläche und der KI-Dialog sind auf Deutsch optimiert."
    },
    {
      question: "Wie lange dauert eine Transkription?",
      answer: "Die Transkription dauert typischerweise 1-5 Minuten, abhängig von der Länge Ihrer Audio- oder Videodatei. Sie werden benachrichtigt, sobald das Transkript fertig ist."
    },
    {
      question: "Kann ich die generierten Texte kommerziell nutzen?",
      answer: "Ja, alle durch TiMax generierten Texte gehören Ihnen und können frei für kommerzielle Zwecke verwendet, verändert und veröffentlicht werden."
    },
  ];

  return {
    "@context": "https://schema.org" as const,
    "@type": "FAQPage" as const,
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqs.map(faq => ({
      "@type": "Question" as const,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: faq.answer,
      },
    })),
  };
}

// ============================================
// HOWTO SCHEMA (for Workflow)
// ============================================

export function getHowToSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "HowTo" as const,
    "@id": `${siteUrl}/#howto`,
    name: "Wie du mit TiMax Videos in Marketing-Texte verwandelst",
    description: "Schritt-für-Schritt Anleitung zur Verwendung von TiMax für die automatische Transkription und KI-gestützte Textgenerierung.",
    image: `${siteUrl}/opengraph-image`,
    totalTime: "PT10M",
    estimatedCost: {
      "@type": "MonetaryAmount" as const,
      currency: "EUR",
      value: "0",
    },
    supply: [
      {
        "@type": "HowToSupply" as const,
        name: "Video- oder Audiodatei",
      },
    ],
    tool: [
      {
        "@type": "HowToTool" as const,
        name: "TiMax Web-App",
      },
      {
        "@type": "HowToTool" as const,
        name: "Webbrowser",
      },
    ],
    step: [
      {
        "@type": "HowToStep" as const,
        position: 1,
        name: "Upload",
        text: "Lade deine Video- oder Audiodatei hoch. Unterstützte Formate: MP3, MP4, WAV, M4A, WebM (max. 100MB).",
        url: `${siteUrl}/upload`,
        image: `${siteUrl}/opengraph-image`,
      },
      {
        "@type": "HowToStep" as const,
        position: 2,
        name: "Automatische Transkription",
        text: "TiMax transkribiert deine Datei automatisch mit der OpenAI Whisper API. Das dauert nur wenige Minuten.",
        url: `${siteUrl}/upload`,
      },
      {
        "@type": "HowToStep" as const,
        position: 3,
        name: "Intelligente Strukturierung",
        text: "Dein Transkript wird automatisch strukturiert und in der Datenbank gespeichert für einfachen Zugriff.",
        url: `${siteUrl}/uploads`,
      },
      {
        "@type": "HowToStep" as const,
        position: 4,
        name: "Text generieren",
        text: "Nutze den KI-Chat um aus deinem Transkript verschiedene Textformate zu erstellen: Social Media Posts, Blog-Artikel, Newsletter und mehr.",
        url: `${siteUrl}/chat`,
      },
    ],
  };
}

// ============================================
// PRODUCT/SERVICE SCHEMA
// ============================================

export function getServiceSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Service" as const,
    "@id": `${siteUrl}/#service`,
    name: "TiMax Transkription & Textgenerierung",
    description: "Professionelle KI-gestützte Transkription von Videos und Audios mit automatischer Marketing-Textgenerierung.",
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
    serviceType: "AI Transcription and Content Generation",
    areaServed: {
      "@type": "Country" as const,
      name: "Germany",
    },
    availableChannel: {
      "@type": "ServiceChannel" as const,
      serviceUrl: siteUrl,
      serviceType: "Web Application",
    },
    offers: {
      "@type": "Offer" as const,
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: "2024-01-01",
    },
    termsOfService: `${siteUrl}/agb`,
    hasOfferCatalog: {
      "@type": "OfferCatalog" as const,
      name: "TiMax Services",
      itemListElement: [
        {
          "@type": "Offer" as const,
          itemOffered: {
            "@type": "Service" as const,
            name: "Video Transkription",
            description: "Automatische Transkription von Videodateien in Text",
          },
        },
        {
          "@type": "Offer" as const,
          itemOffered: {
            "@type": "Service" as const,
            name: "Audio Transkription",
            description: "Automatische Transkription von Audiodateien in Text",
          },
        },
        {
          "@type": "Offer" as const,
          itemOffered: {
            "@type": "Service" as const,
            name: "KI-Textgenerierung",
            description: "Automatische Generierung von Marketing-Texten aus Transkripten",
          },
        },
      ],
    },
  };
}

// ============================================
// ARTICLE SCHEMA (for Blog/Legal pages)
// ============================================

export function getArticleSchema(article: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Article" as const,
    "@id": `${siteUrl}${article.path}/#article`,
    headline: article.headline,
    description: article.description,
    url: `${siteUrl}${article.path}`,
    inLanguage: "de-DE",
    author: {
      "@id": `${siteUrl}/#organization`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    datePublished: article.datePublished || "2024-01-01",
    dateModified: article.dateModified || new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
      "@type": "WebPage" as const,
      "@id": `${siteUrl}${article.path}`,
    },
  };
}

// ============================================
// SPEAKABLE SCHEMA (for Voice Search/AI)
// ============================================

export function getSpeakableSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "WebPage" as const,
    "@id": `${siteUrl}/#speakable`,
    speakable: {
      "@type": "SpeakableSpecification" as const,
      cssSelector: ["h1", "h2", ".hero-text", ".feature-description"],
    },
    url: siteUrl,
  };
}

// ============================================
// COMBINED HOMEPAGE SCHEMA
// ============================================

export function getHomePageSchema() {
  return [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getSoftwareApplicationSchema(),
    getServiceSchema(),
    getFAQSchema(),
    getHowToSchema(),
    getSpeakableSchema(),
  ];
}

// ============================================
// LEGAL PAGE SCHEMAS
// ============================================

export function getLegalPageSchema(type: 'impressum' | 'datenschutz' | 'agb' | 'cookies' | 'widerruf') {
  const pages = {
    impressum: {
      name: "Impressum",
      headline: "Impressum",
      description: "Impressum und rechtliche Angaben zu TiMax gemäß § 5 TMG",
      path: "/impressum",
    },
    datenschutz: {
      name: "Datenschutzerklärung",
      headline: "Datenschutzerklärung",
      description: "Datenschutzerklärung von TiMax gemäß DSGVO",
      path: "/datenschutz",
    },
    agb: {
      name: "Allgemeine Geschäftsbedingungen",
      headline: "Allgemeine Geschäftsbedingungen",
      description: "AGB von TiMax für die Nutzung der Transkriptions- und Textgenerierungsplattform",
      path: "/agb",
    },
    cookies: {
      name: "Cookie-Richtlinie",
      headline: "Cookie-Richtlinie",
      description: "Cookie-Richtlinie von TiMax - Informationen über verwendete Cookies",
      path: "/cookies",
    },
    widerruf: {
      name: "Widerrufsbelehrung",
      headline: "Widerrufsbelehrung",
      description: "Widerrufsbelehrung für Verbraucher bei TiMax",
      path: "/widerruf",
    },
  };

  const page = pages[type];
  return [
    getWebPageSchema({ name: page.name, description: page.description, path: page.path }),
    getArticleSchema({ headline: page.headline, description: page.description, path: page.path }),
    getBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: page.name, url: page.path },
    ]),
  ];
}
