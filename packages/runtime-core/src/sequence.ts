// [5,3,4,0] => [1,2]

// 从一个序列种找到最长递增子序列的个数

function getSequence(arr){
    let len = arr.length
    let p = arr.slice()
    let result = [0]
    let lastIndex
    let start,end ,middle
    for(let i = 0;i<len;i++){
        const arrI = arr[i] 
        if(arrI !== 0){ // 0 代表新增的节点 不计入最长递增子序列
         lastIndex = result[result.length -1]
         if(arr[lastIndex] < arrI){ // 说明当前这一项 比结果集中 最后一项大 放入集合中
            result.push(i)
            p[i] = lastIndex // 存索引
            continue
         }

         //否则的情况
         start = 0
         end = result.length -1 
         //二分查找
         while(start < end){ // 计算有序比较 二分查找
            middle = Math.floor((start + end) /2 )
            if(arr[result[middle]] < arrI){
                start = middle + 1
            }else{
                end = middle
            }
         }
         if(arrI < arr[result[end]]){
            p[i] = result[end-1]
            result[end] = i
         }
        }
    }
    // 倒叙追溯 选取到结果集中的最后一个
    let i = result.length
    let last = result[i-1]

    while(i-->0){ 
        result[i] = last
        last = p[last]
    }
    // console.log(p)
    return result
}
// 
let arrIndex = getSequence([2 ,3 ,7 ,6 ,8, 4 ,9 ,5 ])
console.log(arrIndex)