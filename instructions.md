## Specifica Tecnica per lo Sviluppo (React + Vite)

Questo documento contiene le linee guida, le specifiche di design e i requisiti tecnici per lo sviluppo del sito web aziendale. Il design deve essere minimale, elegante, altamente performante e giocare sul contrasto tra un'apertura scura (Hero) e una transizione fluida verso sfondi chiari.

---

## 1. Stack Tecnologico & Setup
* **Framework:** React (con Vite come build tool)
* **Styling:** Tailwind CSS (per layout responsive e utility class)
* **Animazioni:** GSAP (GreenSock Animation Platform) + `ScrollTrigger` per le transizioni a scorrimento + `GSAP Flip` per la transizione della bottiglia.
* **Wrapper React:** `@gsap/react` (utilizzo dell'hook `useGSAP` per una gestione pulita del ciclo di vita dei componenti).
* **Icone:** Lucide React (per l'hamburger menu e icone social)

---

## 2. Identità Visiva & Palette Colori
I colori ufficiali del brand devono essere configurati all'interno di Tailwind (`tailwind.config.js`) utilizzando i codici esadecimali ufficiali estratti dal manuale di brand identity:

| Colore | Codice HEX | Utilizzo Principale | Fonte Manuale |
| :--- | :--- | :--- | :--- |
| **Nero Antracite** | `#1D1D1B` | Sfondo Hero, Testi su fondo chiaro, Elementi Dark | Logo_7 FONTANE_completo.jpg |
| **Marrone Scuro** | `#634E42` | Dettagli, overlay, loghi secondari | Logo_7 FONTANE_completo.jpg |
| **Fango Dorato / Tortora** | `#A48A7B` | Sfondo chiaro sezioni, accenti eleganti | Logo_7 FONTANE_completo.jpg |
| **Bianco Puro / Off-White**| `#FFFFFF` o `#FDFDFD` | Testi su Hero scura, sfondi alternati | structure.md |

### Tipografia Fluida
I font e i titoli devono adattarsi dinamicamente alla larghezza dello schermo senza continui break-point. Utilizzare le funzioni CSS `clamp()` o le utility relative di Tailwind per una gestione fluida delle dimensioni (es. `text-[clamp(2rem,5vw,4rem)]`).

---

## 3. Requisiti di Responsività (Mobile-First)
Il sito deve essere progettato seguendo un approccio **Mobile-First**. L'esperienza d'uso su smartphone deve essere fluida e priva di bug grafici o sovrapposizioni, mantenendo la stessa eleganza della versione desktop.

* **Layout Adattivi:** Tutte le griglie a due colonne devono collassare a una singola colonna sui dispositivi mobili (`grid-cols-1 md:grid-cols-2`).
* **Navigazione Mobile:** La Navbar su mobile mostrerà esclusivamente il logo a sinistra e l'hamburger menu a destra. Al click sull'hamburger, una sidebar a schermo intero o a comparsa laterale (slide-in) gestirà i link di navigazione.
* **Gestione Touch:** Tutte le interazioni e le animazioni basate su scroll o click devono essere ottimizzate per i gesti touch, evitando blocchi improvvisi della pagina.
* **Immagini e Asset:** Le immagini pesanti delle bottiglie e i background panoramici devono utilizzare il lazy loading e, dove possibile, il tag `<picture>` con sorgenti ottimizzate o formati leggeri (WebP) per non gravare sulle reti mobili.

---

## 4. Struttura dei Componenti e Sezioni (App.jsx)

I contenuti testuali del sito non devono essere scritti direttamente nei componenti, ma importati da un file di configurazione centralizzato (es. `src/data/content.js`) per facilitare la successiva sostituzione dei placeholder.

### 4.1. Navbar
* **Posizione:** `fixed`, in alto, `z-50`, con sfondo trasparente o leggero blur (`backdrop-blur`).
* **Contenuto Sinistra:** Logo vettoriale (SVG) "Sette Fontane" e nome affiancati.
* **Contenuto Destra:** Menu ad hamburger che triggera la sidebar.

### 4.2. Hero Section
* **Stile:** Sfondo scuro (`#1D1D1B`), fullscreen (`min-h-screen`), flex-center.
* **Elementi in sovraimpressione:** Logo "Sette Fontane" centrale e nome del brand con tipografia elegante.
* **Comportamento allo Scroll:** Tramite GSAP `ScrollTrigger`, la sezione Hero sfuma lasciando spazio a un background chiaro (`#A48A7B` o bianco), modificando di conseguenza il colore dei testi da chiaro a scuro (`#1D1D1B`).

### 4.3. Sezione "L'azienda"
* **Layout:** Responsive. Mobile: 1 colonna (testo sopra, immagine sotto). Desktop: 2 colonne (testo a sinistra, immagine a destra).
* **Call to Action:** Pulsante "Scopri l'azienda".

### 4.4. Sezione "Chi siamo"
* **Layout:** Griglia a due colonne simmetriche (`grid-cols-1 lg:grid-cols-2`).
    * *Colonna 1 (Davide):* Immagine verticale + testo descrittivo breve placeholder subito sotto la foto.
    * *Colonna 2 (Andrea):* Immagine verticale + testo descrittivo breve placeholder subito sotto la foto.
* **Call to Action:** Pulsante "Conoscici".

### 4.5. Sezione "Il territorio"
* **Layout:** Immagine panoramica ad ampio respiro (`w-full`, adatta a contenere una vista del territorio).
* **Contenuto:** Breve descrizione placeholder sovrapposta o adiacente.
* **Call to Action:** Pulsante "Scopri il territorio".

### 4.6. Showcase "La nostra Cantina" -> Sezione "San Florian"
* **Layout:** Mobile: 1 colonna centrale con testo e immagine allineati verticalmente. Desktop: Testo a sinistra e contenitore della bottiglia a destra.
* **Asset:** Immagine della bottiglia (selezionabile tra il formato Renana 0.75L e Magnum 1.5L) dotata dell'etichetta verticale caratteristica "SAN FLORIAN".
* **Call to Action:** Pulsante "Assapora San Florian".

---

## 5. Specifica Animazione "San Florian" (Flicker-Free con GSAP Flip)

Al click sul pulsante **"Assapora San Florian"**, deve attivarsi una transizione fluida e immersiva:

1.  **Lock dello Scroll:** Lo scorrimento della pagina viene disattivato temporaneamente per preservare il focus.
2.  **Transizione dell'elemento (GSAP Flip):** L'immagine della bottiglia si stacca dal suo contenitore nel flusso del layout e transisce in modo fluido verso il centro dello schermo, ingrandendosi (zoom armonico) a tutto schermo. Questo previene qualsiasi "jump" o scatto del layout sia su desktop che su mobile.
3.  **Ottimizzazione Hardware:** Applicare la proprietà CSS `will-change: transform, opacity` sulla bottiglia per forzare l'accelerazione della GPU ed evitare micro-scatti.
4.  **Cambio di Stato dei Contenuti:** Lo sfondo vira verso una tonalità scura ed elegante, i vecchi testi sfumano a zero opacità e compaiono in modalità *fade-in* i dettagli della pagina dedicata (note di degustazione, scheda tecnica, selettore formato).

---

## 6. Sezioni Finali
* **Sezione "Coming Soon":** Spazio minimale per futuri prodotti o aggiornamenti della cantina.
* **Footer:** Contatti aziendali, icone social, copyright e note legali su fondo scuro (`#1D1D1B`).

---

## Instructions for Claude Code:
1.  Initialize a clean Vite + React + Tailwind project.
2.  Setup the configuration file for Tailwind with the custom colors and a Mobile-First layout configuration.
3.  Use `@gsap/react` and the `useGSAP` hook for all animations to ensure flicker-free rendering.
4.  Implement `gsap/Flip` for the "San Florian" bottle transition to guarantee structural smoothness on both desktop and mobile screens.
5.  Extract all layout copy into a clean, standalone configuration file (`src/data/content.js`).
6.  Ensure full responsive testing on standard breakpoints (`sm`, `md`, `lg`, `xl`).