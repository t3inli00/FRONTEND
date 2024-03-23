const BACKEND_ROOT_URL='https://backend-pkq5.onrender.com' //'http://localhost:3001'
import { Todos } from "./class/Todos.js"

const todos = new Todos(BACKEND_ROOT_URL)
const list = document.querySelector("ul")
const input= document.querySelector("input")

//input.disabled = true
const renderTask= (task) =>{
    const li =document.createElement('li')
    li.setAttribute('class','list-group-item')
    li.setAttribute('data-key',task.getID().toString())
    //li.innerHTML = task.getText()
    renderSpan(li, task.getText())
    renderLink(li,task.getID())
    
    list.append(li)
}
const renderSpan =(li,text) => {
    const span =li.appendChild(document.createElement('span'))
    span.innerHTML = text
}

const renderLink =(li,id) => {
    const a = li.appendChild(document.createElement('a'))
    a.innerHTML ='<i class ="bi bi-trash"></i>'
    a.setAttribute('style','float: right')
    a.addEventListener('click', (event) => {
        todos.removeTask(id).then((removed_id) => {
            const li_to_remove =document.querySelector(`[data-key='${removed_id}']`)
            if (li_to_remove){
                list.removeChild(li_to_remove)
            }
        }).catch((error) => {
            alert(error)
        })
    })
}

const getTasks =  () => {
    todos.getTasks().then((tasks) => {
        tasks.forEach(task => {
            //console.log(task)
            renderTask(task)            
        })
        
    }).catch((error) => {alert(error)})
}

const saveTask = async (task) =>{
    try{
        const json = JSON.stringify({description :task})
        const response = await fetch(BACKEND_ROOT_URL + '/new',{
            method :'post',
            headers:{
                'content-Type' : 'application/json'
            },
            body: json
        })
        return response.json()
    }
    catch(error){
        alert("Error saving tasks" + error.message)
    }
}


input.addEventListener('keypress',(e) => {
    if (e.key === 'Enter')
    {
        e.preventDefault();
        const task= input.value.trim();
        if (task !== '')
        {
           todos.addTask(task).then((task) => {
            renderTask(task)
            input.value=''
            input.focus()
           })
            
        }
    }
})
getTasks()

