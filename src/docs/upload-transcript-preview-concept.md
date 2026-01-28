# Upload & Transkript-Vorschau

## Feature Name
Upload & Transkript-Vorschau

## Description
Nutzer können ein einzelnes Video oder Audio-File hochladen. Das Frontend sendet die Datei an einen n8n-Workflow, der automatisch ein Transkript generiert und zurückgibt. Der Nutzer sieht das Transkript direkt im Browser mit Zeitstempeln und kann es scrollen und lesen.

## User Value
Zeigt sofort den Kernnutzen der Plattform: Aus einem Video/Audio wird automatisch durchsuchbarer Text. Nutzer sehen direkt, dass ihre Inhalte strukturiert und nutzbar werden, ohne manuell transkribieren zu müssen. Legt die Basis für alle weiteren Features wie Highlighting oder Snippet-Generierung.

## Implementation Considerations
- **Frontend:** Upload-Komponente mit Drag & Drop, Progress-Indikator während der Verarbeitung, Transkript-Anzeige mit Zeitstempeln
- **Backend:** n8n-Workflow empfängt Upload, verarbeitet mit Transkriptions-Service (z.B. Whisper-Integration), gibt strukturiertes Transkript zurück
- **Keine Datenbank:** Transkript wird nur temporär im Browser angezeigt oder in n8n Memory/File-Node zwischengespeichert
- **API:** REST-Endpoint von n8n für Upload und Abfrage des Transkripts

## Out of Scope
- Persistente Speicherung der Transkripte in einer Datenbank
- Bearbeitung oder Korrektur des Transkripts
- Mehrere Dateien gleichzeitig hochladen
- Video-/Audio-Player mit synchronisiertem Transkript
- Export-Funktionen für das Transkript



