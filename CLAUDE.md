# CLAUDE.md

Wskazówki dla Claude Code przy pracy w tym repozytorium.

## Projekt

**Magazyn** — PWA do inwentaryzacji sprzętu firmowego (dla znajomego użytkownika, „Krzyśka").
Pracownicy na telefonach widzą listę sprzętu per magazyn (Szafka A/B, Magazyn z tyłu),
odnotowują zabranie sprzętu na montaż (koszyk → potwierdzenie) i zwroty.

- **Hosting:** GitHub Pages, repo **github.com/jarkol01/magazyn** (publiczne),
  adres https://jarkol01.github.io/magazyn/. Deploy = `git push` na `main` (~1–2 min).
- **Konto GitHub:** `jarkol01`; `git` + `gh` zalogowane (SSH).
- **Dane:** sekretny Gist (plik `magazyn.json`), właściciel `jarkol01`.
  Gist ID NIE jest wpisany w kod (repo publiczne) — przekazywany linkiem `#g=<id>`.
  Zapis wymaga PAT (classic) z zakresem `gist`, wspólnego dla pracowników,
  wpisywanego raz per urządzenie (localStorage).

## Architektura

Jeden plik `index.html` (HTML+CSS+JS inline, zero zależności) + `sw.js` (offline)
+ `site.webmanifest` + ikony PNG (generowane skryptem — czysty Python zlib, bez PIL).

Model danych (Gist, `magazyn.json`):
```
{ v:1,
  items: {id: {id,name,loc,qty,note,u,del,by}},      // sprzęt (del=1 → tombstone)
  loans: {id: {id,itemId,who,n,dest,ts,retAt,retBy,retLoc,u}},  // wypożyczenia = też historia
  locs:  {id: {id,name,u,del}},                      // magazyny/miejsca
  map:   {id: {id,kind:'wall'|'loc'|'obj',x,y,w,h,locId,label,u,del}} }  // plan warsztatu (SVG 100×70)
```
- `u` = znacznik ostatniej zmiany rekordu (ms). **Merge = per-rekord, nowsze `u` wygrywa**,
  kolekcje scalane unią. Usunięcia przez tombstone (`del:1`/`retAt`), pruning po 180 dniach.
- Dane startowe (miejsca `loc-a/b/c`, przykładowy sprzęt `it-01..12`, mapa `map-*`)
  mają STAŁE id i `u:1` — inaczej każde świeże urządzenie tworzyłoby duplikaty przy
  pierwszym merge'u; `u:1` gwarantuje, że chmura (edycje/usunięcia) zawsze wygrywa.
  Te same defaulty siedzą w seedzie Gista — przy zmianie defaultów zaktualizuj też Gist
  (skrypt: wyekstrahuj `defaultLocs/Items/MapEls` z app.js → `gh gist edit`).
- Mapa: zakładka z edytorem (rysowanie prostokątów palcem, move/resize przez pointer
  events na SVG, snap 1 jedn.); elementy `loc` linkują do `locs` przez `locId`.
  Mini-mapy (`miniMap(hlLocIds)`) podświetlają miejsca w dialogach brania/koszyka/zwrotu.
- Sync: pull → merge → push (tylko gdy `mg_dirty`), debounce 1,8 s po zmianie,
  auto co 60 s gdy karta widoczna + na `visibilitychange`/`online`.
- Stan na urządzeniu: localStorage (`mg_*`), tryb offline działa w pełni.

## Konwencje

- Język UI i commitów: polski. Commit trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Po zmianie `sw.js`/plików aplikacji podbij `CACHE` w `sw.js` (np. `magazyn-v2`)
  i `APP_VER` w `index.html`, inaczej użytkownicy dostaną starą wersję z cache.
- Testy: `node --check` na wyekstrahowanym skrypcie; logika merge testowana ad-hoc w node
  (funkcje `mergeColl`/`mergeData` są czyste).
