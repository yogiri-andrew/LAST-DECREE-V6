/* =========================================================
   LAST DECREE V6
   CORE SYSTEM
   Fonctionne sans Firebase
========================================================= */

const STORAGE = {
    decrees: "LD_V6_DECREES",
    archives: "LD_V6_ARCHIVES",
    applications: "LD_V6_APPLICATIONS"
};

const defaultDecrees = [
    {
        id: "DEC-001",
        title: "Activation du Système",
        category: "SYSTEM",
        content: "Le système LAST DECREE V6 est officiellement opérationnel.",
        date: "2026-08-09",
        author: "SYSTEM"
    },
    {
        id: "DEC-002",
        title: "Protocole de l'Organisation",
        category: "DIRECTIVE",
        content: "Les archives, les rangs et les décisions doivent être maintenus dans un état organisé.",
        date: "2026-08-09",
        author: "LAST DECREE"
    }
];

const defaultArchives = [
    {
        id: "ARC-001",
        title: "Origine du LAST DECREE",
        type: "HISTORIQUE",
        content: "Archive initiale de l'organisation.",
        date: "2026-08-09"
    }
];

function getData(key, fallback = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch {
        return fallback;
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function initStorage() {
    if (!localStorage.getItem(STORAGE.decrees)) {
        saveData(STORAGE.decrees, defaultDecrees);
    }

    if (!localStorage.getItem(STORAGE.archives)) {
        saveData(STORAGE.archives, defaultArchives);
    }

    if (!localStorage.getItem(STORAGE.applications)) {
        saveData(STORAGE.applications, []);
    }
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function toggleMenu() {
    const nav = document.getElementById("mainNav");
    if (nav) nav.classList.toggle("open");
}

function notify(message) {
    let box = document.querySelector(".notification");

    if (!box) {
        box = document.createElement("div");
        box.className = "notification";
        document.body.appendChild(box);
    }

    box.textContent = message;
    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 3000);
}

/* ==============================
   BOOT SCREEN
============================== */

function bootSystem() {
    const boot = document.getElementById("bootScreen");
    const site = document.getElementById("site");
    const progress = document.getElementById("bootProgress");
    const status = document.getElementById("bootStatus");

    if (!boot || !site) return;

    let value = 0;

    const interval = setInterval(() => {

        value += Math.floor(Math.random() * 14) + 7;

        if (value >= 100) {
            value = 100;
            clearInterval(interval);

            status.textContent = "ACCÈS AUTORISÉ";

            setTimeout(() => {
                boot.style.opacity = "0";
                site.classList.add("loaded");

                setTimeout(() => {
                    boot.style.display = "none";
                }, 700);

            }, 400);
        }

        progress.style.width = value + "%";

        if (value < 30) {
            status.textContent = "CHARGEMENT DU NOYAU...";
        } else if (value < 60) {
            status.textContent = "VÉRIFICATION DES ARCHIVES...";
        } else if (value < 90) {
            status.textContent = "SYNCHRONISATION DU SYSTÈME...";
        } else {
            status.textContent = "FINALISATION...";
        }

    }, 100);
}

/* ==============================
   HOME
============================== */

function updateHomeStats() {

    const decreeCount = document.getElementById("decreeCount");
    const archiveCount = document.getElementById("archiveCount");

    if (decreeCount) {
        decreeCount.textContent =
            getData(STORAGE.decrees, defaultDecrees).length;
    }

    if (archiveCount) {
        archiveCount.textContent =
            getData(STORAGE.archives, defaultArchives).length;
    }
}

function terminalAnimation() {

    const terminal = document.getElementById("terminalText");

    if (!terminal) return;

    const lines = [
        "> Boot sequence complete.",
        "> Security layer: ACTIVE",
        "> Archive database: READY",
        "> Decree database: READY",
        "> Recruitment module: READY",
        "> Control center: READY",
        "> Firebase fallback: LOCAL MODE",
        "> LAST DECREE V6 is operational."
    ];

    let index = 0;

    function addLine() {
        if (index >= lines.length) return;

        const line = document.createElement("div");
        line.textContent = lines[index];

        terminal.appendChild(line);

        index++;

        setTimeout(addLine, 350);
    }

    addLine();
}

/* ==============================
   DÉCRETS
============================== */

function renderDecrees() {

    const container = document.getElementById("decreesList");

    if (!container) return;

    const decrees = getData(STORAGE.decrees, defaultDecrees);

    if (!decrees.length) {
        container.innerHTML =
            `<div class="empty">AUCUN DÉCRET ENREGISTRÉ.</div>`;
        return;
    }

    container.innerHTML = decrees.map(decree => `
        <article class="panel">
            <div class="panel-header">
                <div>
                    <div class="panel-title">
                        ${escapeHTML(decree.title)}
                    </div>
                    <div class="panel-meta">
                        ${escapeHTML(decree.id)}
                    </div>
                </div>

                <span class="badge">
                    ${escapeHTML(decree.category)}
                </span>
            </div>

            <p>${escapeHTML(decree.content)}</p>

            <div class="panel-meta" style="margin-top:20px">
                ${escapeHTML(decree.date)} // ${escapeHTML(decree.author)}
            </div>
        </article>
    `).join("");
}

/* ==============================
   ARCHIVES
============================== */

function renderArchives() {

    const container = document.getElementById("archivesList");

    if (!container) return;

    const archives = getData(STORAGE.archives, defaultArchives);

    if (!archives.length) {
        container.innerHTML =
            `<div class="empty">AUCUNE ARCHIVE DISPONIBLE.</div>`;
        return;
    }

    container.innerHTML = archives.map(archive => `
        <article class="panel">
            <div class="panel-header">
                <div>
                    <div class="panel-title">
                        ${escapeHTML(archive.title)}
                    </div>

                    <div class="panel-meta">
                        ${escapeHTML(archive.id)}
                    </div>
                </div>

                <span class="badge">
                    ${escapeHTML(archive.type)}
                </span>
            </div>

            <p>${escapeHTML(archive.content)}</p>

            <div class="panel-meta" style="margin-top:20px">
                ${escapeHTML(archive.date)}
            </div>
        </article>
    `).join("");
}

/* ==============================
   RECRUTEMENT
============================== */

function setupRecruitment() {

    const form = document.getElementById("recruitmentForm");

    if (!form) return;

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const formData = new FormData(form);

        const application = {
            id: "APP-" + Date.now(),
            name: formData.get("name"),
            codename: formData.get("codename"),
            rank: formData.get("rank"),
            motivation: formData.get("motivation"),
            date: new Date().toISOString()
        };

        const applications =
            getData(STORAGE.applications, []);

        applications.push(application);

        saveData(STORAGE.applications, applications);

        form.reset();

        notify("CANDIDATURE ENREGISTRÉE.");

    });
}

