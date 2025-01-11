const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const {UserModel , TodoModel} = require("./db.js");
const bcrypt = require("bcrypt");
const z = require("zod");
app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

async function dbConnect() {
    try{
        await mongoose.connect("mongodb+srv://admin:qYh7ac32M8w1HHig@cluster0.gplpr.mongodb.net/todo-app-database");
    } catch(err){
        console.log(err);
    }
}

dbConnect();


const JWT_SECRET = "atuldev";

// let users = [{
//     id : "atul",
//     pass: "tomer",
//     data: []
// }];



app.post("/signup",async function(req , res){
    const givenid = req.body.id;
    const givenpass = req.body.pass;
    const slatRounds = 4;

    const idSchema = z.string();
    const passSchema = z.string();

    try{
        idSchema.parse(givenid);
        passSchema.parse(givenpass);
    } catch(err){
        res.status(400).send({
            err : err
        })
    }


    // find if awailable
    console.log(givenid + " " + givenpass);
    // let user = users.find((x) => {
    //     if(x.id === givenid){
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    // })
    // console.log(user);
    // console.log(typeof(user));

    // if(typeof(user) === "undefined"){   // user name is available to be given
    //     users.push({id : givenid , pass : givenpass, data : []});
    //     const token = jwt.sign({id : givenid} , JWT_SECRET);
        
    //     res.json({
    //         token : token
    //     });
    // }
    // else{
    //     res.status(403).send({
    //         message : "Invalid username or password" 
    //     })
    // }
    try{
        const passHash = await bcrypt.hash(givenpass , slatRounds);
        console.log(passHash);
        await UserModel.create({
            username : givenid ,
            passHash : passHash,
        });

        const token = jwt.sign({id : givenid} , JWT_SECRET);
        

        res.status(200).json({
            message : "You are signed up",
            token : token
        });

    }   catch(err){
        console.log(err);
        res.status(500).json({
            err : err
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

app.post("/signin",async function (req , res){
    const givenid = req.body.id;
    const givenpass = req.body.pass;

    const idSchema = z.string();
    const passSchema = z.string();

    try{
        idSchema.parse(givenid);
        passSchema.parse(givenpass);
    } catch(err){
        return res.status(400).send({
            err : err
        })
    }


    console.log(givenid + " " + givenpass);
    // let user = users.find((x) => {
    //     if(x.id === givenid && x.pass === givenpass){
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    // })
    // console.log(user);
    // console.log(typeof(user));
    // if(user){   // user name is available to be given
    //     // users.push({id : givenid , pass : givenpass});
    //     const token = jwt.sign({id : givenid} , JWT_SECRET);
    //     console.log(token);
    //     res.json({
    //         token : token
    //     });
    // }
    // else{
    //     res.status(403).send({
    //         message : "Invalid username or password" 
    //     })
    // }


    try{
        console.log(givenid);
        const user = await UserModel.findOne({
            username:givenid
        });
        console.log(user);
        console.log(typeof(user));
        if(user){  
            const passHash = user.passHash;
            const passwordMatch = await bcrypt.compare(givenpass, passHash);
            console.log(passwordMatch);
    
            if(givenid && passwordMatch){
                
                const token = jwt.sign({id : givenid} , JWT_SECRET);
                console.log(token);
                res.json({
                    token : token
                });
            }
            else{
                
                return res.status(400).send({
                    message : "wrong pass"
                })
            }
        }
        else{
            res.status(403).send({
                message : "Invalid username" 
            })
        }
    } catch(err){
        res.status(500).send({
            err : err
        })
    }
})


app.post("/addTodo",auth, async function (req , res){
    const id = req.body.id;
    const toAdd = req.body.toDo;
    console.log(`/addTodo`);
    console.log(id);
    console.log(toAdd);

    const idSchema = z.string();
    const toAddSchema = z.string();

    try{
        idSchema.parse(id);
        toAddSchema.parse(toAdd);
    } catch(err){
        return res.status(400).send({
            err : err
        })
    }
    console.log(id);


    try{
        const user = await UserModel.findOne({
            username : id
        });
        console.log(user);
        console.log(typeof(user));
        if(user){
            // const objId = user._id;
            TodoModel.create({
                description : toAdd,
                userId : user._id
            });
            console.log("toADD done");
            res.status(200).send({
                message: "add done"
            })
        }
        else{
            res.status(400).send({
                message : "user does not exist"
            })
        }
    } catch(err){
        console.log("test");
        res.send(500).send({
            message : err
        });
    }


    // let userobj = users.find((user) => {
    //     if(id === user.id){
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    // });

    // if(userobj){
    //     userobj.data.push(toAdd);
    //     res.send();
    // }
    // else{
    //     console.log("user not found");
    //     res.status(500).send({
    //         message : "user not found"
    //     })
    // }

});

app.get("/getlist" , auth ,async function(req , res){
    const id = req.body.id;

    console.log(id);

    const idSchema = z.string();

    try{
        idSchema.parse(id);
    } catch(err){
        return res.status(400).send({
            err : err
        })
    }




    try{
        const user = await UserModel.findOne({
            username : id
        });
        console.log("asssssssssssssssssssssssssssssssss");
        console.log(user);
        console.log(typeof(user));
        if(user){
            // const objId = user._id;
            const toDos = await TodoModel.find({
                userId : user._id
            });
            console.log(toDos);
            const dos = toDos.map(x => x.description);
            console.log(dos);

            return res.json({
                userdata : dos
            });
        }
        else{
            res.status(400).send({
                message : "user does not exist"
            })
        }
    } catch(err){
        console.log("test");
        res.send(500).send({
            message : err
        });
    }

    


    // let userobj = users.find((user) => {
    //     if(id === user.id){
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    // });

    // res.json({
    //     userdata : userobj.data
    // })
})


app.listen(3000);


