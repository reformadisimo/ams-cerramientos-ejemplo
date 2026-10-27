# Generador de la web de AMS

La web estática (public/) se genera con `scripts_sitio/site2.py` a partir de materiales de trabajo
(web2/project, ams/project, fotos, logo, vídeo) que NO están en este repositorio por tamaño.
`copia_mesa.py` copia la mesa de control desde Reformadísimo (solo lectura) y le cambia solo la marca.
Si hay que regenerar la web desde cero, se necesitan esos materiales de trabajo; el resultado ya
generado está siempre en public/.
