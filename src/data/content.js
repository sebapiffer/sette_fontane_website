// Contenuti del sito — sostituire i testi segnalati come [placeholder]
// prima della pubblicazione. La struttura non va modificata.

export const site = {
  name: 'Sette Fontane',
  nameParts: ['Sette', 'Fontane'],
  domain: 'settefontanewinery.com',
  location: 'Giovo · Val di Cembra · Trentino',
}

// Voci del menu: tutte puntano a una sezione della home (`href`), anche
// quelle che hanno una pagina di approfondimento — a quelle ci si arriva dai
// pulsanti dentro le sezioni, non dal menu. La sola `to` è la Home stessa.
// Dalle sottopagine la Navbar antepone "/" all'ancora e ScrollToTop porta
// alla sezione dopo il cambio rotta.
export const nav = {
  links: [
    { label: 'Home', to: '/' },
    { label: "L'azienda", href: '#azienda' },
    { label: 'Chi siamo', href: '#chi-siamo' },
    { label: 'Il territorio', href: '#territorio' },
    { label: 'San Florian', href: '#san-florian' },
    { label: 'Contatti', href: '#contatti' },
  ],
}

export const hero = {
  eyebrow: 'Maso e cantina biologica',
  location: 'Giovo · Val di Cembra',
  scrollHint: 'Scorri',
  // [placeholder] sostituire con il video definitivo (stesso percorso o
  // aggiornare src). Consigliato: mp4 H.264, 1080p, < 8 MB, senza audio.
  video: {
    src: '/video/hero-placeholder.mp4',
  },
}

export const azienda = {
  id: 'azienda',
  eyebrow: 'Il maso',
  title: 'La terra che nostro nonno coltivava con cura',
  paragraphs: [
    'Sotto i filari della storica pergola trentina, tra le vigne di Maso Sette Fontane a Giovo, siamo cresciuti inseguendo l’estate. È lì, tra profumi di mosto e mani segnate dal lavoro, che è nata la nostra passione — ed è da lì che abbiamo scelto di ripartire.',
    'Oggi custodiamo quella storia con un’agricoltura interamente biologica, perché crediamo in una terra da ascoltare, rispettare e lasciare più viva di come l’abbiamo trovata.',
  ],
  cta: "Scopri l'azienda",
  image: {
    src: 'https://picsum.photos/seed/pergola/960/1200',
    alt: 'Filari a pergola trentina del maso [placeholder]',
  },
  // Sfondo di sezione: foto ampia e poco leggibile in dettaglio (una vigna in
  // campo lungo), non un soggetto — sta sotto un velo di creta e serve come
  // profondità, non come informazione. Vedi SfondoSezione.
  background: {
    src: '/img/sfondo-vigna-filari.webp',
    // [placeholder] campo lungo dei filari del maso — immagine segnaposto (vigna
    // di repertorio), da sostituire con una foto reale del maso
  },
}

export const chiSiamo = {
  id: 'chi-siamo',
  eyebrow: 'Chi siamo',
  title: 'Due fratelli, una vigna',
  people: [
    {
      name: 'Davide',
      role: 'Vigna e campagna',
      bio: 'Cresciuto tra i filari del maso, segue la vigna in ogni stagione: potatura, palco verde, vendemmia. [Testo placeholder da sostituire.]',
      image: {
        src: 'https://picsum.photos/seed/davide/720/960',
        alt: 'Ritratto di Davide [placeholder]',
      },
    },
    {
      name: 'Andrea',
      role: 'Cantina e progetto',
      bio: 'Dalla pressa alla bottiglia, cura la cantina e l’anima del progetto Sette Fontane. [Testo placeholder da sostituire.]',
      image: {
        src: 'https://picsum.photos/seed/andrea/720/960',
        alt: 'Ritratto di Andrea [placeholder]',
      },
    },
  ],
  cta: 'Conoscici',
  background: {
    src: '/img/sfondo-vigna-strada.webp',
    // [placeholder] vigna al crepuscolo, tonalità scure — segnaposto (strada tra
    // le viti, cielo carico), da sostituire con una foto reale
  },
}

