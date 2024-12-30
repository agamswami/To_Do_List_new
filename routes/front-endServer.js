const express = require("express");
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.resolve(path.join(__dirname , "../", 'public' ))))


app.get("/index",function(req , res){
    const filepath = path.resolve(path.join(__dirname , "../", 'public' , 'index.html'));
    res.sendFile(filepath);
});

app.get("/toDo",function(req , res){
    const filepath = path.resolve(path.join(__dirname , "../", 'public' , 'toDO.html'));
    res.sendFile(filepath);
});

app.get("/signin",function(req , res){
    const filepath = path.resolve(path.join(__dirname , "../", 'public' , 'signin.html'));
    res.sendFile(filepath);
});


app.listen(3001);