import { AchievementBadge, HeritageDestination, HeritageQuest } from '../types';

export const HERITAGE_DESTINATIONS: HeritageDestination[] = [
  {
    id: 'a-famosa',
    name: 'A Famosa (Porta de Santiago)',
    shortName: 'A Famosa',
    location: 'Jalan Parameswara, Bandar Hilir, Melaka',
    era: '1511 Portuguese Era',
    category: 'Fortress',
    visitDuration: '45 mins',
    walkMinutesFromCenter: 5,
    sampleOpeningHours: 'Open daily, 24 hours (Sample Visitor Hours: 8:00 AM – 8:00 PM best daylight)',
    accessibilityNote: 'Level paved brick plaza from Jalan Parameswara; step-free approach to main archway.',
    accessibleFriendly: true,
    image: '/src/assets/images/a_famosa_present_1794854558664.jpg',
    historicalImage: '/src/assets/images/a_famosa_historical_1794854558414.jpg',
    historicalYear: '1511–1641',
    historicalTitle: 'Fortaleza de Malaca Reconstruction',
    description:
      'Built in 1511 under Alfonso de Albuquerque, A Famosa is one of the oldest surviving European architectural remains in Southeast Asia. Today, the weathered laterite stone Porta de Santiago gatehouse stands as the enduring emblem of Melaka’s layered Portuguese, Dutch, and British maritime history.',
    historicalSummary:
      'In the 16th century, Fortaleza de Malaca was an expansive coastal bastion featuring a towering central keep, four-meter-thick laterite ramparts, watchtowers, and cannons guarding the Strait of Malacca. Rebuilt by the Dutch East India Company (VOC) in 1670—whose crest remains carved above the arch—most of the walls were demolished in 1807 before Stamford Raffles intervened to save this lone gate.',
    highlights: [
      'Carved 1670 Dutch East India Company (VOC) coat of arms above the archway',
      'Porous reddish laterite stone masonry quarried locally in Melaka',
      'Original 16th-century coastal defense layout facing the Strait of Malacca',
    ],
    narrationScript:
      'Welcome to Porta de Santiago, the last standing gate of the 1511 A Famosa fortress. Look above the stone arch to see the 1670 VOC inscription added during Dutch rule. Switch to Historical View to see how the full coastal citadel once towered over the Strait of Malacca.',
    mapCoords: { x: 58, y: 66 },
    arCallouts: [
      {
        id: 'voc-crest',
        label: 'VOC Crest (1670)',
        detail: 'Carved after the Dutch captured Melaka and restored the southern gate.',
        xPercent: 50,
        yPercent: 34,
      },
      {
        id: 'laterite-arch',
        label: 'Laterite Masonry',
        detail: 'Iron-rich reddish blocks laid in 1511 using lime mortar and crushed sea shells.',
        xPercent: 32,
        yPercent: 58,
      },
      {
        id: 'coastal-bastion',
        label: 'Cannon Embrasure',
        detail: 'Guarded the southern approach along the old Melaka shoreline.',
        xPercent: 68,
        yPercent: 64,
      },
    ],
    tourHotspots: [
      {
        id: 'hs-porta',
        xPercent: 32,
        yPercent: 52,
        title: 'Porta de Santiago Gatehouse',
        era: '1511 / 1670',
        description: 'The sole surviving gateway of the five-bastion Portuguese fortress.',
      },
      {
        id: 'hs-strait',
        xPercent: 68,
        yPercent: 40,
        title: 'Reclaimed Strait Coastline',
        era: '16th Century Harbor',
        description: 'Before modern land reclamation, waves broke directly against the fortress seawalls.',
      },
    ],
  },
  {
    id: 'christ-church',
    name: 'Christ Church Melaka & Dutch Square',
    shortName: 'Christ Church',
    location: 'Jalan Gereja, Red Square, Melaka',
    era: '1753 Dutch Era',
    category: 'Colonial Landmark',
    visitDuration: '40 mins',
    walkMinutesFromCenter: 2,
    sampleOpeningHours: 'Sample Visitor Hours: Tue–Sun, 9:00 AM – 5:00 PM (Closed Mondays)',
    accessibilityNote: 'Flat brick courtyard at Dutch Square with ramped access into the main church hall.',
    accessibleFriendly: true,
    image: '/src/assets/images/christ_church_melaka_1794854559692.jpg',
    description:
      'Completed in 1753 to commemorate a century of Dutch presence in Melaka, Christ Church anchors the iconic terracotta-red Dutch Square alongside the Stadthuys and Queen Victoria Fountain.',
    historicalSummary:
      'Constructed with Dutch red bricks shipped as ship ballast and plastered with local Malaccan laterite clay, the church boasts 15-meter single-timber ceiling beams cut from single trees and handmade wooden pews over 250 years old.',
    highlights: [
      'Oldest functioning Protestant church in Malaysia (completed 1753)',
      'Adjacent to the 1650 Stadthuys, oldest Dutch building in Southeast Asia',
      'Iconic terracotta-red facade painted uniformly during British stewardship in 1911',
    ],
    narrationScript:
      'Standing at Dutch Square, you are looking at Christ Church Melaka, built in 1753. Its salmon-red walls sit beside the Stadthuys, forming the heart of Melaka’s UNESCO World Heritage Civic Zone.',
    mapCoords: { x: 48, y: 42 },
    arCallouts: [
      {
        id: 'bell-gable',
        label: 'Dutch Gable & Bell (1753)',
        detail: 'Cast bronze bell inscribed with the year 1698 still hangs above the gable.',
        xPercent: 46,
        yPercent: 30,
      },
      {
        id: 'stadthuys-wing',
        label: 'The Stadthuys (1650)',
        detail: 'Former residence of Dutch Governors, now the History & Ethnography Museum.',
        xPercent: 78,
        yPercent: 48,
      },
    ],
    tourHotspots: [
      {
        id: 'hs-square',
        xPercent: 22,
        yPercent: 48,
        title: 'Red Square & Stadthuys',
        era: '1650–1753',
        description: 'Civic hub of Dutch administration in the Malay Archipelago.',
      },
      {
        id: 'hs-river-bridge',
        xPercent: 52,
        yPercent: 65,
        title: 'Tan Kim Seng Bridge',
        era: '1862 Crossing',
        description: 'Connects Dutch Colonial Square directly into Peranakan Jonker Street.',
      },
    ],
  },
  {
    id: 'jonker-street',
    name: 'Jonker Street (Jalan Hang Jebat)',
    shortName: 'Jonker Street',
    location: 'Jalan Hang Jebat, Chinatown, Melaka',
    era: '17th Century Peranakan Heritage',
    category: 'Cultural Street',
    visitDuration: '60 mins',
    walkMinutesFromCenter: 4,
    sampleOpeningHours: 'Open daily (Sample Night Market Hours: Fri–Sun, 6:00 PM – 11:00 PM)',
    accessibilityNote: 'Step-free pedestrian street during evening market hours; narrow five-foot ways during daytime.',
    accessibleFriendly: true,
    image: '/src/assets/images/jonker_street_melaka_1794854568525.jpg',
    description:
      'Once known as the street of antiques and wealthy Baba-Nyonya townhouses, Jonker Street preserves centuries of Straits Chinese architecture, clan associations, and living culinary traditions.',
    historicalSummary:
      'During the Dutch and early British eras, affluent Peranakan merchant families built narrow, deep shophouses featuring ornate plasterwork, air-wells, and carved timber shutters blending Chinese, Malay, and European motifs.',
    highlights: [
      'Ornate Baba-Nyonya Straits Eclectic shophouse facades',
      'Historic clan houses and traditional artisan workshops',
      'Vibrant evening cultural promenade under crimson silk lanterns',
    ],
    narrationScript:
      'Cross the Melaka River into Jalan Hang Jebat, better known as Jonker Street. Notice how the shophouse facades blend Chinese auspicious motifs, Malay timber latticework, and European pilasters.',
    mapCoords: { x: 24, y: 36 },
    arCallouts: [
      {
        id: 'shophouse-shutters',
        label: 'Louvred Timber Shutters',
        detail: 'Designed for tropical cross-ventilation while preserving street privacy.',
        xPercent: 28,
        yPercent: 34,
      },
      {
        id: 'clan-signage',
        label: 'Gilded Clan Plaques',
        detail: 'Gold-leaf calligraphy naming ancestral lineages from Fujian and Guangdong.',
        xPercent: 72,
        yPercent: 38,
      },
    ],
    tourHotspots: [
      {
        id: 'hs-jonker-houses',
        xPercent: 76,
        yPercent: 52,
        title: 'Peranakan Shophouse Row',
        era: '18th–19th Century',
        description: 'Multi-generational merchant townhouses with interior courtyard air-wells.',
      },
    ],
  },
  {
    id: 'st-pauls-hill',
    name: "St. Paul's Hill & Church Ruins",
    shortName: "St. Paul's Hill",
    location: 'Bukit St. Paul, Bandar Hilir, Melaka',
    era: '1521 Portuguese / Dutch Era',
    category: 'Hilltop Ruins',
    visitDuration: '45 mins',
    walkMinutesFromCenter: 7,
    sampleOpeningHours: 'Open daily (Sample Recommended Hours: 7:30 AM – 7:00 PM)',
    accessibilityNote: 'Direct ascent involves 80+ steep stone steps; accessible step-free road loop available via Muzium Rakyat side.',
    accessibleFriendly: false,
    image: '/src/assets/images/st_pauls_hill_1794854560379.jpg',
    description:
      'Perched atop Bukit St. Paul overlooking the Strait of Malacca, the roofless stone church ruins began in 1521 as the Portuguese Chapel of Our Lady of the Hill before becoming a Dutch burial ground.',
    historicalSummary:
      'St. Francis Xavier stayed here in 1545 and was temporarily interred in its sanctuary in 1553. When the Dutch consecrated Christ Church below in 1753, the hilltop church was converted into a fortification and noble cemetery, leaving towering Dutch tombstones leaning along its stone walls.',
    highlights: [
      'Oldest church building ruins in Malaysia and Southeast Asia (1521)',
      '17th-century carved Dutch ledger tombstones inside the nave',
      'Panoramic sunset vista across the Strait of Malacca',
    ],
    narrationScript:
      'At the summit of St. Paul’s Hill stand the 1521 ruins of Our Lady of the Hill. From this vantage point, Portuguese sentries once spotted incoming spice fleets from across the Strait of Malacca.',
    mapCoords: { x: 64, y: 48 },
    arCallouts: [
      {
        id: 'nave-arches',
        label: '1521 Sanctuary Nave',
        detail: 'Laterite walls once crowned with a timber roof until Dutch fortification changes.',
        xPercent: 52,
        yPercent: 45,
      },
      {
        id: 'strait-horizon',
        label: 'Strait Lookout',
        detail: 'Strategic maritime elevation commanding the entire Melaka harbor.',
        xPercent: 18,
        yPercent: 42,
      },
    ],
    tourHotspots: [
      {
        id: 'hs-hilltop',
        xPercent: 44,
        yPercent: 32,
        title: "St. Paul's Hill Summit",
        era: '1521',
        description: 'Panoramic viewpoint connecting the hilltop sanctuary down to Porta de Santiago.',
      },
    ],
  },
  {
    id: 'maritime-museum',
    name: 'Maritime Museum (Flor de la Mar)',
    shortName: 'Maritime Museum',
    location: 'Jalan Merdeka, Bandar Hilir, Melaka',
    era: '1511 Maritime Trade Era',
    category: 'Maritime Heritage',
    visitDuration: '50 mins',
    walkMinutesFromCenter: 9,
    sampleOpeningHours: 'Sample Visitor Hours: Daily, 9:00 AM – 5:30 PM',
    accessibilityNote: 'Accessible riverside promenade approach; main ship gallery has narrow wooden deck stairs.',
    accessibleFriendly: true,
    image: '/src/assets/images/maritime_museum_melaka_1794854561618.jpg',
    description:
      'Housed inside a 34-meter-tall replica of the Portuguese carrack Flor de la Mar, the Maritime Museum chronicles Melaka’s rise as the crossroads of global spice trade.',
    historicalSummary:
      'Constructed to full scale along the Melaka River estuary, the vessel tells the story of the Melaka Sultanate’s cosmopolitan port—where Malay, Arab, Gujarati, Chinese, and European vessels exchanged silk, porcelain, cloves, and nutmeg.',
    highlights: [
      'Full-scale wooden replica of the 16th-century Flor de la Mar galleon',
      'Exhibits on the Melaka Sultanate’s maritime laws (Undang-Undang Laut Melaka)',
      'Dioramas of historic spice-route navigation instruments',
    ],
    narrationScript:
      'Moored beside the Melaka River estuary, this life-sized replica of the Flor de la Mar showcases why Melaka was prized as the greatest maritime entrepôt of the 15th and 16th centuries.',
    mapCoords: { x: 42, y: 78 },
    arCallouts: [
      {
        id: 'rigging-masts',
        label: 'Carrack Rigging (34m)',
        detail: 'Square-rigged mainmast built for long-haul Indian Ocean trade winds.',
        xPercent: 52,
        yPercent: 28,
      },
      {
        id: 'stern-gallery',
        label: 'Admiral Stern Castle',
        detail: 'Elevated wooden quarterdeck displaying historic nautical charts.',
        xPercent: 66,
        yPercent: 62,
      },
    ],
    tourHotspots: [
      {
        id: 'hs-river-dock',
        xPercent: 60,
        yPercent: 72,
        title: 'Melaka River Estuary',
        era: '15th–16th Century',
        description: 'Historic anchorage for trading junks, dhows, and Portuguese carracks.',
      },
    ],
  },
];

