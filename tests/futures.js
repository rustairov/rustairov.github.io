// Реализовать класс Futures

function Futures(executor) {
    this.func = executor;
}

Futures.prototype.then = function () {
    this.func.apply(this, arguments);
};



// Тест #1
var foo = new Futures(function (resolve, reject) {
    resolve(123);
});

foo.then(function (val) {
    console.log("foo.resolved:", val === 123);
}, function () {
    console.log("foo.resolved: fail");
});


// Тест #2
var bar = new Futures(function (resolve, reject) {
    setTimeout(resolve.bind(null, "fail"), 300);
    setTimeout(reject.bind(null, "ok"), 200);
});

bar.then(function () {
    console.log("bar.rejected: fail");
}, function (val) {
    console.log("bar.rejected:", val === "ok");
});