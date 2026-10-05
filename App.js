import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  PanResponder,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';

// ============================================================
// CONSTANTS
// ============================================================
const STORAGE_KEY = '@MathiKids_final_v6';
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const COLORS = {
  bg: '#FFF8E7',
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  success: '#51CF66',
  danger: '#FF6B6B',
  dark: '#2C3E50',
  light: '#FFFFFF',
  star: '#FFD43B',
  purple: '#A29BFE',
  pink: '#FDA7DF',
  orange: '#FFA94D',
  blue: '#74C0FC',
  mint: '#63E6BE',
  grape: '#B197FC',
  peach: '#FFA8A8',
  sun: '#FFD43B',
};

const FRUITS = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍒', '🍑', '🥕', '🍋', '🥝'];
const SHAPES = ['⭐', '🎈', '🎁', '🧸', '🎨', '🏀', '🚗', '🌈', '🍭', '🎪'];
const OPTION_EMOJIS = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍒', '🍑', '🥕', '🍋', '🥝', '⭐', '🎈', '🎁', '🧸'];

const SNAKE_GRID_SIZE = 15;

const MEMORY_EMOJIS = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍒'];

const PRAISE = [
  'آفرین!',
  'عالیه!',
  'فوق العاده!',
  'معرکه!',
  'بی نظیری!',
  'سریع و درست!',
  'قدرت گرفتی!',
  'تو یک قهرمانی!',
];

const ENCOURAGE = [
  'نزدیک بود!',
  'دفعه بعد می تونی!',
  'اشکالی نداره!',
  'با تمرین بهتر می شی!',
  'یاد گرفتن مهمه!',
];

const CONFETTI_EMOJIS = ['🎉', '⭐', '🎊', '✨', '🌟', '💫', '🏆'];

// ============================================================
// TRANSLATIONS
// ============================================================
const LANG = {
  fa: {
    dir: 'rtl',
    appName: 'MathiKids',
    tagline: 'یادگیری ریاضی با بازی',
    welcome: 'خوش آمدی!',
    start: 'شروع کنیم \u{1F680}',
    enterName: 'نام کودک',
    namePlaceholder: 'مثلاً: آرش',
    enterAge: 'سن کودک',
    agePlaceholder: 'بین ۵ تا ۱۸',
    enterGame: 'ورود به بازی \u{1F3AE}',
    home: 'خانه',
    settings: 'تنظیمات',
    games: 'بازی ها',
    playGames: 'بازی ها',
    reward: 'جایزه',
    rewardReady: 'جایزه گرفتی!',
    rewardMsg: 'یک بازی انتخاب کن',
    playNow: 'بازی کن',
    difficulty: 'سطح سختی',
    easy: 'آسان',
    medium: 'متوسط',
    hard: 'سخت',
    operation: 'عملیات',
    all: 'همه',
    addition: 'جمع',
    subtraction: 'تفریق',
    multiplication: 'ضرب',
    division: 'تقسیم',
    questionCount: 'تعداد سؤال',
    normalTest: 'آزمون عادی',
    speedTest: 'آزمون سرعت \u{26A1}',
    startTest: 'شروع آزمون',
    correct: 'آفرین! درست بود',
    wrong: 'اشتباه بود',
    nextQuestion: 'سؤال بعدی',
    score: 'امتیاز',
    stars: 'ستاره',
    best: 'بهترین',
    level: 'سطح',
    results: 'نتیجه',
    reviewMistakes: 'مرور اشتباه ها',
    noMistakes: 'هیچ اشتباهی در این آزمون نبود!',
    timesTables: 'جدول ضرب',
    calculator: 'ماشین حساب',
    sound: 'صدا',
    pictures: 'تصاویر',
    language: 'زبان',
    on: 'روشن',
    off: 'خاموش',
    back: 'بازگشت',
    pause: 'توقف',
    resume: 'ادامه',
    timeLeft: 'زمان باقی مانده',
    yourAnswer: 'جواب تو',
    correctAnswer: 'جواب درست',
    explanation: 'راه حل',
    playAgain: 'بازی مجدد',
    scoreLabel: 'امتیاز',
    correctLabel: 'درست',
    wrongLabel: 'غلط',
    starLabel: 'ستاره',
    bestScore: 'بهترین امتیاز',
    levelLabel: 'سطح',
    nameLabel: 'نام',
    ageLabel: 'سن',
    selectTable: 'انتخاب جدول',
    table: 'جدول',
    startPractice: 'شروع تمرین',
    viewTable: 'دیدن جدول',
    practiceTable: 'تمرین این جدول',
    selectTablePrompt: 'کدام جدول را تمرین کنیم؟',
    levelUp: 'سطح بالا رفت!',
    streak: 'زنجیره',
    practice: 'تمرین',
    chooseAnswer: 'یک جواب انتخاب کن',
    playAgainTable: 'تمرین مجدد',
    exitTest: 'خروج از آزمون',
    exitConfirm: 'از آزمون خارج می شوی؟',
    yes: 'بله',
    no: 'خیر',
    next: 'بعدی',
    snakeTitle: 'مار',
    snakeDesc: 'میوه بخور، بزرگ شو',
    snakeInstructions: 'انگشتت رو روی صفحه بکش تا مار حرکت کنه و میوه بخوره',
    swipeHint: 'انگشتت رو بکش روی صفحه',
    memoryMatch: 'جفت یاب',
    targetTap: 'هدف زن',
    time: 'زمان',
    scoreGame: 'امتیاز',
    startGame: 'شروع',
    gameOver: 'بازی تمام شد!',
    yourScore: 'امتیاز تو',
    playThisGame: 'این بازی رو بکن',
    locked: 'قفل',
    needStars: 'ستاره لازم داری',
    noRewards: 'هنوز جایزه‌ای نگرفتی. اول یک آزمون بده!',
    congrats: 'تبریک!',
    youGotGame: 'یک بازی جایزه گرفتی',
    startPlaying: 'شروع بازی',
    later: 'بعداً',
    pairsFound: 'جفت پیدا شده',
    tap: 'ضربه بزن',
    moves: 'حرکت',
    targetHit: 'هدف زده شد',
  },
  en: {
    dir: 'ltr',
    appName: 'MathiKids',
    tagline: 'Learn math with games',
    welcome: 'Welcome!',
    start: "Let's Start \u{1F680}",
    enterName: "Child's Name",
    namePlaceholder: 'e.g., Alex',
    enterAge: "Child's Age",
    agePlaceholder: 'Between 5 and 18',
    enterGame: 'Enter Game \u{1F3AE}',
    home: 'Home',
    settings: 'Settings',
    games: 'Games',
    playGames: 'Games',
    reward: 'Reward',
    rewardReady: 'You got a reward!',
    rewardMsg: 'Pick a game',
    playNow: 'Play',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    operation: 'Operation',
    all: 'All',
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    questionCount: 'Question Count',
    normalTest: 'Normal Test',
    speedTest: 'Speed Test \u{26A1}',
    startTest: 'Start Test',
    correct: 'Correct!',
    wrong: 'Wrong',
    nextQuestion: 'Next Question',
    score: 'Score',
    stars: 'Stars',
    best: 'Best',
    level: 'Level',
    results: 'Results',
    reviewMistakes: 'Review Mistakes',
    noMistakes: 'No mistakes in this test!',
    timesTables: 'Times Tables',
    calculator: 'Calculator',
    sound: 'Sound',
    pictures: 'Pictures',
    language: 'Language',
    on: 'On',
    off: 'Off',
    back: 'Back',
    pause: 'Pause',
    resume: 'Resume',
    timeLeft: 'Time Left',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
    explanation: 'Explanation',
    playAgain: 'Play Again',
    scoreLabel: 'Score',
    correctLabel: 'Correct',
    wrongLabel: 'Wrong',
    starLabel: 'Stars',
    bestScore: 'Best Score',
    levelLabel: 'Level',
    nameLabel: 'Name',
    ageLabel: 'Age',
    selectTable: 'Select Table',
    table: 'Table',
    startPractice: 'Start Practice',
    viewTable: 'View Table',
    practiceTable: 'Practice This Table',
    selectTablePrompt: 'Which table to practice?',
    levelUp: 'Level Up!',
    streak: 'Streak',
    practice: 'Practice',
    chooseAnswer: 'Choose an answer',
    playAgainTable: 'Practice Again',
    exitTest: 'Exit Test',
    exitConfirm: 'Exit the test?',
    yes: 'Yes',
    no: 'No',
    next: 'Next',
    snakeTitle: 'Snake',
    snakeDesc: 'Eat fruits, grow bigger',
    snakeInstructions: 'Swipe your finger on the board to move the snake',
    swipeHint: 'Swipe on the board',
    memoryMatch: 'Memory Match',
    targetTap: 'Target Tap',
    time: 'Time',
    scoreGame: 'Score',
    startGame: 'Start',
    gameOver: 'Game Over!',
    yourScore: 'Your Score',
    playThisGame: 'Play This Game',
    locked: 'Locked',
    needStars: 'Stars needed',
    noRewards: 'No rewards yet. Take a test first!',
    congrats: 'Congrats!',
    youGotGame: 'You earned a game',
    startPlaying: 'Start Playing',
    later: 'Later',
    pairsFound: 'Pairs Found',
    tap: 'Tap',
    moves: 'Moves',
    targetHit: 'Targets Hit',
  },
  ar: {
    dir: 'rtl',
    appName: 'MathiKids',
    tagline: 'تعلم الرياضيات باللعب',
    welcome: 'أهلاً!',
    start: 'هيا نبدأ \u{1F680}',
    enterName: 'اسم الطفل',
    namePlaceholder: 'مثلاً: أحمد',
    enterAge: 'عمر الطفل',
    agePlaceholder: 'بين ٥ و ١٨',
    enterGame: 'ادخل اللعبة \u{1F3AE}',
    home: 'الرئيسية',
    settings: 'الإعدادات',
    games: 'الألعاب',
    playGames: 'الألعاب',
    reward: 'مكافأة',
    rewardReady: 'حصلت على مكافأة!',
    rewardMsg: 'اختر لعبة',
    playNow: 'العب',
    difficulty: 'الصعوبة',
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
    operation: 'العملية',
    all: 'الكل',
    addition: 'الجمع',
    subtraction: 'الطرح',
    multiplication: 'الضرب',
    division: 'القسمة',
    questionCount: 'عدد الأسئلة',
    normalTest: 'اختبار عادي',
    speedTest: 'اختبار السرعة \u{26A1}',
    startTest: 'ابدأ الاختبار',
    correct: 'أحسنت!',
    wrong: 'إجابة خاطئة',
    nextQuestion: 'السؤال التالي',
    score: 'النقاط',
    stars: 'النجوم',
    best: 'الأفضل',
    level: 'المستوى',
    results: 'النتائج',
    reviewMistakes: 'مراجعة الأخطاء',
    noMistakes: 'لا توجد أخطاء في هذا الاختبار!',
    timesTables: 'جداول الضرب',
    calculator: 'الآلة الحاسبة',
    sound: 'الصوت',
    pictures: 'الصور',
    language: 'اللغة',
    on: 'تشغيل',
    off: 'إيقاف',
    back: 'رجوع',
    pause: 'إيقاف مؤقت',
    resume: 'استئناف',
    timeLeft: 'الوقت المتبقي',
    yourAnswer: 'إجابتك',
    correctAnswer: 'الإجابة الصحيحة',
    explanation: 'الشرح',
    playAgain: 'العب مرة أخرى',
    scoreLabel: 'النقاط',
    correctLabel: 'صحيح',
    wrongLabel: 'خطأ',
    starLabel: 'نجوم',
    bestScore: 'أفضل نتيجة',
    levelLabel: 'المستوى',
    nameLabel: 'الاسم',
    ageLabel: 'العمر',
    selectTable: 'اختر الجدول',
    table: 'جدول',
    startPractice: 'ابدأ التمرين',
    viewTable: 'عرض الجدول',
    practiceTable: 'تمرين هذا الجدول',
    selectTablePrompt: 'أي جدول نتدرب عليه؟',
    levelUp: 'ارتفع المستوى!',
    streak: 'التتابع',
    practice: 'تمرين',
    chooseAnswer: 'اختر إجابة',
    playAgainTable: 'تمرين مجدد',
    exitTest: 'خروج من الاختبار',
    exitConfirm: 'هل تريد الخروج؟',
    yes: 'نعم',
    no: 'لا',
    next: 'التالي',
    snakeTitle: 'الثعبان',
    snakeDesc: 'كل الفواكه و اكبر',
    snakeInstructions: 'اسحب إصبعك على اللوحة لتحريك الثعبان',
    swipeHint: 'اسحب على اللوحة',
    memoryMatch: 'لعبة الذاكرة',
    targetTap: 'إصابة الهدف',
    time: 'الوقت',
    scoreGame: 'النقاط',
    startGame: 'ابدأ',
    gameOver: 'انتهت اللعبة!',
    yourScore: 'نقاطك',
    playThisGame: 'العب هذه اللعبة',
    locked: 'مقفل',
    needStars: 'تحتاج نجوم',
    noRewards: 'لا توجد مكافآت. خذ اختباراً أولاً!',
    congrats: 'مبروك!',
    youGotGame: 'حصلت على لعبة',
    startPlaying: 'ابدأ اللعب',
    later: 'لاحقاً',
    pairsFound: 'الأزواج',
    tap: 'اضغط',
    moves: 'الحركات',
    targetHit: 'الأهداف',
  },
};