/* ==============================
   CONTROL CENTER
============================== */

function setupControlCenter() {

    const decreeForm = document.getElementById("decreeForm");

    if (decreeForm) {

        decreeForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const data = new FormData(decreeForm);

            const decrees =
                getData(STORAGE.decrees, defaultDecrees);

            const decree = {
                id: "DEC-" +
                    String(decrees.length + 1).padStart(3, "0"),

                title: data.get("title"),

                category: data.get("category"),

                content: data.get("content"),

                date: new Date().toISOString().split("T")[0],

                author: "CONTROL CENTER"
            };

            decrees.push(decree);

            saveData(STORAGE.decrees, decrees);

            decreeForm.reset();

            notify("DÉCRET PUBLIÉ.");

            renderDecrees();
        });
    }

    const archiveForm = document.getElementById("archiveForm");

    if (archiveForm) {

        archiveForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const data = new FormData(archiveForm);

            const archives =
                getData(STORAGE.archives, defaultArchives);

            const archive = {
                id: "ARC-" +
                    String(archives.length + 1).padStart(3, "0"),

                title: data.get("title"),

                type: data.get("type"),

                content: data.get("content"),

                date: new Date().toISOString().split("T")[0]
            };

            archives.push(archive);

            saveData(STORAGE.archives, archives);

            archiveForm.reset();

            notify("ARCHIVE AJOUTÉE.");

        });
    }

    const resetButton = document.getElementById("resetSystem");

    if (resetButton) {

        resetButton.addEventListener("click", function() {

            const confirmation =
                confirm(
                    "Réinitialiser toutes les données locales du système ?"
                );

            if (!confirmation) return;

            localStorage.removeItem(STORAGE.decrees);
            localStorage.removeItem(STORAGE.archives);
            localStorage.removeItem(STORAGE.applications);

            initStorage();

            notify("SYSTÈME RÉINITIALISÉ.");

            setTimeout(() => {
                location.reload();
            }, 800);
        });
    }

    updateApplicationCount();
}

function updateApplicationCount() {

    const element =
        document.getElementById("applicationCount");

    if (!element) return;

    const applications =
        getData(STORAGE.applications, []);

    element.textContent = applications.length;
}

/* ==============================
   RANKS
============================== */

function renderRanks() {

    const container =
        document.getElementById("rankList");

    if (!container) return;

    const ranks = [
        ["XI", "Observateur", "Accès initial au système."],
        ["X", "Archiviste", "Gestion des informations et archives."],
        ["IX", "Veilleur", "Surveillance et observation."],
        ["VIII", "Exécuteur", "Application des directives."],
        ["VII", "Gardien", "Protection des systèmes."],
        ["VI", "Émissaire", "Représentation de l'organisation."],
        ["V", "Ombre", "Opérations discrètes."],
        ["IV", "Main du Décret", "Autorité supérieure."],
        ["III", "Héritier", "Autorité stratégique."],
        ["II", "Last Witness", "Témoin suprême."],
        ["I", "Le Sans Nom", "Niveau d'autorité exceptionnel."],
        ["LD", "The Last Decree", "Autorité centrale."]
    ];

    container.innerHTML = ranks.map(rank => `
        <div class="rank">
            <div class="rank-number">${rank[0]}</div>

            <div>
                <div class="rank-name">${rank[1]}</div>
                <div class="rank-description">${rank[2]}</div>
            </div>

            <span class="badge">CLASSIFIED</span>
        </div>
    `).join("");
}

/* ==============================
   CLOCK
============================== */

function systemClock() {

    const clock =
        document.getElementById("systemClock");

    if (!clock) return;

    function update() {

        const now = new Date();

        clock.textContent =
            now.toLocaleTimeString("fr-FR");
    }

    update();

    setInterval(update, 1000);
}

/* ==============================
   INIT
============================== */

document.addEventListener("DOMContentLoaded", () => {

    initStorage();

    bootSystem();

    updateHomeStats();

    terminalAnimation();

    renderDecrees();

    renderArchives();

    renderRanks();

    setupRecruitment();

    setupControlCenter();

    systemClock();

});
