# Changing the colours

Two ways: the built-in pickers (no code, instant) or editing the file (permanent,
shareable across devices).

---

## The quick way — Setup → Appearance

Pick a theme to start from, then every colour is a picker. Changes apply as you drag and
save to this browser. **Reset custom** puts you back to Dark.

This is the right way to *find* a palette. Once you like one, see "Baking it in" below so
it survives a browser clear and shows up on your other devices.

---

## Why things look flat, and what to change

Depth comes from **luminance gaps between adjacent surfaces**. If your page background
and your card background are close in brightness, the cards stop reading as cards and
everything smears into one sheet. That was the actual bug in the old Contrast theme — it
used `#101010` for both, a gap of zero.

Measured gaps between page and card:

| Theme | Page → card | Feel |
|---|---|---|
| Dark | 7 | subtle, can flatten |
| Slate | 12 | clearly layered |
| Contrast | 17 | strongly layered |

If a theme feels flat, **lighten `--s1` and `--s2`** before touching anything else. That
one change does more than any accent tweak.

The second lever is **borders**. Raise `--ln` and panels gain edges even when the fills
are close.

---

## What each variable does

**Surfaces, darkest to lightest — this is where depth comes from**
- `--bg` the page behind everything
- `--s1` cards
- `--s2` card headers, chips, secondary rows
- `--s3` inputs, bar tracks, raised controls

**Lines**
- `--ln` normal borders and row dividers
- `--ln2` stronger borders, button outlines

**Text — three levels, keep them clearly apart**
- `--tx` primary
- `--dim` secondary
- `--dimr` faint, for labels and units

**Accents — used sparingly on purpose**
- `--ac` "this concerns you now" — your pick, targets, active tab
- `--acfg` text drawn *on top of* accent fills; flip to a dark value if your accent is light
- `--urg` genuine urgency only
- `--ok` positive

**Other**
- `--tgbg` background tint on starred target rows
- `--posfill` opacity (0–1) of the position colour filling draft board cells. Raise it if
  the board is hard to scan
- `--QB --RB --WR --TE --DST` position colours

---

## Baking a palette into the file

Open `index.html` and find the theme blocks near the top of the `<style>` section — search
for `data-theme="slate"`. Each is a plain list of variables:

```css
[data-theme="slate"]{
  --bg:#0a0a0c; --s1:#16161a; --s2:#22222a; --s3:#2f2f39;
  --ln:#3a3a46; --ln2:#565664;
  --tx:#f6f6f9; --dim:#a9a9b8; --dimr:#70707f;
  --ac:#ffb638; --acfg:#14140f; --urg:#ff5f56; --ok:#3ecf8e;
  --tgbg:rgba(255,182,56,.13); --posfill:.26;
  --QB:#f5788d; --RB:#6aa9ff; --WR:#3fd6ad; --TE:#ff9f45; --DST:#b18cff;
}
```

Edit the values, save, commit, push.

**One thing to remember:** position colours live in two places — the CSS block above and a
JavaScript object called `COLSETS`, because charts and badges are drawn in code. Change
both or they'll disagree. Search for `var COLSETS` to find it.

**To add a whole new theme:** copy a block, rename it (`data-theme="mine"`), add a matching
entry to `COLSETS`, and add it to the `THEMES` array and the `THEMEMETA` list that draws
the picker buttons. All three are within a few lines of each other.

---

## Testing without committing

Open the app, press **F12**, click the **Elements** tab, select the `<html>` element. Its
styles panel lists every variable — edit any value and the page updates instantly. Nothing
saves, so refresh to discard.

Faster than the commit-and-push loop when you're just hunting for a colour.
