// ═══════════════════════════════════════════════════
// RAILQUAL v3 — DATA & LOGIC
// Created by LOKONON Godfree Samir
// ═══════════════════════════════════════════════════

// ── COULEURS LIGNES RATP ──
const LIGNE_COLORS = {
  'M1':'#FFBE00','M2':'#003CA6','M3':'#837902','M3b':'#6EC4E8',
  'M4':'#CF009E','M5':'#FF7E2E','M6':'#6ECA97','M7':'#FA9ABA',
  'M7b':'#83C491','M8':'#CEADD2','M9':'#D5C900','M10':'#E3B32A',
  'M11':'#8D5E2A','M12':'#00814F','M13':'#98D4E2','M14':'#662483',
  'RER A':'#E2231A','RER B':'#5191CD','RER C':'#F0A500',
  'RER D':'#00A88F','RER E':'#BA4A9B',
  'T1':'#84C28E','T2':'#E9A0BC'
};

// ── BIBLIOTHÈQUE SOUDURES FERROVIAIRES ──
// Sources: EN 14730-1/2, UIC 520, référentiel RATP GTS-10, normes SNCF IN 0310
const SOUDURES_LIB = [
  {
    id:'at',name:'Soudure Aluminothermique',code:'AT',
    desc:"Procédé thermique utilisant la réaction exothermique aluminium-oxyde de fer (thermite). Température ~2400°C. Procédé dominant en voie ballastée française. Durée de vie voie : 30-40 ans selon trafic.",
    tags:['Voie ballastée','LRS','Jonction rail','Terrain'],
    norme:'EN 14730-1 · NF EN 14730-2 · UIC 521',
    icon:'soudure', color:'#DC2626'
  },
  {
    id:'eb',name:'Soudure Électrique Bout-à-bout',code:'EB / Flash Butt',
    desc:"Soudage électrique par résistance avec étincelage (flash). Procédé automatisé en atelier ou avec machine mobile. Qualité homogène, contrôle par ultrasons intégré. Standard RATP/SNCF pour longs rails soudés (LRS).",
    tags:['LRS','Atelier','Mobile','Haute cadence'],
    norme:'EN 14587-1 · EN 14587-2 · UIC 515',
    icon:'electrique', color:'#2563EB'
  },
  {
    id:'sb',name:'Soudure Beurrage (Skv)',code:'SB / SKV',
    desc:"Soudure de réparation par apport de métal sur rail endommagé ou usé. Technique de rechargement par arc électrique avec électrodes spéciales. Utilisée pour reprise de cotes géométriques.",
    tags:['Réparation','Rechargement','Arc électrique'],
    norme:'UIC 725 · Circulaire RATP GTS-RM-08',
    icon:'mecanique', color:'#059669'
  },
  {
    id:'si',name:'Soudure par Induction',code:'SI',
    desc:"Chauffage par induction électromagnétique haute fréquence. Procédé propre, sans flamme. Utilisé pour préchauffage et libération thermique des rails. Contrôle précis de la température neutre (TN).",
    tags:['LRS','Préchauffage','Sans flamme','TN'],
    norme:'EN ISO 9692-1 · Fiche RATP GTS-10-B',
    icon:'vibration', color:'#7C3AED'
  },
  {
    id:'cr',name:'Soudure au Chalumeau Oxyacétylénique',code:'CRG / OA',
    desc:"Ancienne technique utilisant la flamme oxygène-acétylène. Usage résiduel en maintenance, appareils de voie. Remplacée progressivement par les procédés AT et EB pour voie courante.",
    tags:['Appareils de voie','Maintenance','Résiduel'],
    norme:'UIC 522 · NF A 89-100',
    icon:'controle', color:'#B45309'
  },
  {
    id:'tig',name:'Soudure TIG / MIG',code:'TIG / MIG',
    desc:"Soudage à arc sous gaz protecteur (Tungsten Inert Gas / Metal Inert Gas). Utilisé pour soudures de précision sur équipements, sabots de courant, pièces de signalisation. Non applicable voie courante LRS.",
    tags:['Équipements','Précision','Signalisation'],
    norme:'EN ISO 4063 · EN 13674-1',
    icon:'controle', color:'#64748B'
  },
  {
    id:'plaq',name:'Soudure de Raboutage (Plaquage)',code:'PL',
    desc:"Assemblage de deux rails de longueur standard (~18-36m) pour former des LRS. Opération réalisée en atelier de soudage ou en base chantier avant pose. Contrôle qualité : ultrasons, ressuage.",
    tags:['Raboutage','Préparation LRS','Atelier base'],
    norme:'EN 14730-1 · Référentiel ETF',
    icon:'mesure', color:'#0EA5E9'
  },
  {
    id:'cont',name:'Soudure de Continuité Électrique',code:'CE / SC',
    desc:"Soudures assurant la continuité du circuit de retour traction et de signalisation. Câbles de shuntage, liaisons de retour courant. Spécifique réseaux à traction électrique RATP (750V DC).",
    tags:['Électrique','Traction','Signalisation','750V DC'],
    norme:'NF C 11-001 · Standard RATP CES-TR-012',
    icon:'reglage', color:'#F59E0B'
  }
];
// ── DONNÉES FICHES ──
const DFLT_FICHES=[
  {ref:"Pose de voie ballast",fiche:"Tapis antivibratil",voie:"V1",pk_debut:18395,pk_fin:18458,date:"2025-06-04",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"Tapis antivibratil",voie:"V2",pk_debut:18395,pk_fin:18458,date:"2025-06-04",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"Sous couche ballast neuf",voie:"V1",pk_debut:18725,pk_fin:18915,date:"2025-08-03",statut:"C",commentaire:null,att:2},
  {ref:"Pose de voie ballast",fiche:"IDFO-FCQ3",voie:"V2",pk_debut:18825,pk_fin:18915,date:"2025-07-24",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"Travelage equerrage ecartement",voie:"V1",pk_debut:18240,pk_fin:18305,date:"2025-08-04",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"FCQ-12-PDV",voie:"V2",pk_debut:18075,pk_fin:18198,date:"2025-07-30",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"Devers et Gauches",voie:"V1",pk_debut:18004,pk_fin:18265,date:"2025-07-30",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"MT3003 V4",voie:"V2",pk_debut:18004,pk_fin:18205,date:"2025-07-30",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"Positionnement de la voie",voie:"V1",pk_debut:18004,pk_fin:18610,date:"2025-07-30",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"FCQ-IDFO-2",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-04",statut:"C",commentaire:null,att:1},
  {ref:"Pose de voie ballast",fiche:"Serrage attaches NABLA",voie:"V1",pk_debut:18004,pk_fin:18915,date:"2025-08-21",statut:"C",commentaire:null,att:0},
  {ref:"Pose de voie ballast",fiche:"Serrage attaches NABLA",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-21",statut:"C",commentaire:null,att:0},
  {ref:"Relevage des voies R1",fiche:"Enregistrement de la BML",voie:"V1",pk_debut:18004,pk_fin:18915,date:"2025-08-05",statut:"C",commentaire:null,att:0},
  {ref:"Relevage des voies R1",fiche:"Enregistrement de la BML",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-05",statut:"C",commentaire:null,att:0},
  {ref:"Relevage des voies R1",fiche:"Positionnement de la voie",voie:"V1",pk_debut:18004,pk_fin:18915,date:"2025-08-12",statut:"C",commentaire:null,att:0},
  {ref:"Relevage des voies R1",fiche:"FCQ-IDFO-2",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-05",statut:"C",commentaire:null,att:0},
  {ref:"Stabilisation 1",fiche:"Fiche stabilisation",voie:"V1",pk_debut:18004,pk_fin:18915,date:"2025-08-06",statut:"C",commentaire:null,att:0},
  {ref:"Stabilisation 1",fiche:"Fiche stabilisation",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-06",statut:"C",commentaire:null,att:0},
  {ref:"Relevage des voies R2",fiche:"Enregistrement de la BML",voie:"V1",pk_debut:18004,pk_fin:18915,date:"2025-08-06",statut:"C",commentaire:null,att:0},
  {ref:"Relevage des voies R2",fiche:"FCQ-IDFO-2",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-06",statut:"C",commentaire:null,att:0},
  {ref:"Liberation LRS",fiche:"FC-LRS-11",voie:"V1",pk_debut:18004,pk_fin:18915,date:"2025-08-18",statut:"C",commentaire:null,att:0},
  {ref:"Liberation LRS",fiche:"FC-LRS-12",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-18",statut:"NC",commentaire:"Temperature hors tolerance +3°C — zone 3 PK 18+300",att:1},
  {ref:"Joints isolants",fiche:"Autocontrole JIC V1",voie:"V1",pk_debut:18004,pk_fin:18915,date:null,statut:null,commentaire:null,att:0},
  {ref:"Joints isolants",fiche:"Autocontrole JIC V2",voie:"V2",pk_debut:18004,pk_fin:18915,date:null,statut:null,commentaire:null,att:0},
  {ref:"Quai et Entre-voie",fiche:"Gabarits des quais",voie:"V1",pk_debut:null,pk_fin:null,date:"2025-08-11",statut:"C",commentaire:null,att:0},
  {ref:"Quai et Entre-voie",fiche:"Entre-voies FCQ",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-22",statut:"C",commentaire:null,att:0},
  {ref:"Soudures",fiche:"Enregistrement thermique AT",voie:"V1",pk_debut:18004,pk_fin:18915,date:"2025-08-15",statut:"C",commentaire:null,att:3},
  {ref:"Soudures",fiche:"FC-SA-01 EB Flash Butt",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-15",statut:"C",commentaire:null,att:0},
  {ref:"Divers",fiche:"Tournee de conformite FC-PAR-11",voie:"V1",pk_debut:18004,pk_fin:18915,date:"2025-08-28",statut:"C",commentaire:null,att:0},
  {ref:"Divers",fiche:"Tournee de conformite FC-PAR-11",voie:"V2",pk_debut:18004,pk_fin:18915,date:"2025-08-28",statut:"C",commentaire:null,att:0},
];
const DFLT_JOINTS=[
  {type:"jic",zone:"Zone 4",zone_enc:"Z.4939 / Z.4943",voie:"1",pk:17.987,type_ci:1400,detail:null,date_prev:"aout 2025",phase:"Phase 1"},
  {type:"jic",zone:"Zone 3",zone_enc:"Z.4943 / Z.4945",voie:"1",pk:18.346,type_ci:1400,detail:null,date_prev:"aout 2025",phase:"Phase 1"},
  {type:"jic",zone:"Zone 1&2",zone_enc:"Z.4945 / Z.4947K",voie:"1",pk:18.765,type_ci:1400,detail:null,date_prev:"aout 2025",phase:"Phase 1"},
  {type:"jic",zone:"Zone 1&2",zone_enc:"Z.4947K / Z.4949",voie:"1",pk:18.857,type_ci:1400,detail:null,date_prev:"aout 2025",phase:"Phase 1"},
  {type:"jic",zone:"Zone 4",zone_enc:"Z.4936 / Z.4938",voie:"2",pk:18.011,type_ci:1400,detail:"JIC a shunter en attente MeS Ph2",date_prev:"Phase 2",phase:"Phase 2"},
  {type:"jic",zone:"Zone 4",zone_enc:"Z.4936 / Z.4940A",voie:"2",pk:18.099,type_ci:1400,detail:null,date_prev:"aout 2025",phase:"Phase 1"},
  {type:"jic",zone:"Zone 4",zone_enc:"Z.4938 / Z.4940",voie:"2",pk:18.214,type_ci:1400,detail:"JIC a shunter en attente MeS Ph2",date_prev:"Phase 2",phase:"Phase 2"},
  {type:"jic",zone:"Zone 1&2",zone_enc:"Z.4940A / Z.4940K",voie:"2",pk:18.5,type_ci:1400,detail:null,date_prev:"aout 2025",phase:"Phase 1"},
  {type:"jic",zone:"Zone 1&2",zone_enc:"Z.4940B / Z.5004",voie:"2",pk:18.862,type_ci:1400,detail:null,date_prev:"aout 2025",phase:"Phase 1"},
  {type:"jm",zone:"Zone 3",zone_enc:"Z.4942 / Z.4944",voie:"1",pk:18.21,type_ci:null,detail:null,date_prev:"sept 2025",phase:"Phase 1"},
  {type:"jm",zone:"Zone 4",zone_enc:"Z.4936 / Z.4937",voie:"2",pk:18.05,type_ci:null,detail:"JM provisoire — remplacement prevu",date_prev:"Phase 2",phase:"Phase 2"},
];
const DFLT_ZONES=[
  {label:"ZONE 4",pkStart:18004,pkEnd:18259},
  {label:"ZONE 3",pkStart:18259,pkEnd:18420},
  {label:"ZONE 1&2",pkStart:18420,pkEnd:18680},
  {label:"ZONE 4B",pkStart:18680,pkEnd:18915}
];
const ZC=['#D97706','#2563EB','#059669','#DC2626','#7C3AED','#E11D48','#0891B2','#65A30D'];
const DFLT_PLAN=[
  // ── GÉOMÉTRIE VOIE ──
  {name:"Nivellement (Zniv après le R2)",sf:true,
   responsable:"RET, CET ou QSE",frequence:"Voie en quai uniquement",
   type:"Mesure",ordre:1,
   critere:"Après NC : ±5mm par rapport au profil théorique",
   tolerance:"±5mm / profil théorique",
   docs:["Rapport Topographique/Machine"],ref_govelins:"Pas de référence",
   notes:"Contrôle après relevage R2 — mesure par machine topographique"},

  {name:"Travelage et équerrage (après le NC)",sf:true,
   responsable:"RET, CET ou QSE",frequence:"50m tous les 100ml",
   type:"Contrôle dimensionnel",ordre:2,
   critere:"Écartement traverses à 20mm / Équerrage traverses au droit du rail ±10mm / Pourcentage valeurs conformes = 100%",
   tolerance:"±20mm espacement / ±10mm équerrage",
   docs:["FC-TRAV"],ref_govelins:"Pas de référence",
   notes:"Vérification systématique travelage et équerrage après relevage NC"},

  {name:"Écartement (après le NC)",sf:true,
   responsable:"RET, CET ou QSE",frequence:"Un relevé tous les 9m",
   type:"Mesure",ordre:3,
   critere:"Traverses Béton : 1435 ±3mm / Traverses Bois : 1437 ±3mm",
   tolerance:"1435 ±3mm (béton) / 1437 ±3mm (bois)",
   docs:["FC-VC-12"],ref_govelins:"FC-VC-12",
   notes:"Écartement nominal RATP : 1435mm voie normale"},

  {name:"Dévers et Gauche (après le NC)",sf:true,
   responsable:"RET, CET ou QSE",frequence:"Tous les 3m",
   type:"Mesure",ordre:4,
   critere:"Gauche court sur 3m : 15mm / Écart dévers théorique / mesurée ≤ 2mm / Écartement : 1431–1469",
   tolerance:"Gauche ≤15mm/3m · Dévers ±2mm · Écart. 1431-1469",
   docs:["FC-GEO-61"],ref_govelins:"FC-GEO-61",
   notes:"Contrôle dévers et gauche voie — tolérances UIC 518"},

  {name:"Zniv (après le NC)",sf:true,
   responsable:"RET, CET ou QSE",frequence:"Voie en quai uniquement",
   type:"Mesure",ordre:5,
   critere:"Après NC : ±5mm par rapport au profil théorique",
   tolerance:"±5mm / profil théorique",
   docs:["Rapport Topographique/Machine"],ref_govelins:"Pas de référence",
   notes:"Nivellement en quai après relevage NC"},

  {name:"Épaufures",sf:false,
   responsable:"RET, CET ou QSE",frequence:"Après NC, toutes les traverses",
   type:"Inspection visuelle",ordre:6,
   critere:"Marquage des traverses défectueuses",
   tolerance:"Zéro épaufure non marquée",
   docs:["-"],ref_govelins:"Pas de référence",
   notes:"Inspection visuelle traverses — marquage obligatoire défauts"},

  // ── JOINTS ISOLANTS COLLÉS ──
  {name:"Travelage et équerrage des traverses sur JIC",sf:false,
   responsable:"RET, CET ou QSE",frequence:"À chaque JIC",
   type:"Contrôle dimensionnel",ordre:7,
   critere:"6 traverses avant le JIC et 6 traverses après le JIC",
   tolerance:"6 traverses de chaque côté du JIC",
   docs:["FC-TRAV JIC"],ref_govelins:"Pas de référence",
   notes:"Contrôle travelage spécifique zone JIC — 6T avant + 6T après"},

  {name:"Équerrage des JIC",sf:false,
   responsable:"",frequence:"",
   type:"Contrôle dimensionnel",ordre:8,
   critere:"Équerrage conforme aux tolérances JIC",
   tolerance:"Équerrage JIC standard",
   docs:["FC-TRAV-JIC-BETON"],ref_govelins:"FC-TRAV-JIC-BETON",
   notes:""},

  {name:"Isolement des JIC",sf:true,
   responsable:"Surveillant de Chantier",frequence:"Chaque JIC",
   type:"Essai électrique",ordre:9,
   critere:"En voie R>15kΩ — Non raccordé R>1MΩ",
   tolerance:"R>15kΩ (en voie) / R>1MΩ (non raccordé)",
   docs:["FC-JI-11"],ref_govelins:"FC-JI-11",
   notes:"Mesure résistance isolation JIC — point d'arrêt obligatoire SF"},

  // ── JOINTS GRANDS PERMISSIFS ──
  {name:"Ouverture des joints (JGP)",sf:true,
   responsable:"RET, CET ou QSE",frequence:"À chaque JGP",
   type:"Mesure",ordre:10,
   critere:"Ouverture selon température (abaque de libération)",
   tolerance:"Ouverture conforme abaque TN",
   docs:["FC-JT-12"],ref_govelins:"FC-JT-12",
   notes:"Joints Grands Permissifs — ouverture dépendante de la température au moment de la pose"},

  // ── LIBÉRATION LRS ──
  {name:"Déplacement et température des rails — libération à TN",sf:true,
   responsable:"RET, CET ou QSE",frequence:"Chaque rail libéré",
   type:"Mesure thermique",ordre:11,
   critere:"Température de libération conforme à la valeur théorique TN",
   tolerance:"TN ±3°C (seuil RATP)",
   docs:["FC-LRS-11"],ref_govelins:"FC-LRS-11",
   notes:"Mesure TN et déplacement — enregistrement obligatoire par rail libéré"},

  {name:"Déplacement et température des rails — libération avec tendeurs",sf:true,
   responsable:"RET, CET ou QSE",frequence:"Chaque rail libéré",
   type:"Mesure thermique",ordre:12,
   critere:"Valeur des allongements de rails conformes à la valeur théorique",
   tolerance:"Allongement conforme calcul LRS",
   docs:["FC-LRS-12"],ref_govelins:"FC-LRS-12",
   notes:"Libération avec tendeurs hydrauliques — contrôle allongements"},

  {name:"Remplacement d'un coupon en zone centrale LRS",sf:false,
   responsable:"",frequence:"",
   type:"Contrôle documentaire",ordre:13,
   critere:"Conformité procédure remplacement coupon LRS",
   tolerance:"Procédure standard RATP",
   docs:["FC-LRS-13"],ref_govelins:"FC-LRS-13",
   notes:""},

  {name:"Méthode utilisée pour l'homogénéisation",sf:false,
   responsable:"RET, CET ou QSE",frequence:"Intervalle selon rayon",
   type:"Contrôle documentaire",ordre:14,
   critere:"Méthode conforme au référentiel RATP",
   tolerance:"Référentiel RATP homogénéisation",
   docs:["FC-LRS-68"],ref_govelins:"FC-LRS-68",
   notes:"Intervalles d'homogénéisation selon rayon de courbure"},

  // ── GÉNÉRALITÉS ──
  {name:"Contrôle géométrique des soudures aluminothermiques",sf:false,
   responsable:"Personnel habilité",frequence:"Chaque soudure",
   type:"Contrôle dimensionnel",ordre:15,
   critere:"Géométrie conforme tolérances AT",
   tolerance:"Profil rail conforme EN 14730",
   docs:["FC-Géométrie des soudures Alumino (FC n°8)","FC-RAIL-12","FC-RAIL-13"],ref_govelins:"FC-RAIL-12 / FC-RAIL-13",
   notes:"Contrôle géométrique AT — habilitation obligatoire soudeur"},

  {name:"Cotes à quai",sf:false,
   responsable:"RET, CET ou QSE",frequence:"Avant la remise en exploitation",
   type:"Mesure",ordre:16,
   critere:"0 ≤ d ≤ 158mm : ±2mm / 158mm ≤ d ≤ 160mm : 0 / -2mm",
   tolerance:"d ≤158mm : ±2mm / 158<d≤160mm : 0/-2mm",
   docs:["FC-GEO-62"],ref_govelins:"FC-GEO-62",
   notes:"Mesure cotes à quai avant remise en exploitation — Après NC"},

  {name:"Contrôle gabarit",sf:false,
   responsable:"RET, CET ou QSE",frequence:"Avant la remise en exploitation",
   type:"Inspection visuelle",ordre:17,
   critere:"Contrôle sécurité environnement et/ou constat mise en service",
   tolerance:"Gabarit RATP G+ / GBF",
   docs:["Contrôle sécurité env / constat MeS"],ref_govelins:"Pas de référence",
   notes:""},

  {name:"Présence de graisse sur le champignon",sf:false,
   responsable:"RET, CET ou QSE",frequence:"Avant la remise en exploitation",
   type:"Inspection visuelle",ordre:18,
   critere:"Absence de graisse sur le champignon",
   tolerance:"Zéro graisse champignon — tolérance nulle",
   docs:["FC-RAIL-31","FC-RAIL-61(LA)","FC-RAIL-62(LB)"],ref_govelins:"FC-RAIL-31 / FC-RAIL-61(LA) ou FC-RAIL-62(LB)",
   notes:"Inspection visuelle champignon rail — graisse = NC immédiate"},

  {name:"Contrôle des systèmes anti-pièces traînantes",sf:false,
   responsable:"RET, CET ou QSE",frequence:"Avant la remise en exploitation",
   type:"Inspection visuelle",ordre:19,
   critere:"Contrôle visuel conformité",
   tolerance:"Zéro pièce traînante",
   docs:["Constat Mise en service"],ref_govelins:"Pas de référence",
   notes:"Vérification avant remise en exploitation — sécurité trafic"}
]
const DFLT_FT=["Pose de voie ballast","Relevage voies","Stabilisation","Libération LRS","Joints isolants","Géométrie voie BML","Soudures AT/EB","Gabarit quai/entre-voie","Appareils de voie","Drainage"];

const PHASE_ICONS = {
  "Pose de voie ballast":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 20L8 4M16 4l4 16"/><line x1="7" y1="11" x2="17" y2="11"/><line x1="6" y1="16" x2="18" y2="16"/></svg>',
  "Relevage des voies R1":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="17 11 12 6 7 11"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="3" y1="20" x2="21" y2="20"/></svg>',
  "Relevage des voies R2":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="17 11 12 6 7 11"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="3" y1="20" x2="21" y2="20"/></svg>',
  "Stabilisation 1":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>',
  "Liberation LRS":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>',
  "Joints isolants":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
  "Quai et Entre-voie":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="14" width="20" height="6" rx="1"/><path d="M6 14V8M18 14V8M6 8h12"/></svg>',
  "Soudures":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 3c0 3 2 5 2 8a4 4 0 0 1-8 0c0-2.5 1.5-4.5 3-7z"/><path d="M12 12v9"/></svg>',
  "Divers":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  "default":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>'
};

// ── SVG ICON REGISTRY (remplace émojis) ──
const SVG_ICONS = {
  soudure:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 3c0 3 2 5 2 8a4 4 0 0 1-8 0c0-2.5 1.5-4.5 3-7z"/><line x1="12" y1="12" x2="12" y2="21"/></svg>',
  electrique: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  mecanique:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  vibration:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 12h2l3-9 4 18 3-9h2"/></svg>',
  controle:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  mesure:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 6H3"/><path d="M10 12H3"/><path d="M10 18H3"/><polyline points="15 12 18 15 22 11"/></svg>',
  reglage:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M2 12h2M20 12h2M17.66 17.66l1.41 1.41M4.93 4.93l1.41 1.41"/></svg>',
  default:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>'
};
const getIcon = (key) => SVG_ICONS[key] || SVG_ICONS.default;
const PHASE_COLORS = {
  "Pose de voie ballast":"#059669","Relevage des voies R1":"#2563EB",
  "Relevage des voies R2":"#7C3AED","Stabilisation 1":"#0891B2",
  "Liberation LRS":"#DC2626","Joints isolants":"#7C3AED",
  "Quai et Entre-voie":"#65A30D","Soudures":"#DC2626","Divers":"#64748B"
};

let projects=[{
  id:'p1',name:"Renouvellement Voie Ligne 11",ligne:"Ligne 11",
  ligneCode:'M11',ligneColor:'#8D5E2A',
  type:"metro",moa:"RATP",entreprise:"ETF",
  pkStart:18004,pkEnd:18915,color:"#8D5E2A",color2:"#5C3D1A",logo:"M",
  desc:"Renouvellement complet voie ballastée entre Mairie des Lilas et ateliers Croix de Chavaux. Zone intercalaire VB. Travaux de nuit en fenêtre travaux.",
  zones:JSON.parse(JSON.stringify(DFLT_ZONES)),
  fiches:JSON.parse(JSON.stringify(DFLT_FICHES)),
  joints:JSON.parse(JSON.stringify(DFLT_JOINTS)),
  plan:JSON.parse(JSON.stringify(DFLT_PLAN)),
  ficheTypes:[...DFLT_FT]
}];

let CP=null,fcqF='all',jF='all',editFicheIdx=null,currentTheme='scada';

const pkP=(pk,p)=>Math.max(0,Math.min(100,(pk-p.pkStart)/(p.pkEnd-p.pkStart)*100));
const fmtPK=pk=>{if(!pk&&pk!==0)return'—';const k=Math.floor(pk/1000),m=pk%1000;return`${k}+${String(m).padStart(3,'0')}`};
const col=pct=>pct===100?'var(--ok)':pct>0?'var(--wt)':'var(--nc)';
const colB=pct=>pct===100?'var(--ok)':pct>60?'var(--ok)':pct>0?'var(--wt)':'var(--nc)';

// ── THEME ──
// ════ THEME & ACCENT SYSTEM ════

let currentMode = 'light';      // light | dark | midnight
let currentAccent = '#D97706';  // hex
let specialTheme = null;        // copper | forest | sand | ratp | hc | null

function setMode(mode, el){
  specialTheme = null;
  currentMode = mode;
  document.documentElement.setAttribute('data-theme', mode);
  // Update mode buttons
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  if(el) el.classList.add('active');
  // Keep accent
  applyAccent(currentAccent);
  // Clear special theme pills
  document.querySelectorAll('.th-pill').forEach(p=>p.classList.remove('active'));
  updThemeCardConfig();
}

function setAccent(hex, el){
  currentAccent = hex;
  // Remove special theme if using accent circles
  if(specialTheme && !['vercel','scada','copper','forest','sand','ratp','hc'].includes(specialTheme)){
    specialTheme = null;
  }
  applyAccent(hex);
  // Update circles
  document.querySelectorAll('.accent-circle').forEach(c=>c.classList.remove('active'));
  if(el) el.classList.add('active');
  updThemeCardConfig();
}

function applyAccent(hex){
  document.documentElement.style.setProperty('--user-accent', hex);
  // Recompute accent-bg and accent-bd via JS (fallback for browsers without color-mix)
  try {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    document.documentElement.style.setProperty('--accent-bg', `rgba(${r},${g},${b},.08)`);
    document.documentElement.style.setProperty('--accent-bd', `rgba(${r},${g},${b},.22)`);
    document.documentElement.style.setProperty('--accent', hex);
  } catch(e){}
}

function setSpecialTheme(t, el){
  specialTheme = t;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('railqual_v4_theme', t);
  document.querySelectorAll('.th-pill').forEach(p=>p.classList.remove('active'));
  if(el) el.classList.add('active');
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  updThemeCardConfig();
}
window.setSpecialTheme = setSpecialTheme;


// Legacy compat
function setTheme(t, el){ setSpecialTheme(t, el); }
function setThemeCard(t, el){ setSpecialTheme(t, el); }
function nextTheme(){
  const modes=['light','dark','midnight'];
  const idx=modes.indexOf(currentMode);
  const next=modes[(idx+1)%modes.length];
  setMode(next, document.getElementById('mode-'+next));
}

function updThemeCardConfig(){
  const theme = specialTheme || currentMode;
  document.querySelectorAll('.th-card').forEach(c=>c.classList.remove('active'));
  const card = document.getElementById('tcard-'+theme);
  if(card) card.classList.add('active');
  // Sync home pills
  const sel = document.getElementById('thp-'+theme);
  document.querySelectorAll('.th-pill').forEach(p=>p.classList.remove('active'));
  if(sel) sel.classList.add('active');
}


function renderHome(){
  const g=document.getElementById('proj-grid'); if(!g) return;
  g.innerHTML='';
  let tf=0, tj=0;

  projects.forEach((p,i)=>{
    tf += p.fiches.length; tj += p.joints.length;
    const ok  = p.fiches.filter(f=>f.statut==='C').length;
    const nc  = p.fiches.filter(f=>f.statut==='NC').length;
    const wt  = p.fiches.filter(f=>!f.statut).length;
    const jic = p.joints.filter(j=>j.type==='jic').length;
    const jm  = p.joints.filter(j=>j.type==='jm').length;
    const pct = p.fiches.length ? Math.round(ok/p.fiches.length*100) : 0;
    const lc  = LIGNE_COLORS[p.ligne]||'var(--accent)';
    const barColor = pct===100?'var(--ok)': nc>0?'var(--nc)':'var(--wt)';

    const card = document.createElement('div');
    card.className = 'proj-card';
    card.style.setProperty('--ligne-color', lc);
    card.style.animationDelay = (i*55)+'ms';
    card.innerHTML = `
      <div class="proj-card-top">
        <span class="proj-ligne-badge" style="background:${lc}">${p.ligne}</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="proj-type">${p.type||'Voie'}</span>
          <button class="proj-del-btn" onclick="event.stopPropagation();deleteProj('${p.id}')" title="Supprimer">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </div>
      <div class="proj-name">${p.name}</div>
      <div class="proj-pk">PK ${fmtPK(p.pkStart)} → ${fmtPK(p.pkEnd)} · ${p.pkEnd-p.pkStart}m</div>
      <div class="proj-bar"><div class="proj-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
      <div class="proj-chips">
        ${ok?`<span class="proj-chip chip-ok">${ok} C</span>`:''}
        ${nc?`<span class="proj-chip chip-nc">${nc} NC</span>`:''}
        ${wt?`<span class="proj-chip chip-wt">${wt} —</span>`:''}
        ${jic?`<span class="proj-chip chip-vi">${jic} JIC</span>`:''}
        ${jm?`<span class="proj-chip chip-ro">${jm} JM</span>`:''}
        ${!ok&&!nc&&!wt?`<span style="font-family:var(--fm);font-size:9px;color:var(--t3)">Aucune fiche</span>`:''}
      </div>`;
    card.addEventListener('click', ()=>openProj(p.id));
    g.appendChild(card);
  });

  // New project card
  const newCard = document.createElement('div');
  newCard.className = 'proj-card-new';
  newCard.innerHTML = `
    <div class="proj-card-new-ico"><svg width="16" height="16"><use href="#i-plus"/></svg></div>
    <div class="proj-card-new-lbl">Nouveau projet</div>
    <div style="font-size:10.5px;color:var(--t3)">Métro · RER · Tramway</div>`;
  newCard.addEventListener('click', openNewProj);
  g.appendChild(newCard);

  // Update KPIs
  const el=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  el('kpi-proj', projects.length);
  el('kpi-fiches', tf);
  el('kpi-joints', tj);
  
  // Dernière sauvegarde
  const saveEl = document.getElementById('last-save');
  if (saveEl) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        const dt = new Date(d.savedAt);
        const diff = Math.floor((Date.now() - dt) / 60000);
        if (diff < 1) saveEl.textContent = "Sauvegardé à l'instant";
        else if (diff < 60) saveEl.textContent = `Sauvegardé il y a ${diff} min`;
        else saveEl.textContent = `Sauvegardé le ${dt.toLocaleDateString('fr-FR')}`;
      } else {
        saveEl.textContent = 'Non sauvegardé';
      }
    } catch(e) { saveEl.textContent = ''; }
  }
}



function deleteProj(id){
  const i = projects.findIndex(p=>p.id===id);
  if(i<0) return;
  document.getElementById('conf-m').textContent = 'Supprimer le projet "'+projects[i].name+'" ? Cette action est irréversible.';
  document.getElementById('conf-ok').onclick = ()=>{
    projects.splice(i,1);
    closeM('conf');
    if(CP && CP.id===id){ CP=null; goHome(); }
    else renderHome();
    toast('Projet supprimé','ok');
  };
  document.getElementById('conf').classList.add('open');
}

function goHome(){document.getElementById('sa').classList.remove('active');document.getElementById('sh').classList.add('active');renderHome();}

// ── OPEN PROJECT ──
function openProj(id){
  CP=projects.find(p=>p.id===id);if(!CP)return;
  document.getElementById('sh').classList.remove('active');document.getElementById('sa').classList.add('active');
  document.getElementById('sb-pn').textContent=CP.name;
  document.getElementById('sb-pm').textContent=CP.ligne+' · '+fmtPK(CP.pkStart)+'–'+fmtPK(CP.pkEnd);
  document.getElementById('sb-pc').style.background=CP.ligneColor||CP.color;
  document.getElementById('tb-pn').textContent=CP.name;
  updBadges();loadCfg();showPage('syn',document.getElementById('nv-syn'));
}
function updBadges(){
  if(!CP)return;
  document.getElementById('nb-syn').textContent=CP.fiches.length;
  document.getElementById('nb-fcq').textContent=CP.fiches.length;
  document.getElementById('nb-jt').textContent=CP.joints.length;
  document.getElementById('nb-soud').textContent=SOUDURES_LIB.length;
  document.getElementById('nb-plan').textContent=CP.plan.length;
  // Alert badge
  const als=buildAlerts(CP);
  const aEl=document.getElementById('nb-alerts');
  if(aEl){aEl.textContent=als.length;if(als.some(a=>a.level==='crit')){aEl.style.background='var(--nc-bg)';aEl.style.color='var(--nc)';aEl.style.borderColor='var(--nc-bd)';}else if(als.length>0){aEl.style.background='var(--wt-bg)';aEl.style.color='var(--wt)';aEl.style.borderColor='var(--wt-bd)';}}
  updAlertBell(als);
}

// ── ALERT PAGE NAVIGATION ──
function showPageAlerts(el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nv').forEach(n=>n.classList.remove('active'));
  document.getElementById('pg-alerts').classList.add('active');
  if(el)el.classList.add('active');
  document.getElementById('tb-pg').textContent='Alertes';
  renderAlertsPage();
}

function showPage(id,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nv').forEach(n=>n.classList.remove('active'));
  document.getElementById('pg-'+id).classList.add('active');
  el.classList.add('active');
  const lbl={syn:'Synoptique',fcq:'Fiches FCQ',joints:'Joints',soud:'Soudures',plan:'Plan de contrôle',cfg:'Configuration'};
  document.getElementById('tb-pg').textContent=lbl[id]||id;
  if(id==='syn'){renderSyn();}
  if(id==='fcq'){renderFCQStats();renderFCQ();}
  if(id==='joints')renderJoints();
  if(id==='soud')renderSoudures();
  if(id==='plan')renderPlan();
  if(id==='cfg')loadCfg();
  // hide zone sidebar when switching pages
  if(id!=='syn')document.getElementById('zone-sidebar').classList.remove('open');
}

// ════ SYNOPTIQUE GÉNÉRAL ════
function renderSyn(){
  const p=CP; if(!p) return;
  const ok=p.fiches.filter(f=>f.statut==='C').length;
  const nc=p.fiches.filter(f=>f.statut==='NC').length;
  const pend=p.fiches.filter(f=>!f.statut).length;
  const pct=p.fiches.length?Math.round(ok/p.fiches.length*100):0;

  // SF panel supprimé du synoptique

  // ── 3 stat cards ──
  document.getElementById('syn-stats').innerHTML=`
    <div class="sc sc-clickable" onclick="goToFCQFilter('C')" title="Voir les fiches conformes" style="flex:1">
      <div class="stat-kpi-row">
        <span class="stat-num" style="color:var(--ok)">${ok}</span>
        <span class="stat-denom">/ ${p.fiches.length}</span>
        <span class="stat-label">Conformes</span>
      </div>
      <div class="sc-bar" style="margin-top:8px"><div class="sc-fill" style="width:${pct}%;background:var(--ok)"></div></div>
    </div>
    <div class="sc sc-clickable" onclick="goToFCQFilter('NC')" title="Voir les non conformes" style="flex:1">
      <div class="stat-kpi-row">
        <span class="stat-num" style="color:${nc>0?'var(--nc)':'var(--t3)'}">${nc}</span>
        <span class="stat-label">Non conformes</span>
        ${nc>0?'<span class=\"stat-badge-nc\">!</span>':''}
      </div>
    </div>
    <div class="sc sc-clickable" onclick="goToFCQFilter('')" title="Voir les fiches en attente" style="flex:1">
      <div class="stat-kpi-row">
        <span class="stat-num" style="color:${pend>0?'var(--wt)':'var(--t3)'}">${pend}</span>
        <span class="stat-label">En attente</span>
      </div>
    </div>
    <div class="sc" style="flex:1">
      <div class="stat-kpi-row">
        <span class="stat-num" style="color:var(--accent)">${pct}<span style="font-size:14px;font-weight:500">%</span></span>
        <span class="stat-label">Conformité</span>
      </div>
      <div class="sc-bar" style="margin-top:8px"><div class="sc-fill" style="width:${pct}%;background:var(--accent)"></div></div>
    </div>`;

  const card=document.getElementById('syn-card'); card.innerHTML='';

  // ── Title ──
  const tr=document.createElement('div'); tr.className='syn-title-row';
  tr.innerHTML=`<span class="syn-sect">PK ${fmtPK(p.pkStart)} → ${fmtPK(p.pkEnd)} · ${p.pkEnd-p.pkStart}m · ${p.ligne}</span>`;
  card.appendChild(tr);

  // ── Zones row ──
  const zr=document.createElement('div'); zr.className='zones-vis';
  p.zones.forEach((z,zi)=>{
    const w=pkP(z.pkEnd,p)-pkP(z.pkStart,p);
    const zf=p.fiches.filter(f=>f.pk_debut&&f.pk_fin&&!(f.pk_fin<z.pkStart||f.pk_debut>z.pkEnd));
    const zOk=zf.filter(f=>f.statut==='C').length;
    const zNc=zf.filter(f=>f.statut==='NC').length;
    const zWt=zf.filter(f=>!f.statut).length;
    const cell=document.createElement('div'); cell.className='zv-cell'; cell.style.width=w+'%';
    // NC zones get red tint
    if(zNc>0) cell.style.cssText+=`;background:rgba(220,38,38,.07)!important;border-bottom:2px solid var(--nc)`;
    cell.innerHTML=`<span class="zv-lbl">${z.label}</span>
    <div class="zv-stats-mini">
      ${zOk?`<span class="zsm zsm-ok">${zOk}C</span>`:''}
      ${zNc?`<span class="zsm zsm-nc">${zNc}NC</span>`:''}
      ${zWt?`<span class="zsm zsm-wt">${zWt}</span>`:''}
    </div>
    <div class="zv-edit"><input class="zv-ninp" id="zni-${zi}" value="${z.label}" onkeydown="if(event.key==='Enter')saveZL(${zi})"><button class="zv-ok" onclick="saveZL(${zi})">Ok</button></div>`;
    cell.addEventListener('mouseenter', e => showZoneTT(e, zi));
    cell.addEventListener('mousemove', moveTT);
    cell.addEventListener('mouseleave', hideTT);
    cell.addEventListener('click',e=>{
      if(e.target.classList.contains('zv-ok')||e.target.classList.contains('zv-ninp'))return;
      hideTT();
      openZoneDetail(zi);
    });
    cell.addEventListener('dblclick',()=>toggleZE(zi));
    zr.appendChild(cell);
  });
  card.appendChild(zr);

  // ── Rail tracks V1 & V2 ──
  ['V1','V2'].forEach(v=>{
    const grp=document.createElement('div'); grp.className='track-grp';
    const lbl=document.createElement('div'); lbl.className='tg-lbl'; lbl.textContent='Voie '+v.slice(1); grp.appendChild(lbl);
    const rail=document.createElement('div'); rail.className='track-rail';

    // Grey base fill for untracked range
    const baseFill=document.createElement('div');
    baseFill.style.cssText='position:absolute;inset:4px;background:var(--surf3);border-radius:3px;opacity:.5';
    rail.appendChild(baseFill);

    p.fiches.filter(f=>f.voie===v&&f.pk_debut&&f.pk_fin).forEach(f=>{
      const left=pkP(f.pk_debut,p), w=Math.max(.5,pkP(f.pk_fin,p)-left);
      const seg=document.createElement('div'); seg.className='tseg '+(!f.statut?'wt':f.statut==='C'?'ok':'nc');
      seg.style.cssText=`left:${left}%;width:${w}%`;
      // NC segments: add pulsing red glow
      if(f.statut==='NC') seg.style.boxShadow='0 0 8px rgba(220,38,38,.6)';
      seg.addEventListener('mouseenter',e=>showFTT(e,f));
      seg.addEventListener('mousemove',moveTT);
      seg.addEventListener('mouseleave',hideTT);
      seg.addEventListener('click',()=>{
        const zi=p.zones.findIndex(z=>f.pk_debut>=z.pkStart&&f.pk_fin<=z.pkEnd);
        if(zi>=0) openZoneDetail(zi);
      });
      rail.appendChild(seg);
    });

    // NC markers — red pins above the rail at exact NC PK
    p.fiches.filter(f=>f.voie===v&&f.statut==='NC'&&f.pk_debut).forEach(f=>{
      const midPK=(f.pk_debut+(f.pk_fin||f.pk_debut))/2;
      const left=pkP(midPK,p);
      const marker=document.createElement('div');
      marker.style.cssText=`position:absolute;left:${left}%;top:0;transform:translateX(-50%) translateY(-8px);z-index:20;pointer-events:none`;
      marker.innerHTML=`<div style="background:var(--nc);color:#fff;font-family:var(--fm);font-size:7px;padding:1px 5px;border-radius:3px;white-space:nowrap;box-shadow:0 2px 6px rgba(220,38,38,.4)">NC</div><div style="width:1px;height:8px;background:var(--nc);margin:0 auto"></div>`;
      rail.appendChild(marker);
    });

    grp.appendChild(rail);

    // ── Joint pins ──
    const jr=document.createElement('div'); jr.className='joint-row';
    p.joints.filter(j=>j.voie===v.slice(1)).forEach((j,ji)=>{
      const pkR=j.pk*1000, left=pkP(pkR,p); if(left<0||left>100) return;
      const pin=document.createElement('div'); pin.className='jpin jj-'+j.type; pin.style.left=left+'%';
      pin.innerHTML='<div class="jpin-stem"></div><div class="jpin-head"></div>';
      pin.style.cursor='pointer';
      pin.addEventListener('mouseenter',e=>showJTT(e,j));
      pin.addEventListener('mousemove',moveTT);
      pin.addEventListener('mouseleave',hideTT);
      // Click to edit joint
      pin.addEventListener('click',e=>{e.stopPropagation(); openEditJoint(p.joints.indexOf(j));});
      jr.appendChild(pin);
    });
    grp.appendChild(jr);
    card.appendChild(grp);
  });

  // ── PK ruler ──
  const ruler=document.createElement('div'); ruler.className='pk-ruler';
  const step=Math.max(10,Math.round((p.pkEnd-p.pkStart)/9/10)*10);
  for(let pk=p.pkStart;pk<=p.pkEnd;pk+=step){
    const t=document.createElement('div');
    t.style.cssText='font-family:var(--fm);font-size:9px;color:var(--t3)';
    t.textContent=fmtPK(Math.round(pk)); ruler.appendChild(t);
  }
  card.appendChild(ruler);

  // ── SF Blocking panel ──
  renderSFPanel();

  // ── Phase cards ──
  const refs=[...new Set(p.fiches.map(f=>f.ref))];
  const pg=document.getElementById('phase-grid'); pg.innerHTML='';
  refs.forEach(ref=>{
    const pf=p.fiches.filter(f=>f.ref===ref);
    const okC=pf.filter(f=>f.statut==='C').length;
    const ncC=pf.filter(f=>f.statut==='NC').length;
    const wtC=pf.filter(f=>!f.statut).length;
    const pct2=pf.length?Math.round(okC/pf.length*100):0;
    const phColor=PHASE_COLORS[ref]||'var(--ok)';
    const pc=document.createElement('div'); pc.className='ph-card'; pc.style.setProperty('--phc',phColor);
    if(ncC>0) pc.innerHTML+=`<div class="ph-nc-count">${ncC} NC</div>`;
    pc.innerHTML+=`<div class="ph-name">${PHASE_ICONS[ref]||''} ${ref}</div>
    <div class="ph-mini-stats">
      <span class="phst" style="color:var(--ok)">${okC}</span>
      ${ncC?`<span class="phst" style="color:var(--nc)">${ncC}</span>`:''}
      ${wtC?`<span class="phst" style="color:var(--wt)">${wtC}</span>`:''}
      <span class="ph-pct" style="color:${colB(pct2)}">${pct2}%</span>
    </div>
    <div class="ph-bar"><div class="ph-fill" style="width:${pct2}%;background:${phColor}"></div></div>`;
    pc.onclick=()=>openPhaseDetail(ref);
    pg.appendChild(pc);
  });
}


// ── ZONE DETAIL SIDEBAR ──
function openZoneDetail(zi){
  const p=CP;const z=p.zones[zi];
  const sb=document.getElementById('zone-sidebar');
  const inner=document.getElementById('zd-inner');
  const zFiches=p.fiches.filter(f=>f.pk_debut&&f.pk_fin&&!(f.pk_fin<z.pkStart||f.pk_debut>z.pkEnd));
  const zOk=zFiches.filter(f=>f.statut==='C').length;
  const zNc=zFiches.filter(f=>f.statut==='NC').length;
  const zWt=zFiches.filter(f=>!f.statut).length;
  const ncFiches=zFiches.filter(f=>f.statut==='NC');
  const wtFiches=zFiches.filter(f=>!f.statut);
  inner.innerHTML=`
    <div class="zd-hdr">
      <div class="zd-title"> ${z.label}</div>
      <button class="zd-close" onclick="closeZoneDetail()"><svg width="11" height="11"><use href="#i-x"/></svg></button>
    </div>
    <div style="font-family:var(--fm);font-size:9px;color:var(--t3);margin-bottom:10px">PK ${fmtPK(z.pkStart)} → PK ${fmtPK(z.pkEnd)} · ${z.pkEnd-z.pkStart}m</div>
    <div class="zd-kpis">
      <div class="zdk"><div class="zdk-v">${zFiches.length}</div><div class="zdk-l">Total</div></div>
      <div class="zdk"><div class="zdk-v" style="color:var(--ok)">${zOk}</div><div class="zdk-l">Conformes</div></div>
      <div class="zdk"><div class="zdk-v" style="color:var(--nc)">${zNc}</div><div class="zdk-l">NC</div></div>
    </div>
    ${zWt>0?`<div class="zdk" style="text-align:center;margin-bottom:10px;border:1px solid var(--ln);border-radius:var(--r);padding:8px"><div class="zdk-v" style="color:var(--wt)">${zWt}</div><div class="zdk-l">En attente</div></div>`:''}
    
    ${ncFiches.length>0?`
    <div class="zd-issues">
      <div class="zd-issues-title" style="color:var(--nc)">Non conformes</div>
      ${ncFiches.map(f=>`<div class="zd-fiche nc-item" onclick="editFicheFromZone(${CP.fiches.indexOf(f)})">
        <div class="zdf-name">${f.fiche}</div>
        <div class="zdf-meta">
          <span class="zdf-tag">${f.voie}</span>
          <span class="zdf-tag">${fmtPK(f.pk_debut)}→${fmtPK(f.pk_fin)}</span>
          ${f.date?`<span class="zdf-tag">${f.date}</span>`:''}
        </div>
        ${f.commentaire?`<div style="font-size:10px;color:var(--nc);margin-top:4px">! ${f.commentaire}</div>`:''}
      </div>`).join('')}
    </div>`:''}
    
    ${wtFiches.length>0?`
    <div class="zd-issues" style="margin-top:10px">
      <div class="zd-issues-title" style="color:var(--wt)">En attente</div>
      ${wtFiches.map(f=>`<div class="zd-fiche wt-item" onclick="editFicheFromZone(${CP.fiches.indexOf(f)})">
        <div class="zdf-name">${f.fiche}</div>
        <div class="zdf-meta">
          <span class="zdf-tag">${f.voie}</span>
          ${f.pk_debut?`<span class="zdf-tag">${fmtPK(f.pk_debut)}→${fmtPK(f.pk_fin)}</span>`:''}
          <span class="zdf-tag">${f.ref}</span>
        </div>
      </div>`).join('')}
    </div>`:''}
    
    ${ncFiches.length===0&&wtFiches.length===0?`<div style="text-align:center;padding:20px;color:var(--t3)"><div style="font-size:22px;margin-bottom:6px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><div style="font-size:12px;font-weight:600;color:var(--ok)">Zone 100% conforme</div><div style="font-size:11px;margin-top:3px">${zOk} fiche${zOk>1?'s':''} validée${zOk>1?'s':''}</div></div>`:''}
    
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--ln)">
      <button class="btn" style="width:100%" onclick="filterFCQByZone(${zi})">
        <svg width="12" height="12"><use href="#i-fcq"/></svg> Voir toutes les fiches
      </button>
    </div>`;
  sb.classList.add('open');
}
function closeZoneDetail(){document.getElementById('zone-sidebar').classList.remove('open');}
function editFicheFromZone(idx){closeZoneDetail();openAddFiche(idx);}
function filterFCQByZone(zi){
  const z=CP.zones[zi];
  closeZoneDetail();
  showPage('fcq',document.getElementById('nv-fcq'));
  document.getElementById('fcq-s').value=fmtPK(z.pkStart);
  renderFCQ();
}

// ── ZONE EDIT ──
function toggleZE(zi){
  document.querySelectorAll('.zv-cell').forEach((c,i)=>c.classList.toggle('editing',i===zi&&!c.classList.contains('editing')));
  const inp=document.getElementById('zni-'+zi);if(inp)setTimeout(()=>inp.focus(),10);
}
function saveZL(zi){
  const inp=document.getElementById('zni-'+zi);
  if(inp){snapshot('Renommer zone');CP.zones[zi].label=inp.value;renderSyn();toast('Zone renommée','ok');}
}

// ════ PHASE DETAIL ════
function openPhaseDetail(ref){
  const p=CP;
  const pf=p.fiches.filter(f=>f.ref===ref);
  const okC=pf.filter(f=>f.statut==='C').length,ncC=pf.filter(f=>f.statut==='NC').length,wtC=pf.filter(f=>!f.statut).length;
  const pct=pf.length?Math.round(okC/pf.length*100):0;
  const phColor=PHASE_COLORS[ref]||'var(--ok)';
  document.getElementById('pd-ico').innerHTML=`<span style="font-size:20px">${PHASE_ICONS[ref]||''}</span>`;
  document.getElementById('pd-ico').style.background=phColor+'20';
  document.getElementById('pd-ico').style.border=`1px solid ${phColor}40`;
  document.getElementById('pd-name').textContent=ref;
  document.getElementById('pd-sub').textContent=`${pf.length} fiche${pf.length>1?'s':''} · ${okC} conformes · ${ncC} NC · ${wtC} en attente · ${pct}%`;

  const body=document.getElementById('pd-body');body.innerHTML='';

  // KPIs
  const kpis=document.createElement('div');kpis.className='pd-kpis';
  kpis.innerHTML=`
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:var(--t1)">${pf.length}</div><div class="pd-kpi-l">Total fiches</div></div>
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:var(--ok)">${okC}</div><div class="pd-kpi-l">Conformes</div></div>
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:var(--nc)">${ncC}</div><div class="pd-kpi-l">Non conformes</div></div>
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:var(--wt)">${wtC}</div><div class="pd-kpi-l">En attente</div></div>
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:${phColor}">${pct}%</div><div class="pd-kpi-l">Conformité</div></div>`;
  body.appendChild(kpis);

  // Phase synoptique progressif par PK
  const progDiv=document.createElement('div');progDiv.className='pd-prog';
  const segsWithPK=pf.filter(f=>f.pk_debut&&f.pk_fin);
  if(segsWithPK.length>0){
    progDiv.innerHTML=`<div class="pd-prog-title"> Représentation PK — Phase "${ref}" · V1 et V2</div>`;
    ['V1','V2'].forEach(v=>{
      const vSegs=segsWithPK.filter(f=>f.voie===v);if(!vSegs.length)return;
      const vDiv=document.createElement('div');
      vDiv.innerHTML=`<div style="font-family:var(--fm);font-size:9px;color:var(--t3);margin-bottom:4px;text-transform:uppercase;letter-spacing:1.5px">Voie ${v.slice(1)}</div>`;
      const barWrap=document.createElement('div');barWrap.className='pd-prog-bar-wrap';barWrap.style.overflow='hidden';
      // Grey background = whole track
      barWrap.style.background='var(--surf2)';
      vSegs.forEach(f=>{
        const left=pkP(f.pk_debut,p),w=Math.max(.5,pkP(f.pk_fin,p)-left);
        const bg=!f.statut?'#F59E0B':f.statut==='C'?'#10B981':'#EF4444';
        // NC gets extra glow
        const glow=f.statut==='NC'?';box-shadow:0 0 8px rgba(239,68,68,.5)':''
        const seg=document.createElement('div');seg.className='pd-seg';
        seg.style.cssText=`left:${left}%;width:${w}%;background:${bg};border-right:1px solid rgba(255,255,255,.25)${glow}`;
        if(w>4){const lbl=document.createElement('div');lbl.className='pd-seg-label';lbl.textContent=fmtPK(f.pk_debut);seg.appendChild(lbl);}
        seg.title=`${f.fiche} · ${fmtPK(f.pk_debut)}→${fmtPK(f.pk_fin)} · ${f.statut||'Attente'}`;
        barWrap.appendChild(seg);
      });
      vDiv.appendChild(barWrap);
      // PK ruler for this view
      const ruler=document.createElement('div');ruler.className='pd-pk-ruler';
      const step=Math.max(10,Math.round((p.pkEnd-p.pkStart)/7/10)*10);
      for(let pk=p.pkStart;pk<=p.pkEnd;pk+=step){const t=document.createElement('span');t.textContent=fmtPK(Math.round(pk));ruler.appendChild(t);}
      vDiv.appendChild(ruler);
      progDiv.appendChild(vDiv);
    });
    // Zones with NC flags
    const zoneNCs=[];
    p.zones.forEach(z=>{
      const zNcF=pf.filter(f=>f.statut==='NC'&&f.pk_debut&&f.pk_fin&&!(f.pk_fin<z.pkStart||f.pk_debut>z.pkEnd));
      if(zNcF.length)zoneNCs.push({zone:z,fiches:zNcF});
    });
    if(zoneNCs.length){
      const nc2=document.createElement('div');nc2.style.cssText='margin-top:10px;padding:10px;background:var(--nc-bg);border:1px solid var(--nc-bd);border-radius:var(--r);font-size:11.5px;color:var(--nc)';
      nc2.innerHTML='<b>! Zones avec non-conformités :</b> '+zoneNCs.map(z=>`${z.zone.label} (${z.fiches.length} NC)`).join(' · ');
      progDiv.appendChild(nc2);
    }
  } else {
    progDiv.innerHTML=`<div class="pd-prog-title">Représentation PK</div><div style="color:var(--t3);font-size:12px">Aucune fiche avec PK renseigné pour cette phase.</div>`;
  }
  body.appendChild(progDiv);

  // FCQ table for this phase
  const tblDiv=document.createElement('div');
  tblDiv.innerHTML=`<div class="pd-fcq-title"><span>Fiches FCQ — ${ref}</span><button class="btn" onclick="filterFCQByRef('${ref}')"><svg width="11" height="11"><use href="#i-fcq"/></svg> Voir dans FCQ</button></div>`;
  const tblWrap=document.createElement('div');tblWrap.className='tbl-wrap';
  const tbl=document.createElement('table');tbl.className='dtbl';
  tbl.innerHTML=`<thead><tr><th>Fiche de contrôle</th><th>Voie</th><th>PK</th><th>Date</th><th>Statut</th><th>Avancement</th><th style="width:54px"></th></tr></thead>`;
  const tbody=document.createElement('tbody');
  pf.forEach(f=>{
    const idx=p.fiches.indexOf(f);
    const bdg=f.statut==='C'?`<span class="bdg bdg-ok">C</span>`:f.statut==='NC'?`<span class="bdg bdg-nc">NC</span>`:`<span class="bdg bdg-wt">Att.</span>`;
    const prog=f.pk_debut&&f.pk_fin?`<div class="fcq-row-progress"><div class="fcq-row-fill" style="width:${f.statut==='C'?100:f.statut==='NC'?100:50}%;background:${f.statut==='C'?'var(--ok)':f.statut==='NC'?'var(--nc)':'var(--wt)'}"></div></div>`:'';
    const tr2=document.createElement('tr');
    tr2.innerHTML=`<td style="font-weight:600">${f.fiche}${f.commentaire?`<div class="nc-note"><svg width="10" height="10"><use href="#i-warn"/></svg>${f.commentaire}</div>`:''}</td>
      <td><span class="voie-t">${f.voie}</span></td>
      <td><span class="pk-t">${f.pk_debut?fmtPK(f.pk_debut)+'→'+fmtPK(f.pk_fin):'—'}</span></td>
      <td><span class="date-t">${f.date||'—'}</span></td>
      <td>${bdg}</td>
      <td>${prog}</td>
      <td><div class="row-acts">
        <button class="rbtn edit" onclick="editFicheFromPhase(${idx})"><svg width="11" height="11"><use href="#i-edit"/></svg></button>
        <button class="rbtn del" onclick="confirmDel('fiche',${idx},true)"><svg width="11" height="11"><use href="#i-x"/></svg></button>
      </div></td>`;
    tbody.appendChild(tr2);
  });
  tbl.appendChild(tbody);tblWrap.appendChild(tbl);tblDiv.appendChild(tblWrap);body.appendChild(tblDiv);

  document.getElementById('pd-ov').classList.add('open');
}
function closePhaseDetail(){document.getElementById('pd-ov').classList.remove('open');}
function editFicheFromPhase(idx){closePhaseDetail();openAddFiche(idx);}
function filterFCQByRef(ref){closePhaseDetail();showPage('fcq',document.getElementById('nv-fcq'));document.getElementById('fcq-s').value=ref;renderFCQ();}

// ════ FCQ ════
/* ── FCQ état interne ── */
let fcqStatut = 'all'; // 'all' | 'C' | 'NC' | ''
let fcqVoie   = 'all'; // 'all' | 'V1' | 'V2'

function renderFCQStats(){
  const p = CP;
  const ok   = p.fiches.filter(f => f.statut === 'C').length;
  const nc   = p.fiches.filter(f => f.statut === 'NC').length;
  const pend = p.fiches.filter(f => !f.statut || (f.statut !== 'C' && f.statut !== 'NC')).length;
  const pct  = p.fiches.length ? Math.round(ok / p.fiches.length * 100) : 0;

  const el = document.getElementById('fcq-stats');
  if (!el) return;

  // Stat strip compacte — pas les gros .sc
  el.innerHTML = `
    <div class="fcq-stat-item sc-clickable" style="--scc:var(--accent)" onclick="setFCQStatut('all',null)" id="fsi-all">
      <div class="fcq-stat-num">${p.fiches.length}</div>
      <div class="fcq-stat-lbl">Total</div>
    </div>
    <div class="fcq-stat-item sc-clickable" style="--scc:var(--ok)" onclick="setFCQStatut('C',null)" id="fsi-c">
      <div class="fcq-stat-num">${ok}</div>
      <div class="fcq-stat-lbl">Conf.</div>
      <div class="fcq-stat-bar"><div class="fcq-stat-bar-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="fcq-stat-item sc-clickable" style="--scc:var(--nc)" onclick="setFCQStatut('NC',null)" id="fsi-nc">
      <div class="fcq-stat-num">${nc}</div>
      <div class="fcq-stat-lbl">Non conf.</div>
    </div>
    <div class="fcq-stat-item sc-clickable" style="--scc:var(--wt)" onclick="setFCQStatut('',null)" id="fsi-pend">
      <div class="fcq-stat-num">${pend}</div>
      <div class="fcq-stat-lbl">En attente</div>
    </div>`;

  document.getElementById('fcq-desc').textContent =
    CP.name + ' · ' + CP.ligne + ' · PK ' + fmtPK(CP.pkStart) + ' → ' + fmtPK(CP.pkEnd);

  _syncFCQActiveStates();
}

function _syncFCQActiveStates() {
  // Sync stat strip
  ['all','c','nc','pend'].forEach(k => {
    const el = document.getElementById('fsi-' + k);
    if (el) el.classList.remove('fsi-active');
  });
  const statMap = { 'all': 'fsi-all', 'C': 'fsi-c', 'NC': 'fsi-nc', '': 'fsi-pend' };
  const active = document.getElementById(statMap[fcqStatut]);
  if (active) active.classList.add('fsi-active');

  // Sync statut pills
  ['fp-all','fp-c','fp-nc','fp-pend'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const pillMap = { 'all':'fp-all', 'C':'fp-c', 'NC':'fp-nc', '':'fp-pend' };
  const pill = document.getElementById(pillMap[fcqStatut]);
  if (pill) pill.classList.add('active');

  // Sync voie pills
  ['fv-all','fv-v1','fv-v2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const voiePillMap = { 'all':'fv-all', 'V1':'fv-v1', 'V2':'fv-v2' };
  const vp = document.getElementById(voiePillMap[fcqVoie]);
  if (vp) vp.classList.add('active');
}

function setFCQStatut(s, el) {
  fcqStatut = s;
  _syncFCQActiveStates();
  renderFCQ();
}
function setFCQVoie(v, el) {
  fcqVoie = v;
  _syncFCQActiveStates();
  renderFCQ();
}

// Compat legacy — setFF toujours utilisé depuis synoptique et recherche
function setFF(f, el) {
  // Distinguer statut vs voie
  if (f === 'V1' || f === 'V2') {
    fcqVoie = f;
  } else {
    fcqStatut = f;
    fcqVoie   = 'all'; // reset voie quand on filtre par statut
  }
  _syncFCQActiveStates();
  renderFCQ();
}

function renderFCQ(){
  if (!CP) return;
  const p = CP;
  const rawQ = document.getElementById('fcq-s');
  const q = (rawQ ? rawQ.value : '').toLowerCase().trim();

  // Afficher/masquer le bouton clear
  const clrBtn = document.getElementById('fcq-s-clear');
  if (clrBtn) clrBtn.style.display = q ? 'flex' : 'none';

  const data = p.fiches.filter(f => {
    // Filtre texte
    const mq = !q || [f.ref, f.fiche, f.voie, String(f.pk_debut||''), f.commentaire||'', String(f.pk_fin||'')]
      .some(v => v && v.toLowerCase().includes(q));

    // Filtre statut
    let ms;
    if (fcqStatut === 'all') {
      ms = true;
    } else if (fcqStatut === '') {
      ms = !f.statut || (f.statut !== 'C' && f.statut !== 'NC');
    } else {
      ms = f.statut === fcqStatut;
    }

    // Filtre voie — indépendant
    const mv = fcqVoie === 'all' || f.voie === fcqVoie;

    return mq && ms && mv;
  });

  // Tri
  if (fcqSortCol) {
    data.sort((a, b) => {
      let va, vb;
      if (fcqSortCol === 'pk')     { return fcqSortAsc ? (a.pk_debut||0)-(b.pk_debut||0) : (b.pk_debut||0)-(a.pk_debut||0); }
      if (fcqSortCol === 'date')   { va = a.date||''; vb = b.date||''; }
      if (fcqSortCol === 'ref')    { va = a.ref||''; vb = b.ref||''; }
      if (fcqSortCol === 'fiche')  { va = a.fiche||''; vb = b.fiche||''; }
      if (fcqSortCol === 'voie')   { va = a.voie||''; vb = b.voie||''; }
      if (fcqSortCol === 'statut') { va = a.statut||''; vb = b.statut||''; }
      return fcqSortAsc ? (va||'').localeCompare(vb||'') : (vb||'').localeCompare(va||'');
    });
  }

  const tb = document.getElementById('fcq-tb');
  if (!tb) return;

  if (!data.length) {
    const hasFilter = fcqStatut !== 'all' || fcqVoie !== 'all' || q;
    tb.innerHTML = `<tr><td colspan="8">
      <div class="fcq-empty">
        <div class="fcq-empty-ico">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div class="fcq-empty-title">${hasFilter ? 'Aucune fiche correspondante' : 'Aucune fiche FCQ'}</div>
        <div class="fcq-empty-sub">${hasFilter ? 'Essayez de modifier les filtres ou la recherche' : 'Créez votre première fiche avec le bouton "Nouvelle fiche"'}</div>
        ${hasFilter ? `<button class="btn" onclick="fcqStatut='all';fcqVoie='all';document.getElementById('fcq-s').value='';_syncFCQActiveStates();renderFCQ()" style="margin-top:4px">Effacer les filtres</button>` : ''}
      </div>
    </td></tr>`;
    return;
  }

  // Compteur résultats
  const cntEl = document.getElementById('fcq-count');
  if (cntEl) cntEl.textContent = data.length + ' / ' + p.fiches.length + ' fiche' + (p.fiches.length > 1 ? 's' : '');

  tb.innerHTML = data.map(f => {
    const idx = p.fiches.indexOf(f);
    const isNC = f.statut === 'NC';
    const isC  = f.statut === 'C';
    const bdg  = isC  ? '<span class="bdg bdg-ok">Conf.</span>'
               : isNC ? '<span class="bdg bdg-nc">NC</span>'
                      : '<span class="bdg bdg-wt">Att.</span>';
    const sfTag = f.sf ? '<span class="sf-tag">SF</span>' : '';
    const tolTag = f.tolerance
      ? `<div class="fiche-tol">${f.tolerance}</div>` : '';
    const ncNote = f.commentaire
      ? `<div class="nc-note"><svg width="10" height="10"><use href="#i-warn"/></svg>${f.commentaire}</div>` : '';
    const pjCount = f.pjs ? f.pjs.length : (f.att || 0);
    const att = pjCount > 0
      ? `<span class="pj-count" onclick="viewFichePJs(this,${p.fiches.indexOf(f)})" title="${pjCount} pièce(s) jointe(s)">${pjCount}</span>`
      : `<span class="pj-add" onclick="openAddFiche(${p.fiches.indexOf(f)})" title="Ajouter une pièce jointe">+</span>`;
    const rowClass = isNC ? 'row-nc' : isC ? 'row-c' : 'row-pend';
    const dateStyle = isNC ? 'color:var(--nc);font-weight:600' : 'color:var(--t3)';

    return `<tr class="${rowClass}" data-idx="${idx}">
      <td><span class="ref-t">${f.ref||'—'}</span></td>
      <td class="fiche-cell">
        <div class="fiche-name">${f.fiche||'—'}${sfTag}</div>
        ${tolTag}${ncNote}
      </td>
      <td><span class="voie-pill">${f.voie||'—'}</span></td>
      <td><span class="pk-val">${f.pk_debut ? fmtPK(f.pk_debut)+'→'+fmtPK(f.pk_fin) : '—'}</span></td>
      <td><span class="date-t" style="${dateStyle}">${f.date||'—'}</span></td>
      <td>${bdg}</td>
      <td class="pj-cell">${att}</td>
      <td><div class="row-acts">
        <button class="rbtn edit" onclick="openAddFiche(${idx})" title="Modifier"><svg width="11" height="11"><use href="#i-edit"/></svg></button>
        <button class="rbtn del" onclick="confirmDel('fiche',${idx})" title="Supprimer"><svg width="11" height="11"><use href="#i-x"/></svg></button>
      </div></td>
    </tr>`;
  }).join('');
}


// ════ JOINTS ════
function renderJoints(){
  const p=CP;
  document.getElementById('jt-stats').innerHTML=`<div class="sc" style="--scc:var(--vi)"><div class="sc-v" style="color:var(--vi)">${p.joints.filter(j=>j.type==='jic').length}</div><div class="sc-l">JIC</div></div><div class="sc" style="--scc:var(--ro)"><div class="sc-v" style="color:var(--ro)">${p.joints.filter(j=>j.type==='jm').length}</div><div class="sc-l">JM</div></div><div class="sc" style="--scc:var(--ok)"><div class="sc-v" style="color:var(--ok)">${p.joints.filter(j=>j.phase==='Phase 1').length}</div><div class="sc-l">Phase 1</div></div><div class="sc" style="--scc:var(--wt)"><div class="sc-v" style="color:var(--wt)">${p.joints.filter(j=>j.phase==='Phase 2').length}</div><div class="sc-l">Phase 2</div></div>`;
  let data=p.joints;
  if(jF==='jic')data=data.filter(j=>j.type==='jic');
  else if(jF==='jm')data=data.filter(j=>j.type==='jm');
  else if(jF==='ph1')data=data.filter(j=>j.phase==='Phase 1');
  else if(jF==='ph2')data=data.filter(j=>j.phase==='Phase 2');
  document.getElementById('jt-grid').innerHTML=data.map(j=>{
    const idx=p.joints.indexOf(j);
    return `<div class="jcard">
      <button class="jcard-del" onclick="confirmDel('joint',${idx})" style="right:36px" title="Supprimer"><svg width="10" height="10"><use href="#i-x"/></svg></button>
      <button class="jcard-del" onclick="openEditJoint(${idx})" style="right:10px;color:var(--accent)" title="Modifier"><svg width="10" height="10"><use href="#i-edit"/></svg></button>
      <div class="jcard-top">
        <span class="jtag ${j.type==='jic'?'jtag-jic':'jtag-jm'}">${j.type.toUpperCase()} — ${j.type==='jic'?'Isolant Collé':'Mécanique'}</span>
        <span class="ph-tag ${j.phase==='Phase 2'?'ph2':'ph1'}">${j.phase}</span>
      </div>
      <div class="jenc">${j.zone_enc}</div>
      <div class="jmeta">
        <div><span class="jmi-l">Zone</span><span class="jmi-v">${j.zone||'—'}</span></div>
        <div><span class="jmi-l">Voie</span><span class="jmi-v">${j.voie}</span></div>
        <div><span class="jmi-l">PK</span><span class="jmi-v mono">${j.pk}</span></div>
        ${j.type_ci?`<div><span class="jmi-l">Type CI</span><span class="jmi-v">${j.type_ci}</span></div>`:''}
        <div><span class="jmi-l">Date prévue</span><span class="jmi-v">${j.date_prev||'—'}</span></div>
      </div>
      ${j.detail?`<div class="j-alert"><svg width="13" height="13"><use href="#i-warn"/></svg>${j.detail}</div>`:''}
    </div>`;
  }).join('');
}
function setJF(f,el){jF=f;document.querySelectorAll('[id^="jf-"]').forEach(b=>b.classList.remove('on'));el.classList.add('on');renderJoints();}

// ════ SOUDURES ════
function renderSoudures(){
  document.getElementById('soud-grid').innerHTML=SOUDURES_LIB.map(s=>`
    <div class="soud-card">
      <div class="soud-top">
        <div class="soud-ico" style="border-color:${s.color}30;background:${s.color}12">
          <span style="font-size:18px">${getIcon(s.icon)}
        </div>
        <div>
          <div class="soud-name">${s.name}</div>
          <div class="soud-code">${s.code}</div>
        </div>
      </div>
      <div class="soud-desc">${s.desc}</div>
      <div class="soud-tags">${s.tags.map(t=>`<span class="soud-tag">${t}</span>`).join('')}</div>
      <div class="soud-norm">${s.norme}</div>
    </div>`).join('');
}

// ════ PLAN ════
function renderPlan(){
  const p=CP; if(!p) return;
  const sfCount=p.plan.filter(pi=>pi.sf).length;
  const hdr=document.getElementById('plan-hdr');
  if(hdr) hdr.innerHTML=`
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <div class="sc" style="--scc:var(--accent);flex:1;min-width:80px"><div class="sc-v" style="color:var(--accent)">${p.plan.length}</div><div class="sc-l">Opérations</div></div>
      <div class="sc" style="--scc:var(--nc);flex:1;min-width:80px"><div class="sc-v" style="color:var(--nc)">${sfCount}</div><div class="sc-l">Points d'arrêt SF</div></div>
      <div class="sc" style="--scc:var(--ok);flex:1;min-width:80px"><div class="sc-v" style="color:var(--ok)">${p.plan.filter(pi=>!pi.sf).length}</div><div class="sc-l">Contrôles simples</div></div>
    </div>`;

  // Group by section
  const sections={
    "Géométrie voie":["Nivellement","Travelage et équerrage","Écartement","Dévers","Zniv","Épaufures"],
    "Joints Isolants Collés":["JIC","Équerrage des JIC","Isolement","joint"],
    "Joints Grands Permissifs":["JGP","Ouverture des joints"],
    "Libération LRS":["libération","libéré","LRS","homogénéisation","coupon"],
    "Généralités":["soudure","quai","gabarit","graisse","anti-pièces","champignon"]
  };
  function getSection(name){
    const nl=name.toLowerCase();
    for(const [sec,kws] of Object.entries(sections)){
      if(kws.some(k=>nl.includes(k.toLowerCase()))) return sec;
    }
    return "Autres";
  }

  const grouped={};
  p.plan.forEach(pi=>{
    const sec=getSection(pi.name);
    if(!grouped[sec]) grouped[sec]=[];
    grouped[sec].push(pi);
  });

  const secColors={
    "Géométrie voie":"#2563EB",
    "Joints Isolants Collés":"#7C3AED",
    "Joints Grands Permissifs":"#0891B2",
    "Libération LRS":"#DC2626",
    "Généralités":"#64748B",
    "Autres":"#6B7280"
  };

  let html='';
  for(const [sec, items] of Object.entries(grouped)){
    const sc=secColors[sec]||'#6B7280';
    html+=`<div style="margin-bottom:22px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="width:4px;height:18px;background:${sc};border-radius:2px"></div>
        <div style="font-family:var(--fm);font-size:9.5px;text-transform:uppercase;letter-spacing:2px;color:var(--t2);font-weight:600">${sec}</div>
        <div style="flex:1;height:1px;background:var(--ln)"></div>
        <div style="font-family:var(--fm);font-size:9px;color:var(--t3)">${items.length} opération${items.length>1?'s':''}</div>
      </div>
      <div class="plan-grid">
      ${items.map(pi=>{
        const idx=p.plan.indexOf(pi);
        const sfBadge=pi.sf?`<div style="display:flex;align-items:center;gap:4px;padding:3px 8px;background:#FEF3C7;border:1px solid #FCD34D;border-radius:4px;font-family:var(--fm);font-size:9px;color:#92400E;font-weight:700">
          <svg width="10" height="10" style="color:#D97706"><use href="#i-warn"/></svg> POINT D'ARRÊT SF
        </div>`:'';
        return `<div class="pi" style="${pi.sf?'border-color:#FCD34D;background:linear-gradient(180deg,var(--surf),#FFFBEB10)':''}">
          <div class="pi-top">
            <div class="pi-name">${pi.name}</div>
            <span class="pi-ord" style="font-family:var(--fm);font-size:9px">#${pi.ordre}</span>
          </div>
          ${sfBadge}
          <div style="margin:8px 0 6px;display:flex;flex-wrap:wrap;gap:5px">
            <span style="font-family:var(--fm);font-size:9px;padding:2px 7px;border-radius:3px;background:var(--surf2);border:1px solid var(--ln);color:var(--t3)">${pi.type}</span>
            ${pi.responsable?`<span style="font-family:var(--fm);font-size:9px;padding:2px 7px;border-radius:3px;background:var(--surf2);border:1px solid var(--ln);color:var(--t2)">${pi.responsable}</span>`:''}
            ${pi.frequence?`<span style="font-family:var(--fm);font-size:9px;padding:2px 7px;border-radius:3px;background:var(--surf2);border:1px solid var(--ln);color:var(--t2)">↺ ${pi.frequence}</span>`:''}
          </div>
          ${pi.tolerance?`<div style="padding:7px 9px;background:var(--accent-bg);border:1px solid var(--accent-bd);border-radius:var(--r);margin-bottom:7px">
            <div style="font-family:var(--fm);font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px">Tolérance</div>
            <div style="font-size:11.5px;color:var(--accent);font-weight:600">${pi.tolerance}</div>
          </div>`:''}
          ${pi.critere?`<div style="font-size:10.5px;color:var(--t2);margin-bottom:7px;line-height:1.5">${pi.critere}</div>`:''}
          <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:7px">
            ${(pi.docs||[]).map(d=>`<span class="pi-tag">${d}</span>`).join('')}
          </div>
          ${pi.ref_govelins&&pi.ref_govelins!=='Pas de référence'?`<div style="font-family:var(--fm);font-size:8.5px;color:var(--vi);padding:3px 7px;background:var(--vi-bg);border-radius:3px;display:inline-block;margin-bottom:6px">Govelins: ${pi.ref_govelins}</div>`:''}
          ${pi.notes?`<div style="font-size:10px;color:var(--t3);font-style:italic;margin-bottom:6px">${pi.notes}</div>`:''}
          <div style="display:flex;gap:5px;padding-top:7px;border-top:1px solid var(--ln)">
            <button class="btn" style="font-size:11px;padding:4px 9px" onclick="genFicheFromPlan(${idx})">
              <svg width="10" height="10"><use href="#i-fcq"/></svg> Créer fiche FCQ
            </button>
            <button class="rbtn del" onclick="confirmDel('plan',${idx})"><svg width="11" height="11"><use href="#i-x"/></svg></button>
          </div>
        </div>`;
      }).join('')}
      </div>
    </div>`;
  }
  const container=document.getElementById('plan-grid');
  if(container) container.innerHTML=html;
}

// ── GENERATE FCQ FROM PLAN ──
function genFicheFromPlan(idx){
  const pi=CP.plan[idx];
  if(!pi){toast('Opération introuvable','err');return;}
  // Pre-fill fiche modal with plan data
  document.getElementById('fiche-mt').textContent='Fiche FCQ — '+pi.name;
  document.getElementById('af-ref').value=pi.name;
  document.getElementById('af-fiche').value=(pi.docs&&pi.docs[0])||'';
  document.getElementById('af-voie').value='V1';
  document.getElementById('af-stat').value='';
  document.getElementById('af-pkd').value=CP.pkStart||'';
  document.getElementById('af-pkf').value=CP.pkEnd||'';
  document.getElementById('af-date').value='';
  document.getElementById('af-sig').value='';
  // Put tolerance + critère in commentaire
  let com='';
  if(pi.tolerance) com+='TOL: '+pi.tolerance;
  if(pi.critere) com+=(com?'\n':'')+'CRITÈRE: '+pi.critere;
  document.getElementById('af-com').value=com;
  editFicheIdx=null;
  document.getElementById('m-fiche').classList.add('open');
  toast('Fiche pré-remplie depuis le plan de contrôle','ok');
}

// ── GENERATE ALL FCQ FROM PLAN ──
function genAllFichesFromPlan(){
  if(!CP){toast('Ouvrez un projet','err');return;}
  let count=0;
  CP.plan.forEach(pi=>{
    // Create one fiche per voie for ops with docs
    if(pi.docs&&pi.docs[0]&&pi.docs[0]!=='-'){
      ['V1','V2'].forEach(v=>{
        const existing=CP.fiches.find(f=>f.ref===pi.name&&f.voie===v);
        if(!existing){
          CP.fiches.push({
            ref:pi.name,
            fiche:pi.docs[0],
            voie:v,
            statut:null,
            pk_debut:null,
            pk_fin:null,
            date:null,
            commentaire:pi.tolerance?'TOL: '+pi.tolerance:null,
            att:0,
            sf:pi.sf||false,
            tolerance:pi.tolerance||null,
            critere:pi.critere||null,
            frequence:pi.frequence||null,
            responsable:pi.responsable||null
          });
          count++;
        }
      });
    }
  });
  updBadges();
  toast(count+' fiche'+( count>1?'s':'')+' FCQ créée'+( count>1?'s':'')+' depuis le plan ','ok');
  if(document.getElementById('pg-fcq').classList.contains('active')){renderFCQ();renderFCQStats();}
}

// ════ CONFIG ════
function loadCfg(){
  if(!CP)return;
  document.getElementById('cg-name').value=CP.name;document.getElementById('cg-ligne').value=CP.ligne;document.getElementById('cg-type').value=CP.type;document.getElementById('cg-pks').value=CP.pkStart;document.getElementById('cg-pke').value=CP.pkEnd;document.getElementById('cg-moa').value=CP.moa||'';document.getElementById('cg-ent').value=CP.entreprise||'';document.getElementById('cg-desc').value=CP.desc||'';document.getElementById('ca-c1').value=CP.color;document.getElementById('ca-c2').value=CP.color2||'#2563eb';document.getElementById('ca-logo').value=CP.logo||'';liveColor();renderZonesEd();renderFTEd();
}
function liveUpd(){if(!CP)return;CP.name=document.getElementById('cg-name').value||CP.name;CP.pkStart=parseInt(document.getElementById('cg-pks').value)||CP.pkStart;CP.pkEnd=parseInt(document.getElementById('cg-pke').value)||CP.pkEnd;document.getElementById('sb-pn').textContent=CP.name;}
function liveColor(){const c1=document.getElementById('ca-c1').value,c2=document.getElementById('ca-c2').value;document.getElementById('cprev').style.background=`linear-gradient(90deg,${c1},${c2})`;}
function saveCfg(){if(!CP)return;CP.name=document.getElementById('cg-name').value;CP.ligne=document.getElementById('cg-ligne').value;CP.type=document.getElementById('cg-type').value;CP.pkStart=parseInt(document.getElementById('cg-pks').value)||CP.pkStart;CP.pkEnd=parseInt(document.getElementById('cg-pke').value)||CP.pkEnd;CP.moa=document.getElementById('cg-moa').value;CP.entreprise=document.getElementById('cg-ent').value;CP.desc=document.getElementById('cg-desc').value;document.getElementById('sb-pn').textContent=CP.name;toast('Projet sauvegardé','ok');}
function saveApp(){if(!CP)return;CP.color=document.getElementById('ca-c1').value;CP.color2=document.getElementById('ca-c2').value;CP.logo=document.getElementById('ca-logo').value;document.getElementById('sb-pc').style.background=CP.color;toast('Apparence appliquée','ok');}
function showCfg(id,el){document.querySelectorAll('.cs').forEach(s=>s.classList.remove('active'));document.querySelectorAll('.cni').forEach(n=>n.classList.remove('active'));document.getElementById('cs-'+id).classList.add('active');el.classList.add('active');if(id==='zones')renderZonesEd();if(id==='ft')renderFTEd();}
function renderZonesEd(){if(!CP)return;document.getElementById('zones-list').innerHTML=CP.zones.map((z,i)=>`<div class="ze-row"><div class="ze-sw" style="background:${ZC[i%ZC.length]}"></div><input class="ze-name" value="${z.label}" onchange="CP.zones[${i}].label=this.value"><span class="ze-sep">PK</span><input class="ze-pk" value="${z.pkStart}" type="number" onchange="CP.zones[${i}].pkStart=parseInt(this.value)"><span class="ze-sep">→</span><input class="ze-pk" value="${z.pkEnd}" type="number" onchange="CP.zones[${i}].pkEnd=parseInt(this.value)"><button class="ze-del" onclick="CP.zones.splice(${i},1);renderZonesEd()"><svg width="10" height="10"><use href="#i-x"/></svg></button></div>`).join('');}
function addZone(){CP.zones.push({label:'ZONE X',pkStart:CP.pkStart,pkEnd:CP.pkEnd});renderZonesEd();}
function saveZones(){renderSyn();toast('Zones mises à jour','ok');}
function renderFTEd(){if(!CP)return;document.getElementById('ftypes-list').innerHTML=CP.ficheTypes.map((ft,i)=>`<div class="ze-row"><input class="ze-name" value="${ft}" onchange="CP.ficheTypes[${i}]=this.value"><button class="ze-del" onclick="CP.ficheTypes.splice(${i},1);renderFTEd()"><svg width="10" height="10"><use href="#i-x"/></svg></button></div>`).join('');}
function addFT(){CP.ficheTypes.push('Nouveau type');renderFTEd();}

// ════ MODALS ════
function openNewProj(){document.getElementById('m-np').classList.add('open');}
function selType(el){document.querySelectorAll('.topt').forEach(o=>o.classList.remove('sel'));el.classList.add('sel');}
function createProj(){
  const name=document.getElementById('np-name').value.trim();
  const pk1=parseInt(document.getElementById('np-pks').value),pk2=parseInt(document.getElementById('np-pke').value);
  if(!name||!pk1||!pk2){toast('Remplissez les champs obligatoires *','err');return;}
  const type=document.querySelector('.topt.sel')?.dataset.t||'metro';
  const color=document.getElementById('np-color').value;
  const ligneColor=document.getElementById('np-ligne-color').value;
  const np={
    id:'p'+Date.now(),name,type,color,color2:'#2563eb',ligneColor,ligneCode:'',logo:type==='metro'?'':type==='rer'?'':'',
    desc:'',ligne:document.getElementById('np-ligne').value,moa:document.getElementById('np-moa').value,entreprise:'',
    pkStart:pk1,pkEnd:pk2,
    zones:[{label:'ZONE A',pkStart:pk1,pkEnd:Math.round((pk1+pk2)/2)},{label:'ZONE B',pkStart:Math.round((pk1+pk2)/2),pkEnd:pk2}],
    fiches:[],joints:[],plan:JSON.parse(JSON.stringify(DFLT_PLAN)),ficheTypes:[...DFLT_FT]
  };
  projects.push(np);closeM('m-np');openProj(np.id);toast('Projet créé ','ok');
}

function openAddFiche(idx=null){
  editFicheIdx=idx;
  document.getElementById('fiche-mt').textContent=idx!==null?'Modifier la fiche FCQ':'Nouvelle fiche FCQ';
  // Populate datalist
  const dl=document.getElementById('dl-refs');dl.innerHTML='';
  if(CP)CP.ficheTypes.forEach(ft=>{const o=document.createElement('option');o.value=ft;dl.appendChild(o);});
  if(idx!==null){
    const f=CP.fiches[idx];
    ['af-ref','af-fiche','af-sig','af-com'].forEach((id,i)=>document.getElementById(id).value=[f.ref,f.fiche,f.sig||'',f.commentaire||''][i]||'');
    document.getElementById('af-voie').value=f.voie||'V1';
    document.getElementById('af-stat').value=f.statut||'C';
    document.getElementById('af-pkd').value=f.pk_debut||'';
    document.getElementById('af-pkf').value=f.pk_fin||'';
    document.getElementById('af-date').value=f.date||'';
    // Charger PJs existantes
    pendingPJs = f.pjs ? JSON.parse(JSON.stringify(f.pjs)) : [];
  } else {
    ['af-ref','af-fiche','af-sig','af-com','af-pkd','af-pkf','af-date'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.value='';
    });
    document.getElementById('af-voie').value='V1';
    document.getElementById('af-stat').value='C';
    if(CP){document.getElementById('af-pkd').value=CP.pkStart;document.getElementById('af-pkf').value=CP.pkEnd;}
    pendingPJs = [];
  }
  // Rendu PJ
  if (typeof renderPJList === 'function') renderPJList();
  // Rendu historique
  if (idx !== null && CP && CP.fiches[idx]) {
    if (typeof renderFicheHistory === 'function') renderFicheHistory(CP.fiches[idx]);
  } else {
    const sec = document.getElementById('fiche-hist-sec');
    if (sec) sec.style.display = 'none';
  }
  document.getElementById('m-fiche').classList.add('open');
}

function saveFiche(){
  const f={ref:document.getElementById('af-ref').value,fiche:document.getElementById('af-fiche').value,voie:document.getElementById('af-voie').value,statut:document.getElementById('af-stat').value,pk_debut:parseInt(document.getElementById('af-pkd').value)||null,pk_fin:parseInt(document.getElementById('af-pkf').value)||null,date:document.getElementById('af-date').value||null,commentaire:document.getElementById('af-com').value||null,att:0};
  if(!f.ref||!f.fiche){toast('Référence et fiche obligatoires','err');return;}
  if(editFicheIdx!==null)CP.fiches[editFicheIdx]=f;else CP.fiches.push(f);
  closeM('m-fiche');if(document.getElementById('pg-fcq').classList.contains('active')){renderFCQ();renderFCQStats();}
  else if(document.getElementById('pg-syn').classList.contains('active'))renderSyn();
  updBadges();toast((editFicheIdx!==null?'Fiche mise à jour':'Fiche enregistrée')+' ','ok');
}

function openAddJoint(){document.getElementById('m-joint').classList.add('open');}
function saveJoint(){
  const j={type:document.getElementById('aj-type').value,zone:document.getElementById('aj-zone').value,zone_enc:document.getElementById('aj-enc').value,voie:document.getElementById('aj-voie').value,pk:parseFloat(document.getElementById('aj-pk').value)||0,type_ci:parseInt(document.getElementById('aj-ci').value)||null,date_prev:document.getElementById('aj-date').value,phase:document.getElementById('aj-phase').value,detail:document.getElementById('aj-detail').value||null};
  CP.joints.push(j);closeM('m-joint');renderJoints();updBadges();toast('Joint enregistré ','ok');
}

function openAddPlan(){document.getElementById('m-plan').classList.add('open');}
function savePlan(){
  const pi={name:document.getElementById('pl-name').value,type:document.getElementById('pl-type').value,ordre:parseInt(document.getElementById('pl-ord').value)||CP.plan.length+1,docs:document.getElementById('pl-docs').value.split(',').map(d=>d.trim()).filter(Boolean),notes:document.getElementById('pl-notes').value};
  if(!pi.name){toast('Nom obligatoire','err');return;}
  CP.plan.push(pi);closeM('m-plan');renderPlan();updBadges();toast('Étape ajoutée ','ok');
}

function confirmDel(type,idx,fromPhase=false){
  const msgs={fiche:'Cette fiche FCQ sera définitivement supprimée.',joint:'Ce joint sera définitivement supprimé.',plan:'Cette étape du plan de contrôle sera supprimée.'};
  document.getElementById('conf-m').textContent=msgs[type];
  document.getElementById('conf-ok').onclick=()=>{
    if(type==='fiche'){CP.fiches.splice(idx,1);if(document.getElementById('pg-fcq').classList.contains('active')){renderFCQ();renderFCQStats();}else renderSyn();}
    else if(type==='joint'){CP.joints.splice(idx,1);renderJoints();}
    else if(type==='plan'){CP.plan.splice(idx,1);renderPlan();}
    updBadges();closeM('m-confirm');
    if(fromPhase)closePhaseDetail();
    toast('Supprimé ','ok');
  };
  document.getElementById('m-confirm').classList.add('open');
}
function closeM(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.mov').forEach(m=>m.addEventListener('click',e=>{if(e.target===e.currentTarget)m.classList.remove('open');}));
document.getElementById('pd-ov').addEventListener('click',e=>{if(e.target===e.currentTarget)closePhaseDetail();});

// ════ TOOLTIP ════
const ttEl=document.getElementById('tt');

// ════ TOOLTIP ZONE RICHE ════
function showZoneTT(e, zi){
  const p = CP; if(!p) return;
  const z = p.zones[zi];
  const zf = p.fiches.filter(f =>
    f.pk_debut && f.pk_fin &&
    !(f.pk_fin < z.pkStart || f.pk_debut > z.pkEnd)
  );
  const ok  = zf.filter(f => f.statut === 'C').length;
  const nc  = zf.filter(f => f.statut === 'NC').length;
  const wt  = zf.filter(f => !f.statut).length;
  const pct = zf.length ? Math.round(ok / zf.length * 100) : 0;
  const ncFiches = zf.filter(f => f.statut === 'NC');
  const wtFiches = zf.filter(f => !f.statut);

  // Build NC list (max 4)
  const ncItems = ncFiches.slice(0,4).map(f =>
    `<div style="display:flex;align-items:flex-start;gap:5px;margin-top:5px;padding:4px 6px;background:var(--nc-bg);border-left:2px solid var(--nc);border-radius:3px">
      <div>
        <div style="font-size:10.5px;font-weight:700;color:var(--nc)">${f.fiche}</div>
        <div style="font-family:var(--fm);font-size:9px;color:var(--t3);margin-top:1px">${f.voie} · ${f.pk_debut?fmtPK(f.pk_debut)+'→'+fmtPK(f.pk_fin):'PK —'}</div>
        ${f.commentaire?`<div style="font-size:9px;color:var(--nc);margin-top:2px">! ${f.commentaire}</div>`:''}
      </div>
    </div>`
  ).join('');
  const moreNC = ncFiches.length > 4
    ? `<div style="font-size:9.5px;color:var(--nc);margin-top:4px;text-align:center">+${ncFiches.length-4} non-conformité${ncFiches.length-4>1?'s':''} supplémentaire${ncFiches.length-4>1?'s':''}</div>` : '';

  // Build attente list (max 3)
  const wtItems = wtFiches.slice(0,3).map(f =>
    `<div style="display:flex;align-items:center;gap:5px;margin-top:4px;padding:3px 6px;background:var(--wt-bg);border-left:2px solid var(--wt);border-radius:3px">
      <div style="font-size:10px;font-weight:600;color:var(--wt)">${f.fiche}</div>
      <div style="font-family:var(--fm);font-size:9px;color:var(--t3);margin-left:auto">${f.voie}</div>
    </div>`
  ).join('');
  const moreWT = wtFiches.length > 3
    ? `<div style="font-size:9.5px;color:var(--wt);margin-top:3px;text-align:center">+${wtFiches.length-3} en attente</div>` : '';

  // Progress bar
  const barColor = pct===100?'var(--ok)':pct>60?'var(--ok)':'var(--nc)';
  const statusIcon = '';

  document.getElementById('ttt').innerHTML =
    `<span style="margin-right:5px">${statusIcon}</span>${z.label}
     <span style="font-family:var(--fm);font-size:8.5px;color:var(--t3);margin-left:6px;font-weight:400">PK ${fmtPK(z.pkStart)}→${fmtPK(z.pkEnd)}</span>`;

  document.getElementById('ttb').innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
      <span style="font-family:var(--fm);font-size:9.5px;padding:2px 7px;border-radius:3px;background:var(--surf2);border:1px solid var(--ln);color:var(--t2)">${zf.length} fiches</span>
      <span style="font-family:var(--fm);font-size:9.5px;padding:2px 7px;border-radius:3px;background:var(--ok-bg);border:1px solid var(--ok-bd);color:var(--ok)">${ok} C</span>
      ${nc?`<span style="font-family:var(--fm);font-size:9.5px;padding:2px 7px;border-radius:3px;background:var(--nc-bg);border:1px solid var(--nc-bd);color:var(--nc);font-weight:700">${nc} NC</span>`:''}
      ${wt?`<span style="font-family:var(--fm);font-size:9.5px;padding:2px 7px;border-radius:3px;background:var(--wt-bg);border:1px solid var(--wt-bd);color:var(--wt)">${wt}</span>`:''}
    </div>
    <div style="height:4px;background:var(--ln);border-radius:2px;overflow:hidden;margin-bottom:8px">
      <div style="width:${pct}%;height:100%;background:${barColor};border-radius:2px;transition:width .3s"></div>
    </div>
    ${nc>0?`<div style="font-family:var(--fm);font-size:8.5px;text-transform:uppercase;letter-spacing:1.2px;color:var(--nc);margin-bottom:3px">! Non-conformités</div>${ncItems}${moreNC}`:''}
    ${wt>0?`<div style="font-family:var(--fm);font-size:8.5px;text-transform:uppercase;letter-spacing:1.2px;color:var(--wt);margin:${nc>0?'8':'0'}px 0 3px">En attente</div>${wtItems}${moreWT}`:''}
    ${nc===0&&wt===0?`<div style="text-align:center;padding:6px;font-size:11px;color:var(--ok);font-weight:600"> Zone 100% conforme</div>`:''}
    <div style="font-size:10px;color:var(--t4);margin-top:8px;border-top:1px solid var(--ln);padding-top:6px">Clic = détail · Double-clic = renommer</div>`;

  ttEl.classList.add('show');
}
function showFTT(e,f){
  document.getElementById('ttt').textContent=f.fiche;
  document.getElementById('ttb').innerHTML=`
    <div class="tt-row"><span class="tt-k">Référence</span><span class="tt-v" style="font-size:10.5px">${f.ref}</span></div>
    <div class="tt-row"><span class="tt-k">Voie</span><span class="tt-v">${f.voie}</span></div>
    <div class="tt-row"><span class="tt-k">PK</span><span class="tt-v">${f.pk_debut?fmtPK(f.pk_debut)+'→'+fmtPK(f.pk_fin):'—'}</span></div>
    <div class="tt-row"><span class="tt-k">Date</span><span class="tt-v">${f.date||'—'}</span></div>
    <div class="tt-row"><span class="tt-k">Statut</span><span class="tt-b ${f.statut==='C'?'tt-ok':f.statut==='NC'?'tt-nc':'tt-wt'}">${f.statut||'En attente'}</span></div>
    ${f.commentaire?`<div style="margin-top:6px;font-size:10px;color:var(--nc)">! ${f.commentaire}</div>`:''}`;
  ttEl.classList.add('show');
}
function showJTT(e,j){
  document.getElementById('ttt').textContent=j.type.toUpperCase()+' · '+j.zone_enc;
  document.getElementById('ttb').innerHTML=`
    <div class="tt-row"><span class="tt-k">Type</span><span class="tt-v">${j.type==='jic'?'Joint Isolant Collé':'Joint Mécanique'}</span></div>
    <div class="tt-row"><span class="tt-k">Zone</span><span class="tt-v">${j.zone||'—'}</span></div>
    <div class="tt-row"><span class="tt-k">Voie</span><span class="tt-v">${j.voie}</span></div>
    <div class="tt-row"><span class="tt-k">PK</span><span class="tt-v">${j.pk}</span></div>
    <div class="tt-row"><span class="tt-k">Phase</span><span class="tt-v">${j.phase}</span></div>
    ${j.detail?`<div style="margin-top:6px;font-size:10px;color:var(--wt)">! ${j.detail}</div>`:''}`;
  ttEl.classList.add('show');
}
function moveTT(e){ttEl.style.left=(e.clientX+14)+'px';ttEl.style.top=(e.clientY-8)+'px';}
function hideTT(){ttEl.classList.remove('show');}

// ════ TOAST ════
function toast(msg,type='ok'){
  const el=document.createElement('div');el.className='toast '+(type||'ok');
  el.innerHTML=`<span class="ti"><svg width="14" height="14"><use href="#i-${type==='ok'?'fcq':type==='err'?'warn':'lamp'}"/></svg></span>${msg}`;
  document.body.appendChild(el);setTimeout(()=>el.style.opacity='0',2400);setTimeout(()=>el.remove(),2800);
}

// ════ GUIDE LAMP ════
function toggleGuide(){
  const ov=document.getElementById('guide-overlay');
  const show=ov.classList.toggle('show');
  if(show) showGuideTab('start', document.querySelector('.guide-tab'));
}

// ── GUIDE CONTENT ──
const GUIDE_CONTENT = {
  start: `
<div class="guide-tip"><b>Bienvenue dans RailQual v3</b> — Plateforme de pilotage qualité voie RATP / ETF. Créé par LOKONON Godfree Samir.</div>
<div class="guide-section">
  <div class="guide-section-title">Créer un projet</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--ok-bg);color:var(--ok)">+</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Nouveau projet</div>
      <div class="guide-item-desc">Cliquez <b>+ Nouveau projet</b> sur l'écran d'accueil. Choisissez le type (Métro / RER / Tramway), renseignez le nom, la ligne RATP, les PK début/fin et les zones. Le projet est prêt en 30 secondes.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--accent-bg);color:var(--accent)">⬟</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Couleur ligne RATP</div>
      <div class="guide-item-desc">Sélectionnez la ligne RATP (M1→M14, RER A→E, T1/T2). La couleur officielle s'applique automatiquement sur le projet et les exports PDF.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Navigation</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)">≡</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Barre latérale</div>
      <div class="guide-item-desc">La sidebar gauche donne accès aux 6 modules : <b>Synoptique</b>, <b>Fiches FCQ</b>, <b>Joints</b>, <b>Soudures</b>, <b>Plan de contrôle</b>, <b>Alertes</b> et <b>Configuration</b>.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)">⌂</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Retour accueil</div>
      <div class="guide-item-desc">Cliquez le logo <b>RailQual</b> en haut de la sidebar pour revenir à l'accueil multi-projets sans perdre vos données.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Thèmes</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--accent-bg);color:var(--accent)">◐</div>
    <div class="guide-item-text">
      <div class="guide-item-title">8 thèmes disponibles</div>
      <div class="guide-item-desc"><b>Clair</b> · <b>Sombre</b> · <b>Midnight</b> (bleu nuit) · <b>Copper</b> (industriel ferreux) · <b>Forest</b> (vert profond) · <b>Sable</b> (beige pro) · <b>RATP</b> (bleu industriel) · <b>HC</b> (haut contraste accessibilité).<br>Changez le thème depuis l'accueil ou Configuration → Apparence.</div>
    </div>
  </div>
</div>`,

  syn: `
<div class="guide-tip"><b>Le synoptique</b> est la vue centrale. Il représente la voie en plan, de PK Début à PK Fin, avec les deux voies V1/V2, les zones, les fiches FCQ colorées et les joints.</div>
<div class="guide-section">
  <div class="guide-section-title">Zones</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--ok-bg);color:var(--ok)">◻</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Clic sur une zone</div>
      <div class="guide-item-desc">Ouvre le <b>panneau latéral de zone</b> avec les statistiques C/NC/Attente, la liste des fiches non conformes et en attente. Cliquez "Voir toutes les fiches" pour filtrer les FCQ sur cette zone.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--wt-bg);color:var(--wt)"></div>
    <div class="guide-item-text">
      <div class="guide-item-title">Double-clic → Renommer</div>
      <div class="guide-item-desc">Double-cliquez une zone pour modifier son nom en ligne. Appuyez Entrée pour valider. Action annulable avec <span class="guide-kbd">Ctrl</span><span class="guide-kbd">Z</span>.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--nc-bg);color:var(--nc)">!</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Survol → Tooltip NC</div>
      <div class="guide-item-desc">Survolez une zone pour voir un <b>résumé instantané</b> : compteurs C/NC/Attente, barre de conformité, liste des non-conformités avec PK et commentaire de réserve.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Rail & Segments</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--ok-bg)">●</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Segments colorés</div>
      <div class="guide-item-desc"><span style="color:var(--ok)">■ Vert</span> = Conforme · <span style="color:var(--nc)">■ Rouge</span> = Non conforme (+ glow pulsant) · <span style="color:var(--wt)">■ Orange</span> = En attente. Survolez un segment pour voir la fiche FCQ.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--nc-bg);color:var(--nc)">▼</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Pins NC sur le rail</div>
      <div class="guide-item-desc">Les non-conformités apparaissent comme des <b>pins rouges</b> flottants au-dessus du rail, positionnés au PK exact de la fiche NC.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Joints (JIC / JM)</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:rgba(124,58,237,.1);color:var(--vi)">◆</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Pins joints sur le rail</div>
      <div class="guide-item-desc"><span style="color:var(--vi)">◆ Violet</span> = JIC (Joint Isolant Collé) · <span style="color:var(--ro)">◆ Rose</span> = JM (Joint Mécanique). Survolez pour infos · <b>Cliquez pour éditer</b> le joint directement depuis le synoptique.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Points d'arrêt SF</div>
  <div class="guide-nc-block">! Un point d'arrêt SF non levé = chantier bloqué. Le panneau SF sous la barre de navigation affiche l'état en temps réel.</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:#FEF3C7;color:#92400E">SF</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Jalons bloquants</div>
      <div class="guide-item-desc">Les opérations marquées SF dans le plan de contrôle déclenchent une <b>alerte bloquante rouge</b> si leur fiche FCQ est NC. Créez la fiche de levée depuis le panneau SF pour débloquer.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Annuler des actions</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)">↩</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Ctrl+Z — Historique 30 étapes</div>
      <div class="guide-item-desc">Toutes les mutations (ajouter/modifier/supprimer fiche, joint, renommer zone) sont annulables. Le bouton <b>Annuler</b> dans la topbar indique la dernière action.</div>
    </div>
  </div>
