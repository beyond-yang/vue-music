// 给DOM元素添加样式
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}

// 判断一个dom元素是否存在某个类样式
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

// 获取某个元素的某个属性
export function getData(el, name, val) {
    name = 'data-' + name
    if (val) {
        return el.setAttribute(name, val)
    } else {
        return el.getAttribute(name)
    }
}

// 判断浏览器内核供应商是，webkit/Moz/O/ms/中的哪一个
let elementStyle = document.createElement('div').style

let vendor = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }

    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key
        }
    }
    return false
})()
export function prefixStyle(style) {
    if (vendor === false) {
        return false
    }
    if (vendor === 'standard') {
        return style
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}