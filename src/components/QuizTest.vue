<template>
  <div class="quiz-test">
    <h2>Quiz Modal Test</h2>
    <div class="test-buttons">
      <button @click="showMathQuiz" class="test-btn math-btn">Test Math Quiz</button>
      <button @click="showGeographyQuiz" class="test-btn geo-btn">Test Geography Quiz</button>
      <button @click="showScienceQuiz" class="test-btn sci-btn">Test Science Quiz</button>
    </div>
    
    <QuizModal
      :show-quiz="showQuiz"
      :subject="currentSubject"
      :game-score="1500"
      @quiz-completed="handleQuizCompleted"
      @continue-game="handleContinueGame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuizModal from './QuizModal.vue';
import type { Subject } from '@/types/educational';

const showQuiz = ref(false);
const currentSubject = ref<Subject>('math');

const showMathQuiz = () => {
  currentSubject.value = 'math';
  showQuiz.value = true;
};

const showGeographyQuiz = () => {
  currentSubject.value = 'geography';
  showQuiz.value = true;
};

const showScienceQuiz = () => {
  currentSubject.value = 'science';
  showQuiz.value = true;
};

const handleQuizCompleted = (result: any) => {
  console.log('Quiz completed:', result);
};

const handleContinueGame = () => {
  console.log('Continue game');
  showQuiz.value = false;
};
</script>

<style scoped>
.quiz-test {
  padding: 20px;
  text-align: center;
}

.test-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.test-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.test-btn:hover {
  transform: translateY(-2px);
}

.math-btn {
  background: linear-gradient(145deg, #3498db, #2980b9);
}

.geo-btn {
  background: linear-gradient(145deg, #27ae60, #229954);
}

.sci-btn {
  background: linear-gradient(145deg, #9b59b6, #8e44ad);
}
</style>