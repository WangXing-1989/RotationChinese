export default class Model {
    public static gameId: number;
    public static gameName: string = "旋转汉字";
    public static curLevel: 0 | 1 | 2 | 3 | 4; // 当前难度等级
    public static curScore: number; // 分数
    public static accuracy: number; // 准确率
    public static averageReaction: number; // 平均用时
    public static totalTime: number = 120; // 总时间
    public static curTime: number = 0; // 当前剩余时间

    public static curPage: number = 0; // 当前第几页（对应Config中每个难度的pageCount）

    public static answers: {score: number, list: {time: number, isCorrect: boolean}[]}[] = [
        {
            score: 0,
            list: []
        }
    ];
}