export const territorio = {
  id: 'territorio',
  eyebrow: 'Il territorio',
  title: 'Giovo, Val di Cembra',
  text: 'Pendii ripidi, terrazzamenti di porfido e un’escursione termica che firma i profumi del vino. Qui il Müller Thurgau ha trovato la sua casa di montagna. [Testo placeholder da sostituire.]',
  cta: 'Scopri il territorio',
  // La figura resta la "finestra sul paesaggio" (rettangolare, mai ad arco):
  // qui però mostra un dettaglio — i terrazzamenti in porfido — perché il
  // panorama d'insieme è passato a fare da sfondo all'intera sezione.
  image: {
    src: 'https://picsum.photos/seed/porfido/1200/1500',
    alt: 'Terrazzamenti e muretti a secco in porfido [placeholder]',
  },
  background: {
    src: '/img/sfondo-vigna-monti.webp',
    // [placeholder] panorama della Val di Cembra — segnaposto (vigna, prato e
    // monti), da sostituire con una foto reale della valle
  },
}

// Fascia-separatore che apre il capitolo dei vini: lunga, bassa, a tutta
// larghezza. Il titolo è spezzato in due per far entrare il logo a gocce nel
// mezzo — vedi IntroVini.
export const vini = {
  id: 'la-nostra-cantina',
  title: 'La nostra cantina',
  titleParts: ['La nostra', 'cantina'],
}

export const sanFlorian = {
  id: 'san-florian',
  eyebrow: 'La nostra cantina',
  title: 'San Florian',
  denominazione: 'Müller Thurgau DOCG',
  intro:
    'Il nostro primo vino porta il nome della chiesa che veglia sulle vigne di Giovo. Questa bottiglia racconta il nostro Trentino: la memoria di una tradizione antica e il coraggio di una nuova generazione che guarda lontano.',
  cta: 'Assapora San Florian',
  background: {
    src: '/img/sfondo-vigna-terrazze.webp',
    // [placeholder] terrazzamenti vitati: sta sotto un velo antracite —
    // segnaposto, da sostituire con una foto reale
  },
  formats: [
    {
      id: 'renana',
      label: 'Renana',
      volume: '0,75 L',
      image: '/img/san-florian-renana.webp',
    },
    {
      id: 'magnum',
      label: 'Magnum',
      volume: '1,5 L',
      image: '/img/san-florian-magnum.webp',
    },
  ],
  degustazione: {
    titolo: 'Note di degustazione',
    testo:
      'Naso aromatico di fiori bianchi, salvia e mela verde; sorso teso, sapido, di montagna. [Testo placeholder da sostituire.]',
  },
  scheda: [
    { label: 'Uvaggio', value: 'Müller Thurgau 100%' },
    { label: 'Zona', value: 'Giovo, Val di Cembra' },
    { label: 'Suolo', value: 'Porfido [placeholder]' },
    { label: 'Affinamento', value: 'Acciaio, sui lieviti [placeholder]' },
    { label: 'Alcol', value: '12,5% vol. [placeholder]' },
    { label: 'Servizio', value: '8–10 °C' },
  ],
  chiudi: 'Torna alla cantina',
}