</div>`,

  fcq: `
<div class="guide-tip"><b>Les Fiches de Contrôle Qualité</b> (FCQ) sont le cœur du suivi. Chaque fiche correspond à une opération contrôlée sur une voie et un PK donné.</div>
<div class="guide-section">
  <div class="guide-section-title">Créer une fiche FCQ</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--ok-bg);color:var(--ok)">+</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Saisie manuelle</div>
      <div class="guide-item-desc">Bouton <b>+ Fiche</b> en haut à droite des FCQ. Renseignez : Référence Planning, Fiche de contrôle MOE, Voie (V1/V2), PK Début/Fin, Date, Statut (C / NC / Attente), Observations.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--accent-bg);color:var(--accent)"></div>
    <div class="guide-item-text">
      <div class="guide-item-title">Génération depuis le plan</div>
      <div class="guide-item-desc">Dans <b>Plan de contrôle → Générer fiches FCQ</b>, toutes les fiches sont créées automatiquement pour V1 et V2 avec les tolérances pré-remplies. Elles apparaissent en attente jusqu'à saisie terrain.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Statuts</div>
  <table class="guide-table">
    <tr><th>Statut</th><th>Couleur</th><th>Signification</th></tr>
    <tr><td><b style="color:var(--ok)">C — Conforme</b></td><td>Vert</td><td>Fiche signée, tolérances respectées</td></tr>
    <tr><td><b style="color:var(--nc)">NC — Non conforme</b></td><td>Rouge</td><td>Réserve active — fiche bloquante si SF</td></tr>
    <tr><td><b style="color:var(--wt)">Attente</b></td><td>Orange</td><td>Contrôle non encore réalisé</td></tr>
  </table>
