let ctr = 1;
function deleteToDo(deleteID){
    console.log(deleteID);
    console.log(typeof(deleteID));
    console.log(typeof( "#"+deleteID));
    let ele = document.querySelector("#" + deleteID);
    // let ele = document.getElementById(listItem);
    ele.parentNode.removeChild(ele);
}   
 
function addTolist(){
    let listItem = document.createElement("h4");
    listItem.setAttribute("id","a" + ctr);
    let parent = document.querySelector(".list");
    console.log("called");
    let content = document.querySelector("input").value;
    let q = 'a' + ctr;
    listItem.innerHTML = "<span>"+content+`</span> <button onClick = 'deleteToDo("${q}")'>delete</button>`;
    // listItem.innerHTML = `<span>${content}</span> <button onClick="deleteToDo('${q}')">delete</button>`;

    ctr++;
    parent.appendChild(listItem);
}