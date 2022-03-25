function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

/**
 * 
 * @param {array} x The main array
 * @param {array} y The array to copy into as the two chunks are being merged
 * @param {int} i1 Left of first chunk
 * @param {int} mid Right of first chunk
 * @param {int} i2 End of second chunk
 */
function merge(x, y, i1, mid, i2) {
    let i = i1;
    let j = mid+1;
    let idx = 0;
    // Main merge code
    while (i != mid+1 && j != i2+1) {
        if (x[i] < x[j]) {
            y[idx] = x[i];
            i++;
        }
        else {
            y[idx] = x[j];
            j++;
        }
        idx++;
    }
    // Copy over any elements that are left in
    // the first chunk
    while (i < mid+1) {
        y[idx] = x[i];
        i += 1;
    }
    // Copy over any elements that are left in
    // the second chunk
    while (j <= i2) {
        y[idx] = x[j];
        j += 1;
    }
    // Copy our merged sorted chunk from the staging area
    // back into the chunk from i1 to i2
    for (idx = 0; idx <= i2-i1+1; idx++) {
        x[i1+idx] = y[idx];
    }
}


/**
 * A recursive call to sort a subset of the array
 * @param {array} x The main array
 * @param {array} y The array to copy into as the two chunks are being merged
 * @param {int} i1 First index of chunk to sort, inclusive
 * @param {int} i2 Second index of chunk to sort, inclusive (i2 >= i1)
 * @returns 
 */
function mergeSortRec(x, y, i1, i2) {
    if (i1 == i2) {
        // Base case: A single number
        return
    }
    else if (i2 - i1 == 1) {
        // Base case: A pair of numbers right next to each other
        if (x[i2] < x[i1]) {
            swap(x, i1, i2);
        }
    }
    else {
        // More than two; need to "divide and conquer"
        mid = Math.floor((i1 + i2)/2);
        mergeSortRec(x, y, i1, mid);
        mergeSortRec(x, y, mid+1, i2);
        merge(x, y, i1, mid, i2);
    }
}


/**
 * An entry point for merge sort on the entire array
 * @param {array} x Array to sort
 */
function mergeSort(x) {
    y = new Float32Array(x.length);
    mergeSortRec(x, y, 0, x.length-1);
    return x;
}