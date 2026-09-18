"use strict";

/* =================================
   ELEMENTOS DEL DOCUMENTO
================================= */

const frecuenciaInput = document.getElementById("frecuencia");
const distanciaInput = document.getElementById("distancia");
const potenciaInput = document.getElementById("potencia");
const materialInput = document.getElementById("material");
const grosorInput = document.getElementById("grosor");
const murosInput = document.getElementById("muros");
const umbralInput = document.getElementById("umbral");
const botonCalcular = document.getElementById("btn-calcular");

const valorDistancia = document.getElementById("valor-distancia");
const valorPotencia = document.getElementById("valor-potencia");
const valorGrosor = document.getElementById("valor-grosor");
const valorMuros = document.getElementById("valor-muros");
const valorUmbral = document.getElementById("valor-umbral");

const resultadoLongitud = document.getElementById("resultado-longitud");
const resultadoFSPL = document.getElementById("resultado-fspl");
const resultadoMaterial = document.getElementById("resultado-material");
const resultadoPotencia = document.getElementById("resultado-potencia");
const resultadoEstado = document.getElementById("resultado-estado");

const detallePotencia = document.getElementById("detalle-potencia");
const detalleFSPL = document.getElementById("detalle-fspl");
const detalleMaterial = document.getElementById("detalle-material");
const detalleRecibida = document.getElementById("detalle-recibida");

const mensajeUmbral = document.getElementById("mensaje-umbral");
const nivelSenal = document.getElementById("nivel-senal");
const marcaUmbral = document.getElementById("marca-umbral");

const tarjetaPrincipal = document.querySelector(
    ".tarjeta-resultado.principal"
);

const plano = document.getElementById("plano");
const contexto = plano.getContext("2d");

/* =================================
   CONSTANTES
================================= */

const VELOCIDAD_LUZ = 299792458;

/*
    Coeficientes educativos expresados en dB por metro.

    Estos valores se usan para demostrar el comportamiento
    matemático del simulador. No representan mediciones
    certificadas de una instalación real.
*/

const coeficientesMateriales = {
    ladrillo: {
        nombre: "Ladrillo",
        850: 12,
        1900: 18,
        2100: 20,
        3500: 28,
        28000: 120
    },

    concreto: {
        nombre: "Concreto reforzado",
        850: 30,
        1900: 45,
        2100: 50,
        3500: 75,
        28000: 300
    },

    malla: {
        nombre: "Malla de acero / Jaula de Faraday",
        850: 50,
        1900: 60,
        2100: 65,
        3500: 85,
        28000: 400
    }
};

/* =================================
   FUNCIONES MATEMÁTICAS
================================= */

/**
 * Calcula la longitud de onda.
 *
 * Frecuencia de entrada: MHz
 * Resultado: metros
 */
function calcularLongitudOnda(frecuenciaMHz) {
    const frecuenciaHz = frecuenciaMHz * 1_000_000;

    return VELOCIDAD_LUZ / frecuenciaHz;
}

/**
 * Calcula la pérdida de propagación en espacio libre.
 *
 * d = distancia en kilómetros
 * f = frecuencia en megahercios
 *
 * FSPL = 32.44 + 20 log10(d) + 20 log10(f)
 */
function calcularFSPL(distanciaMetros, frecuenciaMHz) {
    const distanciaKilometros = distanciaMetros / 1000;

    return (
        32.44 +
        20 * Math.log10(distanciaKilometros) +
        20 * Math.log10(frecuenciaMHz)
    );
}

/**
 * Calcula la pérdida estimada producida por los muros.
 *
 * Pérdida = coeficiente × grosor × cantidad de muros
 */
function calcularPerdidaMaterial(
    material,
    frecuenciaMHz,
    grosorMetros,
    cantidadMuros
) {
    const coeficiente =
        coeficientesMateriales[material][frecuenciaMHz];

    return coeficiente * grosorMetros * cantidadMuros;
}

/**
 * Calcula la potencia recibida.
 *
 * Pr = Pt - FSPL - pérdida por materiales
 */
function calcularPotenciaRecibida(
    potenciaTransmitida,
    perdidaFSPL,
    perdidaMaterial
) {
    return potenciaTransmitida - perdidaFSPL - perdidaMaterial;
}

/**
 * Limita un número entre un valor mínimo y máximo.
 */
function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

/**
 * Presenta correctamente los valores negativos.
 */
function formatearNumero(valor, decimales = 2) {
    return valor.toFixed(decimales).replace("-", "−");
}

/* =================================
   LECTURA DE LOS CONTROLES
================================= */

function obtenerVariables() {
    return {
        frecuencia: Number(frecuenciaInput.value),
        distancia: Number(distanciaInput.value),
        potencia: Number(potenciaInput.value),
        material: materialInput.value,
        grosor: Number(grosorInput.value),
        muros: Number(murosInput.value),
        umbral: Number(umbralInput.value)
    };
}

