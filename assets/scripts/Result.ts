import Main from "./Main";

const {ccclass, property} = cc._decorator;

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
    }

    public showTimeOut(integral: number) {
        this.node.active = true;

        let label = this.timeOut.getChildByName("source").getComponent(cc.Label);
        label.string = `您的得分是：${integral}分`;

        this.hideAllDialog();
        this.playShow(this.timeOut);
    }

    private playShow(dialog: cc.Node) {
        dialog.active = true;
        dialog.scale = 0;
        cc.tween(dialog).to(0.5, {scale: 1}, { easing: 'elasticOut'}).start();
    }

    private playHide(dialog: cc.Node) {
        dialog.scale = 1;
        cc.tween(dialog).to(0.5, {scale: 0}, { easing: 'elasticIn'}).call(() => dialog.active = false).start();
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
        this.lihua.node.active = false;
    }
}
