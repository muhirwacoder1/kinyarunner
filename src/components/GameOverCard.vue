<template>
  <div v-if="showGameOver" class="game-over-overlay">
    <div class="game-over-card">
      <!-- Game Over Title -->
      <div class="game-over-header">
        <h1 class="game-over-title">GAME OVER</h1>
        <h2 class="game-over-subtitle">Umukino Warangiye</h2>
      </div>

      <!-- Stats Section -->
      <div class="stats-section">
        <!-- Final Score -->
        <div class="stat-item score-stat">
          <div class="stat-icon">
            <img 
              src="/assets/png/high-score.png" 
              alt="Score" 
              class="stat-image"
              @error="handleScoreIconError"
            />
            <div v-if="!scoreIconLoaded" class="stat-icon-fallback">🏆</div>
          </div>
          <div class="stat-content">
            <div class="stat-label">Final Score</div>
            <div class="stat-label-kinyarwanda">Amanota Yanyuma</div>
            <div class="stat-value">{{ formatNumber(finalScore) }}</div>
          </div>
        </div>

        <!-- Coins Collected -->
        <div class="stat-item coins-stat">
          <div class="stat-icon">
            <img 
              src="/assets/png/coin.png" 
              alt="Coins" 
              class="stat-image"
              @error="handleCoinIconError"
            />
            <div v-if="!coinIconLoaded" class="stat-icon-fallback">🪙</div>
          </div>
          <div class="stat-content">
            <div class="stat-label">Coins Collected</div>
            <div class="stat-label-kinyarwanda">Amafaranga Yakusanyije</div>
            <div class="stat-value">{{ formatNumber(totalCoins) }}</div>
          </div>
        </div>

        <!-- High Score (if applicable) -->
        <div v-if="isNewHighScore" class="new-high-score">
          <div class="high-score-badge">
            <span class="high-score-text">NEW HIGH SCORE!</span>
            <span class="high-score-text-kinyarwanda">Amanota Mashya Menshi!</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="replay-button" @click="handleReplay">
          <div class="button-content">
            <span class="button-icon">🔄</span>
            <div class="button-text">
              <span class="button-main">PLAY AGAIN</span>
              <span class="button-sub">Gukina Ukundi</span>
            </div>
          </div>
        </button>

        <button class="home-button" @click="handleHome">
          <div class="button-content">
            <span class="button-icon">🏠</span>
            <div class="button-text">
              <span class="button-main">HOME</span>
              <span class="button-sub">Ahabanza</span>
            </div>
          </div>
        </button>
      </div>

      <!-- Share Section (Optional) -->
      <div class="share-section">
        <p class="share-text">Share your score!</p>
        <p class="share-text-kinyarwanda">Sangira amanota yawe!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  showGameOver: { type: Boolean, default: false },
  finalScore: { type: Number, default: 0 },
  totalCoins: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 }
});

const emit = defineEmits(['replay', 'home']);

const scoreIconLoaded = ref(true);
const coinIconLoaded = ref(true);

const isNewHighScore = computed(() => {
  return props.finalScore > props.highScore;
});

const handleScoreIconError = () => {
  scoreIconLoaded.value = false;
};

const handleCoinIconError = () => {
  coinIconLoaded.value = false;
};

const handleReplay = () => {
  emit('replay');
};

const handleHome = () => {
  emit('home');
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Save high score to localStorage
onMounted(() => {
  if (isNewHighScore.value) {
    localStorage.setItem('kinyarunner-highscore', props.finalScore.toString());
  }
});
</script>

<style scoped>
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease-out;
}

.game-over-card {
  background: linear-gradient(145deg, #2c3e50, #34495e);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.5s ease-out;
}

.game-over-header {
  margin-bottom: 30px;
}

.game-over-title {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: #e74c3c;
  margin: 0 0 10px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

.game-over-subtitle {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.stats-section {
  margin: 30px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin: 15px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-image {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.stat-icon-fallback {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.stat-content {
  flex: 1;
  text-align: left;
}

.stat-label {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.stat-label-kinyarwanda {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: #3498db;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.score-stat .stat-value {
  color: #f39c12;
}

.coins-stat .stat-value {
  color: #e67e22;
}

.new-high-score {
  margin: 20px 0;
  animation: pulse 1s ease-in-out infinite;
}

.high-score-badge {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  padding: 15px 25px;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(243, 156, 18, 0.4);
}

.high-score-text {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  display: block;
}

.high-score-text-kinyarwanda {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-top: 5px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin: 30px 0;
}

.replay-button,
.home-button {
  flex: 1;
  background: linear-gradient(145deg, #27ae60, #2ecc71);
  border: none;
  border-radius: 15px;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.3);
}

.home-button {
  background: linear-gradient(145deg, #3498db, #5dade2);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.replay-button:hover,
.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(46, 204, 113, 0.4);
}

.home-button:hover {
  box-shadow: 0 6px 12px rgba(52, 152, 219, 0.4);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.button-icon {
  font-size: 1.5rem;
}

.button-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-main {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.button-sub {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

.share-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.share-text {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 5px 0;
}

.share-text-kinyarwanda {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 5px 0;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .game-over-card {
    padding: 30px 20px;
    margin: 20px;
  }
  
  .game-over-title {
    font-size: 2rem;
  }
  
  .game-over-subtitle {
    font-size: 1rem;
  }
  
  .stat-item {
    padding: 15px;
  }
  
  .stat-image {
    width: 32px;
    height: 32px;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>