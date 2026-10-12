import { phrase } from './_entry.js'
const p = phrase('extend')

export default [
  p('for example', 'örneğin',
    'Cevabı gerçek bir örnekle uzatmanın en kolay yolu. Her cevapta bir kez ekle.',
    'Virgül sonrası somut bir durum.',
    [
      'I enjoy outdoor activities, for example, hiking and cycling.',
      'For example, last month I tried rock climbing.',
      'Some foods, for example, spicy ones, are my favourites.',
    ]),
  p('the reason is that', 'sebebi şu ki',
    'Sebep eklemek için. "Because" ile aynı iş; farklı bir yapı kullanmak çeşitlilik verir.',
    'Tam bir cümle: "the reason is that + özne + fiil"',
    [
      'The reason is that I grew up near the sea.',
      'I stay at home a lot. The reason is that I work long hours.',
      'I like it, and the reason is that it helps me focus.',
    ],
    { mistake: '"The reason is because" yanlış. Doğrusu "the reason is that".' }),
  p('on top of that', 'bunun üstüne',
    'Bir avantajın ya da bilginin üstüne bir tane daha eklemek için.',
    'Virgül sonrası ek bir bilgi.',
    [
      "It's cheap, and on top of that, it's close to my house.",
      'The food is great. On top of that, the staff are friendly.',
      'I earn a good salary, and on top of that, I enjoy my work.',
    ]),
  p('having said that', 'bununla birlikte',
    'Önceki fikre karşı bir yön eklemek için. Part 3\'te dengeli cevap vermenin kısayolu.',
    'Virgül sonrası karşıt fikir.',
    [
      'I love my city. Having said that, it can get very crowded.',
      "Having said that, I wouldn't live there forever.",
      "It's expensive. Having said that, it's worth every penny.",
    ]),
  p('in my case', 'benim durumumda',
    'Genel bir şeyden kendi hayatına geçmek için. Part 1\'de kişisel cevabı uzatmanın kolay yolu.',
    'Virgül sonrası kişisel durum.',
    [
      'In my case, I started learning English at school.',
      'Many people prefer cars, but in my case, I always take the bus.',
      'In my case, a short walk is the best way to relax.',
    ]),
  p("that's why", 'bu yüzden',
    'Sebepten sonuca geçmek için.',
    'Tam bir cümle: "that\'s why + özne + fiil"',
    [
      "I get up early, and that's why I'm usually tired by evening.",
      "That's why I always carry a book with me.",
      "The traffic is terrible, that's why I cycle to work.",
    ]),
]
