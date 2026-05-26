# PROJECT.md — Gervigreind vefbók

Þetta skjal er handóverskjal fyrir hvern sem ætlar að halda áfram með verkefnið — t.d. annan höfund, kennara, eða agent með gagnvirku LLM (V2.0). Það lýsir arkitektúr, gagnasniðum, og helstu inngripspunktum.

---

## 1. Yfirlit

**Gervigreind** er gagnvirk íslensk vefbók fyrir unglingastig sem rekur sögu og hugmyndir gervigreindar í fjórum hlutum (46 kaflar). Hver kafli er sjálfstætt JSON-skjal og getur innihaldið texta, hugtök, myndir og **gagnvirk widgets** (sjónræn tæki sem nemandinn snertir).

Bókin er **static** — engin server-side render, engin build-skref, ekkert framework. Bara `index.html`, `style.css`, JSON-gögn og JS-widgets. Hún virkar offline (service worker) eftir fyrstu heimsókn.

---

## 2. Möppustrúktúr

```
/
├── index.html                  ← Shell + leiðsögn + visualRenderers mapping
├── style.css                   ← Allir stílar — globals + per-widget kaflar
├── sw.js                       ← Service worker (offline cache)
├── validate.html               ← Skoðunartæki — keyrðu fyrir publish
├── PROJECT.md                  ← Þetta skjal
│
├── kaflar-json/                ← 46 kaflaskrár + book-toc
│   ├── book-toc.json           ← Efnisyfirlit: parts + chapters
│   ├── vefstollinn.json        ← Hver kafli í eigin skrá
│   ├── enigma.json
│   └── ...
│
├── widgets/                    ← 39 sjálfstæð widget JS-skrár
│   ├── loom.js                 ← Hver hefur eina renderFoo(figure) function
│   ├── triode.js
│   ├── light-sensors.js
│   └── ...
│
└── img/                        ← Statískar SVG-myndir (currentColor)
    ├── 1.1.svg                 ← Ein mynd á kafla, númeruð eftir hluta.kafla
    ├── 2.10.svg
    └── photos/                 ← Ljósmyndir (jpg/webp/png) — sjá README þar
```

---

## 3. Gagnasnið

### 3.1 `book-toc.json`

```json
{
  "title": "Gervigreind",
  "author": "Ragnar Þór Pétursson",
  "parts": [
    { "number": 1, "title": "Hugmyndir og upphaf" },
    { "number": 2, "title": "Innviðir hugsandi véla" }
  ],
  "chapters": [
    { "id": "vefstollinn", "part": 1, "title": "Vefstóllinn …" }
  ]
}
```

`id` í hverjum kafla er **lykill** — það ræður bæði URL-fragment (`#vefstollinn`) og skráarnafn (`kaflar-json/vefstollinn.json`). Þrjú þurfa að passa saman: `book-toc.chapters[i].id` ↔ skráarnafn ↔ `data.id` innan kaflaskrárinnar.

### 3.2 Kaflaskrá (t.d. `vefstollinn.json`)

```json
{
  "id": "vefstollinn",
  "part": 1,
  "title": "Vefstóllinn …",
  "text": [
    "Fyrsta málsgrein.",
    "Önnur málsgrein."
  ],
  "concepts": [
    {
      "term": "Forrit",
      "explanation": "Röð fyrirmæla …"
    }
  ],
  "visuals": [
    {
      "type": "illustration",
      "description": "img/1.1.svg"
    },
    {
      "type": "interactive",
      "description": "jacquard loom",
      "after": 3
    }
  ]
}
```

**Reglur:**
- `text` — fylki af málsgreinum, 0-indexed.
- `concepts` — valfrjáls hugtakalisti birtist neðst.
- `visuals` — fylki sem stýrir staðsetningu á myndum og widgets:
  - `type: "illustration"` + `description: "img/..."` → birt sem `<img>` (SVG-skýringarmyndir).
  - `type: "photo"` + `src: "img/photos/..."` + `alt` (krafa) + valfrjáls `caption`, `credit` → birt sem `<figure>` með myndatexta og heimild.
  - `type: "interactive"` + `description: "<widget-lykill>"` + valfrjáls `after: <málsgrein-index>` → birt á eftir tilgreindri málsgrein. Ef `after` vantar fer widgetinn neðst í kaflann.
- Widget-lyklar þurfa að passa við key í `visualRenderers`-mapping í `index.html`.

---

## 4. Hvernig kafli birtist (rendering pipeline)

1. **Hash-leiðsögn:** `window.addEventListener('hashchange', showCurrent)` — URL fragment ræður kafla.
2. **Fetch:** `fetch('kaflar-json/<id>.json?v=<timestamp>')` — cache-bust querystring.
3. **Render:** `showCurrent` byggir DOM-tré með `el()`-helper. Málsgreinar úr `text`, myndir úr `visuals` settar inn á réttum stöðum (eftir `after`-numerum).
4. **Widget-ræsing:** Fyrir hvern interactive visual fer `visualRenderers[description](figure)` — kallar á `renderFoo(figure)` í widget-skránni og hún byggir innihaldið í þennan `figure`-element.

---

## 5. Að bæta við nýjum kafla

1. Búa til `kaflar-json/<id>.json` með réttu sniði (sjá 3.2).
2. Bæta línu í `book-toc.json` undir `chapters`.
3. Setja SVG-mynd í `img/<n>.svg` (notar `currentColor` svo hún virki í dökkri/ljósri stillingu).
4. Keyra `validate.html` til að staðfesta.

