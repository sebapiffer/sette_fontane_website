// Contenuti del sito — sostituire i testi segnalati come [placeholder]
// prima della pubblicazione. La struttura non va modificata.

// Gli asset in public/ sono referenziati con percorso assoluto (/img, /video):
// Vite non riscrive le stringhe dei dati come fa per HTML/CSS/JS, quindi vanno
// prefissate a mano con il base path (import.meta.env.BASE_URL) o si rompono
// sotto GitHub Pages, dove il sito vive in una sottocartella. In dev è '/'.
const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\//, '')

// Indirizzo unico della cantina: lo usano sia i contatti nel footer sia il
// mailto di richiesta acquisto del San Florian — va cambiato solo qui.
const emailCantina = 'info@settefontanewinery.com'

export const site = {
  name: 'Sette Fontane',
  nameParts: ['Sette', 'Fontane'],
  domain: 'settefontanewinery.com',
  location: 'Giovo · Val di Cembra · Trentino',
}

// Voci del menu: quelle con una pagina di approfondimento sono rotte (`to`),
// così dal menu ci si arriva diretti; le altre restano ancore alla home
// (`href`). Dalle sottopagine la Navbar antepone "/" all'ancora e ScrollToTop
// porta alla sezione dopo il cambio rotta.
export const nav = {
  links: [
    { label: 'Home', to: '/' },
    // Le voci con una pagina dedicata puntano alla rotta, non all'ancora in
    // home: il menu porta direttamente all'approfondimento. San Florian resta
    // un'ancora (non ha una pagina propria: è la sezione con lo zoom bottiglia)
    // come Contatti, che vive nel footer.
    { label: "L'azienda", to: '/scopri-azienda' },
    { label: 'Chi siamo', to: '/chi-siamo' },
    { label: 'Il territorio', to: '/scopri-territorio' },
    { label: 'San Florian', href: '#san-florian' },
    { label: 'Contatti', href: '#contatti' },
  ],
}

// Popup d'ingresso, prima di qualunque contenuto. Testi separati dalla
// meccanica dei componenti come tutto il resto: il legale può riscriverli qui
// senza toccare l'overlay.
export const verificaEta = {
  titolo: 'Benvenuti',
  domanda: 'Confermi di essere maggiorenne?',
  si: 'Sì',
  no: 'No',
  nota: 'Bevi responsabilmente',
  // Nessun rimando a siti esterni sul "No": chi risponde di no resta qui e
  // legge il perché, non viene sbattuto fuori su una pagina che non ha chiesto.
  rifiuto: {
    titolo: 'Ci dispiace',
    testo:
      'Questo sito racconta vini e bevande alcoliche: l’accesso è riservato a chi ha compiuto diciotto anni. Ti aspettiamo tra qualche vendemmia.',
    indietro: 'Ho sbagliato, torna indietro',
  },
}

export const cookie = {
  testo:
    'Questo sito non usa cookie: nessuno analitico, nessuno di profilazione, nessun servizio di terze parti che ti segua.',
  // La nota sul localStorage: dichiararla è ciò che tiene onesta la frase
  // sopra — la conferma resta sul dispositivo di chi legge, non è un cookie e
  // non identifica nessuno.
  nota: 'Sul tuo browser resta solo la conferma della maggiore età e di questo messaggio, per non richiederle a ogni visita.',
  bottone: 'Ho capito',
  etichetta: 'Informativa cookie',
}

export const hero = {
  eyebrow: 'Maso e cantina biologica',
  location: 'Giovo · Val di Cembra',
  scrollHint: 'Scorri',
  // Ripresa aerea del maso all'ora dorata: una traslazione lenta e continua
  // sopra i filari (H.264 1600x900, ~5,7 MB, senza audio) — sta sotto il velo
  // antracite dell'hero, quindi non serve la piena risoluzione.
  video: {
    src: asset('/video/hero-vigna-maso.mp4'),
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
    src: asset('/img/maso-pergola.webp'),
    alt: 'Grappoli di Müller Thurgau tra i filari del maso, sopra la valle',
  },
  // Sfondo di sezione: foto ampia e poco leggibile in dettaglio (una vigna in
  // campo lungo), non un soggetto — sta sotto un velo di creta e serve come
  // profondità, non come informazione. Vedi SfondoSezione.
  background: {
    src: asset('/img/sfondo-maso.webp'),
  },
}

