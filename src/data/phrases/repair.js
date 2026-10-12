import { phrase } from './_entry.js'
const p = phrase('repair')

export default [
  p('or rather', 'daha doğrusu',
    'Cümlenin ortasında yanlış söylediğini düzeltmek için. Baştan başlamak yerine düzeltmeyi aynı cümlenin içinde yaparsın.',
    'Düzeltilen ifade hemen gelir; cümleye aynı yapıda devam edersin.',
    [
      'I go there every week, or rather, almost every week.',
      "It's a small town, or rather, a large village.",
      'My brother, or rather my cousin, taught me to cook.',
    ],
    { mistake: 'Düzeltme sonrası cümleyi baştan kurma; kaldığın yerden devam et.' }),
  p('what I mean is', 'demek istediğim şu ki',
    'Söylediğini daha açık anlatmak için. Cümle kurulumun karıştıysa kurtarıcıdır.',
    'Tam bir cümle: "What I mean is (that) I…"',
    [
      'I like cities. What I mean is, I like the energy in them.',
      "It's not cheap. What I mean is, it's not for everyone.",
      'What I mean is that I prefer small groups.',
    ]),
  p('let me put it another way', 'başka türlü söyleyeyim',
    'Aynı fikri başka kelimelerle toparlamak için. Tekrar yerine paraphrase gibi görünür.',
    'İki nokta ya da virgül sonrası aynı fikrin kısa hâli.',
    [
      "It's relaxing. Let me put it another way: it takes my mind off work.",
      "Let me put it another way: I'm not a morning person.",
      'I enjoy it, but let me put it another way, I need it.',
    ]),
  p('I mean', 'yani',
    'Biraz önce söylediğini açmak ya da örnek vermek için. Çok sık kullanma; 1–2 kez yeterli.',
    'Virgülden sonra açıklama.',
    [
      "It's a nice area, I mean, it's quiet and green.",
      'I love cooking, I mean, I love trying new recipes.',
      'He is helpful, I mean, he always listens.',
    ],
    { mistake: 'Her cümlede "I mean" demek akıcılığı değil dolgu fazlasını gösterir.' }),
  p('sorry, I meant', 'pardon, demek istediğim',
    'Yanlış kelime ya da tarih söylediysen kısa bir özürle düzeltmek için. Doğal bir öz-düzeltme sayılır.',
    'Doğru kelime ya da ifade; sonra cümleye devam.',
    [
      'I went there last year, sorry, I meant the year before.',
      "It's on the left, sorry, I meant the right.",
      'My sister, sorry, I meant my cousin, lives in Ankara.',
    ]),
  p('or should I say', 'ya da şöyle diyeyim',
    'Daha güçlü ya da daha uygun bir kelimeyle kendini yükseltmek için.',
    'Daha güçlü bir isim ya da sıfat.',
    [
      "It's a hobby, or should I say, a passion.",
      "He's my teacher, or should I say, my mentor.",
      'I live in a flat, or should I say, a tiny studio.',
    ]),
]
