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
        const token = jwt.sign({id : givenid} , JWT_SECRET);

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
    const token = req.headers.authorization;
    console.log(token);
    console.log(typeof(token));
    if(token){
        jwt.verify(token,JWT_SECRET ,(err , decoded) =>{
            if(err){
                res.status(401).send({
                    message : "Unauthorized"
                });
            }
            else{
                req.body.id = decoded.id;
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
        const token = jwt.sign({id : givenid} , JWT_SECRET);
        console.log(token);
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


app.post("/addTodo",auth,function (req , res){
    const id = req.body.id;
    const toAdd = req.body.toDo;
    console.log(`/addTodo`);
    console.log(id);
    console.log(toAdd);
    let userobj = users.find((user) => {
        if(id === user.id){
            return true;
        }
        else{
            return false;
        }
    });

    if(userobj){
        userobj.data.push(toAdd);
        res.send();
    }
    else{
        console.log("user not found");
        res.status(500).send({
            message : "user not found"
        })
    }

});

app.get("/getlist" , auth , function(req , res){
    const id = req.body.id;
    let userobj = users.find((user) => {
        if(id === user.id){
            return true;
        }
        else{
            return false;
        }
    });

    res.json({
        userdata : userobj.data
    })
})


app.listen(3000);


