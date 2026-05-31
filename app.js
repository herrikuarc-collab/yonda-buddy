/*
 * Yonda-Buddy (ヨンダーバディ) - Core Application Logic
 * Implements LocalStorage state, Barcode Scanning (html5-qrcode), 
 * openBD API / Google Books API, Gemini API, Mascot Dressing, 
 * Level system, Badges, Calendar, and Animations.
 */

// App State
let state = {
  books: [],
  coins: 0,
  xp: 0,
  level: 1,
  purchasedAccessories: [],
  equippedAccessories: [],
  badges: [],
  geminiApiKey: ""
};

// Mascot Accessories Database
const SHOP_ITEMS = [
  { id: "hat", name: "まほうのぼうし", emoji: "🎩", price: 10 },
  { id: "glasses", name: "サングラス", emoji: "🕶️", price: 15 },
  { id: "crown", name: "きらきら王冠", emoji: "👑", price: 30 },
  { id: "ribbon", name: "かわいいリボン", emoji: "🎀", price: 8 },
  { id: "apple", name: "りんごのぼうし", emoji: "🍎", price: 12 },
  { id: "cat_ears", name: "ねこみみ", emoji: "🐱", price: 20 }
];

// Badge Database
const BADGES = [
  { id: "first_step", name: "はじめての１歩", emoji: "🌟", desc: "はじめて本を登録した！" },
  { id: "writer", name: "作家デビュー", emoji: "✍️", desc: "はじめてかんそうをかいた！" },
  { id: "reader_pro", name: "どくしょ名人", emoji: "📚", desc: "本を5さつ登録した！" },
  { id: "reading_king", name: "読書王", emoji: "👑", desc: "本を10さつ登録した！" },
  { id: "adventure", name: "冒険家", emoji: "🧭", desc: "ぼうけんの本を登録した！" },
  { id: "animal", name: "動物ドクター", emoji: "🦁", desc: "どうぶつの本を登録した！" },
  { id: "picture_book", name: "絵本マスター", emoji: "🎨", desc: "絵本を登録した！" },
  { id: "streak_3", name: "3日連続よんだ！", emoji: "🔥", desc: "3日連続で読書を記録した！" }
];

// Cute Encouraging Speeches for "よんだーくん" Default Mode
const LOCAL_AI_TEMPLATES = {
  happy: [
    "わあ！『{title}』をよんでワクワクしたんだね！「{snippet}」ってかいてくれたところ、よんだーくんも大すきだよ！この本をよんで、とってもハッピーなきもちになれたの、ほんとうにすてきなことだね！🌟",
    "すてきなかんそうありがとう！『{title}』はすっごくおもしろい本だよね！「{snippet}」っていうところ、よんだーくんも読みたくなっちゃった！きみのキラキラした目が目に浮かぶよ！👀✨",
    "おもしろい本に出会えてよかったね！『{title}』をよんで、「{snippet}」ってきづけるなんて、きみはもうりっぱな読書のプロだよ！つぎの本もわくわくしちゃうね！🎈"
  ],
  sad: [
    "『{title}』をよんで、すこしせつないきもちになったんだね。本のなかのことばやできごとに、しっかりきもちをよりそわせることができたの、とってもやさしい心のしょう拠だよ！やさしいきみになれて素晴らしい！🌈",
    "かなしいおはなしだったんだね。でも、そのかなしさを「{snippet}」って自分のことばで書けるなんて、ほんとうにすごい表現力だよ！本は、いろんなきもちを教えてくれるね。よんだーくんがギュッとしてあげる！🤗"
  ],
  thrill: [
    "うわあ！『{title}』はすっごくどきどきするおはなしだったんだね！「{snippet}」のところが、ハラハラして目がはなせなかったのかな？大ぼうけんをしたみたいでカッコいいぞ！🧭",
    "どきどき大こうふん！『{title}』をよんで、「{snippet}」って感じたんだね！きみも主人公といっしょに、ハラハラをのりこえたんだ！すっごくつよいパワーを感じるよ！⚡️"
  ],
  hard: [
    "すこしむずかしい本にチャレンジしたんだね！えらいなあ！むずかしいことばや、ながいおはなしをさいごまでよんだだけで、よんどくパワーが100倍アップだよ！つぎはもっとかんたんに読めるようになるよ！💪",
    "よくさいごまでがんばってよんだね！えらい！『{title}』で「{snippet}」って感じたのは、きみがたくさん頭をつかって考えたからだよ！よんだーくんはきみのことが大すきだし、大そんけいしちゃう！🌟"
  ],
  surprise: [
    "へええ！『{title}』をよんでびっくりしたんだね！どんな大はっけんがあったのかな？「{snippet}」のところ、よんだーくんもびっくりしちゃった！あたらしいことを知るって、わくわくするね！🎓",
    "びっくりぎょうてん！『{title}』で「{snippet}」ってところ、びっくりしちゃうよね！本をよむと、いろんな「へえ〜！」に出会えるね。きみのあたまのなかに、新しい引き出しが増えたよ！🗝️"
  ],
  default: [
    "『{title}』をよんでくれてありがとう！いっしょうけんめい感想をかいてくれたの、よんだーくんはとってもうれしいよ！きみの読書はいつでも大せいこう！つぎもいっしょによもうね！📖",
    "わあ、読んだんだね！『{title}』はとってもすてきな本だよ。きみが「{snippet}」って書いてくれたから、よんだーくんもその本が大好きになっちゃった！またおはなししようね！🌸"
  ]
};

// Active Scanner Instance
let html5QrcodeScanner = null;
let scannedIsbnTemp = null;
let scannedBookDataTemp = null;

// Initialize Application
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  initNavigation();
  updateUI();
  setupEventListeners();
  renderCalendar();
  
  // Lucide Icons initialization
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// Load State from LocalStorage
function loadState() {
  const savedState = localStorage.getItem("yonda_buddy_state");
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      // Migrate missing keys if any
      if (!state.books) state.books = [];
      if (state.coins === undefined) state.coins = 0;
      if (state.xp === undefined) state.xp = 0;
      if (state.level === undefined) state.level = 1;
      if (!state.purchasedAccessories) state.purchasedAccessories = [];
      if (!state.equippedAccessories) state.equippedAccessories = [];
      if (!state.badges) state.badges = [];
      if (state.geminiApiKey === undefined) state.geminiApiKey = "";
    } catch (e) {
      console.error("Error parsing saved state:", e);
    }
  } else {
    // Initial setup with starting coins
    state.coins = 0;
    state.xp = 0;
    state.level = 1;
    saveState();
  }
}

// Save State to LocalStorage
function saveState() {
  localStorage.setItem("yonda_buddy_state", JSON.stringify(state));
}

// Set up navigation between screens
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const screens = document.querySelectorAll(".screen");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetScreen = item.getAttribute("data-screen");
      
      // Stop scanner if leaving scanning screen
      if (targetScreen !== "scan" && html5QrcodeScanner) {
        stopScanner();
      }

      navItems.forEach(nav => nav.classList.remove("active"));
      screens.forEach(screen => screen.classList.remove("active"));

      item.classList.add("active");
      const activeScreen = document.getElementById(`screen-${targetScreen}`);
      if (activeScreen) {
        activeScreen.classList.add("active");
        
        // Refresh specific screen content
        if (targetScreen === "bookshelf") {
          renderBookshelf();
        } else if (targetScreen === "shop") {
          renderShop();
        } else if (targetScreen === "home") {
          updateUI();
          renderCalendar();
        } else if (targetScreen === "setting") {
          document.getElementById("api-key-input").value = state.geminiApiKey || "";
        }
      }
    });
  });
  
  // Show home by default
  document.querySelector('[data-screen="home"]').click();
}

