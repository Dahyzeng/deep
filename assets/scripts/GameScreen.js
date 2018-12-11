
cc.Class({
    extends: cc.Component,

    properties: {
        back: {
            default: null,
            type: cc.Node
        },
        floor: {
            default: null,
            type: cc.Node
        },
        speed: 50,
        height: 0
       
    },

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
       
        for (let i = 0; i < 3; i++) {
            let back = cc.instantiate(this.back);
            back.setPosition(0, -i * 482);
            back.active = true;
            this.node.addChild(back);
        }
    },

    update(dt) {
        this.height += Math.round(this.speed * dt);
        if (this.height >= 120) {
            let scene = cc.director.getScene();
            this.height = 0;
            let floor = cc.instantiate(this.floor);
            floor.setPosition(Math.floor(320 * Math.random()), -36);
            floor.active = true;
            scene.addChild(floor);
        }
    }

});
