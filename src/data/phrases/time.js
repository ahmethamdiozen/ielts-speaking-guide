import { phrase } from './_entry.js'
const p = phrase('time')

export default [
  p("that's a good question", 'güzel soru',
    'Düşünmek için 2–3 saniye kazandırır. Her soruda değil, zor sorularda kullan.',
    'Genelde nokta ile biter; sonra gerçek cevaba geç.',
    [
      "That's a good question. I've never thought about it before.",
      "Hmm, that's a good question. I'd probably say yes.",
      "That's a good question, and I think the answer is both.",
    ]),
  p('let me think', 'bir düşüneyim',
    'Sessizlik yerine kullanılır. Ardından kısa bir duraklama doğal kabul edilir.',
    'Nokta ya da "..." sonrası cevabın ilk cümlesi.',
    [
      "Let me think... I'd say about twice a week.",
      'Let me think for a second. I believe it was last summer.',
      'Hmm, let me think. The most useful app is probably my calendar.',
    ]),
  p('let me see', 'bir bakayım',
    '"Let me think" ile aynı işlev; arka arkaya kullanma, ikisinden birini seç.',
    'Ardından hatırlama gerektiren bir cevap: tarih, sayı, isim.',
    [
      'Let me see... I usually wake up around seven.',
      'Let me see, the last film I watched was an old comedy.',
      'Well, let me see. I suppose my favourite place is the library.',
    ]),
  p('how can I put it', 'nasıl desem',
    'Doğru kelimeyi ararken kullanılır. Sonra anlatmaya devam edersin.',
    'Soru olarak söylenir, ardından açıklama gelir.',
    [
      "How can I put it? It's a quiet but lively place.",
      "It's hard to say, how can I put it, a mix of old and new.",
      "He's, how can I put it, very generous.",
    ]),
  p("I've never really thought about it", 'üzerine hiç düşünmemiştim',
    'Beklenmedik sorularda dürüstçe zaman kazanmak için. Hemen arkasından "but I suppose…" ekle.',
    '"but I suppose / but I think" ile devam et.',
    [
      "I've never really thought about it, but I suppose I'd say yes.",
      "Honestly, I've never really thought about it before.",
      "Hmm, I've never really thought about it, but I think music helps me relax.",
    ],
    { mistake: 'Cümleyi orada bırakma; mutlaka bir fikirle bitir.' }),
  p("that's an interesting one", 'ilginç bir soru',
    'Part 3\'te soyut sorularda zaman kazandırır.',
    'Nokta; ardından fikir.',
    [
      "That's an interesting one. I'd say technology helps more than it harms.",
      "Oh, that's an interesting one. Let me think.",
      "That's an interesting one, because it changed a lot in my life.",
    ]),
]
