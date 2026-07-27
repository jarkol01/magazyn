# 📦 Magazyn — firmowa inwentaryzacja sprzętu

Prosta aplikacja PWA do ewidencji sprzętu firmowego: co jest w której szafce,
kto co zabrał na montaż i kiedy oddał.

**Aplikacja:** https://jarkol01.github.io/magazyn/

## Jak to działa

- **Sprzęt** — lista całego sprzętu z wyszukiwarką i filtrami po miejscu
  (Szafka A, Szafka B, Magazyn z tyłu…) i dostępności. Każdy może dodać nowy sprzęt (➕).
- **Biorę 🚚** — wychodząc na montaż klikasz „Biorę” przy rzeczach, które zabierasz,
  potem potwierdzasz jednym przyciskiem (z opcjonalnym „dokąd”). Wszyscy widzą,
  że sprzęt jest w terenie i u kogo.
- **Zwrot ↩️** — po powrocie oddajesz sprzęt, wybierając gdzie go odkładasz.
- **W terenie** — podgląd kto aktualnie co ma.
- **Historia** — pełny log ruchów (kto, co, kiedy, dokąd).
- **Eksport CSV** — do Excela, w Ustawieniach.

## Instalacja na telefonie (PWA)

1. Otwórz adres aplikacji w przeglądarce telefonu.
2. Android/Chrome: menu ⋮ → **Dodaj do ekranu głównego**.
   iPhone/Safari: Udostępnij → **Do ekranu początkowego**.

## Synchronizacja

Dane trzymane są w **sekretnym GitHub Giście** i synchronizują się automatycznie
(przy każdej zmianie, co 60 s i przy powrocie do aplikacji). Bez internetu aplikacja
działa dalej — zmiany zapisują się lokalnie i wyślą po odzyskaniu zasięgu.

Konfiguracja nowego pracownika:

1. Otwórz **link zaproszenia** (Ustawienia → „Link dla współpracownika” u kogoś,
   kto już ma skonfigurowaną apkę) — ustawi Gist ID automatycznie.
2. Wpisz swoje **imię**.
3. Wklej wspólny **token** (przekazany osobno, np. na komunikatorze) i Zapisz.

Token: GitHub → Settings → Developer settings → Personal access tokens →
Tokens (classic) → Generate new token → zakres tylko `gist`, expiration „No expiration”.

## Technikalia

Jeden plik `index.html` (HTML+CSS+JS, bez zależności) + service worker (offline)
+ manifest PWA. Hosting: GitHub Pages z gałęzi `main`. Dane: JSON w sekretnym Giście,
scalanie per-rekord po znaczniku czasu (`u`), więc równoległa praca kilku osób
nie nadpisuje sobie zmian.
