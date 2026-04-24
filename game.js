import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const speedEl = document.querySelector("#speed");
const brakePowerEl = document.querySelector("#brakePower");
const coinsEl = document.querySelector("#coins");
const shieldStatusEl = document.querySelector("#shieldStatus");
const personalBestEl = document.querySelector("#personalBest");
const playerNameInput = document.querySelector("#playerName");
const savePlayerButton = document.querySelector("#savePlayer");
const leaderboardEl = document.querySelector("#leaderboard");
const mobileLeaderboardEl = document.querySelector("#mobileLeaderboard");
const mobileScoresButton = document.querySelector("#mobileScoresButton");
const mobileScoresModal = document.querySelector("#mobileScoresModal");
const closeScoresButton = document.querySelector("#closeScores");
const restartButton = document.querySelector("#restart");
const leftButton = document.querySelector("#left");
const rightButton = document.querySelector("#right");
const brakeButton = document.querySelector("#brake");
const languageSelect = document.querySelector("#languageSelect");
const authPanel = document.querySelector("#authPanel");
const authEmailInput = document.querySelector("#authEmail");
const authPasswordInput = document.querySelector("#authPassword");
const togglePasswordButton = document.querySelector("#togglePasswordButton");
const signInButton = document.querySelector("#signInButton");
const signUpButton = document.querySelector("#signUpButton");
const signOutButton = document.querySelector("#signOutButton");
const authStatusEl = document.querySelector("#authStatus");
const playerPanel = document.querySelector("#playerPanel");
const hudPanel = document.querySelector("#hudPanel");
const controlsPanel = document.querySelector("#controlsPanel");
const leaderboardPanel = document.querySelector("#leaderboardPanel");
const mobileScoresSheet = document.querySelector("#mobileScoresSheet");

const road = {
  x: 92,
  y: 0,
  width: 296,
  height: canvas.height,
  stripeOffset: 0,
};

