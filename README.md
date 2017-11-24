# Kid Icarus (1986) clon using node.js

Created by
[Sergio Abreu García](https://github.com/SAGGameDeveloper) and
[Diego Martínez Simarro](https://github.com/dimart10).

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

Se pretende recrear el primer mundo de Kid Icarus, compuesto por los tres primeros niveles, la primera mazmorra y la primera fortaleza.
Adicionalmente se implementará un modo fácil, en el que el scroll vertical de la pantalla sea reversible (no mueras al caer) y algunos
cambios pequeños en el gameplay para hacerlo más sencillo. Algunos elementos que quedan dentro del corte que pretendemos recrear podrían
quedar fuera de la versión final, como salas de bonus y desafío.

## Comportamientos básicos del escenario (los tres primeros niveles):

* Scroll vertical (hacia arriba) de los niveles.
Las zonas que quedan debajo de la pantalla pasan a comportarse como caídas letales.

* Movimiento toroidal por los lados, pueden pasar de un lado de la pantalla a otro el jugador,
los enemigos terrestres y los disparos.

* Gravedad, los enemigos que no juegan y el jugador caen hacia el suelo.

## Comportamientos del protagonista:

* Disparo, puede disparar hacia los lados y arriba, la flecha avanza una corta distancia y se destruye al impactar
con enemigos u obstáculos.

* Agacharse, puede agacharse para esquivar ataques o esconderse.

* Movimiento lateral, camina hacia los lados con pequeña aceleración y algo de resbale al parar.

* Salto, la duración se adapta al tiempo que se pulsa la tecla, la dirección puede modificarse al poco de saltar.

* Recoger objetos al entrar en contacto con ellos (corazones, pociones...).

## Tipos de enemigo:

* **Serpientes:** Se desplazan por el suelo y se dirigen hacia el jugador, mueren de un disparo.

* **Ojos voladores:** Enemigos que se desplazan por el aire en trayectorias elípticas con el jugador como centro, mueren de un disparo.

* **Esqueletos:** Enemigos que patrullan un área de izquierda a derecha, si su linea de visión choca con el jugador se alarman,
se drigen hacia este e invocan esqueletos menores, requieren muchos disparos para ser eliminados.

* **Esqueletos menores:** Enemigos voladores que aparecen en un extremo de la pantalla y se dirigen hacia el jugador, mueren de un disparo.

* **Agachados:** Enemigos que tienen el mismo movimiento que las serpientes pero se agachan para esquivar disparos y tienen más vida.

* **Caras:** Enemigos voladores con un patrón diferente al de los ojos.


## Elementos del escenario:

* **Lava:** Causa daño mientras se esta en ella.

* **Zarzas:** Causa daño por contacto.

* **Hielo:** Aumenta el deslizamiento.

* **Termas:** Restauran salud al jugador.

* **Puertas** que permiten desplazamiento entre salas.

## Elementos no prioritarios, cuya implementación podría descartarse según el ritmo del proyecto

* Salas de **bonificación con jarrones**, revelas el contenido de jarrones, recibes su contenido a no ser que reveles un esqueleto,
entonces pierdes todo lo que hubieras revelado.

* Salas de **bonificación enemigos**, en estas aparecen carss, el jugador puede acabar con ellas y ganar puntos o salir.

* **Tiendas** en la que comprar objetos y potenciadores con los corazones recolectados.

* **Salas de prueba**.

# Planificación (modelo inicial)

Versión inicial de la planificación por hitos

## Primer hito

Este hito icluye una demostración inicial del comportamiento del personaje y el escenario.

* **Físicas básicas del escenario**. Construir un escenario básico funcional en el que el jugador pueda desplazarse y saltar, con algunas
plataformas para probar el salto.

* **Versión inicial del movimiento del personaje**. El personaje debe poder desplazarse a derecha e izqueirda, además de poder saltar.
El salto sería una versión básica sin tener que emular con gran precisión el comportamiento del juego original.

* **Disparo**. El personaje debe poder disparar flechas en las tres direcciones, esto incluye el comportamiento base de las flechas, 
que se desplacen en la dirección que fueron lanzadas y desaparezcan tras cierto tiempo.

## Segundo hito

Este hito supone el grueso del proyecto, en este deberán implementarse los diferentes elementos del escenario, enemigos, sus interacciones...

* Respecto al orden de implementacion se empezará con un **prototipo de enemigo** y el sistema de vida, para que dicho enemigo sea destruible y cause daño al jugador.
A partir de esa base ya se podrán crear los diferentes enemigos con sus comportamientos específicos.

* También es prioritario el sistema por el que el jugador **interactúa** con diferentes elementos (recolección de objetos, elementos del escenario que causan daño etc)
En base a esto se podrán crear las diferentes entidades con sus características y comportamientos propios.

Al final de este hito deberían estar hechos la mayoría de enemigos, elementos del escenario etc. Teniendo un implementación sólida de los tres primeros niveles y la fortaleza.

## Tercer hito

Hito más amplío que el primero pero más limitado que el segundo, debería dedicarse a **pulir** elementos del juego como menús, gráficos, sonido, **balanceo** del gameplay e incluir algún elemento
que hubiera quedado fuera del hito 2.

