export const tool = {
  promiseFn(){
    let promise = new Promise((resolve, reject) => {
      let timer = setTimeout(function () {
        clearTimeout(timer);
        console.log('1秒过去了，执行resolve');
        resolve('promiseFn');
      }, 100);
    });
    return promise;
  },
  awaitFn: async function () {
    let res = await this.promiseFn();
    console.log('awaitFn执行了，结果：',res);
  }
};
