# Glosario de ventanas, cerramientos y cerrajería de AMS Cerramientos.
import re, unicodedata
from pages_new import BTN, BTN2, sec, head, LINK
from menu_iconos import IC as _IC
from glosario_picto import P as _PIC

L = {
    "pvc": ("/ventanas-pvc", "ventanas de PVC"), "alu": ("/ventanas-aluminio", "ventanas de aluminio"),
    "terr": ("/cerramientos-terrazas", "cerramientos de terraza"), "perg": ("/pergolas", "pérgolas"),
    "toldos": ("/toldos", "toldos"), "canc": ("/cancelas-puertas", "cancelas y puertas"), "rejas": ("/cancelas-puertas", "cancelas y puertas"),
    "auto": ("/automatismos", "automatismos"), "pers": ("/persianas-cristales", "persianas y cristales"), "techos": ("/techos", "techos de aluminio"),
    "acab": ("/acabados", "acabados y colores"), "com": ("/comunidades", "comunidades de vecinos"),
    "rpt": ("/blog/rotura-puente-termico", "guía de rotura de puente térmico"), "osc": ("/blog/ventanas-oscilobatientes", "guía de ventanas oscilobatientes"),
    "pa": ("/blog/pvc-o-aluminio", "PVC o aluminio"), "cond": ("/blog/condensacion-ventanas", "guía de condensación"),
    "kom": ("/blog/kommerling-76-ad-md-xtrem", "Kömmerling 76 AD y 76 MD"), "caj": ("/blog/cajones-persiana-aislados", "cajones de persiana"),
    "inst": ("/blog/instalacion-ventanas-pvc", "cómo se instala una ventana de PVC"), "mant": ("/blog/mantenimiento-limpieza-ventanas", "mantenimiento de ventanas"),
    "canb": ("/blog/cancelas-aluminio-soldado", "guía de cancelas de aluminio soldado"), "ter$": ("/blog/precio-cerrar-terraza", "precio de cerrar una terraza"),
    "ayu": ("/blog/ayudas-cambiar-ventanas-madrid", "ayudas para cambiar ventanas"), "cfg": ("/configurador", "configurador de ventanas"),
}

