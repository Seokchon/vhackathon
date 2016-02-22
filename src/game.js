
var GameOverLayer = cc.LayerColor.extend({
    background:null,
    restart_norm:null,
    restart_hover:null,
    score_title:null,
    best_score:null,
    scoreLabel:null,
    bestscoreLabel:null,
    ctor: function() {
        this._super(cc.color(0,0,0,80));
        this.init();
        return true;
    },
    init: function() {
        var winSize = cc.director.getWinSize();
        var centerPos = cc.p(winSize.width/2, winSize.height/2);
        var best = parseInt(localStorage.getItem('best')),
            score = parseInt(localStorage.getItem('score'));
            
        console.log(best, score);
        
        this.background = new cc.Sprite(res.gameover_back_png),
        this.background.setPosition(centerPos);
        this.addChild(this.background,2000);
        
        this.score_title = new cc.Sprite(res.gameover_score_png);
        this.score_title.setPosition(centerPos);
        this.best_score = new cc.Sprite(res.gameover_best_png);
        this.best_score.setPosition(centerPos);
        
        this.addChild(this.score_title);
        this.addChild(this.best_score);
        
        this.scoreLabel = new cc.LabelTTF(" "+score, "Impact", 30);
        this.scoreLabel.setPosition(winSize.width/2 +50, winSize.height/2 -33);
        this.addChild(this.scoreLabel, 2005);
        
        
        
        this.bestscoreLabel = new cc.LabelTTF(" "+best, "Impact", 30);
        this.bestscoreLabel.setPosition(winSize.width/2 +50, winSize.height/2 +59);
        this.addChild(this.bestscoreLabel, 2005);
        
        
        
        var closeItem = cc.MenuItemImage.create(//new cc.MenuItemFont.create(
          res.gameover_restart_png,
          res.gameover_restart_hover_png,
          //gameover_restart_mark_png,
          //gameover_restart_mark_png,
          
          function () {
            this.onRestart()
          },this);
    
        var menu = new cc.Menu(closeItem);
        menu.setPosition(centerPos);
        this.addChild(menu, 2001);
        
        
        /*
        cc.MenuItemFont.setFontSize(50);
        cc.MenuItemFont.setFontName("Impact");
       // cc.MenuItemFont.setColor(cc.color(50, 50, 50, 255));
        
        var menuItemRestart = new cc.MenuItemFont.create(
          "Game Restart",
          this.onRestart, this);
          
        var menu = new cc.Menu(menuItemRestart);
        menu.setPosition(centerPos);
        
        this.addChild(menu,105);
        */
    },
    onRestart:function(sender){
        cc.director.resume();
        cc.director.runScene(new GameLayer());
    }
});


var GameLayer = cc.Layer.extend({
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
    scoreLabel:"",
    background:null,
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();
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
        
        this.background = new cc.Sprite(res.mainBack_png, cc.rect(0, 0, size.width, size.height));
        this.background.setPosition(size.width/2, size.height/2);
        this.addChild(this.background);
        
        
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
        
        this.scoreLabel = new cc.LabelTTF(" "+this.score, "Impact", 30);
        this.scoreLabel.setPosition(200, size.height-25);
        this.addChild(this.scoreLabel, 1005);
        
        this.scheduleUpdate();
        
        if(cc.sys.capabilities.hasOwnProperty( 'mouse') ){
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                
                onMouseUp: function(event){
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
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
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
            }
            
            return true;
        }, null, null, null);
        
        this.space.addCollisionHandler(1, 2, function (arbiter, space) {
            layer.fragils.push(arbiter.a);
            return true;
        }, null, null, null);
        
        this.space.addCollisionHandler(0, 1, function (arbiter, space) {
            cc.director.pause();
            
            localStorage.setItem('score', layer.score);
            var best = parseInt(localStorage.getItem('best'));
            localStorage.setItem('best', Math.max(best, layer.score));
            
            layer.addChild(new GameOverLayer());
            
        }, null, null, null);
    },
    update: function (dt) {
        this.space.step(dt);
        
        this.scoreLabel.setString(" "+this.score);
        
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
            }
                
        }
    }
    
});


var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var best = localStorage.getItem('best');
        
        if (!best) {
            localStorage.setItem('best', 0);
        }
            
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
