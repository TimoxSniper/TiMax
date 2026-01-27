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
 * Stage 1: Geben nur Placeholder-Text zurück
 * Stage 2: Echte Template-Logik implementieren
 */

export function generateInstagramPost(transcript: string): string {
  return `🎯 Produktivität im digitalen Zeitalter

In der heutigen Zeit werden wir täglich von hunderten Nachrichten und Benachrichtigungen überflutet. Die ständige Erreichbarkeit kann Fluch und Segen zugleich sein.

💡 Mein Tipp: Die Pomodoro-Technik
→ 25 Minuten fokussierte Arbeit
→ Kurze Pausen einbauen
→ Alle Ablenkungen eliminieren

Die Trennung verschiedener Tools für verschiedene Aufgaben hilft dem Gehirn, in den richtigen Modus zu wechseln. Kreative Arbeit braucht andere Programme als administrative Tätigkeiten.

✨ Der Schlüssel: Finde DEINEN eigenen Weg!

Produktivität ist keine Einheitslösung, sondern ein individueller Prozess. Probiere verschiedene Methoden aus und entdecke, was für dich funktioniert.

#Produktivität #TimeManagement #PomodoroTechnik #DigitalWellbeing #WorkLifeBalance #Fokus #Effizienz #Selbstmanagement #Podcast`;
}

export function generateTwitterThread(transcript: string): string {
  return `🧵 Thread über Produktivität im digitalen Zeitalter

1/6 Wir werden täglich von hunderten Nachrichten überflutet. Ständige Erreichbarkeit = Fluch & Segen zugleich. Wie bleiben wir fokussiert? 🎯

2/6 Nach Jahren des Experimentierens: Es gibt keine universelle Lösung. Jeder arbeitet anders, hat andere Prioritäten. Der Schlüssel? Deinen eigenen Weg finden! 💡

3/6 Was bei mir funktioniert: Die Pomodoro-Technik
• 25 Min fokussierte Arbeit
• Kurze Pausen
• Null Ablenkungen
Diese Intervalle helfen enorm beim Fokussieren ⏱️

4/6 Digitale Umgebung bewusst gestalten: Verschiedene Tools für verschiedene Aufgaben nutzen. Kreative Arbeit ≠ Admin-Tätigkeiten. Diese Trennung hilft dem Gehirn beim Mode-Wechsel 🧠

5/6 Produktivität ist kein Hack, sondern ein individueller Prozess. Was für andere funktioniert, muss nicht für dich passen. 

6/6 Mein Tipp: Probiere verschiedene Ansätze aus. Experimentiere. Reflektiere. Finde heraus, was DICH produktiver macht! ✨`;
}

export function generateBlogPost(transcript: string): string {
  return `## Produktivität im digitalen Zeitalter: Ein individueller Prozess

### Die Herausforderung der ständigen Erreichbarkeit

Wir leben in einer Zeit, in der uns täglich hunderte von Nachrichten, E-Mails und Benachrichtigungen erreichen. Die ständige Erreichbarkeit kann sowohl Fluch als auch Segen sein. Einerseits ermöglicht sie uns, flexibel zu arbeiten und schnell auf Anfragen zu reagieren. Andererseits führt sie oft dazu, dass wir uns überwältigt fühlen und Schwierigkeiten haben, uns auf das Wesentliche zu konzentrieren.

### Der Weg zur persönlichen Produktivitätsstrategie

In den letzten Jahren habe ich verschiedene Methoden und Tools ausprobiert, um meine Produktivität zu steigern. Die wichtigste Erkenntnis: Es gibt keine universelle Lösung. Jeder Mensch arbeitet anders, hat unterschiedliche Prioritäten und muss seinen eigenen Weg finden.

### Die Pomodoro-Technik: Fokus durch Intervalle

Eine Strategie, die sich als besonders effektiv erwiesen hat, ist die Pomodoro-Technik. Dabei arbeitet man in 25-Minuten-Intervallen, gefolgt von einer kurzen Pause. Diese Methode hilft dabei, fokussiert zu bleiben und gleichzeitig regelmäßige Erholungsphasen einzubauen.

Der Schlüssel liegt darin, während dieser 25 Minuten wirklich alle Ablenkungen zu eliminieren – keine E-Mails, keine Social Media, keine Benachrichtigungen.

### Digitale Umgebung bewusst gestalten

Ein weiterer wichtiger Aspekt ist die bewusste Gestaltung unserer digitalen Umgebung. Es ist enorm hilfreich, verschiedene Tools für verschiedene Aufgaben zu nutzen. Für kreative Arbeit verwende ich andere Programme als für administrative Tätigkeiten. Diese Trennung hilft dem Gehirn, in den richtigen Modus zu wechseln.

### Fazit: Experimentieren und individualisieren

Produktivität ist keine Einheitslösung, sondern ein individueller Prozess. Probieren Sie verschiedene Ansätze aus und finden Sie heraus, was für Sie am besten funktioniert.`;
}

export function generateCaption(transcript: string): string {
  return `🎯 Produktivität = individueller Prozess

Keine Einheitslösung! Die Pomodoro-Technik mit 25-Min-Intervallen hilft mir enorm beim Fokussieren. Verschiedene Tools für verschiedene Aufgaben nutzen – das macht den Unterschied.

✨ Finde DEINEN Weg zur Produktivität!

👉 Welche Methode funktioniert bei dir am besten?`;
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

