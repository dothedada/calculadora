const dispMemoria = document.getElementById('memoria')
const operando1 = document.getElementById('operando1')
const operando2 = document.getElementById('operando2')
const operador = document.getElementById('operador')
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

    calcular: op => {
        let respuesta = calculadora[op](operando1.textContent, operando2.textContent)
        if(parseFloat(+respuesta).toString().length > 10) {
            if(Math.round(+respuesta).toString().length > 10) {
                respuesta = parseFloat(+respuesta).toExponential(4)
            } else {
                respuesta = +parseFloat(+respuesta)
                    .toFixed(10 - Math.round(+respuesta).toString().length)
            }
        }
        resultado.textContent = respuesta
    }
}

const memoria = {
    casillas: [0, 0], // [Memorias seteadas, respuestas]
    vaBorrarCasilla: false,

    valor: () => {
        if(!pantalla.celdaActiva() || operador.classList.contains('operacion--lock')) {
            return resultado.textContent
        }
        return pantalla.celdaActiva().textContent
    },

    crearEspacioMemoria: boton => {
        if(resultado.textContent === '3rr0r') return

        // creación de lo celda para almacenar
        const memDiv = document.createElement('div')
        const memTipo = document.createElement('span')
        const memValor = document.createElement('span')
        memDiv.classList.add('respuesta')
        memTipo.classList.add('respuesta__teclado')
        memValor.classList.add('respuesta__resultado')
        memTipo.textContent = boton === '=' ? 'R»' : `${boton}»`
        memValor.textContent = boton === '=' ? resultado.textContent : memoria.valor() 
        memDiv.appendChild(memTipo)
        if(boton === '=') {
            const memOp = document.createElement('span')
            memoria.casillas[1]++
            memOp.classList.add('respuesta__operacion')
            memOp.textContent = `${operando1.textContent} ${operador.textContent} ${operando2.textContent}`

            // el espacio máximo disponible de la memoria son 24 caracteres
            if(resultado.textContent.length + memOp.textContent.length > 24) {
                const deMas = (resultado.textContent.length + memOp.textContent.length - 24)
                let memOper1 = operando1.textContent
                let memOper2 = operando2.textContent
                const trim1 = Math.round((memOper1.length * deMas) / memOp.textContent.length)
                const trim2 = deMas - trim1
                if (trim1 > 0) memOper1 = `${memOper1.slice(0, -trim1 - 1)}…`
                if (trim2 > 0) memOper2 = `${memOper2.slice(0, -trim2 - 1)}…`
                memOp.textContent = `${memOper1} ${operador.textContent} ${memOper2}`
            }
            memDiv.appendChild(memOp)

            // ubicación nuevo espacio de memoria
            if(!dispMemoria.children[0]) {
                dispMemoria.appendChild(memDiv)
            } else {
                dispMemoria.insertBefore(memDiv, dispMemoria.children[memoria.casillas[0]])
            }
        } else {
            // ubicación nuevo espacio de memoria
            dispMemoria.insertBefore(memDiv, dispMemoria.firstChild)
        }
        memDiv.appendChild(memValor) // no estoy muy seguro de dejar esto acá
        // Eliminar las respuestas viejas
        if(memoria.casillas[0] + memoria.casillas[1] > 8) {
            dispMemoria.removeChild(dispMemoria.lastElementChild)
            memoria.casillas[1]--
        }
        // Asignar la acción para bajarlas
        memDiv.addEventListener('click', () => {
            if(!pantalla.celdaActiva()) pantalla.reset()
            pantalla.celdaActiva().textContent = memDiv.lastElementChild.textContent
        })
    }
}

const ingresarDigito = boton => {
    memoria.vaBorrarCasilla = false
    if(!pantalla.celdaActiva()) pantalla.reset()
    if(operador.classList.contains('operacion--lock') && pantalla.operadorBloqueado) {
        operando2.textContent = ''
        pantalla.operadorBloqueado = false
    }
    if(boton === '+/-' && pantalla.celdaActiva().textContent) {
        pantalla.celdaActiva().textContent = -(+pantalla.celdaActiva().textContent)
    }
    if(boton === '.') {
        pantalla.celdaActiva().textContent = `${+pantalla.celdaActiva().textContent.split('.').join('')}.`
    }
    if(pantalla.celdaActiva().textContent.split(/\d/).length > 10) return
    if(/^[0-9]$/.test(boton)) {
        if(pantalla.celdaActiva().textContent === '0' || pantalla.celdaActiva().textContent === '3rr0r') {
            pantalla.celdaActiva().textContent = boton
            return
        }
        pantalla.celdaActiva().textContent +=  boton
    }
}

