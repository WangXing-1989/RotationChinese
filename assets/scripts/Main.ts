import { Config } from "./Config";
import GHttp from "./GHttp";
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
    private timeNum: number;

    start() {
        GHttp.instance.login();
        this.init();
    }

    public init() {
        Model.curLevel = 0;
        this.stopHand();
        this.cover.active = true;
        this.clickNode.active = true;
        this.timeLabel.node.parent.active = false;
        this.scoreLabel.node.parent.active = false;
        Model.initAnswers();
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
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.audioPlease, false);
        this.lianxi_1.active = true;
        this.lianxi_2.active = false;
        this.lianxi_3.active = false;
        this.content.active = false;
        this.hand.active = false;

        this.stopHand();
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.playHand, 2);
    }

    private show_lianxi_2() {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.audioPlease, false);
        this.lianxi_1.active = false;
        this.lianxi_2.active = true;
        this.lianxi_3.active = false;
        this.content.active = false;
        this.hand.active = false;

        this.stopHand();
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.playHand, 2);
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
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this[`audioTips${step}`], false);
        let label1: cc.Node = this.lianxi_3.getChildByName("label1");
        let label2: cc.Node = this.lianxi_3.getChildByName("label2");
        let label3: cc.Node = this.lianxi_3.getChildByName("label3");
        label1.active = step == 1;
        label2.active = step == 2;
        label3.active = step == 3;

        this.stopHand();
        this.unscheduleAllCallbacks();
        if (step == 3) {
            let hanzi = this.parent.children[0];
            let fromPos = hanzi.getPosition();
            let toPos = hanzi.scaleX == 1 ? this.front.getPosition() : this.opposite.getPosition();
            this.scheduleOnce(() => {
                this.playHand2(fromPos, toPos);
            }, 2);
        } else {
            this.scheduleOnce(this.playHand, 2);
        }
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

    public playHand() {
        this.hand.active = true;
        this.hand.scale = 1;

        this.hand.x = 0;
        this.hand.y = -230;

        this.handTween = cc.tween(this.hand)
            .repeatForever(
                cc.tween()
                    .by(1, { x: 30, y: -30, scale: 0.3 })
                    .by(1, { x: -30, y: 30, scale: -0.3 })
            )
            .start();
    }

    public playHand2(fromP: cc.Vec2, toP: cc.Vec2) {
        this.hand.active = true;
        this.hand.scale = 1;
        
        this.handTween = cc.tween(this.hand)
            .repeatForever(
                cc.tween()
                    .call(() => {
                        this.hand.x = fromP.x;
                        this.hand.y = fromP.y;
                        this.hand.opacity = 255;
                    })
                    .to(1, { x: toP.x, y: toP.y })
                    .to(0.5, {opacity: 0})
            )
            .start();
    }

    private stopHand() {
        this.handTween && this.handTween.stop();
        this.hand.active = false;
    }


    public showContent() {
        this.content.active = true;

        this.levelData = Config[`level_${Model.curLevel}`];
        let hanziUrlList: string[] = this.getRandomList(this.levelData.urlList, this.levelData.hanziCount);
        console.log("hanziUrlList : " + hanziUrlList);

        this.parent.removeAllChildren();
        let pList: cc.Vec3[] = [];
        for (let j = 0; j < this.levelData.styleCount; j++) {
            for (let i = 0; i < hanziUrlList.length; i++) {
                let zmNode: cc.Node = this.createHanzi(hanziUrlList[i], 1);
                let jxNode: cc.Node = this.createHanzi(hanziUrlList[i], 2);
                if (Model.curLevel == 0) {
                    zmNode.x = -200;
                    zmNode.y = 0;
                    jxNode.x = 200;
                    jxNode.y = 0;
                } else {
                    zmNode.position = this.getPosition(pList);
                    pList.push(zmNode.position);
                    jxNode.position = this.getPosition(pList);
                    pList.push(jxNode.position);
                    zmNode.angle = Math.floor(Math.random() * 8) * 45;
                }
                
                this.parent.addChild(zmNode);
                this.parent.addChild(jxNode);
                zmNode.on(cc.Node.EventType.TOUCH_START, this.onStartHanzi, this);
                jxNode.on(cc.Node.EventType.TOUCH_START, this.onStartHanzi, this);
            }
        }

        this.timeNum = new Date().getTime();
    }

    private getPosition(posList: cc.Vec3[]): cc.Vec3 {
        let p = cc.v3();

        // p.x = Math.floor(Math.random() * 6) * 100 - 300;
        // p.y = Math.floor(Math.random() * 4) * 100 - 200;
        // if (posList.some(item => item.x == p.x && item.y == p.y)){
        //     return this.getPosition(posList);
        // }

        p.x = Math.random() * 600 - 300;
        p.y = Math.random() * 400 - 200;
        if (posList.some(item => this.getDistance(item, p) < 150)){
            return this.getPosition(posList);
        }

        return p;
    }

    // 距离
    private getDistance(start: cc.Vec3, end: cc.Vec3): number {
        var pos = cc.v2(start.x - end.x, start.y - end.y);
        var dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
        return dis;
    }

    private onStartHanzi(e: cc.Event.EventTouch) {
        this.stopHand();
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
            obj.time = Math.round((new Date().getTime() - this.timeNum) / 1000);
            this.timeNum = new Date().getTime();

            if (hanzi.scaleX == 1) {
                this.result.showRight(this.front.getPosition());
                obj.isCorrect = true;
            } else {
                this.result.showWrong(this.front.getPosition());
                obj.isCorrect = false;
            }
            hanzi.removeFromParent();
            Model.answers[Model.curLevel].list.push(obj);
            this.updateScore(obj.isCorrect ? 10 : -5);
            this.scheduleOnce(this.checkResult, 1);
            console.log("Model.answers : " + JSON.stringify(Model.answers));
        } else if (this.opposite.getBoundingBoxToWorld().contains(e.getLocation())) { // 拖到镜像框中
            let obj: {time: number, isCorrect: boolean} = {time: 0, isCorrect: false};
            obj.time = Math.round((new Date().getTime() - this.timeNum) / 1000);
            this.timeNum = new Date().getTime();

            if (hanzi.scaleX == -1) {
                this.result.showRight(this.opposite.getPosition());
                obj.isCorrect = true;
            } else {
                this.result.showWrong(this.opposite.getPosition());
                obj.isCorrect = false;
            }
            hanzi.removeFromParent();
            Model.answers[Model.curLevel].list.push(obj);
            this.updateScore(obj.isCorrect ? 10 : -5);
            this.scheduleOnce(this.checkResult, 1);
            console.log("Model.answers : " + JSON.stringify(Model.answers));
        } else {
            hanzi.x = this.startPos.x;
            hanzi.y = this.startPos.y;
        }
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
                        if (Model.curLevel == 0) { // 练习模式
                            this.result.showWin();
                        } else { // 难度模式
                            this.result.showUpLevel();
                            this.unschedule(this.updateTime);
                        }
                    } else {
                        this.result.showAllWin(Model.curScore);
                        this.unschedule(this.updateTime);
                    }
                } else {
                    if (Model.curLevel == 0) {
                        this.result.showLost();
                    } else {
                        Model.curPage = 1;
                        Model.answers[Model.curLevel].list = [];
                        this.showContent();
                    }
                }
            }
        }
    }

    public upLevel() {
        if (Model.curLevel < 4) {
            this.lianxi_3.active = false;
            Model.curLevel++;
            if (Model.curLevel == 1) {
                this.timeLabel.node.parent.active = true;
                this.scoreLabel.node.parent.active = true;
                Model.curTime = Model.totalTime;
                this.updateScore(0);
            } else {

            }
            this.startTime();
            Model.curPage = 1;
            this.showContent();
        }
    }

    private startTime() {
        this.timeLabel.string = Model.curTime + "秒";
        this.schedule(this.updateTime, 1, Model.curTime, 1);
    }

    private updateTime() {
        if (Model.curTime > 0) {
            Model.curTime--;
            this.timeLabel.string = Model.curTime + "秒";
        } else {
            this.unschedule(this.updateTime);
            this.result.showTimeOut(Model.curScore);
        }
    }

    private updateScore(offset: number) {
        if (Model.curLevel == 0) return;

        Model.curScore += offset;
        if (Model.curScore < 0) {
            Model.curScore = 0;
        }
        this.scoreLabel.string = "得分：" + Model.curScore;
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
