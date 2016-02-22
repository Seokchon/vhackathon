
var Wall = cc.Sprite.extend({
    ctor: function(rect) {
        
        this._super();
        
        this.setColor(new cc.Color(30, 30, 30, 255));
        this.setAnchorPoint(0, 0);
        this.setPosition(rect.x, rect.y);
        this.setTextureRect(rect);
    }
});