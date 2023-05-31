export default class Model {
    public static gameId: number;
    public static gameName: string = "旋转汉字";
    public static curLevel: 0 | 1 | 2 | 3 | 4; // 当前难度等级
    public static curScore: number = 0; // 分数
    public static accuracy: number; // 准确率
    public static averageReaction: number; // 平均用时
    public static totalTime: number = 120; // 总时间
    public static curTime: number = 0; // 当前剩余时间

    public static curPage: number = 0; // 当前第几页（对应Config中每个难度的pageCount）

    public static answers: {score: number, list: {time: number, isCorrect: boolean}[]}[];

    public static initAnswers() {
        this.answers = [
            {
                score: 0,
                list: []
            },
            {
                score: 0,
                list: []
            },
            {
                score: 0,
                list: []
            },
            {
                score: 0,
                list: []
            },
            {
                score: 0,
                list: []
            }
        ];
    }

    public static updateAverageReaction() {
        let allRightTime: number = 0;
        let rightNum: number = 0;
        for (let i = 0; i < this.answers.length; i++) {
            for (let j = 0; j < this.answers[i].list.length; j++) {
                if (this.answers[i].list[j].isCorrect) {
                    rightNum++;
                    allRightTime += this.answers[i].list[j].time;
                }
            }
        }
        this.averageReaction = parseFloat((allRightTime / rightNum).toFixed(2));
    }
    
    /** 更新正确率 */
    public static updateAccuracy() {
        let totalNum: number = 0;
        let rightNum: number = 0;
        for (let i = 0; i < this.answers.length; i++) {
            for (let j = 0; j < this.answers[i].list.length; j++) {
                totalNum++;
                if (this.answers[i].list[j].isCorrect) {
                    rightNum++;
                }
            }
        }
        this.accuracy = parseFloat((rightNum / totalNum).toFixed(2));
    }
}