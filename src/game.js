
var GameLayer = cc.LayerColor.extend({
    size: null,
    sprite: null,
    space: null,
    //ball: null,
    startPosition: null,
    endPosition: null,
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(250,250,250,255));
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
        
        debugNode = new cc.PhysicsDebugNode(this.space);
        debugNode.visible = true;
        this.addChild(debugNode);

        /////////////////////////////
        // 3. add your codes below...
        this.scenario = new Scenario(this);
        
        var layer = this;
        
        window.ss = function () {
            layer.scenario.next();
        };
        
        var ball = new Ball(res.Brick_png, cc.p(300, 100), this.space);
        
        //ball.body.vx = 50;
        //ball.body.vy = 300;
        
        this.scheduleUpdate();
        
        if(cc.sys.capabilities.hasOwnProperty( 'mouse') ){
            cc.eventManager.addListener({
        	    event: cc.EventListener.MOUSE,
        	    
        	    onMouseUp: function(event){
        		    var str = "Mouse Up detected, Key: " + event.getButton();
        		    if(event.getButton()==0){
        		        this.endPosition = cc.p(event.getLocationX(), event.getLocationY());
        		    }
        		    console.log(str, this.endPosition);
        		    var deltay = (this.endPosition.y - this.startPosition.y);
        		    var deltax = (this.endPosition.x - this.startPosition.x);
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
        		    
        		    ball.body.vx = ByVX * 300;
        		    ball.body.vy = ByVY * 300;
        		    
        		    return true;
        		    
        	    },
        	    onMouseDown: function(event){
        		    var str = "Mouse Down detected, Key: " + event.getButton();
        		    if(event.getButton()==0){
        		        this.startPosition = cc.p(event.getLocationX(), event.getLocationY());
        		    }
        		    
        		    console.log(event);
        		    // do something..
        		    console.log(str, this.startPosition);
        		    return true;
        	    }
            },this);

/*
            cc.eventManager.addListener({
                event:cc.EventListener.Mouse ,
                onMouseMove: function(event){
                    console.log(event);
                    var str = "MousePosition X: " + event.getLocationX() + "  Y:" + event.getLocationY();
                    // do something...
                    console.log(str);
                    return true;
                },
                onMouseUp: function(event){
                    console.log(event);
            	    var str = "Mouse Up detected, Key: " + event.getButton();
            	    this.endPosition = cc.p(event.getLocationX(), event.getLocationY());
            	    console.log(str, this.endPosition);
            	    return true;
                },
                onMouseDown: function(event){
                    console.log(event);
            	    var str = "Mouse Down detected, Key: " + event.getButton();
            	    this.startPosition = cc.p(event.getLocationX(), event.getLocationY());
            	    console.log(str, this.startPosition);
            	    return true;
                }
                //onMouseMove: this.onMouseMove(event).bind(this),
        	    //onMouseUp: this.onMouseMove(event).bind(this),
        	    //onMouseDown: this.onMouseMove(event).bind(this)
            },this);*/
        }
    },
    
    initPhysics: function () {
        
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);
        
        var layer = this;
        
        this.space.addCollisionHandler(1, 0, function (arbiter, space) {
            // TODO do something
            console.log(arbiter.a, arbiter.b);
        }, null, null, null);
    },
    update: function (dt) {
        this.space.step(dt);
    }
});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});



// zeroxy