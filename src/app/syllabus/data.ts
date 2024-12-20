export interface Course {
  id: string
  courseNumber: string
  name: string
  credits: number
  level: string
  semester: string
}

export interface Year {
  id: string
  name: string
  semesters: {
    [key: string]: Course[]
  }
}

// Define the 3.5-first plan data first (what was previously syllabusData)
export const syllabusData35First: Year[] = [
  {
    id: '1',
    name: 'שנה א',
    semesters: {
      'סמסטר א': [
        { id: '1', courseNumber: '91440', name: 'קורס הכנה לבחינת פטור בהנהלת חשבונות', credits: 0, level: 'בחינת פטור', semester: 'סמסטר א' },
        { id: '2', courseNumber: '30111', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה א', credits: 3, level: 'פ', semester: 'סמסטר א' },
        { id: '3', courseNumber: '10131', name: 'מבוא למיקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר א' },
        { id: '4', courseNumber: '', name: 'בחינת מיון באנגלית', credits: 0, level: '', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '5', courseNumber: '30112', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה ב', credits: 3, level: 'ר', semester: 'סמסטר ב' },
        { id: '6', courseNumber: '10126', name: 'מבוא למקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר ב' },
        { id: '7', courseNumber: '10142', name: 'חשבון דיפרנציאלי לתלמידי כלכלה וניהול', credits: 3, level: 'פ', semester: 'סמסטר ב' },
        { id: '8', courseNumber: '10863', name: 'יסודות החשבונאות הפינסית', credits: 6, level: 'ר', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '9', courseNumber: '10836', name: 'מבוא למשפט ולדיני עסקים', credits: 6, level: 'ר', semester: 'סמסטר ג' },
        { id: '10', courseNumber: '10860', name: 'חשבונאות ניהולית', credits: 6, level: 'ר', semester: 'סמסטר ג' },
        { id: '11', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '2',
    name: 'שנה ב',
    semesters: {
      'סמסטר א': [
        { id: '12', courseNumber: '10645', name: 'תכנון, ניתוח ועיצוב מערכות מידע', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '13', courseNumber: '10284', name: 'מושגי יסוד באקונומטריקה', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '14', courseNumber: '10864', name: 'בעיות מדידה בחשבונאות א', credits: 4, level: 'ר', semester: 'סמסטר א' },
        { id: '15', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '16', courseNumber: '10230', name: 'תורת המימון: יהול פיננסי של גופים עסקיים', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '17', courseNumber: '10874', name: 'יסודות ביקורת חשבונות', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '18', courseNumber: '10865', name: 'בעיות מדידה בחשבונאות ב', credits: 4, level: 'ר', semester: 'סמסטר ב' },
        { id: '19', courseNumber: '10870', name: 'מיסים א: הכנסות, הוצאות, ומבוא לרווחי הון', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '20', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '21', courseNumber: '10877', name: 'דיני תאגידים ועסקים', credits: 6, level: 'מ', semester: 'סמסטר ג' },
        { id: '22', courseNumber: '10596', name: 'מערכות מידע תחרותיות-אסטרטגיות', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '3',
    name: 'שנה ג',
    semesters: {
      'סמסטר א': [
        { id: '23', courseNumber: '10871', name: 'מיסים ב: מיסוי תאגידים ורווחי הון', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '24', courseNumber: '10878', name: 'ניתוח נתוני עתק ואבטחת סייבר', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '25', courseNumber: '10861', name: 'חשבונאות ניהולית מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '26', courseNumber: '10866', name: 'דוחות מאוחדים', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '27', courseNumber: '10872', name: 'מיסים ג: מיסוי בינלאומי, מיסוי יחיד, וסוגיות מתקדמות', credits: 4, level: 'מ', semester: 'סמסטר ב' },
        { id: '28', courseNumber: '10867', name: 'חשבונאות פיננסית מתקדמת א', credits: 4, level: 'מ', semester: 'סמסטר ב' },
        { id: '29', courseNumber: '10862', name: 'ניתוח דוחות פיננסיים והערכת שווי חברות', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '30', courseNumber: '10875', name: 'ביקורת חשבונות', credits: 6, level: 'מ', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '31', courseNumber: '', name: 'סמינריון בחשבונאות פיננסית', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '4',
    name: 'שנה ד',
    semesters: {
      'סמסטר א': [
        { id: '32', courseNumber: '10873', name: 'מיסים ד: מס ערך מוסף ומיסוי מקרקעין', credits: 4, level: 'מ', semester: 'סמסטר א' },
        { id: '33', courseNumber: '10868', name: 'חשבונאות פיננסית מתקדמת ב', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '34', courseNumber: '10876', name: 'ביקורת חשבונות מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
    },
  },
]

// Create mock data for 3.5-second
export const syllabusData35Second: Year[] = [
  {
    id: '1',
    name: 'שנה א',
    semesters: {
      'סמסטר ב': [
        { id: '1', courseNumber: '91440', name: 'קורס הכנה לבחינת פטור בהנהלת חשבונות', credits: 0, level: 'בחינת פטור', semester: 'סמסטר ב' },
        { id: '2', courseNumber: '30111', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה א', credits: 3, level: 'פ', semester: 'סמסטר ב' },
        { id: '3', courseNumber: '10131', name: 'מבוא למיקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר ב' },
        { id: '4', courseNumber: '', name: 'בחינת מיון באנגלית', credits: 0, level: '', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '5', courseNumber: '10126', name: 'מבוא למקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר ג' },
        { id: '6', courseNumber: '10836', name: 'מבוא למשפט ולדיני עסקים', credits: 6, level: 'ר', semester: 'סמסטר ג' },
        { id: '7', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר ג' },
      ],
      'סמסטר א': [
        { id: '8', courseNumber: '10863', name: 'יסודות החשבונאות הפיננסית', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '9', courseNumber: '30112', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה ב', credits: 3, level: 'ר', semester: 'סמסטר א' },
        { id: '10', courseNumber: '10142', name: 'חשבון דיפרנציאלי לתלמידי כלכלה וניהול', credits: 3, level: 'פ', semester: 'סמסטר א' },
        { id: '11', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר א' },
      ],
    },
  },
  {
    id: '2',
    name: 'שנה ב',
    semesters: {
      'סמסטר ב': [
        { id: '12', courseNumber: '10645', name: 'תכנון, ניתוח ועיצוב מערכות מידע', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '13', courseNumber: '10230', name: 'תורת המימון: ניהול פיננסי של גופים עסקיים', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '14', courseNumber: '10864', name: 'בעיות מדידה בחשבונאות א', credits: 4, level: 'ר', semester: 'סמסטר ב' },
        { id: '15', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '16', courseNumber: '10860', name: 'חשבונאות ניהולית', credits: 6, level: 'ר', semester: 'סמסטר ג' },
        { id: '17', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר ג' },
      ],
      'סמסטר א': [
        { id: '18', courseNumber: '10284', name: 'מושגי יסוד באקונומטריקה', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '19', courseNumber: '10874', name: 'יסודות ביקורת חשבונות', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '20', courseNumber: '10865', name: 'בעיות מדידה בחשבונאות ב', credits: 4, level: 'ר', semester: 'סמסטר א' },
        { id: '21', courseNumber: '10870', name: 'מיסים א: הכנסות, הוצאות, ומבוא לרווחי הון', credits: 6, level: 'ר', semester: 'סמסטר א' },
      ],
    },
  },
  {
    id: '3',
    name: 'שנה ג',
    semesters: {
      'סמסטר ב': [
        { id: '22', courseNumber: '10871', name: 'מיסים ב: מיסוי תאגידים ורווחי הון', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '23', courseNumber: '10878', name: 'ניתוח נתוני עתק ואבטחת סייבר', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '24', courseNumber: '10861', name: 'חשבונאות ניהולית מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '25', courseNumber: '10866', name: 'דוחות מאוחדים', credits: 6, level: 'מ', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '26', courseNumber: '10877', name: 'דיני תאגידים ועסקים', credits: 6, level: 'מ', semester: 'סמסטר ג' },
        { id: '27', courseNumber: '10596', name: 'מערכות מידע תחרותיות-אסטרטגיות', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
      'סמסטר א': [
        { id: '28', courseNumber: '10872', name: 'מיסים ג: מיסוי בינלאומי, מיסוי יחיד, וסוגיות מתקדמות', credits: 4, level: 'מ', semester: 'סמסטר א' },
        { id: '29', courseNumber: '10867', name: 'חשבונאות פיננסית מתקדמת א', credits: 4, level: 'מ', semester: 'סמסטר א' },
        { id: '30', courseNumber: '10862', name: 'ניתוח דוחות פיננסיים והערכת שווי חברות', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '31', courseNumber: '10875', name: 'ביקורת חשבונות', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
    },
  },
  {
    id: '4',
    name: 'שנה ד',
    semesters: {
      'סמסטר ב': [
        { id: '32', courseNumber: '10873', name: 'מיסים ד: מס ערך מוסף ומיסוי מקרקעין', credits: 4, level: 'מ', semester: 'סמסטר ב' },
        { id: '33', courseNumber: '10868', name: 'חשבונאות פיננסית מתקדמת ב', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '34', courseNumber: '10876', name: 'ביקורת חשבונות מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר ב' },
      ],
    },
  },
];

// Create mock data for 4.5-first
export const syllabusData45First: Year[] = [
  {
    id: '1',
    name: 'שנה א',
    semesters: {
      'סמסטר א': [
        { id: '1', courseNumber: '91440', name: 'קורס הכנה לבחינת פטור בהנהלת חשבונות', credits: 0, level: 'בחינת פטור', semester: 'סמסטר א' },
        { id: '2', courseNumber: '30111', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה א', credits: 3, level: 'פ', semester: 'סמסטר א' },
        { id: '3', courseNumber: '10131', name: 'מבוא למיקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר א' },
        { id: '4', courseNumber: '', name: 'בחינת מיון באנגלית', credits: 0, level: '', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '5', courseNumber: '30112', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה ב', credits: 3, level: 'ר', semester: 'סמסטר ב' },
        { id: '6', courseNumber: '10126', name: 'מבוא למקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר ב' },
        { id: '7', courseNumber: '10863', name: 'יסודות החשבונאות הפיננסית', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '8', courseNumber: '', name: 'אנגלית (על פי הסיווג)', credits: 0, level: '', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '9', courseNumber: '10142', name: 'חשבון דיפרנציאלי לתלמידי כלכלה וניהול', credits: 3, level: 'פ', semester: 'סמסטר ג' },
        { id: '10', courseNumber: '', name: 'אנגלית (על פי הסיווג)', credits: 0, level: '', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '2',
    name: 'שנה ב',
    semesters: {
      'סמסטר א': [
        { id: '11', courseNumber: '10860', name: 'חשבונאות ניהולית', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '12', courseNumber: '10284', name: 'מושגי יסוד באקונומטריקה', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '13', courseNumber: '10864', name: 'בעיות מדידה בחשבונאות א', credits: 4, level: 'ר', semester: 'סמסטר א' },
        { id: '14', courseNumber: '', name: 'אנגלית (על פי הסיווג)', credits: 0, level: '', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '15', courseNumber: '10230', name: 'תורת המימון: ניהול פיננסי של גופים עסקיים', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '16', courseNumber: '10865', name: 'בעיות מדידה בחשבונאות ב', credits: 4, level: 'ר', semester: 'סמסטר ב' },
        { id: '17', courseNumber: '10870', name: 'מיסים א: הכנסות, הוצאות, ומבוא לרווחי הון', credits: 6, level: 'ר', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '18', courseNumber: '10836', name: 'מבוא למשפט ולדיני עסקים', credits: 6, level: 'ר', semester: 'סמסטר ג' },
        { id: '19', courseNumber: '', name: 'אנגלית (על פי הסיווג)', credits: 0, level: '', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '3',
    name: 'שנה ג',
    semesters: {
      'סמסטר א': [
        { id: '20', courseNumber: '10645', name: 'תכנון, ניתוח ועיצוב מערכות מידע', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '21', courseNumber: '10871', name: 'מיסים ב: מיסוי תאגידים ורווחי הון', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '22', courseNumber: '10866', name: 'דוחות מאוחדים', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '23', courseNumber: '10878', name: 'ניתוח נתוני עתק ואבטחת סייבר', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '24', courseNumber: '10872', name: 'מיסים ג: מיסוי בינלאומי, מיסוי יחיד, וסוגיות מתקדמות', credits: 4, level: 'מ', semester: 'סמסטר ב' },
        { id: '25', courseNumber: '10867', name: 'חשבונאות פיננסית מתקדמת א', credits: 4, level: 'מ', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '26', courseNumber: '10596', name: 'מערכות מידע תחרותיות-אסטרטגיות', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '4',
    name: 'שנה ד',
    semesters: {
      'סמסטר א': [
        { id: '27', courseNumber: '10874', name: 'יסודות ביקורת חשבונות', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '28', courseNumber: '10862', name: 'ניתוח דוחות פיננסיים והערכת שווי חברות', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '29', courseNumber: '10877', name: 'דיני תאגידים ועסקים', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
      'סמסטר ב': [
        { id: '30', courseNumber: '10873', name: 'מיסים ד: מס ערך מוסף ומיסוי מקרקעין', credits: 4, level: 'מ', semester: 'סמסטר ב' },
        { id: '31', courseNumber: '10875', name: 'ביקורת חשבונות', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '32', courseNumber: '10861', name: 'חשבונאות ניהולית מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '33', courseNumber: '', name: 'סמינריון בחשבונאות פיננסית', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
    },
  },
  {
    id: '5',
    name: 'שנה ה',
    semesters: {
      'סמסטר א': [
        { id: '34', courseNumber: '10868', name: 'חשבונאות פיננסית מתקדמת ב', credits: 6, level: 'מ', semester: 'סמסטר א' },
        { id: '35', courseNumber: '10876', name: 'ביקורת חשבונות מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
    },
  },
];

// Create mock data for 4.5-second
export const syllabusData45Second: Year[] = [
  {
    id: '1',
    name: 'שנה א',
    semesters: {
      'סמסטר ב': [
        { id: '1', courseNumber: '91440', name: 'קורס הכנה לבחינת פטור בהנהלת חשבונות', credits: 0, level: 'בחינת פטור', semester: 'סמסטר ב' },
        { id: '2', courseNumber: '30111', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה א', credits: 3, level: 'פ', semester: 'סמסטר ב' },
        { id: '3', courseNumber: '10131', name: 'מבוא למיקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר ב' },
        { id: '4', courseNumber: '', name: 'בחינת מיון באנגלית', credits: 0, level: '', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '5', courseNumber: '10126', name: 'מבוא למקרוכלכלה', credits: 4, level: 'פ', semester: 'סמסטר ג' },
        { id: '6', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר ג' },
      ],
      'סמסטר א': [
        { id: '7', courseNumber: '10860', name: 'חשבונאות ניהולית', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '8', courseNumber: '30112', name: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה ב', credits: 3, level: 'ר', semester: 'סמסטר א' },
        { id: '9', courseNumber: '10863', name: 'יסודות החשבונאות הפיננסית', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '10', courseNumber: '', name: 'אנגלית (על פי רמת הסיווג)', credits: 0, level: '', semester: 'סמסטר א' },
      ],
    },
  },
  {
    id: '2',
    name: 'שנה ב',
    semesters: {
      'סמסטר ב': [
        { id: '11', courseNumber: '10142', name: 'חשבון דיפרנציאלי לתלמידי כלכלה וניהול', credits: 3, level: 'פ', semester: 'סמסטר ב' },
        { id: '12', courseNumber: '10864', name: 'בעיות מדידה בחשבונאות א', credits: 4, level: 'ר', semester: 'סמסטר ב' },
        { id: '13', courseNumber: '10230', name: 'תורת המימון: ניהול פיננסי של גופים עסקיים', credits: 6, level: 'ר', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '14', courseNumber: '10836', name: 'מבוא למשפט ולדיני עסקים', credits: 6, level: 'ר', semester: 'סמסטר ג' },
        { id: '15', courseNumber: '', name: 'אנגלית (על פי הסיווג)', credits: 0, level: '', semester: 'סמסטר ג' },
      ],
      'סמסטר א': [
        { id: '16', courseNumber: '10284', name: 'מושגי יסוד באקונומטריקה', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '17', courseNumber: '10865', name: 'בעיות מדידה בחשבונאות ב', credits: 4, level: 'ר', semester: 'סמסטר א' },
        { id: '18', courseNumber: '10870', name: 'דיני מיסים א', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '19', courseNumber: '', name: 'אנגלית (על פי הסיווג)', credits: 0, level: '', semester: 'סמסטר א' },
      ],
    },
  },
  {
    id: '3',
    name: 'שנה ג',
    semesters: {
      'סמסטר ב': [
        { id: '20', courseNumber: '10645', name: 'תכנון, ניתוח ועיצוב מערכות מידע', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '21', courseNumber: '10871', name: 'דיני מיסים ב', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '22', courseNumber: '10866', name: 'דוחות מאוחדים', credits: 6, level: 'מ', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '23', courseNumber: '10596', name: 'מערכות מידע תחרותיות-אסטרטגיות', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
      'סמסטר א': [
        { id: '24', courseNumber: '10878', name: 'ניתוח נתוני עתק ואבטחת סייבר', credits: 6, level: 'ר', semester: 'סמסטר א' },
        { id: '25', courseNumber: '10872', name: 'דיני מיסים ג', credits: 4, level: 'מ', semester: 'סמסטר א' },
        { id: '26', courseNumber: '10867', name: 'חשבונאות פיננסית מתקדמת א', credits: 4, level: 'מ', semester: 'סמסטר א' },
      ],
    },
  },
  {
    id: '4',
    name: 'שנה ד',
    semesters: {
      'סמסטר ב': [
        { id: '27', courseNumber: '10874', name: 'יסודות ביקורת חשבונות', credits: 6, level: 'ר', semester: 'סמסטר ב' },
        { id: '28', courseNumber: '10862', name: 'ניתוח דוחות פיננסיים והערכת שווי חברות', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '29', courseNumber: '10861', name: 'חשבונאות ניהולית מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר ב' },
      ],
      'סמסטר ג': [
        { id: '30', courseNumber: '10877', name: 'דיני תאגידים ועסקים', credits: 6, level: 'מ', semester: 'סמסטר ג' },
        { id: '31', courseNumber: '', name: 'סמינריון בחשבונאות פיננסית', credits: 6, level: 'מ', semester: 'סמסטר ג' },
      ],
      'סמסטר א': [
        { id: '32', courseNumber: '10873', name: 'סוגיות מתקדמות במיסים', credits: 4, level: 'מ', semester: 'סמסטר א' },
        { id: '33', courseNumber: '10875', name: 'ביקורת חשבונות', credits: 6, level: 'מ', semester: 'סמסטר א' },
      ],
    },
  },
  {
    id: '5',
    name: 'שנה ה',
    semesters: {
      'סמסטר ב': [
        { id: '34', courseNumber: '10868', name: 'חשבונאות פיננסית מתקדמת ב', credits: 6, level: 'מ', semester: 'סמסטר ב' },
        { id: '35', courseNumber: '10876', name: 'ביקורת חשבונות מתקדמת', credits: 6, level: 'מ', semester: 'סמסטר ב' },
      ],
    },
  },
];

// Create the mapping object
export const syllabusPlans = {
  '3.5-first': syllabusData35First,
  '3.5-second': syllabusData35Second,
  '4.5-first': syllabusData45First,
  '4.5-second': syllabusData45Second,
};

// Export for calculator to use
export const syllabusData = syllabusData35First;
