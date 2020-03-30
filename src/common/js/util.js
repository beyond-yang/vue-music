function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


export function shuffle(arr) {
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = _arr[i]

        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}

// 对一个函数做截流，调用一个函数，返回另一个函数，函数柯里化
export function debounce(func, delay) {
    let timer
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}