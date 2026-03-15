export interface QuranVerse {
  id: string;
  surah: number;
  surahName: string;
  ayah: number;
  arabicText: string;
  englishText: string;
  translationName: string;
}

export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  canonType: 'Protestant' | 'Catholic' | 'Orthodox';
}

export interface EthiopianVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  notes?: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  subtopics: { id: string; name: string }[];
}

export const sampleQuranVerses: QuranVerse[] = [
  {
    id: 'q1',
    surah: 1,
    surahName: 'Al-Fatiha',
    ayah: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    englishText: 'In the name of God, the Most Gracious, the Most Merciful.',
    translationName: 'Sahih International',
  },
  {
    id: 'q2',
    surah: 1,
    surahName: 'Al-Fatiha',
    ayah: 2,
    arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    englishText: 'All praise is due to God, Lord of all the worlds.',
    translationName: 'Sahih International',
  },
  {
    id: 'q3',
    surah: 2,
    surahName: 'Al-Baqarah',
    ayah: 255,
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    englishText: 'God — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
    translationName: 'Sahih International',
  },
  {
    id: 'q4',
    surah: 112,
    surahName: 'Al-Ikhlas',
    ayah: 1,
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    englishText: 'Say, "He is God, the One."',
    translationName: 'Sahih International',
  },
  {
    id: 'q5',
    surah: 5,
    surahName: 'Al-Ma\'idah',
    ayah: 32,
    arabicText: 'مَن قَتَلَ نَفْسًا بِغَيْرِ نَفْسٍ أَوْ فَسَادٍ فِي الْأَرْضِ فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا',
    englishText: 'Whoever kills a soul — unless for a soul or for corruption in the land — it is as if he had slain mankind entirely.',
    translationName: 'Sahih International',
  },
];

export const sampleBibleVerses: BibleVerse[] = [
  {
    id: 'b1',
    book: 'Genesis',
    chapter: 1,
    verse: 1,
    text: 'In the beginning God created the heavens and the earth.',
    translation: 'NIV',
    canonType: 'Protestant',
  },
  {
    id: 'b2',
    book: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    translation: 'NIV',
    canonType: 'Protestant',
  },
  {
    id: 'b3',
    book: 'Psalms',
    chapter: 23,
    verse: 1,
    text: 'The Lord is my shepherd, I lack nothing.',
    translation: 'NIV',
    canonType: 'Protestant',
  },
  {
    id: 'b4',
    book: 'Proverbs',
    chapter: 3,
    verse: 5,
    text: 'Trust in the Lord with all your heart and lean not on your own understanding.',
    translation: 'NIV',
    canonType: 'Protestant',
  },
  {
    id: 'b5',
    book: 'Matthew',
    chapter: 5,
    verse: 9,
    text: 'Blessed are the peacemakers, for they will be called children of God.',
    translation: 'NIV',
    canonType: 'Protestant',
  },
];

export const sampleEthiopianVerses: EthiopianVerse[] = [
  {
    id: 'e1',
    book: '1 Enoch',
    chapter: 1,
    verse: 1,
    text: 'The words of the blessing of Enoch, wherewith he blessed the elect and righteous, who will be living in the day of tribulation.',
    translation: 'R.H. Charles',
    notes: 'Part of the Ethiopian Orthodox Biblical canon, not included in Protestant or Catholic Bibles.',
  },
  {
    id: 'e2',
    book: 'Jubilees',
    chapter: 2,
    verse: 1,
    text: 'And the angel of the presence spoke to Moses according to the word of the Lord, saying: Write the complete history of the creation.',
    translation: 'R.H. Charles',
    notes: 'Also known as the "Little Genesis". Canonical in the Ethiopian Orthodox tradition.',
  },
  {
    id: 'e3',
    book: '1 Meqabyan',
    chapter: 1,
    verse: 1,
    text: 'And it came to pass in those days that the people of God gathered together to resist the forces of wickedness.',
    translation: 'Ethiopian Canon Translation',
    notes: 'Unique to the Ethiopian Orthodox Biblical canon. Not to be confused with the books of Maccabees.',
  },
  {
    id: 'e4',
    book: 'Sirach',
    chapter: 1,
    verse: 1,
    text: 'All wisdom comes from the Lord and with him it remains forever.',
    translation: 'NRSV',
    notes: 'Included in the Ethiopian, Catholic, and Orthodox canons.',
  },
];

