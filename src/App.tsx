import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Ajustes from './pages/Ajustes'
import Dashboard from './pages/Dashboard'
import Placeholder from './pages/Placeholder'
import { useRole } from './lib/role'

function AdminOnly({ children }: { children: ReactElement }) {
  const { role } = useRole()
  return role === 'admin' ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route
          path="ventas"
          element={
            <Placeholder
              title="Ventas"
              fase="Fase 3"
              descripcion="Venta rápida para celular, de contado o a crédito."
              puntos={[
                'Registro de ventas con descuento de stock por lote (FEFO)',
                'Abonos y saldo por cliente',
                'Funciona sin conexión y sincroniza después',
              ]}
            />
          }
        />
        <Route
          path="inventario"
          element={
            <Placeholder
              title="Inventario"
              fase="Fase 2"
              descripcion="Producción, lotes y existencias."
              puntos={[
                'Registro de lotes de producción con fecha de vencimiento',
                'Stock por lote, mermas y ajustes (kardex)',
                'Alertas de vencimiento y stock mínimo',
              ]}
            />
          }
        />
        <Route
          path="clientes"
          element={
            <Placeholder
              title="Clientes"
              fase="Fase 3"
              descripcion="Fichas de clientes y su historial."
              puntos={['Datos de contacto', 'Historial de compras', 'Saldo pendiente y abonos']}
            />
          }
        />
        <Route
          path="gastos"
          element={
            <AdminOnly>
              <Placeholder
                title="Gastos y caja"
                fase="Fase 4"
                descripcion="Control de gastos y cierre de caja."
                puntos={['Gastos por categoría', 'Cierre de caja diario por vendedor', 'Reportes exportables']}
              />
            </AdminOnly>
          }
        />
        <Route
          path="ajustes"
          element={
            <AdminOnly>
              <Ajustes />
            </AdminOnly>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