const ingresarOperacion = op => {
    memoria.vaBorrarCasilla = false
    if(operando1.textContent === '' || (op === '=' && !operando2.textContent)) return

    if(operador.textContent === ''){
        operando1.textContent = +operando1.textContent
        operador.textContent = op
        pantalla.cambiarEstado(1, false, false)
        return
    }

    if(op === '=') {
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

    if(/^[+\-*\/]$/.test(op) && op === operador.textContent) {
        pantalla.bloquearOperacion(true)
        pantalla.operadorBloqueado = !pantalla.operadorBloqueado
    } else {
        pantalla.bloquearOperacion(false)
    }

    if(/^%/.test(operador.textContent)) {
        if(!operando2.classList.contains('operacion--resultado')) {
            if(op === '+') operador.textContent = '%+'
            if(op === '-') operador.textContent = '%-'
            if(op === '*') operador.textContent = '%*'
            return
        }
        if(/\*$/.test(operador.textContent) && op === '-') {
            if(operando2.textContent) calculadora.calcular(operador.textContent)
            operador.textContent = '%*-'
            return
        }
    }

    if(operando2.textContent === ''){
        operador.textContent = op
        return
    }

    calculadora.calcular(operador.textContent)
    if(resultado.textContent === '3rr0r'){
        pantalla.cambiarEstado(2, false, false)
        return
    }

    operador.textContent = op
    operando1.textContent = resultado.textContent
    operando2.textContent = ''
    resultado.textContent = ''
    pantalla.cambiarEstado(1, false, true)
    pantalla.bloquearOperacion(false)
}

const manejarMemoria = boton  => {
    if(boton.textContent === 'C' || boton === 'c') {
        memoria.vaBorrarCasilla = false
        if(!pantalla.celdaActiva()) pantalla.reset()
        pantalla.celdaActiva().textContent = ''
        boton.textContent = 'AC'
        return
    }
    if(boton.textContent === 'AC' || boton === 'a') {
        memoria.vaBorrarCasilla = false
        pantalla.reset()
        return
    }

    if(/^M/.test(boton.textContent) || /^F/.test(boton)) {
        const teclaF = /^F/.test(boton) ? `M${boton.slice(-1)}` : undefined
        const btnActivo = Array.from(teclado.firstElementChild.children).find(btnMem => btnMem.textContent === teclaF)
        const espacioDisponible = Array.from(dispMemoria.children).find( casilla => {
            if(teclaF){
                return casilla.firstElementChild.textContent === `${teclaF}»`
            } else {
                return casilla.firstElementChild.textContent === `${boton.textContent}»`
            }
        })

        if(memoria.vaBorrarCasilla) {
            if(memoria.casillas[0] === 0) return
            dispMemoria.removeChild(espacioDisponible)
            if(!teclaF) {
                boton.classList.add('boton--mVacia')
            } else {
                btnActivo.classList.add('boton--mVacia')
            }
            memoria.vaBorrarCasilla = false
            memoria.casillas[0]--
            if(!memoria.casillas[0]) teclado.firstElementChild.lastElementChild.classList.add('boton--mVacia')
            return
        }

        if(!espacioDisponible) {
            if(memoria.valor() === '') return
            memoria.casillas[0]++
            if(!btnActivo) {
                memoria.crearEspacioMemoria(boton.textContent)
                boton.classList.remove('boton--mVacia')
            } else {
                memoria.crearEspacioMemoria(teclaF)
                btnActivo.classList.remove('boton--mVacia')
            }
            teclado.firstElementChild.lastElementChild.classList.remove('boton--mVacia')
        } else {
            if(!pantalla.celdaActiva()) pantalla.reset()
            pantalla.celdaActiva().textContent = ''
            pantalla.celdaActiva().textContent = espacioDisponible.lastElementChild.textContent
        }
        return
    }

    if(boton.textContent === 'LM' || boton === 'l') {
        memoria.vaBorrarCasilla = true
    }
}

teclado.addEventListener('click', event => {
    if(event.target.tagName !== 'BUTTON') return
    if(resultado.textContent === '3rr0r') pantalla.reset()
    const boton = event.target
    if(/[A-M]/.test(boton.textContent)) {
        manejarMemoria(boton)
        return
    }
    teclado.firstElementChild.firstElementChild.textContent = 'C'
    if(/^[0-9.]|^\+.\-$/.test(boton.textContent)) ingresarDigito(boton.textContent)
    if(/^[^0-9A-M.]{1,2}$/.test(boton.textContent)) ingresarOperacion(boton.textContent)
})

document.body.addEventListener('keydown', event => {
    // tableroDigitos
    console.log(event.key)
    if(/^\d$|\./.test(event.key)) {
        const boton = Array.from(teclado.children[1].children).find(elemento => {
                return elemento.textContent === event.key
            })
        boton.classList.add('boton-activo')
        setTimeout(() => {
            boton.classList.remove('boton-activo')
        }, 100)
        ingresarDigito(event.key)
    }

    if(event.key === 'n') ingresarDigito('+/-')
    // operaciones
    if(/[\+\*\-\/%=]/.test(event.key)) {
        event.preventDefault()
        const boton = Array.from(teclado.children[2].children).find(elemento => {
                return elemento.textContent === event.key
            })
        boton.classList.add('boton-activo')
        setTimeout(() => {
            boton.classList.remove('boton-activo')
        }, 100)
        ingresarOperacion(event.key)
    }
    if(/[xX]/.test(event.key)) ingresarOperacion('**')
    if(event.key === 'Enter'){
        event.preventDefault()
        ingresarOperacion('=')
    }
    // memoria
    if(/^F[1-3]$|[cal]/.test(event.key)){
        manejarMemoria(event.key)
        // manejarMemoria(`M${event.key.slice(-1)}`)
        event.preventDefault()
    }
})
