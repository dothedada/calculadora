const pantallaMemoria = document.getElementById('memoria')
const operando1 = document.getElementById('operando1')
const operando2 = document.getElementById('operando2')
const operador = document.getElementById('operador')
const resultado = document.getElementById('resultado')
const teclado = document.getElementById('teclado')

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
    celdaActiva: () => {
        if(resultado.textContent) undefined
        if(operador.classList.contains('operacion--lock')) operando2
        return document.getElementsByClassName('operacion--activo')[0]
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
        operando1.classList.remove('operacion--lock')
        operador.classList.remove('operacion--lock')
        if(activa) {
            operando1.classList.toggle('operacion--lock')
            operador.classList.toggle('operacion--lock')
        }
    }
}
pantalla.cambiarEstado(0, false, false)

const ingresarDigito = digito => {
    memoria.vaBorrarCasilla = false
    if(!pantalla.celdaActiva()) pantalla.reset()
    if(operador.classList.contains('operacion--lock') && pantalla.operadorBloqueado) {
        operando2.textContent = ''
        pantalla.operadorBloqueado = false
    }
    if(digito === '+/-' && pantalla.celdaActiva().textContent) {
        pantalla.celdaActiva().textContent = -(+pantalla.celdaActiva().textContent)
    }
    if(digito === '.') {
        pantalla.celdaActiva().textContent = `${+pantalla.celdaActiva().textContent.split('.').join('')}.`
    }
    if(pantalla.celdaActiva().textContent.split(/\d/).length > 10) return
    if(/^[0-9]$/.test(digito)) {
        if(pantalla.celdaActiva().textContent === '0' || pantalla.celdaActiva().textContent === '3rr0r') {
            pantalla.celdaActiva().textContent = digito
            return
        }
        pantalla.celdaActiva().textContent +=  digito
    }
}

const calculadora = {
    '+': (x, y) => +x + +y,
    '-': (x, y) => +x - +y,
    '*': (x, y) => +x * +y,
    '/': (x, y) => +y !== 0 ? +x / +y : '3rr0r',
    '**': (x, y) => (+x) ** (+y),
    '%': (x, y) => (+y * +x) / 100,
    '%+': (x, y) => ((+y * +x) / 100) + +y,
    '%-': (x, y) => +y - ((+y * +x) / 100),
    '%*': (x, y) => (+y * 100) / (100 - +x),
    '%*-': (x, y) => ((+y * 100) / (100 - +x)) - +y,
    calcular: operacion => {
        let respuesta = calculadora[operacion](operando1.textContent, operando2.textContent)
        if(parseFloat(+respuesta).toString().length > 10) {
            if(Math.round(+respuesta).toString().length > 10) {
                respuesta = parseFloat(+respuesta).toExponential(4)
            } else {
                respuesta = +parseFloat(+respuesta).toFixed(10 - Math.round(+respuesta).toString().length)
            }
        }
        resultado.textContent = respuesta
    }
}

const ingresarOperacion = operacion => {
    memoria.vaBorrarCasilla = false
    if(operando1.textContent === '') return
    if(operacion === '=' && !operando2.textContent) return

    if(operador.textContent === ''){
        operando1.textContent = +operando1.textContent
        operador.textContent = operacion
        pantalla.cambiarEstado(1, false, false)
        return
    }

    if(operacion === '=') {
        if(operando2.classList.contains('operacion--resultado')) return
        calculadora.calcular(operador.textContent)
        memoria.crearEspacioMemoria('=')
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
        if(/\*$/.test(operador.textContent) && operacion === '-') {
            if(operando2.textContent) calculadora.calcular(operador.textContent)
            operador.textContent = '%*-'
            return
        }

        if(!operando2.classList.contains('operacion--resultado')) {
            if(operacion === '+') operador.textContent = '%+'
            if(operacion === '-') operador.textContent = '%-'
            if(operacion === '*') operador.textContent = '%*'
            return
        }
    }

    if(operando2.textContent === ''){
        operador.textContent = operacion
        return
    }

    calculadora.calcular(operador.textContent)
    if(resultado.textContent === '3rr0r'){
        pantalla.cambiarEstado(2, false, false)
        return
    }

    operador.textContent = operacion
    operando1.textContent = resultado.textContent
    operando2.textContent = ''
    resultado.textContent = ''
    pantalla.cambiarEstado(1, false, true)
    pantalla.bloquearOperacion(false)
}


