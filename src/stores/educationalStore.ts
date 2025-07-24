import { defineStore } from 'pinia';
import type { 
  Question, 
  QuizSession, 
  QuizResponse, 
  EducationalStats, 
  Subject,
  Difficulty 
} from '@/types/educational';

// Import question databases
import mathQuestions from '@/data/questions/math.json';
import geographyQuestions from '@/data/questions/geography.json';
import scienceQuestions from '@/data/questions/science.json';

export const useEducationalStore = defineStore('educational', {
  state: () => ({
    // Question databases
    questions: {
      math: mathQuestions as Question[],
      geography: geographyQuestions as Question[],
      science: scienceQuestions as Question[]
    },
    
    // Current quiz session
    currentQuiz: null as QuizSession | null,
    isQuizActive: false,
    
    // Educational statistics
    stats: {
      totalQuestions: 0,
      correctAnswers: 0,
      totalEducationalPoints: 0,
      averageResponseTime: 0,
      currentStreak: 0,
      bestStreak: 0,
      subjectBreakdown: {
        math: { correct: 0, total: 0, averageTime: 0, bestStreak: 0 },
        geography: { correct: 0, total: 0, averageTime: 0, bestStreak: 0 },
        science: { correct: 0, total: 0, averageTime: 0, bestStreak: 0 }
      },
      sessionHistory: []
    } as EducationalStats,
    
    // Game integration
    gameScore: 0,
    educationalBonus: 0
  }),

  getters: {
    // Get questions by subject and difficulty
    getQuestionsBySubject: (state) => (subject: Subject, difficulty?: Difficulty) => {
      const subjectQuestions = state.questions[subject];
      if (difficulty) {
        return subjectQuestions.filter(q => q.difficulty === difficulty);
      }
      return subjectQuestions;
    },

    // Get random question for subject
    getRandomQuestion: (state) => (subject: Subject, difficulty?: Difficulty) => {
      const questions = state.questions[subject];
      let filteredQuestions = questions;
      
      if (difficulty) {
        filteredQuestions = questions.filter(q => q.difficulty === difficulty);
      }
      
      if (filteredQuestions.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      return filteredQuestions[randomIndex];
    },

    // Calculate accuracy percentage
    getAccuracy: (state) => (subject?: Subject) => {
      if (subject) {
        const subjectStats = state.stats.subjectBreakdown[subject];
        return subjectStats.total > 0 ? (subjectStats.correct / subjectStats.total) * 100 : 0;
      }
      return state.stats.totalQuestions > 0 ? (state.stats.correctAnswers / state.stats.totalQuestions) * 100 : 0;
    },

    // Get difficulty based on current score
    getCurrentDifficulty: (state) => (): Difficulty => {
      if (state.gameScore < 1000) return 'easy';
      if (state.gameScore < 3000) return Math.random() < 0.7 ? 'easy' : 'medium';
      const rand = Math.random();
      if (rand < 0.4) return 'easy';
      if (rand < 0.8) return 'medium';
      return 'hard';
    },

    // Check if player has educational achievements
    hasAchievements: (state) => {
      return {
        mathMaster: state.stats.subjectBreakdown.math.correct >= 10,
        geographyExplorer: state.stats.subjectBreakdown.geography.correct >= 10,
        scienceWiz: state.stats.subjectBreakdown.science.correct >= 10,
        streakChampion: state.stats.bestStreak >= 5,
        speedLearner: state.stats.averageResponseTime < 10000, // Under 10 seconds
        allRounder: Object.values(state.stats.subjectBreakdown).every(s => s.correct >= 5)
      };
    }
  },

  actions: {
    // Start a new quiz session
    startQuiz(subject: Subject) {
      const difficulty = this.getCurrentDifficulty();
      const question = this.getRandomQuestion(subject, difficulty);
      
      if (!question) {
        console.error(`No questions available for ${subject} - ${difficulty}`);
        return false;
      }

      this.currentQuiz = {
        subject,
        questions: [question],
        currentQuestionIndex: 0,
        startTime: Date.now(),
        responses: []
      };
      
      this.isQuizActive = true;
      return true;
    },

    // Submit answer for current question
    submitAnswer(selectedAnswer: number): QuizResponse {
      if (!this.currentQuiz || !this.isQuizActive) {
        throw new Error('No active quiz session');
      }

      const currentQuestion = this.currentQuiz.questions[this.currentQuiz.currentQuestionIndex];
      const responseTime = Date.now() - this.currentQuiz.startTime;
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      
      // Calculate points
      let pointsEarned = isCorrect ? currentQuestion.points : 10; // Participation points
      
      // Time bonus for quick correct answers
      if (isCorrect && responseTime < 15000) { // Under 15 seconds
        pointsEarned += 10;
      }
      
      // Streak bonus
      if (isCorrect && this.stats.currentStreak > 0) {
        pointsEarned = Math.floor(pointsEarned * (1 + this.stats.currentStreak * 0.1));
      }

      const response: QuizResponse = {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
        responseTime,
        pointsEarned
      };

      // Update quiz session
      this.currentQuiz.responses.push(response);
      
      // Update statistics
      this.updateStats(response, currentQuestion.subject);
      
      // Add to educational bonus
      this.educationalBonus += pointsEarned;
      
      return response;
    },

    // Update educational statistics
    updateStats(response: QuizResponse, subject: Subject) {
      // Update overall stats
      this.stats.totalQuestions++;
      this.stats.totalEducationalPoints += response.pointsEarned;
      
      if (response.isCorrect) {
        this.stats.correctAnswers++;
        this.stats.currentStreak++;
        if (this.stats.currentStreak > this.stats.bestStreak) {
          this.stats.bestStreak = this.stats.currentStreak;
        }
      } else {
        this.stats.currentStreak = 0;
      }
      
      // Update average response time
      const totalTime = this.stats.averageResponseTime * (this.stats.totalQuestions - 1) + response.responseTime;
      this.stats.averageResponseTime = totalTime / this.stats.totalQuestions;
      
      // Update subject-specific stats
      const subjectStats = this.stats.subjectBreakdown[subject];
      subjectStats.total++;
      
      if (response.isCorrect) {
        subjectStats.correct++;
        if (this.stats.currentStreak > subjectStats.bestStreak) {
          subjectStats.bestStreak = this.stats.currentStreak;
        }
      }
      
      // Update subject average time
      const subjectTotalTime = subjectStats.averageTime * (subjectStats.total - 1) + response.responseTime;
      subjectStats.averageTime = subjectTotalTime / subjectStats.total;
    },

    // End current quiz session
    endQuiz() {
      if (this.currentQuiz) {
        this.stats.sessionHistory.push({ ...this.currentQuiz });
      }
      
      this.currentQuiz = null;
      this.isQuizActive = false;
    },

    // Reset educational stats (for new game)
    resetSessionStats() {
      this.educationalBonus = 0;
      this.stats.currentStreak = 0;
      // Keep historical stats but reset session-specific ones
    },

    // Reset all educational data
    resetAllStats() {
      this.stats = {
        totalQuestions: 0,
        correctAnswers: 0,
        totalEducationalPoints: 0,
        averageResponseTime: 0,
        currentStreak: 0,
        bestStreak: 0,
        subjectBreakdown: {
          math: { correct: 0, total: 0, averageTime: 0, bestStreak: 0 },
          geography: { correct: 0, total: 0, averageTime: 0, bestStreak: 0 },
          science: { correct: 0, total: 0, averageTime: 0, bestStreak: 0 }
        },
        sessionHistory: []
      };
      this.educationalBonus = 0;
    },

    // Save stats to localStorage
    saveStats() {
      localStorage.setItem('kinyarunner-educational-stats', JSON.stringify(this.stats));
    },

    // Load stats from localStorage
    loadStats() {
      const saved = localStorage.getItem('kinyarunner-educational-stats');
      if (saved) {
        try {
          this.stats = JSON.parse(saved);
        } catch (error) {
          console.error('Error loading educational stats:', error);
        }
      }
    },

    // Update game score (called from main game)
    updateGameScore(score: number) {
      this.gameScore = score;
    }
  }
});