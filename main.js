const memoria = document.getElementById('memoria')

const operador1 = document.getElementById('operacion').firstElementChild
const operador2 = document.getElementById('operacion').lastElementChild
const operando = document.getElementById('operacion').children[1]
const resultado = document.getElementById('resultado')

const estadoPantalla = {
    operadores : [operador1, operador2],
    cursor: 0, // posicion variable
    respuesta: false,
    operacionRecurrente: false,
    memoriaOperador: 0, // posicion variable

    resetear: () => {
        operador1.removeAttribute('class')
        operador2.removeAttribute('class')
        operando.removeAttribute('class')
        // estadoPantalla.cambiarEstado(0)
    },

    cambiarEstado: (posCursor, usoRespuesta, opRecurrente, memOperador) => {
        if(posCursor !== undefined){
            estadoPantalla.cursor = posCursor
            estadoPantalla.operadores[posCursor].classList.add('operacion--activo')
            estadoPantalla.operadores[-(posCursor - 1)].classList.remove('operacion--activo')
        }
        if(usoRespuesta !== undefined) {
            estadoPantalla.respuesta = usoRespuesta
            if(usoRespuesta){
                operador1.classList.add('operacion--respuesta')
            } else {
                operador1.classList.remove('operacion--respuesta')
            }
        }
        if(opRecurrente !== undefined) {
            estadoPantalla.operacionRecurrente = opRecurrente
            if(opRecurrente) {
                console.log('patito')
                operador1.classList.add('operacion-lock')
                operando.classList.add('operacion-lock')
            } else {
                operador1.classList.remove('operacion-lock')
                operando.classList.remove('operacion-lock')
            }
        }
    }
}


estadoPantalla.cambiarEstado(1, false, true)
// let ubicacionCursor, usoRespuesta, operacionBloqueada, memoriaOperador1, memoriaOperador2
// const estadoPantalla = (cursor, respuesta, candado, memoriaOp1, memoriaOp2) => {
//     operador1.removeAttribute('class')
//     operador2.removeAttribute('class')
//     operando.removeAttribute('class')
//     if(cursor){
//         operador2.classList.add('operacion--activo')
//     } else {
//         operador1.classList.add('operacion--activo')
//     }
//     if(respuesta) operador1.classList.add('operacion--respuesta')
//     if(candado){
//         operador1.classList.add('operacion--lock')
//         operando.classList.add('operacion--lock')
//     }
//     if(memoriaOp1) operador1.classList.add(`operacion--memoria${memoriaOp1}`)
//     if(memoriaOp2) operador2.classList.add(`operacion--memoria${memoriaOp2}`)
// }

const teclado = document.getElementById('teclado')
const ingresarDigito = digito => {
    const casilla = operando.textContent === '' ? operador1 : operador2
    if(digito === 'C') casilla.textContent = ''
    if(digito === '+/-' && +casilla.textContent) casilla.textContent = -casilla.textContent
    if(digito === '.') casilla.textContent = `${+casilla.textContent.split('.').join('')}.`
    if(casilla.textContent.split(/\d/).length > 10) return
    if(/^[0-9]$/.test(digito)) {
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

const realizarOperacion = operacion => {
    if(operacion === '=' && (!operando.textContent || !operador2.textContent)) return
    if(operando.textContent === ''){
        operador1.textContent = +operador1.textContent
        operador2.textContent = ''
        operando.textContent = operacion
        operador1.classList.remove('operacion--activo')
        operador2.classList.add('operacion--activo')
        return
    }
    if(operando.textContent === operacion) {
        operador1.classList.toggle('operacion--lock')

        return
    }
    if(operacion === '=') {
        if(operador1.classList.contains('operacion--lock')){
            calculadora.resultado(operando.textContent)
            operador2.textContent = ''
            return
        }
        calculadora.resultado(operando.textContent)
        operador1.classList.remove('operacion--respuesta')
        operador2.classList.remove('operacion--activo')
        operador2.classList.add('operacion--resultado')
        return
    }
    if(operador2.textContent === ''){
        operando.textContent = operacion
        return
    }
    calculadora.resultado(operando.textContent)
    operador1.textContent = resultado.textContent
    operando.textContent = operacion
    operador2.textContent = ''
    operador2.classList.add('operacion--activo')
    operador2.classList.remove('operacion--resultado')
    operador1.classList.add('operacion--respuesta')
    resultado.textContent =''
}

// asignación de funciones al teclado
teclado.addEventListener('click', evento => {
    if(evento.target.tagName !== 'BUTTON') return
    const boton = evento.target.textContent

    if(/^[0-9.]|^\+.\-$/.test(boton)) ingresarDigito(boton)
    if(/^[^0-9A-M.]+$/.test(boton) && boton.length < 3) realizarOperacion(boton)
    if(/[A-M]/.test(boton)) console.log(boton)

    // boton de borrar pantalla temporal

    if(boton === 'C') {
        ingresarDigito(boton)
        evento.target.textContent = 'AC'
    }
    if(boton === 'AC'){
        resultado.textContent = ''
        operador1.textContent = ''
        operador2.textContent = ''
        operando.textContent = ''
        operador1.classList.add('operacion--activo')
        operador2.classList.remove('operacion--activo')
        operador2.classList.remove('operacion--resultado')
        operador1.classList.remove('operacion--respuesta')
        evento.target.textContent = 'C'

    } 
})

