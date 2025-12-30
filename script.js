/***********************
 * CONSTANTS
 ***********************/
const REMAINING_KEY = "remainingItems";
const COUNT_KEY = "pickCount";

/***********************
 * default lists
 ***********************/
const PRESET_LISTS = {
  list8: [
    "مافیا - پدرخوانده",
  "مافیا - گروگانگیر",
  "شهروند - نگهبان",
  "شهروند - دکتر",
  "شهروند - کارآگاه",
  "شهروند - حرفه‌ای ",
  "شهروند - شهروند ساده ۱",
  "شهروند - شهروند ساده ۲"
  ],
  list9: [
    "مافیا - پدرخوانده",
  "مافیا - گروگانگیر",
  "مافیا - مافیای ساده",
  "شهروند - نگهبان",
  "شهروند - دکتر",
  "شهروند - کارآگاه",
  "شهروند - حرفه‌ای ",
  "شهروند - شهروند ساده ۱",
  "شهروند - شهروند ساده ۲"
  ],
  list10: [
    "مافیا - پدرخوانده",
  "مافیا - گروگانگیر",
  "مافیا - خریدار",
  "شهروند - نگهبان",
  "شهروند - دکتر",
  "شهروند - کارآگاه",
  "شهروند - حرفه‌ای ",
  "شهروند - اوشن",
  "شهروند - شهروند ساده ۱",
  "شهروند - شهروند ساده ۲"
  ],
  list11: [
    "مافیا - پدرخوانده",
  "مافیا - گروگانگیر",
  "مافیا - خریدار",
  "شهروند - نگهبان",
  "شهروند - دکتر",
  "شهروند - کارآگاه",
  "شهروند - حرفه‌ای ",
  "شهروند - اوشن",
  "شهروند - شهروند ساده ۱",
  "شهروند - شهروند ساده ۲",
  "مستقل - زودیاک"
  ]
};


// 🔁 Edit this list freely — reload will always use the new version
const DEFAULT_LIST = PRESET_LISTS['list10'];


/***********************
 * FORCE RESET ON RELOAD
 ***********************/
localStorage.removeItem(REMAINING_KEY);
localStorage.removeItem(COUNT_KEY);

/***********************
 * ELEMENT REFERENCES
 ***********************/
const listInput = document.getElementById("listInput");
const resultEl = document.getElementById("result");
const pickButton = document.getElementById("pickButton");
const itemCountEl = document.getElementById("itemCount");

/***********************
 * INITIAL LOAD
 ***********************/
listInput.value = DEFAULT_LIST.join("\n");
localStorage.setItem(REMAINING_KEY, JSON.stringify([...DEFAULT_LIST]));
localStorage.setItem(COUNT_KEY, "0");
itemCountEl.innerText = `Number of Roles: ${DEFAULT_LIST.length}`;

/***********************
 * HELPERS
 ***********************/
function loadPreset(listKey) {
  const list = PRESET_LISTS[listKey];
  if (!list) return;

  listInput.value = list.join("\n");
  listInput.classList.remove("hidden"); // 👈 show textarea

  setRemainingItems([...list]);
  setPickCount(0);

  resultEl.innerText = "";
  pickButton.innerText = "Start Picking";
  itemCountEl.innerText = `Number of Roles: ${list.length}`;

  // close presets
  const grid = document.getElementById("presetGrid");
  const toggleBtn = document.querySelector(".toggle-presets");
  grid.classList.add("hidden");
  toggleBtn.innerText = "Load X-Player Scenario ▾";
}



function togglePresets() {
  const grid = document.getElementById("presetGrid");
  const toggleBtn = document.querySelector(".toggle-presets");

  grid.classList.toggle("hidden");

  toggleBtn.innerText = grid.classList.contains("hidden")
    ? "Load X-Player Scenario ▾"
    : "Load X-Player Scenario ▴";
}

function getRemainingItems() {
  return JSON.parse(localStorage.getItem(REMAINING_KEY)) || [];
}

function setRemainingItems(items) {
  localStorage.setItem(REMAINING_KEY, JSON.stringify(items));
}

function getPickCount() {
  return parseInt(localStorage.getItem(COUNT_KEY), 10) || 0;
}

function setPickCount(count) {
  localStorage.setItem(COUNT_KEY, count.toString());
}

/***********************
 * PICK RANDOM ITEM
 ***********************/
function pickRandom() {
  let remaining = getRemainingItems();
  
  // Animation reset and Remove previous color classes
  resultEl.classList.remove("animate", "mafia", "independent", "citizen", "other");
  void resultEl.offsetWidth;
  
  if (remaining.length === 0) {
    resultEl.innerText = "All roles picked 🎉";
	resultEl.classList.add("other");
    resultEl.style.opacity = 1;
    return;
  }

  const count = getPickCount() + 1;
  setPickCount(count);

  const index = Math.floor(Math.random() * remaining.length);
  const selected = remaining[index];

  remaining.splice(index, 1);
  setRemainingItems(remaining);

  
  

  // Determine color
  const selectedTrimmed = selected.trim();

  if (selectedTrimmed.includes("مافیا")) {
	resultEl.classList.add("mafia");
  } else if (selectedTrimmed.includes("مستقل")) {
	resultEl.classList.add("independent");
  } else if (selectedTrimmed.includes("شهروند")) {
    resultEl.classList.add("citizen");
  } else {
    resultEl.classList.add("other");
  }


  resultEl.innerText = `Seat ${count} \n ${selected}`;
  resultEl.classList.add("animate");

  // Rename button after first pick
  if (count === 1) {
    pickButton.innerText = "Next";
    itemCountEl.innerText = ""; // hide count after start
	listInput.classList.add("hidden"); // 👈 hide textarea
	document.getElementById("presetsSection").classList.add("hidden");

  }
}

/***********************
 * RESTART
 ***********************/
function restartApp() {
  setRemainingItems([...DEFAULT_LIST]);
  setPickCount(0);

  listInput.value = DEFAULT_LIST.join("\n");
  listInput.classList.remove("hidden"); // 👈 show textarea
  document.getElementById("presetsSection").classList.remove("hidden"); // 👈 show presets

  resultEl.innerText = "";
  pickButton.innerText = "Start Picking";
  itemCountEl.innerText = `Number of Roles: ${DEFAULT_LIST.length}`;
}


/***********************
 * CLEAR LIST
 ***********************/
function clearList() {
  listInput.value = "";
  setRemainingItems([]);
  setPickCount(0);
  resultEl.innerText = "";
  pickButton.innerText = "Start Picking";
  itemCountEl.innerText = "Number of Roles: 0";
  listInput.classList.remove("hidden"); // 👈 show textarea
  document.getElementById("presetsSection").classList.remove("hidden"); // 👈 show presets
}

/***********************
 * UPDATE LIST FROM TEXTAREA
 ***********************/
function updateListFromInput() {
  const items = listInput.value
    .split("\n")
    .map(i => i.trim())
    .filter(i => i.length > 0);

  setRemainingItems(items);
  setPickCount(0);
  pickButton.innerText = "Start Picking";
  resultEl.innerText = "";
  itemCountEl.innerText = `Number of Roles: ${items.length}`;
}
