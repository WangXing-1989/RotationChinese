import GHttp from "./GHttp";
import Main from "./Main";
import Model from "./Model";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Result extends cc.Component {

    @property(cc.Node)
    win: cc.Node = null;

    @property(cc.Node)
    lost: cc.Node = null;

    @property(cc.Node)
    upLevel: cc.Node = null;

    @property(cc.Node)
    allWin: cc.Node = null;

    @property(cc.Node)
    timeOut: cc.Node = null;

    @property(cc.Node)
    right: cc.Node = null;

    @property(cc.Node)
    wrong: cc.Node = null;

    @property(sp.Skeleton)
    lihua: sp.Skeleton = null;

    private main: Main;

    start() {
        this.main = cc.find("Canvas").getComponent(Main);
        this.node.active = false;
        this.hideAllDialog();
    }

    public showWin() {
        this.node.active = true;
        this.hideAllDialog();
        this.playShow(this.win);
        this.playLihua();
    }

    public showLost() {
        this.node.active = true;
        this.hideAllDialog();
        this.playShow(this.lost);
    }

    public showUpLevel() {
        this.node.active = true;
        this.hideAllDialog();
        this.playShow(this.upLevel);
        this.playLihua();
    }

    public showAllWin(integral: number) {
        this.node.active = true;

        let label = cc.find("layout/source", this.allWin).getComponent(cc.Label);
        label.string = "" + integral;

        this.hideAllDialog();
        this.playShow(this.allWin);
        this.playLihua();

        this.upload();
    }

    public showTimeOut(integral: number) {
        this.node.active = true;

        let label = this.timeOut.getChildByName("source").getComponent(cc.Label);
        label.string = `您的得分是：${integral}分`;

        this.hideAllDialog();
        this.playShow(this.timeOut);

        this.upload();
    }

    public showRight(startPos: cc.Vec2) {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioRight, false);
        this.node.active = true;
        this.hideAllDialog();
        this.right.active = true;
        this.right.x = startPos.x;
        this.right.y = startPos.y;
        let spine: sp.Skeleton = this.right.getChildByName("starSpine").getComponent(sp.Skeleton);
        spine.setAnimation(0, "shibiemubiao", false);
        cc.tween(this.right)
            .by(0.7, { y: 150 })
            .call(() => {
                this.right.active = false;
                this.node.active = false;
            })
            .start();
    }

    public showWrong(startPos: cc.Vec2) {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioWrong, false);
        this.node.active = true;
        this.hideAllDialog();
        this.wrong.active = true;
        this.wrong.x = startPos.x;
        this.wrong.y = startPos.y;
        cc.tween(this.wrong)
            .by(0.7, { y: 150 })
            .call(() => {
                this.wrong.active = false;
                this.node.active = false;
            })
            .start();
    }

    private playShow(dialog: cc.Node) {
        dialog.active = true;
        dialog.scale = 0;
        cc.tween(dialog).to(0.5, { scale: 1 }, { easing: 'elasticOut' }).start();
    }

    private playHide(dialog: cc.Node) {
        dialog.scale = 1;
        cc.tween(dialog).to(0.5, { scale: 0 }, { easing: 'elasticIn' }).call(() => dialog.active = false).start();
    }

    private playLihua() {
        this.lihua.node.active = true;
        this.lihua.setAnimation(0, "lihua", false);
    }

    public hideAllDialog() {
        this.win.active = false;
        this.lost.active = false;
        this.upLevel.active = false;
        this.allWin.active = false;
        this.timeOut.active = false;
        this.right.active = false;
        this.wrong.active = false;
        this.lihua.node.active = false;
    }

    /** 点击开始游戏按钮 */
    private clickStartGameBtn() {
        this.showUpLevel();
    }

    /** 点击再次练习按钮 */
    private clickTryAgainBtn() {
        Model.curPage = 1;
        Model.answers[Model.curLevel].list = [];
        this.main.showContent();
        this.node.active = false;
    }

    /** 点击开始训练按钮 */
    private clickStartXl() {
        this.main.upLevel();
        this.node.active = false;
    }

    /** 点击再来一次按钮 */
    private clickResetPlay() {
        this.main.init();
        this.node.active = false;
    }

    private upload() {
        Model.updateAccuracy();
        Model.updateAverageReaction();
        GHttp.instance.upLoadGameData();
    }
}
