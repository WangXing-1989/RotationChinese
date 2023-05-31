import Model from "./Model";


export default class GHttp {
    private static _instance: GHttp = null;
    /**游戏名字 */
    private gameName: string = "旋转汉字"
    /**服务器地址 */
    private serverUrl: string = "https://www.jiaozi.ink/v1/";

    private userdate: string = ''
    /**账号名字 */
    private userName: string = ""
    /**手机号 */
    private userPhone: string = ""
    private userId: string = "";
    /**token */
    private authToken: string = "";

    /**超时时间 */
    private outTime: number = 5000
    private gameId: string = "";
    /* */

    /**获取工具类单例 */
    static get instance(): GHttp {
        if (!this._instance) {
            this._instance = new GHttp();
        }
        return this._instance;
    }



    /*同步登录 */
    synclogin(account: string, mobile: string) {
        return new Promise<any>((resovle, reject) => {
            this.sendPost("sign-up",
                {
                    name: account,
                    mobile: mobile
                },
                (res) => {
                    if (res.code == 200) {
                        resovle(res)
                    } else {
                        reject(res)
                    }
                }
            )
        })
    }

    /**异步登录 */
    login(callback?: Function) {

        this.getAccount()

        let account = this.userName
        let mobile = this.userPhone
        this.sendPost("sign-up",
            {
                name: account,
                mobile: mobile
            },
            (res) => {
                if (res.resid == 200) {
                    let data = res.data.data
                    if (data.auth_token) {

                        this.authToken = data.auth_token
                    }
                    if (data.id) {
                        this.userId = data.id
                    }
                    // GHttp.instance.GetuserInfo()
                    GHttp.instance.GetGameId()


                    callback && callback(1)
                } else {
                    callback && callback(0)
                }
            }
        )
    }


    /**上报游戏数据 */
    upLoadGameData() {
        // this.cleanToken()
        // this.authToken="eyJhbGciOiJIUzUxMiIsImlhdCI6MTY4MDA3OTQ0NCwiZXhwIjoxNjgyNjcxNDQ0fQ.eyJjb25maXJtX2lkIjoxOTF9.pYWrmoAc8oemLRorPh2dK6kwtbLsmdQHBBen7jMukb7psPhSqzWdLFy9RqA-Zln3nPu_a_CnK1nX-AVhbTzguQ"

        this.sendPost("break-record",
            {
                gameId: this.gameId,
                // 需要传的参数
                gameName: this.gameName,
                gameScoure: Model.curScore, //游戏得分
                accuracy: Model.accuracy, //正确率
                averageReaction: Model.averageReaction, //平均反应时
                NumberOfTasks: Model.curLevel, //完成任务次数
                LevelDifficultyEnd: Model.curLevel, //结束时所处难度水平
                date: this.userdate

            },
            (res) => {
                cc.log(res)
                if (res.resid == 200) {
                    cc.log(res)
                } else {

                }
            }
        )
    }


    /**
     * 设置token
     * @param token token值
     */
    setToken(token: string) {
        this.authToken = token
    }
    cleanToken() {
        this.authToken = "";
    }



    sendPost(url: string, param: object, callback: Function) {

        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {

            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                let respone = xhr.responseText;
                let res = JSON.parse(respone);
                console.log("服务器返回的数据:", res)
                callback(res)
            } else if (xhr.readyState === 4 && xhr.status === 0) {//无网络，无法发出请求
                callback(null);
            } else if (xhr.readyState === 4 && xhr.status === 403) {//无网络，域名无法访问
                console.log("域名无法访问")
                callback(null)
            }

        };

        let finalUrl = this.serverUrl + url;

        xhr.open("POST", finalUrl, true);

        xhr.ontimeout = () => {
            callback(xhr.status)
            console.log("请求超时了", "状态：", xhr.status);
            xhr.abort();
        };

