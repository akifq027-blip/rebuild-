import {
  HistoricalEra,
  ArtifactItem,
  EraChallenge,
  HistoricalEvent,
  SourceReference,
  RegionalPath,
} from '../types/history';

export const ACADEMIC_SOURCES: Record<string, SourceReference> = {
  asi_harappa: {
    id: 'asi_harappa',
    title: 'Excavations at Harappa and Mohenjo-daro',
    authorOrInstitution: 'Archaeological Survey of India (ASI)',
    category: 'Government / Institutional',
    link: 'https://asi.nic.in',
    description: 'Archaeological site excavation reports, town planning records, and architectural cataloguing.',
  },
  ncert_history: {
    id: 'ncert_history',
    title: 'Themes in Indian History, Class XI & XII',
    authorOrInstitution: 'National Council of Educational Research and Training (NCERT)',
    category: 'Educational',
    link: 'https://ncert.nic.in',
    description: 'National curriculum standard reference on Indian archaeology, epigraphy, and historical periods.',
  },
  national_museum: {
    id: 'national_museum',
    title: 'Harappan Archaeology & Numismatics Gallery Catalogues',
    authorOrInstitution: 'National Museum, New Delhi',
    category: 'Museum / Heritage',
    link: 'https://nationalmuseumindia.gov.in',
    description: 'Artifact classifications, steatite seals, terracotta figurines, and coin collections.',
  },
  unesco_dholavira: {
    id: 'unesco_dholavira',
    title: 'Dholavira: A Harappan City (World Heritage Inscription)',
    authorOrInstitution: 'UNESCO World Heritage Centre',
    category: 'Museum / Heritage',
    link: 'https://whc.unesco.org/en/list/1644',
    description: 'Comprehensive documentation of hydraulic engineering, stone reservoirs, and urban stratigraphy in Kutch.',
  },
  epigraphia_indica: {
    id: 'epigraphia_indica',
    title: 'Inscriptions of Asoka and Early Dynastic Records',
    authorOrInstitution: 'Epigraphia Indica / Archaeological Survey of India',
    category: 'Academic',
    link: 'https://asi.nic.in/epigraphical-studies',
    description: 'Primary source epigraphical transcriptions of rock edicts, pillar inscriptions, and land grants.',
  },
};

