/* Karya Alam — catalog filters and product detail */
(function () {
  "use strict";

  const grid = document.getElementById("productGrid");
  if (!grid || typeof PRODUCTS === "undefined") return;

  const $ = (sel) => document.querySelector(sel);
  const state = { category: "", size: "", q: "" };
  const rail = document.getElementById("categoryRail");
  const searchInput = document.getElementById("searchInput");
  const sizeSelect = document.getElementById("sizeSelect");
  const resultCount = document.getElementById("resultCount");
  const empty = document.getElementById("catalogEmpty");
  const resetBtn = document.getElementById("resetFilters");
  const dialog = document.getElementById("productDialog");
  let lastProductId = null;

  const catName = (id) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? cat.name : "Batu alam";
  };

  const normal = (s) =>
    String(s)
      .toLowerCase()
      .replace(/×/g, "x")
      .replace(/\s+/g, " ")
      .trim();

  const matches = (p) => {
    if (state.category && p.category !== state.category) return false;
    if (state.size && !p.sizes.includes(state.size)) return false;
    if (state.q) {
      const q = normal(state.q);
      const haystack = normal(
        [p.name, p.desc, p.character, p.motif, catName(p.category), p.sizes.join(" "), p.uses.join(" ")].join(" ")
      );
      if (!haystack.includes(q)) return false;
    }
    return true;
  };

  const syncUrl = () => {
    try {
      const url = new URL(window.location.href);
      if (state.category) url.searchParams.set("kategori", state.category);
      else url.searchParams.delete("kategori");
      window.history.replaceState({}, "", url.toString());
    } catch (err) {
      /* URL metadata is optional. */
    }
  };

  const renderRail = () => {
    const chips = [{ id: "", name: "Semua" }].concat(CATEGORIES);
    rail.innerHTML = chips
      .map(
        (c) =>
          '<button class="chip" type="button" data-cat="' +
          c.id +
          '" aria-pressed="' +
          String(state.category === c.id) +
          '">' +
          (c.id ? c.name.replace("Batu ", "") : c.name) +
          "</button>"
      )
      .join("");
  };

  const renderSizes = () => {
    const sizes = [];
    PRODUCTS.forEach((p) =>
      p.sizes.forEach((s) => {
        if (!sizes.includes(s)) sizes.push(s);
      })
    );
    sizeSelect.innerHTML =
      '<option value="">Semua ukuran</option>' +
      sizes.map((s) => '<option value="' + s + '">' + s + "</option>").join("");
  };

  const renderProducts = () => {
    const items = PRODUCTS.filter(matches);
    if (resultCount) resultCount.textContent = String(items.length);

    grid.innerHTML = items
      .map(
        (p) => `
        <button class="product" type="button" data-product="${p.id}">
          <span class="product__media">
            <img src="${p.image}" alt="${p.alt}" width="1200" height="800" loading="lazy">
            ${p.label ? '<span class="badge">' + p.label + "</span>" : ""}
          </span>
          <span class="product__body">
            <span class="product__cat">${catName(p.category)}</span>
            <span class="product__name">${p.name}</span>
            <span class="product__sizes">${p.sizes.length} ukuran · ${p.sizes[0]}</span>
            <span class="product__foot">Lihat detail
              <svg class="ic ic--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
            </span>
          </span>
        </button>`
      )
      .join("");

    if (empty) empty.hidden = items.length !== 0;
    grid.hidden = items.length === 0;
  };

  const openProduct = (id) => {
    const p = PRODUCTS.find((item) => item.id === id);
    if (!p || !dialog) return;
    lastProductId = id;

    const img = document.getElementById("pdImg");
    img.src = p.image;
    img.alt = p.alt;
    document.getElementById("pdCat").textContent = catName(p.category);
    document.getElementById("pdTitle").textContent = p.name;
    document.getElementById("pdDesc").textContent = p.desc;
    document.getElementById("pdCharacter").textContent = p.character;
    document.getElementById("pdMotif").textContent = "Motif: " + p.motif;
    document.getElementById("pdSizes").innerHTML = p.sizes
      .map((s) => '<span class="tag">' + s + "</span>")
      .join("");
    document.getElementById("pdUses").innerHTML = p.uses
      .map((s) => '<span class="tag">' + s + "</span>")
      .join("");

    const compareWrap = document.getElementById("pdCompareWrap");
    if (p.category === "andesit") {
      document.getElementById("pdCompareIntro").textContent = COMPARISON.intro;
      document.getElementById("pdCompareBody").innerHTML = COMPARISON.rows
        .map(
          (row) =>
            "<tr><td>" +
            row[0] +
            "</td><td>" +
            row[1] +
            "</td><td>" +
            row[2] +
            "</td></tr>"
        )
        .join("");
      compareWrap.hidden = false;
    } else {
      compareWrap.hidden = true;
    }

    document.getElementById("pdCta").href =
      "https://wa.me/" +
      SITE.whatsapp +
      "?text=" +
      encodeURIComponent(
        "Halo Karya Alam, saya ingin tanya ketersediaan " +
          p.name +
          " ukuran " +
          p.sizes[0] +
          ". Apakah stoknya tersedia?"
      );

    dialog.showModal();
  };

  grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-product]");
    if (card) openProduct(card.dataset.product);
  });

  if (dialog) {
    dialog.addEventListener("close", () => {
      if (!lastProductId) return;
      const next = grid.querySelector('[data-product="' + lastProductId + '"]');
      if (next) next.focus();
      else if (resetBtn) resetBtn.focus();
    });
  }

  rail.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-cat]");
    if (!chip) return;
    state.category = chip.dataset.cat;
    Array.from(rail.querySelectorAll("[data-cat]")).forEach((btn) =>
      btn.setAttribute("aria-pressed", String(btn.dataset.cat === state.category))
    );
    syncUrl();
    renderProducts();
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.q = searchInput.value;
      renderProducts();
    });
  }

  if (sizeSelect) {
    sizeSelect.addEventListener("change", () => {
      state.size = sizeSelect.value;
      renderProducts();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.category = "";
      state.size = "";
      state.q = "";
      if (searchInput) searchInput.value = "";
      if (sizeSelect) sizeSelect.value = "";
      Array.from(rail.querySelectorAll("[data-cat]")).forEach((btn) =>
        btn.setAttribute("aria-pressed", String(btn.dataset.cat === ""))
      );
      syncUrl();
      renderProducts();
      if (searchInput) searchInput.focus();
    });
  }

  const param = new URLSearchParams(window.location.search).get("kategori");
  if (param && CATEGORIES.some((c) => c.id === param)) state.category = param;

  renderRail();
  renderSizes();
  renderProducts();
})();
