module.exports = function (cfg) {
  cfg.addPassthroughCopy({ "assets": "assets", "media": "media", "admin": "admin" });

  cfg.addFilter("mmyyyy", (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d)) return v;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return mm + "/" + d.getFullYear();
  });

  cfg.addCollection("archive", (api) =>
    api.getFilteredByGlob("src/archive/*.md").sort((a, b) => (b.data.date || 0) - (a.data.date || 0))
  );
  cfg.addCollection("events", (api) =>
    api.getFilteredByGlob("src/events/*.md").sort((a, b) => (a.data.date || 0) - (b.data.date || 0))
  );

  return { dir: { input: "src", includes: "_includes", output: "_site" } };
};