export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'early_settlements',
    chapterNumber: 1,
    title: 'Early Settlements',
    subtitle: 'From foraging to agrarian village communities',
    approximateTimeDescription: 'Pre-7000 BCE to c. 2600 BCE (All dates approximate)',
    description:
      'Human presence in the Indian subcontinent extends deep into the Paleolithic and Mesolithic eras (Bhimbetka rock shelters). Across regional river valleys and foothill zones, communities learned to cultivate wild seeds, domesticate cattle and sheep, and construct permanent wattle-and-daub hamlets.',
    evidenceStatus: 'Archaeological evidence',
    regions: ['Mehrgarh (Balochistan)', 'Belan Valley (Uttar Pradesh)', 'Bhimbetka (Madhya Pradesh)', 'Burzahom (Kashmir)', 'Deccan Ashmounds'],
    keyDevelopments: [
      'Domestication of zebu cattle, sheep, and six-row barley',
      'Rock art documentation of hunter-gatherer lifeways',
      'Microlithic blades and polished celts for wood-clearing',
      'Subterranean pit dwellings and circular mud-walled houses',
    ],
    unlocked: true,
    completed: true,
    unlockRequirements: {
      population: 5,
      description: 'Starting Chapter of Civilization',
    },
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'harappan',
    chapterNumber: 2,
    title: 'Indus / Harappan Civilization',
    subtitle: 'Urban planning, brick architecture, hydraulic systems and long-distance trade',
    approximateTimeDescription: 'c. 2600 BCE – 1900 BCE (Mature Phase)',
    description:
      'Archaeological excavations across the northwestern subcontinent reveal large, planned settlements characterized by standardized sun-dried and fired bricks (ratio 4:2:1), sophisticated covered drainage networks, public stepwells, specialized bead workshops, and steatite stamp seals.',
    evidenceStatus: 'Archaeological evidence',
    regions: ['Mohenjo-daro & Harappa (Indus Basin)', 'Dholavira & Lothal (Gujarat)', 'Kalibangan (Rajasthan)', 'Rakhigarhi (Haryana)'],
    keyDevelopments: [
      'Standardized brick ratios (1:2:4) and grid-pattern city sectors',
      'Covered street drains with inspection sumps and brick soak pits',
      'Monumental hydraulic architecture: Dholavira stone reservoirs and Lothal tidal dock',
      'Maritime and overland trade networks reaching Dilmun (Bahrain) and Mesopotamia',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 7,
      techIdRequired: 'agriculture',
      challengeRequired: 'harappan_urban_planning',
      description: 'Reach Population 7, research Agriculture, and solve the Harappan Urban Challenge.',
    },
    sources: [ACADEMIC_SOURCES.asi_harappa, ACADEMIC_SOURCES.unesco_dholavira, ACADEMIC_SOURCES.national_museum],
  },
  {
    id: 'vedic',
    chapterNumber: 3,
    title: 'Vedic Period',
    subtitle: 'Pastoral-agrarian lifeways, oral transmission, and community assemblies',
    approximateTimeDescription: 'c. 1500 BCE – 600 BCE',
    description:
      'Characterized by the composition and meticulous oral preservation of the Vedic hymns, pastoral transhumance, and gradual transition towards settled agricultural communities along the Indo-Gangetic divide. Knowledge was transmitted through precise oral traditions across generations.',
    evidenceStatus: 'Textual & archaeological evidence',
    regions: ['Sapta Sindhu region', 'Upper & Middle Gangetic plains', 'Painted Grey Ware (PGW) sites'],
    keyDevelopments: [
      'Rigvedic and Later Vedic oral composition and metrical recitation systems',
      'Pastoral cattle-rearing integrated with iron-assisted clearing of gangetic forests',
      'Community assemblies (Sabha and Samiti) and seasonal sacrificial rituals',
      'Painted Grey Ware (PGW) pottery associated with emerging agrarian settlements',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 9,
      techIdRequired: 'water_management',
      challengeRequired: 'vedic_knowledge',
      description: 'Reach Population 9 and solve the Vedic Seasonal Planning Challenge.',
    },
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'mahajanapadas',
    chapterNumber: 4,
    title: 'Mahajanapadas & Early Cities',
    subtitle: 'The second urbanization, punch-marked coinage, and civic republics',
    approximateTimeDescription: 'c. 600 BCE – 320 BCE',
    description:
      'A transformative era of renewed urban growth in the Ganga-Yamuna valley. Sixteen major regional polities (Mahajanapadas)—consisting of monarchies and oligarchic republics (Ganasanghas)—flourished alongside organized merchant guilds (Shrenis), punch-marked silver coinage, and philosophical movements.',
    evidenceStatus: 'Textual & archaeological evidence',
    regions: ['Magadha', 'Vajji Confederacy', 'Kosala', 'Avanti', 'Gandhara (Taxila)'],
    keyDevelopments: [
      'First metallic currency: punch-marked silver and copper coins (Karshapanas)',
      'Northern Black Polished Ware (NBPW) luxury tableware with lustrous glaze',
      'Rise of organized craft and trading guilds (Shrenis)',
      'Philosophical discourses of the Upanishads, Buddhism, and Jainism',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 12,
      techIdRequired: 'trade',
      description: 'Reach Population 12 and unlock Regional Trade technology.',
    },
    sources: [ACADEMIC_SOURCES.ncert_history, ACADEMIC_SOURCES.national_museum],
  },
  {
    id: 'mauryan',
    chapterNumber: 5,
    title: 'Mauryan Period',
    subtitle: 'Imperial integration, Ashokan rock edicts, and monumental public works',
    approximateTimeDescription: 'c. 322 BCE – 185 BCE',
    description:
      'Under Chandragupta and Ashoka, the subcontinent witnessed extensive political coordination, trunk highway construction (ancestor of the Grand Trunk Road), standardized state revenue systems, and the engraving of moral-governance edicts on rocks and polished sandstone pillars.',
    evidenceStatus: 'Textual & archaeological evidence',
    regions: ['Pataliputra (Patna)', 'Sarnath & Sanchi', 'Taxila', 'Tosali (Odisha)', 'Brahmagiri (Karnataka)'],
    keyDevelopments: [
      'Ashokan Major and Minor Rock and Pillar Edicts in Prakrit, Greek, and Aramaic',
      'Construction of the Royal Road connecting the northwest frontiers to the Bay of Bengal',
      'Establishment of state welfare infrastructure: hospitals for humans and animals, shade trees, and rest houses',
      'Polished stone sculpture craftsmanship exemplified by the Sarnath Lion Capital',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 15,
      challengeRequired: 'mauryan_governance',
      description: 'Complete the Ashokan Governance & Ethical Welfare Challenge.',
    },
    sources: [ACADEMIC_SOURCES.epigraphia_indica, ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'gupta',
    chapterNumber: 6,
    title: 'Gupta Period',
    subtitle: 'Classical mathematics, astronomy, Sanskrit literature and metallurgy',
    approximateTimeDescription: 'c. 320 CE – 550 CE',
    description:
      'Associated with groundbreaking advancements in the sciences and humanities: decimal place-value mathematics, zero, Aryabhata’s spherical Earth calculations, rust-resistant forge-welded iron (Delhi Iron Pillar), Kalidasa’s drama, and Ajanta cave murals.',
    evidenceStatus: 'Multi-source documentation',
    regions: ['Pataliputra', 'Ujjain (Astronomical Meridian)', 'Nalanda (Bihar)', 'Ajanta (Maharashtra)'],
    keyDevelopments: [
      'Mathematical treatises on trigonometry, decimal notation, and sine tables',
      'Astronomical computation of eclipses and planetary motion (Aryabhatiya)',
      'High-grade metallurgy: forge-welded, corrosion-resistant wrought iron',
      'Structural Hindu and Buddhist temple architecture (Deogarh, Sanchi Temple 17)',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 18,
      challengeRequired: 'gupta_astronomy_math',
      description: 'Solve the Gupta Astronomical & Mathematical Challenge.',
    },
    sources: [ACADEMIC_SOURCES.ncert_history, ACADEMIC_SOURCES.national_museum],
  },
  {
    id: 'medieval',
    chapterNumber: 7,
    title: 'Medieval India & Regional Dynasties',
    subtitle: 'Monumental stone temple engineering, irrigation networks and maritime empires',
    approximateTimeDescription: 'c. 600 CE – 1300 CE',
    description:
      'A multipolar era of distinct regional kingdoms (Cholas, Chalukyas, Pallavas, Rashtrakutas, Gurjara-Pratiharas, Palas). Characterized by monumental granite stone architecture (Brihadisvara at Thanjavur), vast irrigation rain-fed tank systems (Eris), and extensive Chola naval trade spanning Southeast Asia.',
    evidenceStatus: 'Multi-source documentation',
    regions: ['Thanjavur & Kanchipuram (Tamil Nadu)', 'Badami & Pattadakal (Karnataka)', 'Khajuraho (Madhya Pradesh)', 'Nalanda & Somapura (Bengal)'],
    keyDevelopments: [
      'Chola naval expeditions across the Bay of Bengal to Srivijaya (Sumatra/Malaya)',
      'Intricate hydraulic rain-fed reservoir networks (Eri system) supporting double-cropping',
      'Lost-wax bronze casting excellence (Chola Nataraja bronzes)',
      'Development of regional linguistic literatures (Tamil, Kannada, Telugu, Odia, Bengali)',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 22,
      description: 'Reach Population 22 and cultivate regional cultural hubs.',
    },
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'mughal',
    chapterNumber: 8,
    title: 'Mughal Period',
    subtitle: 'Perso-Indian syncretic architecture, Charbagh water gardens and global textile trade',
    approximateTimeDescription: 'c. 1526 CE – 1707 CE',
    description:
      'Marked by the synthesis of Persian, Central Asian, and indigenous Indian architectural and administrative traditions. Celebrated for geometric Charbagh water garden layouts, white marble pietra dura inlay, imperial Karkhana craft workshops, and high-volume cotton textile exports.',
    evidenceStatus: 'Multi-source documentation',
    regions: ['Agra & Delhi', 'Lahore & Fatehpur Sikri', 'Bengal textile centres (Dhaka)', 'Gujarat ports (Surat)'],
    keyDevelopments: [
      'Charbagh quadrilateral gardens with running water channels, fountains, and pavilions',
      'Architectural masterworks integrating sandstone, marble, and vaulted domes',
      'Standardized land revenue survey and currency minting (Rupiya and Dam)',
      'Indian handloom cotton muslins, calicos, and chintz capturing worldwide maritime trade',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 26,
      challengeRequired: 'mughal_architecture',
      description: 'Design a historically inspired Charbagh Water Pavilion complex.',
    },
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'regional_centres',
    chapterNumber: 9,
    title: 'Regional Kingdoms & Cultural Centres',
    subtitle: 'Maratha confederacies, Rajput chivalry, Sikh traditions and southern centres',
    approximateTimeDescription: 'c. 1650 CE – 1800 CE',
    description:
      'Rather than a single monolithic empire, this period was defined by the dynamic resurgence of regional polities: the Maratha swarajya and hill-fort defense networks, Rajput painting ateliers, the Sikh Misl confederacies, the Kingdom of Mysore, and Travancore maritime commerce.',
    evidenceStatus: 'Multi-source documentation',
    regions: ['Deccan Hill Forts (Raigad, Pratapgad)', 'Jaipur & Mewar (Rajasthan)', 'Punjab & Amritsar', 'Mysore & Srirangapatna', 'Travancore (Kerala)'],
    keyDevelopments: [
      'Maratha naval and hill-fort defensive architecture designed to withstand artillery',
      'Unique regional school of miniature painting (Kangra, Basholi, Mewar, Kishangarh)',
      'Mysorean military rocketry utilizing iron-cased propellant tubes',
      'Decentralized agrarian revenue agreements and trade pass networks',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 30,
      description: 'Reach Population 30 to support regional military and craft centres.',
    },
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'european_arrival',
    chapterNumber: 10,
    title: 'European Arrival & Maritime Trade',
    subtitle: 'Factory settlements, chartered trading companies, and coastal rivalry',
    approximateTimeDescription: 'c. 1498 CE – 1765 CE',
    description:
      'Beginning with Vasco da Gama’s landing at Calicut (1498), European trading companies (Portuguese, Dutch, French, and British East India Companies) established fortified coastal factories. Initially participating as merchant traders in the Indian Ocean, commercial competition gradually shifted toward territorial control.',
    evidenceStatus: 'Multi-source documentation',
    regions: ['Surat & Goa (West Coast)', 'Calicut & Cochin (Malabar)', 'Madras (Fort St. George)', 'Calcutta & Pondicherry'],
    keyDevelopments: [
      'Establishment of maritime customs factories, bonded warehouses, and private company armies',
      'Commercial silver imports exchanging for Indian calicos, silk, saltpetre, and spices',
      'Naval armadas competing for control over Arabian Sea and Bay of Bengal shipping lanes',
      'The 1765 Treaty of Allahabad granting the East India Company the Diwani (revenue collection rights) of Bengal',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 35,
      description: 'Reach Population 35 and establish maritime trade contacts.',
    },
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'colonial',
    chapterNumber: 11,
    title: 'British Colonial Period',
    subtitle: 'Revenue systems, railways, industrial impact, print culture and national awakening',
    approximateTimeDescription: 'c. 1765 CE – 1947 CE',
    description:
      'Colonial governance reshaped rural land revenues (Permanent Settlement, Ryotwari, Mahalwari), laid thousands of miles of railway tracks, reorganized forest resources, and deindustrialized traditional artisan weavers while fostering modern print presses, educational universities, and anti-colonial mass movements.',
    evidenceStatus: 'Multi-source documentation',
    regions: ['Calcutta, Bombay & Madras Presidencies', 'Canal colonies of Punjab', 'Deccan cotton hinterlands', 'Tea plantations of Assam'],
    keyDevelopments: [
      'Construction of extensive railway networks connecting agricultural hinterlands to coastal export ports',
      'Establishment of modern universities (Calcutta, Bombay, Madras 1857) and multilingual print newspapers',
      'Severe agrarian famines alongside the drain of wealth analyzed by early nationalist economists (Dadabhai Naoroji)',
      'The emergence of broad-based freedom movements encompassing constitutional, grassroots, and revolutionary methods',
    ],
    unlocked: false,
    completed: false,
    unlockRequirements: {
      population: 40,
      description: 'Reach Population 40 and complete all primary civilization milestones.',
    },
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
];

export const HISTORICAL_ARTIFACTS: ArtifactItem[] = [
  {
    id: 'art_steatite_seal',
    eraId: 'harappan',
    name: 'Unicorn Steatite Stamp Seal',
    category: 'Seals',
    period: 'Mature Harappan (c. 2500–1900 BCE)',
    region: 'Mohenjo-daro (Sindh)',
    discovered: false,
    description:
      'Carved from soft steatite and fired with a white alkali glaze, depicting a mythical single-horned bovine standing before an offering vessel, with brief incised glyphs across the top edge.',
    historicalSignificance:
      'Used by merchants to stamp clay bullae on merchant bales shipped across the Arabian Sea. The Indus script remains undeciphered, and theories regarding whether symbols represent phonetic syllables or logograms remain an active scholarly debate.',
    evidenceStatus: 'Archaeological evidence',
    rewardKnowledge: 20,
    sources: [ACADEMIC_SOURCES.national_museum, ACADEMIC_SOURCES.asi_harappa],
  },
  {
    id: 'art_bronze_girl',
    eraId: 'harappan',
    name: 'Dancing Girl Bronze Figurine',
    category: 'Sculptures',
    period: 'Mature Harappan (c. 2300 BCE)',
    region: 'Mohenjo-daro (Sindh)',
    discovered: false,
    description:
      'A 10.5-centimetre-tall bronze statuette cast using the lost-wax (cire-perdue) technique, depicting a young woman standing in a dynamic posture with one hand on her hip and arms adorned with bangles.',
    historicalSignificance:
      'Demonstrates mastery of metallurgy, lost-wax casting, and an appreciation for human anatomical proportions over four millennia ago.',
    evidenceStatus: 'Archaeological evidence',
    rewardKnowledge: 25,
    sources: [ACADEMIC_SOURCES.national_museum],
  },
  {
    id: 'art_chert_weights',
    eraId: 'harappan',
    name: 'Standardized Chert Cubical Weights',
    category: 'Tools',
    period: 'Mature Harappan (c. 2600–1900 BCE)',
    region: 'Harappa & Lothal',
    discovered: false,
    description:
      'Smooth, precisely cut cubes of polished chert stone adhering to a binary ratio at the lower end (1, 2, 4, 8, 16, 32, 64) and decimal ratios higher up.',
    historicalSignificance:
      'Indicates a centralized, subcontinent-wide system of weight standardization for taxing and trading precious stones, metals, and spices.',
    evidenceStatus: 'Archaeological evidence',
    rewardKnowledge: 15,
    sources: [ACADEMIC_SOURCES.asi_harappa],
  },
  {
    id: 'art_pgw_bowl',
    eraId: 'vedic',
    name: 'Painted Grey Ware Fine Ceramic Bowl',
    category: 'Pottery',
    period: 'Later Vedic / Iron Age (c. 1000–600 BCE)',
    region: 'Hastinapur & Atranjikhera (Upper Gangetic Plain)',
    discovered: false,
    description:
      'Thin-walled, well-levigated grey pottery fired in a reducing kiln and painted with delicate black geometric designs, swastikas, and dots.',
    historicalSignificance:
      'Archaeologically correlates with the settlements of the Later Vedic era and the earliest use of iron weapons and ploughshares in northern India.',
    evidenceStatus: 'Archaeological evidence',
    rewardKnowledge: 20,
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'art_punch_coin',
    eraId: 'mahajanapadas',
    name: 'Punch-Marked Silver Karshapana',
    category: 'Coins',
    period: 'Mahajanapada Period (c. 500–300 BCE)',
    region: 'Magadha / Taxila',
    discovered: false,
    description:
      'An irregular flat piece of silver punched with 5 distinct symbols including the sun, six-armed wheel, hill, and tree-in-railing.',
    historicalSignificance:
      'Marks the transition from barter to monetized commerce in ancient India, issued by merchant guilds (Shrenis) and early republican councils.',
    evidenceStatus: 'Archaeological evidence',
    rewardKnowledge: 25,
    sources: [ACADEMIC_SOURCES.national_museum],
  },
  {
    id: 'art_ashokan_capital',
    eraId: 'mauryan',
    name: 'Sarnath Lion Capital Fragment',
    category: 'Sculptures',
    period: 'Mauryan (c. 250 BCE)',
    region: 'Sarnath (Varanasi)',
    discovered: false,
    description:
      'Carved from a single monolithic block of Chunar sandstone, featuring four Asiatic lions seated back-to-back atop an abacus with an elephant, galloping horse, bull, and lion separated by Ashoka Dharmachakras.',
    historicalSignificance:
      'Renowned for its distinctive glass-like "Mauryan polish", adopted in 1950 as the official State Emblem of India.',
    evidenceStatus: 'Archaeological evidence',
    rewardKnowledge: 30,
    sources: [ACADEMIC_SOURCES.epigraphia_indica, ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'art_iron_pillar',
    eraId: 'gupta',
    name: 'Forge-Welded Rustless Iron Pillar Model',
    category: 'Tools',
    period: 'Gupta Era (c. 400 CE)',
    region: 'Udayagiri / Mehrauli (Delhi)',
    discovered: false,
    description:
      'A 7-metre-tall, 6-tonne column of wrought iron carrying a poetic Sanskrit inscription in the Gupta Brahmi script celebrating King Chandra.',
    historicalSignificance:
      'Exemplifies ancient Indian metallurgical skill; the high phosphorus content and passive protective iron-phosphate film have prevented rust for over 1,600 years.',
    evidenceStatus: 'Multi-source documentation',
    rewardKnowledge: 30,
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'art_chola_nataraja',
    eraId: 'medieval',
    name: 'Chola Lost-Wax Bronze Nataraja',
    category: 'Sculptures',
    period: 'Chola Dynasty (c. 10th–11th Century CE)',
    region: 'Thanjavur (Tamil Nadu)',
    discovered: false,
    description:
      'Bronze icon of Shiva dancing the Ananda Tandava within a flaming circular halo (prabhamandala), stepping upon the dwarf of ignorance (Apasmara).',
    historicalSignificance:
      'Globally celebrated synthesis of religious philosophy, kinetic grace, and supreme casting expertise following the Shilpa Shastras.',
    evidenceStatus: 'Archaeological evidence',
    rewardKnowledge: 30,
    sources: [ACADEMIC_SOURCES.national_museum],
  },
];

export const ERA_CHALLENGES: Record<string, EraChallenge> = {
  harappan_urban_planning: {
    id: 'harappan_urban_planning',
    eraId: 'harappan',
    title: 'The Harappan Urban & Hydraulic Challenge',
    subtitle: 'Town planning, standardized brick drainage and water security',
    description:
      'Your settlement is growing along the river basin. Monsoon inundations threaten unbaked mud walls, while expanding residential sectors require systematic wastewater drainage.',
    gameplayInstructions:
      'Select a town planning strategy based on archaeological evidence from sites such as Mohenjo-daro, Kalibangan, and Dholavira.',
    historicalContext:
      'Harappan cities were divided into a raised Western Citadel (for communal/civic structures) and a Lower Town for residential living. Streets were laid in cardinal grid alignments, and nearly every house had an enclosed bathing area connected via terra-cotta conduits to covered street drains.',
    options: [
      {
        id: 'opt_drainage_grid',
        label: 'Construct Covered Fired-Brick Drains & Soak Pits',
        historicalBasis: 'Evidence from Mohenjo-daro Lower Town street drainage channels.',
        rewardKnowledge: 25,
        rewardCulture: 15,
        consequenceText:
          'Your community gains high sanitation stability! Wastewater flows cleanly away from living quarters into inspection sumps.',
      },
      {
        id: 'opt_dholavira_reservoirs',
        label: 'Carve Deep Stone Reservoirs & Rainwater Bunds',
        historicalBasis: 'Evidence from Dholavira stone-cut reservoirs and stormwater bunds.',
        rewardKnowledge: 30,
        rewardCulture: 20,
        consequenceText:
          'Monsoon torrents are captured in deep stone-lined step tanks, ensuring water self-sufficiency through dry arid seasons.',
      },
    ],
    sources: [ACADEMIC_SOURCES.asi_harappa, ACADEMIC_SOURCES.unesco_dholavira],
  },
  vedic_knowledge: {
    id: 'vedic_knowledge',
    eraId: 'vedic',
    title: 'The Seasonal Astronomy & Oral Transmission Challenge',
    subtitle: 'Synchronizing pastoral-agrarian cycles with astronomical observation',
    description:
      'The monsoons have shifted. Elders and agriculturists need to determine when to sow barley and prepare winter fodder through systematic celestial and seasonal observation.',
    gameplayInstructions:
      'Choose an institutional approach to record and transmit seasonal agricultural wisdom across generations.',
    historicalContext:
      'The Vedanga Jyotisha and early pastoral songs tracked the solstices (Ayana) and lunar nakshatras to coordinate agricultural timing and community assemblies without written papyrus.',
    options: [
      {
        id: 'opt_oral_metrics',
        label: 'Establish Metrical Chanting & Oral Preservation Guilds',
        historicalBasis: 'Rigvedic metrical preservation (Pada-patha, Krama-patha) preserving accents intact for millennia.',
        rewardKnowledge: 25,
        rewardCulture: 25,
        consequenceText:
          'Community memory becomes resilient! Generational knowledge of rainfall patterns and seeds is flawlessly preserved.',
      },
      {
        id: 'opt_pastoral_agri_split',
        label: 'Balance River Alluvium Sowing with Cattle Transhumance',
        historicalBasis: 'Archaeological evidence of mixed pastoral-agrarian economies at Bhagwanpura and Atranjikhera.',
        rewardKnowledge: 20,
        rewardCulture: 20,
        consequenceText:
          'Livestock provide dairy and draught power, while silt plains yield strong barley harvests.',
      },
    ],
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  mauryan_governance: {
    id: 'mauryan_governance',
    eraId: 'mauryan',
    title: 'Ashokan Ethical Governance & Public Welfare',
    subtitle: 'Balancing state authority with moral edicts and civic welfare',
    description:
      'The empire connects distant provincial regions from Taxila to Karnataka. How will you coordinate civic administration and maintain peace among diverse religious and linguistic populations?',
    gameplayInstructions:
      'Determine how the empire communicates with its populace and allocates treasury reserves.',
    historicalContext:
      'Following the Kalinga War, Ashoka promulgated Dhamma through inscriptions on prominent rock faces and polished pillars. Officers known as Dhamma Mahamattas were appointed to oversee public welfare, prison reforms, and medical facilities for humans and animals.',
    options: [
      {
        id: 'opt_inscribe_edicts',
        label: 'Inscribe Public Welfare Edicts & Build Medical Rest Houses',
        historicalBasis: 'Ashokan Major Rock Edict II & Pillar Edict VII detailing herbal botanical gardens and highway wells.',
        rewardKnowledge: 35,
        rewardCulture: 30,
        consequenceText:
          'Civic harmony flourishes! Travelers along trunk roads find shade trees, freshwater stepwells, and medicinal clinics.',
      },
      {
        id: 'opt_road_infrastructure',
        label: 'Construct the Royal Trunk Highway with Mile-Markers',
        historicalBasis: 'Megasthenes Indica descriptions of royal highways with distance markers and watchposts.',
        rewardKnowledge: 30,
        rewardCulture: 25,
        consequenceText:
          'Trade caravans, government messengers, and pilgrims travel safely across thousands of kilometres.',
      },
    ],
    sources: [ACADEMIC_SOURCES.epigraphia_indica, ACADEMIC_SOURCES.ncert_history],
  },
  gupta_astronomy_math: {
    id: 'gupta_astronomy_math',
    eraId: 'gupta',
    title: 'The Classical Mathematics & Astronomy Discovery',
    subtitle: 'Computing planetary orbits and decimal place-value calculations',
    description:
      'Scholars gathered at Ujjain and Pataliputra are debating the causes of solar eclipses and refining navigational calculations using sine trigonometric ratios.',
    gameplayInstructions:
      'Choose a scientific focus to fund in your civilization’s learning academies.',
    historicalContext:
      'Aryabhata (born 476 CE) proposed in the Aryabhatiya that the Earth rotates on its axis and that lunar eclipses are caused by the shadow of the Earth cast on the moon. Indian mathematicians formulated zero as both a concept and a functional symbol.',
    options: [
      {
        id: 'opt_planetary_models',
        label: 'Chart Earth’s Axial Rotation & Eclipse Geometries',
        historicalBasis: 'Aryabhata’s mathematical calculations of the sidereal rotation period and eclipse shadows.',
        rewardKnowledge: 45,
        rewardCulture: 25,
        consequenceText:
          'Astronomical calendars achieve extraordinary precision, benefiting agricultural scheduling and maritime navigation.',
      },
      {
        id: 'opt_decimal_trig',
        label: 'Standardize Decimal Place-Value & Sine (Jya) Tables',
        historicalBasis: 'Early Indian trigonometric tables (Jya and Kojya) transmitted later to Baghdad and Europe.',
        rewardKnowledge: 45,
        rewardCulture: 20,
        consequenceText:
          'Engineering and architectural surveying become rapid and reliable across your entire civilization.',
      },
    ],
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  mughal_architecture: {
    id: 'mughal_architecture',
    eraId: 'mughal',
    title: 'The Charbagh Water Pavilion Architecture Challenge',
    subtitle: 'Designing geometric quadrilateral gardens with flowing water channels',
    description:
      'Architects and master hydraulic engineers present plans for an imperial garden and civic assembly pavilion along the river terrace.',
    gameplayInstructions:
      'Choose the architectural design and hydraulic features for your historical complex.',
    historicalContext:
      'Mughal architecture synthesized indigenous Rajasthani jharokhas and chhatris with Persian symmetric four-fold Charbagh gardens, utilizing Persian waterwheels (saqiya) to maintain flowing water across terraced marble cascades (chadar).',
    options: [
      {
        id: 'opt_charbagh_saqiya',
        label: 'Construct Symmetrical Terraced Charbagh with Saqiya Wheels',
        historicalBasis: 'Gardens of Nishat Bagh (Kashmir) and Humayun’s Tomb (Delhi) hydraulic layouts.',
        rewardKnowledge: 35,
        rewardCulture: 40,
        consequenceText:
          'Cooling water breezes mitigate summer heat, and artisans gather in shaded marble cloisters.',
      },
      {
        id: 'opt_craft_karkhanas',
        label: 'Establish Imperial Craft Karkhanas for Inlay & Textiles',
        historicalBasis: 'State workshops (Karkhanas) employing master weavers, carpet knotters, and lapidary inlayers.',
        rewardKnowledge: 30,
        rewardCulture: 45,
        consequenceText:
          'Fine muslin, chintz, and pietra dura artwork make your city an international commercial emporium.',
      },
    ],
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
};

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'evt_monsoon_variation',
    eraId: 'harappan',
    title: 'Shifting River Courses & Monsoon Fluctuation',
    category: 'Environmental',
    whatHappened:
      'Tectonic shifts and decreased seasonal monsoon rains in the Ghaggar-Hakra / Saraswati river basin have caused river meanders to dry out, reducing regular flood silt deposits.',
    historicalContext:
      'Paleo-environmental studies indicate that climatic drying and shifting river courses were significant factors in the de-urbanization of mature Harappan centres around 1900 BCE, leading populations to migrate east towards the Gangetic valley and south into Gujarat.',
    evidenceStatus: 'Archaeological evidence',
    options: [
      {
        id: 'ev1_opt_reservoirs',
        label: 'Excavate Deeper Step-Tanks & Divert Tributary Bunds',
        gameEffectText: '+15 Knowledge, +20 Water security',
        knowledgeReward: 15,
        resourceBonus: { resource: 'water', amount: 20 },
        historicalExplanation:
          'Settlements like Dholavira survived in arid Kutch by constructing sixteen massive interconnected stone reservoirs.',
      },
      {
        id: 'ev1_opt_migrate_east',
        label: 'Establish Eastern Agrarian Hamlets in the Ganga Plains',
        gameEffectText: '+25 Food, +10 Culture',
        cultureReward: 10,
        resourceBonus: { resource: 'food', amount: 25 },
        historicalExplanation:
          'Late Harappan phases show an eastward shift of small agrarian hamlets into Haryana, Punjab, and western Uttar Pradesh.',
      },
    ],
    sources: [ACADEMIC_SOURCES.asi_harappa, ACADEMIC_SOURCES.unesco_dholavira],
  },
  {
    id: 'evt_maritime_monsoon_winds',
    eraId: 'mahajanapadas',
    title: 'Harnessing the Indian Ocean Monsoon Winds',
    category: 'Trade',
    whatHappened:
      'Coastal navigators in the Arabian Sea and Bay of Bengal have mapped the predictable seasonal reversal of the monsoon winds (Hippalus phenomenon documented in the Periplus).',
    historicalContext:
      'Ancient Indian sailors used the southwest summer monsoon to sail outward towards the Persian Gulf, Red Sea, and Southeast Asia, and the northeast winter monsoon to return home safely with valuable cargo.',
    evidenceStatus: 'Textual & archaeological evidence',
    options: [
      {
        id: 'ev2_opt_maritime_guild',
        label: 'Finance Ocean-Going Merchant Guilds (Manigramam)',
        gameEffectText: '+20 Knowledge, +15 Trade goods',
        knowledgeReward: 20,
        resourceBonus: { resource: 'trade', amount: 15 },
        historicalExplanation:
          'Merchant corporations (Shrenis) financed deep-water vessels exchanging Indian spices, beryls, and muslins for Roman gold.',
      },
      {
        id: 'ev2_opt_coastal_ports',
        label: 'Fortify Estuary Ports and Custom Stations',
        gameEffectText: '+25 Stone, +15 Culture',
        cultureReward: 15,
        resourceBonus: { resource: 'stone', amount: 25 },
        historicalExplanation:
          'Ports like Bharuch (Barygaza), Muziris, and Arikamedu developed into bustling cosmopolitan trading emporiums.',
      },
    ],
    sources: [ACADEMIC_SOURCES.national_museum, ACADEMIC_SOURCES.ncert_history],
  },
];

export const REGIONAL_PATHS: RegionalPath[] = [
  {
    id: 'reg_south',
    name: 'Southern India & Maritime Tamilakam',
    geographicRegion: 'Deccan & Far South (Coromandel & Malabar coasts)',
    distinctiveFeatures: [
      'Sangam literature celebrating poetry, landscape ecologies (Thinai), and trade',
      'Granite Dravidian temple architecture with soaring gopurams and pillared mandapas',
      'Extensive rain-fed reservoir networks (Eri tanks) and river barrages (Grand Anicut / Kallanai)',
    ],
    historicalHighlights:
      'Cholas, Pandyas, Cheras, and Vijayanagara established thriving trans-oceanic spice trade networks connecting Rome, Arabia, and China.',
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'reg_west',
    name: 'Western India & Gujarat Coast',
    geographicRegion: 'Gujarat, Rajasthan, and Maharashtra',
    distinctiveFeatures: [
      'Vibrant merchant maritime ports (Lothal, Bharuch, Surat) handling international commerce',
      'Intricate stepwell architecture (Rani ki Vav at Patan, Adalaj) providing water and cooling refuges',
      'Impregnable hill-fort defensive architecture (Maratha forts, Chittorgarh, Mehrangarh)',
    ],
    historicalHighlights:
      'Western India served as the primary gateway for oceanic trade, textile export, and craft guild autonomy.',
    sources: [ACADEMIC_SOURCES.asi_harappa],
  },
  {
    id: 'reg_north',
    name: 'Northern Alluvial Plains',
    geographicRegion: 'Indus & Gangetic Basins',
    distinctiveFeatures: [
      'Vast fertile alluvial soils yielding double-crop harvests of wheat, barley, and pulses',
      'Epicentres of the first and second urbanizations (Harappa, Pataliputra, Kashi, Delhi)',
      'Major academic universities (Nalanda, Takshashila) teaching grammar, logic, and medicine',
    ],
    historicalHighlights:
      'The Indo-Gangetic basin served as the seat for large imperial formations, philosophical developments, and trunk highways.',
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
  {
    id: 'reg_east',
    name: 'Eastern & Northeastern India',
    geographicRegion: 'Bengal, Odisha, and Brahmaputra Valley (Assam)',
    distinctiveFeatures: [
      'Terracotta brick temple art (Bishnupur) and Kalinga stone temple architecture (Konark, Puri)',
      'Rich wetlands, rice cultivation, and international riverine silk & muslin weaving',
      'Ahom kingdom statecraft and naval river defense on the Brahmaputra (Battle of Saraighat)',
    ],
    historicalHighlights:
      'Northeastern India maintained deep overland trade links with Southeast Asia and Southwest China while preserving distinct ecological traditions.',
    sources: [ACADEMIC_SOURCES.ncert_history],
  },
];
