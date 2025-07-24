<template>
  <div v-if="showQuiz" class="quiz-overlay">
    <div class="quiz-modal" :class="`quiz-${currentSubject}`">
      
      <!-- Quiz Header -->
      <div class="quiz-header">
        <div class="subject-icon">
          {{ subjectTheme.icon }}
        </div>
        <div class="subject-info">
          <h2 class="subject-title">{{ subjectTheme.name }}</h2>
          <p class="subject-title-rw">{{ subjectTheme.nameRw }}</p>
        </div>
        <div class="quiz-timer">
          <div class="timer-circle" :style="{ '--progress': timerProgress }">
            <span class="timer-text">{{ timeLeft }}</span>
          </div>
        </div>
      </div>

      <!-- Question Section -->
      <div class="question-section">
        <div class="question-number">
          Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
        </div>
        
        <div class="question-content">
          <h3 class="question-text">{{ currentQuestion?.question }}</h3>
          <p class="question-text-rw">{{ currentQuestion?.questionRw }}</p>
        </div>

        <div class="difficulty-badge" :class="`difficulty-${currentQuestion?.difficulty}`">
          {{ getDifficultyName(currentQuestion?.difficulty) }}
        </div>
      </div>

      <!-- Answer Options -->
      <div class="answers-section">
        <button
          v-for="(option, index) in currentQuestion?.options"
          :key="index"
          class="answer-option"
          :class="{
            'selected': selectedAnswer === index,
            'correct': showResult && index === currentQuestion?.correctAnswer,
            'incorrect': showResult && selectedAnswer === index && index !== currentQuestion?.correctAnswer,
            'disabled': showResult || timeLeft === 0
          }"
          @click="selectAnswer(index)"
          :disabled="showResult || timeLeft === 0"
        >
          <div class="option-letter">{{ String.fromCharCode(65 + index) }}</div>
          <div class="option-content">
            <div class="option-text">{{ option }}</div>
            <div class="option-text-rw">{{ currentQuestion?.optionsRw[index] }}</div>
          </div>
          <div class="option-indicator">
            <span v-if="showResult && index === currentQuestion?.correctAnswer" class="correct-icon">✓</span>
            <span v-else-if="showResult && selectedAnswer === index && index !== currentQuestion?.correctAnswer" class="incorrect-icon">✗</span>
          </div>
        </button>
      </div>

      <!-- Result Feedback -->
      <div v-if="showResult" class="result-section">
        <div class="result-header" :class="{ 'correct': isCorrect, 'incorrect': !isCorrect }">
          <div class="result-icon">
            {{ isCorrect ? '🎉' : '💡' }}
          </div>
          <div class="result-text">
            <h4>{{ isCorrect ? 'Correct!' : 'Not quite right' }}</h4>
            <p>{{ isCorrect ? 'Byagenze neza!' : 'Ntabwo ari byo' }}</p>
          </div>
          <div class="points-earned">
            +{{ pointsEarned }} pts
          </div>
        </div>

        <div class="explanation">
          <h5>Explanation / Ibisobanuro:</h5>
          <p class="explanation-text">{{ currentQuestion?.explanation }}</p>
          <p class="explanation-text-rw">{{ currentQuestion?.explanationRw }}</p>
        </div>

        <!-- Continue Button -->
        <button class="continue-button" @click="continueGame">
          <span class="continue-icon">🚀</span>
          <div class="continue-text">
            <span class="continue-main">Continue Playing</span>
            <span class="continue-sub">Komeza Gukina</span>
          </div>
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="progress-text">
          <span>Educational Bonus: {{ educationalBonus }} pts</span>
          <span class="streak" v-if="currentStreak > 0">🔥 {{ currentStreak }} streak</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useEducationalStore } from '@/stores/educationalStore';
import { SUBJECT_THEMES, DIFFICULTY_CONFIG } from '@/types/educational';
import type { Subject, Question } from '@/types/educational';

