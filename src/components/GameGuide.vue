<template>
  <div v-if="showMask" class="game-guide-overlay">
    <div class="guide-container">
      
      <!-- Game Title & Welcome -->
      <div class="welcome-section">
        <h1 class="game-title">🏃‍♂️ KinyaRunner</h1>
        <p class="welcome-text">Ready to run? Learn the controls!</p>
        <p class="welcome-text-rw">Witeguye kwiruka? Wige igenzura!</p>
      </div>

      <!-- Controls Grid -->
      <div v-if="gameStatus === 'ready'" class="controls-grid">
        
        <!-- Desktop Controls Card -->
        <div class="control-card desktop-card">
          <div class="card-header">
            <div class="card-icon">💻</div>
            <h3 class="card-title">Desktop</h3>
            <p class="card-subtitle">Keyboard Controls</p>
          </div>
          
          <div class="controls-list">
            <div class="control-item start-control">
              <div class="control-keys">
                <span class="key-badge primary">P</span>
                <span class="key-divider">or</span>
                <span class="key-badge primary">Space</span>
              </div>
              <div class="control-action">
                <span class="action-text">Start Game</span>
                <span class="action-text-rw">Tangira Umukino</span>
              </div>
            </div>

            <div class="control-item">
              <div class="control-keys">
                <span class="key-badge">↑</span>
                <span class="key-divider">or</span>
                <span class="key-badge">W</span>
              </div>
              <div class="control-action">
                <span class="action-text">Jump</span>
                <span class="action-text-rw">Simbuka</span>
              </div>
            </div>

            <div class="control-item">
              <div class="control-keys">
                <span class="key-badge">↓</span>
                <span class="key-divider">or</span>
                <span class="key-badge">S</span>
              </div>
              <div class="control-action">
                <span class="action-text">Slide</span>
                <span class="action-text-rw">Nyerera</span>
              </div>
            </div>

            <div class="control-item">
              <div class="control-keys">
                <span class="key-badge">←</span>
                <span class="key-divider">or</span>
                <span class="key-badge">A</span>
              </div>
              <div class="control-action">
                <span class="action-text">Move Left</span>
                <span class="action-text-rw">Jya Ibumoso</span>
              </div>
            </div>

            <div class="control-item">
              <div class="control-keys">
                <span class="key-badge">→</span>
                <span class="key-divider">or</span>
                <span class="key-badge">D</span>
              </div>
              <div class="control-action">
                <span class="action-text">Move Right</span>
                <span class="action-text-rw">Jya Iburyo</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Controls Card -->
        <div class="control-card mobile-card">
          <div class="card-header">
            <div class="card-icon">📱</div>
            <h3 class="card-title">Mobile</h3>
            <p class="card-subtitle">Touch Controls</p>
          </div>
          
          <div class="controls-list">
            <div class="control-item start-control">
              <div class="control-gesture">
                <span class="gesture-badge primary">👆</span>
              </div>
              <div class="control-action">
                <span class="action-text">Tap to Start</span>
                <span class="action-text-rw">Kanda Gutangira</span>
              </div>
            </div>

            <div class="control-item">
              <div class="control-gesture">
                <span class="gesture-badge">👆</span>
                <div class="gesture-arrow">↑</div>
              </div>
              <div class="control-action">
                <span class="action-text">Swipe Up</span>
                <span class="action-text-rw">Simbura Hejuru</span>
              </div>
            </div>

            <div class="control-item">
              <div class="control-gesture">
                <span class="gesture-badge">👇</span>
                <div class="gesture-arrow">↓</div>
              </div>
              <div class="control-action">
                <span class="action-text">Swipe Down</span>
                <span class="action-text-rw">Simbura Hasi</span>
              </div>
            </div>

            <div class="control-item">
              <div class="control-gesture">
                <span class="gesture-badge">👈</span>
                <div class="gesture-arrow">←</div>
              </div>
              <div class="control-action">
                <span class="action-text">Swipe Left</span>
                <span class="action-text-rw">Simbura Ibumoso</span>
              </div>
            </div>

            <div class="control-item">
              <div class="control-gesture">
                <span class="gesture-badge">👉</span>
                <div class="gesture-arrow">→</div>
              </div>
              <div class="control-action">
                <span class="action-text">Swipe Right</span>
                <span class="action-text-rw">Simbura Iburyo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Over State -->
      <div v-else class="restart-section">
        <div class="restart-card">
          <div class="restart-icon">🔄</div>
          <h2 class="restart-title">Ready for Another Round?</h2>
          <p class="restart-subtitle">Witeguye ikindi cyiciro?</p>
          <div class="restart-instruction">
            <span class="key-badge large">{{ textCompute.key }}</span>
            <div class="restart-text">
              <span class="restart-action">{{ textCompute.text.en }}</span>
              <span class="restart-action-rw">{{ textCompute.text.rw }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Start Button -->
      <div v-if="gameStatus === 'ready'" class="start-section">
        <button class="start-button" @click="startGame">
          <span class="start-icon">🚀</span>
          <div class="start-text">
            <span class="start-main">START PLAYING</span>
            <span class="start-sub">Tangira Gukina</span>
          </div>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  showMask: {type: Boolean, default: false},
  gameStatus: {type: String, default: 'ready'},
});

