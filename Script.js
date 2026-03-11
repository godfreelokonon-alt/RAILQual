/* ═══════════════════════════════════════════════════════════════
   RAILQUAL v4.0 — MOTEUR DE LOGIQUE (CORE)
   Gestion des données locales, navigation et rendu dynamique
   ═══════════════════════════════════════════════════════════════ */

// 1. VARIABLES GLOBALES & ÉTAT
let projects = [];
let currentProject = null;
let specialTheme = 'vercel';
let userAccent = '#F59E0B';

// 2. BASE DE DONNÉES DES LIGNES (BIBLIOTHÈQUE)
const LIB = {
  lines: {
    'M1': { c: '#FFBE00', t: '#000', n: 'Ligne 1' },
    'M2': { c: '#003CA6', t: '#fff', n: 'Ligne 2' },
    'M3': { c: '#837902', t: '#fff', n: 'Ligne 3' },
    'M4': { c: '#CF009E', t: '#fff', n: 'Ligne 4' },
    'M5': { c: '#FF7E2E', t: '#000', n: 'Ligne 5' },
    'M6': { c: '#6ECA97', t: '#000', n: 'Ligne 6' },
    'M7': { c: '#FA9ABA', t: '#000', n: 'Ligne 7' },
    'M8': { c: '#CEADD2', t: '#000', n: 'Ligne 8' },
    'M9': { c: '#D5C900', t: '#000', n: 'Ligne 9' },
    'M10': { c: '#E3B32A', t: '#000', n: 'Ligne 10' },
    'M11': { c: '#8D5E2A', t: '#fff', n: 'Ligne 11' },
    'M12': { c: '#00814F', t: '#fff', n: 'Ligne 12' },
    'M13': { c: '#98D4E2', t: '#000', n: 'Ligne 13' },
    'M14': { c: '#662483', t: '#fff', n: 'Ligne 14' },
    'RERA': { c: '#E2231A', t: '#fff', n: 'RER A' },
    'RERB': { c: '#5191CD', t: '#fff', n: 'RER B' }
  }
};

// 3. CHARGEMENT DES DONNÉES (LocalStorage)
function loadData() {
  try {
    const saved = localStorage.getItem('railqual_v4_data');
    if (saved) {
      projects = JSON.parse(saved);
    } else {
      // Données de démo si vide
      projects = [
        { id: 'p1', name: 'Renouvellement L11', line: 'M11', zone: 'Zone 4', pk: '17.987', status: 'En cours', joints: [] }
      ];
    }
  } catch (e) {
    console.error("Erreur de chargement:", e);
    projects = [];
  }
}

function saveData() {
  localStorage.setItem('railqual_v4_data', JSON.stringify(projects));
}

// 4. NAVIGATION (Changement de pages)
function showPage(pageId, element = null) {
  // Masquer toutes les sections
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  
  // Afficher la section demandée
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Mise à jour du menu latéral
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
  if (element) element.classList.add('active');
}
// 5. RENDU DE LA PAGE D'ACCUEIL (GRILLE DES PROJETS)
function renderHome() {
  const grid = document.getElementById('proj-grid');
  if (!grid) return;

  grid.innerHTML = ''; // On vide pour reconstruire

  if (projects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--t3); border: 2px dashed var(--ln); border-radius: var(--r4);">
        <i class="fa-solid fa-folder-open" style="font-size: 40px; margin-bottom: 16px;"></i>
        <p>Aucun projet actif. Commencez par en créer un.</p>
      </div>`;
    return;
  }

  projects.forEach((p, idx) => {
    const lineData = LIB.lines[p.line] || { c: '#ccc', t: '#000', n: p.line };
    
    const card = document.createElement('div');
    card.className = 'proj-card animate-fade';
    card.style.animationDelay = (idx * 0.05) + 's';
    card.onclick = () => openProject(p.id);

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="proj-icon" style="background:${lineData.c}; color:${lineData.t}">
          ${p.line}
        </div>
        <span class="badge ${p.status === 'Terminé' ? 'badge-ok' : 'badge-wt'}">${p.status}</span>
      </div>
      <div>
        <h3 style="margin:0; font-size:16px; font-weight:700;">${p.name}</h3>
        <p style="margin:4px 0 0; font-size:12px; color:var(--t2); font-family:var(--fm);">
          ${p.zone} • PK ${p.pk}
        </p>
      </div>
      <div style="margin-top:auto; padding-top:12px; border-top:1px solid var(--ln); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:11px; color:var(--t3); font-weight:600;">${p.joints ? p.joints.length : 0} JOINTS</span>
        <i class="fa-solid fa-chevron-right" style="font-size:10px; color:var(--t4);"></i>
      </div>
    `;
    grid.appendChild(card);
  });
}

// 6. GESTION DES MODALES (FENÊTRES SURGISSANTES)
function showM(id) {
  const m = document.getElementById('m-' + id);
  if (m) m.classList.add('active');
}

function closeM(id) {
  const m = document.getElementById('m-' + id);
  if (m) m.classList.remove('active');
}

