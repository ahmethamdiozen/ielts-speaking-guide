const day = (id, title, steps, link) => ({ id, title, steps, ...(link ? { link } : {}) })
const rest = (id, steps) => day(id, 'Hafif tekrar', steps, { to: '/practice', label: 'Boşluk doldurma' })

export default {
  title: '4 haftalık Speaking planı',
  intro: 'Günde 35-40 dk, haftada 6 gün çalışma, 7. gün hafif tekrar. Her gün aynı ritim: 5 dk kalıp tekrarı, 10 dk o günün konusu, 15-20 dk süreli sesli konuşma, 5 dk kaydı dinleme.',
  weeks: [
    {
      id: 'w1', title: '1. Hafta: Takılmayı ve baştan kurmayı bitir', goal: 'Kalıp temeli. Sessizlik yerine kalıp söylemeyi alışkanlık yap.',
      days: [
        day('d01', 'Yöntem ve zaman kazanma', ['Yöntem sayfasındaki 3 kuralı oku.', 'Zaman kazanma kalıplarından 6 tanesini sesli söyleyerek ezberle.'], { to: '/phrases/time', label: 'Zaman kazanma' }),
        day('d02', 'Cevaba başlama', ['Görüş bildirme, emin olmama ve "bilmiyorum" durumu kalıplarını çalış.', 'Her kalıpla 3 farklı soruyu cevapla.'], { to: '/phrases/start', label: 'Cevaba başlama' }),
        day('d03', 'Yarıda düzeltme', ['Bir cümleyi bilerek yanlış başlat, baştan kurmadan or rather / what I mean is ile toparla.', '10 kez tekrarla.'], { to: '/phrases/repair', label: 'Yarıda düzeltme' }),
        day('d04', 'Kelime bulamayınca', ['Bildiğin 10 nesneyi it\'s a kind of… / something you use to… ile tarif et.'], { to: '/phrases/describe', label: 'Kelime bulamayınca' }),
        day('d05', 'Karışık Part 1', ['Dört kategoriyi karıştırarak Part 1 sorularını cevapla, her cevap 15-20 sn.'], { to: '/drill/part1', label: 'Part 1 soruları' }),
        day('d06', 'Boşluk doldurma ve Kayıt 1', ['Kalıp boşluk doldurma yap.', 'Kayıt 1: 5 soruyu kaydet, bu kaydı sakla (karşılaştırma için).'], { to: '/practice', label: 'Boşluk doldurma' }),
        rest('d07', ['10 dk kalıp tekrarı. Öğrendim işaretlerini gözden geçir.']),
      ],
    },
    {
      id: 'w2', title: '2. Hafta: Part 1 otomatikleşsin', goal: 'Cevabı uzatma. Part 1 cevabı 2-3 cümle, akıcı.',
      days: [
        day('d08', 'Part 1 iskeleti', ['Cevap → Sebep → Mini örnek.', '10 soruyu bu iskeletle cevapla.'], { to: '/part1', label: 'Part 1 iskeleti' }),
        day('d09', 'Uzatma kalıpları', ['Ekleme ve karşıtlık kalıplarını çalış.', 'Aynı 10 soruyu bu kez 30 saniyeye çıkar.'], { to: '/phrases/extend', label: 'Uzatma ve ekleme' }),
        day('d10', 'Geçmiş ve varsayım', ['used to, if I were…, I\'d probably… kalıplarını çalış.', 'İlgili Part 1 konularında kullan.'], { to: '/phrases/past', label: 'Geçmiş ve varsayım' }),
        day('d11', 'Yeni konular', ['5 yeni konu × 4 soru. Her cevapta en az bir kalıp kullan.'], { to: '/drill/part1', label: 'Part 1 soruları' }),
        day('d12', '5 dakika durmadan', ['Karışık Part 1, 5 dk durmadan konuş.', 'Takıldığında sessiz kalma, zaman kazanma kalıbını kullan.'], { to: '/drill/part1', label: 'Part 1 soruları' }),
        day('d13', 'Kayıt 2', ['G6 ile aynı 5 soruyu kaydet.', 'İki kaydı karşılaştır: baştan kurma sayısı ve cevap uzunluğu.'], { to: '/drill/part1', label: 'Part 1 soruları' }),
        rest('d14', ['10 dk kalıp tekrarı.']),
      ],
    },
    {
      id: 'w3', title: '3. Hafta: Part 2, 2 dakikayı doldur', goal: '8 hikâyeni hazırla, Part 2\'yi bu hikâyelerden besle.',
      days: [
        day('d15', 'Hikâyeler 1-2', ['Hikâye bankasından 2 şablonu doldur (Türkçe notlarla başla).'], { to: '/part2/stories', label: 'Hikâye bankası' }),
        day('d16', 'Hikâyeler 3-4', ['2 hikâye daha. İngilizce versiyonunu da yaz.'], { to: '/part2/stories', label: 'Hikâye bankası' }),
        day('d17', 'Hikâyeler 5-6', ['2 hikâye daha.'], { to: '/part2/stories', label: 'Hikâye bankası' }),
        day('d18', 'Hikâyeler 7-8 ve eşleştirme', ['Son 2 hikâyeyi doldur.', 'Her cue card tipine (kişi, yer, nesne, olay, deneyim) hangi hikâyenin uyduğunu eşleştir.'], { to: '/part2', label: 'Part 2 şablonu' }),
        day('d19', '1 dk hazırlık + 2 dk', ['Zaman çizelgesiyle 1 kart, 2 tur.', 'İkinci turda kaydı dinleyip eksik slotu (ne hissettim, neden önemli) ekle.'], { to: '/drill/part2', label: 'Part 2 çalışması' }),
        day('d20', '3 farklı kart', ['3 farklı kartla 2 dakikayı doldur.', 'Dolmayan slot için bir kalıp hazırla.'], { to: '/drill/part2', label: 'Part 2 çalışması' }),
        rest('d21', ['10 dk kalıp tekrarı.', 'Kayıt 3: bir Part 2 kartı kaydet ve süreyi yaz.']),
      ],
    },
    {
      id: 'w4', title: '4. Hafta: Part 3 ve tam mock', goal: 'Soruya bağlı kal, tam bir mock\'u baştan sona konuş.',
      days: [
        day('d22', 'Part 3 merdiveni', ['Fikir → Sebep → Örnek → Toplum/Gelecek.', 'Soru kelimesini cevabın içinde tekrar et (keyword echo).'], { to: '/part3', label: 'Part 3 merdiveni' }),
        day('d23', 'Üç açı: ben, toplum, gelecek', ['10 Part 3 sorusunda üç açıdan fikir üret.'], { to: '/drill/part3', label: 'Part 3 soruları' }),
        day('d24', 'Part 3 kalıpları', ['Toplum, gelecek ve karşılaştırma kalıplarını çalış.', '40 saniyelik cevaplar ver.'], { to: '/phrases/part3', label: 'Part 3 kalıpları' }),
        day('d25', 'Tam mock 1', ['Part 1 + 2 + 3 arka arkaya, kayıtlı.'], { to: '/drill', label: 'Çalışma' }),
        day('d26', 'Zayıf noktaya çalış', ['Kaydı dinle, en zayıf Part\'ı seç.', 'O Part\'a 35 dk ver.'], { to: '/drill', label: 'Çalışma' }),
        day('d27', 'Tam mock 2', ['İkinci tam mock, kayıtlı.', 'İlk mock ile karşılaştır.'], { to: '/drill', label: 'Çalışma' }),
        day('d28', 'Dinlen', ['Sadece kalıp tekrarı. Mock günü iyi uyu.'], { to: '/phrases', label: 'Kalıplar' }),
      ],
    },
  ],
  checks: [
    { name: 'Baştan kurma sayısı (5 dk\'da)', target: 'Hafta 1\'de yarıya, Hafta 4\'te 0-1' },
    { name: 'Part 1 cevap uzunluğu', target: '2-3 cümle' },
    { name: 'Part 2 süresi', target: '1:50 ve üzeri' },
    { name: 'Part 3 sapma', target: 'Soru kelimesini cevapta tekrar et' },
  ],
}