const memoria = {
    casillas: [0, 0], // [memoria, respuestas]
    vaBorrarCasilla: false,

    valor: () => {
        if(!pantalla.celdaActiva() || operador.classList.contains('operacion--lock')) return resultado.textContent
        return pantalla.celdaActiva().textContent
    },

    crearEspacioMemoria: (boton) => {
        if(resultado.textContent === '3rr0r') return
        const memoriaAsignada = document.createElement('div')
        const memoriaNombre = document.createElement('span')
        const memoriaValor = document.createElement('span')
        memoriaAsignada.classList.add('respuesta')
        memoriaNombre.classList.add('respuesta__teclado')
        memoriaValor.classList.add('respuesta__resultado')
        memoriaNombre.textContent = boton === '=' ? 'R>' : `${boton}»`
        memoriaValor.textContent = boton === '=' ? resultado.textContent : memoria.valor() 
        memoriaAsignada.appendChild(memoriaNombre)
        memoriaAsignada.appendChild(memoriaValor)

        if(boton === '=') {
            const memoriaOperacion = document.createElement('span')
            memoria.casillas[1]++

            memoriaOperacion.classList.add('respuesta__operacion')
            memoriaOperacion.textContent = `${operando1.textContent} ${operador.textContent} ${operando2.textContent}`

            // el máximo son 24 caracteres, 3 fijos para espacio, 11 máximo para resutado
            if(resultado.textContent.length + memoriaOperacion.textContent.length > 24) {
                const sobrepaso = (resultado.textContent.length + memoriaOperacion.textContent.length - 24)
                let memOperando1 = operando1.textContent
                let memOperando2 = operando2.textContent
                const trim1 = Math.round((memOperando1.length * sobrepaso) / memoriaOperacion.textContent.length)
                const trim2 = sobrepaso - trim1
                if (trim1 > 0) memOperando1 = `${memOperando1.slice(0, -trim1 - 1)}…`
                if (trim2 > 0) memOperando2 = `${memOperando2.slice(0, -trim2 - 1)}…`

                memoriaOperacion.textContent = `${memOperando1} ${operador.textContent} ${memOperando2}`
            }

            memoriaAsignada.insertBefore(memoriaOperacion, memoriaAsignada.lastElementChild)

            if(!pantallaMemoria.children[0]) {
                pantallaMemoria.appendChild(memoriaAsignada)
            } else {
                pantallaMemoria.insertBefore(memoriaAsignada, pantallaMemoria.children[memoria.casillas[0]])
            }
        } else {
            pantallaMemoria.insertBefore(memoriaAsignada, pantallaMemoria.firstChild)
        }

        if(memoria.casillas[0] + memoria.casillas[1] > 8) {
            pantallaMemoria.removeChild(pantallaMemoria.lastElementChild)
            memoria.casillas[1]--
        }

        memoriaAsignada.addEventListener('click', () => {
            if(!pantalla.celdaActiva()) pantalla.reset()
            pantalla.celdaActiva().textContent = memoriaAsignada.lastElementChild.textContent
        })
    }
}

const manejarMemoria = boton  => {
    if(boton.textContent === 'C') {
        memoria.vaBorrarCasilla = false
        if(!pantalla.celdaActiva()) pantalla.reset()
        pantalla.celdaActiva().textContent = ''
        boton.textContent = 'AC'
    }
    if(boton.textContent === 'AC') {
        memoria.vaBorrarCasilla = false
        pantalla.reset()
    }

    if(/^M/.test(boton.textContent)) {
        const espacioDisponible = Array.from(pantallaMemoria.children).find( casilla => {
            return casilla.firstElementChild.textContent === `${boton.textContent}»`
        })

        if(memoria.vaBorrarCasilla) {
            pantallaMemoria.removeChild(espacioDisponible)
            boton.classList.add('boton--mVacia')
            memoria.vaBorrarCasilla = false
            memoria.casillas[0]--
            if(!memoria.casillas[0]) teclado.firstElementChild.lastElementChild.classList.add('boton--mVacia')
            return
        }

        if(!espacioDisponible) {
            if(memoria.valor() === '') return
            memoria.casillas[0]++
            memoria.crearEspacioMemoria(boton.textContent)
            boton.classList.remove('boton--mVacia')
            teclado.firstElementChild.lastElementChild.classList.remove('boton--mVacia')
        } else {
            if(!pantalla.celdaActiva()) pantalla.reset()
            pantalla.celdaActiva().textContent = ''
            pantalla.celdaActiva().textContent = espacioDisponible.lastElementChild.textContent
        }
    }

    if(boton.textContent === 'LM') memoria.vaBorrarCasilla = true
}

teclado.addEventListener('click', evento => {
    if(evento.target.tagName !== 'BUTTON') return
    if(resultado.textContent === '3rr0r') pantalla.reset()
    const boton = evento.target
    if(/^[0-9.]|^\+.\-$/.test(boton.textContent)) ingresarDigito(boton.textContent)
    if(/^[^0-9A-M.]{1,2}$/.test(boton.textContent)) ingresarOperacion(boton.textContent)
    if(/[A-M]/.test(boton.textContent)) manejarMemoria(boton)
    // Retornas a A apenas se oprima cualquier otro botón
})