const emit = defineEmits(['start-game']);

const keyMap: Record<string, any> = {
  ready: {
      key: 'P',
      text: {
        en: 'Press to start game',
        rw: 'Kanda gutangira umukino'
      },
  },
  end: {
      key: 'R',
      text: {
        en: 'Press to restart game',
        rw: 'Kanda gutangira umukino ukundi'
      },
  },
};

const textCompute = computed(() => {
  return keyMap[props.gameStatus];
});

const startGame = () => {
  emit('start-game');
};
</script>

<style scoped>
.game-guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(30, 30, 50, 0.95));
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.5s ease-out;
  overflow-y: auto;
  padding: 20px;
}

.guide-container {
  max-width: 1000px;
  width: 100%;
  text-align: center;
  animation: slideUp 0.6s ease-out;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 40px;
}

.game-title {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 15px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.welcome-text {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.3rem;
  font-weight: 500;
  color: #ffffff;
  margin: 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.welcome-text-rw {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin: 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Controls Grid */
.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.control-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.control-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.desktop-card {
  background: linear-gradient(145deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
  border-color: rgba(102, 126, 234, 0.3);
}

.mobile-card {
  background: linear-gradient(145deg, rgba(240, 147, 251, 0.15), rgba(245, 87, 108, 0.1));
  border-color: rgba(240, 147, 251, 0.3);
}

/* Card Headers */
.card-header {
  margin-bottom: 25px;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.card-title {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 5px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.card-subtitle {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* Controls List */
.controls-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.control-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.start-control {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1));
  border-color: rgba(46, 204, 113, 0.4);
}

/* Control Keys */
.control-keys {
  display: flex;
  align-items: center;
  gap: 8px;
}

.key-badge {
  background: linear-gradient(145deg, #34495e, #2c3e50);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 35px;
  text-align: center;
}

.key-badge.primary {
  background: linear-gradient(145deg, #27ae60, #2ecc71);
  box-shadow: 
    0 4px 8px rgba(46, 204, 113, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

.key-badge.large {
  padding: 12px 20px;
  font-size: 1.2rem;
  min-width: 50px;
}

.key-divider {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

/* Control Gestures */
.control-gesture {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gesture-badge {
  font-size: 1.5rem;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gesture-badge.primary {
  background: linear-gradient(145deg, #27ae60, #2ecc71);
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.4);
}

.gesture-arrow {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
}

/* Control Actions */
.control-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.action-text {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.action-text-rw {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

/* Restart Section */
.restart-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.restart-card {
  background: linear-gradient(145deg, rgba(231, 76, 60, 0.15), rgba(192, 57, 43, 0.1));
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 400px;
}

.restart-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.restart-title {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.restart-subtitle {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 25px 0;
}

.restart-instruction {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.restart-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.restart-action {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
}

.restart-action-rw {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

/* Start Section */
.start-section {
  display: flex;
  justify-content: center;
}

.start-button {
  background: linear-gradient(145deg, #27ae60, #2ecc71);
  border: none;
  border-radius: 50px;
  padding: 20px 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 
    0 8px 16px rgba(46, 204, 113, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 12px 24px rgba(46, 204, 113, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

.start-button:active {
  transform: translateY(-1px);
}

.start-icon {
  font-size: 1.5rem;
}

.start-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.start-main {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.start-sub {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
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
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .game-guide-overlay {
    padding: 15px;
  }
  
  .game-title {
    font-size: 2.2rem;
  }
  
  .welcome-text {
    font-size: 1.1rem;
  }
  
  .controls-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .control-card {
    padding: 20px;
  }
  
  .control-item {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .control-action {
    align-items: center;
    text-align: center;
  }
  
  .restart-card {
    padding: 30px 20px;
  }
  
  .restart-instruction {
    flex-direction: column;
    gap: 10px;
  }
  
  .restart-text {
    align-items: center;
    text-align: center;
  }
  
  .start-button {
    padding: 15px 30px;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 1.8rem;
  }
  
  .control-card {
    padding: 15px;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
  
  .key-badge {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}
</style>
