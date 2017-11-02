const expr = require('express');
const app = expr();
const mymodule = require('./mymodule')



app.get("/",function(request,response){
    let u = ""
    for(let i=0;i<mymodule.cardholderName.length;i++){
        u += "<h1>" + mymodule.cardholderName[i] +"</h1></ br>"
    }
    response.send(u);
    response.end();
})

app.get("/myapp/:id",function(request,response){
    if(request["params"]["id"] == "2")
    {
        response.send("<h1>Good Moooood</h1>")
    }else{
        let u = request["params"]["id"];
        response.send(u)
    }
})

 app.listen(9000,function(error){
    if(error == true){
        consle.log("There's an error in the matrix");
    }else{
        console.log("listening");
    }

 })