// Update UI metrics
function updateUI() {
  // Coin display
  document.querySelectorAll(".coin-value").forEach(el => {
    el.textContent = state.coins;
  });

  // Level & XP
  const levelDetails = calculateLevel(state.xp);
  state.level = levelDetails.level;
  
  document.getElementById("level-value").textContent = state.level;
  document.getElementById("xp-current").textContent = levelDetails.currentXpInLevel;
  document.getElementById("xp-needed").textContent = levelDetails.xpNeededForNextLevel;
  
  const progressPercent = Math.min(100, (levelDetails.currentXpInLevel / levelDetails.xpNeededForNextLevel) * 100);
  document.getElementById("xp-progress-bar").style.width = `${progressPercent}%`;

  // Statistics
  document.getElementById("stat-total-books").textContent = state.books.length;
  // Calculate average rating or books this month
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const booksThisMonth = state.books.filter(b => b.date && b.date.startsWith(currentMonthStr)).length;
  document.getElementById("stat-month-books").textContent = booksThisMonth;

  // Render Badges Dashboard (Locked/Unlocked)
  renderBadgesDashboard();

  // Draw Mascot & Tree
  drawMascot("buddy-mascot");
  drawTree("tree-dashboard-visual");
  saveState();
}

// Calculate level based on XP
function calculateLevel(xp) {
  // Level threshold: Level 1 (0 XP), Level 2 (100 XP), Level 3 (300 XP), Level 4 (600 XP), Level 5 (1000 XP), etc.
  // Each next level requires (level * 100 + 100) XP.
  let level = 1;
  let accumulatedXp = 0;
  
  while (true) {
    let xpNeeded = level * 100;
    if (xp >= accumulatedXp + xpNeeded) {
      accumulatedXp += xpNeeded;
      level++;
    } else {
      break;
    }
  }

  const xpNeededForNext = level * 100;
  const currentXpInLevel = xp - accumulatedXp;
  
  return {
    level: level,
    currentXpInLevel: currentXpInLevel,
    xpNeededForNextLevel: xpNeededForNext
  };
}

// Render tree based on level
function drawTree(targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;
  
  // Decide which tree drawing based on level
  let treeSvg = "";
  if (state.level === 1) {
    // A cute tiny sprout in a flower pot
    treeSvg = `
      <svg viewBox="0 0 100 100" class="tree-svg">
        <!-- Pot -->
        <path d="M35 80 L65 80 L70 95 L30 95 Z" fill="#c28c68" stroke="#4a3e3d" stroke-width="2" />
        <rect x="28" y="74" width="44" height="6" rx="3" fill="#d99f7a" stroke="#4a3e3d" stroke-width="2" />
        <!-- Dirt -->
        <ellipse cx="50" cy="74" rx="16" ry="3" fill="#6e5246" />
        <!-- Small Sprout -->
        <path d="M50 74 C50 65 48 55 50 48" fill="none" stroke="#5cbf99" stroke-width="4" stroke-linecap="round" />
        <!-- Left Leaf -->
        <path d="M50 58 C40 58 35 48 45 46 C50 46 50 54 50 58" fill="#7bf2be" stroke="#4a3e3d" stroke-width="2" />
        <!-- Right Leaf -->
        <path d="M50 52 C60 52 65 42 55 40 C50 40 50 48 50 52" fill="#5cbf99" stroke="#4a3e3d" stroke-width="2" />
        <!-- Cute Sparkle -->
        <circle cx="50" cy="30" r="2" fill="#ffc93c" />
        <circle cx="35" cy="45" r="1.5" fill="#ffc93c" />
      </svg>
    `;
  } else if (state.level === 2) {
    // Growing plant with a stem and more leaves
    treeSvg = `
      <svg viewBox="0 0 100 100" class="tree-svg">
        <!-- Pot -->
        <path d="M35 80 L65 80 L70 95 L30 95 Z" fill="#c28c68" stroke="#4a3e3d" stroke-width="2" />
        <rect x="28" y="74" width="44" height="6" rx="3" fill="#d99f7a" stroke="#4a3e3d" stroke-width="2" />
        <!-- Dirt -->
        <ellipse cx="50" cy="74" rx="16" ry="3" fill="#6e5246" />
        <!-- Stem -->
        <path d="M50 74 C50 55 45 40 50 30" fill="none" stroke="#5cbf99" stroke-width="5" stroke-linecap="round" />
        <!-- Leaf 1 -->
        <path d="M48 60 C32 58 26 48 38 46 C48 46 48 54 48 60" fill="#7bf2be" stroke="#4a3e3d" stroke-width="2" />
        <!-- Leaf 2 -->
        <path d="M50 48 C66 48 72 38 60 36 C50 36 50 44 50 48" fill="#5cbf99" stroke="#4a3e3d" stroke-width="2" />
        <!-- Leaf 3 (Top) -->
        <path d="M50 30 C40 20 50 12 55 20 C55 25 52 28 50 30" fill="#a3f7d4" stroke="#4a3e3d" stroke-width="2" />
        <!-- Little Flower bud -->
        <circle cx="50" cy="26" r="4" fill="#ff758f" stroke="#4a3e3d" stroke-width="1.5" />
      </svg>
    `;
  } else if (state.level === 3) {
    // A young tree
    treeSvg = `
      <svg viewBox="0 0 100 100" class="tree-svg">
        <!-- Ground -->
        <ellipse cx="50" cy="90" rx="35" ry="8" fill="#e0eec6" stroke="#4a3e3d" stroke-width="2" />
        <!-- Trunk -->
        <path d="M46 90 L54 90 C54 75 58 60 56 50 L44 55 C46 65 46 80 46 90 Z" fill="#aa7150" stroke="#4a3e3d" stroke-width="2" />
        <!-- Foliage (Circles) -->
        <circle cx="50" cy="38" r="22" fill="#5cbf99" stroke="#4a3e3d" stroke-width="2.5" />
        <circle cx="36" cy="48" r="16" fill="#7bf2be" stroke="#4a3e3d" stroke-width="2" />
        <circle cx="64" cy="46" r="16" fill="#4fa583" stroke="#4a3e3d" stroke-width="2" />
        <!-- Tiny Red Apples -->
        <circle cx="42" cy="38" r="3.5" fill="#ff758f" />
        <circle cx="58" cy="44" r="3.5" fill="#ff758f" />
        <circle cx="48" cy="50" r="3" fill="#ff758f" />
      </svg>
    `;
  } else if (state.level === 4) {
    // Beautiful full-sized tree
    treeSvg = `
      <svg viewBox="0 0 100 100" class="tree-svg">
        <!-- Ground -->
        <ellipse cx="50" cy="90" rx="42" ry="8" fill="#cbe6a3" stroke="#4a3e3d" stroke-width="2" />
        <!-- Trunk -->
        <path d="M44 90 L56 90 C55 70 62 55 58 45 C48 45 44 65 44 90 Z" fill="#aa7150" stroke="#4a3e3d" stroke-width="2" />
        <path d="M52 55 C58 48 64 45 68 46" fill="none" stroke="#aa7150" stroke-width="4" stroke-linecap="round" />
        <path d="M48 58 C40 50 32 45 30 48" fill="none" stroke="#aa7150" stroke-width="3.5" stroke-linecap="round" />
        <!-- Foliage -->
        <circle cx="50" cy="34" r="26" fill="#5cbf99" stroke="#4a3e3d" stroke-width="2.5" />
        <circle cx="32" cy="42" r="18" fill="#7bf2be" stroke="#4a3e3d" stroke-width="2" />
        <circle cx="68" cy="40" r="18" fill="#4fa583" stroke="#4a3e3d" stroke-width="2" />
        <circle cx="50" cy="18" r="14" fill="#a3f7d4" stroke="#4a3e3d" stroke-width="2" />
        <!-- Apples -->
        <circle cx="34" cy="40" r="4" fill="#ff758f" stroke="#4a3e3d" stroke-width="1" />
        <circle cx="64" cy="38" r="4" fill="#ff758f" stroke="#4a3e3d" stroke-width="1" />
        <circle cx="48" cy="28" r="4" fill="#ff758f" stroke="#4a3e3d" stroke-width="1" />
        <circle cx="58" cy="46" r="4.5" fill="#ffc93c" stroke="#4a3e3d" stroke-width="1" /> <!-- Golden Apple! -->
      </svg>
    `;
  } else {
    // Level 5+: Magnificent Magical Reading Tree with shiny apples and starry background!
    treeSvg = `
      <svg viewBox="0 0 100 100" class="tree-svg">
        <!-- Ground -->
        <ellipse cx="50" cy="90" rx="45" ry="9" fill="#b0e0a8" stroke="#4a3e3d" stroke-width="2.5" />
        <!-- Trunk -->
        <path d="M43 90 L57 90 C55 68 64 52 58 40 C46 40 43 65 43 90 Z" fill="#8e5a3c" stroke="#4a3e3d" stroke-width="2.5" />
        <!-- Branches -->
        <path d="M52 52 C60 42 70 38 76 40" fill="none" stroke="#8e5a3c" stroke-width="5" stroke-linecap="round" />
        <path d="M47 55 C36 44 26 38 22 42" fill="none" stroke="#8e5a3c" stroke-width="4.5" stroke-linecap="round" />
        <!-- Foliage (Fluffy clouds style) -->
        <circle cx="50" cy="32" r="28" fill="#5cbf99" stroke="#4a3e3d" stroke-width="3" />
        <circle cx="28" cy="42" r="20" fill="#7bf2be" stroke="#4a3e3d" stroke-width="2" />
        <circle cx="72" cy="40" r="20" fill="#4fa583" stroke="#4a3e3d" stroke-width="2" />
        <circle cx="50" cy="16" r="18" fill="#a3f7d4" stroke="#4a3e3d" stroke-width="2" />
        <circle cx="36" cy="22" r="14" fill="#a3f7d4" stroke="#4a3e3d" stroke-width="2" />
        <circle cx="64" cy="22" r="14" fill="#5cbf99" stroke="#4a3e3d" stroke-width="2" />
        <!-- Magical Glowing Fruits & Star Sparkles -->
        <circle cx="34" cy="38" r="5" fill="#ff758f" stroke="#4a3e3d" stroke-width="1.5" />
        <circle cx="66" cy="36" r="5" fill="#ff758f" stroke="#4a3e3d" stroke-width="1.5" />
        <circle cx="50" cy="28" r="5.5" fill="#ffc93c" stroke="#4a3e3d" stroke-width="1.5" />
        <circle cx="48" cy="14" r="5" fill="#ff758f" stroke="#4a3e3d" stroke-width="1.5" />
        <circle cx="24" cy="48" r="4.5" fill="#ffc93c" stroke="#4a3e3d" stroke-width="1.5" />
        <circle cx="76" cy="48" r="4.5" fill="#ff758f" stroke="#4a3e3d" stroke-width="1.5" />
        <!-- Sparkle Stars -->
        <polygon points="50,4 52,8 56,10 52,12 50,16 48,12 44,10 48,8" fill="#ffc93c" />
        <polygon points="20,24 21,26 23,27 21,28 20,30 19,28 17,27 19,26" fill="#ffc93c" />
        <polygon points="80,24 81,26 83,27 81,28 80,30 79,28 77,27 79,26" fill="#ffc93c" />
      </svg>
    `;
  }
  
  container.innerHTML = treeSvg;
}