// ============================================================
// HELPERS
// ============================================================
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function pickOne(arr) {
  return arr[rnd(0, arr.length - 1)];
}

function pickUniqueEmojis(count) {
  const pool = [...OPTION_EMOJIS];
  const picked = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = rnd(0, pool.length - 1);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked;
}

// ============================================================
// AGE + DIFFICULTY
// ============================================================
function getDifficultyScale(age, diff) {
  let base = 1;
  if (age <= 6) base = 1;
  else if (age <= 8) base = 2;
  else if (age <= 10) base = 3;
  else if (age <= 12) base = 4;
  else if (age <= 14) base = 5;
  else base = 6;

  let mult = 1;
  if (diff === 'easy') mult = 0.7;
  else if (diff === 'medium') mult = 1;
  else if (diff === 'hard') mult = 1.5;

  return Math.max(1, Math.round(base * mult));
}

function shouldUseVisuals(age, picturesOn) {
  return picturesOn && Number(age) <= 8;
}

// ============================================================
// QUESTION GENERATOR
// ============================================================
function makeQuestion(age, diff, op) {
  const scale = getDifficultyScale(age, diff);
  let operation = op;
  if (op === 'all') {
    const ops = ['addition', 'subtraction', 'multiplication', 'division'];
    operation = ops[rnd(0, 3)];
  }

  let a, b, ans;

  if (operation === 'addition') {
    const max = 5 + scale * 15;
    a = rnd(1, max);
    b = rnd(1, max);
    ans = a + b;
  } else if (operation === 'subtraction') {
    const max = 5 + scale * 15;
    a = rnd(1, max);
    b = rnd(1, a);
    ans = a - b;
  } else if (operation === 'multiplication') {
    const max = Math.min(10, 2 + scale * 2);
    a = rnd(1, max);
    b = rnd(1, max);
    ans = a * b;
  } else if (operation === 'division') {
    const max = Math.min(10, 2 + scale * 2);
    b = rnd(1, max);
    ans = rnd(1, max);
    a = b * ans;
  } else {
    a = rnd(1, 10);
    b = rnd(1, 10);
    ans = a + b;
    operation = 'addition';
  }

  return { a, b, op: operation, ans };
}

function makeTableQuestion(tableNum) {
  const b = rnd(1, 10);
  return { a: tableNum, b, op: 'multiplication', ans: tableNum * b };
}

// ============================================================
// FOUR CHOICES
// ============================================================
function makeOptions(q) {
  const set = new Set([q.ans]);
  const range = Math.max(5, Math.round(Math.abs(q.ans) * 0.3) + 2);

  let safety = 0;
  while (set.size < 4 && safety < 100) {
    safety++;
    let offset = rnd(-range, range);
    if (offset === 0) offset = 1;
    const candidate = q.ans + offset;
    if (candidate >= 0 && !set.has(candidate)) {
      set.add(candidate);
    }
  }

  return shuffle([...set]);
}

// ============================================================
// EXPLANATION
// ============================================================
function getExplanation(q, lang) {
  if (lang === 'fa') {
    if (q.op === 'addition') {
      return `${q.a} + ${q.b} = ${q.ans}\nیعنی ${q.a} تا با ${q.b} تا جمع می شود و می شود ${q.ans}`;
    }
    if (q.op === 'subtraction') {
      return `${q.a} - ${q.b} = ${q.ans}\nاز ${q.a} تا، ${q.b} تا کم می کنیم، می شود ${q.ans}`;
    }
    if (q.op === 'multiplication') {
      return `${q.a} × ${q.b} = ${q.ans}\nیعنی ${q.a} تا ${q.b} تایی، می شود ${q.ans}`;
    }
    if (q.op === 'division') {
      return `${q.a} ÷ ${q.b} = ${q.ans}\nچون ${q.b} × ${q.ans} = ${q.a}`;
    }
  }
  if (lang === 'ar') {
    if (q.op === 'addition') {
      return `${q.a} + ${q.b} = ${q.ans}\nاجمع ${q.a} مع ${q.b} تحصل على ${q.ans}`;
    }
    if (q.op === 'subtraction') {
      return `${q.a} - ${q.b} = ${q.ans}\nاطرح ${q.b} من ${q.a} تحصل على ${q.ans}`;
    }
    if (q.op === 'multiplication') {
      return `${q.a} × ${q.b} = ${q.ans}\nاضرب ${q.a} في ${q.b} تحصل على ${q.ans}`;
    }
    if (q.op === 'division') {
      return `${q.a} ÷ ${q.b} = ${q.ans}\nلأن ${q.b} × ${q.ans} = ${q.a}`;
    }
  }
  if (q.op === 'addition') {
    return `${q.a} + ${q.b} = ${q.ans}\nAdd ${q.b} to ${q.a} to get ${q.ans}`;
  }
  if (q.op === 'subtraction') {
    return `${q.a} - ${q.b} = ${q.ans}\nSubtract ${q.b} from ${q.a} to get ${q.ans}`;
  }
  if (q.op === 'multiplication') {
    return `${q.a} × ${q.b} = ${q.ans}\nMultiply ${q.a} by ${q.b} to get ${q.ans}`;
  }
  if (q.op === 'division') {
    return `${q.a} ÷ ${q.b} = ${q.ans}\nBecause ${q.b} × ${q.ans} = ${q.a}`;
  }
  return `${q.a} ? ${q.b} = ${q.ans}`;
}

