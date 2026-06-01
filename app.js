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

// Mascot Accessories Database (Expanded to 28 parts in Head, Eyes, Clothes, Hand, and Room categories)
const SHOP_ITEMS = [
  // HEAD ACCESSORIES (hat slot)
  { id: "hat", name: "鬲疲ｳ輔・縺ｼ縺・＠", emoji: "自", price: 10, type: "head" },
  { id: "crown", name: "縺阪ｉ縺阪ｉ邇九°繧・, emoji: "荘", price: 30, type: "head" },
  { id: "apple", name: "繧翫ｓ縺斐・縺ｼ縺・＠", emoji: "克", price: 12, type: "head" },
  { id: "cat_ears", name: "縺ｭ縺薙∩縺ｿ", emoji: "棲", price: 20, type: "head" },
  { id: "pirate_hat", name: "縺九＞縺槭￥縺ｮ縺ｼ縺・＠", emoji: "抄窶坂丐・・, price: 18, type: "head" },
  { id: "chef_hat", name: "繧ｳ繝・け縺輔ｓ縺ｮ縺ｼ縺・＠", emoji: "捉窶昨沚ｳ", price: 15, type: "head" },
  { id: "straw_hat", name: "繧縺弱ｏ繧峨⊂縺・＠", emoji: "葬", price: 8, type: "head" },
  { id: "ninja_band", name: "縺ｫ繧薙§繧・・繝上メ繝槭く", emoji: "･ｷ", price: 25, type: "head" },
  
  // FACE ACCESSORIES (eyes slot)
  { id: "glasses", name: "繧ｵ繝ｳ繧ｰ繝ｩ繧ｹ", emoji: "文・・, price: 15, type: "eyes" },
  { id: "pink_glasses", name: "縺ｾ繧九ａ縺後・", emoji: "蒼", price: 10, type: "eyes" },
  { id: "stars_eyes", name: "縺頑弌縺輔∪縺ｮ逶ｮ", emoji: "､ｩ", price: 22, type: "eyes" },
  { id: "monocle", name: "縺九◆繧縺阪ａ縺後・", emoji: "ｧ・, price: 18, type: "eyes" },
  
  // BODY ACCESSORIES (clothes slot)
  { id: "ribbon", name: "縺九ｏ縺・＞繝ｪ繝懊Φ", emoji: "死", price: 8, type: "clothes" },
  { id: "cape", name: "鬲疲ｳ輔・繝槭Φ繝・, emoji: "ｧ･", price: 20, type: "clothes" },
  { id: "tie", name: "襍､縺・ロ繧ｯ繧ｿ繧､", emoji: "藻", price: 12, type: "clothes" },
  { id: "scarf", name: "繧ゅ％繧ゅ％繝槭ヵ繝ｩ繝ｼ", emoji: "ｧ｣", price: 14, type: "clothes" },
  { id: "armor", name: "蜍・・・繧医ｍ縺・, emoji: "孱・・, price: 35, type: "clothes" },
  
  // HAND ACCESSORIES (hand slot)
  { id: "wand", name: "鬲疲ｳ輔・縺､縺・, emoji: "ｪ・, price: 15, type: "hand" },
  { id: "sword", name: "縺翫ｂ縺｡繧・・縺代ｓ", emoji: "笞費ｸ・, price: 22, type: "hand" },
  { id: "book_hold", name: "縺｡縺・＆縺ｪ譛ｬ", emoji: "祷", price: 10, type: "hand" },
  { id: "lantern", name: "繝斐き繝斐き繝ｩ繝ｳ繧ｿ繝ｳ", emoji: "尚", price: 18, type: "hand" },
  { id: "balloon", name: "襍､縺・・縺・○繧・, emoji: "肢", price: 8, type: "hand" },
  
  // ROOM ACCESSORIES (room slot)
  { id: "room_forest", name: "譽ｮ譫励・縺企Κ螻・, emoji: "鹸", price: 15, type: "room" },
  { id: "room_space", name: "螳・ｮ吶・縺企Κ螻・, emoji: "血", price: 25, type: "room" },
  { id: "room_castle", name: "縺雁沁縺ｮ縺企Κ螻・, emoji: "床", price: 35, type: "room" },
  { id: "room_sea", name: "豬ｷ縺ｮ縺ｪ縺九・縺企Κ螻・, emoji: "穴", price: 20, type: "room" },
  { id: "room_sweet", name: "縺翫°縺励・縺企Κ螻・, emoji: "根", price: 25, type: "room" },
  { id: "room_camp", name: "繧ｭ繝｣繝ｳ繝励・縺企Κ螻・, emoji: "笵ｺ", price: 18, type: "room" },
  { id: "room_sakura", name: "縺輔￥繧峨・縺企Κ螻・, emoji: "減", price: 22, type: "room" }
];
// Badge Database (Expanded to 27 achievements covering reading metrics, text reviews, streaks, shop accessories, level milestones, wishlist interactions)
const BADGES = [
  // 1. Reading Volumes Milestones
  { id: "first_step", name: "縺ｯ縺倥ａ縺ｦ縺ｮ荳豁ｩ", emoji: "験", desc: "縺ｯ縺倥ａ縺ｦ譛ｬ繧堤匳骭ｲ縺励◆繧茨ｼ・ },
  { id: "reader_pro", name: "繧医∩縺阪ｊ蜷堺ｺｺ", emoji: "当", desc: "譛ｬ繧・縺輔▽逋ｻ骭ｲ縺励◆繧茨ｼ・ },
  { id: "reading_king", name: "隱ｭ譖ｸ縺翫≧縺輔∪", emoji: "荘", desc: "譛ｬ繧・0縺輔▽逋ｻ骭ｲ縺励◆繧茨ｼ・ },
  { id: "reading_god", name: "繧医∩縺阪ｊ縺ｮ逾槭＆縺ｾ", emoji: "笨ｨ", desc: "譛ｬ繧・5縺輔▽逋ｻ骭ｲ縺励◆繧茨ｼ・ },
  
  // 2. Writing Review Milestones
  { id: "writer", name: "縺九ｓ縺昴≧螳ｶ繝・ン繝･繝ｼ", emoji: "笨搾ｸ・, desc: "縺ｯ縺倥ａ縺ｦ諢滓Φ繧偵°縺・◆繧茨ｼ・ },
  { id: "critic", name: "縺ｲ繧・≧縺句錐莠ｺ", emoji: "統", desc: "諢滓Φ繧・蝗槭°縺・◆繧茨ｼ・ },
  { id: "novelist", name: "縺翫・縺ｪ縺嶺ｽ懷ｮｶ", emoji: "幕・・, desc: "諢滓Φ繧・0蝗槭°縺・◆繧茨ｼ・ },
  
  // 3. Category/Genre Mastery
  { id: "picture_book", name: "縺医⊇繧薙・繧ｹ繧ｿ繝ｼ", emoji: "耳", desc: "縺医⊇繧薙・縺壹°繧薙ｒ隱ｭ繧薙□繧茨ｼ・ },
  { id: "adventure", name: "縺ｼ縺・￠繧鍋視", emoji: "ｧｭ", desc: "縺翫・縺ｪ縺励・縺ｼ縺・￠繧薙ｒ隱ｭ繧薙□繧茨ｼ・ },
  { id: "animal", name: "縺・″繧ゅ・繝峨け繧ｿ繝ｼ", emoji: "ｦ・, desc: "縺ｩ縺・・縺､繝ｻ縺・″繧ゅ・繧定ｪｭ繧薙□繧茨ｼ・ },
  { id: "science_fan", name: "縺九′縺上・縺九○", emoji: "溌", desc: "縺九′縺上・縺励ｃ縺九＞繧定ｪｭ繧薙□繧茨ｼ・ },
  { id: "other_fan", name: "繧ゅ・縺励ｊ縺ｯ縺九○", emoji: "庁", desc: "縺昴・莉悶ず繝｣繝ｳ繝ｫ縺ｮ譛ｬ繧定ｪｭ繧薙□繧茨ｼ・ },
  { id: "all_genres", name: "蜈ｨ繧ｸ繝｣繝ｳ繝ｫ繧医ｓ縺・・, emoji: "遵", desc: "4縺､莉･荳翫・繧ｸ繝｣繝ｳ繝ｫ繧定ｪｭ繧薙□繧茨ｼ・ },
  
  // 4. Reading Streak Habits
  { id: "streak_3", name: "3譌･騾｣邯壹ｈ繧薙□・・, emoji: "櫨", desc: "3譌･騾｣邯壹〒隱ｭ譖ｸ繧定ｨ倬鹸縺励◆繧茨ｼ・ },
  { id: "streak_5", name: "5譌･騾｣邯壹ｈ繧薙□・・, emoji: "笞｡", desc: "5譌･騾｣邯壹〒隱ｭ譖ｸ繧定ｨ倬鹸縺励◆繧茨ｼ・ },
  { id: "streak_7", name: "1騾ｱ髢薙ｈ縺ｿ縺阪▲縺滂ｼ・, emoji: "決", desc: "7譌･騾｣邯壹〒隱ｭ譖ｸ繧定ｨ倬鹸縺励◆繧茨ｼ・ },
  
  // 5. Coin Rewards
  { id: "coin_rich", name: "繧ｳ繧､繝ｳ謖√■", emoji: "腸", desc: "繧ｳ繧､繝ｳ繧・0譫壹◆繧√◆繧茨ｼ・ },
  { id: "coin_millionaire", name: "螟ｧ縺九・謖√■", emoji: "虫", desc: "繧ｳ繧､繝ｳ繧・00譫壹◆繧√◆繧茨ｼ・ },
  
  // 6. Mascot Customization & Room Makeovers
  { id: "fashion_beginner", name: "繧ｪ繧ｷ繝｣繝ｬ蜈･髢", emoji: "自", desc: "繧ｷ繝ｧ繝・・縺ｧ繧｢繧､繝・Β繧・縺､謇九↓蜈･繧後◆繧茨ｼ・ },
  { id: "fashion_model", name: "繧ｪ繧ｷ繝｣繝ｬ縺ｮ驕比ｺｺ", emoji: "ｧ･", desc: "繧ｷ繝ｧ繝・・縺ｧ繧｢繧､繝・Β繧・縺､謇九↓蜈･繧後◆繧茨ｼ・ },
  { id: "fashion_king", name: "縺阪○縺九∴螟ｧ縺翫≧", emoji: "荘", desc: "繧ｷ繝ｧ繝・・縺ｧ繧｢繧､繝・Β繧・0縺､謇九↓蜈･繧後◆繧茨ｼ・ },
  { id: "room_decorator", name: "縺企Κ螻九ョ繧ｶ繧､繝翫・", emoji: "笵ｺ", desc: "縺企Κ螻九・縺阪○縺九∴繧偵・縺倥ａ縺ｦ縺翫％縺ｪ縺｣縺溘ｈ・・ },
  
  // 7. Reading Level Milestones
  { id: "level_5", name: "繝ｬ繝吶Ν5縺ｫ縺ｪ縺｣縺溘ｈ", emoji: "醇", desc: "繧医ｓ縺ｩ縺上Ξ繝吶Ν縺・縺ｫ縺ｪ縺｣縺滂ｼ・ },
  { id: "level_10", name: "繝ｬ繝吶Ν10螟ｧ縺ｾ縺ｻ縺・▽縺九＞", emoji: "ｧ・, desc: "繧医ｓ縺ｩ縺上Ξ繝吶Ν縺・0縺ｫ縺ｪ縺｣縺滂ｼ√☆縺斐☆縺弱ｋ・・ },
  
  // 8. Wishlist Discoveries
  { id: "wishlist_fan", name: "繧医∩縺溘＞謗｢豎り・, emoji: "剥", desc: "縺翫☆縺吶ａ譛ｬ繧・縺輔▽繧医∩縺溘＞繝ｪ繧ｹ繝医↓蜈･繧後◆繧茨ｼ・ },
  { id: "wishlist_fulfilled", name: "螟｢縺後°縺ｪ縺｣縺滂ｼ・, emoji: "氏", desc: "隕ｪ縺ｫ雋ｷ縺｣縺ｦ繧ゅｉ縺｣縺滓悽繝ｪ繧ｹ繝医°繧・縺輔▽豸亥悉縺輔ｌ縺滂ｼ・ }
];
// Cute Encouraging Speeches for "よんだーくん" Default Mode
const LOCAL_AI_TEMPLATES = {
  happy: [
    "繧上≠・√施title}縲上ｒ繧医ｓ縺ｧ繝ｯ繧ｯ繝ｯ繧ｯ縺励◆繧薙□縺ｭ・√鶏snippet}縲阪▲縺ｦ縺九＞縺ｦ縺上ｌ縺溘→縺薙ｍ縲√ｈ繧薙□繝ｼ縺上ｓ繧ょ､ｧ縺吶″縺繧茨ｼ√％縺ｮ譛ｬ繧偵ｈ繧薙〒縲√→縺｣縺ｦ繧ゅワ繝・ヴ繝ｼ縺ｪ縺阪ｂ縺｡縺ｫ縺ｪ繧後◆縺ｮ縲√⊇繧薙→縺・↓縺吶※縺阪↑縺薙→縺縺ｭ・Å沍ｸ",
    "縺吶※縺阪↑縺九ｓ縺昴≧縺ゅｊ縺後→・√施title}縲上・縺吶▲縺斐￥縺翫ｂ縺励ｍ縺・悽縺繧医・・√鶏snippet}縲阪▲縺ｦ縺ゅｋ縺ｨ縺薙ｍ縲√ｈ繧薙□繝ｼ縺上ｓ繧りｪｭ縺ｿ縺溘￥縺ｪ縺｣縺｡繧・▲縺滂ｼ√″縺ｿ縺ｮ繧ｭ繝ｩ繧ｭ繝ｩ縺励◆逶ｮ縺檎岼縺ｫ豬ｮ縺九・繧茨ｼÅ汨笨ｨ",
    "縺翫ｂ縺励ｍ縺・悽縺ｫ蜃ｺ莨壹∴縺ｦ繧医°縺｣縺溘・・√施title}縲上ｒ繧医ｓ縺ｧ縲√鶏snippet}縲阪▲縺ｦ縺阪▼縺代ｋ縺ｪ繧薙※縲√″縺ｿ縺ｯ繧ゅ≧繧翫▲縺ｱ縺ｪ隱ｭ譖ｸ縺ｮ繝励Ο縺繧茨ｼ√▽縺弱・譛ｬ繧ゅｏ縺上ｏ縺上＠縺｡繧・≧縺ｭ・Å沁・
  ],
  sad: [
    "縲施title}縲上ｒ繧医ｓ縺ｧ縲√☆縺薙＠縺帙▽縺ｪ縺・″繧ゅ■縺ｫ縺ｪ縺｣縺溘ｓ縺縺ｭ縲よ悽縺ｮ縺ｪ縺九・縺薙→縺ｰ繧・〒縺阪＃縺ｨ縺ｫ縲√＠縺｣縺九ｊ縺阪ｂ縺｡繧偵ｈ繧翫◎繧上○繧九％縺ｨ縺後〒縺阪◆縺ｮ縲√→縺｣縺ｦ繧ゅｄ縺輔＠縺・ｪｭ譖ｸ螳ｶ縺輔ｓ縺繧茨ｼ√ｄ縺輔＠縺・″縺ｿ縺ｫ縺ｪ繧後※邏譎ｴ繧峨＠縺・ｼÅ沍ｸ",
    "縺九↑縺励＞縺翫・縺ｪ縺励□縺｣縺溘ｓ縺縺ｭ縲ゅ〒繧ゅ√◎縺ｮ縺九↑縺励＆繧偵鶏snippet}縲阪▲縺ｦ縺阪∩縺ｮ縺薙→縺ｰ縺ｧ譖ｸ縺代ｋ縺ｪ繧薙※縲√⊇繧薙→縺・↓縺吶＃縺・｡ｨ迴ｾ蜉帙□繧茨ｼ∵悽縺ｯ縲√＞繧阪ｓ縺ｪ縺阪ｂ縺｡繧呈蕗縺医※縺上ｌ繧九ゅｈ繧薙□繝ｼ縺上ｓ縺後ぐ繝･繝・→縺励※縺ゅ￡繧具ｼÅ汾ｾ"
  ],
  thrill: [
    "繧上≠・√施title}縲上・縺吶▲縺斐￥縺ｩ縺阪←縺阪☆繧九♀縺ｯ縺ｪ縺励□縺｣縺溘ｓ縺縺ｭ・√鶏snippet}縲阪・縺ｨ縺薙ｍ縺後√ワ繝ｩ繝上Λ縺励※逶ｮ縺後・縺ｪ縺帙↑縺九▲縺溘・縺九↑・溷､ｧ縺ｼ縺・￠繧薙ｒ縺励◆縺ｿ縺溘＞縺ｧ繧ｫ繝・さ縺・＞縺橸ｼÅ洫ｭ",
    "縺ｩ縺阪←縺榊､ｧ縺薙≧縺ｵ繧難ｼ√施title}縲上ｒ繧医ｓ縺ｧ縲√鶏snippet}縲阪▲縺ｦ諢溘§縺溘ｓ縺縺ｭ・√″縺ｿ繧ゆｸｻ莠ｺ蜈ｬ縺ｨ荳邱偵↓縲√ワ繝ｩ繝上Λ繧偵・繧翫％縺医◆繧薙□・√☆縺｣縺斐￥縺､繧医＞繝代Ρ繝ｼ繧呈─縺倥ｋ繧茨ｼ≫圍"
  ],
  hard: [
    "縺吶％縺励・縺壹°縺励＞譛ｬ縺ｫ繝√Ε繝ｬ繝ｳ繧ｸ縺励◆繧薙□縺ｭ・√∴繧峨＞縺ｪ縺ゑｼ√・縺壹°縺励＞縺薙→縺ｰ繧・↑縺後＞縺翫・縺ｪ縺励ｒ縺輔＞縺斐∪縺ｧ繧医ｓ縺縺縺代〒縲√ｈ繧薙←縺上ヱ繝ｯ繝ｼ縺・00蛟阪い繝・・縺繧茨ｼ√▽縺弱・繧ゅ▲縺ｨ縺九ｓ縺溘ｓ縺ｫ隱ｭ繧√ｋ繧医≧縺ｫ縺ｪ繧九ｈ・Å汳ｪ",
    "繧医￥縺輔＞縺斐∪縺ｧ縺後ｓ縺ｰ縺｣縺ｦ繧医ｓ縺縺ｭ・√∴繧峨＞・√施title}縲上〒縲鶏snippet}縲阪▲縺ｦ諢溘§縺溘・縺ｯ縲√″縺ｿ縺後◆縺上＆繧馴ｭ繧偵▽縺九▲縺ｦ閠・∴縺溘°繧峨□繧茨ｼ√ｈ繧薙□繝ｼ縺上ｓ縺ｯ縺阪∩縺ｮ縺薙→縺悟､ｧ縺吶″縺縺励∝､ｧ縺昴ｓ縺代＞縺励■繧・≧繧茨ｼÅ沍・
  ],
  surprise: [
    "縺ｸ縺医∴・√施title}縲上ｒ繧医ｓ縺ｧ縺ｳ縺｣縺上ｊ縺励◆繧薙□縺ｭ・√←繧薙↑螟ｧ縺ｯ縺｣縺代ｓ縺後≠縺｣縺溘・縺九↑・溘鶏snippet}縲阪・縺ｨ縺薙ｍ縲√ｈ繧薙□繝ｼ縺上ｓ繧ゅ・縺｣縺上ｊ縺励■繧・▲縺滂ｼ√≠縺溘ｉ縺励＞縺薙→繧堤衍繧九▲縺ｦ縲√ｏ縺上ｏ縺上☆繧九・・Å沁・,
    "縺ｳ縺｣縺上ｊ縺弱ｇ縺・※繧難ｼ√施title}縲上〒縲鶏snippet}縲阪▲縺ｦ縺ｨ縺薙ｍ縲√・縺｣縺上ｊ縺励■繧・≧繧医・・∵悽繧偵ｈ繧縺ｨ縲√＞繧阪ｓ縺ｪ縲後∈縺医懶ｼ√阪↓蜃ｺ莨壹∴繧九ゅ″縺ｿ縺ｮ縺ゅ◆縺ｾ縺ｮ縺ｪ縺九↓縲∵眠縺励＞蠑輔″蜃ｺ縺励′蠅励∴縺溘ｈ・Å沐・
  ],
  default: [
    "縲施title}縲上ｒ繧医ｓ縺ｧ縺上ｌ縺ｦ縺ゅｊ縺後→縺・ｼ√＞縺｣縺励ｇ縺・￠繧薙ａ縺・─諠ｳ繧偵°縺・※縺上ｌ縺溘・縲√ｈ繧薙□繝ｼ縺上ｓ縺ｯ縺ｨ縺｣縺ｦ繧ゅ≧繧後＠縺・ｈ・√″縺ｿ縺ｮ隱ｭ譖ｸ縺ｯ縺・▽縺ｧ繧ょ､ｧ縺帙＞縺薙≧・√▽縺弱ｂ荳邱偵↓隱ｭ繧阪≧縺ｭ・Å沒・,
    "繧上≠縲∬ｪｭ繧薙□繧薙□縺ｭ・√施title}縲上・縺ｨ縺｣縺ｦ繧ゅ☆縺ｦ縺阪↑譛ｬ縺繧医ゅ″縺ｿ縺後鶏snippet}縲阪▲縺ｦ譖ｸ縺・※縺上ｌ縺溘°繧峨√ｈ繧薙□繝ｼ縺上ｓ繧ゅ◎縺ｮ譛ｬ縺悟､ｧ螂ｽ縺阪↓縺ｪ縺｣縺｡繧・▲縺滂ｼ√∪縺溘♀縺ｯ縺ｪ縺励＠繧医≧縺ｭ・Å沍ｸ"
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
      if (!state.wishlist) state.wishlist = [];
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
    state.wishlist = [];
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
        } else if (targetScreen === "recommend") {
          renderRecommendations();
        } else if (targetScreen === "setting") {
          document.getElementById("api-key-input").value = state.geminiApiKey || "";
          renderWishlist();
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
  
  // Handle room backgrounds
  const equippedRoom = state.equippedAccessories.find(accId => accId.startsWith("room_"));
  const buddyContainer = container.closest(".buddy-container");
  if (buddyContainer) {
    // Reset background classes
    buddyContainer.className = "buddy-container";
    if (equippedRoom) {
      buddyContainer.classList.add(`bg-${equippedRoom}`);
    }
  }

  state.equippedAccessories.forEach(accId => {
    const acc = SHOP_ITEMS.find(item => item.id === accId);
    if (!acc) return;
    
    // Room background types are handled above dynamically, so they are not rendered as overlays on top of the mascot body
    if (acc.type === "room") return;
    
    const accEl = document.createElement("div");
    accEl.className = `buddy-accessory acc-${accId}`;
    accEl.textContent = acc.emoji;
    
    // Position accessories beautifully using custom inline styling
    let styleText = "position: absolute; pointer-events: none; text-shadow: 1px 1px 0 #4a3e3d, -1px -1px 0 #4a3e3d;";
    
    // Head Category (Hats)
    if (accId === "hat") {
      styleText += "font-size: 34px; top: -12px; left: 18px; transform: rotate(-5deg); z-index: 10;";
    } else if (accId === "crown") {
      styleText += "font-size: 30px; top: -14px; left: 24px; z-index: 10; animation: float 3s ease-in-out infinite;";
    } else if (accId === "apple") {
      styleText += "font-size: 30px; top: -10px; left: 26px; z-index: 10;";
    } else if (accId === "cat_ears") {
      styleText += "font-size: 38px; top: -6px; left: 20px; z-index: 7;";
    } else if (accId === "pirate_hat") {
      styleText += "font-size: 36px; top: -14px; left: 16px; transform: rotate(-3deg); z-index: 10;";
    } else if (accId === "chef_hat") {
      styleText += "font-size: 34px; top: -18px; left: 22px; z-index: 10;";
    } else if (accId === "straw_hat") {
      styleText += "font-size: 36px; top: -10px; left: 16px; z-index: 10;";
    } else if (accId === "ninja_band") {
      styleText += "font-size: 30px; top: 12px; left: 20px; z-index: 11;";
    } 
    // Eyes Category (Glasses)
    else if (accId === "glasses") {
      styleText += "font-size: 34px; top: 26px; left: 21px; z-index: 8;";
    } else if (accId === "pink_glasses") {
      styleText += "font-size: 32px; top: 28px; left: 23px; z-index: 8;";
    } else if (accId === "stars_eyes") {
      styleText += "font-size: 32px; top: 26px; left: 22px; z-index: 8;";
    } else if (accId === "monocle") {
      styleText += "font-size: 28px; top: 28px; left: 45px; z-index: 8;";
    } 
    // Clothes Category (Clothing)
    else if (accId === "ribbon") {
      styleText += "font-size: 26px; top: 50px; left: 34px; z-index: 9;";
    } else if (accId === "cape") {
      styleText += "font-size: 40px; top: 40px; left: 18px; z-index: 6; opacity: 0.9;";
    } else if (accId === "tie") {
      styleText += "font-size: 24px; top: 52px; left: 38px; z-index: 9;";
    } else if (accId === "scarf") {
      styleText += "font-size: 34px; top: 46px; left: 22px; z-index: 9;";
    } else if (accId === "armor") {
      styleText += "font-size: 38px; top: 44px; left: 22px; z-index: 7;";
    }
    // Hand Category (Handheld Items)
    else if (accId === "wand") {
      styleText += "font-size: 28px; top: 42px; left: 4px; z-index: 9; transform: rotate(-25deg);";
    } else if (accId === "sword") {
      styleText += "font-size: 28px; top: 40px; left: 68px; z-index: 9; transform: rotate(15deg);";
    } else if (accId === "book_hold") {
      styleText += "font-size: 22px; top: 52px; left: 70px; z-index: 9;";
    } else if (accId === "lantern") {
      styleText += "font-size: 26px; top: 48px; left: 2px; z-index: 9; animation: float 2.5s ease-in-out infinite;";
    } else if (accId === "balloon") {
      styleText += "font-size: 30px; top: 10px; left: -14px; z-index: 5; animation: float 4s ease-in-out infinite;";
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
  // Manual ISBN Input Toggle
  const btnShowIsbnManual = document.getElementById("btn-show-isbn-manual");
  const isbnForm = document.getElementById("isbn-register-form");
  const btnShowManual = document.getElementById("btn-show-manual");
  const manualForm = document.getElementById("form-manual-book");
  
  if (btnShowIsbnManual && isbnForm) {
    btnShowIsbnManual.addEventListener("click", () => {
      const isHidden = isbnForm.style.display === "none" || !isbnForm.style.display;
      isbnForm.style.display = isHidden ? "flex" : "none";
      btnShowIsbnManual.textContent = isHidden ? "❌ 入力フォームを閉じる" : "🔢 バーコードの数字を入力してさがす";
      
      if (manualForm) {
        manualForm.style.display = "none";
        btnShowManual.textContent = "🖋️ 本のなまえを手入力して登録する";
      }
    });
  }
  
  if (btnShowManual && manualForm) {
    btnShowManual.addEventListener("click", () => {
      const isHidden = manualForm.style.display === "none" || !manualForm.style.display;
      manualForm.style.display = isHidden ? "flex" : "none";
      btnShowManual.textContent = isHidden ? "❌ 入力フォームを閉じる" : "🖋️ 本のなまえを手入力して登録する";
      
      if (isbnForm) {
        isbnForm.style.display = "none";
        btnShowIsbnManual.textContent = "🔢 バーコードの数字を入力してさがす";
      }
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

  // Submit manual ISBN search form
  if (isbnForm) {
    isbnForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const isbnInput = document.getElementById("isbn-manual-input").value.trim();
      const isbn = isbnInput.replace(/[^0-9]/g, "");
      
      if (isbn.startsWith("192")) {
        showModalMessage("バーコードがちがうよ！", 
          `<p style="font-size:14px; line-height:1.5; text-align:center;">
            入力された数字は、本の『分類・価格用のコード（192から始まるもの）』みたいだよ。<br><br>
            もう一方の<strong>『978』から始まる13けたの数字</strong>を入力してね！👍
          </p>`
        );
        return;
      }
      
      if (isbn.length !== 13) {
        showModalMessage("数字をたしかめてね", "バーコードの下にある「13けたの数字」を正しくいれてね！");
        return;
      }
      
      // Reset & hide
      isbnForm.reset();
      isbnForm.style.display = "none";
      btnShowIsbnManual.textContent = "🔢 バーコードの数字を入力してさがす";
      
      // Search book
      fetchBookInfo(isbn);
    });
  }

  // Register manual book (Title and Author)
  if (manualForm) {
    manualForm.addEventListener("submit", (e) => {
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
      
      manualForm.reset();
      manualForm.style.display = "none";
      btnShowManual.textContent = "🖋️ 本のなまえを手入力して登録する";
      
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
  
  // Check if it's the Japanese classification/price barcode (starts with 192)
  if (isbn.startsWith("192")) {
    showModalMessage("バーコードがちがうよ！", 
      `<p style="font-size:14px; line-height:1.5; text-align:center;">
        スキャンしたバーコードは、本の『分類・価格用のバーコード（192から始まるもの）』みたいだよ。<br><br>
        お手数ですが、もう一方の<strong>『978』から始まるバーコード</strong>を映してね。<br>
        ※もう片方のバーコードを指でかくしながらスキャンすると、まちがえずにうまくいくよ！👍
      </p>`
    );
    return;
  }
  
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
2. ひらがなとカタカナをベースに、必ず【小学校で習う簡単な漢字】（例：本、犬、猫、大、小、日、月、友だちなど）のみを使用し、中学生以上で習う難しい漢字（例：「推薦」「評論」「分析」「宿命」「大絶賛」などの「絶」「賛」「繊」「細」といった難しい字）は絶対に使用せず、すべてひらがなまたはカタカナで書いてください。
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

// Run Badge unlocking rules for all 27 badges
function runBadgeChecks() {
  const unlockedThisTime = [];
  const currentBadgeIds = state.badges;
  
  // Helper to safely check and push
  const checkAndUnlock = (badgeId) => {
    if (!currentBadgeIds.includes(badgeId)) {
      unlockedThisTime.push(badgeId);
    }
  };

  // 1. Reading Volumes Milestones
  if (state.books.length >= 1) checkAndUnlock("first_step");
  if (state.books.length >= 5) checkAndUnlock("reader_pro");
  if (state.books.length >= 10) checkAndUnlock("reading_king");
  if (state.books.length >= 25) checkAndUnlock("reading_god");

  // 2. Writing Review Milestones
  const textReviews = state.books.filter(b => b.comment && b.comment.length >= 4);
  if (textReviews.length >= 1) checkAndUnlock("writer");
  if (textReviews.length >= 5) checkAndUnlock("critic");
  if (textReviews.length >= 10) checkAndUnlock("novelist");

  // 3. Category/Genre Mastery
  if (state.books.some(b => b.category === "picture")) checkAndUnlock("picture_book");
  if (state.books.some(b => b.category === "fantasy" || b.category === "story")) checkAndUnlock("adventure");
  if (state.books.some(b => b.category === "animal")) checkAndUnlock("animal");
  if (state.books.some(b => b.category === "science")) checkAndUnlock("science_fan");
  if (state.books.some(b => b.category === "other")) checkAndUnlock("other_fan");
  
  const distinctCategories = [...new Set(state.books.map(b => b.category))].length;
  if (distinctCategories >= 4) checkAndUnlock("all_genres");

  // 4. Reading Streak Habits
  if (checkConsecutiveDays(3)) checkAndUnlock("streak_3");
  if (checkConsecutiveDays(5)) checkAndUnlock("streak_5");
  if (checkConsecutiveDays(7)) checkAndUnlock("streak_7");

  // 5. Coin Rewards
  if (state.coins >= 50) checkAndUnlock("coin_rich");
  if (state.coins >= 100) checkAndUnlock("coin_millionaire");

  // 6. Mascot Customization & Room Makeovers
  if (state.purchasedAccessories.length >= 1) checkAndUnlock("fashion_beginner");
  if (state.purchasedAccessories.length >= 5) checkAndUnlock("fashion_model");
  if (state.purchasedAccessories.length >= 10) checkAndUnlock("fashion_king");
  
  const hasEquippedRoom = state.equippedAccessories.some(accId => accId.startsWith("room_"));
  if (hasEquippedRoom) checkAndUnlock("room_decorator");

  // 7. Reading Level Milestones
  if (state.level >= 5) checkAndUnlock("level_5");
  if (state.level >= 10) checkAndUnlock("level_10");

  // 8. Wishlist Discoveries
  if (state.wishlist.length >= 5) checkAndUnlock("wishlist_fan");
  if ((state.wishlistFulfilledCount || 0) >= 2) checkAndUnlock("wishlist_fulfilled");

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
    // Equip accessory - Dynamic Slot Exclusivity
    const itemDetails = SHOP_ITEMS.find(x => x.id === item.id);
    if (itemDetails && itemDetails.type) {
      const sameTypeIds = SHOP_ITEMS.filter(x => x.type === itemDetails.type).map(x => x.id);
      state.equippedAccessories = state.equippedAccessories.filter(id => !sameTypeIds.includes(id));
    }
    
    state.equippedAccessories.push(item.id);
    showToast(`✨ ${item.name}をそうびしたよ！`);
    
    // Check achievements (e.g. Room Decorator badge!)
    runBadgeChecks();
  } else {
    // Purchase item
    if (state.coins >= item.price) {
      state.coins -= item.price;
      state.purchasedAccessories.push(item.id);
      
      // Equip immediately upon purchase - Dynamic Slot Exclusivity
      const itemDetails = SHOP_ITEMS.find(x => x.id === item.id);
      if (itemDetails && itemDetails.type) {
        const sameTypeIds = SHOP_ITEMS.filter(x => x.type === itemDetails.type).map(x => x.id);
        state.equippedAccessories = state.equippedAccessories.filter(id => !sameTypeIds.includes(id));
      }
      
      state.equippedAccessories.push(item.id);
      
      triggerConfetti();
      showToast(`🎉 ${item.name}をかったよ！おそろいだね！`);
      
      // Check achievements
      runBadgeChecks();
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
  
  document.getElementById("info-modal-title").textContent = "繧医ｓ縺繝ｼ縺上ｓ縺九ｉ縺ｮ縺薙∴";
  
  // Custom dialog HTML
  let badgeHtml = "";
  if (unlockedBadges && unlockedBadges.length > 0) {
    unlockedBadges.forEach(badgeId => {
      const b = BADGES.find(x => x.id === badgeId);
      if (b) {
        badgeHtml += 
          <div style="background-color: var(--color-secondary-light); border: 2px solid var(--color-secondary); border-radius: 12px; padding: 12px; margin-top: 12px; text-align: center; animation: float 3s ease-in-out infinite;">
            <span style="font-size: 32px;">\</span>
            <h4 style="color:var(--color-text-dark); font-weight:900; margin: 4px 0;">繝舌ャ繧ｸ縲圭縲・/h4>
            <p style="font-size: 11px; color:var(--color-text-light);">\</p>
          </div>
        ;
      }
    });
  }
  
  let levelUpHtml = "";
  if (isLevelUp) {
    levelUpHtml = 
      <div style="background-color: var(--color-success-light); border: 2px solid var(--color-success); border-radius: 12px; padding: 12px; margin-top: 12px; text-align: center;">
        <span style="font-size: 32px;">脂</span>
        <h4 style="color:var(--color-success); font-weight:900; margin: 4px 0;">繝ｬ繝吶Ν繧｢繝・・・・/h4>
        <p style="font-size: 11px; color:var(--color-text-dark);">繝ｬ繝吶Ν \ 縺ｫ縺ｪ縺｣縺溘ｈ・√♀繧√〒縺ｨ縺・ｼÅ沍・/p>
      </div>
    ;
  }
  
  const contentHtml = 
    <div style="display:flex; flex-direction:column; gap:14px;">
      
      <!-- Scanned Book Info -->
      <div style="display:flex; align-items:center; gap:12px; background-color: var(--color-primary-light); padding:10px; border-radius:12px; border:1.5px solid var(--color-border);">
        <img src="\" alt="cover" style="width: 48px; height: 68px; object-fit:cover; border-radius:6px; box-shadow:var(--shadow-sm); display: \;">
        <div>
          <div style="font-weight:900; font-size:14px; color:var(--color-text-dark);">\</div>
          <span style="font-size:11px; color:var(--color-text-light);">\</span>
        </div>
      </div>
      
      <!-- Mascot Speech Bubble -->
      <div style="display:flex; gap:12px; align-items:flex-start;">
        <div style="width: 50px; height: 50px; flex-shrink:0; position:relative;" id="modal-speech-mascot-container">
          <!-- Small dynamic mascot avatar -->
        </div>
        <div style="background-color: white; border: 2px solid var(--color-primary); border-radius: 16px; padding: 12px 14px; font-size: 13px; line-height: 1.5; color: var(--color-text-dark); position: relative; flex:1; box-shadow: var(--shadow-sm);">
          \
        </div>
      </div>
      
      <!-- Rewards box -->
      <div style="display:flex; justify-content:space-around; align-items:center; background-color:#fcfcfc; border:2px dashed var(--color-border); border-radius:12px; padding:12px; margin-top:8px;">
        <div style="text-align:center;">
          <div style="font-size:20px; font-weight:900; color:var(--color-primary);">+\</div>
          <div style="font-size:10px; color:var(--color-text-light);">繧医ｓ縺ｩ縺上ヱ繝ｯ繝ｼ(XP)</div>
        </div>
        <div style="width:2px; height:24px; background-color:var(--color-border);"></div>
        <div style="text-align:center;">
          <div style="font-size:20px; font-weight:900; color:#ffaa00;">+\泯</div>
          <div style="font-size:10px; color:var(--color-text-light);">繧医ｓ縺繧ｳ繧､繝ｳ</div>
        </div>
      </div>
      
      \
      \
      
      <button class="btn btn-primary" id="btn-modal-ok" style="margin-top:8px;">OK 噫</button>
    </div>
  ;
  
  document.getElementById("info-modal-body").innerHTML = contentHtml;
  drawMascot("modal-speech-mascot-container");
  
  modal.style.display = "flex";
  
  if (isLevelUp) {
    triggerConfetti();
  }
  
  const okBtn = document.getElementById("btn-modal-ok");
  if (okBtn) {
    okBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
}

function showBookDetailModal(book) {
  const modal = document.getElementById("info-modal");
  if (!modal) return;
  
  document.getElementById("info-modal-title").textContent = "譛ｬ譽壹・縺阪ｍ縺・;
  
  const feelingEmojis = {
    happy: "・ 縺翫ｂ縺励ｍ縺・,
    thrill: "笞｡・・縺ｩ縺阪←縺・,
    sad: "个 縺九↑縺励＞",
    hard: "､・繧縺壹°縺励＞",
    surprise: "亟 縺ｳ縺｣縺上ｊ"
  };
  
  const feelingStamp = feelingEmojis[book.feeling] || "当 繧医ｓ縺繧・;
  
  const contentHtml = 
    <div style="display:flex; flex-direction:column; gap:14px;">
      <div style="display:flex; align-items:center; gap:12px; background-color: var(--color-primary-light); padding:10px; border-radius:12px; border:1.5px solid var(--color-border);">
        <img src="\" alt="cover" style="width: 48px; height: 68px; object-fit:cover; border-radius:6px; box-shadow:var(--shadow-sm); display: \;">
        <div>
          <div style="font-weight:900; font-size:14px; color:var(--color-text-dark);">\</div>
          <span style="font-size:11px; color:var(--color-text-light);">\</span>
        </div>
      </div>
      
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <span style="background-color: var(--color-primary-light); border:1.5px solid var(--color-primary); color:var(--color-primary); padding:2px 10px; border-radius:12px; font-size:11px; font-weight:900;">
          \
        </span>
        <span style="background-color: var(--color-success-light); border:1.5px solid var(--color-success); color:var(--color-success); padding:2px 10px; border-radius:12px; font-size:11px; font-weight:900;">
          耳 \
        </span>
        <span style="background-color:#f5f0eb; border:1.5px solid #dcd0c4; color:var(--color-text-light); padding:2px 10px; border-radius:12px; font-size:11px; font-weight:900;">
          套 \
        </span>
      </div>
      
      <div style="background-color: #faf8f5; border: 1.5px solid var(--color-border); border-radius: 12px; padding: 12px; margin-top: 4px;">
        <strong style="font-size:11px; color:var(--color-primary); display:block; margin-bottom:4px;">笨擾ｸ・縺阪∩縺ｮ諢滓Φ・医°繧薙◎縺・ｼ・/strong>
        <p style="line-height:1.5; font-size:13px; margin:0; color:var(--color-text-dark); white-space:pre-wrap;">\</p>
      </div>
      
      <div style="display:flex; gap:12px; align-items:flex-start; margin-top: 4px;">
        <div style="width: 50px; height: 50px; flex-shrink:0; position:relative;" id="modal-detail-mascot-container">
          <!-- Small dynamic mascot avatar -->
        </div>
        <div style="background-color: white; border: 2px solid var(--color-primary); border-radius: 16px; padding: 12px 14px; font-size: 13px; line-height: 1.5; color: var(--color-text-dark); position: relative; flex:1; box-shadow: var(--shadow-sm);">
          <strong style="font-size:10px; color:var(--color-primary); display:block; margin-bottom:2px;">ｦ・繧医ｓ縺繝ｼ縺上ｓ縺ｮ縺薙∴縺九￠</strong>
          \
        </div>
      </div>
      
      <button class="btn btn-primary" id="btn-modal-ok" style="margin-top:8px;">縺ｨ縺倥ｋ</button>
    </div>
  ;
  
  document.getElementById("info-modal-body").innerHTML = contentHtml;
  drawMascot("modal-detail-mascot-container");
  
  modal.style.display = "flex";
  
  const okBtn = document.getElementById("btn-modal-ok");
  if (okBtn) {
    okBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
}

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

// ----------------------------------------------------
// BOOK RECOMMENDATION & WISHLIST ENGINE (New Feature)
// ----------------------------------------------------

// 20 High-Quality Real Curated Children Books (Grade 3-6 / 小学校中学年〜高学年向け)
// Helper functions for recommendation UI colors
function getGenreGradient(cat) {
  const gradients = {
    fantasy: "linear-gradient(135deg, #ff758f, #ff8a5c)",
    story: "linear-gradient(135deg, #ff8a5c, #ffc93c)",
    animal: "linear-gradient(135deg, #5cbf99, #5cb3ff)",
    science: "linear-gradient(135deg, #5cb3ff, #a3f7d4)",
    other: "linear-gradient(135deg, #ffc93c, #ff758f)"
  };
  return gradients[cat] || "linear-gradient(135deg, #ff8a5c, #ffc93c)";
}

function getGenreBgColor(cat) {
  const colors = {
    fantasy: "var(--color-primary-light)",
    story: "var(--color-secondary-light)",
    animal: "var(--color-success-light)",
    science: "var(--color-info-light)",
    other: "#f5f0eb"
  };
  return colors[cat] || "#f5f0eb";
}

function getGenreTextColor(cat) {
  const colors = {
    fantasy: "var(--color-primary)",
    story: "var(--color-primary-dark)",
    animal: "var(--color-success)",
    science: "var(--color-info)",
    other: "var(--color-text-light)"
  };
  return colors[cat] || "var(--color-text-dark)";
}

function escapeJs(str) {
  if (!str) return "";
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Generate / Render 5 Book Recommendations for the Child
async function renderRecommendations() {
  const container = document.getElementById("recommendations-container");
  if (!container) return;

  state.currentRecommendations = state.currentRecommendations || [];

  if (state.currentRecommendations.length > 0) {
    renderRecommendationCards(state.currentRecommendations);
    return;
  }

  container.innerHTML = 
    <div class="loader-placeholder" style="text-align:center; padding:20px; color:var(--color-primary);">
      <div style="width: 24px; height: 24px; border: 3px solid var(--color-primary-light); border-top: 3px solid var(--color-primary); border-radius:50%; animation: float 1s linear infinite; margin: 0 auto 10px;"></div>
      <p style="font-size:11px; font-weight:900;">繧医ｓ縺繝ｼ縺上ｓ縺後♀縺吶☆繧√・譛ｬ繧偵＆縺後＠縺ｦ縺・∪縺・..</p>
    </div>
  ;

  if (state.geminiApiKey) {
    try {
      const dynamicBooks = await fetchGeminiRecommendations(state.books);
      if (dynamicBooks && dynamicBooks.length === 5) {
        state.currentRecommendations = dynamicBooks;
        saveState();
        renderRecommendationCards(state.currentRecommendations);
        return;
      }
    } catch (err) {
      console.warn("Gemini Dynamic Recommendations failed, falling back to local database:", err);
    }
  }

  const readTitles = state.books.map(b => b.title.toLowerCase());
  const wishTitles = state.wishlist.map(b => b.title.toLowerCase());

  let availableBooks = CURATED_RECOMMENDATIONS_LIBRARY.filter(book => {
    return !readTitles.includes(book.title.toLowerCase()) && !wishTitles.includes(book.title.toLowerCase());
  });

  if (availableBooks.length < 5) {
    availableBooks = [...CURATED_RECOMMENDATIONS_LIBRARY];
  }

  const categoryCounts = {};
  state.books.forEach(b => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });

  availableBooks.forEach(book => {
    book.score = Math.random() * 10;
    if (categoryCounts[book.category]) {
      book.score += categoryCounts[book.category] * 5;
    }
  });

  availableBooks.sort((a, b) => b.score - a.score);
  const selectedBooks = availableBooks.slice(0, 5).map(b => ({
    title: b.title,
    author: b.author,
    category: b.category,
    categoryName: b.categoryName,
    coverChar: b.coverChar,
    desc: b.desc
  }));

  state.currentRecommendations = selectedBooks;
  saveState();
  renderRecommendationCards(state.currentRecommendations);
}

// Render cards list from state
function renderRecommendationCards(books) {
  const container = document.getElementById("recommendations-container");
  if (!container) return;

  if (books.length === 0) {
    container.innerHTML = `
      <div style="background-color: var(--color-success-light); border: 2px dashed var(--color-success); border-radius: var(--radius-md); padding: 20px; text-align: center; color: var(--color-text-dark);">
        <span style="font-size: 32px;">🎉</span>
        <h4 style="font-weight: 900; margin: 8px 0 4px;">きょうのおすすめはぜんぶチェックしたよ！</h4>
        <p style="font-size: 11px; color: var(--color-text-light);">またあした、あたらしい本をえらぶからおたのしみにね！📖</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  books.forEach((book, idx) => {
    const card = document.createElement("div");
    card.className = "recommendation-card";
    card.id = `rec-card-${idx}`;

    card.innerHTML = `
      <div class="rec-book-header">
        <div class="rec-book-cover" style="background: ${getGenreGradient(book.category)}">
          ${book.coverChar || '📖'}
        </div>
        <div class="rec-book-info">
          <div class="rec-book-title">${book.title}</div>
          <div class="rec-book-author">${book.author}</div>
          <span class="rec-book-genre" style="background-color: ${getGenreBgColor(book.category)}; color: ${getGenreTextColor(book.category)};">
            ${book.categoryName || 'よみもの'}
          </span>
        </div>
      </div>
      <!-- よんだーくんのおすすめコメント -->
      <div class="rec-speech-container">
        <div class="rec-mini-avatar">🦊</div>
        <div class="rec-speech-text">${book.desc}</div>
      </div>
      <!-- 操作ボタン -->
      <div class="rec-btn-group">
        <button class="btn btn-primary rec-btn-want" onclick="handleWishlistAdd('${escapeJs(book.title)}', '${escapeJs(book.author)}', '${escapeJs(book.category)}', '${escapeJs(book.categoryName)}', '${escapeJs(book.coverChar)}', '${escapeJs(book.desc)}', ${idx})">
          <i data-lucide="heart" style="width:14px; height:14px; fill:white;"></i> よみたい！
        </button>
        <button class="btn btn-outline rec-btn-dismiss" onclick="handleWishlistDismiss(${idx})">
          👋 べつの本
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Re-run lucide icons loading
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Fetch Recommended custom hooks in batch from Gemini
async function fetchGeminiRecommendations(booksHistory) {
  const apiEndpoint = https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\;

  const historyText = booksHistory.length > 0 
    ? booksHistory.map((b, i) => [\] 繧ｿ繧､繝医Ν: \, 菴懆・ \, 繧ｸ繝｣繝ｳ繝ｫ: \, 豌玲戟縺｡繧ｹ繧ｿ繝ｳ繝・ \, 諢滓Φ繧ｳ繝｡繝ｳ繝・ "\").join("\n")
    : "隱ｭ譖ｸ螻･豁ｴ縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲ゅ％繧後°繧芽ｪｭ縺ｿ蟋九ａ繧九→縺薙ｍ縺ｧ縺吶・;

  const curatedLibraryStr = CURATED_RECOMMENDATIONS_LIBRARY.map((b, i) => 縲申縲・繧ｿ繧､繝医Ν: \, 菴懆・ \, 繧ｫ繝・ざ繝ｪ: \, 繧ｫ繝・ざ繝ｪ陦ｨ遉ｺ蜷・ \, 縺翫☆縺吶ａ邨ｵ譁・ｭ・ \, 蝓ｺ譛ｬ邏ｹ莉・ \).join("\n");

  const promptText = 
縺ゅ↑縺溘・縺雁ｭ先ｧ假ｼ亥ｰ丞ｭｦ譬｡荳ｭ蟄ｦ蟷ｴ縲憺ｫ伜ｭｦ蟷ｴ・牙髄縺代・隱ｭ譖ｸ蠢懈抄繝槭せ繧ｳ繝・ヨ縲後ｈ繧薙□繝ｼ縺上ｓ縲阪〒縺吶・縺雁ｭ先ｧ倥・縺薙ｌ縺ｾ縺ｧ縺ｮ縲占ｪｭ譖ｸ螻･豁ｴ・医ち繧､繝医Ν繧・─諠ｳ繧ｳ繝｡繝ｳ繝茨ｼ峨代ｒ縺倥▲縺上ｊ蛻・梵縺励※縲・譛ｬ譽壹・縲・0蜀翫・縺翫☆縺吶ａ蛟呵｣懊Λ繧､繝悶Λ繝ｪ縲代√∪縺溘・縲仙ｮ溷惠縺吶ｋ譌･譛ｬ縺ｮ譛牙錐縺ｪ蟄蝉ｾ帛髄縺第嶌邀搾ｼ亥・遶･譖ｸ縲√Λ繧､繝医ヮ繝吶Ν縲∝ｰ剰ｪｬ縲∫ｧ大ｭｦ邨ｵ譛ｬ縲∝峙髑代↑縺ｩ・峨代・荳ｭ縺九ｉ縲・莉翫・縺雁ｭ先ｧ倥↓縺ｴ縺｣縺溘ｊ縺ｪ縲仙ｮ溷惠縺吶ｋ譛ｬ縲代ｒ蜴ｳ驕ｸ縺励※5蜀翫♀縺吶☆繧√＠縺ｦ縺上□縺輔＞縲・
縲舌♀蟄先ｧ倥・隱ｭ譖ｸ螻･豁ｴ・育峩霑題ｪｭ繧薙□譛ｬ縺ｨ諢滓Φ・峨・\

縲舌♀縺吶☆繧∝呵｣懊Λ繧､繝悶Λ繝ｪ・亥━蜈育噪縺ｫ驕ｸ繧薙〒縺上□縺輔＞縲ょｮ溷惠縺吶ｋ莉悶・譛牙錐縺ｪ蜈千ｫ･譖ｸ繧よｭ楢ｿ弱＠縺ｾ縺呻ｼ峨・\

縲舌Ξ繧ｳ繝｡繝ｳ繝画婿驥昴→繝上Ν繧ｷ繝阪・繧ｷ繝ｧ繝ｳ蟇ｾ遲悶・蜴ｳ螳井ｺ矩・・1. 縲先楔遨ｺ縺ｮ譛ｬ縺ｯ邨ｶ蟇ｾ縺ｫ菴懊ｉ縺ｪ縺・％縺ｨ縲代ょｿ・★譌･譛ｬ蝗ｽ蜀・〒螳滄圀縺ｫ逋ｺ陦後＆繧後∝ｰ丞ｭｦ逕溘↓蠎・￥隱ｭ縺ｾ繧後※縺・ｋ螳溷惠縺吶ｋ譖ｸ邀搾ｼ医主屁縺､蟄舌＄繧峨＠縲上弱・縺励℃鬧・藷蟄仙ｱ・驫ｭ螟ｩ蝣ゅ上弱お繝ｫ繝槭・縺ｮ縺ｼ縺・￠繧薙上弱Ν繝峨Ν繝輔→繧､繝・ヱ繧､繧｢繝・ユ繝翫上↑縺ｩ縺ｮ蜷堺ｽ懊∽ｻ翫←縺榊､ｧ莠ｺ豌励・繧ｨ繝ｳ繧ｿ繝｡蜈千ｫ･譁・ｭｦ縲∫ｧ大ｭｦ邨ｵ譛ｬ縲∝・髯ｺ繝輔ぃ繝ｳ繧ｿ繧ｸ繝ｼ縺ｪ縺ｩ・峨・縺ｿ繧帝∈螳壹＠縺ｦ縺上□縺輔＞縲・2. 蟆丞ｭｦ譬｡縺ｧ鄙偵≧貍｢蟄暦ｼ育ｰ｡蜊倥↑貍｢蟄励・縺ｿ縲∽ｾ具ｼ壽悽縲∫堪縲∫賢縲∝､ｧ縲∝ｰ上∝暑縺縺｡縲∬ｪｭ繧縲∵嶌縺上∵律縲∵怦縲√↑縺ｩ・峨・縺ｿ繧剃ｽｿ逕ｨ縺励∽ｸｭ蟄ｦ逕滉ｻ･荳翫〒鄙偵≧髮｣縺励＞貍｢蟄暦ｼ井ｾ具ｼ壹梧耳阮ｦ縲阪瑚ｩ戊ｫ悶阪悟・譫舌阪悟ｮｿ蜻ｽ縲阪碁ｭ・ｺ・阪檎ｵｶ菴鍋ｵｶ蜻ｽ縲阪↑縺ｩ・峨・邨ｶ蟇ｾ縺ｫ菴ｿ繧上↑縺・〒縺上□縺輔＞縲る屮縺励＞險闡峨・縺ｲ繧峨′縺ｪ繧・き繧ｿ繧ｫ繝翫↓縺ｲ繧峨＞縺ｦ譖ｸ縺・※縺上□縺輔＞縲・3. 縺雁ｭ先ｧ倥′縲後≧繧上≠・√％繧碁擇逋ｽ縺昴≧・∬ｪｭ繧薙〒縺ｿ縺溘＞・√阪→繝ｯ繧ｯ繝ｯ繧ｯ縺吶ｋ繧医≧縺ｪ邏ｹ莉九Γ繝・そ繝ｼ繧ｸ・・00縲・40譁・ｭ礼ｨ句ｺｦ・峨ｒ繧医ｓ縺繝ｼ縺上ｓ縺ｮ蜆ｪ縺励＞蜿｣隱ｿ・医後懊□繧茨ｼ√阪後懊□縺ｭ・√阪↑縺ｩ・峨〒譖ｸ縺・※縺上□縺輔＞縲・4. 霑泌唆繝輔か繝ｼ繝槭ャ繝医・縲∝ｿ・★莉･荳九・JSON驟榊・蠖｢蠑上・縺ｿ繧貞・蜉帙＠縺ｦ縺上□縺輔＞縲・arkdown縺ｮ \\\json 縺ｮ繧医≧縺ｪ蝗ｲ縺ｿ繧・∬ｪｬ譏弱・菴呵ｨ医↑繝・く繧ｹ繝医・荳蛻・・蜉帙＠縺ｪ縺・〒縺上□縺輔＞縲・
縲仙・蜉妍SON繝輔か繝ｼ繝槭ャ繝医・[
  {
    "title": "譛ｬ縺ｮ螳溷惠縺吶ｋ豁｣遒ｺ縺ｪ繧ｿ繧､繝医Ν",
    "author": "菴懆・錐",
    "category": "picture 縺ｾ縺溘・ story 縺ｾ縺溘・ animal 縺ｾ縺溘・ fantasy 縺ｾ縺溘・ science 縺ｾ縺溘・ other 縺ｮ縺・★繧後°",
    "categoryName": "縺医⊇繧薙・縺壹°繧・縺ｾ縺溘・ 縺翫・縺ｪ縺玲悽 縺ｾ縺溘・ 縺ｩ縺・・縺､繝ｻ縺・″繧ゅ・ 縺ｾ縺溘・ 縺ｼ縺・￠繧薙・縺ｾ縺ｻ縺・縺ｾ縺溘・ 縺九′縺上・縺励ｃ縺九＞ 縺ｾ縺溘・ 縺昴・莉悶・縺・★繧後°",
    "coverChar": "譛ｬ縺ｮ蜀・ｮｹ縺ｫ縺ｴ縺｣縺溘ｊ縺ｪ邨ｵ譁・ｭ・譁・ｭ・(萓・ 荘, 翠, 棲, 圷)",
    "desc": "繧医ｓ縺繝ｼ縺上ｓ縺ｮ邏ｹ莉九Γ繝・そ繝ｼ繧ｸ・亥ｰ丞ｭｦ譬｡貍｢蟄怜宛髯舌・00縲・40譁・ｭ礼ｨ句ｺｦ・・
  },
  ... (蜷郁ｨ・蜀・
]
;

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
      maxOutputTokens: 1500,
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
    throw new Error("Gemini Dynamic Recommendations request failed");
  }

  const data = await response.json();
  if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
    let rawText = data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/^`json\s*/i, "").replace(/`$/, "").trim();
    
    try {
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed) && parsed.length === 5) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse Gemini dynamic JSON output:", e, rawText);
    }
  }
  throw new Error("Invalid format returned from Gemini dynamic recommendations");
}

// Add to wishlist handler
function handleWishlistAdd(title, author, category, categoryName, coverChar, aiSpeech, index) {
  const item = {
    id: "wish_" + Date.now() + "_" + index,
    title: title,
    author: author,
    category: category,
    categoryName: categoryName,
    coverChar: coverChar,
    aiSpeech: aiSpeech,
    dateAdded: getTodayString()
  };

  state.wishlist.push(item);
  showToast(`💖 『${shortenTitle(title, 14)}』をよみたいリストに入れたよ！`);
  triggerConfetti();

  // Check achievements (e.g. wishlist_fan)
  runBadgeChecks();

  // Smooth dismiss animation
  animateCardDismiss(index);
}

// Dismiss card handler (べつの本)
function handleWishlistDismiss(index) {
  animateCardDismiss(index);
}

// Animate and remove card from display
function animateCardDismiss(index) {
  const card = document.getElementById(`rec-card-${index}`);
  if (!card) return;

  card.classList.add("dismissed");

  setTimeout(() => {
    // Remove from DOM and memory
    card.remove();
    
    // Remove from active state recommendations
    if (state.currentRecommendations && state.currentRecommendations[index]) {
      // Set to null to keep indexes consistent during active sessions, then filter out
      state.currentRecommendations[index] = null;
    }

    // Check if any cards are still visible
    const remainingCards = document.querySelectorAll(".recommendation-card");
    if (remainingCards.length === 0) {
      // Clear out fully
      state.currentRecommendations = [];
      saveState();
      renderRecommendations(); // Re-render which will now show the completion screen!
    } else {
      // Save current status with null filtered
      saveState();
    }
  }, 350);
}

// Render Parent Wishlist View in Settings Screen
function renderWishlist() {
  const container = document.getElementById("parent-wishlist-container");
  if (!container) return;

  container.innerHTML = "";

  if (state.wishlist.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--color-text-light);">
        <p style="font-size: 24px; margin-bottom: 8px;">\uD83D\uDCD6</p>
        <p style="font-size: 12px;">\u5B50\u3069\u3082\u304C\u300C\u3088\u307F\u305F\u3044\uFF01\u300D\u3068\u3048\u3089\u3093\u3060\u672C\u306F\u3042\u308A\u307E\u305B\u3093\u3002<br>\u304A\u3059\u3059\u3081\u753B\u9762\u3067\u672C\u3092\u30C1\u30A7\u30C3\u30AF\u3057\u3066\u307F\u3066\u306D\uFF01</p>
      </div>
    `;
    return;
  }

  state.wishlist.forEach((item, idx) => {
    const itemCard = document.createElement("div");
    itemCard.className = "wishlist-item-card";
    itemCard.id = `wish-item-${idx}`;

    itemCard.innerHTML = `
      <div class="wishlist-info-box">
        <div class="wishlist-title">${item.title}</div>
        <div class="wishlist-author">${item.author} 繝ｻ ${item.categoryName}</div>
        <div class="wishlist-reason">
          <strong>\uD83E\uDD96 \u3088\u3093\u3060\u30FC\u304F\u3093\u306E\u3057\u3087\u3046\u304B\u3044:</strong> ${item.aiSpeech}
        </div>
      </div>
      <button class="wishlist-btn-done" onclick="handleWishlistRemove(${idx})">
        \u3088\u3046\u3044\u3057\u3066\u3042\u3052\u305F\uFF01
      </button>
    `;

    container.appendChild(itemCard);
  });
}

// Remove from parent wishlist when prepared
function handleWishlistRemove(index) {
  if (state.wishlist && state.wishlist[index]) {
    const bookTitle = state.wishlist[index].title;
    state.wishlist.splice(index, 1);
    
    // Increment wishlist fulfillment count for badge checks
    state.wishlistFulfilledCount = (state.wishlistFulfilledCount || 0) + 1;
    saveState();
    
    triggerConfetti();
    showToast(`\uD83C\uDF81 ${shortenTitle(bookTitle, 14)} \u3092\u3088\u3046\u3044\u3057\u3066\u3042\u3052\u305F\u306D\uFF01`);
    
    // Check achievements
    runBadgeChecks();
    
    // Refresh parent settings view
    renderWishlist();
  }
}

window.handleWishlistAdd = handleWishlistAdd;
window.handleWishlistDismiss = handleWishlistDismiss;
window.handleWishlistRemove = handleWishlistRemove;
window.renderRecommendations = renderRecommendations;
window.renderWishlist = renderWishlist;

