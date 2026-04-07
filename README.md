# Join IHK: Dateiupload

Diese README beschreibt nur die IHK-Pruefungsleistung zum Thema Dateiupload im Join-Projekt. Sie ist auf die Checkliste aus `assets/Checkliste - Dateiupload Join.pdf` zugeschnitten und dokumentiert die dafuer umgesetzten Funktionen.

## Ziel der Pruefungsleistung

Im Add-Task- und Edit-Task-Bereich koennen Bilder zu einem Task hochgeladen werden. Die Dateien werden pro Task als Array im Base64-Format gespeichert und koennen in der Task-Detailansicht wieder angezeigt, durchsucht und heruntergeladen werden.

## Abdeckung der IHK-Checkliste

### 1. Allgemeines

- Die Dateiupload-Logik ist in eigene Module ausgelagert.
- Die Upload-, Verarbeitungs-, Validierungs- und Viewer-Logik ist durch JSDoc-Kommentare dokumentiert.
- Bilder koennen sowohl beim Erstellen als auch beim Bearbeiten eines Tasks hinzugefuegt werden.
- Ein Klick auf ein Vorschaubild oeffnet den Imageviewer.

### 2. Task hinzufuegen und anzeigen

- Der Dateipicker ist in das Task-Formular integriert.
- Mehrere Bilder koennen in einem Vorgang ausgewaehlt werden.
- Ausgewaehlte Dateien werden direkt als Vorschau im Formular angezeigt.
- Gespeicherte Dateien werden in der Task-Detailansicht mit Vorschaubild, Dateityp und Dateigroesse dargestellt.

### 3. Sicherheit

- Der Datei-Input erlaubt nur `image/jpeg`, `image/png` und `image/webp`.
- Die Dateitypen werden zusaetzlich per JavaScript validiert.
- Bei Ueberschreitung des Upload-Limits wird eine Fehlermeldung ausgegeben.
- Der Upload ist auf Bilder fokussiert, wie in der Checkliste empfohlen.

### 4. Bildverarbeitung und Anzeige

- Bilder werden nach dem Upload automatisch verarbeitet.
- Die maximale Kantenlaenge wird auf `800px` begrenzt.
- JPG-Bilder werden mit einer Qualitaet von `0.82`, WEBP mit `0.8` gespeichert.
- In Add-Task, Edit-Task und der Ticketansicht werden Vorschaubilder erzeugt und angezeigt.
- Der Imageviewer erlaubt das Oeffnen einzelner Bilder, Vor- und Zurueckblaettern zwischen mehreren Dateien sowie das Schliessen per UI und Tastatur.
- Im Viewer und in der Ticketansicht steht eine Download-Funktion zur Verfuegung.

### 5. Bildgroesse

- Die Gesamtgroesse aller Bilder eines Tasks ist auf `1 MB` begrenzt.
- Die Begrenzung wird sowohl waehrend der Auswahl als auch vor dem finalen Speichern geprueft.

### 6. UX

- Die Upload-Oberflaeche ist in die bestehende responsive Join-UI eingebettet.
- Es gibt klare Fehlermeldungen bei ungueltigen Dateiformaten oder zu grossen Uploads.
- Vorschaubilder, Buttons und Viewer-Elemente sind mit ARIA-Labels versehen und ueber die Tastatur nutzbar.

### 7. Code Quality

- Die Umsetzung ist modular in `shared`, `form` und `viewer` aufgeteilt.
- Die zentrale Dateiupload-Logik ist von der allgemeinen Task-Logik getrennt.
- Wiederverwendbare Verarbeitungsschritte wie Validierung, Komprimierung und Serialisierung sind in eigene Dateien ausgelagert.

## Technische Umsetzung

### Upload und Vorschau

Im Task-Formular koennen mehrere Bilder ausgewaehlt werden. Vor dem Speichern werden die Dateien geprueft, verarbeitet und als Vorschaueintraege im Formular dargestellt.

### Verarbeitung

Nach der Auswahl werden Bilder ueber ein Canvas neu gerendert. Dabei werden:

- nur erlaubte Bildtypen akzeptiert,
- grosse Bilder auf maximal `800px` skaliert,
- optimierte Ausgabeformate und Qualitaetswerte verwendet,
- Duplikate innerhalb der aktuellen Auswahl abgefangen.

### Speicherung

Die verarbeiteten Bilder werden als Objekte mit Metadaten gespeichert:

- Dateiname
- MIME-Type
- Dateigroesse
- Breite
- Hoehe
- Base64-Daten

Die Task-Daten werden ueber Firebase Realtime Database persistiert.

### Anzeige und Download

In der Detailansicht eines Tasks werden alle gespeicherten Bilder mit Metadaten angezeigt. Ein Klick auf ein Bild oeffnet den Viewer. Dort sind Navigation zwischen mehreren Bildern und der Download der aktuellen Datei moeglich.

## Relevante Dateien

- `js/features/task-files/shared/task-file-config.js`
- `js/features/task-files/shared/task-file-validation.js`
- `js/features/task-files/shared/task-file-processing.js`
- `js/features/task-files/shared/task-file-serialization.js`
- `js/features/task-files/form/task-file-preview.js`
- `js/features/task-files/viewer/task-file-image-viewer.js`
- `js/features/task-files/viewer/task-file-detail-section.js`
- `js/features/board/add-task-form-submit.js`
- `js/templates/add-task-templates.js`
- `css/components/task-files/file-upload.css`
- `css/components/task-files/file-viewer.css`
- `css/components/task-files/file-detail.css`

## Projekt lokal starten

Das Projekt ist ein statisches Frontend und kann z. B. mit Live Server oder einem einfachen lokalen Webserver gestartet werden. Der Einstiegspunkt fuer den Login ist:

- `index.html`

## Hinweis

Diese README ist bewusst keine allgemeine Projektdokumentation, sondern eine kurze fachliche Beschreibung der IHK-Pruefungsleistung fuer die Dateiupload-Checkliste.
