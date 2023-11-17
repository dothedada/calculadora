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
    // constructor de un valor 
    if(/\d|\./.test(numero.textContent)) numero.addEventListener('click', () => {
        if(resultado.textContent.split(/\d/).length > 10) return
        if(resultado.textContent === '0') {
            resultado.textContent = numero.textContent
            return
        }
        if(numero.textContent === '.' && resultado.textContent.includes('.')) {
            resultado.textContent = resultado.textContent.split('.').join('')
        }
        resultado.textContent += numero.textContent
    })
    if(numero.textContent === '+/-') numero.addEventListener('click',() =>{
        if(+resultado.textContent > 0) {
            resultado.textContent = ['-', resultado.textContent].join('') 
            return
        }
        if(+resultado.textContent < 0) resultado.textContent = resultado.textContent.slice(1)
    })
    // PENDIENTE
    // paso del valor y asignacion de la operacio
    if(/[^MC\d]/.test(numero.textContent) 
        && numero.textContent.length < 3) numero.addEventListener('click', () => {
        console.log(numero.textContent)
        if(operador1.textContent === '0') {
            operador1.textContent = resultado.textContent
            operando.textContent = numero.textContent
            resultado.textContent = '0'
        }
    })
}
borrar.addEventListener('click', () => resultado.textContent = '0')

/* const operaciones = {
    'Xy': 'funciona',
    3RR0R
}*/

// calculadora
// toma un valor
// toma un operador
// toma un segundo valor
//