# (término, categoría, definición, [claves de enlaces])
T = [
# --- Partes de una ventana
("Marco", "Partes de la ventana", "Es la parte fija de la ventana, la que queda unida a la pared. Rodea el hueco y sobre él giran o se deslizan las hojas. Un marco bien fijado y bien sellado por todo el perímetro es tan importante como el vidrio.", ["inst"]),
("Hoja", "Partes de la ventana", "Es la parte móvil de la ventana: el bastidor con su vidrio que se abre, se desliza o se inclina. Una ventana puede tener una, dos o más hojas, y alguna puede ser fija.", ["osc"]),
("Hoja fija", "Partes de la ventana", "Hoja que no se abre. Se usa para ganar luz en huecos grandes sin pagar el herraje de una hoja móvil, o por estética. Se combina con hojas practicables o correderas.", ["alu"]),
("Perfil", "Partes de la ventana", "Cada una de las piezas alargadas de PVC o aluminio con las que se construyen marcos y hojas. Su forma interior (cámaras, refuerzos, juntas) determina el aislamiento y la resistencia. Se habla de perfil o de serie según el fabricante.", ["pvc", "alu"]),
("Serie (sistema de perfiles)", "Partes de la ventana", "Gama de perfiles de un fabricante con unas prestaciones concretas, por ejemplo Kömmerling 76 AD. Al pedir presupuesto conviene que figure la serie exacta, no solo \"ventana de PVC\".", ["kom"]),
("Premarco", "Partes de la ventana", "Marco auxiliar que se fija a la obra antes de colocar la ventana. Es habitual en obra nueva y en ventanas con cajón de persiana integrado. Permite montar la ventana al final, sin dañarla con la obra.", ["inst"]),
("Cerco", "Partes de la ventana", "Marco antiguo, normalmente de madera o de hierro, sobre el que se apoya una ventana vieja. En una reforma puede retirarse o aprovecharse para colocar la ventana nueva sobre él.", ["inst"]),
("Junquillo", "Partes de la ventana", "Listón que sujeta el vidrio contra la hoja, por el lado interior. En ventanas de calidad el junquillo va con junta coextrusionada para sellar el vidrio.", []),
("Galce", "Partes de la ventana", "Hueco del perfil donde se aloja el vidrio. La profundidad de galce marca el espesor máximo de cristal que admite: por ejemplo, 16 a 50 mm permite desde un doble vidrio normal hasta uno triple.", ["kom"]),
("Travesaño y montante", "Partes de la ventana", "Piezas que dividen una hoja o un hueco en zonas. El montante es vertical y el travesaño, horizontal. Se usan para separar hojas fijas de móviles o para colocar un vidrio superior.", []),
("Refuerzo de acero", "Partes de la ventana", "Pieza de acero galvanizado que va dentro de los perfiles de PVC (y de algunos de aluminio) para darles rigidez. Sin refuerzo, una hoja grande de PVC se deforma. Por eso el tamaño máximo de una hoja depende de la serie.", ["pvc", "kom"]),
("Cámaras (de un perfil)", "Partes de la ventana", "Huecos estancos en el interior de un perfil de PVC. Más cámaras suelen significar mejor aislamiento. Es una de varias claves, no la única: también cuentan el espesor de las paredes, el refuerzo y las juntas.", ["kom"]),
("Junta", "Partes de la ventana", "Banda de goma o similar que sella el contacto entre hoja y marco y entre vidrio y perfil. Son las que impiden que pasen aire, agua y ruido. Con los años se resecan; el fabricante recomienda cuidarlas una vez al año.", ["mant"]),
("Cajón de persiana", "Persianas y protección solar", "Caja que aloja la persiana enrollada, encima de la ventana. Si no está aislado, por ahí se escapa calor y entra frío. Se puede sustituir por uno aislado sin cambiar toda la ventana.", ["caj"]),
("Monoblock", "Persianas y protección solar", "Conjunto prefabricado que incluye la ventana, el cajón de persiana y la persiana en una sola pieza. Se monta en un solo paso y garantiza continuidad del aislamiento entre las tres partes.", ["caj"]),
("Tapajuntas", "Partes de la ventana", "Moldura que oculta la unión entre el marco y la pared por dentro o por fuera. Es un remate estético; el sellado de verdad va detrás.", []),
("Alféizar", "Partes de la ventana", "Superficie horizontal en la parte inferior del hueco de la ventana, normalmente por el lado interior. Sirve de apoyo y remate.", []),
("Vierteaguas", "Partes de la ventana", "Pieza inclinada, por el exterior y en la parte baja de la ventana, que expulsa el agua de lluvia hacia fuera para que no resbale por la fachada ni entre en el marco. Suele ser de aluminio, piedra o cerámica.", []),
("Dintel y jamba", "Partes de la ventana", "El dintel es el cierre horizontal superior del hueco de la ventana y las jambas, los laterales. Se mencionan al medir, porque las medidas se toman entre jambas y entre alféizar y dintel.", []),
("Hueco", "Partes de la ventana", "Abertura de la pared donde va la ventana. Las medidas del hueco, y no las de la ventana vieja, son las que mandan al encargar una ventana nueva.", ["inst"]),
# --- Tipos de apertura
("Practicable (abatible)", "Aperturas y herrajes", "Hoja que gira sobre bisagras laterales y se abre hacia dentro, como una puerta. Cierra por presión contra el marco con juntas, por eso sella mejor que una corredera y aísla mejor del ruido.", ["osc", "alu"]),
("Oscilobatiente", "Aperturas y herrajes", "Ventana con una sola manilla y dos aperturas: se abre como una practicable o se inclina desde arriba para ventilar sin abrirla del todo. Cierra por varios puntos, lo que mejora el sellado y la seguridad.", ["osc"]),
("Oscilante", "Aperturas y herrajes", "Hoja que solo se inclina desde arriba, con eje en la parte inferior, para ventilar. No se abre del todo. Es habitual en baños y cocinas.", []),
("Corredera", "Aperturas y herrajes", "Hoja que se desliza lateralmente sobre carriles, sin ocupar espacio al abrirse. Es útil en huecos anchos o con poco fondo, pero sella algo menos que una practicable.", ["alu", "terr"]),
("Corredera elevable", "Aperturas y herrajes", "Corredera para ventanales grandes: al girar la manilla la hoja se eleva unos milímetros, se desliza con poco esfuerzo y al cerrar baja y se comprime contra las juntas, con un sellado mucho mejor que una corredera normal.", ["alu"]),
("Proyectante", "Aperturas y herrajes", "Hoja que se abre hacia fuera girando sobre un eje horizontal superior. Deja ventilar con la ventana parcialmente abierta aunque llueva. Es común en cocinas y en ventanas altas.", []),
("Pivotante", "Aperturas y herrajes", "Hoja que gira sobre un eje central, vertical u horizontal. Permite limpiar el exterior desde dentro. Se usa en huecos especiales.", []),
("Plegable o de librillo", "Aperturas y herrajes", "Ventana con hojas articuladas que se pliegan sobre sí mismas, como un libro, y dejan casi todo el hueco abierto. Es habitual en cerramientos de terraza y cocinas abiertas.", ["terr"]),
("Mallorquina", "Aperturas y herrajes", "Hoja de lamas que se abre como una contraventana y que regula luz y ventilación, tradicional del Mediterráneo. En aluminio se fabrica a medida.", ["alu"]),
("Herraje", "Aperturas y herrajes", "Conjunto de mecanismos metálicos de una ventana: bisagras, cierres, brazos, manilla. Es la pieza que más define cuánto dura una ventana practicable u oscilobatiente. Un herraje flojo es la avería más común.", ["osc", "mant"]),
("Cierre multipunto", "Aperturas y herrajes", "Herraje que asegura la hoja contra el marco en varios puntos a lo largo del perímetro, y no solo en la manilla. Mejora la estanqueidad y dificulta forzar la ventana.", ["osc"]),
("Manilla", "Aperturas y herrajes", "La palanca con la que se acciona una ventana. En oscilobatientes tiene tres posiciones: cerrada, abierta e inclinada. Existen manillas con llave para dar seguridad adicional.", []),
("Falleba", "Aperturas y herrajes", "Varilla que cierra una hoja por arriba y por abajo a la vez al girar la manilla. Es el sistema clásico de cierre en ventanas y puertas de dos hojas.", []),
("Compás", "Aperturas y herrajes", "Brazo articulado que limita y sujeta la apertura de una hoja proyectante o de una oscilante.", []),
("Microventilación", "Aperturas y herrajes", "Posición del herraje que deja la hoja entreabierta unos milímetros sin dejar de estar cerrada con seguridad, para renovar el aire. Útil en viviendas muy estancas para evitar condensación.", ["cond"]),
("Aireador (rejilla de ventilación)", "Aperturas y herrajes", "Pequeña abertura regulable en el marco o en el cajón que renueva el aire de la vivienda sin abrir ventanas. Con ventanas muy estancas, ayuda a controlar la humedad.", ["cond"]),
# --- Vidrio
("Doble acristalamiento", "Vidrio", "Dos vidrios separados por una cámara sellada, que aísla mucho más que un vidrio simple. Se escribe, por ejemplo, 4/16/4: vidrio de 4 mm, cámara de 16 mm y otro vidrio de 4 mm. Se le llama también Climalit.", ["pers", "alu"]),
("Climalit", "Vidrio", "Marca comercial de doble acristalamiento aislante, tan extendida que se usa como nombre común del vidrio con cámara. Cuando se pide \"Climalit\", lo normal es referirse al doble vidrio con cámara.", ["pers"]),
("Triple acristalamiento", "Vidrio", "Tres vidrios y dos cámaras. Aísla más del frío y del ruido que el doble, pero pesa más y cuesta más. Compensa en fachadas muy expuestas y en casas de muy bajo consumo.", ["kom"]),
("Cámara de aire", "Vidrio", "Espacio sellado entre dos vidrios. Se rellena de aire deshidratado o, para aislar más, de gas argón. Una cámara más ancha aísla mejor hasta cierto punto (suele ser 16 mm).", []),
("Gas argón", "Vidrio", "Gas inerte que sustituye al aire en la cámara del doble vidrio. Conduce peor el calor que el aire, por lo que mejora ligeramente el aislamiento. Se indica con \"ar\" en la composición, por ejemplo 4/16 ar/4.", []),
("Intercalario", "Vidrio", "Perfil que mantiene separados los dos vidrios y sella el borde de la cámara. El intercalario de borde cálido (de material no metálico) reduce la pérdida de calor y la condensación en el canto del vidrio.", []),
("Vidrio bajo emisivo", "Vidrio", "Vidrio con una capa invisible que refleja el calor hacia el interior en invierno y reduce las pérdidas. Mejora mucho el aislamiento respecto al vidrio normal sin oscurecerlo.", ["rpt"]),
("Vidrio de control solar", "Vidrio", "Vidrio con una capa que limita el paso del calor del sol, útil en fachadas sur y oeste y en terrazas acristaladas para que no se recalienten en verano.", ["terr"]),
("Vidrio laminado", "Vidrio", "Dos o más láminas de vidrio unidas por una película plástica (butiral). Si se rompe, los trozos quedan pegados a la lámina. Es el vidrio de seguridad y, con láminas especiales, el acústico.", []),
("Vidrio templado", "Vidrio", "Vidrio tratado con calor y enfriamiento rápido, mucho más resistente que el normal. Si se rompe, se fragmenta en trocitos pequeños y poco cortantes. No se puede cortar después de templado. Es obligatorio en algunos usos, como barandillas o puertas de cristal.", ["terr"]),
("Vidrio acústico", "Vidrio", "Vidrio laminado con láminas especiales, o con vidrios de distinto espesor, para amortiguar el ruido. Si la razón del cambio de ventanas es el ruido, el vidrio acústico decide más que el perfil.", ["pa"]),
("Factor solar (g)", "Vidrio", "Porcentaje de la energía del sol que atraviesa el vidrio. Un factor bajo mantiene la casa más fresca en verano; uno alto aprovecha el sol en invierno. Se elige según la orientación.", []),
("Transmisión luminosa", "Vidrio", "Porcentaje de la luz visible que atraviesa el vidrio. Un vidrio de control solar o de color deja pasar menos luz.", []),
("Sellado del vidrio", "Vidrio", "Material que cierra el borde de la cámara de un doble vidrio. Si falla, entra humedad y aparece vaho entre los dos cristales. No tiene arreglo: hay que cambiar el vidrio.", ["cond"]),
("Vaho entre cristales", "Vidrio", "Condensación en el interior de la cámara de un doble vidrio. Indica que el sellado ha perdido estanqueidad.", ["cond"]),
# --- Aislamiento y eficiencia
("Transmitancia térmica (U)", "Aislamiento y eficiencia", "Mide cuánto calor atraviesa un elemento. Se expresa en W/m²K y cuanto más bajo, mejor aísla. Se habla de Ug para el vidrio, Uf para el marco y Uw para la ventana completa.", ["kom"]),
("Uw", "Aislamiento y eficiencia", "Transmitancia térmica de la ventana completa (marco + vidrio + borde del vidrio). Es el dato que sirve para comparar ventanas. Un Uw de 0,8 aísla mejor que uno de 1,4.", ["kom"]),
("Ug", "Aislamiento y eficiencia", "Transmitancia térmica solo del vidrio. Un doble vidrio básico ronda 2,8 W/m²K; con baja emisividad y argón baja a cerca de 1,0 o menos; un triple, más aún.", []),
("Uf", "Aislamiento y eficiencia", "Transmitancia térmica solo del marco (los perfiles). Cuanto más bajo, mejor. En PVC de calidad, ronda 1,0 a 1,3 W/m²K.", ["kom"]),
("Puente térmico", "Aislamiento y eficiencia", "Punto de un cerramiento por el que pasa más calor que por el resto, porque es de material conductor o más delgado. En un marco de aluminio sin rotura, el marco entero es un puente térmico: por eso está frío y condensa.", ["rpt"]),
("Rotura de puente térmico (RPT)", "Aislamiento y eficiencia", "Barra de poliamida que separa el perfil de aluminio en una mitad exterior y otra interior para que el frío y el calor no lo atraviesen. Una ventana de aluminio con RPT aísla mucho mejor y condensa mucho menos que una sin ella.", ["rpt", "alu"]),
("Condensación", "Aislamiento y eficiencia", "Gotas de agua que aparecen cuando el aire húmedo y cálido toca una superficie fría. Es habitual en el cristal y el marco en invierno. Se reduce ventilando, controlando la humedad y con ventanas que aíslen mejor.", ["cond"]),
("Permeabilidad al aire", "Aislamiento y eficiencia", "Cantidad de aire que se cuela por una ventana cerrada. Se mide en clases del 1 al 4 según la norma UNE-EN 12207; la clase 4 es la mejor.", ["kom"]),
("Estanqueidad al agua", "Aislamiento y eficiencia", "Capacidad de la ventana de impedir que entre agua de lluvia con viento. La norma UNE-EN 12208 la clasifica con números y letras, por ejemplo E1350 o E1950 (cuanto mayor, más resistente).", ["kom"]),
("Resistencia al viento", "Aislamiento y eficiencia", "Capacidad de una ventana de aguantar la presión del viento sin deformarse. La norma UNE-EN 12210 la clasifica del 1 al 5 y con letras (A, B, C); C5 es la clasificación más alta.", ["kom"]),
("Aislamiento acústico (Rw)", "Aislamiento y eficiencia", "Reducción de ruido que logra una ventana, en decibelios (dB). Rw 30 es un nivel normal; Rw 40 o más exige vidrios laminados acústicos y buen sellado. Cada 10 dB equivalen a percibir el ruido a la mitad.", ["pa"]),
("Passivhaus (casa pasiva)", "Aislamiento y eficiencia", "Estándar de construcción de consumo energético casi nulo. Exige ventanas con valores de aislamiento y estanqueidad muy exigentes, por lo general con triple vidrio y perfiles certificados.", ["kom"]),
("Certificado energético", "Aislamiento y eficiencia", "Documento que califica la eficiencia energética de una vivienda de la A (mejor) a la G. Mejorar ventanas puede subir la calificación y suele ser parte de las ayudas.", ["ayu"]),
("Marcado CE", "Aislamiento y eficiencia", "Marca que indica que la ventana cumple la norma europea de producto (UNE-EN 14351-1) y declara sus prestaciones: aislamiento, permeabilidad, estanqueidad, viento. Debe acompañar a las ventanas exteriores que se venden en la UE.", []),
("CTE (Código Técnico de la Edificación)", "Aislamiento y eficiencia", "Normativa española que fija los requisitos mínimos de los edificios, incluido el ahorro de energía (DB-HE). Es la referencia cuando se cambian ventanas en una rehabilitación.", ["ayu"]),
# --- Persianas y protección solar
("Persiana enrollable", "Persianas y protección solar", "Persiana de lamas articuladas que se enrolla en un eje dentro del cajón. Es la más habitual en viviendas. Puede ser manual, con cinta, o motorizada.", ["pers"]),
("Lama", "Persianas y protección solar", "Cada una de las tablillas que forman una persiana. Las de aluminio con espuma de poliuretano inyectada aíslan más que las de PVC o aluminio huecas.", ["pers"]),
("Persiana motorizada", "Persianas y protección solar", "Persiana con motor eléctrico en el eje, accionada por interruptor, mando o móvil. Permite programar horarios y cerrar todas a la vez. En ventana existente, se puede motorizar sin cambiar la persiana si el cajón lo permite.", ["pers"]),
("Persiana de seguridad", "Persianas y protección solar", "Persiana con lamas y guías reforzadas que dificultan el forzado. Se usa en locales y plantas bajas.", ["pers"]),
("Mosquitera", "Persianas y protección solar", "Malla que impide que entren insectos y deja pasar el aire. Puede ser fija, enrollable o lateral, según cómo abra la ventana.", ["pers"]),
("Toldo de brazos extensibles", "Persianas y protección solar", "Toldo cuya lona se despliega con brazos articulados y queda en voladizo, sin postes. Es el típico de terrazas y balcones. Puede llevar cofre que lo protege cuando está recogido.", ["toldos"]),
("Cofre (de un toldo)", "Persianas y protección solar", "Caja que guarda la lona y los brazos cuando el toldo está recogido y los protege de lluvia y polvo, alargando su vida.", ["toldos"]),
("Pérgola bioclimática", "Persianas y protección solar", "Estructura de aluminio con lamas orientables que regulan sol, sombra y ventilación, y que se cierran con lluvia. Permite usar la terraza casi todo el año.", ["perg"]),
("Lamas orientables", "Persianas y protección solar", "Lamas que giran para dejar pasar la luz, ventilar o cerrarse por completo. Son la pieza clave de una pérgola bioclimática.", ["perg"]),
("Screen", "Persianas y protección solar", "Tejido técnico exterior, enrollable, que filtra el sol y da privacidad sin tapar la vista. Se instala en fachadas y terrazas.", ["toldos"]),
# --- Cerramientos
("Cerramiento de terraza", "Cerramientos", "Cierre de una terraza, balcón o porche con aluminio o PVC y vidrio, para ganar espacio útil todo el año. Puede ser fijo, con correderas, plegable o de cortina de cristal.", ["terr", "ter$"]),
("Cortina de cristal", "Cerramientos", "Cerramiento de vidrio templado sin perfiles verticales, formado por hojas que se deslizan o se pliegan sobre carriles. Da sensación de terraza abierta y mucha luz, aunque aísla menos que un cerramiento con perfil.", ["terr"]),
("Techo de aluminio", "Cerramientos", "Cubierta ligera de aluminio con panel sándwich, vidrio o policarbonato, para cubrir patios, porches o terrazas. Se fabrica a medida.", ["techos"]),
("Panel sándwich", "Cerramientos", "Panel formado por dos chapas con un núcleo aislante (poliuretano o lana de roca). Se usa en cubiertas y techos de aluminio porque aísla y pesa poco.", ["techos"]),
("Policarbonato (celular)", "Cerramientos", "Plástico translúcido, ligero y resistente a los golpes, con cámaras internas que aíslan. Se usa en techos y cubiertas para dejar pasar luz.", ["techos"]),
("Claraboya (ventana de tejado)", "Cerramientos", "Ventana en el techo o en la cubierta, que da luz natural desde arriba. Se instala en tejados inclinados, buhardillas o patios.", ["techos"]),
# --- Cerrajería
("Cancela", "Cerrajería", "Puerta exterior para cerrar la entrada de una parcela o de un garaje. Puede ser corredera (se desliza lateralmente) o batiente (gira sobre bisagras), de una o dos hojas, manual o motorizada.", ["canc", "canb"]),
("Cancela corredera", "Cerrajería", "Cancela cuya hoja se desliza sobre un carril o autoportante, de forma lateral. Necesita pared libre al lado del hueco; es la solución cuando hay poca superficie delante.", ["canc"]),
("Cancela batiente", "Cerrajería", "Cancela de una o dos hojas que se abren girando sobre bisagras. Necesita espacio libre para abrir y un suelo sin mucha pendiente.", ["canc"]),
("Aluminio soldado", "Cerrajería", "Estructura de aluminio con las uniones soldadas (soldadura TIG), no atornilladas. Forma un bastidor de una sola pieza que no se descuadra con el tiempo. Pesa aproximadamente un tercio que el hierro y no se oxida.", ["canb"]),
("Soldadura TIG", "Cerrajería", "Soldadura con electrodo de tungsteno y gas protector inerte que da un cordón limpio y resistente en aluminio. Después se pule y se lacan las piezas.", ["canb"]),
("Reja de forja", "Cerrajería", "Reja de hierro con barrotes trabajados a mano o a medida, con adornos. Es un clásico en ventanas y puertas de planta baja.", ["rejas"]),
("Reja de seguridad", "Cerrajería", "Reja colocada para dificultar el acceso por ventanas y puertas. La seguridad depende del grosor de los barrotes, de la fijación a la pared y del diseño.", ["rejas"]),
("Valla", "Cerrajería", "Cerramiento exterior de una parcela hecho con paneles de aluminio o hierro. Combina con cancelas y puertas del mismo modelo y color.", ["canc"]),
("Puerta seccional", "Cerrajería", "Puerta de garaje formada por paneles que suben en vertical y se recogen en el techo. No ocupa espacio delante ni a los lados, ideal con poco fondo.", ["auto"]),
("Puerta basculante", "Cerrajería", "Puerta de garaje de una sola hoja que se abre girando hacia arriba y hacia fuera, con contrapesos o muelles. Sencilla y económica.", ["auto"]),
("Automatismo", "Cerrajería", "Motor y accesorios que abren y cierran una cancela o puerta de garaje automáticamente. Incluye el motor, la central, el mando, las fotocélulas y los dispositivos de seguridad.", ["auto"]),
("Motor de cancela", "Cerrajería", "Motor que mueve la hoja. Puede ser oleodinámico (con aceite, muy robusto, para uso intensivo) o electromecánico (con engranajes o cremallera, más habitual en viviendas).", ["auto"]),
("Fotocélula", "Cerrajería", "Sensor de seguridad en una cancela o puerta automática: si algo cruza el rayo (una persona, un coche, un animal), la puerta se detiene o invierte el movimiento.", ["auto"]),
("Bombín", "Cerrajería", "Cilindro de la cerradura donde entra la llave. Hay bombines con protección antibumping, antitaladro o antiganzúa, que dificultan abrir la puerta sin llave.", []),
("Cerradura de seguridad", "Cerrajería", "Cerradura con varios puntos de cierre o mecanismos reforzados para resistir el forzado. Va en combinación con un bombín de seguridad y una buena puerta.", []),
# --- Acabados
("Lacado", "Acabados", "Acabado del aluminio con pintura en polvo aplicada con electricidad estática y curada al horno. Da color uniforme, resistencia a la intemperie y larga duración. Existe sello de calidad (Qualicoat).", ["acab"]),
("Anodizado", "Acabados", "Acabado del aluminio mediante un proceso electroquímico que crea una capa de óxido sobre el metal. Más duro que el lacado, con aspecto metálico y colores más limitados. Es muy resistente a la corrosión.", ["acab"]),
("Foliado (imitación madera)", "Acabados", "Lámina decorativa que se adhiere al perfil de PVC para dar aspecto de madera u otros colores. Es el acabado más usado para PVC de color.", ["acab", "pvc"]),
("Bicolor", "Acabados", "Ventana con un color distinto por dentro y por fuera, por ejemplo gris antracita fuera y blanco dentro. Muy usada para combinar con la fachada y con la decoración interior.", ["acab"]),
("RAL", "Acabados", "Sistema alemán de colores normalizados que se usa para el lacado. Algunos habituales: RAL 9010 blanco puro, RAL 9016 blanco tráfico y RAL 7016 gris antracita.", ["acab"]),
("Texturado", "Acabados", "Lacado con relieve fino, que da un tacto y un aspecto más cercano al de un acabado metálico o rugoso. Disimula pequeñas marcas.", ["acab"]),
# --- Instalación y obra
("Medición (toma de medidas)", "Instalación y presupuesto", "Visita para medir los huecos y comprobar escuadras, anclajes y estado de la pared. En AMS la visita y la medición son gratuitas. Una mala medición es una de las causas más comunes de ventanas que no encajan.", ["inst"]),
("Fijación mecánica", "Instalación y presupuesto", "Sujeción de la ventana a la obra con tacos y tornillos o con anclajes, y no solo con espuma o masilla. Es la forma correcta de fijar un marco.", ["inst"]),
("Sellado perimetral", "Instalación y presupuesto", "Sellado de la junta entre marco y pared, por dentro (estanqueidad al aire) y por fuera (resistencia a la lluvia), con aislamiento entre ambas. Evita corrientes, humedades y puentes térmicos.", ["inst"]),
("Montaje en tres planos", "Instalación y presupuesto", "Método de instalación que sella la junta con tres capas funcionales: una interior hermética al aire, un núcleo aislante y una exterior resistente al agua. Es la referencia de la instalación de calidad.", ["inst"]),
("Instalación sobre marco existente", "Instalación y presupuesto", "Forma de cambiar ventanas sin obra: se deja el marco viejo y se coloca el nuevo encima. Es más rápida y limpia, pero reduce algo el tamaño de vidrio.", ["inst"]),
("Plazo de fabricación", "Instalación y presupuesto", "Tiempo que pasa entre la confirmación del presupuesto y la entrega de las ventanas fabricadas a medida.", ["inst"]),
("Presupuesto cerrado", "Instalación y presupuesto", "Presupuesto por escrito con el precio total, la serie y el vidrio, la instalación y la retirada de lo viejo. Permite comparar ofertas con garantías de que son comparables.", ["cfg"]),
("Garantía", "Instalación y presupuesto", "Compromiso del fabricante y del instalador de reparar o sustituir lo que falle en un plazo. Conviene distinguir la garantía del perfil, la del vidrio y la de la instalación.", ["pvc"]),
("Ayudas y deducciones", "Instalación y presupuesto", "Subvenciones o deducciones fiscales para mejoras de eficiencia energética. Cambian cada año y suelen exigir certificados y facturas detalladas antes o después de la obra.", ["ayu"]),
("Comunidad de propietarios", "Instalación y presupuesto", "En un edificio, cambiar ventanas suele afectar a la fachada, que es un elemento común. Hay que mirar los estatutos y lo que acuerde la junta sobre color, tipo y aspecto.", ["com"]),
# --- Ampliación de términos (octubre 2026)
("Decibelio (dB)", "Aislamiento y eficiencia", "Unidad con la que se mide el ruido. Cada 10 dB menos se percibe, más o menos, como la mitad de ruido. Una ventana con buen aislamiento acústico puede quitar entre 30 y 40 dB al ruido de la calle.", ["pvc"]),
("Zona climática", "Aislamiento y eficiencia", "Clasificación del Código Técnico según el clima de cada lugar (letra para el invierno y número para el verano). Marca cuánto aislamiento se pide a las ventanas en una reforma. Madrid capital está en la zona D3, y los municipios cercanos suelen ser similares.", ["cfg"]),
("Clase de permeabilidad al aire (clase 4)", "Aislamiento y eficiencia", "Nota de 1 a 4 que indica cuánto aire se cuela con la ventana cerrada. La clase 4 es la mejor: apenas deja pasar corrientes. Se mide en laboratorio y debe constar en el marcado CE.", ["pvc"]),
("Moho", "Aislamiento y eficiencia", "Manchas negras o verdosas que salen en esquinas y juntas cuando hay humedad y poca ventilación. Suele ser consecuencia de la condensación, y se evita con ventanas bien aisladas y ventilación regular.", ["cond"]),
("Sobrecalentamiento", "Aislamiento y eficiencia", "Exceso de calor dentro de la casa en verano por el sol que entra por los cristales, sobre todo al sur y al oeste. Se reduce con vidrio de control solar, persianas, toldos o screens.", ["pers"]),
("Butiral (PVB)", "Vidrio", "Lámina transparente de plástico que va entre los dos cristales de un vidrio laminado. Mantiene los trozos pegados si el vidrio se rompe, y además amortigua el ruido.", []),
("Composición del vidrio (4/16/4)", "Vidrio", "Los números describen el doble vidrio: 4 mm de cristal, 16 mm de cámara y otros 4 mm de cristal. Cámaras más anchas y cristales gruesos o laminados mejoran el aislamiento, sobre todo el acústico.", ["pvc"]),
("Vidrio serigrafiado", "Vidrio", "Vidrio con un dibujo o una banda de color cocidos en la superficie. Se usa para dar privacidad, para ocultar el borde de la ventana o por decoración.", []),
("Vidrio autolimpiable", "Vidrio", "Vidrio con una capa especial que, con la luz y el agua de lluvia, ayuda a que se desprenda la suciedad. Va bien en cristales exteriores difíciles de alcanzar; no sustituye a una limpieza ocasional.", ["mant"]),
("Vidrio mate (arenado o translúcido)", "Vidrio", "Vidrio que deja pasar la luz pero no deja ver a través. Se usa en baños, puertas interiores o ventanas que dan a un vecino.", []),
("Cremona", "Aperturas y herrajes", "Varilla que recorre la hoja y la cierra en varios puntos al girar la manilla. Es la base del cierre multipunto, y ayuda a que la ventana quede bien apretada y segura.", ["pvc"]),
("Bisagra (o pernio)", "Aperturas y herrajes", "Pieza que une la hoja con el marco y permite que gire. Si la ventana roza o se descuelga, casi siempre es una bisagra que hay que regular o cambiar.", ["mant"]),
("Cerradero", "Aperturas y herrajes", "Pieza metálica fijada en el marco donde encaja el cierre de la hoja. Si está mal ajustado, la ventana no cierra bien o deja pasar aire.", ["mant"]),
("Cinta y recogedor (persiana)", "Persianas y protección solar", "La cinta tira de la persiana y el recogedor es la caja de la pared donde se guarda. Es la causa más habitual de averías en persianas manuales, y se cambia de forma rápida y barata.", ["pers"]),
("Lama de aluminio inyectada", "Persianas y protección solar", "Lama de aluminio rellena de espuma de poliuretano, más aislante y silenciosa que una lama hueca. Es la opción habitual de persiana de aluminio en viviendas.", ["pers"]),
("Sensor de viento", "Persianas y protección solar", "Aparato que recoge el toldo, el screen o la pérgola cuando hay mucho viento, aunque no estés en casa. Protege la instalación de roturas.", ["toldos"]),
("Sensor de lluvia", "Persianas y protección solar", "Aparato que cierra o recoge automáticamente las lamas de una pérgola cuando empieza a llover. Se combina con el sensor de viento.", ["perg"]),
("Veranda", "Cerramientos", "Espacio cerrado con aluminio y vidrio, adosado a la casa, que se usa como sala, comedor o galería. Es otra forma de llamar al cerramiento de una terraza.", ["terr"]),
("Antepecho (petril)", "Cerramientos", "Muro bajo o barandilla que protege el borde de una terraza. En un cerramiento se aprovecha como apoyo de los perfiles, y su estado marca cómo se hace el anclaje.", ["terr"]),
("Pluviales (desagüe de la terraza)", "Cerramientos", "Salida del agua de lluvia de una terraza o un techo. Al cerrar la terraza hay que mantener el desagüe libre y con la pendiente adecuada, para evitar charcos y humedades.", ["terr"]),
("Pendiente de cubierta", "Cerramientos", "Inclinación del techo de un cerramiento, para que el agua resbale hacia el desagüe. Una pendiente escasa causa goteras, charcos y suciedad acumulada.", ["techos"]),
("Electrocerradura", "Cerrajería", "Cerradura que se abre y se cierra con un pulsador, un mando o un portero. Es el sistema de cierre habitual de una cancela automática o de una puerta peatonal con control de acceso.", ["canc"]),
("Central de maniobras (cuadro de control)", "Cerrajería", "El cerebro del automatismo: recibe la orden del mando y manda al motor abrir, parar o cerrar. Ahí se ajustan fuerza, velocidad y seguridad de la cancela.", ["auto"]),
("Mando de código rodante", "Cerrajería", "Mando a distancia cuyo código cambia en cada pulsación, de forma que no se puede copiar con un aparato sencillo. Es lo más seguro frente a los mandos de código fijo, ya anticuados.", ["auto"]),
("Cremallera (de cancela)", "Cerrajería", "Barra dentada fijada a la hoja de una cancela corredera sobre la que engrana el motor. Las hay de nailon, más silenciosas, y de acero, más duras.", ["auto"]),
("Antibumping", "Cerrajería", "Sistema del bombín que impide abrir la puerta con la técnica del «bumping» (golpear una llave especial). Conviene combinarlo con antitaladro y antiganzúa.", ["canc"]),
("Celosía (lamas fijas)", "Cerrajería", "Cierre de lamas inclinadas, fijas, que deja pasar el aire y la luz pero tapa la vista. Se usa en vallas, cancelas y cerramientos que necesitan intimidad y ventilación.", ["canc"]),
("Qualicoat", "Acabados", "Sello internacional de calidad del lacado de aluminio. Garantiza que el color y el tratamiento de la superficie aguantan el sol y la intemperie durante años.", ["acab"]),
("Pintura en polvo (poliéster)", "Acabados", "Pintura seca que se pega al aluminio con electricidad y se cura en horno. No lleva disolventes y deja una capa más resistente que una pintura normal.", ["acab"]),
("Acabado mate, satinado y brillante", "Acabados", "Los tres niveles de brillo del lacado. El mate disimula marcas y está muy de moda, el satinado es el más equilibrado, y el brillante marca más los rayones.", ["acab"]),
("Licencia de obra menor", "Instalación y presupuesto", "Permiso del ayuntamiento para obras sencillas, como cambiar ventanas o cerrar una terraza. Cada ayuntamiento tiene sus normas: en algunos basta una comunicación y en otros hay que pedir licencia. Conviene consultarlo antes.", ["terr"]),
("IVA reducido en reformas", "Instalación y presupuesto", "En reformas de una vivienda, el IVA suele ser del 10 % si el material aportado no supera el 40 % del total de la obra. Si solo compras la ventana, sin instalación, es el 21 %. Conviene verlo reflejado en el presupuesto.", ["cfg"]),
("Retirada de lo viejo", "Instalación y presupuesto", "Desmontaje y traslado de las ventanas, persianas y escombros antiguos. Debe figurar en el presupuesto, para no encontrarte después con un coste extra.", ["cfg"]),
("Remates de albañilería", "Instalación y presupuesto", "Trabajo de acabado alrededor de la ventana nueva: sellar, igualar la pared y colocar tapajuntas. Es lo que hace que la obra quede bonita y sin huecos.", ["inst"]),
("Presupuesto orientativo", "Instalación y presupuesto", "Precio aproximado, calculado sin medir, para hacerte una idea. Puede cambiar con la medición final, a diferencia del presupuesto cerrado, que ya es definitivo.", ["cfg"]),
("Financiación", "Instalación y presupuesto", "Pagar la obra en cuotas a través de una financiera. Tiene intereses y está sujeta a aprobación, por eso conviene ver la cuota real y el coste total antes de aceptar.", ["cfg"]),
("Mantenimiento y engrasado", "Instalación y presupuesto", "Una revisión al año: limpiar las guías, engrasar bisagras y herrajes, comprobar juntas y desagües. Alarga la vida de la ventana y evita averías.", ["mant"]),
]


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def letra(t):
    c = unicodedata.normalize("NFKD", t[0]).encode("ascii", "ignore").decode().upper()
    return c if c.isalpha() else "#"