/* =================================
   ACTUALIZACIÓN DE ETIQUETAS
================================= */

function actualizarEtiquetas() {
    const variables = obtenerVariables();

    valorDistancia.textContent = `${variables.distancia} m`;

    valorPotencia.textContent =
        `${formatearNumero(variables.potencia, 0)} dBm`;

    valorGrosor.textContent =
        `${variables.grosor.toFixed(2)} m`;

    valorMuros.textContent =
        variables.muros === 1
            ? "1 muro"
            : `${variables.muros} muros`;

    valorUmbral.textContent =
        `${formatearNumero(variables.umbral, 0)} dBm`;
}

/* =================================
   CÁLCULO PRINCIPAL
================================= */

function realizarCalculo() {
    const variables = obtenerVariables();

    const longitudOnda = calcularLongitudOnda(
        variables.frecuencia
    );

    const perdidaFSPL = calcularFSPL(
        variables.distancia,
        variables.frecuencia
    );

    const perdidaMaterial = calcularPerdidaMaterial(
        variables.material,
        variables.frecuencia,
        variables.grosor,
        variables.muros
    );

    const potenciaRecibida = calcularPotenciaRecibida(
        variables.potencia,
        perdidaFSPL,
        perdidaMaterial
    );

    mostrarResultados({
        ...variables,
        longitudOnda,
        perdidaFSPL,
        perdidaMaterial,
        potenciaRecibida
    });

    realizarComparacion(variables);

    dibujarPlano({
        ...variables,
        potenciaRecibida
    });
}

/* =================================
   PRESENTACIÓN DE RESULTADOS
================================= */

function mostrarResultados(datos) {
    resultadoLongitud.textContent =
        `${datos.longitudOnda.toFixed(3)} m`;

    resultadoFSPL.textContent =
        `${datos.perdidaFSPL.toFixed(2)} dB`;

    resultadoMaterial.textContent =
        `${datos.perdidaMaterial.toFixed(2)} dB`;

    resultadoPotencia.textContent =
        `${formatearNumero(datos.potenciaRecibida)} dBm`;

    detallePotencia.textContent =
        `${formatearNumero(datos.potencia, 0)} dBm`;

    detalleFSPL.textContent =
        `${datos.perdidaFSPL.toFixed(2)} dB`;

    detalleMaterial.textContent =
        `${datos.perdidaMaterial.toFixed(2)} dB`;

    detalleRecibida.textContent =
        `${formatearNumero(datos.potenciaRecibida)} dBm`;

    const estaDebajoDelUmbral =
        datos.potenciaRecibida < datos.umbral;

    tarjetaPrincipal.classList.remove("estado-bajo");

    if (estaDebajoDelUmbral) {
        resultadoEstado.textContent =
            "La potencia está por debajo del umbral configurado.";

        mensajeUmbral.textContent =
            `La señal estimada se encuentra por debajo de ` +
            `${formatearNumero(datos.umbral, 0)} dBm. ` +
            `En este modelo, la comunicación no sería confiable.`;

        tarjetaPrincipal.classList.add("estado-bajo");
    } else {
        resultadoEstado.textContent =
            "La potencia permanece por encima del umbral.";

        mensajeUmbral.textContent =
            `La señal estimada todavía supera el umbral de ` +
            `${formatearNumero(datos.umbral, 0)} dBm. ` +
            `Se necesita mayor atenuación pasiva.`;
    }

    actualizarBarraSenal(
        datos.potenciaRecibida,
        datos.umbral
    );
}

/* =================================
   BARRA DE INTENSIDAD
================================= */

function actualizarBarraSenal(potenciaRecibida, umbral) {
    /*
        La escala visual se representa entre:
        -120 dBm = señal extremadamente débil
        -30 dBm  = señal muy fuerte
    */

    const minimo = -120;
    const maximo = -30;

    const porcentajeSenal =
        ((potenciaRecibida - minimo) / (maximo - minimo)) * 100;

    const porcentajeUmbral =
        ((umbral - minimo) / (maximo - minimo)) * 100;

    nivelSenal.style.width =
        `${limitar(porcentajeSenal, 0, 100)}%`;

    marcaUmbral.style.left =
        `${limitar(porcentajeUmbral, 0, 100)}%`;

    marcaUmbral.querySelector("span").textContent =
        `Umbral: ${formatearNumero(umbral, 0)} dBm`;
}

/* =================================
   COMPARACIÓN 1900 MHz Y 3.5 GHz
================================= */

