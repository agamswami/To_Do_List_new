let toDoList = ["hello","my name"];

async function getdataForuser(){
    const id = localStorage.getItem("id")
    const token = localStorage.getItem("token");
    console.log(token);
    try{
        const res = await axios.get("http://localhost:3000/getlist" ,
            {
                headers: {
                    'authorization': token,
                    'Content-Type' : 'application/json'
                }
            }
        );
    
        toDoList = res.data.userdata;
        console.log(toDoList);
    } catch(error){
        console.log(`error :${error}`);
    }
}

function displayUsersName(){
    let heading = document.getElementById("heading");
    const id = localStorage.getItem("id");
    heading.innerHTML = `${id}'s Todo List`
}


async function render(){
    displayUsersName();
    await getdataForuser();

    let parentDiv = document.getElementById("list");
    parentDiv.innerHTML = "";
    toDoList.forEach( (element) => 
        {
            let listItem = document.createElement("p");
            listItem.innerHTML = element;
            let divEle = document.createElement("div");
            divEle.appendChild(listItem);
            parentDiv.appendChild(divEle);
            divEle.classList.add("todoListItem");
        }   
    );
}
// render();

async function add(){
    const toDo = document.querySelector("input").value;
    console.log(toDo);
    const token = localStorage.getItem("token");
    
    try{
        const res = await axios.post("http://localhost:3000/addTodo", {toDo: toDo },
            {
                headers: {
                    'authorization': token,
                    'Content-Type' : 'application/json'
                }
            }
        );
        toDoList = res.data.list;
        render();
    } catch (error){
        console.log(error);
        alert("you are not authorised");
    }
    
    document.querySelector("input").value = "";
}


async function signupHandler() {
    const username = document.getElementById("Username").value;
    const pass = document.getElementById("pass").value;
    // let token;
    try{
        const response = await axios.post("http://localhost:3000/signup",{id : username , pass : pass});
        const token = response.data.token;
        console.log(response.data);
        localStorage.setItem("token" ,token);
        localStorage.setItem("id" , username);

        console.log(localStorage.getItem("token"));
        window.location.href = "/toDo";
    } catch (error ){
        console.log(`error :` + error.response.data.message);
        alert("user name already taken")
    }
}

async function signinHandler() {
    const username = document.getElementById("Username").value;
    const pass = document.getElementById("pass").value;
    // let token;
    try{
        const response = await axios.post("http://localhost:3000/signin",{id : username , pass : pass});
        const token = response.data.token;
        console.log(response.data);
        localStorage.setItem("token" ,token);
        localStorage.setItem("id" , username);

        console.log(localStorage.getItem("token"));
        window.location.href = "/toDo";
    } catch (error ){
        console.log(`error :` + error.response.data.message);
        alert("user name already taken")
    }
}

function signoutHandler(){
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    window.location.href = "/";
}