export const scopriAziendaPage = {
  eyebrow: "L'azienda",
  title: 'La storia di Maso Sette Fontane [placeholder]',
  // Sfondi fotografici di sezione (segnaposto, vigne di repertorio — vedi
  // SfondoSezione): sotto un velo tarato sul testo, servono da profondità.
  background: {
    src: '/img/sfondo-vigna-cielo.webp',
    // [placeholder] filari e cielo aperto — da sostituire con una foto del maso
  },
  blocchiBackground: {
    src: '/img/sfondo-vigna-nebbia.webp',
    // [placeholder] collina vitata nella foschia — da sostituire con una foto reale
  },
  intro: [
    'Testo placeholder: qui troverà spazio il racconto disteso del maso, della sua conduzione biologica e della filosofia che guida il lavoro in vigna. [Testo placeholder da sostituire.]',
    'Testo placeholder: un secondo paragrafo di approfondimento, con i dettagli che non trovano posto nella sintesi della home. [Testo placeholder da sostituire.]',
  ],
  // Foto di gruppo: apre la pagina sotto il titolo, formato panoramico
  // (non full-bleed), didascalia sotto.
  gruppo: {
    src: 'https://picsum.photos/seed/maso-gruppo/1800/1100',
    alt: 'Foto di gruppo della famiglia e delle persone del maso [placeholder]',
    caption: 'Le persone di Maso Sette Fontane [didascalia placeholder]',
  },
  timelineEyebrow: 'La nostra storia',
  timelineTitle: 'Una storia per tappe [placeholder]',
  timeline: [
    { anno: '19xx [placeholder]', titolo: 'Le origini [placeholder]', testo: 'Testo placeholder da sostituire con il primo capitolo della storia del maso.' },
    { anno: '19xx [placeholder]', titolo: 'La pergola trentina [placeholder]', testo: 'Testo placeholder da sostituire: l’impianto dei filari storici e i primi anni di conduzione familiare.' },
    { anno: '20xx [placeholder]', titolo: 'La conversione biologica [placeholder]', testo: 'Testo placeholder da sostituire: la scelta di un’agricoltura interamente biologica.' },
    { anno: '20xx [placeholder]', titolo: 'San Florian [placeholder]', testo: 'Testo placeholder da sostituire: la nascita del primo vino a portare il nome della chiesa di Giovo.' },
    { anno: 'Oggi [placeholder]', titolo: 'Il progetto continua [placeholder]', testo: 'Testo placeholder da sostituire con lo stato attuale del progetto e le prospettive future.' },
  ],
  // Blocchi alternati testo/immagine sotto la timeline: l'ordine visivo si
  // inverte a blocchi pari (immagine a sinistra) — vedi ScopriAzienda.
  blocchi: [
    {
      eyebrow: 'La filosofia [placeholder]',
      titolo: 'Lavorare assecondando la vigna [placeholder]',
      testo: [
        'Testo placeholder: il primo paragrafo racconta l’approccio al lavoro in vigna, fatto di interventi minimi e di osservazione costante delle piante e del suolo. [Testo placeholder da sostituire.]',
        'Testo placeholder: il secondo paragrafo entra nel merito delle pratiche biologiche adottate e del perché siano una scelta identitaria, non una certificazione da esibire. [Testo placeholder da sostituire.]',
        'Testo placeholder: il terzo paragrafo chiude sul rapporto tra il tempo della vigna e il tempo del lavoro quotidiano. [Testo placeholder da sostituire.]',
      ],
      image: {
        src: 'https://picsum.photos/seed/maso-filosofia/1200/1500',
        alt: 'Dettaglio del lavoro in vigna [placeholder]',
      },
    },
    {
      eyebrow: 'I valori [placeholder]',
      titolo: 'Un maso, poche bottiglie, nessuna fretta [placeholder]',
      testo: [
        'Testo placeholder: il primo paragrafo descrive la scelta di produrre poco e bene, con una resa contenuta per ettaro. [Testo placeholder da sostituire.]',
        'Testo placeholder: il secondo paragrafo parla delle persone che contribuiscono al progetto e del legame con la comunità di Giovo. [Testo placeholder da sostituire.]',
        'Testo placeholder: il terzo paragrafo guarda avanti, alle vendemmie che verranno e ai vini ancora in cantina. [Testo placeholder da sostituire.]',
      ],
      image: {
        src: 'https://picsum.photos/seed/maso-valori/1200/1500',
        alt: 'Bottiglie e cantina del maso [placeholder]',
      },
    },
  ],
}

