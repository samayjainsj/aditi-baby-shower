/*
 * Renders content.js into the page and runs the little interactions:
 * block-topple opening, countdown, scroll reveals, falling leaves, music.
 */
(() => {
  const INVITE = window.INVITE;
  const ART = window.ART;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BLOCK_COLORS = ["#c9a35c", "#d9804a", "#d9804a", "#a9c29a", "#ead9b8", "#5e7d5a"];

  const escapeHtml = (text) =>
    String(text).replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

  /** Resolve "a.b.c" against INVITE. "parents" is shorthand for the joined names. */
  const lookup = (path) =>
    path === "parents"
      ? INVITE.hero.parents.join(" & ")
      : path.split(".").reduce((node, key) => node?.[key], INVITE);

  // ---- Dates ---------------------------------------------------------------
  const firstEventStart = new Date(INVITE.schedule.events[0].start);

  const dateParts = (date, options) =>
    Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", { ...options, timeZone: INVITE.timezone })
        .formatToParts(date)
        .map(({ type, value }) => [type, value]),
    );

  const formatters = {
    longDate(date) {
      const p = dateParts(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      return `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
    },
    shortDate(date) {
      const p = dateParts(date, { weekday: "short", day: "numeric", month: "short" });
      return `${p.weekday}, ${p.day} ${p.month}`;
    },
    time(date) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: true, timeZone: INVITE.timezone,
      }).format(date);
    },
  };

  // ---- Static bindings -----------------------------------------------------
  function renderArt(spec) {
    const [kind, arg] = spec.split(":");
    return kind === "icon" ? ART.icon(arg) : ART[kind](arg);
  }

  function bindStatic() {
    $$("[data-text]").forEach((node) => { node.textContent = lookup(node.dataset.text) ?? ""; });
    $$("[data-format]").forEach((node) => {
      node.textContent = formatters[node.dataset.format](firstEventStart);
    });
    $$("[data-art]").forEach((node) => { node.innerHTML = renderArt(node.dataset.art); });
    $("#maps-link").href = INVITE.location.mapsUrl;
  }

  // ---- Photos (missing files are skipped, never shown broken) -------------
  function renderCover() {
    const frame = $("#cover");
    const img = new Image();
    img.alt = INVITE.photos.coverAlt;
    img.decoding = "async";
    img.onerror = () => {
      frame.classList.add("photo-frame--art");
      frame.innerHTML = ART.hedge();
    };
    img.src = INVITE.photos.cover;
    frame.append(img);
  }

  function renderGallery() {
    const section = $("#gallery-section");
    const list = $("#gallery");
    INVITE.photos.gallery.forEach((src, index) => {
      const item = document.createElement("li");
      const img = new Image();
      img.alt = `${INVITE.photos.coverAlt}, photo ${index + 1}`;
      img.decoding = "async"; // no lazy-loading: the section starts hidden, and lazy images there never load
      img.onload = () => { section.hidden = false; };
      img.onerror = () => item.remove();
      img.src = src;
      item.append(img);
      list.append(item);
    });
  }

  // ---- Schedule ------------------------------------------------------------
  function renderTimeline() {
    $("#timeline").innerHTML = INVITE.schedule.events.map((event) => {
      const start = new Date(event.start);
      return `
        <li class="timeline__item">
          <span class="timeline__node">${ART.icon(event.icon)}</span>
          <article class="card timeline__card">
            <h3 class="timeline__name">${escapeHtml(event.name)}</h3>
            <p class="timeline__when">${ART.icon("clock")}
              <time datetime="${escapeHtml(event.start)}">${formatters.shortDate(start)} &middot; ${formatters.time(start)}</time></p>
            <p class="timeline__venue">${ART.icon("pin")}${escapeHtml(event.venue)}</p>
            <p class="timeline__desc">${escapeHtml(event.description)}</p>
          </article>
        </li>`;
    }).join("");
  }

  // ---- Countdown -----------------------------------------------------------
  function startCountdown() {
    const units = Object.fromEntries($$("[data-unit]").map((node) => [node.dataset.unit, node]));
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const remaining = firstEventStart - Date.now();
      if (remaining <= 0) {
        $("#countdown").hidden = true;
        $("#countdown-done").hidden = false;
        return clearInterval(timer);
      }
      const totalSecs = Math.floor(remaining / 1000);
      units.days.textContent = pad(Math.floor(totalSecs / 86400));
      units.hours.textContent = pad(Math.floor(totalSecs / 3600) % 24);
      units.mins.textContent = pad(Math.floor(totalSecs / 60) % 60);
      units.secs.textContent = pad(totalSecs % 60);
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  // ---- Scroll reveal -------------------------------------------------------
  function setupReveal() {
    const targets = $$("[data-reveal]");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    targets.forEach((node) => observer.observe(node));
  }

  // ---- Falling leaves ------------------------------------------------------
  const random = (min, max) => min + Math.random() * (max - min);

  function startLeaves() {
    if (reducedMotion) return;
    $("#leaves").innerHTML = Array.from({ length: 12 }, (_, i) => {
      const style = [
        `left:${random(0, 96).toFixed(1)}%`,
        `--size:${random(12, 22).toFixed(0)}px`,
        `--duration:${random(10, 18).toFixed(1)}s`,
        `--delay:${(-random(0, 18)).toFixed(1)}s`,
        `--drift:${random(-40, 40).toFixed(0)}px`,
      ].join(";");
      const color = ART.LEAF_COLORS[i % ART.LEAF_COLORS.length];
      return `<span class="falling-leaf" style="${style}"><span>${ART.leaf(color)}</span></span>`;
    }).join("");
  }

  // ---- Music ---------------------------------------------------------------
  const music = {
    audio: $("#audio"),
    button: $("#music"),
    init() {
      if (!INVITE.music) return;
      this.button.innerHTML = ART.icon("music");
      this.audio.preload = "metadata";
      this.audio.addEventListener("loadedmetadata", () => { this.button.hidden = false; }, { once: true });
      this.audio.src = INVITE.music;
      this.button.addEventListener("click", () => (this.audio.paused ? this.play() : this.pause()));
    },
    play() {
      if (!this.audio.src) return;
      this.audio.play().then(() => this.sync(true)).catch(() => this.sync(false));
    },
    pause() {
      this.audio.pause();
      this.sync(false);
    },
    sync(playing) {
      this.button.setAttribute("aria-pressed", String(playing));
      this.button.setAttribute("aria-label", playing ? "Pause music" : "Play music");
      this.button.classList.toggle("is-playing", playing);
    },
  };

  // ---- Opening gate --------------------------------------------------------
  function buildBlocks(button) {
    let colorIndex = 0;
    button.innerHTML = INVITE.gate.blocks.map((word) =>
      `<span class="gate__row">${[...word].map((letter) => {
        const i = colorIndex++;
        const color = BLOCK_COLORS[i % BLOCK_COLORS.length];
        return `<span class="block" style="--block:${color};--i:${i}"><span>${escapeHtml(letter)}</span></span>`;
      }).join("")}</span>`).join("");
  }

  function burstConfetti(origin) {
    const colors = [...ART.LEAF_COLORS, "#5e7d5a", "#ead9b8"];
    const pieces = Array.from({ length: 70 }, (_, i) => {
      const angle = random(-Math.PI, 0);
      const distance = random(60, 170);
      const style = [
        `--x:${(Math.cos(angle) * distance).toFixed(0)}px`,
        `--y:${(Math.sin(angle) * distance).toFixed(0)}px`,
        `--spin:${random(-540, 540).toFixed(0)}deg`,
        `background:${colors[i % colors.length]}`,
        i % 3 ? "" : "border-radius:50%",
      ].join(";");
      return `<span class="confetti" style="${style}"></span>`;
    }).join("");
    origin.insertAdjacentHTML("beforeend", `<span class="confetti-burst" aria-hidden="true">${pieces}</span>`);
  }

  function topple(button) {
    $$(".block", button).forEach((block, i, all) => {
      const fromCentre = i - (all.length - 1) / 2;
      block.style.setProperty("--dx", `${(fromCentre * random(40, 70)).toFixed(0)}px`);
      block.style.setProperty("--dy", `${random(30, 70).toFixed(0)}px`);
      block.style.setProperty("--rot", `${(Math.sign(fromCentre || 1) * random(40, 120)).toFixed(0)}deg`);
    });
    button.classList.add("is-toppled");
  }

  function setupGate() {
    const gate = $("#gate");
    const button = $("#gate-button");
    const page = $("#page");
    buildBlocks(button);
    button.addEventListener("click", () => {
      button.disabled = true;
      music.play(); // must start inside the tap, or browsers block autoplay
      if (!reducedMotion) {
        topple(button);
        burstConfetti(button);
      }
      const fadeAfter = reducedMotion ? 0 : 1200;
      setTimeout(() => gate.classList.add("is-leaving"), fadeAfter);
      setTimeout(() => {
        gate.remove();
        page.inert = false;
        setupReveal(); // only now, so the hero animals pop up where guests can see them
        startLeaves();
        $("#hero-names").focus({ preventScroll: true });
      }, fadeAfter + 600);
    }, { once: true });
  }

  // ---- Go ------------------------------------------------------------------
  bindStatic();
  renderCover();
  renderGallery();
  renderTimeline();
  startCountdown();
  music.init();
  setupGate();
})();