---

## 6. Að bæta við nýjum widget

1. Búa til `widgets/<nafn>.js` með **einni function**:
   ```javascript
   function renderFoo(figure) {
     figure.className = 'foo-figure';
     // byggja innihaldið með el()-helper úr index.html
   }
   ```
2. Bæta línu í `index.html` undir öðrum widget-script tögum:
   ```html
   <script src="widgets/foo.js"></script>
   ```
3. Bæta í `visualRenderers`-mappingu (~lína 100 í `index.html`):
   ```javascript
   'foo': renderFoo
   ```
4. Bæta CSS aftan á `style.css` með eigin namespace (t.d. `.foo-*`).
5. Bæta í `KNOWN_WIDGETS` lista í `validate.html`.
6. Vísa í hann úr einhverjum kafla:
   ```json
   { "type": "interactive", "description": "foo", "after": 3 }
   ```

---

## 7. Stíll og hönnunarkerfi

CSS notar **custom properties** (`var(--accent)`, `var(--bg-card)`, …) skilgreindar í `:root` og yfirskrifaðar í `body.is-dark`. Þrjár megin-litaröðum:

- `--accent` / `--accent-hover` — aðallitur (terra cotta)
- `--text` / `--text-muted` — texti
- `--bg` / `--bg-card` / `--bg-elev` — bakgrunnar

**Widget-CSS-mynstur:** hver widget hefur eigin namespace-prefix (`.triode-*`, `.lightsens-*`, …). Þetta forðar conflict en býr til endurtekningu. V2 hugmynd: factoring í shared utility-classes.

---

## 8. Service worker (offline)

`sw.js` notar **cache-first með network-fallback**:
- Install: cache shell (`index.html`, `style.css`, `book-toc.json`).
- Fetch: kafla- og widget-skrár cache-ast þegar nemandi heimsækir þær.
- Bump `CACHE_VERSION` í `sw.js` þegar gerð er meiriháttar uppfærsla á efni.

**Mikilvægt:** SW klippir `?v=<timestamp>` af URL áður en hann flettir upp í cache — annars væri vistað margfalt eintak af sömu skrá.

---

## 9. Þekktir veikleikar / V2 hugmyndir

| # | Vandi | V2 lausn |
|---|---|---|
| 1 | Allir 39 widget-scripts hlaðast strax | Lazy-loading: hlaða `widgets/<id>.js` first þegar kafli kallar á það |
| 2 | Per-widget CSS er duplicated | Shared utility-classes (`.card`, `.btn`, …) |
| 3 | JSON-brot eyðileggur kafla þögult | `validate.html` keyrt sjálfvirkt (CI eða pre-publish hook) |
| 4 | Engin leit | Búa til `search-index.json` í build-skrefi, einfalt client-side flett |
| 5 | Engin lestrarstaða | localStorage — síðasti kafli + scrollY |
| 6 | Engin print/PDF-stylesheet | `@media print` í CSS, fela widgets eða lýsa þeim í tölu-snið |

---

## 10. LLM-tengingar í V2.0 — inngripspunktar

Þrír staðir þar sem LLM-tenging gæti haft mikið gildi:

### 10.1 Spurningar-spjall um efnið

Bæti hnappi í shell sem opnar spjallglugga. Nota t.d. **claude API gegnum eigin proxy** (server) — ekki beint frá vafranum vegna API-lykla. Senda:

- Núverandi kafla `data` sem context.
- Spurning notanda.
- System prompt: *„Þú ert kennari á unglingastigi. Notaðu eingöngu efni úr þessum kafla. Vísaðu í málsgrein númer ef þú segir staðreynd."*

Tæknilegt: lítill Node/Worker-proxy á sama léni eða Cloudflare Worker.

### 10.2 Útskýring á valnum texta

Notandi velur klausu með cursor → birtist „útskýrðu" hnappur → kall til LLM með klausuna + nær-tilliðsamhengið. Hentar mjög vel fyrir flókin hugtök.

### 10.3 Sjálfvirk hugtakaleit

LLM dregur sjálfvirkt fram `concepts`-blokk fyrir hvern nýjan kafla. Höfundur skrifar bara texta; LLM stingur upp á hugtakaskýringum sem höfundur samþykkir/breytir.

### 10.4 Aðlöguð útgáfa fyrir aldur

Bjóða „yngri lesandi"-stillingu sem LLM endurorðar málsgreinarnar í einfaldari íslensku í rauntíma.

### 10.5 Quiz-mynd

LLM býr sjálfvirkt til 3 quiz-spurningar úr hverjum kafla, líkar þeim sem eru í `learning-quiz` og `asimov-quiz` widgets. Kennarar geta nýtt í kennslu.

---

## 11. Útgáfusaga

- **V1.0** — 46 kaflar, 39 widgets, offline-stuðningur, validation script. Maí 2026.

---

## 12. Tæknilegir takmarkanir

- **ES5-samhæft** — engin `let`/`const`/`=>` í widget-kóða, vegna stuðnings við eldri vafra. `var` og function-declarations.
- **Vanilla DOM** — engin React, engin frameworks.
- **Engin build-skref** — opnaðu `index.html` í vafra eða hýstu sem static.
- **Ekki SPA-router** — bara hash-fragment.

---

Höfundur (V1.0): Ragnar Þór Pétursson
Þróað í samstarfi við Claude (Anthropic).
