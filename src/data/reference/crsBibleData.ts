import type { BibleVersionId } from '../../utils/studioCalculators';

export interface BibleVersionInfo {
  id: BibleVersionId;
  short: string;
  name: string;
  style: string;
}

export const BIBLE_VERSIONS: readonly BibleVersionInfo[] = [
  { id: 'rsv', short: 'RSV', name: 'Revised Standard Version', style: 'JAMB & WAEC CRS standard' },
  { id: 'kjv', short: 'KJV', name: 'King James Version', style: 'Classic Nigerian church Bible' },
  { id: 'nkjv', short: 'NKJV', name: 'New King James Version', style: 'Updated classic English' },
  { id: 'gnt', short: 'GNT', name: 'Good News Translation (GNB)', style: 'Popular school & CRS Bible' },
  { id: 'nlt', short: 'NLT', name: 'New Living Translation', style: 'Clear everyday English' },
  { id: 'amp', short: 'AMP', name: 'Amplified Bible', style: 'Expanded study meanings' },
  { id: 'esv', short: 'ESV', name: 'English Standard Version', style: 'Modern word-for-word study' },
  { id: 'msg', short: 'MSG', name: 'The Message', style: 'Modern conversational paraphrase' },
  { id: 'nasb', short: 'NASB', name: 'New American Standard Bible', style: 'Literal study precision' },
  { id: 'erv', short: 'ERV', name: 'Easy-to-Read Version', style: 'Very simple reading level' },
  { id: 'web', short: 'WEB', name: 'World English Bible', style: 'Open modern English' },
  { id: 'bbe', short: 'BBE', name: 'Bible in Basic English', style: 'Simple everyday words' },
] as const;

export interface BibleVerseItem {
  verse: number;
  text: string;
}

export interface CrsQuickPassage {
  id: string;
  title: string;
  theme: string;
  book: string;
  chapter: number;
  refLabel: string;
}

export const CRS_QUICK_PASSAGES: readonly CrsQuickPassage[] = [
  { id: 'gen1', title: 'Creation of the world', theme: 'Sovereignty of God', book: 'Genesis', chapter: 1, refLabel: 'Genesis 1' },
  { id: 'gen12', title: 'The call of Abraham', theme: 'Covenant & faith', book: 'Genesis', chapter: 12, refLabel: 'Genesis 12' },
  { id: 'ex20', title: 'The Ten Commandments', theme: 'Sinai covenant', book: 'Exodus', chapter: 20, refLabel: 'Exodus 20' },
  { id: 'ps23', title: 'The Lord is my Shepherd', theme: 'Trust & guidance', book: 'Psalms', chapter: 23, refLabel: 'Psalm 23' },
  { id: 'isa6', title: 'The call of Isaiah', theme: 'Prophetic mission', book: 'Isaiah', chapter: 6, refLabel: 'Isaiah 6' },
  { id: 'matt5', title: 'The Beatitudes', theme: 'Sermon on the Mount', book: 'Matthew', chapter: 5, refLabel: 'Matthew 5' },
  { id: 'luke10', title: 'The Good Samaritan', theme: 'Love & mercy', book: 'Luke', chapter: 10, refLabel: 'Luke 10' },
  { id: 'luke15', title: 'The Prodigal Son', theme: 'Forgiveness', book: 'Luke', chapter: 15, refLabel: 'Luke 15' },
  { id: 'john3', title: 'Born again & God’s love', theme: 'Salvation', book: 'John', chapter: 3, refLabel: 'John 3' },
  { id: 'acts2', title: 'Day of Pentecost', theme: 'Early Church', book: 'Acts', chapter: 2, refLabel: 'Acts 2' },
  { id: '1cor13', title: 'The way of love', theme: 'Christian living', book: '1 Corinthians', chapter: 13, refLabel: '1 Corinthians 13' },
  { id: 'jas2', title: 'Faith and good works', theme: 'Practical faith', book: 'James', chapter: 2, refLabel: 'James 2' },
] as const;

type OfflineBaseKey = 'kjv' | 'web' | 'bbe' | 'asv' | 'darby';
type OfflineChapterMap = Record<string, Record<OfflineBaseKey, BibleVerseItem[]>>;

