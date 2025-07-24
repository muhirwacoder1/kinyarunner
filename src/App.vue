<template>
  <div>
    <div v-if="!isReady" class="loading-screen">
      <div class="loading-image-container">
        <img 
          src="/assets/png/ishuri image.jpg" 
          alt="Ishuri - School" 
          class="loading-image"
          @error="handleImageError"
          @load="handleImageLoad"
          v-show="imageLoaded"
        />
        <div class="loading-overlay">
          <div class="loading-content">
            <h1 class="game-title">KinyaRunner</h1>
            <h2 class="game-subtitle">Umukino wo Kwiruka</h2>
            
            <!-- Custom Loading Animation -->
            <div class="loading-animation-container">
              <div class="loader"></div>
              <div class="loading-text">
                <div class="loading-percentage">{{ progressPercentage }}%</div>
                <div class="loading-status">Loading Game...</div>
                <div class="kinyarwanda">Gupakira Umukino...</div>
              </div>
            </div>
            
            <!-- Loading status (hidden by default, shown on error) -->
            <div v-if="showDetailedLoading" class="detailed-loading">
              <div class="loading-text">
                <div>Loading: {{ loadingData.url || 'Game resources...' }}</div>
                <div class="kinyarwanda">Gupakira: {{ loadingData.url || 'Ibikoresho by\'umukino...' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GameGuide :show-mask="isReady && showGuide" :game-status="gameStatus" />
    <ScorePanel 
      :score="score" 
      :coin="coin" 
      :is-paused="isPaused"
      @toggle-pause="handleTogglePause"
    />
    <div class="experience">
      <canvas ref="exp_canvas" class="experience__canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';
import ScorePanel from './components/ScorePanel.vue';
import GameGuide from './components/GameGuide.vue';
import Game from './Game';
// Whether the model is loaded
const isReady = ref(false);
// Game score
const score = ref(0);
// Game coins
const coin = ref(0);
// Game status
const gameStatus = ref('ready');
// Game pause state
const isPaused = ref(false);

let loadingData: any = ref({});
const exp_canvas = ref<HTMLElement>();
const showDetailedLoading = ref(false);
const imageLoaded = ref(false);

const showGuide = computed(() => {
  return gameStatus.value !== 'start';
});

const progressPercentage = computed(() => {
  if (loadingData.value.itemsTotal && loadingData.value.itemsLoaded) {
    return Math.round((loadingData.value.itemsLoaded / loadingData.value.itemsTotal) * 100);
  }
  return 0;
});

const handleImageError = () => {
  console.log('Loading image not found, using gradient background');
  imageLoaded.value = false;
  showDetailedLoading.value = false; // Keep it clean, just show the gradient
};

const handleImageLoad = () => {
  console.log('Loading image loaded successfully');
  imageLoaded.value = true;
};

let gameInstance: any = null;

const handleTogglePause = () => {
  if (gameInstance) {
    gameInstance.togglePause();
  }
};

onMounted(() => {
  const game = new Game(exp_canvas.value);
  gameInstance = game;
  
  // Resource loading
  game.on('progress', (data: any) => {
    const { type } = data;
    if (type === 'successLoad') {
      loadingData.value.type = 'successLoad';
      isReady.value = true;
    }
    else {
      loadingData.value = data;
    }
  });
  
  game.on('gameStatus', (data: any) => {
    console.log(data);
    gameStatus.value = data;
  });
  
  game.on('gameData', (data: any) => {
    score.value = data.score;
    coin.value = data.coin;
  });
  
  game.on('gamePaused', (paused: boolean) => {
    isPaused.value = paused;
  });
});
onUnmounted(() => {
  if (gameInstance) {
    gameInstance.disposeGame();
  }
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 999;
  overflow: hidden;
}

.loading-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.loading-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Fallback background when image is not available */
.loading-image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%, 
    #f093fb 50%, 
    #f5576c 75%, 
    #4facfe 100%
  );
  z-index: -1;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-content {
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 40px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.game-title {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.game-subtitle {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  margin: 0 0 40px 0;
  opacity: 0.9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.02em;
}

.loading-animation-container {
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Custom Loader Animation */
.loader {
  width: 120px;
  height: 20px;
  border-radius: 20px;
  background: linear-gradient(orange 0 0) 0/0% no-repeat lightblue;
  animation: l2 2s infinite steps(10);
}

@keyframes l2 {
  100% {
    background-size: 110%;
  }
}

.loading-percentage {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 8px;
}

.loading-status {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.02em;
}

.loading-text {
  text-align: center;
  margin: 10px 0;
  font-size: 16px;
}

.kinyarwanda {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.7;
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.01em;
}

.detailed-loading {
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .game-title {
    font-size: 2.5rem;
  }
  
  .game-subtitle {
    font-size: 1.2rem;
  }
  
  .loading-content {
    padding: 15px;
  }
}

/* Loading screen animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
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

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.loading-content {
  animation: fadeIn 1s ease-out;
}

.game-title {
  animation: pulse 2s ease-in-out infinite;
}

.loading-image-container::before {
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
}

.experience {
  position: fixed;
  height: 100vh;
  width: 100vw;
}

.experience__canvas {
  height: 100%;
  width: 100%;
}

canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  touch-action: none;
  user-select: none;
}

/* Mobile-friendly styles */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

html {
  margin: 0;
  padding: 0;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}
</style>
./Game/init./Game