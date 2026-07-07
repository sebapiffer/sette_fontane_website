// Contenuti del sito — sostituire i testi segnalati come [placeholder]
// prima della pubblicazione. La struttura non va modificata.

export const site = {
  name: 'Sette Fontane',
  nameParts: ['Sette', 'Fontane'],
  domain: 'settefontanewinery.com',
  location: 'Giovo · Val di Cembra · Trentino',
}

export const nav = {
  links: [
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
}

export const territorio = {
  id: 'territorio',
  eyebrow: 'Il territorio',
  title: 'Giovo, Val di Cembra',
  text: 'Pendii ripidi, terrazzamenti di porfido e un’escursione termica che firma i profumi del vino. Qui il Müller Thurgau ha trovato la sua casa di montagna. [Testo placeholder da sostituire.]',
  cta: 'Scopri il territorio',
  image: {
    src: 'https://picsum.photos/seed/cembra/1920/1080',
    alt: 'Vista panoramica della Val di Cembra [placeholder]',
  },
}

export const sanFlorian = {
  id: 'san-florian',
  eyebrow: 'La nostra cantina',
  title: 'San Florian',
  denominazione: 'Müller Thurgau DOCG',
  intro:
    'Il nostro primo vino porta il nome della chiesa che veglia sulle vigne di Giovo. Questa bottiglia racconta il nostro Trentino: la memoria di una tradizione antica e il coraggio di una nuova generazione che guarda lontano.',
  cta: 'Assapora San Florian',
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

export const comingSoon = {
  eyebrow: 'Coming soon',
  title: 'Qualcosa riposa ancora in cantina',
  text: 'Il prossimo vino di Sette Fontane arriverà con la sua vendemmia.',
}

export const footer = {
  id: 'contatti',
  heading: 'Contatti',
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
