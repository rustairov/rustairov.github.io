/**
 * Вывод чисел в колонках
 * @param   {Number}  max    от 0 до max
 * @param   {Number}  n   количество колонок
 * @returns {String}
 */
var printNumbers = function (max, n) {
    let array = Array.from(Array(max).keys());
    let cols = [], result = [];

    while (array.length > 0)
        cols.push(array.splice(0, Math.ceil(max / n)));

    for (let i = 0; i < cols[0].length; i++) {
        result.push(cols.map((col) => typeof col[i] !== 'undefined' ? col[i].toString() : '').join(' ').trim());
    }

    return result.join('\n');
};


console.log(printNumbers(12, 3));
/*
Пример работы:
0 4 8
1 5 9
2 6 10
3 7 11
*/