function realizarComparacion(variables) {
    const resultado1900 = calcularEscenario(
        1900,
        variables
    );

    const resultado3500 = calcularEscenario(
        3500,
        variables
    );

    document.getElementById(
        "comparacion-longitud-1900"
    ).textContent = `${resultado1900.longitud.toFixed(3)} m`;

    document.getElementById(
        "comparacion-longitud-3500"
    ).textContent = `${resultado3500.longitud.toFixed(3)} m`;

    document.getElementById(
        "comparacion-fspl-1900"
    ).textContent = `${resultado1900.fspl.toFixed(2)} dB`;

    document.getElementById(
        "comparacion-fspl-3500"
    ).textContent = `${resultado3500.fspl.toFixed(2)} dB`;

    document.getElementById(
        "comparacion-material-1900"
    ).textContent =
        `${resultado1900.perdidaMaterial.toFixed(2)} dB`;

    document.getElementById(
        "comparacion-material-3500"
    ).textContent =
        `${resultado3500.perdidaMaterial.toFixed(2)} dB`;

    document.getElementById(
        "comparacion-potencia-1900"
    ).textContent =
        `${formatearNumero(resultado1900.potenciaRecibida)} dBm`;

    document.getElementById(
        "comparacion-potencia-3500"
    ).textContent =
        `${formatearNumero(resultado3500.potenciaRecibida)} dBm`;

    const diferenciaFSPL =
        resultado3500.fspl - resultado1900.fspl;

    const diferenciaMaterial =
        resultado3500.perdidaMaterial -
        resultado1900.perdidaMaterial;

    const nombreMaterial =
        coeficientesMateriales[variables.material].nombre;

    const conclusion = document.getElementById(
        "conclusion-comparacion"
    );

    conclusion.textContent =
        `Bajo las mismas condiciones, 3.5 GHz presenta ` +
        `${diferenciaFSPL.toFixed(2)} dB más de FSPL y ` +
        `${diferenciaMaterial.toFixed(2)} dB más de pérdida ` +
        `estimada en ${nombreMaterial} que 1900 MHz. ` +
        `Por ello, la frecuencia de 3.5 GHz resulta más fácil ` +
        `de atenuar mediante este modelo pasivo.`;
}

function calcularEscenario(frecuencia, variables) {
    const longitud = calcularLongitudOnda(frecuencia);

    const fspl = calcularFSPL(
        variables.distancia,
        frecuencia
    );

    const perdidaMaterial = calcularPerdidaMaterial(
        variables.material,
        frecuencia,
        variables.grosor,
        variables.muros
    );

    const potenciaRecibida = calcularPotenciaRecibida(
        variables.potencia,
        fspl,
        perdidaMaterial
    );

    return {
        longitud,
        fspl,
        perdidaMaterial,
        potenciaRecibida
    };
}

/* =================================
   PLANO 2D
================================= */

function dibujarPlano(datos) {
    const ancho = plano.width;
    const alto = plano.height;

    contexto.clearRect(0, 0, ancho, alto);

    dibujarFondoPlano(ancho, alto);
    dibujarInfraestructura(ancho, alto);
    dibujarTrayecto(ancho, alto, datos);
    dibujarFuente(alto);
    dibujarMuros(ancho, alto, datos);
    dibujarReceptor(ancho, alto, datos);
    dibujarInformacionPlano(ancho, datos);
}

function dibujarFondoPlano(ancho, alto) {
    contexto.fillStyle = "#eef3f6";
    contexto.fillRect(0, 0, ancho, alto);

    contexto.strokeStyle = "#d7e0e7";
    contexto.lineWidth = 1;

    for (let x = 0; x <= ancho; x += 40) {
        contexto.beginPath();
        contexto.moveTo(x, 0);
        contexto.lineTo(x, alto);
        contexto.stroke();
    }

    for (let y = 0; y <= alto; y += 40) {
        contexto.beginPath();
        contexto.moveTo(0, y);
        contexto.lineTo(ancho, y);
        contexto.stroke();
    }
}

function dibujarInfraestructura(ancho, alto) {
    contexto.fillStyle = "rgba(255, 255, 255, 0.78)";
    contexto.strokeStyle = "#163a5f";
    contexto.lineWidth = 4;

    contexto.fillRect(170, 75, ancho - 340, alto - 150);
    contexto.strokeRect(170, 75, ancho - 340, alto - 150);

    contexto.fillStyle = "#163a5f";
    contexto.font = "bold 18px Arial";
    contexto.fillText(
        "Infraestructura penitenciaria conceptual",
        190,
        108
    );
}