// [placeholder] mancano i ritratti di Davide e Andrea: finché non arrivano, le
// due figure ospitano una foto della vigna e una della bottiglia — coerenti con
// il ruolo di ciascuno (campagna / cantina) — invece di un segnaposto estraneo.
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
        src: asset('/img/vigna-pergola.webp'),
        alt: 'I filari del maso sotto la pergola',
      },
    },
    {
      name: 'Andrea',
      role: 'Cantina e progetto',
      bio: 'Dalla pressa alla bottiglia, cura la cantina e l’anima del progetto Sette Fontane. [Testo placeholder da sostituire.]',
      image: {
        src: asset('/img/bottiglie-san-florian.webp'),
        alt: 'La bottiglia di San Florian e la confezione di spedizione',
      },
    },
  ],
  cta: 'Conoscici',
  background: {
    src: asset('/img/sfondo-valle-sera.webp'),
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
    src: asset('/img/terrazzamenti-porfido.webp'),
    alt: 'I filari terrazzati del maso visti dall’alto, tra porfido e ghiaia bianca',
  },
  background: {
    src: asset('/img/sfondo-valle-monti.webp'),
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
    src: asset('/img/sfondo-vigna-valle.webp'),
  },
  formats: [
    {
      id: 'renana',
      label: 'Renana',
      volume: '0,75 L',
      image: asset('/img/san-florian-renana.webp'),
    },
    {
      id: 'magnum',
      label: 'Magnum',
      volume: '1,5 L',
      image: asset('/img/san-florian-magnum.webp'),
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
  // Richiesta d'acquisto: non c'è e-commerce, la vendita si concorda per
  // e-mail. `oggetto` e `corpo` sono funzioni del formato selezionato, così
  // il messaggio precompilato dice già cosa l'utente stava guardando.
  acquisto: {
    etichetta: 'Contattaci per acquistare',
    email: emailCantina,
    oggetto: (formato) =>
      `Richiesta d'acquisto — San Florian ${formato.label} ${formato.volume}`,
    corpo: (formato) =>
      [
        'Buongiorno,',
        '',
        `vorrei informazioni per acquistare il San Florian nel formato ${formato.label} (${formato.volume}).`,
        '',
        'Numero di bottiglie: ',
        'Nome e cognome: ',
        'Indirizzo di consegna o ritiro in cantina: ',
        'Telefono: ',
        '',
        'Grazie,',
      ].join('\n'),
  },
  storia: {
    hint: 'Scorri per approfondire',
    titolo: 'La storia del San Florian',
    paragrafi: [
      // [placeholder] testo in attesa della storia vera del vino
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    ],
  },
}

export const scopriAziendaPage = {
  eyebrow: "L'azienda",
  title: 'La storia di Maso Sette Fontane [placeholder]',
  // Sfondi fotografici di sezione (segnaposto, vigne di repertorio — vedi
  // SfondoSezione): sotto un velo tarato sul testo, servono da profondità.
  background: {
    src: asset('/img/sfondo-maso-cielo.webp'),
  },
  timelineBackground: {
    src: asset('/img/sfondo-valle-bruma.webp'),
  },
  intro: [
"Al di sopra delle Colline Avisiane, ad un’altitudine di 550 metri, si trova Maso Sette Fontane, dove la vite affonda le sue radici fin dal 1734. Il nome richiama un'antica eredità legata alle sorgenti naturali d'acqua che nutrono questo territorio d'altitudine. Dagli anni 50 la nostra famiglia risiede qui e nel 2022 il testimone è passato a noi, proseguendo un cammino che dal 2010 abbraccia i principi dell’agricoltura biologica.",
"L'agricoltura biologica è per noi una scelta identitaria profonda, facilitata dalla morfologia a corpo unico dell'azienda. Evitiamo le sostanze di sintesi e ci affidiamo unicamente ad ammendanti naturali per nutrire il terreno, rispettandone i cicli vitali e custodendo la biodiversità e le sorgenti che ci circondano.",
"Ogni nostra bottiglia racchiude secoli di storia contadina, la pazienza del lavoro manuale e un patto quotidiano con l'ambiente. Coltiviamo questa terra con rispetto per chi l'ha lavorata prima di noi, con l'impegno di consegnare alle generazioni future un ecosistema sano, autentico e vivo.",
],
  // Apre la pagina sotto il titolo, formato panoramico (non full-bleed),
  // didascalia sotto. Era previsto un ritratto di gruppo della famiglia: finché
  // non arriva, il posto lo tiene la veduta aerea del maso e dei suoi filari.
  gruppo: {
    src: asset('/img/maso-dallalto.webp'),
    alt: 'Maso Sette Fontane e i suoi vigneti visti dall’alto',
    caption: 'Maso Sette Fontane, sulle Colline Avisiane a 550 metri',
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
  // Ogni blocco è una sezione a sé, con il proprio fondo e la propria foto:
  // i fondi si alternano creta/offwhite senza mai ripetere quello della
  // sezione precedente (la timeline chiude su offwhite, quindi si riparte da
  // creta), così i blocchi si leggono come capitoli distinti e non come un
  // unico muro. `fondo` sceglie anche il velo sopra la foto.
  blocchi: [
    {
      fondo: 'creta',
      background: { src: asset('/img/sfondo-colline-foschia.webp') },
      eyebrow: 'La filosofia [placeholder]',
      titolo: 'Lavorare assecondando la vigna [placeholder]',
      testo: [
"Coltivare Maso Sette Fontane richiede l'arte dell'ascolto e un'osservazione quotidiana delle piante e del suolo dolomitico che le nutre. Evitiamo le forzature meccaniche privilegiando la cura manuale: un dialogo costante con la vite che va dal primo taglio della potatura invernale fino alla rigorosa selezione dei grappoli durante la vendemmia.",
"Assecondiamo l'orientamento del terreno e il microclima delle Colline Avisiane per permettere alla vigna di esprimere la sua naturale energia. Un aspetto per noi fondamentale è la gestione dell'età dell'impianto: accompagniamo le nostre piante nell'invecchiamento per garantire vini di superiore qualità e personalità.",
"Crediamo in un intervento minimo, sia in campo che in cantina, lasciando che il terreno e il clima esprimano la loro vera identità. Ci sincronizziamo con il ritmo lento della natura, trovando nell'equilibrio tra lavoro artigianale e scorrere delle stagioni l'essenza stessa delle nostre produzioni.",
   ],
      image: {
        src: asset('/img/vigna-uva.webp'),
        alt: 'Grappoli di Müller Thurgau in maturazione tra i filari',
      },
    },
    {
      fondo: 'offwhite',
      background: { src: asset('/img/sfondo-borgo-vigne.webp') },
      eyebrow: 'I valori [placeholder]',
      titolo: 'Un maso, poche bottiglie, nessuna fretta [placeholder]',
      testo: [
"Abbiamo scelto consapevolmente di produrre poco e bene, mantenendo rese inferiori ai 90 quintali per ettaro per privilegiare la qualità senza compromessi. Concentrare le energie della pianta su un numero ridotto di grappoli ci permette di esaltare la concentrazione aromatica, l'equilibrio e l'espressività della viticoltura d'altitudine.",
"Maso Sette Fontane non è solo terreno e filari, ma il risultato del lavoro di persone che mettono mani, testa e cuore in ciò che fanno. Siamo orgogliosi di far parte di un tessuto umano e sociale che da generazioni custodisce la cultura viticola di queste colline, riflettendo questa passione in ogni scelta aziendale.",
"Guardiamo al futuro muovendoci al ritmo della natura, con i piedi ben saldi nella terra. Mentre le nostre riserve riposano in cantina evolvendo senza fretta, noi continuiamo a sperimentare e ad ascoltare il vigneto, creando vini capaci di raccontare la nostra storia e di sfidare il tempo.",
     ],
      image: {
        src: asset('/img/confezione-sette-fontane.webp'),
        alt: 'La confezione singola Sette Fontane con la bottiglia di San Florian',
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
    src: asset('/img/sfondo-chiesa-colle.webp'),
  },
  radiciBackground: {
    src: asset('/img/sfondo-valle-bruma.webp'),
  },
  intro:
    'le persone al cuore della nostra azienda',
  // Ritratti: il primo ha l'immagine a destra, il secondo la specchia a
  // sinistra — l'alternanza è calcolata sull'indice in ChiSiamo.jsx.
  persone: [
    {
      nome: 'Davide',
      ruolo: 'Vigna e campagna',
      paragrafi: [
      "Sono Davide Moser, ho 22 anni e la mia passione per la viticoltura nasce da lontano, ereditata da mio nonno, che ha coltivato queste stesse viti con una dedizione maniacale e una precisione assoluta.",
      "Dopo aver frequentato la storica Fondazione Edmund Mach di San Michele all'Adige, ho completato la mia formazione diventando enologo.",
      "Oggi, a Maso Sette Fontane, unisco il rigore della mia professione alla cura pratica di ogni fase: mi trovate sia in cantina a guidare l'evoluzione del vino, sia in campagna al volante del trattore tra i filari, custodendo con competenza l'eredità che mi è stata tramandata.",
      ],
      image: {
        src: asset('/img/vigna-pergola.webp'),
        alt: 'I filari del maso sotto la pergola',
      },
    },
    {
      nome: 'Andrea',
      ruolo: 'Cantina e progetto',
      paragrafi: [
        "Sono Andrea Moser, ho 18 anni e il mio legame con questa terra parte da lontano, ispirato dalla cura maniacale con cui nostro nonno ha sempre coltivato questi filari.",
        "Dopo aver conseguito il diploma alla Fondazione Edmund Mach di San Michele all'Adige, ho scelto di proseguire gli studi iscrivendomi alla facoltà di Scienze ",
        "Alimentari. A Maso Sette Fontane sono il cervello operativo in campo: pianifico e me ne occupo in prima persona di ogni lavorazione tra le viti, garantendo il massimo livello qualitativo in campagna. Allo stesso tempo rappresento un solido e costante aiuto in cantina, dove unisco la mia visione scientifica alla passione di famiglia. ",
      ],
      image: {
        src: asset('/img/bottiglie-san-florian.webp'),
        alt: 'La bottiglia di San Florian e la confezione di spedizione',
      },
    },
  ],
  radici: {
    eyebrow: 'Le nostre radici',
    citazione:
      'i valori di nostro nonno',
    paragrafi: [
"La nostra passione per il vino è cresciuta osservando le mani del nonno, un uomo semplice guidato da una dedizione incrollabile per la campagna. La storia della nostra azienda parte da appena mezzo ettaro lavorato con fatica e rispetto per la natura. ",
"Giorno dopo giorno è riuscito a trasformare quei pochi filari in un sogno concreto, fino a raggiungere sei ettari e il nostro amato maso. Crescendo al suo fianco abbiamo imparato ad ascoltare la vigna e a capire il valore dell'attesa, vedendo nascere in entrambi l'amore per la viticoltura.",
"Oggi ne raccogliamo il testimone per produrre vino con la stessa autenticità. In ogni bottiglia racchiudiamo l'eredità di chi è partito dal nulla e la storia di una passione che continua a vivere.",
    ],
    // [placeholder] al posto della foto d'archivio del nonno — che non è ancora
    // arrivata — sta un filare del maso: la sezione lo rende comunque in bianco
    // e nero, quindi il tono d'archivio regge.
    foto: {
      src: asset('/img/filari-valle.webp'),
      alt: 'I filari del maso affacciati sulla valle',
      caption: 'I filari del maso, dove tutto è cominciato',
    },
  },
}

export const scopriTerritorioPage = {
  eyebrow: 'Il territorio',
  title: 'La Valle di Cembra',
  // Sfondi fotografici di sezione (segnaposto — vedi SfondoSezione): sotto un
  // velo tarato sul testo, servono da profondità.
  background: {
    src: asset('/img/sfondo-cave-terrazze.webp'),
  },
  newsBackground: {
    src: asset('/img/sfondo-borgo-vigne.webp'),
  },
  // Immagine d'apertura: larga ma non full-bleed, sotto il titolo.
  image: {
    src: asset('/img/valle-cembra.webp'),
    alt: 'La Valle dell’Adige vista dai vigneti del maso, a Giovo',
    caption: 'Dai filari del maso lo sguardo scende sulla valle e sulle vette del Brenta',
  },
  paragraphs: [
  "Il Maso Sette Fontane affonda le sue radici nel cuore della Val di Cembra, nel comune di Giovo, un territorio dove la viticoltura è da sempre un’arte eroica scolpita tra terrazzamenti e forte pendenza. ",
  "L’areale di Giovo beneficia di un microclima straordinario, caratterizzato da un'ottima esposizione solare e dalle forti escursioni termiche tra il giorno e la notte, garantite dalle correnti fresche alpine e dalla brezza dell’Ora del Garda. La vera identità dei nostri vini nasce da una duplice ricchezza del terreno.",
  "Gran parte della nostra tenuta si sviluppa su autentici ed eccezionali suoli calcarei, recuperati da ex cave di ghiaia bianca: terreni poveri, drenanti e ricchi di scheletro, che infondono ai vini un’eleganza dritta, una straordinaria tensione acida e una spiccata finezza. ",
  "Fa eccezione la zona dedicata ai nostri vigneti di Müller Thurgau, situata su terreni di matrice porfirica, nettamente più ricchi e strutturati, tipici della roccia vulcanica della valle. Qui il porfido dona alle uve una mineralità profonda, sapidità e un corredo aromatico di grande intensità. In questo contesto unico, lavorato quasi interamente a mano, il Maso Sette Fontane sintetizza la doppia anima del territorio di Giovo, traducendo la particolarità dei suoi suoli in vini di spiccata personalità, freschezza e longevità. ",
],
  mappa: {
    // Mappa reale della Val di Cembra generata da tile OpenStreetMap e servita
    // in locale (niente chiave API né iframe di terze parti): centrata su Giovo,
    // così il pin di brand cade sulla cantina. Leggermente desaturata e velata
    // di creta per stare nella palette. Attribuzione © OpenStreetMap impressa
    // nell'immagine. Il box resta un link alla ricerca su Google Maps.
    src: asset('/img/mappa-val-di-cembra.webp'),
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
"Dall’alto del Maso Sette Fontane lo sguardo si apre su uno dei panorami più suggestivi del Trentino. Posizionato in una balconata naturale, il maso domina dall'alto la Valle dell’Adige, seguendo il nastro d'argento del fiume che scorre lento lungo il fondo valle. All’orizzonte la vista spazia in totale libertà, incontrando la maestosità della Paganella e le vette spettacolari del Gruppo Adamello-Brenta, che incorniciano il tramonto con i loro profili di roccia. ",
"Essere affacciati su questo anfiteatro naturale non offre solo una bellezza contemplativa, ma definisce la vita stessa dei nostri vigneti. Da questa posizione privilegiata la tenuta intercetta costantemente la luce del sole e beneficia delle correnti d'aria che risalgono la valle, creando un microclima vivo e ventilato. Lavorare qui significa coltivare ogni filare immersi in uno scenario grandioso, dove la grandezza delle montagne e la forza del fiume si riflettono direttamente nel carattere dei nostri vini. ",
    ],
    image: {
      src: asset('/img/muretti-terrazzamenti.webp'),
      alt: 'I vigneti terrazzati sui ripidi pendii di Giovo',
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
    src: asset('/img/sfondo-maso-valle.webp'),
  },
  indirizzo: 'Maso Sette Fontane — Giovo (TN), Val di Cembra [placeholder]',
  email: emailCantina,
  telefono: '+39 000 000 0000 [placeholder]',
  social: [
    { label: 'Instagram', href: 'https://instagram.com/settefontanewinery', icon: 'instagram' },
  ],
  note: [
    '© 2026 Sette Fontane — Tutti i diritti riservati',
    'P. IVA 00000000000 [placeholder]',
    'Bevi responsabilmente',
  ],
}
