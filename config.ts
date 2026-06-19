// config.ts
export type CategoryKey = 
  | 'SPOR' | 'TARİH' | 'COĞRAFYA' | 'BİLİM' | 'TEKNOLOJİ' 
  | 'MUTFAK' | 'SANAT_VE_EĞLENCE' | 'EDEBİYAT_VE_DİL' 
  | 'KÜLTÜRLER_VE_YAŞAM' | 'HOBİLER_VE_OYUNLAR';

export const CATEGORY_CONFIG: Record<CategoryKey, string[]> = {
  SPOR: [
    "Futbol", "FIFA Dünya Kupası", "UEFA Şampiyonlar Ligi", "İngiltere Premier Lig", 
    "MotoGP", "Süper Lig", "Formula 1", "NBA", "EuroLeague", "Tenis", 
    "Olimpiyat Oyunları", "Voleybol", "Boks", "Güreş", "Satranç", "Golf", "MMA", "E-Spor"
  ],
  TARİH: [
    "Osmanlı Tarihi", "Türkiye Cumhuriyeti Tarihi", "Antik Mısır", "Antik Yunan", 
    "Roma İmparatorluğu", "Orta Çağ Avrupa", "Rönesans", "Coğrafi Keşifler", 
    "I. Dünya Savaşı", "II. Dünya Savaşı", "Soğuk Savaş", "Türk Kurtuluş Savaşı", 
    "Selçuklu Tarihi", "Bizans İmparatorluğu", "Moğol İmparatorluğu"
  ],
  COĞRAFYA: [
    "Türkiye Coğrafyası", "Avrupa Ülkeleri", "Asya Ülkeleri", "Afrika Ülkeleri", 
    "Kuzey Amerika", "Güney Amerika", "Başkentler", "Bayraklar", "Dünya Nehirleri", 
    "Dünya Dağları", "Adalar", "Çöller", "Okyanuslar", "Türkiye Şehirleri", "Milli Parklar"
  ],
  BİLİM: [
    "Astronomi", "Fizik", "Kimya", "Biyoloji", "Genetik", "İnsan Anatomisi", 
    "Jeoloji", "Paleontoloji", "Ekoloji", "Matematik", "Ünlü Bilim İnsanları", 
    "Uzay Keşifleri", "Elementler", "Mikrobiyoloji", "Evrim"
  ],
  TEKNOLOJİ: [
    "Programlama", "Bilgisayar Donanımı", "İşletim Sistemleri", "Linux", 
    "Microsoft Windows", "Siber Güvenlik", "Yapay Zekâ", "İnternet Tarihi", 
    "Veritabanları", "Ağ Teknolojileri", "Mobil Teknolojiler", "Oyun Geliştirme", 
    "Açık Kaynak Yazılım", "Robotik", "Bulut Bilişim", "Video Oyun Tarihi", 
    "Bilgisayar Ağları", "Veri Yapıları ve Algoritmalar"
  ],
  MUTFAK: [
    "Türk Mutfağı", "İtalyan Mutfağı", "Fransız Mutfağı", "Japon Mutfağı", 
    "Çin Mutfağı", "Dünya Tatlıları", "Kahve Kültürü", "Çay Kültürü", "Baharatlar", 
    "Ekmekçilik", "Peynirler", "Deniz Ürünleri", "Sokak Lezzetleri", 
    "Mutfak Teknikleri", "Fermente Gıdalar"
  ],
  SANAT_VE_EĞLENCE: [
    "Türk Sineması", "Dünya Sineması", "Oscar Ödülleri", "Korku Sineması", 
    "Rock Müzik", "Klasik Müzik", "Pop Müzik", "Resim Sanatı", "Tiyatro", 
    "Opera ve Bale", "Fotoğraf Sanatı", "Çizgi Romanlar", "Animasyon Filmleri", 
    "Televizyon Dizileri", "Animeler"
  ],
  EDEBİYAT_VE_DİL: [
    "Türk Edebiyatı", "Dünya Edebiyatı", "Şiir", "Romanlar", "Türk Mitolojisi", 
    "Yunan Mitolojisi", "İskandinav Mitolojisi", "Türk Atasözleri", "Türk Deyimleri", 
    "Japon Atasözleri ve Deyimleri", "Kelime Kökenleri", "Türkçe Dil Bilgisi", "Ünlü Yazarlar"
  ],
  KÜLTÜRLER_VE_YAŞAM: [
    "Türk Gelenekleri", "İngiliz Gelenekleri", "Japon Kültürü", "Kore Kültürü", 
    "Çin Kültürü", "Fransız Kültürü", "Alman Kültürü", "İskandinav Kültürü", 
    "Hint Kültürü", "Arap Kültürü", "Dinler Tarihi", "Dünya Festivalleri", 
    "Halk Dansları", "Dünya Mirasları"
  ],
  HOBİLER_VE_OYUNLAR: [
    "Görsel Sanatlar", "Kampçılık", "Balıkçılık", "Bahçecilik", "Modelcilik", 
    "Koleksiyonculuk", "Masa Oyunları", "Kart Oyunları", "Masa Üstü Rol Yapma Oyunları", 
    "Minecraft", "League of Legends", "Counter-Strike", "Pokémon", 
    "Dungeons & Dragons", "Warcraft Evreni", "The Elder Scrolls",
    "Dark Souls", "Final Fantasy", "The Legend of Zelda", "Super Mario",
    "GTA", "Call of Duty", "Assassin's Creed", "FIFA"
  ]
};