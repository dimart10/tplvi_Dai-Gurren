# Kid Icarus (1986) clon using node.js

Readme by
[gituser](https://github.com/SAGGameDeveloper).
[gituser](https://github.com/dimart10).

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

Juego de plataformas y disparos.

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

* **Caras:** Enemigos voladores con un patrón diferente al de los ojos


## Elementos del escenario:

* **Lava:** Causa daño mientras se esta en ella.

* **Zarzas:** Causa daño por contacto.

* **Hielo:** Aumenta el deslizamiento.

* **Termas:** Restauran salud al jugador.

## Elementos no confirmados para implementaci�n:

* **Puertas** que permiten desplazamiento entre salas

* Salas de **bonificación con jarrones**, revelas el contenido de jarrones hasta encontrar un esqueleto

* Salas de **bonificación enemigos**, en estas aparecen carss, el jugador puede acabar con ellas y ganar puntos o salir

* Salas con **terma**

* **Tiendas**

* **Salas de prueba**

* **Primer palacio/mazmorra:** Estas fases están segmentadas en salas del tamaño de la pantalla, se puede avanzar hacia salas en las cuatro direcciones
hasta que se acaba llegando a la sala del jefe. Por el camino pueden liberarse aliados de estatuas con martillos para que ayuden en la pelea contra
el jefe.

* **Primer jefe:** Cerbero