        xhr.onerror = () => {
            console.log("请求失败", "状态：", xhr.status);
            callback(xhr.status)
        }

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', '*');
        xhr.setRequestHeader('app-type', 'w-apple');
        xhr.setRequestHeader('api-type', 'app');
        if (this.authToken != "") {

            xhr.setRequestHeader('auth-token', this.authToken);
        }
        if (this.userId != "") {
            xhr.setRequestHeader('current-user-id', this.userId)
        }
        xhr.timeout = this.outTime;
        console.log("发送的数据:", param)
        xhr.send(JSON.stringify(param));
    }


    sendGet(url: string, param: object, callback: Function, log: boolean = true) {
        let paramStr = this.getParamsStr(param);
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                let respone = xhr.responseText;
                let res = JSON.parse(respone);
                callback(res)
                log && console.log("getRequest:获取数据成功", JSON.stringify(res));
            } else if (xhr.readyState === 4 && xhr.status === 0) {//无网络，无法发出请求
                callback(null);
            } else if (xhr.readyState === 4 && xhr.status === 403) {//无网络，域名无法访问
                console.log("域名无法访问")
                callback(null)
            }
        };

        let finalUrl = this.serverUrl + url + paramStr;

        xhr.open("GET", finalUrl, true);

        xhr.ontimeout = () => {
            callback(xhr.status)
            console.log("请求超时了", "状态：", xhr.status);
            xhr.abort();
        };

        xhr.onerror = () => {
            console.log("请求失败", "状态：", xhr.status);
            callback(xhr.status)
        }

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', '*');
        xhr.setRequestHeader('app-type', 'w-apple');
        xhr.setRequestHeader('api-type', 'app');

        if (this.authToken != "") {
            xhr.setRequestHeader('auth-token', this.authToken);

        }
        if (this.userId != "") {
            xhr.setRequestHeader('current-user-id', this.userId)
        }
        xhr.timeout = 10000;

        xhr.send();
    }


    /**编码打包截取成新的 字符串数据
     * @param params  要发送的数据或 get请求后面的数据
    */
    getParamsStr(params: object) {
        let str = "?";
        for (let key in params) {
            str = str + key + "=" + encodeURIComponent(params[key]) + "&";
        }
        if (str.length > 0) {
            str = str.substr(0, str.length - 1);
        }
        return str
    }
    getNowDate() {
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate(); //获取当前日
        var hours = myDate.getHours(); //获取当前小时
        var minutes = myDate.getMinutes(); //获取当前分钟
        var seconds = myDate.getSeconds(); //获取当前秒
        var now =
            year +
            "-" +
            mon +
            "-" +
            date +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
        return now;
    }
    /**获取登录凭证 */
    getAccount() {
        // 测试用的不用管
        let defulturl =
            "https://aginghealth-1309764129.cos.ap-beijing.myqcloud.com/Fasttest/web-mobile/index.html?userName=案发时&userPhone=18730178314&date=2023-03-31 23:25:41";



        let param = window.location.href.split("?")[1] || defulturl.split("?")[1];
        console.log("数据部分:", param);
        if (param.indexOf("userName") === -1 || param.indexOf("userPhone") === -1) {
            console.log("没有训练参数");
            return;
        } else {
            if (param.indexOf("date") === -1) {
                this.userdate = this.getNowDate();

                let regname = new RegExp("(^|&)" + "userName" + "=([^&]*)(&|$)", "i");
                let regphone = new RegExp("(^|&)" + "userPhone" + "=([^&]*)(&|$)", "i");
                let userName = decodeURIComponent(param).match(regname)[2];
                let userPhone = decodeURIComponent(param).match(regphone)[2];
                // console.log(param)
                console.log("username:", decodeURI(userName));
                console.log("userphone:", userPhone);

                this.userName = decodeURI(userName);
                this.userPhone = userPhone;
            } else {
                let regname = new RegExp("(^|&)" + "userName" + "=([^&]*)(&|$)", "i");
                let regphone = new RegExp("(^|&)" + "userPhone" + "=([^&]*)(&|$)", "i");
                let regdate = new RegExp("(^|&)" + "date" + "=([^&]*)(&|$)", "i");
                let userName = decodeURIComponent(param).match(regname)[2];

                let userPhone = decodeURIComponent(param).match(regphone)[2];
                let userdate = decodeURIComponent(param).match(regdate)[2];
                // console.log(param)
                console.log("username:", decodeURI(userName));
                console.log("userphone:", userPhone);
                console.log("userdate:", userdate);
                this.userName = decodeURI(userName);
                this.userPhone = userPhone;
                this.userdate = userdate;
            }
        }
    }

    /**获取基本信息    暂时不用可注销*/
    GetuserInfo(callback?: Function) {
        // this.getAccount()
        // 用于测试  ，打包需要 注释掉
        //  this.cleanToken()
        //  this.authToken="eyJhbGciOiJIUzUxMiIsImlhdCI6MTY4MDA3OTQ0NCwiZXhwIjoxNjgyNjcxNDQ0fQ.eyJjb25maXJtX2lkIjoxOTF9.pYWrmoAc8oemLRorPh2dK6kwtbLsmdQHBBen7jMukb7psPhSqzWdLFy9RqA-Zln3nPu_a_CnK1nX-AVhbTzguQ"




        this.sendGet("user-basic-info",
            {

            },
            (res) => {
                if (res.resid == 200) {
                    let data = res.data.data
                    // cc.log(data)
                    // needData1.birthData=data.birthday.replace(/\s[\x00-\xff]*/g,'')
                    // this.userName=data.name
                    // cc.log(needData1.birthData)

                    callback && callback(1)
                } else {
                    callback && callback(0)
                }
            }
        )
    }

    /**异步登录 */
    GetGameId(callback?: Function) {
        // this.getAccount()
        let account = this.userName
        let mobile = this.userPhone

        // 用于测试  ，打包需要 注释掉
        //   this.cleanToken()
        // this.authToken="eyJhbGciOiJIUzUxMiIsImlhdCI6MTY4MDA3OTQ0NCwiZXhwIjoxNjgyNjcxNDQ0fQ.eyJjb25maXJtX2lkIjoxOTF9.pYWrmoAc8oemLRorPh2dK6kwtbLsmdQHBBen7jMukb7psPhSqzWdLFy9RqA-Zln3nPu_a_CnK1nX-AVhbTzguQ"
        // 用于测试  ，打包需要 注释掉

        this.sendGet("admin/game-name-all",
            {
                //   id:this.userId
                pages: 2
            },
            (res) => {
                if (res.resid == 200) {
                    let data = res.data.data
                    console.log(data)
                    //  pages 要写 写自己的游戏的pages

                    for (let gamedata of data) {

                        // 这里写自己的游戏名字
                        if (gamedata.game_name == this.gameName) {
                            this.gameId = gamedata.id

                        }

                    }

                    callback && callback(1)
                } else {
                    callback && callback(0)
                }
            }
        )
    }


}


