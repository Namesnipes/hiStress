keys = {
    90: ['z', 0, false],
    88: ['x', 1, false],
    78: ['n', 2, false],
    77: ['m', 3, false]
};


document.body.onkeydown = function(e) {
    console.log(document.activeElement.tagName)
    if (typeof keys[e.keyCode] != 'undefined') {
        var isDown = keys[e.keyCode][2]
        if(isDown) return
        keys[e.keyCode][2] = true
        keyPress(Number(keys[e.keyCode][1]),false);
    }
};

document.body.onkeyup = function(e) {
    if (typeof keys[e.keyCode] != 'undefined') {
        var isDown = keys[e.keyCode][2]
        keys[e.keyCode][2] = false
        keyPress(Number(keys[e.keyCode][1]),true);
    }
};
