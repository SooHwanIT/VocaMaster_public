// src/data/days/day1.ts

import type { Word } from '../types';

// --- Day 1: Basic Business Vocabulary (1-50) ---
export const DAY_1_WORDS: Word[] = [
  {
    id: '1', word: 'executive',
    definitions: ['(명) 경영진, 임원', '(형) 경영의, 운영의'],
    etymo: 'ex(밖으로) + sequi(따르다)',
    examples: [
      { text: 'The [executive] made an important decision.', korean: '그 {임원은} 중요한 결정을 내렸습니다.' },
      { text: 'This is an [executive] decision.', korean: '이것은 {경영의} 결정입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '2', word: 'inventory',
    definitions: ['(명) 재고, 재고 목록', '(명) 재고 조사'],
    etymo: 'in + venire',
    examples: [
      { text: 'We need to check our [inventory] first.', korean: '우리는 먼저 {재고를} 확인해야 합니다.' },
      { text: 'The [inventory] of goods is complete.', korean: '{재고 조사가} 완료되었습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '3', word: 'feature',
    definitions: ['(명) 특징, 특색', '(명) 특집 기사'],
    etymo: 'facere(만들다)',
    examples: [
      { text: 'The camera is the best [feature].', korean: '카메라가 가장 큰 {특징}입니다.' },
      { text: 'There is a [feature] article in today\'s newspaper.', korean: '오늘 신문에 {특집 기사가} 있습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '4', word: 'acknowledge',
    definitions: ['(동) 수신을 인정하다', '(동) 감사를 표현하다'],
    etymo: 'ac + knowledge',
    examples: [
      { text: 'Please [acknowledge] receipt of this email.', korean: '이 이메일의 {수신을 인정해} 주십시오.' },
      { text: 'I [acknowledge] your kindness.', korean: '나는 당신의 친절에 {감사를 표현합니다}.' }
    ],
    dayId: 'day1'
  },
  {
    id: '5', word: 'voucher',
    definitions: ['(명) 상품권, 바우처', '(명) 영수증, 증명서'],
    etymo: 'vouch + er',
    examples: [
      { text: 'I used a [voucher] for dinner.', korean: '나는 저녁 식사에 {상품권을} 사용했습니다.' },
      { text: 'You need a [voucher] as proof of purchase.', korean: '구매 증명서로 {영수증이} 필요합니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '6', word: 'estimate',
    definitions: ['(명) 견적서, 평가', '(동) 추산하다, 평가하다'],
    etymo: 'ex + aestimare',
    examples: [
      { text: 'Can you give me an [estimate]?', korean: '{견적서를} 주실 수 있나요?' },
      { text: 'I [estimate] the cost at $500.', korean: '나는 비용을 {500달러로 추산합니다}.' }
    ],
    dayId: 'day1'
  },
  {
    id: '7', word: 'resume',
    definitions: ['(동) 재개하다', '(명) 이력서'],
    etymo: 're + sumere',
    examples: [
      { text: 'We will [resume] the meeting tomorrow.', korean: '우리는 내일 회의를 {재개할} 것입니다.' },
      { text: 'Submit your [resume] by Friday.', korean: '금요일까지 {이력서를} 제출하세요.' }
    ],
    dayId: 'day1'
  },
  {
    id: '8', word: 'issue',
    definitions: ['(명) 문제, 이슈', '(동) 발행하다'],
    etymo: 'ex + ire',
    examples: [
      { text: 'There is a serious [issue] to discuss.', korean: '논의할 {심각한 문제가} 있습니다.' },
      { text: 'They will [issue] a new card.', korean: '그들은 새 카드를 {발행할} 것입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '9', word: 'property',
    definitions: ['(명) 재산, 소유물', '(명) 부동산'],
    etymo: 'proprius',
    examples: [
      { text: 'He inherited [property] from his father.', korean: '그는 아버지로부터 {재산을} 상속받았습니다.' },
      { text: '[Property] prices are rising.', korean: '{부동산} 가격이 오르고 있습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '10', word: 'eligible',
    definitions: ['(형) 자격이 있는', '(형) 적격의'],
    etymo: 'e + legere',
    examples: [
      { text: 'You are [eligible] for the bonus.', korean: '당신은 보너스를 받을 {자격이 있습니다}.' },
      { text: 'Are you [eligible] for this program?', korean: '당신은 이 프로그램에 {적격입니까}?' }
    ],
    dayId: 'day1'
  },
  {
    id: '11', word: 'initiative',
    definitions: ['(명) 주도권', '(명) 새로운 계획, 선도적 행동'],
    etymo: 'initium',
    examples: [
      { text: 'She took the [initiative] in the project.', korean: '그녀는 프로젝트에서 {주도권을} 잡았습니다.' },
      { text: 'This [initiative] will help the community.', korean: '이 {새로운 계획은} 지역사회를 도울 것입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '12', word: 'culinary',
    definitions: ['(형) 요리의, 음식의'],
    etymo: 'culina',
    examples: [
      { text: 'He has great [culinary] skills.', korean: '그는 훌륭한 {요리} 솜씨를 가지고 있습니다.' },
      { text: 'The [culinary] arts are fascinating.', korean: '{요리 예술은} 매력적입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '13', word: 'extensive',
    definitions: ['(형) 광범위한', '(형) 대규모의'],
    etymo: 'ex + tendere',
    examples: [
      { text: 'We conducted [extensive] research.', korean: '우리는 {광범위한} 조사를 실시했습니다.' },
      { text: '[Extensive] construction is happening downtown.', korean: '{대규모의} 건설이 도심에서 진행 중입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '14', word: 'deposit',
    definitions: ['(명) 예치금, 보증금', '(명) 침전물'],
    etymo: 'de + ponere',
    examples: [
      { text: 'The [deposit] is not refundable.', korean: '{보증금은} 환불되지 않습니다.' },
      { text: 'There is a [deposit] of minerals in the river.', korean: '강에 {광물 침전물이} 있습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '15', word: 'retail',
    definitions: ['(명) 소매', '(형) 소매의'],
    etymo: 're + tailler',
    examples: [
      { text: 'The [retail] price is $50.', korean: '{소매} 가격은 50달러입니다.' },
      { text: 'I work in [retail] business.', korean: '나는 {소매} 업에 종사합니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '16', word: 'affordable',
    definitions: ['(형) 가격이 알맞은'],
    etymo: 'af + ford',
    examples: [
      { text: 'It is an [affordable] car.', korean: '그것은 {가격이 알맞은} 자동차입니다.' },
      { text: '[Affordable] housing is needed.', korean: '{저렴한} 주택이 필요합니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '17', word: 'grant',
    definitions: ['(동) 승인하다', '(동) 수여하다'],
    etymo: 'credere',
    examples: [
      { text: 'They will [grant] your request.', korean: '그들은 당신의 요청을 {승인할} 것입니다.' },
      { text: 'The university will [grant] scholarships.', korean: '대학은 장학금을 {수여할} 것입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '18', word: 'significantly',
    definitions: ['(부) 상당히, 현저하게', '(부) 중요한 정도로, 의미 있게'],
    etymo: 'sign + fic',
    examples: [
      { text: 'Sales increased [significantly].', korean: '매출이 {상당히} 증가했습니다.' },
      { text: 'This discovery [significantly] changes our understanding.', korean: '이 발견은 {의미 있게} 우리의 이해를 바꿉니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '19', word: 'reserve',
    definitions: ['(동) 예약하다', '(동) 보유하다'],
    etymo: 're + servare',
    examples: [
      { text: 'I would like to [reserve] a table.', korean: '테이블을 {예약하고} 싶습니다.' },
      { text: 'We [reserve] the right to refuse.', korean: '우리는 거절할 {권리를 보유합니다}.' }
    ],
    dayId: 'day1'
  },
  {
    id: '20', word: 'application',
    definitions: ['(명) 신청, 지원서', '(명) 적용, 응용'],
    etymo: 'ap + plicare',
    examples: [
      { text: 'Fill out the [application] form.', korean: '{신청서를} 작성해 주세요.' },
      { text: 'The [application] of this method is beneficial.', korean: '이 방법의 {적용은} 유용합니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '21', word: 'address',
    definitions: ['(명) 주소', '(동) 문제를 다루다'],
    etymo: 'ad + directus',
    examples: [
      { text: 'Please send it to my [address].', korean: '제 {주소로} 보내주세요.' },
      { text: 'We must [address] this problem.', korean: '우리는 이 문제를 {다루어야} 합니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '22', word: 'suppose',
    definitions: ['(동) 추정하다', '(동) 생각하다'],
    etymo: 'sub + ponere',
    examples: [
      { text: 'I [suppose] you are right.', korean: '당신이 옳다고 {추정합니다}.' },
      { text: 'I [suppose] we should start now.', korean: '이제 시작해야 한다고 {생각합니다}.' }
    ],
    dayId: 'day1'
  },
  {
    id: '23', word: 'charge',
    definitions: ['(명) 요금', '(명) 책임'],
    etymo: 'carrus',
    examples: [
      { text: 'There is no extra [charge].', korean: '추가 {요금은} 없습니다.' },
      { text: 'She is in [charge] of the project.', korean: '그녀는 프로젝트의 {책임자}입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '24', word: 'expire',
    definitions: ['(동) 기한이 만료되다', '(동) 효력이 끝나다'],
    etymo: 'ex + spirare',
    examples: [
      { text: 'My contract will [expire] soon.', korean: '제 계약이 곧 {만료됩니다}.' },
      { text: 'The warranty has [expired].', korean: '보증이 {효력이 끝났습니다}.' }
    ],
    dayId: 'day1'
  },
  {
    id: '25', word: 'refund',
    definitions: ['(명) 환불', '(동) 환불하다'],
    etymo: 're + fundere',
    examples: [
      { text: 'I would like a [refund].', korean: '{환불을} 받고 싶습니다.' },
      { text: 'We will [refund] your money.', korean: '우리는 당신의 돈을 {환불하겠습니다}.' }
    ],
    dayId: 'day1'
  },
  {
    id: '26', word: 'promote',
    definitions: ['(동) 촉진하다', '(동) 승진시키다'],
    etymo: 'pro + movere',
    examples: [
      { text: 'We need to [promote] our new product.', korean: '우리는 신제품을 {홍보해야} 합니다.' },
      { text: 'They will [promote] him to manager.', korean: '그들은 그를 매니저로 {승진시킬} 것입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '27', word: 'revenue',
    definitions: ['(명) 수익, 수입', '(명) 세입'],
    etymo: 're + venire',
    examples: [
      { text: 'The company\'s [revenue] increased.', korean: '회사의 {수익이} 증가했습니다.' },
      { text: 'The [revenue] from taxes is collected here.', korean: '세금 {세입이} 여기서 수집됩니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '28', word: 'opportunity',
    definitions: ['(명) 기회', '(명) 적기, 호기'],
    etymo: 'ob + portus',
    examples: [
      { text: 'This is a great [opportunity].', korean: '이것은 좋은 {기회}입니다.' },
      { text: 'This [opportunity] comes once in a lifetime.', korean: '이 {호기는} 평생에 한 번 옵니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '29', word: 'valid',
    definitions: ['(형) 유효한', '(형) 타당한'],
    etymo: 'valere',
    examples: [
      { text: 'Is your passport [valid]?', korean: '여권이 {유효합니까}?' },
      { text: 'That is a [valid] argument.', korean: '그것은 {타당한} 주장입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '30', word: 'confidential',
    definitions: ['(형) 기밀의, 비밀의', '(형) 신뢰를 요하는'],
    etymo: 'con + fidere',
    examples: [
      { text: 'This information is [confidential].', korean: '이 정보는 {기밀}입니다.' },
      { text: '[Confidential] matters require discretion.', korean: '{신뢰를 요하는} 문제는 신중함이 필요합니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '31', word: 'figure',
    definitions: ['(명) 숫자', '(명) 인물'],
    etymo: 'fingere',
    examples: [
      { text: 'The sales [figure] is high.', korean: '판매 {수치가} 높습니다.' },
      { text: 'He is an important [figure] in history.', korean: '그는 역사에서 {중요한 인물}입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '32', word: 'traffic',
    definitions: ['(명) 교통, 차량의 흐름', '(명) 인터넷 트래픽, 데이터 흐름'],
    etymo: 'trans + facere',
    examples: [
      { text: 'There is heavy [traffic] today.', korean: '오늘 {교통량이} 많습니다.' },
      { text: 'Website [traffic] has increased.', korean: '웹사이트 {트래픽이} 증가했습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '33', word: 'audience',
    definitions: ['(명) 청중, 관객', '(명) 독자'],
    etymo: 'audire',
    examples: [
      { text: 'The [audience] cheered loudly.', korean: '{청중이} 크게 환호했습니다.' },
      { text: 'The [audience] for this book is young adults.', korean: '이 책의 {독자는} 청년입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '34', word: 'occupy',
    definitions: ['(동) 공간을 차지하다', '(동) 시간이나 주의를 차지하다'],
    etymo: 'ob + capere',
    examples: [
      { text: 'The desk will [occupy] too much space.', korean: '그 책상은 너무 많은 공간을 {차지할} 것입니다.' },
      { text: 'Work [occupies] most of his time.', korean: '일이 그의 대부분 시간을 {차지합니다}.' }
    ],
    dayId: 'day1'
  },
  {
    id: '35', word: 'approximately',
    definitions: ['(부) 대략', '(부) 거의'],
    etymo: 'ad + proximus',
    examples: [
      { text: 'It costs [approximately] $100.', korean: '비용은 {대략} 100달러입니다.' },
      { text: 'There are [approximately] 50 people here.', korean: '여기에는 {거의} 50명이 있습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '36', word: 'complimentary',
    definitions: ['(형) 무료의', '(형) 칭찬의'],
    etymo: 'complere',
    examples: [
      { text: 'They offer [complimentary] water.', korean: '그들은 {무료} 생수를 제공합니다.' },
      { text: 'He gave me a [complimentary] remark.', korean: '그가 나에게 {칭찬의} 말을 했습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '37', word: 'outstanding',
    definitions: ['(형) 미해결의, 미지불된', '(형) 뛰어난, 두드러진'],
    etymo: 'out + stand',
    examples: [
      { text: 'You have an [outstanding] debt.', korean: '당신은 {미지불된} 빚이 있습니다.' },
      { text: 'She is an [outstanding] student.', korean: '그녀는 {뛰어난} 학생입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '38', word: 'imperative',
    definitions: ['(형) 긴급한, 필수적인', '(명) 긴급한 문제, 필수적인 것'],
    etymo: 'in + parare',
    examples: [
      { text: 'It is [imperative] to be on time.', korean: '정시 도착은 {필수적}입니다.' },
      { text: 'The [imperative] is to finish this project.', korean: '{긴급 과제는} 이 프로젝트를 완료하는 것입니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '39', word: 'substantial',
    definitions: ['(형) 상당한', '(형) 실질적인, 실제의'],
    etymo: 'sub + stare',
    examples: [
      { text: 'He made a [substantial] donation.', korean: '그는 {상당한} 기부를 했습니다.' },
      { text: 'There is [substantial] progress.', korean: '{실질적인} 진전이 있습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '40', word: 'decline',
    definitions: ['(동) 감소하다', '(동) 거절하다'],
    etymo: 'de + clinare',
    examples: [
      { text: 'Profits began to [decline].', korean: '이익이 {감소하기} 시작했습니다.' },
      { text: 'I must [decline] your offer.', korean: '나는 당신의 제안을 {거절해야} 합니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '41', word: 'balance',
    definitions: ['(명) 균형', '(명) 잔액'],
    etymo: 'bi + lanx',
    examples: [
      { text: 'Work-life [balance] is important.', korean: '일과 삶의 {균형이} 중요합니다.' },
      { text: 'Check your account [balance].', korean: '계좌 {잔액을} 확인하세요.' }
    ],
    dayId: 'day1'
  },
  {
    id: '42', word: 'account',
    definitions: ['(명) 계좌', '(명) 설명, 설명서'],
    etymo: 'ad + computare',
    examples: [
      { text: 'I opened a bank [account].', korean: '은행 {계좌를} 개설했습니다.' },
      { text: 'Give me an [account] of what happened.', korean: '무슨 일이 일어났는지 {설명해} 주세요.' }
    ],
    dayId: 'day1'
  },
  {
    id: '43', word: 'proceed',
    definitions: ['(동) 계속하다, 진행하다', '(동) 시작하다'],
    etymo: 'pro + cedere',
    examples: [
      { text: 'Please [proceed] with the plan.', korean: '그 계획을 {진행해} 주십시오.' },
      { text: 'We will [proceed] with the meeting.', korean: '우리는 회의를 {시작하겠습니다}.' }
    ],
    dayId: 'day1'
  },
  {
    id: '44', word: 'amenities',
    definitions: ['(명) 편의시설', '(명) 예의, 기품'],
    etymo: 'amoenus',
    examples: [
      { text: 'The hotel has great [amenities].', korean: '그 호텔은 훌륭한 {편의시설을} 갖추고 있습니다.' },
      { text: 'She treats everyone with [amenities].', korean: '그녀는 모두에게 {예의} 있게 대합니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '45', word: 'renowned',
    definitions: ['(형) 유명한'],
    etymo: 're + nomer',
    examples: [
      { text: 'He is a [renowned] artist.', korean: '그는 {유명한} 예술가입니다.' },
      { text: '[Renowned] scholars gathered for the conference.', korean: '{유명한} 학자들이 회의에 모였습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '46', word: 'preserve',
    definitions: ['(동) 보존하다', '(명) 저장식품'],
    etymo: 'pre + servare',
    examples: [
      { text: 'We must [preserve] nature.', korean: '우리는 자연을 {보존해야} 합니다.' },
      { text: 'This [preserve] is made from berries.', korean: '이 {저장식품은} 베리로 만들어집니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '47', word: 'simply',
    definitions: ['(부) 단순하게, 간결하게', '(부) 그저, 단지'],
    etymo: 'simplex',
    examples: [
      { text: 'The design is [simply] beautiful.', korean: '디자인은 {단순하게} 아름답습니다.' },
      { text: 'It is [simply] amazing.', korean: '그것은 {그저} 놀랍습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '48', word: 'presence',
    definitions: ['(명) 존재, 출석', '(명) 풍모, 영향력'],
    etymo: 'pre + esse',
    examples: [
      { text: 'Your [presence] is required.', korean: '당신의 {출석이} 필요합니다.' },
      { text: 'He has a strong [presence].', korean: '그는 강한 {풍모를} 가지고 있습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '49', word: 'laboratory',
    definitions: ['(명) 실험실'],
    etymo: 'labor',
    examples: [
      { text: 'He works in a [laboratory].', korean: '그는 {실험실에서} 일합니다.' },
      { text: 'The [laboratory] is equipped with modern tools.', korean: '{실험실은} 최신 도구로 장비되어 있습니다.' }
    ],
    dayId: 'day1'
  },
  {
    id: '50', word: 'effective',
    definitions: ['(형) 효과적인', '(형) 효력을 발휘하는'],
    etymo: 'ex + facere',
    examples: [
      { text: 'The medicine is [effective].', korean: '그 약은 {효과적}입니다.' },
      { text: 'This law becomes [effective] next month.', korean: '이 법은 다음 달부터 {효력을 발휘합니다}.' }
    ],
    dayId: 'day1'
  }
];