export const topics: Topic[] = [
  {
    id: 't1',
    name: 'God and Divine Nature',
    description: 'Explore how different scriptures describe the nature, attributes, and oneness of God.',
    icon: '✦',
    subtopics: [
      { id: 's1', name: 'Oneness of God' },
      { id: 's2', name: 'Attributes of God' },
      { id: 's3', name: 'Trinity' },
    ],
  },
  {
    id: 't10',
    name: 'Misunderstood Concepts',
    description: 'Clarifying commonly misunderstood religious concepts with scholarly context.',
    icon: '🔍',
    subtopics: [
      { id: 's32', name: 'Jihad' },
      { id: 's33', name: 'Trinity' },
      { id: 's34', name: 'Crucifixion' },
      { id: 's35', name: 'Religious Law' },
    ],
  },
  {
    id: 't2',
    name: 'Prophets and Messengers',
    description: 'Study the prophets recognized across the Abrahamic traditions.',
    icon: '☽',
    subtopics: [
      { id: 's4', name: 'Adam' },
      { id: 's5', name: 'Noah' },
      { id: 's6', name: 'Abraham' },
      { id: 's7', name: 'Moses' },
      { id: 's8', name: 'David' },
      { id: 's9', name: 'Jesus' },
      { id: 's10', name: 'Muhammad' },
    ],
  },
  {
    id: 't3',
    name: 'Jesus and Mary',
    description: 'Understand how Jesus and Mary are portrayed across the Qur\'an and Bible.',
    icon: '✝',
    subtopics: [
      { id: 's11', name: 'Birth of Jesus' },
      { id: 's12', name: 'Miracles of Jesus' },
      { id: 's13', name: 'Mary in the Qur\'an' },
    ],
  },
  {
    id: 't4',
    name: 'Salvation and Forgiveness',
    description: 'How different faiths approach redemption, mercy, and divine forgiveness.',
    icon: '❋',
    subtopics: [
      { id: 's14', name: 'Repentance' },
      { id: 's15', name: 'Grace and Mercy' },
      { id: 's16', name: 'Atonement' },
    ],
  },
  {
    id: 't5',
    name: 'Prayer and Worship',
    description: 'Forms of prayer, devotion, and worship across religious traditions.',
    icon: '🤲',
    subtopics: [
      { id: 's17', name: 'Daily Prayer' },
      { id: 's18', name: 'Fasting' },
      { id: 's19', name: 'Pilgrimage' },
    ],
  },
  {
    id: 't6',
    name: 'Peace and Justice',
    description: 'Scriptural teachings on peace, justice, and righteous conduct.',
    icon: '⚖',
    subtopics: [
      { id: 's20', name: 'Social Justice' },
      { id: 's21', name: 'Peacemaking' },
      { id: 's22', name: 'Charity and Giving' },
    ],
  },
  {
    id: 't7',
    name: 'Moral Teachings',
    description: 'Universal moral principles found across scriptures.',
    icon: '☀',
    subtopics: [
      { id: 's23', name: 'Honesty and Truth' },
      { id: 's24', name: 'Kindness and Compassion' },
      { id: 's25', name: 'Patience and Gratitude' },
    ],
  },
  {
    id: 't8',
    name: 'Interfaith Harmony',
    description: 'Scriptures that encourage dialogue, respect, and understanding between faiths.',
    icon: '🕊',
    subtopics: [
      { id: 's26', name: 'Shared Values' },
      { id: 's27', name: 'Respect for Others' },
      { id: 's28', name: 'Religious Coexistence' },
    ],
  },
  {
    id: 't9',
    name: 'Afterlife and Judgment',
    description: 'Beliefs about the hereafter, resurrection, and divine judgment.',
    icon: '∞',
    subtopics: [
      { id: 's29', name: 'Paradise and Heaven' },
      { id: 's30', name: 'Day of Judgment' },
      { id: 's31', name: 'Resurrection' },
    ],
  },
];

export const verseOfTheDay = {
  quran: sampleQuranVerses[0],
  bible: sampleBibleVerses[4],
  ethiopian: sampleEthiopianVerses[0],
};