</div>
<div class="guide-section">
  <div class="guide-section-title">Filtres et recherche</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)">⌕</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Recherche full-text</div>
      <div class="guide-item-desc">La barre de recherche filtre en temps réel sur : référence, fiche MOE, voie, PK, commentaire. Combinez avec les filtres C / NC / Attente / V1 / V2.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Fiche NC — Réserve</div>
  <div class="guide-nc-block">Une fiche NC doit comporter une <b>observation de réserve</b> décrivant le défaut constaté et les mesures correctives. Ce commentaire apparaît dans le tooltip du synoptique et dans l'export PDF.</div>
</div>`,

  metier: `
<div class="guide-tip"><b>Référentiel métier</b> — Termes et processus du contrôle qualité voie RATP / ETF selon le Plan de Contrôle Externe MOE Voie.</div>
<div class="guide-section">
  <div class="guide-section-title">Géométrie voie</div>
  <table class="guide-table">
    <tr><th>Opération</th><th>Tolérance RATP</th><th>Fiche</th></tr>
    <tr><td><b>Écartement</b></td><td>Béton : 1435 ±3mm / Bois : 1437 ±3mm</td><td>FC-VC-12</td></tr>
    <tr><td><b>Dévers/Gauche</b></td><td>Gauche ≤15mm/3m · Dévers ±2mm</td><td>FC-GEO-61</td></tr>
    <tr><td><b>Nivellement Zniv</b></td><td>±5mm / profil théorique</td><td>Rapport Topo</td></tr>
    <tr><td><b>Travelage</b></td><td>±20mm esp · ±10mm équerrage · 100%C</td><td>FC-TRAV</td></tr>
  </table>