CATS = {
    "Partes de la ventana": ("ventana", 0, "Cómo está hecha por dentro"),
    "Aislamiento y eficiencia": ("calc", 2, "Frío, calor, ruido y factura"),
    "Vidrio": ("lupa", 3, "Lo que ves a través"),
    "Aperturas y herrajes": ("llave", 1, "Cómo se abre y se cierra"),
    "Persianas y protección solar": ("persiana", 0, "Sol, luz y privacidad"),
    "Cerramientos": ("terraza", 2, "Terrazas y espacios cerrados"),
    "Cerrajería": ("cancela", 1, "Cancelas, motores y cerraduras"),
    "Acabados": ("pvc", 3, "Colores y texturas"),
    "Instalación y presupuesto": ("euro", 0, "De la visita a la garantía"),
}
EMPIEZA = ["Uw", "Rotura de puente térmico", "Oscilobatiente", "Presupuesto cerrado", "Garantía", "Doble acristalamiento", "Lacado"]

GCSS = """<style>
.gl{--papel:#FAF7F3;--arena:#F5ECE2;--coral:#D9694D;--coralt:#A8442C;--corals:#FCEBE4;--tinta:#12202B;--marc:#F2C14E;--marcs:#FCEFC8;--cielo:#E8F1F8;--salvia:#E4F0E8;font-family:inherit}
.gl-hero{background:var(--papel);border-bottom:1px solid #EADFD2}
.gl-hero .w{max-width:1100px;margin:0 auto;padding:36px 24px 44px;display:flex;flex-direction:column;gap:16px}
.gl-hero .mig{font-size:14px;color:#5C6F82}.gl-hero .mig a{color:#5C6F82}
.gl-hero h1{margin:0;font-size:clamp(32px,7vw,50px);line-height:1.1;font-weight:800;color:var(--tinta);max-width:800px}
.gl-hero h1 mark{background:linear-gradient(transparent 58%,var(--marc) 58%);color:inherit;padding:0 4px;border-radius:3px}
.gl-hero p{margin:0;font-size:19px;line-height:1.6;color:#3B5168;max-width:720px}
.gl-hola{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;background:var(--corals);color:var(--coralt);font-weight:700;font-size:14px;border-radius:999px;padding:6px 14px}
.gl-hola svg{width:16px;height:16px}
.gl-buscar{position:relative;max-width:620px;margin-top:6px}
.gl-buscar svg{position:absolute;left:18px;top:50%;transform:translateY(-50%);width:22px;height:22px;color:var(--coral)}
.gl-buscar input{width:100%;box-sizing:border-box;min-height:58px;padding:0 18px 0 52px;border:2px solid #EADFD2;border-radius:999px;background:#fff;font:17px Inter,sans-serif;color:var(--tinta);box-shadow:0 6px 18px rgba(217,105,77,.10)}
.gl-buscar input:focus{outline:none;border-color:var(--coral);box-shadow:0 0 0 4px rgba(217,105,77,.18)}
.gl-main{background:#fff}
.gl-main .w{max-width:1100px;margin:0 auto;padding:36px 24px 72px;display:flex;flex-direction:column;gap:30px}
.gl-h{margin:0;font-size:22px;font-weight:800;color:var(--tinta)}.gl-sub{margin:4px 0 0;color:#5C6F82;font-size:16px}
.gl-temas{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(min(240px,100%),1fr))}
.gl-tema{display:flex;align-items:center;gap:12px;text-align:left;background:#fff;border:2px solid #EADFD2;border-radius:18px;padding:12px 14px;cursor:pointer;font:inherit;color:var(--tinta);transition:transform .15s,border-color .15s,background .15s}
.gl-tema:hover{transform:translateY(-2px);border-color:var(--coral)}
.gl-tema.on{background:var(--tinta);border-color:var(--tinta);color:#fff}
.gl-tema.on small{color:#D3DBE2}
.gl-tema b{display:block;font-size:15px;line-height:1.25}.gl-tema small{display:block;color:#5C6F82;font-size:13px;margin-top:2px}
.gl-ic{flex:none;width:46px;height:46px;border-radius:15px;display:inline-flex;align-items:center;justify-content:center}
.gl-ic svg{width:24px;height:24px}
.gl-t0{background:var(--corals);color:var(--coralt)}.gl-t1{background:var(--cielo);color:#1F4F7A}.gl-t2{background:var(--salvia);color:#2D6A4A}.gl-t3{background:var(--marcs);color:#7A5A06}
.gl-tema.on .gl-ic{background:rgba(255,255,255,.14);color:#fff}
.gl-empieza{background:var(--arena);border-radius:22px;padding:22px 22px 24px}
.gl-empieza .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
.gl-empieza a{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #E6D8C7;border-radius:999px;padding:9px 16px;color:var(--tinta);font-weight:600;font-size:15px;text-decoration:none}
.gl-empieza a:hover{background:var(--corals);border-color:var(--coral)}
.gl-az{display:flex;flex-wrap:wrap;gap:6px}
.gl-az a{display:inline-flex;align-items:center;justify-content:center;min-width:40px;height:40px;border-radius:12px;background:var(--papel);color:var(--tinta);font-weight:700;text-decoration:none;border:1px solid #EADFD2}
.gl-az a:hover{background:var(--coral);color:#fff;border-color:var(--coral)}
.gl-n{margin:0;color:#5C6F82;font-size:15px}
.gl-letra{display:flex;flex-direction:column;gap:14px;scroll-margin-top:110px}
.gl-letra>h2{margin:0;display:flex;align-items:center;gap:12px;font-size:20px;color:var(--tinta)}
.gl-letra>h2 span{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;background:var(--coral);color:#fff;font-size:24px;font-weight:800}
.gl-letra>h2:after{content:"";flex:1;height:2px;background:#F0E5D8;border-radius:2px}
.gl-term{display:flex;gap:16px;background:var(--papel);border:1px solid #EFE3D5;border-radius:20px;padding:18px 20px;scroll-margin-top:110px}
.gl-term:target{border-color:var(--coral);box-shadow:0 0 0 4px rgba(217,105,77,.18)}
.gl-term .gl-ic{width:50px;height:50px;border-radius:16px}
.gl-term .tx{display:flex;flex-direction:column;gap:6px;min-width:0}
.gl-term .cat{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--coralt)}
.gl-term h3{margin:0;font-size:21px;color:var(--tinta)}
.gl-term p{margin:0;font-size:16.5px;line-height:1.65;color:#2B3F52}
.gl-pic{margin:6px 0 2px;padding:8px 10px;background:#fff;border:1px solid #EFE3D5;border-radius:16px;max-width:230px}.gl-svg{display:block;width:100%;height:auto}.gl-pic figcaption{margin-top:4px;text-align:center;font-size:13px;font-weight:600;color:#3B5168}
.gl-ver{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:4px;font-size:14px;color:#5C6F82}
.gl-ver a{background:#fff;border:1px solid #E6D8C7;border-radius:999px;padding:4px 12px;color:var(--coralt);font-weight:600;text-decoration:none}
.gl-ver a:hover{background:var(--corals)}
.gl-vacio{display:none;text-align:center;background:var(--corals);border-radius:22px;padding:28px 20px;color:var(--tinta)}
.gl-vacio b{display:block;font-size:20px;margin-bottom:6px}
.gl-final{background:var(--corals);border-radius:24px;padding:28px 26px;display:flex;flex-direction:column;gap:12px}
.gl-final h2{margin:0;font-size:26px;font-weight:800;color:var(--tinta)}.gl-final p{margin:0;font-size:17px;color:#3B5168}
.gl-term[hidden],.gl-letra[hidden]{display:none!important}
@media(max-width:560px){.gl-term{padding:14px;gap:12px}.gl-term .gl-ic{width:42px;height:42px;border-radius:13px}.gl-hero p{font-size:17px}}
</style>"""


