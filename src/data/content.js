// Contenuti del sito. La struttura non va modificata.

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
  // Ripresa aerea sopra i filari del maso, una traslazione lenta e continua
  // che scopre la valle. Sorgente `video_hero.mp4`, 4K/23 s: qui è H.264
  // 1600x900 senza audio, ~5,3 MB (crf 29) — il video autoplay+loop si scarica
  // per intero, e sotto il velo antracite dell'hero la piena risoluzione non
  // si vedrebbe comunque.
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
  // Il maso vero, ripreso dal drone: la casa tra i filari, il bosco alle
  // spalle. Sorgente `maso.jpg` (lo scatto verticale — i suoi pixel sono
  // ruotati e vanno raddrizzati con l'EXIF; `maso_orizzontale.jpg` è lo stesso
  // soggetto in 16:9). Si è preso il verticale perché lo slot è aspect-[4/5]:
  // il ritaglio toglie un po' di cielo e di vigna sotto, mentre partendo dal
  // 16:9 sarebbe finita fuori più di metà larghezza, maso compreso.
  image: {
    src: asset('/img/maso-sette-fontane.webp'),
    alt: 'Il maso Sette Fontane visto dall’alto, tra i filari e il bosco di Giovo',
  },
  // Sfondo di sezione: foto ampia e poco leggibile in dettaglio (una vigna in
  // campo lungo), non un soggetto — sta sotto un velo di creta e serve come
  // profondità, non come informazione. Vedi SfondoSezione.
  background: {
    src: asset('/img/sfondo-maso.webp'),
  },
}

