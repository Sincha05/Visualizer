export function insertionSortAnimations(arr) {
  const animations = [];
  const array = arr.slice();
  const n = array.length;

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      animations.push({ type: "compare", indices: [j, j + 1] });
      animations.push({ type: "swap", indices: [j, j + 1] });

      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
  }

  animations.push({ type: "sorted" });
  return animations;
}