// Draw Mascot with Equipped Accessories
function drawMascot(targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;
  
  // Mascot Basic HTML and SVG
  // Mascot Body is a cute orange fluffy circular buddy
  let svgContent = `
    <svg viewBox="0 0 100 100" class="buddy-svg">
      <!-- Shadow -->
      <ellipse cx="50" cy="88" rx="28" ry="6" fill="#d9cdbc" opacity="0.6" />
      <!-- Feet -->
      <ellipse cx="38" cy="84" rx="8" ry="6" fill="#ff758f" stroke="#4a3e3d" stroke-width="2.5" />
      <ellipse cx="62" cy="84" rx="8" ry="6" fill="#ff758f" stroke="#4a3e3d" stroke-width="2.5" />
      <!-- Tiny Arms -->
      <circle cx="22" cy="56" r="6" fill="#ff8a5c" stroke="#4a3e3d" stroke-width="2.5" />
      <circle cx="78" cy="56" r="6" fill="#ff8a5c" stroke="#4a3e3d" stroke-width="2.5" />
      <!-- Body (Cute blob) -->
      <circle cx="50" cy="52" r="32" fill="#ff8a5c" stroke="#4a3e3d" stroke-width="3" />
      <!-- Inner Tummy -->
      <ellipse cx="50" cy="62" rx="18" ry="12" fill="#fff0e8" />
      <!-- Big Cute Eyes -->
      <!-- Left Eye -->
      <circle cx="40" cy="46" r="6" fill="#4a3e3d" />
      <circle cx="38" cy="44" r="2" fill="white" />
      <circle cx="42" cy="48" r="0.8" fill="white" />
      <!-- Right Eye -->
      <circle cx="60" cy="46" r="6" fill="#4a3e3d" />
      <circle cx="58" cy="44" r="2" fill="white" />
      <circle cx="62" cy="48" r="0.8" fill="white" />
      <!-- Blushing Cheeks -->
      <ellipse cx="34" cy="54" rx="4" ry="2.5" fill="#ff758f" opacity="0.6" />
      <ellipse cx="66" cy="54" rx="4" ry="2.5" fill="#ff758f" opacity="0.6" />
      <!-- Cute Mouth -->
      <path d="M46 54 Q50 58 54 54" fill="none" stroke="#4a3e3d" stroke-width="3" stroke-linecap="round" />
    </svg>
  `;
  
  // Create wrapper
  container.innerHTML = `<div class="buddy-avatar-wrapper">${svgContent}</div>`;
  
  // Render Accessories on top of the avatar
  const wrapper = container.querySelector(".buddy-avatar-wrapper");
  
  state.equippedAccessories.forEach(accId => {
    const acc = SHOP_ITEMS.find(item => item.id === accId);
    if (!acc) return;
    
    const accEl = document.createElement("div");
    accEl.className = `buddy-accessory acc-${accId}`;
    accEl.textContent = acc.emoji;
    
    // Position accessories beautifully using custom inline styling
    let styleText = "position: absolute; font-size: 34px; pointer-events: none; text-shadow: 1px 1px 0 #4a3e3d, -1px -1px 0 #4a3e3d;";
    if (accId === "hat") {
      styleText += "top: -12px; left: 18px; transform: rotate(-5deg); z-index: 10;";
    } else if (accId === "crown") {
      styleText += "top: -14px; left: 24px; font-size: 30px; z-index: 10; animation: float 3s ease-in-out infinite;";
    } else if (accId === "glasses") {
      styleText += "top: 26px; left: 21px; font-size: 34px; z-index: 8;";
    } else if (accId === "ribbon") {
      styleText += "top: 50px; left: 34px; font-size: 26px; z-index: 9;";
    } else if (accId === "apple") {
      styleText += "top: -10px; left: 26px; font-size: 30px; z-index: 10;";
    } else if (accId === "cat_ears") {
      styleText += "top: -6px; left: 20px; font-size: 38px; z-index: 7;";
    }
    
    accEl.style.cssText = styleText;
    wrapper.appendChild(accEl);
  });
}

