# aMazeMe - Generator labiryntów dla dzieci

Interaktywna aplikacja webowa do generowania konfigurowalnych labiryntów z elementami logicznymi (klucze, drzwi, skarby). Przeznaczona dla dzieci -- labirynty można drukować jako karty pracy lub rozwiązywać na ekranie.

![Screenshot aplikacji aMazeMe](App%20screenshot.png)

## Funkcje i możliwości

### Generowanie labiryntów
- Algorytm Recursive Backtracker (iteracyjny DFS) z seedowaną pseudolosowością -- identyczny seed daje identyczny labirynt
- Rozmiary od 3x3 do 50x50 komórek
- Automatyczne wejście (lewy górny róg) i wyjście (prawy dolny róg)

### Poziom trudności
- Skala 0--10
- 0 = labirynt doskonały (dokładnie jedna ścieżka między dowolnymi dwoma komórkami)
- Wyższe wartości usuwają losowe wewnętrzne ściany, tworząc alternatywne trasy

### Interaktywne elementy
- **Klucze i drzwi** -- do 5 par klucz-drzwi, każda w innym kolorze. Klucz zawsze umieszczony przed swoimi drzwiami na ścieżce rozwiązania
- **Skarby** -- do 10 skarbów, preferowane są ślepe zaułki (trudniejsze do znalezienia)
- Automatyczna weryfikacja rozwiązywalności -- algorytm Progressive BFS sprawdza, czy labirynt z elementami da się przejść

### Motywy graficzne (5 tematów)
| Motyw | Opis |
|-------|------|
| Podstawowy | Czyste czarne linie na białym tle |
| Ogród | Zielone tło, kwiaty, żywopłoty |
| Loch | Ciemne kamienne ściany, klimat zamku |
| Pustynia | Piaskowe kolory, kaktusy |
| Ocean | Wodne kolory, wzory fal |

### Drukowanie
- Generowanie wielu labiryntów na jednym wydruku (do 12 sztuk)
- Adaptacyjny układ siatki w zależności od rozmiaru labiryntu
- Zoptymalizowane warianty motywów pod druk

## Wymagania

- Node.js (zalecana wersja 18+)
- npm

## Uruchomienie

```bash
# Instalacja zależności
npm install

# Tryb deweloperski (http://localhost:5173)
npm run dev

# Build produkcyjny
npm run build

# Podgląd buildu produkcyjnego
npm run preview
```

## Linting

```bash
npm run lint
```

## Deployment

Aplikacja jest w pełni kliencka (bez backendu). Wynik `npm run build` to statyczne pliki w katalogu `dist/`, które można serwować z dowolnego serwera HTTP (GitHub Pages, Netlify, Vercel itp.).

## Stack technologiczny

- React 19 + TypeScript
- Vite
- HTML5 Canvas (renderowanie labiryntów)
- Brak zewnętrznych zależności runtime -- algorytmy generowania, rozwiązywania i renderowania labiryntów zaimplementowane od zera
