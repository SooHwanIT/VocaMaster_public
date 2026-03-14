// src/data.ts

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

// --- Day 1: Basic Business Vocabulary (1-50) ---
const DAY_1_WORDS: Word[] = [
  {
    id: '1', word: 'executive',
    definitions: ['(명) 경영진, 임원', '(형) 경영의, 운영의'],
    etymo: 'ex(밖으로) + sequi(따르다)',
    examples: [
      { text: 'The [executive] made an important decision.', korean: '그 {임원은} 중요한 결정을 내렸습니다.' },
      { text: 'This is an [executive] decision.', korean: '이것은 {경영의} 결정입니다.' }
    ]
  },
  {
    id: '2', word: 'inventory',
    definitions: ['(명) 재고, 재고 목록', '(명) 재고 조사'],
    etymo: 'in + venire',
    examples: [
      { text: 'We need to check our [inventory] first.', korean: '우리는 먼저 {재고를} 확인해야 합니다.' },
      { text: 'The [inventory] of goods is complete.', korean: '{재고 조사가} 완료되었습니다.' }
    ]
  },
  {
    id: '3', word: 'feature',
    definitions: ['(명) 특징, 특색', '(명) 특집 기사'],
    etymo: 'facere(만들다)',
    examples: [
      { text: 'The camera is the best [feature].', korean: '카메라가 가장 큰 {특징}입니다.' },
      { text: 'There is a [feature] article in today\'s newspaper.', korean: '오늘 신문에 {특집 기사가} 있습니다.' }
    ]
  },
  {
    id: '4', word: 'acknowledge',
    definitions: ['(동) 수신을 인정하다', '(동) 감사를 표현하다'],
    etymo: 'ac + knowledge',
    examples: [
      { text: 'Please [acknowledge] receipt of this email.', korean: '이 이메일의 {수신을 인정해} 주십시오.' },
      { text: 'I [acknowledge] your kindness.', korean: '나는 당신의 친절에 {감사를 표현합니다}.' }
    ]
  },
  {
    id: '5', word: 'voucher',
    definitions: ['(명) 상품권, 바우처', '(명) 영수증, 증명서'],
    etymo: 'vouch + er',
    examples: [
      { text: 'I used a [voucher] for dinner.', korean: '나는 저녁 식사에 {상품권을} 사용했습니다.' },
      { text: 'You need a [voucher] as proof of purchase.', korean: '구매 증명서로 {영수증이} 필요합니다.' }
    ]
  },
  {
    id: '6', word: 'estimate',
    definitions: ['(명) 견적서, 평가', '(동) 추산하다, 평가하다'],
    etymo: 'ex + aestimare',
    examples: [
      { text: 'Can you give me an [estimate]?', korean: '{견적서를} 주실 수 있나요?' },
      { text: 'I [estimate] the cost at $500.', korean: '나는 비용을 {500달러로 추산합니다}.' }
    ]
  },
  {
    id: '7', word: 'resume',
    definitions: ['(동) 재개하다', '(명) 이력서'],
    etymo: 're + sumere',
    examples: [
      { text: 'We will [resume] the meeting tomorrow.', korean: '우리는 내일 회의를 {재개할} 것입니다.' },
      { text: 'Submit your [resume] by Friday.', korean: '금요일까지 {이력서를} 제출하세요.' }
    ]
  },
  {
    id: '8', word: 'issue',
    definitions: ['(명) 문제, 이슈', '(동) 발행하다'],
    etymo: 'ex + ire',
    examples: [
      { text: 'There is a serious [issue] to discuss.', korean: '논의할 {심각한 문제가} 있습니다.' },
      { text: 'They will [issue] a new card.', korean: '그들은 새 카드를 {발행할} 것입니다.' }
    ]
  },
  {
    id: '9', word: 'property',
    definitions: ['(명) 재산, 소유물', '(명) 부동산'],
    etymo: 'proprius',
    examples: [
      { text: 'He inherited [property] from his father.', korean: '그는 아버지로부터 {재산을} 상속받았습니다.' },
      { text: '[Property] prices are rising.', korean: '{부동산} 가격이 오르고 있습니다.' }
    ]
  },
  {
    id: '10', word: 'eligible',
    definitions: ['(형) 자격이 있는', '(형) 적격의'],
    etymo: 'e + legere',
    examples: [
      { text: 'You are [eligible] for the bonus.', korean: '당신은 보너스를 받을 {자격이 있습니다}.' },
      { text: 'Are you [eligible] for this program?', korean: '당신은 이 프로그램에 {적격입니까}?' }
    ]
  },
  {
    id: '11', word: 'initiative',
    definitions: ['(명) 주도권', '(명) 새로운 계획, 선도적 행동'],
    etymo: 'initium',
    examples: [
      { text: 'She took the [initiative] in the project.', korean: '그녀는 프로젝트에서 {주도권을} 잡았습니다.' },
      { text: 'This [initiative] will help the community.', korean: '이 {새로운 계획은} 지역사회를 도울 것입니다.' }
    ]
  },
  {
    id: '12', word: 'culinary',
    definitions: ['(형) 요리의, 음식의'],
    etymo: 'culina',
    examples: [
      { text: 'He has great [culinary] skills.', korean: '그는 훌륭한 {요리} 솜씨를 가지고 있습니다.' },
      { text: 'The [culinary] arts are fascinating.', korean: '{요리 예술은} 매력적입니다.' }
    ]
  },
  {
    id: '13', word: 'extensive',
    definitions: ['(형) 광범위한', '(형) 대규모의'],
    etymo: 'ex + tendere',
    examples: [
      { text: 'We conducted [extensive] research.', korean: '우리는 {광범위한} 조사를 실시했습니다.' },
      { text: '[Extensive] construction is happening downtown.', korean: '{대규모의} 건설이 도심에서 진행 중입니다.' }
    ]
  },
  {
    id: '14', word: 'deposit',
    definitions: ['(명) 예치금, 보증금', '(명) 침전물'],
    etymo: 'de + ponere',
    examples: [
      { text: 'The [deposit] is not refundable.', korean: '{보증금은} 환불되지 않습니다.' },
      { text: 'There is a [deposit] of minerals in the river.', korean: '강에 {광물 침전물이} 있습니다.' }
    ]
  },
  {
    id: '15', word: 'retail',
    definitions: ['(명) 소매', '(형) 소매의'],
    etymo: 're + tailler',
    examples: [
      { text: 'The [retail] price is $50.', korean: '{소매} 가격은 50달러입니다.' },
      { text: 'I work in [retail] business.', korean: '나는 {소매} 업에 종사합니다.' }
    ]
  },
  {
    id: '16', word: 'affordable',
    definitions: ['(형) 가격이 알맞은'],
    etymo: 'af + ford',
    examples: [
      { text: 'It is an [affordable] car.', korean: '그것은 {가격이 알맞은} 자동차입니다.' },
      { text: '[Affordable] housing is needed.', korean: '{저렴한} 주택이 필요합니다.' }
    ]
  },
  {
    id: '17', word: 'grant',
    definitions: ['(동) 승인하다', '(동) 수여하다'],
    etymo: 'credere',
    examples: [
      { text: 'They will [grant] your request.', korean: '그들은 당신의 요청을 {승인할} 것입니다.' },
      { text: 'The university will [grant] scholarships.', korean: '대학은 장학금을 {수여할} 것입니다.' }
    ]
  },
  {
    id: '18', word: 'significantly',
    definitions: ['(부) 상당히, 현저하게', '(부) 중요한 정도로, 의미 있게'],
    etymo: 'sign + fic',
    examples: [
      { text: 'Sales increased [significantly].', korean: '매출이 {상당히} 증가했습니다.' },
      { text: 'This discovery [significantly] changes our understanding.', korean: '이 발견은 {의미 있게} 우리의 이해를 바꿉니다.' }
    ]
  },
  {
    id: '19', word: 'reserve',
    definitions: ['(동) 예약하다', '(동) 보유하다'],
    etymo: 're + servare',
    examples: [
      { text: 'I would like to [reserve] a table.', korean: '테이블을 {예약하고} 싶습니다.' },
      { text: 'We [reserve] the right to refuse.', korean: '우리는 거절할 {권리를 보유합니다}.' }
    ]
  },
  {
    id: '20', word: 'application',
    definitions: ['(명) 신청, 지원서', '(명) 적용, 응용'],
    etymo: 'ap + plicare',
    examples: [
      { text: 'Fill out the [application] form.', korean: '{신청서를} 작성해 주세요.' },
      { text: 'The [application] of this method is beneficial.', korean: '이 방법의 {적용은} 유용합니다.' }
    ]
  },
  {
    id: '21', word: 'address',
    definitions: ['(명) 주소', '(동) 문제를 다루다'],
    etymo: 'ad + directus',
    examples: [
      { text: 'Please send it to my [address].', korean: '제 {주소로} 보내주세요.' },
      { text: 'We must [address] this problem.', korean: '우리는 이 문제를 {다루어야} 합니다.' }
    ]
  },
  {
    id: '22', word: 'suppose',
    definitions: ['(동) 추정하다', '(동) 생각하다'],
    etymo: 'sub + ponere',
    examples: [
      { text: 'I [suppose] you are right.', korean: '당신이 옳다고 {추정합니다}.' },
      { text: 'I [suppose] we should start now.', korean: '이제 시작해야 한다고 {생각합니다}.' }
    ]
  },
  {
    id: '23', word: 'charge',
    definitions: ['(명) 요금', '(명) 책임'],
    etymo: 'carrus',
    examples: [
      { text: 'There is no extra [charge].', korean: '추가 {요금은} 없습니다.' },
      { text: 'She is in [charge] of the project.', korean: '그녀는 프로젝트의 {책임자}입니다.' }
    ]
  },
  {
    id: '24', word: 'expire',
    definitions: ['(동) 기한이 만료되다', '(동) 효력이 끝나다'],
    etymo: 'ex + spirare',
    examples: [
      { text: 'My contract will [expire] soon.', korean: '제 계약이 곧 {만료됩니다}.' },
      { text: 'The warranty has [expired].', korean: '보증이 {효력이 끝났습니다}.' }
    ]
  },
  {
    id: '25', word: 'refund',
    definitions: ['(명) 환불', '(동) 환불하다'],
    etymo: 're + fundere',
    examples: [
      { text: 'I would like a [refund].', korean: '{환불을} 받고 싶습니다.' },
      { text: 'We will [refund] your money.', korean: '우리는 당신의 돈을 {환불하겠습니다}.' }
    ]
  },
  {
    id: '26', word: 'promote',
    definitions: ['(동) 촉진하다', '(동) 승진시키다'],
    etymo: 'pro + movere',
    examples: [
      { text: 'We need to [promote] our new product.', korean: '우리는 신제품을 {홍보해야} 합니다.' },
      { text: 'They will [promote] him to manager.', korean: '그들은 그를 매니저로 {승진시킬} 것입니다.' }
    ]
  },
  {
    id: '27', word: 'revenue',
    definitions: ['(명) 수익, 수입', '(명) 세입'],
    etymo: 're + venire',
    examples: [
      { text: 'The company\'s [revenue] increased.', korean: '회사의 {수익이} 증가했습니다.' },
      { text: 'The [revenue] from taxes is collected here.', korean: '세금 {세입이} 여기서 수집됩니다.' }
    ]
  },
  {
    id: '28', word: 'opportunity',
    definitions: ['(명) 기회', '(명) 적기, 호기'],
    etymo: 'ob + portus',
    examples: [
      { text: 'This is a great [opportunity].', korean: '이것은 좋은 {기회}입니다.' },
      { text: 'This [opportunity] comes once in a lifetime.', korean: '이 {호기는} 평생에 한 번 옵니다.' }
    ]
  },
  {
    id: '29', word: 'valid',
    definitions: ['(형) 유효한', '(형) 타당한'],
    etymo: 'valere',
    examples: [
      { text: 'Is your passport [valid]?', korean: '여권이 {유효합니까}?' },
      { text: 'That is a [valid] argument.', korean: '그것은 {타당한} 주장입니다.' }
    ]
  },
  {
    id: '30', word: 'confidential',
    definitions: ['(형) 기밀의, 비밀의', '(형) 신뢰를 요하는'],
    etymo: 'con + fidere',
    examples: [
      { text: 'This information is [confidential].', korean: '이 정보는 {기밀}입니다.' },
      { text: '[Confidential] matters require discretion.', korean: '{신뢰를 요하는} 문제는 신중함이 필요합니다.' }
    ]
  },
  {
    id: '31', word: 'figure',
    definitions: ['(명) 숫자', '(명) 인물'],
    etymo: 'fingere',
    examples: [
      { text: 'The sales [figure] is high.', korean: '판매 {수치가} 높습니다.' },
      { text: 'He is an important [figure] in history.', korean: '그는 역사에서 {중요한 인물}입니다.' }
    ]
  },
  {
    id: '32', word: 'traffic',
    definitions: ['(명) 교통, 차량의 흐름', '(명) 인터넷 트래픽, 데이터 흐름'],
    etymo: 'trans + facere',
    examples: [
      { text: 'There is heavy [traffic] today.', korean: '오늘 {교통량이} 많습니다.' },
      { text: 'Website [traffic] has increased.', korean: '웹사이트 {트래픽이} 증가했습니다.' }
    ]
  },
  {
    id: '33', word: 'audience',
    definitions: ['(명) 청중, 관객', '(명) 독자'],
    etymo: 'audire',
    examples: [
      { text: 'The [audience] cheered loudly.', korean: '{청중이} 크게 환호했습니다.' },
      { text: 'The [audience] for this book is young adults.', korean: '이 책의 {독자는} 청년입니다.' }
    ]
  },
  {
    id: '34', word: 'occupy',
    definitions: ['(동) 공간을 차지하다', '(동) 시간이나 주의를 차지하다'],
    etymo: 'ob + capere',
    examples: [
      { text: 'The desk will [occupy] too much space.', korean: '그 책상은 너무 많은 공간을 {차지할} 것입니다.' },
      { text: 'Work [occupies] most of his time.', korean: '일이 그의 대부분 시간을 {차지합니다}.' }
    ]
  },
  {
    id: '35', word: 'approximately',
    definitions: ['(부) 대략', '(부) 거의'],
    etymo: 'ad + proximus',
    examples: [
      { text: 'It costs [approximately] $100.', korean: '비용은 {대략} 100달러입니다.' },
      { text: 'There are [approximately] 50 people here.', korean: '여기에는 {거의} 50명이 있습니다.' }
    ]
  },
  {
    id: '36', word: 'complimentary',
    definitions: ['(형) 무료의', '(형) 칭찬의'],
    etymo: 'complere',
    examples: [
      { text: 'They offer [complimentary] water.', korean: '그들은 {무료} 생수를 제공합니다.' },
      { text: 'He gave me a [complimentary] remark.', korean: '그가 나에게 {칭찬의} 말을 했습니다.' }
    ]
  },
  {
    id: '37', word: 'outstanding',
    definitions: ['(형) 미해결의, 미지불된', '(형) 뛰어난, 두드러진'],
    etymo: 'out + stand',
    examples: [
      { text: 'You have an [outstanding] debt.', korean: '당신은 {미지불된} 빚이 있습니다.' },
      { text: 'She is an [outstanding] student.', korean: '그녀는 {뛰어난} 학생입니다.' }
    ]
  },
  {
    id: '38', word: 'imperative',
    definitions: ['(형) 긴급한, 필수적인', '(명) 긴급한 문제, 필수적인 것'],
    etymo: 'in + parare',
    examples: [
      { text: 'It is [imperative] to be on time.', korean: '정시 도착은 {필수적}입니다.' },
      { text: 'The [imperative] is to finish this project.', korean: '{긴급 과제는} 이 프로젝트를 완료하는 것입니다.' }
    ]
  },
  {
    id: '39', word: 'substantial',
    definitions: ['(형) 상당한', '(형) 실질적인, 실제의'],
    etymo: 'sub + stare',
    examples: [
      { text: 'He made a [substantial] donation.', korean: '그는 {상당한} 기부를 했습니다.' },
      { text: 'There is [substantial] progress.', korean: '{실질적인} 진전이 있습니다.' }
    ]
  },
  {
    id: '40', word: 'decline',
    definitions: ['(동) 감소하다', '(동) 거절하다'],
    etymo: 'de + clinare',
    examples: [
      { text: 'Profits began to [decline].', korean: '이익이 {감소하기} 시작했습니다.' },
      { text: 'I must [decline] your offer.', korean: '나는 당신의 제안을 {거절해야} 합니다.' }
    ]
  },
  {
    id: '41', word: 'balance',
    definitions: ['(명) 균형', '(명) 잔액'],
    etymo: 'bi + lanx',
    examples: [
      { text: 'Work-life [balance] is important.', korean: '일과 삶의 {균형이} 중요합니다.' },
      { text: 'Check your account [balance].', korean: '계좌 {잔액을} 확인하세요.' }
    ]
  },
  {
    id: '42', word: 'account',
    definitions: ['(명) 계좌', '(명) 설명, 설명서'],
    etymo: 'ad + computare',
    examples: [
      { text: 'I opened a bank [account].', korean: '은행 {계좌를} 개설했습니다.' },
      { text: 'Give me an [account] of what happened.', korean: '무슨 일이 일어났는지 {설명해} 주세요.' }
    ]
  },
  {
    id: '43', word: 'proceed',
    definitions: ['(동) 계속하다, 진행하다', '(동) 시작하다'],
    etymo: 'pro + cedere',
    examples: [
      { text: 'Please [proceed] with the plan.', korean: '그 계획을 {진행해} 주십시오.' },
      { text: 'We will [proceed] with the meeting.', korean: '우리는 회의를 {시작하겠습니다}.' }
    ]
  },
  {
    id: '44', word: 'amenities',
    definitions: ['(명) 편의시설', '(명) 예의, 기품'],
    etymo: 'amoenus',
    examples: [
      { text: 'The hotel has great [amenities].', korean: '그 호텔은 훌륭한 {편의시설을} 갖추고 있습니다.' },
      { text: 'She treats everyone with [amenities].', korean: '그녀는 모두에게 {예의} 있게 대합니다.' }
    ]
  },
  {
    id: '45', word: 'renowned',
    definitions: ['(형) 유명한'],
    etymo: 're + nomer',
    examples: [
      { text: 'He is a [renowned] artist.', korean: '그는 {유명한} 예술가입니다.' },
      { text: '[Renowned] scholars gathered for the conference.', korean: '{유명한} 학자들이 회의에 모였습니다.' }
    ]
  },
  {
    id: '46', word: 'preserve',
    definitions: ['(동) 보존하다', '(명) 저장식품'],
    etymo: 'pre + servare',
    examples: [
      { text: 'We must [preserve] nature.', korean: '우리는 자연을 {보존해야} 합니다.' },
      { text: 'This [preserve] is made from berries.', korean: '이 {저장식품은} 베리로 만들어집니다.' }
    ]
  },
  {
    id: '47', word: 'simply',
    definitions: ['(부) 단순하게, 간결하게', '(부) 그저, 단지'],
    etymo: 'simplex',
    examples: [
      { text: 'The design is [simply] beautiful.', korean: '디자인은 {단순하게} 아름답습니다.' },
      { text: 'It is [simply] amazing.', korean: '그것은 {그저} 놀랍습니다.' }
    ]
  },
  {
    id: '48', word: 'presence',
    definitions: ['(명) 존재, 출석', '(명) 풍모, 영향력'],
    etymo: 'pre + esse',
    examples: [
      { text: 'Your [presence] is required.', korean: '당신의 {출석이} 필요합니다.' },
      { text: 'He has a strong [presence].', korean: '그는 강한 {풍모를} 가지고 있습니다.' }
    ]
  },
  {
    id: '49', word: 'laboratory',
    definitions: ['(명) 실험실'],
    etymo: 'labor',
    examples: [
      { text: 'He works in a [laboratory].', korean: '그는 {실험실에서} 일합니다.' },
      { text: 'The [laboratory] is equipped with modern tools.', korean: '{실험실은} 최신 도구로 장비되어 있습니다.' }
    ]
  },
  {
    id: '50', word: 'effective',
    definitions: ['(형) 효과적인', '(형) 효력을 발휘하는'],
    etymo: 'ex + facere',
    examples: [
      { text: 'The medicine is [effective].', korean: '그 약은 {효과적}입니다.' },
      { text: 'This law becomes [effective] next month.', korean: '이 법은 다음 달부터 {효력을 발휘합니다}.' }
    ]
  }
];

// --- Day 2: Advanced Business Vocabulary (51-100) ---
const DAY_2_WORDS: Word[] = [
  {
    id: '51', word: 'enhance',
    definitions: ['(동) 향상시키다', '(동) 강화하다'],
    etymo: 'en + hance',
    examples: [
      { text: 'This software will [enhance] productivity.', korean: '이 소프트웨어는 {생산성을} 향상시킬 것입니다.' },
      { text: 'The security measures [enhance] protection.', korean: '보안 조치가 {보호를} 강화합니다.' }
    ]
  },
  {
    id: '52', word: 'insurance',
    definitions: ['(명) 보험'],
    etymo: 'in + sure',
    examples: [
      { text: 'I need health [insurance].', korean: '나는 건강 {보험이} 필요합니다.' },
      { text: '[Insurance] will cover the damage.', korean: '{보험이} 손상을 보장할 것입니다.' }
    ]
  },
  {
    id: '53', word: 'spacious',
    definitions: ['(형) 넓은, 공간이 많은', '(형) 마음이 넓은, 너그러운'],
    etymo: 'spatium',
    examples: [
      { text: 'The room is very [spacious].', korean: '그 방은 매우 {넓습니다}.' },
      { text: 'He has a [spacious] mind.', korean: '그는 {마음이 넓습니다}.' }
    ]
  },
  {
    id: '54', word: 'ingredient',
    definitions: ['(명) (요리 및 화학 물질의) 재료, 성분', '(명) (성공 등의) 요소'],
    etymo: 'in + gredi',
    examples: [
      { text: 'Add the next [ingredient] to the bowl.', korean: '다음 {재료를} 그릇에 더하세요.' },
      { text: 'Hard work is an [ingredient] for success.', korean: '열심히 일하는 것은 성공의 {요소}입니다.' }
    ]
  },
  {
    id: '55', word: 'withdraw',
    definitions: ['(동) 철회하다', '(동) 철수하다'],
    etymo: 'with + draw',
    examples: [
      { text: 'I [withdraw] my previous statement.', korean: '나는 이전 진술을 {철회합니다}.' },
      { text: 'The troops will [withdraw] tomorrow.', korean: '군대는 내일 {철수할} 것입니다.' }
    ]
  },
  {
    id: '56', word: 'banquet',
    definitions: ['(명) 연회, 만찬', '(명) 성대한 식사'],
    etymo: 'ban + quet',
    examples: [
      { text: 'They hosted a [banquet] for the guests.', korean: '그들은 손님들을 위해 {연회를} 열었습니다.' },
      { text: 'The [banquet] was delicious.', korean: '{만찬이} 맛있었습니다.' }
    ]
  },
  {
    id: '57', word: 'experiment',
    definitions: ['(명) 실험', '(동) 실험하다'],
    etymo: 'ex + periri',
    examples: [
      { text: 'Conduct a scientific [experiment].', korean: '과학적 {실험을} 수행하세요.' },
      { text: 'Let\'s [experiment] with new ideas.', korean: '새로운 아이디어로 {실험해} 봅시다.' }
    ]
  },
  {
    id: '58', word: 'specific',
    definitions: ['(형) 구체적인, 명확한', '(형) 특정한'],
    etymo: 'species + facere',
    examples: [
      { text: 'Please be [specific] about your needs.', korean: '당신의 필요에 대해 {구체적으로} 말해주세요.' },
      { text: 'This [specific] case requires attention.', korean: '이 {특정한} 사건은 주의가 필요합니다.' }
    ]
  },
  {
    id: '59', word: 'specialize',
    definitions: ['(동) 전문화하다'],
    etymo: 'species',
    examples: [
      { text: 'I [specialize] in digital marketing.', korean: '나는 디지털 마케팅을 {전문으로} 합니다.' },
      { text: 'She [specializes] in criminal law.', korean: '그녀는 형법을 {전문으로} 합니다.' }
    ]
  },
  {
    id: '60', word: 'affect',
    definitions: ['(동) 영향을 미치다', '(명) 정서, 감정 (주로 심리학에서 사용됨)'],
    etymo: 'ad + facere',
    examples: [
      { text: 'Weather [affects] mood.', korean: '날씨가 기분에 {영향을 미칩니다}.' },
      { text: 'The patient shows positive [affect].', korean: '환자는 {긍정적인 감정을} 보입니다.' }
    ]
  },
  {
    id: '61', word: 'equip',
    definitions: ['(동) 장비를 제공하다', '(동) 준비시키다'],
    etymo: 'equip',
    examples: [
      { text: 'We will [equip] the team.', korean: '우리는 팀을 {장비로} 제공할 것입니다.' },
      { text: 'Education [equips] you for the future.', korean: '교육은 당신을 {미래를} 준비시킵니다.' }
    ]
  },
  {
    id: '62', word: 'reimbursement',
    definitions: ['(명) 환급, 상환', '(명) 보상'],
    etymo: 're + imburse',
    examples: [
      { text: 'Submit your receipt for [reimbursement].', korean: '{환급을} 위해 영수증을 제출하세요.' },
      { text: 'The [reimbursement] was processed quickly.', korean: '{상환이} 빠르게 처리되었습니다.' }
    ]
  },
  {
    id: '63', word: 'premises',
    definitions: ['(명) 건물과 토지, 부지', '(명) 구내'],
    etymo: 'prae + mittere',
    examples: [
      { text: 'The company owns the [premises].', korean: '회사는 {부지를} 소유하고 있습니다.' },
      { text: 'No smoking on these [premises].', korean: '이 {구내에서} 흡연 금지입니다.' }
    ]
  },
  {
    id: '64', word: 'renovate',
    definitions: ['(동) 수리하다, 개조하다'],
    etymo: 're + novare',
    examples: [
      { text: 'We plan to [renovate] the kitchen.', korean: '우리는 주방을 {개조할} 계획입니다.' },
      { text: 'The building was [renovated] last year.', korean: '그 건물은 지난해 {수리되었습니다}.' }
    ]
  },
  {
    id: '65', word: 'versatile',
    definitions: ['(형) 다재다능한', '(형) 다용도의'],
    etymo: 'versus + alis',
    examples: [
      { text: 'He is a [versatile] artist.', korean: '그는 {다재다능한} 예술가입니다.' },
      { text: 'This tool is [versatile].', korean: '이 도구는 {다용도}입니다.' }
    ]
  },
  {
    id: '66', word: 'implement',
    definitions: ['(동) 실행하다', '(명) 도구, 장치'],
    etymo: 'in + plere',
    examples: [
      { text: 'Let\'s [implement] this strategy.', korean: '이 전략을 {실행해} 봅시다.' },
      { text: 'Farm [implements] are expensive.', korean: '농업 {도구들은} 비쌉니다.' }
    ]
  },
  {
    id: '67', word: 'informed',
    definitions: ['(형) 정보에 기반한'],
    etymo: 'in + formare',
    examples: [
      { text: 'Make an [informed] decision.', korean: '{정보에 기반한} 결정을 내리세요.' },
      { text: 'An [informed] opinion matters.', korean: '{정보에 기반한} 의견이 중요합니다.' }
    ]
  },
  {
    id: '68', word: 'commitment',
    definitions: ['(명) 약속', '(명) 헌신'],
    etymo: 'con + mittere',
    examples: [
      { text: 'He made a [commitment] to help.', korean: '그는 도움을 주겠다는 {약속을} 했습니다.' },
      { text: 'Her [commitment] to work is admirable.', korean: '일에 대한 그녀의 {헌신이} 훌륭합니다.' }
    ]
  },
  {
    id: '69', word: 'direct',
    definitions: ['(형) 직접적인', '(동) 명령하다, 지시하다'],
    etymo: 'direcus',
    examples: [
      { text: 'This is a [direct] result.', korean: '이것은 {직접적인} 결과입니다.' },
      { text: 'He will [direct] the project.', korean: '그가 프로젝트를 {지시할} 것입니다.' }
    ]
  },
  {
    id: '70', word: 'facilitate',
    definitions: ['(동) 용이하게 하다, 촉진하다'],
    etymo: 'facilis',
    examples: [
      { text: 'Technology will [facilitate] communication.', korean: '기술이 소통을 {촉진할} 것입니다.' },
      { text: 'I\'ll [facilitate] the meeting.', korean: '나는 회의를 {용이하게} 하겠습니다.' }
    ]
  },
  {
    id: '71', word: 'commission',
    definitions: ['(명) 수수료', '(명) 위원회'],
    etymo: 'con + mittere',
    examples: [
      { text: 'I earn a [commission] on sales.', korean: '나는 판매에 대한 {수수료를} 받습니다.' },
      { text: 'The [commission] investigated the case.', korean: '{위원회가} 그 사건을 조사했습니다.' }
    ]
  },
  {
    id: '72', word: 'cover',
    definitions: ['(동) 덮다', '(동) 포함하다'],
    etymo: 'covrir',
    examples: [
      { text: '[Cover] the pot with a lid.', korean: '냄비를 {뚜껑으로} 덮으세요.' },
      { text: 'The insurance will [cover] the cost.', korean: '보험이 비용을 {포함할} 것입니다.' }
    ]
  },
  {
    id: '73', word: 'encourage',
    definitions: ['(동) 격려하다', '(동) 촉진하다'],
    etymo: 'en + courage',
    examples: [
      { text: 'Teachers [encourage] students to learn.', korean: '선생님들은 학생들을 {격려합니다}.' },
      { text: 'The policy will [encourage] growth.', korean: '정책이 성장을 {촉진할} 것입니다.' }
    ]
  },
  {
    id: '74', word: 'persuade',
    definitions: ['(동) 설득하다', '(동) 납득시키다'],
    etymo: 'per + suadere',
    examples: [
      { text: 'I tried to [persuade] him.', korean: '나는 그를 {설득하려고} 했습니다.' },
      { text: 'The evidence will [persuade] the jury.', korean: '증거가 배심원을 {납득시킬} 것입니다.' }
    ]
  },
  {
    id: '75', word: 'accompany',
    definitions: ['(동) 동반하다, 함께 가다', '(동) 수반하다, 동반하다'],
    etymo: 'com + pagnon',
    examples: [
      { text: 'I will [accompany] you to the airport.', korean: '나는 공항까지 {함께 가겠습니다}.' },
      { text: '[Accompanying] the meal is a beverage.', korean: '{식사를 수반하는} 음료입니다.' }
    ]
  },
  {
    id: '76', word: 'candidate',
    definitions: ['(명) 후보자, 지원자', '(명) 시험응시자'],
    etymo: 'candidus',
    examples: [
      { text: 'She is a strong [candidate].', korean: '그녀는 강력한 {후보자}입니다.' },
      { text: 'The [candidate] passed the exam.', korean: '{시험응시자가} 시험에 합격했습니다.' }
    ]
  },
  {
    id: '77', word: 'renew',
    definitions: ['(동) 갱신하다', '(동) 재개하다'],
    etymo: 're + new',
    examples: [
      { text: 'I need to [renew] my license.', korean: '나는 면허를 {갱신해야} 합니다.' },
      { text: 'Let\'s [renew] our friendship.', korean: '우리 우정을 {재개합시다}.' }
    ]
  },
  {
    id: '78', word: 'launch',
    definitions: ['(동) 출시하다', '(동) 시작하다'],
    etymo: 'lance',
    examples: [
      { text: 'We will [launch] the new product next month.', korean: '우리는 다음 달에 새 제품을 {출시할} 것입니다.' },
      { text: 'The company will [launch] an investigation.', korean: '회사는 조사를 {시작할} 것입니다.' }
    ]
  },
  {
    id: '79', word: 'reliable',
    definitions: ['(형) 믿을 수 있는, 신뢰할 수 있는'],
    etymo: 're + lier',
    examples: [
      { text: 'He is a [reliable] worker.', korean: '그는 {믿을 수 있는} 근로자입니다.' },
      { text: 'The [reliable] service impressed us.', korean: '{신뢰할 수 있는} 서비스가 우리를 감동시켰습니다.' }
    ]
  },
  {
    id: '80', word: 'inform',
    definitions: ['(동) 알리다', '(동) 정보 제공하다'],
    etymo: 'in + forma',
    examples: [
      { text: 'Please [inform] me of the decision.', korean: '결정을 {알려주세요}.' },
      { text: 'The report will [inform] our strategy.', korean: '보고서가 우리의 전략에 {정보를} 제공할 것입니다.' }
    ]
  },
  {
    id: '81', word: 'contribute',
    definitions: ['(동) 기여하다', '(동) 기부하다'],
    etymo: 'con + tribuere',
    examples: [
      { text: 'You can [contribute] to this project.', korean: '당신은 이 프로젝트에 {기여할} 수 있습니다.' },
      { text: 'I will [contribute] to the charity.', korean: '나는 자선에 {기부하겠습니다}.' }
    ]
  },
  {
    id: '82', word: 'strategy',
    definitions: ['(명) 전략', '(명) 전술, 방법'],
    etymo: 'strategos',
    examples: [
      { text: 'Our [strategy] is to expand.', korean: '우리의 {전략은} 확장입니다.' },
      { text: 'The [strategy] worked well.', korean: '그 {전술이} 잘 작동했습니다.' }
    ]
  },
  {
    id: '83', word: 'motivate',
    definitions: ['(동) 동기부여하다', '(동) 유도하다, 자극하다'],
    etymo: 'motus',
    examples: [
      { text: 'Good pay [motivates] employees.', korean: '좋은 급여가 직원들을 {동기부여합니다}.' },
      { text: 'Fear can [motivate] people.', korean: '두려움이 사람들을 {자극할} 수 있습니다.' }
    ]
  },
  {
    id: '84', word: 'consider',
    definitions: ['(동) 고려하다', '(동) ~라고 여기다'],
    etymo: 'con + sidere',
    examples: [
      { text: 'Please [consider] this option.', korean: '이 옵션을 {고려해} 주세요.' },
      { text: 'I [consider] you a friend.', korean: '나는 당신을 {친구라고} 여깁니다.' }
    ]
  },
  {
    id: '85', word: 'remind',
    definitions: ['(동) 상기시키다', '(동) 떠올리게 하다'],
    etymo: 're + mind',
    examples: [
      { text: '[Remind] me about the meeting.', korean: '회의를 {상기시켜} 주세요.' },
      { text: 'This song [reminds] me of childhood.', korean: '이 노래는 {어린 시절을} 떠올리게 합니다.' }
    ]
  },
  {
    id: '86', word: 'suitable',
    definitions: ['(형) 적합한, 알맞은', '(형) 어울리는'],
    etymo: 'suit',
    examples: [
      { text: 'This dress is [suitable] for the event.', korean: '이 드레스는 행사에 {적합합니다}.' },
      { text: 'The color is [suitable] for you.', korean: '그 색깔이 {어울립니다}.' }
    ]
  },
  {
    id: '87', word: 'beverage',
    definitions: ['(명) 음료'],
    etymo: 'boire',
    examples: [
      { text: 'What [beverage] would you like?', korean: '어떤 {음료를} 원하십니까?' },
      { text: 'The [beverage] is free with the meal.', korean: '{음료는} 식사에 포함되어 있습니다.' }
    ]
  },
  {
    id: '88', word: 'portable',
    definitions: ['(형) 휴대할 수 있는'],
    etymo: 'portare',
    examples: [
      { text: 'My [portable] speaker is very convenient.', korean: '나의 {휴대용} 스피커는 매우 편리합니다.' },
      { text: '[Portable] devices are popular.', korean: '{휴대용} 기기가 인기입니다.' }
    ]
  },
  {
    id: '89', word: 'essential',
    definitions: ['(형) 필수적인', '(명) 필수 요소'],
    etymo: 'esse',
    examples: [
      { text: 'Water is [essential] for life.', korean: '물은 {생명에} 필수적입니다.' },
      { text: 'The [essentials] are already packed.', korean: '{필수 요소들이} 이미 포장되었습니다.' }
    ]
  },
  {
    id: '90', word: 'consent',
    definitions: ['(명) 동의, 허락', '(동) 동의하다, 허락하다'],
    etymo: 'con + sentire',
    examples: [
      { text: 'I need your [consent] to proceed.', korean: '나는 진행하기 위해 당신의 {동의가} 필요합니다.' },
      { text: 'He will [consent] to the plan.', korean: '그는 그 계획에 {동의할} 것입니다.' }
    ]
  },
  {
    id: '91', word: 'tentative',
    definitions: ['(형) 잠정적인, 임시의', '(형) 시도적인, 시험적인'],
    etymo: 'tentare',
    examples: [
      { text: 'This is a [tentative] schedule.', korean: '이것은 {잠정적인} 일정입니다.' },
      { text: 'His approach was [tentative].', korean: '그의 접근 방식은 {시도적}이었습니다.' }
    ]
  },
  {
    id: '92', word: 'respective',
    definitions: ['(형) 각각의, 각자의'],
    etymo: 're + spectare',
    examples: [
      { text: 'They returned to their [respective] homes.', korean: '그들은 {각각의} 집으로 돌아갔습니다.' },
      { text: 'The teams have their [respective] coaches.', korean: '팀들은 {각자의} 코치가 있습니다.' }
    ]
  },
  {
    id: '93', word: 'arrange',
    definitions: ['(동) 정리하다', '(동) 준비하다'],
    etymo: 'ad + rogne',
    examples: [
      { text: '[Arrange] the books on the shelf.', korean: '선반 위의 책들을 {정리하세요}.' },
      { text: 'I will [arrange] the meeting.', korean: '나는 회의를 {준비하겠습니다}.' }
    ]
  },
  {
    id: '94', word: 'associate',
    definitions: ['(동) 관련시키다, 연관짓다'],
    etymo: 'ad + socius',
    examples: [
      { text: 'Don\'t [associate] happiness with money.', korean: '행복을 돈과 {관련짓지} 마세요.' },
      { text: 'She [associates] with successful people.', korean: '그녀는 성공한 사람들과 {어울립니다}.' }
    ]
  },
  {
    id: '95', word: 'publicity',
    definitions: ['(명) 언론 보도, 광고', '(명) 선전, 홍보'],
    etymo: 'publicus',
    examples: [
      { text: 'The event got a lot of [publicity].', korean: '그 행사는 많은 {언론 보도를} 받았습니다.' },
      { text: 'We need good [publicity] for the product.', korean: '우리는 제품에 대한 좋은 {홍보가} 필요합니다.' }
    ]
  },
  {
    id: '96', word: 'instructor',
    definitions: ['(명) 강사, 교관'],
    etymo: 'in + struere',
    examples: [
      { text: 'My yoga [instructor] is very patient.', korean: '나의 요가 {강사는} 매우 인내심이 많습니다.' },
      { text: 'The [instructor] teaches beginners.', korean: '{강사가} 초보자를 가르칩니다.' }
    ]
  },
  {
    id: '97', word: 'contractor',
    definitions: ['(명) 계약자, 도급업자'],
    etymo: 'con + trahere',
    examples: [
      { text: 'The [contractor] completed the work.', korean: '{도급업자가} 일을 완료했습니다.' },
      { text: 'Hire a reliable [contractor] for the renovation.', korean: '개조를 위해 신뢰할 수 있는 {도급업자를} 고용하세요.' }
    ]
  },
  {
    id: '98', word: 'relevant',
    definitions: ['(형) 관련 있는', '(형) 적절한'],
    etymo: 'relevare',
    examples: [
      { text: 'The information is [relevant] to the case.', korean: '그 정보는 {사건에} 관련 있습니다.' },
      { text: 'Your experience is [relevant] for this job.', korean: '당신의 경험은 이 직업에 {적절합니다}.' }
    ]
  },
  {
    id: '99', word: 'weekly',
    definitions: ['(형) 매주 열리는', '(부) 매주'],
    etymo: 'week',
    examples: [
      { text: 'There is a [weekly] meeting on Friday.', korean: '금요일에 {매주 열리는} 회의가 있습니다.' },
      { text: 'I go to the gym [weekly].', korean: '나는 {매주} 체육관에 갑니다.' }
    ]
  },
  {
    id: '100', word: 'imply',
    definitions: ['(동) 암시하다'],
    etymo: 'in + plicare',
    examples: [
      { text: 'What do you [imply] by that?', korean: '당신은 그것으로 무엇을 {암시합니까}?' },
      { text: 'His words [imply] disapproval.', korean: '그의 말씀은 불승인을 {암시합니다}.' }
    ]
  }
];

// --- Day 3: Business Operations Vocabulary (101-150) ---
const DAY_3_WORDS: Word[] = [
  {
    id: '101', word: 'reveal',
    definitions: ['(동) 드러내다, 폭로하다', '(동) 보여주다, 나타내다'],
    etymo: 're + velare',
    examples: [
      { text: 'The report will [reveal] the truth.', korean: '보고서가 {진실을} 드러낼 것입니다.' },
      { text: 'The light [reveals] the painting beautifully.', korean: '빛이 그림을 {아름답게} 보여줍니다.' }
    ]
  },
  {
    id: '102', word: 'assembly',
    definitions: ['(명) 조립', '(명) 집회, 회의'],
    etymo: 'ad + semblare',
    examples: [
      { text: 'The [assembly] of the device takes time.', korean: '{기기의} 조립에 시간이 걸립니다.' },
      { text: 'The [assembly] met to discuss the issue.', korean: '{회의가} 문제를 논의하기 위해 모였습니다.' }
    ]
  },
  {
    id: '103', word: 'procedure',
    definitions: ['(명) 절차, 과정', '(명) 수술, 의료 절차'],
    etymo: 'pro + cedere',
    examples: [
      { text: 'Follow the [procedure] carefully.', korean: '{절차를} 주의 깊게 따르세요.' },
      { text: 'The [procedure] was successful.', korean: '{수술이} 성공했습니다.' }
    ]
  },
  {
    id: '104', word: 'overdue',
    definitions: ['(형) 기한이 지난', '(형) 연체된'],
    etymo: 'over + due',
    examples: [
      { text: 'The payment is [overdue].', korean: '{납기가} 지났습니다.' },
      { text: 'The library book is [overdue].', korean: '{도서관} 책이 {연체되었습니다}.' }
    ]
  },
  {
    id: '105', word: 'merchandise',
    definitions: ['(명) 상품, 물품', '(동) 판매하다, 홍보하다'],
    etymo: 'mercis',
    examples: [
      { text: 'The [merchandise] is displayed in the store.', korean: '{상품이} 가게에 전시되어 있습니다.' },
      { text: 'We will [merchandise] the new product aggressively.', korean: '우리는 새 제품을 {적극적으로} 판매할 것입니다.' }
    ]
  },
  {
    id: '106', word: 'authority',
    definitions: ['(명) 권한', '(명) 당국'],
    etymo: 'augere',
    examples: [
      { text: 'You have the [authority] to make decisions.', korean: '당신은 결정을 내릴 {권한이} 있습니다.' },
      { text: 'The [authority] approved the project.', korean: '{당국이} 프로젝트를 승인했습니다.' }
    ]
  },
  {
    id: '107', word: 'fiscal',
    definitions: ['(형) 재정의, 회계의'],
    etymo: 'fiscus',
    examples: [
      { text: 'The [fiscal] year ends in December.', korean: '{회계} {연도는} 12월에 끝납니다.' },
      { text: '[Fiscal] policy affects the economy.', korean: '{재정} 정책은 경제에 영향을 미칩니다.' }
    ]
  },
  {
    id: '108', word: 'timely',
    definitions: ['(형) 시기적절한', '(부) 시기적절하게'],
    etymo: 'time',
    examples: [
      { text: 'Your feedback is [timely] and helpful.', korean: '당신의 피드백은 {시기적절하고} 도움이 됩니다.' },
      { text: 'The delivery was [timely].', korean: '{배달이} {시기적절했습니다}.' }
    ]
  },
  {
    id: '109', word: 'duty',
    definitions: ['(명) 책임, 의무', '(명) 관세, 세금'],
    etymo: 'debere',
    examples: [
      { text: 'It is your [duty] to help.', korean: '도움을 주는 것은 당신의 {의무}입니다.' },
      { text: 'Customs [duty] must be paid.', korean: '{관세를} 지불해야 합니다.' }
    ]
  },
  {
    id: '110', word: 'impose',
    definitions: ['(동) (세금, 규제 등을) 부과하다', '(동) 강요하다, 강제하다'],
    etymo: 'in + ponere',
    examples: [
      { text: 'The government will [impose] new taxes.', korean: '정부는 {새로운 세금을} 부과할 것입니다.' },
      { text: 'Don\'t [impose] your beliefs on others.', korean: '당신의 믿음을 다른 사람들에게 {강요하지} 마세요.' }
    ]
  },
  {
    id: '111', word: 'merger',
    definitions: ['(명) 합병', '(명) 융합'],
    etymo: 'mergere',
    examples: [
      { text: 'The [merger] of two companies was approved.', korean: '두 회사의 {합병이} 승인되었습니다.' },
      { text: 'The [merger] created a stronger entity.', korean: '{융합이} 더 강한 기관을 만들었습니다.' }
    ]
  },
  {
    id: '112', word: 'demonstration',
    definitions: ['(명) 증명, 시연', '(명) 시위'],
    etymo: 'de + monstrare',
    examples: [
      { text: 'The [demonstration] showed how the product works.', korean: '{시연이} 제품이 어떻게 작동하는지 보여주었습니다.' },
      { text: 'The [demonstration] lasted for hours.', korean: '{시위가} 몇 시간 동안 지속되었습니다.' }
    ]
  },
  {
    id: '113', word: 'fluctuate',
    definitions: ['(동) 변동하다'],
    etymo: 'fluctus',
    examples: [
      { text: 'Stock prices [fluctuate] daily.', korean: '주식 가격은 {매일} 변동합니다.' },
      { text: 'The temperature [fluctuates] throughout the day.', korean: '온도는 {하루} 종일 변동합니다.' }
    ]
  },
  {
    id: '114', word: 'deliver',
    definitions: ['(동) 배달하다, 전달하다', '(동) 연설하다, 발표하다'],
    etymo: 'de + liberare',
    examples: [
      { text: 'Please [deliver] the package on time.', korean: '패키지를 {정시에} 배달해 주세요.' },
      { text: 'The president will [deliver] a speech.', korean: '대통령이 {연설을} 발표할 것입니다.' }
    ]
  },
  {
    id: '115', word: 'devoted',
    definitions: ['(형) 헌신적인, 열정적인', '(형) 사랑하는'],
    etymo: 'de + votum',
    examples: [
      { text: 'She is a [devoted] teacher.', korean: '그녀는 {헌신적인} 교사입니다.' },
      { text: 'He is [devoted] to his family.', korean: '그는 가족을 {사랑합니다}.' }
    ]
  },
  {
    id: '116', word: 'stock',
    definitions: ['(명) 재고', '(명) 주식'],
    etymo: 'stok',
    examples: [
      { text: 'The [stock] of this item is low.', korean: '이 항목의 {재고가} 적습니다.' },
      { text: 'I invested in technology [stock].', korean: '나는 기술 {주식에} 투자했습니다.' }
    ]
  },
  {
    id: '117', word: 'promptly',
    definitions: ['(부) 지체 없이, 즉시', '(부) 정확히'],
    etymo: 'prompere',
    examples: [
      { text: 'Please respond [promptly] to the email.', korean: '이메일에 {즉시} 응답해 주세요.' },
      { text: 'The meeting started [promptly] at 9am.', korean: '회의는 {정확히} 오전 9시에 시작했습니다.' }
    ]
  },
  {
    id: '118', word: 'expand',
    definitions: ['(동) 확장하다', '(동) 팽창하다'],
    etymo: 'ex + pandere',
    examples: [
      { text: 'The company plans to [expand] internationally.', korean: '회사는 {국제적으로} 확장할 계획입니다.' },
      { text: 'The balloon will [expand] when filled with air.', korean: '풍선은 {공기로} 채워질 때 팽창합니다.' }
    ]
  },
  {
    id: '119', word: 'variety',
    definitions: ['(명) 다양성, 여러 가지 종류', '(명) 품종, 종'],
    etymo: 'varius',
    examples: [
      { text: 'The store offers a [variety] of products.', korean: '가게는 {다양한} 제품을 제공합니다.' },
      { text: 'This is a new [variety] of apple.', korean: '이것은 사과의 {새로운} 품종입니다.' }
    ]
  },
  {
    id: '120', word: 'immediately',
    definitions: ['(부) 즉시, 곧'],
    etymo: 'immediatus',
    examples: [
      { text: 'Please leave [immediately].', korean: '{즉시} 떠나주세요.' },
      { text: 'The effect will be [immediately] noticeable.', korean: '효과는 {곧} 눈에 띌 것입니다.' }
    ]
  },
  {
    id: '121', word: 'capacity',
    definitions: ['(명) 수용 능력, 용량', '(명) 역할, 지위'],
    etymo: 'capax',
    examples: [
      { text: 'The hall has a [capacity] of 500 people.', korean: '홀의 {수용 능력은} 500명입니다.' },
      { text: 'In my [capacity] as manager, I approve this.', korean: '관리자로서의 내 {역할로} 이를 승인합니다.' }
    ]
  },
  {
    id: '122', word: 'conduct',
    definitions: ['(동) 수행하다', '(동) 지휘하다'],
    etymo: 'con + ducere',
    examples: [
      { text: 'Conduct a thorough investigation.', korean: '{철저한} 조사를 수행하세요.' },
      { text: 'She will [conduct] the orchestra.', korean: '그녀가 {오케스트라를} 지휘할 것입니다.' }
    ]
  },
  {
    id: '123', word: 'transaction',
    definitions: ['(명) 거래', '(명) 처리'],
    etymo: 'trans + agere',
    examples: [
      { text: 'The [transaction] was completed successfully.', korean: '{거래가} 성공적으로 완료되었습니다.' },
      { text: 'The [transaction] took three days to process.', korean: '{처리에} 3일이 걸렸습니다.' }
    ]
  },
  {
    id: '124', word: 'personnel',
    definitions: ['(명) 직원, 인원', '(명) 인사부서'],
    etymo: 'personalis',
    examples: [
      { text: 'Our [personnel] are highly trained.', korean: '우리의 {직원들은} 고도로 훈련받았습니다.' },
      { text: 'Contact the [personnel] department.', korean: '{인사부서에} 연락하세요.' }
    ]
  },
  {
    id: '125', word: 'due',
    definitions: ['(형) 기한이 된', '(형) 적절한, 맞는'],
    etymo: 'debitus',
    examples: [
      { text: 'The payment is [due] next week.', korean: '{납입이} 다음 주에 기한이 됩니다.' },
      { text: 'The project received [due] recognition.', korean: '프로젝트가 {적절한} 인정을 받았습니다.' }
    ]
  },
  {
    id: '126', word: 'assure',
    definitions: ['(동) 안심시키다', '(동) 보증하다, 확언하다'],
    etymo: 'ad + securus',
    examples: [
      { text: 'I [assure] you everything will be fine.', korean: '당신이 {안심할} 수 있도록 모든 것이 잘될 것입니다.' },
      { text: 'We [assure] quality in all our products.', korean: '우리는 모든 제품의 품질을 {보증합니다}.' }
    ]
  },
  {
    id: '127', word: 'responsibility',
    definitions: ['(명) 책임, 의무', '(명) 담당, 역할'],
    etymo: 'respondere',
    examples: [
      { text: 'Taking [responsibility] is important.', korean: '{책임을} 지는 것은 중요합니다.' },
      { text: 'My [responsibility] is to manage the team.', korean: '내 {담당은} 팀을 관리하는 것입니다.' }
    ]
  },
  {
    id: '128', word: 'progress',
    definitions: ['(명) 발전, 진전', '(동) 진보하다, 나아가다'],
    etymo: 'pro + gradi',
    examples: [
      { text: 'We have made good [progress].', korean: '우리는 좋은 {진전을} 이루었습니다.' },
      { text: 'The project will [progress] smoothly.', korean: '프로젝트는 {순조롭게} 진행될 것입니다.' }
    ]
  },
  {
    id: '129', word: 'supply',
    definitions: ['(명) 공급, 비축품', '(동) 제공하다, 공급하다'],
    etymo: 'sup + plere',
    examples: [
      { text: 'The [supply] of water is limited.', korean: '물의 {공급이} 제한적입니다.' },
      { text: 'We [supply] fresh produce daily.', korean: '우리는 매일 {신선한 농산물을} 공급합니다.' }
    ]
  },
  {
    id: '130', word: 'release',
    definitions: ['(동) 발표하다, 공개하다', '(동) 석방하다, 자유롭게 하다'],
    etymo: 're + laxare',
    examples: [
      { text: 'The company will [release] the announcement tomorrow.', korean: '회사는 내일 {발표문을} 발표할 것입니다.' },
      { text: 'The prisoner was [released].', korean: '그 죄수는 {석방되었습니다}.' }
    ]
  },
  {
    id: '131', word: 'receipt',
    definitions: ['(명) 수령, 영수증', '(명) 영수증을 받음'],
    etymo: 're + capere',
    examples: [
      { text: 'Keep the [receipt] for your records.', korean: '기록용으로 {영수증을} 보관하세요.' },
      { text: '[Receipt] of the package was confirmed.', korean: '{패키지의 수령이} 확인되었습니다.' }
    ]
  },
  {
    id: '132', word: 'refuse',
    definitions: ['(동) 거절하다', '(명) 폐기물, 쓰레기'],
    etymo: 're + fusare',
    examples: [
      { text: 'I had to [refuse] the offer.', korean: '나는 {그 제안을} 거절해야 했습니다.' },
      { text: 'The [refuse] will be collected tomorrow.', korean: '{쓰레기는} 내일 수거됩니다.' }
    ]
  },
  {
    id: '133', word: 'prosperous',
    definitions: ['(형) 번영하는', '(부) 번영하게, 번창하게'],
    etymo: 'prosperus',
    examples: [
      { text: 'The business is [prosperous].', korean: '{사업이} 번영하고 있습니다.' },
      { text: 'The city is developing [prosperous].', korean: '그 도시는 {번창하게} 발전하고 있습니다.' }
    ]
  },
  {
    id: '134', word: 'lean',
    definitions: ['(동) 기대다', '(동) 기울이다'],
    etymo: 'hlignon',
    examples: [
      { text: '[Lean] against the wall for support.', korean: '기울기를 위해 벽에 {기대세요}.' },
      { text: 'The tree [leans] to one side.', korean: '나무가 {한쪽으로} 기울어집니다.' }
    ]
  },
  {
    id: '135', word: 'pedestrian',
    definitions: ['(명) 보행자', '(형) 평범한, 재미없는'],
    etymo: 'pedestris',
    examples: [
      { text: 'The [pedestrian] crossed the street safely.', korean: '{보행자가} 안전하게 길을 건넜습니다.' },
      { text: 'The movie was quite [pedestrian].', korean: '그 영화는 {매우 평범했습니다}.' }
    ]
  },
  {
    id: '136', word: 'tenant',
    definitions: ['(명) 임차인, 세입자'],
    etymo: 'tenere',
    examples: [
      { text: 'The [tenant] pays rent monthly.', korean: '{세입자는} 매달 {임차료를} 냅니다.' },
      { text: 'Our [tenant] has lived here for five years.', korean: '우리의 {세입자는} 여기 5년을 살았습니다.' }
    ]
  },
  {
    id: '137', word: 'flaw',
    definitions: ['(명) 결함, 흠', '(동) 결함을 만들다'],
    etymo: 'flue',
    examples: [
      { text: 'The [flaw] in the design is obvious.', korean: '디자인의 {결함이} 명백합니다.' },
      { text: 'Nothing can [flaw] her beauty.', korean: '아무것도 그녀의 아름다움을 {훼손할} 수 없습니다.' }
    ]
  },
  {
    id: '138', word: 'guarantee',
    definitions: ['(명) 보증, 보장', '(동) 보장하다, 확실히 하다'],
    etymo: 'guarant',
    examples: [
      { text: 'The product comes with a [guarantee].', korean: '그 제품은 {보증과} 함께 제공됩니다.' },
      { text: 'We [guarantee] customer satisfaction.', korean: '우리는 고객 {만족을} 보장합니다.' }
    ]
  },
  {
    id: '139', word: 'loan',
    definitions: ['(명) 대출, 차용금', '(동) 빌려주다, 대출하다'],
    etymo: 'loanh',
    examples: [
      { text: 'I took out a [loan] to buy a house.', korean: '나는 집을 사기 위해 {대출을} 받았습니다.' },
      { text: 'Can you [loan] me $100?', korean: '나에게 {100달러를} 빌려줄 수 있나요?' }
    ]
  },
  {
    id: '140', word: 'admit',
    definitions: ['(동) (사실이나 잘못을) 인정하다', '(동) 입장을 허용하다'],
    etymo: 'ad + mittere',
    examples: [
      { text: 'I [admit] I was wrong.', korean: '나는 내가 {틀렸다} {인정합니다}.' },
      { text: 'Students were [admitted] to the program.', korean: '학생들은 {프로그램에} 입학이 허용되었습니다.' }
    ]
  },
  {
    id: '141', word: 'expense',
    definitions: ['(명) 비용', '(명) 지출'],
    etymo: 'expensus',
    examples: [
      { text: 'All [expenses] must be reported.', korean: '모든 {비용을} 보고해야 합니다.' },
      { text: 'Travel [expenses] are covered by the company.', korean: '{출장 비용은} 회사에서 {지출합니다}.' }
    ]
  },
  {
    id: '142', word: 'description',
    definitions: ['(명) 묘사, 설명'],
    etymo: 'describere',
    examples: [
      { text: 'The [description] of the product is detailed.', korean: '제품의 {설명이} 자세합니다.' },
      { text: 'A brief [description] will suffice.', korean: '{간단한 설명으로} 충분합니다.' }
    ]
  },
  {
    id: '143', word: 'statement',
    definitions: ['(명) 진술, 발표', '(명) 명세서, 서류'],
    etymo: 'statuere',
    examples: [
      { text: 'The witness made a [statement] to police.', korean: '목격자가 {경찰에} 진술했습니다.' },
      { text: 'I received my bank [statement].', korean: '나는 은행 {명세서를} 받았습니다.' }
    ]
  },
  {
    id: '144', word: 'regulation',
    definitions: ['(명) 규제, 규정', '(형) 규제적인'],
    etymo: 'regulatus',
    examples: [
      { text: 'New [regulation] requires safety testing.', korean: '새로운 {규제는} 안전 테스트를 요구합니다.' },
      { text: 'The [regulation] size is 10 inches.', korean: '{규정 크기는} 10인치입니다.' }
    ]
  },
  {
    id: '145', word: 'material',
    definitions: ['(명) 재료, 물질', '(명) 자료, 정보'],
    etymo: 'materialis',
    examples: [
      { text: 'What [material] is this made of?', korean: '이것은 {어떤 재료로} 만들어졌나요?' },
      { text: 'Collect relevant [material] for the report.', korean: '보고서에 {관련된 자료를} 수집하세요.' }
    ]
  },
  {
    id: '146', word: 'policy',
    definitions: ['(명) 정책, 방침', '(명) 보험 증권'],
    etymo: 'politeia',
    examples: [
      { text: 'The company has a new [policy].', korean: '회사는 {새로운 정책을} 받았습니다.' },
      { text: 'Check your insurance [policy].', korean: '당신의 보험 {증권을} 확인하세요.' }
    ]
  },
  {
    id: '147', word: 'assume',
    definitions: ['(동) 가정하다', '(동) 맡다'],
    etymo: 'assumere',
    examples: [
      { text: 'I [assume] you agree with this plan.', korean: '나는 당신이 {이 계획에} 동의한다고 {가정합니다}.' },
      { text: 'She will [assume] the position next month.', korean: '그녀는 {다음 달에} 그 직책을 {맡을} 것입니다.' }
    ]
  },
  {
    id: '148', word: 'critical',
    definitions: ['(형) 중요한, 중대한', '(형) 위기의, 위험한'],
    etymo: 'criticus',
    examples: [
      { text: 'This report is [critical] to our success.', korean: '이 보고서는 우리의 {성공에} {중요합니다}.' },
      { text: 'The patient is in [critical] condition.', korean: '그 환자는 {위기 상황에} 있습니다.' }
    ]
  },
  {
    id: '149', word: 'alleviate',
    definitions: ['(동) 완화하다, 덜어주다'],
    etymo: 'ad + levis',
    examples: [
      { text: 'This medicine will [alleviate] your pain.', korean: '이 약은 {당신의 통증을} 완화할 것입니다.' },
      { text: 'We hope to [alleviate] the poverty crisis.', korean: '우리는 {빈곤 위기를} 덜어주고 싶습니다.' }
    ]
  },
  {
    id: '150', word: 'solicit',
    definitions: ['(동) 요청하다, 간청하다', '(동) 청구하다'],
    etymo: 'sollicitus',
    examples: [
      { text: 'We [solicit] your support for this cause.', korean: '우리는 {이 사업을} 위해 당신의 {지지를} 간청합니다.' },
      { text: 'The vendor [solicits] customers on the street.', korean: '그 상인은 {거리에서} 고객들을 {청구합니다}.' }
    ]
  }
];

// --- Day 4: Business Strategy Vocabulary (151-200) ---
const DAY_4_WORDS: Word[] = [
  {
    id: '151', word: 'unprecedented',
    definitions: ['(형) 전례 없는'],
    etymo: 'un + praecedent',
    examples: [
      { text: 'This is an [unprecedented] situation.', korean: '이것은 {전례 없는} 상황입니다.' },
      { text: 'The growth was [unprecedented].', korean: '그 성장은 {전례 없었습니다}.' }
    ]
  },
  {
    id: '152', word: 'produce',
    definitions: ['(동) 생산하다', '(명) 농산물'],
    etymo: 'producere',
    examples: [
      { text: 'The factory will [produce] 1000 units.', korean: '공장은 {1000개 단위를} 생산할 것입니다.' },
      { text: 'Fresh [produce] is available year-round.', korean: '{신선한 농산물은} 연 내내 이용 가능합니다.' }
    ]
  },
  {
    id: '153', word: 'amount',
    definitions: ['(명) 양, 총액', '(동) (합계가) ~에 이르다'],
    etymo: 'amontum',
    examples: [
      { text: 'The [amount] is $5000.', korean: '{금액은} $5000입니다.' },
      { text: 'The expenses [amounted] to $1000.', korean: '{비용이} $1000에 {이르렀습니다}.' }
    ]
  },
  {
    id: '154', word: 'commute',
    definitions: ['(동) 출퇴근하다', '(동) 통근 시간을 줄이다'],
    etymo: 'commutare',
    examples: [
      { text: 'I [commute] to work by train.', korean: '나는 {기차로} 직장에 {출퇴근합니다}.' },
      { text: 'You can [commute] your sentence.', korean: '당신의 {형기를} 줄일 수 있습니다.' }
    ]
  },
  {
    id: '155', word: 'corporate',
    definitions: ['(형) 기업의, 법인의', '(형) 공동의, 단체의'],
    etymo: 'corporatus',
    examples: [
      { text: '[Corporate] policy prohibits this.', korean: '{기업} 정책이 이를 금지합니다.' },
      { text: 'The [corporate] effort was successful.', korean: '{공동의} 노력이 성공적이었습니다.' }
    ]
  },
  {
    id: '156', word: 'practical',
    definitions: ['(형) 실용적인', '(형) 실제적인, 현실적인'],
    etymo: 'practicus',
    examples: [
      { text: 'This is a [practical] solution.', korean: '이것은 {실용적인} 해결책입니다.' },
      { text: 'Be [practical] in your approach.', korean: '{실제적인} 접근을 하세요.' }
    ]
  },
  {
    id: '157', word: 'deny',
    definitions: ['(동) 부인하다, 사실이 아니라고 주장하다', '(동) 거부하다, 허락하지 않다'],
    etymo: 'denegare',
    examples: [
      { text: 'He [denied] the accusations.', korean: '그는 {그 고발을} 부인했습니다.' },
      { text: 'I cannot [deny] your request.', korean: '나는 당신의 {요청을} 거부할 수 없습니다.' }
    ]
  },
  {
    id: '158', word: 'diverse',
    definitions: ['(형) 다양한, 여러 가지의'],
    etymo: 'diversus',
    examples: [
      { text: 'Our team has [diverse] backgrounds.', korean: '우리 팀은 {다양한} 배경을 가집니다.' },
      { text: 'The population is very [diverse].', korean: '그 인구는 {매우 다양합니다}.' }
    ]
  },
  {
    id: '159', word: 'fulfill',
    definitions: ['(동) 요구를 충족시키다', '(동) 약속을 완수하다'],
    etymo: 'fulfillian',
    examples: [
      { text: 'We will [fulfill] all requirements.', korean: '우리는 모든 {요구 사항을} 충족시킬 것입니다.' },
      { text: 'I must [fulfill] my promise.', korean: '나는 내 {약속을} 완수해야 합니다.' }
    ]
  },
  {
    id: '160', word: 'clarify',
    definitions: ['(동) 명확하게 하다', '(동) 분명하게 하다'],
    etymo: 'clarus',
    examples: [
      { text: 'Can you [clarify] your position?', korean: '당신의 {입장을} 명확하게 할 수 있나요?' },
      { text: 'The statement [clarifies] the issue.', korean: '그 진술이 {그 문제를} 분명하게 합니다.' }
    ]
  },
  {
    id: '161', word: 'draft',
    definitions: ['(명) 초안, 초고', '(명) 징병, 선발'],
    etymo: 'draghtian',
    examples: [
      { text: 'Please review this [draft].', korean: '이 {초안을} 검토해 주세요.' },
      { text: 'The [draft] will select new players.', korean: '{징병이} 새로운 선수들을 선발할 것입니다.' }
    ]
  },
  {
    id: '162', word: 'recipe',
    definitions: ['(명) 요리법, 조리법', '(명) 지침, 비법'],
    etymo: 'recipere',
    examples: [
      { text: 'Follow the [recipe] carefully.', korean: '{요리법을} 주의 깊게 따르세요.' },
      { text: 'This is the [recipe] for success.', korean: '이것이 성공의 {지침입니다}.' }
    ]
  },
  {
    id: '163', word: 'performance',
    definitions: ['(명) 성과', '(명) 공연'],
    etymo: 'performare',
    examples: [
      { text: 'Your [performance] has improved.', korean: '당신의 {성과가} 향상되었습니다.' },
      { text: 'The [performance] was excellent.', korean: '{공연이} 훌륭했습니다.' }
    ]
  },
  {
    id: '164', word: 'invoice',
    definitions: ['(명) 청구서', '(동) 청구서를 보내다'],
    etymo: 'envois',
    examples: [
      { text: 'Send me the [invoice] please.', korean: '나에게 {청구서를} 보내주세요.' },
      { text: 'We will [invoice] you for the services.', korean: '우리는 그 서비스에 대해 {당신에게 청구할} 것입니다.' }
    ]
  },
  {
    id: '165', word: 'useful',
    definitions: ['(형) 유용한', '(형) 쓸모있는'],
    etymo: 'usefulian',
    examples: [
      { text: 'This tool is very [useful].', korean: '이 도구는 {매우 유용합니다}.' },
      { text: 'Your advice was [useful].', korean: '당신의 조언이 {도움이} 되었습니다.' }
    ]
  },
  {
    id: '166', word: 'durable',
    definitions: ['(형) 오래 지속되는, 견고한'],
    etymo: 'durare',
    examples: [
      { text: 'This product is very [durable].', korean: '이 제품은 {매우 견고합니다}.' },
      { text: '[Durable] goods last for years.', korean: '{내구재는} 수년간 지속됩니다.' }
    ]
  },
  {
    id: '167', word: 'subscribe',
    definitions: ['(동) 정기 구독을 신청하다', '(동) (서비스에) 가입하다'],
    etymo: 'subscribere',
    examples: [
      { text: '[Subscribe] to our newsletter.', korean: '우리의 {뉴스레터를} 구독하세요.' },
      { text: 'I [subscribed] to the streaming service.', korean: '나는 {스트리밍 서비스에} 가입했습니다.' }
    ]
  },
  {
    id: '168', word: 'coverage',
    definitions: ['(명) 보상 범위', '(명) 보도 범위'],
    etymo: 'coverture',
    examples: [
      { text: 'The insurance [coverage] is comprehensive.', korean: '보험 {보상 범위가} 포괄적입니다.' },
      { text: 'The news [coverage] was extensive.', korean: '{뉴스 보도가} 광범위했습니다.' }
    ]
  },
  {
    id: '169', word: 'approve',
    definitions: ['(동) 승인하다', '(동) 찬성하다'],
    etymo: 'approbare',
    examples: [
      { text: 'The board will [approve] the proposal.', korean: '이사회가 {그 제안을} 승인할 것입니다.' },
      { text: 'I [approve] of your decision.', korean: '나는 당신의 {결정에} 찬성합니다.' }
    ]
  },
  {
    id: '170', word: 'agenda',
    definitions: ['(명) 의제, 일정', '(명) 할 일 목록'],
    etymo: 'agendum',
    examples: [
      { text: 'The meeting [agenda] has been set.', korean: '회의 {의제가} 정해졌습니다.' },
      { text: 'What\'s on your [agenda] today?', korean: '오늘 당신의 {할 일은} 무엇입니까?' }
    ]
  },
  {
    id: '171', word: 'boost',
    definitions: ['(동) 증가시키다, 증대하다', '(명) 증가, 증대'],
    etymo: 'boste',
    examples: [
      { text: 'This will [boost] sales by 20%.', korean: '이것은 판매를 {20% 증가시킬} 것입니다.' },
      { text: 'The [boost] in production was significant.', korean: '{생산 증대가} 의미 있었습니다.' }
    ]
  },
  {
    id: '172', word: 'access',
    definitions: ['(명) 접근, 이용 권한', '(동) 접근하다, 이용하다'],
    etymo: 'accedere',
    examples: [
      { text: 'You have [access] to the building.', korean: '당신은 {건물에} 접근할 {권한이} 있습니다.' },
      { text: '[Access] the file from your computer.', korean: '당신의 {컴퓨터에서} 그 파일을 {이용하세요}.' }
    ]
  },
  {
    id: '173', word: 'facility',
    definitions: ['(명) 시설', '(명) 쉬움, 유창함'],
    etymo: 'facilitas',
    examples: [
      { text: 'The gym has modern [facility].', korean: '그 체육관은 {현대적인 시설을} 가집니다.' },
      { text: 'He speaks English with [facility].', korean: '그는 {유창하게} 영어를 말합니다.' }
    ]
  },
  {
    id: '174', word: 'diagnosis',
    definitions: ['(명) 진단', '(명) 문제 분석, 식별'],
    etymo: 'dia + gnosis',
    examples: [
      { text: 'The doctor made a [diagnosis].', korean: '의사가 {진단을} 내렸습니다.' },
      { text: '[Diagnosis] of the problem is crucial.', korean: '{문제의 분석이} 중요합니다.' }
    ]
  },
  {
    id: '175', word: 'ownership',
    definitions: ['(명) 소유권', '(명) 책임'],
    etymo: 'owne + ship',
    examples: [
      { text: 'The [ownership] has changed hands.', korean: '{소유권이} 바뀌었습니다.' },
      { text: 'Take [ownership] of your mistakes.', korean: '당신의 {실수에} 책임을 {지세요}.' }
    ]
  },
  {
    id: '176', word: 'recession',
    definitions: ['(명) 불경기, 경기 침체'],
    etymo: 'recessio',
    examples: [
      { text: 'The country entered a [recession].', korean: '그 나라는 {불경기에} 진입했습니다.' },
      { text: 'The [recession] lasted two years.', korean: '{경기 침체가} 2년 동안 지속되었습니다.' }
    ]
  },
  {
    id: '177', word: 'status',
    definitions: ['(명) 상태', '(명) 지위'],
    etymo: 'status',
    examples: [
      { text: 'What is the [status] of your order?', korean: '당신의 {주문 상태는} 무엇입니까?' },
      { text: 'He has high [status] in the company.', korean: '그는 {회사에서 높은 지위를} 가집니다.' }
    ]
  },
  {
    id: '178', word: 'accountable',
    definitions: ['(형) 책임 있는'],
    etymo: 'countable',
    examples: [
      { text: 'Everyone is [accountable] for their actions.', korean: '모두는 {자신의 행동에} {책임이} 있습니다.' },
      { text: 'The manager is [accountable] to the director.', korean: '관리자는 {이사에게 책임이} 있습니다.' }
    ]
  },
  {
    id: '179', word: 'dependable',
    definitions: ['(형) 신뢰할 수 있는'],
    etymo: 'depend + able',
    examples: [
      { text: 'He is a [dependable] employee.', korean: '그는 {신뢰할 수 있는} 직원입니다.' },
      { text: 'A [dependable] car is important.', korean: '{신뢰할 수 있는} 자동차가 중요합니다.' }
    ]
  },
  {
    id: '180', word: 'adjustment',
    definitions: ['(명) 조정', '(명) 적응'],
    etymo: 'adjustare',
    examples: [
      { text: 'Make an [adjustment] to the temperature.', korean: '온도를 {조정하세요}.' },
      { text: 'The [adjustment] to city life was difficult.', korean: '{도시 생활에} 적응하기가 어려웠습니다.' }
    ]
  },
  {
    id: '181', word: 'prestigious',
    definitions: ['(형) 명망 있는, 존경받는'],
    etymo: 'praestigium',
    examples: [
      { text: 'He works at a [prestigious] university.', korean: '그는 {명망 있는 대학에서} 일합니다.' },
      { text: 'The award is very [prestigious].', korean: '그 상은 {매우 존경받습니다}.' }
    ]
  },
  {
    id: '182', word: 'recognition',
    definitions: ['(명) 인정, 승인', '(명) 알아보기, 인식'],
    etymo: 're + cognoscere',
    examples: [
      { text: 'She received [recognition] for her work.', korean: '그녀는 그녀의 {일에} 대한 {인정을} 받았습니다.' },
      { text: '[Recognition] of the problem is the first step.', korean: '{그 문제를} 알아보기가 {첫 단계입니다}.' }
    ]
  },
  {
    id: '183', word: 'regret',
    definitions: ['(동) 후회하다', '(동) 유감스럽게 생각하다'],
    etymo: 're + grate',
    examples: [
      { text: 'I [regret] my decision.', korean: '나는 내 {결정을} 후회합니다.' },
      { text: 'I [regret] to say this didn\'t work.', korean: '나는 {이것이 작동하지 않았다} 유감스럽게 생각합니다.' }
    ]
  },
  {
    id: '184', word: 'unemployment',
    definitions: ['(명) 실업', '(명) 실업률'],
    etymo: 'un + employment',
    examples: [
      { text: '[Unemployment] has increased this year.', korean: '{실업이} 올해 증가했습니다.' },
      { text: 'The [unemployment] rate is 5%.', korean: '{실업률은} 5%입니다.' }
    ]
  },
  {
    id: '185', word: 'documentation',
    definitions: ['(명) 문서 작성, 기록', '(명) 증거 자료, 서류'],
    etymo: 'documentare',
    examples: [
      { text: 'Complete the [documentation] for the project.', korean: '그 프로젝트에 대한 {문서를} 완성하세요.' },
      { text: 'Provide [documentation] of your credentials.', korean: '당신의 {자격 증명 서류를} 제공하세요.' }
    ]
  },
  {
    id: '186', word: 'compete',
    definitions: ['(동) 경쟁하다'],
    etymo: 'com + petere',
    examples: [
      { text: 'We will [compete] for first place.', korean: '우리는 {1등을} 위해 {경쟁할} 것입니다.' },
      { text: 'Many companies [compete] in this market.', korean: '많은 {회사들이} 이 시장에서 {경쟁합니다}.' }
    ]
  },
  {
    id: '187', word: 'range',
    definitions: ['(명) 범위', '(동) (범위가) ~에 이르다'],
    etymo: 'rangia',
    examples: [
      { text: 'The [range] of products is wide.', korean: '{제품의 범위가} 넓습니다.' },
      { text: 'Prices [range] from $10 to $100.', korean: '{가격은} $10에서 $100까지 {다양합니다}.' }
    ]
  },
  {
    id: '188', word: 'conclusion',
    definitions: ['(명) 결론', '(명) 종결'],
    etymo: 'concludere',
    examples: [
      { text: 'In [conclusion], I recommend this plan.', korean: '{결론적으로}, 나는 이 계획을 {권장합니다}.' },
      { text: 'The [conclusion] of the meeting was positive.', korean: '{회의의 종결이} 긍정적이었습니다.' }
    ]
  },
  {
    id: '189', word: 'environment',
    definitions: ['(명) 자연환경', '(명) 생활환경, 분위기'],
    etymo: 'environner',
    examples: [
      { text: 'Protect the [environment].', korean: '{자연환경을} 보호하세요.' },
      { text: 'The work [environment] is pleasant.', korean: '{직무 환경이} 쾌적합니다.' }
    ]
  },
  {
    id: '190', word: 'expose',
    definitions: ['(동) 드러내다, 폭로하다', '(동) 노출시키다'],
    etymo: 'ex + pausare',
    examples: [
      { text: 'The investigation will [expose] the truth.', korean: '{조사가} 진실을 {폭로할} 것입니다.' },
      { text: 'Don\'t [expose] yourself to the sun.', korean: '자신을 {햇빛에} 노출시키지 마세요.' }
    ]
  },
  {
    id: '191', word: 'appropriate',
    definitions: ['(형) 적절한', '(동) 도용하다, 사용하다'],
    etymo: 'appropriare',
    examples: [
      { text: 'This color is [appropriate] for the room.', korean: '이 색깔은 {그 방에} {적절합니다}.' },
      { text: 'The funds were [appropriated] for research.', korean: '{기금이} 연구에 {할당되었습니다}.' }
    ]
  },
  {
    id: '192', word: 'negotiate',
    definitions: ['(동) 협상하다', '(동) 교섭하다'],
    etymo: 'negotiare',
    examples: [
      { text: 'We will [negotiate] the contract terms.', korean: '우리는 {계약 조건을} 협상할 것입니다.' },
      { text: 'Please [negotiate] with the supplier.', korean: '{공급자와} 교섭해 주세요.' }
    ]
  },
  {
    id: '193', word: 'investment',
    definitions: ['(명) 투자', '(명) 투자금, 투자액'],
    etymo: 'investire',
    examples: [
      { text: 'Real estate is a good [investment].', korean: '부동산은 {좋은 투자입니다}.' },
      { text: 'The [investment] will be $50,000.', korean: '{투자금은} $50,000입니다.' }
    ]
  },
  {
    id: '194', word: 'productivity',
    definitions: ['(명) 생산성'],
    etymo: 'productivus',
    examples: [
      { text: '[Productivity] has increased by 30%.', korean: '{생산성이} 30% 증가했습니다.' },
      { text: 'Improve your [productivity] with these tools.', korean: '이 도구들로 {생산성을} 향상시키세요.' }
    ]
  },
  {
    id: '195', word: 'proposal',
    definitions: ['(명) 제안', '(동) 청혼하다'],
    etymo: 'proponere',
    examples: [
      { text: 'I have a [proposal] for the project.', korean: '나는 전 프로젝트에 대한 {제안이} 있습니다.' },
      { text: 'He will [propose] marriage to her.', korean: '그가 {그녀에게} 청혼할 것입니다.' }
    ]
  },
  {
    id: '196', word: 'manual',
    definitions: ['(형) 손으로 작동하는, 수동의', '(명) 주석서, 안내서'],
    etymo: 'manualis',
    examples: [
      { text: 'This is a [manual] transmission.', korean: '이것은 {수동} 변속기입니다.' },
      { text: 'Read the [manual] before use.', korean: '사용하기 전에 {안내서를} 읽으세요.' }
    ]
  },
  {
    id: '197', word: 'potential',
    definitions: ['(명) 잠재력, 가능성', '(형) 잠재적인, 가능성이 있는'],
    etymo: 'potentialis',
    examples: [
      { text: 'The employee has great [potential].', korean: '그 직원은 {큰 잠재력을} 가집니다.' },
      { text: 'There is [potential] for growth.', korean: '{성장의 가능성이} 있습니다.' }
    ]
  },
  {
    id: '198', word: 'delay',
    definitions: ['(명) 지연', '(동) 연기하다'],
    etymo: 'delayer',
    examples: [
      { text: 'There was a [delay] in the delivery.', korean: '{배달에} {지연이} 있었습니다.' },
      { text: 'We must not [delay] any further.', korean: '우리는 더 이상 {연기할} 수 없습니다.' }
    ]
  },
  {
    id: '199', word: 'obtain',
    definitions: ['(동) 얻다, 획득하다', '(동) 확보하다'],
    etymo: 'obtinere',
    examples: [
      { text: 'How can I [obtain] a visa?', korean: '나는 {비자를} 어떻게 {얻을} 수 있나요?' },
      { text: 'The company will [obtain] the permit.', korean: '회사는 {허가를} 확보할 것입니다.' }
    ]
  },
  {
    id: '200', word: 'restrict',
    definitions: ['(동) 제한하다', '(동) 통제하다'],
    etymo: 'restricitus',
    examples: [
      { text: 'The government will [restrict] imports.', korean: '정부는 {수입을} 제한할 것입니다.' },
      { text: 'Access is [restricted] to staff only.', korean: '{접근이} 직원들에게만 {통제됩니다}.' }
    ]
  }
];
export const DAY_5_WORDS: Word[] = [
  {
    id: '201',
    word: 'alternative',
    definitions: ['(명) 대안, 선택 가능한 것', '(형) 대체의, 대안적인'],
    etymo: 'alter(다른) + native(성질)',
    examples: [
      { text: 'We must find an [alternative] energy source.', korean: '우리는 {대체} 에너지원을 찾아야 합니다.' },
      { text: 'Do you have any [alternative] in mind?', korean: '염두에 두고 있는 다른 {대안이} 있습니까?' }
    ]
  },
  {
    id: '202',
    word: 'appraisal',
    definitions: ['(명) 평가', '(명) 감정'],
    etymo: 'ad(방향) + pretium(가치)',
    examples: [
      { text: 'The annual performance [appraisal] is next week.', korean: '연례 인사 {평가가} 다음 주에 있습니다.' },
      { text: 'We need an expert [appraisal] of the property.', korean: '우리는 그 부동산에 대한 전문가의 {감정이} 필요합니다.' }
    ]
  },
  {
    id: '203',
    word: 'temporarily',
    definitions: ['(부) 일시적으로', '(부) 잠시 동안'],
    etymo: 'tempor(시간) + ary(형용사) + ly(부사)',
    examples: [
      { text: 'The service is [temporarily] unavailable.', korean: '서비스가 {일시적으로} 중단되었습니다.' },
      { text: 'He will [temporarily] act as the manager.', korean: '그가 {잠시 동안} 매니저 역할을 할 것입니다.' }
    ]
  },
  {
    id: '204',
    word: 'remain',
    definitions: ['(동) 어떤 상태를 유지하다', '(동) 남아 있다'],
    etymo: 're(뒤에) + manere(머물다)',
    examples: [
      { text: 'Please [remain] seated until the bell rings.', korean: '종이 울릴 때까지 앉은 상태를 {유지해} 주십시오.' },
      { text: 'Only a few tickets [remain].', korean: '표가 몇 장밖에 {남아 있지 않습니다}.' }
    ]
  },
  {
    id: '205',
    word: 'relieve',
    definitions: ['(동) 고통이나 스트레스를 덜어주다', '(동) 업무에서 해방시키다'],
    etymo: 're(다시) + levare(가볍게 하다)',
    examples: [
      { text: 'This medicine will [relieve] your headache.', korean: '이 약이 두통을 {덜어줄} 것입니다.' },
      { text: 'The new assistant will [relieve] him of his duties.', korean: '새 조수가 그의 업무를 {해방시켜 줄} 것입니다.' }
    ]
  },
  {
    id: '206',
    word: 'beneficial',
    definitions: ['(형) 이익이 되는'],
    etymo: 'bene(좋은) + facere(만들다) + ial(형용사)',
    examples: [
      { text: 'Regular exercise is [beneficial] to your health.', korean: '규칙적인 운동은 건강에 {이익이 됩니다}.' },
      { text: 'The new policy will be [beneficial] for all employees.', korean: '새 정책은 모든 직원에게 {유익할} 것입니다.' }
    ]
  },
  {
    id: '207',
    word: 'deliver',
    definitions: ['(동) 배송하다', '(동) 연설하다'],
    etymo: 'de(강조) + liberare(자유롭게 하다)',
    examples: [
      { text: 'We [deliver] the packages within two days.', korean: '우리는 이틀 안에 소포를 {배송합니다}.' },
      { text: 'The CEO will [deliver] a speech tomorrow.', korean: '최고경영자가 내일 {연설할} 예정입니다.' }
    ]
  },
  {
    id: '208',
    word: 'expect',
    definitions: ['(동) 예상하다, 기대하다', '(동) 요구하다, 요청하다'],
    etymo: 'ex(밖으로) + spectare(보다)',
    examples: [
      { text: 'We [expect] sales to increase next quarter.', korean: '우리는 다음 분기에 매출이 증가할 것으로 {예상합니다}.' },
      { text: 'I [expect] full cooperation from the team.', korean: '팀의 전폭적인 협조를 {요구합니다}.' }
    ]
  },
  {
    id: '209',
    word: 'damage',
    definitions: ['(명) 손상, 피해', '(동) 손상시키다, 피해를 입히다'],
    etymo: 'damnum(손실, 피해)',
    examples: [
      { text: 'The storm caused severe [damage] to the roof.', korean: '폭풍이 지붕에 심각한 {피해를} 입혔습니다.' },
      { text: 'Sunlight can [damage] the artwork.', korean: '햇빛은 예술 작품을 {손상시킬} 수 있습니다.' }
    ]
  },
  {
    id: '210',
    word: 'seal',
    definitions: ['(동) 봉인하다', '(동) 보증하다'],
    etymo: 'sigillum(작은 도장)',
    examples: [
      { text: 'Please [seal] the envelope before mailing it.', korean: '우편물을 보내기 전에 봉투를 {봉인해} 주십시오.' },
      { text: 'His signature will [seal] the agreement.', korean: '그의 서명이 합의를 {보증할} 것입니다.' }
    ]
  },
  {
    id: '211',
    word: 'stagnant',
    definitions: ['(형) 정체된, 흐르지 않는'],
    etymo: 'stagnare(고이다) + ant(형용사)',
    examples: [
      { text: 'The economy has been [stagnant] for years.', korean: '경제는 수년간 {정체되어} 있었습니다.' },
      { text: 'Mosquitoes breed in [stagnant] water.', korean: '모기는 {흐르지 않는} 물에서 번식합니다.' }
    ]
  },
  {
    id: '212',
    word: 'tenure',
    definitions: ['(명) 재임 기간, 임기', '(명) 종신 재직권, 보유'],
    etymo: 'tenere(유지하다) + ure(명사)',
    examples: [
      { text: 'During his [tenure], profits doubled.', korean: '그의 {재임 기간} 동안 수익이 두 배로 늘었습니다.' },
      { text: 'The professor was granted [tenure].', korean: '그 교수는 {종신 재직권을} 부여받았습니다.' }
    ]
  },
  {
    id: '213',
    word: 'setback',
    definitions: ['(명) 방해, 좌절', '(명) 후퇴'],
    etymo: 'set(놓다) + back(뒤로)',
    examples: [
      { text: 'The delay was a major [setback] for the project.', korean: '그 지연은 프로젝트의 주요한 {방해물}이었습니다.' },
      { text: 'Despite the early [setback], they won the game.', korean: '초반의 {후퇴}에도 불구하고 그들은 경기에서 이겼습니다.' }
    ]
  },
  {
    id: '214',
    word: 'autograph',
    definitions: ['(명) 사인', '(동) 사인하다'],
    etymo: 'auto(스스로) + graph(쓰다)',
    examples: [
      { text: 'May I get your [autograph]?', korean: '당신의 {사인을} 받아도 될까요?' },
      { text: 'The author will [autograph] books after the talk.', korean: '작가는 강연 후에 책에 {사인할} 것입니다.' }
    ]
  },
  {
    id: '215',
    word: 'associated',
    definitions: ['(형) 관련된', '(동) 연관시키다, 관련 짓다'],
    etymo: 'ad(방향) + sociare(결합하다) + ed(과거분사)',
    examples: [
      { text: 'There are risks [associated] with the surgery.', korean: '수술과 {관련된} 위험이 있습니다.' },
      { text: 'People often [associate] this brand with luxury.', korean: '사람들은 종종 이 브랜드를 명품과 {관련 짓습니다}.' }
    ]
  },
  {
    id: '216',
    word: 'arrival',
    definitions: ['(명) 도착', '(명) 신생, 도래'],
    etymo: 'ad(향하여) + ripa(강기슭) + al(명사)',
    examples: [
      { text: 'We await the [arrival] of the guests.', korean: '우리는 손님들의 {도착을} 기다립니다.' },
      { text: 'The [arrival] of new technology changed everything.', korean: '신기술의 {도래는} 모든 것을 바꾸었습니다.' }
    ]
  },
  {
    id: '217',
    word: 'dimension',
    definitions: ['(명) 크기, 치수', '(명) 양상, 측면'],
    etymo: 'dis(분리) + metiri(측정하다)',
    examples: [
      { text: 'Please measure the [dimension] of the room.', korean: '방의 {치수를} 측정해 주십시오.' },
      { text: 'The issue has a political [dimension].', korean: '그 문제에는 정치적인 {측면이} 있습니다.' }
    ]
  },
  {
    id: '218',
    word: 'consistency',
    definitions: ['(명) 일관성', '(명) (액체의) 농도, 밀도'],
    etymo: 'con(함께) + sistere(서다) + ency(명사)',
    examples: [
      { text: 'The manager praised the [consistency] of her work.', korean: '매니저는 그녀 업무의 {일관성을} 칭찬했습니다.' },
      { text: 'Mix the batter until it reaches a thick [consistency].', korean: '반죽이 걸쭉한 {농도에} 이를 때까지 섞으세요.' }
    ]
  },
  {
    id: '219',
    word: 'invent',
    definitions: ['(동) 발명하다', '(동) 고안하다, 만들어내다'],
    etymo: 'in(안으로) + venire(오다)',
    examples: [
      { text: 'Thomas Edison [invented] the light bulb.', korean: '토머스 에디슨은 전구를 {발명했습니다}.' },
      { text: 'He tried to [invent] an excuse for being late.', korean: '그는 지각에 대한 변명을 {만들어내려} 노력했습니다.' }
    ]
  },
  {
    id: '220',
    word: 'generous',
    definitions: ['(형) 관대한', '(형) 풍부한, 넉넉한'],
    etymo: 'genus(혈통, 가문) + ous(형용사)',
    examples: [
      { text: 'Thank you for your [generous] donation.', korean: '당신의 {관대한} 기부에 감사드립니다.' },
      { text: 'The recipe calls for a [generous] amount of cheese.', korean: '이 레시피는 {풍부한} 양의 치즈를 필요로 합니다.' }
    ]
  },
  {
    id: '221',
    word: 'enrich',
    definitions: ['(동) 풍요롭게 하다', '(동) (영양소나 성분을) 강화하다, 높이다'],
    etymo: 'en(만들다) + rich(풍부한)',
    examples: [
      { text: 'Reading will [enrich] your mind.', korean: '독서는 당신의 마음을 {풍요롭게 할} 것입니다.' },
      { text: 'The cereal is [enriched] with vitamins.', korean: '그 시리얼은 비타민으로 {강화되어} 있습니다.' }
    ]
  },
  {
    id: '222',
    word: 'transfer',
    definitions: ['(동) 이동하다', '(동) 전근하다'],
    etymo: 'trans(가로질러) + ferre(나르다)',
    examples: [
      { text: 'Please [transfer] the files to the new folder.', korean: '파일들을 새 폴더로 {이동해} 주십시오.' },
      { text: 'She will [transfer] to the branch in Paris.', korean: '그녀는 파리 지사로 {전근할} 것입니다.' }
    ]
  },
  {
    id: '223',
    word: 'structure',
    definitions: ['(명) 구조', '(동) 구조를 설계하다'],
    etymo: 'struere(짓다, 세우다)',
    examples: [
      { text: 'The bridge has a strong steel [structure].', korean: '그 다리는 튼튼한 강철 {구조를} 가지고 있습니다.' },
      { text: 'We need to [structure] our presentation carefully.', korean: '우리는 발표 {구조를} 주의 깊게 {설계해야} 합니다.' }
    ]
  },
  {
    id: '224',
    word: 'employment',
    definitions: ['(명) 고용, 직업', '(명) 고용률'],
    etymo: 'employ(고용하다) + ment(명사)',
    examples: [
      { text: 'He is seeking full-time [employment].', korean: '그는 정규직 {직업을} 찾고 있습니다.' },
      { text: 'The [employment] rate has increased this year.', korean: '올해 {고용률이} 증가했습니다.' }
    ]
  },
  {
    id: '225',
    word: 'destination',
    definitions: ['(명) 목적지'],
    etymo: 'de(완전히) + destinare(정하다)',
    examples: [
      { text: 'Paris is a popular tourist [destination].', korean: '파리는 인기 있는 관광 {목적지입니다}.' },
      { text: 'We arrived at our [destination] after a long drive.', korean: '우리는 긴 운전 끝에 {목적지에} 도착했습니다.' }
    ]
  },
  {
    id: '226',
    word: 'complaint',
    definitions: ['(명) 불평, 불만', '(명) 고충, 문제점'],
    etymo: 'com(강조) + plangere(치다, 탄식하다)',
    examples: [
      { text: 'We received a [complaint] from a customer.', korean: '고객으로부터 {불만이} 접수되었습니다.' },
      { text: 'The union presented their [complaints] to the management.', korean: '노조는 경영진에게 그들의 {고충을} 제시했습니다.' }
    ]
  },
  {
    id: '227',
    word: 'atmosphere',
    definitions: ['(명) 분위기, 감정', '(명) 대기, 공기층'],
    etymo: 'atmos(증기) + sphaera(구, 공)',
    examples: [
      { text: 'The restaurant has a romantic [atmosphere].', korean: '그 식당은 낭만적인 {분위기를} 가지고 있습니다.' },
      { text: 'Pollution is destroying the Earth’s [atmosphere].', korean: '오염이 지구의 {대기를} 파괴하고 있습니다.' }
    ]
  },
  {
    id: '228',
    word: 'host',
    definitions: ['(명) 주최자, 주인', '(명) 호스트 컴퓨터'],
    etymo: 'hospes(손님, 주인)',
    examples: [
      { text: 'Our company will play [host] to the conference.', korean: '우리 회사가 그 회의의 {주최자} 역할을 할 것입니다.' },
      { text: 'The [host] server is currently down.', korean: '{호스트} 서버가 현재 다운되었습니다.' }
    ]
  },
  {
    id: '229',
    word: 'conduct',
    definitions: ['(동) 실행하다, 수행하다', '(동) 지휘하다'],
    etymo: 'con(함께) + ducere(이끌다)',
    examples: [
      { text: 'We will [conduct] a survey to gather feedback.', korean: '피드백을 수집하기 위해 설문조사를 {실행할} 것입니다.' },
      { text: 'He will [conduct] the orchestra tonight.', korean: '그가 오늘 밤 오케스트라를 {지휘할} 것입니다.' }
    ]
  },
  {
    id: '230',
    word: 'district',
    definitions: ['(명) 구역, 지역'],
    etymo: 'dis(따로) + stringere(묶다)',
    examples: [
      { text: 'She works in the financial [district].', korean: '그녀는 금융 {구역에서} 일합니다.' },
      { text: 'The city is divided into several school [districts].', korean: '이 도시는 여러 학군 {지역으로} 나뉘어 있습니다.' }
    ]
  },
  {
    id: '231',
    word: 'run',
    definitions: ['(동) 달리다', '(동) 운영하다'],
    etymo: 'rinnan(흐르다, 달리다)',
    examples: [
      { text: 'He can [run] very fast.', korean: '그는 매우 빨리 {달릴} 수 있습니다.' },
      { text: 'She wants to [run] her own business.', korean: '그녀는 자신의 사업을 {운영하고} 싶어 합니다.' }
    ]
  },
  {
    id: '232',
    word: 'projection',
    definitions: ['(명) 예상, 추정', '(명) 영사, 투사'],
    etymo: 'pro(앞으로) + jacere(던지다) + ion(명사)',
    examples: [
      { text: 'The financial [projection] for next year is positive.', korean: '내년의 재무 {예상은} 긍정적입니다.' },
      { text: 'The [projection] of the image on the wall was clear.', korean: '벽에 비친 이미지의 {투사는} 선명했습니다.' }
    ]
  },
  {
    id: '233',
    word: 'taste',
    definitions: ['(명) 맛, 풍미', '(동) 맛보다'],
    etymo: 'tastare(느끼다, 맛보다)',
    examples: [
      { text: 'This soup has a unique [taste].', korean: '이 수프는 독특한 {맛을} 가지고 있습니다.' },
      { text: 'Please [taste] the sauce and tell me if it needs salt.', korean: '소스를 {맛보고} 소금이 필요한지 말해주세요.' }
    ]
  },
  {
    id: '234',
    word: 'transportation',
    definitions: ['(명) 교통수단', '(명) 운송'],
    etymo: 'trans(가로질러) + portare(나르다) + tion(명사)',
    examples: [
      { text: 'Public [transportation] is very convenient here.', korean: '이곳은 대중 {교통수단이} 매우 편리합니다.' },
      { text: 'The [transportation] of goods takes three days.', korean: '물품의 {운송은} 3일이 걸립니다.' }
    ]
  },
  {
    id: '235',
    word: 'inspiration',
    definitions: ['(명) 영감, 동기부여', '(명) 신선한 아이디어나 방안'],
    etymo: 'in(안으로) + spirare(숨쉬다) + tion(명사)',
    examples: [
      { text: 'Nature is a great source of [inspiration] for artists.', korean: '자연은 예술가들에게 훌륭한 {영감의} 원천입니다.' },
      { text: 'The team needed some [inspiration] to solve the problem.', korean: '팀은 문제를 해결하기 위해 신선한 {아이디어가} 필요했습니다.' }
    ]
  },
  {
    id: '236',
    word: 'adequate',
    definitions: ['(형) 충분한, 적절한', '(형) 적합한'],
    etymo: 'ad(방향) + aequus(동등한)',
    examples: [
      { text: 'Make sure you drink an [adequate] amount of water.', korean: '{충분한} 양의 물을 마시도록 하세요.' },
      { text: 'His skills are [adequate] for the job.', korean: '그의 기술은 그 일에 {적합합니다}.' }
    ]
  },
  {
    id: '237',
    word: 'reputation',
    definitions: ['(명) 평판, 명성'],
    etymo: 're(다시) + putare(생각하다) + tion(명사)',
    examples: [
      { text: 'The company has a good [reputation] for quality.', korean: '그 회사는 품질 면에서 좋은 {평판을} 가지고 있습니다.' },
      { text: 'He ruined his [reputation] by lying.', korean: '그는 거짓말을 해서 자신의 {명성을} 망쳤습니다.' }
    ]
  },
  {
    id: '238',
    word: 'rebate',
    definitions: ['(명) 환급금', '(동) 환급하다'],
    etymo: 're(다시) + battere(치다)',
    examples: [
      { text: 'You can get a $50 [rebate] on this purchase.', korean: '이 구매에 대해 50달러의 {환급금을} 받을 수 있습니다.' },
      { text: 'The store will [rebate] a portion of the tax.', korean: '상점은 세금의 일부를 {환급할} 것입니다.' }
    ]
  },
  {
    id: '239',
    word: 'pension',
    definitions: ['(명) 연금', '(명) (유럽 등) 저렴한 호텔'],
    etymo: 'pendere(지불하다, 매달다) + sion(명사)',
    examples: [
      { text: 'He retired and now lives on his [pension].', korean: '그는 은퇴하고 이제 {연금으로} 생활합니다.' },
      { text: 'We stayed at a cozy [pension] in France.', korean: '우리는 프랑스의 아늑한 {저렴한 호텔에} 머물렀습니다.' }
    ]
  },
  {
    id: '240',
    word: 'payment',
    definitions: ['(명) 지불, 지급', '(명) 청구 금액'],
    etymo: 'pay(지불하다) + ment(명사)',
    examples: [
      { text: 'We accept [payment] by credit card.', korean: '신용카드로 {지불을} 받습니다.' },
      { text: 'The monthly [payment] is $200.', korean: '매월 {청구 금액은} 200달러입니다.' }
    ]
  },
  {
    id: '241',
    word: 'permit',
    definitions: ['(동) 허가하다, 허용하다', '(명) 허가증, 허가'],
    etymo: 'per(통과하여) + mittere(보내다)',
    examples: [
      { text: 'Smoking is not [permitted] in the building.', korean: '건물 내에서는 흡연이 {허용되지} 않습니다.' },
      { text: 'You need a parking [permit] to park here.', korean: '이곳에 주차하려면 주차 {허가증이} 필요합니다.' }
    ]
  },
  {
    id: '242',
    word: 'reservation',
    definitions: ['(명) 예약', '(명) 거리낌, 의구심'],
    etymo: 're(다시) + servare(지키다) + tion(명사)',
    examples: [
      { text: 'I made a [reservation] for a table for two.', korean: '2인용 테이블을 {예약했습니다}.' },
      { text: 'I have some [reservations] about the new plan.', korean: '나는 새 계획에 대해 약간의 {의구심이} 있습니다.' }
    ]
  },
  {
    id: '243',
    word: 'correspondence',
    definitions: ['(명) 서신 왕래', '(명) 편지, 서한'],
    etymo: 'com(함께) + respondere(대답하다) + ence(명사)',
    examples: [
      { text: 'All [correspondence] should be addressed to the manager.', korean: '모든 {서신 왕래는} 매니저에게 보내져야 합니다.' },
      { text: 'Please keep a copy of this [correspondence].', korean: '이 {서한의} 사본을 보관해 주십시오.' }
    ]
  },
  {
    id: '244',
    word: 'escort',
    definitions: ['(명) 동반자, 안내자', '(동) 동행하다, 호위하다'],
    etymo: 'ex(밖으로) + corrigere(바로잡다)',
    examples: [
      { text: 'She acted as an [escort] for the VIP guests.', korean: '그녀는 귀빈들을 위한 {안내자} 역할을 했습니다.' },
      { text: 'Security guards will [escort] you to the exit.', korean: '경비원들이 출구까지 당신을 {호위할} 것입니다.' }
    ]
  },
  {
    id: '245',
    word: 'attire',
    definitions: ['(명) 의복, 옷차림'],
    etymo: 'a(방향) + tire(장비, 복장)',
    examples: [
      { text: 'Business [attire] is required for the meeting.', korean: '회의에는 비즈니스 {옷차림이} 요구됩니다.' },
      { text: 'Guests were dressed in formal [attire].', korean: '손님들은 정장 {의복을} 입고 있었습니다.' }
    ]
  },
  {
    id: '246',
    word: 'inclement',
    definitions: ['(형) (날씨가) 궂은'],
    etymo: 'in(부정) + clemens(온화한)',
    examples: [
      { text: 'The event was canceled due to [inclement] weather.', korean: '{궂은} 날씨 때문에 행사가 취소되었습니다.' },
      { text: 'Flights are delayed because of [inclement] conditions.', korean: '{궂은} 조건 때문에 항공편이 지연되고 있습니다.' }
    ]
  },
  {
    id: '247',
    word: 'scrutinize',
    definitions: ['(동) 면밀히 검토하다'],
    etymo: 'scrutinium(조사) + ize(동사)',
    examples: [
      { text: 'The committee will [scrutinize] the documents.', korean: '위원회가 그 서류들을 {면밀히 검토할} 것입니다.' },
      { text: 'Customers tend to [scrutinize] the quality of the product.', korean: '고객들은 제품의 품질을 {면밀히 검토하는} 경향이 있습니다.' }
    ]
  },
  {
    id: '248',
    word: 'exclusively',
    definitions: ['(부) 단독으로, 오로지'],
    etymo: 'ex(밖으로) + claudere(닫다) + ly(부사)',
    examples: [
      { text: 'This discount is [exclusively] for members.', korean: '이 할인은 {오로지} 회원들을 위한 것입니다.' },
      { text: 'The brand deals [exclusively] in organic products.', korean: '그 브랜드는 {단독으로} 유기농 제품만 취급합니다.' }
    ]
  },
  {
    id: '249',
    word: 'collaborate',
    definitions: ['(동) 협력하다', '(동) 공동으로 작업하다'],
    etymo: 'com(함께) + laborare(일하다)',
    examples: [
      { text: 'The two teams will [collaborate] on the project.', korean: '두 팀이 그 프로젝트에서 {협력할} 것입니다.' },
      { text: 'Scientists often [collaborate] to find a cure.', korean: '치료법을 찾기 위해 과학자들은 종종 {공동으로 작업합니다}.' }
    ]
  },
  {
    id: '250',
    word: 'consistently',
    definitions: ['(부) 일관되게'],
    etymo: 'con(함께) + sistere(서다) + ly(부사)',
    examples: [
      { text: 'He has [consistently] achieved high sales.', korean: '그는 {일관되게} 높은 매출을 달성해 왔습니다.' },
      { text: 'The restaurant offers [consistently] excellent food.', korean: '그 식당은 {일관되게} 훌륭한 음식을 제공합니다.' }
    ]
  }
];

export const DAY_6_WORDS: Word[] = [
  {
    id: '251',
    word: 'commensurate',
    definitions: ['(형) 상응하는, 비례하는', '(형) 상당하는'],
    etymo: 'com(함께) + mensura(측정) + ate(형용사)',
    examples: [
      { text: 'Salary will be [commensurate] with experience.', korean: '급여는 경력에 {상응할} 것입니다.' },
      { text: 'The reward was [commensurate] with his effort.', korean: '보상은 그의 노력에 {비례했습니다}.' }
    ]
  },
  {
    id: '252',
    word: 'streamline',
    definitions: ['(동) 간소화하다, 효율화하다', '(형) 간소화된, 능률적인'],
    etymo: 'stream(흐름) + line(선)',
    examples: [
      { text: 'We need to [streamline] our production process.', korean: '우리는 생산 과정을 {효율화해야} 합니다.' },
      { text: 'The company adopted a [streamline] approach.', korean: '회사는 {능률적인} 방식을 채택했습니다.' }
    ]
  },
  {
    id: '253',
    word: 'freshness',
    definitions: ['(명) 신선함', '(명) 새로움'],
    etymo: 'fresh(신선한) + ness(명사)',
    examples: [
      { text: 'The [freshness] of the ingredients is important.', korean: '재료의 {신선함이} 중요합니다.' },
      { text: 'The [freshness] of her ideas impressed everyone.', korean: '그녀 아이디어의 {새로움이} 모두를 감탄하게 했습니다.' }
    ]
  },
  {
    id: '254',
    word: 'endangered',
    definitions: ['(형) 멸종 위기에 처한'],
    etymo: 'en(만들다) + danger(위험) + ed(과거분사)',
    examples: [
      { text: 'Pandas are considered an [endangered] species.', korean: '판다는 {멸종 위기에 처한} 종으로 간주됩니다.' },
      { text: 'We must protect [endangered] animals.', korean: '우리는 {멸종 위기에 처한} 동물들을 보호해야 합니다.' }
    ]
  },
  {
    id: '255',
    word: 'aware',
    definitions: ['(형) 알고 있는, 인식하고 있는', '(형) 깨닫고 있는, 눈치채고 있는'],
    etymo: 'ge(강조) + waer(조심하는)',
    examples: [
      { text: 'Are you [aware] of the new regulations?', korean: '새로운 규정을 {알고 있습니까}?' },
      { text: 'He became [aware] that someone was watching him.', korean: '그는 누군가 자신을 지켜보고 있다는 것을 {눈치챘습니다}.' }
    ]
  },
  {
    id: '256',
    word: 'convert',
    definitions: ['(동) 변환하다', '(동) 개종하다, 신념을 바꾸다'],
    etymo: 'con(함께) + vertere(돌리다)',
    examples: [
      { text: 'We can [convert] this file into a PDF.', korean: '이 파일을 PDF로 {변환할} 수 있습니다.' },
      { text: 'He decided to [convert] to Christianity.', korean: '그는 기독교로 {개종하기로} 결정했습니다.' }
    ]
  },
  {
    id: '257',
    word: 'contribute',
    definitions: ['(동) 기여하다', '(동) 기부하다'],
    etymo: 'con(함께) + tribuere(할당하다, 주다)',
    examples: [
      { text: 'Everyone should [contribute] to the discussion.', korean: '모두가 토론에 {기여해야} 합니다.' },
      { text: 'She [contributed] $100 to the charity.', korean: '그녀는 자선단체에 100달러를 {기부했습니다}.' }
    ]
  },
  {
    id: '258',
    word: 'fatigue',
    definitions: ['(명) 피로', '(동) 피곤하게 하다'],
    etymo: 'fatigare(피로하게 하다)',
    examples: [
      { text: 'Driver [fatigue] is a major cause of accidents.', korean: '운전자 {피로는} 사고의 주요 원인입니다.' },
      { text: 'The long journey will [fatigue] you.', korean: '긴 여행은 당신을 {피곤하게 할} 것입니다.' }
    ]
  },
  {
    id: '259',
    word: 'advance',
    definitions: ['(명) 진전', '(명) 선불'],
    etymo: 'ab(앞으로) + ante(전에)',
    examples: [
      { text: 'There has been a great [advance] in medicine.', korean: '의학에 큰 {진전이} 있었습니다.' },
      { text: 'You need to pay 20% in [advance].', korean: '20%를 {선불로} 지불해야 합니다.' }
    ]
  },
  {
    id: '260',
    word: 'alternative',
    definitions: ['(명) 대안', '(형) 대안의'],
    etymo: 'alter(다른) + native(성질)',
    examples: [
      { text: 'We have no [alternative] but to accept the offer.', korean: '그 제안을 수락하는 것 외에는 {대안이} 없습니다.' },
      { text: 'They proposed an [alternative] method.', korean: '그들은 {대안의} 방법을 제안했습니다.' }
    ]
  },
  {
    id: '261',
    word: 'endeavor',
    definitions: ['(명) 노력, 시도', '(동) 노력하다, 시도하다'],
    etymo: 'en(안으로) + devoir(의무)',
    examples: [
      { text: 'We wish you success in your future [endeavors].', korean: '당신의 향후 {노력들}에 성공이 있기를 빕니다.' },
      { text: 'I will [endeavor] to finish the work by Friday.', korean: '금요일까지 일을 끝내도록 {노력하겠습니다}.' }
    ]
  },
  {
    id: '262',
    word: 'confidence',
    definitions: ['(명) 자신감', '(명) 신뢰'],
    etymo: 'con(강조) + fidere(믿다) + ence(명사)',
    examples: [
      { text: 'She spoke with absolute [confidence].', korean: '그녀는 절대적인 {자신감을} 가지고 말했습니다.' },
      { text: 'The public has lost [confidence] in the government.', korean: '대중은 정부에 대한 {신뢰를} 잃었습니다.' }
    ]
  },
  {
    id: '263',
    word: 'symptom',
    definitions: ['(명) 증상, 징후'],
    etymo: 'syn(함께) + piptein(떨어지다)',
    examples: [
      { text: 'A fever is a common [symptom] of the flu.', korean: '열은 독감의 흔한 {증상입니다}.' },
      { text: 'These changes are a [symptom] of economic recovery.', korean: '이러한 변화는 경제 회복의 {징후입니다}.' }
    ]
  },
  {
    id: '264',
    word: 'yield',
    definitions: ['(동) 생산하다', '(동) 양보하다'],
    etymo: 'gieldan(지불하다, 주다)',
    examples: [
      { text: 'The farm [yields] good crops this year.', korean: '그 농장은 올해 좋은 작물을 {생산합니다}.' },
      { text: 'You must [yield] the right of way to pedestrians.', korean: '보행자에게 통행권을 {양보해야} 합니다.' }
    ]
  },
  {
    id: '265',
    word: 'nutrition',
    definitions: ['(명) 영양'],
    etymo: 'nutrire(영양분을 주다) + tion(명사)',
    examples: [
      { text: 'Good [nutrition] is essential for a growing child.', korean: '성장하는 아이에게 좋은 {영양은} 필수적입니다.' },
      { text: 'The label provides detailed [nutrition] information.', korean: '라벨은 자세한 {영양} 정보를 제공합니다.' }
    ]
  },
  {
    id: '266',
    word: 'bounce',
    definitions: ['(동) 튀어 오르다', '(동) 되돌아오다, 회복하다'],
    etymo: 'bunsen(두드리다)',
    examples: [
      { text: 'The ball [bounced] off the wall.', korean: '공이 벽에 맞고 {튀어 올랐습니다}.' },
      { text: 'The economy is expected to [bounce] back soon.', korean: '경제가 곧 {회복할} 것으로 예상됩니다.' }
    ]
  },
  {
    id: '267',
    word: 'curb',
    definitions: ['(동) 억제하다, 제한하다', '(명) 억제, 제한'],
    etymo: 'curvare(구부리다)',
    examples: [
      { text: 'The government aims to [curb] inflation.', korean: '정부는 인플레이션을 {억제하는} 것을 목표로 합니다.' },
      { text: 'We must put a [curb] on our spending.', korean: '우리는 지출에 {제한을} 두어야 합니다.' }
    ]
  },
  {
    id: '268',
    word: 'delinquent',
    definitions: ['(형) 연체된, 체납된', '(형) 불량한, 비행의'],
    etymo: 'de(완전히) + linquere(남겨두다)',
    examples: [
      { text: 'You have an outstanding [delinquent] account.', korean: '당신은 미지불된 {연체된} 계좌가 있습니다.' },
      { text: 'The program is designed for [delinquent] youths.', korean: '그 프로그램은 {비행} 청소년들을 위해 설계되었습니다.' }
    ]
  },
  {
    id: '269',
    word: 'terminate',
    definitions: ['(동) 끝내다', '(동) 해고하다'],
    etymo: 'terminus(경계, 한계) + ate(동사)',
    examples: [
      { text: 'Either party may [terminate] the contract.', korean: '어느 당사자든 계약을 {끝낼} 수 있습니다.' },
      { text: 'They decided to [terminate] him due to poor performance.', korean: '그들은 실적 부진으로 그를 {해고하기로} 결정했습니다.' }
    ]
  },
  {
    id: '270',
    word: 'plummet',
    definitions: ['(동) 급락하다', '(명) 급락'],
    etymo: 'plumbum(납)',
    examples: [
      { text: 'Stock prices [plummeted] after the news.', korean: '그 뉴스 이후 주가가 {급락했습니다}.' },
      { text: 'The company suffered a sharp [plummet] in sales.', korean: '그 회사는 매출에서 급격한 {급락을} 겪었습니다.' }
    ]
  },
  {
    id: '271',
    word: 'complication',
    definitions: ['(명) 복잡한 문제, 어려움', '(명) 합병증'],
    etymo: 'com(함께) + plicare(접다) + tion(명사)',
    examples: [
      { text: 'The weather added a new [complication] to the trip.', korean: '날씨가 여행에 새로운 {복잡한 문제를} 더했습니다.' },
      { text: 'The surgery was successful with no [complications].', korean: '{합병증} 없이 수술이 성공적이었습니다.' }
    ]
  },
  {
    id: '272',
    word: 'consensus',
    definitions: ['(명) 의견 일치', '(명) 합의'],
    etymo: 'con(함께) + sentire(느끼다)',
    examples: [
      { text: 'The board reached a [consensus] on the budget.', korean: '이사회가 예산에 대해 {의견 일치에} 도달했습니다.' },
      { text: 'There is a growing [consensus] among the members.', korean: '회원들 사이에 증가하는 {합의가} 있습니다.' }
    ]
  },
  {
    id: '273',
    word: 'surplus',
    definitions: ['(명) 잉여, 과잉', '(형) 남는, 과잉의'],
    etymo: 'super(넘어서) + plus(더하기)',
    examples: [
      { text: 'The country has a huge trade [surplus].', korean: '그 국가는 거대한 무역 {잉여를} 가지고 있습니다.' },
      { text: 'We will sell the [surplus] materials at a discount.', korean: '우리는 {남는} 자재들을 할인하여 판매할 것입니다.' }
    ]
  },
  {
    id: '274',
    word: 'remedy',
    definitions: ['(명) 치료법, 해결책', '(동) 개선하다, 해결하다'],
    etymo: 're(다시) + mederi(치료하다)',
    examples: [
      { text: 'Hot tea with honey is a good [remedy] for a cold.', korean: '꿀을 넣은 뜨거운 차는 감기에 좋은 {치료법입니다}.' },
      { text: 'We must take action to [remedy] the situation.', korean: '우리는 상황을 {해결하기} 위해 조치를 취해야 합니다.' }
    ]
  },
  {
    id: '275',
    word: 'payable',
    definitions: ['(형) 지불해야 하는', '(명) 지불해야 할 금액'],
    etymo: 'pay(지불하다) + able(가능한)',
    examples: [
      { text: 'The invoice is [payable] within 30 days.', korean: '청구서는 30일 이내에 {지불해야 합니다}.' },
      { text: 'Accounts [payable] have decreased this month.', korean: '이번 달에 {지불해야 할 금액이} 감소했습니다.' }
    ]
  },
  {
    id: '276',
    word: 'utilize',
    definitions: ['(동) 활용하다', '(동) (기회를) 활용하다'],
    etymo: 'utilis(유용한) + ize(동사)',
    examples: [
      { text: 'We must [utilize] all available resources.', korean: '우리는 가용한 모든 자원을 {활용해야} 합니다.' },
      { text: 'He [utilized] the opportunity to expand his network.', korean: '그는 인맥을 넓힐 기회를 {활용했습니다}.' }
    ]
  },
  {
    id: '277',
    word: 'superb',
    definitions: ['(형) 탁월한, 뛰어난'],
    etymo: 'superbus(우수한, 자랑스러운)',
    examples: [
      { text: 'The acting in the movie was [superb].', korean: '그 영화의 연기는 {탁월했습니다}.' },
      { text: 'The hotel offers [superb] facilities.', korean: '그 호텔은 {뛰어난} 시설을 제공합니다.' }
    ]
  },
  {
    id: '278',
    word: 'demolish',
    definitions: ['(동) 철거하다, 파괴하다', '(동) 논리적으로 반박하다, 무너뜨리다'],
    etymo: 'de(아래로) + moliri(세우다)',
    examples: [
      { text: 'They plan to [demolish] the old factory.', korean: '그들은 낡은 공장을 {철거할} 계획입니다.' },
      { text: 'The lawyer easily [demolished] the opponent’s argument.', korean: '변호사는 상대의 주장을 쉽게 {무너뜨렸습니다}.' }
    ]
  },
  {
    id: '279',
    word: 'chronic',
    definitions: ['(형) 만성적인'],
    etymo: 'khronos(시간) + ic(형용사)',
    examples: [
      { text: 'He suffers from [chronic] back pain.', korean: '그는 {만성적인} 허리 통증으로 고생합니다.' },
      { text: 'The hospital treats patients with [chronic] diseases.', korean: '이 병원은 {만성적인} 질병을 가진 환자들을 치료합니다.' }
    ]
  },
  {
    id: '280',
    word: 'periodically',
    definitions: ['(부) 정기적으로'],
    etymo: 'period(기간) + ic(형용사) + ally(부사)',
    examples: [
      { text: 'The system is updated [periodically].', korean: '그 시스템은 {정기적으로} 업데이트됩니다.' },
      { text: 'We will inspect the equipment [periodically].', korean: '우리는 장비를 {정기적으로} 점검할 것입니다.' }
    ]
  },
  {
    id: '281',
    word: 'predecessor',
    definitions: ['(명) 선임자', '(명) 이전의 것, 전신'],
    etymo: 'prae(미리) + de(떠나다) + cedere(가다)',
    examples: [
      { text: 'The new CEO completely changed his [predecessor]’s policies.', korean: '새 최고경영자는 {선임자}의 정책을 완전히 바꿨습니다.' },
      { text: 'This phone is faster than its [predecessor].', korean: '이 전화기는 그것의 {이전 모델(전신)}보다 빠릅니다.' }
    ]
  },
  {
    id: '282',
    word: 'markedly',
    definitions: ['(부) 두드러지게'],
    etymo: 'mark(표시하다) + ed(과거분사) + ly(부사)',
    examples: [
      { text: 'Sales have increased [markedly] this year.', korean: '올해 매출이 {두드러지게} 증가했습니다.' },
      { text: 'Her health improved [markedly] after the surgery.', korean: '그녀의 건강은 수술 후 {두드러지게} 호전되었습니다.' }
    ]
  },
  {
    id: '283',
    word: 'precaution',
    definitions: ['(명) 예방 조치'],
    etymo: 'prae(미리) + cavere(주의하다) + tion(명사)',
    examples: [
      { text: 'Wear a helmet as a safety [precaution].', korean: '안전 {예방 조치}로 헬멧을 착용하세요.' },
      { text: 'They took every [precaution] to avoid an accident.', korean: '그들은 사고를 피하기 위해 모든 {예방 조치를} 취했습니다.' }
    ]
  },
  {
    id: '284',
    word: 'discontinue',
    definitions: ['(동) 중단하다', '(동) 종료하다'],
    etymo: 'dis(반대) + continue(계속하다)',
    examples: [
      { text: 'We have decided to [discontinue] this product line.', korean: '우리는 이 제품 라인을 {중단하기로} 결정했습니다.' },
      { text: 'The service will be [discontinued] next month.', korean: '그 서비스는 다음 달에 {종료될} 것입니다.' }
    ]
  },
  {
    id: '285',
    word: 'exquisite',
    definitions: ['(형) 매우 아름다운, 섬세한', '(형) 정교한, 세밀한'],
    etymo: 'ex(밖으로) + quaerere(찾다)',
    examples: [
      { text: 'The necklace is an [exquisite] piece of jewelry.', korean: '그 목걸이는 {매우 아름다운} 보석입니다.' },
      { text: 'The chef prepared an [exquisite] meal.', korean: '요리사가 {정교한} 식사를 준비했습니다.' }
    ]
  },
  {
    id: '286',
    word: 'bulk',
    definitions: ['(명) 대량', '(명) 대부분'],
    etymo: 'bulke(화물, 부피)',
    examples: [
      { text: 'You can save money by buying in [bulk].', korean: '{대량으로} 구매하면 돈을 절약할 수 있습니다.' },
      { text: 'The [bulk] of the work is already done.', korean: '업무의 {대부분이} 이미 완료되었습니다.' }
    ]
  },
  {
    id: '287',
    word: 'disruption',
    definitions: ['(명) 방해, 중단, 혼란'],
    etymo: 'dis(분리) + rumpere(부수다) + tion(명사)',
    examples: [
      { text: 'The heavy snow caused severe [disruption] to traffic.', korean: '폭설이 교통에 심각한 {혼란을} 야기했습니다.' },
      { text: 'We apologize for the [disruption] in service.', korean: '서비스 {중단에} 대해 사과드립니다.' }
    ]
  },
  {
    id: '288',
    word: 'elegant',
    definitions: ['(형) 우아한, 품격 있는', '(명) 우아함, 품격'],
    etymo: 'eligere(선택하다) + ant(형용사)',
    examples: [
      { text: 'She wore an [elegant] black dress.', korean: '그녀는 {우아한} 검은색 드레스를 입었습니다.' },
      { text: 'The room was decorated in an [elegant] style.', korean: '방은 {품격 있는} 스타일로 장식되었습니다.' }
    ]
  },
  {
    id: '289',
    word: 'assorted',
    definitions: ['(형) 다양한, 여러 가지 종류의'],
    etymo: 'ad(방향) + sors(종류, 운명) + ed(과거분사)',
    examples: [
      { text: 'He bought a box of [assorted] chocolates.', korean: '그는 {다양한} 초콜릿이 든 상자를 샀습니다.' },
      { text: 'The store sells [assorted] baked goods.', korean: '그 가게는 {여러 가지 종류의} 구운 빵을 팝니다.' }
    ]
  },
  {
    id: '290',
    word: 'stage',
    definitions: ['(명) 단계', '(명) 무대'],
    etymo: 'stare(서다)',
    examples: [
      { text: 'The project is in its final [stage].', korean: '프로젝트가 최종 {단계에} 있습니다.' },
      { text: 'The actor walked onto the [stage].', korean: '배우가 {무대} 위로 걸어 올라갔습니다.' }
    ]
  },
  {
    id: '291',
    word: 'deduct',
    definitions: ['(동) 공제하다, 차감하다', '(동) 감액하다'],
    etymo: 'de(아래로) + ducere(이끌다)',
    examples: [
      { text: 'The cost will be [deducted] from your salary.', korean: '그 비용은 당신의 급여에서 {공제될} 것입니다.' },
      { text: 'You can [deduct] business expenses from your taxes.', korean: '사업 경비를 세금에서 {차감할} 수 있습니다.' }
    ]
  },
  {
    id: '292',
    word: 'counterfeit',
    definitions: ['(명) 위조품, 가짜', '(형) 위조된, 가짜의'],
    etymo: 'contra(반대) + facere(만들다)',
    examples: [
      { text: 'The police seized a batch of [counterfeit] bills.', korean: '경찰은 한 무더기의 {위조된} 지폐를 압수했습니다.' },
      { text: 'This painting is a clever [counterfeit].', korean: '이 그림은 교묘한 {위조품입니다}.' }
    ]
  },
  {
    id: '293',
    word: 'perishable',
    definitions: ['(형) 쉽게 상할 수 있는', '(명) 부패하기 쉬운 식품'],
    etymo: 'perish(소멸하다) + able(가능한)',
    examples: [
      { text: 'Milk is highly [perishable].', korean: '우유는 {쉽게 상할 수 있습니다}.' },
      { text: 'Keep all [perishables] in the refrigerator.', korean: '모든 {부패하기 쉬운 식품을} 냉장고에 보관하세요.' }
    ]
  },
  {
    id: '294',
    word: 'physician',
    definitions: ['(명) 의사', '(명) 내과 의사'],
    etymo: 'physica(자연 과학) + ian(사람)',
    examples: [
      { text: 'Consult your [physician] before starting the diet.', korean: '다이어트를 시작하기 전에 {의사}와 상담하세요.' },
      { text: 'The hospital is hiring a new [physician].', korean: '병원은 새로운 {내과 의사를} 고용하고 있습니다.' }
    ]
  },
  {
    id: '295',
    word: 'attentive',
    definitions: ['(형) 주의 깊은', '(형) 세심한, 친절한'],
    etymo: 'ad(방향) + tendere(뻗다) + ive(형용사)',
    examples: [
      { text: 'The students were very [attentive] during the lecture.', korean: '학생들은 강의 중에 매우 {주의 깊었습니다}.' },
      { text: 'The hotel staff was extremely [attentive] to our needs.', korean: '호텔 직원은 우리의 요구에 매우 {세심했습니다}.' }
    ]
  },
  {
    id: '296',
    word: 'suburb',
    definitions: ['(명) 교외, 외곽 주거지'],
    etymo: 'sub(가까이) + urbs(도시)',
    examples: [
      { text: 'They live in a quiet [suburb] of London.', korean: '그들은 런던의 조용한 {교외에} 살고 있습니다.' },
      { text: 'Housing is cheaper in the [suburbs].', korean: '{외곽 주거지에서는} 주거비가 더 저렴합니다.' }
    ]
  },
  {
    id: '297',
    word: 'significant',
    definitions: ['(형) 중요한', '(형) 상당한'],
    etymo: 'signum(표시) + facere(만들다) + ant(형용사)',
    examples: [
      { text: 'This is a [significant] discovery for science.', korean: '이것은 과학에 있어 {중요한} 발견입니다.' },
      { text: 'There was a [significant] increase in sales.', korean: '매출에 {상당한} 증가가 있었습니다.' }
    ]
  },
  {
    id: '298',
    word: 'attempt',
    definitions: ['(명) 시도, 노력', '(동) 시도하다, 노력하다'],
    etymo: 'ad(방향) + temptare(시도하다)',
    examples: [
      { text: 'He made an [attempt] to break the world record.', korean: '그는 세계 기록을 깨려는 {시도를} 했습니다.' },
      { text: 'Do not [attempt] to repair the device yourself.', korean: '장치를 직접 수리하려고 {시도하지} 마십시오.' }
    ]
  },
  {
    id: '299',
    word: 'landscape',
    definitions: ['(명) 풍경, 경치', '(명) 지역 또는 영역'],
    etymo: 'land(땅) + scape(상태, 모습)',
    examples: [
      { text: 'The beautiful mountain [landscape] took my breath away.', korean: '아름다운 산 {풍경이} 내 숨을 멎게 했습니다.' },
      { text: 'The political [landscape] has changed dramatically.', korean: '정치적 {영역이} 극적으로 변했습니다.' }
    ]
  },
  {
    id: '300',
    word: 'steadily',
    definitions: ['(부) 꾸준하게', '(부) 착실하게'],
    etymo: 'stead(장소, 위치) + ily(부사)',
    examples: [
      { text: 'The company has grown [steadily] over the years.', korean: '그 회사는 수년간 {꾸준하게} 성장해 왔습니다.' },
      { text: 'He is [steadily] improving his English skills.', korean: '그는 영어 실력을 {착실하게} 향상시키고 있습니다.' }
    ]
  }
];
// ==========================================
// DAY 7 WORDS (301 - 350)
// ==========================================
export const DAY_7_WORDS: Word[] = [
  {
    id: '301',
    word: 'notice',
    definitions: ['(명) 공지', '(명) 주목, 인지'],
    etymo: 'notus(알려진)',
    examples: [
      { text: 'Please read the [notice] on the bulletin board.', korean: '게시판의 {공지를} 읽어주십시오.' },
      { text: 'The issue escaped my [notice].', korean: '그 문제는 나의 {주목을} 벗어났습니다(인지하지 못했습니다).' }
    ]
  },
  {
    id: '302',
    word: 'applicant',
    definitions: ['(명) 지원자', '(명) 신청자'],
    etymo: 'ad(방향) + plicare(접다) + ant(사람)',
    examples: [
      { text: 'The successful [applicant] will be notified tomorrow.', korean: '합격한 {지원자에게는} 내일 통보될 것입니다.' },
      { text: 'Every [applicant] must submit a resume.', korean: '모든 {신청자는} 이력서를 제출해야 합니다.' }
    ]
  },
  {
    id: '303',
    word: 'process',
    definitions: ['(명) 절차, 과정', '(동) 처리하다'],
    etymo: 'pro(앞으로) + cedere(가다)',
    examples: [
      { text: 'The hiring [process] takes about two weeks.', korean: '채용 {과정은} 약 2주가 걸립니다.' },
      { text: 'We will [process] your request immediately.', korean: '당신의 요청을 즉시 {처리할} 것입니다.' }
    ]
  },
  {
    id: '304',
    word: 'foundation',
    definitions: ['(명) 기초, 토대', '(명) 재단, 기금'],
    etymo: 'fundus(바닥) + tion(명사)',
    examples: [
      { text: 'Trust is the [foundation] of a good relationship.', korean: '신뢰는 좋은 관계의 {토대입니다}.' },
      { text: 'The charitable [foundation] donated millions.', korean: '그 자선 {재단은} 수백만 달러를 기부했습니다.' }
    ]
  },
  {
    id: '305',
    word: 'celebrity',
    definitions: ['(명) 유명인사', '(명) 유명세, 명성'],
    etymo: 'celeber(유명한) + ity(명사)',
    examples: [
      { text: 'A famous [celebrity] attended the opening ceremony.', korean: '유명한 {유명인사가} 개막식에 참석했습니다.' },
      { text: 'He achieved instant [celebrity] after the broadcast.', korean: '그는 방송 후 즉각적인 {명성을} 얻었습니다.' }
    ]
  },
  {
    id: '306',
    word: 'accountant',
    definitions: ['(명) 회계사'],
    etymo: 'ad(방향) + computare(계산하다) + ant(사람)',
    examples: [
      { text: 'Our [accountant] is reviewing the tax report.', korean: '우리의 {회계사가} 세금 보고서를 검토하고 있습니다.' },
      { text: 'She hired an expert [accountant] for her business.', korean: '그녀는 사업을 위해 전문 {회계사를} 고용했습니다.' }
    ]
  },
  {
    id: '307',
    word: 'donate',
    definitions: ['(동) 기부하다', '(동) 기증하다'],
    etymo: 'donare(주다)',
    examples: [
      { text: 'Many people [donate] money to the charity.', korean: '많은 사람들이 자선단체에 돈을 {기부합니다}.' },
      { text: 'He decided to [donate] his old books to the library.', korean: '그는 낡은 책들을 도서관에 {기증하기로} 결정했습니다.' }
    ]
  },
  {
    id: '308',
    word: 'inconvenience',
    definitions: ['(명) 불편', '(동) 불편을 끼치다'],
    etymo: 'in(부정) + convenire(어울리다) + ence(명사)',
    examples: [
      { text: 'We apologize for the [inconvenience].', korean: '{불편을} 드려 죄송합니다.' },
      { text: 'I hope this delay does not [inconvenience] you.', korean: '이 지연이 당신에게 {불편을 끼치지} 않기를 바랍니다.' }
    ]
  },
  {
    id: '309',
    word: 'notify',
    definitions: ['(동) 알리다, 통지하다'],
    etymo: 'notus(알려진) + facere(만들다)',
    examples: [
      { text: 'Please [notify] us of any changes to your address.', korean: '주소에 변경 사항이 있으면 우리에게 {알려주십시오}.' },
      { text: 'The bank will [notify] you when the transfer is complete.', korean: '송금이 완료되면 은행에서 당신에게 {통지할} 것입니다.' }
    ]
  },
  {
    id: '310',
    word: 'unusually',
    definitions: ['(부) 일반적이지 않게, 평소보다 더'],
    etymo: 'un(부정) + usual(평소의) + ly(부사)',
    examples: [
      { text: 'The weather is [unusually] warm for this time of year.', korean: '연중 이맘때치고 날씨가 {평소보다 더} 따뜻합니다.' },
      { text: 'He was [unusually] quiet during the meeting.', korean: '그는 회의 중에 {일반적이지 않게} 조용했습니다.' }
    ]
  },
  {
    id: '311',
    word: 'improve',
    definitions: ['(동) 개선하다, 향상시키다', '(동) 나아지다, 좋아지다'],
    etymo: 'in(안으로) + prou(이익)',
    examples: [
      { text: 'We are trying to [improve] our customer service.', korean: '우리는 고객 서비스를 {개선하려고} 노력 중입니다.' },
      { text: 'His health condition continues to [improve].', korean: '그의 건강 상태가 계속해서 {좋아지고} 있습니다.' }
    ]
  },
  {
    id: '312',
    word: 'repair',
    definitions: ['(동) 수리하다', '(명) 수리'],
    etymo: 're(다시) + parare(준비하다)',
    examples: [
      { text: 'The mechanic will [repair] the engine tomorrow.', korean: '정비사가 내일 엔진을 {수리할} 것입니다.' },
      { text: 'The bridge is currently under [repair].', korean: '그 다리는 현재 {수리} 중입니다.' }
    ]
  },
  {
    id: '313',
    word: 'warranty',
    definitions: ['(명) 품질보증서', '(명) 보증 기간'],
    etymo: 'warant(보증하다) + y(명사)',
    examples: [
      { text: 'The laptop comes with a one-year [warranty].', korean: '그 노트북은 1년짜리 {품질보증서가} 딸려 옵니다.' },
      { text: 'The repair is free because it is still under [warranty].', korean: '아직 {보증 기간} 내에 있어서 수리는 무료입니다.' }
    ]
  },
  {
    id: '314',
    word: 'replace',
    definitions: ['(동) 대체하다', '(동) 교체하다'],
    etymo: 're(다시) + place(놓다)',
    examples: [
      { text: 'Nothing can [replace] the human touch.', korean: '아무것도 인간의 손길을 {대체할} 수 없습니다.' },
      { text: 'We need to [replace] the batteries in the remote.', korean: '리모컨의 배터리를 {교체해야} 합니다.' }
    ]
  },
  {
    id: '315',
    word: 'production',
    definitions: ['(명) 생산, 제작', '(명) 생산량'],
    etymo: 'pro(앞으로) + ducere(이끌다) + tion(명사)',
    examples: [
      { text: 'The factory increased its car [production].', korean: '그 공장은 자동차 {생산을} 늘렸습니다.' },
      { text: 'Total [production] fell by 10% this quarter.', korean: '이번 분기에 총 {생산량이} 10% 감소했습니다.' }
    ]
  },
  {
    id: '316',
    word: 'subscription',
    definitions: ['(명) 구독, 가입', '(명) 정기결제'],
    etymo: 'sub(아래에) + scribere(쓰다) + tion(명사)',
    examples: [
      { text: 'I canceled my magazine [subscription].', korean: '나는 잡지 {구독을} 취소했습니다.' },
      { text: 'The software requires a monthly [subscription].', korean: '그 소프트웨어는 월별 {정기결제가} 필요합니다.' }
    ]
  },
  {
    id: '317',
    word: 'rush',
    definitions: ['(명) 급함, 서두름', '(동) 서두르다, 급히 가다'],
    etymo: 'russchen(돌진하다)',
    examples: [
      { text: 'There is no [rush] to finish the project.', korean: '프로젝트를 끝내는 데 {서두를} 필요가 없습니다.' },
      { text: 'Don\'t [rush] me; I need more time.', korean: '나를 {서두르게 하지} 마세요. 시간이 더 필요합니다.' }
    ]
  },
  {
    id: '318',
    word: 'community',
    definitions: ['(명) 공동체, 지역 사회'],
    etymo: 'communis(공통의) + ity(명사)',
    examples: [
      { text: 'The local [community] strongly supports the new school.', korean: '지역 {사회는} 새 학교를 강력히 지지합니다.' },
      { text: 'We strive to build a strong online [community].', korean: '우리는 강력한 온라인 {공동체를} 구축하기 위해 노력합니다.' }
    ]
  },
  {
    id: '319',
    word: 'operate',
    definitions: ['(동) 기계를 작동시키다', '(동) 사업을 운영하다'],
    etymo: 'operari(일하다)',
    examples: [
      { text: 'Do you know how to [operate] this machine?', korean: '이 기계를 {작동시키는} 방법을 아십니까?' },
      { text: 'They [operate] a successful restaurant chain.', korean: '그들은 성공적인 식당 체인을 {운영합니다}.' }
    ]
  },
  {
    id: '320',
    word: 'fit',
    definitions: ['(형) 적합한, 알맞은', '(동) 꼭 맞다'],
    etymo: 'fitten(정렬하다)',
    examples: [
      { text: 'He is [fit] for the leadership role.', korean: '그는 리더 역할에 {적합합니다}.' },
      { text: 'These shoes do not [fit] me properly.', korean: '이 신발은 나에게 제대로 {맞지} 않습니다.' }
    ]
  },
  {
    id: '321',
    word: 'acquire',
    definitions: ['(동) 얻다, 획득하다', '(동) 습득하다'],
    etymo: 'ad(방향) + quaerere(찾다)',
    examples: [
      { text: 'The company plans to [acquire] a smaller firm.', korean: '그 회사는 더 작은 회사를 {인수(획득)할} 계획입니다.' },
      { text: 'It takes time to [acquire] a new language.', korean: '새로운 언어를 {습득하는} 데는 시간이 걸립니다.' }
    ]
  },
  {
    id: '322',
    word: 'confirm',
    definitions: ['(동) 확인하다, 확증하다', '(동) 승인하다, 허가하다'],
    etymo: 'con(함께) + firmare(굳게 하다)',
    examples: [
      { text: 'Please [confirm] your reservation by email.', korean: '이메일로 예약을 {확인해} 주십시오.' },
      { text: 'The board will [confirm] the appointment tomorrow.', korean: '이사회가 내일 임명을 {승인할} 것입니다.' }
    ]
  },
  {
    id: '323',
    word: 'attention',
    definitions: ['(명) 주의, 집중'],
    etymo: 'ad(방향) + tendere(뻗다) + tion(명사)',
    examples: [
      { text: 'The teacher called for the students\' [attention].', korean: '선생님은 학생들의 {주의를} 요청했습니다.' },
      { text: 'You must pay close [attention] to the details.', korean: '세부 사항에 깊은 {집중을} 기울여야 합니다.' }
    ]
  },
  {
    id: '324',
    word: 'concern',
    definitions: ['(명) 우려, 걱정', '(동) 관련되다'],
    etymo: 'con(함께) + cernere(체로 치다, 구별하다)',
    examples: [
      { text: 'There is growing [concern] about climate change.', korean: '기후 변화에 대한 {우려가} 커지고 있습니다.' },
      { text: 'This matter does not [concern] you.', korean: '이 문제는 당신과 {관련되지} 않습니다.' }
    ]
  },
  {
    id: '325',
    word: 'interest',
    definitions: ['(명) 관심', '(명) 이자'],
    etymo: 'inter(사이에) + esse(있다)',
    examples: [
      { text: 'He showed a lot of [interest] in the project.', korean: '그는 프로젝트에 많은 {관심을} 보였습니다.' },
      { text: 'The bank offers a low rate of [interest].', korean: '그 은행은 낮은 비율의 {이자를} 제공합니다.' }
    ]
  },
  {
    id: '326',
    word: 'purchase',
    definitions: ['(명) 구매, 구입', '(동) 구매하다, 구입하다'],
    etymo: 'pur(앞으로) + chacier(쫓다)',
    examples: [
      { text: 'Please keep the receipt as proof of [purchase].', korean: '{구매} 증명으로 영수증을 보관해 주십시오.' },
      { text: 'We plan to [purchase] new office furniture.', korean: '우리는 새 사무용 가구를 {구입할} 계획입니다.' }
    ]
  },
  {
    id: '327',
    word: 'defective',
    definitions: ['(형) 결함이 있는'],
    etymo: 'de(떨어져) + facere(만들다) + ive(형용사)',
    examples: [
      { text: 'The store will replace any [defective] items.', korean: '상점은 {결함이 있는} 품목을 교환해 줄 것입니다.' },
      { text: 'The machine stopped working due to a [defective] part.', korean: '{결함이 있는} 부품 때문에 기계가 작동을 멈췄습니다.' }
    ]
  },
  {
    id: '328',
    word: 'financial',
    definitions: ['(형) 재정의, 금전적인'],
    etymo: 'finis(끝, 결산) + ial(형용사)',
    examples: [
      { text: 'The company is facing [financial] difficulties.', korean: '회사가 {재정적인} 어려움에 직면해 있습니다.' },
      { text: 'He works as a [financial] advisor.', korean: '그는 {금전적인(재정)} 고문으로 일합니다.' }
    ]
  },
  {
    id: '329',
    word: 'compliance',
    definitions: ['(명) 준수, 따름', '(명) 순응, 따름'],
    etymo: 'com(함께) + plere(채우다) + ance(명사)',
    examples: [
      { text: 'The company is in full [compliance] with the new laws.', korean: '그 회사는 새 법률을 완전히 {준수하고} 있습니다.' },
      { text: 'They demanded our strict [compliance] to the rules.', korean: '그들은 규칙에 대한 우리의 엄격한 {순응을} 요구했습니다.' }
    ]
  },
  {
    id: '330',
    word: 'lead',
    definitions: ['(동) 이끌다, 인도하다', '(동) (어떤 결과로) 이어지다'],
    etymo: 'laedan(이끌다)',
    examples: [
      { text: 'She will [lead] the marketing team.', korean: '그녀가 마케팅 팀을 {이끌} 것입니다.' },
      { text: 'Poor planning can [lead] to failure.', korean: '형편없는 계획은 실패로 {이어질} 수 있습니다.' }
    ]
  },
  {
    id: '331',
    word: 'organize',
    definitions: ['(동) 정리하다', '(동) 체계를 세우다'],
    etymo: 'organum(도구) + ize(동사)',
    examples: [
      { text: 'I need time to [organize] my desk.', korean: '내 책상을 {정리할} 시간이 필요합니다.' },
      { text: 'We must [organize] a committee for the event.', korean: '우리는 행사를 위한 위원회의 {체계를 세워야(조직해야)} 합니다.' }
    ]
  },
  {
    id: '332',
    word: 'mistakenly',
    definitions: ['(부) 실수로, 잘못하여'],
    etymo: 'mis(잘못된) + take(잡다) + enly(부사)',
    examples: [
      { text: 'I [mistakenly] sent the email to the wrong person.', korean: '나는 {실수로} 잘못된 사람에게 이메일을 보냈습니다.' },
      { text: 'He [mistakenly] believed the meeting was canceled.', korean: '그는 {잘못하여} 회의가 취소되었다고 믿었습니다.' }
    ]
  },
  {
    id: '333',
    word: 'attract',
    definitions: ['(동) 끌어당기다', '(동) 유발하다, 유인하다'],
    etymo: 'ad(방향) + trahere(끌다)',
    examples: [
      { text: 'Magnets [attract] iron.', korean: '자석은 철을 {끌어당깁니다}.' },
      { text: 'The store uses sales to [attract] customers.', korean: '그 상점은 고객을 {유인하기} 위해 세일을 이용합니다.' }
    ]
  },
  {
    id: '334',
    word: 'depart',
    definitions: ['(동) 출발하다', '(동) 떠나다'],
    etymo: 'de(분리) + partire(나누다)',
    examples: [
      { text: 'The train will [depart] from platform 3.', korean: '기차는 3번 플랫폼에서 {출발할} 것입니다.' },
      { text: 'Guests are required to [depart] before noon.', korean: '손님들은 정오 이전에 {떠나야} 합니다.' }
    ]
  },
  {
    id: '335',
    word: 'donation',
    definitions: ['(명) 기부'],
    etymo: 'donare(주다) + tion(명사)',
    examples: [
      { text: 'Your generous [donation] will help many children.', korean: '당신의 관대한 {기부가} 많은 어린이들을 도울 것입니다.' },
      { text: 'The hospital relies on private [donations].', korean: '그 병원은 개인적인 {기부에} 의존합니다.' }
    ]
  },
  {
    id: '336',
    word: 'summary',
    definitions: ['(동) 정보를 제공하다, 알리다'],
    etymo: 'summa(전체, 요약) + ary(명사/형용사)',
    examples: [
      { text: 'The report provides a quick [summary] of the event.', korean: '그 보고서는 행사에 대해 빠르게 {정보를 제공합니다}.' },
      { text: 'Could you give us a [summary] of the meeting?', korean: '회의에 대해 우리에게 {알려(요약해)} 주시겠습니까?' }
    ]
  },
  {
    id: '337',
    word: 'awareness',
    definitions: ['(명) 인식, 의식', '(명) 자각, 알고 있음'],
    etymo: 'aware(알고 있는) + ness(명사)',
    examples: [
      { text: 'The campaign aims to raise public [awareness].', korean: '이 캠페인은 대중의 {인식을} 높이는 것을 목표로 합니다.' },
      { text: 'He showed a deep [awareness] of the problem.', korean: '그는 그 문제에 대해 깊은 {자각을} 보였습니다.' }
    ]
  },
  {
    id: '338',
    word: 'harvest',
    definitions: ['(명) 수확물', '(동) 수확하다'],
    etymo: 'haerfest(가을)',
    examples: [
      { text: 'We had a good corn [harvest] this year.', korean: '올해 옥수수 {수확물이} 좋았습니다.' },
      { text: 'It is time to [harvest] the apples.', korean: '사과를 {수확할} 시간입니다.' }
    ]
  },
  {
    id: '339',
    word: 'plumber',
    definitions: ['(명) 배관공'],
    etymo: 'plumbum(납) + er(사람)',
    examples: [
      { text: 'We had to call a [plumber] to fix the leak.', korean: '우리는 누수를 고치기 위해 {배관공을} 불러야 했습니다.' },
      { text: 'The [plumber] replaced the broken pipe.', korean: '{배관공이} 깨진 파이프를 교체했습니다.' }
    ]
  },
  {
    id: '340',
    word: 'review',
    definitions: ['(명) 검토, 평가', '(동) 검토하다, 재검토하다'],
    etymo: 're(다시) + videre(보다)',
    examples: [
      { text: 'The manager gave a positive [review] of my work.', korean: '매니저가 내 작업에 대해 긍정적인 {평가를} 내렸습니다.' },
      { text: 'We need to [review] the contract carefully.', korean: '우리는 계약서를 주의 깊게 {검토해야} 합니다.' }
    ]
  },
  {
    id: '341',
    word: 'consumer',
    definitions: ['(명) 소비자'],
    etymo: 'con(완전히) + sumere(취하다) + er(사람)',
    examples: [
      { text: 'The new design is very popular with the [consumer].', korean: '새 디자인은 {소비자}에게 매우 인기가 있습니다.' },
      { text: 'We must protect [consumer] rights.', korean: '우리는 {소비자} 권리를 보호해야 합니다.' }
    ]
  },
  {
    id: '342',
    word: 'describe',
    definitions: ['(동) 묘사하다, 설명하다', '(동) 나타내다, 정의하다'],
    etymo: 'de(아래로) + scribere(쓰다)',
    examples: [
      { text: 'Can you [describe] the man you saw?', korean: '당신이 본 남자를 {묘사할} 수 있습니까?' },
      { text: 'The document [describes] our new strategy.', korean: '그 문서는 우리의 새로운 전략을 {설명합니다}.' }
    ]
  },
  {
    id: '343',
    word: 'provide',
    definitions: ['(동) 제공하다', '(동) 준비하다, 마련하다'],
    etymo: 'pro(앞으로) + videre(보다)',
    examples: [
      { text: 'The hotel will [provide] clean towels every day.', korean: '호텔은 매일 깨끗한 수건을 {제공할} 것입니다.' },
      { text: 'We must [provide] for our future needs.', korean: '우리는 미래의 필요를 {준비해야} 합니다.' }
    ]
  },
  {
    id: '344',
    word: 'convenience',
    definitions: ['(명) 편리함, 편리한 것', '(명) 편의 시설'],
    etymo: 'con(함께) + venire(오다) + ence(명사)',
    examples: [
      { text: 'Please reply at your earliest [convenience].', korean: '가장 빠른 {편리한} 시간에 답장해 주십시오.' },
      { text: 'The apartment complex offers many [conveniences].', korean: '그 아파트 단지는 많은 {편의 시설을} 제공합니다.' }
    ]
  },
  {
    id: '345',
    word: 'aim',
    definitions: ['(명) 목표', '(동) 겨냥하다'],
    etymo: 'aestumare(평가하다, 의도하다)',
    examples: [
      { text: 'Our main [aim] is to increase sales.', korean: '우리의 주요 {목표는} 매출을 늘리는 것입니다.' },
      { text: 'Do not [aim] the camera directly at the sun.', korean: '카메라를 태양으로 직접 {겨냥하지} 마십시오.' }
    ]
  },
  {
    id: '346',
    word: 'prospective',
    definitions: ['(형) 장래의, 예비의', '(형) 가망 있는, 가능성이 높은'],
    etymo: 'pro(앞으로) + specere(보다) + ive(형용사)',
    examples: [
      { text: 'We had a meeting with [prospective] clients.', korean: '우리는 {예비의} 고객들과 회의를 했습니다.' },
      { text: 'The seminar is designed for [prospective] buyers.', korean: '그 세미나는 {가망 있는} 구매자들을 위해 설계되었습니다.' }
    ]
  },
  {
    id: '347',
    word: 'exceptional',
    definitions: ['(형) 뛰어난, 특출한', '(형) 예외적인, 이례적인'],
    etymo: 'ex(밖으로) + capere(잡다) + al(형용사)',
    examples: [
      { text: 'She showed [exceptional] talent in music.', korean: '그녀는 음악에서 {특출한} 재능을 보였습니다.' },
      { text: 'We will grant access only in [exceptional] cases.', korean: '우리는 오직 {이례적인} 경우에만 접근을 허용할 것입니다.' }
    ]
  },
  {
    id: '348',
    word: 'result',
    definitions: ['(명) 결과', '(동) 결과로서 발생하다'],
    etymo: 're(뒤로) + salire(뛰다)',
    examples: [
      { text: 'The positive [result] exceeded our expectations.', korean: '긍정적인 {결과가} 우리의 예상을 뛰어넘었습니다.' },
      { text: 'Heavy rain will [result] in flooding.', korean: '폭우는 홍수의 {결과로서 발생할} 것입니다.' }
    ]
  },
  {
    id: '349',
    word: 'advantage',
    definitions: ['(명) 장점, 유리한 점', '(동) 유리하게 하다'],
    etymo: 'abante(앞서서) + age(명사)',
    examples: [
      { text: 'Her experience gives her a huge [advantage].', korean: '그녀의 경험은 그녀에게 큰 {유리한 점을} 줍니다.' },
      { text: 'The new schedule will [advantage] all staff.', korean: '새로운 일정은 모든 직원들을 {유리하게 할} 것입니다.' }
    ]
  },
  {
    id: '350',
    word: 'satisfaction',
    definitions: ['(명) 만족감', '(명) 보상, 보답'],
    etymo: 'satis(충분한) + facere(만들다) + tion(명사)',
    examples: [
      { text: 'Customer [satisfaction] is guaranteed.', korean: '고객 {만족감이} 보장됩니다.' },
      { text: 'He demanded [satisfaction] for the insult.', korean: '그는 모욕에 대한 {보상을} 요구했습니다.' }
    ]
  }
];

// ==========================================
// DAY 8 WORDS (351 - 400)
// ==========================================
export const DAY_8_WORDS: Word[] = [
  {
    id: '351',
    word: 'dedicated',
    definitions: ['(형) 헌신적인, 전념하는', '(형) 특정 목적을 위한'],
    etymo: 'de(완전히) + dicare(선언하다) + ed(형용사)',
    examples: [
      { text: 'She is a [dedicated] professional.', korean: '그녀는 {헌신적인} 전문가입니다.' },
      { text: 'We have a [dedicated] server for this database.', korean: '우리는 이 데이터베이스를 위한 {특정 목적의} 서버가 있습니다.' }
    ]
  },
  {
    id: '352',
    word: 'emphasis',
    definitions: ['(명) 강조', '(명) 중점'],
    etymo: 'en(안으로) + phainein(보여주다)',
    examples: [
      { text: 'The school places great [emphasis] on sports.', korean: '그 학교는 스포츠에 큰 {강조(비중)를} 둡니다.' },
      { text: 'The [emphasis] of the report is on safety.', korean: '보고서의 {중점은} 안전에 있습니다.' }
    ]
  },
  {
    id: '353',
    word: 'labor',
    definitions: ['(명) 노동, 일', '(동) 노동하다, 힘쓰다'],
    etymo: 'labor(노동, 고통)',
    examples: [
      { text: 'Manual [labor] can be physically exhausting.', korean: '육체 {노동은} 신체적으로 지치게 할 수 있습니다.' },
      { text: 'They [labored] all night to finish the project.', korean: '그들은 프로젝트를 끝내기 위해 밤새 {노동했습니다}.' }
    ]
  },
  {
    id: '354',
    word: 'foster',
    definitions: ['(동) 발전시키다, 육성하다', '(동) 양육하다, 돌보다'],
    etymo: 'fostrian(먹이다, 기르다)',
    examples: [
      { text: 'We must [foster] a culture of innovation.', korean: '우리는 혁신의 문화를 {육성해야} 합니다.' },
      { text: 'They decided to [foster] an orphaned child.', korean: '그들은 고아가 된 아이를 {양육하기로} 결정했습니다.' }
    ]
  },
  {
    id: '355',
    word: 'demand',
    definitions: ['(명) 수요', '(동) 요구하다'],
    etymo: 'de(완전히) + mandare(명령하다)',
    examples: [
      { text: 'There is a high [demand] for organic food.', korean: '유기농 식품에 대한 높은 {수요가} 있습니다.' },
      { text: 'The workers [demand] better pay.', korean: '노동자들은 더 나은 급여를 {요구합니다}.' }
    ]
  },
  {
    id: '356',
    word: 'selection',
    definitions: ['(명) 선택된 것, 선발된 사람', '(명) 선택 과정, 선발 과정'],
    etymo: 'se(분리) + legere(고르다) + tion(명사)',
    examples: [
      { text: 'The store offers a wide [selection] of wines.', korean: '그 상점은 폭넓게 {선택된} 와인들을 제공합니다.' },
      { text: 'The final [selection] will be announced tomorrow.', korean: '최종 {선발 과정(결과)이} 내일 발표될 것입니다.' }
    ]
  },
  {
    id: '357',
    word: 'conscious',
    definitions: ['(형) 의식하는, 자각하는', '(형) 의식이 있는'],
    etymo: 'con(함께) + scire(알다) + ous(형용사)',
    examples: [
      { text: 'I am fully [conscious] of the risks involved.', korean: '나는 관련된 위험들을 완전히 {자각하고} 있습니다.' },
      { text: 'The patient was [conscious] during the surgery.', korean: '환자는 수술 중에 {의식이 있었습니다}.' }
    ]
  },
  {
    id: '358',
    word: 'efficiently',
    definitions: ['(부) 효율적으로', '(부) 효과적으로'],
    etymo: 'ex(밖으로) + facere(만들다) + ly(부사)',
    examples: [
      { text: 'The new system operates very [efficiently].', korean: '새 시스템은 매우 {효율적으로} 작동합니다.' },
      { text: 'We need to manage our resources [efficiently].', korean: '우리는 자원을 {효과적으로} 관리해야 합니다.' }
    ]
  },
  {
    id: '359',
    word: 'comparable',
    definitions: ['(형) 비교할 만한', '(형) 유사한'],
    etymo: 'com(함께) + parare(동등하게 하다) + able(가능한)',
    examples: [
      { text: 'Their prices are [comparable] to our competitors.', korean: '그들의 가격은 우리 경쟁사들과 {비교할 만합니다}.' },
      { text: 'We offer a product of [comparable] quality.', korean: '우리는 {유사한} 품질의 제품을 제공합니다.' }
    ]
  },
  {
    id: '360',
    word: 'corrosion',
    definitions: ['(명) 부식', '(명) (비유적) 점차적인 손상'],
    etymo: 'com(강조) + rodere(갉아먹다) + ion(명사)',
    examples: [
      { text: 'The coating protects the metal from [corrosion].', korean: '코팅이 금속을 {부식}으로부터 보호합니다.' },
      { text: 'The scandal led to the [corrosion] of public trust.', korean: '그 스캔들은 대중의 신뢰에 {점차적인 손상을} 초래했습니다.' }
    ]
  },
  {
    id: '361',
    word: 'personal',
    definitions: ['(형) 개인적인', '(형) 사적인'],
    etymo: 'persona(사람, 역할) + al(형용사)',
    examples: [
      { text: 'This is my [personal] opinion on the matter.', korean: '이것은 그 문제에 대한 나의 {개인적인} 의견입니다.' },
      { text: 'Please do not ask about his [personal] life.', korean: '그의 {사적인} 생활에 대해 묻지 마세요.' }
    ]
  },
  {
    id: '362',
    word: 'popular',
    definitions: ['(형) 인기 있는', '(형) 대중의'],
    etymo: 'populus(사람들) + ar(형용사)',
    examples: [
      { text: 'The restaurant is very [popular] among teenagers.', korean: '그 식당은 십대들 사이에서 매우 {인기 있습니다}.' },
      { text: 'The law has strong [popular] support.', korean: '그 법은 강력한 {대중의} 지지를 받고 있습니다.' }
    ]
  },
  {
    id: '363',
    word: 'influence',
    definitions: ['(명) 영향', '(동) 영향을 미치다'],
    etymo: 'in(안으로) + fluere(흐르다) + ence(명사)',
    examples: [
      { text: 'He has a strong [influence] on his younger brother.', korean: '그는 남동생에게 강한 {영향을} 줍니다.' },
      { text: 'Weather can [influence] people’s moods.', korean: '날씨는 사람들의 기분에 {영향을 미칠} 수 있습니다.' }
    ]
  },
  {
    id: '364',
    word: 'dramatic',
    definitions: ['(형) 극적인, 급격한', '(형) 인상적인, 감정을 자극하는'],
    etymo: 'drama(연극) + tic(형용사)',
    examples: [
      { text: 'There was a [dramatic] increase in sales.', korean: '매출에 {급격한} 증가가 있었습니다.' },
      { text: 'The movie had a [dramatic] conclusion.', korean: '그 영화는 {인상적인} 결말을 가졌습니다.' }
    ]
  },
  {
    id: '365',
    word: 'aid',
    definitions: ['(명) 도움, 지원', '(동) 돕다, 지원하다'],
    etymo: 'adiuvare(돕다)',
    examples: [
      { text: 'We sent financial [aid] to the earthquake victims.', korean: '우리는 지진 피해자들에게 재정적 {지원을} 보냈습니다.' },
      { text: 'The new map will [aid] you in finding the location.', korean: '새 지도가 위치를 찾는 데 당신을 {도울} 것입니다.' }
    ]
  },
  {
    id: '366',
    word: 'fascinating',
    definitions: ['(형) 매혹적인'],
    etymo: 'fascinare(마법을 걸다) + ing(형용사)',
    examples: [
      { text: 'It is a [fascinating] story about space exploration.', korean: '그것은 우주 탐사에 대한 {매혹적인} 이야기입니다.' },
      { text: 'I found the museum exhibition absolutely [fascinating].', korean: '나는 박물관 전시가 절대적으로 {매혹적이라고} 느꼈습니다.' }
    ]
  },
  {
    id: '367',
    word: 'concentrate',
    definitions: ['(동) 집중하다', '(동) (사람이나 물자를) 모으다'],
    etymo: 'con(함께) + centrum(중심) + ate(동사)',
    examples: [
      { text: 'It is hard to [concentrate] with all this noise.', korean: '이 소음 속에서 {집중하기} 어렵습니다.' },
      { text: 'The general decided to [concentrate] his troops.', korean: '장군은 자신의 군대를 {모으기로} 결정했습니다.' }
    ]
  },
  {
    id: '368',
    word: 'lecture',
    definitions: ['(명) 강의, 강연', '(동) 강의하다, 연설하다'],
    etymo: 'legere(읽다) + ure(명사)',
    examples: [
      { text: 'The professor gave a fascinating [lecture] on art.', korean: '교수님은 예술에 대해 매혹적인 {강의를} 하셨습니다.' },
      { text: 'He will [lecture] to the students tomorrow.', korean: '그가 내일 학생들에게 {연설할} 것입니다.' }
    ]
  },
  {
    id: '369',
    word: 'ideal',
    definitions: ['(형) 이상적인', '(형) 최적의'],
    etymo: 'idea(형태, 생각) + al(형용사)',
    examples: [
      { text: 'In an [ideal] world, there would be no war.', korean: '{이상적인} 세상이라면 전쟁이 없을 것입니다.' },
      { text: 'This tool is [ideal] for cutting wood.', korean: '이 도구는 나무를 자르는 데 {최적입니다}.' }
    ]
  },
  {
    id: '370',
    word: 'worth',
    definitions: ['(형) ~의 가치가 있는', '(명) 가치'],
    etymo: 'weorth(가치 있는)',
    examples: [
      { text: 'This old coin is [worth] a lot of money.', korean: '이 오래된 동전은 많은 돈의 {가치가 있습니다}.' },
      { text: 'He proved his [worth] to the team.', korean: '그는 팀에 자신의 {가치를} 증명했습니다.' }
    ]
  },
  {
    id: '371',
    word: 'value',
    definitions: ['(명) 가치, 중요성', '(동) 평가하다, 존중하다'],
    etymo: 'valere(강하다, 가치 있다)',
    examples: [
      { text: 'Education has a great [value] in society.', korean: '교육은 사회에서 큰 {중요성을} 가집니다.' },
      { text: 'I truly [value] your friendship.', korean: '나는 당신의 우정을 진심으로 {존중합니다}.' }
    ]
  },
  {
    id: '372',
    word: 'introduce',
    definitions: ['(동) 도입하다', '(동) 소개하다'],
    etymo: 'intro(안으로) + ducere(이끌다)',
    examples: [
      { text: 'The company will [introduce] a new software system.', korean: '회사는 새로운 소프트웨어 시스템을 {도입할} 것입니다.' },
      { text: 'Let me [introduce] my new colleague.', korean: '제 새로운 동료를 {소개하게} 해주세요.' }
    ]
  },
  {
    id: '373',
    word: 'attend',
    definitions: ['(동) 참석하다', '(동) 돌보다'],
    etymo: 'ad(방향) + tendere(뻗다)',
    examples: [
      { text: 'Over fifty people will [attend] the meeting.', korean: '50명 이상의 사람들이 회의에 {참석할} 것입니다.' },
      { text: 'The nurse will [attend] to the patient.', korean: '간호사가 환자를 {돌볼} 것입니다.' }
    ]
  },
  {
    id: '374',
    word: 'method',
    definitions: ['(명) 방법, 방식', '(명) 체계, 체계성'],
    etymo: 'meta(따라서) + hodos(길)',
    examples: [
      { text: 'We need to find a new [method] to solve this.', korean: '우리는 이것을 해결할 새로운 {방법을} 찾아야 합니다.' },
      { text: 'There is a [method] to his apparent madness.', korean: '그의 겉보기 광기에도 {체계가} 있습니다.' }
    ]
  },
  {
    id: '375',
    word: 'permanent',
    definitions: ['(형) 영구적인, 지속적인', '(형) 계속되는, 변하지 않는'],
    etymo: 'per(통과하여) + manere(머물다) + ent(형용사)',
    examples: [
      { text: 'They are looking for a [permanent] solution.', korean: '그들은 {영구적인} 해결책을 찾고 있습니다.' },
      { text: 'The accident left him with a [permanent] scar.', korean: '그 사고는 그에게 {변하지 않는} 흉터를 남겼습니다.' }
    ]
  },
  {
    id: '376',
    word: 'recovery',
    definitions: ['(명) 회복', '(명) 복구'],
    etymo: 're(다시) + capere(잡다) + y(명사)',
    examples: [
      { text: 'We wish you a speedy [recovery] from your illness.', korean: '당신의 병으로부터 빠른 {회복을} 빕니다.' },
      { text: 'The data [recovery] process was successful.', korean: '데이터 {복구} 과정이 성공적이었습니다.' }
    ]
  },
  {
    id: '377',
    word: 'object',
    definitions: ['(명) 물건, 사물', '(명) 목적, 목표'],
    etymo: 'ob(앞에) + jacere(던지다)',
    examples: [
      { text: 'I saw a strange [object] in the sky.', korean: '나는 하늘에서 이상한 {물건을} 보았습니다.' },
      { text: 'The main [object] of the game is to score points.', korean: '그 게임의 주요 {목적은} 점수를 내는 것입니다.' }
    ]
  },
  {
    id: '378',
    word: 'attain',
    definitions: ['(동) (목표, 수준 등에) 도달하다', '(동) (나이나 기간을) 맞이하다'],
    etymo: 'ad(방향) + tangere(만지다)',
    examples: [
      { text: 'She worked hard to [attain] her goals.', korean: '그녀는 목표에 {도달하기} 위해 열심히 일했습니다.' },
      { text: 'The tree can [attain] a height of 50 meters.', korean: '그 나무는 50미터 높이를 {맞이할(도달할)} 수 있습니다.' }
    ]
  },
  {
    id: '379',
    word: 'convene',
    definitions: ['(동) 소집하다', '(동) 모이다'],
    etymo: 'con(함께) + venire(오다)',
    examples: [
      { text: 'The chairman will [convene] a special meeting.', korean: '의장이 특별 회의를 {소집할} 것입니다.' },
      { text: 'The committee will [convene] at 10 AM.', korean: '위원회가 오전 10시에 {모일} 것입니다.' }
    ]
  },
  {
    id: '380',
    word: 'eliminate',
    definitions: ['(동) 제거하다, 없애다', '(동) 탈락시키다'],
    etymo: 'ex(밖으로) + limen(문지방) + ate(동사)',
    examples: [
      { text: 'We must [eliminate] unnecessary expenses.', korean: '우리는 불필요한 지출을 {없애야} 합니다.' },
      { text: 'Our team was [eliminated] in the first round.', korean: '우리 팀은 첫 번째 라운드에서 {탈락했습니다}.' }
    ]
  },
  {
    id: '381',
    word: 'expertise',
    definitions: ['(명) 전문 지식, 전문 기술', '(명) 전문가 의견'],
    etymo: 'expert(전문가) + ise(명사)',
    examples: [
      { text: 'He has great [expertise] in computer programming.', korean: '그는 컴퓨터 프로그래밍에 뛰어난 {전문 지식을} 가지고 있습니다.' },
      { text: 'We need your [expertise] on this project.', korean: '우리는 이 프로젝트에 당신의 {전문 기술이} 필요합니다.' }
    ]
  },
  {
    id: '382',
    word: 'retain',
    definitions: ['(동) 유지하다, 보유하다', '(동) 기억하다'],
    etymo: 're(뒤로) + tenere(유지하다)',
    examples: [
      { text: 'The company wants to [retain] its best employees.', korean: '회사는 최고의 직원들을 {유지하기를} 원합니다.' },
      { text: 'He has the ability to [retain] a lot of information.', korean: '그는 많은 정보를 {기억하는} 능력을 가지고 있습니다.' }
    ]
  },
  {
    id: '383',
    word: 'hesitate',
    definitions: ['(동) 주저하다, 망설이다', '(동) 망설이며 말하다'],
    etymo: 'haerere(달라붙다) + ate(동사)',
    examples: [
      { text: 'Do not [hesitate] to call me if you need help.', korean: '도움이 필요하면 나에게 전화하는 것을 {망설이지} 마세요.' },
      { text: 'He [hesitated] before answering the question.', korean: '그는 질문에 대답하기 전에 {주저했습니다}.' }
    ]
  },
  {
    id: '384',
    word: 'schedule',
    definitions: ['(명) 일정, 시간표', '(동) 일정을 잡다, 계획하다'],
    etymo: 'schedula(종이 조각)',
    examples: [
      { text: 'Let me check my [schedule] for tomorrow.', korean: '내일 내 {일정을} 확인해 보겠습니다.' },
      { text: 'We need to [schedule] a meeting with the client.', korean: '우리는 고객과 회의 {일정을 잡아야} 합니다.' }
    ]
  },
  {
    id: '385',
    word: 'project',
    definitions: ['(명) 프로젝트, 계획', '(동) 예상하다, 예측하다'],
    etymo: 'pro(앞으로) + jacere(던지다)',
    examples: [
      { text: 'The construction [project] will start next week.', korean: '건설 {프로젝트가} 다음 주에 시작될 것입니다.' },
      { text: 'Experts [project] a steady increase in sales.', korean: '전문가들은 매출의 꾸준한 증가를 {예상합니다}.' }
    ]
  },
  {
    id: '386',
    word: 'credit',
    definitions: ['(명) 신용, 신뢰', '(명) 입금, 잔액'],
    etymo: 'credere(믿다) + it(명사)',
    examples: [
      { text: 'You need a good [credit] history to get a loan.', korean: '대출을 받으려면 좋은 {신용} 기록이 필요합니다.' },
      { text: 'The bank gave me a [credit] of $100.', korean: '은행이 나에게 100달러를 {입금해} 주었습니다.' }
    ]
  },
  {
    id: '387',
    word: 'accrue',
    definitions: ['(동) 증가하다, 축적되다'],
    etymo: 'ad(방향) + crescere(자라다)',
    examples: [
      { text: 'Interest will [accrue] on your account daily.', korean: '이자가 당신의 계좌에 매일 {축적될} 것입니다.' },
      { text: 'Benefits [accrue] automatically over time.', korean: '혜택은 시간이 지남에 따라 자동으로 {증가합니다}.' }
    ]
  },
  {
    id: '388',
    word: 'dig',
    definitions: ['(동) 땅을 파다', '(동) 정보를 찾다'],
    etymo: 'dicqun(파다)',
    examples: [
      { text: 'The dog likes to [dig] holes in the garden.', korean: '그 개는 정원에 {땅을 파는} 것을 좋아합니다.' },
      { text: 'The reporter decided to [dig] deeper into the story.', korean: '그 기자는 이야기에 대해 더 깊이 {정보를 찾기로} 결정했습니다.' }
    ]
  },
  {
    id: '389',
    word: 'remit',
    definitions: ['(동) 송금하다', '(동) 면제하다'],
    etymo: 're(뒤로) + mittere(보내다)',
    examples: [
      { text: 'Please [remit] payment within 30 days.', korean: '30일 이내에 대금을 {송금해} 주십시오.' },
      { text: 'The governor decided to [remit] his sentence.', korean: '주지사는 그의 형벌을 {면제해} 주기로 결정했습니다.' }
    ]
  },
  {
    id: '390',
    word: 'favorable',
    definitions: ['(형) 호의적인', '(형) 유리한'],
    etymo: 'favor(호의) + able(가능한)',
    examples: [
      { text: 'We received a [favorable] response from the client.', korean: '우리는 고객으로부터 {호의적인} 반응을 받았습니다.' },
      { text: 'The wind conditions are [favorable] for sailing.', korean: '바람의 조건이 항해에 {유리합니다}.' }
    ]
  },
  {
    id: '391',
    word: 'state',
    definitions: ['(명) 상태', '(명) 주, 국가'],
    etymo: 'stare(서다)',
    examples: [
      { text: 'The building is in a terrible [state] of repair.', korean: '그 건물은 끔찍한 수리 {상태에} 있습니다.' },
      { text: 'He traveled across every [state] in America.', korean: '그는 미국의 모든 {주를} 여행했습니다.' }
    ]
  },
  {
    id: '392',
    word: 'patio',
    definitions: ['(명) 파티오, 테라스', '(명) 외부 휴식 공간'],
    etymo: 'patio(중정, 마당)',
    examples: [
      { text: 'We had dinner out on the [patio].', korean: '우리는 {파티오(테라스)에서} 저녁을 먹었습니다.' },
      { text: 'The restaurant features a large outdoor [patio].', korean: '그 식당은 큰 {외부 휴식 공간을} 자랑합니다.' }
    ]
  },
  {
    id: '393',
    word: 'recreational',
    definitions: ['(형) 여가의, 오락의'],
    etymo: 're(다시) + creare(만들다) + tion(명사) + al(형용사)',
    examples: [
      { text: 'The park has many [recreational] facilities.', korean: '그 공원에는 많은 {여가의} 시설이 있습니다.' },
      { text: 'Fishing is a popular [recreational] activity here.', korean: '낚시는 이곳에서 인기 있는 {오락의} 활동입니다.' }
    ]
  },
  {
    id: '394',
    word: 'valley',
    definitions: ['(명) 계곡, 골짜기'],
    etymo: 'vallis(골짜기)',
    examples: [
      { text: 'The river flows through the green [valley].', korean: '강이 푸른 {계곡을} 가로질러 흐릅니다.' },
      { text: 'We hiked down into the deep [valley].', korean: '우리는 깊은 {골짜기} 아래로 등산했습니다.' }
    ]
  },
  {
    id: '395',
    word: 'skeptical',
    definitions: ['(형) 의심 많은'],
    etymo: 'skeptikos(생각하는, 회의적인) + al(형용사)',
    examples: [
      { text: 'He is highly [skeptical] of their claims.', korean: '그는 그들의 주장에 매우 {의심 많습니다(회의적입니다)}.' },
      { text: 'The scientists remained [skeptical] about the new theory.', korean: '과학자들은 새로운 이론에 대해 {의심 많은} 상태를 유지했습니다.' }
    ]
  },
  {
    id: '396',
    word: 'positive',
    definitions: ['(형) 긍정적인', '(형) 확신하는'],
    etymo: 'ponere(놓다) + ive(형용사)',
    examples: [
      { text: 'Try to maintain a [positive] attitude.', korean: '{긍정적인} 태도를 유지하려고 노력하세요.' },
      { text: 'Are you [positive] that you locked the door?', korean: '당신은 문을 잠갔다고 {확신합니까}?' }
    ]
  },
  {
    id: '397',
    word: 'economy',
    definitions: ['(명) 경제', '(명) 절약, 경제성'],
    etymo: 'oikos(집) + nomos(관리)',
    examples: [
      { text: 'The global [economy] is slowly recovering.', korean: '세계 {경제가} 서서히 회복되고 있습니다.' },
      { text: 'This car is known for its fuel [economy].', korean: '이 차는 연료 {절약으로} 유명합니다.' }
    ]
  },
  {
    id: '398',
    word: 'propose',
    definitions: ['(동) 제안하다', '(동) 청혼하다'],
    etymo: 'pro(앞으로) + ponere(놓다)',
    examples: [
      { text: 'I [propose] that we delay the meeting.', korean: '나는 우리가 회의를 연기할 것을 {제안합니다}.' },
      { text: 'He plans to [propose] to his girlfriend tonight.', korean: '그는 오늘 밤 여자친구에게 {청혼할} 계획입니다.' }
    ]
  },
  {
    id: '399',
    word: 'debut',
    definitions: ['(명) 첫 등장, 데뷔', '(동) 첫선을 보이다, 데뷔하다'],
    etymo: 'de(분리) + but(목표물)',
    examples: [
      { text: 'The actor made his film [debut] last year.', korean: '그 배우는 작년에 영화 {데뷔를} 했습니다.' },
      { text: 'The new model will [debut] at the auto show.', korean: '새 모델이 모터쇼에서 {첫선을 보일} 것입니다.' }
    ]
  },
  {
    id: '400',
    word: 'fire',
    definitions: ['(명) 불, 화재', '(동) 해고하다'],
    etymo: 'fyr(불)',
    examples: [
      { text: 'The building was destroyed by a massive [fire].', korean: '그 건물은 거대한 {화재로} 파괴되었습니다.' },
      { text: 'The manager had to [fire] the employee for stealing.', korean: '매니저는 훔친 직원을 {해고해야} 했습니다.' }
    ]
  }
];
export const DAY_9_WORDS: Word[] = [
  {
    id: '401',
    word: 'hire',
    definitions: ['(동) 고용하다', '(동) 임대하다'],
    etymo: 'hyrian(품삯을 주고 부리다)',
    examples: [
      { text: 'We plan to [hire] a new software engineer.', korean: '우리는 새로운 소프트웨어 엔지니어를 {고용할} 계획입니다.' },
      { text: 'They [hired] a hall for the corporate event.', korean: '그들은 기업 행사를 위해 홀을 {임대했습니다}.' }
    ]
  },
  {
    id: '402',
    word: 'attitude',
    definitions: ['(명) 태도, 마음가짐', '(명) 입장, 견해'],
    etymo: 'aptus(적합한) + tude(명사)',
    examples: [
      { text: 'He has a positive [attitude] towards his work.', korean: '그는 자신의 일에 대해 긍정적인 {태도를} 가지고 있습니다.' },
      { text: 'The government changed its [attitude] on the issue.', korean: '정부는 그 문제에 대한 {입장을} 바꿨습니다.' }
    ]
  },
  {
    id: '403',
    word: 'region',
    definitions: ['(명) 지역, 구역', '(명) 분야, 영역'],
    etymo: 'regere(다스리다) + ion(명사)',
    examples: [
      { text: 'This [region] is famous for its wine.', korean: '이 {지역은} 와인으로 유명합니다.' },
      { text: 'Her expertise lies in the [region] of finance.', korean: '그녀의 전문 지식은 금융 {분야에} 있습니다.' }
    ]
  },
  {
    id: '404',
    word: 'dispose',
    definitions: ['(동) 처리하다, 처분하다', '(동) 배치하다'],
    etymo: 'dis(따로) + ponere(놓다)',
    examples: [
      { text: 'Please [dispose] of your trash properly.', korean: '쓰레기를 적절히 {처리해} 주십시오.' },
      { text: 'The general will [dispose] his troops along the river.', korean: '장군은 강을 따라 군대를 {배치할} 것입니다.' }
    ]
  },
  {
    id: '405',
    word: 'divide',
    definitions: ['(동) 나누다, 분할하다', '(동) 갈라놓다, 분열시키다'],
    etymo: 'dis(분리) + videre(나누다)',
    examples: [
      { text: 'We will [divide] the profits equally.', korean: '우리는 수익을 동등하게 {나눌} 것입니다.' },
      { text: 'The scandal threatened to [divide] the team.', korean: '그 스캔들은 팀을 {분열시킬} 위협이 되었습니다.' }
    ]
  },
  {
    id: '406',
    word: 'proficiency',
    definitions: ['(명) 숙련도', '(명) 능력'],
    etymo: 'pro(앞으로) + facere(만들다) + ency(명사)',
    examples: [
      { text: 'The job requires a high level of [proficiency] in English.', korean: '그 직업은 높은 수준의 영어 {숙련도를} 요구합니다.' },
      { text: 'He demonstrated great [proficiency] in programming.', korean: '그는 프로그래밍에서 뛰어난 {능력을} 보여주었습니다.' }
    ]
  },
  {
    id: '407',
    word: 'managerial',
    definitions: ['(형) 경영의, 관리의'],
    etymo: 'manage(관리하다) + rial(형용사)',
    examples: [
      { text: 'She has excellent [managerial] skills.', korean: '그녀는 뛰어난 {관리} 능력을 가지고 있습니다.' },
      { text: 'He was promoted to a [managerial] position.', korean: '그는 {경영} 직책으로 승진했습니다.' }
    ]
  },
  {
    id: '408',
    word: 'growth',
    definitions: ['(명) 성장, 발전', '(명) 증가, 증식'],
    etymo: 'grow(자라다) + th(명사)',
    examples: [
      { text: 'The company achieved rapid [growth] last year.', korean: '그 회사는 작년에 빠른 {성장을} 이루었습니다.' },
      { text: 'We observed a significant [growth] in sales.', korean: '우리는 매출에서 상당한 {증가를} 관찰했습니다.' }
    ]
  },
  {
    id: '409',
    word: 'independent',
    definitions: ['(형) 독립적인', '(형) 자립적인'],
    etymo: 'in(부정) + depend(의존하다) + ent(형용사)',
    examples: [
      { text: 'We hired an [independent] auditor.', korean: '우리는 {독립적인} 감사관을 고용했습니다.' },
      { text: 'She is a very [independent] young woman.', korean: '그녀는 매우 {자립적인} 젊은 여성입니다.' }
    ]
  },
  {
    id: '410',
    word: 'apologize',
    definitions: ['(동) 사과하다'],
    etymo: 'apo(멀리) + logos(말) + ize(동사)',
    examples: [
      { text: 'I sincerely [apologize] for the delay.', korean: '지연에 대해 진심으로 {사과합니다}.' },
      { text: 'He must [apologize] to the customer immediately.', korean: '그는 즉시 고객에게 {사과해야} 합니다.' }
    ]
  },
  {
    id: '411',
    word: 'refer',
    definitions: ['(동) 언급하다', '(동) 참조하다'],
    etymo: 're(다시) + ferre(가져오다)',
    examples: [
      { text: 'He didn\'t [refer] to the problem during the meeting.', korean: '그는 회의 중에 그 문제를 {언급하지} 않았습니다.' },
      { text: 'Please [refer] to the manual for instructions.', korean: '지침을 위해 매뉴얼을 {참조해} 주십시오.' }
    ]
  },
  {
    id: '412',
    word: 'follow',
    definitions: ['(동) 뒤를 따르다', '(동) 지시나 규칙을 따르다'],
    etymo: 'folgian(동행하다)',
    examples: [
      { text: 'Please [follow] me to the conference room.', korean: '저를 {따라} 회의실로 오십시오.' },
      { text: 'All employees must [follow] the safety guidelines.', korean: '모든 직원은 안전 지침을 {따라야} 합니다.' }
    ]
  },
  {
    id: '413',
    word: 'broad',
    definitions: ['(형) 넓은, 광범위한', '(형) 일반적인, 종합적인'],
    etymo: 'brad(넓은)',
    examples: [
      { text: 'She has a [broad] knowledge of history.', korean: '그녀는 역사에 대한 {광범위한} 지식을 가지고 있습니다.' },
      { text: 'We need a [broad] overview of the project.', korean: '우리는 프로젝트에 대한 {종합적인} 개요가 필요합니다.' }
    ]
  },
  {
    id: '414',
    word: 'diversified',
    definitions: ['(형) 다양한, 다각화된', '(동) 다각화하다, 다양화하다'],
    etymo: 'di(따로) + vertere(돌리다) + fied(과거분사)',
    examples: [
      { text: 'The company has a highly [diversified] portfolio.', korean: '그 회사는 매우 {다각화된} 포트폴리오를 가지고 있습니다.' },
      { text: 'They [diversified] their product line to increase sales.', korean: '그들은 매출을 늘리기 위해 제품 라인을 {다양화했습니다}.' }
    ]
  },
  {
    id: '415',
    word: 'ailing',
    definitions: ['(형) 병든, 아픈', '(형) 경제적으로 어려움을 겪고 있는'],
    etymo: 'ail(아프다) + ing(형용사)',
    examples: [
      { text: 'She stayed home to care for her [ailing] mother.', korean: '그녀는 {병든} 어머니를 돌보기 위해 집에 머물렀습니다.' },
      { text: 'The government plans to support the [ailing] industry.', korean: '정부는 {어려움을 겪고 있는} 산업을 지원할 계획입니다.' }
    ]
  },
  {
    id: '416',
    word: 'occupancy',
    definitions: ['(명) 점유, 사용'],
    etymo: 'ob(대항하여) + capere(잡다) + ancy(명사)',
    examples: [
      { text: 'The hotel has a high [occupancy] rate this season.', korean: '그 호텔은 이번 시즌에 높은 {점유}율을 보이고 있습니다.' },
      { text: 'The building is ready for immediate [occupancy].', korean: '그 건물은 즉시 {사용}할 준비가 되었습니다.' }
    ]
  },
  {
    id: '417',
    word: 'hospitality',
    definitions: ['(명) 환대', '(명) 환대 산업'],
    etymo: 'hospes(손님, 주인) + ity(명사)',
    examples: [
      { text: 'Thank you for your warm [hospitality].', korean: '따뜻한 {환대에} 감사드립니다.' },
      { text: 'He works in the [hospitality] management sector.', korean: '그는 {환대 산업} 관리 부문에서 일합니다.' }
    ]
  },
  {
    id: '418',
    word: 'furnished',
    definitions: ['(형) 가구가 비치된', '(동) 가구를 비치하다, 제공하다'],
    etymo: 'furnish(공급하다) + ed(과거분사)',
    examples: [
      { text: 'We are looking for a fully [furnished] apartment.', korean: '우리는 완전히 {가구가 비치된} 아파트를 찾고 있습니다.' },
      { text: 'The room was [furnished] with antique chairs.', korean: '그 방에는 골동품 의자들이 {제공되어} 있었습니다.' }
    ]
  },
  {
    id: '419',
    word: 'enlightening',
    definitions: ['(형) 계몽적인, 유익한', '(동) 계몽하다, 설명하다'],
    etymo: 'en(만들다) + light(빛) + ing(형용사)',
    examples: [
      { text: 'The seminar was very [enlightening] and helpful.', korean: '세미나는 매우 {유익하고} 도움이 되었습니다.' },
      { text: 'He is [enlightening] the students on the new theory.', korean: '그는 학생들에게 새로운 이론에 대해 {설명하고} 있습니다.' }
    ]
  },
  {
    id: '420',
    word: 'municipal',
    definitions: ['(형) 시의, 지방 자치의'],
    etymo: 'munus(의무) + capere(잡다) + al(형용사)',
    examples: [
      { text: 'The [municipal] government approved the new park.', korean: '{시} 정부가 새로운 공원을 승인했습니다.' },
      { text: 'We must follow the [municipal] regulations.', korean: '우리는 {지방 자치의} 규정을 따라야 합니다.' }
    ]
  },
  {
    id: '421',
    word: 'regard',
    definitions: ['(동) 간주하다, 여기다', '(동) 관련되다'],
    etymo: 're(다시) + garder(지켜보다)',
    examples: [
      { text: 'They [regard] him as a top expert in the field.', korean: '그들은 그를 이 분야의 최고 전문가로 {여깁니다}.' },
      { text: 'The new rules [regard] employee safety.', korean: '새 규칙은 직원 안전과 {관련됩니다}.' }
    ]
  },
  {
    id: '422',
    word: 'routinely',
    definitions: ['(부) 정기적으로', '(형) 일상적인'],
    etymo: 'route(길) + ine(형용사) + ly(부사)',
    examples: [
      { text: 'The elevators are [routinely] inspected for safety.', korean: '엘리베이터는 안전을 위해 {정기적으로} 점검됩니다.' },
      { text: 'She performs these tasks [routinely] every morning.', korean: '그녀는 매일 아침 {일상적으로} 이 업무들을 수행합니다.' }
    ]
  },
  {
    id: '423',
    word: 'overview',
    definitions: ['(명) 개요', '(명) 전반적인 설명, 개괄'],
    etymo: 'over(위에) + view(보다)',
    examples: [
      { text: 'The manager gave a brief [overview] of the project.', korean: '매니저가 프로젝트에 대한 짧은 {개요를} 제공했습니다.' },
      { text: 'This document provides an [overview] of our services.', korean: '이 문서는 우리 서비스에 대한 {전반적인 설명을} 제공합니다.' }
    ]
  },
  {
    id: '424',
    word: 'qualify',
    definitions: ['(동) 자격을 얻다', '(동) 적합하다'],
    etymo: 'qualis(어떠한) + facere(만들다)',
    examples: [
      { text: 'You must pass the exam to [qualify] for the license.', korean: '면허 {자격을 얻으려면} 시험에 합격해야 합니다.' },
      { text: 'His experience doesn\'t [qualify] him for this role.', korean: '그의 경력은 그를 이 역할에 {적합하게} 만들지 않습니다.' }
    ]
  },
  {
    id: '425',
    word: 'determine',
    definitions: ['(동) 결정하다', '(동) 확정하다, 판별하다'],
    etymo: 'de(완전히) + terminare(끝내다)',
    examples: [
      { text: 'The committee will [determine] the final budget.', korean: '위원회가 최종 예산을 {결정할} 것입니다.' },
      { text: 'We need to [determine] the cause of the problem.', korean: '우리는 문제의 원인을 {판별해야} 합니다.' }
    ]
  },
  {
    id: '426',
    word: 'overcharge',
    definitions: ['(동) 과다 청구하다', '(동) 과충전하다'],
    etymo: 'over(지나치게) + charge(청구하다)',
    examples: [
      { text: 'I think the restaurant [overcharged] us for the drinks.', korean: '식당이 음료에 대해 우리에게 {과다 청구한} 것 같습니다.' },
      { text: 'Do not [overcharge] the battery, or it may explode.', korean: '배터리를 {과충전하지} 마세요. 폭발할 수 있습니다.' }
    ]
  },
  {
    id: '427',
    word: 'keep',
    definitions: ['(동) 유지하다', '(동) 보관하다'],
    etymo: 'cepan(관찰하다, 지키다)',
    examples: [
      { text: 'Please [keep] the door closed at all times.', korean: '항상 문이 닫힌 상태를 {유지해} 주십시오.' },
      { text: 'I [keep] my important documents in a safe.', korean: '나는 중요한 서류를 금고에 {보관합니다}.' }
    ]
  },
  {
    id: '428',
    word: 'costume',
    definitions: ['(명) 복장, 의상'],
    etymo: 'consuetudo(관습, 습관)',
    examples: [
      { text: 'She wore a traditional [costume] to the festival.', korean: '그녀는 축제에 전통 {의상을} 입고 갔습니다.' },
      { text: 'The actors are changing into their [costumes].', korean: '배우들이 그들의 {복장으로} 갈아입고 있습니다.' }
    ]
  },
  {
    id: '429',
    word: 'evenly',
    definitions: ['(부) 고르게, 균등하게', '(부) 평평하게'],
    etymo: 'even(평평한) + ly(부사)',
    examples: [
      { text: 'Spread the paint [evenly] over the surface.', korean: '표면 위에 페인트를 {고르게} 펴 바르세요.' },
      { text: 'The weight must be distributed [evenly].', korean: '무게가 {균등하게} 분배되어야 합니다.' }
    ]
  },
  {
    id: '430',
    word: 'industry',
    definitions: ['(명) 산업', '(명) 근면'],
    etymo: 'industria(근면, 활동)',
    examples: [
      { text: 'The automotive [industry] is facing new challenges.', korean: '자동차 {산업이} 새로운 도전에 직면해 있습니다.' },
      { text: 'His success is due to his intelligence and [industry].', korean: '그의 성공은 그의 지능과 {근면} 덕분입니다.' }
    ]
  },
  {
    id: '431',
    word: 'highlight',
    definitions: ['(동) 강조하다', '(명) 가장 중요한 부분, 하이라이트'],
    etymo: 'high(높은) + light(빛)',
    examples: [
      { text: 'The speaker [highlighted] the importance of teamwork.', korean: '연사는 팀워크의 중요성을 {강조했습니다}.' },
      { text: 'The award ceremony was the [highlight] of the event.', korean: '시상식은 그 행사의 {가장 중요한 부분이었습니다}.' }
    ]
  },
  {
    id: '432',
    word: 'journal',
    definitions: ['(명) 일기, 기록', '(명) 학술지, 정기간행물'],
    etymo: 'diurnalis(매일의)',
    examples: [
      { text: 'He keeps a daily [journal] of his travels.', korean: '그는 자신의 여행에 대한 매일의 {일기를} 씁니다.' },
      { text: 'The study was published in a medical [journal].', korean: '그 연구는 의학 {학술지에} 발표되었습니다.' }
    ]
  },
  {
    id: '433',
    word: 'shore',
    definitions: ['(명) 해안, 물가', '(동) 지지하다, 강화하다'],
    etymo: 'schore(가장자리)',
    examples: [
      { text: 'We walked along the sandy [shore].', korean: '우리는 모래 {해안을} 따라 걸었습니다.' },
      { text: 'The company needs a loan to [shore] up its finances.', korean: '그 회사는 재정을 {강화하기} 위해 대출이 필요합니다.' }
    ]
  },
  {
    id: '434',
    word: 'statue',
    definitions: ['(명) 동상, 조각상'],
    etymo: 'statuere(세우다)',
    examples: [
      { text: 'A bronze [statue] stands in the center of the park.', korean: '청동 {동상이} 공원 중앙에 서 있습니다.' },
      { text: 'The museum unveiled a new marble [statue].', korean: '박물관이 새로운 대리석 {조각상을} 공개했습니다.' }
    ]
  },
  {
    id: '435',
    word: 'astronomy',
    definitions: ['(명) 천문학'],
    etymo: 'astron(별) + nomos(법칙)',
    examples: [
      { text: 'She is studying [astronomy] at the university.', korean: '그녀는 대학에서 {천문학을} 공부하고 있습니다.' },
      { text: 'The telescope is a vital tool in [astronomy].', korean: '망원경은 {천문학에서} 필수적인 도구입니다.' }
    ]
  },
  {
    id: '436',
    word: 'flexible',
    definitions: ['(형) 유연한, 융통성 있는'],
    etymo: 'flectere(구부리다) + ible(가능한)',
    examples: [
      { text: 'Our company offers [flexible] working hours.', korean: '우리 회사는 {유연한} 근무 시간을 제공합니다.' },
      { text: 'You need to be [flexible] when dealing with clients.', korean: '고객을 대할 때는 {융통성 있어야} 합니다.' }
    ]
  },
  {
    id: '437',
    word: 'circulate',
    definitions: ['(동) 순환하다', '(동) 배포하다, 퍼뜨리다'],
    etymo: 'circulus(원) + ate(동사)',
    examples: [
      { text: 'Blood [circulates] throughout the body.', korean: '혈액은 몸 전체를 {순환합니다}.' },
      { text: 'Please [circulate] this memo to all staff members.', korean: '이 메모를 모든 직원에게 {배포해} 주십시오.' }
    ]
  },
  {
    id: '438',
    word: 'merit',
    definitions: ['(명) 장점, 가치', '(동) (어떠한 대우를) 받을 만하다, 가치가 있다'],
    etymo: 'meritum(보상, 가치)',
    examples: [
      { text: 'We should judge the proposal on its own [merit].', korean: '우리는 제안서를 그 자체의 {가치로} 평가해야 합니다.' },
      { text: 'This complex issue [merits] further investigation.', korean: '이 복잡한 문제는 추가 조사를 {받을 만합니다}.' }
    ]
  },
  {
    id: '439',
    word: 'moderate',
    definitions: ['(형) 적당한, 중간의', '(동) 완화하다, 조정하다'],
    etymo: 'modus(측정, 한계) + ate(형용사/동사)',
    examples: [
      { text: 'Cook the meat over [moderate] heat.', korean: '고기를 {중간의} 불에서 요리하세요.' },
      { text: 'The wind began to [moderate] by evening.', korean: '바람이 저녁 무렵 {완화되기} 시작했습니다.' }
    ]
  },
  {
    id: '440',
    word: 'artificial',
    definitions: ['(형) 인공적인', '(형) 부자연스러운'],
    etymo: 'ars(기술) + facere(만들다) + ial(형용사)',
    examples: [
      { text: 'The building is lit by [artificial] light.', korean: '그 건물은 {인공적인} 빛으로 조명됩니다.' },
      { text: 'His smile seemed very [artificial].', korean: '그의 미소는 매우 {부자연스러워} 보였습니다.' }
    ]
  },
  {
    id: '441',
    word: 'analyze',
    definitions: ['(동) 분석하다', '(동) 평가하다'],
    etymo: 'ana(위로) + lyein(풀다)',
    examples: [
      { text: 'We need to [analyze] the sales data carefully.', korean: '우리는 판매 데이터를 주의 깊게 {분석해야} 합니다.' },
      { text: 'The committee will [analyze] the risks of the project.', korean: '위원회가 프로젝트의 위험성을 {평가할} 것입니다.' }
    ]
  },
  {
    id: '442',
    word: 'modernize',
    definitions: ['(동) 현대화하다', '(동) 개선하다, 개혁하다'],
    etymo: 'modern(현대의) + ize(동사)',
    examples: [
      { text: 'The factory needs to [modernize] its equipment.', korean: '그 공장은 장비를 {현대화할} 필요가 있습니다.' },
      { text: 'They plan to [modernize] the outdated education system.', korean: '그들은 구식 교육 제도를 {개혁할} 계획입니다.' }
    ]
  },
  {
    id: '443',
    word: 'operation',
    definitions: ['(명) 운영', '(명) 작전'],
    etymo: 'operari(일하다) + tion(명사)',
    examples: [
      { text: 'The new rules will come into [operation] next month.', korean: '새 규칙은 다음 달부터 {운영}에 들어갑니다.' },
      { text: 'The police launched a massive [operation].', korean: '경찰은 대규모 {작전을} 개시했습니다.' }
    ]
  },
  {
    id: '444',
    word: 'medical',
    definitions: ['(형) 의학의, 의료의'],
    etymo: 'medicus(의사) + al(형용사)',
    examples: [
      { text: 'He is seeking [medical] advice for his condition.', korean: '그는 자신의 상태에 대해 {의학의} 조언을 구하고 있습니다.' },
      { text: 'The hospital purchased new [medical] equipment.', korean: '병원은 새로운 {의료의} 장비를 구매했습니다.' }
    ]
  },
  {
    id: '445',
    word: 'block',
    definitions: ['(명) 덩어리', '(명) 한 구획'],
    etymo: 'bloc(통나무, 덩어리)',
    examples: [
      { text: 'A large [block] of ice fell from the roof.', korean: '큰 얼음 {덩어리가} 지붕에서 떨어졌습니다.' },
      { text: 'The post office is just one [block] away.', korean: '우체국은 단 한 {구획} 떨어져 있습니다.' }
    ]
  },
  {
    id: '446',
    word: 'individual',
    definitions: ['(명) 개인', '(형) 개별적인, 개인적인'],
    etymo: 'in(부정) + dividere(나누다) + al(형용사)',
    examples: [
      { text: 'Every [individual] has the right to vote.', korean: '모든 {개인은} 투표할 권리가 있습니다.' },
      { text: 'Please pay attention to [individual] needs.', korean: '{개별적인} 요구 사항에 주의를 기울여 주십시오.' }
    ]
  },
  {
    id: '447',
    word: 'deadline',
    definitions: ['(명) 마감일, 기한', '(명) 시한, 시간 제한'],
    etymo: 'dead(죽은) + line(선)',
    examples: [
      { text: 'The [deadline] for the report is Friday.', korean: '보고서 {마감일은} 금요일입니다.' },
      { text: 'We are working hard to meet the strict [deadline].', korean: '우리는 엄격한 {시한을} 맞추기 위해 열심히 일하고 있습니다.' }
    ]
  },
  {
    id: '448',
    word: 'wrap',
    definitions: ['(동) 포장하다', '(동) 덮다, 감싸다'],
    etymo: 'wlappen(접다)',
    examples: [
      { text: 'Could you [wrap] this gift for me?', korean: '이 선물을 {포장해} 주시겠습니까?' },
      { text: 'She [wrapped] a blanket around the shivering child.', korean: '그녀는 떨고 있는 아이 주위를 담요로 {감쌌습니다}.' }
    ]
  },
  {
    id: '449',
    word: 'trial',
    definitions: ['(명) 재판', '(명) 시험, 시도'],
    etymo: 'trier(시도하다) + al(명사)',
    examples: [
      { text: 'The suspect is awaiting [trial].', korean: '용의자는 {재판을} 기다리고 있습니다.' },
      { text: 'They are conducting a clinical [trial] of the new drug.', korean: '그들은 신약에 대한 임상 {시험을} 진행하고 있습니다.' }
    ]
  },
  {
    id: '450',
    word: 'institute',
    definitions: ['(명) 기관, 연구소', '(동) 설립하다'],
    etymo: 'in(안으로) + statuere(세우다)',
    examples: [
      { text: 'He works as a researcher at the science [institute].', korean: '그는 과학 {연구소에서} 연구원으로 일합니다.' },
      { text: 'The government will [institute] a new policy.', korean: '정부가 새로운 정책을 {설립할(도입할)} 것입니다.' }
    ]
  }
];

export const DAY_10_WORDS: Word[] = [
  {
    id: '451',
    word: 'cooperation',
    definitions: ['(명) 협력', '(명) 협조, 지원'],
    etymo: 'co(함께) + operari(일하다) + tion(명사)',
    examples: [
      { text: 'Thank you for your [cooperation] in this matter.', korean: '이 문제에 대한 귀하의 {협력에} 감사드립니다.' },
      { text: 'The event was a success due to everyone\'s [cooperation].', korean: '모두의 {협조} 덕분에 행사가 성공적이었습니다.' }
    ]
  },
  {
    id: '452',
    word: 'resident',
    definitions: ['(명) 거주자', '(명) 수련의'],
    etymo: 're(뒤에) + sedere(앉다) + ent(명사)',
    examples: [
      { text: 'A local [resident] reported the incident to the police.', korean: '지역 {거주자가} 그 사건을 경찰에 신고했습니다.' },
      { text: 'She is a first-year medical [resident] at the hospital.', korean: '그녀는 그 병원의 1년 차 의학 {수련의입니다}.' }
    ]
  },
  {
    id: '453',
    word: 'flight',
    definitions: ['(명) 비행, 항공 여행', '(명) (계단의) 층, 계단'],
    etymo: 'flyge(비행)',
    examples: [
      { text: 'My [flight] to London was delayed by two hours.', korean: '나의 런던행 {비행이} 2시간 지연되었습니다.' },
      { text: 'We walked up a [flight] of stairs to the second floor.', korean: '우리는 2층으로 한 {층의} 계단을 걸어 올라갔습니다.' }
    ]
  },
  {
    id: '454',
    word: 'department',
    definitions: ['(명) 부서, 학과', '(명) 소매점의 부문'],
    etymo: 'de(분리하여) + part(부분) + ment(명사)',
    examples: [
      { text: 'She transferred to the marketing [department].', korean: '그녀는 마케팅 {부서로} 부서를 옮겼습니다.' },
      { text: 'You can find shoes in the men\'s [department].', korean: '신발은 남성복 {부문에서} 찾을 수 있습니다.' }
    ]
  },
  {
    id: '455',
    word: 'separate',
    definitions: ['(동) 분리하다', '(형) 별개의, 독립된'],
    etymo: 'se(떨어져) + parare(준비하다)',
    examples: [
      { text: 'Please [separate] the recyclables from the trash.', korean: '재활용품을 쓰레기와 {분리해} 주십시오.' },
      { text: 'They decided to sleep in [separate] rooms.', korean: '그들은 {별개의} 방에서 자기를 결정했습니다.' }
    ]
  },
  {
    id: '456',
    word: 'ladder',
    definitions: ['(명) 사다리', '(명) 승진 단계, 출세의 길'],
    etymo: 'hlaeder(사다리)',
    examples: [
      { text: 'He used a [ladder] to reach the top shelf.', korean: '그는 맨 위 선반에 닿기 위해 {사다리를} 사용했습니다.' },
      { text: 'She is slowly climbing the corporate [ladder].', korean: '그녀는 천천히 기업의 {승진 단계를} 올라가고 있습니다.' }
    ]
  },
  {
    id: '457',
    word: 'passenger',
    definitions: ['(명) 승객', '(명) 동승자'],
    etymo: 'passager(지나가는 사람)',
    examples: [
      { text: 'Every [passenger] must wear a seatbelt.', korean: '모든 {승객은} 안전벨트를 착용해야 합니다.' },
      { text: 'He was a [passenger] in the car during the accident.', korean: '그는 사고 당시 차 안의 {동승자였습니다}.' }
    ]
  },
  {
    id: '458',
    word: 'closet',
    definitions: ['(명) 옷장, 작은 방', '(동) 비밀로 하다, 감추다'],
    etymo: 'claudere(닫다)',
    examples: [
      { text: 'Hang your coat in the [closet].', korean: '당신의 코트를 {옷장에} 거세요.' },
      { text: 'They [closeted] themselves in the room to discuss the plan.', korean: '그들은 계획을 논의하기 위해 방에 자신들을 {감추었습니다}.' }
    ]
  },
  {
    id: '459',
    word: 'rare',
    definitions: ['(형) 희귀한, 드문', '(형) 거의 익지 않은 (음식)'],
    etymo: 'rarus(드문, 성긴)',
    examples: [
      { text: 'This bird is a very [rare] species.', korean: '이 새는 매우 {희귀한} 종입니다.' },
      { text: 'I would like my steak cooked [rare], please.', korean: '제 스테이크는 {거의 익지 않게} 구워주세요.' }
    ]
  },
  {
    id: '460',
    word: 'masterpiece',
    definitions: ['(명) 걸작, 명작', '(명) 최고의 작품'],
    etymo: 'master(주인, 대가) + piece(작품)',
    examples: [
      { text: 'The Mona Lisa is considered a [masterpiece].', korean: '모나리자는 {걸작으로} 여겨집니다.' },
      { text: 'The chef\'s new dessert is a culinary [masterpiece].', korean: '요리사의 새로운 디저트는 요리의 {최고의 작품입니다}.' }
    ]
  },
  {
    id: '461',
    word: 'broadcast',
    definitions: ['(동) 방송하다', '(명) 방송, 방송 프로그램'],
    etymo: 'broad(넓은) + cast(던지다)',
    examples: [
      { text: 'The station will [broadcast] the game live.', korean: '그 방송국은 경기를 생중계로 {방송할} 것입니다.' },
      { text: 'We watched the news [broadcast] last night.', korean: '우리는 어젯밤 뉴스 {방송을} 보았습니다.' }
    ]
  },
  {
    id: '462',
    word: 'retrieve',
    definitions: ['(동) 되찾다, 회수하다', '(동) (정보를) 검색하다'],
    etymo: 're(다시) + trouver(찾다)',
    examples: [
      { text: 'I need to [retrieve] my bag from the locker.', korean: '나는 사물함에서 내 가방을 {되찾아야} 합니다.' },
      { text: 'You can [retrieve] the data from the backup server.', korean: '백업 서버에서 데이터를 {검색할} 수 있습니다.' }
    ]
  },
  {
    id: '463',
    word: 'replacement',
    definitions: ['(명) 대체, 교체', '(명) 후임자, 후임'],
    etymo: 're(다시) + place(놓다) + ment(명사)',
    examples: [
      { text: 'The broken window needs immediate [replacement].', korean: '깨진 창문은 즉각적인 {교체가} 필요합니다.' },
      { text: 'We are interviewing candidates for her [replacement].', korean: '우리는 그녀의 {후임자를} 위해 지원자들을 면접하고 있습니다.' }
    ]
  },
  {
    id: '464',
    word: 'storage',
    definitions: ['(명) 저장, 보관', '(명) 저장소, 창고'],
    etymo: 'store(저장하다) + age(명사)',
    examples: [
      { text: 'Proper [storage] is essential for fresh food.', korean: '신선한 식품에는 적절한 {보관이} 필수적입니다.' },
      { text: 'We rented a [storage] unit for our extra furniture.', korean: '우리는 여분의 가구를 위해 {창고} 시설을 임대했습니다.' }
    ]
  },
  {
    id: '465',
    word: 'hectic',
    definitions: ['(형) 매우 바쁜, 정신없이 분주한', '(형) 험난한, 격렬한'],
    etymo: 'hexis(습관, 상태)',
    examples: [
      { text: 'It has been a very [hectic] week at the office.', korean: '사무실에서 매우 {정신없이 분주한} 한 주였습니다.' },
      { text: 'She leads a [hectic] lifestyle.', korean: '그녀는 {격렬한} 생활 방식을 이끌고 있습니다.' }
    ]
  },
  {
    id: '466',
    word: 'vessel',
    definitions: ['(명) 배, 선박', '(명) 용기, 그릇'],
    etymo: 'vascellum(작은 용기)',
    examples: [
      { text: 'The fishing [vessel] returned to the port.', korean: '어선 {선박이} 항구로 돌아왔습니다.' },
      { text: 'Blood is pumped through the blood [vessels].', korean: '혈액은 혈관({용기})을 통해 펌프질 됩니다.' }
    ]
  },
  {
    id: '467',
    word: 'resign',
    definitions: ['(동) 사임하다', '(동) 체념하다, 포기하다'],
    etymo: 're(뒤로) + signare(서명하다)',
    examples: [
      { text: 'The CEO decided to [resign] for health reasons.', korean: '최고경영자는 건강상의 이유로 {사임하기로} 결정했습니다.' },
      { text: 'He [resigned] himself to the fact that he lost.', korean: '그는 자신이 졌다는 사실에 {체념했습니다}.' }
    ]
  },
  {
    id: '468',
    word: 'load',
    definitions: ['(명) 짐, 중량', '(동) 짐을 싣다'],
    etymo: 'lad(길, 운반)',
    examples: [
      { text: 'The truck is carrying a heavy [load].', korean: '트럭이 무거운 {짐을} 나르고 있습니다.' },
      { text: 'Please help me [load] the boxes into the car.', korean: '상자들을 차에 {싣는} 것을 도와주세요.' }
    ]
  },
  {
    id: '469',
    word: 'supervisor',
    definitions: ['(명) 감독자', '(명) 관리인'],
    etymo: 'super(위에) + videre(보다) + or(사람)',
    examples: [
      { text: 'You should report this issue to your [supervisor].', korean: '당신은 이 문제를 당신의 {감독자에게} 보고해야 합니다.' },
      { text: 'The site [supervisor] ensures everyone wears safety gear.', korean: '현장 {관리인은} 모두가 안전 장비를 착용하도록 보장합니다.' }
    ]
  },
  {
    id: '470',
    word: 'sculpture',
    definitions: ['(명) 조각, 조각 작품', '(동) 조각하다'],
    etymo: 'sculpere(조각하다) + ure(명사)',
    examples: [
      { text: 'There is a beautiful ice [sculpture] at the entrance.', korean: '입구에 아름다운 얼음 {조각이} 있습니다.' },
      { text: 'He [sculptured] the clay into a bust.', korean: '그는 점토를 흉상으로 {조각했습니다}.' }
    ]
  },
  {
    id: '471',
    word: 'rent',
    definitions: ['(동) 임대하다', '(동) 빌려주다'],
    etymo: 'rendere(돌려주다, 산출하다)',
    examples: [
      { text: 'We decided to [rent] a car for the weekend.', korean: '우리는 주말 동안 차를 {임대하기로} 결정했습니다.' },
      { text: 'He [rents] out his basement to students.', korean: '그는 자신의 지하실을 학생들에게 {빌려줍니다}.' }
    ]
  },
  {
    id: '472',
    word: 'garage',
    definitions: ['(명) 차고', '(명) 자동차 정비소'],
    etymo: 'garer(보호하다) + age(명사)',
    examples: [
      { text: 'I parked the car in the [garage].', korean: '나는 차를 {차고에} 주차했습니다.' },
      { text: 'The mechanic at the [garage] fixed my brakes.', korean: '{자동차 정비소}의 정비사가 내 브레이크를 수리했습니다.' }
    ]
  },
  {
    id: '473',
    word: 'resource',
    definitions: ['(명) 자원', '(명) 재료, 원천'],
    etymo: 're(다시) + surgere(일어나다)',
    examples: [
      { text: 'Water is a precious natural [resource].', korean: '물은 귀중한 천연 {자원입니다}.' },
      { text: 'The library is a great [resource] for students.', korean: '도서관은 학생들에게 훌륭한 {원천입니다}.' }
    ]
  },
  {
    id: '474',
    word: 'flavor',
    definitions: ['(명) 맛, 향', '(명) 특정한 느낌, 분위기'],
    etymo: 'flare(불다) + or(명사)',
    examples: [
      { text: 'This ice cream has a strong strawberry [flavor].', korean: '이 아이스크림은 강한 딸기 {맛이} 납니다.' },
      { text: 'The jazz music added a nice [flavor] to the evening.', korean: '재즈 음악이 저녁에 좋은 {분위기를} 더했습니다.' }
    ]
  },
  {
    id: '475',
    word: 'apply',
    definitions: ['(동) 지원하다', '(동) 적용하다'],
    etymo: 'ad(방향) + plicare(접다)',
    examples: [
      { text: 'I would like to [apply] for the marketing position.', korean: '마케팅 직책에 {지원하고} 싶습니다.' },
      { text: 'This rule does not [apply] to part-time workers.', korean: '이 규칙은 파트타임 직원들에게는 {적용되지} 않습니다.' }
    ]
  },
  {
    id: '476',
    word: 'rack',
    definitions: ['(명) 선반, 짐대', '(동) 고통을 주다, 괴롭히다'],
    etymo: 'rekkan(뻗다)',
    examples: [
      { text: 'Place your luggage on the overhead [rack].', korean: '당신의 수하물을 머리 위 {선반에} 놓으세요.' },
      { text: 'He was [racked] with guilt over his mistake.', korean: '그는 자신의 실수에 대한 죄책감으로 {괴로워했습니다}.' }
    ]
  },
  {
    id: '477',
    word: 'acquisition',
    definitions: ['(명) 인수', '(명) 획득'],
    etymo: 'ad(방향) + quaerere(찾다) + tion(명사)',
    examples: [
      { text: 'The [acquisition] of the rival company was successful.', korean: '경쟁 회사의 {인수가} 성공적이었습니다.' },
      { text: 'Language [acquisition] is easier for young children.', korean: '언어 {획득은} 어린아이들에게 더 쉽습니다.' }
    ]
  },
  {
    id: '478',
    word: 'commercial',
    definitions: ['(형) 상업적인', '(명) 광고'],
    etymo: 'commercium(상업) + al(형용사)',
    examples: [
      { text: 'The building is zoned for [commercial] use only.', korean: '그 건물은 {상업적인} 용도로만 구역이 지정되어 있습니다.' },
      { text: 'I saw a funny [commercial] on television last night.', korean: '어젯밤 텔레비전에서 재미있는 {광고를} 보았습니다.' }
    ]
  },
  {
    id: '479',
    word: 'revise',
    definitions: ['(동) 수정하다', '(동) 검토하다'],
    etymo: 're(다시) + visere(보다)',
    examples: [
      { text: 'Please [revise] the report before submitting it.', korean: '보고서를 제출하기 전에 {수정해} 주십시오.' },
      { text: 'We need to [revise] our sales strategy.', korean: '우리는 판매 전략을 {검토해야} 합니다.' }
    ]
  },
  {
    id: '480',
    word: 'outdated',
    definitions: ['(형) 구식의, 시대에 뒤떨어진'],
    etymo: 'out(벗어난) + date(날짜) + ed(형용사)',
    examples: [
      { text: 'We are replacing our [outdated] computer systems.', korean: '우리는 {구식의} 컴퓨터 시스템을 교체하고 있습니다.' },
      { text: 'His ideas are completely [outdated].', korean: '그의 생각은 완전히 {시대에 뒤떨어져} 있습니다.' }
    ]
  },
  {
    id: '481',
    word: 'private',
    definitions: ['(형) 개인적인, 사적인', '(형) 비공개의, 비밀의'],
    etymo: 'privus(개별의, 박탈당한)',
    examples: [
      { text: 'This is my [private] phone number.', korean: '이것은 나의 {개인적인} 전화번호입니다.' },
      { text: 'The meeting was held in a [private] room.', korean: '회의는 {비공개의} 방에서 열렸습니다.' }
    ]
  },
  {
    id: '482',
    word: 'tray',
    definitions: ['(명) 쟁반, 받침'],
    etymo: 'trig(나무 그릇)',
    examples: [
      { text: 'The waiter brought our drinks on a silver [tray].', korean: '웨이터가 은 {쟁반에} 우리 음료를 가져왔습니다.' },
      { text: 'Please leave your empty cups on the [tray].', korean: '빈 컵은 {받침에} 놓아두세요.' }
    ]
  },
  {
    id: '483',
    word: 'entrance',
    definitions: ['(명) 입구, 진입로', '(명) 입장(진입)'],
    etymo: 'enter(들어가다) + ance(명사)',
    examples: [
      { text: 'Please use the main [entrance] of the building.', korean: '건물의 주 {입구를} 사용해 주십시오.' },
      { text: 'University [entrance] exams are very difficult.', korean: '대학교 {입장(진학)} 시험은 매우 어렵습니다.' }
    ]
  },
  {
    id: '484',
    word: 'pharmacy',
    definitions: ['(명) 약국', '(명) 약학'],
    etymo: 'pharmakon(약)',
    examples: [
      { text: 'I need to pick up my prescription at the [pharmacy].', korean: '나는 {약국에서} 처방약을 받아야 합니다.' },
      { text: 'She is studying [pharmacy] at the university.', korean: '그녀는 대학에서 {약학을} 공부하고 있습니다.' }
    ]
  },
  {
    id: '485',
    word: 'appeal',
    definitions: ['(동) 호소하다', '(동) 항소하다'],
    etymo: 'ad(방향) + pellere(밀다)',
    examples: [
      { text: 'The charity [appealed] to the public for donations.', korean: '그 자선단체는 대중에게 기부를 {호소했습니다}.' },
      { text: 'The lawyer will [appeal] the court\'s decision.', korean: '변호사가 법원의 판결에 {항소할} 것입니다.' }
    ]
  },
  {
    id: '486',
    word: 'errand',
    definitions: ['(명) 심부름', '(명) 사적인 용무'],
    etymo: 'aerende(메시지, 사명)',
    examples: [
      { text: 'I have to run a quick [errand] before the meeting.', korean: '회의 전에 빨리 {심부름을} 다녀와야 합니다.' },
      { text: 'He is out of the office on a personal [errand].', korean: '그는 {사적인 용무}로 사무실을 비웠습니다.' }
    ]
  },
  {
    id: '487',
    word: 'knob',
    definitions: ['(명) 손잡이', '(명) 돌기'],
    etymo: 'knobbe(둥근 혹)',
    examples: [
      { text: 'Turn the [knob] to open the door.', korean: '문을 열려면 {손잡이를} 돌리세요.' },
      { text: 'The machine has a small [knob] for adjusting the volume.', korean: '그 기계에는 볼륨을 조절하는 작은 {돌기가} 있습니다.' }
    ]
  },
  {
    id: '488',
    word: 'compile',
    definitions: ['(동) 자료를 모으다, 편집하다', '(동) (프로그램을) 컴파일하다'],
    etymo: 'com(함께) + pilare(쌓다)',
    examples: [
      { text: 'We will [compile] the survey results into a report.', korean: '우리는 설문조사 결과를 보고서로 {자료를 모아 편집할} 것입니다.' },
      { text: 'The developer needs to [compile] the code again.', korean: '개발자는 코드를 다시 {컴파일해야} 합니다.' }
    ]
  },
  {
    id: '489',
    word: 'composer',
    definitions: ['(명) 작곡가'],
    etymo: 'com(함께) + ponere(놓다) + er(사람)',
    examples: [
      { text: 'Beethoven is a famous classical [composer].', korean: '베토벤은 유명한 고전주의 {작곡가입니다}.' },
      { text: 'The [composer] wrote a beautiful symphony for the movie.', korean: '그 {작곡가는} 영화를 위해 아름다운 교향곡을 썼습니다.' }
    ]
  },
  {
    id: '490',
    word: 'linger',
    definitions: ['(동) (장소에) 오래 머무르다', '(동) (냄새가) 남아 있다'],
    etymo: 'lengen(연장하다)',
    examples: [
      { text: 'Guests tend to [linger] in the lobby after the event.', korean: '행사 후 손님들이 로비에 {오래 머무르는} 경향이 있습니다.' },
      { text: 'The smell of coffee [lingered] in the kitchen.', korean: '커피 냄새가 부엌에 {남아 있었습니다}.' }
    ]
  },
  {
    id: '491',
    word: 'submit',
    definitions: ['(동) 제출하다', '(동) 복종하다'],
    etymo: 'sub(아래로) + mittere(보내다)',
    examples: [
      { text: 'Please [submit] your application by Friday.', korean: '금요일까지 지원서를 {제출해} 주십시오.' },
      { text: 'The rebels refused to [submit] to the new government.', korean: '반군들은 새 정부에 {복종하는} 것을 거부했습니다.' }
    ]
  },
  {
    id: '492',
    word: 'abundant',
    definitions: ['(형) 풍부한, 많은', '(형) 넘치는'],
    etymo: 'ab(멀리) + undare(파도치다) + ant(형용사)',
    examples: [
      { text: 'The region has an [abundant] supply of fresh water.', korean: '그 지역은 신선한 물의 공급이 {풍부합니다}.' },
      { text: 'We have an [abundant] amount of food for the party.', korean: '우리는 파티를 위한 음식이 {넘치게 많이} 있습니다.' }
    ]
  },
  {
    id: '493',
    word: 'sneeze',
    definitions: ['(명) 재채기', '(동) 재채기하다'],
    etymo: 'fneosan(숨을 내뿜다)',
    examples: [
      { text: 'He covered his mouth to suppress a [sneeze].', korean: '그는 {재채기를} 참기 위해 입을 가렸습니다.' },
      { text: 'The dust makes me [sneeze].', korean: '먼지가 나를 {재채기하게} 만듭니다.' }
    ]
  },
  {
    id: '494',
    word: 'lease',
    definitions: ['(명) 임대 계약', '(동) 임대하다'],
    etymo: 'laxare(느슨하게 하다)',
    examples: [
      { text: 'Our apartment [lease] expires next month.', korean: '우리 아파트 {임대 계약이} 다음 달에 만료됩니다.' },
      { text: 'The company plans to [lease] a new office building.', korean: '회사는 새 사무실 건물을 {임대할} 계획입니다.' }
    ]
  },
  {
    id: '495',
    word: 'dine',
    definitions: ['(동) 식사하다', '(동) 공식적인 자리에서 식사하다'],
    etymo: 'dis(분리) + ieiunare(단식하다)',
    examples: [
      { text: 'We usually [dine] out on Friday nights.', korean: '우리는 보통 금요일 밤에 외식을 하며 {식사합니다}.' },
      { text: 'The president will [dine] with the ambassadors tonight.', korean: '대통령이 오늘 밤 대사들과 {공식적인 자리에서 식사할} 것입니다.' }
    ]
  },
  {
    id: '496',
    word: 'priority',
    definitions: ['(명) 우선순위', '(명) 긴급히 처리해야 할 사항'],
    etymo: 'prior(이전의) + ity(명사)',
    examples: [
      { text: 'Customer satisfaction is our top [priority].', korean: '고객 만족이 우리의 최우선 {우선순위입니다}.' },
      { text: 'Fixing the server is a high [priority] right now.', korean: '서버를 고치는 것이 지금 높은 {긴급히 처리해야 할 사항입니다}.' }
    ]
  },
  {
    id: '497',
    word: 'nominate',
    definitions: ['(동) 후보자로 지명하다', '(동) 임명하다'],
    etymo: 'nomen(이름) + ate(동사)',
    examples: [
      { text: 'I would like to [nominate] him for the award.', korean: '나는 그를 이 상의 후보로 {지명하고} 싶습니다.' },
      { text: 'The board will [nominate] a new director tomorrow.', korean: '이사회가 내일 새로운 이사를 {임명할} 것입니다.' }
    ]
  },
  {
    id: '498',
    word: 'observe',
    definitions: ['(동) 목격하다, 보다', '(동) 준수하다'],
    etymo: 'ob(앞에) + servare(지키다)',
    examples: [
      { text: 'Scientists [observe] the behavior of the animals.', korean: '과학자들은 동물의 행동을 {목격합니다(관찰합니다)}.' },
      { text: 'All visitors must [observe] the safety rules.', korean: '모든 방문객은 안전 규칙을 {준수해야} 합니다.' }
    ]
  },
  {
    id: '499',
    word: 'waste',
    definitions: ['(명) 낭비, 쓰레기', '(동) 낭비하다'],
    etymo: 'vastus(비어 있는, 황폐한)',
    examples: [
      { text: 'It is a [waste] of time to argue about this.', korean: '이것에 대해 논쟁하는 것은 시간 {낭비입니다}.' },
      { text: 'Do not [waste] your money on unnecessary things.', korean: '불필요한 것에 돈을 {낭비하지} 마십시오.' }
    ]
  },
  {
    id: '500',
    word: 'adjacent',
    definitions: ['(형) 인접한, 가까운', '(형) 가까운, 근접한'],
    etymo: 'ad(방향) + jacere(던지다, 눕다) + ent(형용사)',
    examples: [
      { text: 'The new hotel is [adjacent] to the shopping mall.', korean: '새 호텔은 쇼핑몰에 {인접해} 있습니다.' },
      { text: 'Their offices are [adjacent] to each other.', korean: '그들의 사무실은 서로 {가깝습니다}.' }
    ]
  }
];
// ==========================================
// DAY 11 WORDS (501 - 550)
// ==========================================
export const DAY_11_WORDS: Word[] = [
  {
    id: '501',
    word: 'conflict',
    definitions: ['(명) 갈등, 충돌', '(동) 충돌하다, 상충하다'],
    etymo: 'con(함께) + fligere(치다)',
    examples: [
      { text: 'They are trying to resolve the [conflict] peacefully.', korean: '그들은 평화롭게 {갈등을} 해결하려고 노력하고 있습니다.' },
      { text: 'His statement [conflicts] with the evidence.', korean: '그의 진술은 증거와 {상충합니다}.' }
    ]
  },
  {
    id: '502',
    word: 'target',
    definitions: ['(명) 목표', '(명) 표적, 정조준의 대상'],
    etymo: 'targe(방패) + et(작은)',
    examples: [
      { text: 'Our sales [target] for this year is very high.', korean: '올해 우리의 판매 {목표는} 매우 높습니다.' },
      { text: 'The archer hit the center of the [target].', korean: '궁수가 {표적의} 중앙을 맞혔습니다.' }
    ]
  },
  {
    id: '503',
    word: 'letterhead',
    definitions: ['(명) (편지지의) 편지 머리글', '(명) 회사 이름과 주소가 인쇄된 편지지'],
    etymo: 'letter(편지) + head(머리)',
    examples: [
      { text: 'Please print this contract on our official [letterhead]. ', korean: '이 계약서를 우리의 공식 {편지 머리글이 있는 편지지}에 인쇄해 주십시오.' },
      { text: 'The company logo is at the top of the [letterhead].', korean: '회사 로고가 {편지 머리글} 상단에 있습니다.' }
    ]
  },
  {
    id: '504',
    word: 'pertinent',
    definitions: ['(형) 관련 있는, 적절한'],
    etymo: 'per(완전히) + tenere(잡다) + ent(형용사)',
    examples: [
      { text: 'Please provide all [pertinent] information.', korean: '모든 {관련 있는} 정보를 제공해 주십시오.' },
      { text: 'His question was highly [pertinent] to the topic.', korean: '그의 질문은 그 주제에 매우 {적절했습니다}.' }
    ]
  },
  {
    id: '505',
    word: 'compensation',
    definitions: ['(명) 보상, 배상', '(명) 급여, 임금'],
    etymo: 'com(함께) + pendere(매달다) + tion(명사)',
    examples: [
      { text: 'He demanded [compensation] for the damage to his car.', korean: '그는 자신의 차 손상에 대한 {배상을} 요구했습니다.' },
      { text: 'The company offers an excellent [compensation] package.', korean: '그 회사는 훌륭한 {급여} 패키지를 제공합니다.' }
    ]
  },
  {
    id: '506',
    word: 'interview',
    definitions: ['(명) 면접', '(동) 인터뷰를 하다, 면접을 보다'],
    etymo: 'inter(서로) + view(보다)',
    examples: [
      { text: 'I have a job [interview] tomorrow morning.', korean: '나는 내일 아침 구직 {면접이} 있습니다.' },
      { text: 'The reporter will [interview] the famous actor.', korean: '기자가 그 유명한 배우를 {인터뷰할} 것입니다.' }
    ]
  },
  {
    id: '507',
    word: 'retire',
    definitions: ['(동) 은퇴하다', '(동) 물러나다, 퇴각하다'],
    etymo: 're(뒤로) + tirer(끌다)',
    examples: [
      { text: 'My father plans to [retire] next year.', korean: '나의 아버지는 내년에 {은퇴할} 계획입니다.' },
      { text: 'The general ordered his troops to [retire].', korean: '장군이 자신의 군대에게 {퇴각할} 것을 명령했습니다.' }
    ]
  },
  {
    id: '508',
    word: 'collective',
    definitions: ['(형) 집단의, 공동의', '(명) 집단, 공동체'],
    etymo: 'col(함께) + legere(모으다) + ive(형용사)',
    examples: [
      { text: 'It was a [collective] effort by the entire team.', korean: '그것은 전체 팀의 {공동의} 노력이었습니다.' },
      { text: 'They work well as a [collective].', korean: '그들은 하나의 {공동체로서} 일을 잘합니다.' }
    ]
  },
  {
    id: '509',
    word: 'annually',
    definitions: ['(부) 매년'],
    etymo: 'annus(년) + al(형용사) + ly(부사)',
    examples: [
      { text: 'The festival is held [annually] in July.', korean: '그 축제는 {매년} 7월에 열립니다.' },
      { text: 'We review our policies [annually].', korean: '우리는 우리의 정책을 {매년} 검토합니다.' }
    ]
  },
  {
    id: '510',
    word: 'found',
    definitions: ['(동) 설립하다, 창립하다', '(동) 발견했다, 찾았다'],
    etymo: 'fundus(바닥, 기초)',
    examples: [
      { text: 'They plan to [found] a new tech startup.', korean: '그들은 새로운 기술 스타트업을 {설립할} 계획입니다.' },
      { text: 'I [found] my lost keys under the sofa.', korean: '나는 소파 아래에서 잃어버린 열쇠를 {찾았습니다}.' }
    ]
  },
  {
    id: '511',
    word: 'discourage',
    definitions: ['(동) 단념시키다, 못 하게 하다', '(동) 사기를 꺾다'],
    etymo: 'dis(반대) + courage(용기)',
    examples: [
      { text: 'We must [discourage] people from littering.', korean: '우리는 사람들이 쓰레기를 버리지 {못 하게 해야} 합니다.' },
      { text: 'Do not let this failure [discourage] you.', korean: '이 실패가 당신의 {사기를 꺾게} 두지 마세요.' }
    ]
  },
  {
    id: '512',
    word: 'ticket',
    definitions: ['(명) 입장권, 관람권', '(명) 교통 위반 티켓, 벌금 통지서'],
    etymo: 'estiquier(고정하다)',
    examples: [
      { text: 'I bought a [ticket] for the concert.', korean: '나는 콘서트 {관람권을} 샀습니다.' },
      { text: 'He got a speeding [ticket] on his way home.', korean: '그는 집으로 가는 길에 과속 {벌금 통지서를} 받았습니다.' }
    ]
  },
  {
    id: '513',
    word: 'inquiry',
    definitions: ['(명) 질문, 문의', '(명) 조사, 연구'],
    etymo: 'in(안으로) + quaerere(묻다) + y(명사)',
    examples: [
      { text: 'Thank you for your recent [inquiry].', korean: '최근 {문의에} 감사드립니다.' },
      { text: 'The police are conducting a murder [inquiry].', korean: '경찰이 살인 {조사를} 진행하고 있습니다.' }
    ]
  },
  {
    id: '514',
    word: 'dominate',
    definitions: ['(동) 지배하다', '(동) 우위를 차지하다'],
    etymo: 'dominus(주인) + ate(동사)',
    examples: [
      { text: 'One company continues to [dominate] the market.', korean: '한 회사가 시장을 계속 {지배하고} 있습니다.' },
      { text: 'Our team [dominated] the game from the start.', korean: '우리 팀이 처음부터 경기에서 {우위를 차지했습니다}.' }
    ]
  },
  {
    id: '515',
    word: 'signal',
    definitions: ['(명) 신호', '(동) 신호를 보내다'],
    etymo: 'signum(표시) + al(명사)',
    examples: [
      { text: 'Wait for the green [signal] before crossing.', korean: '건너기 전에 녹색 {신호를} 기다리세요.' },
      { text: 'The bell will [signal] the end of the class.', korean: '종이 수업의 끝을 {신호로 보낼} 것입니다.' }
    ]
  },
  {
    id: '516',
    word: 'allergic',
    definitions: ['(형) 알레르기가 있는', '(형) 극도로 싫어하는'],
    etymo: 'allos(다른) + ergon(작용) + ic(형용사)',
    examples: [
      { text: 'I am [allergic] to cats and dogs.', korean: '나는 고양이와 개에 {알레르기가 있습니다}.' },
      { text: 'He seems to be [allergic] to hard work.', korean: '그는 힘든 일을 {극도로 싫어하는} 것 같습니다.' }
    ]
  },
  {
    id: '517',
    word: 'view',
    definitions: ['(명) 견해, 관점', '(명) 전망, 경치'],
    etymo: 'videre(보다)',
    examples: [
      { text: 'From my [view], this is a bad idea.', korean: '나의 {관점에서} 볼 때, 이것은 나쁜 생각입니다.' },
      { text: 'The hotel room has a beautiful ocean [view].', korean: '그 호텔 방은 아름다운 바다 {경치를} 가지고 있습니다.' }
    ]
  },
  {
    id: '518',
    word: 'spicy',
    definitions: ['(형) 매운', '(형) 자극적인, 흥미로운'],
    etymo: 'spice(향신료) + y(형용사)',
    examples: [
      { text: 'I love eating hot and [spicy] food.', korean: '나는 뜨겁고 {매운} 음식을 먹는 것을 좋아합니다.' },
      { text: 'He told a [spicy] story about the celebrity.', korean: '그는 그 유명인에 대한 {자극적인} 이야기를 했습니다.' }
    ]
  },
  {
    id: '519',
    word: 'entertain',
    definitions: ['(동) 즐겁게 하다', '(동) 접대하다'],
    etymo: 'inter(사이에) + tenere(잡다)',
    examples: [
      { text: 'The clown [entertained] the children at the party.', korean: '광대가 파티에서 아이들을 {즐겁게 했습니다}.' },
      { text: 'We often [entertain] clients at this restaurant.', korean: '우리는 종종 이 식당에서 고객들을 {접대합니다}.' }
    ]
  },
  {
    id: '520',
    word: 'manuscript',
    definitions: ['(명) 원고, 필사본'],
    etymo: 'manus(손) + scriptus(쓰인)',
    examples: [
      { text: 'The author finally submitted his [manuscript].', korean: '작가가 마침내 자신의 {원고를} 제출했습니다.' },
      { text: 'They found an ancient [manuscript] in the cave.', korean: '그들은 동굴에서 고대 {필사본을} 발견했습니다.' }
    ]
  },
  {
    id: '521',
    word: 'placement',
    definitions: ['(명) 배치, 놓기', '(명) 고용 배치'],
    etymo: 'place(장소) + ment(명사)',
    examples: [
      { text: 'The [placement] of the furniture makes the room look bigger.', korean: '가구의 {배치가} 방을 더 커 보이게 만듭니다.' },
      { text: 'The university offers a job [placement] service.', korean: '대학은 {고용 배치} 서비스를 제공합니다.' }
    ]
  },
  {
    id: '522',
    word: 'accumulation',
    definitions: ['(명) 축적, 누적'],
    etymo: 'ad(방향) + cumulare(쌓다) + tion(명사)',
    examples: [
      { text: 'The [accumulation] of wealth takes time.', korean: '부의 {축적은} 시간이 걸립니다.' },
      { text: 'There is a heavy [accumulation] of snow on the roof.', korean: '지붕에 눈이 무겁게 {누적되어} 있습니다.' }
    ]
  },
  {
    id: '523',
    word: 'hypothesis',
    definitions: ['(명) 가설', '(명) 추정'],
    etymo: 'hypo(아래에) + thesis(놓기)',
    examples: [
      { text: 'We conducted an experiment to test the [hypothesis].', korean: '우리는 그 {가설을} 시험하기 위해 실험을 진행했습니다.' },
      { text: 'His [hypothesis] about the market crash was correct.', korean: '시장 붕괴에 대한 그의 {추정은} 옳았습니다.' }
    ]
  },
  {
    id: '524',
    word: 'component',
    definitions: ['(명) 구성 요소, 부품', '(명) 성분, 재료'],
    etymo: 'com(함께) + ponere(놓다) + ent(명사)',
    examples: [
      { text: 'Trust is a vital [component] of any relationship.', korean: '신뢰는 모든 관계의 필수적인 {구성 요소입니다}.' },
      { text: 'We assemble the computer from various [components].', korean: '우리는 다양한 {부품들로} 컴퓨터를 조립합니다.' }
    ]
  },
  {
    id: '525',
    word: 'dehydrate',
    definitions: ['(동) 수분을 제거하다', '(동) 탈수 상태로 만들다'],
    etymo: 'de(분리) + hydor(물) + ate(동사)',
    examples: [
      { text: 'You can [dehydrate] fruit to preserve it longer.', korean: '과일을 더 오래 보존하기 위해 {수분을 제거할} 수 있습니다.' },
      { text: 'The intense heat will [dehydrate] you quickly.', korean: '극심한 열기는 당신을 빠르게 {탈수 상태로 만들} 것입니다.' }
    ]
  },
  {
    id: '526',
    word: 'fever',
    definitions: ['(명) 열, 발열', '(명) (비유적으로) 열정, 흥분'],
    etymo: 'febris(열)',
    examples: [
      { text: 'He stayed in bed because he had a high [fever].', korean: '그는 높은 {열이} 있어서 침대에 머물렀습니다.' },
      { text: 'The whole country was gripped by World Cup [fever].', korean: '온 나라가 월드컵의 {열정에} 사로잡혔습니다.' }
    ]
  },
  {
    id: '527',
    word: 'vaccinate',
    definitions: ['(동) 백신을 접종하다', '(동) ~에 대한 백신을 접종하다'],
    etymo: 'vacca(소) + inate(동사)',
    examples: [
      { text: 'It is important to [vaccinate] children against measles.', korean: '홍역에 대비해 아이들에게 {백신을 접종하는} 것은 중요합니다.' },
      { text: 'The clinic will [vaccinate] people for free.', korean: '그 병원은 사람들에게 무료로 {백신을 접종할} 것입니다.' }
    ]
  },
  {
    id: '528',
    word: 'contagious',
    definitions: ['(형) 전염성의', '(형) 영향을 주는'],
    etymo: 'con(함께) + tangere(만지다) + ous(형용사)',
    examples: [
      { text: 'Keep him isolated; the disease is highly [contagious].', korean: '그를 격리시키세요. 그 질병은 전염성이 매우 강합니다.' },
      { text: 'Her laughter is incredibly [contagious].', korean: '그녀의 웃음소리는 놀랍도록 {영향을 줍니다(전염성이 있습니다)}.' }
    ]
  },
  {
    id: '529',
    word: 'frigid',
    definitions: ['(형) 매우 추운', '(형) 냉담한'],
    etymo: 'frigere(차갑다) + id(형용사)',
    examples: [
      { text: 'They survived the [frigid] winter in the cabin.', korean: '그들은 오두막에서 {매우 추운} 겨울을 살아남았습니다.' },
      { text: 'She gave him a [frigid] look.', korean: '그녀는 그에게 {냉담한} 시선을 보냈습니다.' }
    ]
  },
  {
    id: '530',
    word: 'pollution',
    definitions: ['(명) 오염, 공해', '(명) 불법, 범죄'],
    etymo: 'polluere(더럽히다) + tion(명사)',
    examples: [
      { text: 'Air [pollution] is a serious problem in big cities.', korean: '대기 {오염은} 대도시에서 심각한 문제입니다.' },
      { text: 'The factory was fined for water [pollution].', korean: '그 공장은 수질 {공해로} 벌금을 물었습니다.' }
    ]
  },
  {
    id: '531',
    word: 'neighborhood',
    definitions: ['(명) 이웃, 인근', '(명) 지역사회'],
    etymo: 'neighbor(이웃) + hood(상태)',
    examples: [
      { text: 'We live in a quiet, friendly [neighborhood].', korean: '우리는 조용하고 친근한 {이웃(동네)에} 삽니다.' },
      { text: 'The park is a great asset to the [neighborhood].', korean: '그 공원은 {지역사회에} 훌륭한 자산입니다.' }
    ]
  },
  {
    id: '532',
    word: 'exhibit',
    definitions: ['(동) 전시하다', '(동) 드러내다, 보이다'],
    etymo: 'ex(밖으로) + habere(가지다)',
    examples: [
      { text: 'The museum will [exhibit] his early works.', korean: '박물관은 그의 초기 작품들을 {전시할} 것입니다.' },
      { text: 'Patients [exhibit] a variety of symptoms.', korean: '환자들은 다양한 증상을 {보입니다}.' }
    ]
  },
  {
    id: '533',
    word: 'turn',
    definitions: ['(동) 돌다, 방향을 바꾸다', '(동) 바뀌다, 전환하다'],
    etymo: 'tornare(돌리다)',
    examples: [
      { text: 'Take a left [turn] at the next intersection.', korean: '다음 교차로에서 왼쪽으로 {방향을 바꾸세요}.' },
      { text: 'The weather will [turn] cold tomorrow.', korean: '내일 날씨가 춥게 {바뀔} 것입니다.' }
    ]
  },
  {
    id: '534',
    word: 'vote',
    definitions: ['(명) 투표, 표', '(동) 투표하다'],
    etymo: 'votum(맹세, 소원)',
    examples: [
      { text: 'Every citizen has the right to [vote].', korean: '모든 시민은 {투표할} 권리가 있습니다.' },
      { text: 'She won the election by a single [vote].', korean: '그녀는 단 한 {표} 차이로 선거에서 이겼습니다.' }
    ]
  },
  {
    id: '535',
    word: 'coastal',
    definitions: ['(형) 해안의'],
    etymo: 'coast(해안) + al(형용사)',
    examples: [
      { text: 'The storm hit the [coastal] areas heavily.', korean: '폭풍이 {해안의} 지역들을 강타했습니다.' },
      { text: 'They live in a small [coastal] town.', korean: '그들은 작은 {해안의} 마을에 삽니다.' }
    ]
  },
  {
    id: '536',
    word: 'definitely',
    definitions: ['(부) 확실히, 분명히'],
    etymo: 'de(완전히) + finire(끝내다) + ly(부사)',
    examples: [
      { text: 'I will [definitely] attend the meeting tomorrow.', korean: '나는 내일 회의에 {확실히} 참석할 것입니다.' },
      { text: 'This is [definitely] the best movie of the year.', korean: '이것은 {분명히} 올해 최고의 영화입니다.' }
    ]
  },
  {
    id: '537',
    word: 'rest',
    definitions: ['(명) 휴식', '(명) 나머지'],
    etymo: 'restare(남다) / raestan(쉬다)',
    examples: [
      { text: 'You look tired; you should get some [rest].', korean: '당신은 피곤해 보입니다. {휴식을} 좀 취해야 합니다.' },
      { text: 'I will finish the [rest] of the work tomorrow.', korean: '나는 내일 업무의 {나머지를} 끝낼 것입니다.' }
    ]
  },
  {
    id: '538',
    word: 'prefer',
    definitions: ['(동) 더 좋아하다, 선호하다', '(동) 제안하다, 추천하다'],
    etymo: 'prae(앞에) + ferre(나르다)',
    examples: [
      { text: 'I [prefer] coffee to tea in the morning.', korean: '나는 아침에 차보다 커피를 {더 좋아합니다}.' },
      { text: 'Most customers [prefer] the new design.', korean: '대부분의 고객은 새로운 디자인을 {선호합니다}.' }
    ]
  },
  {
    id: '539',
    word: 'directory',
    definitions: ['(명) 목록, 안내 책자', '(명) 컴퓨터 파일 구조'],
    etymo: 'dirigere(안내하다) + ory(명사)',
    examples: [
      { text: 'Look up his number in the telephone [directory].', korean: '전화번호 {목록에서} 그의 번호를 찾아보세요.' },
      { text: 'Save the document in the main [directory].', korean: '주 {파일 구조(디렉터리)}에 문서를 저장하세요.' }
    ]
  },
  {
    id: '540',
    word: 'contain',
    definitions: ['(동) 포함하다, 담다', '(동) 억제하다, 통제하다'],
    etymo: 'con(함께) + tenere(잡다)',
    examples: [
      { text: 'This box [contains] fragile items.', korean: '이 상자는 깨지기 쉬운 물품들을 {담고 있습니다}.' },
      { text: 'Firefighters struggled to [contain] the blaze.', korean: '소방관들은 화재를 {억제하기} 위해 고군분투했습니다.' }
    ]
  },
  {
    id: '541',
    word: 'valuable',
    definitions: ['(형) 귀중한, 중요한', '(명) 귀중품'],
    etymo: 'value(가치) + able(형용사)',
    examples: [
      { text: 'This necklace is highly [valuable].', korean: '이 목걸이는 매우 {귀중합니다}.' },
      { text: 'Please lock your [valuables] in the safe.', korean: '{귀중품은} 금고에 잠가 두십시오.' }
    ]
  },
  {
    id: '542',
    word: 'charity',
    definitions: ['(명) 자선 단체', '(명) 자선 행위'],
    etymo: 'caritas(사랑, 애정)',
    examples: [
      { text: 'All proceeds will go to a local [charity].', korean: '모든 수익금은 지역 {자선 단체로} 갈 것입니다.' },
      { text: 'She did it out of [charity], not for money.', korean: '그녀는 돈을 위해서가 아니라 {자선 행위로} 그것을 했습니다.' }
    ]
  },
  {
    id: '543',
    word: 'approach',
    definitions: ['(동) 다가가다, 접근하다', '(명) 접근법, 방법'],
    etymo: 'ad(가까이) + prope(가까운)',
    examples: [
      { text: 'The train is [approaching] the station.', korean: '기차가 역에 {접근하고} 있습니다.' },
      { text: 'We need a new [approach] to this problem.', korean: '우리는 이 문제에 새로운 {접근법이} 필요합니다.' }
    ]
  },
  {
    id: '544',
    word: 'lock',
    definitions: ['(동) 잠그다', '(동) 고정시키다'],
    etymo: 'loc(자물쇠)',
    examples: [
      { text: 'Don\'t forget to [lock] the door before leaving.', korean: '떠나기 전에 문을 {잠그는} 것을 잊지 마세요.' },
      { text: 'Make sure the wheels [lock] in place.', korean: '바퀴가 제자리에 {고정되는지} 확인하세요.' }
    ]
  },
  {
    id: '545',
    word: 'plant',
    definitions: ['(명) 식물', '(명) 공장'],
    etymo: 'plantare(심다)',
    examples: [
      { text: 'Water the [plant] twice a week.', korean: '{식물에} 일주일에 두 번 물을 주세요.' },
      { text: 'The company opened a new manufacturing [plant].', korean: '회사가 새로운 제조 {공장을} 열었습니다.' }
    ]
  },
  {
    id: '546',
    word: 'province',
    definitions: ['(명) 주, 지방', '(명) (책임이나 업무의) 분야'],
    etymo: 'pro(앞에서) + vincere(정복하다)',
    examples: [
      { text: 'Quebec is the largest [province] in Canada.', korean: '퀘벡은 캐나다에서 가장 큰 {주입니다}.' },
      { text: 'Marketing is not really my [province].', korean: '마케팅은 사실 나의 {분야가} 아닙니다.' }
    ]
  },
  {
    id: '547',
    word: 'decade',
    definitions: ['(명) 10년'],
    etymo: 'dekas(10)',
    examples: [
      { text: 'The economy has grown steadily over the past [decade].', korean: '경제는 지난 {10년} 동안 꾸준히 성장했습니다.' },
      { text: 'She has been teaching for more than a [decade].', korean: '그녀는 {10년} 넘게 가르치고 있습니다.' }
    ]
  },
  {
    id: '548',
    word: 'appreciate',
    definitions: ['(동) 감사하다', '(동) 진가를 알아보다'],
    etymo: 'ad(방향) + pretium(가치)',
    examples: [
      { text: 'I really [appreciate] all your hard work.', korean: '당신의 모든 노고에 정말 {감사합니다}.' },
      { text: 'You need to taste it to [appreciate] its flavor.', korean: '그 맛의 {진가를 알아보려면} 그것을 맛보아야 합니다.' }
    ]
  },
  {
    id: '549',
    word: 'dental',
    definitions: ['(형) 치과의, 치아의', '(형) 치과용의'],
    etymo: 'dens(치아) + al(형용사)',
    examples: [
      { text: 'Regular [dental] checkups are important.', korean: '정기적인 {치과의} 검진은 중요합니다.' },
      { text: 'He needs to buy some [dental] floss.', korean: '그는 {치과용의} 치실을 좀 사야 합니다.' }
    ]
  },
  {
    id: '550',
    word: 'patronage',
    definitions: ['(명) 후원, 지원', '(명) 단골, 고객'],
    etymo: 'patron(후원자) + age(명사)',
    examples: [
      { text: 'The arts festival relies on government [patronage].', korean: '예술 축제는 정부의 {후원에} 의존합니다.' },
      { text: 'Thank you for your continued [patronage].', korean: '당신의 지속적인 {단골 거래(고객 이용)에} 감사드립니다.' }
    ]
  }
];

// ==========================================
// DAY 12 WORDS (551 - 600)
// ==========================================
export const DAY_12_WORDS: Word[] = [
  {
    id: '551',
    word: 'venue',
    definitions: ['(명) 행사 장소', '(명) 법정 관할지'],
    etymo: 'venire(오다)',
    examples: [
      { text: 'The hotel is a popular [venue] for weddings.', korean: '그 호텔은 결혼식을 위한 인기 있는 {행사 장소입니다}.' },
      { text: 'The lawyer requested a change of [venue] for the trial.', korean: '변호사는 재판의 {법정 관할지} 변경을 요청했습니다.' }
    ]
  },
  {
    id: '552',
    word: 'book',
    definitions: ['(명) 책', '(동) 예약하다'],
    etymo: 'boc(너도밤나무, 책)',
    examples: [
      { text: 'He is reading a [book] about history.', korean: '그는 역사에 관한 {책을} 읽고 있습니다.' },
      { text: 'I need to [book] a flight to London.', korean: '나는 런던행 비행기를 {예약해야} 합니다.' }
    ]
  },
  {
    id: '553',
    word: 'mechanic',
    definitions: ['(명) 기계공, 정비공', '(명) 기술, 방법'],
    etymo: 'mekhane(기계) + ic(명사)',
    examples: [
      { text: 'The [mechanic] repaired my car engine.', korean: '{정비공이} 내 자동차 엔진을 수리했습니다.' },
      { text: 'He understands the [mechanics] of writing code.', korean: '그는 코드 작성의 {기술을} 이해하고 있습니다.' }
    ]
  },
  {
    id: '554',
    word: 'fold',
    definitions: ['(동) 접다', '(동) 사업이나 활동을 중단하다'],
    etymo: 'faldan(접다)',
    examples: [
      { text: 'Please [fold] the paper in half.', korean: '종이를 반으로 {접어} 주십시오.' },
      { text: 'The small business was forced to [fold] last year.', korean: '그 소규모 사업체는 작년에 사업을 {중단해야} 했습니다.' }
    ]
  },
  {
    id: '555',
    word: 'achievement',
    definitions: ['(명) 성취, 달성'],
    etymo: 'achieve(성취하다) + ment(명사)',
    examples: [
      { text: 'Winning the award was a major [achievement].', korean: '그 상을 수상한 것은 주요한 {성취였습니다}.' },
      { text: 'We celebrate the [achievement] of our goals.', korean: '우리는 목표의 {달성을} 축하합니다.' }
    ]
  },
  {
    id: '556',
    word: 'supplier',
    definitions: ['(명) 공급자, 공급업체'],
    etymo: 'supply(공급하다) + er(사람)',
    examples: [
      { text: 'We need to find a new parts [supplier].', korean: '우리는 새로운 부품 {공급업체를} 찾아야 합니다.' },
      { text: 'They are the main [supplier] of raw materials.', korean: '그들이 원자재의 주요 {공급자입니다}.' }
    ]
  },
  {
    id: '557',
    word: 'conductor',
    definitions: ['(명) 지휘자', '(명) 전도체'],
    etymo: 'con(함께) + ducere(이끌다) + or(사람, 사물)',
    examples: [
      { text: 'The orchestra [conductor] raised his baton.', korean: '오케스트라 {지휘자가} 지휘봉을 들어올렸습니다.' },
      { text: 'Copper is an excellent [conductor] of electricity.', korean: '구리는 훌륭한 전기의 {전도체입니다}.' }
    ]
  },
  {
    id: '558',
    word: 'appointment',
    definitions: ['(명) 약속, 예약', '(명) 임명, 지명'],
    etymo: 'ad(방향) + point(점찍다) + ment(명사)',
    examples: [
      { text: 'I have a doctor\'s [appointment] at 3 PM.', korean: '나는 오후 3시에 의사와의 {예약이} 있습니다.' },
      { text: 'We announced the [appointment] of a new CEO.', korean: '우리는 새로운 최고경영자의 {임명을} 발표했습니다.' }
    ]
  },
  {
    id: '559',
    word: 'contribution',
    definitions: ['(명) 기여, 공헌', '(명) 기부금'],
    etymo: 'con(함께) + tribuere(주다) + tion(명사)',
    examples: [
      { text: 'Her [contribution] to the project was vital.', korean: '프로젝트에 대한 그녀의 {기여는} 필수적이었습니다.' },
      { text: 'We thank you for your generous financial [contribution].', korean: '당신의 관대한 재정적 {기부금에} 감사드립니다.' }
    ]
  },
  {
    id: '560',
    word: 'certain',
    definitions: ['(형) 특정한', '(형) 확신하는'],
    etymo: 'certus(확실한)',
    examples: [
      { text: 'This rule only applies under [certain] conditions.', korean: '이 규칙은 오직 {특정한} 조건하에서만 적용됩니다.' },
      { text: 'Are you [certain] that the meeting is today?', korean: '당신은 회의가 오늘이라는 것을 {확신합니까}?' }
    ]
  },
  {
    id: '561',
    word: 'personally',
    definitions: ['(부) 개인적으로', '(부) 직접적으로'],
    etymo: 'person(사람) + al(형용사) + ly(부사)',
    examples: [
      { text: 'I [personally] prefer the blue design.', korean: '나는 {개인적으로} 파란색 디자인을 선호합니다.' },
      { text: 'The manager [personally] handled the complaint.', korean: '매니저가 {직접적으로} 그 불만을 처리했습니다.' }
    ]
  },
  {
    id: '562',
    word: 'leave',
    definitions: ['(동) 떠나다', '(동) 남기다'],
    etymo: 'laefan(남기다)',
    examples: [
      { text: 'What time does your train [leave]?', korean: '당신의 기차는 몇 시에 {떠납니까}?' },
      { text: 'Please [leave] a message after the tone.', korean: '신호음 후에 메시지를 {남겨} 주십시오.' }
    ]
  },
  {
    id: '563',
    word: 'attachment',
    definitions: ['(명) 첨부 파일', '(명) 애착, 정서적 유대'],
    etymo: 'attach(붙이다) + ment(명사)',
    examples: [
      { text: 'Please see the [attachment] for more details.', korean: '자세한 내용은 {첨부 파일을} 확인해 주십시오.' },
      { text: 'Children form a strong [attachment] to their parents.', korean: '아이들은 부모에게 강한 {애착을} 형성합니다.' }
    ]
  },
  {
    id: '564',
    word: 'hand',
    definitions: ['(명) 손', '(명) 도움'],
    etymo: 'hand(손)',
    examples: [
      { text: 'She held the baby in her left [hand].', korean: '그녀는 왼쪽 {손으로} 아기를 안았습니다.' },
      { text: 'Can you give me a [hand] with this heavy box?', korean: '이 무거운 상자 드는 데 {도움} 좀 주시겠습니까?' }
    ]
  },
  {
    id: '565',
    word: 'postpone',
    definitions: ['(동) 연기하다, 미루다', '(동) 차일피일 미루다'],
    etymo: 'post(뒤로) + ponere(놓다)',
    examples: [
      { text: 'They had to [postpone] the meeting due to snow.', korean: '그들은 눈 때문에 회의를 {연기해야} 했습니다.' },
      { text: 'Do not [postpone] your dentist appointment again.', korean: '당신의 치과 예약을 다시 {미루지} 마세요.' }
    ]
  },
  {
    id: '566',
    word: 'regularly',
    definitions: ['(부) 정기적으로'],
    etymo: 'regula(규칙) + ar(형용사) + ly(부사)',
    examples: [
      { text: 'You should exercise [regularly] for good health.', korean: '좋은 건강을 위해 {정기적으로} 운동해야 합니다.' },
      { text: 'The equipment is inspected [regularly].', korean: '장비는 {정기적으로} 점검받습니다.' }
    ]
  },
  {
    id: '567',
    word: 'addition',
    definitions: ['(명) 추가, 덧셈', '(명) 부가물, 추가 부분'],
    etymo: 'ad(방향) + dare(주다) + tion(명사)',
    examples: [
      { text: 'The new employee is a great [addition] to the team.', korean: '새 직원은 팀에 훌륭한 {추가 부분(인재)입니다}.' },
      { text: 'In [addition] to his salary, he gets a bonus.', korean: '그는 급여에 {추가로} 보너스를 받습니다.' }
    ]
  },
  {
    id: '568',
    word: 'flier',
    definitions: ['(명) 광고 전단지', '(명) 항공편 승객'],
    etymo: 'fly(날다) + er(것, 사람)',
    examples: [
      { text: 'He handed out a promotional [flier] on the street.', korean: '그는 거리에서 홍보용 {광고 전단지를} 나누어 주었습니다.' },
      { text: 'She is a frequent [flier] on this airline.', korean: '그녀는 이 항공사의 자주 이용하는 {항공편 승객입니다}.' }
    ]
  },
  {
    id: '569',
    word: 'inefficient',
    definitions: ['(형) 비효율적인'],
    etymo: 'in(부정) + efficient(효율적인)',
    examples: [
      { text: 'The old heating system is highly [inefficient].', korean: '그 오래된 난방 시스템은 매우 {비효율적입니다}.' },
      { text: 'His [inefficient] methods wasted a lot of time.', korean: '그의 {비효율적인} 방법들이 많은 시간을 낭비했습니다.' }
    ]
  },
  {
    id: '570',
    word: 'avoid',
    definitions: ['(동) 피하다', '(동) 회피하다'],
    etymo: 'ex(밖으로) + vuidier(비우다)',
    examples: [
      { text: 'Try to [avoid] driving during rush hour.', korean: '출퇴근 시간에는 운전을 {피하도록} 하세요.' },
      { text: 'He has been trying to [avoid] answering the question.', korean: '그는 질문에 대답하는 것을 {회피하려고} 시도해 왔습니다.' }
    ]
  },
  {
    id: '571',
    word: 'stand',
    definitions: ['(동) 서다', '(동) 견디다, 참다'],
    etymo: 'standan(서다)',
    examples: [
      { text: 'Please [stand] up when the judge enters.', korean: '판사가 들어오면 {서} 주십시오(일어서 주십시오).' },
      { text: 'I cannot [stand] this hot weather anymore.', korean: '나는 이 더운 날씨를 더 이상 {견딜} 수 없습니다.' }
    ]
  },
  {
    id: '572',
    word: 'entertainment',
    definitions: ['(명) 오락, 여흥', '(명) 연예, 공연'],
    etymo: 'entertain(즐겁게 하다) + ment(명사)',
    examples: [
      { text: 'The city offers a wide variety of [entertainment].', korean: '그 도시는 매우 다양한 {오락을} 제공합니다.' },
      { text: 'They hired a band for the evening\'s [entertainment].', korean: '그들은 저녁의 {공연을} 위해 밴드를 고용했습니다.' }
    ]
  },
  {
    id: '573',
    word: 'tournament',
    definitions: ['(명) 대회, 토너먼트', '(명) 시합'],
    etymo: 'tornare(돌다) + ment(명사)',
    examples: [
      { text: 'He won first place in the chess [tournament].', korean: '그는 체스 {대회에서} 1등을 차지했습니다.' },
      { text: 'The basketball [tournament] starts next week.', korean: '농구 {토너먼트가} 다음 주에 시작됩니다.' }
    ]
  },
  {
    id: '574',
    word: 'pack',
    definitions: ['(동) 짐을 싸다', '(동) 포장하다'],
    etymo: 'pak(꾸러미)',
    examples: [
      { text: 'I need to [pack] my suitcase for the trip.', korean: '나는 여행을 위해 가방에 {짐을 싸야} 합니다.' },
      { text: 'Please [pack] the glasses carefully.', korean: '유리잔들을 주의 깊게 {포장해} 주십시오.' }
    ]
  },
  {
    id: '575',
    word: 'reduced',
    definitions: ['(형) 감소된, 축소된', '(형) 할인된'],
    etymo: 're(뒤로) + ducere(이끌다) + ed(과거분사)',
    examples: [
      { text: 'The store sells items at [reduced] prices.', korean: '상점은 {할인된} 가격에 품목들을 판매합니다.' },
      { text: 'They are operating with a [reduced] staff today.', korean: '그들은 오늘 {축소된} 인력으로 운영하고 있습니다.' }
    ]
  },
  {
    id: '576',
    word: 'retailer',
    definitions: ['(명) 소매업자, 소매점'],
    etymo: 're(다시) + taillier(자르다) + er(사람)',
    examples: [
      { text: 'This product is available at any major [retailer].', korean: '이 제품은 주요 {소매점에서} 구입할 수 있습니다.' },
      { text: 'The [retailer] lowered prices to attract more customers.', korean: '그 {소매업자는} 더 많은 고객을 유치하기 위해 가격을 내렸습니다.' }
    ]
  },
  {
    id: '577',
    word: 'directions',
    definitions: ['(명) 지시', '(명) 길 안내'],
    etymo: 'di(분리) + regere(이끌다) + tion(명사) + s(복수형)',
    examples: [
      { text: 'Follow the [directions] on the back of the box.', korean: '상자 뒷면의 {지시를} 따르십시오.' },
      { text: 'Can you give me [directions] to the train station?', korean: '기차역으로 가는 {길 안내} 좀 해 주시겠습니까?' }
    ]
  },
  {
    id: '578',
    word: 'railing',
    definitions: ['(명) 난간'],
    etymo: 'rail(막대기) + ing(명사)',
    examples: [
      { text: 'Hold onto the hand [railing] while walking down the stairs.', korean: '계단을 내려갈 때 손 {난간을} 잡으세요.' },
      { text: 'The balcony is surrounded by an iron [railing].', korean: '발코니는 철제 {난간으로} 둘러싸여 있습니다.' }
    ]
  },
  {
    id: '579',
    word: 'belong',
    definitions: ['(동) 속하다', '(동) 어울리다, 적합하다'],
    etymo: 'be(강조) + long(오래 있다)',
    examples: [
      { text: 'This book [belongs] to the public library.', korean: '이 책은 공공 도서관에 {속합니다}.' },
      { text: 'You [belong] in a leadership position.', korean: '당신은 리더십 자리에 {어울립니다}.' }
    ]
  },
  {
    id: '580',
    word: 'traditional',
    definitions: ['(형) 전통적인', '(형) 구식의'],
    etymo: 'trans(건너서) + dare(주다) + tion(명사) + al(형용사)',
    examples: [
      { text: 'We ate a [traditional] Korean meal for dinner.', korean: '우리는 저녁으로 {전통적인} 한국 음식을 먹었습니다.' },
      { text: 'He prefers a more [traditional] approach to business.', korean: '그는 사업에 대해 더 {구식의(전통적인)} 접근법을 선호합니다.' }
    ]
  },
  {
    id: '581',
    word: 'electricity',
    definitions: ['(명) 전기'],
    etymo: 'elektron(호박) + ity(명사)',
    examples: [
      { text: 'The storm knocked out the [electricity] in our town.', korean: '폭풍이 우리 마을의 {전기를} 끊었습니다.' },
      { text: 'Solar panels generate [electricity] from sunlight.', korean: '태양열 패널은 햇빛으로부터 {전기를} 생성합니다.' }
    ]
  },
  {
    id: '582',
    word: 'injure',
    definitions: ['(동) 상처를 입히다, 부상을 입히다', '(동) 해치다, 손상시키다'],
    etymo: 'in(부정) + jus(법)',
    examples: [
      { text: 'He severely [injured] his knee during the game.', korean: '그는 경기 중 무릎에 심각한 {부상을 입었습니다}.' },
      { text: 'The scandal could [injure] his reputation.', korean: '그 스캔들은 그의 평판을 {해칠} 수 있습니다.' }
    ]
  },
  {
    id: '583',
    word: 'patient',
    definitions: ['(명) 환자', '(형) 참을성 있는, 인내심 있는'],
    etymo: 'pati(고통받다) + ent(명사/형용사)',
    examples: [
      { text: 'The doctor examined the [patient] carefully.', korean: '의사는 {환자를} 주의 깊게 진찰했습니다.' },
      { text: 'Please be [patient]; we are working as fast as we can.', korean: '{참을성을 가지}십시오. 우리는 가능한 한 빨리 일하고 있습니다.' }
    ]
  },
  {
    id: '584',
    word: 'weed',
    definitions: ['(명) 잡초', '(동) 잡초를 제거하다'],
    etymo: 'weod(풀)',
    examples: [
      { text: 'The garden is completely overgrown with [weeds].', korean: '정원은 {잡초로} 완전히 무성해졌습니다.' },
      { text: 'I need to [weed] the flower beds this weekend.', korean: '나는 이번 주말에 화단의 {잡초를 제거해야} 합니다.' }
    ]
  },
  {
    id: '585',
    word: 'patience',
    definitions: ['(명) 인내심', '(명) 참을성'],
    etymo: 'pati(고통받다) + ence(명사)',
    examples: [
      { text: 'Teaching young children requires a lot of [patience].', korean: '어린아이들을 가르치는 것은 많은 {인내심을} 필요로 합니다.' },
      { text: 'My [patience] is finally running out.', korean: '나의 {참을성이} 마침내 바닥나고 있습니다.' }
    ]
  },
  {
    id: '586',
    word: 'probably',
    definitions: ['(부) 아마도'],
    etymo: 'probabilis(증명할 수 있는) + ly(부사)',
    examples: [
      { text: 'He will [probably] arrive late due to traffic.', korean: '그는 교통 체증 때문에 {아마도} 늦게 도착할 것입니다.' },
      { text: 'It is [probably] the best restaurant in town.', korean: '이곳은 {아마도} 시내 최고의 식당일 것입니다.' }
    ]
  },
  {
    id: '587',
    word: 'water',
    definitions: ['(명) 물', '(동) 물을 주다'],
    etymo: 'waeter(물)',
    examples: [
      { text: 'Please bring me a glass of cold [water].', korean: '시원한 {물} 한 잔 가져다주세요.' },
      { text: 'Don\'t forget to [water] the plants while I am away.', korean: '내가 없는 동안 식물에 {물을 주는} 것을 잊지 마세요.' }
    ]
  },
  {
    id: '588',
    word: 'save',
    definitions: ['(동) 저축하다', '(동) 구하다'],
    etymo: 'salvare(구하다)',
    examples: [
      { text: 'She is trying to [save] money to buy a house.', korean: '그녀는 집을 사기 위해 돈을 {저축하려} 노력하고 있습니다.' },
      { text: 'The brave firefighter [saved] the child from the fire.', korean: '용감한 소방관이 불길에서 아이를 {구했습니다}.' }
    ]
  },
  {
    id: '589',
    word: 'position',
    definitions: ['(명) 위치, 자리', '(명) 직위, 일자리'],
    etymo: 'ponere(놓다) + tion(명사)',
    examples: [
      { text: 'Put the desk in its original [position].', korean: '책상을 원래 {위치(자리)에} 놓으세요.' },
      { text: 'She applied for a management [position] at the firm.', korean: '그녀는 회사의 관리직 {일자리에} 지원했습니다.' }
    ]
  },
  {
    id: '590',
    word: 'activate',
    definitions: ['(동) 작동시키다', '(동) 활성화하다'],
    etymo: 'actus(행위) + ive(형용사) + ate(동사)',
    examples: [
      { text: 'You need to [activate] your credit card before using it.', korean: '사용하기 전에 신용카드를 {활성화해야} 합니다.' },
      { text: 'The alarm is [activated] by motion.', korean: '그 경보기는 움직임에 의해 {작동됩니다}.' }
    ]
  },
  {
    id: '591',
    word: 'alteration',
    definitions: ['(명) 변경, 수정'],
    etymo: 'alter(다른) + ation(명사)',
    examples: [
      { text: 'We need to make a slight [alteration] to the design.', korean: '우리는 디자인에 약간의 {변경을} 가해야 합니다.' },
      { text: 'The tailor will make the necessary [alterations] to the suit.', korean: '재단사가 정장에 필요한 {수정을} 할 것입니다.' }
    ]
  },
  {
    id: '592',
    word: 'artifact',
    definitions: ['(명) 인공물, 유물', '(명) 인위적 산물, 부작용'],
    etymo: 'arte(기술로) + factum(만들어진 것)',
    examples: [
      { text: 'The museum displayed an ancient Roman [artifact]. ', korean: '그 박물관은 고대 로마의 {유물을} 전시했습니다.' },
      { text: 'The strange light on the photo was just a camera [artifact].', korean: '사진의 이상한 빛은 단지 카메라의 {인위적 산물(결함)이었습니다}.' }
    ]
  },
  {
    id: '593',
    word: 'assessment',
    definitions: ['(명) 평가', '(명) 검토'],
    etymo: 'ad(방향) + sedere(앉다) + ment(명사)',
    examples: [
      { text: 'The teacher gave a fair [assessment] of my performance.', korean: '선생님은 나의 성과에 대해 공정한 {평가를} 내렸습니다.' },
      { text: 'A thorough environmental [assessment] is required.', korean: '철저한 환경 {검토가} 요구됩니다.' }
    ]
  },
  {
    id: '594',
    word: 'flammable',
    definitions: ['(형) 가연성의, 불이 붙기 쉬운', '(명) 가연물'],
    etymo: 'flamma(불꽃) + able(가능한)',
    examples: [
      { text: 'Keep this highly [flammable] liquid away from heat.', korean: '이 매우 {불이 붙기 쉬운} 액체를 열에서 멀리 두세요.' },
      { text: 'Store [flammables] in a safe, cool place.', korean: '{가연물들은} 안전하고 서늘한 곳에 보관하세요.' }
    ]
  },
  {
    id: '595',
    word: 'integral',
    definitions: ['(형) 필수적인', '(형) 완전한'],
    etymo: 'in(부정) + tangere(만지다) + al(형용사)',
    examples: [
      { text: 'Teamwork is an [integral] part of our success.', korean: '팀워크는 우리 성공의 {필수적인} 부분입니다.' },
      { text: 'These tools are [integral] to the repair process.', korean: '이 도구들은 수리 과정에 {필수적입니다}.' }
    ]
  },
  {
    id: '596',
    word: 'inaugural',
    definitions: ['(형) 취임의', '(형) 첫 번째의, 개시의'],
    etymo: 'in(안으로) + augurare(점치다) + al(형용사)',
    examples: [
      { text: 'The president delivered his [inaugural] address yesterday.', korean: '대통령은 어제 {취임} 연설을 했습니다.' },
      { text: 'They attended the [inaugural] meeting of the committee.', korean: '그들은 위원회의 {첫 번째(개시)} 회의에 참석했습니다.' }
    ]
  },
  {
    id: '597',
    word: 'intensive',
    definitions: ['(형) 집중적인', '(형) 강한, 강력한'],
    etymo: 'in(안으로) + tendere(뻗다) + ive(형용사)',
    examples: [
      { text: 'He completed a two-week [intensive] training course.', korean: '그는 2주간의 {집중적인} 훈련 과정을 마쳤습니다.' },
      { text: 'The hospital has a new [intensive] care unit.', korean: '그 병원은 새로운 {집중(중환자)} 치료실을 갖추고 있습니다.' }
    ]
  },
  {
    id: '598',
    word: 'statistics',
    definitions: ['(명) 통계, 통계 자료', '(명) 통계학'],
    etymo: 'status(상태, 국가) + ics(학문)',
    examples: [
      { text: 'The latest [statistics] show a drop in crime rates.', korean: '최신 {통계 자료는} 범죄율의 감소를 보여줍니다.' },
      { text: 'She decided to major in [statistics] at college.', korean: '그녀는 대학에서 {통계학을} 전공하기로 결정했습니다.' }
    ]
  },
  {
    id: '599',
    word: 'overwhelming',
    definitions: ['(형) 압도적인, 강력한', '(형) 극도의, 극심한'],
    etymo: 'over(위에) + whelm(뒤집다) + ing(현재분사)',
    examples: [
      { text: 'They won the election with an [overwhelming] majority.', korean: '그들은 {압도적인} 다수로 선거에서 이겼습니다.' },
      { text: 'The support from the community was [overwhelming].', korean: '지역 사회의 지지는 {극도의(강력한)} 것이었습니다.' }
    ]
  },
  {
    id: '600',
    word: 'void',
    definitions: ['(명) 빈 공간', '(형) 무효의'],
    etymo: 'vocuus(빈)',
    examples: [
      { text: 'His sudden departure left a great [void] in the team.', korean: '그의 갑작스러운 떠남은 팀에 큰 {빈 공간을} 남겼습니다.' },
      { text: 'The contract is declared null and [void].', korean: '그 계약은 법적 효력이 없고 {무효인} 것으로 선언되었습니다.' }
    ]
  }
];
// ==========================================
// DAY 13 WORDS (601 - 650)
// ==========================================
export const DAY_13_WORDS: Word[] = [
  {
    id: '601',
    word: 'tactic',
    definitions: ['(명) 전술, 전략, 방법', '(명) 약삭빠르게 사용하는 수단'],
    etymo: 'taktikos(배열의, 전술의)',
    examples: [
      { text: 'They used a clever marketing [tactic].', korean: '그들은 영리한 마케팅 {전술을} 사용했습니다.' },
      { text: 'Delaying the meeting was a deliberate [tactic].', korean: '회의를 미루는 것은 의도적인 {수단이었습니다}.' }
    ]
  },
  {
    id: '602',
    word: 'heritage',
    definitions: ['(명) 문화유산', '(명) 전통'],
    etymo: 'heres(상속인) + age(명사)',
    examples: [
      { text: 'The building is part of our national [heritage].', korean: '그 건물은 우리 국가 {문화유산의} 일부입니다.' },
      { text: 'We are proud of our rich cultural [heritage].', korean: '우리는 우리의 풍부한 문화적 {전통을} 자랑스럽게 생각합니다.' }
    ]
  },
  {
    id: '603',
    word: 'discard',
    definitions: ['(동) 버리다', '(동) 없애다, 제거하다'],
    etymo: 'dis(분리) + card(카드)',
    examples: [
      { text: 'Please [discard] your trash in the bin.', korean: '쓰레기는 휴지통에 {버려} 주십시오.' },
      { text: 'They decided to [discard] the old policy.', korean: '그들은 낡은 정책을 {없애기로} 결정했습니다.' }
    ]
  },
  {
    id: '604',
    word: 'disposable',
    definitions: ['(형) 일회용의', '(명) 일회용품'],
    etymo: 'dispose(처분하다) + able(가능한)',
    examples: [
      { text: 'We bought [disposable] plates for the picnic.', korean: '우리는 소풍을 위해 {일회용의} 접시를 샀습니다.' },
      { text: 'Avoid using plastic [disposables] if possible.', korean: '가능하다면 플라스틱 {일회용품} 사용을 피하세요.' }
    ]
  },
  {
    id: '605',
    word: 'chronicle',
    definitions: ['(명) 연대기, 기록', '(동) 기록하다, 연대순으로 이야기하다'],
    etymo: 'khronos(시간) + icle(명사)',
    examples: [
      { text: 'The book is a [chronicle] of the war.', korean: '그 책은 전쟁에 대한 {연대기입니다}.' },
      { text: 'The documentary [chronicles] the history of the city.', korean: '그 다큐멘터리는 도시의 역사를 {기록합니다}.' }
    ]
  },
  {
    id: '606',
    word: 'fundraising',
    definitions: ['(명) 자금 모금 활동', '(명) 자금 조달'],
    etymo: 'fund(기금) + raise(올리다) + ing(명사)',
    examples: [
      { text: 'The charity organized a [fundraising] event.', korean: '자선단체가 {자금 모금 활동} 행사를 조직했습니다.' },
      { text: 'Our main goal this month is [fundraising].', korean: '이번 달 우리의 주요 목표는 {자금 조달입니다}.' }
    ]
  },
  {
    id: '607',
    word: 'pertain',
    definitions: ['(동) 관련되다', '(동) 적용되다'],
    etymo: 'per(완전히) + tenere(잡다)',
    examples: [
      { text: 'These rules [pertain] to all employees.', korean: '이 규칙들은 모든 직원들에게 {적용됩니다}.' },
      { text: 'Please send documents that [pertain] to the case.', korean: '그 사건에 {관련된} 서류를 보내 주십시오.' }
    ]
  },
  {
    id: '608',
    word: 'consideration',
    definitions: ['(명) 고려', '(명) 배려'],
    etymo: 'consider(고려하다) + ation(명사)',
    examples: [
      { text: 'The proposal is currently under [consideration].', korean: '그 제안은 현재 {고려} 중입니다.' },
      { text: 'Show some [consideration] for other people.', korean: '다른 사람들에 대한 {배려를} 좀 보여주세요.' }
    ]
  },
  {
    id: '609',
    word: 'distributed',
    definitions: ['(형) 분배된, 배포된', '(형) 퍼진, 흩어진'],
    etymo: 'dis(따로) + tribuere(할당하다) + ed(과거분사)',
    examples: [
      { text: 'The widely [distributed] magazine is very popular.', korean: '널리 {배포된} 그 잡지는 매우 인기가 있습니다.' },
      { text: 'We have a [distributed] network of offices.', korean: '우리는 {흩어진(분산된)} 사무실 네트워크를 가지고 있습니다.' }
    ]
  },
  {
    id: '610',
    word: 'loss',
    definitions: ['(명) 손실', '(명) 감량, 감소'],
    etymo: 'losian(멸망하다, 잃다)',
    examples: [
      { text: 'The company suffered a huge financial [loss].', korean: '회사는 거대한 재정적 {손실을} 입었습니다.' },
      { text: 'Diet and exercise promote weight [loss].', korean: '식단과 운동은 체중 {감량을} 촉진합니다.' }
    ]
  },
  {
    id: '611',
    word: 'experience',
    definitions: ['(명) 경험', '(동) 경험하다'],
    etymo: 'ex(밖으로) + periri(시도하다)',
    examples: [
      { text: 'She has ten years of [experience] in marketing.', korean: '그녀는 마케팅 분야에서 10년의 {경험을} 가지고 있습니다.' },
      { text: 'We will [experience] some delays today.', korean: '우리는 오늘 약간의 지연을 {경험할} 것입니다.' }
    ]
  },
  {
    id: '612',
    word: 'local',
    definitions: ['(형) 특정 지역의, 현지의', '(명) 지역 주민'],
    etymo: 'locus(장소) + al(형용사)',
    examples: [
      { text: 'We prefer to buy [local] produce.', korean: '우리는 {현지의} 농산물을 사는 것을 선호합니다.' },
      { text: 'The [locals] are very friendly here.', korean: '이곳의 {지역 주민들은} 매우 친절합니다.' }
    ]
  },
  {
    id: '613',
    word: 'predict',
    definitions: ['(동) 예측하다', '(동) 전망하다'],
    etymo: 'prae(미리) + dicere(말하다)',
    examples: [
      { text: 'It is hard to [predict] the weather accurately.', korean: '날씨를 정확하게 {예측하기는} 어렵습니다.' },
      { text: 'Experts [predict] an economic boom next year.', korean: '전문가들은 내년에 경제 호황을 {전망합니다}.' }
    ]
  },
  {
    id: '614',
    word: 'regarding',
    definitions: ['(전) 무엇에 관하여', '(전) ~과 관련하여'],
    etymo: 'regard(간주하다) + ing(현재분사형 전치사)',
    examples: [
      { text: 'I am writing [regarding] your recent inquiry.', korean: '당신의 최근 문의에 {관하여} 글을 씁니다.' },
      { text: 'Do you have any questions [regarding] the policy?', korean: '그 정책과 {관련하여} 질문이 있으십니까?' }
    ]
  },
  {
    id: '615',
    word: 'accordingly',
    definitions: ['(부) 그에 맞춰, 부응하여', '(부) 따라서, 그러므로'],
    etymo: 'accord(일치하다) + ing(분사) + ly(부사)',
    examples: [
      { text: 'Please review the rules and act [accordingly].', korean: '규칙을 검토하고 {그에 맞춰} 행동해 주십시오.' },
      { text: 'Sales fell, and [accordingly], profits dropped.', korean: '매출이 감소했고, {따라서} 수익이 떨어졌습니다.' }
    ]
  },
  {
    id: '616',
    word: 'limited',
    definitions: ['(형) 제한된, 한정된', '(형) 부족한, 충분하지 않은'],
    etymo: 'limes(경계) + ed(형용사)',
    examples: [
      { text: 'This offer is available for a [limited] time only.', korean: '이 제안은 {한정된} 시간 동안만 유효합니다.' },
      { text: 'We have very [limited] resources for this project.', korean: '우리는 이 프로젝트를 위한 자원이 매우 {부족합니다}.' }
    ]
  },
  {
    id: '617',
    word: 'expiration',
    definitions: ['(명) 만료', '(명) 종료'],
    etymo: 'ex(밖으로) + spirare(숨쉬다) + tion(명사)',
    examples: [
      { text: 'Please check the [expiration] date on the milk.', korean: '우유의 {만료(유통기한)} 날짜를 확인해 주세요.' },
      { text: 'Your membership is nearing [expiration].', korean: '당신의 멤버십이 {종료에} 가까워지고 있습니다.' }
    ]
  },
  {
    id: '618',
    word: 'automated',
    definitions: ['(형) 자동화된', '(형) 자동으로 작동하는'],
    etymo: 'auto(스스로) + matos(생각하는) + ed(과거분사)',
    examples: [
      { text: 'The factory uses an [automated] assembly line.', korean: '그 공장은 {자동화된} 조립 라인을 사용합니다.' },
      { text: 'You will receive an [automated] email response.', korean: '당신은 {자동으로 작동하는} 이메일 답변을 받을 것입니다.' }
    ]
  },
  {
    id: '619',
    word: 'enclosed',
    definitions: ['(형) 동봉된', '(형) 둘러싸인'],
    etymo: 'en(안으로) + claudere(닫다) + ed(과거분사)',
    examples: [
      { text: 'Please find the [enclosed] document for your review.', korean: '검토를 위해 {동봉된} 서류를 확인해 주십시오.' },
      { text: 'The garden is completely [enclosed] by a wall.', korean: '그 정원은 벽으로 완전히 {둘러싸여} 있습니다.' }
    ]
  },
  {
    id: '620',
    word: 'accomplished',
    definitions: ['(형) 능숙한, 성취한', '(형) 기량이 뛰어난'],
    etymo: 'ad(방향) + complere(채우다) + ed(형용사)',
    examples: [
      { text: 'She is an [accomplished] pianist.', korean: '그녀는 {기량이 뛰어난} 피아니스트입니다.' },
      { text: 'He is highly [accomplished] in the field of medicine.', korean: '그는 의학 분야에서 매우 {성취한} 사람입니다.' }
    ]
  },
  {
    id: '621',
    word: 'stable',
    definitions: ['(형) 안정된', '(형) 변하지 않는, 견고한'],
    etymo: 'stare(서다) + able(가능한)',
    examples: [
      { text: 'The patient is in a [stable] condition.', korean: '환자는 {안정된} 상태에 있습니다.' },
      { text: 'We need a strong and [stable] structure.', korean: '우리는 튼튼하고 {견고한} 구조가 필요합니다.' }
    ]
  },
  {
    id: '622',
    word: 'mutually',
    definitions: ['(부) 상호 간에', '(부) 서로 간에'],
    etymo: 'mutuus(빌려준, 교환된) + ly(부사)',
    examples: [
      { text: 'The agreement was [mutually] beneficial.', korean: '그 합의는 {상호 간에} 유익했습니다.' },
      { text: 'They reached a [mutually] acceptable compromise.', korean: '그들은 {서로 간에} 수용 가능한 타협에 도달했습니다.' }
    ]
  },
  {
    id: '623',
    word: 'prescription',
    definitions: ['(명) 처방전', '(명) 권장 사항'],
    etymo: 'prae(미리) + scribere(쓰다) + tion(명사)',
    examples: [
      { text: 'You need a [prescription] to buy this medicine.', korean: '이 약을 사려면 {처방전이} 필요합니다.' },
      { text: 'His [prescription] for success is hard work.', korean: '성공을 위한 그의 {권장 사항은} 열심히 일하는 것입니다.' }
    ]
  },
  {
    id: '624',
    word: 'cancellation',
    definitions: ['(명) 취소', '(명) 무효화'],
    etymo: 'cancel(취소하다) + ation(명사)',
    examples: [
      { text: 'We require a 24-hour notice for a [cancellation].', korean: '{취소} 시 24시간 전에 알려주셔야 합니다.' },
      { text: 'The storm led to the [cancellation] of all flights.', korean: '폭풍으로 인해 모든 비행편의 {무효화가(취소가)} 발생했습니다.' }
    ]
  },
  {
    id: '625',
    word: 'price',
    definitions: ['(명) 가격', '(동) 가격을 매기다'],
    etymo: 'pretium(가치, 보상)',
    examples: [
      { text: 'The regular [price] of the shirt is $50.', korean: '이 셔츠의 정규 {가격은} 50달러입니다.' },
      { text: 'The items are [priced] to sell quickly.', korean: '그 물품들은 빨리 팔리도록 {가격이 매겨져} 있습니다.' }
    ]
  },
  {
    id: '626',
    word: 'carefully',
    definitions: ['(부) 주의 깊게, 신중하게', '(부) 세심하게'],
    etymo: 'care(주의) + ful(가득한) + ly(부사)',
    examples: [
      { text: 'Please read the instructions [carefully].', korean: '설명서를 {주의 깊게} 읽어 주십시오.' },
      { text: 'He packed the fragile glasses very [carefully].', korean: '그는 깨지기 쉬운 유리잔들을 매우 {세심하게} 포장했습니다.' }
    ]
  },
  {
    id: '627',
    word: 'foremost',
    definitions: ['(형) 가장 중요한', '(형) 선두의, 일류의'],
    etymo: 'fore(앞에) + most(가장)',
    examples: [
      { text: 'Safety is our [foremost] concern.', korean: '안전이 우리의 {가장 중요한} 관심사입니다.' },
      { text: 'She is the world\'s [foremost] expert on the subject.', korean: '그녀는 그 주제에 대한 세계 {일류의} 전문가입니다.' }
    ]
  },
  {
    id: '628',
    word: 'generously',
    definitions: ['(부) 아낌없이, 관대하게', '(부) 후하게'],
    etymo: 'generous(관대한) + ly(부사)',
    examples: [
      { text: 'He [generously] donated to the local charity.', korean: '그는 지역 자선단체에 {아낌없이} 기부했습니다.' },
      { text: 'The portions at this restaurant are [generously] sized.', korean: '이 식당의 1인분은 {후하게} 큽니다.' }
    ]
  },
  {
    id: '629',
    word: 'specialization',
    definitions: ['(명) 전문화', '(명) 특수화'],
    etymo: 'specialis(특별한) + ize(동사화) + ation(명사)',
    examples: [
      { text: 'His area of [specialization] is ancient history.', korean: '그의 {전문화} 분야는 고대 역사입니다.' },
      { text: 'Medical [specialization] leads to better treatments.', korean: '의학적 {특수화는} 더 나은 치료로 이어집니다.' }
    ]
  },
  {
    id: '630',
    word: 'preparation',
    definitions: ['(명) 준비, 준비 작업', '(명) 대비, 대비책'],
    etymo: 'prae(미리) + parare(준비하다) + tion(명사)',
    examples: [
      { text: 'The event requires months of careful [preparation].', korean: '그 행사는 몇 달간의 신중한 {준비 작업이} 필요합니다.' },
      { text: 'In [preparation] for the storm, we bought food.', korean: '폭풍에 대한 {대비로}, 우리는 음식을 샀습니다.' }
    ]
  },
  {
    id: '631',
    word: 'transition',
    definitions: ['(명) 변화, 전환', '(동) 변천하다, 전환하다'],
    etymo: 'trans(가로질러) + ire(가다) + tion(명사)',
    examples: [
      { text: 'The company is in a period of [transition].', korean: '그 회사는 {전환}의 시기에 있습니다.' },
      { text: 'They are trying to [transition] to a digital system.', korean: '그들은 디지털 시스템으로 {전환하려} 노력하고 있습니다.' }
    ]
  },
  {
    id: '632',
    word: 'productive',
    definitions: ['(형) 생산성이 높은', '(형) 결실이 있는, 유익한'],
    etymo: 'pro(앞으로) + ducere(이끌다) + ive(형용사)',
    examples: [
      { text: 'We had a very [productive] meeting this morning.', korean: '우리는 오늘 아침 매우 {결실이 있는} 회의를 했습니다.' },
      { text: 'She is the most [productive] member of the team.', korean: '그녀는 팀에서 가장 {생산성이 높은} 멤버입니다.' }
    ]
  },
  {
    id: '633',
    word: 'unfavorable',
    definitions: ['(형) 호의적이지 않은', '(형) 불리한'],
    etymo: 'un(부정) + favor(호의) + able(가능한)',
    examples: [
      { text: 'The movie received [unfavorable] reviews from critics.', korean: '그 영화는 비평가들로부터 {호의적이지 않은} 평가를 받았습니다.' },
      { text: 'The match was canceled due to [unfavorable] weather.', korean: '{불리한} 날씨 때문에 경기가 취소되었습니다.' }
    ]
  },
  {
    id: '634',
    word: 'boardroom',
    definitions: ['(명) 이사회 회의실', '(명) 고위 경영 회의 공간'],
    etymo: 'board(이사회, 널빤지) + room(방)',
    examples: [
      { text: 'The directors gathered in the [boardroom].', korean: '이사들이 {이사회 회의실에} 모였습니다.' },
      { text: 'Decisions made in the [boardroom] affect everyone.', korean: '{고위 경영 회의 공간에서} 내려진 결정은 모두에게 영향을 미칩니다.' }
    ]
  },
  {
    id: '635',
    word: 'ambitious',
    definitions: ['(형) 야심 있는', '(형) 어마어마한, 야심 찬'],
    etymo: 'ambire(돌아다니다, 구하다) + ous(형용사)',
    examples: [
      { text: 'He is an [ambitious] young executive.', korean: '그는 {야심 있는} 젊은 임원입니다.' },
      { text: 'The company launched an [ambitious] expansion plan.', korean: '회사는 {야심 찬} 확장 계획을 시작했습니다.' }
    ]
  },
  {
    id: '636',
    word: 'enlarge',
    definitions: ['(동) 크기를 확대하다', '(동) 범위를 확장하다'],
    etymo: 'en(만들다) + large(큰)',
    examples: [
      { text: 'I would like to [enlarge] this photograph.', korean: '이 사진의 크기를 {확대하고} 싶습니다.' },
      { text: 'They plan to [enlarge] their market share.', korean: '그들은 시장 점유율 {범위를 확장할} 계획입니다.' }
    ]
  },
  {
    id: '637',
    word: 'apparent',
    definitions: ['(형) 명백한, 분명한', '(형) 겉보기의, 외관상'],
    etymo: 'ad(방향) + parere(나타나다) + ent(형용사)',
    examples: [
      { text: 'It became [apparent] that he was lying.', korean: '그가 거짓말을 하고 있다는 것이 {명백해졌습니다}.' },
      { text: 'Her [apparent] calmness hid her real anxiety.', korean: '그녀의 {외관상의} 차분함은 진짜 불안을 숨겼습니다.' }
    ]
  },
  {
    id: '638',
    word: 'briefly',
    definitions: ['(부) 잠시 동안', '(부) 간단히'],
    etymo: 'brevis(짧은) + ly(부사)',
    examples: [
      { text: 'We stopped [briefly] to have a cup of coffee.', korean: '우리는 커피 한 잔을 마시기 위해 {잠시 동안} 멈췄습니다.' },
      { text: 'He [briefly] explained the new rules.', korean: '그는 새 규칙을 {간단히} 설명했습니다.' }
    ]
  },
  {
    id: '639',
    word: 'regain',
    definitions: ['(동) 되찾다', '(동) 회복하다'],
    etymo: 're(다시) + gain(얻다)',
    examples: [
      { text: 'The army fought to [regain] the lost territory.', korean: '군대는 잃어버린 영토를 {되찾기} 위해 싸웠습니다.' },
      { text: 'It took hours for him to [regain] consciousness.', korean: '그가 의식을 {회복하는} 데 몇 시간이 걸렸습니다.' }
    ]
  },
  {
    id: '640',
    word: 'duplication',
    definitions: ['(명) 복제', '(명) 중복'],
    etymo: 'duo(둘) + plicare(접다) + tion(명사)',
    examples: [
      { text: 'Unauthorized [duplication] of this software is illegal.', korean: '이 소프트웨어의 무단 {복제는} 불법입니다.' },
      { text: 'We must avoid [duplication] of effort across teams.', korean: '우리는 팀 간 노력의 {중복을} 피해야 합니다.' }
    ]
  },
  {
    id: '641',
    word: 'paperwork',
    definitions: ['(명) 서류 작업', '(명) 문서 업무'],
    etymo: 'paper(종이) + work(일)',
    examples: [
      { text: 'Buying a house involves a lot of [paperwork].', korean: '집을 사는 것은 많은 {서류 작업을} 수반합니다.' },
      { text: 'I have a stack of [paperwork] to finish today.', korean: '나는 오늘 끝내야 할 {문서 업무} 더미가 있습니다.' }
    ]
  },
  {
    id: '642',
    word: 'unanimously',
    definitions: ['(부) 만장일치로', '(부) 이의 없이'],
    etymo: 'unus(하나) + animus(마음) + ly(부사)',
    examples: [
      { text: 'The board voted [unanimously] to approve the merger.', korean: '이사회는 합병을 승인하기로 {만장일치로} 투표했습니다.' },
      { text: 'The motion was carried [unanimously].', korean: '그 동의안은 {이의 없이} 통과되었습니다.' }
    ]
  },
  {
    id: '643',
    word: 'general',
    definitions: ['(형) 일반적인', '(형) 전체적인'],
    etymo: 'genus(종류, 부류) + al(형용사)',
    examples: [
      { text: 'This book gives a [general] introduction to the topic.', korean: '이 책은 그 주제에 대한 {일반적인} 소개를 제공합니다.' },
      { text: 'The [general] opinion is that we should wait.', korean: '{전체적인} 의견은 우리가 기다려야 한다는 것입니다.' }
    ]
  },
  {
    id: '644',
    word: 'usual',
    definitions: ['(형) 보통의, 평소의', '(형) 흔히 있는, 일상적인'],
    etymo: 'usus(사용, 관습) + al(형용사)',
    examples: [
      { text: 'Let’s meet at our [usual] time.', korean: '우리의 {평소의} 시간에 만납시다.' },
      { text: 'He ordered his [usual] drink at the café.', korean: '그는 카페에서 {일상적인(늘 마시는)} 음료를 주문했습니다.' }
    ]
  },
  {
    id: '645',
    word: 'advisor',
    definitions: ['(명) 조언자, 고문', '(명) 지도 교수'],
    etymo: 'ad(방향) + visere(보다) + or(사람)',
    examples: [
      { text: 'He serves as a legal [advisor] to the corporation.', korean: '그는 회사의 법률 {고문} 역할을 합니다.' },
      { text: 'You should consult your academic [advisor].', korean: '학업 {지도 교수}와 상담해야 합니다.' }
    ]
  },
  {
    id: '646',
    word: 'pretty',
    definitions: ['(형) 예쁜, 매력적인', '(부) 꽤, 상당히'],
    etymo: 'praettig(교활한, 멋진)',
    examples: [
      { text: 'She wore a very [pretty] dress to the party.', korean: '그녀는 파티에 매우 {예쁜} 드레스를 입었습니다.' },
      { text: 'I am [pretty] sure that he is right.', korean: '나는 그가 맞다고 {꽤} 확신합니다.' }
    ]
  },
  {
    id: '647',
    word: 'suited',
    definitions: ['(형) 어울리거나 적합한', '(형) 준비된, 맞춰진'],
    etymo: 'suit(어울리다) + ed(형용사)',
    examples: [
      { text: 'He is not well [suited] for this stressful job.', korean: '그는 이 스트레스 많은 직업에 잘 {어울리지} 않습니다.' },
      { text: 'The program is [suited] to your specific needs.', korean: '그 프로그램은 당신의 특정 요구에 {맞춰져} 있습니다.' }
    ]
  },
  {
    id: '648',
    word: 'familiarity',
    definitions: ['(명) 친숙함, 잘 알고 있음', '(명) 친밀함'],
    etymo: 'familia(가족) + ity(명사)',
    examples: [
      { text: 'Her [familiarity] with the software helped her get the job.', korean: '소프트웨어에 대한 그녀의 {친숙함이} 그녀가 일자리를 얻는 데 도움이 되었습니다.' },
      { text: 'They treated each other with great [familiarity].', korean: '그들은 서로를 큰 {친밀함으로} 대했습니다.' }
    ]
  },
  {
    id: '649',
    word: 'seek',
    definitions: ['(동) 찾다', '(동) 추구하다'],
    etymo: 'secan(찾다, 조사하다)',
    examples: [
      { text: 'We are actively [seeking] new employees.', korean: '우리는 적극적으로 새로운 직원들을 {찾고} 있습니다.' },
      { text: 'She went to the city to [seek] her fortune.', korean: '그녀는 부를 {추구하기} 위해 도시로 갔습니다.' }
    ]
  },
  {
    id: '650',
    word: 'invite',
    definitions: ['(동) 초대하다, 요청하다', '(동) 권유하다, 초래하다'],
    etymo: 'in(안으로) + vocare(부르다)',
    examples: [
      { text: 'We would like to [invite] you to our wedding.', korean: '당신을 우리 결혼식에 {초대하고} 싶습니다.' },
      { text: 'Leaving your car unlocked may [invite] theft.', korean: '차를 잠그지 않고 두는 것은 도난을 {초래할} 수 있습니다.' }
    ]
  }
];

// ==========================================
// DAY 14 WORDS (651 - 700)
// ==========================================
export const DAY_14_WORDS: Word[] = [
  {
    id: '651',
    word: 'independently',
    definitions: ['(부) 독립적으로', '(부) 자율적으로'],
    etymo: 'in(부정) + depend(의존하다) + ently(부사)',
    examples: [
      { text: 'The two research teams worked [independently].', korean: '두 연구팀은 {독립적으로} 일했습니다.' },
      { text: 'She prefers to solve problems [independently].', korean: '그녀는 문제를 {자율적으로} 해결하는 것을 선호합니다.' }
    ]
  },
  {
    id: '652',
    word: 'diligent',
    definitions: ['(형) 근면한, 성실한'],
    etymo: 'dis(따로) + legere(선택하다) + ent(형용사)',
    examples: [
      { text: 'He is a very [diligent] student who always studies hard.', korean: '그는 항상 열심히 공부하는 매우 {성실한} 학생입니다.' },
      { text: 'Success requires [diligent] effort and patience.', korean: '성공은 {근면한} 노력과 인내를 필요로 합니다.' }
    ]
  },
  {
    id: '653',
    word: 'inexperienced',
    definitions: ['(형) 경험이 없는, 미숙한'],
    etymo: 'in(부정) + experience(경험) + ed(형용사)',
    examples: [
      { text: 'The [inexperienced] driver was nervous on the highway.', korean: '{경험이 없는} 운전자는 고속도로에서 긴장했습니다.' },
      { text: 'We cannot give such a big task to an [inexperienced] staff member.', korean: '{미숙한} 직원에게 그렇게 큰 임무를 맡길 수 없습니다.' }
    ]
  },
  {
    id: '654',
    word: 'leadership',
    definitions: ['(명) 지도력, 리더십'],
    etymo: 'leader(지도자) + ship(명사 - 상태, 자격)',
    examples: [
      { text: 'The project failed due to poor [leadership].', korean: '그 프로젝트는 형편없는 {지도력} 때문에 실패했습니다.' },
      { text: 'She demonstrated excellent [leadership] skills.', korean: '그녀는 뛰어난 {리더십} 기술을 보여주었습니다.' }
    ]
  },
  {
    id: '655',
    word: 'moderately',
    definitions: ['(부) 적당히', '(부) 중간 정도로'],
    etymo: 'moderate(적당한) + ly(부사)',
    examples: [
      { text: 'Cook the steak [moderately] to keep it juicy.', korean: '육즙을 유지하기 위해 스테이크를 {적당히} 요리하세요.' },
      { text: 'The test was [moderately] difficult.', korean: '그 시험은 {중간 정도로} 어려웠습니다.' }
    ]
  },
  {
    id: '656',
    word: 'customized',
    definitions: ['(형) 맞춤형의, 개인화된'],
    etymo: 'custom(관습, 고객) + ize(동사화) + ed(과거분사)',
    examples: [
      { text: 'We offer [customized] solutions for each client.', korean: '우리는 각 고객에게 {맞춤형의} 해결책을 제공합니다.' },
      { text: 'The software can be [customized] to suit your needs.', korean: '그 소프트웨어는 당신의 필요에 맞게 {개인화될} 수 있습니다.' }
    ]
  },
  {
    id: '657',
    word: 'preferential',
    definitions: ['(형) 특혜의', '(형) 우선적인'],
    etymo: 'prae(미리) + ferre(나르다) + ial(형용사)',
    examples: [
      { text: 'VIP members receive [preferential] treatment.', korean: 'VIP 회원들은 {특혜의} 대우를 받습니다.' },
      { text: 'Our regular customers get [preferential] seating.', korean: '우리의 단골 고객들은 {우선적인} 좌석을 얻습니다.' }
    ]
  },
  {
    id: '658',
    word: 'effectiveness',
    definitions: ['(명) 효과적임, 효율성'],
    etymo: 'effect(결과) + ive(형용사) + ness(명사)',
    examples: [
      { text: 'We are testing the [effectiveness] of the new drug.', korean: '우리는 신약의 {효과적임(효능)을} 시험하고 있습니다.' },
      { text: 'The [effectiveness] of this policy is still questionable.', korean: '이 정책의 {효율성은} 여전히 의문스럽습니다.' }
    ]
  },
  {
    id: '659',
    word: 'inexpensive',
    definitions: ['(형) 저렴한, 비용이 낮은'],
    etymo: 'in(부정) + expensive(비싼)',
    examples: [
      { text: 'We found a very [inexpensive] hotel in the city.', korean: '우리는 도시에서 매우 {저렴한} 호텔을 찾았습니다.' },
      { text: 'It is a highly effective yet [inexpensive] product.', korean: '그것은 매우 효과적이면서도 {비용이 낮은} 제품입니다.' }
    ]
  },
  {
    id: '660',
    word: 'sharply',
    definitions: ['(부) 급격하게', '(부) 날카롭게'],
    etymo: 'sharp(날카로운) + ly(부사)',
    examples: [
      { text: 'Prices have risen [sharply] this year.', korean: '올해 물가가 {급격하게} 올랐습니다.' },
      { text: 'She looked at him [sharply].', korean: '그녀는 그를 {날카롭게} 쳐다보았습니다.' }
    ]
  },
  {
    id: '661',
    word: 'discreetly',
    definitions: ['(부) 신중하게', '(부) 조심스럽게'],
    etymo: 'dis(분리) + cernere(구별하다) + ly(부사)',
    examples: [
      { text: 'He [discreetly] slipped the money into his pocket.', korean: '그는 {신중하게} 주머니에 돈을 밀어 넣었습니다.' },
      { text: 'The matter was handled [discreetly] by management.', korean: '그 문제는 경영진에 의해 {조심스럽게} 처리되었습니다.' }
    ]
  },
  {
    id: '662',
    word: 'periodic',
    definitions: ['(형) 주기적인', '(형) 정기적인'],
    etymo: 'period(기간) + ic(형용사)',
    examples: [
      { text: 'The machine requires [periodic] maintenance.', korean: '기계는 {주기적인} 유지보수가 필요합니다.' },
      { text: 'They conduct [periodic] reviews of staff performance.', korean: '그들은 직원 실적에 대해 {정기적인} 평가를 실시합니다.' }
    ]
  },
  {
    id: '663',
    word: 'exponentially',
    definitions: ['(부) 기하급수적으로', '(부) 전형적으로 급격히'],
    etymo: 'ex(밖으로) + ponere(놓다) + ial(형용사) + ly(부사)',
    examples: [
      { text: 'The company\'s profits have grown [exponentially].', korean: '회사의 수익이 {기하급수적으로} 성장했습니다.' },
      { text: 'Data usage has increased [exponentially] in recent years.', korean: '최근 몇 년 동안 데이터 사용량이 {급격히} 증가했습니다.' }
    ]
  },
  {
    id: '664',
    word: 'outgoing',
    definitions: ['(형) 외향적인, 사교적인', '(형) 퇴임하는, 떠나는'],
    etymo: 'out(밖으로) + go(가다) + ing(현재분사)',
    examples: [
      { text: 'She has a very [outgoing] personality.', korean: '그녀는 매우 {외향적인} 성격을 가지고 있습니다.' },
      { text: 'The [outgoing] president gave a farewell speech.', korean: '{퇴임하는} 회장이 고별 연설을 했습니다.' }
    ]
  },
  {
    id: '665',
    word: 'welcome',
    definitions: ['(동) 환영하다', '(형) 환영받는, 반가운'],
    etymo: 'wil(소망, 기쁨) + cuma(손님)',
    examples: [
      { text: 'We [welcome] your feedback on our new product.', korean: '우리는 신제품에 대한 당신의 피드백을 {환영합니다}.' },
      { text: 'This funding is a [welcome] boost for the project.', korean: '이 자금 지원은 프로젝트에 {반가운} 원동력입니다.' }
    ]
  },
  {
    id: '666',
    word: 'support',
    definitions: ['(동) 지지하다, 지원하다', '(명) 지원'],
    etymo: 'sub(아래에서) + portare(나르다)',
    examples: [
      { text: 'My family will always [support] my decisions.', korean: '나의 가족은 항상 내 결정을 {지지할} 것입니다.' },
      { text: 'The local community provided great [support].', korean: '지역 사회가 훌륭한 {지원을} 제공했습니다.' }
    ]
  },
  {
    id: '667',
    word: 'informal',
    definitions: ['(형) 격식을 차리지 않는', '(형) 비공식적인'],
    etymo: 'in(부정) + formal(공식적인)',
    examples: [
      { text: 'The meeting will be an [informal] gathering.', korean: '그 회의는 {격식을 차리지 않는} 모임이 될 것입니다.' },
      { text: 'We reached an [informal] agreement over dinner.', korean: '우리는 저녁 식사 자리에서 {비공식적인} 합의에 도달했습니다.' }
    ]
  },
  {
    id: '668',
    word: 'excellence',
    definitions: ['(명) 뛰어남, 탁월함'],
    etymo: 'excellere(능가하다) + ence(명사)',
    examples: [
      { text: 'The school is known for its academic [excellence].', korean: '그 학교는 학문적 {탁월함으로} 유명합니다.' },
      { text: 'He won an award for [excellence] in journalism.', korean: '그는 저널리즘 분야의 {뛰어남으로} 상을 받았습니다.' }
    ]
  },
  {
    id: '669',
    word: 'inspiring',
    definitions: ['(형) 영감을 주는'],
    etymo: 'in(안으로) + spirare(숨쉬다) + ing(현재분사)',
    examples: [
      { text: 'Her speech was deeply [inspiring] to the students.', korean: '그녀의 연설은 학생들에게 깊이 {영감을 주는} 것이었습니다.' },
      { text: 'The coach gave an [inspiring] talk before the game.', korean: '코치는 경기 전에 {영감을 주는} 이야기를 했습니다.' }
    ]
  },
  {
    id: '670',
    word: 'acceptable',
    definitions: ['(형) 받아들일 수 있는', '(형) 수용 가능한'],
    etymo: 'ad(방향) + capere(잡다) + able(가능한)',
    examples: [
      { text: 'This level of noise is not [acceptable] in a library.', korean: '이 정도 수준의 소음은 도서관에서 {받아들일 수} 없습니다.' },
      { text: 'We need to find an [acceptable] compromise.', korean: '우리는 {수용 가능한} 타협점을 찾아야 합니다.' }
    ]
  },
  {
    id: '671',
    word: 'amendment',
    definitions: ['(명) 수정, 변경', '(명) 개정(법률)'],
    etymo: 'emendare(오류를 바로잡다) + ment(명사)',
    examples: [
      { text: 'Please make this small [amendment] to the contract.', korean: '계약서에 이 작은 {수정을} 가해 주십시오.' },
      { text: 'The First [Amendment] guarantees freedom of speech.', korean: '미국 수정 헌법 제1조({개정})는 언론의 자유를 보장합니다.' }
    ]
  },
  {
    id: '672',
    word: 'breakable',
    definitions: ['(형) 파손되기 쉬운', '(명) 깨지기 쉬운 물건'],
    etymo: 'break(깨다) + able(가능한)',
    examples: [
      { text: 'Please handle this box carefully; the contents are [breakable].', korean: '이 상자를 조심스럽게 다뤄주세요. 내용물이 {파손되기 쉽습니다}.' },
      { text: 'Store all [breakables] safely before moving.', korean: '이사하기 전에 모든 {깨지기 쉬운 물건을} 안전하게 보관하세요.' }
    ]
  },
  {
    id: '673',
    word: 'trade',
    definitions: ['(명) 무역, 거래', '(동) 교환하다, 거래하다'],
    etymo: 'track(길, 항로)',
    examples: [
      { text: 'International [trade] is essential for economic growth.', korean: '국제 {무역은} 경제 성장에 필수적입니다.' },
      { text: 'I will [trade] my sandwich for your apple.', korean: '내 샌드위치를 당신의 사과와 {교환하겠습니다}.' }
    ]
  },
  {
    id: '674',
    word: 'descending',
    definitions: ['(형) 내려가는, 하향의', '(형) 내림차순의'],
    etymo: 'de(아래로) + scandere(오르다) + ing(현재분사)',
    examples: [
      { text: 'The airplane was on a [descending] path.', korean: '비행기가 {하향} 경로에 있었습니다.' },
      { text: 'Please arrange the files in [descending] order of size.', korean: '파일들을 크기의 {내림차순으로} 정렬해 주십시오.' }
    ]
  },
  {
    id: '675',
    word: 'fluctuation',
    definitions: ['(명) 변동, 오르내림'],
    etymo: 'fluctuare(파도치다) + tion(명사)',
    examples: [
      { text: 'There has been a lot of [fluctuation] in the stock market.', korean: '주식 시장에 많은 {변동이} 있었습니다.' },
      { text: 'Temperature [fluctuations] are common in the spring.', korean: '온도의 {오르내림은} 봄철에 흔합니다.' }
    ]
  },
  {
    id: '676',
    word: 'lure',
    definitions: ['(동) 유혹하다', '(명) 유혹, 매혹'],
    etymo: 'loire(매의 미끼)',
    examples: [
      { text: 'Retailers try to [lure] customers with big discounts.', korean: '소매업자들은 큰 할인으로 고객을 {유혹하려} 노력합니다.' },
      { text: 'The [lure] of the big city is hard to resist.', korean: '대도시의 {매혹은} 거부하기 어렵습니다.' }
    ]
  },
  {
    id: '677',
    word: 'perfectly',
    definitions: ['(부) 완벽하게', '(부) 전적으로'],
    etymo: 'per(완전히) + facere(만들다) + ly(부사)',
    examples: [
      { text: 'She speaks French [perfectly].', korean: '그녀는 프랑스어를 {완벽하게} 구사합니다.' },
      { text: 'It is [perfectly] normal to feel nervous before a test.', korean: '시험 전에 긴장하는 것은 {전적으로} 정상입니다.' }
    ]
  },
  {
    id: '678',
    word: 'utilities',
    definitions: ['(명) 공공서비스, 공과금', '(명) 유용성, 유틸리티'],
    etymo: 'uti(사용하다) + ity(명사)',
    examples: [
      { text: 'The rent includes water and electric [utilities].', korean: '임대료에는 수도와 전기 {공과금이} 포함되어 있습니다.' },
      { text: 'This app has many practical [utilities].', korean: '이 앱은 많은 실용적인 {유틸리티를} 가지고 있습니다.' }
    ]
  },
  {
    id: '679',
    word: 'loyalty',
    definitions: ['(명) 충성, 헌신', '(명) 신뢰, 신의'],
    etymo: 'legalis(합법적인) + ty(명사)',
    examples: [
      { text: 'The company rewards employees for their [loyalty].', korean: '회사는 직원들에게 그들의 {충성에} 대해 보상합니다.' },
      { text: 'Brand [loyalty] is very important for our business.', korean: '브랜드 {신뢰도(충성도)는} 우리 사업에 매우 중요합니다.' }
    ]
  },
  {
    id: '680',
    word: 'individually',
    definitions: ['(부) 개별적으로', '(부) 각각'],
    etymo: 'in(부정) + dividere(나누다) + ly(부사)',
    examples: [
      { text: 'Each item is wrapped [individually].', korean: '각 품목은 {개별적으로} 포장되어 있습니다.' },
      { text: 'The manager spoke to the team members [individually].', korean: '매니저는 팀원들과 {각각} 이야기했습니다.' }
    ]
  },
  {
    id: '681',
    word: 'shortcoming',
    definitions: ['(명) 결점, 단점'],
    etymo: 'short(부족한) + come(오다) + ing(명사)',
    examples: [
      { text: 'Despite his [shortcomings], he is a good leader.', korean: '그의 {단점들}에도 불구하고, 그는 훌륭한 지도자입니다.' },
      { text: 'The main [shortcoming] of this plan is the high cost.', korean: '이 계획의 주요 {결점은} 높은 비용입니다.' }
    ]
  },
  {
    id: '682',
    word: 'unrivaled',
    definitions: ['(형) 비할 데 없는, 유일무이한'],
    etymo: 'un(부정) + rival(경쟁자) + ed(형용사)',
    examples: [
      { text: 'The museum has an [unrivaled] collection of ancient art.', korean: '그 박물관은 고대 예술품에 있어 {비할 데 없는} 컬렉션을 보유하고 있습니다.' },
      { text: 'Her performance on stage was truly [unrivaled].', korean: '무대 위 그녀의 공연은 진정 {유일무이했습니다}.' }
    ]
  },
  {
    id: '683',
    word: 'accommodations',
    definitions: ['(명) 숙박 시설'],
    etymo: 'ad(방향) + commodus(편리한) + tion(명사)',
    examples: [
      { text: 'We need to book our flight and [accommodations] soon.', korean: '우리는 비행기와 {숙박 시설을} 곧 예약해야 합니다.' },
      { text: 'The hotel provides luxurious [accommodations] for guests.', korean: '그 호텔은 손님들에게 호화로운 {숙박 시설을} 제공합니다.' }
    ]
  },
  {
    id: '684',
    word: 'frozen',
    definitions: ['(형) 얼린', '(형) 정지된'],
    etymo: 'friosan(얼다)의 과거분사',
    examples: [
      { text: 'I bought some [frozen] vegetables at the supermarket.', korean: '나는 슈퍼마켓에서 약간의 {얼린} 채소를 샀습니다.' },
      { text: 'The computer screen is [frozen] and won\'t respond.', korean: '컴퓨터 화면이 {정지되어} 반응하지 않습니다.' }
    ]
  },
  {
    id: '685',
    word: 'stay',
    definitions: ['(동) 머무르다, 체재하다', '(동) 계속하다, 유지하다'],
    etymo: 'stare(서다)',
    examples: [
      { text: 'We will [stay] at a resort near the beach.', korean: '우리는 해변 근처의 리조트에 {머무를} 것입니다.' },
      { text: 'Please [stay] seated until the plane stops completely.', korean: '비행기가 완전히 멈출 때까지 앉은 상태를 {유지해} 주십시오.' }
    ]
  },
  {
    id: '686',
    word: 'courtyard',
    definitions: ['(명) 안마당, 중정'],
    etymo: 'court(마당) + yard(뜰)',
    examples: [
      { text: 'The hotel has a beautiful inner [courtyard].', korean: '그 호텔에는 아름다운 {안마당이} 있습니다.' },
      { text: 'Guests can relax in the [courtyard] garden.', korean: '손님들은 {중정} 정원에서 휴식을 취할 수 있습니다.' }
    ]
  },
  {
    id: '687',
    word: 'tourist',
    definitions: ['(명) 관광객', '(명) 여행객'],
    etymo: 'tour(여행) + ist(사람)',
    examples: [
      { text: 'The city attracts millions of [tourists] every year.', korean: '그 도시는 매년 수백만 명의 {관광객을} 끌어들입니다.' },
      { text: 'This market is a popular destination for [tourists].', korean: '이 시장은 {여행객들}에게 인기 있는 목적지입니다.' }
    ]
  },
  {
    id: '688',
    word: 'canceled',
    definitions: ['(형) 취소된', '(동) 취소하다'],
    etymo: 'cancel(취소하다) + ed(과거분사)',
    examples: [
      { text: 'All [canceled] flights will be rescheduled.', korean: '모든 {취소된} 비행편은 일정이 재조정될 것입니다.' },
      { text: 'They [canceled] the meeting at the last minute.', korean: '그들은 마지막 순간에 회의를 {취소했습니다}.' }
    ]
  },
  {
    id: '689',
    word: 'landmark',
    definitions: ['(명) 주요 지형지물', '(명) 중요한 사건, 이정표'],
    etymo: 'land(땅) + mark(표시)',
    examples: [
      { text: 'The Eiffel Tower is a famous [landmark] in Paris.', korean: '에펠탑은 파리의 유명한 {주요 지형지물입니다}.' },
      { text: 'The invention of the internet was a [landmark] in history.', korean: '인터넷의 발명은 역사에서 {중요한 사건(이정표)이었습니다}.' }
    ]
  },
  {
    id: '690',
    word: 'frequent',
    definitions: ['(동) 자주 방문하다', '(형) 빈번한'],
    etymo: 'frequens(붐비는, 잦은)',
    examples: [
      { text: 'He [frequents] the local coffee shop every morning.', korean: '그는 매일 아침 동네 커피숍을 {자주 방문합니다}.' },
      { text: 'We provide updates at [frequent] intervals.', korean: '우리는 {빈번한} 간격으로 업데이트를 제공합니다.' }
    ]
  },
  {
    id: '691',
    word: 'nightly',
    definitions: ['(형) 매일 밤의, 밤마다의', '(부) 매일 밤'],
    etymo: 'night(밤) + ly(형용사/부사)',
    examples: [
      { text: 'The hotel room has a [nightly] rate of $150.', korean: '호텔 방은 {매일 밤의} 요금이 150달러입니다.' },
      { text: 'The security guards patrol the area [nightly].', korean: '경비원들이 그 구역을 {매일 밤} 순찰합니다.' }
    ]
  },
  {
    id: '692',
    word: 'holder',
    definitions: ['(명) 소지자, 보유자', '(명) 자, 받침대'],
    etymo: 'hold(잡다) + er(사람, 도구)',
    examples: [
      { text: 'The ticket [holder] is entitled to a free drink.', korean: '티켓 {소지자는} 무료 음료를 받을 자격이 있습니다.' },
      { text: 'Please put your cup in the cup [holder].', korean: '컵을 컵 {받침대에} 놓아주세요.' }
    ]
  },
  {
    id: '693',
    word: 'resounding',
    definitions: ['(형) 울리는, 울려퍼지는', '(형) 압도적인, 확실한'],
    etymo: 're(다시) + sound(소리) + ing(현재분사)',
    examples: [
      { text: 'The concert ended with a [resounding] applause.', korean: '콘서트는 {울려퍼지는} 박수갈채와 함께 끝났습니다.' },
      { text: 'The new product was a [resounding] success.', korean: '그 신제품은 {압도적인} 성공이었습니다.' }
    ]
  },
  {
    id: '694',
    word: 'worldwide',
    definitions: ['(형) 세계적인', '(부) 전 세계적으로'],
    etymo: 'world(세계) + wide(넓은)',
    examples: [
      { text: 'The company has a [worldwide] reputation for quality.', korean: '그 회사는 품질에 있어 {세계적인} 명성을 가지고 있습니다.' },
      { text: 'The album was released [worldwide] on Friday.', korean: '그 앨범은 금요일에 {전 세계적으로} 발매되었습니다.' }
    ]
  },
  {
    id: '695',
    word: 'theatrical',
    definitions: ['(형) 연극의, 연극적인'],
    etymo: 'theatron(보는 장소, 극장) + al(형용사)',
    examples: [
      { text: 'She enjoys watching [theatrical] performances.', korean: '그녀는 {연극의} 공연 보는 것을 즐깁니다.' },
      { text: 'His speech was very [theatrical] and dramatic.', korean: '그의 연설은 매우 {연극적이고} 극적이었습니다.' }
    ]
  },
  {
    id: '696',
    word: 'proudly',
    definitions: ['(부) 자랑스럽게'],
    etymo: 'proud(자랑스러운) + ly(부사)',
    examples: [
      { text: 'The parents looked [proudly] at their graduating son.', korean: '부모님은 졸업하는 아들을 {자랑스럽게} 바라보았습니다.' },
      { text: 'She [proudly] presented her final project to the class.', korean: '그녀는 반 친구들에게 최종 프로젝트를 {자랑스럽게} 발표했습니다.' }
    ]
  },
  {
    id: '697',
    word: 'theatergoer',
    definitions: ['(명) 연극 애호가, 관람객'],
    etymo: 'theater(극장) + goer(가는 사람)',
    examples: [
      { text: 'The play was a big hit among regular [theatergoers].', korean: '그 연극은 단골 {연극 애호가들} 사이에서 큰 인기를 끌었습니다.' },
      { text: 'As a frequent [theatergoer], he knows all the actors.', korean: '빈번한 {관람객}으로서, 그는 모든 배우들을 알고 있습니다.' }
    ]
  },
  {
    id: '698',
    word: 'appraise',
    definitions: ['(동) 평가하다', '(동) 감정하다'],
    etymo: 'ad(방향) + pretium(가치)',
    examples: [
      { text: 'Managers must [appraise] the performance of their team.', korean: '매니저들은 팀의 실적을 {평가해야} 합니다.' },
      { text: 'An expert was called to [appraise] the antique painting.', korean: '골동품 그림을 {감정하기} 위해 전문가가 불려 왔습니다.' }
    ]
  },
  {
    id: '699',
    word: 'discretionary',
    definitions: ['(형) 자유 재량의'],
    etymo: 'discretio(분리, 분별) + ary(형용사)',
    examples: [
      { text: 'Managers have a [discretionary] fund for team lunches.', korean: '매니저들은 팀 점심을 위한 {자유 재량의} 기금을 가지고 있습니다.' },
      { text: 'Tipping is completely [discretionary] at this restaurant.', korean: '이 식당에서 팁은 완전히 {자유 재량에} 맡겨져 있습니다.' }
    ]
  },
  {
    id: '700',
    word: 'unease',
    definitions: ['(명) 불안, 걱정'],
    etymo: 'un(부정) + ease(편안함)',
    examples: [
      { text: 'There is a growing sense of [unease] among the workers.', korean: '노동자들 사이에서 {불안감(걱정)이} 커지고 있습니다.' },
      { text: 'She felt a deep [unease] about the new changes.', korean: '그녀는 새로운 변화들에 대해 깊은 {불안을} 느꼈습니다.' }
    ]
  }
];

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
  { 
    id: 'day5', 
    title: 'Day 5: Business Environment (201-250)', 
    description: '비즈니스 환경 영단어 201~250', 
    words: DAY_5_WORDS 
  },
  { 
    id: 'day6', 
    title: 'Day 6: Business Management (251-300)', 
    description: '비즈니스 관리 영단어 251~300', 
    words: DAY_6_WORDS 
  },
  { 
    id: 'day7', 
    title: 'Day 7: Business Interaction (301-350)', 
    description: '비즈니스 상호작용 301~350', 
    words: DAY_7_WORDS 
  },
  { 
    id: 'day8', 
    title: 'Day 8: General Business I (351-400)', 
    description: '일반 비즈니스 기초 351~400', 
    words: DAY_8_WORDS 
  },
  { 
    id: 'day9', 
    title: 'Day 9: Work & Operations (401-450)', 
    description: '업무 및 운영 영단어 401~450', 
    words: DAY_9_WORDS 
  },
  { 
    id: 'day10', 
    title: 'Day 10: General Business II (451-500)', 
    description: '일반 비즈니스 심화 451~500', 
    words: DAY_10_WORDS 
  },
  { 
    id: 'day11', 
    title: 'Day 11: General & Specific Business (501-550)', 
    description: '일반 및 특정 비즈니스 501~550', 
    words: DAY_11_WORDS 
  },
  { 
    id: 'day12', 
    title: 'Day 12: General Operations & Attributes (551-600)', 
    description: '일반 운영 및 속성 551~600', 
    words: DAY_12_WORDS 
  },
  { 
    id: 'day13', 
    title: 'Day 13: Tactics & Operations (601-650)', 
    description: '전술 및 운영 전략 601~650', 
    words: DAY_13_WORDS 
  },
  { 
    id: 'day14', 
    title: 'Day 14: Management & Services (651-700)', 
    description: '관리 및 서비스 651~700', 
    words: DAY_14_WORDS 
  }
];