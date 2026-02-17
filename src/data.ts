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