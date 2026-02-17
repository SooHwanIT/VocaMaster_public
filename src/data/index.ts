// src/data/index.ts

import { DAY_1_WORDS } from './days/day1';
import { DAY_2_WORDS } from './days/day2';
import { DAY_3_WORDS } from './days/day3';
import { DAY_4_WORDS } from './days/day4';
import type { DataSet } from './types';

// Re-export types for convenience
export type { Word, DataSet } from './types';

// --- Data Sets ---
export const DATA_SETS: DataSet[] = [
  { 
    id: 'day1', 
    title: 'Day 1: Basic Business (1-50)', 
    description: '비즈니스 기초 영단어 1~50', 
    words: DAY_1_WORDS 
  },
  { 
    id: 'day2', 
    title: 'Day 2: Advanced Business (51-100)', 
    description: '비즈니스 심화 영단어 51~100', 
    words: DAY_2_WORDS 
  },
  { 
    id: 'day3', 
    title: 'Day 3: Business Operations (101-150)', 
    description: '비즈니스 운영 영단어 101~150', 
    words: DAY_3_WORDS 
  },
  { 
    id: 'day4', 
    title: 'Day 4: Business Strategy (151-200)', 
    description: '비즈니스 전략 영단어 151~200', 
    words: DAY_4_WORDS 
  },
];
