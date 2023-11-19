const memoria = document.getElementById('memoria')

const operando1 = document.getElementById('operacion').firstElementChild
const operando2 = document.getElementById('operacion').lastElementChild
const operador = document.getElementById('operacion').children[1]
const resultado = document.getElementById('resultado')

// se crea un objeto que almacena el estado de la pantalla y los métodos para modificarla
const pantalla = {
    reset: () => {
        operando1.removeAttribute('class')
        operando2.removeAttribute('class')
        operador.removeAttribute('class')
        operando1.classList.add('operacion--activo')
        operando1.textContent = ''
        operando2.textContent = ''
        operador.textContent = ''
        resultado.textContent = ''
    },

    cambiarEstado: (posCursor, signoResultado, respuesta) => {
        if(posCursor !== undefined){
            operando1.classList.remove('operacion--activo')
            operando2.classList.remove('operacion--activo')
            if(posCursor === 0) operando1.classList.add('operacion--activo')
            if(posCursor === 1) operando2.classList.add('operacion--activo')
        }
        if(signoResultado !== undefined) {
            operando2.classList.remove('operacion--resultado')
            if(signoResultado) operando2.classList.add('operacion--resultado')
        }
        if(respuesta !== undefined){
            operando1.classList.remove('operacion--respuesta')
            if(respuesta) operando1.classList.add('operacion--respuesta')
        }
    },

    primerDigitoBloqueo : false,
    bloquearOperacion: activa => {
        if(activa) {
            operando1.classList.toggle('operacion--lock')
            operador.classList.toggle('operacion--lock')
            return
        }
        operando1.classList.remove('operacion--lock')
        operador.classList.remove('operacion--lock')
    }
}
pantalla.cambiarEstado(0, false, false)
pantalla.bloquearOperacion(false)

const patito = '123.1'
console.log(Number(30.1234567).toFixed(5))
console.log(+parseFloat(patito).toFixed(5))



const teclado = document.getElementById('teclado')
const ingresarDigito = digito => {
    if(operando2.classList.contains('operacion--resultado')) pantalla.reset()
    if(operador.classList.contains('operacion--lock')) {
        if(pantalla.primerDigitoBloqueo) {
            operando2.textContent = ''
            pantalla.primerDigitoBloqueo = false
        }
    }
    const casilla = operador.textContent === '' ? operando1 : operando2
    
    if(digito === 'C') casilla.textContent = '' // evaluar una mejor posicion

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

const calc = {
    '+': (x, y) => +x + +y,
    '-': (x, y) => +x - +y,
    '*': (x, y) => +x * +y,
    '/': (x, y) => +y !== 0 ? +x / +y : '3rr0r',
    '**': (x, y) => (+x) ** (+y),
    // Operar y mostrar el resultado en el display
    resultado: operacion => {
        resultado.textContent = calc[operacion](operando1.textContent, operando2.textContent)
    }
}

const realizarOperacion = operacion => {
    if(operando1.textContent === '') return
    if(operacion === '=' && (!operador.textContent || !operando2.textContent)) return
    if(operador.textContent === ''){
        operando1.textContent = +operando1.textContent
        operando2.textContent = ''
        operador.textContent = operacion
        pantalla.cambiarEstado(1, false, false)
        return
    }
    if(operacion === '=') {
        if(operador.classList.contains('operacion--lock')) {
            calc.resultado(operador.textContent)
            pantalla.primerDigitoBloqueo = true
            pantalla.cambiarEstado(1, false, false)
            return
        }

        calc.resultado(operador.textContent)
        pantalla.cambiarEstado(2, true, false)
        return
    }

    if(/^[+\-*\/]$/.test(operacion) && operacion === operador.textContent) {
        pantalla.bloquearOperacion(true)
        pantalla.primerDigitoBloqueo = !pantalla.primerDigitoBloqueo
    } else {
        pantalla.bloquearOperacion(false)
    }
    
    if(operando2.textContent === ''){
        operador.textContent = operacion
        return
    }

    calc.resultado(operador.textContent)
    operando1.textContent = resultado.textContent
    operador.textContent = operacion
    operando2.textContent = ''
    resultado.textContent = ''
    pantalla.cambiarEstado(1, false, true)
    pantalla.bloquearOperacion(false)
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
        pantalla.reset()
        evento.target.textContent = 'C'

    } 
})

