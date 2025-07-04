# Next.js Technical Test

Este proyecto es una aplicación Next.js configurada para desarrollo local y ejecución en contenedores Docker.

## Requisitos

- Node.js 20+
- pnpm
- Docker y Docker Compose

## Instalación local

Instala las dependencias:

```bash
pnpm install
```

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Uso con Docker

Construye la imagen y levanta el contenedor:

```bash
docker compose up --build
```

Esto iniciará la app en [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

- `app/` - Páginas y rutas de la aplicación
- `lib/` - Utilidades y lógica de negocio
- `ui/` - Componentes de interfaz de usuario
- `public/` - Archivos estáticos

## Scripts útiles

- `pnpm dev` - Desarrollo
- `pnpm build` - Build de producción
- `pnpm start` - Servidor en producción

## Notas

- El contenedor usa `pnpm` y expone el puerto 3000.
- Puedes modificar el código y los cambios se reflejarán automáticamente en desarrollo.

---

Para más información sobre Next.js, visita la [documentación oficial](https://nextjs.org/docs).
