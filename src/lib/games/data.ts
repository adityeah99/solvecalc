// Build-time access to the generated game library, used only to emit
// /data/library.json. Client code fetches that file instead of importing this.
import raw from '../../generated/games.json';
import type { GameData } from './types.ts';

export const GAME_DATA = raw as GameData;