// 7. CRÉATION D'UN NOUVEAU PROJET
function createProject() {
  const name = document.getElementById('np-name').value;
  const line = document.getElementById('np-line').value;
  const zone = document.getElementById('np-zone').value;
  const pk = document.getElementById('np-pk').value;

  if (!name) { alert("Nom du projet requis"); return; }

  const newP = {
    id: 'p' + Date.now(),
    name: name,
    line: line,
    zone: zone,
    pk: pk,
    status: 'En cours',
    joints: [],
    created: new Date().toISOString()
  };

  projects.unshift(newP); // Ajouter au début
  saveData();
  renderHome();
  closeM('np');
  
  // Reset formulaire
  document.getElementById('np-name').value = '';
}
// 8. GESTION DES JOINTS (JIC / JM)
function openProject(id) {
  currentProject = projects.find(p => p.id === id);
  if (!currentProject) return;

  // Mise à jour de l'interface du projet
  const lineData = LIB.lines[currentProject.line] || { c: '#ccc', t: '#000' };
  const header = document.getElementById('project-detail-header');
  if(header) {
      header.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="proj-icon" style="background:${lineData.c}; color:${lineData.t}">${currentProject.line}</div>
            <div>
                <h2 style="margin:0; font-size:24px; font-weight:800;">${currentProject.name}</h2>
                <p style="margin:0; font-size:13px; color:var(--t3);">${currentProject.zone} • PK ${currentProject.pk}</p>
            </div>
        </div>
      `;
  }

  renderJoints();
  showPage('project-detail');
}

function renderJoints() {
  const container = document.getElementById('joints-list');
  if (!container || !currentProject) return;

  container.innerHTML = '';

  if (!currentProject.joints || currentProject.joints.length === 0) {
    container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--t3);">Aucun joint enregistré pour ce projet.</div>`;
    return;
  }

  currentProject.joints.forEach((j, idx) => {
    const card = document.createElement('div');
    card.className = 'proj-card animate-fade';
    
    // Alerte spécifique (ex: JIC à shunter)
    let alertHtml = '';
    if (j.type === 'JIC' && j.status === 'A shunter') {
        alertHtml = `
            <div style="background:var(--wt-bg); border:1px solid var(--wt-bd); color:var(--wt); padding:8px; border-radius:var(--r2); font-size:11px; font-weight:700; margin-top:10px;">
                <i class="fa-solid fa-triangle-exclamation"></i> JIC À SHUNTER (Attente Phase 2)
            </div>
        `;
    }

    card.innerHTML = `
      <div class="flex justify-between items-start">
        <span class="badge ${j.type === 'JIC' ? 'badge-ok' : 'badge-nc'}" style="background:rgba(0,0,0,0.05); color:var(--t2); border:none;">
            ${j.type}
        </span>
        <span style="font-size:10px; color:var(--t3); font-weight:700;">#${idx + 1}</span>
      </div>
      <h3 style="margin:8px 0; font-size:18px; font-weight:800; font-family:var(--fm);">${j.id_joint}</h3>
      <div style="font-size:12px; color:var(--t2); display:flex; flex-direction:column; gap:4px;">
        <div class="flex justify-between"><span>VOIE / PK</span> <b>${j.voie} / ${j.pk}</b></div>
        <div class="flex justify-between"><span>PHASE</span> <b>${j.phase || '1'}</b></div>
      </div>
      ${alertHtml}
    `;
    container.appendChild(card);
  });
}

function addJoint() {
    if (!currentProject) return;
    
    const idJ = document.getElementById('j-id').value;
    const typeJ = document.getElementById('j-type').value;
    const voieJ = document.getElementById('j-voie').value;
    const pkJ = document.getElementById('j-pk').value;

    if (!idJ) { alert("ID du joint requis"); return; }

    const newJoint = {
        id_joint: idJ,
        type: typeJ,
        voie: voieJ,
        pk: pkJ,
        status: 'Installé',
        phase: '1'
    };

    if (!currentProject.joints) currentProject.joints = [];
    currentProject.joints.push(newJoint);
    
    saveData();
    renderJoints();
    closeM('add-joint');
}
// 9. GESTION DES THÈMES ET PERSONNALISATION
function setTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('railqual_v4_theme', themeId);
  specialTheme = themeId;
}

function setAccent(color) {
  document.documentElement.style.setProperty('--accent', color);
  localStorage.setItem('railqual_v4_accent', color);
  userAccent = color;
}

// 10. RECHERCHE ET FILTRES
function filterProjects() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.line.toLowerCase().includes(query)
  );
  // Ici on pourrait appeler une version modifiée de renderHome(filtered)
}

// 11. INITIALISATION AU CHARGEMENT (LE RÉVEIL)
window.onload = function() {
  console.log("RailQual v4 : Initialisation...");

  // 1. Restaurer le thème sauvé
  try {
    const savedTheme = localStorage.getItem('railqual_v4_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('vercel'); // Thème par défaut
    }
  } catch(e) { console.error("Erreur thème:", e); }

  // 2. Restaurer l'accent
  try {
    const savedAccent = localStorage.getItem('railqual_v4_accent');
    if (savedAccent) setAccent(savedAccent);
  } catch(e) { console.error("Erreur accent:", e); }

  // 3. Charger les données du LocalStorage
  loadData();

  // 4. Afficher la page d'accueil
  renderHome();

  // 5. Animation d'entrée
  const sh = document.getElementById('sh');
  if (sh) {
    sh.style.display = 'flex';
    setTimeout(() => sh.style.opacity = '1', 50);
  }
};

// 12. FONCTION DE SUPPRESSION (SÉCURITÉ)
function deleteProject(id) {
    if(confirm("Voulez-vous vraiment supprimer ce projet ?")) {
        projects = projects.filter(p => p.id !== id);
        saveData();
        renderHome();
        showPage('home');
    }
}