const keys = new Set();
const lanes = [142, 240, 338];
const scenery = Array.from({ length: 18 }, (_, index) => createSceneryItem(index));
const STORAGE_KEY = "ofek-race-scores";
const PLAYER_KEY = "ofek-race-player";
const LANGUAGE_KEY = "ofek-race-language";
const DB_NAME = "ofek-race-save";
const DB_STORE = "game";
const BASE_SPEED = 280;
const SPEED_STEP = 55;
const POINTS_PER_SPEED_UP = 100;
const API_SAVE_URL = location.protocol === "file:" ? "http://127.0.0.1:4173/api/save" : "/api/save";
const MAX_BRAKE_POWER = 100;
const BRAKE_DRAIN_PER_SECOND = 36;
const BRAKE_RECHARGE_PER_SECOND = 14;
const COIN_POINTS = 25;
const SHIELD_MIN_DELAY = 7;
const SHIELD_RANDOM_DELAY = 7;
const CLOCK_MIN_DELAY = 7;
const CLOCK_RANDOM_DELAY = 7;
const SLOW_MOTION_DURATION = 5;
const SLOW_MOTION_FACTOR = 0.62;
const TRAFFIC_ENTRY_ZONE = 260;
const TRAFFIC_LANE_SAFE_GAP = 320;
const SUPABASE_URL = "https://amrgkiicmvaamloutomd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bNXZ4iycEszTBEcDhjzt1A_nEzd7I3F";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
const translations = {
  en: {
    title: "speed car",
    dir: "ltr",
    lang: "en",
    playerPanel: "Player and best score",
    player: "Player",
    playerPlaceholder: "Your name",
    save: "Save",
    myBest: "My Best",
    language: "Language",
    hud: "Score board",
    score: "Score",
    speed: "Speed",
    brake: "Brake",
    coins: "Coins",
    shield: "Shield",
    shieldOn: "On",
    shieldOff: "None",
    newGame: "New Game",
    canvas: "Racing game",
    controls: "Game controls",
    left: "Left",
    right: "Right",
    leaderboardPanel: "Leaderboard",
    leaderboard: "Leaderboard",
    scoresButton: "Scores",
    mobileScores: "Leaderboard on phone",
    close: "Close",
    noScores: "No scores yet",
    slowMotion: "Slow",
    dragTip: "Drag your finger to move",
    boom: "Boom!",
    finalScore: "Score",
    newBest: "New Best!",
    pressNewGame: "Tap New Game",
    defaultPlayer: "Player",
    authPanel: "Account",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signUp: "Create User",
    signOut: "Sign Out",
    showPassword: "Show",
    hidePassword: "Hide",
    authSignedOut: "Not signed in",
    authSignedIn: "Signed in as",
    authCheckEmail: "Check your email to finish sign up",
    authUsernameSaved: "Username saved",
    authNeedUsername: "Write a username first",
    authNeedEmail: "Write an email first",
    authNeedPassword: "Write a password first",
    authLoading: "Connecting...",
    authRemoteReady: "Shared leaderboard is on",
    authSharedError: "Shared leaderboard is not ready yet",
    authUsernameLocked: "Account name is locked while signed in",
  },
  he: {
    title: "speed car",
    dir: "rtl",
    lang: "he",
    playerPanel: "שחקן ושיא אישי",
    player: "שחקן",
    playerPlaceholder: "השם שלך",
    save: "שמור",
    myBest: "השיא שלי",
    language: "שפה",
    hud: "לוח ניקוד",
    score: "נקודות",
    speed: "מהירות",
    brake: "בלם",
    coins: "מטבעות",
    shield: "מגן",
    shieldOn: "פעיל",
    shieldOff: "אין",
    newGame: "משחק חדש",
    canvas: "משחק מרוצים",
    controls: "כפתורי משחק",
    left: "שמאלה",
    right: "ימינה",
    leaderboardPanel: "לוח שיאים",
    leaderboard: "לוח שיאים",
    scoresButton: "שיאים",
    mobileScores: "לוח שיאים בטלפון",
    close: "סגור",
    noScores: "אין שיאים עדיין",
    slowMotion: "האטה",
    dragTip: "גרור עם האצבע כדי לזוז",
    boom: "בום!",
    finalScore: "ניקוד",
    newBest: "שיא חדש!",
    pressNewGame: "לחץ משחק חדש",
    defaultPlayer: "אופק",
    authPanel: "חשבון",
    email: "אימייל",
    password: "סיסמה",
    signIn: "התחבר",
    signUp: "צור משתמש",
    signOut: "התנתק",
    showPassword: "הצג",
    hidePassword: "הסתר",
    authSignedOut: "לא מחובר",
    authSignedIn: "מחובר בתור",
    authCheckEmail: "בדוק את האימייל כדי לסיים הרשמה",
    authUsernameSaved: "שם המשתמש נשמר",
    authNeedUsername: "כתוב קודם שם משתמש",
    authNeedEmail: "כתוב קודם אימייל",
    authNeedPassword: "כתוב קודם סיסמה",
    authLoading: "מתחבר...",
    authRemoteReady: "לוח השיאים המשותף פעיל",
    authSharedError: "לוח השיאים המשותף עוד לא מוכן",
    authUsernameLocked: "שם החשבון קבוע בזמן שמחוברים",
  },
  ar: {
    title: "speed car",
    dir: "rtl",
    lang: "ar",
    playerPanel: "اللاعب وأفضل نتيجة",
    player: "اللاعب",
    playerPlaceholder: "اسمك",
    save: "حفظ",
    myBest: "أفضل نتيجة",
    language: "اللغة",
    hud: "لوحة النقاط",
    score: "النقاط",
    speed: "السرعة",
    brake: "الفرامل",
    coins: "العملات",
    shield: "الدرع",
    shieldOn: "نشط",
    shieldOff: "لا يوجد",
    newGame: "لعبة جديدة",
    canvas: "لعبة سباق",
    controls: "أزرار اللعب",
    left: "يسار",
    right: "يمين",
    leaderboardPanel: "لوحة الأبطال",
    leaderboard: "لوحة الأبطال",
    scoresButton: "النتائج",
    mobileScores: "لوحة الأبطال في الهاتف",
    close: "إغلاق",
    noScores: "لا توجد نتائج بعد",
    slowMotion: "إبطاء",
    dragTip: "اسحب بإصبعك للتحرك",
    boom: "بووم!",
    finalScore: "النتيجة",
    newBest: "أفضل نتيجة جديدة!",
    pressNewGame: "اضغط لعبة جديدة",
    defaultPlayer: "لاعب",
  },
  es: {
    title: "speed car",
    dir: "ltr",
    lang: "es",
    playerPanel: "Jugador y mejor puntaje",
    player: "Jugador",
    playerPlaceholder: "Tu nombre",
    save: "Guardar",
    myBest: "Mi récord",
    language: "Idioma",
    hud: "Marcador",
    score: "Puntos",
    speed: "Velocidad",
    brake: "Freno",
    coins: "Monedas",
    shield: "Escudo",
    shieldOn: "Activo",
    shieldOff: "Ninguno",
    newGame: "Nuevo juego",
    canvas: "Juego de carreras",
    controls: "Controles",
    left: "Izquierda",
    right: "Derecha",
    leaderboardPanel: "Clasificación",
    leaderboard: "Clasificación",
    scoresButton: "Puntajes",
    mobileScores: "Clasificación en el teléfono",
    close: "Cerrar",
    noScores: "Todavía no hay puntajes",
    slowMotion: "Lento",
    dragTip: "Arrastra tu dedo para moverte",
    boom: "¡Boom!",
    finalScore: "Puntos",
    newBest: "¡Nuevo récord!",
    pressNewGame: "Toca Nuevo juego",
    defaultPlayer: "Jugador",
  },
  ja: {
    title: "speed car",
    dir: "ltr",
    lang: "ja",
    playerPanel: "プレイヤーとベストスコア",
    player: "プレイヤー",
    playerPlaceholder: "名前",
    save: "保存",
    myBest: "自己ベスト",
    language: "言語",
    hud: "スコアボード",
    score: "スコア",
    speed: "スピード",
    brake: "ブレーキ",
    coins: "コイン",
    shield: "シールド",
    shieldOn: "オン",
    shieldOff: "なし",
    newGame: "新しいゲーム",
    canvas: "レースゲーム",
    controls: "操作",
    left: "左",
    right: "右",
    leaderboardPanel: "ランキング",
    leaderboard: "ランキング",
    scoresButton: "スコア",
    mobileScores: "スマホのランキング",
    close: "閉じる",
    noScores: "まだスコアがありません",
    slowMotion: "スロー",
    dragTip: "指でドラッグして動かす",
    boom: "ドカン!",
    finalScore: "スコア",
    newBest: "新記録!",
    pressNewGame: "新しいゲームをタップ",
    defaultPlayer: "プレイヤー",
  },
  fr: {
    title: "speed car",
    dir: "ltr",
    lang: "fr",
    playerPanel: "Joueur et meilleur score",
    player: "Joueur",
    playerPlaceholder: "Ton nom",
    save: "Enregistrer",
    myBest: "Mon record",
    language: "Langue",
    hud: "Tableau des scores",
    score: "Score",
    speed: "Vitesse",
    brake: "Frein",
    coins: "Pièces",
    shield: "Bouclier",
    shieldOn: "Actif",
    shieldOff: "Aucun",
    newGame: "Nouveau jeu",
    canvas: "Jeu de course",
    controls: "Commandes",
    left: "Gauche",
    right: "Droite",
    leaderboardPanel: "Classement",
    leaderboard: "Classement",
    scoresButton: "Scores",
    mobileScores: "Classement sur téléphone",
    close: "Fermer",
    noScores: "Pas encore de scores",
    slowMotion: "Ralenti",
    dragTip: "Glisse ton doigt pour bouger",
    boom: "Boum!",
    finalScore: "Score",
    newBest: "Nouveau record!",
    pressNewGame: "Touchez Nouveau jeu",
    defaultPlayer: "Joueur",
  },
  de: {
    title: "speed car",
    dir: "ltr",
    lang: "de",
    playerPanel: "Spieler und Bestwert",
    player: "Spieler",
    playerPlaceholder: "Dein Name",
    save: "Speichern",
    myBest: "Mein Rekord",
    language: "Sprache",
    hud: "Punktetafel",
    score: "Punkte",
    speed: "Tempo",
    brake: "Bremse",
    coins: "Münzen",
    shield: "Schild",
    shieldOn: "Aktiv",
    shieldOff: "Keins",
    newGame: "Neues Spiel",
    canvas: "Rennspiel",
    controls: "Steuerung",
    left: "Links",
    right: "Rechts",
    leaderboardPanel: "Bestenliste",
    leaderboard: "Bestenliste",
    scoresButton: "Punkte",
    mobileScores: "Bestenliste auf dem Handy",
    close: "Schließen",
    noScores: "Noch keine Punkte",
    slowMotion: "Langsam",
    dragTip: "Zieh mit dem Finger zum Lenken",
    boom: "Boom!",
    finalScore: "Punkte",
    newBest: "Neuer Rekord!",
    pressNewGame: "Tippe Neues Spiel",
    defaultPlayer: "Spieler",
  },
  pt: {
    title: "speed car",
    dir: "ltr",
    lang: "pt",
    playerPanel: "Jogador e melhor pontuação",
    player: "Jogador",
    playerPlaceholder: "Seu nome",
    save: "Salvar",
    myBest: "Meu recorde",
    language: "Idioma",
    hud: "Placar",
    score: "Pontos",
    speed: "Velocidade",
    brake: "Freio",
    coins: "Moedas",
    shield: "Escudo",
    shieldOn: "Ativo",
    shieldOff: "Nenhum",
    newGame: "Novo jogo",
    canvas: "Jogo de corrida",
    controls: "Controles",
    left: "Esquerda",
    right: "Direita",
    leaderboardPanel: "Ranking",
    leaderboard: "Ranking",
    scoresButton: "Pontos",
    mobileScores: "Ranking no telefone",
    close: "Fechar",
    noScores: "Ainda não há pontuações",
    slowMotion: "Lento",
    dragTip: "Arraste o dedo para mover",
    boom: "Boom!",
    finalScore: "Pontos",
    newBest: "Novo recorde!",
    pressNewGame: "Toque em Novo jogo",
    defaultPlayer: "Jogador",
  },
  zh: {
    title: "speed car",
    dir: "ltr",
    lang: "zh",
    playerPanel: "玩家和最佳分数",
    player: "玩家",
    playerPlaceholder: "你的名字",
    save: "保存",
    myBest: "我的最佳",
    language: "语言",
    hud: "记分板",
    score: "分数",
    speed: "速度",
    brake: "刹车",
    coins: "金币",
    shield: "护盾",
    shieldOn: "开启",
    shieldOff: "没有",
    newGame: "新游戏",
    canvas: "赛车游戏",
    controls: "控制",
    left: "左",
    right: "右",
    leaderboardPanel: "排行榜",
    leaderboard: "排行榜",
    scoresButton: "分数",
    mobileScores: "手机排行榜",
    close: "关闭",
    noScores: "还没有分数",
    slowMotion: "减速",
    dragTip: "拖动手指来移动",
    boom: "砰!",
    finalScore: "分数",
    newBest: "新纪录!",
    pressNewGame: "点击新游戏",
    defaultPlayer: "玩家",
  },
  ru: {
    title: "speed car",
    dir: "ltr",
    lang: "ru",
    playerPanel: "Игрок и лучший счет",
    player: "Игрок",
    playerPlaceholder: "Твое имя",
    save: "Сохранить",
    myBest: "Мой рекорд",
    language: "Язык",
    hud: "Табло",
    score: "Очки",
    speed: "Скорость",
    brake: "Тормоз",
    coins: "Монеты",
    shield: "Щит",
    shieldOn: "Активен",
    shieldOff: "Нет",
    newGame: "Новая игра",
    canvas: "Гоночная игра",
    controls: "Управление",
    left: "Влево",
    right: "Вправо",
    leaderboardPanel: "Таблица лидеров",
    leaderboard: "Таблица лидеров",
    scoresButton: "Рекорды",
    mobileScores: "Таблица лидеров на телефоне",
    close: "Закрыть",
    noScores: "Пока нет рекордов",
    slowMotion: "Замедление",
    dragTip: "Проведи пальцем, чтобы двигаться",
    boom: "Бум!",
    finalScore: "Очки",
    newBest: "Новый рекорд!",
    pressNewGame: "Нажми Новая игра",
    defaultPlayer: "Игрок",
  },
};

