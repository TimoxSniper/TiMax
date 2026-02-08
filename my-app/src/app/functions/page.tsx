import { Metadata } from 'next';
import { AnimatedSection } from '@/components/magic-ui/animated-section';
import { GlassCard } from '@/components/magic-ui/glass-card';

export const metadata: Metadata = {
  title: 'Funktionen | Timax',
  description: 'Entdecken Sie die leistungsstarken Funktionen von Timax für Ihre Audio- und Textverarbeitung.',
  alternates: {
    canonical: '/functions',
  },
};

export default function FunctionsPage() {
  const functions = [
    {
      title: 'Audio Upload',
      description: 'Laden Sie Ihre Audio-Dateien einfach hoch und verarbeiten Sie sie automatisch.',
      icon: '🎤',
    },
    {
      title: 'Text Generator',
      description: 'Erstellen Sie professionelle Texte aus Ihren Audioaufnahmen mit KI.',
      icon: '✍️',
    },
    {
      title: 'Suchfunktion',
      description: 'Suchen Sie in Ihren verarbeiteten Audiodaten nach spezifischen Inhalten.',
      icon: '🔍',
    },
    {
      title: 'Transkription',
      description: 'Erhalten Sie genaue Texttranskripte aus Ihren Audioaufnahmen.',
      icon: '📝',
    },
    {
      title: 'Summarisation',
      description: 'Erstellen Sie Kurzzusammenfassungen von langen Audiodateien.',
      icon: '📄',
    },
    {
      title: 'Speicherung',
      description: 'Speichern Sie Ihre verarbeiteten Dateien sicher in der Cloud.',
      icon: '💾',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">Timax Funktionen</h1>
          <p className="text-lg text-gray-400">
            Entdecken Sie die leistungsstarken Funktionen von Timax für Ihre Audio- und Textverarbeitung.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {functions.map((func, index) => (
          <AnimatedSection key={index} delay={index * 0.1}>
            <GlassCard className="p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="text-4xl mb-6">{func.icon}</div>
              <h3 className="text-xl font-semibold mb-4 text-white">{func.title}</h3>
              <p className="text-gray-400">{func.description}</p>
            </GlassCard>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection className="mt-16">
        <GlassCard className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-6">
            Probieren Sie Timax heute aus und entdecken Sie, wie einfach Audioverarbeitung sein kann.
          </p>
          <a
            href="/sign-up"
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
          >
            Jetzt anmelden
          </a>
        </GlassCard>
      </AnimatedSection>
    </div>
  );
}
