"""
Provides an interface to CUDA for running a parallel version
of the diagonal DTW algorithm
"""

import numpy as np
import time

insertion_sort_network_ = None
bitonic_sort_network_ = None
GPU_INITIALIZED = False
GPU_FAILED = False

def init_gpu():
    global GPU_INITIALIZED
    if not GPU_INITIALIZED:
        try:
            import pycuda.autoinit
            from pycuda.compiler import SourceModule
            fin = open("sortingNetworks.cu")
            mod = SourceModule(fin.read())
            fin.close()
            global insertion_sort_network_
            insertion_sort_network_ = mod.get_function("insertionSortNetwork")
            GPU_INITIALIZED = True
        except Exception as e:
            global GPU_FAILED
            GPU_FAILED = True
            print("Unable to compile GPU kernel {}".format(e))

def insertion_sort_network(arr):
    global GPU_INITIALIZED
    if not GPU_INITIALIZED:
        init_gpu()
    if GPU_FAILED:
        return
    import pycuda.gpuarray as gpuarray
    arr_gpu = gpuarray.to_gpu(np.array(arr, dtype=np.float32))
    N = len(arr)
    threadsPerBlock = int(min(N, 512))
    print("threadsPerBlock = ", threadsPerBlock)
    gridSize = int(np.ceil(N/float(threadsPerBlock)))
    N = np.array(N, dtype=np.int32)
    tic = time.time()
    insertion_sort_network_(arr_gpu, N, np.array(threadsPerBlock, dtype=np.int32), block=(threadsPerBlock, 1, 1), grid=(gridSize, 1), shared=len(arr)*4)
    res = arr_gpu.get()
    print("GPU sorting elapsed time: {}".format(time.time()-tic))
    return res

if __name__ == '__main__':
    N = 1000
    np.random.seed(2)
    tic = time.time()
    x = np.random.randint(0, 1000, N)
    y = insertion_sort_network(x)
    tic = time.time()
    y2 = np.sort(x)
    print("Numpy sorting elapsed time: {}".format(time.time()-tic))
    import matplotlib.pyplot as plt
    #plt.plot(y)
    #plt.plot(y2)
    #print(np.array(y, dtype=int))
    #print(y2)
    #plt.show()
    plt.plot(y)
    plt.show()

if __name__ == '__main__2':
    print(insertion_sort_network([2, 1]))
    np.random.seed(0)
    N = 512
    tic = time.time()
    x = np.random.randn(N)
    print("Making random array: {:.3f}".format(time.time()-tic))
    import matplotlib.pyplot as plt
    y = insertion_sort_network(x)
    tic = time.time()
    y2 = np.sort(x)
    print("Numpy sorting elapsed time: {}".format(time.time()-tic))
    plt.plot(y)
    plt.plot(y2)
    #plt.show()