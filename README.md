# tplvi_Dai-Gurren
Kid Icarus (1986) clon using node.js

# GDD

Juego de plataformas y disparos.

# Comportamientos b�sicos del escenario (los tres primeros niveles):

* Scroll vertical (hacia arriba) de los niveles.
Las zonas que quedan debajo de la pantalla pasan a comportarse como ca�das letales.

* Movimiento toroidal por los lados, pueden pasar de un lado de la pantalla a otro el jugador,
los enemigos terrestres y los disparos.

* Gravedad, los enemigos que no juegan y el jugador caen hacia el suelo.

# Comportamientos del protagonista:

* Disparo, puede disparar hacia los lados y arriba, la flecha avanza una corta distancia y se destruye al impactar
con enemigos u obst�culos.

* Agacharse, puede agacharse para esquivar ataques o esconderse.

* Movimiento lateral, camina hacia los lados con peque�a aceleraci�n y algo de resbale al parar.

* Salto, la duraci�n se adapta al tiempo que se pulsa la tecla, la direcci�n puede modificarse al poco de saltar.

* Recoger objetos al entrar en contacto con ellos (corazones, pociones...).

# Tipos de enemigo:

* **Serpientes:** Se desplazan por el suelo y se dirigen hacia el jugador, mueren de un disparo.

* **Ojos voladores:** Enemigos que se desplazan por el aire en trayectorias el�pticas con el jugador como centro, mueren de un disparo.

* **Esqueletos:** Enemigos que patrullan un �rea de izquierda a derecha, si su linea de visi�n choca con el jugador se alarman,
se drigen hacia este e invocan esqueletos menores, requieren muchos disparos para ser eliminados.

* **Esqueletos menores:** Enemigos voladores que aparecen en un extremo de la pantalla y se dirigen hacia el jugador, mueren de un disparo.

* **Agachados:** Enemigos que tienen el mismo movimiento que las serpientes pero se agachan para esquivar disparos y tienen m�s vida.

* **Caras:** Enemigos voladores con un patr�n diferente al de los ojos


# Elementos del escenario:

* **Lava:** Causa da�o mientras se esta en ella.

* **Zarzas:** Causa da�o por contacto.

* **Hielo:** Aumenta el resbale.

* **Termas:** Restauran salud al jugador.

# Elementos no confirmados para implementaci�n:

* **Puertas** que permiten desplazamiento entre salas

* Salas de **bonificaci�n con jarrones**, revelas el contenido de jarrones hasta encontrar un esqueleto

* Salas de **bonificaci�n enemigos**, en estas aparecen carss, el jugador puede acabar con ellas y ganar puntos o salir

* Salas con **terma**

* **Tiendas**

* **Salas de prueba**

* **Primer palacio/mazmorra:** Estas fases est�n segmentadas en salas del tama�o de la pantalla, se puede avanzar hacia salss en las cuatro direcciones
hasta que se acaba llegando a la sala del jefe. Por el camino pueden liberarse aliados de estatuas con martillos para que ayuden en la pelea contra
el jefe.

* **Primer jefe:** Cerbero
