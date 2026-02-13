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
    title: 'Dateien hochladen',
    description: 'Ziehe deine Video- oder Audiodateien hier hinein oder klicke, um sie auszuwählen. TiMax unterstützt MP4, WebM, MP3, WAV und M4A Formate bis zu 100 MB.',
    spotlightPosition: 'center',
    dialogPosition: 'bottom',
  },
  {
    step: 2,
    route: '/upload',
    tourParam: '2',
    targetSelector: 'workflow-section',
    title: 'So funktioniert es',
    description: 'In drei einfachen Schritten verwandelt TiMax deine Medien in durchsuchbare Transkripte: Upload → KI-Transkription → Intelligenter Chat mit deinen Inhalten.',
    spotlightPosition: 'center',
    dialogPosition: 'top',
  },
  {
    step: 3,
    route: '/chat',
    tourParam: '3',
    targetSelector: 'chat-interface',
    title: 'Chatte mit deinen Inhalten',
    description: 'Stelle Fragen zu deinen hochgeladenen Dateien. Die KI durchsucht automatisch alle Transkripte und liefert präzise Antworten mit Quellenangaben.',
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
    title: 'Dateien hochladen',
    description: 'Lade deine Video- oder Audiodateien hoch. Unterstützt werden MP4, WebM, MP3, WAV und M4A bis zu 100 MB.',
  },
  {
    icon: 'Sparkles',
    title: 'KI-Transkription',
    description: 'Unsere KI transkribiert deine Inhalte automatisch und extrahiert wichtige Metadaten für optimale Durchsuchbarkeit.',
  },
  {
    icon: 'MessageSquare',
    title: 'Intelligenter Chat',
    description: 'Stelle Fragen zu deinen Inhalten. Die KI durchsucht alle Transkripte und liefert präzise Antworten mit Quellenangaben.',
  },
] as const;