export const chiSiamoPage = {
  eyebrow: 'Le persone',
  title: 'Chi siamo',
  // Sfondi fotografici di sezione (segnaposto — vedi SfondoSezione): sotto un
  // velo tarato sul testo, servono da profondità.
  background: {
    src: '/img/sfondo-borgo-vigna.webp',
    // [placeholder] il borgo e la chiesa sopra le vigne — da sostituire
  },
  radiciBackground: {
    src: '/img/sfondo-vigna-bruma.webp',
    // [placeholder] filari nella bruma (bianco e nero, tono d'archivio) — da sostituire
  },
  intro:
    'Testo placeholder: una riga di apertura che presenta i due fratelli e il maso. [Testo placeholder da sostituire.]',
  // Ritratti: il primo ha l'immagine a destra, il secondo la specchia a
  // sinistra — l'alternanza è calcolata sull'indice in ChiSiamo.jsx.
  persone: [
    {
      nome: 'Davide',
      ruolo: 'Vigna e campagna',
      paragrafi: [
        'Testo placeholder: il ruolo di Davide in cantina e in vigna, il suo percorso di studi e la formazione agronomica che porta ogni giorno tra i filari. [Testo placeholder da sostituire.]',
        'Testo placeholder: la dedizione alle stagioni — potatura, palco verde, vendemmia — e la scelta di intervenire il meno possibile, lasciando che sia la pianta a dettare i tempi. [Testo placeholder da sostituire.]',
        'Testo placeholder: il suo approccio alla terra, fatto di osservazione e pazienza più che di ricette. [Testo placeholder da sostituire.]',
      ],
      image: {
        src: 'https://picsum.photos/seed/davide/1200/1500',
        alt: 'Ritratto di Davide [placeholder]',
      },
    },
    {
      nome: 'Andrea',
      ruolo: 'Cantina e progetto',
      paragrafi: [
        'Testo placeholder: la personalità di Andrea e il modo in cui la sua curiosità ha dato forma all’identità del progetto Sette Fontane. [Testo placeholder da sostituire.]',
        'Testo placeholder: le sue passioni, dentro e fuori dalla cantina, e come si riflettono nello stile dei vini. [Testo placeholder da sostituire.]',
        'Testo placeholder: il contributo quotidiano, dalla pressa alla bottiglia, e il dialogo costante con il lavoro del fratello in vigna. [Testo placeholder da sostituire.]',
      ],
      image: {
        src: 'https://picsum.photos/seed/andrea/1200/1500',
        alt: 'Ritratto di Andrea [placeholder]',
      },
    },
  ],
  radici: {
    eyebrow: 'Le nostre radici',
    citazione:
      'Mio nonno diceva sempre che il vino non si fa in cantina, si fa ascoltando la terra.',
    paragrafi: [
      'Testo placeholder: Davide e Andrea sono cresciuti seguendo i passi del nonno tra i filari, imparando prima a guardare che a fare — il tempo della vigna non si accorcia, si asseconda. [Testo placeholder da sostituire.]',
      'Testo placeholder: da lui hanno raccolto il rispetto per i tempi della natura e un’eredità che non sta in un ettaro di terra, ma in un modo di stare al mondo. [Testo placeholder da sostituire.]',
    ],
    foto: {
      src: 'https://picsum.photos/seed/nonno-vigna/1000/1200?grayscale',
      alt: 'Fotografia d’archivio del nonno tra le vigne [placeholder]',
      caption: 'Il nonno tra i filari del maso, anni ’60 [didascalia placeholder]',
    },
  },
}