</div>
<div class="guide-section">
  <div class="guide-section-title">Joints Isolants Collés (JIC)</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:rgba(124,58,237,.1);color:var(--vi)"></div>
    <div class="guide-item-text">
      <div class="guide-item-title">Isolement électrique</div>
      <div class="guide-item-desc">Résistance minimale : <b>R&gt;15kΩ en voie</b> · <b>R&gt;1MΩ non raccordé</b>. Fiche FC-JI-11. Contrôlé par le Surveillant de Chantier à chaque JIC. Point d'arrêt SF obligatoire.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:rgba(124,58,237,.1);color:var(--vi)">T</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Travelage sur JIC</div>
      <div class="guide-item-desc">6 traverses avant + 6 traverses après chaque JIC. Fiche FC-TRAV-JIC. Équerrage spécifique JIC béton : FC-TRAV-JIC-BETON.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Libération LRS (Long Rail Soudé)</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--nc-bg);color:var(--nc)">TN</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Température Neutre (TN)</div>
      <div class="guide-item-desc">La TN est la température de référence à laquelle le LRS est libéré sans contrainte. Tolérance RATP : <b>TN ±3°C</b>. Mesure obligatoire par rail libéré. Fiches FC-LRS-11 / FC-LRS-12.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--wt-bg);color:var(--wt)">↔</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Libération avec tendeurs</div>
      <div class="guide-item-desc">Allongements de rails conformes à la valeur théorique calculée. FC-LRS-12. L'homogénéisation suit des intervalles selon le rayon de courbure (FC-LRS-68).</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Soudures</div>
  <table class="guide-table">
    <tr><th>Type</th><th>Code</th><th>Usage</th></tr>
    <tr><td><b>Aluminothermique</b></td><td>AT</td><td>Soudure de production en voie courante LRS</td></tr>
    <tr><td><b>Électrique en bout</b></td><td>EB</td><td>Jonction rail à rail en atelier/sur voie</td></tr>
    <tr><td><b>Soufflage / SKV</b></td><td>SB/SKV</td><td>Soudure de rattrapage et de maintenance</td></tr>
    <tr><td><b>Inductive</b></td><td>SI</td><td>Soudure inductive haute fréquence</td></tr>
  </table>
  <div class="guide-tip"><b>Contrôle géométrique AT</b> — habilitation obligatoire soudeur. FC-Géométrie des soudures Alumino (FC n°8). Référence Govelins : FC-RAIL-12 / FC-RAIL-13.</div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Intervenants</div>
  <table class="guide-table">
    <tr><th>Rôle</th><th>Responsabilité</th></tr>
    <tr><td><b>RET</b></td><td>Responsable d'Études et de Travaux</td></tr>
    <tr><td><b>CET</b></td><td>Chef d'Équipe Travaux</td></tr>
    <tr><td><b>QSE</b></td><td>Qualité Sécurité Environnement</td></tr>
    <tr><td><b>SC</b></td><td>Surveillant de Chantier (JIC)</td></tr>
    <tr><td><b>MOA</b></td><td>Maîtrise d'Ouvrage (RATP)</td></tr>
    <tr><td><b>MOE</b></td><td>Maîtrise d'Œuvre (ETF / entreprise)</td></tr>
  </table>
