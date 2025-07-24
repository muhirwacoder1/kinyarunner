// Educational game type definitions

export type Subject = 'math' | 'geography' | 'science';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  question: string;
  questionRw: string; // Kinyarwanda translation
  options: string[];
  optionsRw: string[]; // Kinyarwanda options
  correctAnswer: number; // Index of correct answer (0-3)
  explanation: string;
  explanationRw: string;
  points: number; // Bonus points for correct answer
}

export interface QuizSession {
  subject: Subject;
  questions: Question[];
  currentQuestionIndex: number;
  startTime: number;
  responses: QuizResponse[];
}

export interface QuizResponse {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  responseTime: number; // milliseconds
  pointsEarned: number;
}

export interface EducationalStats {
  totalQuestions: number;
  correctAnswers: number;
  totalEducationalPoints: number;
  averageResponseTime: number;
  currentStreak: number;
  bestStreak: number;
  subjectBreakdown: {
    [key in Subject]: {
      correct: number;
      total: number;
      averageTime: number;
      bestStreak: number;
    };
  };
  sessionHistory: QuizSession[];
}

export interface EducationalIcon {
  id: string;
  subject: Subject;
  position: {
    x: number;
    y: number;
    z: number;
  };
  collected: boolean;
  value: number; // Base points before quiz
}

export interface SubjectTheme {
  name: string;
  nameRw: string;
  color: string;
  gradient: string[];
  icon: string;
  emoji: string;
}

export const SUBJECT_THEMES: Record<Subject, SubjectTheme> = {
  math: {
    name: 'Mathematics',
    nameRw: 'Imibare',
    color: '#3498db',
    gradient: ['#3498db', '#2980b9'],
    icon: '🧮',
    emoji: '📊'
  },
  geography: {
    name: 'Geography',
    nameRw: 'Geografiya',
    color: '#27ae60',
    gradient: ['#27ae60', '#229954'],
    icon: '🌍',
    emoji: '🗺️'
  },
  science: {
    name: 'Science',
    nameRw: 'Siyanse',
    color: '#9b59b6',
    gradient: ['#9b59b6', '#8e44ad'],
    icon: '🔬',
    emoji: '⚗️'
  }
};

export const DIFFICULTY_CONFIG = {
  easy: {
    timeLimit: 30000, // 30 seconds
    points: 50,
    name: 'Easy',
    nameRw: 'Byoroshye'
  },
  medium: {
    timeLimit: 25000, // 25 seconds
    points: 75,
    name: 'Medium',
    nameRw: 'Hagati'
  },
  hard: {
    timeLimit: 20000, // 20 seconds
    points: 100,
    name: 'Hard',
    nameRw: 'Bigoye'
  }
};

export const QUIZ_CONFIG = {
  questionsPerSession: 1, // Start with 1 question per icon
  timeBonus: 10, // Extra points for quick answers
  participationPoints: 10, // Points for wrong answers
  streakMultiplier: 1.2, // Bonus multiplier for streaks
  iconSpawnRate: 0.3, // 30% of coins become educational icons
};