// ============================================================
// VISUAL BUILDER
// ============================================================
function buildVisualLine(q, useVisuals) {
  if (q.op === 'addition') {
    const countA = Math.min(q.a, 6);
    const countB = Math.min(q.b, 6);
    const group1 = FRUITS[q.a % FRUITS.length].repeat(countA);
    const group2 = FRUITS[q.b % FRUITS.length].repeat(countB);
    return `${group1}  +  ${group2}`;
  }
  if (q.op === 'subtraction') {
    const count = Math.min(q.a, 10);
    const total = SHAPES[0].repeat(count);
    return `${total}\nکم می کنیم: ${q.b} تا`;
  }
  if (q.op === 'multiplication') {
    const rowCount = Math.min(q.b, 5);
    const row = FRUITS[q.b % FRUITS.length].repeat(rowCount);
    const rows = [];
    for (let i = 0; i < Math.min(q.a, 4); i++) {
      rows.push(row);
    }
    return rows.join('\n');
  }
  if (q.op === 'division') {
    const totalCount = Math.min(q.a, 12);
    const items = FRUITS[q.a % FRUITS.length].repeat(totalCount);
    return `${items}\nتقسیم بر ${q.b} گروه`;
  }
  return null;
}

// ============================================================
// LEVEL SYSTEM
// ============================================================
function getLevel(score) {
  return Math.floor(score / 50) + 1;
}

// ============================================================
// HOME BUTTON
// ============================================================
function HomeButton({ t, onPress }) {
  return (
    <Pressable style={styles.homeBtn} onPress={onPress}>
      <Text style={styles.homeBtnText}>🏠 {t.home}</Text>
    </Pressable>
  );
}

// ============================================================
// CONFETTI
// ============================================================
function Confetti({ trigger }) {
  const anims = useRef(
    Array.from({ length: 8 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (!trigger) return;
    anims.forEach((anim) => anim.setValue(0));
    const animsRun = anims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200 + i * 100,
        delay: i * 60,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );
    Animated.parallel(animsRun).start();
  }, [trigger]);

  if (!trigger) return null;

  return (
    <View style={styles.confettiLayer} pointerEvents="none">
      {anims.map((anim, i) => {
        const emoji = CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length];
        const left = 5 + i * 12;
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 400],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 1, 0],
        });
        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });
        return (
          <Animated.Text
            key={i}
            style={[
              styles.confettiEmoji,
              {
                left: `${left}%`,
                opacity,
                transform: [{ translateY }, { rotate }],
              },
            ]}
          >
            {emoji}
          </Animated.Text>
        );
      })}
    </View>
  );
}

