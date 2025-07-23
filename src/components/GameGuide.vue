<template>
  <div v-if="showMask" class="game-mask">
      <div class="message">
        <div v-if="gameStatus === 'ready'">
          <!-- Desktop Controls -->
          <div class="controls-section">
            <h3>Desktop Controls:</h3>
            <div>Press <span class="key">P</span> or <span class="key">Space</span> to start</div>
            <div><span class="key">↑</span> or <span class="key">W</span> to jump</div>
            <div><span class="key">↓</span> or <span class="key">S</span> to slide</div>
            <div><span class="key">←</span> or <span class="key">A</span> to move left</div>
            <div><span class="key">→</span> or <span class="key">D</span> to move right</div>
          </div>
          
          <!-- Mobile Controls -->
          <div class="controls-section">
            <h3>Mobile Controls:</h3>
            <div>Tap to start</div>
            <div>Swipe up to jump</div>
            <div>Swipe down to slide</div>
            <div>Swipe left to move left</div>
            <div>Swipe right to move right</div>
          </div>

          <!-- Kinyarwanda Translation -->
          <div class="kinyarwanda">
            <div class="controls-section">
              <h3>Igenzura rya Desktop:</h3>
              <div>Kanda <span class="key">P</span> cyangwa <span class="key">Space</span> gutangira</div>
              <div><span class="key">↑</span> cyangwa <span class="key">W</span> gusimbuka</div>
              <div><span class="key">↓</span> cyangwa <span class="key">S</span> kunyerera</div>
              <div><span class="key">←</span> cyangwa <span class="key">A</span> kwimuka ibumoso</div>
              <div><span class="key">→</span> cyangwa <span class="key">D</span> kwimuka iburyo</div>
            </div>
            
            <div class="controls-section">
              <h3>Igenzura rya Mobile:</h3>
              <div>Kanda gutangira</div>
              <div>Simbura hejuru gusimbuka</div>
              <div>Simbura hasi kunyerera</div>
              <div>Simbura ibumoso kwimuka ibumoso</div>
              <div>Simbura iburyo kwimuka iburyo</div>
            </div>
          </div>
        </div>
        
        <div v-else>
          <div>Press <span class="key">{{ textCompute.key }}</span> {{ textCompute.text.en }}</div>
          <div class="kinyarwanda">Kanda <span class="key">{{ textCompute.key }}</span> {{ textCompute.text.rw }}</div>
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
const keyMap: Record<string, any> = {
  ready: {
      key: 'P',
      text: {
        en: 'to start game',
        rw: 'gutangira umukino'
      },
  },
  end: {
      key: 'R',
      text: {
        en: 'to restart game',
        rw: 'gutangira umukino ukundi'
      },
  },
};
const textCompute = computed(() => {
  return keyMap[props.gameStatus];
});
</script>

<style scoped>
.game-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.message {
  font-size: 18px;
  color: white;
  text-align: center;
  max-width: 600px;
}

.controls-section {
  margin: 20px 0;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.controls-section h3 {
  margin: 0 0 10px 0;
  color: #3498db;
  font-size: 20px;
}

.controls-section div {
  margin: 8px 0;
  font-size: 16px;
}

.kinyarwanda {
  font-size: 14px;
  margin-top: 20px;
  opacity: 0.9;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 20px;
}

.kinyarwanda .controls-section {
  background-color: rgba(255, 255, 255, 0.05);
}

.kinyarwanda .controls-section h3 {
  font-size: 16px;
}

.kinyarwanda .controls-section div {
  font-size: 14px;
}

.key {
  background-color: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  margin: 0 2px;
}
</style>
