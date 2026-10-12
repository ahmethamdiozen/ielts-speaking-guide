export const method = {
  rules: [
    {
      title: 'Kalıpla başla, grameri kilitleme',
      short: 'Kalıpla başla',
      body: 'Cümleye hemen "ana fikri" kurmaya çalışma. Önce "I\'d say…", "The thing is…", "To be honest…" gibi bir kalıp söyle. Kalıp seni hiçbir yapıya mahkûm etmez, bu sırada ne diyeceğini düşünürsün. Cümlenin ortasında yanlış gittiğini fark edersen baştan kurma: "or rather", "what I mean is" ile aynı cümlenin içinde düzelt.',
    },
    {
      title: 'İskeleti doldur, fikir arama',
      short: 'İskeleti doldur',
      body: 'Her cevabın bir iskeleti var: Cevap → Sebep → Örnek (Part 3\'te bir de geniş açı). "Ne diyeceğim?" yerine "Şimdi hangi kutudayım?" diye sor. Kutuları sırayla doldurmak ne diyeceğini seçmekten çok daha kolaydır, çünkü her kutunun ne istediği belli.',
    },
    {
      title: 'Sessizlik yerine kalıp',
      short: 'Sessizlik yerine kalıp',
      body: 'Düşünmen gerekiyorsa susma; "Let me think", "That\'s a good question" de. Kelime bulamıyorsan "It\'s a kind of…", "It\'s something you use to…" ile tarif et. Konuşmanın akması, kelimenin kusursuz olmasından daha önemlidir.',
    },
  ],
  mistakes: [
    '"I don\'t know" deyip susmak. Her zaman bir tahmin ya da "it depends on…" ekle.',
    'Aynı kalıbı her cevapta tekrar etmek. Bir kategoriden 2–3 kalıp seçip dönüşümlü kullan.',
    'Cevabı tek cümlede bitirmek. En az iki adım (Cevap + Sebep) söyle.',
    'Düzeltmek için cümleyi baştan kurmak. Aynı cümlede "or rather" ile devam et.',
  ],
}

export const part1 = {
  steps: [
    { id: 'answer', label: 'Cevap', tr: 'Soruyu tek cümlede doğrudan cevapla.', example: 'Yes, I do. / Not really. / I\'d say I prefer mornings.' },
    { id: 'reason', label: 'Sebep', tr: 'Neden öyle düşündüğünü bir cümlede söyle.', example: 'The reason is that it helps me focus.' },
    { id: 'example', label: 'Mini örnek', tr: 'Küçük, kişisel bir örnek ver (süre kalırsa).', example: 'For example, I usually read for an hour before bed.' },
  ],
  length: 'Part 1 cevabı 2–3 cümle (yaklaşık 15–25 saniye). Tek kelimelik cevap da, 1 dakikalık monolog da hedef değil.',
  sample: {
    question: 'Do you enjoy cooking?',
    answer: "To be honest, not really. The reason is that I don't have much time after work. For example, on weekdays I usually just make something simple like pasta.",
  },
  rules: [
    'İlk cümle soruyu doğrudan cevaplamalı; ek bilgiyi sonra ver.',
    'Soruda geçen fiili ve zamanı cevaba taşı (Do you… → I do / I don\'t).',
    'Sebep olmadan bırakma; "because" ya da "the reason is that" ekle.',
    'Konu kişiselse "in my case" ile kendi hayatına bağla.',
  ],
}

const slot = (id, label, prompt, starter) => ({ id, label, prompt, starter })

