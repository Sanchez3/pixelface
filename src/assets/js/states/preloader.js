/**
 * Created by sanchez on 17/5/22.
 */
(function() {
    'use strict';
    var Preloader = function() {};

    module.exports = Preloader;

    Preloader.prototype = {
        loadResources: function() {

            // window.path='./assets/img/f5.jpg';
            this.load.image('pic', window.path);
       
            this.load.start();

        },
        drawPieProgress: function(_progress) {
            var that = this;
            that.pgGraphics.clear();
            that.pgGraphics.lineStyle(6, 0x29ABE2);
            that.pgGraphics.arc(this.game.width / 2, 182 + 140, 45, this.game.math.degToRad(270), this.game.math.degToRad(360 * _progress / 100 + 270), false);
            that.pgGraphics.endFill();

        },
        create: function() {
            var that = this;
            that.pgGraphics = this.add.graphics(0, 0);

            this.load.onFileComplete.add(that.onfileComplete, this);
            this.load.onLoadComplete.addOnce(that.onLoadComplete, this);
            this.loadResources();

        },
        onLoadComplete: function() {
            var that = this;
            that.game.state.start('State1');
            return;

        },
        onfileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
            var that = this;
            that.drawPieProgress(progress);
        }
    };

}());