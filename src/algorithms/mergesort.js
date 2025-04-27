export function mergeSortAnimations(arr) {
  const animations = [];
  if (arr.length <= 1) return animations;
  const auxArray = arr.slice();
  mergeSortHelper(arr, 0, arr.length - 1, auxArray, animations);
  animations.push({ type: "sorted" });
  return animations;
}

function mergeSortHelper(mainArray, start, end, auxArray, animations) {
  if (start === end) return;

  const mid = Math.floor((start + end) / 2);
  mergeSortHelper(auxArray, start, mid, mainArray, animations);
  mergeSortHelper(auxArray, mid + 1, end, mainArray, animations);
  merge(mainArray, start, mid, end, auxArray, animations);
}

function merge(mainArray, start, mid, end, auxArray, animations) {
  let k = start;
  let i = start;
  let j = mid + 1;

  while (i <= mid && j <= end) {
    animations.push({ type: "compare", indices: [i, j] });

    if (auxArray[i] <= auxArray[j]) {
      animations.push({ type: "overwrite", indices: [k], value: auxArray[i] });
      mainArray[k++] = auxArray[i++];
    } else {
      animations.push({ type: "overwrite", indices: [k], value: auxArray[j] });
      mainArray[k++] = auxArray[j++];
    }
  }

  while (i <= mid) {
    animations.push({ type: "overwrite", indices: [k], value: auxArray[i] });
    mainArray[k++] = auxArray[i++];
  }

  while (j <= end) {
    animations.push({ type: "overwrite", indices: [k], value: auxArray[j] });
    mainArray[k++] = auxArray[j++];
  }
  animations.push({ type: "merge", indices: [start, mid, end] }); 

}
