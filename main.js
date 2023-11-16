// llamar todos los elementos interactivos de la calculadora
// Llamado de los elementos de la pantalla de memoria
const panelRespuestas = document.getElementById('panelRespuestas')

// Llamado de los elementos en la pantalla de operaciones
const operador1 = document.getElementById('operacion').firstElementChild
const operador2 = document.getElementById('operacion').lastElementChild
const operando = document.getElementById('operacion').children[1]
const resultado = document.getElementById('resultado')

// llamado de los elementos del teclado
const borrar = document.querySelectorAll('.boton--borrar')[0]
const memoria = document.querySelectorAll('.boton--memoria')
const borrarMemoria = document.querySelectorAll('.boton--borrar')[1]
const botonesOperacion = document.querySelectorAll('button[btn]')
for(const numero of botonesOperacion) {
    numero.addEventListener('click', ()=> {
        console.log(operaciones[numero.textContent])
    })
}

const operaciones = {
    'Xy': 'funciona',
}

