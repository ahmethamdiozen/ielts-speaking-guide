# IELTS Speaking Guide — Tasarım Spec'i

Tarih: 2026-10-12

## Amaç
Speaking mock testlerinde 5.5 → 6.5+. Konuşma botu değil; kendi başına çalışılan bir rehber + süreli alıştırma uygulaması. Açıklamalar Türkçe, örnekler İngilizce. Yapay zekâ, ses kaydı ve ses tanıma yok.

## Çözülecek problemler → özellik eşlemesi
| Problem | Çözüm |
|---|---|
| Cümleye yanlış başlayıp baştan kurma | Gramer kilitlemeyen başlangıç kalıpları ("The thing is…", "I'd say…") + yarıda düzeltme kalıpları ("…or rather…", "What I mean is…") |
| Cevabı uzatamama | Part 1/3 iskeletleri (Cevap → Sebep → Örnek → his/karşıt), her adımda geçiş kalıbı |
| Kelime bulamayınca takılma | Açıklama kalıpları ("It's a kind of…", "something you use to…") |
| Part 2'de ne anlatacağını bilmeme | Cue card tiplerini 5–6 slota bölen not şablonu + kullanıcının yazdığı hazır hikâye bankası |
| Part 3'te konudan sapma | Merdiven (Opinion → Reason → Example → Society/Future), keyword echo, "ben / toplum / gelecek" açıları |

## Teknik yaklaşım
`writing/` projesi şablon alınır: React 18, Vite, React Router, vitest + testing-library. `TopBar`, `SideNav`, `SearchBox`, `Reveal`, `Callout`, `useLocalStorage`, `search.js`, tema CSS'i kopyalanıp uyarlanır (ortak paket yok). İçerik `src/data/` altında JS verisi; arayüz sadece gösterir.

## Sayfalar
1. **Yöntem** — 3 kural: kalıpla başla (grameri kilitleme), iskeleti doldur, sessizlik yerine kalıp kullan.
2. **Kalıplar** — kategorili banka. Her kalıp: anlam, ne zaman kullanılır, sonra ne gelir, sık hata, 3 örnek. Kategoriler: cevaba başlama, zaman kazanma, yarıda düzeltme, uzatma/ekleme/karşıtlık, kelime bulamayınca açıklama, geçmiş/varsayım, Part 3 toplum/gelecek/karşılaştırma. Her kategoride en az 6 kalıp.
3. **Part 1** — kısa cevap iskeleti, 2–3 cümle ölçüsü.
4. **Part 2** — not şablonu (kim/ne, ne zaman/nerede, ne oldu, ne hissettim, neden önemli), 1 dk hazırlık + 2 dk konuşma çizelgesi, hikâye bankası (6–8 kişisel hikâye; kullanıcı yazar, `useLocalStorage`; cue card tipine göre hangi hikâye uyar).
5. **Part 3** — merdiven, keyword echo, üç açı fikir üretici.
6. **Alıştırma** — (a) rastgele soru kartı + kronometre (Part 1 ~20 sn; Part 2 60 sn + 120 sn; Part 3 ~40 sn), (b) Part 2 not şablonu doldurma modu (önce Türkçe notla, sonra İngilizce söyle), (c) kalıp boşluk doldurma (writing'deki `practice.js` mantığı), (d) "öğrendim" işareti ve arama.

## Veri yapısı
- `src/data/phrases/<kategori>.js` — writing'deki `e(...)` yardımcısına benzer.
- `src/data/questions/part1.js|part2.js|part3.js` — konu etiketli soru bankası. İlk sürüm: Part 1 ~10 konu, Part 2 ~20 cue card, Part 3 ~10 konu.
- `src/data/frames.js` — Part 1/2/3 iskeletleri ve slot şablonları.
- Hikâye bankası dosyada değil, tarayıcıda (`useLocalStorage`).

## Test / doğrulama
- `npm test`: her kalıpta 3 örnek, örnek kalıbı içeriyor, kategori başına ≥6 kalıp, soru bankasında Part ve konu etiketi eksiksiz.
- Elle: her sayfa mobil + masaüstü, kronometre ve rastgele soru.
- `npm run build` hatasız.

## Kapsam dışı
Konuşma botu, ses kaydı/tanıma, AI geri bildirimi, Reading/Listening, kullanıcı hesabı.

## Açık
GitHub Pages yayını (writing'deki gibi) isteğe bağlı; ilk sürüm sonrası karar verilecek.