</div>`,

  shortcuts: `
<div class="guide-tip"><b>Raccourcis clavier et gestes</b> — Toutes les interactions disponibles dans RailQual.</div>
<div class="guide-section">
  <div class="guide-section-title">Clavier</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)">↩</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Annuler la dernière action <span class="guide-kbd">Ctrl</span><span class="guide-kbd">Z</span></div>
      <div class="guide-item-desc">Annule les 30 dernières mutations : ajout/modification/suppression de fiches FCQ, joints, renommage de zone, import plan. Visible dans le bouton "Annuler" du synoptique.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)"></div>
    <div class="guide-item-text">
      <div class="guide-item-title">Valider renommage zone <span class="guide-kbd">Entrée</span></div>
      <div class="guide-item-desc">Après double-clic sur une zone, appuyez Entrée pour valider le nouveau nom. Échap pour annuler.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)">?</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Fermer ce guide <span class="guide-kbd">Échap</span></div>
      <div class="guide-item-desc">Appuyez Échap ou cliquez hors du panneau pour fermer le guide.</div>
    </div>
  </div>
</div>
<div class="guide-section">
  <div class="guide-section-title">Synoptique — souris</div>
  <table class="guide-table">
    <tr><th>Action</th><th>Résultat</th></tr>
    <tr><td><b>Clic zone</b></td><td>Panneau latéral détail NC + fiches</td></tr>
    <tr><td><b>Double-clic zone</b></td><td>Renommer la zone inline</td></tr>
    <tr><td><b>Survol zone</b></td><td>Tooltip riche C/NC/Attente + liste NC</td></tr>
    <tr><td><b>Survol segment rail</b></td><td>Tooltip fiche FCQ (ref, voie, PK, statut)</td></tr>
    <tr><td><b>Clic segment NC</b></td><td>Ouvre le panneau de la zone correspondante</td></tr>
    <tr><td><b>Clic joint (◆)</b></td><td>Modal d'édition du joint JIC/JM</td></tr>
    <tr><td><b>Survol joint</b></td><td>Tooltip infos joint (type, PK, phase, isolement)</td></tr>
    <tr><td><b>Clic phase</b></td><td>Vue détaillée phase : synoptique PK + tableau FCQ</td></tr>
  </table>
</div>
<div class="guide-section">
  <div class="guide-section-title">FCQ — actions rapides</div>
  <table class="guide-table">
    <tr><th>Action</th><th>Résultat</th></tr>
    <tr><td><b>Clic crayon</b></td><td>Éditer la fiche FCQ</td></tr>
    <tr><td><b>Clic corbeille</b></td><td>Supprimer (confirmation requise)</td></tr>
    <tr><td><b>Filtre C/NC/Att</b></td><td>Filtrage instantané par statut</td></tr>
    <tr><td><b>Filtre V1/V2</b></td><td>Filtrage par voie</td></tr>
    <tr><td><b>Recherche</b></td><td>Full-text : ref, fiche, PK, commentaire</td></tr>
  </table>
</div>
<div class="guide-section">
  <div class="guide-section-title">Export & Import</div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)">PDF</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Export Rapport PDF</div>
      <div class="guide-item-desc">Bouton <b>Export PDF</b> dans la topbar. Génère un rapport complet : KPIs, synoptique visuel, alertes, tableau par phase, bilan zones, NC détaillées, joints, plan de contrôle, bloc signatures MOE/MOA.</div>
    </div>
  </div>
  <div class="guide-item">
    <div class="guide-item-ico" style="background:var(--surf3);color:var(--t2)">XLS</div>
    <div class="guide-item-text">
      <div class="guide-item-title">Import Plan de contrôle</div>
      <div class="guide-item-desc">Plan de contrôle → Import Excel/CSV. Colonnes reconnues automatiquement : Désignation, SF, Responsable, Fréquence, Tolérance, Fiche MOE, Ref Govelins. Annulable avec Ctrl+Z.</div>
    </div>
  </div>
</div>
<div class="guide-ok-block">◆ <b>Conseil terrain :</b> Utilisez le thème <b>Midnight</b> ou <b>RATP</b> lors des inspections nocturnes — le contraste élevé réduit la fatigue visuelle en conditions d'éclairage artificiel.</div>`
};

function showGuideTab(tab, el){
  document.querySelectorAll('.guide-tab').forEach(t=>t.classList.remove('active'));
  if(el) el.classList.add('active');
  else{
    const tabs=document.querySelectorAll('.guide-tab');
    const tabMap={start:0,syn:1,fcq:2,metier:3,shortcuts:4};
    if(tabs[tabMap[tab]]) tabs[tabMap[tab]].classList.add('active');
  }
  const body=document.getElementById('guide-body');
  if(body) body.innerHTML = GUIDE_CONTENT[tab]||'';
  body.scrollTop=0;
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    const ov=document.getElementById('guide-overlay');
    if(ov&&ov.classList.contains('show')) toggleGuide();
  }
});

