const memoria = document.getElementById('memoria')
const operando1 = document.getElementById('operando1')
const operando2 = document.getElementById('operando2')
const operador = document.getElementById('operador')
const resultado = document.getElementById('resultado')
const teclado = document.getElementById('teclado')

    // Cargar las respuestas a los espacios de memoria no fija
    // Crear la secuencia de trabajo para administración de la memoria
    // Hacer empleables los espacios de memoria
    // Habilitar el uso de techlado

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

    operadorBloqueado : false,
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
    if(operador.classList.contains('operacion--lock') && pantalla.operadorBloqueado) {
        operando2.textContent = ''
        pantalla.operadorBloqueado = false
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

const calculadora = {
    '+': (x, y) => +x + +y,
    '-': (x, y) => +x - +y,
    '*': (x, y) => +x * +y,
    '/': (x, y) => +y !== 0 ? +x / +y : '3rr0r',
    '**': (x, y) => (+x) ** (+y),
    '% de': (x, y) => (+y * +x) / 100,
    '% más': (x, y) => ((+y * +x) / 100) + +y,
    '% menos': (x, y) => +y - ((+y * +x) / 100),
    '% incremento': (x, y) => (+y * 100) / (100 - +x),
    corresponde: (x, y) => ((+y * 100) / (100 - +x)) - +y,

    resultado: operacion => {
        let answer = calculadora[operacion](operando1.textContent, operando2.textContent)
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
        calculadora.resultado(operador.textContent)
        crearEspacioMemoria('=')
        if(operador.classList.contains('operacion--lock')) {
            pantalla.operadorBloqueado = true
            pantalla.cambiarEstado(1, false, false)
            return
        }
        pantalla.cambiarEstado(2, true, false)
        return
    }
    if(/^[+\-*\/]$/.test(operacion) && operacion === operador.textContent) {
        pantalla.bloquearOperacion(true)
        pantalla.operadorBloqueado = !pantalla.operadorBloqueado
    } else {
        pantalla.bloquearOperacion(false)
    }
    if(/^%/.test(operador.textContent)) {
        if(/o$/.test(operador.textContent) && operacion === '-') {
            operador.textContent = 'corresponde'
            calculadora.resultado(operador.textContent)
            operando1.textContent += '%' 
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
    calculadora.resultado(operador.textContent)
    operador.textContent = operacion !== '%' ? operacion : '% de'
    operando1.textContent = resultado.textContent
    operando2.textContent = ''
    resultado.textContent = ''
    pantalla.cambiarEstado(1, false, true)
    pantalla.bloquearOperacion(false)
}

let casillasMemoria = 0
const crearEspacioMemoria = (boton, valor) => {
    // máximo 8 espacios
    const memoriaAsignada = document.createElement('div')
    const memoriaNombre = document.createElement('span')
    const memoriaValor = document.createElement('span')
    memoriaAsignada.classList.add('respuesta')
    memoriaNombre.classList.add('respuesta__teclado')
    memoriaValor.classList.add('respuesta__resultado')
    memoriaNombre.textContent = boton === '='? 'R>' : `${boton}»`
    memoriaValor.textContent = /^M/.test(boton) ? valor : resultado.textContent
    memoriaAsignada.appendChild(memoriaNombre)
    memoriaAsignada.appendChild(memoriaValor)

    if(boton === '=') {
        const memoriaOperacion = document.createElement('span')
        memoriaOperacion.classList.add('respuesta__operacion')
        // el máximo son 24 caracteres
        // ojo a las operaciones con % 
        memoriaOperacion.textContent = `${operando1.textContent} ${operador.textContent} ${operando2.textContent}`
        memoriaAsignada.insertBefore(memoriaOperacion, memoriaValor)
    }
    memoria.insertBefore(memoriaAsignada, memoria.firstChild)

}

let borrarMemoria = false
const manejarMemoria = (boton, evento) => {
    const celdaActiva = document.getElementsByClassName('operacion--activo')[0]
    const botonActivo = evento.target

    if(boton === 'C') {
        if(!celdaActiva) pantalla.reset()
        celdaActiva.textContent = ''
        botonActivo.textContent = 'AC'
    }
    if(boton === 'AC') pantalla.reset()

    if(/^M/.test(boton)) {
        const espacioDisponible = Array.from(memoria.children).find( casilla => {
            return casilla.firstElementChild.textContent === `${boton}»`
        })
        const valorMemoria = resultado.textContent !== '' 
            ? resultado.textContent : celdaActiva.textContent

        if(borrarMemoria) {
            memoria.removeChild(espacioDisponible)
            botonActivo.classList.add('boton--mVacia')
            casillasMemoria--
            borrarMemoria = false
            if(!casillasMemoria) teclado.firstElementChild.lastElementChild.classList.add('boton--mVacia')
            return
        }
        if(espacioDisponible) return
        crearEspacioMemoria(boton, valorMemoria)
        casillasMemoria++
        botonActivo.classList.remove('boton--mVacia')
        teclado.firstElementChild.lastElementChild.classList.remove('boton--mVacia')
    }
    if(boton === 'LM') borrarMemoria = true
}

teclado.addEventListener('click', evento => {
    if(evento.target.tagName !== 'BUTTON') return
    if(resultado.textContent === '3rr0r') pantalla.reset()
    const boton = evento.target.textContent
    if(/^[0-9.]|^\+.\-$/.test(boton)) ingresarDigito(boton)
    if(/^[^0-9A-M.]+$/.test(boton) && boton.length < 3) ingresarOperacion(boton)
    teclado.firstElementChild.firstElementChild.textContent = 'C'
    if(/[A-M]/.test(boton)) manejarMemoria(boton, evento)
})

