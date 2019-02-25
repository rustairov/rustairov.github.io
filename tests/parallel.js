function parallel(arr, callback) {
    let result = [], pendings = arr.map(() => true);

    arr.forEach((func, i) => {
        let res = func.call(null, (arg) => {
            result[i] = arg;
            pendings[i] = false;
        });

        if (typeof res !== 'undefined') {
            result[i] = res;
            pendings[i] = false;
        }
    });

    let interval = setInterval(() => {
        if (!pendings.includes(true)) {
            clearInterval(interval);
            callback.call(null, result);
        }
    }, 0)

}

parallel([
    function (resolve) {
        setTimeout(function () {
            resolve(10);
        }, 50);
    },
    function () {
        return 5;
    },
    function (resolve) {
        setTimeout(function () {
            resolve(0);
        }, 10)
    }
], function (results) {
    console.log(results); // [10, 5, 0]
});