// src/data/types.ts

/**
 * ===== 데이터셋 규칙 =====
 * * 1. Word (단어 항목) 규칙:
 * - id: 고유 식별자 (예: '1', '2', ..., '200')
 * - word: 영단어 (예: 'executive')
 * - definitions: 단어의 뜻 배열 (최소 1개, 여러 뜻 지원)
 * * 형식: "(품사) 뜻1, 뜻2" (예: "(명) 경영진, 임원")
 * - etymo: 어원 설명 (필수)
 * * 형식: "구성 요소 + 의미" (예: "ex(밖으로) + sequi(따르다)")
 * - examples: 예문 배열 (최소 2개)
 * * text: 영문 예문 (단어는 [대괄호]로 강조)
 * * korean: 한글 번역 (강조 단어는 {중괄호}로 표시)
 * - dayId: 단어가 속한 날짜 ID (예: 'day1', 'day2', ...)
 * * 2. DataSet (데이터셋) 규칙:
 * - id: 데이셋 고유 ID (예: 'day1', 'day2', ...)
 * - title: 데이셋 제목 + 범위 (예: 'Day 1: Basic Business (1-50)')
 * - description: 한글 설명 (예: '비즈니스 기초 영단어 1~50')
 * - words: Word 배열 (50개 단어)
 * * 3. 데이터 정규화 규칙:
 * - 모든 단어는 완전한 정보를 포함해야 함 (missing data 없음)
 * - definitions는 최소 1개 이상
 * - examples는 최소 2개 이상
 * - 텍스트 강조: 영문=[대괄호], 한글={중괄호}
 * - 어원은 항상 포함 필수 (빈 문자열 불허)
 * - dayId는 반드시 포함되어야 함
 */

// --- Type Definitions ---
export interface Word {
  /** 단어의 고유 ID */
  id: string;
  /** 영단어 */
  word: string;
  /** 단어의 뜻 배열 - 최소 1개 필수 */
  definitions: string[];
  /** 단어의 어원 설명 - 필수 정보 */
  etymo: string;
  /** 예문과 번역 배열 - 최소 2개 권장 */
  examples: { text: string; korean: string }[];
  /** 단어가 속한 날짜 ID (예: 'day1', 'day2', ...) */
  dayId: string;
}

export interface DataSet {
  /** 데이셋 고유 ID */
  id: string;
  /** 데이셋 제목 */
  title: string;
  /** 사용자 표시 설명 */
  description: string;
  /** 포함된 단어 배열 */
  words: Word[];
}