export const MELAKA_PANORAMA_IMAGE = '/src/assets/images/melaka_panorama_1794854565302.jpg';

export const HERITAGE_QUESTS: HeritageQuest[] = [
  {
    id: 'quest-a-famosa',
    title: 'Discover A Famosa',
    subtitle: 'Uncover the story of Porta de Santiago and its carved stone crest.',
    destinationId: 'a-famosa',
    xpReward: 100,
    badgeId: 'badge-fortress',
    estimatedMinutes: 5,
    questions: [
      {
        id: 'q1-1',
        question: 'In what year was the original A Famosa fortress constructed in Melaka?',
        options: ['1402', '1511', '1641', '1753'],
        correctIndex: 1,
        explanation: 'A Famosa was built in 1511 under Portuguese commander Alfonso de Albuquerque.',
      },
      {
        id: 'q1-2',
        question: 'Which European trading company carved the 1670 crest above Porta de Santiago?',
        options: [
          'British East India Company',
          'Dutch East India Company (VOC)',
          'Spanish Armada',
          'French Compagnie des Indes',
        ],
        correctIndex: 1,
        explanation: 'After capturing Melaka in 1641, the Dutch VOC restored the gate in 1670 and added its monogram.',
      },
    ],
  },
  {
    id: 'quest-dutch-square',
    title: 'Explore Dutch Square',
    subtitle: 'Trace the iconic terracotta-red landmarks of Jalan Gereja.',
    destinationId: 'christ-church',
    xpReward: 100,
    badgeId: 'badge-dutch',
    estimatedMinutes: 5,
    questions: [
      {
        id: 'q2-1',
        question: 'Which building at Dutch Square is the oldest surviving Dutch structure in Southeast Asia?',
        options: ['The Stadthuys (1650)', 'Jonker Walk Gate', 'Flor de la Mar', 'Victoria Fountain'],
        correctIndex: 0,
        explanation: 'Completed around 1650, the Stadthuys served as the official residence of Dutch governors.',
      },
    ],
  },
  {
    id: 'quest-artifacts',
    title: 'Identify Historical Artifacts',
    subtitle: 'Examine Peranakan woodwork, maritime charts, and fortress masonry.',
    destinationId: 'maritime-museum',
    xpReward: 100,
    badgeId: 'badge-artifacts',
    estimatedMinutes: 6,
    questions: [
      {
        id: 'q3-1',
        question: 'What iron-rich local stone was used to build A Famosa and St. Paul’s Church?',
        options: ['Marble', 'Laterite stone', 'Granite slate', 'Limestone'],
        correctIndex: 1,
        explanation: 'Porous reddish laterite stone (batu lada) was abundant locally and hardened upon exposure to air.',
      },
    ],
  },
  {
    id: 'quest-melaka-history',
    title: "Discover Melaka's History",
    subtitle: 'Master the timeline from the Melaka Sultanate to UNESCO recognition.',
    destinationId: 'st-pauls-hill',
    xpReward: 100,
    badgeId: 'badge-historian',
    estimatedMinutes: 7,
    questions: [
      {
        id: 'q4-1',
        question: 'In which year was Melaka inscribed as a UNESCO World Heritage City?',
        options: ['1998', '2004', '2008', '2015'],
        correctIndex: 2,
        explanation: 'Melaka and George Town were jointly inscribed as UNESCO World Heritage Sites on 7 July 2008.',
      },
      {
        id: 'q4-2',
        question: 'What maritime legal code governed shipping and trade during the Melaka Sultanate?',
        options: [
          'Undang-Undang Laut Melaka',
          'Treaty of Tordesillas',
          'Magna Carta Malacca',
          'VOC Maritime Charter',
        ],
        correctIndex: 0,
        explanation: 'The Undang-Undang Laut Melaka codified port duties, crew discipline, and sea trade across the Strait.',
      },
    ],
  },
  {
    id: 'quest-heritage-trail',
    title: 'Complete the Heritage Trail',
    subtitle: 'Connect all five Melaka landmarks from Jonker Street to the River Estuary.',
    destinationId: 'jonker-street',
    xpReward: 100,
    badgeId: 'badge-trail',
    estimatedMinutes: 8,
    questions: [
      {
        id: 'q5-1',
        question: 'Which bridge links Dutch Square directly across the Melaka River to Jonker Street?',
        options: [
          'Tan Kim Seng Bridge',
          'Penang Heritage Bridge',
          'Porta Walkway',
          'Klang River Span',
        ],
        correctIndex: 0,
        explanation: 'Tan Kim Seng Bridge crosses the Melaka River right between the Clock Tower and Jonker Walk.',
      },
      {
        id: 'q5-2',
        question: 'Who famously intervened in 1807 to preserve the Porta de Santiago gate from full demolition?',
        options: ['Stamford Raffles', 'Hang Tuah', 'Parameswara', 'Jan van Riebeeck'],
        correctIndex: 0,
        explanation: 'Sir Stamford Raffles convinced British authorities to spare Porta de Santiago while the outer walls were dismantled.',
      },
    ],
  },
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-fortress',
    title: 'Fortress Finder',
    description: 'Decoded the architectural history of Porta de Santiago.',
    iconName: 'shield',
    criteria: 'Complete Discover A Famosa',
  },
  {
    id: 'badge-dutch',
    title: 'Red Square Chronicler',
    description: 'Mastered the Dutch Civic Zone landmarks.',
    iconName: 'landmark',
    criteria: 'Complete Explore Dutch Square',
  },
  {
    id: 'badge-artifacts',
    title: 'Artifact Sleuth',
    description: 'Identified heritage materials and maritime relics.',
    iconName: 'compass',
    criteria: 'Complete Identify Historical Artifacts',
  },
  {
    id: 'badge-historian',
    title: 'Strait Historian',
    description: 'Completed the Melaka Sultanate & UNESCO heritage quiz.',
    iconName: 'book',
    criteria: 'Complete Discover Melaka’s History',
  },
  {
    id: 'badge-trail',
    title: 'Melaka Trail Master',
    description: 'Finished all five Melaka cultural trail challenges.',
    iconName: 'award',
    criteria: 'Complete the Heritage Trail',
  },
  {
    id: 'badge-ar-pioneer',
    title: 'AR Lens Pioneer',
    description: 'Captured a simulated historical AR reconstruction frame.',
    iconName: 'camera',
    criteria: 'Capture a view in AR Heritage Lens',
  },
];

export const DEFAULT_PROFILE_STATE = {
  displayName: 'Explorer',
  xp: 350,
  completedQuestIds: ['quest-a-famosa', 'quest-dutch-square', 'quest-artifacts'],
  unlockedBadgeIds: ['badge-fortress', 'badge-dutch', 'badge-artifacts'],
  savedDestinationIds: ['a-famosa', 'jonker-street'],
  visitedDestinationIds: ['a-famosa', 'christ-church', 'maritime-museum'],
  recentlyExploredIds: ['a-famosa', 'christ-church', 'jonker-street'],
  itineraryIds: ['a-famosa', 'christ-church', 'jonker-street'],
  accessibleRoute: false,
  capturedMomentsCount: 0,
};