// ════════════════════════════════════════════════
// EXPORT RAPPORT PDF QUALITÉ
// Génération complète rapport RATP / ETF
// ════════════════════════════════════════════════
function exportRapportPDF(){
  if(!CP){toast('Ouvrez un projet d\'abord','err');return;}
  const p=CP;
  const ok=p.fiches.filter(f=>f.statut==='C').length;
  const nc=p.fiches.filter(f=>f.statut==='NC').length;
  const pend=p.fiches.filter(f=>!f.statut).length;
  const pct=p.fiches.length?Math.round(ok/p.fiches.length*100):0;
  const now=new Date();
  const dateStr=now.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'});
  const dateShort=now.toISOString().slice(0,10);
  const refs=[...new Set(p.fiches.map(f=>f.ref))];
  const ncFiches=p.fiches.filter(f=>f.statut==='NC');
  const alerts=buildAlerts(p);
  const ligneColor=p.ligneColor||p.color||'#8D5E2A';
  
  // ── Document ID certifié ──
  const docID = 'RQ-' + now.getFullYear() + 
    String(now.getMonth()+1).padStart(2,'0') +
    String(now.getDate()).padStart(2,'0') + '-' +
    String(now.getHours()).padStart(2,'0') +
    String(now.getMinutes()).padStart(2,'0') + '-' +
    p.id.slice(-4).toUpperCase();
  const isoStamp = now.toISOString();
  // QR code data (encode key info as URL-style string)
  const qrData = encodeURIComponent('RAILQUAL|' + docID + '|' + p.name + '|' + p.ligne + '|' + pct + '%|' + isoStamp);
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=' + qrData;

  // ── Phase rows HTML ──
  const phaseRows=refs.map(ref=>{
    const pf=p.fiches.filter(f=>f.ref===ref);
    const okP=pf.filter(f=>f.statut==='C').length;
    const ncP=pf.filter(f=>f.statut==='NC').length;
    const wtP=pf.filter(f=>!f.statut).length;
    const pctP=pf.length?Math.round(okP/pf.length*100):0;
    const barColor=pctP===100?'#059669':pctP>60?'#d97706':'#dc2626';
    return `<tr>
      <td style="padding:9px 12px;border-bottom:1px solid #E5E7EB;font-size:12px;font-weight:600">${ref}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #E5E7EB;text-align:center;font-size:12px">${pf.length}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #E5E7EB;text-align:center;font-size:12px;color:#059669;font-weight:700">${okP}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #E5E7EB;text-align:center;font-size:12px;color:#DC2626;font-weight:${ncP>0?'700':'400'}">${ncP||'—'}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #E5E7EB;text-align:center;font-size:12px;color:#B45309">${wtP||'—'}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #E5E7EB">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:5px;background:#E5E7EB;border-radius:3px;overflow:hidden">
            <div style="width:${pctP}%;height:100%;background:${barColor};border-radius:3px"></div>
          </div>
          <span style="font-size:11px;font-weight:700;color:${barColor};min-width:30px">${pctP}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');

  // ── FCQ NC detail rows ──
  const ncRows=ncFiches.length>0?ncFiches.map(f=>`<tr>
    <td style="padding:8px 11px;border-bottom:1px solid #FEE2E2;font-size:11px;color:#DC2626;font-weight:600">${f.fiche}</td>
    <td style="padding:8px 11px;border-bottom:1px solid #FEE2E2;font-size:11px">${f.ref}</td>
    <td style="padding:8px 11px;border-bottom:1px solid #FEE2E2;font-size:11px;font-family:monospace">${f.voie}</td>
    <td style="padding:8px 11px;border-bottom:1px solid #FEE2E2;font-size:11px;font-family:monospace">${f.pk_debut?fmtPK(f.pk_debut)+' → '+fmtPK(f.pk_fin):'—'}</td>
    <td style="padding:8px 11px;border-bottom:1px solid #FEE2E2;font-size:11px">${f.date||'—'}</td>
    <td style="padding:8px 11px;border-bottom:1px solid #FEE2E2;font-size:10px;color:#B91C1C">${f.commentaire||'—'}</td>
  </tr>`).join(''):'<tr><td colspan="6" style="padding:16px;text-align:center;color:#059669;font-weight:600">Aucune non-conformite</td></tr>';

  // ── Zones summary ──
  const zonesRows=p.zones.map((z,zi)=>{
    const zf=p.fiches.filter(f=>f.pk_debut&&f.pk_fin&&!(f.pk_fin<z.pkStart||f.pk_debut>z.pkEnd));
    const zOk=zf.filter(f=>f.statut==='C').length;
    const zNc=zf.filter(f=>f.statut==='NC').length;
    const zWt=zf.filter(f=>!f.statut).length;
    const status=zNc>0?'<span style="color:#DC2626;font-weight:700">! NC détectées</span>':zWt>0?'<span style="color:#B45309">En cours</span>':'<span style="color:#059669;font-weight:700">Conforme</span>';
    return `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-weight:600;font-size:12px">${z.label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:11px;font-family:monospace">${fmtPK(z.pkStart)} → ${fmtPK(z.pkEnd)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;text-align:center">${zf.length}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;text-align:center;color:#059669;font-weight:700">${zOk}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;text-align:center;color:#DC2626;font-weight:${zNc>0?'700':'400'}">${zNc||'—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB">${status}</td>
    </tr>`;
  }).join('');

  // ── Joints table ──
  const jointsRows=p.joints.map(j=>`<tr>
    <td style="padding:7px 10px;border-bottom:1px solid #E5E7EB;font-size:11px;font-weight:700;color:${j.type==='jic'?'#7C3AED':'#E11D48'}">${j.type.toUpperCase()}</td>
    <td style="padding:7px 10px;border-bottom:1px solid #E5E7EB;font-size:11px">${j.zone_enc}</td>
    <td style="padding:7px 10px;border-bottom:1px solid #E5E7EB;font-size:11px">${j.zone||'—'}</td>
    <td style="padding:7px 10px;border-bottom:1px solid #E5E7EB;font-size:11px;font-family:monospace">V${j.voie}</td>
    <td style="padding:7px 10px;border-bottom:1px solid #E5E7EB;font-size:11px;font-family:monospace">${j.pk}</td>
    <td style="padding:7px 10px;border-bottom:1px solid #E5E7EB;font-size:11px">${j.phase}</td>
    <td style="padding:7px 10px;border-bottom:1px solid #E5E7EB;font-size:10px;color:#B45309">${j.detail||'—'}</td>
  </tr>`).join('');

  // ── Alerts section ──
  const alertsHTML=alerts.length>0?`
  <div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:10px;padding:18px;margin-bottom:24px">
    <div style="font-size:14px;font-weight:700;color:#92400E;margin-bottom:12px">! Alertes actives — ${alerts.length} point${alerts.length>1?'s':''} d'attention</div>
    ${alerts.map(a=>`<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;padding:10px 12px;background:#fff;border-radius:6px;border-left:3px solid ${a.level==='crit'?'#DC2626':'#F59E0B'}">
      <span style="font-size:16px">${a.level==='crit'?'●':'●'}</span>
      <div>
        <div style="font-size:12px;font-weight:700;color:${a.level==='crit'?'#DC2626':'#B45309'}">${a.title}</div>
        <div style="font-size:11px;color:#6B7280;margin-top:2px">${a.msg}</div>
      </div>
    </div>`).join('')}
  </div>`:'<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px;margin-bottom:24px;font-size:12px;color:#166534;font-weight:600">Aucune alerte active — Chantier en bonne conformite</div>';

  // ── Synoptique HTML bars (simplified for PDF) ──
  const synBars=['V1','V2'].map(v=>{
    const segs=p.fiches.filter(f=>f.voie===v&&f.pk_debut&&f.pk_fin);
    const bars=segs.map(f=>{
      const left=pkP(f.pk_debut,p),w=Math.max(.5,pkP(f.pk_fin,p)-left);
      const bg=!f.statut?'#F59E0B':f.statut==='C'?'#10B981':'#EF4444';
      return `<div style="position:absolute;left:${left}%;width:${w}%;height:100%;background:${bg};border-right:1px solid rgba(255,255,255,.4)"></div>`;
    }).join('');
    return `<div style="margin-bottom:12px">
      <div style="font-family:monospace;font-size:10px;color:#6B7280;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">Voie ${v.slice(1)}</div>
      <div style="position:relative;height:16px;background:#E5E7EB;border-radius:4px;overflow:hidden">${bars}</div>
    </div>`;
  }).join('');

  const html=`<!DOCTYPE html>
<html lang="fr" data-theme="vercel">
<head>
<meta charset="UTF-8">
<title>Rapport Qualité — ${p.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #111827; font-size: 13px; }
  @media print {
    body { font-size: 11px; }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
  .page { max-width: 860px; margin: 0 auto; padding: 32px 28px; }
  h2 { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #F3F4F6; display: flex; align-items: center; gap: 8px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; }
  thead tr { background: #F9FAFB; }
  thead th { padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #9CA3AF; font-weight: 500; border-bottom: 1px solid #E5E7EB; font-family: 'JetBrains Mono', monospace; }
  .section { margin-bottom: 28px; }
  .btn-print { position: fixed; top: 20px; right: 20px; background: #111827; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,.15); }
  .btn-print:hover { background: #1F2937; }
</style>
  <!-- PWA META -->
  <meta name="theme-color" content="#09090B" id="pwa-theme-color">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="RailQual">
  <meta name="application-name" content="RailQual">
  <meta name="description" content="Pilotage qualité voie ferroviaire — RATP/RER/Tramway">
  <link rel="manifest" href="data:application/json,%7B%22name%22%3A%22RailQual+v4%22%2C%22short_name%22%3A%22RailQual%22%2C%22theme_color%22%3A%22%23F59E0B%22%2C%22background_color%22%3A%22%2309090B%22%2C%22display%22%3A%22standalone%22%2C%22start_url%22%3A%22.%22%2C%22icons%22%3A%5B%5D%7D">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
</head>
<body>
<div class="app-wrap" id="app-wrap">
<button class="btn-print no-print" onclick="window.print()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Imprimer / Sauvegarder PDF</button>
<div class="page">

  <!-- HEADER -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #E5E7EB">
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div style="width:40px;height:40px;background:#111827;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:20px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(77,179,255,.8)" stroke-width="1.5" stroke-linecap="round"><path d="M4 20L8 4M16 4l4 16M8 4h8M6.5 12h11"/></svg></div>
        <div>
          <div style="font-size:22px;font-weight:800;letter-spacing:-.5px">Rail<span style="color:${ligneColor}">Qual</span></div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:8px;color:#9CA3AF;letter-spacing:2px;text-transform:uppercase;margin-top:2px">Rapport Qualité Ferroviaire · RATP</div>
        </div>
      </div>
      <div style="font-size:18px;font-weight:700;letter-spacing:-.3px;margin-bottom:4px">${p.name}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <span style="background:${ligneColor};color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:4px">${p.ligneCode||p.type.toUpperCase()} · ${p.ligne}</span>
        <span style="background:#F3F4F6;color:#374151;font-size:10px;padding:3px 10px;border-radius:4px;font-family:'JetBrains Mono',monospace">PK ${fmtPK(p.pkStart)} → PK ${fmtPK(p.pkEnd)}</span>
        ${p.moa?`<span style="background:#F3F4F6;color:#374151;font-size:10px;padding:3px 10px;border-radius:4px">MOA: ${p.moa}</span>`:''}
        ${p.entreprise?`<span style="background:#F3F4F6;color:#374151;font-size:10px;padding:3px 10px;border-radius:4px">ETF: ${p.entreprise}</span>`:''}
      </div>
    </div>
    <div style="text-align:right;flex-shrink:0">
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Date du rapport</div>
      <div style="font-size:13px;font-weight:600;color:#111827">${dateStr}</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;margin-top:12px">Créé par LOKONON Godfree Samir · Ingénieur Qualité RATP/ETF</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:8px;color:#D1D5DB;margin-top:2px">RailQual v4.0 · ID: ${docID}</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:7px;color:#E5E7EB;margin-top:2px">Émis le ${isoStamp.replace('T',' ').slice(0,19)} UTC</div>
    </div>
    <div style="text-align:right">
      <img src="${qrUrl}" width="80" height="80" style="border-radius:8px;border:2px solid #F3F4F6" alt="QR Code document" onerror="this.style.display='none'">
      <div style="font-family:'JetBrains Mono',monospace;font-size:7px;color:#9CA3AF;margin-top:4px;text-align:center">Scan = vérification</div>
    </div>
  </div>

  <!-- KPI BAND -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:10px;margin-bottom:28px">
    ${[
      {v:p.fiches.length,l:'Total fiches',c:'#6B7280'},
      {v:ok,l:'Conformes',c:'#059669'},
      {v:nc,l:'Non conformes',c:'#DC2626'},
      {v:pend,l:'En attente',c:'#B45309'},
      {v:pct+'%',l:'Conformité',c:pct===100?'#059669':pct>60?'#D97706':'#DC2626'},
    ].map(k=>`<div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px 14px;text-align:center">
      <div style="font-size:22px;font-weight:800;color:${k.c};line-height:1;margin-bottom:4px">${k.v}</div>
      <div style="font-size:10px;color:#6B7280">${k.l}</div>
    </div>`).join('')}
  </div>

  <!-- GLOBAL PROGRESS BAR -->
  <div style="margin-bottom:28px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:16px">
    <div style="display:flex;justify-content:space-between;font-size:11px;color:#6B7280;margin-bottom:8px">
      <span style="font-weight:600;color:#111827">Avancement conformité global</span>
      <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${pct===100?'#059669':pct>60?'#D97706':'#DC2626'}">${pct}%</span>
    </div>
    <div style="height:10px;background:#E5E7EB;border-radius:5px;overflow:hidden">
      <div style="width:${pct}%;height:100%;background:${pct===100?'#059669':pct>60?'#10B981':'#DC2626'};border-radius:5px"></div>
    </div>
    <div style="display:flex;gap:14px;margin-top:10px;font-size:10px">
      <span style="color:#059669">● ${ok} Conformes</span>
      <span style="color:#DC2626">● ${nc} Non conformes</span>
      <span style="color:#B45309">● ${pend} En attente</span>
    </div>
  </div>

  <!-- SYNOPTIQUE VISUEL -->
  <div class="section">
    <h2> Synoptique visuel — ${fmtPK(p.pkStart)} → ${fmtPK(p.pkEnd)}</h2>
    <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:16px">
      ${synBars}
      <div style="display:flex;gap:16px;margin-top:8px;font-size:10px">
        <span>● Conforme</span><span>● Non conforme</span><span>● En attente</span>
      </div>
    </div>
  </div>

  <!-- ALERTES -->
  <div class="section">
    <h2>! Alertes &amp; Points d'attention</h2>
    ${alertsHTML}
  </div>

  <!-- AVANCEMENT PAR PHASE -->
  <div class="section">
    <h2>▦ Avancement par phase</h2>
    <table>
      <thead><tr><th>Phase</th><th>Fiches</th><th>Conformes</th><th>NC</th><th>Attente</th><th>Conformité</th></tr></thead>
      <tbody>${phaseRows}</tbody>
    </table>
  </div>

  <!-- ZONES -->
  <div class="section">
    <h2> Bilan par zone PK</h2>
    <table>
      <thead><tr><th>Zone</th><th>PK</th><th>Fiches</th><th>Conformes</th><th>NC</th><th>Statut</th></tr></thead>
      <tbody>${zonesRows}</tbody>
    </table>
  </div>

  ${ncFiches.length>0?`
  <div class="section page-break">
    <h2 style="color:#DC2626">! Détail des Non-Conformités (${ncFiches.length})</h2>
    <table>
      <thead><tr><th>Fiche de contrôle</th><th>Référence</th><th>Voie</th><th>PK</th><th>Date</th><th>Réserve / Commentaire</th></tr></thead>
      <tbody style="background:#FFF5F5">${ncRows}</tbody>
    </table>
  </div>`:''}

  <!-- JOINTS -->
  <div class="section">
    <h2>● Joints Isolants &amp; Mécaniques (${p.joints.length})</h2>
    <table>
      <thead><tr><th>Type</th><th>Zone encadrante</th><th>Zone</th><th>Voie</th><th>PK</th><th>Phase</th><th>Observations</th></tr></thead>
      <tbody>${jointsRows}</tbody>
    </table>
  </div>

  <!-- PLAN DE CONTROLE -->
  <div class="section">
    <h2> Plan de contrôle — ${p.plan.length} opérations</h2>
    <table>
      <thead><tr><th>#</th><th>Opération</th><th>Type</th><th>Documents requis</th><th>Notes</th></tr></thead>
      <tbody>
        ${p.plan.map(pi=>`<tr>
          <td style="padding:8px 11px;border-bottom:1px solid #E5E7EB;font-family:'JetBrains Mono',monospace;font-size:11px;color:#9CA3AF">${pi.ordre}</td>
          <td style="padding:8px 11px;border-bottom:1px solid #E5E7EB;font-size:12px;font-weight:600">${pi.name}</td>
          <td style="padding:8px 11px;border-bottom:1px solid #E5E7EB;font-size:11px;color:#6B7280">${pi.type}</td>
          <td style="padding:8px 11px;border-bottom:1px solid #E5E7EB;font-size:10px;font-family:'JetBrains Mono',monospace">${(pi.docs||[]).join(', ')||'—'}</td>
          <td style="padding:8px 11px;border-bottom:1px solid #E5E7EB;font-size:10px;color:#6B7280;font-style:italic">${pi.notes||'—'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- SIGNATURE FOOTER -->
  <div style="margin-top:36px;border-top:2px solid #E5E7EB;padding-top:22px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
    ${['Responsable Qualité','Pilote Chantier','Visa MOA — RATP'].map(role=>`
    <div>
      <div style="font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;font-family:'JetBrains Mono',monospace">${role}</div>
      <div style="height:48px;border-bottom:1.5px solid #D1D5DB"></div>
      <div style="font-size:10px;color:#D1D5DB;margin-top:4px">Nom · Date · Signature</div>
    </div>`).join('')}
  </div>

  <div style="margin-top:22px;padding:12px 16px;background:#F9FAFB;border-radius:8px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#9CA3AF">
    <span>RailQual Pro v3.0 · Créé par LOKONON Godfree Samir</span>
    <span>Généré le ${dateStr} · Document confidentiel chantier</span>
    <span style="font-family:'JetBrains Mono',monospace">${p.name} · ${p.ligne}</span>
  </div>

</div>

<!-- IMPORT PLAN MODAL -->
<div class="mov" id="m-import-plan">
  <div class="modal wide">
    <div class="mhdr">
      <div class="mtitle">Import Plan de Contrôle</div>
      <button class="mx" onclick="closeM('m-import-plan')"><svg width="11" height="11"><use href="#i-x"/></svg></button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px">
      <div class="topt sel" onclick="selImportType(this,'excel')" data-t="excel">
        <div class="topt-ico">▦</div><div class="topt-lbl">Excel</div><div class="topt-sub">.xlsx / .xls / .csv</div>
      </div>
      <div class="topt" onclick="selImportType(this,'pdf')" data-t="pdf">
        <div class="topt-ico"></div><div class="topt-lbl">PDF</div><div class="topt-sub">Plan de contrôle PDF</div>
      </div>
      <div class="topt" onclick="selImportType(this,'image')" data-t="image">
        <div class="topt-ico">▣</div><div class="topt-lbl">Image</div><div class="topt-sub">Capture / photo du plan</div>
      </div>
    </div>
    <div style="background:var(--surf2);border:1px solid var(--ln);border-radius:var(--r2);padding:14px;margin-bottom:16px;font-size:12px;color:var(--t2)">
      <div style="font-weight:700;color:var(--t1);margin-bottom:6px"> Colonnes reconnues automatiquement :</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span style="font-family:var(--fm);font-size:10px;padding:2px 7px;background:var(--accent-bg);border:1px solid var(--accent-bd);border-radius:3px;color:var(--accent)">Désignation opération</span>
        <span style="font-family:var(--fm);font-size:10px;padding:2px 7px;background:var(--ok-bg);border:1px solid var(--ok-bd);border-radius:3px;color:var(--ok)">SF (Point d'arrêt)</span>
        <span style="font-family:var(--fm);font-size:10px;padding:2px 7px;background:var(--surf3);border:1px solid var(--ln2);border-radius:3px;color:var(--t2)">Responsable contrôle</span>
        <span style="font-family:var(--fm);font-size:10px;padding:2px 7px;background:var(--surf3);border:1px solid var(--ln2);border-radius:3px;color:var(--t2)">Fréquence contrôle</span>
        <span style="font-family:var(--fm);font-size:10px;padding:2px 7px;background:var(--surf3);border:1px solid var(--ln2);border-radius:3px;color:var(--t2)">Critère / Tolérance</span>
        <span style="font-family:var(--fm);font-size:10px;padding:2px 7px;background:var(--surf3);border:1px solid var(--ln2);border-radius:3px;color:var(--t2)">Fiche de contrôle MOE</span>
        <span style="font-family:var(--fm);font-size:10px;padding:2px 7px;background:var(--vi-bg);border:1px solid rgba(124,58,237,.2);border-radius:3px;color:var(--vi)">Ref Govelins</span>
      </div>
    </div>
    <div id="import-upload-zone">
      <div class="uzone" style="min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px" onclick="triggerFileImport()">
        <svg width="28" height="28" style="color:var(--t3)"><use href="#i-down"/></svg>
        <div style="font-size:13px;font-weight:600;color:var(--t2)">Glissez votre fichier ici ou cliquez</div>
        <div style="font-size:11px;color:var(--t3)">Excel (.xlsx, .xls, .csv) · PDF · Image (PNG, JPG)</div>
      </div>
      <input type="file" id="plan-file-input" style="display:none" accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg" onchange="handlePlanFileImport(event)">
    </div>
    <div id="import-preview" style="display:none;margin-top:14px">
      <div style="font-family:var(--fm);font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--t3);margin-bottom:8px">Aperçu de l'import</div>
      <div id="import-preview-content"></div>
    </div>
    <div class="macts">
      <button class="btn" onclick="closeM('m-import-plan')">Annuler</button>
      <button class="btn pri" id="btn-confirm-import" style="display:none" onclick="confirmPlanImport()">Importer dans le plan →</button>
    </div>
  </div>
</div>

</div><!-- /app-wrap -->
</body>
</html>`;

  const blob=new Blob([html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=`Rapport_Qualite_${p.ligne.replace(/\s/g,'_')}_${dateShort}.html`;
  a.click();URL.revokeObjectURL(url);
  // Also open in new tab for immediate printing
  window.open(url,'_blank');
  toast('Rapport généré — utilisez Ctrl+P pour imprimer/sauvegarder en PDF','ok');
}

// ════════════════════════════════════════════════
// SYSTÈME D'ALERTES & NOTIFICATIONS
// Logique métier ferroviaire RATP
// ════════════════════════════════════════════════

// Seuils alertes (jours)
const ALERT_SEUILS={nc_ouvert:7,attente_long:14,phase_bloquee:21};

function buildAlerts(proj){
  const p=proj||CP;if(!p)return[];
  const alerts=[];
  const today=new Date();

  // 1. NC non levées depuis > 7 jours
  p.fiches.filter(f=>f.statut==='NC').forEach(f=>{
    if(f.date){
      const d=new Date(f.date),diff=Math.round((today-d)/86400000);
      if(diff>ALERT_SEUILS.nc_ouvert){
        alerts.push({id:'nc_'+p.fiches.indexOf(f),level:'crit',cat:'NC',title:`Non-conformité ouverte depuis ${diff}j — ${f.fiche}`,msg:`${f.ref} · ${f.voie} · PK ${f.pk_debut?fmtPK(f.pk_debut):'—'} · ${f.commentaire||'Réserve à lever'}`,date:f.date,fiche:f});
      }
    } else {
      alerts.push({id:'nc_nd_'+p.fiches.indexOf(f),level:'crit',cat:'NC',title:`NC sans date — ${f.fiche}`,msg:`${f.ref} · ${f.voie} · Date de réception manquante`,date:null,fiche:f});
    }
  });

  // 2. Fiches en attente depuis > 14 jours
  p.fiches.filter(f=>!f.statut&&f.date).forEach(f=>{
    const d=new Date(f.date),diff=Math.round((today-d)/86400000);
    if(diff>ALERT_SEUILS.attente_long){
      alerts.push({id:'wt_'+p.fiches.indexOf(f),level:'warn',cat:'Attente',title:`Fiche en attente depuis ${diff}j — ${f.fiche}`,msg:`${f.ref} · ${f.voie} · Statut à mettre à jour`,date:f.date,fiche:f});
    }
  });

  // 3. Phases bloquées (> 0 NC dans une phase)
  const refs=[...new Set(p.fiches.map(f=>f.ref))];
  refs.forEach(ref=>{
    const pf=p.fiches.filter(f=>f.ref===ref);
    const ncP=pf.filter(f=>f.statut==='NC').length;
    const wtP=pf.filter(f=>!f.statut).length;
    if(ncP>0){
      alerts.push({id:'phase_nc_'+ref,level:'crit',cat:'Phase',title:`Phase bloquée — ${ref}`,msg:`${ncP} NC non levée${ncP>1?'s':''} · ${wtP} fiche${wtP>1?'s':''} en attente sur cette phase`,date:null});
    }
  });

  // 4. JIC en attente Phase 2 non traités
  const jic2=p.joints.filter(j=>j.type==='jic'&&j.phase==='Phase 2');
  if(jic2.length>0){
    alerts.push({id:'jic_ph2',level:'warn',cat:'JIC',title:`${jic2.length} JIC Phase 2 en attente de MeS`,msg:`Voies: ${[...new Set(jic2.map(j=>j.voie))].map(v=>'V'+v).join(', ')} · Vérifier shuntage avant ouverture`});
  }

  // 5. Fiches sans PK (données incomplètes)
  const sansPK=p.fiches.filter(f=>!f.pk_debut&&f.statut).length;
  if(sansPK>3){
    alerts.push({id:'sans_pk',level:'warn',cat:'Données',title:`${sansPK} fiches sans PK renseigné`,msg:'Le synoptique ne peut pas afficher ces fiches — enrichir les données terrain'});
  }

  // 6. Taux conformité critique < 80%
  const okT=p.fiches.filter(f=>f.statut==='C').length;
  const pct=p.fiches.length?Math.round(okT/p.fiches.length*100):0;
  if(pct<80&&p.fiches.length>5){
    alerts.push({id:'taux_crit',level:'crit',cat:'Conformité',title:`Taux de conformité critique : ${pct}%`,msg:`Seuil RATP recommandé ≥ 80% — ${p.fiches.filter(f=>f.statut==='NC').length} NC + ${p.fiches.filter(f=>!f.statut).length} en attente`});
  }

  return alerts.sort((a,b)=>a.level==='crit'&&b.level!=='crit'?-1:1);
}

function renderAlerts(){
  const p=CP;if(!p)return;
  const alerts=buildAlerts(p);
  // Update badge in nav
  const existing=document.getElementById('nb-alerts');
  if(existing){existing.textContent=alerts.length;existing.style.background=alerts.some(a=>a.level==='crit')?'var(--nc-bg)':'var(--wt-bg)';existing.style.color=alerts.some(a=>a.level==='crit')?'var(--nc)':'var(--wt)';existing.style.borderColor=alerts.some(a=>a.level==='crit')?'var(--nc-bd)':'var(--wt-bd)';}
  // Update topbar alert bell
  updAlertBell(alerts);
}

function updAlertBell(alerts){
  const bell=document.getElementById('alert-bell');
  if(!bell)return;
  const cnt=alerts.filter(a=>a.level==='crit').length;
  bell.innerHTML=`<svg width="15" height="15"><use href="#i-warn"/></svg>${cnt>0?`<span style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:var(--nc);color:#fff;font-size:8px;display:flex;align-items:center;justify-content:center;font-family:var(--fm);font-weight:700;border:1.5px solid var(--surf)">${cnt}</span>`:''}`;
  bell.style.color=cnt>0?'var(--nc)':'var(--t3)';
  bell.style.borderColor=cnt>0?'var(--nc-bd)':'var(--ln2)';
}

function showPage_patched(id,el){
  showPage(id,el);
  setTimeout(()=>renderAlerts(),100);
}

function renderAlertsPage(){
  const p=CP;if(!p)return;
  const alerts=buildAlerts(p);
  const pg=document.getElementById('pg-alerts');if(!pg)return;
  const critCount=alerts.filter(a=>a.level==='crit').length;
  const warnCount=alerts.filter(a=>a.level==='warn').length;
  pg.innerHTML=`
  <div class="pg-hdr">
    <div>
      <div class="pg-title">Alertes &amp; Notifications</div>
      <div class="pg-sub">${alerts.length} point${alerts.length!==1?'s':''} d'attention · ${critCount} critique${critCount!==1?'s':''} · ${warnCount} avertissement${warnCount!==1?'s':''}</div>
    </div>
    <div class="pg-acts">
      <button class="btn" onclick="renderAlertsPage()"><svg width="12" height="12"><use href="#i-plus"/></svg> Actualiser</button>
    </div>
  </div>
  <div class="stat-row">
    <div class="sc" style="--scc:var(--nc)"><div class="sc-v" style="color:var(--nc)">${critCount}</div><div class="sc-l">Critiques</div></div>
    <div class="sc" style="--scc:var(--wt)"><div class="sc-v" style="color:var(--wt)">${warnCount}</div><div class="sc-l">Avertissements</div></div>
    <div class="sc" style="--scc:var(--ok)"><div class="sc-v" style="color:var(--ok)">${Math.max(0,10-alerts.length)}</div><div class="sc-l">Points verts</div></div>
  </div>
  ${alerts.length===0?`<div style="text-align:center;padding:52px;background:var(--surf);border:1px solid var(--ln);border-radius:var(--r3);box-shadow:var(--sh-sm)">
    
    <div style="font-size:16px;font-weight:700;color:var(--ok)">Aucune alerte active</div>
    <div style="font-size:12px;color:var(--t2);margin-top:4px">Chantier en bonne conformité</div>
  </div>`:`
  ${critCount>0?`
  <div style="font-family:var(--fm);font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--nc);margin-bottom:10px;display:flex;align-items:center;gap:8px">
    <span>● Critiques</span><span style="flex:1;height:1px;background:var(--nc-bd);display:block"></span>
  </div>
  <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
    ${alerts.filter(a=>a.level==='crit').map(a=>alertCard(a)).join('')}
  </div>`:''}
  ${warnCount>0?`
  <div style="font-family:var(--fm);font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--wt);margin-bottom:10px;display:flex;align-items:center;gap:8px">
    <span>● Avertissements</span><span style="flex:1;height:1px;background:var(--wt-bd);display:block"></span>
  </div>
  <div style="display:flex;flex-direction:column;gap:8px">
    ${alerts.filter(a=>a.level==='warn').map(a=>alertCard(a)).join('')}
  </div>`:''}
  `}
  <div style="margin-top:20px;padding:14px 16px;background:var(--surf);border:1px solid var(--ln);border-radius:var(--r2);font-size:11px;color:var(--t3)">
    <b style="color:var(--t2)">Seuils d'alerte configurés :</b>
    NC ouverte &gt; ${ALERT_SEUILS.nc_ouvert}j · En attente &gt; ${ALERT_SEUILS.attente_long}j · Taux conformité &lt; 80% · JIC Phase 2 non traitées
  </div>`;
}

function alertCard(a){
  const isCrit=a.level==='crit';
  const bg=isCrit?'var(--nc-bg)':'var(--wt-bg)';
  const bd=isCrit?'var(--nc-bd)':'var(--wt-bd)';
  const lc=isCrit?'var(--nc)':'var(--wt)';
  const cat_colors={NC:'var(--nc)',Phase:'var(--nc)',Attente:'var(--wt)',JIC:'var(--vi)',Données:'var(--sl)',Conformité:'var(--nc)'};
  const catColor=cat_colors[a.cat]||'var(--t3)';
  const action=a.fiche?`<button class="btn" style="margin-top:10px" onclick="goToFiche(${CP.fiches.indexOf(a.fiche)})"><svg width="11" height="11"><use href="#i-edit"/></svg> Corriger</button>`:`<button class="btn" style="margin-top:10px" onclick="showPage('fcq',document.getElementById('nv-fcq'))"><svg width="11" height="11"><use href="#i-fcq"/></svg> Voir FCQ</button>`;
  return `<div style="background:var(--surf);border:1px solid ${bd};border-left:3px solid ${lc};border-radius:var(--r3);padding:14px 16px;box-shadow:var(--sh-sm)">
    <div style="display:flex;align-items:flex-start;gap:12px">
      <span style="font-size:20px;flex-shrink:0">${isCrit?'●':'●'}</span>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="font-family:var(--fm);font-size:9px;padding:2px 7px;border-radius:3px;background:${bg};color:${catColor};border:1px solid ${bd}">${a.cat}</span>
          <span style="font-size:13px;font-weight:700;color:var(--t1)">${a.title}</span>
        </div>
        <div style="font-size:11.5px;color:var(--t2);margin-bottom:2px">${a.msg}</div>
        ${a.date?`<div style="font-family:var(--fm);font-size:10px;color:var(--t3)">Date fiche : ${a.date}</div>`:''}
        ${action}
      </div>
    </div>
  </div>`;
}

function goToFiche(idx){
  if(idx<0)return;
  showPage('fcq',document.getElementById('nv-fcq'));
  setTimeout(()=>openAddFiche(idx),150);
}


// ════════════════════════════════════════════════
// IMPORT PLAN DE CONTRÔLE — Excel / CSV / PDF / Image
// ════════════════════════════════════════════════

let importedPlanRows = [];

function showImportPlanModal(){
  importedPlanRows=[];
  document.getElementById('import-preview').style.display='none';
  document.getElementById('btn-confirm-import').style.display='none';
  document.getElementById('m-import-plan').classList.add('open');
}

function selImportType(el,t){
  document.querySelectorAll('#m-import-plan .topt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel');
}

function triggerFileImport(){
  document.getElementById('plan-file-input').click();
}

function handlePlanFileImport(e){
  const file=e.target.files[0]; if(!file) return;
  const name=file.name.toLowerCase();
  if(name.endsWith('.csv')){
    const reader=new FileReader();
    reader.onload=ev=>parseCSVPlan(ev.target.result);
    reader.readAsText(file,'UTF-8');
  } else if(name.endsWith('.xlsx')||name.endsWith('.xls')){
    const reader=new FileReader();
    reader.onload=ev=>parseXLSXPlan(ev.target.result);
    reader.readAsArrayBuffer(file);
  } else if(name.match(/\.(png|jpg|jpeg|pdf)$/)){
    toast('Import image/PDF — analyse IA en V3.1','info');
    showDemoImport();
  } else {
    toast('Format non reconnu — utilisez Excel, CSV ou image','err');
  }
}

// ── CSV PARSER ──
function parseCSVPlan(text){
  const lines=text.split('\n').filter(l=>l.trim());
  if(lines.length<2){toast('CSV vide ou mal formaté','err');return;}
  const sep=lines[0].includes(';')?';':',';
  const headers=lines[0].split(sep).map(h=>h.trim().replace(/^"|"$/g,'').toLowerCase());
  const rows=[];
  for(let i=1;i<lines.length;i++){
    const vals=lines[i].split(sep).map(v=>v.trim().replace(/^"|"$/g,''));
    if(!vals[0]) continue;
    const row=mapPlanRow(headers,vals);
    if(row) rows.push(row);
  }
  importedPlanRows=rows;
  showImportPreview(rows);
}

// ── XLSX PARSER ──
function parseXLSXPlan(buf){
  // Use SheetJS if available, else fallback
  if(typeof XLSX!=='undefined'){
    const wb=XLSX.read(buf,{type:'array'});
    const ws=wb.Sheets[wb.SheetNames[0]];
    const data=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
    if(data.length<2){toast('Feuille vide','err');return;}
    const headers=data[0].map(h=>String(h).trim().toLowerCase());
    const rows=[];
    for(let i=1;i<data.length;i++){
      const vals=data[i].map(v=>String(v).trim());
      if(!vals[0]) continue;
      const row=mapPlanRow(headers,vals);
      if(row) rows.push(row);
    }
    importedPlanRows=rows;
    showImportPreview(rows);
  } else {
    // Load SheetJS dynamically
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload=()=>parseXLSXPlan(buf);
    document.head.appendChild(s);
  }
}

// ── ROW MAPPER — détecte colonnes du plan de contrôle RATP ──
function mapPlanRow(headers,vals){
  function get(...keys){
    for(const k of keys){
      const i=headers.findIndex(h=>h.includes(k));
      if(i>=0&&vals[i]) return vals[i];
    }
    return '';
  }
  const name=get('désignation','designation','opération','operation','nom');
  if(!name) return null;
  const sfRaw=get('sf','point','arrêt','arret').toLowerCase();
  const sf=sfRaw.includes('oui')||sfRaw.includes('x')||sfRaw.includes('▼')||sfRaw==='1'||sfRaw.includes('arrêt');
  return {
    name,
    sf,
    responsable:get('responsable','resp'),
    frequence:get('fréquence','frequence','freq'),
    critere:get('critère','critere','acceptation','tolérance','tolerance','critères'),
    tolerance:get('tolérance','tolerance','seuil'),
    docs:[get('fiche','fc','document','doc')].filter(Boolean),
    ref_govelins:get('govelins','ref gov','référence'),
    notes:get('notes','remarques','observations'),
    type:'Contrôle dimensionnel',
    ordre:0
  };
}

// ── SHOW DEMO IMPORT (PDF/Image fallback) ──
function showDemoImport(){
  // Simulate a parsed import from the real RATP document shown
  const demoRows=[
    {name:"Zniv (après le R2)",sf:true,responsable:"RET, CET ou QSE",frequence:"Voie en quai uniquement",critere:"Après NC : ±5mm / profil théorique",tolerance:"±5mm",docs:["Rapport Topographique/Machine"],ref_govelins:"Pas de référence",type:"Mesure",ordre:0,notes:""},
    {name:"Travelage et équerrage (après le NC)",sf:true,responsable:"RET, CET ou QSE",frequence:"50m tous les 100ml",critere:"Équerrage ±10mm / Travelage ±20mm / 100% conforme",tolerance:"±20mm / ±10mm",docs:["FC-TRAV"],ref_govelins:"Pas de référence",type:"Contrôle dimensionnel",ordre:0,notes:""},
    {name:"Écartement (après le NC)",sf:true,responsable:"RET, CET ou QSE",frequence:"Un relevé tous les 9m",critere:"Béton : 1435 ±3mm / Bois : 1437 ±3mm",tolerance:"1435 ±3mm (béton)",docs:["FC-VC-12"],ref_govelins:"FC-VC-12",type:"Mesure",ordre:0,notes:""},
    {name:"Isolement des JIC",sf:true,responsable:"Surveillant de Chantier",frequence:"Chaque JIC",critere:"En voie R>15kΩ / Non raccordé R>1MΩ",tolerance:"R>15kΩ",docs:["FC-JI-11"],ref_govelins:"FC-JI-11",type:"Essai électrique",ordre:0,notes:""},
    {name:"Libération LRS — Température",sf:true,responsable:"RET, CET ou QSE",frequence:"Chaque rail libéré",critere:"TN conforme valeur théorique ±3°C",tolerance:"TN ±3°C",docs:["FC-LRS-11"],ref_govelins:"FC-LRS-11",type:"Mesure thermique",ordre:0,notes:""},
    {name:"Contrôle géométrique soudures AT",sf:false,responsable:"Personnel habilité",frequence:"Chaque soudure",critere:"Géométrie conforme EN 14730",tolerance:"Profil EN 14730",docs:["FC-RAIL-12","FC-RAIL-13"],ref_govelins:"FC-RAIL-12",type:"Contrôle dimensionnel",ordre:0,notes:""},
  ];
  importedPlanRows=demoRows;
  showImportPreview(demoRows);
  toast('Aperçu chargé — import image/PDF complet en V3.1','info');
}

// ── PREVIEW TABLE ──
function showImportPreview(rows){
  if(!rows.length){toast('Aucune ligne détectée','err');return;}
  const sfCount=rows.filter(r=>r.sf).length;
  const prev=document.getElementById('import-preview');
  const content=document.getElementById('import-preview-content');
  prev.style.display='block';
  document.getElementById('btn-confirm-import').style.display='inline-flex';
  content.innerHTML=`
    <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap">
      <div style="padding:6px 12px;background:var(--ok-bg);border:1px solid var(--ok-bd);border-radius:var(--r);font-size:12px;color:var(--ok);font-weight:700">${rows.length} opérations détectées</div>
      <div style="padding:6px 12px;background:#FEF3C7;border:1px solid #FCD34D;border-radius:var(--r);font-size:12px;color:#92400E;font-weight:700">! ${sfCount} points d'arrêt SF</div>
    </div>
    <div style="max-height:260px;overflow-y:auto;border:1px solid var(--ln);border-radius:var(--r2);background:var(--surf)">
      <table class="dtbl" style="font-size:11px">
        <thead><tr><th>SF</th><th>Opération</th><th>Tolérance</th><th>Fiche</th><th>Responsable</th></tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>
            <td style="text-align:center">${r.sf?'<span style="color:#D97706;font-weight:700">▼</span>':'—'}</td>
            <td style="font-weight:600">${r.name}</td>
            <td style="font-family:var(--fm);font-size:10px;color:var(--accent)">${r.tolerance||r.critere||'—'}</td>
            <td style="font-family:var(--fm);font-size:10px;color:var(--vi)">${(r.docs||[]).join(', ')||'—'}</td>
            <td style="font-size:10px;color:var(--t3)">${r.responsable||'—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// ── CONFIRM IMPORT → MERGE INTO CP.plan ──
function confirmPlanImport(){
  if(!CP||!importedPlanRows.length){toast('Rien à importer','err');return;}
  snapshot('Import plan de contrôle');
  let added=0,updated=0;
  importedPlanRows.forEach((row,i)=>{
    row.ordre=CP.plan.length+i+1;
    const existing=CP.plan.findIndex(p=>p.name.toLowerCase()===row.name.toLowerCase());
    if(existing>=0){
      // Enrich existing entry
      CP.plan[existing]={...CP.plan[existing],...row};
      updated++;
    } else {
      CP.plan.push(row);
      added++;
    }
  });
  closeM('m-import-plan');
  renderPlan();
  updBadges();
  toast(`Import réussi — ${added} ajoutées, ${updated} enrichies `,'ok');
}

// ════════════════════════════════════════════════
// SF — POINTS D'ARRÊT BLOQUANTS
// Logique métier : un SF non validé bloque la progression
// ════════════════════════════════════════════════

function checkSFBlocking(){
  if(!CP) return {blocked:false,sfItems:[]};
  // Find SF operations in plan that have NC or no FCQ at all
  const sfOps=CP.plan.filter(pi=>pi.sf);
  const sfItems=[];
  sfOps.forEach(pi=>{
    const fiches=CP.fiches.filter(f=>f.ref===pi.name||f.fiche===(pi.docs&&pi.docs[0]));
    const hasNC=fiches.some(f=>f.statut==='NC');
    const hasPending=fiches.some(f=>!f.statut);
    const hasNone=fiches.length===0;
    if(hasNC||hasPending||hasNone){
      sfItems.push({
        op:pi,
        fiches,
        status: hasNC?'nc': hasPending?'pending':'missing',
        label: hasNC?'Non-conformité active': hasPending?'En attente de validation':'Aucune fiche créée'
      });
    }
  });
  return {blocked:sfItems.some(s=>s.status==='nc'),sfItems};
}

function renderSFPanel(){ /* SF panel removed from synoptique */ }

function snapshot(label){
  if(!CP) return;
  const state = {
    label,
    fiches: JSON.parse(JSON.stringify(CP.fiches)),
    joints: JSON.parse(JSON.stringify(CP.joints)),
    zones:  JSON.parse(JSON.stringify(CP.zones)),
    plan:   JSON.parse(JSON.stringify(CP.plan))
  };
  undoStack.push(state);
  if(undoStack.length > MAX_UNDO) undoStack.shift();
  updUndoBtn();
}

function undoAction(){
  if(!undoStack.length || !CP) return;
  const state = undoStack.pop();
  CP.fiches = state.fiches;
  CP.joints = state.joints;
  CP.zones  = state.zones;
  CP.plan   = state.plan;
  // Refresh active page
  const activePage = document.querySelector('.page.active');
  if(activePage){
    const id = activePage.id.replace('pg-','');
    if(id==='syn') renderSyn();
    else if(id==='fcq'){renderFCQ(); renderFCQStats();}
    else if(id==='joints') renderJoints();
    else if(id==='plan') renderPlan();
  }
  updBadges();
  updUndoBtn();
  toast(`Annulé : ${state.label}`,'info');
}

function updUndoBtn(){
  const btn = document.getElementById('undo-btn');
  if(!btn) return;
  btn.disabled = undoStack.length === 0;
  btn.style.opacity = undoStack.length > 0 ? '1' : '.4';
  btn.title = undoStack.length > 0 ? `Annuler : ${undoStack[undoStack.length-1].label} (Ctrl+Z)` : 'Rien à annuler';
}

// Keyboard shortcut Ctrl+Z
document.addEventListener('keydown', e=>{
  if((e.ctrlKey||e.metaKey) && e.key==='z' && !e.shiftKey){
    e.preventDefault();
    undoAction();
  }
});

// Patch save functions to snapshot before mutating
const _origSaveFiche = saveFiche;
saveFiche = function(){
  snapshot(editFicheIdx !== null ? 'Modification fiche' : 'Ajout fiche FCQ');
  _origSaveFiche();
};
const _origSaveJoint = saveJoint;
saveJoint = function(){
  snapshot('Ajout joint');
  _origSaveJoint();
};
const _origConfirmDel = confirmDel;
confirmDel = function(type, idx, fromPhase){
  // snapshot before delete is confirmed — patch the ok button
  const origFn = document.getElementById('conf-ok').onclick;
  _origConfirmDel(type, idx, fromPhase);
  const newOk = document.getElementById('conf-ok').onclick;
  document.getElementById('conf-ok').onclick = function(){
    snapshot('Suppression '+ type);
    newOk();
  };
};

// ════════════════════════════════════════════════
// EDIT JOINT MODAL
// ════════════════════════════════════════════════
let editJointIdx = null;

function openEditJoint(idx){
  editJointIdx = idx;
  const j = CP.joints[idx];
  if(!j) return;
  document.getElementById('mj-title').textContent = 'Modifier le joint ' + j.type.toUpperCase();
  document.getElementById('ej-type').value  = j.type;
  document.getElementById('ej-zone').value  = j.zone || '';
  document.getElementById('ej-enc').value   = j.zone_enc || '';
  document.getElementById('ej-voie').value  = j.voie;
  document.getElementById('ej-pk').value    = j.pk;
  document.getElementById('ej-ci').value    = j.type_ci || '';
  document.getElementById('ej-date').value  = j.date_prev || '';
  document.getElementById('ej-phase').value = j.phase;
  document.getElementById('ej-detail').value= j.detail || '';
  document.getElementById('m-edit-joint').classList.add('open');
}

function saveEditJoint(){
  if(editJointIdx === null) return;
  snapshot('Modification joint');
  CP.joints[editJointIdx] = {
    type:     document.getElementById('ej-type').value,
    zone:     document.getElementById('ej-zone').value,
    zone_enc: document.getElementById('ej-enc').value,
    voie:     document.getElementById('ej-voie').value,
    pk:       parseFloat(document.getElementById('ej-pk').value) || 0,
    type_ci:  parseInt(document.getElementById('ej-ci').value) || null,
    date_prev:document.getElementById('ej-date').value,
    phase:    document.getElementById('ej-phase').value,
    detail:   document.getElementById('ej-detail').value || null
  };
  closeM('m-edit-joint');
  // Refresh
  if(document.getElementById('pg-syn').classList.contains('active')) renderSyn();
  if(document.getElementById('pg-joints').classList.contains('active')) renderJoints();
  updBadges();
  saveData();toast('Joint mis à jour ','ok');
}


// ════ RESET / RELOAD FUNCTIONS ════

function resetPlanToDefault(){
  if(!CP) return;
  snapshot('Reset plan de contrôle');
  CP.plan = JSON.parse(JSON.stringify(DFLT_PLAN));
  renderPlan();
  updBadges();
  toast('Plan de contrôle réinitialisé ','ok');
}

function clearGeneratedFiches(){
  if(!CP) return;
  // Remove fiches that were auto-generated (statut null, no date, no PK)
  const before = CP.fiches.length;
  snapshot('Effacer fiches générées');
  CP.fiches = CP.fiches.filter(f => f.date || f.pk_debut || f.statut);
  const removed = before - CP.fiches.length;
  if(removed === 0){ toast('Aucune fiche auto-générée à effacer','info'); return; }
  if(document.getElementById('pg-syn').classList.contains('active')) renderSyn();
  if(document.getElementById('pg-fcq').classList.contains('active')){ renderFCQ(); renderFCQStats(); }
  updBadges();
  toast(removed + ' fiche'+(removed>1?'s':'')+' générée'+(removed>1?'s':'')+' effacée'+(removed>1?'s':'')+' ','ok');
}

function reloadSynoptique(){
  if(!CP) return;
  renderSyn();
  document.getElementById('zone-sidebar').classList.remove('open');
  toast('Synoptique rechargé ','ok');
}

function resetProject(){
  // Full project data reset to demo data
  confirmDlg(
    'Réinitialiser le projet',
    'Toutes les fiches FCQ, joints et zones seront remis aux données de démonstration. Cette action est irréversible.',
    ()=>{
      snapshot('Reset projet complet');
      CP.fiches  = JSON.parse(JSON.stringify(DFLT_FICHES));
      CP.joints  = JSON.parse(JSON.stringify(DFLT_JOINTS));
      CP.zones   = JSON.parse(JSON.stringify(DFLT_ZONES));
      CP.plan    = JSON.parse(JSON.stringify(DFLT_PLAN));
      renderSyn();
      updBadges();
      toast('Projet réinitialisé aux données de démonstration ','ok');
    }
  );
}

// Utility: generic confirm dialog
function confirmDlg(title, msg, onOk){
  document.getElementById('conf-t').textContent = title;
  document.getElementById('conf-m').textContent = msg;
  document.getElementById('conf-ok').textContent = 'Confirmer';
  document.getElementById('conf-ok').onclick = ()=>{ closeM('m-confirm'); onOk(); };
  document.getElementById('m-confirm').classList.add('open');
}


// ═══════════════════════════════════════════
// SYNOPTIQUE ZOOM
// ═══════════════════════════════════════════
let synZoom = 100;
function applySynZoom(val) {
  synZoom = parseInt(val);
  const el = document.getElementById('syn-scroll');
  const card = document.getElementById('syn-card');
  if (!el || !card) return;
  const scale = synZoom / 100;
  card.style.transform = `scaleX(${scale})`;
  card.style.transformOrigin = 'top left';
  card.style.width = (100 / scale) + '%';
  const valEl = document.getElementById('syn-zoom-val');
  if (valEl) valEl.textContent = synZoom + '%';
}

// ═══════════════════════════════════════════
// SAVE INDICATOR
// ═══════════════════════════════════════════
let _saveTimer = null;
function showSaveIndicator() {
  let ind = document.getElementById('save-ind');
  if (!ind) {
    ind = document.createElement('div');
    ind.id = 'save-ind';
    ind.className = 'save-indicator';
    ind.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Sauvegardé';
    document.body.appendChild(ind);
  }
  ind.classList.add('show');
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => ind.classList.remove('show'), 1800);
}

// Patch saveData to also show indicator
const _origSaveData = saveData;
window.saveData = function() {
  _origSaveData();
  showSaveIndicator();
};

// ═══════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════
const OB_STEPS = [
  { icon: '', title: 'Bienvenue sur RailQual',
    desc: "Outil de pilotage qualite voie pour chantiers RATP, RER, Tramway. Donnees sauvegardees automatiquement.",
    features: [
      { icon: '#i-syn',    title: 'Synoptique',      sub: 'Visualisez C/NC/Attente sur le rail' },
      { icon: '#i-fcq',    title: 'Fiches FCQ',       sub: 'CRUD complet, filtres, export' },
      { icon: '#i-joints', title: 'Joints JIC/JM',    sub: 'Bibliotheque et suivi isolement' },
      { icon: '#i-plan',   title: 'Plan controle',    sub: '19 operations RATP + tolerances' },
    ]
  },
  { icon: '️', title: 'Premier projet',
    desc: "Cliquez Nouveau projet, renseignez la ligne et les PK. Votre chantier est immediatement disponible.",
    features: [
      { icon: '#i-plus',    title: 'Multi-projets', sub: 'Plusieurs chantiers simultanes' },
      { icon: '#i-bell',    title: 'Alertes SF',     sub: 'Points de blocage automatiques' },
      { icon: '#i-pdf',     title: 'Export PDF',     sub: 'Rapport avec QR code certifie' },
      { icon: '#i-palette', title: '8 themes',       sub: 'Interface claire ou sombre' },
    ]
  },
  { icon: '', title: 'Pret a demarrer',
    desc: "Donnees sauvegardees en local. Guide accessible via le bouton en bas. Ctrl+Z pour annuler.",
    features: [
      { icon: '#i-undo',   title: 'Ctrl+Z',    sub: 'Annuler toute action' },
      { icon: '#i-search', title: 'Recherche', sub: 'Filtres sur toutes les pages' },
      { icon: '#i-train',  title: 'Hors ligne',sub: 'Fonctionne sans internet' },
      { icon: '#i-temp',   title: 'LRS / TN',  sub: 'Suivi temperatures liberation' },
    ]
  }
];

let obStep = 0;

function showOnboarding() {
  if (document.getElementById('ob-overlay')) return;
  obStep = 0;
  const ov = document.createElement('div');
  ov.className = 'onboarding-overlay';
  ov.id = 'ob-overlay';
  document.body.appendChild(ov);
  renderObStep();
}

function renderObStep() {
  const ov = document.getElementById('ob-overlay');
  if (!ov) return;
  const s = OB_STEPS[obStep];
  const isLast = obStep === OB_STEPS.length - 1;
  ov.innerHTML = `
  <div class="onboarding-card">
    <div class="ob-header">
      <div class="ob-step-dots">
        ${OB_STEPS.map((_,i) => `<div class="ob-dot ${i===obStep?'active':''}"></div>`).join('')}
      </div>
      <div class="ob-icon">${s.icon}</div>
      <div class="ob-title">${s.title}</div>
      <div class="ob-desc">${s.desc}</div>
    </div>
    <div class="ob-body">
      <div class="ob-features">
        ${s.features.map(f => `
          <div class="ob-feat">
            <div class="ob-feat-ico">
              <svg width="14" height="14"><use href="${f.icon}"/></svg>
            </div>
            <div>
              <div class="ob-feat-title">${f.title}</div>
              <div class="ob-feat-sub">${f.sub}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div class="ob-footer">
      <button class="ob-skip" onclick="closeOnboarding()">Passer</button>
      <div style="display:flex;gap:8px;align-items:center">
        ${obStep > 0 ? `<button class="btn" onclick="obPrev()">← Précédent</button>` : ''}
        <button class="ob-next" onclick="${isLast ? 'closeOnboarding()' : 'obNext()'}">
          ${isLast ? '→ Démarrer' : 'Suivant →'}
        </button>
      </div>
    </div>
  </div>`;
}

function obNext() {
  if (obStep < OB_STEPS.length - 1) {
    obStep++;
    renderObStep();
  }
}

function obPrev() {
  if (obStep > 0) {
    obStep--;
    renderObStep();
  }
}

function closeOnboarding() {
  const ov = document.getElementById('ob-overlay');
  if (ov) ov.remove();
  localStorage.setItem('railqual_v4_seen', '1');
}

// ═══════════════════════════════════════════
// PWA — install prompt
// ═══════════════════════════════════════════
let _pwaPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _pwaPrompt = e;
  // Show banner after 3 seconds
  setTimeout(showPWABanner, 3000);
});

function showPWABanner() {
  if (document.getElementById('pwa-banner')) return;
  const b = document.createElement('div');
  b.id = 'pwa-banner';
  b.className = 'pwa-banner';
  b.innerHTML = `
    <div class="pwa-ico">
      <svg width="20" height="20"><use href="#i-train"/></svg>
    </div>
    <div>
      <div class="pwa-title">Installer RailQual</div>
      <div class="pwa-sub">Accès rapide · Fonctionne hors ligne</div>
    </div>
    <div class="pwa-actions">
      <button class="btn" onclick="document.getElementById('pwa-banner').remove()">Plus tard</button>
      <button class="btn pri" onclick="installPWA()">Installer</button>
    </div>`;
  document.body.appendChild(b);
}

async function installPWA() {
  if (!_pwaPrompt) return;
  _pwaPrompt.prompt();
  const result = await _pwaPrompt.userChoice;
  document.getElementById('pwa-banner')?.remove();
  _pwaPrompt = null;
}

// Keyboard shortcut: Ctrl+S = force save
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveData();
    showSaveIndicator();
  }
});

// ════ INIT ════
renderHome();

function saveEditJoint(){
  if(editJointIdx === null) return;
  snapshot('Modification joint');
  CP.joints[editJointIdx] = {
    type:     document.getElementById('ej-type').value,
    zone:     document.getElementById('ej-zone').value,
    zone_enc: document.getElementById('ej-enc').value,
    voie:     document.getElementById('ej-voie').value,
    pk:       parseFloat(document.getElementById('ej-pk').value) || 0,
    type_ci:  parseInt(document.getElementById('ej-ci').value) || null,
    date_prev:document.getElementById('ej-date').value,
    phase:    document.getElementById('ej-phase').value,
    detail:   document.getElementById('ej-detail').value || null
  };
  closeM('m-edit-joint');
  // Refresh
  if(document.getElementById('pg-syn').classList.contains('active')) renderSyn();
  if(document.getElementById('pg-joints').classList.contains('active')) renderJoints();
  updBadges();
  toast('Joint mis à jour ','ok');
}

// ════ INIT ════

// ── PERSISTENCE ──
const STORAGE_KEY = 'railqual_v4_data';

function saveData() {
  try {
    const payload = {
      projects: projects,
      currentTheme: currentTheme || 'light',
      currentAccent: typeof currentAccent !== 'undefined' ? currentAccent : '#F59E0B',
      savedAt: new Date().toISOString(),
      version: '4.0'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch(e) { console.warn('Save failed:', e); }
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.version && data.projects && Array.isArray(data.projects)) {
      // Restore each project — ensure all required fields exist
      projects.length = 0;
      data.projects.forEach(p => {
        if (!p.plan || !p.plan.length) p.plan = JSON.parse(JSON.stringify(DFLT_PLAN));
        if (!p.ficheTypes) p.ficheTypes = [...DFLT_FT];
        if (!p.zones) p.zones = JSON.parse(JSON.stringify(DFLT_ZONES));
        if (!p.fiches) p.fiches = [];
        if (!p.joints) p.joints = [];
        projects.push(p);
      });
      if (data.currentAccent && typeof setAccent === 'function') {
        currentAccent = data.currentAccent;
        applyAccent(currentAccent);
        // Sync circle UI
        document.querySelectorAll('.accent-circle').forEach(c => {
          c.classList.toggle('active', c.dataset.accent === currentAccent || 
            c.style.background === currentAccent);
        });
      }
      return true;
    }
  } catch(e) { console.warn('Load failed:', e); }
  return false;
}

// Auto-save: wrap all mutation functions
const _origSave_projects = () => saveData();

// Patch: save after every project mutation
const _patchSave = (fn) => function(...args) {
  const result = fn.apply(this, args);
  saveData();
  return result;
};

// Hook into createProj and deleteProj to auto-save
const _origCreateProj = createProj;
window.createProj = function() { _origCreateProj(); saveData(); };

const _origDeleteProj = deleteProj;
window.deleteProj = function(id) { _origDeleteProj(id); saveData(); };

// Hook fiches, joints, plan mutations
const _autoSaveMutations = ['saveFiche','saveJoint','saveEditJoint','confirmDel','saveZL','confirmPlanImport'];
_autoSaveMutations.forEach(fn => {
  if (typeof window[fn] === 'function') {
    const orig = window[fn];
    window[fn] = function(...args) { const r = orig.apply(this, args); saveData(); return r; };
  }
});

// Save on theme/accent change
const _origSetAccent = setAccent;
window.setAccent = function(hex, el) { _origSetAccent(hex, el); saveData(); };


// ── SERVICE WORKER (inline via Blob) ──
const SW_VERSION = 'railqual-v4-sw-1';
const SW_SCRIPT = `
const CACHE = '${SW_VERSION}';
const ASSETS = ['.'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response('Hors ligne', {status: 503}));
    })
  );
});
`;

if ('serviceWorker' in navigator) {
  const blob = new Blob([SW_SCRIPT], { type: 'application/javascript' });
  const swURL = URL.createObjectURL(blob);
  navigator.serviceWorker.register(swURL, { scope: './' })
    .then(reg => {
      console.log('[RailQual] Service Worker registered', reg.scope);
      // Show offline indicator when network changes
      window.addEventListener('offline', () => showToast('Mode hors ligne — données locales', 'wt'));
      window.addEventListener('online',  () => showToast('Connexion rétablie', 'ok'));
    })
    .catch(err => console.warn('[RailQual] SW registration failed:', err));
}


// ── PAGE TRANSITIONS ──
const _origShowPage = showPage;
window.showPage = function(page, el) {
  const main = document.querySelector('.main-content');
  if (main) {
    main.style.opacity = '0';
    main.style.transform = 'translateY(4px)';
    main.style.transition = 'opacity .12s ease, transform .12s ease';
    requestAnimationFrame(() => {
      setTimeout(() => {
        _origShowPage(page, el);
        requestAnimationFrame(() => {
          main.style.opacity = '1';
          main.style.transform = 'translateY(0)';
        });
      }, 60);
    });
  } else {
    _origShowPage(page, el);
  }
};

// Home → Project transition
const _origOpenProj = openProj;
window.openProj = function(id) {
  const main = document.querySelector('.main-content') || document.body;
  main.style.opacity = '0';
  main.style.transform = 'translateX(6px)';
  main.style.transition = 'opacity .15s ease, transform .15s ease';
  setTimeout(() => {
    _origOpenProj(id);
    requestAnimationFrame(() => {
      main.style.opacity = '1';
      main.style.transform = 'translateX(0)';
    });
  }, 80);
};

// Project → Home transition
const _origGoHome = goHome;
window.goHome = function() {
  const main = document.querySelector('.main-content') || document.body;
  main.style.opacity = '0';
  main.style.transform = 'translateX(-4px)';
  main.style.transition = 'opacity .12s ease, transform .12s ease';
  setTimeout(() => {
    _origGoHome();
    requestAnimationFrame(() => {
      main.style.opacity = '1';
      main.style.transform = 'translateX(0)';
    });
  }, 60);
};


// ── SAFE GLOBAL EXPOSURE (no eval) ──
window.setSpecialTheme  = setSpecialTheme;
window.setThemeCard     = setThemeCard;
window.setTheme         = setTheme;
window.setMode          = setMode;
window.setAccent        = setAccent;
window.nextTheme        = nextTheme;
window.showPage         = window.showPage  || showPage;
window.openProj         = window.openProj  || openProj;
window.goHome           = window.goHome    || goHome;
window.createProj       = window.createProj || createProj;
window.deleteProj       = window.deleteProj || deleteProj;
window.saveFiche        = window.saveFiche  || saveFiche;
window.saveJoint        = window.saveJoint  || saveJoint;
window.saveEditJoint    = typeof saveEditJoint !== 'undefined' ? saveEditJoint : ()=>{};
window.confirmDel       = typeof confirmDel  !== 'undefined' ? confirmDel  : ()=>{};
window.saveZL           = typeof saveZL      !== 'undefined' ? saveZL      : ()=>{};
window.confirmPlanImport= typeof confirmPlanImport !== 'undefined' ? confirmPlanImport : ()=>{};
window.clearGeneratedFiches = typeof clearGeneratedFiches !== 'undefined' ? clearGeneratedFiches : ()=>{};
window.exportRapportPDF = typeof exportRapportPDF !== 'undefined' ? exportRapportPDF : ()=>{};
window.exportXLS        = typeof exportXLS   !== 'undefined' ? exportXLS   : ()=>{};
window.toggleGuide      = typeof toggleGuide !== 'undefined' ? toggleGuide : ()=>{};
window.showOnboarding   = typeof showOnboarding !== 'undefined' ? showOnboarding : ()=>{};
window.closeOnboarding  = typeof closeOnboarding !== 'undefined' ? closeOnboarding : ()=>{};
window.obNext           = typeof obNext !== 'undefined' ? obNext : ()=>{};
window.obPrev           = typeof obPrev !== 'undefined' ? obPrev : ()=>{};
window.installPWA       = typeof installPWA !== 'undefined' ? installPWA : ()=>{};
window.applySynZoom     = typeof applySynZoom !== 'undefined' ? applySynZoom : ()=>{};
window.updThemeCardConfig = updThemeCardConfig;
window.applyAccent      = applyAccent;
window.reloadSynoptique = typeof reloadSynoptique !== 'undefined' ? reloadSynoptique : ()=>{};
window.openZoneDetail   = typeof openZoneDetail !== 'undefined' ? openZoneDetail : ()=>{};
window.toggleZE         = typeof toggleZE !== 'undefined' ? toggleZE : ()=>{};
window.showZoneTT       = typeof showZoneTT !== 'undefined' ? showZoneTT : ()=>{};
window.hideTT           = typeof hideTT !== 'undefined' ? hideTT : ()=>{};
window.moveTT           = typeof moveTT !== 'undefined' ? moveTT : ()=>{};
window.openPhaseDetail  = typeof openPhaseDetail !== 'undefined' ? openPhaseDetail : ()=>{};
window.toggleSFPanel    = typeof toggleSFPanel !== 'undefined' ? toggleSFPanel : ()=>{};


// ── STAT CARD CLICK → navigate + filter ──
function goToFCQFilter(filter) {
  const navFCQ = document.getElementById('nv-fcq');
  if (navFCQ) showPage('fcq', navFCQ);
  requestAnimationFrame(() => {
    // Utiliser les nouveaux états séparés
    if (filter === 'V1' || filter === 'V2') {
      fcqVoie = filter;
    } else {
      fcqStatut = filter === undefined ? 'all' : filter;
      fcqVoie   = 'all';
    }
    _syncFCQActiveStates();
    renderFCQ();
  });
}
// ── TRI COLONNES FCQ ──
let fcqSortCol = null, fcqSortAsc = true;
function sortFCQ(col) {
  if (fcqSortCol === col) fcqSortAsc = !fcqSortAsc;
  else { fcqSortCol = col; fcqSortAsc = true; }
  // Mettre à jour les indicateurs visuels
  ['ref','fiche','voie','pk','date','statut'].forEach(c => {
    const el = document.getElementById('sort-' + c);
    if (el) el.textContent = c === col ? (fcqSortAsc ? '↑' : '↓') : '';
  });
  renderFCQ();
}
window.sortFCQ = sortFCQ;
window.setFCQStatut = setFCQStatut;
window.setFCQVoie   = setFCQVoie;
window.setFF        = setFF;
window.renderFCQ    = renderFCQ;
window.renderFCQStats = renderFCQStats;
window.goToFCQFilter  = goToFCQFilter;


// ═══════════════════════════════════════════════════════════════
// 1. PIÈCES JOINTES — base64, suppression, téléchargement, visualisation
// ═══════════════════════════════════════════════════════════════
let pendingPJs = []; // [{name,size,type,data}] pendant l'édition


function handlePJDrop(e) {
  e.preventDefault();
  document.getElementById('pj-dropzone').classList.remove('pj-dz-over');
  processPJFiles(e.dataTransfer.files);
}

function handlePJInput(files) {
  processPJFiles(files);
  document.getElementById('pj-input').value = '';
}

function processPJFiles(files) {
  if (!files || !files.length) return;
  const MAX = 4 * 1024 * 1024; // 4 MB par fichier
  Array.from(files).forEach(file => {
    if (file.size > MAX) { toast(`${file.name} trop lourd (max 4 Mo)`, 'err'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      pendingPJs.push({ name: file.name, size: file.size, type: file.type, data: e.target.result });
      renderPJList();
    };
    reader.readAsDataURL(file);
  });
}

function renderPJList() {
  const list = document.getElementById('pj-list');
  if (!list) return;
  if (!pendingPJs.length) { list.innerHTML = ''; return; }
  list.innerHTML = pendingPJs.map((pj, i) => {
    const isPDF = pj.type === 'application/pdf' || pj.name.endsWith('.pdf');
    const isImg = pj.type.startsWith('image/');
    const sizeStr = pj.size < 1024*1024 ? Math.round(pj.size/1024)+'Ko' : (pj.size/1024/1024).toFixed(1)+'Mo';
    const thumb = isImg
      ? `<div class="pj-thumb"><img src="${pj.data}" alt="${pj.name}"></div>`
      : `<div class="pj-thumb">${isPDF
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>'
        }</div>`;
    return `<div class="pj-item">
      ${thumb}
      <span class="pj-name" title="${pj.name}">${pj.name}</span>
      <span class="pj-size">${sizeStr}</span>
      <div class="pj-acts">
        ${(isPDF || isImg) ? `<button class="pj-btn" onclick="viewPJ(${i})" title="Visualiser">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>` : ''}
        <button class="pj-btn" onclick="downloadPJ(${i})" title="Télécharger">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button class="pj-btn del" onclick="deletePJ(${i})" title="Supprimer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');
}

function deletePJ(i) {
  pendingPJs.splice(i, 1);
  renderPJList();
  toast('Pièce jointe supprimée', 'info');
}

function downloadPJ(i) {
  const pj = pendingPJs[i];
  if (!pj) return;
  const a = document.createElement('a');
  a.href = pj.data;
  a.download = pj.name;
  a.click();
}

function viewPJ(i) {
  const pj = pendingPJs[i];
  if (!pj) return;
  const w = window.open('', '_blank');
  if (pj.type.startsWith('image/')) {
    w.document.write(`<!DOCTYPE html><html><head><title>${pj.name}</title>
    <style>body{margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh}
    img{max-width:98vw;max-height:98vh;object-fit:contain;border-radius:6px;box-shadow:0 8px 40px rgba(0,0,0,.5)}</style></head>
    <body><img src="${pj.data}" alt="${pj.name}"></body></html>`);
  } else {
    w.document.write(`<!DOCTYPE html><html><head><title>${pj.name}</title>
    <style>body{margin:0;overflow:hidden}iframe{width:100vw;height:100vh;border:none}</style></head>
    <body><iframe src="${pj.data}"></iframe></body></html>`);
  }
}

// Badge PJ dans le tableau FCQ
function renderPJBadge(pjs) {
  if (!pjs || !pjs.length) return '<span style="color:var(--t3);font-size:10px">—</span>';
  return `<span class="pj-badge" onclick="viewFichePJs(this)">${pjs.length} PJ</span>`;
}

function viewFichePJs(el, ficheIdx) {
  // Si idx direct fourni, utiliser directement
  if (ficheIdx !== undefined && CP) {
    const f = CP.fiches[ficheIdx];
    if (!f || !f.pjs || !f.pjs.length) return;
    pendingPJs = JSON.parse(JSON.stringify(f.pjs));
    _showPJOverlay();
    return;
  }
  // Sinon chercher via DOM
  // Le badge est dans une cellule du tableau — récupérer l'index depuis l'attribut data
  const tr = el.closest('tr');
  if (!tr) return;
  const idx = parseInt(tr.dataset.idx);
  if (isNaN(idx)) return;
  const f = CP.fiches[idx];
  if (!f || !f.pjs || !f.pjs.length) return;
  pendingPJs = JSON.parse(JSON.stringify(f.pjs));
  // Ouvrir un mini overlay pour voir les PJ de la fiche
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;inset:0;z-index:950;background:rgba(0,0,0,.5);backdrop-filter: none;display:flex;align-items:center;justify-content:center';
  const box = document.createElement('div');
  box.style.cssText = 'background:var(--surf);border-radius:14px;padding:20px;width:min(500px,94vw);max-height:80vh;overflow-y:auto;box-shadow:0 24px 70px rgba(0,0,0,.3)';
  box.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
    <div style="font-weight:700;font-size:14px">Pièces jointes — ${f.fiche}</div>
    <button style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--t3)" onclick="this.closest('div[style*=fixed]').remove()">×</button>
  </div>
  <div id="pj-view-list"></div>`;
  panel.appendChild(box);
  document.body.appendChild(panel);
  const listEl = box.querySelector('#pj-view-list');
  listEl.innerHTML = f.pjs.map((pj, i) => {
    const isPDF = pj.type === 'application/pdf' || pj.name.endsWith('.pdf');
    const isImg = pj.type && pj.type.startsWith('image/');
    const sizeStr = pj.size < 1024*1024 ? Math.round(pj.size/1024)+'Ko' : (pj.size/1024/1024).toFixed(1)+'Mo';
    return `<div class="pj-item">
      <div class="pj-thumb">${isImg ? `<img src="${pj.data}" style="width:100%;height:100%;object-fit:cover">` : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>'}</div>
      <span class="pj-name">${pj.name}</span>
      <span class="pj-size">${sizeStr}</span>
      <div class="pj-acts">
        ${(isPDF||isImg)?`<button class="pj-btn" onclick="pendingPJs[${i}]&&viewPJ(${i})" title="Voir"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg></button>`:''}
        <button class="pj-btn" onclick="pendingPJs[${i}]&&downloadPJ(${i})" title="Télécharger"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
      </div>
    </div>`;
  }).join('');
  panel.addEventListener('click', e => { if (e.target === panel) panel.remove(); });
}

// ═══════════════════════════════════════════════════════════════
// 2. HISTORIQUE HORODATÉ
// ═══════════════════════════════════════════════════════════════
function addHistoryEntry(fiche, type, detail) {
  if (!fiche.history) fiche.history = [];
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric'});
  const timeStr = now.toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'});
  fiche.history.unshift({ date: dateStr, time: timeStr, type, detail, user: 'LOKONON G.S.' });
  if (fiche.history.length > 20) fiche.history.pop(); // Max 20 entrées
}

function renderFicheHistory(fiche) {
  const sec = document.getElementById('fiche-hist-sec');
  const list = document.getElementById('fiche-hist-list');
  if (!sec || !list) return;
  if (!fiche || !fiche.history || !fiche.history.length) {
    sec.style.display = 'none'; return;
  }
  sec.style.display = 'block';
  const colors = { create: 'var(--ok)', edit: 'var(--accent)', statut: 'var(--wt)', pj: '#8B5CF6' };
  list.innerHTML = fiche.history.map(h => `
    <div class="hist-entry">
      <div class="hist-dot" style="background:${colors[h.type]||'var(--t3)'}"></div>
      <div class="hist-txt">${h.detail}</div>
      <div class="hist-meta">${h.date} ${h.time}</div>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// 3. RECHERCHE GLOBALE
// ═══════════════════════════════════════════════════════════════
function globalSearch(q) {
  const clearBtn = document.getElementById('tb-srch-clear');
  const ov = document.getElementById('srch-ov');
  if (clearBtn) clearBtn.classList.toggle('vis', q.length > 0);
  if (!q || q.length < 2) { if (ov) ov.classList.remove('open'); return; }
  if (!CP) { if (ov) ov.classList.remove('open'); return; }
  if (ov) ov.classList.add('open');
  const panel = document.getElementById('srch-panel');
  if (!panel) return;

  const ql = q.toLowerCase();
  const hl = t => {
    const i = t.toLowerCase().indexOf(ql);
    if (i < 0) return t;
    return t.slice(0,i) + '<span class="srch-hl">' + t.slice(i, i+q.length) + '</span>' + t.slice(i+q.length);
  };

  // Fiches FCQ
  const matchFiches = CP.fiches.filter(f =>
    [f.ref, f.fiche, f.voie, f.statut, f.commentaire, String(f.pk_debut), String(f.pk_fin), f.date]
    .some(v => v && v.toLowerCase().includes(ql))
  );

  // Joints
  const matchJoints = CP.joints ? CP.joints.filter(j =>
    [j.zone, j.type, String(j.pk), j.ref_jeu].some(v => v && String(v).toLowerCase().includes(ql))
  ) : [];

  // Zones
  const matchZones = CP.zones ? CP.zones.filter(z => z.label.toLowerCase().includes(ql)) : [];

  // Plan de contrôle
  const matchPlan = CP.plan ? CP.plan.filter(op =>
    [op.operation, op.critere, op.docs&&op.docs.join(' ')].some(v => v && v.toLowerCase().includes(ql))
  ) : [];

  let html = '';

  if (matchFiches.length) {
    html += `<div class="srch-grp"><div class="srch-grp-title">Fiches FCQ (${matchFiches.length})</div>`;
    matchFiches.slice(0,6).forEach(f => {
      const idx = CP.fiches.indexOf(f);
      const col = f.statut==='C'?'var(--ok)':f.statut==='NC'?'var(--nc)':'var(--wt)';
      const lbl = f.statut==='C'?'C':f.statut==='NC'?'NC':'~';
      html += `<div class="srch-row" onclick="closeSearch();goToFCQFilter('${f.statut||''}');setTimeout(()=>{const r=document.querySelector('[data-idx=\\'${idx}\\']');if(r){r.scrollIntoView({behavior:'smooth',block:'center'});r.style.outline='2px solid var(--accent)';setTimeout(()=>r.style.outline='',1500);}},200)">
        <div class="srch-ico" style="background:${col}20;border:1px solid ${col}40;color:${col};font-family:var(--fm);font-size:10px;font-weight:700">${lbl}</div>
        <div class="srch-body">
          <div class="srch-title">${hl(f.fiche||'—')}</div>
          <div class="srch-sub">${hl(f.ref||'')} · ${f.voie||''} · PK ${f.pk_debut?fmtPK(f.pk_debut):'?'}${f.pk_fin?'→'+fmtPK(f.pk_fin):''} · ${f.date||'sans date'}</div>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (matchJoints.length) {
    html += `<div class="srch-grp"><div class="srch-grp-title">Joints (${matchJoints.length})</div>`;
    matchJoints.slice(0,4).forEach(j => {
      html += `<div class="srch-row" onclick="closeSearch();showPage('joints',document.getElementById('nv-jt'))">
        <div class="srch-ico" style="background:var(--accent)20;color:var(--accent)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>
        </div>
        <div class="srch-body">
          <div class="srch-title">${hl(j.zone||j.type||'Joint')}</div>
          <div class="srch-sub">PK ${j.pk||'?'} · Voie ${j.voie||'?'} · ${j.type?.toUpperCase()}</div>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (matchZones.length) {
    html += `<div class="srch-grp"><div class="srch-grp-title">Zones</div>`;
    matchZones.forEach(z => {
      const zi = CP.zones.indexOf(z);
      const nf = CP.fiches.filter(f=>f.pk_debut>=z.pkStart&&f.pk_fin<=z.pkEnd).length;
      html += `<div class="srch-row" onclick="closeSearch();showPage('syn',document.getElementById('nv-syn'));setTimeout(()=>openZoneDetail(${zi}),200)">
        <div class="srch-ico" style="background:var(--surf3)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        </div>
        <div class="srch-body">
          <div class="srch-title">${hl(z.label)}</div>
          <div class="srch-sub">PK ${fmtPK(z.pkStart)} → ${fmtPK(z.pkEnd)} · ${nf} fiche${nf>1?'s':''}</div>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (matchPlan.length) {
    html += `<div class="srch-grp"><div class="srch-grp-title">Plan de contrôle (${matchPlan.length})</div>`;
    matchPlan.slice(0,3).forEach(op => {
      html += `<div class="srch-row" onclick="closeSearch();showPage('plan',document.getElementById('nv-plan'))">
        <div class="srch-ico" style="background:var(--surf3)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="srch-body">
          <div class="srch-title">${hl(op.operation||'Opération')}</div>
          <div class="srch-sub">${op.critere?hl(op.critere).slice(0,70)+'…':''}</div>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (!html) {
    html = `<div class="srch-empty">Aucun résultat pour "<b>${q}</b>"</div>`;
  }

  panel.innerHTML = html;
}

function closeSearch() {
  const ov = document.getElementById('srch-ov');
  if (ov) ov.classList.remove('open');
  const inp = document.getElementById('tb-srch-inp');
  if (inp) inp.value = '';
  const clr = document.getElementById('tb-srch-clear');
  if (clr) clr.classList.remove('vis');
}
window.closeSearch = closeSearch;
window.globalSearch = globalSearch;

// ═══════════════════════════════════════════════════════════════
// 4. SYNOPTIQUE PAR TÂCHE — openPhaseDetail enrichie
//    Remplace l'existante avec dates de réception + zones à faire
// ═══════════════════════════════════════════════════════════════
function openPhaseDetail(ref) {
  const p = CP;
  const pf = p.fiches.filter(f => f.ref === ref);
  const okC = pf.filter(f => f.statut === 'C').length;
  const ncC = pf.filter(f => f.statut === 'NC').length;
  const wtC = pf.filter(f => !f.statut).length;
  const pct = pf.length ? Math.round(okC / pf.length * 100) : 0;
  const phColor = PHASE_COLORS[ref] || 'var(--ok)';

  document.getElementById('pd-ico').innerHTML = `<span style="font-size:20px">${PHASE_ICONS[ref] || ''}</span>`;
  document.getElementById('pd-ico').style.background = phColor + '20';
  document.getElementById('pd-ico').style.border = `1px solid ${phColor}40`;
  document.getElementById('pd-name').textContent = ref;
  document.getElementById('pd-sub').textContent =
    `${pf.length} fiche${pf.length > 1 ? 's' : ''} · ${okC} conformes · ${ncC} NC · ${wtC} en attente · ${pct}%`;

  const body = document.getElementById('pd-body');
  body.innerHTML = '';

  // ── KPIs ──
  const kpis = document.createElement('div'); kpis.className = 'pd-kpis';
  kpis.innerHTML = `
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:var(--t1)">${pf.length}</div><div class="pd-kpi-l">Total fiches</div></div>
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:var(--ok)">${okC}</div><div class="pd-kpi-l">Conformes</div></div>
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:${ncC?'var(--nc)':'var(--t3)'}; ${ncC?'animation:pulse 2s infinite':''}">${ncC}</div><div class="pd-kpi-l">Non conformes</div></div>
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:${wtC?'var(--wt)':'var(--t3)'}">${wtC}</div><div class="pd-kpi-l">En attente</div></div>
    <div class="pd-kpi"><div class="pd-kpi-v" style="color:${phColor}">${pct}%</div><div class="pd-kpi-l">Conformité</div></div>`;
  body.appendChild(kpis);

  // ── LÉGENDE ──
  const leg = document.createElement('div'); leg.className = 'task-legend';
  leg.innerHTML = `
    <span class="task-leg-item"><span class="task-leg-dot" style="background:var(--ok)"></span> Conforme (C)</span>
    <span class="task-leg-item"><span class="task-leg-dot" style="background:var(--nc)"></span> Non conforme (NC)</span>
    <span class="task-leg-item"><span class="task-leg-dot" style="background:var(--wt)"></span> En attente</span>
    <span class="task-leg-item"><span class="task-leg-hatch"></span> Non couvert / à faire</span>
    <span class="task-leg-item" style="margin-left:auto;font-family:var(--fm);font-size:9px;color:var(--t3)">Pin = date de réception · ! = NC</span>`;
  body.appendChild(leg);

  // ── SYNOPTIQUE PAR VOIE — cœur de la feature ──
  const segsWithPK = pf.filter(f => f.pk_debut && f.pk_fin);
  const progDiv = document.createElement('div'); progDiv.className = 'pd-prog';
  const secTitle = document.createElement('div');
  secTitle.style.cssText = 'font-family:var(--fm);font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:var(--t3);margin-bottom:10px;display:flex;align-items:center;gap:8px';
  secTitle.innerHTML = `Synoptique tâche — <b style="color:var(--t1)">${ref}</b>
    <span style="flex:1;height:1px;background:var(--ln)"></span>
    PK ${fmtPK(p.pkStart)} → ${fmtPK(p.pkEnd)}`;
  progDiv.appendChild(secTitle);

  ['V1', 'V2'].forEach(v => {
    const vSegs = segsWithPK.filter(f => f.voie === v);
    const totalPK = p.pkEnd - p.pkStart;

    // Calculer mètres couverts par cette voie
    const coveredM = vSegs.reduce((acc, f) => acc + (f.pk_fin - f.pk_debut), 0);
    const covPct = Math.round(coveredM / totalPK * 100);
    const okM = vSegs.filter(f => f.statut === 'C').reduce((a, f) => a + (f.pk_fin - f.pk_debut), 0);
    const ncM = vSegs.filter(f => f.statut === 'NC').reduce((a, f) => a + (f.pk_fin - f.pk_debut), 0);

    const wrap = document.createElement('div'); wrap.className = 'task-rail-wrap';

    // En-tête voie
    const hdr = document.createElement('div'); hdr.className = 'task-rail-hdr';
    hdr.innerHTML = `
      <span class="task-rail-voie">Voie ${v.slice(1)}</span>
      <span class="task-rail-stats">
        <span style="color:var(--t3)">${covPct}% couvert · ${coveredM}m / ${totalPK}m</span>
        ${okM ? `<span style="color:var(--ok)">${okM}m C</span>` : ''}
        ${ncM ? `<span style="color:var(--nc)">${ncM}m NC</span>` : ''}
      </span>`;
    wrap.appendChild(hdr);

    // Barre avec espace pour pins de date
    const barOuter = document.createElement('div'); barOuter.className = 'task-bar-outer';
    const track = document.createElement('div'); track.className = 'task-bar-track';

    // Zone "à faire" hachuré sur toute la longueur
    const todo = document.createElement('div'); todo.className = 'task-bar-todo';
    track.appendChild(todo);

    // Trier les segments par PK pour un rendu propre
    const sorted = [...vSegs].sort((a, b) => a.pk_debut - b.pk_debut);

    // Grouper les dates identiques pour éviter les pins superposés
    const datePins = new Map();

    sorted.forEach(f => {
      const left = pkP(f.pk_debut, p);
      const w = Math.max(0.5, pkP(f.pk_fin, p) - left);
      const cls = !f.statut ? 'wt' : f.statut === 'C' ? 'ok' : 'nc';

      // Segment coloré
      const seg = document.createElement('div'); seg.className = `tseg-v5 ${cls}`;
      seg.style.cssText = `left:${left}%;width:${w}%`;
      seg.title = `${f.fiche} · PK ${fmtPK(f.pk_debut)}→${fmtPK(f.pk_fin)} · ${f.date || 'sans date'} · ${f.statut || 'En attente'}`;
      // Texte dans le segment si assez large
      if (w > 5) {
        const lbl = document.createElement('div'); lbl.className = 'tseg-v5-lbl';
        lbl.textContent = f.date ? f.date.slice(5) : (w > 8 ? fmtPK(f.pk_debut) : '');
        seg.appendChild(lbl);
      }
      seg.addEventListener('click', () => { /* highlight dans tableau en dessous */ });
      track.appendChild(seg);

      // NC pin (panneau rouge)
      if (f.statut === 'NC') {
        const midLeft = left + w / 2;
        const ncPin = document.createElement('div'); ncPin.className = 'nc-pin';
        ncPin.style.left = midLeft + '%';
        ncPin.innerHTML = `<div class="nc-pin-flag">NC · ${fmtPK(f.pk_debut)}</div><div class="nc-pin-stem"></div>`;
        barOuter.appendChild(ncPin);
      }

      // Pin de date — grouper par date pour éviter superposition
      if (f.date) {
        const pinLeft = left + w / 2;
        const dateKey = f.date;
        if (!datePins.has(dateKey)) datePins.set(dateKey, []);
        datePins.get(dateKey).push({ left: pinLeft, statut: f.statut });
      }
    });

    // Rendre les pins de date (un seul pin par date, positionné à la moyenne)
    datePins.forEach((entries, date) => {
      const avgLeft = entries.reduce((s, e) => s + e.left, 0) / entries.length;
      const hasNC = entries.some(e => e.statut === 'NC');
      const allC = entries.every(e => e.statut === 'C');
      const bg = hasNC ? 'var(--nc)' : allC ? 'var(--ok)' : 'var(--wt)';

      // Formatter la date de manière lisible
      let dateDisplay = date;
      try {
        const d = new Date(date);
        dateDisplay = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      } catch(e) {}

      const pin = document.createElement('div'); pin.className = 'date-pin';
      pin.style.left = avgLeft + '%';
      pin.innerHTML = `
        <div class="date-pin-tag" style="background:${bg}">${dateDisplay}</div>
        <div class="date-pin-stem" style="background:${bg}"></div>`;
      barOuter.appendChild(pin);
    });

    barOuter.appendChild(track);
    wrap.appendChild(barOuter);

    // Règle PK
    const ruler = document.createElement('div'); ruler.className = 'task-pk-ruler';
    const step = Math.max(10, Math.round((p.pkEnd - p.pkStart) / 8 / 10) * 10);
    for (let pk = p.pkStart; pk <= p.pkEnd; pk += step) {
      const t = document.createElement('span'); t.textContent = fmtPK(Math.round(pk));
      ruler.appendChild(t);
    }
    wrap.appendChild(ruler);

    // Bannière couverture
    const banner = document.createElement('div');
    if (vSegs.length === 0) {
      banner.className = 'uncovered-banner';
      banner.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
        Voie ${v.slice(1)} — Aucune fiche reçue pour cette tâche`;
    } else if (covPct >= 100) {
      banner.className = 'covered-banner';
      banner.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Voie ${v.slice(1)} — Couverture complète · ${coveredM}m`;
    } else {
      banner.className = 'uncovered-banner';
      banner.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
        Voie ${v.slice(1)} — ${totalPK - coveredM}m restants à couvrir (${100 - covPct}%)`;
    }
    wrap.appendChild(banner);
    progDiv.appendChild(wrap);
  });

  // NC zones résumé
  const zoneNCs = [];
  p.zones.forEach(z => {
    const zNcF = pf.filter(f => f.statut === 'NC' && f.pk_debut && f.pk_fin &&
      !(f.pk_fin < z.pkStart || f.pk_debut > z.pkEnd));
    if (zNcF.length) zoneNCs.push({ zone: z, fiches: zNcF });
  });
  if (zoneNCs.length) {
    const nc2 = document.createElement('div');
    nc2.style.cssText = 'margin-top:10px;padding:10px 12px;background:var(--nc-bg);border:1px solid var(--nc-bd);border-radius:8px;font-size:11.5px;color:var(--nc);display:flex;align-items:center;gap:8px';
    nc2.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <b>Non-conformités :</b> ${zoneNCs.map(z => `${z.zone.label} (${z.fiches.length} NC)`).join(' · ')}`;
    progDiv.appendChild(nc2);
  }

  body.appendChild(progDiv);

  // ── TABLE DES FICHES avec PJ badge ──
  const tblDiv = document.createElement('div');
  tblDiv.innerHTML = `<div class="pd-fcq-title">
    <span>Fiches FCQ — ${ref}</span>
    <button class="btn" onclick="filterFCQByRef('${ref}')">
      <svg width="11" height="11"><use href="#i-fcq"/></svg> Voir dans FCQ
    </button>
  </div>`;
  const tblWrap = document.createElement('div'); tblWrap.className = 'tbl-wrap';
  const tbl = document.createElement('table'); tbl.className = 'dtbl';
  tbl.innerHTML = `<thead><tr>
    <th>Fiche de contrôle</th><th>Voie</th><th>PK</th><th>Réception</th><th>Statut</th><th>PJ</th><th style="width:54px"></th>
  </tr></thead>`;
  const tbody = document.createElement('tbody');
  // Trier par date de réception
  const pfSorted = [...pf].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  pfSorted.forEach(f => {
    const idx = p.fiches.indexOf(f);
    const bdg = f.statut === 'C'
      ? `<span class="bdg bdg-ok">C</span>`
      : f.statut === 'NC'
        ? `<span class="bdg bdg-nc">NC</span>`
        : `<span class="bdg bdg-wt">Att.</span>`;
    const pjBadge = (f.pjs && f.pjs.length)
      ? `<span class="pj-badge" onclick="pendingPJs=JSON.parse(JSON.stringify(CP.fiches[${idx}].pjs||[]));viewFichePJs(this)">${f.pjs.length} PJ</span>`
      : `<span style="color:var(--t3);font-size:10px">—</span>`;
    const tr2 = document.createElement('tr'); tr2.dataset.idx = idx;
    tr2.innerHTML = `
      <td style="font-weight:600">${f.fiche}${f.commentaire ? `<div class="nc-note"><svg width="10" height="10"><use href="#i-warn"/></svg>${f.commentaire}</div>` : ''}</td>
      <td><span class="voie-t">${f.voie}</span></td>
      <td><span class="pk-t">${f.pk_debut ? fmtPK(f.pk_debut) + '→' + fmtPK(f.pk_fin) : '—'}</span></td>
      <td><span class="date-t" style="color:var(--accent)">${f.date || '—'}</span></td>
      <td>${bdg}</td>
      <td>${pjBadge}</td>
      <td><div class="row-acts">
        <button class="rbtn edit" onclick="editFicheFromPhase(${idx})"><svg width="11" height="11"><use href="#i-edit"/></svg></button>
        <button class="rbtn del" onclick="confirmDel('fiche',${idx},true)"><svg width="11" height="11"><use href="#i-x"/></svg></button>
      </div></td>`;
    tbody.appendChild(tr2);
  });
  tbl.appendChild(tbody); tblWrap.appendChild(tbl); tblDiv.appendChild(tblWrap);
  body.appendChild(tblDiv);

  document.getElementById('pd-ov').classList.add('open');
}
window.openPhaseDetail = openPhaseDetail;

// ═══════════════════════════════════════════════════════════════
// PATCH saveFiche — intégrer PJ + historique
// ═══════════════════════════════════════════════════════════════
const _origSF2 = saveFiche;
saveFiche = function() {
  // Récupérer les valeurs du formulaire
  const ref = document.getElementById('af-ref').value;
  const fiche = document.getElementById('af-fiche').value;
  const voie = document.getElementById('af-voie').value;
  const statut = document.getElementById('af-stat').value;
  const pk_debut = parseInt(document.getElementById('af-pkd').value) || null;
  const pk_fin = parseInt(document.getElementById('af-pkf').value) || null;
  const date = document.getElementById('af-date').value || null;
  const commentaire = document.getElementById('af-com').value || null;
  if (!ref || !fiche) { toast('Référence et fiche obligatoires', 'err'); return; }

  const f = { ref, fiche, voie, statut, pk_debut, pk_fin, date, commentaire, att: 0,
    pjs: JSON.parse(JSON.stringify(pendingPJs)) };

  if (editFicheIdx !== null) {
    // Garder l'historique existant
    const existing = CP.fiches[editFicheIdx];
    f.history = existing.history || [];
    // Détecter ce qui a changé
    const changes = [];
    if (existing.statut !== statut) changes.push(`Statut: ${existing.statut||'Att.'} → ${statut||'Att.'}`);
    if (existing.date !== date) changes.push(`Date: ${existing.date||'?'} → ${date||'?'}`);
    if ((existing.pjs||[]).length !== pendingPJs.length) changes.push(`PJ: ${(existing.pjs||[]).length} → ${pendingPJs.length}`);
    addHistoryEntry(f, 'edit', changes.length ? changes.join(' · ') : 'Fiche modifiée');
    CP.fiches[editFicheIdx] = f;
  } else {
    f.history = [];
    addHistoryEntry(f, 'create', `Créée · ${ref} · ${voie} · ${fmtPK(pk_debut)||'PK?'}`);
    CP.fiches.push(f);
  }

  closeM('m-fiche');
  if (document.getElementById('pg-fcq').classList.contains('active')) { renderFCQ(); renderFCQStats(); }
  else if (document.getElementById('pg-syn').classList.contains('active')) renderSyn();
  updBadges();
  toast((editFicheIdx !== null ? 'Fiche mise à jour' : 'Fiche enregistrée') + ' ', 'ok');
};
window.saveFiche = saveFiche;

// openAddFiche: PJ + historique intégrés nativement
window.openAddFiche = openAddFiche;

window.handlePJDrop = handlePJDrop;
window.handlePJInput = handlePJInput;
window.deletePJ = deletePJ;
window.downloadPJ = downloadPJ;
window.viewPJ = viewPJ;
window.viewFichePJs = viewFichePJs;
window.renderPJList = renderPJList


// ════════════════════════════════════════════════════════════════
// ── LAUNCH — Initialisation de l'application
// ════════════════════════════════════════════════════════════════
(function initApp() {
  // 1. Restaurer le thème sauvegardé
  try {
    const savedTheme = localStorage.getItem('railqual_v4_theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      specialTheme = savedTheme;
    } else {
      document.documentElement.setAttribute('data-theme', 'vercel');
    }
  } catch(e) {}

  // 2. Restaurer l'accent couleur
  try {
    const savedAccent = localStorage.getItem('railqual_v4_accent');
    if (savedAccent && typeof setAccent === 'function') setAccent(savedAccent);
  } catch(e) {}

  // 3. Afficher l'écran principal
  const sh = document.getElementById('sh');
  if (sh) { sh.style.display = 'flex'; sh.style.opacity = '1'; }

  // 4. Charger les données
  loadData();

  // 5. Rendre la page d'accueil
  renderHome();

  // 6. Patch showPage avec transition légère
  const _origShowPage = showPage;
  window._origShowPage = _origShowPage;
  window.showPage = function(page, el) {
    _origShowPage(page, el);
  };

  // 7. Vérifier onboarding
  try {
    const seen = localStorage.getItem('railqual_v4_seen');
    if (!seen && typeof startOnboarding === 'function') {
      setTimeout(startOnboarding, 500);
    }
  } catch(e) {}

  // 8. Service Worker
  if ('serviceWorker' in navigator) {
    try {
      const swCode = `self.addEventListener('fetch', e => e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
      ));`;
      const blob = new Blob([swCode], {type: 'application/javascript'});
      const swUrl = URL.createObjectURL(blob);
      navigator.serviceWorker.register(swUrl).catch(()=>{});
    } catch(e) {}
  }
})();
