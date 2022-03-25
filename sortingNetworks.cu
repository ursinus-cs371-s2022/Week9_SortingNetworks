__global__ void insertionSortNetwork(float* x, int N) {
    extern __shared__ float y[];
    int idx = blockIdx.x*blockDim.x + threadIdx.x;
    float res = x[idx];
    __syncthreads();
    x[idx] = blockIdx.x;
    /*float res = 0.0;
    for (int i = 0; i < 2*N-3; i++) {
        int j = 2*N-4-i;
        if (idx < N) {
            res = x[idx];
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
        }
        __syncthreads();
        if (idx < N) {
            x[idx] = res;
        }
        __syncthreads();
    }*/
}

