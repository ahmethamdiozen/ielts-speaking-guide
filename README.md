# IELTS Speaking Guide

IELTS Speaking için kalıp bankası, Part 1/2/3 iskeletleri, kişisel hikâye bankası ve süreli çalışma. Açıklamalar Türkçe, örnekler İngilizce. Konuşma botu ya da ses kaydı yoktur; kendi sesinle çalışırsın.

## Neler var?
- **Yöntem:** 3 temel kural.
- **Kalıplar:** 7 kategoride 42 kalıp (anlam, ne zaman, sonra ne gelir, sık hata, 3 örnek). Arama ve "öğrendim" işareti.
- **Part 1 / Part 3:** cevap iskeleti ve merdiven.
- **Part 2:** cue card tiplerine göre not şablonu, zaman çizelgesi, 8 şablonlu hikâye bankası (tarayıcıda saklanır).
- **Çalışma:** rastgele soru + kronometre (Part 1 20 sn, Part 2 1+2 dk, Part 3 40 sn).
- **Alıştırma:** örnek cümlelerden kalıp boşluk doldurma.

## Geliştirme
```bash
npm install
npm run dev
npm test
npm run build
```

## İçerik eklemek
- **Yeni kalıp:** `src/data/phrases/<kategori>.js` içine `p(term, tr, use, next, examples, extra)` satırı ekle; `npm test` her kalıpta 3–5 örnek olduğunu ve örneklerin kalıbı içerdiğini doğrular.
- **Yeni kategori:** yeni dosya aç, `phrases/index.js` içindeki `categories` ve `entries` listesine ekle (en az 6 kalıp).
- **Yeni soru:** `src/data/questions/part1.js|part2.js|part3.js`.
