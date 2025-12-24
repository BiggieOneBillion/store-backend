const { buildProductFilter } = require("./filters");

module.exports = function filterRequest(req) {
  const filter = buildProductFilter(req.query);
  const sortObj = {};
  const sort = req.query.sort || "-createdAt";
  String(sort)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((k) => {
      if (k.startsWith("-")) sortObj[k.slice(1)] = -1;
      else sortObj[k] = 1;
    });

  const select = req.query.select
    ? String(req.query.select)
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .join(" ")
    : undefined;

  const populate = req.query.populate
    ? String(req.query.populate)
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  /** paginate options */
  const options = {
    page,
    limit,
    sort: sortObj,
    select, // projection
    populate, // simple paths; for deep nesting use objects
    lean: true, // faster plain objects
    collation: { locale: "en", strength: 2 }, // case-insensitive sorts/equals where relevant
  };

  // For $text search, you can add score projection/sort:
  if (filter.$text) {
    options.select = options.select
      ? `${options.select} score`
      : "name price category inventory.sku score";
    options.sort = { score: { $meta: "textScore" } };
  }

  return { options, filter };
};
