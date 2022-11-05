
// d = d || Date.UTC(2050, 0, 1); 
export default function Countdown () {
    // 设置目标时间点:2020年1月25日0点0分0秒。 这个时间是固定的，不用写在计时器里每次都获取。
    //let  tagDate = new Date(2020 , 0 , 25);
    let tagDate =new Date(Date.UTC(2022, 5, 9, 12, 0, 0));
    // 获取目标跟 1970.1.1 的时间差
    let  tagGetTime = tagDate.getTime();
    // 获取标签
    let  showTime = document.getElementById("mint");
 
    let timeGoFun = ()=>{
        let  now = new Date();
        // 获取时间差，单位“毫秒”
        let  disTime = Math.abs( tagGetTime-now.getTime());
 
        // 判断是否时间到了指定点
        // 是，就终止计时器，终结函数运行。
        if( disTime===0 ){
            showTime.innerHTML = "Minting Time !";
            clearInterval(myset);
            return false;
        }
        disTime = Math.floor( disTime/1000 );  // 把毫秒，转为秒
        let miao =  disTime % 60 ;  // 秒
        let fen = Math.floor( disTime / 60 % 60 );  // 分
        let xiaoshi = Math.floor( disTime / 60 / 60  ) % 24;  // 小时
        let tian = Math.floor( disTime / 60 / 60 / 24 );  // 天
 
        // 显示时间。利用了 ES6 的模版字符串，好处是可以存放变量。
        showTime.innerHTML = `${tian}D${xiaoshi}H${fen}M${miao}S`;
    };
 
   // 启动计时器，让时间走动起来。
   let myset =  setInterval(()=>{
        timeGoFun();
    },1000);

};

      
    // var futureDate = eval(Date.UTC(2019, 11, 30, 12, 0, 0));


   // var futureDate = eval(Date.UTC(2022, 6, 9, 12, 0, 0));
