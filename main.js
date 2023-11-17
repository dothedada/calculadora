// llamar todos los elementos interactivos de la calculadora
// Llamado de los elementos de la pantalla de memoria
const panelRespuestas = document.getElementById('panelRespuestas')

// Llamado de los elementos en la pantalla de operaciones
const operador1 = document.getElementById('operacion').firstElementChild
const operador2 = document.getElementById('operacion').lastElementChild
const operando = document.getElementById('operacion').children[1]
const display = document.getElementById('resultado')

// llamado de los elementos del teclado
const botonesTeclado = document.getElementById('teclado')

// funciones
// Ingresar un dígito
const ingresarDigito = digito => {
    if(digito === '+/-' && +display.textContent){ 
        display.textContent = -display.textContent
    }
    if(digito === '.') {
        display.textContent = +display.textContent.split('.').join('')+'.'
    }
    if(display.textContent.split(/\d/).length > 10) return
    if(/\d/.test(digito)) {
        display.textContent = display.textContent === "0" ? digito : display.textContent + digito
    }
}
// pasa el valor a la primera casilla


// asignación de funciones al teclado
botonesTeclado.addEventListener('click', evento => {
    if(evento.target.tagName !== 'BUTTON') return
    const boton = evento.target.textContent
    // introducir un número
    if(/\b\d|(\+\/-)|\./.test(boton)) ingresarDigito(boton)
    
    if(/[*Xy%=+\º/-]/.test(boton) && boton.length < 3) console.log(boton) // mejorar ese regex
    
    if(/[A-M]+\d|[A-M]/.test(boton)) console.log('memoria ' + boton)

    // boton de borrar pantalla temporal

    if(boton === 'C') display.textContent = 0
})

// Regex MEMORIA = /[A-M]+\d|[A-M]/

// calculadora
// toma un valor
// toma un operador
// toma un segundo valor
//


