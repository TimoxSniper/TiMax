/**
 * Onboarding System Constants
 *
 * Tour step definitions and configuration.
 */

import type { TourStep } from './types';

/**
 * Tour steps configuration (German text)
 */
export const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    route: '/upload',
    tourParam: '1',
    targetSelector: 'upload-dropzone',
    title: 'Datei hochladen',
    description: 'Hier lädst du deine Audio- oder Videodateien hoch. Einfach reinziehen oder klicken. Unterstützt: MP4, MP3, WAV, M4A, WebM (bis 100 MB).',
    spotlightPosition: 'center',
    dialogPosition: 'bottom',
  },
  {
    step: 2,
    route: '/upload',
    tourParam: '2',
    targetSelector: 'workflow-section',
    title: 'Der Workflow',
    description: 'Nach dem Upload transkribiert die KI automatisch deine Datei. Das dauert je nach Länge wenige Minuten. Danach ist alles durchsuchbar.',
    spotlightPosition: 'center',
    dialogPosition: 'top',
  },
  {
    step: 3,
    route: '/uploads',
    tourParam: '3',
    targetSelector: 'uploads-list',
    title: 'Deine Uploads',
    description: 'Hier siehst du alle deine hochgeladenen Dateien, den Transkriptions-Status und kannst direkt ins Chat springen.',
    spotlightPosition: 'center',
    dialogPosition: 'top',
  },
  {
    step: 4,
    route: '/chat',
    tourParam: '4',
    targetSelector: 'chat-interface',
    title: 'Intelligenter Chat',
    description: 'Stelle Fragen zu deinen Inhalten. Die KI durchsucht alle Transkripte und antwortet mit Quellenangaben. Perfekt für schnelle Insights!',
    spotlightPosition: 'center',
    dialogPosition: 'top',
  },
];

/**
 * Total number of tour steps
 */
export const TOTAL_TOUR_STEPS = TOUR_STEPS.length;

/**
 * Time window for considering a user as "new" (24 hours in milliseconds)
 */
export const NEW_USER_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Query parameter name for tour step
 */
export const TOUR_QUERY_PARAM = 'tour';

/**
 * Workflow steps for Welcome Page (German text)
 */
export const WORKFLOW_STEPS = [
  {
    icon: 'Upload',
    title: '1. Upload',
    description: 'Lade Audio oder Video hoch',
  },
  {
    icon: 'Sparkles',
    title: '2. Transkription',
    description: 'KI wandelt automatisch in Text um',
  },
  {
    icon: 'MessageSquare',
    title: '3. Chat & Insights',
    description: 'Stelle Fragen, erhalte Antworten',
  },
] as const;