def _svg(k, w=24):
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + _IC[k] + '</svg>'


def _ic(cat):
    k, t, _ = CATS.get(cat, ("doc", 0, ""))
    return '<span class="gl-ic gl-t%d">%s</span>' % (t, _svg(k))


def p_glosario():
    items = sorted(T, key=lambda x: slug(x[0]))
    letras = sorted({letra(t[0]) for t in items})
    nav = "".join(f'<a href="#letra-{l}">{l}</a>' for l in letras)
    cats = []
    for t in T:
        if t[1] not in cats: cats.append(t[1])
    temas = ('<button type="button" class="gl-tema on" data-cat=""><span class="gl-ic gl-t3">' + _svg("libro") + '</span><span><b>Todos los temas</b><small>%d palabras</small></span></button>' % len(T))
    for c in cats:
        k, t, d = CATS.get(c, ("doc", 0, ""))
        n = sum(1 for x in T if x[1] == c)
        temas += f'<button type="button" class="gl-tema" data-cat="{c}">{_ic(c)}<span><b>{c}</b><small>{d} · {n}</small></span></button>'
    emp = "".join(f'<a href="#{slug(e)}">{e}</a>' for e in EMPIEZA if any(t[0] == e for t in T))
    por_letra = {}
    for t in items: por_letra.setdefault(letra(t[0]), []).append(t)
    bloques = ""
    for l in letras:
        bloques += f'<section class="gl-letra" id="letra-{l}"><h2><span>{l}</span></h2>'
        for term, cat, d, rel in por_letra[l]:
            ver = ""
            if rel:
                ver = '<div class="gl-ver">Para seguir leyendo: ' + "".join(f'<a href="{L[k][0]}">{L[k][1]}</a>' for k in rel) + "</div>"
            bloques += (f'<article class="gl-term" id="{slug(term)}" data-cat="{cat}">{_ic(cat)}'
                        f'<div class="tx"><span class="cat">{cat}</span><h3>{term}</h3><p>{d}</p>{('<figure class="gl-pic">' + _PIC[slug(term)][0] + '<figcaption>' + _PIC[slug(term)][1] + '</figcaption></figure>') if slug(term) in _PIC else ''}{ver}</div></article>')
        bloques += "</section>"
    lupa = _svg("lupa")
    hero = f"""<section class="gl-hero"><div class="w">
<div class="mig"><a href="/">Inicio</a> / <a href="/blog">Blog</a> / Glosario</div>
<span class="gl-hola">{_svg("libro")} Para entenderlo todo, sin sentirte perdido</span>
<h1>Las palabras de tus ventanas, <mark>sin jerga</mark> y con cariño</h1>
<p>Cuando pides un presupuesto aparecen palabras raras: Uw, rotura de puente térmico, oscilobatiente&hellip; Aquí tienes las {len(T)} que más te vas a encontrar, explicadas como te las explicaríamos en la mesa de tu salón. Si algo sigue sin quedar claro, nos lo dices y lo contamos mejor.</p>
<label class="gl-buscar"><span style="position:absolute;left:-9999px">Busca una palabra</span>{lupa}<input id="gl-q" type="search" placeholder="¿Qué palabra te ha dejado con dudas? Prueba con &quot;lacado&quot;" autocomplete="off"></label>
</div></section>"""
    cuerpo = f"""<section class="gl-main"><div class="w">
<div id="gl-top"><h2 class="gl-h">Elige un tema</h2><p class="gl-sub">O sigue bajando y lo ves todo por orden alfabético.</p></div>
<div class="gl-temas" id="gl-chips">{temas}</div>
<div class="gl-empieza"><h2 class="gl-h">Si es tu primera vez, empieza por aquí</h2><p class="gl-sub">Las palabras que más preguntan nuestros clientes.</p><div class="chips">{emp}</div></div>
<div><h2 class="gl-h">Ir a una letra</h2><div class="gl-az" aria-label="Ir a la letra" style="margin-top:12px">{nav}</div></div>
<p id="gl-n" class="gl-n" aria-live="polite"></p>
<div class="gl-vacio" id="gl-vacio"><b>Esa no la tenemos todavía</b>Escríbenos por WhatsApp y te la explicamos. Si mucha gente la pregunta, la añadimos aquí.</div>
{bloques}
<div class="gl-final">
<h2>¿Se te ha quedado alguna duda en el tintero?</h2>
<p>Pregúntanos sin compromiso. Preferimos que lo entiendas todo antes de decidir.</p>
<div style="display:flex;flex-wrap:wrap;gap:12px"><a href="https://wa.me/34639788220" style="{BTN}">Preguntar por WhatsApp</a><a href="tel:+34639788220" style="display:inline-flex;align-items:center;min-height:52px;padding:0 24px;border-radius:6px;border:2px solid #12202B;color:#12202B;text-decoration:none;font-weight:700;font-size:17px">639 78 82 20</a></div>
</div>
</div></section>
<script>
(function(){{
var q=document.getElementById('gl-q'),terms=[].slice.call(document.querySelectorAll('.gl-term')),letras=[].slice.call(document.querySelectorAll('.gl-letra')),chips=[].slice.call(document.querySelectorAll('.gl-tema')),n=document.getElementById('gl-n'),vac=document.getElementById('gl-vacio'),cat='';
function norm(s){{return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');}}
function f(){{var v=norm(q.value.trim()),c=0;terms.forEach(function(t){{var ok=(!cat||t.getAttribute('data-cat')===cat)&&(!v||norm(t.textContent).indexOf(v)>-1);t.hidden=!ok;if(ok)c++;}});
letras.forEach(function(l){{l.hidden=!l.querySelector('.gl-term:not([hidden])');}});
vac.style.display=c?'none':'block';
n.textContent=(v||cat)?(c?'Hemos encontrado '+c+' palabra'+(c===1?'':'s')+'.':''):'';}}
q.addEventListener('input',f);
chips.forEach(function(b){{b.addEventListener('click',function(){{chips.forEach(function(x){{x.classList.remove('on');}});b.classList.add('on');cat=b.getAttribute('data-cat')||'';f();}});}});
}})();
</script>"""
    return (
        "/glosario", "glosario.html",
        "Glosario de ventanas, cerramientos y cerrajería | AMS Cerramientos",
        f"Glosario con {len(T)} términos de ventanas de aluminio y PVC, vidrio, aislamiento, persianas, cerramientos, cancelas y acabados, explicados sin jerga por AMS Cerramientos.",
        GCSS.replace('<style>', '<style>', 1) + '<div class="gl">' + hero + cuerpo + '</div>',
    )
