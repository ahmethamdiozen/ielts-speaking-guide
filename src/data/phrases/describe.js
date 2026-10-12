import { phrase } from './_entry.js'
const p = phrase('describe')

export default [
  p("it's a kind of", 'bir tür ...',
    'Kelimeyi bilmediğinde nesneyi genel kategoriye koyarak anlatmak için.',
    'Bir isim ya da isim grubu: "a kind of fruit".',
    [
      "It's a kind of small bag you wear around your waist.",
      "It's a kind of fruit, a bit like an orange.",
      "It's a kind of festival that happens every spring.",
    ]),
  p("it's something you use to", 'şunun için kullandığın bir şey',
    'Eşyayı işlevi üzerinden anlatmak için.',
    'Fiil: "use to + fiil (yalın)".',
    [
      "It's something you use to cut paper.",
      "It's something you use to keep your drinks cold.",
      "Sorry, it's something you use to charge your phone.",
    ]),
  p("it's a place where", '... yapılan bir yer',
    'Yer adını bilmediğinde ne yapıldığını söyleyerek anlatmak için.',
    'Tam cümle: "where + özne + fiil".',
    [
      "It's a place where people go to relax after work.",
      "It's a place where you can borrow books for free.",
      "It's a place where my family gathers on weekends.",
    ]),
  p("it's like", 'gibi bir şey',
    'Benzetme ile anlatmak için. Kelime bilmiyorsan bilinen bir şeye benzet.',
    'Bir isim grubu: "like a small version of…".',
    [
      "It's like a small version of a bus.",
      "It's like a traditional dish, but with a modern twist.",
      "It's like a second home to me.",
    ]),
  p('a person who', '... yapan bir kişi',
    'Meslek ya da özellik adını bilmediğinde kişiyi tarif etmek için.',
    'Fiil: "a person who + fiil (3. tekil)".',
    [
      'A teacher is a person who helps you learn new things.',
      "He's a person who always keeps his promises.",
      'I admire a person who never gives up.',
    ]),
  p("I can't remember the word, but", 'kelimeyi hatırlayamıyorum ama',
    'Kelime aklına gelmediğinde durmak yerine bunu söyleyip tarif etmeye geçmek için. Sınav kurallarına uygundur.',
    'Hemen ardından "it\'s a kind of / it\'s something you use to…".',
    [
      "I can't remember the word, but it's a tool for cutting wood.",
      "I can't remember the word, but it's the opposite of expensive.",
      "I can't remember the word, but you wear it on your head.",
    ]),
]
