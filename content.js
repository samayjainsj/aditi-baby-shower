/*
 * ALL the invite wording lives here. Edit, save, refresh. That's it.
 *
 * Dates use ISO format with the India offset (+05:30), so the countdown is
 * right no matter where a guest opens the link.
 *
 * Photos: drop files into docs/photos/ using the names below.
 * Any photo that's missing is skipped (cover falls back to cute art,
 * gallery hides itself if empty), so you can't break anything.
 *
 * The browser-tab title and WhatsApp/link-preview text live in the
 * <head> of index.html (link previews can't read JavaScript).
 */
window.INVITE = {
  timezone: "Asia/Kolkata",

  gate: {
    eyebrow: "You're invited to a baby shower",
    blocks: ["OH", "BABY"],
    hint: "Tap to topple the blocks",
  },

  hero: {
    headerText: "|| श्री महावीराय नम: ||",
    subtitle: "Little Miracle",
    invitationLine:
      "Tiny hands, tiny feet, a little one we can't wait to meet! " +
      "Join us for a baby shower celebrating",
    parents: ["Aditi", "Samay"],
    dueLabel: "Arriving December 2026",
    hostedBy: "Hosted with love by the Dhanopya family",
  },

  countdown: {
    heading: "Counting down to the baby shower",
    doneMessage: "Today's the day! See you there.",
  },

  story: {
    text:
      "Our family is about to grow by two tiny feet! Before the little one " +
      "arrives, we'd love to gather the people who matter most to shower " +
      "Aditi with blessings, laughter and love.",
    quote: "Little feet, big dreams",
  },

  schedule: {
    eyebrow: "Schedule",
    heading: "The Celebration",
    // icon: "stroller" | "dinner"
    events: [
      {
        name: "Baby Shower",
        icon: "stroller",
        start: "2026-11-11T13:00:00+05:30",
        venue: "Algoja Resort",
        description: "Blessings for the mother-to-be, baby games and plenty of happy tears.",
      },
      {
        name: "Dinner",
        icon: "dinner",
        start: "2026-11-11T16:30:00+05:30",
        venue: "Algoja Resort",
        description: "Stay on for a relaxed dinner and dessert.",
      },
    ],
  },

  location: {
    heading: "Where to Find Us",
    name: "Algoja Resort, Bundi",
    mapsUrl: "https://maps.app.goo.gl/hQm3ZACX1KAXFseZ8",
    buttonLabel: "Get directions",
  },

  gallery: {
    eyebrow: "Waiting for you, little one",
    heading: "Moments",
  },

  closing: {
    quote: "Little feet, big love",
    signature: "Aditi & Samay",
  },

  photos: {
    cover: "photos/cover.jpg",
    coverAlt: "Aditi and Samay",
    gallery: [
      "photos/gallery/01.jpg",
      "photos/gallery/02.jpg",
      "photos/gallery/03.jpg",
      "photos/gallery/04.jpg",
      "photos/gallery/05.jpg",
      "photos/gallery/06.jpg",
    ],
  },

  // Soft music-box Brahms' Lullaby, made by tools/make_lullaby.py.
  // To use your own song instead: drop it in docs/media/ and change this path
  // (.mp3 or .m4a). Empty string = no music button.
  music: "media/Tu_Hi_Re.mp3",
};
