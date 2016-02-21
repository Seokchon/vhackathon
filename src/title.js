
var TitleLayer = cc.LayerColor.extend({
    sprite: null,
    ctor: function () {
        this._super(cc.color(250,250,250,255));

        var size = cc.winSize;

        /*
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);

        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;

        this.addChild(helloLabel, 5);


        //480,720
        //640,960
        
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
*/
        var gametitle = new cc.Sprite(res.Gametitle_png );
        gametitle.setAnchorPoint(0, 0);
        this.addChild(gametitle);
        console.log("",size)
        
        cc.MenuItemFont.setFontSize(30);
        cc.MenuItemFont.setFontName("Impact");
        var closeItem = cc.MenuItemImage.create(//new cc.MenuItemFont.create(
          res.Start_png,
          res.StartHover_png,
          function () {
            var scene = new GameScene();
            cc.director.runScene(scene);
          },this);
        closeItem.setAnchorPoint(0.5, 0.5);
    
        var menu = new cc.Menu(closeItem);
        menu.setPosition(0, 0);
        this.addChild(menu, 1);
        closeItem.setPosition(size.width /2, size.height /2 -50);
        return true;
    }
});

var TitleScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new TitleLayer();
        this.addChild(layer);
    }
});

