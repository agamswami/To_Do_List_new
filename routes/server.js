const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");


app.use(cors());
app.use(express.json());

const JWT_SECRET = "atuldev";

let users = [{
    id : "atul",
    pass: "tomer",
    data: []
}];



app.post("/signup",function(req , res){
    const givenid = req.body.id;
    const givenpass = req.body.pass;

    console.log(givenid + " " + givenpass);
    let user = users.find((x) => {
        if(x.id === givenid){
            return true;
        }
        else{
            return false;
        }
    })
    console.log(user);
    console.log(typeof(user));
    if(typeof(user) === "undefined"){   // user name is available to be given
        users.push({id : givenid , pass : givenpass, data : []});
        const token = jwt.sign({id : givenid , pass : givenpass} , JWT_SECRET);

        res.json({
            token : token
        });
    }
    else{
        res.status(403).send({
            message : "Invalid username or password" 
        })
    }
});

function auth(req , res , next){
    const token = req.header.authorization;
    if(token){
        jwt.verify(token,JWT_SECRET ,(err , decoded) =>{
            if(err){
                res.status(401).send({
                    message : "Unauthorized"
                });
            }
            else{
                res.id = decoded;
                next();
            }
        });
    }
    else{
        res.status(401).send({
            message : "unauthorized"
        })
    }
}

app.post("/signin", function (req , res){
    const givenid = req.body.id;
    const givenpass = req.body.pass;

    console.log(givenid + " " + givenpass);
    let user = users.find((x) => {
        if(x.id === givenid && x.pass === givenpass){
            return true;
        }
        else{
            return false;
        }
    })
    console.log(user);
    console.log(typeof(user));
    if(user){   // user name is available to be given
        // users.push({id : givenid , pass : givenpass});
        const token = jwt.sign({id : givenid , pass : givenpass} , JWT_SECRET);

        res.json({
            token : token
        });
    }
    else{
        res.status(403).send({
            message : "Invalid username or password" 
        })
    }
})


app.post("/add",auth,function (req , res){
    
});


app.listen(3000);


