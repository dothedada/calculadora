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

    if(digito === '+/-' && +pantalla.celdaActiva().textContent) {
        pantalla.celdaActiva().textContent = -pantalla.celdaActiva().textContent
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
    '% de': (x, y) => (+y * +x) / 100,
    '% más': (x, y) => ((+y * +x) / 100) + +y,
    '% menos': (x, y) => +y - ((+y * +x) / 100),
    '% incremento': (x, y) => (+y * 100) / (100 - +x),
    corresponde: (x, y) => ((+y * 100) / (100 - +x)) - +y,

    calcular: operacion => {
        let respuesta = calculadora[operacion](operando1.textContent, operando2.textContent)
        // A partir de la longitud determina si lo pasa a notación científica o acorta decimales
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
        // bloquear iguales consecutivos
        if(!/^c/.test(operador.textContent)) calculadora.calcular(operador.textContent)
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
        if(/o$/.test(operador.textContent) && operacion === '-') {
            operador.textContent = 'corresponde'
            calculadora.calcular(operador.textContent)
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

    calculadora.calcular(operador.textContent)
    if(resultado.textContent === '3rr0r'){
        pantalla.cambiarEstado(2, false, false)
        return
    }

    operador.textContent = operacion !== '%' ? operacion : '% de'
    operando1.textContent = resultado.textContent
    operando2.textContent = ''
    resultado.textContent = ''
    pantalla.cambiarEstado(1, false, true)
    pantalla.bloquearOperacion(false)
}


const memoria = {
    casillasMemoria: 0,
    casillasRespuestas: 0,
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
            // el máximo son 24 caracteres, 11 de resutado, 3 de espacios, 10 operación
            const longitudDisponibleOperacion = 24 - (resultado.textContent.length + 3)
            const memoriaOperacion = document.createElement('span')
            let memoriaOperacionTXT = operador.textContent
            memoriaOperacion.classList.add('respuesta__operacion')
            memoria.casillasRespuestas++
                if(memoriaOperacionTXT === '% de') memoriaOperacionTXT = '%'
                if(memoriaOperacionTXT === '% más') memoriaOperacionTXT = '%+'
                if(memoriaOperacionTXT === '% menos') memoriaOperacionTXT = '%-'
                if(memoriaOperacionTXT === '% incremento') memoriaOperacionTXT = '%*'
                if(memoriaOperacionTXT === 'corresponde') {
                    memoriaOperacionTXT = '%*-'
                    operando1.textContent = operando1.textContent.slice(0, -1)
                    operando2.textContent = ''
                }
            // if(longitudDisponibleOperacion < memoriaOperacionTXT) {
            //
            // }
            memoriaOperacion.textContent = `${operando1.textContent} ${memoriaOperacionTXT} ${operando2.textContent}`
            memoriaAsignada.insertBefore(memoriaOperacion, memoriaAsignada.lastElementChild)

            if(memoria.casillasRespuestas > 5) pantallaMemoria.removeChild(pantallaMemoria.lastElementChild)

            if(!pantallaMemoria.children[memoria.casillasMemoria]) {
                pantallaMemoria.insertBefore(memoriaAsignada, pantallaMemoria.firstChild)
            } else {
                pantallaMemoria.insertBefore(memoriaAsignada, pantallaMemoria.children[memoria.casillasMemoria])
            }
        } else {
            pantallaMemoria.insertBefore(memoriaAsignada, pantallaMemoria.firstChild)
        }

        memoriaAsignada.addEventListener('click', () => {
            if(!pantalla.celdaActiva()) pantalla.reset()
            pantalla.celdaActiva().textContent = ''
            pantalla.celdaActiva().textContent = memoriaAsignada.lastElementChild.textContent
        })
    }
}

const manejarMemoria = boton  => {
    if(boton.textContent === 'C') {
        if(!pantalla.celdaActiva()) pantalla.reset()
        pantalla.celdaActiva().textContent = ''
        boton.textContent = 'AC'
    }
    if(boton.textContent === 'AC') pantalla.reset()

    if(/^M/.test(boton.textContent)) {
        const espacioDisponible = Array.from(pantallaMemoria.children).find( casilla => {
            return casilla.firstElementChild.textContent === `${boton.textContent}»`
        })

        if(memoria.vaBorrarCasilla) {
            pantallaMemoria.removeChild(espacioDisponible)
            boton.classList.add('boton--mVacia')
            memoria.vaBorrarCasilla = false
            memoria.casillasMemoria--
            if(!memoria.casillasMemoria) teclado.firstElementChild.lastElementChild.classList.add('boton--mVacia')
            return
        }

        if(!espacioDisponible) {
            if(memoria.valor() === '') return
            memoria.crearEspacioMemoria(boton.textContent)
            boton.classList.remove('boton--mVacia')
            memoria.casillasMemoria++
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

