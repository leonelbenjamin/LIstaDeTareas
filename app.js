
//***CONSTANTES-VARIABLES****

const formulario = document.getElementById("formulario")
const input = document.getElementById("input")
const listaTarea = document.getElementById('lista-tareas')
const template = document.getElementById("template").content
const fragment = document.createDocumentFragment()
let tareas = {
    123:{
        id: 123,
        texto: 'asd',
        estado: false
    }   
}


//***EVENTOS***

document.addEventListener('DOMContentLoaded', () => {
    //En el caso de que en el localStorage esten guardadas tareas seran tomadas e imprimidas en el html
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'))        
    }
    pintarTareas()
})
//detectar btn check, delite o remove  
listaTarea.addEventListener('click', e=>{
    btnAccion(e)
})

formulario.addEventListener('submit', e => { 
    e.preventDefault()
    setTarea(e)
})



//***FUNCIONES***

//Valido Formulario
const setTarea = e =>{
    if(input.value.trim() === ''){
        console.log("Formulario vacio");
        return
    }    
    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    }

    tareas[tarea.id] = tarea

    console.log(tareas);

    formulario.reset()
    input.focus()
    pintarTareas()
}
//Imprimir datos al html
const pintarTareas = () => {

    //guardar los datos en el localStorage
    localStorage.setItem('tareas', JSON.stringify(tareas))

    //En el caso de no tener tareas imprime text
    if (Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
        <div class="alert alert-dark text-center">
            No hay tareas pendientes.
        </div>
        `
        return
    }

    listaTarea.innerHTML = ''
    Object.values(tareas).forEach(tarea => {
        const clone = template.cloneNode(true)
        clone.querySelector('p').textContent = tarea.texto
        //Cambia el estado de la tarea
        if (tarea.estado) {
            clone.querySelector('.alert').classList.replace('alert-warning','alert-primary')
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle','fa-undo-alt')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }
        //
        clone.querySelectorAll(".fas")[0].dataset.id = tarea.id                //capturamos el objeto(iconos) y le añadimos el ID dinamico en el html  
        clone.querySelectorAll(".fas")[1].dataset.id = tarea.id                //capturamos el objeto(iconos) y le añadimos el ID dinamico en el html 
        fragment.appendChild(clone)
    });
    listaTarea.appendChild(fragment)
}

//Accion de botones
const btnAccion = e => {
    //Tarea relizada
    if (e.target.classList.contains('fa-check-circle')) {
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
    }
    if (e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }

    //borrar tarea
    if (e.target.classList.contains('fa-minus-circle')) {
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }
    e.stopPropagation()
}