// Render Badges in Home Screen
function renderBadgesDashboard() {
  const container = document.getElementById("badges-grid-home");
  if (!container) return;
  
  container.innerHTML = "";
  
  BADGES.forEach(badge => {
    const isUnlocked = state.badges.includes(badge.id);
    const badgeEl = document.createElement("div");
    badgeEl.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
    badgeEl.title = badge.desc;
    
    badgeEl.innerHTML = `
      <div class="badge-icon-wrapper">
        ${isUnlocked ? badge.emoji : '🔒'}
      </div>
      <div class="badge-name">${badge.name}</div>
    `;
    
    // Clicking on badge shows a cute description alert!
    badgeEl.addEventListener("click", () => {
      showModalMessage(
        `${badge.emoji} ${badge.name}`,
        `<p style="text-align:center; font-size: 16px; margin-bottom: 8px;"><strong>${badge.desc}</strong></p>
         <p style="text-align:center; color: var(--color-text-light);">${isUnlocked ? 'もうアンロックできているよ！さすが！✨' : 'たくさん読書してアンロックしよう！🗝️'}</p>`
      );
    });
    
    container.appendChild(badgeEl);
  });
}

// Set up UI Event Listeners
function setupEventListeners() {
  // Manual Input Register Toggle
  const btnShowManual = document.getElementById("btn-show-manual");
  const manualForm = document.getElementById("manual-register-form");
  if (btnShowManual && manualForm) {
    btnShowManual.addEventListener("click", () => {
      manualForm.style.display = manualForm.style.display === "none" ? "flex" : "none";
      btnShowManual.textContent = manualForm.style.display === "none" ? "🖋️ 手入力で登録する" : "❌ 手入力を閉じる";
    });
  }

  // Scanner Screen Buttons
  const btnStartScan = document.getElementById("btn-start-scan");
  if (btnStartScan) {
    btnStartScan.addEventListener("click", () => {
      startScanner();
    });
  }
  
  const btnStopScan = document.getElementById("btn-stop-scan");
  if (btnStopScan) {
    btnStopScan.addEventListener("click", () => {
      stopScanner();
    });
  }

  // Register manual book
  const formManual = document.getElementById("form-manual-book");
  if (formManual) {
    formManual.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("manual-title").value.trim();
      const author = document.getElementById("manual-author").value.trim() || "しょうにん不明";
      
      if (!title) return;
      
      // Proceed to review screen with manual book
      scannedBookDataTemp = {
        title: title,
        author: author,
        cover: "",
        isbn: ""
      };
      
      formManual.reset();
      manualForm.style.display = "none";
      if (btnShowManual) btnShowManual.textContent = "🖋️ 手入力で登録する";
      
      openReviewScreen();
    });
  }

  // Emotion Stamp Selection
  const stampButtons = document.querySelectorAll(".stamp-btn");
  stampButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      stampButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // Category Selector Selection
  const catButtons = document.querySelectorAll(".cat-btn");
  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      catButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // Save Impression Book Review
  const btnSaveReview = document.getElementById("btn-save-review");
  if (btnSaveReview) {
    btnSaveReview.addEventListener("click", () => {
      saveBookReview();
    });
  }

  // Save API Key Setting
  const btnSaveSetting = document.getElementById("btn-save-setting");
  if (btnSaveSetting) {
    btnSaveSetting.addEventListener("click", () => {
      const apiKey = document.getElementById("api-key-input").value.trim();
      state.geminiApiKey = apiKey;
      saveState();
      showToast("⚙️ 設定を保存したよ！");
    });
  }

  // Delete API Key Button
  const btnDeleteSetting = document.getElementById("btn-delete-setting");
  if (btnDeleteSetting) {
    btnDeleteSetting.addEventListener("click", () => {
      document.getElementById("api-key-input").value = "";
      state.geminiApiKey = "";
      saveState();
      showToast("🗑️ APIキーを消去したよ！");
    });
  }

  // Backup & Restore
  const btnExport = document.getElementById("btn-export-data");
  if (btnExport) {
    btnExport.addEventListener("click", exportData);
  }

  const btnImport = document.getElementById("btn-import-data");
  if (btnImport) {
    btnImport.addEventListener("click", () => {
      document.getElementById("import-file-input").click();
    });
  }

  const fileInput = document.getElementById("import-file-input");
  if (fileInput) {
    fileInput.addEventListener("change", importData);
  }
}

// ----------------------------------------------------
// CAMERA SCAN & API INTEGRATION (openBD & Google Books)
// ----------------------------------------------------

// Start scanning camera
function startScanner() {
  if (html5QrcodeScanner) {
    stopScanner();
  }
  
  document.getElementById("scan-placeholder").style.display = "none";
  document.getElementById("scanner-active-wrapper").style.display = "flex";
  
  html5QrcodeScanner = new Html5Qrcode("reader");
  
  // Mobile browsers prefer environment (rear) camera
  const config = { fps: 10, qrbox: { width: 280, height: 180 } };
  
  html5QrcodeScanner.start(
    { facingMode: "environment" },
    config,
    onScanSuccess,
    onScanFailure
  ).catch(err => {
    console.error("Camera access error:", err);
    showModalMessage("カメラエラー", "カメラの起動に失敗しました。カメラの利用権限を許可するか、手入力フォームをご利用ください。");
    stopScanner();
  });
}

// Stop Scanner
function stopScanner() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(() => {
      html5QrcodeScanner = null;
      document.getElementById("scan-placeholder").style.display = "block";
      document.getElementById("scanner-active-wrapper").style.display = "none";
    }).catch(err => {
      console.error("Failed to stop scanner", err);
      html5QrcodeScanner = null;
    });
  }
}

// Successfully scanned ISBN barcode
function onScanSuccess(decodedText, decodedResult) {
  // Beep or vibrate device
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
  
  // Stop scanner immediately
  stopScanner();
  
  // Validate if it is ISBN (usually starts with 978 or 979 for books)
  const isbn = decodedText.replace(/[^0-9]/g, "");
  if (isbn.length !== 13) {
    showModalMessage("あれれ？", "本のバーコード（13ケタの数字）をスキャンしてくださいね。");
    return;
  }
  
  scannedIsbnTemp = isbn;
  fetchBookInfo(isbn);
}

function onScanFailure(error) {
  // Silent fail during scanning as it scans continuously
}

