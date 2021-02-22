
//ใช้ npm urllib
const httpClient = require('urllib');


function options(step,command,cookie){

    if(cookie != ''){
        var getCookie = cookie[0] + ';' + cookie[1];
        console.log(getCookie);
    }

    const option = {
        method: 'POST',
        rejectUnauthorized: false,
        digestAuth:(step=== 0)? "Default User:robotics":'', 
        content:(command==='start')? "regain=clear&execmode=continue&cycle=once&condition=none&stopatbp=disabled&alltaskbytsp=true":'',        
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            "Cookie":(step=== 0)? '': getCookie //รับ cookie จาก Inteval รอบแรก
        },
    
    };
    return option;
}



function main (){
    // คำสั่ง url ส่งไปหา Robot เพื่อสั่ง start,stop ใน code เขียน วนซ้ำเพื่อทดสอบ cookie
    var url = ["http://127.0.0.1:100/rw/rapid/execution?action=start","http://127.0.0.1:100/rw/rapid/execution?action=stop"];

    // var urlStart = "http://127.0.0.1:100/rw/rapid/execution?action=start";
    // var urlStop ="http://127.0.0.1:100/rw/rapid/execution?action=stop";

    var setCookie ='';
    var count = 0;
    var buffer ='';
    var currentUrl = 0;
    const responseHandler= (err, data, res) => {
        if (err) {
            console.log(err);
        } else {
    
            console.log(res.statusCode);
            //console.log(res.headers);
            if (res.statusCode != 401) {
    
                setCookie = res.headers['set-cookie']; //เก็บค่า cookie จากการอ่าน set-cookie ที่ได้รับจาก Robot
                //console.log(setCookie[0]);
            }
            console.log(data.toString());
        }
        
    };
    setInterval(() => {
        console.log(count)
        
        if (count=== 1){
            buffer = setCookie;  //วนรอบแรกด้วยการ login จากนั้นรอบที่ 2 ให้เก้บค่า cookie
        }

        if(currentUrl===url.length-1){
            currentUrl=0;
        }else {
            currentUrl+=1;
        }

        httpClient.request(url[currentUrl], options(count,'start',buffer), responseHandler);
        console.log(setCookie);
        
        if(count <1){

            count = count+1;
        }

    }, 2000);
}

main(); //ผลทดสอบทำงานได้ Robot start,stop,start,stop....
