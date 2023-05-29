import Model from "./Model";
import Result from "./Result";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Node)
    lianxi_1: cc.Node = null;

    @property(cc.Node)
    lianxi_2: cc.Node = null;

    @property(cc.Node)
    lianxi_3: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    sourceLabel: cc.Label = null;

    @property(cc.Node)
    front: cc.Node = null; // 正面

    @property(cc.Node)
    opposite: cc.Node = null; // 镜像

    @property(cc.Node)
    parent: (cc.Node) = null;

    @property(Result)
    result: (Result) = null;

    @property(cc.Node)
    cover: (cc.Node) = null;

    @property(cc.Node)
    startGameBtn: (cc.Node) = null;

    @property(cc.Node)
    hand: (cc.Node) = null;

    @property(cc.AudioClip)
    audioTips1: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioTips2: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioTips3: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioRight: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioWrong: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioPlease: cc.AudioClip = null;

    private handTween: cc.Tween;

    start() {
        this.init();
    }

    private init() {
        Model.curLevel = 0;
        this.stopHand();
    }

    private clickStartGameBtn() {
        this.show_lianxi_1();

        this.cover.active = true;
        this.cover.opacity = 255;
        cc.tween(this.cover)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.cover.active = false;
                this.cover.opacity = 255;
            })
            .start();
    }

    private show_lianxi_1() {
        this.lianxi_1.active = true;
        this.lianxi_2.active = false;
        this.lianxi_3.active = false;
        this.content.active = false;
        this.hand.active = false;
    }

    private show_lianxi_2() {
        this.lianxi_1.active = false;
        this.lianxi_2.active = true;
        this.lianxi_3.active = false;
        this.content.active = false;
        this.hand.active = false;
    }

    private show_lianxi_3() {
        this.lianxi_1.active = false;
        this.lianxi_2.active = false;
        this.lianxi_3.active = true;
        this.content.active = false;
        this.hand.active = false;

        this.set_lianxi_3(1);
    }

    private set_lianxi_3(step: 1 | 2 | 3) {
        let label1: cc.Node = this.lianxi_3.getChildByName("label1");
        let label2: cc.Node = this.lianxi_3.getChildByName("label2");
        let label3: cc.Node = this.lianxi_3.getChildByName("label3");
        label1.active = step == 1;
        label2.active = step == 2;
        label3.active = step == 3;
    }

    private clickBg() {
        if (this.lianxi_1.active) {
            this.show_lianxi_2();
        } else if (this.lianxi_2.active) {
            this.show_lianxi_3();
        } else if (this.lianxi_3.active) {
            let label1: cc.Node = this.lianxi_3.getChildByName("label1");
            let label2: cc.Node = this.lianxi_3.getChildByName("label2");
            let label3: cc.Node = this.lianxi_3.getChildByName("label3");
            if (label1.active) {
                this.set_lianxi_3(2);
            } else if (label2.active) {
                this.set_lianxi_3(3);
            } else if (label3.active) {

            }
        }
    }

    public playHand(pos: cc.Vec2 = null) {
        this.hand.active = true;
        this.hand.scale = 1;
        if (pos) {
            this.hand.x = pos.x;
            this.hand.y = pos.y;
        } else {
            this.hand.x = 54;
            this.hand.y = -275;
        }

        this.handTween = cc.tween(this.hand)
            .repeatForever(
                cc.tween()
                    .by(1, { x: 30, y: -30, scale: 0.3 })
                    .by(1, { x: -30, y: 30, scale: -0.3 })
            )
            .start();
    }

    private stopHand() {
        this.handTween && this.handTween.stop();
        this.hand.active = false;
    }


    private showContent(level: number) {
        
    }

    // update (dt) {}
}
