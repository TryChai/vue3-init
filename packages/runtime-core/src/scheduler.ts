const queue = []
let isFlushing = false

const resolvePromsie = Promise.resolve()
export function queueJob(job){
    //类似于浏览器的事件环
    // 将任务放入队列中 然后去重 然后异步调用
    if(!queue.includes(job)){
        queue.push(job)
    }
    //开一个定时器 批量处理
    if(!isFlushing){
        isFlushing = true
        resolvePromsie.then(()=>{
            isFlushing = false
            let copyQueue = queue.slice(0)
            queue.length = 0
            for(let i = 0;i<copyQueue.length;i++){
                let job = copyQueue[i]
                job()
            }
            copyQueue.length = 0
        })
    }
}