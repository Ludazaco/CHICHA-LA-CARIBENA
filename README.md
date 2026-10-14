# Chicha La Caribeña — App de gestión (PWA)

Esqueleto de la aplicación: PWA responsive con dashboard (Admin y Vendedor) usando **datos de ejemplo**.

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS v4, vite-plugin-pwa, Supabase (cliente listo, aún sin usar).

## Probar en local

```bash
npm install
npm run dev
```

## Desplegar (Vercel o Netlify)

1. Sube esta carpeta a un repositorio de GitHub.
2. Importa el repositorio en Vercel (o Netlify). Detectan Vite solos:
   - Build command: `npm run build`
   - Output directory: `dist`
3. (Opcional por ahora) Agrega las variables de entorno de Supabase:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   Si las agregas, el aviso amarillo del dashboard cambiará a "Variables de Supabase detectadas".
4. Abre la URL pública. Desde el celular puedes "Agregar a la pantalla de inicio" (PWA).

Las rutas de la SPA ya están resueltas con `vercel.json` y `public/_redirects`.

## Qué incluye

- Layout responsive: barra inferior en celular, menú lateral en tableta/computador.
- Dashboard Admin: ventas, gastos, utilidad, cartera, gráfica de 30 días, alertas, stock por lote, vendedores.
- Dashboard Vendedor: nueva venta, mi caja, stock disponible, lote sugerido (FEFO). Sin costos ni utilidades.
- Indicador de conexión (en línea / sin conexión).
- Selector **Admin / Vendedor** en el encabezado: solo para demostración; lo reemplaza el login real.
- Módulos Ventas, Inventario, Clientes, Gastos y Ajustes como pantallas "en construcción".

## Estructura

```
src/
  components/   Layout, StatCard, SalesChart, ConnectionBadge
  pages/        Dashboard, Placeholder
  data/mock.ts  Datos de ejemplo (se reemplazan por Supabase)
  lib/          supabase.ts, role.tsx, format.ts
```

## Próximos pasos

1. Fase 1: proyecto Supabase, esquema con migraciones, Auth y roles (RLS).
2. Fase 2: lotes y stock con FEFO.
3. Fase 3: clientes y ventas con cola offline.
