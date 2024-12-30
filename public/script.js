let toDoList = ["hello","my name"];


async function render(){
    const res = await axios.get()

    let parentDiv = document.getElementById("list");
    parentDiv.innerHTML = "";
    toDoList.forEach(element => {
        let listItem = document.createElement("p");
        listItem.innerHTML = element;
        let divEle = document.createElement("div");
        divEle.appendChild(listItem);
        parentDiv.appendChild(divEle);
        divEle.classList.add("todoListItem");
    });
}
// render();

async function add(){
    const toDo = document.querySelector("input").value;
    console.log(value);
    
    const res = await axios.post("localhost:3000/addTodo", {toDo : toDo});
    toDoList = res.data.list;
    render();
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

        console.log(localStorage.getItem("token"));
        window.location.href = "/toDo";
    } catch (error ){
        console.log(`error :` + error.response.data.message);
        alert("user name already taken")
    }
}

