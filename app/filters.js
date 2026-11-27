// Filtering, scoring and sorting for the deal list. One job: turn the raw
// deals plus the user's search and filter choices into an ordered list.

export const VERDICT_LABELS = {
  "new-low": "NEW LOW",
  strong: "STRONG PRICE",
  routine: "ROUTINE SALE",
};

export const VERDICT_BONUS = { "new-low": 25, strong: 10, routine: 0 };

// Discount percentage, rounded to a whole number.
export function discountPct(deal) {
  return Math.round(((deal.was - deal.price) / deal.was) * 100);
}

// Dollars saved.
export function saving(deal) {
  return +(deal.was - deal.price).toFixed(2);
}

// Deal score: discount percentage plus a verdict bonus, so a modest cut
// that is a genuine all-time low still ranks above a big cut on an
// inflated list price.
export function dealScore(deal) {
  return discountPct(deal) + (VERDICT_BONUS[deal.verdict] ?? 0);
}

export function categoriesOf(deals) {
  return [...new Set(deals.map((d) => d.category))].sort();
}

export function storesOf(deals) {
  return [...new Set(deals.map((d) => d.store))].sort();
}

// Apply search text, category, store, minimum discount and the
// new-lows-only switch, then sort. Returns a new array.
export function filterDeals(deals, opts) {
  const query = (opts.query ?? "").trim().toLowerCase();
  const kept = deals.filter((deal) => {
    if (opts.category && deal.category !== opts.category) return false;
    if (opts.store && deal.store !== opts.store) return false;
    if (discountPct(deal) < (opts.minDiscount ?? 0)) return false;
    if (opts.lowsOnly && deal.verdict !== "new-low") return false;
    if (query) {
      const haystack = `${deal.title} ${deal.store} ${deal.category} ${VERDICT_LABELS[deal.verdict] ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const sorted = [...kept];
  switch (opts.sort) {
    case "discount":
      sorted.sort((a, b) => discountPct(b) - discountPct(a));
      break;
    case "saving":
      sorted.sort((a, b) => saving(b) - saving(a));
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    default: // "score"
      sorted.sort((a, b) => dealScore(b) - dealScore(a));
  }
  return sorted;
}