export const part2 = {
  types: [
    {
      id: 'person',
      title: 'Kişi',
      slots: [
        slot('who', 'Kim?', 'Kim bu kişi, seninle ilişkisi ne?', 'The person I\'d like to talk about is…'),
        slot('know', 'Nasıl tanıyorsun?', 'Ne zaman, nerede tanıştın?', 'I first met him/her when…'),
        slot('look', 'Nasıl biri?', 'Dış görünüş ya da kişilik, iki özellik.', 'He/she is the kind of person who…'),
        slot('happened', 'Bir an', 'Birlikte yaşadığın somut bir olay.', 'I remember one time when…'),
        slot('why', 'Neden önemli?', 'Sana ne kattı?', 'The reason this person matters to me is that…'),
      ],
    },
    {
      id: 'place',
      title: 'Yer',
      slots: [
        slot('where', 'Neresi?', 'Yer neresi, neden orada bulundun?', 'The place I\'d like to describe is…'),
        slot('when', 'Ne zaman?', 'Ne zaman, kimle gittin?', 'I went there with… in…'),
        slot('look', 'Nasıl bir yer?', 'Görünüş, atmosfer, ses ve koku.', 'It\'s a place where…'),
        slot('happened', 'Ne yaptın?', 'Orada yaptığın bir şey.', 'While I was there, I…'),
        slot('why', 'Neden özel?', 'Ne hissettin, neden hatırlıyorsun?', 'It stays in my mind because…'),
      ],
    },
    {
      id: 'object',
      title: 'Eşya',
      slots: [
        slot('what', 'Ne bu?', 'Eşya ne, nasıl görünüyor?', 'The thing I\'d like to talk about is…'),
        slot('get', 'Nasıl edindin?', 'Kim verdi, ne zaman aldın?', 'I got it when…'),
        slot('use', 'Ne işe yarıyor?', 'Nasıl kullanıyorsun?', 'I usually use it to…'),
        slot('happened', 'Bir anı', 'Onunla ilgili somut bir anı.', 'I remember once when…'),
        slot('why', 'Neden önemli?', 'Duygusal ya da pratik değeri.', 'It means a lot to me because…'),
      ],
    },
    {
      id: 'event',
      title: 'Olay',
      slots: [
        slot('what', 'Ne olay?', 'Ne olduğu ve ne zaman olduğu.', 'The event I\'m going to talk about is…'),
        slot('who', 'Kimlerle?', 'Orada kimler vardı?', 'I was there with…'),
        slot('happened', 'Ne oldu?', 'Başı, ortası ve sonu: iki üç adım.', 'First… then… in the end…'),
        slot('felt', 'Ne hissettin?', 'Duygunu bir cümlede anlat.', 'I felt…'),
        slot('why', 'Neden önemli?', 'Sonradan ne değişti?', 'Looking back, it was important because…'),
      ],
    },
    {
      id: 'experience',
      title: 'Deneyim',
      slots: [
        slot('what', 'Ne yaptın?', 'Deneyimin kısa özeti.', 'I\'d like to talk about the time when I…'),
        slot('when', 'Ne zaman, nerede?', 'Zaman ve yer.', 'It happened… in…'),
        slot('hard', 'Zor ya da özel olan', 'Seni zorlayan ya da heyecanlandıran nokta.', 'The hardest part was…'),
        slot('felt', 'Ne hissettin?', 'Önce, sırasında, sonra.', 'At first I felt… but later…'),
        slot('why', 'Ne öğrendin?', 'Bu deneyimden aldığın ders.', 'What I learned from it is that…'),
      ],
    },
  ],
  timeline: [
    { time: '0:00–1:00', title: 'Hazırlık (1 dakika)', tips: ['Cue card\'ın tipini belirle (kişi, yer, eşya, olay, deneyim).', 'Her slot için 2–3 kelimelik not al; cümle yazma.', 'Hikâye bankandan uyan bir hikâyeyi seç.'] },
    { time: '1:00–1:20', title: 'Başlangıç', tips: ['Cue card\'daki cümleyle başla: "I\'d like to talk about…".', 'Ana soruyu kısaca cevapla, sonra slotlara geç.'] },
    { time: '1:20–2:40', title: 'Gövde', tips: ['Slotları sırayla anlat; her slot 15–25 saniye.', 'Duraksarsan "Let me think" ya da "how can I put it" kullan.', 'Zaman kalırsa "I remember…" ile bir sahne ekle.'] },
    { time: '2:40–3:00', title: 'Kapanış', tips: ['"Why" slotuna dön: bu neden önemli ya da özel?', 'Süre bitince incelik: "So that\'s all I wanted to say."'] },
  ],
}

export const part3 = {
  ladder: [
    { id: 'opinion', label: 'Fikir (Opinion)', tr: 'Fikrini ya da genellemeni söyle.', example: 'I\'d say it depends on the person, but generally speaking…' },
    { id: 'reason', label: 'Sebep (Reason)', tr: 'Neden öyle olduğunu açıkla.', example: 'The reason is that people have different priorities.' },
    { id: 'example', label: 'Örnek (Example)', tr: 'Somut bir örnek ya da kendi deneyimin.', example: 'For example, in my case, I prefer…' },
    { id: 'wider', label: 'Geniş açı (Society / Future)', tr: 'Topluma ya da geleceğe bağla veya karşı görüşü ekle.', example: 'Having said that, in the long run this could change.' },
  ],
  echo: {
    question: 'Why do people travel abroad?',
    weak: 'To see new things.',
    strong: 'People travel abroad mainly because they want to see new places and experience different cultures.',
  },
  angles: [
    { id: 'me', label: 'Ben', prompt: 'Kendi deneyimin ya da çevren: "In my case…", "I remember…".' },
    { id: 'society', label: 'Toplum', prompt: 'Genel insanlar, gençler/yaşlılar, şehir/köy: "Generally speaking…", "These days…".' },
    { id: 'future', label: 'Gelecek', prompt: 'Ne değişir? Zaman karşılaştırması: "Compared to the past…", "In the long run…".' },
  ],
  sample: {
    question: 'Why do people like to travel to other countries?',
    answer: "I'd say the main reason is curiosity. People want to see how others live. For example, in my case, I travelled to Italy last year and I learned a lot about local food and customs. Having said that, in the long run, I think cheaper flights will make travelling even more common.",
  },
}
