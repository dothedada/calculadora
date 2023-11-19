const memoria = document.getElementById('memoria')

const operando1 = document.getElementById('operacion').firstElementChild
const operando2 = document.getElementById('operacion').lastElementChild
const operador = document.getElementById('operacion').children[1]
const resultado = document.getElementById('resultado')

// se crea un objeto que almacena el estado de la pantalla y los métodos para modificarla
const pantalla = {
    // posicion variable
    // respuesta: false,
    // operacionRecurrente: false,

    cambiarEstado: (posCursor = undefined, resultado = undefined) => {
        if(posCursor !== undefined){
            operando1.classList.remove('operacion--activo')
            operando2.classList.remove('operacion--activo')
            if(posCursor === 0) operando1.classList.add('operacion--activo')
            if(posCursor === 1) operando2.classList.add('operacion--activo')
        }

        if(resultado !== undefined) {
            operando2.classList.remove('operacion--resultado')
            if(resultado) operando2.classList.add('operacion--resultado')
        }
    }
}
pantalla.cambiarEstado(0, false)


const teclado = document.getElementById('teclado')
const ingresarDigito = digito => {
    const casilla = operador.textContent === '' ? operando1 : operando2
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
    if(operacion === '=' && (!operador.textContent || !operando2.textContent)) return
    if(operador.textContent === ''){
        operando1.textContent = +operando1.textContent
        operando2.textContent = ''
        operador.textContent = operacion
        pantalla.cambiarEstado(1, false)
        return
    }
    if(operacion === '=') {
        calc.resultado(operador.textContent)
        pantalla.cambiarEstado(2, true)
        return
    }
    if(operando2.textContent === ''){
        operador.textContent = operacion
        return
    }
    calc.resultado(operador.textContent)
    operando1.textContent = resultado.textContent
    operador.textContent = operacion
    operando2.textContent = ''
    resultado.textContent =''

    pantalla.cambiarEstado(1, false)
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
        operando1.textContent = ''
        operando2.textContent = ''
        operador.textContent = ''
        operando1.classList.add('operacion--activo')
        operando2.classList.remove('operacion--activo')
        operando2.classList.remove('operacion--resultado')
        operando1.classList.remove('operacion--respuesta')
        evento.target.textContent = 'C'

    } 
})

