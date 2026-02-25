export const pl: Record<string, string> = {
  // Header
  subtitle: 'Generator labiryntów dla dzieci',

  // Size selector
  mazeSize: 'Rozmiar labiryntu',
  small: 'Mały (10x10)',
  medium: 'Średni (20x20)',
  large: 'Duży (30x30)',
  giant: 'Gigant (50x50)',
  width: 'Szerokość:',
  height: 'Wysokość:',

  // Difficulty
  difficulty: 'Trudność:',
  singlePath: 'Jedna ścieżka',
  veryHard: 'Bardzo trudny',
  hard: 'Trudny',
  moderate: 'Średni',
  easy: 'Łatwy',
  veryEasy: 'Bardzo łatwy',

  // Theme selector
  theme: 'Motyw',
  theme_basic: 'Podstawowy',
  theme_basic_desc: 'Czarne linie na białym tle',
  theme_garden: 'Ogród',
  theme_garden_desc: 'Żywopłot, kwiaty, motyle',
  theme_mine: 'Kopalnia',
  theme_mine_desc: 'Szare skały, kamyki, minerały',
  theme_desert: 'Pustynia',
  theme_desert_desc: 'Piasek, piramidy, kaktusy',
  theme_ocean: 'Ocean',
  theme_ocean_desc: 'Fale, statki, latarnie morskie',

  // Items
  items: 'Przedmioty',
  passages: 'Przejścia:',
  mode: 'Tryb:',
  colors: 'Kolory',
  symbols: 'Symbole',
  generic: 'Dowolny',
  treasures: 'Skarby:',

  // Maze controls
  mazeCount: 'Ilość labiryntów',
  perPage: 'Na stronę:',
  generate: 'Utwórz',
  print: 'Drukuj',

  // Placeholder
  placeholder: 'Kliknij "Utwórz" aby rozpocząć',

  // Error messages
  'error.mazeUnsolvable': 'Nie udało się wygenerować rozwiązywalnego labiryntu. Spróbuj ponownie.',
  'error.itemsUnsolvable': 'Układ przedmiotów jest nierozwiązywalny. Spróbuj ponownie lub zmniejsz liczbę par klucz-drzwi.',
  'error.itemsUnsolvableReduce': 'Układ przedmiotów jest nierozwiązywalny. Zmniejsz liczbę par klucz-drzwi.',
  'error.doorPlacement': 'Nie udało się umieścić przejścia nr {{n}}. Labirynt jest za mały lub trudność jest za wysoka.',
  'error.keyPlacement': 'Nie udało się umieścić klucza nr {{n}}. Labirynt jest za mały.',
  'error.partialTreasures': 'Udało się umieścić tylko {{actual}} z {{total}} skarbów.',

  // Print
  printTitle: 'aMazeMe - Drukuj labirynty',

  // Item definitions
  item_door: 'Drzwi',
  item_door_desc: 'Wymagają klucza aby przejść',
  item_key: 'Klucz',
  item_key_desc: 'Otwiera sparowane drzwi',
  item_treasure: 'Skarb',
  item_treasure_desc: 'Ukryty skarb do znalezienia',
};
