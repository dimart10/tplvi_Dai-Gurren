# tplvi_Dai-Gurren
Kid Icarus (1986) clon using node.js

#GDD

Juego de plataformas y disparos.

#Comportamientos básicos del escenario:

Scroll vertical (hacia arriba) de los niveles.
Las zonas que quedan debajo de la pantalla pasan a comportarse como caídas letales.

Movimiento toroidal por los lados, pueden pasar de un lado de la pantalla a otro el jugador,
los enemigos terrestres y los disparos.

Gravedad, los enemigos que no juegan y el jugador caen hacia el suelo.

#Comportamientos del protagonista:

Disparo, puede disparar hacia los lados y arriba, la flecha avanza una corta distancia y se destruye al impactar
con enemigos u obstáculos.

Agacharse, puede agacharse para esquivar ataques o esconderse.

Movimiento lateral, camina hacia los lados con pequeña aceleración y algo de resbale al parar.

Salto, la duración se adapta al tiempo que se pulsa la tecla, la dirección puede modificarse al poco de saltar.

Recoger objetos al entrar en contacto con ellos (corazones, pociones...).

#Tipos de enemigo:

-Serpientes
-Ojos voladores
-Esqueletos
	-Esqueletos menores

#Elementos del escenario:
-Lava
-Zarzas
-Hielo