// Fetch Book Info from APIs
async function fetchBookInfo(isbn) {
  showLoading(true, "本をさがしています...");
  
  try {
    // 1. Try openBD API (Best for Japanese books)
    const openbdUrl = `https://api.openbd.jp/v1/get?isbn=${isbn}`;
    const res = await fetch(openbdUrl);
    const data = await res.json();
    
    if (data && data[0]) {
      const entry = data[0];
      const title = entry.summary.title || "なまえのない本";
      const author = entry.summary.author || "しょうにん不明";
      const cover = entry.summary.cover || "";
      
      scannedBookDataTemp = {
        title: title,
        author: author,
        cover: cover,
        isbn: isbn
      };
      
      showLoading(false);
      openReviewScreen();
      return;
    }
    
    // 2. Try Google Books API as fallback
    const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const gRes = await fetch(googleUrl);
    const gData = await gRes.json();
    
    if (gData && gData.items && gData.items[0]) {
      const volumeInfo = gData.items[0].volumeInfo;
      const title = volumeInfo.title || "なまえのない本";
      const author = volumeInfo.authors ? volumeInfo.authors.join(", ") : "しょうにん不明";
      const cover = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : "";
      
      scannedBookDataTemp = {
        title: title,
        author: author,
        cover: cover,
        isbn: isbn
      };
      
      showLoading(false);
      openReviewScreen();
      return;
    }
    
    // Both failed
    showLoading(false);
    showModalMessage("見つかりませんでした", `バーコード「${isbn}」の本の情報が見つかりませんでした。お手数ですが、手入力で登録してください！`);
    document.getElementById("btn-show-manual").click();
    document.getElementById("manual-title").value = "";
    document.getElementById("manual-author").value = "";
  } catch (err) {
    console.error("API error:", err);
    showLoading(false);
    showModalMessage("通信エラー", "本をさがす通信がうまくいきませんでした。電波のいいところで試すか、手入力してください！");
  }
}

// ----------------------------------------------------
// BOOK REVIEW & AI SPEECH GENERATION (Gemini API)
// ----------------------------------------------------

// Open review details registration screen
function openReviewScreen() {
  if (!scannedBookDataTemp) return;
  
  // Set UI elements in the review screen
  document.getElementById("review-book-title").textContent = scannedBookDataTemp.title;
  document.getElementById("review-book-author").textContent = scannedBookDataTemp.author;
  
  const coverEl = document.getElementById("review-book-cover");
  if (scannedBookDataTemp.cover) {
    coverEl.src = scannedBookDataTemp.cover;
    coverEl.style.display = "block";
  } else {
    coverEl.style.display = "none";
  }
  
  // Reset fields
  document.querySelectorAll(".stamp-btn").forEach(btn => btn.classList.remove("selected"));
  document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("selected"));
  document.getElementById("opinion-text").value = "";
  
  // Default selected stamp is Happy
  document.querySelector('.stamp-btn[data-feeling="happy"]').classList.add("selected");
  // Default category is Picture book
  document.querySelector('.cat-btn[data-cat="picture"]').classList.add("selected");
  
  // Direct navigator to scanner screen wrapper or review container. 
  // Let's open the Modal dialog for review since we want to overlay on current screen!
  // Wait, let's show screen-scan-review screen instead of a modal!
  
  hideAllScreens();
  document.getElementById("screen-scan-review").classList.add("active");
}

function hideAllScreens() {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
}

// Save Book Review and Get AI voice!
async function saveBookReview() {
  if (!scannedBookDataTemp) return;
  
  const selectedStampEl = document.querySelector(".stamp-btn.selected");
  const feeling = selectedStampEl ? selectedStampEl.getAttribute("data-feeling") : "happy";
  const feelingEmoji = selectedStampEl ? selectedStampEl.querySelector(".stamp-emoji").textContent : "😄";
  const feelingText = selectedStampEl ? selectedStampEl.querySelector(".stamp-label").textContent : "おもしろかった";
  
  const selectedCatEl = document.querySelector(".cat-btn.selected");
  const category = selectedCatEl ? selectedCatEl.getAttribute("data-cat") : "picture";
  const categoryName = selectedCatEl ? selectedCatEl.textContent : "えほん";
  
  const comment = document.getElementById("opinion-text").value.trim();
  const dateStr = getTodayString();
  
  // Store new book in array
  const newBook = {
    id: "book_" + Date.now(),
    isbn: scannedBookDataTemp.isbn,
    title: scannedBookDataTemp.title,
    author: scannedBookDataTemp.author,
    cover: scannedBookDataTemp.cover,
    feeling: feeling,
    feelingEmoji: feelingEmoji,
    feelingText: feelingText,
    category: category,
    categoryName: categoryName,
    comment: comment,
    date: dateStr
  };
  
  showLoading(true, "よんだーくんがお話しを考えています...");
  
  let aiSpeech = "";
  try {
    aiSpeech = await generateAISpeech(newBook);
  } catch (err) {
    console.error("AI error:", err);
    aiSpeech = generateFallbackSpeech(newBook);
  }
  
  newBook.aiSpeech = aiSpeech;
  state.books.push(newBook);
  
  // Gamification rewards!
  const xpReward = 100;
  const coinReward = comment ? 10 : 5; // Extra 5 coins if they wrote a text review!
  
  state.xp += xpReward;
  state.coins += coinReward;
  
  // Save status
  saveState();
  
  // Trigger animations & popup
  showLoading(false);
  
  // Navigate back to home first, then trigger rewards
  document.querySelector('[data-screen="home"]').click();
  
  // Trigger Confetti!
  triggerConfetti();
  
  // Check Badges & Levels
  const oldLevel = state.level;
  const levelDetails = calculateLevel(state.xp);
  const isLevelUp = levelDetails.level > oldLevel;
  
  // Badge unlock checks
  const unlockedBadges = runBadgeChecks();
  
  // Show standard reading log saved dialog with AI bubble!
  setTimeout(() => {
    showAISpeechModal(newBook, xpReward, coinReward, isLevelUp, levelDetails.level, unlockedBadges);
  }, 400);
}

// AI Speech Generation (Gemini API or Local)
async function generateAISpeech(book) {
  if (!state.geminiApiKey) {
    // No API key, use fallback
    return generateFallbackSpeech(book);
  }
  
  const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.geminiApiKey}`;
  
  const promptText = `
あなたは子ども向けの優しくて可愛い読書応援マスコット（本の妖精）『よんだーくん』です。
子どもが本を読み終わって、感想を記録しました。
以下の情報を元に、子どもに向けて、ひらがな・カタカナを多く使った、ものすごく優しく温かい褒めちぎるメッセージを【140文字以内】で作成してください。

【本の内容】
本のなまえ: ${book.title}
作者: ${book.author}
本のジャンル: ${book.categoryName}

【子どもの記録】
本のきもちスタンプ: ${book.feelingText}（${book.feelingEmoji}）
子どもが書いた感想テキスト: ${book.comment ? `「${book.comment}」` : "（まだ感想は書いていないよ。本が読めてうれしい気持ちだよ）"}

