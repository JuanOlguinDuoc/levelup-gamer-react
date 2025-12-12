import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  getAllProductos, createProducto, updateProducto, deleteProducto,
  isUserLoggedIn, isUserVendedor
} from '../../service/localStorage'
import categoryService from '../../service/categoryService'
import platformService from '../../service/platformService'
import './vendedor.css'
import { confirmAction } from '../../utils/alert'
import { showErrorToast, showSuccessToast } from '../../utils/toast'

const Vendedor = () => {
  // Verificar autorización antes de mostrar el contenido
  const isLoggedIn = isUserLoggedIn()
  const isVendedor = isUserVendedor()

  // Si no está logueado, redirigir al login
  if (!isLoggedIn) {
    return <Navigate to="/login?redirect=/vendedor" replace />
  }

  // Si está logueado pero no es vendedor, mostrar error y redirigir
  if (!isVendedor) {
    showErrorToast('No tienes permisos para acceder a esta página')
    return <Navigate to="/home" replace />
  }

  // Productos
  const [productos, setProductos] = useState([])
  const [nuevoProducto, setNuevoProducto] = useState({ imagenUrl: '', titulo: '', atributos: '', precio: 0, categoria: '', plataforma: '', enOferta: false, descuento: 0, fechaInicioOferta: '', fechaFinOferta: '' })

  // Categorias y Plataformas (solo para seleccionar en el formulario de productos)
  const [categorias, setCategorias] = useState([])
  const [plataformas, setPlataformas] = useState([])

  useEffect(() => {
    refreshAll()
  }, [])

  const refreshAll = async () => {
    setProductos(getAllProductos())
    // load categories and platforms from backend for the product form
    try {
      const cats = await categoryService.getCategories()
      // backend returns array of {id,nombre}
      setCategorias((cats || []).map(c => c.nombre))
    } catch (err) {
      console.error('Error fetching categories from API', err)
      setCategorias([])
    }

    try {
      const plats = await platformService.getPlatforms()
      // backend returns array of {id,nombre}
      setPlataformas((plats || []).map(p => p.nombre))
    } catch (err) {
      console.error('Error fetching platforms from API', err)
      setPlataformas([])
    }
  }

  // Productos handlers
  const handleUploadImage = async (file) => {
    if (!file) return null
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) {
        showErrorToast('Error al subir imagen')
        return null
      }
      const url = await res.text()
      // url is relative like /uploads/xxx
      return url
    } catch (err) {
      console.error(err)
      showErrorToast('Error al subir imagen')
      return null
    }
  }

  const handleCreateProducto = (e) => {
    e.preventDefault()
    const pl = nuevaToArray(nuevoProducto.plataforma)
    const productoToCreate = { ...nuevoProducto, plataforma: pl }
    // Normalize empty dates and discount
    if (!productoToCreate.enOferta) {
      productoToCreate.descuento = 0
      productoToCreate.fechaInicioOferta = ''
      productoToCreate.fechaFinOferta = ''
    }
    createProducto(productoToCreate)
    setNuevoProducto({ imagenUrl: '', titulo: '', atributos: '', precio: 0, categoria: '', plataforma: '', enOferta: false, descuento: 0, fechaInicioOferta: '', fechaFinOferta: '' })
    refreshAll()
  }

  const handleDeleteProducto = (id) => {
    confirmAction({ title: 'Eliminar producto', text: '¿Eliminar producto?', confirmText: 'Eliminar' }).then(ok => {
      if (!ok) return
      deleteProducto(id)
      refreshAll()
    })
  }

  const nuevaToArray = (val) => {
    if (!val) return []
    return val.split(',').map(s => s.trim()).filter(Boolean)
  }

  return (
    <div className="container vendedor-wrapper">
      <h3>Panel de Vendedor - Gestión de Productos</h3>

      <div className="p-3 border tab-content">
        <div>
          <h6>Crear producto</h6>
            <form onSubmit={handleCreateProducto} className="vendedor-action-row mb-3">
              <div className="vendedor-action-inputs">
                <input className="form-control" placeholder="Imagen URL" value={nuevoProducto.imagenUrl} onChange={e=>setNuevoProducto({...nuevoProducto,imagenUrl:e.target.value})} style={{gridColumn: '1 / -1'}} />
                <input className="form-control" placeholder="Título" value={nuevoProducto.titulo} onChange={e=>setNuevoProducto({...nuevoProducto,titulo:e.target.value})} />
                <input className="form-control" type="number" placeholder="Precio" value={nuevoProducto.precio} onChange={e=>setNuevoProducto({...nuevoProducto,precio:parseInt(e.target.value||0)})} />
                <input className="form-control" placeholder="Atributos" value={nuevoProducto.atributos} onChange={e=>setNuevoProducto({...nuevoProducto,atributos:e.target.value})} style={{gridColumn: '1 / -1'}} />
                <select className="form-select" value={nuevoProducto.categoria} onChange={e=>setNuevoProducto({...nuevoProducto,categoria:e.target.value})}>
                  <option value="">--Categoria--</option>
                  {categorias.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="form-control" placeholder="Plataformas (comma)" value={nuevoProducto.plataforma} onChange={e=>setNuevoProducto({...nuevoProducto,plataforma:e.target.value})} />
                <div className="d-flex gap-2 align-items-center" style={{gridColumn: '1 / -1'}}>
                  <input type="checkbox" id="enOferta" checked={nuevoProducto.enOferta} onChange={e=>setNuevoProducto({...nuevoProducto,enOferta:e.target.checked})} />
                  <label htmlFor="enOferta" className="mb-0" style={{minWidth: '80px'}}>En oferta</label>
                  <input className="form-control" type="number" placeholder="Descuento %" value={nuevoProducto.descuento} onChange={e=>setNuevoProducto({...nuevoProducto,descuento:parseInt(e.target.value||0)})} style={{maxWidth: '120px'}} />
                  <input className="form-control" type="date" placeholder="Fecha Inicio" value={nuevoProducto.fechaInicioOferta} onChange={e=>setNuevoProducto({...nuevoProducto,fechaInicioOferta:e.target.value})} />
                  <input className="form-control" type="date" placeholder="Fecha Fin" value={nuevoProducto.fechaFinOferta} onChange={e=>setNuevoProducto({...nuevoProducto,fechaFinOferta:e.target.value})} />
                </div>
              </div>
              <div className="vendedor-action-btn">
                <button className="btn btn-primary-vendedor" type="submit">AGREGAR</button>
              </div>
            </form>

            <h5>Lista de productos</h5>
            <table className="table table-sm">
              <thead><tr><th>ID</th><th>Imagen</th><th>Título</th><th>Atributos</th><th>Precio</th><th>Categoria</th><th>Plataforma</th><th>Oferta</th><th></th></tr></thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.imagenUrl ? <img src={p.imagenUrl} alt={p.titulo} style={{ width: 50 }} /> : ''}</td>
                    <td>{p.titulo}</td>
                    <td>{p.atributos}</td>
                    <td>{p.precio}</td>
                    <td>{p.categoria}</td>
                    <td>{(p.plataforma||[]).join(', ')}</td>
                    <td>{p.enOferta ? `${p.descuento || 0}%` : 'No'}</td>
                    <td><button className="btn-eliminar" onClick={()=>handleDeleteProducto(p.id)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}

export default Vendedor
