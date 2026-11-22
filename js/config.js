/* ════════════════════════════════════════════
   config.js — single source of truth for all site content.
   Edit this file to update copy, links, and placeholders.
   ════════════════════════════════════════════ */

window.SITE_CONFIG = {

  showMedia: false,

  /* ── Identity ───────────────────────────────────────────────── */
  name:        "Ananya Anandharaman",
  tagline:     "Geophysicist · GW Researcher · Data Scientist",
  institution: "LMU Munich · University of Glasgow · IUCAA Pune · IIT (ISM) Dhanbad",
  heroQuote:   "I listen to the Earth<br>to help us hear the universe",

  bio: "PhD researcher in seismology at LMU Munich (RING project), after an Integrated M.Tech in Applied Geophysics at IIT (ISM) Dhanbad. Thesis at IUCAA Pune used array beamforming to locate seismic noise sources at the proposed LIGO-India site. LIGO GET-GO visiting researcher at the University of Glasgow on glitch classification, and with UC Davis on galaxy cluster mergers. Beyond research: writing, music, and a future filled with cats and coffees.",

  tags: [
    "Rotational Seismology",
    "Newtonian Noise",
    "Array Seismology",
    "LIGO-India",
    "GW Detector Characterisation",
    "Machine Learning",
  ],

  about: {
    base:         "Munich, Germany · LMU Munich (RING project)",
    affiliations: "LMU Munich · LIGO Scientific Collaboration · NewAthena SWG2/6",
    toolkit:      "Python · ObsPy · TwistPy · GWpy · PyTorch · TensorFlow · TOPCAT · QGIS",
    languages:    "English (C2) · Hindi · Tamil · German (B1)"
  },

  /* ── Research ───────────────────────────────────────────────── */
  research: [
    {
      badge:     "Master's Thesis · IUCAA Pune",
      badgeType: "warm",
      title:     "Seismic Noise Source Localisation for GW Detectors",
      description: "Built a beamforming pipeline combining MUSIC and FK analysis on continuous seismic data recorded at the proposed LIGO-India site. Applied it to track the evolution of cyclone-generated secondary microseismic sources during Cyclones Amphan (2020) and Nisarga (2020), recovering stable directional estimates consistent with independently reported storm trajectories. Presented at the LVK Collaboration Meeting, Pisa, 2026.",
      tools: ["ObsPy", "TwistPy", "FK Analysis", "MUSIC", "Python"],
      link:  null   // ← add paper/poster URL when available
    },
    {
      badge:     "LIGO GETGO · University of Glasgow",
      badgeType: "blue",
      title:     "GravitySpy Retraining on O4 LIGO Data",
      description: "Retraining the attention-based convolutional classifier used for automated glitch identification in LIGO gravitational-wave strain data. Work includes revising the class taxonomy — deprecating morphologies absent from O4, and integrating newly identified transient classes — to keep the model current with the evolving noise environment of the detectors.",
      tools: ["TensorFlow", "GWpy", "CNN", "O4 Strain Data"],
      link:  null
    },
    {
      badge:     "UC Davis · Remote",
      badgeType: "warm",
      title:     "Galaxy Cluster Mergers — HYPERION-X",
      description: "Multi-wavelength search for galaxy cluster mergers combining optical (SDSS/WHL), X-ray (XMM-Newton, Chandra), and Sunyaev-Zel'dovich data. Identified three merger candidates with associated radio relics in SPT cluster data and a merger in Abell 2355. Co-developed the HYPERION-X pipeline, which extends WHL member-galaxy photometry with an ML-assisted BCG morphology classifier. Paper in preparation.",
      tools: ["SDSS", "XMM-Newton", "Chandra", "SZ Data", "TOPCAT", "Python"],
      link:  null
    }
  ],

  /* ── Side projects ──────────────────────────────────────────── */
  sideProjects: [
    {
      title:       "Geo-Goldilocks",
      description: "Hybrid ML + MILP pipeline for optimal resource-centre placement. Zone-level suitability scoring using geospatial features, followed by a MILP-based Top-K selector with capacity and coverage constraints. Built for Climitra's open sustainability challenge.",
      link:        null
    },
    {
      title:       "Stellar Cluster ABM",
      description: "NetLogo agent-based model of stellar formation, gas-cloud collapse, and gravitational cluster dynamics. Agents represent gas parcels governed by simplified N-body and thermodynamic rules; emergent behaviour produces recognisable cluster morphologies.",
      link:        null
    },
    {
      title:       "Chandrayaan-2 IIRS Spectral Classifier",
      description: "Led team Orbital Outlaws at the ISRO Bhartiya Antriksh Hackathon. Developed an ML pipeline for spectral classification of lunar surface features using Chandrayaan-2 IIRS hyperspectral imaging data.",
      link:        null
    },
    {
      title:       "ERT Dam-Fault Pipeline",
      description: "ResIPy-based electrical resistivity tomography processing pipeline combined with a modified U-Net inversion workflow for subsurface characterisation of fault structures beneath dam foundations.",
      link:        null
    }
  ],

  /* ── Workshops & blog ───────────────────────────────────────── */
  workshops: [
    {
      title:       "GeoNews & GeoChronicles",
      description: "Editor-in-Chief of the EAGE IIT ISM Student Chapter's two newsletters (2023–2025), covering advances in exploration and applied geophysics. Two years of consistent fortnightly publication.",
      year:        "2023–2025"
    },
    {
      title:       "ARKA Astronomy Club",
      description: "Event Management Head — organised biweekly journal readings, star-gazing nights, and a cryptic pick-your-own-adventure science competition for the Concetto techfest.",
      year:        "2022–2024"
    },
    {
      title:       "True sight",
      description: "Essay for the Blind People's Association Success Stories series: an interview with Dr Krunal Shastri on measuring vision by what is present rather than what is absent. More science writing to follow.",
      year:        "Essay"
    }
  ],

  /* ── Certifications & honours ───────────────────────────────── */
  certifications: [
    {
      label:   "ML & AI",
      content: "Machine Learning Specialisation — Stanford / DeepLearning.AI (100%) · MIT Introduction to Python — edX (98%) · Amazon ML Summer School 2024 · AI Winter School 2025, Brown University"
    },
    {
      label:   "GW & Astronomy",
      content: "GW Open Data Workshop 2024 · GW Detector Characterisation Workshop 2025 · Radio Astronomy Winter School — NCRA-TIFR / IUCAA · NewAthena Science Community Active Member Researcher · ISRO Agnirva Space Technology Internship"
    },
    {
      label:   "Honours",
      content: "IAAC International Astronomy and Astrophysics Competition — Gold Honour, Top 1% worldwide (20/20) · NASA Exoplanet Watch Citizen Scientist (AAVSO: AANL) · IELTS Academic Band 8.5"
    }
  ],

  /* ── Contact ────────────────────────────────────────────────── */
  contact: {
    email1:       "ananya.anandharaman@lmu.de",
    email2:       "ananyaiitism@gmail.com",
    github:       "https://github.com/ananyao-o",
    githubHandle: "ananyao-o",
    linkedin:     "https://www.linkedin.com/in/ananya-anandharaman-428184238/",
    cv:           "assets/cv/Ananya_Anandharaman_Resume.pdf",
  },

  /* ── Vehicles ───────────────────────────────────────────────────────────
     Replace imageSrc with your own SVG/PNG doodles any time.
     See assets/vehicles/HOW_TO_REPLACE.md for instructions.            */
  vehicles: [
    { id: "car",     imageSrc: "assets/vehicles/car.svg",     width: 56, height: 24, count: 3, speedRange: [0.55, 1.15], lane: 0.76 },
    { id: "bus",     imageSrc: "assets/vehicles/bus.svg",     width: 74, height: 28, count: 1, speedRange: [0.32, 0.58], lane: 0.76 },
    { id: "bicycle", imageSrc: "assets/vehicles/bicycle.svg", width: 34, height: 24, count: 2, speedRange: [0.24, 0.42], lane: 0.79 }
  ],

  /* ── Media gallery ──────────────────────────────────────────────────────
     Set file: "assets/media/filename.jpg" once you drop images in.
     Items with file: null show as placeholder cards.                   */
  media: [
    {
      name: "Field Work & Detector Sites", icon: "🔬",
      items: [
        { file: null, caption: "LIGO-India Proposed Site",                  placeholder: "assets/media/ligo-india-site.jpg",  date: ""     },
        { file: null, caption: "Seismic Array Deployment",                  placeholder: "assets/media/seismic-array.jpg",    date: ""     },
        { file: null, caption: "Field Campaign",                            placeholder: "assets/media/field-campaign.jpg",   date: ""     }
      ]
    },
    {
      name: "Conferences & Talks", icon: "🎤",
      items: [
        { file: null, caption: "LVK Collaboration Meeting, Pisa",           placeholder: "assets/media/lvk-pisa-2026.jpg",    date: "2026" },
        { file: null, caption: "GW Detector Characterisation Workshop 2025",placeholder: "assets/media/gwdc-2025.jpg",        date: "2025" },
        { file: null, caption: "Poster Presentation",                       placeholder: "assets/media/poster.jpg",           date: ""     }
      ]
    },
    {
      name: "Outreach & Workshops", icon: "🌟",
      items: [
        { file: null, caption: "ARKA Observation Night",                    placeholder: "assets/media/arka-observation.jpg", date: ""     },
        { file: null, caption: "EAGE Student Chapter Event",                placeholder: "assets/media/eage-event.jpg",       date: ""     }
      ]
    },
    {
      name: "Everything Else", icon: "📷",
      items: []
    }
  ]
};

window.__PORTFOLIO_CONFIG__ = window.SITE_CONFIG;
