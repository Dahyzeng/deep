cc.Class({
    extends: cc.Component,
    properties: {
        speed: 100,
        floorFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },

        //0:普通地板，1：冰块地板，2：弹簧地板，3：铁钉地板
        floorType: 0
    },

    onLoad() {
        let random = Math.floor(3 * Math.random());
        this.floorType = random;
        this.node.getComponent(cc.Sprite).spriteFrame = this.floorFrames[random];
    },

    onCollisionEnter: function (other, self) {
        if (other.node.name === 'top') {
            this.node.destroy();
        }
        if (other.node.name === 'hero') {
            if (this.floorType === 1) {
                this.animation = this.node.getComponent(cc.Animation);
                this.animation.play('ice_floor_destory');
                setTimeout(() => {
                    this.node.destroy()
                }, 1000)
            }
            if (this.floorType === 2) {
                this.animation = this.node.getComponent(cc.Animation);
                this.animation.play('spring_floor');
            }
        }
    },
    update (dt) {
        this.node.y += this.speed * dt;
    },
});
