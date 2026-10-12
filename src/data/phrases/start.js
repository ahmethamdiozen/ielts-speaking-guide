import { phrase } from './_entry.js'
const p = phrase('start')

export default [
  p("I'd say", 'bence; şöyle derim',
    'Fikrini yumuşak ve güvenli bir şekilde söylemek için. Cümleye başlarken ne diyeceğini hâlâ düşünebilirsin.',
    'Hemen ardından tam bir cümle (that kullanmak şart değil): "I\'d say it is…"',
    [
      "I'd say it depends on the weather.",
      "I'd say my hometown is quite peaceful.",
      "Honestly, I'd say I prefer reading to watching TV.",
    ],
    { mistake: '"I\'d say that is good" yerine bir sebep ekle: "I\'d say that is good because…". Tek başına kısa kalır.' }),
  p('to be honest', 'dürüst olmak gerekirse',
    'Doğal ve samimi bir başlangıç. Kesin bir fikrin olmasa bile ses tonunu rahatlatır ve düşünmen için zaman kazandırır.',
    'Virgülden sonra tam cümle: "To be honest, I don\'t…"',
    [
      "To be honest, I don't cook very often.",
      "I like it, but to be honest, I'm not a big fan of crowds.",
      "To be honest, I've never been to a concert.",
    ],
    { mistake: 'Her cümlede kullanma; 2–3 cevapta bir kullanırsan doğal durur.' }),
  p('the thing is', 'işin aslı şu ki',
    'Bir engeli ya da asıl noktayı açıklamadan önce kullanılır. "But" ile birlikte sık gelir.',
    'Virgülden sonra bir cümle: "The thing is, I…"',
    [
      "I'd love to travel more, but the thing is, I don't have much free time.",
      'The thing is, I grew up in a small town.',
      "It's cheap, but the thing is, it's always crowded.",
    ]),
  p('it depends on', '...a bağlı',
    '"Evet/hayır" demek zor olduğunda en güvenli başlangıç. Ardından 2 durumu anlatarak cevabı kolayca uzatırsın.',
    'İsim ya da soru sözcüğü: "it depends on the weather", "it depends on how much…"',
    [
      'It depends on my mood, but usually I listen to pop.',
      'It depends on how much homework I have.',
      'Well, it depends on the season.',
    ],
    { mistake: '"It depends of" yanlış. Doğrusu "depends on".' }),
  p('personally', 'şahsen; kendi adıma',
    'Kendi fikrini başkalarının fikrinden ayırmak için. Karşılaştırma cümlelerinde işe yarar.',
    'Virgül sonrası ya da fiilden önce: "Personally, I prefer…"',
    [
      'Personally, I prefer studying in the morning.',
      'Some people love cities, but personally I find them too noisy.',
      'I think, personally, that walking is the best exercise.',
    ]),
  p("I'm not really sure", 'çok emin değilim',
    'Fikrin net değilken dürüstçe başlamak için. Sonrasında "but I think" ile bir yöne bağla; asla sadece "I don\'t know" deyip bırakma.',
    '"but I think…" ya da "why, but…" ile devam et.',
    [
      "I'm not really sure, but I think I'd choose the beach.",
      "I'm not really sure why, but I've always loved rainy days.",
      "Honestly, I'm not really sure what my favourite colour is.",
    ],
    { mistake: '"I don\'t know" ile bitirmek puan düşürür. Mutlaka bir tahmin ekle.' }),
]
