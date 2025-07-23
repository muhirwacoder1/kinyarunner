<template>
  <div class="game-hud">
    <!-- Pause Button (Top Left) -->
    <div class="pause-container">
      <button 
        class="pause-button" 
        @click="togglePause"
        :class="{ 'paused': isPaused }"
      >
        <img 
          src="/assets/png/pause.png" 
          alt="Pause" 
          class="pause-icon"
          @error="handlePauseIconError"
        />
        <div v-if="!pauseIconLoaded" class="pause-fallback">⏸️</div>
      </button>
    </div>

    <!-- Score Display (Top Center) -->
    <div class="score-container">
      <div class="score-display">
        <img 
          src="/assets/png/high-score.png" 
          alt="Score" 
          class="score-icon"
          @error="handleScoreIconError"
        />
        <div v-if="!scoreIconLoaded" class="score-icon-fallback">🏆</div>
        <div class="score-number">{{ formatNumber(score) }}</div>
      </div>
    </div>

    <!-- Coins Display (Top Right) -->
    <div class="coins-container">
      <div class="coins-display">
        <img 
          src="/assets/png/coin.png" 
          alt="Coins" 
          class="coin-icon"
          @error="handleCoinIconError"
        />
        <div v-if="!coinIconLoaded" class="coin-icon-fallback">🪙</div>
        <div class="coin-number">{{ formatNumber(coin) }}</div>
      </div>
    </div>

    <!-- Pause Overlay -->
    <div v-if="isPaused" class="pause-overlay">
      <div class="pause-menu">
        <h2>GAME PAUSED</h2>
        <h3 class="kinyarwanda">UMUKINO WAHAGARITSWE</h3>
        <button class="resume-button" @click="togglePause">
          <span>RESUME</span>
          <span class="kinyarwanda">KOMEZA</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  score: {type: Number, default: 0},
  coin: {type: Number, default: 0},
  isPaused: {type: Boolean, default: false},
});

const emit = defineEmits(['toggle-pause']);

const pauseIconLoaded = ref(true);
const scoreIconLoaded = ref(true);
const coinIconLoaded = ref(true);

const handlePauseIconError = () => {
  pauseIconLoaded.value = false;
};

const handleScoreIconError = () => {
  scoreIconLoaded.value = false;
};

const handleCoinIconError = () => {
  coinIconLoaded.value = false;
};

const togglePause = () => {
  emit('toggle-pause');
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
</script>

<style scoped>
.game-hud {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
}

/* Pause Button (Top Left) */
.pause-container {
  position: absolute;
  top: 20px;
  left: 20px;
  pointer-events: auto;
}

.pause-button {
  width: 60px;
  height: 60px;
  background: linear-gradient(145deg, #ff6b6b, #ee5a52);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 16px rgba(238, 90, 82, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.pause-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 20px rgba(238, 90, 82, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.pause-button:active {
  transform: translateY(0);
  box-shadow: 
    0 4px 8px rgba(238, 90, 82, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.pause-button.paused {
  background: linear-gradient(145deg, #4ecdc4, #44a08d);
  box-shadow: 
    0 8px 16px rgba(68, 160, 141, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.pause-icon {
  width: 30px;
  height: 30px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.pause-fallback {
  font-size: 24px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Score Display (Top Center) */
.score-container {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
}

.score-display {
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #667eea, #764ba2);
  padding: 12px 20px;
  border-radius: 30px;
  box-shadow: 
    0 8px 16px rgba(102, 126, 234, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.score-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.score-icon-fallback {
  font-size: 24px;
  margin-right: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.score-number {
  font-family: 'Arial Black', Arial, sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.5),
    0 1px 0 rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  min-width: 60px;
  text-align: center;
}

/* Coins Display (Top Right) */
.coins-container {
  position: absolute;
  top: 20px;
  right: 20px;
  pointer-events: auto;
}

.coins-display {
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #f093fb, #f5576c);
  padding: 12px 20px;
  border-radius: 30px;
  box-shadow: 
    0 8px 16px rgba(240, 147, 251, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.coin-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: coinSpin 3s ease-in-out infinite;
}

.coin-icon-fallback {
  font-size: 24px;
  margin-right: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: coinSpin 3s ease-in-out infinite;
}

.coin-number {
  font-family: 'Arial Black', Arial, sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.5),
    0 1px 0 rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  min-width: 60px;
  text-align: center;
}

/* Pause Overlay */
.pause-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  backdrop-filter: blur(10px);
  z-index: 1001;
}

.pause-menu {
  background: linear-gradient(145deg, #667eea, #764ba2);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.pause-menu h2 {
  font-family: 'Arial Black', Arial, sans-serif;
  font-size: 36px;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 10px 0;
  text-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.5),
    0 1px 0 rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
}

.pause-menu h3 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 30px 0;
  font-weight: normal;
}

.resume-button {
  background: linear-gradient(145deg, #4ecdc4, #44a08d);
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Arial Black', Arial, sans-serif;
  font-size: 18px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 
    0 8px 16px rgba(68, 160, 141, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.resume-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 20px rgba(68, 160, 141, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.resume-button:active {
  transform: translateY(0);
}

.resume-button .kinyarwanda {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 2px;
  font-weight: normal;
}

/* Animations */
@keyframes coinSpin {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .pause-container {
    top: 15px;
    left: 15px;
  }
  
  .pause-button {
    width: 50px;
    height: 50px;
  }
  
  .pause-icon {
    width: 24px;
    height: 24px;
  }
  
  .score-container {
    top: 15px;
  }
  
  .coins-container {
    top: 15px;
    right: 15px;
  }
  
  .score-display,
  .coins-display {
    padding: 8px 15px;
  }
  
  .score-number,
  .coin-number {
    font-size: 20px;
    min-width: 50px;
  }
  
  .score-icon,
  .coin-icon {
    width: 28px;
    height: 28px;
    margin-right: 8px;
  }
  
  .pause-menu {
    padding: 30px;
    margin: 20px;
  }
  
  .pause-menu h2 {
    font-size: 28px;
  }
}

.kinyarwanda {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
}
</style>
