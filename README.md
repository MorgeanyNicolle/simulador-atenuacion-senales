# Simulador de Atenuación Pasiva de Señales

Aplicación web educativa desarrollada para analizar conceptualmente la propagación y la atenuación pasiva de señales móviles dentro de una infraestructura penitenciaria.

El simulador no transmite radiofrecuencia, no genera interferencia y no controla inhibidores activos de señal.

## Objetivo

Demostrar cómo la distancia, la frecuencia, el material y el grosor de los muros afectan la potencia recibida de una señal, utilizando el modelo de pérdida en espacio libre y coeficientes educativos de atenuación.

## Funcionalidades

- Selección de tecnologías desde 2G hasta 5G.
- Ajuste de frecuencia, distancia y potencia transmitida.
- Selección del material y grosor de los muros.
- Configuración de la cantidad de muros.
- Cálculo de longitud de onda.
- Cálculo de pérdida en espacio libre (FSPL).
- Estimación de pérdida producida por los materiales.
- Cálculo de la potencia recibida.
- Comparación entre 1900 MHz y 3.5 GHz.
- Representación gráfica del trayecto de la señal.
- Comparación con el umbral de comunicación.

## Fórmulas implementadas

### Longitud de onda

`λ = c / f`

Donde:

- `λ` es la longitud de onda en metros.
- `c` es la velocidad de la luz.
- `f` es la frecuencia en hercios.

### Pérdida en espacio libre

`FSPL = 32.44 + 20 log10(d) + 20 log10(f)`

En esta fórmula, la distancia se expresa en kilómetros y la frecuencia en megahercios.

### Pérdida por materiales

`ΣL = coeficiente × grosor × cantidad de muros`

### Balance de potencia

`Pr = Pt − FSPL − ΣL`

Donde:

- `Pr` es la potencia recibida.
- `Pt` es la potencia transmitida.
- `ΣL` representa las pérdidas ocasionadas por los muros.

## Tecnologías evaluadas

- 2G: 850 MHz.
- 3G: 1900 MHz.
- 4G: 2100 MHz.
- 5G Sub-6: 3.5 GHz.
- 5G mmWave: 28 GHz.

## Tecnologías utilizadas

- HTML5.
- CSS3.
- JavaScript.
- GitHub Pages.

## Uso del simulador

1. Seleccionar la tecnología y frecuencia.
2. Ajustar la distancia y la potencia transmitida.
3. Elegir el material del muro.
4. Configurar el grosor y la cantidad de muros.
5. Establecer el umbral de comunicación.
6. Presionar **Calcular atenuación**.
7. Analizar los resultados y la comparación entre frecuencias.

## Sitio web

[Acceder al simulador](https://morgeanynicolle.github.io/simulador-atenuacion-senales/)

## Limitaciones

Los coeficientes de atenuación utilizados son valores educativos de referencia. Los resultados reales pueden variar debido a la composición, densidad, humedad, aberturas, continuidad del blindaje y condiciones del entorno.

Cualquier implementación física requiere mediciones profesionales y autorización institucional.

## Consideración ética y legal

Este proyecto propone únicamente métodos de control pasivo. No contempla la construcción ni el uso de inhibidores activos o dispositivos que generen interferencia radioeléctrica.

## Autora

Morgeany García
