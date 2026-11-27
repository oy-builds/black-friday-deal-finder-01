// Rendering: turn deals into DOM cards and keep the header stats honest.
// One job: build the visible page from a list of deals. No data lives here.

import { discountPct, saving, dealScore, VERDICT_LABELS } from "./filters.js";
import { CHECKED_LABEL } from "./deals.js";

function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function verdictBadge(verdict) {
  const label = VERDICT_LABELS[verdict] ?? verdict;
  return `<span class="badge badge-${verdict}">${label}</span>`;
}

export function dealCard(deal) {
  const pct = discountPct(deal);
  const card = document.createElement("article");
  card.className = "deal-card";
  card.dataset.id = deal.id;
  card.innerHTML = `
    <div class="card-top">
      <span class="category">${deal.category}</span>
      ${verdictBadge(deal.verdict)}
    </div>
    <h3>${deal.title}</h3>
    <p class="store">${deal.store}</p>
    <p class="price-row">
      <span class="price">${money(deal.price)}</span>
      <span class="was"><s>${money(deal.was)}</s></span>
      <span class="pct">−${pct}%</span>
    </p>
    <p class="saving">You save ${money(saving(deal))} &middot; Deal score ${dealScore(deal)}</p>
    ${deal.ends ? `<p class="ends">${deal.ends}</p>` : ""}
    <p class="evidence">${deal.evidence}</p>
    <p class="meta">${CHECKED_LABEL} &middot; Source: ${deal.source}</p>
    <a class="buy" href="${deal.url}" target="_blank" rel="noopener">View at ${deal.store} &rarr;</a>
  `;
  return card;
}

export function renderDeals(grid, emptyEl, resultLine, deals, total) {
  grid.replaceChildren(...deals.map(dealCard));
  emptyEl.hidden = deals.length > 0;
  const word = deals.length === 1 ? "deal" : "deals";
  resultLine.textContent =
    deals.length === total
      ? `Showing all ${total} deals, best first.`
      : `Showing ${deals.length} of ${total} ${word} matching your filters.`;
}

export function renderStats(stats, deals) {
  const lows = deals.filter((d) => d.verdict === "new-low").length;
  const totalSaving = deals.reduce((sum, d) => sum + (d.was - d.price), 0);
  const stores = new Set(deals.map((d) => d.store)).size;
  stats.deals.textContent = String(deals.length);
  stats.lows.textContent = String(lows);
  stats.saving.textContent = "$" + Math.round(totalSaving).toLocaleString("en-US");
  stats.stores.textContent = String(stores);
}
