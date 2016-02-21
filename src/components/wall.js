
function Wall(space, v1, v2, reset) {
    
    var panel = new cc.Sprite();
    
    panel.setColor(new cc.Color(50, 50, 50, 255));
    panel.setAnchorPoint(0, 0);
    panel.setTextureRect(cc.rect(0, 0, v2.x - v1.x, v2.y - v1.y));
    panel.setPosition(v1.x, v1.y);
    
    console.log(v1.x, v1.y, v2.x, v2.y);
    
    var shape = new cp.SegmentShape(space.staticBody, v1, v2, 0);
    
    shape.setElasticity(1);
    shape.setFriction(0);
    
    space.addStaticShape(shape);
    
    if (!!reset) {
        shape.reset = true;
    }
    
    return panel;
}