const props = defineProps({
  showQuiz: { type: Boolean, default: false },
  subject: { type: String as () => Subject, required: true },
  gameScore: { type: Number, default: 0 }
});

const emit = defineEmits(['quiz-completed', 'continue-game']);

const educationalStore = useEducationalStore();

// Quiz state
const currentQuestion = ref<Question | null>(null);
const currentQuestionIndex = ref(0);
const totalQuestions = ref(1);
const selectedAnswer = ref<number | null>(null);
const showResult = ref(false);
const isCorrect = ref(false);
const pointsEarned = ref(0);
const timeLeft = ref(30);
const timerInterval = ref<number | null>(null);

// Computed properties
const currentSubject = computed(() => props.subject);
const subjectTheme = computed(() => SUBJECT_THEMES[props.subject]);

const timerProgress = computed(() => {
  const maxTime = currentQuestion.value ? DIFFICULTY_CONFIG[currentQuestion.value.difficulty].timeLimit / 1000 : 30;
  return ((maxTime - timeLeft.value) / maxTime) * 100;
});

const progressPercentage = computed(() => {
  return ((currentQuestionIndex.value + (showResult.value ? 1 : 0)) / totalQuestions.value) * 100;
});

const educationalBonus = computed(() => educationalStore.educationalBonus);
const currentStreak = computed(() => educationalStore.stats.currentStreak);

// Methods
const initializeQuiz = () => {
  // Update game score in store
  educationalStore.updateGameScore(props.gameScore);
  
  // Start quiz session
  const success = educationalStore.startQuiz(props.subject);
  if (!success) {
    console.error('Failed to start quiz');
    emit('continue-game');
    return;
  }

  // Load current question
  loadCurrentQuestion();
  startTimer();
};

const loadCurrentQuestion = () => {
  if (educationalStore.currentQuiz) {
    currentQuestion.value = educationalStore.currentQuiz.questions[currentQuestionIndex.value];
    const difficulty = currentQuestion.value?.difficulty || 'easy';
    timeLeft.value = DIFFICULTY_CONFIG[difficulty].timeLimit / 1000;
    selectedAnswer.value = null;
    showResult.value = false;
  }
};

const startTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }

  timerInterval.value = setInterval(() => {
    if (timeLeft.value > 0 && !showResult.value) {
      timeLeft.value--;
    } else if (timeLeft.value === 0 && !showResult.value) {
      // Time's up - auto-submit with no answer
      selectAnswer(-1);
    }
  }, 1000);
};

const selectAnswer = (answerIndex: number) => {
  if (showResult.value || selectedAnswer.value !== null) return;

  selectedAnswer.value = answerIndex;
  
  // Submit answer to store
  try {
    const response = educationalStore.submitAnswer(answerIndex);
    isCorrect.value = response.isCorrect;
    pointsEarned.value = response.pointsEarned;
    showResult.value = true;
    
    // Stop timer
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    emit('continue-game');
  }
};

const continueGame = () => {
  // End quiz session
  educationalStore.endQuiz();
  
  // Emit completion event with results
  emit('quiz-completed', {
    subject: props.subject,
    isCorrect: isCorrect.value,
    pointsEarned: pointsEarned.value,
    totalBonus: educationalStore.educationalBonus
  });
  
  // Continue game
  emit('continue-game');
};

const getDifficultyName = (difficulty?: string) => {
  if (!difficulty) return '';
  return DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG]?.name || difficulty;
};

// Watchers
watch(() => props.showQuiz, (newValue) => {
  if (newValue) {
    initializeQuiz();
  } else {
    // Clean up timer when quiz is hidden
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
    }
  }
});

