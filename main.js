const memoria = document.getElementById('memoria')
const operando1 = document.getElementById('operacion').firstElementChild
const operando2 = document.getElementById('operacion').lastElementChild
const operador = document.getElementById('operacion').children[1]
const resultado = document.getElementById('resultado')
const teclado = document.getElementById('teclado')

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
        operando1.classList.remove('operacion--activo')
        operando2.classList.remove('operacion--activo')
        if(posCursor === 0) operando1.classList.add('operacion--activo')
        if(posCursor === 1) operando2.classList.add('operacion--activo')
        operando2.classList.remove('operacion--resultado')
        if(signoResultado) operando2.classList.add('operacion--resultado')
        operando1.classList.remove('operacion--respuesta')
        if(respuesta) operando1.classList.add('operacion--respuesta')
    },

    digitoLock : false,
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

const ingresarDigito = digito => {
    if(operando2.classList.contains('operacion--resultado')) pantalla.reset()
    if(operador.classList.contains('operacion--lock') && pantalla.digitoLock) {
        operando2.textContent = ''
        pantalla.digitoLock = false
    }
    const casilla = operador.textContent === '' ? operando1 : operando2

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
    '% de': (x, y) => (+y * +x) / 100,
    '% más': (x, y) => ((+y * +x) / 100) + +y,
    '% menos': (x, y) => +y - ((+y * +x) / 100),
    '% incremento': (x, y) => (+y * 100) / (100 - +x),
    'corresponde': (x, y) => ((+y * 100) / (100 - +x)) - +y,

    resultado: operacion => {
        let answer = calc[operacion](operando1.textContent, operando2.textContent)
        // A partir de la longitud determina si lo pasa a notación científica o acorta decimales
        if(parseFloat(+answer).toString().length > 10) {
            if(Math.round(+answer).toString().length > 10) {
                answer = parseFloat(+answer).toExponential(4)
            } else {
                answer = +parseFloat(+answer).toFixed(10 - Math.round(+answer).toString().length)
            }
        }
        resultado.textContent = answer
    }
}

const ingresarOperacion = operacion => {
    if(operando1.textContent === '') return
    if(operacion === '=' && !operando2.textContent) return
    if(operador.textContent === ''){
        operando1.textContent = +operando1.textContent
        operando2.textContent = ''
        operador.textContent = operacion !== '%' ? operacion : '% de'
        pantalla.cambiarEstado(1, false, false)
        return
    }
    if(operacion === '=') {
        calc.resultado(operador.textContent)
        if(operador.classList.contains('operacion--lock')) {
            pantalla.digitoLock = true
            pantalla.cambiarEstado(1, false, false)
            return
        }
        pantalla.cambiarEstado(2, true, false)
        return
    }
    if(/^[+\-*\/]$/.test(operacion) && operacion === operador.textContent) {
        pantalla.bloquearOperacion(true)
        pantalla.digitoLock = !pantalla.digitoLock
    } else {
        pantalla.bloquearOperacion(false)
    }
    if(/^%/.test(operador.textContent)) {
        if(/o$/.test(operador.textContent) && operacion === '-') {
            operador.textContent = 'corresponde'
            calc.resultado(operador.textContent)
            operando1.textContent += `%` 
            operando2.textContent = 'a'
            return
        }
        if(!operando2.classList.contains('operacion--resultado')) {
            if(operacion === '%') operador.textContent = '% de'
            if(operacion === '+') operador.textContent = '% más'
            if(operacion === '-') operador.textContent = '% menos'
            if(operacion === '*') operador.textContent = '% incremento'
            return
        }
    }
    if(operando2.textContent === ''){
        operador.textContent = operacion !== '%' ? operacion : '% de'
        return
    }
    calc.resultado(operador.textContent)
    operador.textContent = operacion !== '%' ? operacion : '% de'
    operando1.textContent = resultado.textContent
    operando2.textContent = ''
    resultado.textContent = ''
    pantalla.cambiarEstado(1, false, true)
    pantalla.bloquearOperacion(false)
}

const manejarMemoria = boton => {
    const celdaActiva = document.getElementsByClassName('operacion--activo')[0]
    if(boton === 'C') {
        if(celdaActiva) {
            celdaActiva.textContent = ''
            teclado.firstElementChild.firstElementChild.textContent = 'AC'
            return
        }
        pantalla.reset()
    }
    if(boton === 'AC'){
        pantalla.reset()
    }
    if(/^M/.test(boton) && resultado.textContent !== '') {
        let espacioDisponible = Array.from(memoria.children).find( casilla => {
            return casilla.firstElementChild.textContent === `${boton}»`
        })
        if(espacioDisponible){
            espacioDisponible.lastElementChild.textContent = resultado.textContent 
        } else {
            const memoriaAsignada = document.createElement('div')
            const memoriaNombre = document.createElement('span')
            const memoriaValor = document.createElement('span')
            memoriaAsignada.classList.add('respuesta')
            memoriaNombre.classList.add('respuesta__teclado')
            memoriaValor.classList.add('respuesta__resultado')
            memoriaNombre.textContent = `${boton}»`
            memoriaValor.textContent = resultado.textContent
            memoriaAsignada.appendChild(memoriaNombre)
            memoriaAsignada.appendChild(memoriaValor)
            memoria.insertBefore(memoriaAsignada, memoria.firstChild)
        } 
    }
    if(boton === 'CM'){
        const espaciosBorrar = Array.from(memoria.children).filter( casilla => {
            return /^M/.test(casilla.firstElementChild.textContent)
        })
        espaciosBorrar.forEach(espacio => espacio.remove())
    }

}

// asignación de funciones al teclado
teclado.addEventListener('click', evento => {
    if(evento.target.tagName !== 'BUTTON') return
    if(resultado.textContent === '3rr0r') pantalla.reset()
    const boton = evento.target.textContent
    if(/^[0-9.]|^\+.\-$/.test(boton)) ingresarDigito(boton)
    if(/^[^0-9A-M.]+$/.test(boton) && boton.length < 3) ingresarOperacion(boton)
    teclado.firstElementChild.firstElementChild.textContent = 'C'
    if(/[A-M]/.test(boton)) manejarMemoria(boton)
})

