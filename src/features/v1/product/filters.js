// utils/filters.js
function escapeRegex(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Build a Mongo filter from query params (name/category/sku/price, etc.) */
function buildProductFilter(qs = {}) {
  const {
    q,                // keyword
    name,             // exact name, case-insensitive
    category,
    sku,
    minPrice,
    maxPrice,
    inStock,          // "true" | "false"
    hasDiscount,      // "true" -> compareAtPrice > price
    useText,          // "true" -> use $text
  } = qs;

  const filter = {};

  // Name equality (case-insensitive)
  if (name) {
    const raw = String(name).trim().replace(/^"(.*)"$/, "$1");
    filter.name = new RegExp(`^${escapeRegex(raw)}$`, "i");
  }

  // Keyword search: prefer $text if requested and index exists; otherwise regex on several fields
  if (q && String(q).trim()) {
    const term = String(q).trim();
    if (String(useText) === "true") {
      filter.$text = { $search: term };
    } else {
      const rx = new RegExp(escapeRegex(term), "i");
      filter.$or = [
        { name: rx },
        { description: rx },
        { category: rx },
        { "inventory.sku": rx },
        { "variants.name": rx },
        { "variants.options": rx },
        { "specifications.name": rx },
        { "specifications.value": rx },
      ];
    }
  }

  if (category) filter.category = String(category);
  if (sku) filter["inventory.sku"] = String(sku);

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (typeof inStock !== "undefined") {
    const want = String(inStock) === "true";
    filter["inventory.quantity"] = want ? { $gt: 0 } : { $lte: 0 };
  }

  if (String(hasDiscount) === "true") {
    filter.$expr = { $gt: ["$compareAtPrice", "$price"] };
  }

  return filter;
}

module.exports = { buildProductFilter, escapeRegex };