// ============================================================
// EXPLOSION
// ============================================================
function Explosion({ trigger }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [trigger]);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.8],
  });
  const opacity = anim;

  return (
    <Animated.View
      style={[
        styles.explosionLayer,
        { opacity, transform: [{ scale }] },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.explosionEmoji}>💥</Text>
    </Animated.View>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState('welcome');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [lang, setLang] = useState('fa');
  const [soundOn, setSoundOn] = useState(true);
  const [picturesOn, setPicturesOn] = useState(true);

  const [stars, setStars] = useState(0);
  const [best, setBest] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const [diff, setDiff] = useState('medium');
  const [op, setOp] = useState('all');
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState('normal');

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null);
  const [praiseMsg, setPraiseMsg] = useState('');
  const [encourageMsg, setEncourageMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [levelUpFlash, setLevelUpFlash] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [explosionTrigger, setExplosionTrigger] = useState(0);

  const [practiceTable, setPracticeTable] = useState(null);
  const [optionEmojis, setOptionEmojis] = useState([]);

  const [rewards, setRewards] = useState(0);

  const timerRef = useRef(null);
  const lastLevelRef = useRef(1);

  const correctPlayer = useAudioPlayer(require('./assets/correct.wav'));
  const wrongPlayer = useAudioPlayer(require('./assets/wrong.wav'));
  const finishPlayer = useAudioPlayer(require('./assets/finish.wav'));

  const playSound = useCallback(
    (player) => {
      if (!soundOn) return;
      try {
        player.seekTo(0);
        player.play();
      } catch (e) {
        // silent
      }
    },
    [soundOn]
  );

  const t = LANG[lang] || LANG.en;
  const useVisuals = shouldUseVisuals(age, picturesOn);

  const currentQuestion = useMemo(
    () => questions[currentIdx],
    [questions, currentIdx]
  );

  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return makeOptions(currentQuestion);
  }, [currentQuestion]);

  // ============================================================
  // PERSISTENCE
  // ============================================================
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const d = JSON.parse(raw);
          if (d.name) setName(d.name);
          if (d.age) setAge(String(d.age));
          if (d.lang) setLang(d.lang);
          if (d.diff) setDiff(d.diff);
          if (typeof d.soundOn === 'boolean') setSoundOn(d.soundOn);
          if (typeof d.picturesOn === 'boolean') setPicturesOn(d.picturesOn);
          if (typeof d.stars === 'number') setStars(d.stars);
          if (typeof d.best === 'number') setBest(d.best);
          if (typeof d.totalCorrect === 'number') setTotalCorrect(d.totalCorrect);
          if (typeof d.rewards === 'number') setRewards(d.rewards);
        }
      } catch (e) {
        // silent
      }
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback(async (updates) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current = raw ? JSON.parse(raw) : {};
      const next = { ...current, ...updates };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // silent
    }
  }, []);

  // ============================================================
  // LEVEL UP
  // ============================================================
  useEffect(() => {
    const currentLevel = getLevel(score);
    if (currentLevel > lastLevelRef.current) {
      setLevelUpFlash(true);
      setTimeout(() => setLevelUpFlash(false), 1500);
    }
    lastLevelRef.current = currentLevel;
  }, [score]);

  // ============================================================
  // SPEED TIMER
  // ============================================================
  useEffect(() => {
    if (screen !== 'game' || mode !== 'speed' || isPaused) return;
    if (timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          playSound(finishPlayer);
          setScreen('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [screen, mode, isPaused, timeLeft > 0, playSound, finishPlayer]);

  // ============================================================
  // START TEST
  // ============================================================
  const startTest = useCallback(() => {
    const qs = [];
    for (let i = 0; i < count; i++) {
      qs.push(makeQuestion(Number(age) || 8, diff, op));
    }
    setQuestions(qs);
    setCurrentIdx(0);
    setScore(0);
    setSessionStars(0);
    setMistakes([]);
    setStreak(0);
    setSelectedOption(null);
    setShowFeedback(null);
    setIsPaused(false);
    setPracticeTable(null);
    setOptionEmojis(pickUniqueEmojis(4));
    lastLevelRef.current = 1;

    if (mode === 'speed') {
      setTimeLeft(Math.max(30, count * 7));
    } else {
      setTimeLeft(0);
    }
    setScreen('game');
  }, [count, age, diff, op, mode]);

  // ============================================================
  // TABLE PRACTICE
  // ============================================================
  const startTablePractice = useCallback((tableNum) => {
    const qs = [];
    for (let i = 0; i < 10; i++) {
      qs.push(makeTableQuestion(tableNum));
    }
    setQuestions(qs);
    setCurrentIdx(0);
    setScore(0);
    setSessionStars(0);
    setMistakes([]);
    setStreak(0);
    setSelectedOption(null);
    setShowFeedback(null);
    setIsPaused(false);
    setMode('normal');
    setTimeLeft(0);
    setPracticeTable(tableNum);
    setOptionEmojis(pickUniqueEmojis(4));
    lastLevelRef.current = 1;
    setScreen('game');
  }, []);

  // ============================================================
  // ANSWER HANDLER
  // ============================================================
  const handleAnswer = useCallback(
    (option) => {
      if (showFeedback !== null) return;
      const q = questions[currentIdx];
      if (!q) return;

      setSelectedOption(option);

      if (option === q.ans) {
        playSound(correctPlayer);
        const newStreak = streak + 1;
        setStreak(newStreak);
        const bonus = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : newStreak >= 2 ? 1 : 0;
        const gained = 10 + bonus;
        setScore((s) => s + gained);
        setSessionStars((s) => s + 1);
        setStars((s) => s + 1);
        setTotalCorrect((s) => s + 1);
        setPraiseMsg(pickOne(PRAISE));
        setShowFeedback('correct');
        setConfettiTrigger((c) => c + 1);

        setTimeout(() => {
          setSelectedOption(null);
          setShowFeedback(null);
          if (currentIdx + 1 >= questions.length) {
            playSound(finishPlayer);
            setRewards((r) => {
              const nr = r + 1;
              persist({ rewards: nr });
              return nr;
            });
            setScreen('results');
          } else {
            setCurrentIdx((i) => i + 1);
            setOptionEmojis(pickUniqueEmojis(4));
          }
        }, 1100);
      } else {
        playSound(wrongPlayer);
        setStreak(0);
        setEncourageMsg(pickOne(ENCOURAGE));
        setShowFeedback('wrong');
        setExplosionTrigger((c) => c + 1);
        setMistakes((m) => [
          ...m,
          { question: q, chosen: option, correct: q.ans },
        ]);
      }
    },
    [
      questions,
      currentIdx,
      showFeedback,
      streak,
      playSound,
      correctPlayer,
      wrongPlayer,
      finishPlayer,
      persist,
    ]
  );

  const advance = useCallback(() => {
    setSelectedOption(null);
    setShowFeedback(null);
    if (currentIdx + 1 >= questions.length) {
      playSound(finishPlayer);
      setRewards((r) => {
        const nr = r + 1;
        persist({ rewards: nr });
        return nr;
      });
      setScreen('results');
      return;
    }
    setCurrentIdx((i) => i + 1);
    setOptionEmojis(pickUniqueEmojis(4));
  }, [currentIdx, questions.length, playSound, finishPlayer, persist]);

  // ============================================================
  // SAVE BEST
  // ============================================================
  useEffect(() => {
    if (screen === 'results') {
      if (score > best) {
        setBest(score);
        persist({ best: score });
      }
      persist({ stars, totalCorrect });
    }
  }, [screen, score, best, stars, totalCorrect, persist]);

  // ============================================================
  // CONSUME REWARD
  // ============================================================
  const consumeReward = useCallback(() => {
    if (rewards > 0) {
      const next = rewards - 1;
      setRewards(next);
      persist({ rewards: next });
    }
  }, [rewards, persist]);

  // ============================================================
  // LOADING
  // ============================================================
  if (!loaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={{ fontSize: 60 }}>🧮</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // WELCOME
  // ============================================================
  if (screen === 'welcome') {
    return (
      <SafeAreaView style={[styles.container, { direction: t.dir }]}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.centerScroll}>
          <Text style={{ fontSize: 100 }}>🧮</Text>
          <Text style={styles.bigTitle}>{t.appName}</Text>
          <Text style={styles.tagline}>{t.tagline}</Text>

          <View style={styles.langRow}>
            <Pressable
              onPress={() => {
                setLang('fa');
                persist({ lang: 'fa' });
              }}
              style={[styles.langBtn, lang === 'fa' && styles.langBtnActive]}
            >
              <Text
                style={[
                  styles.langBtnText,
                  lang === 'fa' && styles.langBtnTextActive,
                ]}
              >
                فارسی
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setLang('en');
                persist({ lang: 'en' });
              }}
              style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
            >
              <Text
                style={[
                  styles.langBtnText,
                  lang === 'en' && styles.langBtnTextActive,
                ]}
              >
                English
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setLang('ar');
                persist({ lang: 'ar' });
              }}
              style={[styles.langBtn, lang === 'ar' && styles.langBtnActive]}
            >
              <Text
                style={[
                  styles.langBtnText,
                  lang === 'ar' && styles.langBtnTextActive,
                ]}
              >
                العربية
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => setScreen('profile')}
          >
            <Text style={styles.primaryBtnText}>{t.start}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // PROFILE
  // ============================================================
  if (screen === 'profile') {
    return (
      <SafeAreaView style={[styles.container, { direction: t.dir }]}>
        <ScrollView contentContainerStyle={styles.centerScroll}>
          <Text style={{ fontSize: 80 }}>👶</Text>
          <Text style={styles.title}>{t.welcome}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.enterName}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.namePlaceholder}
              value={name}
              onChangeText={setName}
              textAlign={t.dir === 'rtl' ? 'right' : 'left'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.enterAge}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.agePlaceholder}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              textAlign={t.dir === 'rtl' ? 'right' : 'left'}
            />
          </View>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              const n = name.trim();
              const a = parseInt(age, 10);
              if (!n) {
                Alert.alert('', t.enterName);
                return;
              }
              if (!a || a < 5 || a > 18) {
                Alert.alert('', t.agePlaceholder);
                return;
              }
              persist({ name: n, age: a });
              setScreen('home');
            }}
          >
            <Text style={styles.primaryBtnText}>{t.enterGame}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // HOME
  // ============================================================
  if (screen === 'home') {
    return (
      <SafeAreaView style={[styles.container, { direction: t.dir }]}>
        <ScrollView contentContainerStyle={styles.homeScroll}>
          <View style={styles.homeHeader}>
            <Text style={styles.homeGreeting}>👋 {name || t.appName}</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: '#FFF3BF' }]}>
                <Text style={styles.statVal}>⭐ {stars}</Text>
                <Text style={styles.statLabel}>{t.stars}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: '#D3F9D8' }]}>
                <Text style={styles.statVal}>🏆 {best}</Text>
                <Text style={styles.statLabel}>{t.bestScore}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: '#D0EBFF' }]}>
                <Text style={styles.statVal}>📈 {getLevel(score)}</Text>
                <Text style={styles.statLabel}>{t.level}</Text>
              </View>
            </View>
          </View>

          {rewards > 0 && (
            <Pressable
              style={styles.rewardBanner}
              onPress={() => setScreen('games')}
            >
              <Text style={styles.rewardBannerText}>
                🎁 {t.rewardReady} ({rewards})
              </Text>
            </Pressable>
          )}

          <View style={styles.menuGrid}>
            <Pressable
              style={[styles.menuCard, { backgroundColor: '#FF8FA3' }]}
              onPress={() => setScreen('setup')}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuEmoji}>🎮</Text>
              </View>
              <Text style={styles.menuLabel}>{t.normalTest}</Text>
            </Pressable>

            <Pressable
              style={[styles.menuCard, { backgroundColor: '#63E6BE' }]}
              onPress={() => setScreen('tables')}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuEmoji}>✖</Text>
              </View>
              <Text style={styles.menuLabel}>{t.timesTables}</Text>
            </Pressable>

            <Pressable
              style={[styles.menuCard, { backgroundColor: '#FFD43B' }]}
              onPress={() => setScreen('mistakes')}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuEmoji}>📚</Text>
              </View>
              <Text style={styles.menuLabel}>{t.reviewMistakes}</Text>
            </Pressable>

            <Pressable
              style={[styles.menuCard, { backgroundColor: '#B197FC' }]}
              onPress={() => setScreen('calculator')}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuEmoji}>🧮</Text>
              </View>
              <Text style={styles.menuLabel}>{t.calculator}</Text>
            </Pressable>

            <Pressable
              style={[styles.menuCard, { backgroundColor: '#74C0FC' }]}
              onPress={() => setScreen('games')}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuEmoji}>🎯</Text>
              </View>
              <Text style={styles.menuLabel}>{t.playGames}</Text>
            </Pressable>

            <Pressable
              style={[styles.menuCard, { backgroundColor: '#FDA7DF' }]}
              onPress={() => setScreen('settings')}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuEmoji}>⚙</Text>
              </View>
              <Text style={styles.menuLabel}>{t.settings}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // SETUP
  // ============================================================
  if (screen === 'setup') {
    return (
      <SafeAreaView style={[styles.container, { direction: t.dir }]}>
        <View style={styles.topBar}>
          <HomeButton t={t} onPress={() => setScreen('home')} />
        </View>
        <ScrollView contentContainerStyle={styles.setupScroll}>
          <Text style={styles.title}>🎯 {t.startTest}</Text>

          <Text style={styles.sectionLabel}>{t.difficulty}</Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => setDiff('easy')}
              style={[styles.chip, diff === 'easy' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  diff === 'easy' && styles.chipTextActive,
                ]}
              >
                {t.easy}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDiff('medium')}
              style={[styles.chip, diff === 'medium' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  diff === 'medium' && styles.chipTextActive,
                ]}
              >
                {t.medium}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDiff('hard')}
              style={[styles.chip, diff === 'hard' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  diff === 'hard' && styles.chipTextActive,
                ]}
              >
                {t.hard}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>{t.operation}</Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => setOp('all')}
              style={[styles.chip, op === 'all' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  op === 'all' && styles.chipTextActive,
                ]}
              >
                {t.all}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setOp('addition')}
              style={[styles.chip, op === 'addition' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  op === 'addition' && styles.chipTextActive,
                ]}
              >
                {t.addition}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setOp('subtraction')}
              style={[styles.chip, op === 'subtraction' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  op === 'subtraction' && styles.chipTextActive,
                ]}
              >
                {t.subtraction}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setOp('multiplication')}
              style={[
                styles.chip,
                op === 'multiplication' && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  op === 'multiplication' && styles.chipTextActive,
                ]}
              >
                {t.multiplication}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setOp('division')}
              style={[styles.chip, op === 'division' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  op === 'division' && styles.chipTextActive,
                ]}
              >
                {t.division}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>{t.questionCount}</Text>
          <View style={styles.chipRow}>
            {[5, 10, 15, 20, 25, 30, 40, 50].map((c) => (
              <Pressable
                key={c}
                onPress={() => setCount(c)}
                style={[styles.chip, count === c && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    count === c && styles.chipTextActive,
                  ]}
                >
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Mode</Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => setMode('normal')}
              style={[styles.chip, mode === 'normal' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  mode === 'normal' && styles.chipTextActive,
                ]}
              >
                {t.normalTest}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode('speed')}
              style={[styles.chip, mode === 'speed' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  mode === 'speed' && styles.chipTextActive,
                ]}
              >
                {t.speedTest}
              </Text>
            </Pressable>
          </View>

          <Pressable style={styles.primaryBtn} onPress={startTest}>
            <Text style={styles.primaryBtnText}>{t.startTest} 🚀</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // GAME
  // ============================================================
  if (screen === 'game') {
    const q = currentQuestion;
    if (!q) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.center}>
            <Text>...</Text>
          </View>
        </SafeAreaView>
      );
    }

    const options = currentOptions;
    const opSymbol = {
      addition: '+',
      subtraction: '−',
      multiplication: '×',
      division: '÷',
    }[q.op];

    const visualLine = buildVisualLine(q, useVisuals);

    return (
      <SafeAreaView style={[styles.container, { direction: t.dir }]}>
        <View style={styles.gameTopBar}>
          <Pressable
            style={styles.exitBtn}
            onPress={() => {
              Alert.alert(t.exitTest, t.exitConfirm, [
                { text: t.no, style: 'cancel' },
                {
                  text: t.yes,
                  style: 'destructive',
                  onPress: () => {
                    clearInterval(timerRef.current);
                    setScreen('home');
                  },
                },
              ]);
            }}
          >
            <Text style={styles.exitBtnText}>✕</Text>
          </Pressable>
          <Text style={styles.gameProgress}>
            {currentIdx + 1} / {questions.length}
          </Text>
          {streak >= 2 ? (
            <Text style={styles.streakBadge}>🔥 {streak}</Text>
          ) : (
            <View style={{ width: 50 }} />
          )}
          {mode === 'speed' ? (
            <Text style={styles.gameTimer}>⏱ {timeLeft}s</Text>
          ) : (
            <View style={{ width: 50 }} />
          )}
          {mode === 'speed' ? (
            <Pressable onPress={() => setIsPaused((p) => !p)}>
              <Text style={styles.pauseBtn}>{isPaused ? '▶' : '⏸'}</Text>
            </Pressable>
          ) : (
            <View style={{ width: 30 }} />
          )}
        </View>

        {isPaused ? (
          <View style={styles.center}>
            <Text style={{ fontSize: 80 }}>⏸</Text>
            <Text style={styles.title}>{t.pause}</Text>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => setIsPaused(false)}
            >
              <Text style={styles.primaryBtnText}>{t.resume}</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.gameBody}>
            <View style={styles.questionBox}>
              <Confetti trigger={confettiTrigger} />
              {visualLine && (
                <Text style={styles.visualText}>{visualLine}</Text>
              )}
              <Text style={styles.questionText}>
                {q.a} {opSymbol} {q.b} = ?
              </Text>
            </View>

            <View style={styles.optionsGrid}>
              {options.map((opt, idx) => {
                const emoji = optionEmojis[idx] || '⭐';
                let btnStyle = styles.optionBtn;
                let txtStyle = styles.optionText;
                let badge = '';
                let showExplosion = false;

                if (showFeedback === 'correct' && opt === q.ans) {
                  btnStyle = [styles.optionBtn, styles.optionCorrect];
                  txtStyle = [styles.optionText, styles.optionTextCorrect];
                  badge = ' ✅';
                } else if (showFeedback === 'wrong') {
                  if (opt === selectedOption) {
                    btnStyle = [styles.optionBtn, styles.optionWrong];
                    txtStyle = [styles.optionText, styles.optionTextWrong];
                    badge = ' ❌';
                    showExplosion = true;
                  } else if (opt === q.ans) {
                    btnStyle = [styles.optionBtn, styles.optionCorrect];
                    txtStyle = [styles.optionText, styles.optionTextCorrect];
                    badge = ' ✅';
                  }
                }

                return (
                  <Pressable
                    key={`${currentIdx}-${idx}-${opt}`}
                    style={btnStyle}
                    onPress={() => handleAnswer(opt)}
                    disabled={showFeedback !== null}
                  >
                    <Text style={styles.optionEmoji}>{emoji}</Text>
                    <Text style={txtStyle}>
                      {opt}
                      {badge}
                    </Text>
                    {showExplosion && (
                      <Explosion trigger={explosionTrigger} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {showFeedback === 'correct' && (
              <View style={styles.feedbackCorrect}>
                <Text style={styles.feedbackText}>🎉 {praiseMsg}</Text>
                {streak >= 2 && (
                  <Text style={styles.feedbackSmall}>
                    🔥 {t.streak}: {streak}
                  </Text>
                )}
              </View>
            )}

            {showFeedback === 'wrong' && (
              <View style={styles.feedbackWrong}>
                <Text style={styles.feedbackText}>💨 {encourageMsg}</Text>
                <Text style={styles.explainTitle}>
                  {t.correctAnswer}: {q.ans}
                </Text>
                <View style={styles.explainBox}>
                  <Text style={styles.explainLabel}>{t.explanation}:</Text>
                  <Text style={styles.explainText}>
                    {getExplanation(q, lang)}
                  </Text>
                </View>
                <Pressable style={styles.primaryBtn} onPress={advance}>
                  <Text style={styles.primaryBtnText}>
                    {t.nextQuestion} ➡
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        )}

        {levelUpFlash && (
          <View style={styles.levelUpOverlay} pointerEvents="none">
            <Text style={styles.levelUpText}>🎊 {t.levelUp} 🎊</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ============================================================
  // RESULTS
  // ============================================================
  if (screen === 'results') {
    const correctCount = questions.length - mistakes.length;
    const wrongCount = mistakes.length;

    return (
      <SafeAreaView style={[styles.container, { direction: t.dir }]}>
        <View style={styles.topBar}>
          <HomeButton t={t} onPress={() => setScreen('home')} />
        </View>
        <ScrollView contentContainerStyle={styles.centerScroll}>
          <Text style={{ fontSize: 100 }}>
            {wrongCount === 0 ? '🏆' : wrongCount <= 2 ? '🎉' : '💪'}
          </Text>
          <Text style={styles.bigTitle}>{t.results}</Text>

          <View style={styles.resultBox}>
            <Text style={styles.resultLine}>
              {t.scoreLabel}: {score}
            </Text>
            <Text style={styles.resultLine}>
              {t.correctLabel}: {correctCount} ✅
            </Text>
            <Text style={styles.resultLine}>
              {t.wrongLabel}: {wrongCount} ❌
            </Text>
            <Text style={styles.resultLine}>
              {t.starLabel}: ⭐ {sessionStars}
            </Text>
            <Text style={styles.resultLine}>
              {t.bestScore}: {Math.max(best, score)}
            </Text>
          </View>

          <View style={styles.rewardBox}>
            <Text style={{ fontSize: 50 }}>🎁</Text>
            <Text style={styles.rewardText}>{t.youGotGame}</Text>
            <Pressable
              style={[
                styles.primaryBtn,
                { backgroundColor: COLORS.purple, marginTop: 12 },
              ]}
              onPress={() => setScreen('games')}
            >
              <Text style={styles.primaryBtnText}>{t.startPlaying}</Text>
            </Pressable>
          </View>

          {mistakes.length > 0 && (
            <Pressable
              style={[styles.primaryBtn, { backgroundColor: COLORS.secondary }]}
              onPress={() => setScreen('mistakes')}
            >
              <Text style={styles.primaryBtnText}>📚 {t.reviewMistakes}</Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.primaryBtn, { backgroundColor: COLORS.success }]}
            onPress={() => setScreen(practiceTable ? 'tables' : 'setup')}
          >
            <Text style={styles.primaryBtnText}>
              {practiceTable ? t.playAgainTable : t.playAgain}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => setScreen('home')}
          >
            <Text style={styles.secondaryBtnText}>{t.home}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // MISTAKES
  // ============================================================
  if (screen === 'mistakes') {
    return (
      <SafeAreaView style={[styles.container, { direction: t.dir }]}>
        <View style={styles.topBar}>
          <HomeButton t={t} onPress={() => setScreen('home')} />
        </View>
        <ScrollView contentContainerStyle={styles.mistakesScroll}>
          <Text style={styles.title}>📚 {t.reviewMistakes}</Text>

          {mistakes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 80 }}>🌟</Text>
              <Text style={styles.title}>{t.noMistakes}</Text>
            </View>
          ) : (
            mistakes.map((m, idx) => {
              const opSymbol = {
                addition: '+',
                subtraction: '−',
                multiplication: '×',
                division: '÷',
              }[m.question.op];

              return (
                <View key={idx} style={styles.mistakeCard}>
                  <Text style={styles.mistakeQ}>
                    {m.question.a} {opSymbol} {m.question.b} = ?
                  </Text>
                  <Text style={styles.mistakeWrong}>
                    {t.yourAnswer}: {m.chosen} ❌
                  </Text>
                  <Text style={styles.mistakeCorrect}>
                    {t.correctAnswer}: {m.correct} ✅
                  </Text>
                  <View style={styles.mistakeExplainBox}>
                    <Text style={styles.mistakeExplainLabel}>
                      {t.explanation}:
                    </Text>
                    <Text style={styles.mistakeExplain}>
                      {getExplanation(m.question, lang)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // TABLES
  // ============================================================
  if (screen === 'tables') {
    return (
      <TablesScreen
        t={t}
        onBack={() => setScreen('home')}
        onPractice={startTablePractice}
      />
    );
  }

  // ============================================================
  // CALCULATOR
  // ============================================================
  if (screen === 'calculator') {
    return <CalculatorScreen t={t} onBack={() => setScreen('home')} />;
  }

  // ============================================================
  // GAMES HUB
  // ============================================================
  if (screen === 'games') {
    return (
      <GamesHubScreen
        t={t}
        rewards={rewards}
        consumeReward={consumeReward}
        onBack={() => setScreen('home')}
        onPickGame={(game) => setScreen(game)}
      />
    );
  }

  // ============================================================
  // SNAKE GAME
  // ============================================================
  if (screen === 'snake') {
    return (
      <SnakeGameScreen
        t={t}
        onBack={() => setScreen('games')}
        onScore={() => {
          setStars((s) => {
            const ns = s + 1;
            persist({ stars: ns });
            return ns;
          });
        }}
      />
    );
  }

  // ============================================================
  // MEMORY MATCH
  // ============================================================
  if (screen === 'memory') {
    return (
      <MemoryMatchScreen
        t={t}
        onBack={() => setScreen('games')}
        onScore={() => {
          setStars((s) => {
            const ns = s + 1;
            persist({ stars: ns });
            return ns;
          });
        }}
      />
    );
  }

  // ============================================================
  // TARGET TAP
  // ============================================================
  if (screen === 'target') {
    return (
      <TargetTapScreen
        t={t}
        onBack={() => setScreen('games')}
        onScore={() => {
          setStars((s) => {
            const ns = s + 1;
            persist({ stars: ns });
            return ns;
          });
        }}
      />
    );
  }

  // ============================================================
  // SETTINGS
  // ============================================================
  if (screen === 'settings') {
    return (
      <SafeAreaView style={[styles.container, { direction: t.dir }]}>
        <View style={styles.topBar}>
          <HomeButton t={t} onPress={() => setScreen('home')} />
        </View>
        <ScrollView contentContainerStyle={styles.setupScroll}>
          <Text style={styles.title}>⚙ {t.settings}</Text>

          <Text style={styles.sectionLabel}>{t.language}</Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => {
                setLang('fa');
                persist({ lang: 'fa' });
              }}
              style={[styles.chip, lang === 'fa' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  lang === 'fa' && styles.chipTextActive,
                ]}
              >
                فارسی
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setLang('en');
                persist({ lang: 'en' });
              }}
              style={[styles.chip, lang === 'en' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  lang === 'en' && styles.chipTextActive,
                ]}
              >
                English
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setLang('ar');
                persist({ lang: 'ar' });
              }}
              style={[styles.chip, lang === 'ar' && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  lang === 'ar' && styles.chipTextActive,
                ]}
              >
                العربية
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>{t.sound}</Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => {
                setSoundOn(true);
                persist({ soundOn: true });
              }}
              style={[styles.chip, soundOn === true && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  soundOn === true && styles.chipTextActive,
                ]}
              >
                {t.on}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setSoundOn(false);
                persist({ soundOn: false });
              }}
              style={[styles.chip, soundOn === false && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  soundOn === false && styles.chipTextActive,
                ]}
              >
                {t.off}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>{t.pictures}</Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => {
                setPicturesOn(true);
                persist({ picturesOn: true });
              }}
              style={[styles.chip, picturesOn === true && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  picturesOn === true && styles.chipTextActive,
                ]}
              >
                {t.on}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setPicturesOn(false);
                persist({ picturesOn: false });
              }}
              style={[styles.chip, picturesOn === false && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  picturesOn === false && styles.chipTextActive,
                ]}
              >
                {t.off}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text>?</Text>
      </View>
    </SafeAreaView>
  );
}

// ============================================================
// TABLES SCREEN
// ============================================================
function TablesScreen({ t, onBack, onPractice }) {
  const [selectedTable, setSelectedTable] = useState(null);

  if (selectedTable) {
    const rows = [];
    for (let i = 1; i <= 10; i++) {
      rows.push(
        <View key={i} style={styles.tableLineRow}>
          <Text style={styles.tableLine}>
            {selectedTable} × {i} = {selectedTable * i}
          </Text>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <HomeButton t={t} onPress={onBack} />
        </View>
        <ScrollView contentContainerStyle={styles.tablesScroll}>
          <Text style={styles.title}>
            ✖ {t.table} {selectedTable}
          </Text>

          <View style={styles.tableListView}>{rows}</View>

          <Pressable
            style={[styles.primaryBtn, { backgroundColor: COLORS.success }]}
            onPress={() => onPractice(selectedTable)}
          >
            <Text style={styles.primaryBtnText}>🎯 {t.startPractice}</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => setSelectedTable(null)}
          >
            <Text style={styles.secondaryBtnText}>{t.back}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <HomeButton t={t} onPress={onBack} />
      </View>
      <ScrollView contentContainerStyle={styles.tablesScroll}>
        <Text style={styles.title}>✖ {t.timesTables}</Text>
        <Text style={styles.subtitle}>{t.selectTablePrompt}</Text>

        <View style={styles.tablesGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <Pressable
              key={n}
              style={styles.tableCard}
              onPress={() => setSelectedTable(n)}
            >
              <Text style={styles.tableCardNum}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// CALCULATOR SCREEN
// ============================================================
function CalculatorScreen({ t, onBack }) {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const buildLiveHistory = () => {
    if (prev !== null && operator) {
      return `${prev} ${operator} ${waitingForOperand ? '' : display}`;
    }
    return '';
  };

  const inputDigit = (d) => {
    if (justEvaluated) {
      setDisplay(String(d));
      setPrev(null);
      setOperator(null);
      setHistory('');
      setWaitingForOperand(false);
      setJustEvaluated(false);
      return;
    }
    if (waitingForOperand) {
      setDisplay(String(d));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(d) : display + d);
    }
  };

  const inputDot = () => {
    if (justEvaluated) {
      setDisplay('0.');
      setPrev(null);
      setOperator(null);
      setHistory('');
      setWaitingForOperand(false);
      setJustEvaluated(false);
      return;
    }
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrev(null);
    setOperator(null);
    setWaitingForOperand(false);
    setHistory('');
    setJustEvaluated(false);
  };

  const performOp = (nextOp) => {
    const inputValue = parseFloat(display);

    if (prev === null) {
      setPrev(inputValue);
      setHistory(`${inputValue} ${nextOp}`);
    } else if (operator) {
      const currentValue = prev;
      let newValue = currentValue;

      if (operator === '+') newValue = currentValue + inputValue;
      else if (operator === '−') newValue = currentValue - inputValue;
      else if (operator === '×') newValue = currentValue * inputValue;
      else if (operator === '÷') {
        newValue = inputValue === 0 ? 0 : currentValue / inputValue;
      }

      const rounded = Math.round(newValue * 100) / 100;
      setPrev(rounded);
      setDisplay(String(rounded));

      if (nextOp) {
        setHistory(`${rounded} ${nextOp}`);
      } else {
        setHistory(`${currentValue} ${operator} ${inputValue} =`);
      }
    }

    setWaitingForOperand(true);
    setOperator(nextOp);
    setJustEvaluated(false);
  };

  const equals = () => {
    if (operator === null || prev === null) return;
    const inputValue = parseFloat(display);
    const currentValue = prev;
    let newValue = currentValue;

    if (operator === '+') newValue = currentValue + inputValue;
    else if (operator === '−') newValue = currentValue - inputValue;
    else if (operator === '×') newValue = currentValue * inputValue;
    else if (operator === '÷') {
      newValue = inputValue === 0 ? 0 : currentValue / inputValue;
    }

    const rounded = Math.round(newValue * 100) / 100;
    setHistory(`${currentValue} ${operator} ${inputValue} =`);
    setDisplay(String(rounded));
    setPrev(null);
    setOperator(null);
    setWaitingForOperand(true);
    setJustEvaluated(true);
  };

  const liveHistory = buildLiveHistory();
  const showHistory = history || liveHistory;

  const btnDefs = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '−'],
    ['0', '.', 'C', '+'],
    ['='],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <HomeButton t={t} onPress={onBack} />
      </View>
      <View style={styles.calcBody}>
        <View style={styles.calcDisplay}>
          <Text style={styles.calcHistory} numberOfLines={1}>
            {showHistory || ' '}
          </Text>
          <Text style={styles.calcDisplayText} numberOfLines={1}>
            {display}
          </Text>
        </View>

        {btnDefs.map((row, ri) => (
          <View key={ri} style={styles.calcRow}>
            {row.map((b) => {
              let extraStyle = {};
              if (b === '=') extraStyle = styles.calcBtnEq;
              else if (b === 'C') extraStyle = styles.calcBtnC;
              else if (
                b === '÷' ||
                b === '×' ||
                b === '−' ||
                b === '+'
              )
                extraStyle = styles.calcBtnOp;

              const isActiveOp = b === operator;

              return (
                <Pressable
                  key={b}
                  style={[
                    styles.calcBtn,
                    { flex: b === '=' ? 4 : 1 },
                    extraStyle,
                    isActiveOp && styles.calcBtnOpActive,
                  ]}
                  onPress={() => {
                    if (b >= '0' && b <= '9') inputDigit(b);
                    else if (b === '.') inputDot();
                    else if (b === 'C') clear();
                    else if (b === '=') equals();
                    else performOp(b);
                  }}
                >
                  <Text
                    style={[
                      styles.calcBtnText,
                      isActiveOp && styles.calcBtnTextActive,
                    ]}
                  >
                    {b}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ============================================================
// GAMES HUB SCREEN
// ============================================================
function GamesHubScreen({ t, rewards, consumeReward, onBack, onPickGame }) {
  const games = [
    {
      key: 'snake',
      title: t.snakeTitle,
      emoji: '🐍',
      color: '#63E6BE',
      desc: t.snakeDesc,
    },
    {
      key: 'memory',
      title: t.memoryMatch,
      emoji: '🧩',
      color: '#A29BFE',
      desc: t.pairsFound,
    },
    {
      key: 'target',
      title: t.targetTap,
      emoji: '🎯',
      color: '#FFD43B',
      desc: t.targetHit,
    },
  ];

  const handlePick = (gameKey) => {
    if (rewards > 0) {
      consumeReward();
      onPickGame(gameKey);
    } else {
      Alert.alert('🎁', t.noRewards);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <HomeButton t={t} onPress={onBack} />
      </View>
      <ScrollView contentContainerStyle={styles.gamesScroll}>
        <Text style={styles.title}>🎮 {t.playGames}</Text>

        <View style={styles.rewardInfoBox}>
          <Text style={{ fontSize: 30 }}>🎁</Text>
          <Text style={styles.rewardInfoText}>
            {t.reward}: {rewards}
          </Text>
        </View>

        {games.map((g) => (
          <Pressable
            key={g.key}
            style={[styles.gameCardRow, { backgroundColor: g.color }]}
            onPress={() => handlePick(g.key)}
          >
            <View style={styles.gameCardIconCircle}>
              <Text style={styles.gameCardEmoji}>{g.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.gameCardTitle}>{g.title}</Text>
              <Text style={styles.gameCardDesc}>{g.desc}</Text>
            </View>
            <Text style={styles.gameCardArrow}>
              {rewards > 0 ? '▶' : '🔒'}
            </Text>
          </Pressable>
        ))}

        {rewards === 0 && (
          <Text style={styles.lockedHint}>{t.noRewards}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// SNAKE GAME SCREEN (with Touch Swipe Controls)
// ============================================================
function SnakeGameScreen({ t, onBack, onScore }) {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(400);

  const snakeRef = useRef(snake);
  const dirRef = useRef(direction);
  const foodRef = useRef(food);
  const overRef = useRef(false);

  const directionLockRef = useRef(false);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    dirRef.current = direction;
  }, [direction]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  useEffect(() => {
    overRef.current = gameOver;
  }, [gameOver]);

  const generateFood = (snakeArr) => {
    let attempts = 0;
    while (attempts < 200) {
      attempts++;
      const x = rnd(0, SNAKE_GRID_SIZE - 1);
      const y = rnd(0, SNAKE_GRID_SIZE - 1);
      if (!snakeArr.some((s) => s.x === x && s.y === y)) {
        return { x, y };
      }
    }
    return { x: 0, y: 0 };
  };

  const initGame = () => {
    const initialSnake = [{ x: 7, y: 7 }];
    const initialDir = { x: 1, y: 0 };
    const initialFood = generateFood(initialSnake);
    setSnake(initialSnake);
    setDirection(initialDir);
    setNextDirection(initialDir);
    setFood(initialFood);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setSpeed(400);
    directionLockRef.current = false;
  };

  useEffect(() => {
    if (!started || gameOver) return;

    const loop = setInterval(() => {
      if (overRef.current) return;

      const dir = dirRef.current;
      const currentSnake = snakeRef.current;
      const currentFood = foodRef.current;

      const head = currentSnake[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      if (
        newHead.x < 0 ||
        newHead.x >= SNAKE_GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= SNAKE_GRID_SIZE
      ) {
        setGameOver(true);
        if (onScore) onScore();
        return;
      }

      if (currentSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setGameOver(true);
        if (onScore) onScore();
        return;
      }

      const ateFood =
        newHead.x === currentFood.x && newHead.y === currentFood.y;

      let newSnake;
      if (ateFood) {
        newSnake = [newHead, ...currentSnake];
        setFood(generateFood(newSnake));
        setScore((s) => s + 1);
        setSpeed((sp) => Math.max(150, sp - 15));
      } else {
        newSnake = [newHead, ...currentSnake.slice(0, -1)];
      }

      setSnake(newSnake);
      setDirection(nextDirection);
      directionLockRef.current = false;
    }, speed);

    return () => clearInterval(loop);
  }, [started, gameOver, speed, nextDirection]);

  const changeDirection = (newDir) => {
    if (directionLockRef.current) return;
    const current = dirRef.current;

    if (current.x === -newDir.x && current.y === -newDir.y) return;
    if (current.x === newDir.x && current.y === newDir.y) return;

    setNextDirection(newDir);
    directionLockRef.current = true;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        const MIN_SWIPE = 20;
        if (absX < MIN_SWIPE && absY < MIN_SWIPE) return;

        if (absX > absY) {
          if (dx > 0) {
            changeDirection({ x: 1, y: 0 });
          } else {
            changeDirection({ x: -1, y: 0 });
          }
        } else {
          if (dy > 0) {
            changeDirection({ x: 0, y: 1 });
          } else {
            changeDirection({ x: 0, y: -1 });
          }
        }
      },
    })
  ).current;

  const cellSize = Math.min(
    (SCREEN_W - 40) / SNAKE_GRID_SIZE,
    (SCREEN_H - 260) / SNAKE_GRID_SIZE
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameTopBarSimple}>
        <HomeButton t={t} onPress={onBack} />
        <Text style={styles.gameInfoText}>🍎 {score}</Text>
      </View>

      <View style={styles.snakeBoardWrap} {...panResponder.panHandlers}>
        <View
          style={[
            styles.snakeBoard,
            {
              width: cellSize * SNAKE_GRID_SIZE,
              height: cellSize * SNAKE_GRID_SIZE,
            },
          ]}
        >
          <View
            style={[
              styles.snakeCell,
              {
                width: cellSize,
                height: cellSize,
                left: food.x * cellSize,
                top: food.y * cellSize,
              },
            ]}
          >
            <Text style={{ fontSize: cellSize * 0.8 }}>🍎</Text>
          </View>

          {snake.map((seg, i) => (
            <View
              key={i}
              style={[
                styles.snakeCell,
                {
                  width: cellSize,
                  height: cellSize,
                  left: seg.x * cellSize,
                  top: seg.y * cellSize,
                },
              ]}
            >
              <View
                style={[
                  styles.snakeSegment,
                  i === 0 && styles.snakeHead,
                  { width: cellSize - 2, height: cellSize - 2 },
                ]}
              >
                {i === 0 && (
                  <Text style={{ fontSize: cellSize * 0.6 }}>🐍</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {started && !gameOver && (
        <View style={styles.swipeHintWrap}>
          <Text style={styles.swipeHintText}>👆 {t.swipeHint}</Text>
        </View>
      )}

      {!started && !gameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverCard}>
            <Text style={{ fontSize: 70 }}>🐍</Text>
            <Text style={styles.gameOverTitle}>{t.snakeTitle}</Text>
            <Text style={styles.snakeInstructions}>
              {t.snakeInstructions}
            </Text>
            <Pressable
              style={[styles.primaryBtn, { marginTop: 12 }]}
              onPress={initGame}
            >
              <Text style={styles.primaryBtnText}>{t.startGame}</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={onBack}>
              <Text style={styles.secondaryBtnText}>{t.back}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverCard}>
            <Text style={{ fontSize: 70 }}>🎉</Text>
            <Text style={styles.gameOverTitle}>{t.gameOver}</Text>
            <Text style={styles.gameOverScore}>
              {t.yourScore}: {score}
            </Text>
            <Pressable
              style={[styles.primaryBtn, { marginTop: 12 }]}
              onPress={initGame}
            >
              <Text style={styles.primaryBtnText}>{t.playAgain}</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={onBack}>
              <Text style={styles.secondaryBtnText}>{t.back}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ============================================================
// MEMORY MATCH SCREEN
// ============================================================
function MemoryMatchScreen({ t, onBack, onScore }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lock, setLock] = useState(false);

  const initGame = () => {
    const pairs = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS];
    const shuffled = shuffle(pairs).map((emoji, idx) => ({
      id: idx,
      emoji,
    }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
    setLock(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardPress = (card) => {
    if (lock) return;
    if (flipped.includes(card.id)) return;
    if (matched.includes(card.id)) return;

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [id1, id2] = nextFlipped;
      const c1 = cards.find((c) => c.id === id1);
      const c2 = cards.find((c) => c.id === id2);

      if (c1.emoji === c2.emoji) {
        const newMatched = [...matched, id1, id2];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === cards.length) {
          setGameOver(true);
          if (onScore) onScore();
        }
      } else {
        setLock(true);
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 800);
      }
    }
  };

  const cols = 4;
  const cardSize = Math.min((SCREEN_W - 60) / cols, 80);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameTopBarSimple}>
        <HomeButton t={t} onPress={onBack} />
        <Text style={styles.gameInfoText}>
          {t.pairsFound}: {matched.length / 2} / {MEMORY_EMOJIS.length}
        </Text>
        <Text style={styles.gameInfoText}>
          {t.moves}: {moves}
        </Text>
      </View>

      <View style={styles.memoryGrid}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.id);
          const show = isFlipped || isMatched;

          return (
            <Pressable
              key={card.id}
              style={[
                styles.memoryCard,
                {
                  width: cardSize,
                  height: cardSize,
                  backgroundColor: show ? '#fff' : COLORS.secondary,
                },
                isMatched && { backgroundColor: '#D3F9D8' },
              ]}
              onPress={() => handleCardPress(card)}
            >
              <Text style={{ fontSize: cardSize * 0.55 }}>
                {show ? card.emoji : '❓'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverCard}>
            <Text style={{ fontSize: 70 }}>🎉</Text>
            <Text style={styles.gameOverTitle}>{t.gameOver}</Text>
            <Text style={styles.gameOverScore}>
              {t.moves}: {moves}
            </Text>
            <Pressable
              style={[styles.primaryBtn, { marginTop: 12 }]}
              onPress={initGame}
            >
              <Text style={styles.primaryBtnText}>{t.playAgain}</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={onBack}>
              <Text style={styles.secondaryBtnText}>{t.back}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ============================================================
// TARGET TAP SCREEN
// ============================================================
function TargetTapScreen({ t, onBack, onScore }) {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const idRef = useRef(0);

  const spawnTarget = () => {
    const id = idRef.current++;
    const size = rnd(60, 90);
    const top = rnd(80, SCREEN_H - 300);
    const left = rnd(20, Math.max(30, SCREEN_W - size - 40));
    const duration = rnd(900, 1600);

    const anim = new Animated.Value(0);

    const target = { id, size, top, left, anim };

    Animated.timing(anim, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setTargets((prev) => prev.filter((tg) => tg.id !== id));
      }
    });

    setTargets((prev) => [...prev, target]);
  };

  useEffect(() => {
    if (!running || gameOver) return;
    const spawn = setInterval(spawnTarget, 700);
    return () => clearInterval(spawn);
  }, [running, gameOver]);

  useEffect(() => {
    if (!running || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          setGameOver(true);
          if (onScore) onScore();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, gameOver]);

  const hitTarget = (id) => {
    setTargets((prev) => prev.filter((tg) => tg.id !== id));
    setScore((s) => s + 1);
  };

  const restart = () => {
    setTargets([]);
    setScore(0);
    setTimeLeft(30);
    setRunning(true);
    setGameOver(false);
    idRef.current = 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameTopBarSimple}>
        <HomeButton t={t} onPress={onBack} />
        <Text style={styles.gameInfoText}>⏱ {timeLeft}s</Text>
        <Text style={styles.gameInfoText}>🎯 {score}</Text>
      </View>

      <View style={styles.playArea} pointerEvents="box-none">
        {targets.map((tg) => {
          const scale = tg.anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 1.1, 0.8],
          });
          const opacity = tg.anim.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [1, 1, 0],
          });
          return (
            <Animated.View
              key={tg.id}
              pointerEvents="box-none"
              style={[
                styles.targetWrap,
                {
                  top: tg.top,
                  left: tg.left,
                  width: tg.size,
                  height: tg.size,
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              <Pressable
                onPress={() => hitTarget(tg.id)}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: tg.size * 0.7 }}>🎯</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverCard}>
            <Text style={{ fontSize: 70 }}>🎉</Text>
            <Text style={styles.gameOverTitle}>{t.gameOver}</Text>
            <Text style={styles.gameOverScore}>
              {t.yourScore}: {score}
            </Text>
            <Pressable
              style={[styles.primaryBtn, { marginTop: 12 }]}
              onPress={restart}
            >
              <Text style={styles.primaryBtnText}>{t.playAgain}</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={onBack}>
              <Text style={styles.secondaryBtnText}>{t.back}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  homeScroll: {
    padding: 20,
    paddingTop: 20,
  },
  setupScroll: {
    padding: 20,
  },
  mistakesScroll: {
    padding: 20,
  },
  tablesScroll: {
    padding: 20,
  },
  gamesScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
  },
  homeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  bigTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 12,
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.dark,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: COLORS.dark,
    opacity: 0.8,
    marginTop: 8,
    marginBottom: 20,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 44,
    borderRadius: 32,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    marginTop: 16,
    borderWidth: 2,
    borderColor: COLORS.dark,
    alignSelf: 'center',
  },
  secondaryBtnText: {
    color: COLORS.dark,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  langBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  langBtnActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  langBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
  },
  langBtnTextActive: {
    color: '#fff',
  },
  inputGroup: {
    width: '100%',
    maxWidth: 360,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    fontSize: 18,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    color: COLORS.dark,
  },
  homeHeader: {
    marginBottom: 20,
  },
  homeGreeting: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.dark,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.dark,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.dark,
    opacity: 0.7,
    marginTop: 2,
    fontWeight: '600',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '47%',
    borderRadius: 26,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  menuIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  menuEmoji: {
    fontSize: 40,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rewardBanner: {
    backgroundColor: COLORS.purple,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  rewardBannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: 18,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
  },
  chipTextActive: {
    color: '#fff',
  },
  gameTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
  },
  gameTopBarSimple: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
  },
  gameInfoText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.dark,
  },
  exitBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  exitBtnText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.danger,
  },
  gameProgress: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
  },
  streakBadge: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    backgroundColor: '#FFE3E3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gameTimer: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  pauseBtn: {
    fontSize: 24,
  },
  gameBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  questionBox: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.accent,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  visualText: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 38,
  },
  questionText: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.dark,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionBtn: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.accent,
    marginBottom: 12,
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  optionCorrect: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  optionWrong: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.dark,
  },
  optionTextCorrect: {
    color: '#fff',
  },
  optionTextWrong: {
    color: '#fff',
  },
  feedbackCorrect: {
    backgroundColor: '#D3F9D8',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 3,
    borderColor: COLORS.success,
  },
  feedbackWrong: {
    backgroundColor: '#FFE3E3',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 3,
    borderColor: COLORS.danger,
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.dark,
    textAlign: 'center',
  },
  feedbackSmall: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 6,
  },
  explainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: 12,
  },
  explainBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    width: '100%',
  },
  explainLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  explainText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    lineHeight: 24,
  },
  confettiLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confettiEmoji: {
    position: 'absolute',
    fontSize: 28,
  },
  explosionLayer: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explosionEmoji: {
    fontSize: 44,
  },
  levelUpOverlay: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  levelUpText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    marginTop: 12,
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  resultLine: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    marginVertical: 4,
    textAlign: 'center',
  },
  rewardBox: {
    backgroundColor: COLORS.purple,
    borderRadius: 22,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    maxWidth: 360,
    width: '100%',
  },
  rewardText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  mistakeCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  mistakeQ: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.dark,
    marginBottom: 6,
  },
  mistakeWrong: {
    fontSize: 16,
    color: COLORS.danger,
    fontWeight: '800',
  },
  mistakeCorrect: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: '800',
    marginTop: 2,
  },
  mistakeExplainBox: {
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  mistakeExplainLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  mistakeExplain: {
    fontSize: 15,
    color: COLORS.dark,
    fontWeight: '600',
    lineHeight: 22,
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  tableCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tableCardNum: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
  },
  tableListView: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    marginTop: 12,
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  tableLineRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableLine: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    textAlign: 'center',
  },
  calcBody: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  calcDisplay: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    alignItems: 'flex-end',
    borderWidth: 3,
    borderColor: COLORS.secondary,
    minHeight: 110,
    justifyContent: 'flex-end',
  },
  calcHistory: {
    fontSize: 20,
    color: COLORS.dark,
    opacity: 0.45,
    marginBottom: 6,
    fontWeight: '600',
  },
  calcDisplayText: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.dark,
  },
  calcRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  calcBtn: {
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  calcBtnOp: {
    backgroundColor: COLORS.accent,
  },
  calcBtnOpActive: {
    backgroundColor: COLORS.primary,
  },
  calcBtnC: {
    backgroundColor: COLORS.danger,
  },
  calcBtnEq: {
    backgroundColor: COLORS.success,
  },
  calcBtnText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.dark,
  },
  calcBtnTextActive: {
    color: '#fff',
  },
  rewardInfoBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: COLORS.purple,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  rewardInfoText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.purple,
  },
  gameCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 14,
  },
  gameCardIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameCardEmoji: {
    fontSize: 34,
  },
  gameCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gameCardDesc: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    fontWeight: '600',
    marginTop: 2,
  },
  gameCardArrow: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '900',
  },
  lockedHint: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    color: COLORS.dark,
    opacity: 0.7,
    fontWeight: '600',
  },
  playArea: {
    flex: 1,
    position: 'relative',
  },
  snakeBoardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  snakeBoard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 4,
    borderColor: COLORS.secondary,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  snakeCell: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snakeSegment: {
    backgroundColor: '#51CF66',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snakeHead: {
    backgroundColor: '#2F9E44',
    borderRadius: 8,
  },
  swipeHintWrap: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    opacity: 0.7,
    backgroundColor: '#FFF3BF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  snakeInstructions: {
    fontSize: 14,
    color: COLORS.dark,
    opacity: 0.75,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    fontWeight: '600',
  },
  targetWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gameOverCard: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.accent,
    width: '100%',
    maxWidth: 320,
  },
  gameOverTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.dark,
    marginTop: 8,
  },
  gameOverScore: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 10,
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  memoryCard: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});
