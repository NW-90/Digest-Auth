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
            "Cookie":(step=== 0)? '': getCookie
        },
    
    };
    return option;
}



function main (){

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
    
                setCookie = res.headers['set-cookie'];
                //console.log(setCookie[0]);
            }
            console.log(data.toString());
        }
        
    };
    setInterval(() => {
        console.log(count)
        
        if (count=== 1){
            buffer = setCookie;
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

main();