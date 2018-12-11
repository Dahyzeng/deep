
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100
    },

    update (dt) {
        if (this.node.y >= this.node.height) {
            this.node.y = -this.node.height + 1;
        } else {
            this.node.y += this.speed * dt;
        }
    },
});
