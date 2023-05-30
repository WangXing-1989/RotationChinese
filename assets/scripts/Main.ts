import { Config } from "./Config";
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
    scoreLabel: cc.Label = null;

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

    @property(cc.Node)
    clickNode: cc.Node = null;

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
    private levelData: any;
    private startPos: cc.Vec2; // 汉字的初始位置
    private startTime: number;
    private endTime: number;

    start() {
        this.init();
    }

    private init() {
        Model.curLevel = 0;
        this.stopHand();
        this.cover.active = true;
        this.clickNode.active = true;
        this.timeLabel.node.parent.active = false;
        this.scoreLabel.node.parent.active = false;
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

        Model.curPage = 1;
        this.showContent();
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

                this.clickNode.active = false;
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


    private showContent() {
        this.content.active = true;

        this.levelData = Config[`level_${Model.curLevel}`];
        let hanziUrlList: string[] = this.getRandomList(this.levelData.urlList, this.levelData.hanziCount);
        console.log("hanziUrlList : " + hanziUrlList);

        this.parent.removeAllChildren();
        for (let i = 0; i < hanziUrlList.length; i++) {
            let zmNode: cc.Node = this.createHanzi(hanziUrlList[i], 1);
            let jxNode: cc.Node = this.createHanzi(hanziUrlList[i], 2);
            zmNode.x = Math.random() * 650 - 325;
            zmNode.y = Math.random() * 400 - 200;
            jxNode.x = Math.random() * 650 - 325;
            jxNode.y = Math.random() * 400 - 200;
            this.parent.addChild(zmNode);
            this.parent.addChild(jxNode);
            zmNode.on(cc.Node.EventType.TOUCH_START, this.onStartHanzi, this);
            jxNode.on(cc.Node.EventType.TOUCH_START, this.onStartHanzi, this);
        }

        this.startTime = new Date().getTime();
    }

    private onStartHanzi(e: cc.Event.EventTouch) {
        this.startPos = e.currentTarget.getPosition();
        e.currentTarget.on(cc.Node.EventType.TOUCH_MOVE, this.onMoveHanzi, this);
        e.currentTarget.on(cc.Node.EventType.TOUCH_END, this.onEndHanzi, this);
        e.currentTarget.on(cc.Node.EventType.TOUCH_CANCEL, this.onEndHanzi, this);
    }

    private onMoveHanzi(e: cc.Event.EventTouch) {
        e.currentTarget.x += e.getDeltaX();
        e.currentTarget.y += e.getDeltaY();
    }

    private onEndHanzi(e: cc.Event.EventTouch) {
        e.currentTarget.off(cc.Node.EventType.TOUCH_MOVE, this.onMoveHanzi, this);
        e.currentTarget.off(cc.Node.EventType.TOUCH_END, this.onEndHanzi, this);
        e.currentTarget.off(cc.Node.EventType.TOUCH_CANCEL, this.onEndHanzi, this);

        let hanzi: cc.Node = e.currentTarget;
        if (this.front.getBoundingBoxToWorld().contains(e.getLocation())) { // 拖到正面框中
            let obj: {time: number, isCorrect: boolean} = {time: 0, isCorrect: false};
            obj.time = Math.round((new Date().getTime() - this.startTime) / 1000);
            this.startTime = new Date().getTime();

            if (hanzi.scaleX == 1) {
                this.result.showRight(this.front.getPosition());
                obj.isCorrect = true;
            } else {
                this.result.showWrong(this.front.getPosition());
                obj.isCorrect = false;
            }
            hanzi.removeFromParent();
            Model.answers[Model.curLevel].list.push(obj);
            console.log("Model.answers : " + Model.answers);
        } else if (this.opposite.getBoundingBoxToWorld().contains(e.getLocation())) { // 拖到镜像框中
            let obj: {time: number, isCorrect: boolean} = {time: 0, isCorrect: false};
            obj.time = Math.round((new Date().getTime() - this.startTime) / 1000);
            this.startTime = new Date().getTime();

            if (hanzi.scaleX == -1) {
                this.result.showRight(this.opposite.getPosition());
                obj.isCorrect = true;
            } else {
                this.result.showWrong(this.opposite.getPosition());
                obj.isCorrect = false;
            }
            hanzi.removeFromParent();
            Model.answers[Model.curLevel].list.push(obj);
            console.log("Model.answers : " + Model.answers);
        } else {
            hanzi.x = this.startPos.x;
            hanzi.y = this.startPos.y;
        }
    }

    private checkScore() {

    }

    private checkResult() {
        if (this.parent.childrenCount <= 0) {
            if (Model.curPage < this.levelData.pageCount) {
                Model.curPage++;
                this.showContent();
            } else {
                let allList = Model.answers[Model.curLevel].list;
                let correctList = allList.filter(item => item.isCorrect);
                if (correctList.length / allList.length >= this.levelData.need) { // 过关
                    if (Model.curLevel < 4) {
                        if (Model.curLevel == 0) {
                            this.result.showWin();
                        } else {
                            this.result.showUpLevel();
                        }
                    } else {
                        this.result.showAllWin(Model.curScore);
                    }
                } else {
                    Model.curPage = 1;
                    this.showContent();
                }
            }
        }
    }

    private createHanzi(url: string, type: 1 | 2) {
        let node: cc.Node = new cc.Node(url.substring(url.lastIndexOf("/") + 1));
        node.scaleX = type == 1 ? 1 : -1;
        let sprite: cc.Sprite = node.addComponent(cc.Sprite);
        cc.resources.load(url, cc.Texture2D, (err, res: cc.Texture2D) => {
            if (!err) {
                sprite.spriteFrame = new cc.SpriteFrame(res);
                node.width = res.width;
                node.height = res.height;
            }
        });
        return node;
    }

    private getRandomList(array: any[], count: number): any[] {
        let arr1 = array.filter(() => true);
        let newArr = [];
        while (newArr.length < count) {
            let random = Math.floor(Math.random() * arr1.length);
            if (random > arr1.length - 1) {
                random = arr1.length - 1;
            }
            newArr.push(arr1.splice(random, 1)[0]);
        }
        return newArr;
    }

    // update (dt) {}
}