export const scopriTerritorioPage = {
  eyebrow: 'Il territorio',
  title: 'La Valle di Cembra',
  // Sfondi fotografici di sezione (segnaposto — vedi SfondoSezione): sotto un
  // velo tarato sul testo, servono da profondità.
  background: {
    src: '/img/sfondo-terrazzamenti.webp',
    // [placeholder] fianco terrazzato della valle — da sostituire con una foto reale
  },
  newsBackground: {
    src: '/img/sfondo-borgo-monti.webp',
    // [placeholder] borgo vitato tra i monti — da sostituire con una foto reale
  },
  // Immagine d'apertura: larga ma non full-bleed, sotto il titolo.
  image: {
    src: 'https://picsum.photos/seed/cembra-valle/1800/1100',
    alt: 'Veduta della Valle di Cembra [placeholder]',
    caption: 'I terrazzamenti della Val di Cembra [didascalia placeholder]',
  },
  paragraphs: [
    'Testo placeholder: la Val di Cembra si apre come una scala di terrazzamenti in porfido, settecento chilometri di muretti a secco che disegnano il fianco della montagna. [Testo placeholder da sostituire.]',
    'Testo placeholder: il microclima nasce dall’escursione termica fra il giorno e la notte e dai venti che risalgono la valle, e regala ai bianchi acidità e profumo. [Testo placeholder da sostituire.]',
    'Testo placeholder: suoli acidi e minerali, pendenze impossibili, vigne fra i 400 e gli 800 metri: qui la viticoltura è una scelta, mai una comodità. [Testo placeholder da sostituire.]',
  ],
  mappa: {
    // Mappa reale della Val di Cembra generata da tile OpenStreetMap e servita
    // in locale (niente chiave API né iframe di terze parti): centrata su Giovo,
    // così il pin di brand cade sulla cantina. Leggermente desaturata e velata
    // di creta per stare nella palette. Attribuzione © OpenStreetMap impressa
    // nell'immagine. Il box resta un link alla ricerca su Google Maps.
    src: '/img/mappa-val-di-cembra.webp',
    alt: 'Mappa della Val di Cembra, in Trentino, con Giovo al centro',
    href: 'https://www.google.com/maps/search/?api=1&query=Giovo%2C+Val+di+Cembra%2C+Trentino',
    label: 'Valle di Cembra',
    sublabel: 'Giovo — Trentino, Italia',
    cta: 'Apri in Google Maps',
  },
  news: {
    eyebrow: 'Approfondimenti',
    titolo: 'La viticoltura eroica',
    paragrafi: [
      'Testo placeholder: si chiama eroica la viticoltura che si pratica oltre il 30% di pendenza, dove nessun mezzo può salire e ogni gesto — potare, legare, vendemmiare — resta lavoro di mani. [Testo placeholder da sostituire.]',
      'Testo placeholder: i muretti a secco che sostengono i terrazzamenti sono un paesaggio costruito pietra su pietra da generazioni, e vanno mantenuti come si mantiene una vigna. [Testo placeholder da sostituire.]',
    ],
    image: {
      src: 'https://picsum.photos/seed/muretti-secco/1200/1500',
      alt: 'Muretti a secco e vendemmia eroica sui terrazzamenti [placeholder]',
    },
  },
}

export const comingSoon = {
  eyebrow: 'Coming soon',
  title: 'Qualcosa riposa ancora in cantina',
  text: 'Il prossimo vino di Sette Fontane arriverà con la sua vendemmia.',
}

export const footer = {
  id: 'contatti',
  heading: 'Contatti',
  background: {
    src: '/img/sfondo-vigna-autunno.webp',
    // [placeholder] il maso visto da fuori: è l'invito a venirci a trovare —
    // segnaposto (vigna d'autunno, luce di sera), da sostituire con una foto reale
  },
  indirizzo: 'Maso Sette Fontane — Giovo (TN), Val di Cembra [placeholder]',
  email: 'info@settefontanewinery.com',
  telefono: '+39 000 000 0000 [placeholder]',
  social: [
    { label: 'Instagram', href: 'https://instagram.com/', icon: 'instagram' },
    { label: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
  ],
  note: [
    '© 2026 Sette Fontane — Tutti i diritti riservati',
    'P. IVA 00000000000 [placeholder]',
    'Bevi responsabilmente',
  ],
}
