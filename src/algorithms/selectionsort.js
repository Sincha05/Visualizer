export function selectionSortAnimations(arr) {
  const animations = [];
  const array = arr.slice();
  const n = array.length;

  for (let i = 0; i < n; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      animations.push({ type: "compare", indices: [minIndex, j] });

      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      animations.push({ type: "swap", indices: [i, minIndex] });
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }

  animations.push({ type: "sorted" });
  return animations;
}
