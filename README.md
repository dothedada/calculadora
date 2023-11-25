# Calculame, calculame, calculadora
Ejercicio de programación con JS vanilla para TOP, en el cual se diseñe y programé una calculadora sencilla y a la medida de mis necesidades.

El propósito era hacer que fuera lo más sencilla para usar y que esta sencillez se reflejara en el código.
Gran parte de las secuencias de uso corresponden a las calculadoras sencillas Casio.


**[Versión en vivo](https://dothedada.github.io/calculadora/)**

Propiedades
---
- Incorpora un panel con el historial de operaciones y 3 celdas para almacenar números, del cual se puede volver a llamar a operación los valores almacenados.
- Todos los números procesados, almacenados y calculados sólo existen en el DOM.
- Tiene la opción de bloquear un operando y una operación para realizar sumas, restas, multiplicaciones y diviciones reiterativas.
- Puede realizar acciones compuestas para el trabajo con porcentajes.
- Dentro del cálculo, soluciona errores comunes de JS como lo es el -0 o el de punto flotante como 0.1 + 0.2 = 0.3000000...1
- implementa el recorte de la extensión de números por notación científica o rendondeo de decimales, según sea necesario para que no superen los 10 caracteres.
- Acorta los valores de operación en la pantalla de memoria, de acuerdo a la extensión del número para que no se desborde el espacio asignado.
- Las animaciones de pantalla también se activan con el teclado.
- No usa eval().

Mejoras a futuro
---
- Que se adapte mejor a pantallas de teléfonos viejos
- Deconstruir la calculadora para que pueda funcionar a partir de líneas de texto introducidas.
- Crear la opción de introducir nuevas funciones de cálculo y secuencias.
