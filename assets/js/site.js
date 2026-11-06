/* Karya Alam — shared interactions */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (ch) => {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  const numVal = (input) => Number(String(input && input.value || "").replace(",", "."));

  /* ---------- Year ---------- */
  $$("#year").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Sticky header shadow ---------- */
  const head = $("#siteHead");
  if (head) {
    const onScroll = () => head.classList.toggle("is-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Drawer ---------- */
  const drawer = $("#drawer");
  const menuBtn = $(".menu-btn");
  if (drawer && menuBtn) {
    const openDrawer = () => {
      drawer.showModal();
      menuBtn.setAttribute("aria-expanded", "true");
    };
    const closeDrawer = () => {
      if (drawer.open) drawer.close();
    };
    menuBtn.addEventListener("click", openDrawer);
    $$("[data-close-drawer]").forEach((btn) => btn.addEventListener("click", closeDrawer));
    $$("a", drawer).forEach((link) => link.addEventListener("click", closeDrawer));
    drawer.addEventListener("close", () => menuBtn.setAttribute("aria-expanded", "false"));
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) closeDrawer();
    });
  }

  /* ---------- Dialogs: close + backdrop ---------- */
  $$("[data-close-dialog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dlg = btn.closest("dialog");
      if (dlg && dlg.open) dlg.close();
    });
  });
  $$("dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside && dlg.open) dlg.close();
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------- WhatsApp helper ---------- */
  const waLink = (text) =>
    "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(text);

  /* ---------- Dark Mode ---------- */
  const initTheme = () => {
    const saved = localStorage.getItem("theme");
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = saved || sys;
    document.documentElement.setAttribute("data-theme", theme);
  };
  initTheme();

  window.toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  /* ---------- Services ---------- */
  const serviceGrid = $("#serviceGrid");
  const svcDialog = $("#serviceDialog");
  if (serviceGrid && typeof SERVICES !== "undefined") {
    const checkIcon =
      '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>';

    serviceGrid.innerHTML = SERVICES.map(
      (s) => `
      <button class="svc reveal" type="button" data-service="${s.id}">
        <span class="svc__media">
          <img src="${s.image}" alt="${s.alt}" width="1600" height="1067" loading="lazy">
        </span>
        <span class="svc__body">
          <span class="svc__meta">${s.meta}</span>
          <span class="svc__name">${s.name}</span>
          <span class="svc__go">Lihat cakupan
            <svg class="ic ic--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
          </span>
        </span>
      </button>`
    ).join("");

    if (!reduced && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      $$(".svc", serviceGrid).forEach((el) => io.observe(el));
    } else {
      $$(".svc", serviceGrid).forEach((el) => el.classList.add("is-in"));
    }

    serviceGrid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-service]");
      if (!card) return;
      const svc = SERVICES.find((s) => s.id === card.dataset.service);
      if (!svc || !svcDialog) return;

      $("#svcDialogImg").src = svc.image;
      $("#svcDialogImg").alt = svc.alt;
      $("#svcDialogMeta").textContent = svc.meta;
      $("#svcDialogTitle").textContent = svc.name;
      $("#svcDialogDesc").textContent = svc.short;
      $("#svcDialogList").innerHTML = svc.coverage
        .map((item) => `<li>${checkIcon}<span>${item}</span></li>`)
        .join("");
      $("#svcDialogCta").href = waLink(
        "Halo Karya Alam, saya ingin konsultasi layanan " + svc.name + "."
      );
      svcDialog.showModal();
    });
  }

  /* ---------- Maintenance toggle ---------- */
  const maintList = $("#maintList");
  if (maintList && typeof MAINTENANCE !== "undefined") {
    const check =
      '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>';
    const renderMaint = (key) => {
      maintList.innerHTML = MAINTENANCE[key]
        .map((task) => `<li>${check}<span>${task}</span></li>`)
        .join("");
      $$("[data-maint]").forEach((btn) =>
        btn.setAttribute("aria-pressed", String(btn.dataset.maint === key))
      );
    };
    renderMaint("mingguan");
    const seg = $(".seg");
    if (seg) {
      seg.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-maint]");
        if (!btn) return;
        renderMaint(btn.dataset.maint);
      });
    }
  }

  /* ---------- Review form ---------- */
  const reviewForm = $("#reviewForm");
  if (reviewForm) {
    const status = $("#reviewStatus");
    const nameInput = $("#rvName");
    const textInput = $("#rvText");
    const consent = $("#rvConsent");
    const ratingGroup = $("#ratingGroup");
    let ratingErr = $("#rvRatingErr");
    if (!ratingErr && ratingGroup) {
      ratingErr = document.createElement("p");
      ratingErr.className = "field__error";
      ratingErr.id = "rvRatingErr";
      ratingErr.setAttribute("role", "alert");
      ratingGroup.insertAdjacentElement("afterend", ratingErr);
    }

    const setError = (input, errEl, message) => {
      if (errEl) errEl.textContent = message;
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
    };

    const ratingValue = () => {
      const checked = reviewForm.querySelector('input[name="rating"]:checked');
      return checked ? Number(checked.value) : 0;
    };

    const clearStatus = () => {
      if (!status) return;
      status.hidden = true;
      status.textContent = "";
    };

    [nameInput, textInput].forEach((input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        const err = $("#" + input.id + "Err");
        if (input.getAttribute("aria-invalid") === "true") setError(input, err, "");
      });
    });

    if (ratingGroup) {
      ratingGroup.addEventListener("change", () => {
        if (ratingErr) ratingErr.textContent = "";
      });
    }

    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearStatus();
      let ok = true;

      if (!nameInput || nameInput.value.trim().length < 2) {
        setError(nameInput, $("#rvNameErr"), "Tulis nama Anda, minimal 2 karakter.");
        ok = false;
      } else {
        setError(nameInput, $("#rvNameErr"), "");
      }

      if (!ratingValue()) {
        if (ratingErr) ratingErr.textContent = "Pilih rating bintang 1 sampai 5.";
        ok = false;
      } else if (ratingErr) {
        ratingErr.textContent = "";
      }

      if (!textInput || textInput.value.trim().length < 20) {
        setError(textInput, $("#rvTextErr"), "Ulasan minimal 20 karakter agar cukup jelas.");
        ok = false;
      } else {
        setError(textInput, $("#rvTextErr"), "");
      }

      if (!consent || !consent.checked) {
        if (status) {
          status.hidden = false;
          status.className = "form-status form-status--error";
          status.textContent = "Centang persetujuan agar ulasan dapat dimoderasi dan ditampilkan.";
        }
        ok = false;
      }

      const photo = $("#rvPhoto");
      if (photo && photo.files && photo.files[0] && photo.files[0].size > 5 * 1024 * 1024) {
        if (status) {
          status.hidden = false;
          status.className = "form-status form-status--error";
          status.textContent = "Ukuran foto melebihi 5 MB. Pilih foto yang lebih kecil.";
        }
        ok = false;
      }

      if (!ok) return;

      reviewForm.reset();
      if (ratingErr) ratingErr.textContent = "";
      setError(nameInput, $("#rvNameErr"), "");
      setError(textInput, $("#rvTextErr"), "");
      if (status) {
        status.hidden = false;
        status.className = "form-status";
        status.textContent =
          "Terima kasih. Ulasan Anda masuk antrean moderasi dan akan tampil setelah disetujui admin.";
      }
    });
  }

  /* ---------- Contact form ---------- */
  const contactForm = $("#contactForm");
  if (contactForm) {
    const status = $("#contactStatus");
    const name = $("#ctName");
    const need = $("#ctNeed");
    const msg = $("#ctMsg");

    const fieldError = (input, text) => {
      const err = $("#" + input.id + "Err");
      if (err) err.textContent = text;
      input.setAttribute("aria-invalid", text ? "true" : "false");
    };

    [name, need, msg].forEach((input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") fieldError(input, "");
      });
      input.addEventListener("change", () => {
        if (input.getAttribute("aria-invalid") === "true") fieldError(input, "");
      });
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!status || !name || !need || !msg) return;
      status.hidden = true;
      let ok = true;

      if (name.value.trim().length < 2) {
        fieldError(name, "Tulis nama Anda, minimal 2 karakter.");
        ok = false;
      } else fieldError(name, "");

      if (!need.value) {
        fieldError(need, "Pilih layanan atau kebutuhan Anda.");
        ok = false;
      } else fieldError(need, "");

      if (msg.value.trim().length < 10) {
        fieldError(msg, "Ceritakan kebutuhan Anda sedikit lebih lengkap.");
        ok = false;
      } else fieldError(msg, "");

      if (!ok) return;

      const text =
        "Halo Karya Alam, saya " +
        name.value.trim() +
        ". Kebutuhan: " +
        need.value +
        ". " +
        msg.value.trim();

      status.hidden = false;
      status.className = "form-status";
      status.innerHTML =
        'Pesan siap dikirim. <a href="' +
        waLink(text) +
        '" target="_blank" rel="noopener"><strong>Buka WhatsApp untuk mengirim</strong></a>.';
    });
  }

  /* ---------- Chatbot RAB ---------- */
  const botLaunch = $("#botLaunch");
  const botPanel = $("#botPanel");
  if (botLaunch && botPanel && typeof ESTIMATOR !== "undefined") {
    const log = $("#botLog");
    const controls = $("#botControls");
    const closeBtn = $("#botClose");
    let started = false;
    let step = "service";
    let chosen = null;

    const scrollLog = () => {
      log.scrollTop = log.scrollHeight;
    };

    const addBubble = (html, who) => {
      const div = document.createElement("div");
      div.className = "bubble" + (who === "user" ? " bubble--user" : "");
      div.innerHTML = html;
      log.appendChild(div);
      scrollLog();
      return div;
    };

    const openBot = () => {
      botPanel.hidden = false;
      botLaunch.setAttribute("aria-expanded", "true");
      if (!started) {
        started = true;
        addBubble(
          "Selamat datang di <strong>Karya Alam</strong>. Saya bisa bantu membuat estimasi awal RAB. Pilih jenis pekerjaan dulu, lalu isi ukuran area."
        );
        renderServices();
      }
      if (closeBtn) closeBtn.focus();
    };

    const closeBot = () => {
      botPanel.hidden = true;
      botLaunch.setAttribute("aria-expanded", "false");
      botLaunch.focus();
    };

    botLaunch.addEventListener("click", () => {
      if (botPanel.hidden) openBot();
      else closeBot();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeBot);

    const renderServices = () => {
      step = "service";
      const chips = [
        ["koi", "Kolam Koi"],
        ["renang", "Kolam Renang"],
        ["taman", "Taman"],
        ["tebing", "Tebing"],
        ["pasang", "Pasang Batu"],
        ["maintenance", "Maintenance"]
      ];
      controls.innerHTML =
        '<div class="chips">' +
        chips
          .map(
            ([key, label]) =>
              '<button class="chip" type="button" data-pick="' + key + '">' + label + "</button>"
          )
          .join("") +
        "</div>" +
        '<p class="bot-note">Kolam budidaya RAS memakai BOQ terpisah. <a href="https://wa.me/6281328696300?text=Halo%20Karya%20Alam%2C%20saya%20ingin%20konsultasi%20kolam%20budidaya%20RAS." target="_blank" rel="noopener">Tanya via WhatsApp</a>.</p>';
    };

    controls.addEventListener("click", (e) => {
      const pick = e.target.closest("[data-pick]");
      if (pick) {
        startEstimate(pick.dataset.pick);
        return;
      }
      if (e.target.closest("[data-reset]")) {
        renderServices();
        addBubble("Baik, mari mulai lagi. Pilih jenis pekerjaan.");
        return;
      }
    });

    const startEstimate = (key) => {
      chosen = key;
      step = "dims";
      const data = ESTIMATOR[key];
      addBubble(data.name, "user");
      if (key === "maintenance") {
        addBubble(
          "Berapa kali kunjungan per bulan, dan di area mana? Paket bulanan standar biasanya 4 kunjungan untuk kolam koi."
        );
        controls.innerHTML =
          '<form class="bot-form" id="botForm">' +
          '<div class="bot-form__row">' +
          '<div><label for="botVisits">Kunjungan / bulan</label><input id="botVisits" type="number" min="1" max="12" step="1" value="4" required></div>' +
          '<div><label for="botLocM">Lokasi</label><input id="botLocM" type="text" placeholder="Contoh: Ngaglik" required></div>' +
          "</div>" +
          '<button class="btn btn--lime btn--block" type="submit">Hitung estimasi</button>' +
          "</form>" +
          '<p class="bot-note">Estimasi memakai acuan Rp160.000 per kunjungan. Belum termasuk perbaikan besar atau material tambahan.</p>';
      } else {
        const needHeight = key === "koi" || key === "renang";
        addBubble(
          "Isi ukuran area dalam meter. " +
            (needHeight
              ? "Untuk kolam, tinggi juga dibutuhkan agar hitungan dinding dan volume benar."
              : "Cukup panjang dan lebar area.") +
            " Foto saja belum cukup untuk hitungan akurat — ukuran tetap diperlukan."
        );
        controls.innerHTML =
          '<form class="bot-form" id="botForm">' +
          '<div class="bot-form__row">' +
          '<div><label for="botP">Panjang (m)</label><input id="botP" type="number" min="0.5" step="0.1" inputmode="decimal" required></div>' +
          '<div><label for="botL">Lebar (m)</label><input id="botL" type="number" min="0.5" step="0.1" inputmode="decimal" required></div>' +
          "</div>" +
          (needHeight
            ? '<div><label for="botT">Tinggi / kedalaman (m)</label><input id="botT" type="number" min="0.3" step="0.1" inputmode="decimal" required></div>'
            : "") +
          '<div><label for="botLoc">Lokasi</label><input id="botLoc" type="text" placeholder="Contoh: Sleman" required></div>' +
          '<button class="btn btn--lime btn--block" type="submit">Hitung estimasi</button>' +
          "</form>" +
          '<p class="bot-note">Hasil adalah estimasi awal. Harga final setelah survei lokasi.</p>';
      }

      const form = $("#botForm");
      if (!form) return;
      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        if (key === "maintenance") {
          const visitsEl = $("#botVisits");
          const locEl = $("#botLocM");
          const visits = numVal(visitsEl);
          const loc = locEl ? locEl.value.trim() : "";
          if (!visits || visits < 1 || visits > 12 || !loc) {
            addBubble("Isi jumlah kunjungan 1–12 dan lokasi Anda dulu, ya.");
            return;
          }
          const total = visits * ESTIMATOR.maintenance.perVisit;
          addBubble("Maintenance · " + visits + " kunjungan/bulan · " + esc(loc), "user");
          showResult({
            title: "Maintenance kolam",
            rows: [
              ["Kunjungan (" + visits + " × Rp160.000)", formatRupiah(total)]
            ],
            total,
            summary:
              "Maintenance " + visits + " kunjungan/bulan, lokasi " + loc
          });
        } else {
          const p = numVal($("#botP"));
          const l = numVal($("#botL"));
          const tEl = $("#botT");
          const t = tEl ? numVal(tEl) : 0;
          const locEl = $("#botLoc");
          const loc = locEl ? locEl.value.trim() : "";
          const needHeight = key === "koi" || key === "renang";
          if (!p || !l || p <= 0 || l <= 0 || (needHeight && (!t || t <= 0)) || !loc) {
            addBubble("Lengkapi ukuran dan lokasi dengan angka yang valid dulu, ya.");
            return;
          }
          addBubble(
            ESTIMATOR[key].name +
              " · " +
              p +
              " × " +
              l +
              " m" +
              (needHeight ? " · tinggi " + t + " m" : "") +
              " · " +
              esc(loc),
            "user"
          );
          const result = estimate(key, p, l, t);
          showResult({
            title: ESTIMATOR[key].name,
            rows: result.rows,
            total: result.total,
            summary:
              ESTIMATOR[key].name +
              " " +
              p +
              "×" +
              l +
              " m" +
              (needHeight ? " t=" + t + " m" : "") +
              ", lokasi " +
              loc
          });
        }
      });
    };

    const estimate = (key, p, l, t) => {
      const area = p * l;
      if (key === "koi") {
        const wall = 2 * (p + l) * t;
        const surface = wall + area;
        const build = surface * ESTIMATOR.koi.build;
        const total = build + ESTIMATOR.koi.filtration;
        return {
          rows: [
            ["Konstruksi " + round1(surface) + " m² × Rp900.000", formatRupiah(build)],
            ["Filtrasi, chamber & pompa", formatRupiah(ESTIMATOR.koi.filtration)]
          ],
          total
        };
      }
      if (key === "renang") {
        const volume = area * t;
        const total = volume * ESTIMATOR.renang.perM3;
        return {
          rows: [
            ["Volume " + round1(volume) + " m³ × Rp4.500.000", formatRupiah(total)]
          ],
          total
        };
      }
      if (key === "taman") {
        const total = area * ESTIMATOR.taman.perM2;
        return {
          rows: [["Taman " + round1(area) + " m² × Rp290.000", formatRupiah(total)]],
          total
        };
      }
      if (key === "tebing") {
        const rate = area < ESTIMATOR.tebing.threshold ? ESTIMATOR.tebing.high : ESTIMATOR.tebing.low;
        const total = area * rate;
        return {
          rows: [["Tebing " + round1(area) + " m² × " + formatRupiah(rate), formatRupiah(total)]],
          total
        };
      }
      if (key === "pasang") {
        const total = area * ESTIMATOR.pasang.perM2;
        return {
          rows: [["Pasang " + round1(area) + " m² × Rp250.000", formatRupiah(total)]],
          total
        };
      }
      return { rows: [], total: 0 };
    };

    const round1 = (n) => {
      const r = Math.round(n * 10) / 10;
      return String(r).replace(".", ",");
    };

    const formatRupiah = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n));

    const showResult = (data) => {
      step = "result";
      const rows = data.rows
        .map(
          (row) =>
            '<div class="est-row"><span>' +
            row[0] +
            "</span><span>" +
            row[1] +
            "</span></div>"
        )
        .join("");
      addBubble(
        "<strong>Estimasi " +
          data.title +
          "</strong>" +
          rows +
          '<div class="bubble__total"><span>Total estimasi</span><span>' +
          formatRupiah(data.total) +
          "</span></div>" +
          '<span class="bubble__small">Estimasi awal, bukan penawaran final. Belum termasuk ongkir, bongkar, kondisi tanah, dan pekerjaan tambahan. Harga final setelah survei.</span>'
      );

      const waText =
        "Halo Karya Alam, saya ingin RAB final untuk " +
        data.summary +
        ". Estimasi dari situs: " +
        formatRupiah(data.total) +
        ".";

      controls.innerHTML =
        '<div class="chips">' +
        '<a class="chip" href="' +
        waLink(waText) +
        '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;text-decoration:none">Minta RAB final via WhatsApp</a>' +
        '<button class="chip" type="button" data-reset>Hitung lagi</button>' +
        "</div>" +
        '<p class="bot-note">Foto area bisa dilampirkan saat chat WhatsApp. Foto tanpa ukuran tetap ditandai sebagai perkiraan kasar.</p>';
    };
  }
})();
