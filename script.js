/***********************
 * CONSTANTS
 ***********************/
const REMAINING_KEY = "remainingItems";
const COUNT_KEY = "pickCount";
const ACTIVE_KEY = "activeList";
const ORIGINAL_KEY = "originalList";

/***********************
 * DEFAULT LISTS
 ***********************/
const PRESET_LISTS = {
  list8: ["مافیا - پدرخوانده","مافیا - گروگانگیر","شهروند - نگهبان","شهروند - دکتر","شهروند - کارآگاه","شهروند - حرفه‌ای","شهروند - ساده ۱","شهروند - ساده ۲"],
  list9: ["مافیا - پدرخوانده","مافیا - گروگانگیر","مافیا - ساده","شهروند - نگهبان","شهروند - دکتر","شهروند - کارآگاه","شهروند - حرفه‌ای","شهروند - ساده ۱","شهروند - ساده ۲"],
  list10: ["مافیا - پدرخوانده","مافیا - گروگانگیر","مافیا - خریدار","شهروند - نگهبان","شهروند - دکتر","شهروند - کارآگاه","شهروند - حرفه‌ای","شهروند - اوشن","شهروند - ساده ۱","شهروند - ساده ۲"],
  list11: ["مافیا - پدرخوانده","مافیا - گروگانگیر","مافیا - خریدار","شهروند - نگهبان","شهروند - دکتر","شهروند - کارآگاه","شهروند - حرفه‌ای","شهروند - اوشن","شهروند - ساده ۱","شهروند - ساده ۲","مستقل - زودیاک"]
};

const DEFAULT_LIST = PRESET_LISTS['list10'];

/***********************
 * ELEMENT REFERENCES
 ***********************/
const listInput = document.getElementById("listInput");
const resultEl = document.getElementById("result");
const pickButton = document.getElementById("pickButton");
const itemCountEl = document.getElementById("itemCount");
const inputSection = document.getElementById("inputSection");
const pickSection = document.getElementById("pickSection");
const presetsSection = document.getElementById("presetsSection");

/***********************
 * INITIAL LOAD
 ***********************/
listInput.value = DEFAULT_LIST.join("\n");
setRemainingItems([...DEFAULT_LIST]);
setPickCount(0);
itemCountEl.innerText = `Number of Roles: ${DEFAULT_LIST.length}`;

/***********************
 * HELPERS
 ***********************/
function setRemainingItems(items) {
  localStorage.setItem(REMAINING_KEY, JSON.stringify(items));
}

function getRemainingItems() {
  return JSON.parse(localStorage.getItem(REMAINING_KEY)) || [];
}

function setPickCount(count) {
  localStorage.setItem(COUNT_KEY, count.toString());
}

function getPickCount() {
  return parseInt(localStorage.getItem(COUNT_KEY), 10) || 0;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/***********************
 * PRESET HANDLERS
 ***********************/
function loadPreset(listKey) {
  const list = PRESET_LISTS[listKey];
  if (!list) return;

  listInput.value = list.join("\n");
  listInput.classList.remove("hidden");

  setRemainingItems([...list]);
  setPickCount(0);

  resultEl.innerText = "";
  itemCountEl.innerText = `Number of Roles: ${list.length}`;

  // Hide presets
  const grid = document.getElementById("presetGrid");
  const toggleBtn = document.querySelector(".toggle-presets");
  grid.classList.add("hidden");
  toggleBtn.innerText = "Load X-Player Scenario ▾";
}

/***********************
 * START PICKING
 ***********************/
function startPicking() {
  const list = listInput.value
    .split("\n")
    .map(x => x.trim())
    .filter(x => x.length > 0);

  if (list.length === 0) {
    alert("List is empty");
    return;
  }

  localStorage.setItem(ACTIVE_KEY, JSON.stringify(list));
  localStorage.setItem(ORIGINAL_KEY, JSON.stringify(list));
  localStorage.setItem(REMAINING_KEY, JSON.stringify(shuffleArray([...list])));
  localStorage.setItem(COUNT_KEY, "0");

  inputSection.style.display = "none";
  presetsSection.style.display = "none";
  pickSection.style.display = "block";

  resultEl.textContent = "";
  pickButton.innerText = "Next";
  itemCountEl.innerText = "";
  listInput.classList.add("hidden");
}

/***********************
 * PICK NEXT
 ***********************/
function pickNext() {
  let remaining = getRemainingItems();
  let count = getPickCount();
  
  // resultEl.classList.remove("animate", "mafia", "independent", "citizen", "other");
  // void resultEl.offsetWidth;

  if (remaining.length === 0) {
	resultEl.classList.add("other");
    resultEl.innerText = "All roles picked 🎉";
	pickButton.style.display = "none";
    return;
  } 

  count++;
  const selected = remaining.shift();
  setPickCount(count);
  setRemainingItems(remaining);

  // Reset classes
  resultEl.className = "result animate";

  // Set text
  resultEl.innerText = `Seat ${count} \n ${selected}`;

  // Color logic
  const s = selected.trim();
  if (s.includes("مافیا")) {
    resultEl.classList.add("mafia");
  } else if (s.includes("مستقل")) {
    resultEl.classList.add("independent");
  } else if (s.includes("شهروند")) {
    resultEl.classList.add("citizen");
  } else {
	resultEl.classList.add("other");
  }

  // Animate
  void resultEl.offsetWidth;
  resultEl.classList.add("animate");
}

/***********************
 * RESTART
 ***********************/
function restartApp() {
  const original = JSON.parse(localStorage.getItem(ORIGINAL_KEY) || JSON.stringify([...DEFAULT_LIST]));
  setRemainingItems([...original]);
  setPickCount(0);

  listInput.value = original.join("\n");
  listInput.classList.remove("hidden");
  presetsSection.classList.remove("hidden");

  resultEl.innerText = "";
  pickButton.style.display = "inline-block"; // show Next button again
  pickButton.innerText = "Start Picking";
  itemCountEl.innerText = `Number of Roles: ${original.length}`;

  inputSection.style.display = "block";
  pickSection.style.display = "none";
  presetsSection.style.display = "block"
  
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
  itemCountEl.innerText = `Number of Roles: 0`;
  listInput.classList.remove("hidden");
  presetsSection.classList.remove("hidden");
}

/***********************
 * TOGGLE PRESETS
 ***********************/
function togglePresets() {
  const grid = document.getElementById("presetGrid");
  const toggleBtn = document.querySelector(".toggle-presets");
  grid.classList.toggle("hidden");
  toggleBtn.innerText = grid.classList.contains("hidden")
    ? "Load X-Player Scenario ▾"
    : "Load X-Player Scenario ▴";
}

window.startPicking = startPicking;
window.pickNext = pickNext;
window.restartApp = restartApp;
window.clearList = clearList;
window.togglePresets = togglePresets;
window.loadPreset = loadPreset;