// Kullanıcının dolduracağı boş hikâye şablonları. İçerik tarayıcıda saklanır (stories-v1).
// fits: hangi cue card tiplerine uyar (frames.js part2.types[].id).
export const stories = [
  { id: 'person-admire', label: 'Hayran olduğum biri', prompt: 'Kim, nasıl tanıştın, ona neden hayransın? Bir örnek an ekle.', fits: ['person', 'event'] },
  { id: 'person-helped', label: 'Bana yardım eden biri', prompt: 'Ne zaman, neye yardım etti, sana ne hissettirdi?', fits: ['person', 'experience'] },
  { id: 'place-visited', label: 'Gittiğim özel bir yer', prompt: 'Neresi, kimle gittin, ne gördün-ne yaptın, neden aklında?', fits: ['place', 'event'] },
  { id: 'place-home', label: 'Evim ya da çocukluk mekânım', prompt: 'Nasıl görünüyor, orada ne yapardın, neyi özlüyorsun?', fits: ['place', 'object'] },
  { id: 'object-treasured', label: 'Değer verdiğim bir eşya', prompt: 'Ne bu, kim verdi, ne işe yarıyor, neden vazgeçmezsin?', fits: ['object', 'person'] },
  { id: 'event-memorable', label: 'Unutulmaz bir olay', prompt: 'Başı, ortası, sonu; ne hissettin, ne değişti?', fits: ['event', 'experience'] },
  { id: 'experience-challenge', label: 'Zorlandığım bir deneyim', prompt: 'Ne yaptın, en zor kısım neydi, nasıl aştın, ne öğrendin?', fits: ['experience', 'event'] },
  { id: 'experience-achievement', label: 'Gurur duyduğum bir başarı', prompt: 'Neydi, ne kadar çalıştın, sonuç ne oldu, neden önemli?', fits: ['experience', 'person'] },
]