// I ritratti veri di Davide e Andrea (prima, in attesa, le due figure
// ospitavano una foto della vigna e una della bottiglia). Sono gli stessi
// scatti della pagina /chi-siamo: entrambi al trattore fra i filari, con la
// valle alle spalle — una coppia, non due fotografie qualsiasi.
export const chiSiamo = {
  id: 'chi-siamo',
  eyebrow: 'Chi siamo',
  title: 'Due fratelli con lo stesso sogno',
  // Le due righe sotto il ruolo sono distillate dalle biografie vere di
  // `chiSiamoPage.persone` — non sono più i placeholder inventati di prima, che
  // per giunta dicevano l'opposto dei ruoli (mandavano Davide in vigna e Andrea
  // in cantina). Tenute corte e della stessa lunghezza: le due schede stanno
  // affiancate e una didascalia più lunga dell'altra sbilancia la griglia.
  people: [
    {
      name: 'Davide',
      role: 'Poca campagna, tanta cantina',
      bio: "Enologo diplomato alla Fondazione Edmund Mach. In cantina è colui che guida l’evoluzione di ogni vino; in vigna non esita a salire sul trattore tra i filari. Scienza, sensibilità e stivali sporchi di terra: l'anima artigiana di Maso Sette Fontane.",
      image: {
        src: asset('/img/davide.webp'),
        alt: 'Davide Moser appoggiato al trattore, tra i filari del maso',
      },
    },
    {
      name: 'Andrea',
      role: 'Campagna, marketing e non solo',
      bio: "Con il diploma alla Fondazione Mach e gli studi in Scienze Alimentari, unisce precisione e creatività: cura in prima persona ogni dettaglio tra i filari e trasforma il lavoro sul campo nella strategia di marketing e comunicazione del domani.",
      image: {
        src: asset('/img/andrea.webp'),
        alt: 'Andrea Moser davanti al trattore, tra i filari del maso',
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
  text: "Scolpito tra i ripidi terrazzamenti di Giovo, l'areale della Val di Cembra è il regno di una viticoltura eroica ed autentica. Qui, tra forti escursioni termiche e brezze alpine, la vite affonda le radici in un mosaico unico di porfido e calcare. È un paesaggio disegnato dai muretti a secco, dove la pendenza della montagna incontra la cura paziente del lavoro manuale.",
  cta: 'Scopri il territorio',
  // La figura resta la "finestra sul paesaggio" (rettangolare, mai ad arco).
  // Qui e nell'intestazione di /scopri-territorio le due vedute si sono
  // scambiate di posto: in home va la Valle dell'Adige vista dai filari del
  // maso, sulla sottopagina il borgo di Giovo. Il file è un ritaglio 4/5 dello
  // scatto originale (4032×2268) perché lo slot è verticale — il panorama in
  // 16/9 vive ora sulla sottopagina. Non ripete lo sfondo di sezione, che è
  // un'altra veduta e comunque desaturata sotto il velo.
  image: {
    src: asset('/img/valle-cembra-verticale.webp'),
    alt: 'La Valle dell’Adige vista dai vigneti del maso, tra le cime della valle',
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
  eyebrow: 'Da dove tutto è partito',
  title: 'San Florian',
  denominazione: 'Müller Thurgau DOC',
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
      'Al naso si riscontrano sentori di frutta tropicale, agrumi e fiori bianchi. In bocca si riscontra una spiccata verticalità, supportata da un’adeguata profondità; la sensazione retronasale rispecchia perfettamente i sentori riscontrati al naso.',
  },
  scheda: [
    { label: 'Uvaggio', value: 'Müller Thurgau 100%' },
    { label: 'Zona', value: 'Giovo, Val di Cembra' },
    { label: 'Suolo', value: 'Limoso, porfirico' },
    { label: 'Affinamento', value: 'Acciaio, sui lieviti' },
    { label: 'Alcol', value: '12% vol.' },
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
    titolo: 'Da dove tutto è partito',
    paragrafi: [
      'All’età di 16 anni iniziano le nostre prime prove di vinificazione, con piccoli quantitativi di uva “rubati” al nonno. Dopo sei vendemmie, affinata la tecnica e incoraggiati da molti amici, abbiamo deciso di fare sul serio, utilizzando per la prima volta delle uve prodotte da noi.',
      'Il nome San Florian nasce dall’idea di trovare un filo conduttore per i nostri quattro vigneti di Müller Thurgau, situati attorno all’abitato di Valternigo. Oltre al suolo e alla varietà, l’aspetto comune di questi vigneti è la vista sulla magnifica chiesetta di San Floriano, che sovrasta l’intero comune di Giovo.',
      'L’etichetta, pensata dal rinomato stilista nonché nostro grande amico Mirco Giovannini e concretizzata dal grafico Pierluigi Cambrini, prende ispirazione proprio dalla chiesetta e dagli elementi caratteristici che la contraddistinguono: mantiene uno stretto legame con la storia del luogo e del territorio, riprendendo al tempo stesso una chiave di modernità e giovinezza.',
    ],
  },
}

export const scopriAziendaPage = {
  eyebrow: "L'azienda",
  title: 'La storia del nostro maso',
  // Sfondi fotografici di sezione (segnaposto, vigne di repertorio — vedi
  // SfondoSezione): sotto un velo tarato sul testo, servono da profondità.
  background: {
    src: asset('/img/sfondo-maso-cielo.webp'),
  },
  intro: [
"Al di sopra delle Colline Avisiane, ad un’altitudine di 500 metri, si trova Maso Sette Fontane, dove la vite affonda le sue radici fin dal 1734. Il nome richiama un'antica eredità legata alle sorgenti naturali d'acqua che nutrono questo territorio d'altitudine. Dagli anni 50 la nostra famiglia risiede qui e nel 2022 il testimone è passato a noi, proseguendo un cammino che dal 2010 abbraccia i principi dell’agricoltura biologica.",
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
  // Blocchi alternati testo/immagine sotto l'intro: l'ordine visivo si
  // inverte a blocchi pari (immagine a sinistra) — vedi ScopriAzienda.
  // Ogni blocco è una sezione a sé, con il proprio fondo e la propria foto:
  // i fondi si alternano creta/offwhite senza mai ripetere quello della
  // sezione precedente: l'intro è su creta, quindi il primo blocco parte da
  // offwhite e si alterna da lì (con la timeline in mezzo, che chiudeva su
  // offwhite, l'ordine era l'opposto). Così i blocchi si leggono come capitoli
  // distinti e non come un unico muro. `fondo` sceglie anche il velo sopra la
  // foto.
  blocchi: [
    {
      fondo: 'offwhite',
      background: { src: asset('/img/sfondo-colline-foschia.webp') },
      eyebrow: 'La filosofia',
      titolo: 'Lavorare assecondando la vigna',
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
      fondo: 'creta',
      background: { src: asset('/img/sfondo-borgo-vigne.webp') },
      eyebrow: 'I valori',
      titolo: 'Perché la qualità prima della quantità',
      testo: [
"Abbiamo scelto consapevolmente di produrre poco e bene, mantenendo rese inferiori ai 90 quintali per ettaro per privilegiare la qualità senza compromessi. Concentrare le energie della pianta su un numero ridotto di grappoli ci permette di esaltare la concentrazione aromatica, l'equilibrio e l'espressività della viticoltura d'altitudine.",
"Maso Sette Fontane non è solo terreno e filari, ma il risultato del lavoro di persone che mettono mani, testa e cuore in ciò che fanno. Siamo orgogliosi di far parte di un tessuto umano e sociale che da generazioni custodisce la cultura viticola di queste colline, riflettendo questa passione in ogni scelta aziendale.",
"Guardiamo al futuro muovendoci al ritmo della natura, con i piedi ben saldi nella terra. Mentre le nostre riserve riposano in cantina evolvendo senza fretta, noi continuiamo a sperimentare e ad ascoltare il vigneto, creando vini capaci di raccontare la nostra storia e di sfidare il tempo.",
     ],
      // Le bottiglie coricate in cantina, tappo verso l'obiettivo: il turacciolo
      // marchiato con le sette gocce è il soggetto. Sorgente
      // `qualità_prima_della_quantità.jpg`, uno scatto molto largo (4000×1848):
      // lo slot è aspect-[4/5], quindi il file è già ritagliato in verticale
      // attorno al tappo, non è tutta l'inquadratura.
      image: {
        src: asset('/img/bottiglie-cantina.webp'),
        alt: 'Bottiglie coricate in cantina, con il tappo marchiato Sette Fontane',
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
  // Immagine orizzontale sotto il titolo, come nelle altre sottopagine
  // (`scopriAziendaPage.gruppo`, `scopriTerritorioPage.image`). Qui però la
  // pagina parla di persone, e la foto lo fa prima del testo: la squadra al
  // completo davanti al trattore, con la valle alle spalle. Sorgente
  // `chi_siamo_intestazione.jpeg`, i cui pixel sono ruotati di 90° (nessun
  // EXIF a raddrizzarli): il file qui è già ruotato e ritagliato in 16/9.
  image: {
    src: asset('/img/chi-siamo-gruppo.webp'),
    alt: 'Il gruppo al completo davanti al trattore, sui terrazzamenti con la valle alle spalle',
    caption: 'Chi lavora al maso, in vigna e in cantina',
  },
  // Ritratti: il primo ha l'immagine a destra, il secondo la specchia a
  // sinistra — l'alternanza è calcolata sull'indice in ChiSiamo.jsx.
  persone: [
    {
      nome: 'Davide',
      ruolo: 'Poca campagna, tanta cantina',
      paragrafi: [
      "Sono Davide Moser, ho 22 anni e la mia passione per la viticoltura nasce da lontano, ereditata da mio nonno, che ha coltivato queste stesse viti con una dedizione maniacale e una precisione assoluta.",
      "Dopo aver frequentato la storica Fondazione Edmund Mach di San Michele all'Adige, ho completato la mia formazione diventando enologo.",
      "Oggi, a Maso Sette Fontane, unisco il rigore della mia professione alla cura pratica di ogni fase: mi trovate sia in cantina a guidare l'evoluzione del vino, sia in campagna al volante del trattore tra i filari, custodendo con competenza l'eredità che mi è stata tramandata.",
      ],
      image: {
        src: asset('/img/davide.webp'),
        alt: 'Davide Moser appoggiato al trattore, tra i filari del maso',
      },
    },
    {
      nome: 'Andrea',
      ruolo: 'Campagna, marketing e non solo',
      paragrafi: [
        "Sono Andrea Moser, ho 18 anni e il mio legame con questa terra parte da lontano, ispirato dalla cura maniacale con cui nostro nonno ha sempre coltivato questi filari.",
        "Dopo aver conseguito il diploma alla Fondazione Edmund Mach di San Michele all'Adige, ho scelto di proseguire gli studi iscrivendomi alla facoltà di Scienze Alimentari.",
        "A Maso Sette Fontane sono il cervello operativo in campo: pianifico e me ne occupo in prima persona di ogni lavorazione tra le viti, garantendo il massimo livello qualitativo in campagna. Allo stesso tempo rappresento un solido e costante aiuto in cantina, dove unisco la mia visione scientifica alla passione di famiglia. ",
      ],
      image: {
        src: asset('/img/andrea.webp'),
        alt: 'Andrea Moser davanti al trattore, tra i filari del maso',
      },
    },
  ],
  radici: {
    eyebrow: 'Le nostre radici',
    citazione:
      'I valori di nostro nonno',
    paragrafi: [
"La nostra passione per il vino è cresciuta osservando le mani del nonno Silvino, un uomo semplice guidato da una dedizione incrollabile per la campagna. La storia della nostra azienda parte da appena mezzo ettaro lavorato con fatica e rispetto per la natura. ",
"Giorno dopo giorno è riuscito a trasformare quei pochi filari in un sogno concreto, fino a raggiungere sei ettari e il nostro amato maso. Crescendo al suo fianco abbiamo imparato ad ascoltare la vigna e a capire il valore dell'attesa, vedendo nascere in entrambi l'amore per la viticoltura.",
"Oggi ne raccogliamo il testimone per produrre vino con la stessa autenticità. In ogni bottiglia racchiudiamo l'eredità di chi è partito dal nulla e la storia di una passione che continua a vivere.",
    ],
    // La foto d'archivio vera. La sorgente (`nonno.jpeg`) è la scansione di una
    // pagina di calendario del 2014: lo scatto è incastonato dentro
    // l'impaginato, quindi il file qui è il solo ritaglio della fotografia —
    // niente cornice rossa, niente testo dell'articolo. È piccola (513×462, il
    // massimo che la scansione contiene: ingrandirla non aggiungerebbe
    // dettaglio) e la sezione la rende comunque in bianco e nero.
    foto: {
      src: asset('/img/nonno-silvino.webp'),
      alt: 'Il nonno Silvino con i due nipoti davanti alla stufa, mentre insegna a legare i tralci',
      caption: 'I momenti col nonno Silvino',
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
  // Immagine d'apertura: larga ma non full-bleed, sotto il titolo. È il
  // panorama al tramonto sull'areale (sorgente `vdc_orizzontale.jpeg`, 4000×1848):
  // il ritaglio 16/9 è preso sul lato destro dell'originale, perché a sinistra
  // il sole basso entra nell'obiettivo e sbianca mezza inquadratura — così il
  // controluce resta un accenno all'angolo invece che il soggetto.
  image: {
    src: asset('/img/valle-di-cembra-panorama.webp'),
    alt: 'La Valle di Cembra al tramonto: il paese di Giovo, i terrazzamenti vitati e le cime del Brenta',
    caption: 'I terrazzamenti dell’areale al tramonto, con il Brenta all’orizzonte',
  },
  // Il blocco accanto alla mappa ha ora il suo attacco — occhiello + titolo,
  // come `news` qui sotto e come i blocchi di "Scopri l'azienda": senza, era
  // l'unica colonna di testo del sito che partiva direttamente in prosa.
  // Il titolo non ripete quello di pagina ("La Valle di Cembra") ma nomina la
  // cosa che i paragrafi raccontano davvero: i due suoli.
  paragraphsEyebrow: 'la località',
  paragraphsTitle: 'Il nostro terroir',
  // Versione più corta (era quattro paragrafi lunghi): la colonna sta accanto
  // alla mappa, e superata la sua altezza il blocco si sbilanciava.
  paragraphs: [
    "Il Maso Sette Fontane affonda le sue radici nel cuore della Val di Cembra, a Giovo, dove la viticoltura è da sempre un'arte eroica scolpita tra terrazzamenti e forte pendenza. Il microclima fa il resto: ottima esposizione e forti escursioni termiche fra giorno e notte, garantite dalle correnti alpine e dalla brezza dell'Ora del Garda.",
    "La vera identità dei nostri vini nasce però da una duplice ricchezza del terreno. Gran parte della tenuta si sviluppa su eccezionali suoli calcarei recuperati da ex cave di ghiaia bianca: poveri, drenanti e ricchi di scheletro, infondono ai vini un'eleganza dritta e una straordinaria tensione acida.",
    "Fa eccezione la zona del Müller Thurgau, su terreni di matrice porfirica più ricchi e strutturati, dove la roccia vulcanica dona mineralità profonda, sapidità e aromi di grande intensità. Lavorate quasi interamente a mano, le due anime del territorio diventano vini di spiccata personalità, freschezza e longevità.",
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
    eyebrow: 'morfologia e paesaggio',
    titolo: 'La vista dai nostri filari',
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
  indirizzo: 'Maso Sette Fontane — Giovo (TN), Val di Cembra',
  email: emailCantina,
  // Numero di Davide. Il componente ne ricava da sé l'href `tel:` togliendo
  // gli spazi, così qui resta la sola forma leggibile.
  telefono: '+39 389 660 3382',
  social: [
    { label: 'Instagram', href: 'https://instagram.com/settefontanewinery', icon: 'instagram' },
  ],
  note: [
    '© 2026 Sette Fontane — Tutti i diritti riservati',
    'P. IVA 02666160227',
    'Bevi responsabilmente',
  ],
}
