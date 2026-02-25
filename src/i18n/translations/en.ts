export const en: Record<string, string> = {
  // Header
  subtitle: 'Maze generator for kids',

  // Size selector
  mazeSize: 'Maze size',
  small: 'Small (10x10)',
  medium: 'Medium (20x20)',
  large: 'Large (30x30)',
  giant: 'Giant (50x50)',
  width: 'Width:',
  height: 'Height:',

  // Difficulty
  difficulty: 'Difficulty:',
  singlePath: 'Single path',
  veryHard: 'Very hard',
  hard: 'Hard',
  moderate: 'Medium',
  easy: 'Easy',
  veryEasy: 'Very easy',

  // Theme selector
  theme: 'Theme',
  theme_basic: 'Basic',
  theme_basic_desc: 'Black lines on white background',
  theme_garden: 'Garden',
  theme_garden_desc: 'Hedges, flowers, butterflies',
  theme_mine: 'Mine',
  theme_mine_desc: 'Gray rocks, pebbles, minerals',
  theme_desert: 'Desert',
  theme_desert_desc: 'Sand, pyramids, cacti',
  theme_ocean: 'Ocean',
  theme_ocean_desc: 'Waves, ships, lighthouses',

  // Items
  items: 'Items',
  passages: 'Passages:',
  mode: 'Mode:',
  colors: 'Colors',
  symbols: 'Symbols',
  generic: 'Generic',
  treasures: 'Treasures:',

  // Maze controls
  mazeCount: 'Number of mazes',
  perPage: 'Per page:',
  generate: 'Generate',
  print: 'Print',

  // Placeholder
  placeholder: 'Click "Generate" to start',

  // Error messages
  'error.mazeUnsolvable': 'Failed to generate a solvable maze. Try again.',
  'error.itemsUnsolvable': 'Item layout is unsolvable. Try again or reduce the number of key-door pairs.',
  'error.itemsUnsolvableReduce': 'Item layout is unsolvable. Reduce the number of key-door pairs.',
  'error.doorPlacement': 'Failed to place passage #{{n}}. The maze is too small or difficulty is too high.',
  'error.keyPlacement': 'Failed to place key #{{n}}. The maze is too small.',
  'error.partialTreasures': 'Only {{actual}} of {{total}} treasures could be placed.',

  // Print
  printTitle: 'aMazeMe - Print mazes',

  // Item definitions
  item_door: 'Door',
  item_door_desc: 'Requires a key to pass',
  item_key: 'Key',
  item_key_desc: 'Opens paired door',
  item_treasure: 'Treasure',
  item_treasure_desc: 'Hidden treasure to find',
};