// Lifecycle
onMounted(() => {
  if (props.showQuiz) {
    initializeQuiz();
  }
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<style scoped>
.quiz-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
  padding: 20px;
}

.quiz-modal {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.4s ease-out;
}

/* Subject-specific themes */
.quiz-math {
  border-color: rgba(52, 152, 219, 0.5);
  background: linear-gradient(145deg, rgba(52, 152, 219, 0.15), rgba(41, 128, 185, 0.1));
}

.quiz-geography {
  border-color: rgba(39, 174, 96, 0.5);
  background: linear-gradient(145deg, rgba(39, 174, 96, 0.15), rgba(34, 153, 84, 0.1));
}

.quiz-science {
  border-color: rgba(155, 89, 182, 0.5);
  background: linear-gradient(145deg, rgba(155, 89, 182, 0.15), rgba(142, 68, 173, 0.1));
}

/* Quiz Header */
.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.subject-icon {
  font-size: 3rem;
  margin-right: 15px;
}

.subject-info {
  flex: 1;
}

.subject-title {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 5px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.subject-title-rw {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Timer */
.quiz-timer {
  position: relative;
}

.timer-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #e74c3c 0%, #e74c3c calc(var(--progress) * 1%), rgba(255, 255, 255, 0.2) calc(var(--progress) * 1%), rgba(255, 255, 255, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.timer-circle::before {
  content: '';
  position: absolute;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
}

.timer-text {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  z-index: 1;
}

/* Question Section */
.question-section {
  margin-bottom: 30px;
}

.question-number {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
}

.question-content {
  margin-bottom: 15px;
}

.question-text {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.question-text-rw {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.4;
}

.difficulty-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty-easy {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.difficulty-medium {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border: 1px solid rgba(243, 156, 18, 0.3);
}

.difficulty-hard {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

/* Answer Options */
.answers-section {
  margin-bottom: 30px;
}

.answer-option {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.answer-option:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.answer-option.selected {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.answer-option.correct {
  border-color: #2ecc71;
  background: rgba(46, 204, 113, 0.2);
}

.answer-option.incorrect {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.2);
}

.answer-option.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.option-letter {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #ffffff;
  margin-right: 15px;
  flex-shrink: 0;
}

.option-content {
  flex: 1;
}

.option-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 4px;
}

.option-text-rw {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.option-indicator {
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
}

.correct-icon {
  color: #2ecc71;
  font-weight: bold;
}

.incorrect-icon {
  color: #e74c3c;
  font-weight: bold;
}

/* Result Section */
.result-section {
  margin-bottom: 20px;
}

.result-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.result-header.correct {
  background: rgba(46, 204, 113, 0.2);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.result-header.incorrect {
  background: rgba(231, 76, 60, 0.2);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.result-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.result-text {
  flex: 1;
}

.result-text h4 {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 5px 0;
}

.result-text p {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.points-earned {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #f39c12;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.explanation {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.explanation h5 {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 10px 0;
}

.explanation-text {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1rem;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.explanation-text-rw {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.5;
}

/* Continue Button */
.continue-button {
  width: 100%;
  background: linear-gradient(145deg, #27ae60, #2ecc71);
  border: none;
  border-radius: 15px;
  padding: 18px 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(46, 204, 113, 0.4);
}

.continue-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(46, 204, 113, 0.5);
}

.continue-icon {
  font-size: 1.5rem;
}

.continue-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.continue-main {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.continue-sub {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
}

/* Progress Section */
.progress-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.streak {
  color: #f39c12;
  font-weight: 600;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .quiz-modal {
    padding: 20px;
    margin: 10px;
  }
  
  .quiz-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .subject-icon {
    margin-right: 0;
  }
  
  .question-text {
    font-size: 1.2rem;
  }
  
  .answer-option {
    padding: 12px;
  }
  
  .option-text {
    font-size: 1rem;
  }
  
  .timer-circle {
    width: 50px;
    height: 50px;
  }
  
  .timer-circle::before {
    width: 38px;
    height: 38px;
  }
  
  .timer-text {
    font-size: 1rem;
  }
}
</style>