/**
 * Built-in offline chapters across all 5 Bible versions so core JAMB/WAEC CRS
 * syllabus passages work immediately even with no internet connection.
 */
export const OFFLINE_BIBLE_CHAPTERS: OfflineChapterMap = {
  'Genesis|1': {
    kjv: [
      { verse: 1, text: 'In the beginning God created the heaven and the earth.' },
      { verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
      { verse: 3, text: 'And God said, Let there be light: and there was light.' },
      { verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
      { verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
      { verse: 26, text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth.' },
      { verse: 27, text: 'So God created man in his own image, in the image of God created he him; male and female created he them.' },
      { verse: 31, text: 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.' },
    ],
    web: [
      { verse: 1, text: 'In the beginning, God created the heavens and the earth.' },
      { verse: 2, text: 'The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters.' },
      { verse: 3, text: 'God said, “Let there be light,” and there was light.' },
      { verse: 4, text: 'God saw the light, and saw that it was good. God divided the light from the darkness.' },
      { verse: 5, text: 'God called the light “day”, and the darkness he called “night”. There was evening and there was morning, the first day.' },
      { verse: 26, text: 'God said, “Let’s make man in our image, after our likeness. Let them have dominion over the fish of the sea, and over the birds of the sky, and over the livestock, and over all the earth.”' },
      { verse: 27, text: 'God created man in his own image. In God’s image he created him; male and female he created them.' },
      { verse: 31, text: 'God saw everything that he had made, and, behold, it was very good. There was evening and there was morning, a sixth day.' },
    ],
    bbe: [
      { verse: 1, text: 'At the first God made the heaven and the earth.' },
      { verse: 2, text: 'And the earth was waste and without form; and it was dark on the face of the deep: and the Spirit of God was moving on the face of the waters.' },
      { verse: 3, text: 'And God said, Let there be light: and there was light.' },
      { verse: 4, text: 'And God, looking on the light, saw that it was good: and God made a division between the light and the dark.' },
      { verse: 5, text: 'Naming the light, Day, and the dark, Night. And there was evening and there was morning, the first day.' },
      { verse: 26, text: 'And God said, Let us make man in our image, like us: and let him have rule over the fish of the sea and over the birds of the air and over the cattle and over all the earth.' },
      { verse: 27, text: 'And God made man in his image, in the image of God he made him: male and female he made them.' },
      { verse: 31, text: 'And God saw everything which he had made and it was very good. And there was evening and there was morning, the sixth day.' },
    ],
    asv: [
      { verse: 1, text: 'In the beginning God created the heavens and the earth.' },
      { verse: 2, text: 'And the earth was waste and void; and darkness was upon the face of the deep: and the Spirit of God moved upon the face of the waters.' },
      { verse: 3, text: 'And God said, Let there be light: and there was light.' },
      { verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
      { verse: 5, text: 'And God called the light Day, and the darkness he called Night. And there was evening and there was morning, one day.' },
      { verse: 26, text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the birds of the heavens, and over the cattle, and over all the earth.' },
      { verse: 27, text: 'And God created man in his own image, in the image of God created he him; male and female created he them.' },
      { verse: 31, text: 'And God saw everything that he had made, and, behold, it was very good. And there was evening and there was morning, the sixth day.' },
    ],
    darby: [
      { verse: 1, text: 'In the beginning God created the heavens and the earth.' },
      { verse: 2, text: 'And the earth was waste and empty, and darkness was on the face of the deep, and the Spirit of God was hovering over the face of the waters.' },
      { verse: 3, text: 'And God said, Let there be light. And there was light.' },
      { verse: 4, text: 'And God saw the light that it was good; and God divided between the light and the darkness.' },
      { verse: 5, text: 'And God called the light Day, and the darkness he called Night. And there was evening, and there was morning—the first day.' },
      { verse: 26, text: 'And God said, Let us make man in our image, after our likeness; and let them have dominion over the fish of the sea, and over the fowl of the heavens, and over the cattle, and over the whole earth.' },
      { verse: 27, text: 'And God created Man in his image, in the image of God created he him; male and female created he them.' },
      { verse: 31, text: 'And God saw everything that he had made, and behold it was very good. And there was evening, and there was morning—the sixth day.' },
    ],
  },
  'Psalms|23': {
    kjv: [
      { verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
      { verse: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
      { verse: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake.' },
      { verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
      { verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
      { verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' },
    ],
    web: [
      { verse: 1, text: 'Yahweh is my shepherd; I shall lack nothing.' },
      { verse: 2, text: 'He makes me lie down in green pastures. He leads me beside still waters.' },
      { verse: 3, text: 'He restores my soul. He guides me in the paths of righteousness for his name’s sake.' },
      { verse: 4, text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.' },
      { verse: 5, text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over.' },
      { verse: 6, text: 'Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh’s house forever.' },
    ],
    bbe: [
      { verse: 1, text: 'The Lord takes care of me as his sheep; I will not be without any good thing.' },
      { verse: 2, text: 'He makes a resting-place for me in the green fields: he is my guide by the quiet waters.' },
      { verse: 3, text: 'He gives new life to my soul: he is my guide in the ways of righteousness because of his name.' },
      { verse: 4, text: 'Yes, though I go through the valley of deep shade, I will have no fear of evil; for you are with me, your rod and your support are my comfort.' },
      { verse: 5, text: 'You make ready a table for me in front of my haters: you put oil on my head; my cup is overflowing.' },
      { verse: 6, text: 'Truly, blessing and mercy will be with me all the days of my life; and I will have a place in the house of the Lord all my days.' },
    ],
    asv: [
      { verse: 1, text: 'Jehovah is my shepherd; I shall not want.' },
      { verse: 2, text: 'He maketh me to lie down in green pastures; He leadeth me beside still waters.' },
      { verse: 3, text: 'He restoreth my soul: He guideth me in the paths of righteousness for his name’s sake.' },
      { verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil; for thou art with me; Thy rod and thy staff, they comfort me.' },
      { verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: Thou hast anointed my head with oil; My cup runneth over.' },
      { verse: 6, text: 'Surely goodness and lovingkindness shall follow me all the days of my life; And I shall dwell in the house of Jehovah for ever.' },
    ],
    darby: [
      { verse: 1, text: 'Jehovah is my shepherd; I shall not want.' },
      { verse: 2, text: 'He maketh me to lie down in green pastures; he leadeth me beside still waters.' },
      { verse: 3, text: 'He restoreth my soul; he leadeth me in paths of righteousness for his name’s sake.' },
      { verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff, they comfort me.' },
      { verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies; thou hast anointed my head with oil; my cup runneth over.' },
      { verse: 6, text: 'Surely goodness and loving-kindness shall follow me all the days of my life; and I will dwell in the house of Jehovah for the length of the days.' },
    ],
  },
  'Exodus|20': {
    kjv: [
      { verse: 1, text: 'And God spake all these words, saying,' },
      { verse: 2, text: 'I am the LORD thy God, which have brought thee out of the land of Egypt, out of the house of bondage.' },
      { verse: 3, text: 'Thou shalt have no other gods before me.' },
      { verse: 8, text: 'Remember the sabbath day, to keep it holy.' },
      { verse: 12, text: 'Honour thy father and thy mother: that thy days may be long upon the land which the LORD thy God giveth thee.' },
      { verse: 13, text: 'Thou shalt not kill.' },
      { verse: 14, text: 'Thou shalt not commit adultery.' },
      { verse: 15, text: 'Thou shalt not steal.' },
      { verse: 16, text: 'Thou shalt not bear false witness against thy neighbour.' },
      { verse: 17, text: 'Thou shalt not covet thy neighbour’s house.' },
    ],
    web: [
      { verse: 1, text: 'God spoke all these words, saying,' },
      { verse: 2, text: '“I am Yahweh your God, who brought you out of the land of Egypt, out of the house of bondage.' },
      { verse: 3, text: 'You shall have no other gods before me.' },
      { verse: 8, text: 'Remember the Sabbath day, to keep it holy.' },
      { verse: 12, text: 'Honor your father and your mother, that your days may be long in the land which Yahweh your God gives you.' },
      { verse: 13, text: 'You shall not murder.' },
      { verse: 14, text: 'You shall not commit adultery.' },
      { verse: 15, text: 'You shall not steal.' },
      { verse: 16, text: 'You shall not give false testimony against your neighbor.' },
      { verse: 17, text: 'You shall not covet your neighbor’s house.”' },
    ],
    bbe: [
      { verse: 1, text: 'And God said all these words:' },
      { verse: 2, text: 'I am the Lord your God who took you out of the land of Egypt, out of the prison-house.' },
      { verse: 3, text: 'You are to have no other gods but me.' },
      { verse: 8, text: 'Keep in memory the Sabbath and let it be a holy day.' },
      { verse: 12, text: 'Give honour to your father and to your mother, so that your life may be long in the land which the Lord your God is giving you.' },
      { verse: 13, text: 'Do not put anyone to death without cause.' },
      { verse: 14, text: 'Do not be false to the married relation.' },
      { verse: 15, text: 'Do not take the property of another.' },
      { verse: 16, text: 'Do not give false witness against your neighbour.' },
      { verse: 17, text: 'Let not your desire be turned to your neighbour’s house.' },
    ],
    asv: [
      { verse: 1, text: 'And God spake all these words, saying,' },
      { verse: 2, text: 'I am Jehovah thy God, who brought thee out of the land of Egypt, out of the house of bondage.' },
      { verse: 3, text: 'Thou shalt have no other gods before me.' },
      { verse: 8, text: 'Remember the sabbath day, to keep it holy.' },
      { verse: 12, text: 'Honor thy father and thy mother, that thy days may be long in the land which Jehovah thy God giveth thee.' },
      { verse: 13, text: 'Thou shalt not kill.' },
      { verse: 14, text: 'Thou shalt not commit adultery.' },
      { verse: 15, text: 'Thou shalt not steal.' },
      { verse: 16, text: 'Thou shalt not bear false witness against thy neighbor.' },
      { verse: 17, text: 'Thou shalt not covet thy neighbor’s house.' },
    ],
    darby: [
      { verse: 1, text: 'And God spoke all these words, saying,' },
      { verse: 2, text: 'I am Jehovah thy God, who have brought thee out of the land of Egypt, out of the house of bondage.' },
      { verse: 3, text: 'Thou shalt have no other gods before me.' },
      { verse: 8, text: 'Remember the sabbath day to hallow it.' },
      { verse: 12, text: 'Honour thy father and thy mother, that thy days may be prolonged in the land that Jehovah thy God giveth thee.' },
      { verse: 13, text: 'Thou shalt not kill.' },
      { verse: 14, text: 'Thou shalt not commit adultery.' },
      { verse: 15, text: 'Thou shalt not steal.' },
      { verse: 16, text: 'Thou shalt not bear false witness against thy neighbour.' },
      { verse: 17, text: 'Thou shalt not desire thy neighbour’s house.' },
    ],
  },
  'Matthew|5': {
    kjv: [
      { verse: 3, text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.' },
      { verse: 4, text: 'Blessed are they that mourn: for they shall be comforted.' },
      { verse: 5, text: 'Blessed are the meek: for they shall inherit the earth.' },
      { verse: 6, text: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.' },
      { verse: 7, text: 'Blessed are the merciful: for they shall obtain mercy.' },
      { verse: 8, text: 'Blessed are the pure in heart: for they shall see God.' },
      { verse: 9, text: 'Blessed are the peacemakers: for they shall be called the children of God.' },
      { verse: 14, text: 'Ye are the light of the world. A city that is set on an hill cannot be hid.' },
    ],
    web: [
      { verse: 3, text: 'Blessed are the poor in spirit, for theirs is the Kingdom of Heaven.' },
      { verse: 4, text: 'Blessed are those who mourn, for they shall be comforted.' },
      { verse: 5, text: 'Blessed are the gentle, for they shall inherit the earth.' },
      { verse: 6, text: 'Blessed are those who hunger and thirst for righteousness, for they shall be filled.' },
      { verse: 7, text: 'Blessed are the merciful, for they shall obtain mercy.' },
      { verse: 8, text: 'Blessed are the pure in heart, for they shall see God.' },
      { verse: 9, text: 'Blessed are the peacemakers, for they shall be called children of God.' },
      { verse: 14, text: 'You are the light of the world. A city located on a hill can’t be hidden.' },
    ],
    bbe: [
      { verse: 3, text: 'Happy are the poor in spirit: for the kingdom of heaven is theirs.' },
      { verse: 4, text: 'Happy are those who are sad: for they will be comforted.' },
      { verse: 5, text: 'Happy are the gentle: for the earth will be their heritage.' },
      { verse: 6, text: 'Happy are those whose heart’s desire is for righteousness: for they will have their desire.' },
      { verse: 7, text: 'Happy are those who have mercy: for they will be given mercy.' },
      { verse: 8, text: 'Happy are the clean in heart: for they will see God.' },
      { verse: 9, text: 'Happy are the peacemakers: for they will be named sons of God.' },
      { verse: 14, text: 'You are the light of the world. A town put on a hill may be seen by all.' },
    ],
    asv: [
      { verse: 3, text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.' },
      { verse: 4, text: 'Blessed are they that mourn: for they shall be comforted.' },
      { verse: 5, text: 'Blessed are the meek: for they shall inherit the earth.' },
      { verse: 6, text: 'Blessed are they that hunger and thirst after righteousness: for they shall be filled.' },
      { verse: 7, text: 'Blessed are the merciful: for they shall obtain mercy.' },
      { verse: 8, text: 'Blessed are the pure in heart: for they shall see God.' },
      { verse: 9, text: 'Blessed are the peacemakers: for they shall be called sons of God.' },
      { verse: 14, text: 'Ye are the light of the world. A city set on a hill cannot be hid.' },
    ],
    darby: [
      { verse: 3, text: 'Blessed are the poor in spirit, for theirs is the kingdom of the heavens.' },
      { verse: 4, text: 'Blessed they that mourn, for they shall be comforted.' },
      { verse: 5, text: 'Blessed the meek, for they shall inherit the earth.' },
      { verse: 6, text: 'Blessed they who hunger and thirst after righteousness, for they shall be filled.' },
      { verse: 7, text: 'Blessed the merciful, for they shall find mercy.' },
      { verse: 8, text: 'Blessed the pure in heart, for they shall see God.' },
      { verse: 9, text: 'Blessed the peace-makers, for they shall be called sons of God.' },
      { verse: 14, text: 'Ye are the light of the world: a city situated on the top of a mountain cannot be hid.' },
    ],
  },
  'John|3': {
    kjv: [
      { verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
      { verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
    ],
    web: [
      { verse: 16, text: 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.' },
      { verse: 17, text: 'For God didn’t send his Son into the world to judge the world, but that the world should be saved through him.' },
    ],
    bbe: [
      { verse: 16, text: 'For God had such love for the world that he gave his only Son, so that whoever has faith in him may not come to destruction but have eternal life.' },
      { verse: 17, text: 'God did not send his Son into the world to be judge of the world; he sent him so that the world might have salvation through him.' },
    ],
    asv: [
      { verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth on him should not perish, but have eternal life.' },
      { verse: 17, text: 'For God sent not the Son into the world to judge the world; but that the world should be saved through him.' },
    ],
    darby: [
      { verse: 16, text: 'For God so loved the world, that he gave his only-begotten Son, that whosoever believes on him may not perish, but have life eternal.' },
      { verse: 17, text: 'For God has not sent his Son into the world that he may judge the world, but that the world may be saved through him.' },
    ],
  },
  '1 Corinthians|13': {
    kjv: [
      { verse: 4, text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,' },
      { verse: 5, text: 'Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;' },
      { verse: 7, text: 'Beareth all things, believeth all things, hopeth all things, endureth all things.' },
      { verse: 13, text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.' },
    ],
    web: [
      { verse: 4, text: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud,' },
      { verse: 5, text: 'doesn’t behave itself inappropriately, doesn’t seek its own way, is not provoked, takes no account of evil;' },
      { verse: 7, text: 'bears all things, believes all things, hopes all things, and endures all things.' },
      { verse: 13, text: 'But now faith, hope, and love remain—these three. The greatest of these is love.' },
    ],
    bbe: [
      { verse: 4, text: 'Love is never tired of waiting; love is kind; love has no envy; love has no high opinion of itself, love has no pride;' },
      { verse: 5, text: 'Love’s ways are ever fair, it takes no thought for itself; it is not quickly made angry, it takes no account of evil;' },
      { verse: 7, text: 'It has the power of undergoing all things, having faith in all things, hoping all things.' },
      { verse: 13, text: 'But now we still have faith, hope, love, these three; and the greatest of these is love.' },
    ],
    asv: [
      { verse: 4, text: 'Love suffereth long, and is kind; love envieth not; love vaunteth not itself, is not puffed up,' },
      { verse: 5, text: 'doth not behave itself unseemly, seeketh not its own, is not provoked, taketh not account of evil;' },
      { verse: 7, text: 'beareth all things, believeth all things, hopeth all things, endureth all things.' },
      { verse: 13, text: 'But now abideth faith, hope, love, these three; and the greatest of these is love.' },
    ],
    darby: [
      { verse: 4, text: 'Love has long patience, is kind; love is not emulous of others; love is not insolent and rash, is not puffed up,' },
      { verse: 5, text: 'does not behave in an unseemly manner, does not seek what is its own, is not quickly provoked, does not impute evil,' },
      { verse: 7, text: 'bears all things, believes all things, hopes all things, endures all things.' },
      { verse: 13, text: 'And now abide faith, hope, love; these three things; and the greater of these is love.' },
    ],
  },
  'Acts|2': {
    kjv: [
      { verse: 1, text: 'And when the day of Pentecost was fully come, they were all with one accord in one place.' },
      { verse: 2, text: 'And suddenly there came a sound from heaven as of a rushing mighty wind, and it filled all the house where they were sitting.' },
      { verse: 3, text: 'And there appeared unto them cloven tongues like as of fire, and it sat upon each of them.' },
      { verse: 4, text: 'And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.' },
    ],
    web: [
      { verse: 1, text: 'Now when the day of Pentecost had come, they were all with one accord in one place.' },
      { verse: 2, text: 'Suddenly there came from the sky a sound like the rushing of a mighty wind, and it filled all the house where they were sitting.' },
      { verse: 3, text: 'Tongues like fire appeared and were distributed to them, and one sat on each of them.' },
      { verse: 4, text: 'They were all filled with the Holy Spirit, and began to speak with other languages, as the Spirit gave them the ability to speak.' },
    ],
    bbe: [
      { verse: 1, text: 'And when the day of Pentecost was come, they were all together in one place.' },
      { verse: 2, text: 'And suddenly there came from heaven a sound like the rushing of a violent wind, and all the house where they were was full of it.' },
      { verse: 3, text: 'And they saw tongues, like flames of fire, coming to rest on every one of them.' },
      { verse: 4, text: 'And they were all full of the Holy Spirit, and were talking in different languages, as the Spirit gave them power.' },
    ],
    asv: [
      { verse: 1, text: 'And when the day of Pentecost was now come, they were all together in one place.' },
      { verse: 2, text: 'And suddenly there came from heaven a sound as of the rushing of a mighty wind, and it filled all the house where they were sitting.' },
      { verse: 3, text: 'And there appeared unto them tongues parting asunder, like as of fire; and it sat upon each one of them.' },
      { verse: 4, text: 'And they were all filled with the Holy Spirit, and began to speak with other tongues, as the Spirit gave them utterance.' },
    ],
    darby: [
      { verse: 1, text: 'And when the day of Pentecost was now accomplishing, they were all together in one place.' },
      { verse: 2, text: 'And suddenly there came a sound out of heaven as of a violent impetuous blowing, and filled all the house where they were sitting.' },
      { verse: 3, text: 'And there appeared to them parted tongues, as of fire, and it sat upon each one of them.' },
      { verse: 4, text: 'And they were all filled with the Holy Spirit, and began to speak with other tongues as the Spirit gave to them to speak forth.' },
    ],
  },
};

export function getOfflineBibleChapter(
  book: string,
  chapter: number,
  version: BibleVersionId
): BibleVerseItem[] | null {
  const key = `${book}|${chapter}`;
  const entry = OFFLINE_BIBLE_CHAPTERS[key];
  if (!entry) return null;
  if (version === 'kjv' || version === 'nkjv') return entry.kjv;
  if (version === 'bbe' || version === 'erv' || version === 'gnt') return entry.bbe;
  if (version === 'rsv' || version === 'esv' || version === 'nasb') return entry.asv;
  return entry.web;
}
