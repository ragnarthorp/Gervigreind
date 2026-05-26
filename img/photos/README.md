# Ljósmyndir

Ljósmyndir í kaflatextum. Settu hér inn ljósmyndir í .jpg, .webp eða .png.

Notkun í kaflaskrá (`kaflar-json/<id>.json`):

```json
{
  "type": "photo",
  "src": "img/photos/babbage-engine.jpg",
  "alt": "Difference Engine Babbage í Vísindasafninu í London",
  "caption": "Difference Engine — Vísindasafnið, London.",
  "credit": "Mynd: Science Museum Group / CC BY 4.0",
  "after": 3
}
```

Reglur:
- `src` (krafa) — slóð á myndina.
- `alt` (krafa fyrir aðgengi) — stutt lýsing.
- `caption` — sýnilegur myndatexti (valfrjáls).
- `credit` — höfundarréttarlína (valfrjáls).
- `after` — birtist eftir tilgreindri málsgrein (0-indexed). Vantar = neðst í kaflanum.

Mælt með: hámark ~1600px breidd, þjappað (.webp eða .jpg q≈80).

`_placeholder.svg` — almennur placeholder ef vantar mynd.