let player;
let traffic;
let coins;
let shields;
let clocks;
let sparks;
let skidMarks;
let score;
let speed;
let gameOver;
let lastTime;
let spawnTimer;
let coinTimer;
let shieldTimer;
let clockTimer;
let shake;
let animationFrameId;
let currentPlayer;
let highScores;
let newBestThisRun;
let bestAtStart;
let brakePower;
let coinsCollected;
let shieldActive;
let slowMotionTimer;
let touchSteeringActive = false;
let touchBrakeActive = false;
let serverSaveAvailable = true;
let currentLanguage = "en";
let authUser = null;
let remoteReady = true;
let authSyncPromise = Promise.resolve();

function t(key) {
  return translations[currentLanguage][key] ?? translations.en[key] ?? key;
}

function getAuthRedirectUrl() {
  if (location.protocol === "http:" || location.protocol === "https:") {
    return location.origin;
  }

  return "http://127.0.0.1:4173";
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function setAuthStatus(message, tone = "") {
  authStatusEl.textContent = message;
  authStatusEl.classList.toggle("is-error", tone === "error");
  authStatusEl.classList.toggle("is-success", tone === "success");
}

function updatePlayLayout() {
  document.body.classList.toggle("playing", !gameOver);
}

function updatePlayerLockState() {
  const locked = !!authUser;
  playerNameInput.readOnly = locked;
  playerNameInput.classList.toggle("is-locked", locked);
  savePlayerButton.hidden = locked;
}

async function syncAuthSession(session, fallbackName = "") {
  authUser = session?.user || null;
  document.body.classList.toggle("signed-in", !!authUser);
  signOutButton.hidden = !authUser;
  updatePlayerLockState();

  if (authUser) {
    authEmailInput.value = authUser.email || authEmailInput.value;
    authPasswordInput.value = "";
    await ensureRemoteProfile(fallbackName || playerNameInput.value);
    await loadRemoteLeaderboard();
    setAuthStatus(`${t("authSignedIn")} ${currentPlayer}`, "success");
    return;
  }

  await loadRemoteLeaderboard();
  setAuthStatus(remoteReady ? t("authSignedOut") : t("authSharedError"), remoteReady ? "" : "error");
}

function queueAuthSync(session, fallbackName = "") {
  authSyncPromise = authSyncPromise
    .catch(() => {})
    .then(() => syncAuthSession(session, fallbackName))
    .catch((error) => {
      setAuthStatus(error.message || String(error), "error");
    });

  return authSyncPromise;
}

function openSaveDb() {
  return new Promise((resolve) => {
    if (!("indexedDB" in window)) {
      resolve(null);
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(DB_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

async function loadIndexedSave() {
  const db = await openSaveDb();
  if (!db) return null;

  return new Promise((resolve) => {
    const transaction = db.transaction(DB_STORE, "readonly");
    const request = transaction.objectStore(DB_STORE).get("save");
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function saveIndexedSave() {
  const db = await openSaveDb();
  if (!db) return;

  const transaction = db.transaction(DB_STORE, "readwrite");
  transaction.objectStore(DB_STORE).put(
    {
      highScores,
      currentPlayer: currentPlayer || cleanPlayerName(playerNameInput.value),
      savedAt: new Date().toISOString(),
    },
    "save"
  );
  transaction.oncomplete = () => db.close();
  transaction.onerror = () => db.close();
}

function mergeHighScores(savedScores) {
  if (!savedScores || typeof savedScores !== "object") return;

  Object.entries(savedScores).forEach(([name, points]) => {
    const cleanName = cleanPlayerName(name);
    const cleanPoints = Number(points) || 0;
    highScores[cleanName] = Math.max(highScores[cleanName] || 0, cleanPoints);
  });
}

async function loadServerSave() {
  if (!serverSaveAvailable) return null;

  try {
    const response = await fetch(API_SAVE_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Save API unavailable");
    return response.json();
  } catch {
    serverSaveAvailable = false;
    return null;
  }
}

async function saveServerSave() {
  if (!serverSaveAvailable) return;

  try {
    const response = await fetch(API_SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        highScores,
        currentPlayer: currentPlayer || cleanPlayerName(playerNameInput.value),
      }),
      keepalive: true,
    });

    if (!response.ok) throw new Error("Save API unavailable");
  } catch {
    serverSaveAvailable = false;
  }
}

function loadHighScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveHighScores() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(highScores));
    localStorage.setItem(`${STORAGE_KEY}-saved-at`, new Date().toISOString());
  } catch {
    // The game still works if the browser blocks local saving.
  }
  saveIndexedSave();
  saveServerSave();
}

function saveGameData() {
  saveHighScores();
  try {
    localStorage.setItem(PLAYER_KEY, currentPlayer || cleanPlayerName(playerNameInput.value));
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  } catch {
    // The game still works if the browser blocks local saving.
  }
}

function cleanPlayerName(name) {
  return name.trim().replace(/\s+/g, " ").slice(0, 14) || t("defaultPlayer");
}

function updatePersonalBest() {
  if (!highScores || !currentPlayer) return;
  personalBestEl.textContent = (highScores[currentPlayer] || 0).toString();
}

function updateLeaderboard() {
  if (!highScores) return;
  const leaders = Object.entries(highScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  leaderboardEl.replaceChildren();
  mobileLeaderboardEl.replaceChildren();

  if (leaders.length === 0) {
    const empty = document.createElement("li");
    empty.innerHTML = `<span class="name">${t("noScores")}</span><span class="points">0</span>`;
    leaderboardEl.append(empty);
    mobileLeaderboardEl.append(empty.cloneNode(true));
    return;
  }

  leaders.forEach(([name, points], index) => {
    const item = document.createElement("li");
    const playerSpan = document.createElement("span");
    const scoreSpan = document.createElement("span");
    playerSpan.className = "name";
    scoreSpan.className = "points";
    playerSpan.textContent = `${index + 1}. ${name}`;
    scoreSpan.textContent = points.toString();
    item.append(playerSpan, scoreSpan);
    leaderboardEl.append(item);

    const mobileItem = document.createElement("li");
    const mobilePlayer = document.createElement("span");
    const mobileScore = document.createElement("span");
    mobilePlayer.className = "name";
    mobileScore.className = "points";
    mobilePlayer.textContent = `${index + 1}. ${name}`;
    mobileScore.textContent = points.toString();
    mobileItem.append(mobilePlayer, mobileScore);
    mobileLeaderboardEl.append(mobileItem);
  });
}

function setCurrentPlayer(name, shouldSave = true) {
  currentPlayer = cleanPlayerName(name);
  playerNameInput.value = currentPlayer;
  if (shouldSave) saveGameData();
  updatePersonalBest();
  updateLeaderboard();
}

function getSavedPlayerName() {
  try {
    return localStorage.getItem(PLAYER_KEY) || t("defaultPlayer");
  } catch {
    return t("defaultPlayer");
  }
}

function getSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    return savedLanguage && translations[savedLanguage] ? savedLanguage : "en";
  } catch {
    return "en";
  }
}

async function loadRemoteLeaderboard() {
  if (!remoteReady) return;

  const { data, error } = await supabase
    .from("player_profiles")
    .select("username,best_score")
    .order("best_score", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error) {
    remoteReady = false;
    setAuthStatus(t("authSharedError"), "error");
    return;
  }

  const mergedScores = { ...(highScores || {}) };
  data.forEach((entry) => {
    const name = cleanPlayerName(entry.username || "");
    mergedScores[name] = Math.max(mergedScores[name] || 0, Number(entry.best_score) || 0);
  });

  if (authUser) {
    const myProfile = await fetchMyProfile();
    if (myProfile?.username) {
      const myName = cleanPlayerName(myProfile.username);
      mergedScores[myName] = Math.max(mergedScores[myName] || 0, Number(myProfile.best_score) || 0);
      if (currentPlayer !== myName) {
        currentPlayer = myName;
        playerNameInput.value = currentPlayer;
      }
    }
  }

  highScores = mergedScores;
  saveHighScores();
  updatePersonalBest();
  updateLeaderboard();
}

async function fetchMyProfile() {
  if (!authUser) return null;

  const { data, error } = await supabase
    .from("player_profiles")
    .select("user_id,username,best_score,email")
    .eq("user_id", authUser.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function ensureRemoteProfile(preferredName = "") {
  if (!authUser) return null;

  const existing = await fetchMyProfile();
  if (existing) {
    setCurrentPlayer(existing.username, false);
    highScores[cleanPlayerName(existing.username)] = Math.max(
      highScores[cleanPlayerName(existing.username)] || 0,
      Number(existing.best_score) || 0
    );
    updatePersonalBest();
    return existing;
  }

  const username = cleanPlayerName(preferredName || authUser.user_metadata?.username || authUser.email?.split("@")[0] || "");
  const { data, error } = await supabase
    .from("player_profiles")
    .upsert(
      {
        user_id: authUser.id,
        email: authUser.email || null,
        username,
        best_score: 0,
      },
      { onConflict: "user_id" }
    )
    .select("user_id,username,best_score,email")
    .single();

  if (error) throw error;
  setCurrentPlayer(data.username, false);
  return data;
}

async function updateRemoteUsername() {
  if (!authUser) return false;
  setAuthStatus(t("authUsernameLocked"), "error");
  return false;
}

async function saveRemoteScoreIfBest(finalScore, previousBest = 0) {
  if (!authUser || !remoteReady) return;

  const profile = await fetchMyProfile();
  const currentBest = Math.max(Number(profile?.best_score) || 0, previousBest);
  if (finalScore <= currentBest) return;

  const { error } = await supabase
    .from("player_profiles")
    .update({
      best_score: finalScore,
      username: currentPlayer,
      email: authUser.email || null,
    })
    .eq("user_id", authUser.id);

  if (error) {
    setAuthStatus(error.message, "error");
    return;
  }

  highScores[currentPlayer] = finalScore;
  updatePersonalBest();
  await loadRemoteLeaderboard();
}

function saveScoreIfBest(syncRemote = false) {
  const finalScore = Math.floor(score);
  const previousBest = highScores[currentPlayer] || 0;

  if (finalScore > previousBest) {
    highScores[currentPlayer] = finalScore;
    saveHighScores();
    if (syncRemote) {
      void saveRemoteScoreIfBest(finalScore, previousBest);
    }
    updatePersonalBest();
    updateLeaderboard();
  }

  if (finalScore > bestAtStart) {
    newBestThisRun = true;
    return true;
  }

  return newBestThisRun;
}

function getSpeedLevel() {
  return Math.floor(score / POINTS_PER_SPEED_UP);
}

function updateSpeedFromScore() {
  const speedLevel = getSpeedLevel();
  speed = BASE_SPEED + speedLevel * SPEED_STEP;
  speedEl.textContent = (speedLevel + 1).toString();
}

function updateBrakeDisplay() {
  const visibleBrake = Math.max(0, Math.ceil(brakePower));
  brakePowerEl.textContent = `${visibleBrake}%`;
  brakeButton.classList.toggle("is-low", visibleBrake <= 20);
}

function updateShieldDisplay() {
  shieldStatusEl.textContent = shieldActive ? t("shieldOn") : t("shieldOff");
  shieldStatusEl.classList.toggle("shield-on", shieldActive);
}

function applyLanguage(language, shouldSave = true) {
  currentLanguage = translations[language] ? language : "en";
  const copy = translations[currentLanguage];
  document.documentElement.lang = copy.lang;
  document.documentElement.dir = copy.dir;
  document.title = copy.title;
  authPanel.setAttribute("aria-label", copy.authPanel);
  playerPanel.setAttribute("aria-label", copy.playerPanel);
  hudPanel.setAttribute("aria-label", copy.hud);
  controlsPanel.setAttribute("aria-label", copy.controls);
  leaderboardPanel.setAttribute("aria-label", copy.leaderboardPanel);
  mobileScoresSheet.setAttribute("aria-label", copy.mobileScores);
  canvas.setAttribute("aria-label", copy.canvas);
  document.querySelector("#playerNameLabel").textContent = copy.player;
  playerNameInput.placeholder = copy.playerPlaceholder;
  authEmailInput.placeholder = copy.email;
  authPasswordInput.placeholder = copy.password;
  togglePasswordButton.textContent = authPasswordInput.type === "password" ? copy.showPassword : copy.hidePassword;
  signInButton.textContent = copy.signIn;
  signUpButton.textContent = copy.signUp;
  signOutButton.textContent = copy.signOut;
  savePlayerButton.textContent = copy.save;
  document.querySelector("#personalBestLabel").textContent = copy.myBest;
  document.querySelector("#languageLabel").textContent = copy.language;
  document.querySelector("#scoreLabel").textContent = copy.score;
  document.querySelector("#speedLabel").textContent = copy.speed;
  document.querySelector("#brakeLabel").textContent = copy.brake;
  document.querySelector("#coinsLabel").textContent = copy.coins;
  document.querySelector("#shieldLabel").textContent = copy.shield;
  restartButton.textContent = copy.newGame;
  leftButton.textContent = copy.left;
  brakeButton.textContent = copy.brake;
  rightButton.textContent = copy.right;
  document.querySelector("#leaderboardTitle").textContent = copy.leaderboard;
  mobileScoresButton.textContent = copy.scoresButton;
  document.querySelector("#mobileLeaderboardTitle").textContent = copy.leaderboard;
  closeScoresButton.textContent = copy.close;
  languageSelect.value = currentLanguage;
  updateShieldDisplay();
  updateLeaderboard();
  if (authUser) {
    setAuthStatus(`${t("authSignedIn")} ${currentPlayer}`, "success");
  } else if (remoteReady) {
    setAuthStatus(t("authSignedOut"));
  }
  if (shouldSave) saveGameData();
}

function createSceneryItem(index) {
  const leftSide = index % 2 === 0;
  const y = (index * 83) % (canvas.height + 120) - 100;
  const kind = index % 5 === 0 ? "sign" : index % 3 === 0 ? "building" : "tree";
  return {
    x: leftSide ? 34 + (index % 3) * 16 : 420 + (index % 3) * 15,
    y,
    kind,
    size: 22 + (index % 4) * 6,
    color: ["#49a86f", "#2f9c5a", "#6cc36f", "#e6c45d"][index % 4],
  };
}

function resetGame() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  const typedPlayer = cleanPlayerName(playerNameInput.value);
  if (typedPlayer !== currentPlayer) setCurrentPlayer(typedPlayer);
  bestAtStart = highScores[currentPlayer] || 0;
  player = {
    x: lanes[1],
    y: canvas.height - 112,
    width: 48,
    height: 76,
    targetX: lanes[1],
  };
  traffic = [];
  coins = [];
  shields = [];
  clocks = [];
  sparks = [];
  skidMarks = [];
  score = 0;
  speed = BASE_SPEED;
  gameOver = false;
  updatePlayLayout();
  lastTime = performance.now();
  spawnTimer = 0;
  coinTimer = 1.6;
  shieldTimer = SHIELD_MIN_DELAY + Math.random() * SHIELD_RANDOM_DELAY;
  clockTimer = CLOCK_MIN_DELAY + Math.random() * CLOCK_RANDOM_DELAY;
  shake = 0;
  brakePower = MAX_BRAKE_POWER;
  coinsCollected = 0;
  shieldActive = false;
  slowMotionTimer = 0;
  touchSteeringActive = false;
  touchBrakeActive = false;
  newBestThisRun = false;
  scoreEl.textContent = "0";
  coinsEl.textContent = "0";
  updateShieldDisplay();
  updateSpeedFromScore();
  updateBrakeDisplay();
  animationFrameId = requestAnimationFrame(update);
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function drawGrass() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#6ac46f");
  sky.addColorStop(1, "#3c8f52");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  for (let y = -60 + road.stripeOffset * 0.45; y < canvas.height + 70; y += 92) {
    ctx.fillRect(12, y, 52, 8);
    ctx.fillRect(canvas.width - 72, y + 38, 48, 8);
  }
}

function drawScenery(currentSpeed, delta) {
  scenery.forEach((item) => {
    item.y += currentSpeed * 0.42 * delta;
    if (item.y > canvas.height + 60) item.y = -90;

    if (item.kind === "tree") {
      ctx.fillStyle = "#6b4f31";
      ctx.fillRect(item.x - 4, item.y + item.size * 0.35, 8, item.size);
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(item.x, item.y + item.size * 0.25, item.size * 0.58, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.beginPath();
      ctx.arc(item.x - 6, item.y + item.size * 0.08, item.size * 0.22, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.kind === "building") {
      ctx.fillStyle = "#496678";
      roundedRect(item.x - 18, item.y, 36, item.size * 1.7, 4);
      ctx.fillStyle = "#ffd76d";
      for (let wy = item.y + 9; wy < item.y + item.size * 1.5; wy += 18) {
        ctx.fillRect(item.x - 10, wy, 6, 8);
        ctx.fillRect(item.x + 4, wy, 6, 8);
      }
    } else {
      ctx.fillStyle = "#61412b";
      ctx.fillRect(item.x - 3, item.y + 22, 6, 42);
      ctx.fillStyle = "#ffdf5d";
      roundedRect(item.x - 24, item.y, 48, 28, 6);
      ctx.fillStyle = "#1a2630";
      ctx.font = "700 13px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GO", item.x, item.y + 19);
    }
  });
}

function drawRoad() {
  const roadGradient = ctx.createLinearGradient(road.x, 0, road.x + road.width, 0);
  roadGradient.addColorStop(0, "#26323a");
  roadGradient.addColorStop(0.48, "#434f57");
  roadGradient.addColorStop(1, "#26323a");
  ctx.fillStyle = roadGradient;
  ctx.fillRect(road.x, road.y, road.width, road.height);

  ctx.fillStyle = "#20272d";
  ctx.fillRect(road.x - 16, 0, 16, road.height);
  ctx.fillRect(road.x + road.width, 0, 16, road.height);

  ctx.fillStyle = "#f7fbff";
  ctx.fillRect(road.x + 11, 0, 7, road.height);
  ctx.fillRect(road.x + road.width - 18, 0, 7, road.height);

  ctx.fillStyle = "#d23a35";
  for (let y = -30 + road.stripeOffset; y < canvas.height; y += 72) {
    ctx.fillRect(road.x - 12, y, 10, 34);
    ctx.fillRect(road.x + road.width + 2, y + 30, 10, 34);
  }

  ctx.fillStyle = "#f6d365";
  for (let y = -70 + road.stripeOffset; y < canvas.height; y += 118) {
    roundedRect(road.x + road.width / 3 - 4, y, 8, 62, 4);
    roundedRect(road.x + (road.width * 2) / 3 - 4, y, 8, 62, 4);
  }
}

function drawCar(car, color, windowColor = "#caefff") {
  ctx.save();
  ctx.translate(car.x, car.y);
  if (car.tilt) ctx.rotate(car.tilt);

  if (car === player && shieldActive) {
    const pulse = Math.sin(performance.now() * 0.01) * 0.06 + 1;
    ctx.save();
    ctx.translate(0, car.height * 0.48);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(80, 210, 255, 0.18)";
    ctx.strokeStyle = "rgba(220, 250, 255, 0.95)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, 0, car.width * 0.92, car.height * 0.68, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(78, 212, 255, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, car.width * 1.08, car.height * 0.8, Math.sin(performance.now() * 0.003) * 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  roundedRect(-car.width / 2 + 7, 10, car.width, car.height, 10);

  ctx.fillStyle = "#171d22";
  roundedRect(-car.width / 2 - 7, 12, 10, 22, 4);
  roundedRect(car.width / 2 - 3, 12, 10, 22, 4);
  roundedRect(-car.width / 2 - 7, car.height - 34, 10, 22, 4);
  roundedRect(car.width / 2 - 3, car.height - 34, 10, 22, 4);

  ctx.fillStyle = color;
  roundedRect(-car.width / 2, 0, car.width, car.height, 12);

  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
  roundedRect(-car.width / 2 + 7, 6, car.width - 14, 8, 4);

  ctx.fillStyle = windowColor;
  roundedRect(-car.width / 2 + 11, 17, car.width - 22, 18, 5);
  roundedRect(-car.width / 2 + 11, car.height - 31, car.width - 22, 15, 5);

  ctx.fillStyle = "rgba(30, 45, 54, 0.5)";
  ctx.fillRect(-2, 18, 4, car.height - 34);

  ctx.fillStyle = "#fff4a8";
  roundedRect(-car.width / 2 + 6, 4, 12, 8, 3);
  roundedRect(car.width / 2 - 18, 4, 12, 8, 3);

  if (car === player) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 15px Arial";
    ctx.textAlign = "center";
    ctx.fillText("O", 0, 50);
  }

  ctx.restore();
}

function drawSkidMarks(currentSpeed, delta) {
  skidMarks.forEach((mark) => {
    mark.y += currentSpeed * delta;
    mark.life -= delta;
    ctx.globalAlpha = Math.max(0, mark.life);
    ctx.fillStyle = "#14191d";
    roundedRect(mark.x - 15, mark.y, 7, 38, 4);
    roundedRect(mark.x + 8, mark.y, 7, 38, 4);
    ctx.globalAlpha = 1;
  });
  skidMarks = skidMarks.filter((mark) => mark.life > 0 && mark.y < canvas.height + 60);
}

function drawSparks(delta) {
  sparks.forEach((spark) => {
    spark.x += spark.vx * delta;
    spark.y += spark.vy * delta;
    spark.vy += 380 * delta;
    spark.life -= delta;
    ctx.globalAlpha = Math.max(0, spark.life * 2.4);
    ctx.fillStyle = spark.color;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  sparks = sparks.filter((spark) => spark.life > 0);
}

function drawCoin(coin) {
  const pulse = Math.sin(coin.spin) * 0.18 + 0.82;

  ctx.save();
  ctx.translate(coin.x, coin.y);
  ctx.scale(pulse, 1);
  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.beginPath();
  ctx.ellipse(5, 8, coin.radius * 0.9, coin.radius * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  const coinGradient = ctx.createRadialGradient(-5, -6, 3, 0, 0, coin.radius);
  coinGradient.addColorStop(0, "#fff7a5");
  coinGradient.addColorStop(0.45, "#ffd84d");
  coinGradient.addColorStop(1, "#cf8f17");
  ctx.fillStyle = coinGradient;
  ctx.beginPath();
  ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#fff4a8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, coin.radius - 5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#9c6810";
  ctx.font = "700 17px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("₪", 0, 1);
  ctx.restore();
}

function drawShield(shield) {
  const pulse = Math.sin(shield.spin) * 0.13 + 1;

  ctx.save();
  ctx.translate(shield.x, shield.y);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.beginPath();
  ctx.ellipse(5, 11, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(65, 190, 255, 0.24)";
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4fd4ff";
  ctx.strokeStyle = "#e9fbff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -27);
  ctx.quadraticCurveTo(20, -20, 20, -2);
  ctx.quadraticCurveTo(18, 20, 0, 30);
  ctx.quadraticCurveTo(-18, 20, -20, -2);
  ctx.quadraticCurveTo(-20, -20, 0, -27);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 22px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("*", 0, 2);
  ctx.restore();
}

function drawClock(clock) {
  const pulse = Math.sin(clock.spin) * 0.1 + 1;

  ctx.save();
  ctx.translate(clock.x, clock.y);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.beginPath();
  ctx.ellipse(4, 10, 19, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#7f8cff";
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f8fbff";
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#e8ecff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#3e4ea8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -8);
  ctx.moveTo(0, 0);
  ctx.lineTo(7, 3);
  ctx.stroke();
  ctx.restore();
}

function spawnCoin() {
  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  const laneHasTraffic = traffic.some((car) => car.lane !== undefined && Math.abs(car.x - lane) < 10 && car.y < 145);

  if (laneHasTraffic) return;

  coins.push({
    x: lane,
    y: -36,
    radius: 17,
    spin: Math.random() * Math.PI * 2,
  });
}

function spawnShield() {
  if (shieldActive || shields.length > 0) return;

  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  const laneBlocked = traffic.some((car) => Math.abs(car.x - lane) < 10 && car.y < 160);
  if (laneBlocked) return;

  shields.push({
    x: lane,
    y: -46,
    radius: 25,
    spin: Math.random() * Math.PI * 2,
  });
}

function spawnClock() {
  if (slowMotionTimer > 0 || clocks.length > 0) return;

  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  const laneBlocked = traffic.some((car) => Math.abs(car.x - lane) < 10 && car.y < 160);
  if (laneBlocked) return;

  clocks.push({
    x: lane,
    y: -42,
    radius: 22,
    spin: Math.random() * Math.PI * 2,
  });
}

function createCoinSparks(coin) {
  for (let i = 0; i < 12; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const power = 60 + Math.random() * 130;
    sparks.push({
      x: coin.x,
      y: coin.y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
      size: 2 + Math.random() * 3,
      life: 0.25 + Math.random() * 0.22,
      color: "#ffe36d",
    });
  }
}

function createShieldSparks(x, y, color = "#79ddff") {
  for (let i = 0; i < 22; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const power = 80 + Math.random() * 180;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
      size: 2 + Math.random() * 4,
      life: 0.32 + Math.random() * 0.28,
      color,
    });
  }
}

function createClockSparks(x, y) {
  for (let i = 0; i < 18; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const power = 70 + Math.random() * 140;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
      size: 2 + Math.random() * 3,
      life: 0.28 + Math.random() * 0.24,
      color: "#b4c0ff",
    });
  }
}

function createCrashSparks() {
  for (let i = 0; i < 34; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const power = 90 + Math.random() * 260;
    sparks.push({
      x: player.x,
      y: player.y + player.height * 0.45,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
      size: 2 + Math.random() * 4,
      life: 0.35 + Math.random() * 0.45,
      color: Math.random() > 0.45 ? "#ffdf5d" : "#ff5b3d",
    });
  }
}

function drawScene(currentSpeed = speed, delta = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (shake > 0) {
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    shake *= 0.88;
  }
  drawGrass();
  drawScenery(currentSpeed, delta);
  drawRoad();
  drawSkidMarks(currentSpeed, delta);
  coins.forEach(drawCoin);
  shields.forEach(drawShield);
  clocks.forEach(drawClock);
  traffic.forEach((car) => drawCar(car, car.color, "#e8f5ff"));
  drawCar(player, "#df3f36");
  drawSparks(delta);
  ctx.restore();

  if (!gameOver && slowMotionTimer > 0) {
    ctx.fillStyle = "rgba(92, 108, 255, 0.22)";
    roundedRect(18, 18, 116, 36, 8);
    ctx.fillStyle = "#f7fbff";
    ctx.textAlign = "center";
    ctx.font = "700 18px Arial";
    ctx.fillText(`${t("slowMotion")} ${Math.ceil(slowMotionTimer)}`, 76, 42);
  }

  if (!gameOver && score < 18) {
    ctx.fillStyle = "rgba(13, 19, 24, 0.42)";
    roundedRect(52, canvas.height - 86, canvas.width - 104, 46, 8);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "700 17px Arial";
    ctx.fillText(t("dragTip"), canvas.width / 2, canvas.height - 58);
  }

  if (gameOver) {
    ctx.fillStyle = "rgba(13, 19, 24, 0.76)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "700 42px Arial";
    ctx.fillText(t("boom"), canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "700 24px Arial";
    ctx.fillText(`${t("finalScore")}: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 + 26);
    ctx.font = "700 20px Arial";
    ctx.fillText(newBestThisRun ? t("newBest") : t("pressNewGame"), canvas.width / 2, canvas.height / 2 + 60);
    if (newBestThisRun) {
      ctx.font = "700 18px Arial";
      ctx.fillText(t("pressNewGame"), canvas.width / 2, canvas.height / 2 + 90);
    }
  }
}

function spawnTraffic() {
  const entryCars = traffic.filter((car) => car.y > -car.height && car.y < TRAFFIC_ENTRY_ZONE);
  const blockedLanes = new Set(entryCars.map((car) => car.lane));

  if (blockedLanes.size >= lanes.length - 1) return;

  const openLanes = lanes
    .map((x, index) => ({ x, index }))
    .filter((lane) => {
      if (blockedLanes.has(lane.index)) return false;

      return traffic.every((car) => car.lane !== lane.index || car.y >= TRAFFIC_LANE_SAFE_GAP);
    });

  if (openLanes.length === 0) return;

  const lane = openLanes[Math.floor(Math.random() * openLanes.length)];
  const colors = ["#2fbf71", "#3772ff", "#f46036", "#a76df0", "#f3a712"];
  traffic.push({
    x: lane.x,
    y: -92,
    width: 48,
    height: 76,
    lane: lane.index,
    color: colors[Math.floor(Math.random() * colors.length)],
  });
}

function movePlayer(delta) {
  const before = player.targetX;
  if (!touchSteeringActive) {
    if (keys.has("ArrowLeft") || keys.has("a")) player.targetX -= 420 * delta;
    if (keys.has("ArrowRight") || keys.has("d")) player.targetX += 420 * delta;
  }

  player.targetX = Math.max(road.x + 48, Math.min(road.x + road.width - 48, player.targetX));
  player.tilt = (player.targetX - before) * 0.004;
  player.x += (player.targetX - player.x) * Math.min(1, 12 * delta);
}

function rectanglesOverlap(a, b) {
  return (
    a.x - a.width / 2 < b.x + b.width / 2 &&
    a.x + a.width / 2 > b.x - b.width / 2 &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function finishGame() {
  gameOver = true;
  updatePlayLayout();
  shake = 16;
  createCrashSparks();
  newBestThisRun = saveScoreIfBest(true) || newBestThisRun;
  if (newBestThisRun) {
    sparks.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: 0,
      vy: -80,
      size: 9,
      life: 0.8,
      color: "#fff2a6",
    });
  }
}

function breakShield(hitCar) {
  shieldActive = false;
  updateShieldDisplay();
  shake = 10;
  createShieldSparks(player.x, player.y + player.height * 0.45, "#99e7ff");
  hitCar.y = canvas.height + 150;
}

function update(now) {
  const delta = Math.min(0.032, (now - lastTime) / 1000);
  lastTime = now;

  if (!gameOver) {
    const wantsBrake = touchBrakeActive || keys.has(" ") || keys.has("ArrowDown");
    const braking = wantsBrake && brakePower > 0;
    if (slowMotionTimer > 0) {
      slowMotionTimer = Math.max(0, slowMotionTimer - delta);
    }

    const motionFactor = slowMotionTimer > 0 ? SLOW_MOTION_FACTOR : 1;
    const currentSpeed = (braking ? speed * 0.58 : speed) * motionFactor;
    road.stripeOffset = (road.stripeOffset + currentSpeed * delta) % 118;
    spawnTimer -= delta;
    coinTimer -= delta;
    shieldTimer -= delta;
    clockTimer -= delta;

    if (braking) {
      brakePower = Math.max(0, brakePower - BRAKE_DRAIN_PER_SECOND * delta);
    } else {
      brakePower = Math.min(MAX_BRAKE_POWER, brakePower + BRAKE_RECHARGE_PER_SECOND * delta);
    }
    updateBrakeDisplay();

    if (braking && Math.random() > 0.55) {
      skidMarks.push({ x: player.x, y: player.y + player.height - 18, life: 0.9 });
    }

    if (spawnTimer <= 0) {
      spawnTraffic();
      spawnTimer = Math.max(0.42, 1.08 - score / 900);
    }

    if (coinTimer <= 0) {
      spawnCoin();
      coinTimer = 1.25 + Math.random() * 1.45;
    }

    if (shieldTimer <= 0) {
      spawnShield();
      shieldTimer = SHIELD_MIN_DELAY + Math.random() * SHIELD_RANDOM_DELAY;
    }

    if (clockTimer <= 0) {
      spawnClock();
      clockTimer = CLOCK_MIN_DELAY + Math.random() * CLOCK_RANDOM_DELAY;
    }

    movePlayer(delta);
    traffic.forEach((car) => {
      car.y += currentSpeed * delta;
      car.tilt = Math.sin((car.y + car.x) * 0.012) * 0.02;
    });
    traffic = traffic.filter((car) => car.y < canvas.height + 100);
    coins.forEach((coin) => {
      coin.y += currentSpeed * delta;
      coin.spin += delta * 8;
    });
    shields.forEach((shield) => {
      shield.y += currentSpeed * delta;
      shield.spin += delta * 4.5;
    });
    clocks.forEach((clock) => {
      clock.y += currentSpeed * delta;
      clock.spin += delta * 5.5;
    });

    coins = coins.filter((coin) => {
      const coinBox = {
        x: coin.x,
        y: coin.y - coin.radius,
        width: coin.radius * 2,
        height: coin.radius * 2,
      };

      if (rectanglesOverlap(player, coinBox)) {
        coinsCollected += 1;
        coinsEl.textContent = coinsCollected.toString();
        score += COIN_POINTS;
        createCoinSparks(coin);
        return false;
      }

      return coin.y < canvas.height + 60;
    });

    shields = shields.filter((shield) => {
      const shieldBox = {
        x: shield.x,
        y: shield.y - shield.radius,
        width: shield.radius * 2,
        height: shield.radius * 2,
      };

      if (rectanglesOverlap(player, shieldBox)) {
        shieldActive = true;
        updateShieldDisplay();
        createShieldSparks(shield.x, shield.y);
        return false;
      }

      return shield.y < canvas.height + 70;
    });

    clocks = clocks.filter((clock) => {
      const clockBox = {
        x: clock.x,
        y: clock.y - clock.radius,
        width: clock.radius * 2,
        height: clock.radius * 2,
      };

      if (rectanglesOverlap(player, clockBox)) {
        slowMotionTimer = SLOW_MOTION_DURATION;
        createClockSparks(clock.x, clock.y);
        return false;
      }

      return clock.y < canvas.height + 70;
    });

    const hitCar = traffic.find((car) => rectanglesOverlap(player, car));
    if (hitCar) {
      if (shieldActive) {
        breakShield(hitCar);
        traffic = traffic.filter((car) => car !== hitCar);
      } else {
        finishGame();
      }
    }

    score += delta * 12;
    updateSpeedFromScore();
    saveScoreIfBest(false);
    scoreEl.textContent = Math.floor(score).toString();
  }

  drawScene(speed, delta);
  if (!gameOver || sparks.length > 0) {
    animationFrameId = requestAnimationFrame(update);
  }
}

function holdButton(button, key) {
  const press = (event) => {
    event.preventDefault();
    keys.add(key);
  };
  const release = (event) => {
    event.preventDefault();
    keys.delete(key);
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("pointercancel", release);
}

function handleCanvasPointer(event) {
  const rect = canvas.getBoundingClientRect();
  const xRatio = (event.clientX - rect.left) / rect.width;
  const yRatio = (event.clientY - rect.top) / rect.height;
  const roadLeftRatio = road.x / canvas.width;
  const roadWidthRatio = road.width / canvas.width;
  const clampedRatio = Math.max(roadLeftRatio + 0.08, Math.min(roadLeftRatio + roadWidthRatio - 0.08, xRatio));

  player.targetX = clampedRatio * canvas.width;
  touchBrakeActive = yRatio > 0.78;
}

canvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  touchSteeringActive = true;
  handleCanvasPointer(event);
});

canvas.addEventListener("pointermove", (event) => {
  if (!touchSteeringActive) return;
  event.preventDefault();
  handleCanvasPointer(event);
});

function releaseCanvasPointer(event) {
  event.preventDefault();
  touchSteeringActive = false;
  touchBrakeActive = false;
}

canvas.addEventListener("pointerup", releaseCanvasPointer);
canvas.addEventListener("pointercancel", releaseCanvasPointer);

mobileScoresButton.addEventListener("click", () => {
  mobileScoresModal.hidden = false;
});

closeScoresButton.addEventListener("click", () => {
  mobileScoresModal.hidden = true;
});

mobileScoresModal.addEventListener("click", (event) => {
  if (event.target === mobileScoresModal) {
    mobileScoresModal.hidden = true;
  }
});

window.addEventListener("keydown", (event) => {
  keys.add(event.key);
  if (event.key === "Enter" && gameOver) resetGame();
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key);
});

window.addEventListener("beforeunload", saveGameData);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveGameData();
});

restartButton.addEventListener("click", resetGame);
savePlayerButton.addEventListener("click", async () => {
  try {
    if (authUser) {
      await updateRemoteUsername();
    } else {
      setCurrentPlayer(playerNameInput.value);
    }
  } catch (error) {
    setAuthStatus(error.message || String(error), "error");
  }
});
playerNameInput.addEventListener("keydown", (event) => {
  if (authUser) return;
  if (event.key === "Enter") {
    setCurrentPlayer(playerNameInput.value);
    playerNameInput.blur();
  }
});
playerNameInput.addEventListener("blur", () => {
  if (authUser) return;
  setCurrentPlayer(playerNameInput.value);
});
languageSelect.addEventListener("change", () => {
  applyLanguage(languageSelect.value);
});
togglePasswordButton.addEventListener("click", () => {
  authPasswordInput.type = authPasswordInput.type === "password" ? "text" : "password";
  togglePasswordButton.textContent = authPasswordInput.type === "password" ? t("showPassword") : t("hidePassword");
});
signUpButton.addEventListener("click", async () => {
  const email = normalizeEmail(authEmailInput.value);
  const password = authPasswordInput.value.trim();
  const username = cleanPlayerName(playerNameInput.value);

  if (!username) {
    setAuthStatus(t("authNeedUsername"), "error");
    return;
  }
  if (!email) {
    setAuthStatus(t("authNeedEmail"), "error");
    return;
  }
  if (!password) {
    setAuthStatus(t("authNeedPassword"), "error");
    return;
  }

  setAuthStatus(t("authLoading"));
  if (authUser) {
    await supabase.auth.signOut();
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) {
    setAuthStatus(error.message, "error");
    return;
  }

  if (!data.session) {
    setAuthStatus(t("authCheckEmail"), "success");
    return;
  }

  await queueAuthSync(data.session, username);
});
signInButton.addEventListener("click", async () => {
  const email = normalizeEmail(authEmailInput.value);
  const password = authPasswordInput.value.trim();

  if (!email) {
    setAuthStatus(t("authNeedEmail"), "error");
    return;
  }
  if (!password) {
    setAuthStatus(t("authNeedPassword"), "error");
    return;
  }

  setAuthStatus(t("authLoading"));
  if (authUser) {
    await supabase.auth.signOut();
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setAuthStatus(error.message, "error");
    return;
  }

  await queueAuthSync(data.session, playerNameInput.value);
});
signOutButton.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    setAuthStatus(error.message, "error");
    return;
  }
  authUser = null;
  signOutButton.hidden = true;
  setAuthStatus(t("authSignedOut"));
});
holdButton(leftButton, "ArrowLeft");
holdButton(rightButton, "ArrowRight");
holdButton(brakeButton, " ");

highScores = loadHighScores();
applyLanguage(getSavedLanguage(), false);
setCurrentPlayer(getSavedPlayerName(), false);
setAuthStatus(t("authLoading"));
supabase.auth.onAuthStateChange((_event, session) => {
  queueAuthSync(session, playerNameInput.value);
});

supabase.auth.getSession().then(async ({ data, error }) => {
  if (error) {
    setAuthStatus(error.message, "error");
    return;
  }
  await queueAuthSync(data.session, playerNameInput.value);
});
resetGame();
