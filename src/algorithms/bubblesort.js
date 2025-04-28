export function bubbleSortAnimations(arr) {
  const animations = [];
  const array = arr.slice();
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push({ type: "compare", indices: [j, j + 1] });

      if (array[j] > array[j + 1]) {
      
        animations.push({ type: "swap", indices: [j, j + 1] });
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }


  animations.push({ type: "sorted" });
  return animations;
}


