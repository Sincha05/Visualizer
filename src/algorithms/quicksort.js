export function quickSortAnimations(arr) {
  const animations = [];
  const array = arr.slice();
  quickSortHelper(array, 0, array.length - 1, animations);
  animations.push({ type: "sorted" });
  return animations;
}

function quickSortHelper(array, low, high, animations) {
  if (low < high) {
    const pivotIndex = partition(array, low, high, animations);
    quickSortHelper(array, low, pivotIndex - 1, animations);
    quickSortHelper(array, pivotIndex + 1, high, animations);
  }
}

function partition(array, low, high, animations) {
  let pivot = array[high];
  let i = low - 1;
  animations.push({ type: "pivot", index: high });
  for (let j = low; j <= high - 1; j++) {
    animations.push({ type: "compare", indices: [j, high] });

    if (array[j] < pivot) {
      i++;
      animations.push({ type: "swap", indices: [i, j] });
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  animations.push({ type: "swap", indices: [i + 1, high] });
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  
  return i + 1;
}
