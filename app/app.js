// Wiring: read the controls, re-render on every change. One job: connect
// the search box, filters and sort to the deal list.

import { deals } from "./deals.js";
import { filterDeals, categoriesOf, storesOf } from "./filters.js";
import { renderDeals, renderStats } from "./render.js";

const grid = document.getElementById("deal-grid");
const emptyEl = document.getElementById("empty");
const resultLine = document.getElementById("result-line");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const minDiscountSelect = document.getElementById("min-discount");
const storeSelect = document.getElementById("store-filter");
const lowsOnlyBox = document.getElementById("lows-only");
const chipsEl = document.getElementById("category-chips");

let activeCategory = "";

function buildChips() {
  const all = document.createElement("button");
  all.type = "button";
  all.className = "chip chip-active";
  all.textContent = "All categories";
  all.addEventListener("click", () => {
    activeCategory = "";
    refresh();
  });
  chipsEl.append(all);

  for (const category of categoriesOf(deals)) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = category;
    chip.dataset.category = category;
    chip.addEventListener("click", () => {
      activeCategory = activeCategory === category ? "" : category;
      refresh();
    });
    chipsEl.append(chip);
  }
}

function buildStoreOptions() {
  for (const store of storesOf(deals)) {
    const option = document.createElement("option");
    option.value = store;
    option.textContent = store;
    storeSelect.append(option);
  }
}

function refresh() {
  const shown = filterDeals(deals, {
    query: searchInput.value,
    category: activeCategory,
    store: storeSelect.value,
    minDiscount: Number(minDiscountSelect.value),
    lowsOnly: lowsOnlyBox.checked,
    sort: sortSelect.value,
  });
  renderDeals(grid, emptyEl, resultLine, shown, deals.length);
  for (const chip of chipsEl.querySelectorAll(".chip")) {
    chip.classList.toggle("chip-active", (chip.dataset.category ?? "") === activeCategory);
  }
}

// Shareable filtered views: #q=airpods, #cat=Audio, #store=Amazon,
// #min=30, #lows=1, #sort=discount. Read on load only.
function readHashState() {
  const params = new URLSearchParams(location.hash.slice(1));
  if (params.has("q")) searchInput.value = params.get("q");
  if (params.has("cat")) activeCategory = params.get("cat");
  if (params.has("store")) storeSelect.value = params.get("store");
  if (params.has("min")) minDiscountSelect.value = params.get("min");
  if (params.has("lows")) lowsOnlyBox.checked = params.get("lows") === "1";
  if (params.has("sort")) sortSelect.value = params.get("sort");
}

buildChips();
buildStoreOptions();
readHashState();
renderStats(
  {
    deals: document.getElementById("stat-deals"),
    lows: document.getElementById("stat-lows"),
    saving: document.getElementById("stat-saving"),
    stores: document.getElementById("stat-stores"),
  },
  deals,
);
refresh();

for (const el of [searchInput, sortSelect, minDiscountSelect, storeSelect, lowsOnlyBox]) {
  el.addEventListener("input", refresh);
  el.addEventListener("change", refresh);
}

// Press "/" anywhere to jump to the search box.
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});
