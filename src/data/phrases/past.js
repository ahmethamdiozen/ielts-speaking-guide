import { phrase } from './_entry.js'
const p = phrase('past')

export default [
  p('used to', 'eskiden ... yapardı',
    'Geçmişte alışkanlık ya da durum anlatırken. Part 1\'de "Did you ...as a child?" sorularında çok işe yarar.',
    'Fiil yalın hâli: "used to play".',
    [
      'Back then, I used to walk to school with my friends.',
      'We used to live in a small flat near the sea.',
      'I used to play football every weekend.',
    ],
    { mistake: 'Olumsuz/soru hâlinde "use to" olur: "I didn\'t use to like coffee".' }),
  p('when I was younger', 'daha gençken',
    'Geçmişe hızlı geçiş yapar. Sonra "used to" ya da past simple ile devam et.',
    'Virgül sonrası past simple.',
    [
      "When I was younger, I spent every summer at my grandparents' house.",
      'I was shy when I was younger.',
      'When I was younger, I wanted to be a pilot.',
    ]),
  p('if I were', 'olsaydım',
    'Part 3\'te varsayım ve öneri cümleleri için. Konuşmada "If I was" da kabul edilir ama "were" daha güvenli.',
    'Virgül sonrası "I would + fiil".',
    [
      'If I were the mayor, I would build more parks.',
      "If I were you, I'd try the local food.",
      "If I were free tomorrow, I'd go hiking.",
    ]),
  p("I'd probably", 'muhtemelen ... yapardım',
    'Varsayımsal sorulara yumuşak cevap vermek için. Kesin konuşmak zorunda kalmazsın.',
    'Fiil yalın hâli: "I\'d probably choose".',
    [
      "I'd probably choose a quiet cafe over a loud restaurant.",
      "I'd probably spend the money on a trip.",
      "If it rained, I'd probably stay home.",
    ]),
  p('I remember', 'hatırlıyorum',
    'Part 2\'de hikâye anlatırken en güçlü açılışlardan biri. Duyguyu ve sahneyi ekler.',
    '"I remember + V-ing" ya da "I remember that…"',
    [
      'I remember my first day at school very clearly.',
      'I remember feeling nervous but excited.',
      'I remember that the weather was awful.',
    ]),
  p('it was the first time', 'ilk defaydı',
    'Bir deneyimin neden unutulmaz olduğunu vurgulamak için.',
    '"it was the first time + özne + had + V3".',
    [
      'It was the first time I had travelled alone.',
      'It was the first time I cooked for my family.',
      'It was the first time I felt really proud of myself.',
    ]),
]
