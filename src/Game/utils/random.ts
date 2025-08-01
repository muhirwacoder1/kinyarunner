export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate random index between 0 and i
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}