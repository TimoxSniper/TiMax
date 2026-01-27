/**
 * Text-Template-Definitionen für verschiedene Content-Formate
 * Stage 1: Nur Typen und Placeholder-Struktur
 */

export type FormatType = "instagram" | "twitter" | "blog" | "caption";

export interface FormatOption {
  id: FormatType;
  label: string;
  description: string;
  icon?: string;
}

export const formatOptions: FormatOption[] = [
  {
    id: "instagram",
    label: "Instagram Post",
    description: "Engaging post mit Hashtags (max. 2200 Zeichen)",
  },
  {
    id: "twitter",
    label: "Twitter Thread",
    description: "Thread mit mehreren Tweets (je max. 280 Zeichen)",
  },
  {
    id: "blog",
    label: "Blog-Absatz",
    description: "Strukturierter Artikel mit Überschriften",
  },
  {
    id: "caption",
    label: "Caption",
    description: "Kurze, fokussierte Caption mit CTA",
  },
];

/**
 * Template-Generierungs-Funktionen
 * Stage 2: Echte Template-Logik basierend auf Transkript-Input
 */

/**
 * Hilfsfunktion: Transkript in Sätze aufteilen
 */
function splitIntoSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Hilfsfunktion: Wichtige Keywords aus Transkript extrahieren
 */
function extractKeywords(text: string, maxKeywords: number = 5): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);
  
  const wordCount: Record<string, number> = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

/**
 * Hilfsfunktion: Text auf maximale Länge kürzen
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Hilfsfunktion: Text in Absätze aufteilen
 */
function splitIntoParagraphs(text: string, maxSentencesPerParagraph: number = 3): string[] {
  const sentences = splitIntoSentences(text);
  const paragraphs: string[] = [];
  
  for (let i = 0; i < sentences.length; i += maxSentencesPerParagraph) {
    paragraphs.push(sentences.slice(i, i + maxSentencesPerParagraph).join(". ") + ".");
  }
  
  return paragraphs;
}

export function generateInstagramPost(transcript: string): string {
  if (!transcript || transcript.trim().length === 0) {
    return "Bitte wähle ein gültiges Transkript aus.";
  }

  const sentences = splitIntoSentences(transcript);
  const keywords = extractKeywords(transcript, 8);
  
  // Ersten 2-3 Sätze als Hook verwenden
  const hook = sentences.slice(0, 3).join(" ");
  
  // Hauptinhalt: Wichtige Punkte extrahieren
  const mainContent = sentences.slice(3, 8).join(" ");
  
  // Hashtags generieren
  const hashtags = keywords
    .map((k) => `#${k.replace(/\s+/g, "")}`)
    .slice(0, 6)
    .join(" ");

  let post = `🎯 ${hook}\n\n`;
  
  if (mainContent) {
    post += `💡 ${mainContent}\n\n`;
  }
  
  // Call-to-Action
  post += `✨ Der Schlüssel: Finde DEINEN eigenen Weg!\n\n`;
  
  // Hashtags
  post += hashtags;

  // Auf max. 2200 Zeichen begrenzen
  return truncateText(post, 2200);
}

export function generateTwitterThread(transcript: string): string {
  if (!transcript || transcript.trim().length === 0) {
    return "Bitte wähle ein gültiges Transkript aus.";
  }

  const sentences = splitIntoSentences(transcript);
  const paragraphs = splitIntoParagraphs(transcript, 2);
  
  // Thread aufbauen: Jeder Tweet max. 280 Zeichen
  const tweets: string[] = [];
  const maxTweetLength = 270; // Platz für "1/6 " etc.
  
  // Erster Tweet: Hook
  if (sentences.length > 0) {
    const firstTweet = `🧵 ${sentences[0]}`;
    tweets.push(truncateText(firstTweet, maxTweetLength));
  }
  
  // Weitere Tweets aus Absätzen
  paragraphs.slice(1, 6).forEach((para, index) => {
    const tweetNum = index + 2;
    const tweet = `${tweetNum}/${paragraphs.length + 1} ${para}`;
    tweets.push(truncateText(tweet, maxTweetLength));
  });
  
  // Letzter Tweet: CTA
  const lastTweet = `${tweets.length + 1}/${tweets.length + 1} ✨ Mein Tipp: Probiere verschiedene Ansätze aus und finde heraus, was für dich funktioniert!`;
  tweets.push(truncateText(lastTweet, maxTweetLength));
  
  // Tweet-Nummern aktualisieren
  return tweets
    .map((tweet, index) => {
      const num = index + 1;
      const total = tweets.length;
      return tweet.replace(/^\d+\/\d+/, `${num}/${total}`);
    })
    .join("\n\n");
}

export function generateBlogPost(transcript: string): string {
  if (!transcript || transcript.trim().length === 0) {
    return "Bitte wähle ein gültiges Transkript aus.";
  }

  const sentences = splitIntoSentences(transcript);
  const paragraphs = splitIntoParagraphs(transcript, 3);
  
  // Titel aus erstem Satz extrahieren
  const title = sentences[0] || "Aus dem Transkript";
  
  let blog = `## ${title}\n\n`;
  
  // Abschnitte mit Überschriften
  paragraphs.forEach((para, index) => {
    if (index === 0) {
      blog += `${para}\n\n`;
    } else if (index === 1) {
      blog += `### Wichtige Erkenntnisse\n\n${para}\n\n`;
    } else if (index === 2) {
      blog += `### Praktische Anwendung\n\n${para}\n\n`;
    } else {
      blog += `${para}\n\n`;
    }
  });
  
  // Fazit
  if (sentences.length > 5) {
    const conclusion = sentences.slice(-2).join(" ");
    blog += `### Fazit\n\n${conclusion}`;
  }
  
  return blog.trim();
}

export function generateCaption(transcript: string): string {
  if (!transcript || transcript.trim().length === 0) {
    return "Bitte wähle ein gültiges Transkript aus.";
  }

  const sentences = splitIntoSentences(transcript);
  const keywords = extractKeywords(transcript, 3);
  
  // Ersten 1-2 Sätze als Hauptinhalt
  const mainText = sentences.slice(0, 2).join(" ");
  
  // Kürzen auf ca. 150 Zeichen für Caption
  let caption = `🎯 ${truncateText(mainText, 120)}\n\n`;
  
  // Call-to-Action
  caption += `✨ Finde DEINEN Weg!\n\n`;
  caption += `👉 Was funktioniert bei dir am besten?`;
  
  return truncateText(caption, 300);
}

/**
 * Haupt-Generator-Funktion
 */
export function generateText(format: FormatType, transcript: string): string {
  switch (format) {
    case "instagram":
      return generateInstagramPost(transcript);
    case "twitter":
      return generateTwitterThread(transcript);
    case "blog":
      return generateBlogPost(transcript);
    case "caption":
      return generateCaption(transcript);
    default:
      return "";
  }
}