【メッセージ作成のルール】
1. 絶対に否定的なことは言わず、本を読み切ったことや感じた気持ちを「すごい！」「素晴らしい！」と大絶賛してください。
2. ひらがなとカタカナを中心に書いてください。（漢字は最小限に。小学校1年生でも読めるように、「本」「感想」「気持ち」などの簡単な漢字にはふりがなをつけるか、ひらがなで表現してね）
3. 感想テキスト（ある場合）の内容に優しく共感してください。
4. キャラクターとしての元気な口調（語尾に「〜だよ！」「〜だね！」「〜かな？」などをつける）にしてください。
5. 「よんだーくん」以外の第三者として話すのではなく、あなた自身が「よんだーくん」として語りかけてください。
6. 返答には余計な解説や余白、マークダウン記法を含めず、メッセージのみを出力してください。
`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 250,
      temperature: 0.7
    }
  };

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Gemini API request failed");
  }

  const data = await response.json();
  if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text.trim();
  } else {
    throw new Error("Invalid Gemini API response structure");
  }
}

// Local smart rules fallback for AI speech
function generateFallbackSpeech(book) {
  const templates = LOCAL_AI_TEMPLATES[book.feeling] || LOCAL_AI_TEMPLATES.default;
  // Choose random template
  const randIndex = Math.floor(Math.random() * templates.length);
  let template = templates[randIndex];
  
  // Highlights snippets
  let snippet = "さいごまでよめてえらい！";
  if (book.comment) {
    snippet = book.comment.length > 25 ? book.comment.substring(0, 22) + "..." : book.comment;
  } else {
    // If no comment, replace snippet key with feeling description
    snippet = `${book.feelingText}ってきもち`;
  }
  
  // Format string
  let output = template
    .replace(/{title}/g, shortenTitle(book.title, 16))
    .replace(/{snippet}/g, snippet)
    .replace(/{feelingText}/g, book.feelingText);
    
  return output;
}

function shortenTitle(title, max) {
  return title.length > max ? title.substring(0, max - 2) + ".." : title;
}

// ----------------------------------------------------
// GAMIFICATION LOGIC (Badges, Shop, Calendar)
// ----------------------------------------------------

// Run Badge unlocking rules
function runBadgeChecks() {
  const unlockedThisTime = [];
  const currentBadgeIds = state.badges;
  
  // 1. First step: 1 book
  if (state.books.length >= 1 && !currentBadgeIds.includes("first_step")) {
    unlockedThisTime.push("first_step");
  }
  
  // 2. Writer: 1 book with custom text comment
  const hasTextComment = state.books.some(b => b.comment && b.comment.length >= 4);
  if (hasTextComment && !currentBadgeIds.includes("writer")) {
    unlockedThisTime.push("writer");
  }
  
  // 3. Reader Pro: 5 books
  if (state.books.length >= 5 && !currentBadgeIds.includes("reader_pro")) {
    unlockedThisTime.push("reader_pro");
  }
  
  // 4. Reading King: 10 books
  if (state.books.length >= 10 && !currentBadgeIds.includes("reading_king")) {
    unlockedThisTime.push("reading_king");
  }
  
  // 5. Category-based: Adventure
  const hasAdventure = state.books.some(b => b.category === "fantasy" || b.category === "story");
  if (hasAdventure && !currentBadgeIds.includes("adventure")) {
    unlockedThisTime.push("adventure");
  }
  
  // 6. Category-based: Animal
  const hasAnimal = state.books.some(b => b.category === "animal" || b.category === "science");
  if (hasAnimal && !currentBadgeIds.includes("animal")) {
    unlockedThisTime.push("animal");
  }
  
  // 7. Category-based: Picture book
  const hasPicture = state.books.some(b => b.category === "picture");
  if (hasPicture && !currentBadgeIds.includes("picture_book")) {
    unlockedThisTime.push("picture_book");
  }
  
  // 8. Streak 3: 3 consecutive days
  const has3Streak = checkConsecutiveDays(3);
  if (has3Streak && !currentBadgeIds.includes("streak_3")) {
    unlockedThisTime.push("streak_3");
  }
  
  // Save newly unlocked badges
  if (unlockedThisTime.length > 0) {
    state.badges = [...state.badges, ...unlockedThisTime];
    saveState();
  }
  
  return unlockedThisTime;
}

// Check consecutive days of reading
function checkConsecutiveDays(daysCount) {
  if (state.books.length < daysCount) return false;
  
  // Get all unique sorted dates
  const uniqueDates = [...new Set(state.books.map(b => b.date))].sort();
  if (uniqueDates.length < daysCount) return false;
  
  // Look for any window of 'daysCount' consecutive dates
  for (let i = 0; i <= uniqueDates.length - daysCount; i++) {
    let consecutive = true;
    for (let j = 0; j < daysCount - 1; j++) {
      const d1 = new Date(uniqueDates[i + j]);
      const d2 = new Date(uniqueDates[i + j + 1]);
      
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays !== 1) {
        consecutive = false;
        break;
      }
    }
    if (consecutive) return true;
  }
  
  return false;
}

// Render Mascot Accessory Shop
function renderShop() {
  const container = document.getElementById("shop-items-grid");
  if (!container) return;
  
  container.innerHTML = "";
  
  SHOP_ITEMS.forEach(item => {
    const isPurchased = state.purchasedAccessories.includes(item.id);
    const isEquipped = state.equippedAccessories.includes(item.id);
    
    const card = document.createElement("div");
    card.className = `shop-item-card ${isEquipped ? 'equipped' : (isPurchased ? 'purchased' : '')}`;
    
    let btnText = `🛒 ${item.price} コイン`;
    if (isEquipped) {
      btnText = "⭐️ そうび中";
    } else if (isPurchased) {
      btnText = "🎒 そうびする";
    }
    
    card.innerHTML = `
      <div class="shop-item-img">${item.emoji}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-price ${isPurchased ? 'equipped-label' : ''}">
        ${isPurchased ? 'もってるよ' : `🟡 ${item.price}コイン`}
      </div>
      <button class="btn btn-sm ${isEquipped ? 'btn-outline' : (isPurchased ? 'btn-success' : 'btn-primary')}" style="padding: 4px 8px; font-size:11px; margin-top:8px;">
        ${btnText}
      </button>
    `;
    
    card.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      handleShopAction(item);
    });
    
    container.appendChild(card);
  });
  
  // Show large preview mascot on shop screen
  drawMascot("shop-mascot-preview");
}

// Handle Shop Item interactions (buy / equip)
function handleShopAction(item) {
  const isPurchased = state.purchasedAccessories.includes(item.id);
  const isEquipped = state.equippedAccessories.includes(item.id);
  
  if (isEquipped) {
    // Unequip
    state.equippedAccessories = state.equippedAccessories.filter(id => id !== item.id);
    showToast(`🎒 ${item.name}をはずしたよ`);
  } else if (isPurchased) {
    // Equip accessory
    // If equipping exclusive items on same spot, unequip others (e.g. hat / crown / apple are hats; glasses are face)
    if (item.id === "hat" || item.id === "crown" || item.id === "apple") {
      state.equippedAccessories = state.equippedAccessories.filter(id => id !== "hat" && id !== "crown" && id !== "apple");
    }
    state.equippedAccessories.push(item.id);
    showToast(`✨ ${item.name}をそうびしたよ！`);
  } else {
    // Purchase item
    if (state.coins >= item.price) {
      state.coins -= item.price;
      state.purchasedAccessories.push(item.id);
      state.equippedAccessories.push(item.id); // Equip immediately upon purchase
      
      triggerConfetti();
      showToast(`🎉 ${item.name}をかったよ！おそろいだね！`);
    } else {
      showModalMessage("コインが足りないよ", `🟡 あと ${item.price - state.coins} コインで買えるよ。もっと本を読んでコインをためようね！`);
      return;
    }
  }
  
  saveState();
  updateUI();
  renderShop();
}

// Render Bookshelf List
function renderBookshelf() {
  const container = document.getElementById("bookshelf-grid-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (state.books.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / span 3; text-align: center; padding: 40px 20px; color: var(--color-text-light);">
        <p style="font-size: 32px; margin-bottom:12px;">📖</p>
        <p>本棚はまだからっぽだよ。<br>本をスキャンして、最初の１さつを登録しよう！</p>
      </div>
    `;
    return;
  }
  
  // Sort reverse-chronologically by default (newest first)
  const sortedBooks = [...state.books].reverse();
  
  sortedBooks.forEach(book => {
    const bookEl = document.createElement("div");
    bookEl.className = "bookshelf-item";
    
    // Generate beautiful custom cover gradient if no image cover is provided
    let coverImgHtml = "";
    if (book.cover) {
      coverImgHtml = `<img class="bookshelf-cover" src="${book.cover}" alt="cover" loading="lazy">`;
    } else {
      // Premium placeholder cover with gorgeous gradient
      const gradients = [
        "linear-gradient(135deg, #ff8a5c, #ffc93c)",
        "linear-gradient(135deg, #5cbf99, #5cb3ff)",
        "linear-gradient(135deg, #ff758f, #ff8a5c)",
        "linear-gradient(135deg, #5cb3ff, #a3f7d4)"
      ];
      const gIndex = Math.abs(hashCode(book.title)) % gradients.length;
      coverImgHtml = `
        <div class="bookshelf-cover" style="background: ${gradients[gIndex]}; color: white; display: flex; flex-direction:column; justify-content:center; align-items:center; padding: 10px; text-align:center;">
          <span style="font-size:10px; opacity:0.8; font-weight:normal;">${book.categoryName || 'よみもの'}</span>
          <p style="font-size:10px; font-weight:900; line-height:1.2; margin-top:4px; max-height: 48px; overflow:hidden;">${shortenTitle(book.title, 20)}</p>
          <span style="font-size:24px; margin-top:6px;">📖</span>
        </div>
      `;
    }
    
    bookEl.innerHTML = `
      <div class="bookshelf-cover-wrapper">
        ${coverImgHtml}
      </div>
      <div class="bookshelf-item-title">${book.title}</div>
      <div class="bookshelf-item-author">${book.author}</div>
    `;
    
    bookEl.addEventListener("click", () => {
      showBookDetailModal(book);
    });
    
    container.appendChild(bookEl);
  });
}

