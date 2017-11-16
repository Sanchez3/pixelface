/**
 * Created by sanchez 
 */
'use strict';
window.game = new Phaser.Game('100', '100', Phaser.CANVAS, 'mycanvas', null, true);
window.game.state.add('Boot', require('./states/boot'));
window.game.state.add('Preloader', require('./states/preloader'));
window.game.state.add('State1', require('./states/state1'));


function initInput() {
    var inputElement = document.getElementById("myinput");
    inputElement.addEventListener("change", function() {
        var file1 = this.files[0]; /* now you can work with the file list */
        var imageType = /^image\//;

        if (!imageType.test(file1.type)) {
            console.log('image please');
        }
        var reader = new FileReader();
        reader.onload = function(e) {
           window.path=e.target.result;
           window.game.state.start('Boot');
        };
        reader.readAsDataURL(file1);

    }, false);
}
initInput();


function showStats() {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    var fs = document.createElement('div');
    fs.style.position = 'absolute';
    fs.style.right = 0;
    fs.style.top = 0;
    fs.style.zIndex = 999;
    fs.appendChild(stats.domElement);
    document.body.appendChild(fs);

    function animate() {
        stats.begin();
        // monitored code goes here
        stats.end();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
showStats();