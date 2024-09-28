const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB
const THREAD_COUNT = navigator.hardwareConcurrency || 4; // 内核数

// 单线程写法
// export default async function sliceFile(file: File) {
//   const chunkCount = Math.ceil(file.size / CHUNK_SIZE);

//   const proms = [];
//   for (let i = 0; i < chunkCount; i++) {
//     // const chunk = await createChunk(file, i, CHUNK_SIZE);
//     // result.push(chunk);
//     proms.push(createChunk(file, i, CHUNK_SIZE));
//   }
//   const result = await Promise.all(proms);

//   console.log(chunkCount);
//   return result;
// }

// 多线程写法
export default async function sliceFile(file: File) {
  return new Promise((resolve) => {
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT);
    const result: any = [];
    let finishCount = 0;

    for (let i = 0; i < THREAD_COUNT; i++) {
      // 创建一个线程，并分配任务
      const worker = new Worker(
        new URL("../workers/sliceFile.worker.ts?worker", import.meta.url),
        {
          type: "module",
        }
      );

      const start = i * threadChunkCount;
      let end = (i + 1) * threadChunkCount;
      if (end > chunkCount) {
        end = chunkCount;
      }
      worker.postMessage({
        file,
        CHUNK_SIZE,
        startChunkIndex: start,
        endChunkIndex: end,
      });
      worker.onmessage = (e: any) => {
        for (let i = start; i < end; i++) {
          result[i] = e.data[i - start];
        }
        worker.terminate();
        finishCount++;
        if (finishCount === THREAD_COUNT) {
          resolve(result);
        }
      };
    }
  });
}