// Helper to hash title for consistent cover gradients
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Render Reading Calendar Stamped Grid
function renderCalendar() {
  const container = document.getElementById("calendar-grid-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  
  // Set Calendar Title
  document.getElementById("calendar-month-title").textContent = `${year}年 ${month + 1}月`;
  
  // Get first day of month and total days
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Render calendar headers
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  dayNames.forEach(d => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-header-day";
    dayHeader.textContent = d;
    container.appendChild(dayHeader);
  });
  
  // Empty slots for days before 1st of month
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    container.appendChild(emptyCell);
  }
  
  // Render days of the month
  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    dayCell.textContent = day;
    
    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check if user read books on this day
    const readOnThisDay = state.books.filter(b => b.date === cellDateStr);
    
    if (readOnThisDay.length > 0) {
      dayCell.classList.add("read");
      
      // Stamp icon
      const stampEl = document.createElement("div");
      stampEl.className = "calendar-stamp";
      
      // Collect feeling emoji or default star
      stampEl.textContent = readOnThisDay[0].feelingEmoji || "⭐";
      dayCell.appendChild(stampEl);
      
      // Click shows what they read!
      dayCell.style.cursor = "pointer";
      dayCell.addEventListener("click", () => {
        const titles = readOnThisDay.map(b => `『${b.title}』`).join("、");
        showModalMessage(`${month + 1}月${day}日に読んだ本`, `<p style="text-align:center; font-size: 15px;">${titles}<br>をよんだよ！がんばったね！🌟</p>`);
      });
    }
    
    // Highlight today
    const todayStr = getTodayString();
    if (cellDateStr === todayStr) {
      dayCell.classList.add("today");
    }
    
    container.appendChild(dayCell);
  }
}

// ----------------------------------------------------
// UI UTILITIES & DIALOG MODALS
// ----------------------------------------------------

// Show / Hide Loading Overlay
function showLoading(show, message = "ロード中...") {
  const loader = document.getElementById("loading-overlay");
  if (!loader) return;
  
  document.getElementById("loading-text").textContent = message;
  loader.style.display = show ? "flex" : "none";
}

// Trigger Confetti Effect (Uses canvas-confetti)
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff8a5c', '#ffc93c', '#5cbf99', '#ff758f', '#5cb3ff']
    });
  }
}

// Simple Toast popup message
function showToast(message) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 96px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-text-dark);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 900;
    z-index: 9999;
    box-shadow: var(--shadow-md);
    animation: fadeIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "scaleUp 0.3s reverse ease";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Standard Information Modal popup
function showModalMessage(title, htmlContent) {
  const modal = document.getElementById("info-modal");
  if (!modal) return;
  
  document.getElementById("info-modal-title").textContent = title;
  document.getElementById("info-modal-body").innerHTML = htmlContent;
  
  modal.classList.add("active");
  
  const closeBtn = modal.querySelector(".modal-close-btn");
  const closeAction = () => {
    modal.classList.remove("active");
    closeBtn.removeEventListener("click", closeAction);
  };
  closeBtn.addEventListener("click", closeAction);
}

// Specific AI speech response popup
function showAISpeechModal(book, xpReward, coinReward, isLevelUp, newLevel, unlockedBadges) {
  const modal = document.getElementById("info-modal");
  if (!modal) return;
  
  document.getElementById("info-modal-title").textContent = "よんだーくんからのこえかけ";
  
  // Custom dialog HTML
  let badgeHtml = "";
  if (unlockedBadges && unlockedBadges.length > 0) {
    unlockedBadges.forEach(badgeId => {
      const b = BADGES.find(x => x.id === badgeId);
      if (b) {
        badgeHtml += `
          <div style="background-color: var(--color-secondary-light); border: 2px solid var(--color-secondary); border-radius: 12px; padding: 12px; margin-top: 12px; text-align: center; animation: float 3s ease-in-out infinite;">
            <span style="font-size: 32px;">${b.emoji}</span>
            <h4 style="color:var(--color-text-dark); font-weight:900; margin: 4px 0;">バッジ解放！「${b.name}」</h4>
            <p style="font-size: 11px; color:var(--color-text-light);">${b.desc}</p>
          </div>
        `;
      }
    });
  }

  let levelUpHtml = "";
  if (isLevelUp) {
    levelUpHtml = `
      <div style="background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); border-radius: 12px; padding: 12px; margin-top: 12px; text-align: center; color: white; box-shadow: var(--shadow-md);">
        <span style="font-size: 32px;">🆙</span>
        <h4 style="font-weight:900; margin: 4px 0;">レベルアップ！</h4>
        <p style="font-size: 12px;">読書レベルが <strong>レベル ${newLevel}</strong> になったよ！</p>
        <span style="font-size: 11px; opacity:0.9;">ボーナスコイン ＋10🟡 をもらったよ！</span>
      </div>
    `;
    // Level up reward coins!
    state.coins += 10;
    saveState();
    updateUI();
  }

  const bodyHtml = `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; align-items:center; gap:12px; background-color: var(--color-primary-light); padding:10px; border-radius:12px; border:1.5px solid var(--color-border);">
        <img src="${book.cover}" alt="cover" style="width: 48px; height: 68px; object-fit:cover; border-radius:6px; box-shadow:var(--shadow-sm); display: ${book.cover ? 'block' : 'none'};">
        <div>
          <div style="font-weight:900; font-size:14px; color:var(--color-text-dark);">${shortenTitle(book.title, 24)}</div>
          <span style="font-size:11px; color:var(--color-text-light);">${book.author}</span>
        </div>
      </div>
      
      <!-- Mascot Speech Bubble -->
      <div style="display:flex; gap:12px; align-items:flex-start;">
        <div style="width: 50px; height: 50px; flex-shrink:0; position:relative;" id="modal-speech-mascot-container">
          <!-- Small dynamic mascot avatar -->
        </div>
        <div style="background-color: white; border: 2px solid var(--color-primary); border-radius: 16px; padding: 12px 14px; font-size: 13px; line-height: 1.5; color: var(--color-text-dark); position: relative; flex:1; box-shadow: var(--shadow-sm);">
          ${book.aiSpeech}
        </div>
      </div>
      
      <!-- Rewards box -->
      <div style="display:flex; justify-content:space-around; align-items:center; background-color:#fcfcfc; border:2px dashed var(--color-border); border-radius:12px; padding:12px; margin-top:8px;">
        <div style="text-align:center;">
          <div style="font-size:20px; font-weight:900; color:var(--color-primary);">+${xpReward}</div>
          <div style="font-size:10px; color:var(--color-text-light);">よんどくパワー(XP)</div>
        </div>
        <div style="width:2px; height:24px; background-color:var(--color-border);"></div>
        <div style="text-align:center;">
          <div style="font-size:20px; font-weight:900; color:#ffaa00;">+${coinReward}🟡</div>
          <div style="font-size:10px; color:var(--color-text-light);">よんだコイン</div>
        </div>
      </div>
      
      ${levelUpHtml}
      ${badgeHtml}
    </div>
  `;
  
  document.getElementById("info-modal-body").innerHTML = bodyHtml;
  
  // Render little avatar in popup
  drawMascot("modal-speech-mascot-container");
  
  modal.classList.add("active");
  
  const closeBtn = modal.querySelector(".modal-close-btn");
  const closeAction = () => {
    modal.classList.remove("active");
    closeBtn.removeEventListener("click", closeAction);
    updateUI();
  };
  closeBtn.addEventListener("click", closeAction);
}

