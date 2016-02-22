
var GameOverLayer = cc.LayerColor.extend({
    ctor: function() {
        this._super(cc.color(250,250,250,255));
        this.init();
        return true;
    },
    init: function() {
        var winSize = cc.director.getWinSize();
        var centerPos = cc.p(winSize.width/2, winSize.height/2);
        
        cc.MenuItemFont.setFontSize(50);
        cc.MenuItemFont.setFontName("Impact");
       // cc.MenuItemFont.setColor(cc.color(50, 50, 50, 255));
        
        var menuItemRestart = new cc.MenuItemFont.create(
          "Game Restart",
          this.onRestart, this);
          
        var menu = new cc.Menu(menuItemRestart);
        menu.setPosition(centerPos);
        
        this.addChild(menu,105);
    },
    onRestart:function(sender){
        cc.director.resume();
        cc.director.runScene(new GameLayer());
    }
});


var GameLayer = cc.LayerColor.extend({
    size: null,
    sprite: null,
    space: null,
    //ball: null,
    startPosition: null,
    endPosition: null,
    lock:false,
    fragils: [],
    next: true,
    score: 0,
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(50,50,50,255));
        this.size = cc.winSize;
        this.initPhysics();
        this.init(this);

        return true;
    },
    init: function () {

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = this.size;
        
        // debugNode = new cc.PhysicsDebugNode(this.space);
        // debugNode.visible = true;
        // this.addChild(debugNode);

        /////////////////////////////
        // 3. add your codes below...
        
        this.scenario = new Scenario(this);
        
        var layer = this;
        
        window.ss = function () {
            layer.scenario.next();
        };
        
        var ball = new Ball(res.Brick_png, cc.p((size.width / 2) + 25, 113), this.space);
        this.addChild(ball);
        
        this.ball = ball;
        // var angrysprite = new cc.Sprite(res.Brick_png);
        // angrysprite.setPosition(cc.p(-100,100));
        
        // ball.addChild(angrysprite);
        //ball.body.vx = 50;
        //ball.body.vy = 300;
        
        this.scheduleUpdate();
        
        if(cc.sys.capabilities.hasOwnProperty( 'mouse') ){
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                
                onMouseUp: function(event){
                    console.log(layer.lock);
                    if(event.getButton()===0){
                        return layer.touchEnd(event.getLocationX(), event.getLocationY());
                    }  
                },
                onMouseDown: function(event){
                    var str = "Mouse Down detected, Key: " + event.getButton();
                    if(event.getButton()===0){
                        return layer.touchBegan(event.getLocationX(), event.getLocationY());
                    }
                    return true;
                }
            },this);

        }
        
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                console.log(touch);
                var location = touch.getLocation();
                return layer.touchEnd(location.x, location.y);
            },
            onTouchEnded: function (touch, event) {
                var location = touch.getLocation();
                return layer.touchBegan(location.x, location.y);
            }
        }, this);
    },
    
    touchBegan: function(x, y) {
        this.startPosition = cc.p(x, y);
        return true;
    },
    
    touchEnd: function(x, y) {
        if(this.lock) {
            return false;
        } else {
            this.lock=true;
            
            this.endPosition = cc.p(x, y);
            
            var deltay = (this.endPosition.y - this.ball.body.p.y);
            var deltax = (this.endPosition.x - this.ball.body.p.x);
            var dist = Math.sqrt(deltax*deltax + deltay*deltay);
            if(!dist || dist < 10){
                return ;
            }
            var ByVX = deltax / dist;
            var ByVY = deltay / dist;
            
            if(ByVY <0.2588){
                ByVY = 0.2588;
                ByVX = (deltax>0)? 0.9659258: -0.9659258;
            }
            
            this.ball.body.vx = ByVX * 600;
            this.ball.body.vy = ByVY * 600;
            
            return true;
        }    
    },
    
    initPhysics: function () {
        
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);
        
        var layer = this;
        
        
        this.space.addCollisionHandler(0, 2, function (arbiter, space) {
            if (!!arbiter.a.reset) {
                layer.next = true;
                arbiter.b.stop();
                layer.lock = false;
                console.log(arbiter.a);
            }
            
            return true;
        }, null, null, null);
        
        this.space.addCollisionHandler(1, 2, function (arbiter, space) {
            layer.fragils.push(arbiter.a);
            return true;
        }, null, null, null);
        
        this.space.addCollisionHandler(0, 1, function (arbiter, space) {
            cc.director.pause();
            layer.addChild(new GameOverLayer());
        }, null, null, null);
    },
    update: function (dt) {
        this.space.step(dt);
        
        if (this.next) {
            this.next = false;
            this.scenario.next();
        }
        
        //console.log(this.ball.body.vx, this.ball.body.vy);
        
        var vx = this.ball.body.vx,
            vy = this.ball.body.vy,
            speed = Math.sqrt(vx * vx + vy * vy);
            
        if (speed && speed < 300) {
            this.ball.body.vx *= 300 / speed;
            this.ball.body.vy *= 300 / speed;
        } else if (speed > 600) {
            this.ball.body.vx *= 600 / speed;
            this.ball.body.vy *= 600 / speed;
        }
        
        for (var i = this.fragils.length;i--;) {
            var shape = this.fragils.pop(),
                sprite = shape.getBlockSprite();
                
            if (sprite.damage() <= 0) {
                this.space.removeShape(shape);
                this.removeChild(sprite);
                sprite.fragil();
                this.score++;
                
                console.log(this.score);
            }
                
        }
    }
    
});


var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
