function makeRandomArray(N) {
    let x = new Float32Array(N);
    for (let i = 0; i < N; i++) {
        x[i] = Math.round(10*N*Math.random());
    }
    return x;
}

function swap(x, i, j) {
    let temp = x[i];
    x[i] = x[j];
    x[j] = temp;
}

function insertionSort(x) {
    for (let i = 1; i < x.length; i++) {
        let j = i;
        while (x[j-1] > x[j]) {
            swap(x, j, j-1);
            j--;
        }
    }
}

function insertionSortNetwork(x, N, i) {
    let idx = this.thread.x;
    let res = x[idx];
    let j = 2*N-4-i;
    if ((i <  N-1 && idx < i+2) || 
        (i >= N-1 && idx < j+2)) {
        if (i%2 == 0) {
            if (idx %2 == 0) {
                res = x[idx];
                if (x[idx+1] < x[idx]) {
                    res = x[idx+1];
                }
            }
            else {
                res = x[idx];
                if (x[idx-1] > x[idx]) {
                    res = x[idx-1];
                }
            }
        }
        else if (idx > 0) {
            if (idx %2 == 0) {
                res = x[idx];
                if (x[idx-1] > x[idx]) {
                    res = x[idx-1];
                }
            }
            else {
                res = x[idx];
                if (x[idx+1] < x[idx]) {
                    res = x[idx+1];
                }
            }
        }
    }
    return res;
}

let N = 1000;
let x = makeRandomArray(N);
let x1 = new Float32Array(x);
let tic = new Date();
insertionSort(x1);
let toc = new Date();
console.log("Elapsed time javascript: " + (toc-tic));



const gpu = new GPU();
const regIter = gpu.createKernel(insertionSortNetwork, {output:[N], pipeline: true, immutable:true});
const finalIter = gpu.createKernel(insertionSortNetwork, {output:[N]});

tic = new Date();
for (let i = 0; i < 2*N-4; i++) {
    x = regIter(x, N, i);
}
x = finalIter(x, N, 2*N-4);
toc = new Date();

console.log(x);

let numDiff = 0;
for (let i = 0; i < N; i++) {
    if (x[i] != x1[i]) {
        numDiff++;
    }
}

console.log("Elapsed time gpu.js: ", toc-tic);
console.log("numDiff = " + numDiff);