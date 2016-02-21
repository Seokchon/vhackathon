
function Wall(space, v1, v2) {
    
    var shape = new cp.SegmentShape(space.staticBody, v1, v2, 0);
    
    shape.setElasticity(1);
    shape.setFriction(0);
    //shape.setCollisionType(1);
    
    space.addStaticShape(shape);
    
    return shape;
}