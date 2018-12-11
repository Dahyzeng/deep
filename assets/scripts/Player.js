cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,

        //0：站立，1：奔跑状态，2：下落状态，3：上升状态
        heroStatus: 0,
        fallSpeed: -400,

    },

    onLoad() {
        this.animation = this.node.getComponent(cc.Animation);
        this.startFrame = this.node.getComponent(cc.Sprite).spriteFrame
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
    },

    onCollisionEnter: function (other, self) {
        if (other.node.name === 'wall') {
            this.node.x = this.preNodeX;
            this.moveSpeed.x = 0;
        }
        if (other.node.name === 'floor') {
            const selfAabb = self.world.aabb;
            const selfPreAabb = self.world.preAabb.clone();
            const otherAabb = other.world.aabb;
            const otherPreAabb = other.world.preAabb.clone();


            // 2nd step
            // forward x-axis, check whether collision on x-axis
            selfPreAabb.x = selfAabb.x;
            otherPreAabb.x = otherAabb.x;

            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
                this.moveSpeed.x = 0;
                return;
            }

            // 3rd step
            // forward y-axis, check whether collision on y-axis
            selfPreAabb.y = selfAabb.y;
            otherPreAabb.y = otherAabb.y;

            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
                if (other.node.getComponent('Floor').floorType === 2) {
                    this.heroStatus = 3;
                    this.moveSpeed.y = 500;
                } else {
                    this.heroStatus = 0;
                    this.moveSpeed.y = other.node.getComponent('Floor').speed;
                    this.node.getComponent(cc.Sprite).spriteFrame = this.startFrame
                }
            }   
        }
        
    },

    onCollisionExit(other, self) {
        if (other.node.name === 'floor'){
            if (this.heroStatus === 3) {
                this.animation.play('hero_jump');
                setTimeout(() => {
                    this.heroStatus = 2;
                    this.moveSpeed.y = this.fallSpeed
                }, 200)
            } else {
                this.playing = false;
                this.animation.play('hero_jump');
                this.heroStatus = 2;
                this.moveSpeed.y = this.fallSpeed;
            }
        }
    },

    onCollisionStay(other, self) {
        if (other.node.name === 'wall') {
            this.node.x = this.preNodeX;
            this.moveSpeed.x = 0;
        }
    },

    onKeyDown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.playerRun('left');
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.playerRun('right');
                break;
        }
    },

    onKeyUp() {
        this.moveSpeed.x = 0;
        this.playing = false;
        if (this.heroStatus === 1) {
            this.heroStatus = 0;
            this.animation.stop();
            this.node.getComponent(cc.Sprite).spriteFrame = this.startFrame
        }
    },
    update(dt) {
        this.preNodeX = this.node.x;
        this.preNodeY = this.node.y;

        if (this.heroStatus === 2 || this.heroStatus === 3) {
            this.moveSpeed.y += this.gravity * dt;
            if (Math.abs(this.moveSpeed.y) > this.maxSpeed.y) {
                this.moveSpeed.y = this.moveSpeed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }
        this.node.x += this.moveSpeed.x * dt;
        this.node.y += this.moveSpeed.y * dt;
    },

    playerRun(direction) {
        if (this.heroStatus !== 2 && this.heroStatus !== 3) {
            this.heroStatus = 1;
            if (!this.playing) {
                this.playing = true;
                this.animation.play('hero_run');
            }
        }
       
        if (direction === 'left') {
            this.node.scaleX = -1;
            this.moveSpeed.x = -200;
        } else {
            this.node.scaleX = 1;
            this.moveSpeed.x = 200;
        }
    }
});
