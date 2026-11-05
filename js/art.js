/*
 * Original SVG artwork for the invite (drawn for this project, no third-party art).
 * Every function returns an SVG string. Decorative art is aria-hidden.
 */
(() => {
  const C = {
    ink: "#3b3a2a",
    bush: "#8fae86",
    bushShade: "#6f9068",
    blossom: "#e8a3a0",
    bud: "#fff3d6",
    blush: "#f4b7b7",
    white: "#fbf7f2",
  };
  const LEAF_COLORS = ["#7f9f78", "#c9a35c", "#c46a3d", "#a9c29a"];

  const svg = (viewBox, body, cls = "") =>
    `<svg class="${cls}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;

  const eyes = (y, gap = 9) =>
    [80 - gap, 80 + gap]
      .map((x) => `<circle cx="${x}" cy="${y}" r="2.7" fill="${C.ink}"/>` +
                  `<circle cx="${x + 0.9}" cy="${y - 0.9}" r="0.8" fill="#fff"/>`)
      .join("");

  const cheeks = (y, gap = 15) =>
    `<circle cx="${80 - gap}" cy="${y}" r="4.2" fill="${C.blush}" opacity=".85"/>` +
    `<circle cx="${80 + gap}" cy="${y}" r="4.2" fill="${C.blush}" opacity=".85"/>`;

  const smile = (y) =>
    `<path d="M76.5 ${y} q1.75 2.6 3.5 0 q1.75 2.6 3.5 0" fill="none" stroke="${C.ink}" stroke-width="1.3" stroke-linecap="round"/>`;

  // Animal heads, centred on x=80, sized for a 160x110 "peek" scene.
  const ANIMALS = {
    bunny: () =>
      `<ellipse cx="69" cy="26" rx="8" ry="24" fill="${C.white}"/>` +
      `<ellipse cx="91" cy="26" rx="8" ry="24" fill="${C.white}"/>` +
      `<ellipse cx="69" cy="28" rx="4" ry="17" fill="#f2b6c1"/>` +
      `<ellipse cx="91" cy="28" rx="4" ry="17" fill="#f2b6c1"/>` +
      `<circle cx="80" cy="62" r="24" fill="${C.white}"/>` +
      eyes(58) + cheeks(66) +
      `<ellipse cx="80" cy="64.5" rx="2.6" ry="2" fill="#e58a9a"/>` + smile(67),
    fox: () =>
      `<path d="M57 52 L61 20 L79 40 Z" fill="#d9743f"/>` +
      `<path d="M103 52 L99 20 L81 40 Z" fill="#d9743f"/>` +
      `<path d="M62 44 L63.5 28 L73 39 Z" fill="#f6e2c8"/>` +
      `<path d="M98 44 L96.5 28 L87 39 Z" fill="#f6e2c8"/>` +
      `<path d="M55 54 Q55 36 80 36 Q105 36 105 54 Q105 72 80 86 Q55 72 55 54Z" fill="#d9743f"/>` +
      `<path d="M58 59 Q70 60 80 73 Q90 60 102 59 Q99 74 80 86 Q61 74 58 59Z" fill="#fbf3e6"/>` +
      eyes(55) + `<ellipse cx="80" cy="74" rx="3.6" ry="2.7" fill="${C.ink}"/>`,
    bear: () =>
      `<circle cx="61" cy="40" r="10" fill="#a8724a"/>` +
      `<circle cx="99" cy="40" r="10" fill="#a8724a"/>` +
      `<circle cx="61" cy="40" r="5.5" fill="#e3b79a"/>` +
      `<circle cx="99" cy="40" r="5.5" fill="#e3b79a"/>` +
      `<circle cx="80" cy="60" r="25" fill="#a8724a"/>` +
      `<ellipse cx="80" cy="69" rx="11" ry="8" fill="#e8c9a6"/>` +
      eyes(55) + cheeks(65, 17) +
      `<ellipse cx="80" cy="65.5" rx="4" ry="3" fill="${C.ink}"/>` + smile(69.5),
  };

  // A rounded bush with a few blossoms, sitting on the bottom edge (y=110).
  // Arcs are sized so the outline stays within cx +/- 71 (no clipping at the edges).
  const bushBody = (cx = 80, scale = 1) => {
    const s = (n) => n * scale;
    const x = (n) => cx + s(n);
    return (
      `<path d="M${x(-66)} 110 a${s(26)} ${s(26)} 0 0 1 ${s(20)} -${s(40)} ` +
      `a${s(30)} ${s(30)} 0 0 1 ${s(46)} -${s(16)} a${s(28)} ${s(28)} 0 0 1 ${s(46)} ${s(10)} ` +
      `a${s(28)} ${s(28)} 0 0 1 ${s(20)} ${s(46)} Z" fill="${C.bush}"/>` +
      `<path d="M${x(-50)} 104 q${s(14)} -${s(20)} ${s(30)} -${s(6)} M${x(4)} 100 q${s(16)} -${s(22)} ${s(34)} -${s(4)}" ` +
      `fill="none" stroke="${C.bushShade}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<circle cx="${x(-34)}" cy="${110 - s(26)}" r="2.6" fill="${C.blossom}"/>` +
      `<circle cx="${x(22)}" cy="${110 - s(46)}" r="2.4" fill="${C.bud}"/>` +
      `<circle cx="${x(46)}" cy="${110 - s(22)}" r="2.2" fill="${C.blossom}"/>`
    );
  };

  /* Outer <g> is animated by CSS; inner <g> holds the SVG placement
   * (a CSS transform would otherwise override the transform attribute). */
  const placed = (animal, transform, cls = "") =>
    `<g class="peek__animal ${cls}"><g transform="${transform}">${ANIMALS[animal]()}</g></g>`;

  // viewBoxes start above y=0 to leave headroom for ears.
  /** One animal peeking over a bush. */
  const peek = (animal) =>
    svg("0 -22 160 132", placed(animal, "translate(0 -22)") + bushBody(), "peek");

  /** Wide hero strip: fox, bunny and bear peeking over a hedge. */
  const hedge = () =>
    svg("0 -22 360 132",
      placed("fox", "translate(34 -16) scale(.9)") +
      placed("bunny", "translate(100 -14)", "peek__animal--2") +
      placed("bear", "translate(178 -12) scale(.9)", "peek__animal--3") +
      bushBody(78, 1.05) + bushBody(282, 1.05) + bushBody(180, .8),
      "hedge");

  const LEAF_PATH = "M0 0 C6 -7 16 -7 22 0 C16 7 6 7 0 0Z";
  const leaf = (color) =>
    svg("-1 -8 24 16",
      `<path d="${LEAF_PATH}" fill="${color}"/>` +
      `<path d="M2 0 H19" stroke="rgba(255,255,255,.45)" stroke-width=".9"/>`, "leaf");

  /** A leafy sprig: curved stem with alternating leaves. */
  const sprig = (color = "#7f9f78") => {
    const leaves = [0.2, 0.4, 0.6, 0.8]
      .flatMap((t, i) => {
        const x = 10 + t * 70;
        const y = 90 - t * 80;
        return [-1, 1].map((side) =>
          `<path d="${LEAF_PATH}" fill="${color}" ` +
          `transform="translate(${x} ${y}) rotate(${side * 55 - 40 + i * 3}) scale(.75)"/>`);
      })
      .join("");
    return svg("0 0 100 100",
      `<path d="M8 96 Q40 60 86 6" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>` +
      leaves + `<path d="${LEAF_PATH}" fill="${color}" transform="translate(84 8) rotate(-50) scale(.8)"/>`,
      "sprig");
  };

  const FOOT =
    `<ellipse cx="7" cy="15" rx="4.6" ry="7.5"/>` +
    `<circle cx="3.2" cy="5" r="1.7"/><circle cx="6.4" cy="3.6" r="1.6"/>` +
    `<circle cx="9.4" cy="4.2" r="1.4"/><circle cx="11.6" cy="6" r="1.2"/>`;
  const footprints = () =>
    svg("0 0 34 24",
      `<g fill="currentColor"><g transform="translate(15 0) scale(-1 1)">${FOOT}</g>` +
      `<g transform="translate(19 0)">${FOOT}</g></g>`, "footprints");

  const ICONS = {
    calendar: `<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>`,
    clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
    pin: `<path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>`,
    navigate: `<path d="M3 11 21 3l-8 18-2-8-8-2z"/>`,
    music: `<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>`,
    stroller: `<path d="M13 3a8 8 0 0 1 8 8h-8z"/><path d="M3 11h18a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6zM1 7h1.5L3 11"/>` +
              `<circle cx="8" cy="20.5" r="1.5"/><circle cx="16" cy="20.5" r="1.5"/>`,
    dinner: `<path d="M6 3v6a2 2 0 0 0 4 0V3M8 11v10M17 21V3c-2.2 1.2-3.5 4-3.5 8H17"/>`,
  };
  const icon = (name, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

  window.ART = { peek, hedge, leaf, sprig, footprints, icon, LEAF_COLORS };
})();
