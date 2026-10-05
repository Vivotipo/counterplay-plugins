const FONT_PREVIEW_SAMPLES = [
  {
    "id": "sample-001",
    "title": "The quick brown fox",
    "text": "The quick brown fox jumps over the lazy dog."
  },
  {
    "id": "sample-002",
    "title": "Pack my box",
    "text": "Pack my box with five dozen liquor jugs."
  },
  {
    "id": "sample-003",
    "title": "Sphinx of black quartz",
    "text": "Sphinx of black quartz, judge my vow."
  },
  {
    "id": "sample-004",
    "title": "Bright vixens",
    "text": "Bright vixens jump; dozy fowl quack."
  },
  {
    "id": "sample-005",
    "title": "Jolly foxes",
    "text": "Jolly foxes pack my bright quartz box with five dozen wavy cups."
  },
  {
    "id": "sample-006",
    "title": "A quiet morning",
    "text": "The kitchen window was open. Somewhere beyond the garden, a bicycle bell rang twice. Light moved across the table, catching the rim of a cup and the folded edge of yesterday’s paper."
  },
  {
    "id": "sample-007",
    "title": "Along the coast",
    "text": "We followed the coast until the road became a footpath. Below us, the water changed from silver to green. There was no sign for the beach, only a gate, a few stone steps, and the sound of the tide."
  },
  {
    "id": "sample-008",
    "title": "At the workshop",
    "text": "A good tool disappears into the work. The handle fits, the blade holds its edge, and the next movement feels obvious. What remains is the material, the light, and the small decisions that give a thing its character."
  },
  {
    "id": "sample-009",
    "title": "After the rain",
    "text": "Rain left a dark border around every stone. The city seemed newly printed: sharp windows, pale walls, a red umbrella turning the corner. By noon the pavement would be dry, but for a moment everything reflected the sky."
  },
  {
    "id": "sample-010",
    "title": "Reading room",
    "text": "There are books we read quickly and books we keep returning to. A sentence changes with the hour. A familiar page offers a detail we missed. Reading makes a room inside the room, and gives us time to stay there."
  },
  {
    "id": "sample-011",
    "title": "Night train",
    "text": "The last train left at 23:48. Beyond the glass, station lights became a thin yellow line. Someone opened a notebook; someone fell asleep. We travelled through the dark with a warm square of light around us."
  },
  {
    "id": "sample-012",
    "title": "Summer market",
    "text": "Peaches, green figs, bitter oranges. A folded cloth on a wooden table. The woman at the stall weighed everything slowly, adding one more apricot before she closed the bag."
  },
  {
    "id": "sample-013",
    "title": "Notes on a typeface",
    "text": "A typeface is read at many distances. From across the room it makes a shape; on the page it makes a rhythm. Close up, the smallest curve must hold its own without disturbing the words around it."
  },
  {
    "id": "sample-014",
    "title": "An ordinary Tuesday",
    "text": "At 8:15 we opened the studio. By 9:00 the first proof was on the wall. Lunch happened late. In the afternoon, we moved one line, changed two words, and decided to leave the rest until tomorrow."
  },
  {
    "id": "sample-015",
    "title": "Small announcements",
    "text": "The reading room is open daily. Please return borrowed materials before closing. For workshop bookings, speak to the person at the front desk. Thank you for leaving the space as you found it."
  },
  {
    "id": "sample-016",
    "title": "Uppercase alphabet",
    "text": "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  {
    "id": "sample-017",
    "title": "Lowercase alphabet",
    "text": "abcdefghijklmnopqrstuvwxyz\nabcdefghijklmnopqrstuvwxyz"
  },
  {
    "id": "sample-018",
    "title": "Alternating case",
    "text": "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm\nNn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz"
  },
  {
    "id": "sample-019",
    "title": "Hamburgefontsiv",
    "text": "Hamburgefontsiv\nHamburgefontsiv\nHAMBURGEFONTSIV"
  },
  {
    "id": "sample-020",
    "title": "Minimum rhythm",
    "text": "minimum aluminium illumination\nnonono ononon nnnnn ooooo\nmmmmmm iiiiii llllll rrrrrr"
  },
  {
    "id": "sample-021",
    "title": "Round and straight",
    "text": "HHHOHHH OOOHOOO\nnonoonon noononnn\nHHOHOO HOHOHO nnonoo"
  },
  {
    "id": "sample-022",
    "title": "Capital diagonals",
    "text": "AV VA AW WA AY YA\nAT TA LT TL LY YL\nFA AF PA AP RA AR"
  },
  {
    "id": "sample-023",
    "title": "Mixed pairs",
    "text": "To Ta Te Ti Tu Ty\nVa Ve Vo Vu Wa We Wo Wy\nYo Ya Ye Yu Fo Fe Fa"
  },
  {
    "id": "sample-024",
    "title": "Punctuation rhythm",
    "text": "Hello, world. Really? Yes!\n(Type) [Space] {Shape}\n“Letters,” she said. ‘And words.’"
  },
  {
    "id": "sample-025",
    "title": "Office and affinity",
    "text": "office official efficient affinity\naffine waffle shuffle difficult\nfi fl ff ffi ffl"
  },
  {
    "id": "sample-026",
    "title": "Ascenders and descenders",
    "text": "bdfhkl bdfhkl bdfhkl\ngjpqy gjpqy gjpqy\nheading joyful typography"
  },
  {
    "id": "sample-027",
    "title": "Dense capitals",
    "text": "HAMBURG BERLIN LONDON OSLO\nNEW YORK TOKYO MEXICO CITY\nAMSTERDAM COPENHAGEN STOCKHOLM"
  },
  {
    "id": "sample-028",
    "title": "Wide and narrow",
    "text": "WMWMWM IIIIII\nWWW MMM NNN HHH OOO\nill will mill minimum maximum"
  },
  {
    "id": "sample-029",
    "title": "Double letters",
    "text": "bookkeeper committee balloon\ncoffee address success parallel\nll tt ff rr ss oo ee mm nn"
  },
  {
    "id": "sample-030",
    "title": "Similar shapes",
    "text": "Il1 O0 rn m vv w cl d\nI1l lI1 0O0 O0O\nmodern modem minimum"
  },
  {
    "id": "sample-031",
    "title": "Display title",
    "text": "A new point of view"
  },
  {
    "id": "sample-032",
    "title": "Two-line title",
    "text": "A PLACE\nTO BEGIN"
  },
  {
    "id": "sample-033",
    "title": "Editorial headline",
    "text": "The shape of things to come"
  },
  {
    "id": "sample-034",
    "title": "Exhibition poster",
    "text": "WAYS OF SEEING\nOpening Friday, 18:30\nGallery 04 — Free admission"
  },
  {
    "id": "sample-035",
    "title": "Book cover",
    "text": "The Long Way Home\nNotes from the edge of the city"
  },
  {
    "id": "sample-036",
    "title": "A short invitation",
    "text": "Come over on Sunday.\nBring something to share.\nWe’ll make room at the table."
  },
  {
    "id": "sample-037",
    "title": "Small print",
    "text": "Edition of 250 copies. Printed on uncoated paper. All measurements are approximate. Please retain this notice for future reference."
  },
  {
    "id": "sample-038",
    "title": "Wayfinding",
    "text": "ENTRANCE →\n← COURTYARD\nSTAIRS ↑\nLIFT · LEVEL 02"
  },
  {
    "id": "sample-039",
    "title": "Numbers",
    "text": "0123456789\n111111 222222 333333 444444\n555555 666666 777777 888888 999999"
  },
  {
    "id": "sample-040",
    "title": "Number pairs",
    "text": "00 01 02 03 04 05 06 07 08 09\n10 11 12 13 14 15 16 17 18 19\n88 89 90 91 92 93 94 95 96 97"
  },
  {
    "id": "sample-041",
    "title": "Prices",
    "text": "€12.50  €128.00  €1,249.95\n$12.50  $128.00  $1,249.95\n£12.50  ¥1,250  CHF 128.00"
  },
  {
    "id": "sample-042",
    "title": "A timetable",
    "text": "06:05  08:15  12:30  16:45  23:59\nMonday     09:00–18:00\nTuesday    09:00–18:00\nWednesday  10:00–20:00"
  },
  {
    "id": "sample-043",
    "title": "Dates and measurements",
    "text": "04.10.2026  2026/10/04  October 4\n12 mm · 48 pt · 1.5 kg · 250 ml\n21°C / 69.8°F · 100%"
  },
  {
    "id": "sample-044",
    "title": "Fractions",
    "text": "¼ ½ ¾ ⅓ ⅔ ⅛ ⅜ ⅝ ⅞\n1/2 3/4 5/8 7/16\n2½ cups + ¾ teaspoon"
  },
  {
    "id": "sample-045",
    "title": "Arithmetic",
    "text": "12 + 34 = 46\n56 − 28 = 28\n7 × 8 = 56\n144 ÷ 12 = 12\nx² + y² = z²"
  },
  {
    "id": "sample-046",
    "title": "Email and web",
    "text": "hello@example.com\nwww.example.com/type-design\n@studio #typography & friends"
  },
  {
    "id": "sample-047",
    "title": "Brackets and braces",
    "text": "(Hamburg) [Hamburg] {Hamburg}\n(Aa) [Bb] {Cc} <Dd>\n((12 + 34) × 5) / 6"
  },
  {
    "id": "sample-048",
    "title": "Dashes and quotes",
    "text": "hyphen-minus - en dash – em dash —\n“Double quotes” ‘single quotes’\n«Guillemets» ‹single guillemets›"
  },
  {
    "id": "sample-049",
    "title": "Accented capitals",
    "text": "À Á Â Ã Ä Å Ā Ă Ą\nÈ É Ê Ë Ē Ė Ę Ě\nÌ Í Î Ï Ī İ\nÒ Ó Ô Õ Ö Ø Ō Ő\nÙ Ú Û Ü Ū Ů Ű"
  },
  {
    "id": "sample-050",
    "title": "Accented lowercase",
    "text": "à á â ã ä å ā ă ą\nè é ê ë ē ė ę ě\nì í î ï ī\nò ó ô õ ö ø ō ő\nù ú û ü ū ů ű"
  },
  {
    "id": "sample-051",
    "title": "Marks in context",
    "text": "café façade naïve jalapeño\nÅngström smörgåsbord piñata\ncrème brûlée déjà vu São Paulo"
  },
  {
    "id": "sample-052",
    "title": "Composed and combining",
    "text": "á á é é í í ó ó ú ú\nÄ Ä Ö Ö Ü Ü Ñ Ñ\nạ ạ ấ ấ ắ ắ"
  },
  {
    "id": "sample-053",
    "title": "Italian afternoon",
    "text": "La luce del pomeriggio attraversa la stanza. Sul tavolo ci sono tre libri, una matita e una tazza di caffè. Fuori, la città continua a muoversi."
  },
  {
    "id": "sample-054",
    "title": "Italian accents",
    "text": "Perché è già così tardi?\nCittà, qualità, virtù, più, però.\nÈ una bella giornata: andiamo al mare."
  },
  {
    "id": "sample-055",
    "title": "French evening",
    "text": "À la fin de la journée, nous avons ouvert les fenêtres. L’air était frais, la rue presque vide. Une lumière douce éclairait les façades et les feuilles du jardin."
  },
  {
    "id": "sample-056",
    "title": "German morning",
    "text": "Über den Dächern wird es langsam hell. Die Straße ist noch ruhig, und aus der Bäckerei kommt der Duft von frischem Brot. Wir gehen zu Fuß bis zum Fluss."
  },
  {
    "id": "sample-057",
    "title": "Spanish courtyard",
    "text": "La puerta del patio estaba abierta. Había una mesa pequeña, dos sillas y una planta junto a la pared. ¿Nos quedamos aquí? Sí, todavía queda un poco de sol."
  },
  {
    "id": "sample-058",
    "title": "Portuguese coast",
    "text": "O mar estava calmo naquela manhã. Caminhámos até à praia e ficámos a ver os barcos. Havia tempo para conversar, beber um café e escolher outro caminho de volta."
  },
  {
    "id": "sample-059",
    "title": "Dutch streets",
    "text": "De stad wordt langzaam wakker. Iemand zet een fiets tegen de muur, een raam gaat open en de eerste tram rijdt over de brug. Vandaag nemen we de lange weg."
  },
  {
    "id": "sample-060",
    "title": "Danish garden",
    "text": "På bordet står en blå skål og et glas vand. Udenfor bevæger træerne sig i vinden. Vi åbner døren til haven og lader lyset komme ind."
  },
  {
    "id": "sample-061",
    "title": "Swedish island",
    "text": "På den lilla ön finns en väg, några röda hus och en brygga. Vi följer stigen genom skogen tills vi hör vattnet mellan träden."
  },
  {
    "id": "sample-062",
    "title": "Polish window",
    "text": "Za oknem powoli zapada wieczór. Na stole leżą książki, ołówek i filiżanka herbaty. Jeszcze jedna strona, jeszcze kilka słów."
  },
  {
    "id": "sample-063",
    "title": "Czech square",
    "text": "Na náměstí bylo ticho. Uprostřed stál strom a pod ním malá lavička. Přešli jsme přes ulici a chvíli pozorovali světlo v oknech."
  },
  {
    "id": "sample-064",
    "title": "Turkish light",
    "text": "Sabah ışığı odanın içine yavaşça doldu. Masanın üzerinde açık bir kitap, küçük bir defter ve bir fincan çay vardı. Bugün başka bir yoldan yürüyelim."
  },
  {
    "id": "sample-065",
    "title": "Vietnamese morning",
    "text": "Buổi sáng, ánh nắng chiếu qua cửa sổ. Trên bàn có một cuốn sách và một tách trà. Chúng tôi ngồi yên, nghe tiếng gió trong vườn."
  },
  {
    "id": "sample-066",
    "title": "Greek letters",
    "text": "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ\nαβγδεζηθικλμνξοπρστυφχψω\nά έ ή ί ό ύ ώ ϊ ϋ ΐ ΰ"
  },
  {
    "id": "sample-067",
    "title": "Greek afternoon",
    "text": "Το φως του απογεύματος μπαίνει από το ανοιχτό παράθυρο. Πάνω στο τραπέζι υπάρχει ένα βιβλίο και ένα ποτήρι νερό. Έχουμε ακόμα λίγο χρόνο."
  },
  {
    "id": "sample-068",
    "title": "Cyrillic letters",
    "text": "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ\nабвгдеёжзийклмнопрстуфхцчшщъыьэюя"
  },
  {
    "id": "sample-069",
    "title": "Ukrainian evening",
    "text": "За вікном повільно настає вечір. На столі лежать книжка й олівець. Ми відкриваємо двері до саду та слухаємо тихий шелест листя."
  },
  {
    "id": "sample-070",
    "title": "Arabic courtyard",
    "text": "في الصباح يدخل الضوء من النافذة المفتوحة. على الطاولة كتاب وكوب من الشاي. نجلس في هدوء ونستمع إلى صوت الريح في الحديقة."
  },
  {
    "id": "sample-071",
    "title": "Hebrew morning",
    "text": "אור הבוקר נכנס דרך החלון הפתוח. על השולחן יש ספר וכוס תה. אנחנו יושבים בשקט ומקשיבים לרוח בין העצים."
  },
  {
    "id": "sample-072",
    "title": "Hindi afternoon",
    "text": "दोपहर की रोशनी खुली खिड़की से कमरे में आती है। मेज़ पर एक किताब और एक कप चाय है। बाहर पेड़ों के बीच हवा धीरे-धीरे चल रही है।"
  },
  {
    "id": "sample-073",
    "title": "Bengali window",
    "text": "খোলা জানালা দিয়ে সকালের আলো ঘরে আসে। টেবিলের ওপর একটি বই আর এক কাপ চা আছে। বাইরে গাছের পাতায় হাওয়া লাগছে।"
  },
  {
    "id": "sample-074",
    "title": "Tamil garden",
    "text": "காலையில் திறந்த ஜன்னல் வழியாக வெளிச்சம் வருகிறது. மேசையின் மேல் ஒரு புத்தகமும் ஒரு கோப்பை தேநீரும் இருக்கின்றன."
  },
  {
    "id": "sample-075",
    "title": "Thai morning",
    "text": "แสงยามเช้าส่องผ่านหน้าต่างที่เปิดอยู่ บนโต๊ะมีหนังสือหนึ่งเล่มและชาหนึ่งถ้วย เรานั่งเงียบ ๆ ฟังเสียงลมในสวน"
  },
  {
    "id": "sample-076",
    "title": "Japanese window",
    "text": "朝の光が開いた窓から入ってくる。机の上には本とお茶がある。庭の木々が風に揺れ、遠くで自転車のベルが聞こえた。"
  },
  {
    "id": "sample-077",
    "title": "Japanese mixed writing",
    "text": "文字のかたち、ことばのリズム。\nカタカナ・ひらがな・漢字\n東京 2026年10月4日 12:30"
  },
  {
    "id": "sample-078",
    "title": "Chinese afternoon",
    "text": "午后的阳光照进房间。桌上放着一本书、一支铅笔和一杯茶。窗外的树叶轻轻摇动，我们还有时间再读一页。"
  },
  {
    "id": "sample-079",
    "title": "Traditional Chinese",
    "text": "午後的陽光照進房間。桌上放著一本書、一支鉛筆和一杯茶。窗外的樹葉輕輕搖動，我們還有時間再讀一頁。"
  },
  {
    "id": "sample-080",
    "title": "Korean room",
    "text": "열린 창문으로 아침 햇살이 들어옵니다. 책상 위에는 책 한 권과 따뜻한 차 한 잔이 있습니다. 정원의 나뭇잎이 바람에 천천히 흔들립니다."
  },
  {
    "id": "sample-081",
    "title": "Mixed directions",
    "text": "Type 2026 — مرحباً — Hello\n12:30 · שלום · Room 04\nABC العربية 123 XYZ"
  },
  {
    "id": "sample-082",
    "title": "Symbols and arrows",
    "text": "← ↑ → ↓ ↔ ↕ ↗ ↘\n© ® ™ § ¶ † ‡ • …\n+ − × ÷ = ≠ ≤ ≥ ± ∞"
  },
  {
    "id": "sample-083",
    "title": "A compact menu",
    "text": "COFFEE\nEspresso       2.50\nCappuccino     3.80\nFilter coffee  4.00\nTea            3.50"
  },
  {
    "id": "sample-084",
    "title": "A specimen note",
    "text": "40 pt / Regular\nA little more space.\nA little less weight.\nOne curve, reconsidered."
  },
  {
    "id": "sample-085",
    "title": "Very small details",
    "text": "a e s c · n h m u · p q b d\n.,:;!? / \\ | () [] {}\n0123456789 Il1 O0 rn m"
  }
];
