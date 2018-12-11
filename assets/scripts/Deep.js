cc.Class({
    extends: cc.Component,

    properties: {
        startButton: {
            default: null,
            type: cc.Button
        },
        startPage: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.startButton.node.on('click', this.startGame, this)
    },

    startGame() {
        this.startPage.destroy();
    },

    start () {

    },

    // update (dt) {},
});
