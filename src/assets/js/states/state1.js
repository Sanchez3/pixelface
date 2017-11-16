/**
 * Created by sanchez
 */
(function() {
    'use strict';
    var State1 = function() {};
    module.exports = State1;
    State1.prototype = {
        gps: [],
        timelines: [],
        _map: function(t, e, r, o, n) {
            return (t - e) / (r - e) * (n - o) + o;
        },
        pressed: false,
        eventInit: function() {
            this.input.onDown.add(this.tap, this);
            this.input.onUp.add(this.release, this);
            this.input.addMoveCallback(this.drag, this);
        },
        release: function() {
            var that = this;
            that.pressed = false;

        },
        drag: function(pointer, x, y) {
            var that = this;
            var xm, ym;

            if (that.pressed) {
                that.tapCirc.x = x;
                that.tapCirc.y = y;
                for (var i = that.gps.length - 1; i >= 0; i--) {

                    if (that.gps[i] === null) {
                        continue;
                    }
                    if (that.tapCirc.contains(that.gps[i].x, that.gps[i].y)) {

                        if (that.gps[i].x > pointer.clientX) {
                            xm = '+=10';
                        } else {
                            xm = '-=10';
                        }
                        if (that.gps[i].y > pointer.clientY) {
                            ym = '+=10';
                        } else {
                            ym = '-=10';
                        }
                        (function(num) {
                            var gpgo = that.gps[num];
                            that.gps[num] = null;
                            TweenMax.to(gpgo, 0.5, {
                                repeat: 1,
                                yoyo: true,
                                y: ym,
                                x: xm,
                                alpha: 0,
                                ease: Circ.easeOut,
                                delay: that.rnd.realInRange(0, 1),
                                onComplete: function() {
                                    that.gps[num] = gpgo;
                                }
                            });
                        })(i);

                    }
                }


            }

        },

        tap: function(pointer) {
            var that = this;


            that.pressed = true;
            that.tapCirc = new Phaser.Circle(pointer.clientX, pointer.clientY, 50 * that.rnd.realInRange(1, 1.5));

        },
        drawLine: function(t, e, w, color) {
            var that = this;
            t = t + that.rnd.realInRange(-1, 1);
            e = e + that.rnd.realInRange(-1, 1);
            var gp = that.add.graphics(t, 0);
            gp.lineStyle(w, color, 1);
            gp.moveTo(0, 0);
            gp.lineTo(8, 8);
            gp.endFill();
            that.gps.push(gp);
            gp.alpha = 0;
            var tl = TweenMax.to(gp, 0.5, { y: e, alpha: 1, ease: Strong.easeOut, delay: that.rnd.realInRange(0, 2) });
            // t.pause();
            that.timelines.push(tl);

        },
        drawCirc: function(t, e, w, color) {
            var that = this;
            var gp = that.add.graphics(t, 0);
            that.gps.push(gp);
            gp.lineStyle(0);

            // color=0x000;
            if (w <= 4) {
                t = t + that.rnd.realInRange(-3, 3);
                e = e + that.rnd.realInRange(-3, 3);

                // w = w * that.rnd.realInRange(4, 4);

                // w = 0;
                // color = 0xE6D2C9;

            } else {
                t = t + that.rnd.realInRange(-1, 1);
                e = e + that.rnd.realInRange(-1, 1);
            }


            gp.beginFill(color, 1);

            gp.drawCircle(0, 0, w);

            gp.endFill();
            gp.alpha = 0;
            var tl = TweenMax.to(gp, 0.5, { y: e, alpha: 1, ease: Strong.easeOut, delay: that.rnd.realInRange(0, 2) });
            // t.pause();
            that.timelines.push(tl);



        },
        preload: function() {},


        plot: function(x, y, w, h) {
            var that= this;
            x=x*that._scale;
            y=y*that._scale;
            w=w*that._scale;
            h=h*that._scale;
            var rect = this.add.graphics(x, y);
            rect.lineStyle(2, 0xa64ceb, 2);
            rect.drawRect(w * 0.1, 0, w * 0.8, h);
            rect.endFill();

        },
        facepixel: function(x, y, w, h) {
            var that = this;
            var posXF, posYF;

            var area = new Phaser.Rectangle(Math.ceil(x + w * 0.1), y, Math.floor(w * 0.9), h);
            var facebmd = that.make.bitmapData();
            // bmd.addToWorld();
            facebmd.copyRect('pic', area, 0, 0);
            var mg = this.add.image(20 - Math.sqrt(8), that.bmd.height + 10, facebmd);
            mg.scale.setTo(2);
            mg.alpha = 0;
            var w1;
            for (var gridX = Math.ceil(x + w * 0.1); gridX < Math.floor(x + w * 0.9);) {
                for (var gridY = y; gridY < y + h;) {
                    var posX = 2 * gridX;
                    var posY = 2 * gridY;
                    if (posXF == null) {
                        posXF = posX;
                        posYF = posY;
                    }
                    var color = that.bmd.getPixelRGB(gridX, gridY);
                    // console.log(color);
                    var greyscale = Math.round(color.r * 0.222 + color.g * 0.707 + color.b * 0.071);
                    w1 = this._map(greyscale, 0, 255, 15, 0.1);
                    var color16 = ('0' + color.r.toString(16)).slice(-2) + ('0' + color.g.toString(16)).slice(-2) + ('0' + color.b.toString(16)).slice(-2);
                    // console.log(parseInt(color16, 16));

                    if (w1 < 7) {
                        w1 *= 2;
                        gridY += 4;
                    } else {
                        gridY += 2;
                    }
                    //drawCic
                    // this.drawCirc(posX - posXF + 20, posY - posYF + that.bmd.height + 10, w1, parseInt(color16, 16));

                    //drawLine
                    this.drawLine(posX - posXF + 20, posY - posYF +  that.img.height + 10, w1, parseInt(color16, 16));
                }
                if (w1 < 7) {
                    gridX += 4;
                } else {
                    gridX += 2;
                }
            }


        },
        create: function() {
            var that = this;
            that.bmd = this.make.bitmapData();
            that.bmd.load('pic');
            // that.bmd.addToWorld();
           that.img = this.add.image(0, 0, 'pic');
         
           that._scale = 1;
            if ( that.img.width > 300) {
                that._scale = 300 /  that.img.width;

            }
             that.img.scale.setTo(that._scale);
   console.log(that._scale);



            var area = new Phaser.Rectangle(0, 0, that.bmd.width, that.bmd.height);
            var tracker = new tracking.ObjectTracker(['face']);
            var picImg = new Image();
            picImg.src = window.path;
            tracker.on('track', function(event) {
                if (event.data.length === 0) {
                    // No objects were detected in this frame.
                    console.log('no face');

                    var text = 'no face';
                    var style = { font: '60px Arial', fill: '#ff0044', align: 'center' };
                    var t = that.add.text(that.game.width / 2, that.game.height / 2, text, style);
                    t.anchor.setTo(0.5);
                } else {
                    console.log('get first face');

                    that.plot(event.data[0].x, event.data[0].y, event.data[0].height, event.data[0].width);
                    that.facepixel(event.data[0].x, event.data[0].y, event.data[0].height, event.data[0].width);

                }
            });
            picImg.onload = function() {

                tracking.track(picImg, tracker);
                tracker.setStepSize(1.7);
            };

            that.eventInit();

        },


        update: function() {}

    };

}());