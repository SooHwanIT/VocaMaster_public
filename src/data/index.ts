// src/data/index.ts

import { DATA_SETS } from '../data.ts';

const ALL_WORDS = DATA_SETS.flatMap((dataSet) => dataSet.words);
const WORD_BY_ID = new Map(ALL_WORDS.map((word) => [word.id, word] as const));

export { DATA_SETS, ALL_WORDS, WORD_BY_ID };
export type { Word, DataSet } from './types';