// Show Book Details from Book Shelf
function showBookDetailModal(book) {
  const modal = document.getElementById("info-modal");
  if (!modal) return;
  
  document.getElementById("info-modal-title").textContent = "よんだきろく";
  
  // Custom cover or placeholder
  let coverHtml = "";
  if (book.cover) {
    coverHtml = `<img class="modal-detail-cover" src="${book.cover}" alt="cover">`;
  } else {
    coverHtml = `
      <div class="modal-detail-cover" style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: white; display: flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding: 20px;">
        <span style="font-size:13px; opacity:0.8;">${book.categoryName}</span>
        <h4 style="font-size:13px; font-weight:900; margin-top:8px;">${shortenTitle(book.title, 30)}</h4>
        <span style="font-size:36px; margin-top:12px;">📖</span>
      </div>
    `;
  }
  
  const bodyHtml = `
    <div style="display:flex; flex-direction:column; align-items:stretch;">
      ${coverHtml}
      <h3 class="modal-detail-title">${book.title}</h3>
      <p class="modal-detail-author">${book.author}</p>
      
      <div style="display:flex; gap:8px; align-items:center; margin-bottom: 12px; justify-content:center;">
        <span style="background-color: var(--color-primary-light); border:1.5px solid var(--color-primary); color:var(--color-primary); padding:2px 10px; border-radius:12px; font-size:11px; font-weight:900;">
          ${book.feelingEmoji} ${book.feelingText}
        </span>
        <span style="background-color: var(--color-success-light); border:1.5px solid var(--color-success); color:var(--color-success); padding:2px 10px; border-radius:12px; font-size:11px; font-weight:900;">
          🎨 ${book.categoryName}
        </span>
        <span style="background-color:#f5f0eb; border:1.5px solid #dcd0c4; color:var(--color-text-light); padding:2px 10px; border-radius:12px; font-size:11px; font-weight:900;">
          📅 ${book.date}
        </span>
      </div>
      
      <div class="modal-detail-review-box">
        <strong style="font-size:11px; color:var(--color-primary); display:block; margin-bottom:4px;">✏️ きみの感想</strong>
        <p style="line-height:1.5; font-size:13px;">${book.comment || '感想は書かなかったよ！でも、よめてえらい！🌟'}</p>
      </div>
      
      <!-- Speech bubble detail -->
      <div style="display:flex; gap:12px; align-items:flex-start; margin-top:6px;">
        <div style="width: 44px; height: 44px; flex-shrink:0; position:relative;" id="modal-speech-mascot-container-detail">
          <!-- small mascot -->
        </div>
        <div style="background-color: white; border: 2px solid var(--color-primary); border-radius: 16px; padding: 10px 12px; font-size: 12px; line-height: 1.4; color: var(--color-text-dark); position: relative; flex:1; box-shadow: var(--shadow-sm);">
          <strong style="color:var(--color-primary); font-size:10px; display:block; margin-bottom:2px;">🦊 よんだーくんからの声かけ</strong>
          ${book.aiSpeech}
        </div>
      </div>
      
      <button class="btn btn-outline" id="btn-delete-book" style="margin-top:20px; padding:8px; font-size:12px; color: var(--color-accent); border-color:var(--color-border);">
        🗑️ この記録をけす
      </button>
    </div>
  `;
  
  document.getElementById("info-modal-body").innerHTML = bodyHtml;
  drawMascot("modal-speech-mascot-container-detail");
  
  modal.classList.add("active");
  
  const closeBtn = modal.querySelector(".modal-close-btn");
  const closeAction = () => {
    modal.classList.remove("active");
    closeBtn.removeEventListener("click", closeAction);
  };
  closeBtn.addEventListener("click", closeAction);
  
  // Setup delete button action
  const btnDelete = document.getElementById("btn-delete-book");
  if (btnDelete) {
    btnDelete.addEventListener("click", () => {
      if (confirm("この本の読書記録を消してもいいですか？獲得したコインやレベルはそのまま残ります。")) {
        state.books = state.books.filter(b => b.id !== book.id);
        saveState();
        modal.classList.remove("active");
        renderBookshelf();
        showToast("🗑️ 記録を消去したよ");
      }
    });
  }
}

// ----------------------------------------------------
// DATA BACKUP & RESTORE FUNCTIONS
// ----------------------------------------------------

// Export data as JSON file for download
function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
  const dlAnchorElem = document.createElement("a");
  
  const dateStr = getTodayString().replace(/-/g, "");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `yondabuddy_backup_${dateStr}.json`);
  dlAnchorElem.click();
}

// Import data from selected JSON file
function importData(e) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedState = JSON.parse(event.target.result);
      
      // Basic format validation
      if (importedState && (importedState.books !== undefined || importedState.coins !== undefined)) {
        state = {
          books: importedState.books || [],
          coins: importedState.coins || 0,
          xp: importedState.xp || 0,
          level: importedState.level || 1,
          purchasedAccessories: importedState.purchasedAccessories || [],
          equippedAccessories: importedState.equippedAccessories || [],
          badges: importedState.badges || [],
          geminiApiKey: importedState.geminiApiKey || ""
        };
        
        saveState();
        updateUI();
        showToast("📂 データの読み込みができたよ！");
      } else {
        alert("ファイルの形式が正しくありません。");
      }
    } catch (err) {
      console.error(err);
      alert("ファイルの読み込み中にエラーが発生しました。");
    }
  };
  
  if (e.target.files && e.target.files[0]) {
    fileReader.readAsText(e.target.files[0]);
  }
}

// Helper: Get Today's Date String in YYYY-MM-DD
function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
