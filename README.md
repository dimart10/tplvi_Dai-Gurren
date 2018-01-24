# Kid Icarus (1986) clon using node.js

## Play it [here](https://dimart10.github.io/tplvi_Dai-Gurren/)!!!

Created by
[Sergio Abreu Garc�a](https://github.com/SAGGameDeveloper) and
[Diego Mart�nez Simarro](https://github.com/dimart10).

Initial scaffolding generated with [generator-gamejam](https://github.com/belen-albeza/generator-gamejam/).

## Installation

### Requirements

This games uses [gulp](http://gulpjs.com/) for building and tasks automation.

You can install gulp with npm:

```
npm install -g gulp
```

### Build

Clone this repository and install dependencies:

```
git clone dimart10/tplvi_Dai-Gurren
cd tplvi_Dai-Gurren
npm install
```

To **build** the game, run the `dist` task from the project root:

```
gulp dist
```

The `dist` folder will contain a build of the game. You can then start a local server that serves this directory statically to play the game in local:

```
npm install -g http-server
http-server dist
```

You can **clean up** the temporary files and the `dist` folder by running:

```
gulp clean
```

## Development

This project uses [Browserify](http://browserify.org) to handle JavaScript modules.

There is a task that will automatically run Browserify when a JavaScript file changes, and it will also reload the browser.

```
gulp run
```

You can deploy to **Github Pages** with the `deploy:ghpages` task, which will build the project and then push the `dist` folder in the `gh-pages` branch.

```
gulp deploy:ghpages
```


# GDD (Spanish)

## Objetivos generales

Recreaci�n con ciertas licencias del juego Kid Icarus (1986). Se ha pretendido conservar el acabado del juego original (sprites, m�sica, sfx...). Tambi�n hemos tratado de imitar el gameplay, aunque la dificultad ha sido algo reducida, en esta version el scroll vertical es reversible, comienzas con m�s vida, los objetos encontrados en las salas no cuestan corazones...

El juego incluye los tres primeros niveles del juego original (underworld) y el primer jefe (Twinbellows), con los variados enemigos y elementos que aparecen en ellos. Tambi�n incluye varios objetos, (el arco bendito, que hace que las flechas atraviesen varios enemigos, objetos curativos, mejoras de stats...) aunque el efecto de algunos- Las salas extra que aparecen en el juego original tambi�n han sido modificadas.

## Controles

El personaje se controla con las flechas de direcci�n, puede moverse a derecha, izquierda, agacharse y apuntar hacia arriba. Con A dispara una flecha en la direcci�n actual y salta con la barra espaciadora (el salto depende del tiempo que permanece pulsada). Los men�s se maniobran con las flechas de direcci�n y se eligen las opciones con intro. Pulsar escape devuelve al men� inicial.

## Conclusi�n

Recreaci�n del cl�sico que pretende acercar el original a jugadores que no lo hayan experimentado. Conserva la experiencia base y trata de hacerla m�s accesible. La intenci�n es que aquellos que lo jueguen lo disfruten y les incite a jugar al original, un cl�sico con un nivel de profundidad sorprendente que a menudo es pasado por alto a pesar de sus grandes innovaciones.


# Planificaci�n (modelo inicial)

Versi�n inicial de la planificaci�n por hitos

## Primer hito

Este hito icluye una demostraci�n inicial del comportamiento del personaje y el escenario.

* **F�sicas b�sicas del escenario**. Construir un escenario b�sico funcional en el que el jugador pueda desplazarse y saltar, con algunas
plataformas para probar el salto.

* **Versi�n inicial del movimiento del personaje**. El personaje debe poder desplazarse a derecha e izqueirda, adem�s de poder saltar.
El salto ser�a una versi�n b�sica sin tener que emular con gran precisi�n el comportamiento del juego original.

* **Disparo**. El personaje debe poder disparar flechas en las tres direcciones, esto incluye el comportamiento base de las flechas, 
que se desplacen en la direcci�n que fueron lanzadas y desaparezcan tras cierto tiempo.

## Segundo hito

Este hito supone el grueso del proyecto, en este deber�n implementarse los diferentes elementos del escenario, enemigos, sus interacciones...

* Respecto al orden de implementacion se empezar� con un **prototipo de enemigo** y el sistema de vida, para que dicho enemigo sea destruible y cause da�o al jugador.
A partir de esa base ya se podr�n crear los diferentes enemigos con sus comportamientos espec�ficos.

* Tambi�n es prioritario el sistema por el que el jugador **interact�a** con diferentes elementos (recolecci�n de objetos, elementos del escenario que causan da�o etc)
En base a esto se podr�n crear las diferentes entidades con sus caracter�sticas y comportamientos propios.

Al final de este hito deber�an estar hechos la mayor�a de enemigos, elementos del escenario etc. Teniendo un implementaci�n s�lida de los tres primeros niveles.

## Tercer hito

Hito m�s ampl�o que el primero pero m�s limitado que el segundo, deber�a dedicarse a **pulir** elementos del juego como men�s, gr�ficos, sonido, **balanceo** del gameplay e incluir alg�n elemento
que hubiera quedado fuera del hito 2.

