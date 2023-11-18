const memoria = document.getElementById('memoria')

const operador1 = document.getElementById('operacion').firstElementChild
const operador2 = document.getElementById('operacion').lastElementChild
const operando = document.getElementById('operacion').children[1]
const resultado = document.getElementById('resultado')

let limpiezaResultado = false
const teclado = document.getElementById('teclado')
const ingresarDigito = digito => {
    if(limpiezaResultado) {
        operador1.textContent = ''
        operador2.textContent = ''
        operando.textContent = ''
        resultado.textContent = ''
        limpiezaResultado = false
    }
    const casilla = operando.textContent === '' ? operador1 : operador2

    if(digito === '+/-' && +casilla.textContent){ 
        casilla.textContent = -casilla.textContent
    }
    if(digito === '.') {
        casilla.textContent = `${+casilla.textContent.split('.').join('')}.`
    }
    if(casilla.textContent.split(/\d/).length > 10) return
    if(/\d/.test(digito)) {
        if(casilla.textContent === '0' || casilla.textContent === '3rr0r') {
            casilla.textContent = digito
            return
        }
        casilla.textContent +=  digito
    }
}

const calculadora = {
    '+': (x, y) => +x + +y,
    '-': (x, y) => +x - +y,
    '*': (x, y) => +x * +y,
    '/': (x, y) => +y !== 0 ? +x / +y : '3rr0r',
    '**': (x, y) => (+x) ** (+y),
    // Operar y mostrar el resultado en el display
    resultado: operacion => {
        resultado.textContent = calculadora[operacion](operador1.textContent, operador2.textContent)
    }
}

// pasa el valor a la primera casilla
const realizarOperacion = operacion => {
    limpiezaResultado = false
    if(operando.textContent === ''){
        operador1.textContent = +operador1.textContent
        operador2.textContent = ''
        operando.textContent = operacion
        return
    }
    if(operacion === '=') {
        calculadora.resultado(operando.textContent)
        limpiezaResultado = true
        return
    }
    // if doble signo igual
    // bloquea el operador 1
    // da marca visual
    //
    calculadora.resultado(operando.textContent)
    operador1.textContent = resultado.textContent
    operando.textContent = operacion
    operador2.textContent = ''
}

// asignación de funciones al teclado
teclado.addEventListener('click', evento => {
    if(evento.target.tagName !== 'BUTTON') return
    const boton = evento.target.textContent

    if(/^[0-9.]|^\+.\-$/.test(boton)) ingresarDigito(boton)
    if(/^[^0-9A-M.]+$/.test(boton) && boton.length < 3) realizarOperacion(boton)
    if(/[A-M]/.test(boton)) console.log('memoria ' + boton)

    // boton de borrar pantalla temporal
    if(boton === 'C') {
        resultado.textContent = ''
        operador1.textContent = ''
        operador2.textContent = ''
        operando.textContent = ''

    } 
})