function dibujarTrayecto(ancho, alto, datos) {
    const inicioX = 90;
    const finalX = ancho - 90;
    const centroY = alto / 2;

    const gradiente = contexto.createLinearGradient(
        inicioX,
        centroY,
        finalX,
        centroY
    );

    gradiente.addColorStop(0, "#2e6f9e");
    gradiente.addColorStop(
        1,
        datos.potenciaRecibida < datos.umbral
            ? "#b44242"
            : "#3e7c59"
    );

    contexto.strokeStyle = gradiente;
    contexto.lineWidth = 7;
    contexto.setLineDash([16, 10]);

    contexto.beginPath();
    contexto.moveTo(inicioX + 35, centroY);
    contexto.lineTo(finalX - 35, centroY);
    contexto.stroke();

    contexto.setLineDash([]);
}

function dibujarFuente(alto) {
    const x = 90;
    const y = alto / 2;

    contexto.fillStyle = "#2e6f9e";
    contexto.beginPath();
    contexto.arc(x, y, 30, 0, Math.PI * 2);
    contexto.fill();

    contexto.fillStyle = "#ffffff";
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.fillText("TX", x, y + 6);

    contexto.fillStyle = "#163a5f";
    contexto.font = "bold 15px Arial";
    contexto.fillText("Fuente", x, y + 55);

    contexto.textAlign = "left";
}

function dibujarMuros(ancho, alto, datos) {
    const centroY = alto / 2;
    const inicio = 260;
    const final = ancho - 260;
    const espacio =
        datos.muros === 1
            ? 0
            : (final - inicio) / (datos.muros - 1);

    const grosorVisual = limitar(
        18 + datos.grosor * 18,
        20,
        48
    );

    for (let i = 0; i < datos.muros; i++) {
        const x =
            datos.muros === 1
                ? ancho / 2
                : inicio + espacio * i;

        contexto.fillStyle =
            datos.material === "ladrillo"
                ? "#b76a47"
                : datos.material === "concreto"
                    ? "#68747e"
                    : "#46515a";

        contexto.fillRect(
            x - grosorVisual / 2,
            125,
            grosorVisual,
            alto - 250
        );

        if (datos.material === "malla") {
            contexto.strokeStyle = "#d3dae0";
            contexto.lineWidth = 2;

            for (let y = 135; y < alto - 125; y += 18) {
                contexto.beginPath();
                contexto.moveTo(
                    x - grosorVisual / 2,
                    y
                );
                contexto.lineTo(
                    x + grosorVisual / 2,
                    y + 12
                );
                contexto.stroke();
            }
        }

        contexto.fillStyle = "#17212b";
        contexto.font = "bold 13px Arial";
        contexto.textAlign = "center";
        contexto.fillText(
            `Muro ${i + 1}`,
            x,
            centroY + 115
        );
    }

    contexto.textAlign = "left";
}

function dibujarReceptor(ancho, alto, datos) {
    const x = ancho - 90;
    const y = alto / 2;

    const color =
        datos.potenciaRecibida < datos.umbral
            ? "#b44242"
            : "#3e7c59";

    contexto.fillStyle = color;
    contexto.beginPath();
    contexto.arc(x, y, 30, 0, Math.PI * 2);
    contexto.fill();

    contexto.fillStyle = "#ffffff";
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.fillText("RX", x, y + 6);

    contexto.fillStyle = color;
    contexto.font = "bold 15px Arial";
    contexto.fillText("Receptor", x, y + 55);

    contexto.textAlign = "left";
}

function dibujarInformacionPlano(ancho, datos) {
    const nombreMaterial =
        coeficientesMateriales[datos.material].nombre;

    contexto.fillStyle = "rgba(255, 255, 255, 0.92)";
    contexto.strokeStyle = "#d4dde5";
    contexto.lineWidth = 1;

    contexto.fillRect(ancho - 345, 18, 325, 78);
    contexto.strokeRect(ancho - 345, 18, 325, 78);

    contexto.fillStyle = "#163a5f";
    contexto.font = "bold 14px Arial";
    contexto.fillText(
        `${datos.frecuencia} MHz | ${datos.distancia} m`,
        ancho - 330,
        45
    );

    contexto.fillStyle = "#5c6873";
    contexto.font = "13px Arial";
    contexto.fillText(
        `${nombreMaterial} | ${datos.grosor.toFixed(2)} m`,
        ancho - 330,
        68
    );

    contexto.fillText(
        `${datos.muros} muro(s) | ${formatearNumero(
            datos.potenciaRecibida
        )} dBm`,
        ancho - 330,
        88
    );
}

/* =================================
   EVENTOS
================================= */

botonCalcular.addEventListener("click", realizarCalculo);

const controles = [
    frecuenciaInput,
    distanciaInput,
    potenciaInput,
    materialInput,
    grosorInput,
    murosInput,
    umbralInput
];

controles.forEach((control) => {
    control.addEventListener("input", () => {
        actualizarEtiquetas();
        realizarCalculo();
    });
});

/* =================================
   INICIO DEL SIMULADOR
================================= */

actualizarEtiquetas();
realizarCalculo();