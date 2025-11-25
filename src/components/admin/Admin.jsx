import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  getAllProductos, createProducto, updateProducto, deleteProducto,
  // fallback local operations (kept for products/users only)
  getAllUsers, createUserAdmin, updateUserAdmin, deleteUserAdmin,
  isUserLoggedIn, isUserAdmin
} from '../../service/localStorage'
import categoryService from '../../service/categoryService'
import platformService from '../../service/platformService'
import { getUsers, createUser, updateUser, deleteUser } from '../../service/userService'
import roleService from '../../service/roleService'
import { validationRun, validationName, validationApellidos, validationEmail, validationPassword } from '../register/Validation'
import './admin.css'
import { confirmAction } from '../../utils/alert'
import { showErrorToast, showSuccessToast } from '../../utils/toast'

const Admin = () => {
  // Verificar autorización antes de mostrar el contenido
  const isLoggedIn = isUserLoggedIn()
  const isAdmin = isUserAdmin()

  // Si no está logueado, redirigir al login
  if (!isLoggedIn) {
    return <Navigate to="/login?redirect=/admin" replace />
  }

  // Si está logueado pero no es admin, mostrar error y redirigir
  if (!isAdmin) {
    showErrorToast('No tienes permisos para acceder a esta página')
    return <Navigate to="/home" replace />
  }

  const [tab, setTab] = useState('productos')

  // Productos
  const [productos, setProductos] = useState([])
  const [nuevoProducto, setNuevoProducto] = useState({ imagenUrl: '', titulo: '', atributos: '', precio: 0, categoria: '', plataforma: '', enOferta: false, descuento: 0, fechaInicioOferta: '', fechaFinOferta: '' })

  // Categorias
  const [categorias, setCategorias] = useState([])
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [editingCategoria, setEditingCategoria] = useState(null)

  // Plataformas
  const [plataformas, setPlataformas] = useState([])
  const [nuevaPlataforma, setNuevaPlataforma] = useState('')
  const [editingPlataforma, setEditingPlataforma] = useState(null)

  // Roles
  const [roles, setRoles] = useState([])
  const [nuevoRole, setNuevoRole] = useState('')
  const [editingRole, setEditingRole] = useState(null)
  
  // Users
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  // Match User.java: run, firstName, lastName, email, password, role
  const [nuevoUser, setNuevoUser] = useState({ run: '', firstName: '', lastName: '', email: '', password: '', role: '' })

  useEffect(() => {
    refreshAll()
  }, [])

  const refreshAll = async () => {
    setProductos(getAllProductos())
    // load categories and platforms from backend (fallback to localStorage if error)
    try {
      const cats = await categoryService.getCategories()
      // backend returns array of {id,nombre}
      setCategorias((cats || []).map(c => c.nombre))
    } catch (err) {
      console.error('Error fetching categories from API, falling back to localStorage', err)
      setCategorias(getAllCategorias())
    }

    try {
      const plats = await platformService.getPlatforms()
      // backend returns array of {id,nombre}
      setPlataformas((plats || []).map(p => p.nombre))
    } catch (err) {
      console.error('Error fetching platforms from API, falling back to localStorage', err)
      setPlataformas(getAllPlataformas())
    }
    // load roles from backend
    try {
      const rolesResp = await roleService.getRoles()
      // backend returns array of {id,name}
      const roleNames = (rolesResp || []).map(r => r.name)
      setRoles(roleNames)
      // set default role in the form if none selected
      setNuevoUser(prev => ({ ...prev, role: prev.role || (roleNames[0] || '') }))
    } catch (err) {
      console.error('Error fetching roles from API, falling back to localStorage', err)
      setRoles(getAllRoles())
    }
    try {
      const usersFromApi = await getUsers()
      setUsers(usersFromApi)
    } catch (err) {
      console.error('Error fetching users from API, falling back to localStorage', err)
      setUsers(getAllUsers())
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

  // Categorias
  const handleCreateCategoria = (e) => {
    e.preventDefault();
    if (!nuevaCategoria) {
      showErrorToast('Ingrese una categoría válida')
      return
    }
    (async () => {
      try {
        if (editingCategoria) {
          // update existing category: find id by old name
          const cats = await categoryService.getCategories()
          const found = (cats || []).find(x => x.nombre === editingCategoria)
          if (!found) {
            showErrorToast('Categoría no encontrada en backend')
            return
          }
          const payload = { nombre: nuevaCategoria }
          // expect service to have updateCategory(id, payload)
          if (categoryService.updateCategory) {
            await categoryService.updateCategory(found.id, payload)
            showSuccessToast('Categoría actualizada')
            setEditingCategoria(null)
          } else {
            // fallback: delete + create (only if update not available)
            await categoryService.deleteCategory(found.id)
            await categoryService.createCategory(payload)
            showSuccessToast('Categoría actualizada (recreate)')
            setEditingCategoria(null)
          }
        } else {
          const payload = { nombre: nuevaCategoria }
          await categoryService.createCategory(payload)
          showSuccessToast('Categoría creada')
        }
        setNuevaCategoria('')
        await refreshAll()
      } catch (err) {
        console.error('Error creating/updating category', err)
        showErrorToast('Error creando/actualizando categoría')
      }
    })()
  }

  const handleDeleteCategoria = (c) => {
    confirmAction({ title: 'Eliminar categoría', text: '¿Eliminar categoría?', confirmText: 'Eliminar' }).then(ok => {
      if (!ok) return
      (async () => {
        try {
          // find category id by name
          const cats = await categoryService.getCategories()
          const found = (cats || []).find(x => x.nombre === c)
          if (!found) {
            showErrorToast('Categoría no encontrada en backend')
            return
          }
          await categoryService.deleteCategory(found.id)
          showSuccessToast('Categoría eliminada')
          await refreshAll()
        } catch (err) {
          console.error('Error deleting category', err)
          showErrorToast('Error eliminando categoría')
        }
      })()
    })
  }

  const handleStartEditCategoria = (catName) => {
    setNuevaCategoria(catName)
    setEditingCategoria(catName)
  }

  const handleCancelEditCategoria = () => {
    setNuevaCategoria('')
    setEditingCategoria(null)
  }

  // Plataformas
  const handleCreatePlataforma = (e) => {
    e.preventDefault();
    if (!nuevaPlataforma) {
      showErrorToast('Ingrese una plataforma válida')
      return
    }
    (async () => {
      try {
        if (editingPlataforma) {
          const plats = await platformService.getPlatforms()
          const found = (plats || []).find(x => x.nombre === editingPlataforma)
          if (!found) {
            showErrorToast('Plataforma no encontrada en backend')
            return
          }
          const payload = { nombre: nuevaPlataforma }
          if (platformService.updatePlatform) {
            await platformService.updatePlatform(found.id, payload)
            showSuccessToast('Plataforma actualizada')
            setEditingPlataforma(null)
          } else {
            await platformService.deletePlatform(found.id)
            await platformService.createPlatform(payload)
            showSuccessToast('Plataforma actualizada (recreate)')
            setEditingPlataforma(null)
          }
        } else {
          const payload = { nombre: nuevaPlataforma }
          await platformService.createPlatform(payload)
          showSuccessToast('Plataforma creada')
        }
        setNuevaPlataforma('')
        await refreshAll()
      } catch (err) {
        console.error('Error creating/updating platform', err)
        showErrorToast('Error creando/actualizando plataforma')
      }
    })()
  }

  const handleDeletePlataforma = (p) => {
    confirmAction({ title: 'Eliminar plataforma', text: '¿Eliminar plataforma?', confirmText: 'Eliminar' }).then(ok => {
      if (!ok) return
      (async () => {
        try {
          const plats = await platformService.getPlatforms()
          const found = (plats || []).find(x => x.nombre === p)
          if (!found) {
            showErrorToast('Plataforma no encontrada en backend')
            return
          }
          await platformService.deletePlatform(found.id)
          showSuccessToast('Plataforma eliminada')
          await refreshAll()
        } catch (err) {
          console.error('Error deleting platform', err)
          showErrorToast('Error eliminando plataforma')
        }
      })()
    })
  }

  const handleStartEditPlataforma = (platName) => {
    setNuevaPlataforma(platName)
    setEditingPlataforma(platName)
  }

  const handleCancelEditPlataforma = () => {
    setNuevaPlataforma('')
    setEditingPlataforma(null)
  }

  // Roles: crear / actualizar
  const handleSubmitRole = async (e) => {
    e.preventDefault()
    if (!nuevoRole) {
      showErrorToast('Ingrese un nombre de rol válido')
      return
    }
    try {
      if (editingRole) {
        // actualizar rol: buscar id por nombre antiguo
        const rolesResp = await roleService.getRoles()
        const found = (rolesResp || []).find(x => x.name === editingRole)
        if (!found) {
          showErrorToast('Rol no encontrado en backend')
          return
        }
        const payload = { name: nuevoRole }
        await roleService.updateRole(found.id, payload)
        showSuccessToast('Rol actualizado')
        setEditingRole(null)
      } else {
        const payload = { name: nuevoRole }
        await roleService.createRole(payload)
        showSuccessToast('Rol creado')
      }
      setNuevoRole('')
      await refreshAll()
    } catch (err) {
      console.error('Error creando/actualizando rol via API', err)
      showErrorToast('Error procesando rol')
    }
  }

  const handleStartEditRole = (roleName) => {
    setNuevoRole(roleName)
    setEditingRole(roleName)
  }
  
  const handleCancelEditRole = () => {
    setNuevoRole('')
    setEditingRole(null)
  }

  // Users
  const handleCreateUser = async (e) => {
    e.preventDefault();
    // Validaciones
    if (!validationRun(nuevoUser.run)) {
  showErrorToast('RUN inválido. Formato esperado: 12345678-9')
      return
    }

    if (!validationName(nuevoUser.firstName)) {
  showErrorToast('Nombre inválido')
      return
    }

    if (!validationName(nuevoUser.lastName)) {
      showErrorToast('Apellido inválido')
      return
    }

    if (!validationEmail(nuevoUser.email)) {
  showErrorToast('Email inválido. Use duoc.cl, profesor.duoc.cl o gmail.com')
      return
    }

    // Password required only when creating new user. When editing, password is optional
    if (!editingUser) {
      if (!validationPassword(nuevoUser.password)) {
        showErrorToast('Password inválida. Debe tener entre 4 y 10 caracteres')
        return
      }
    } else {
      // if editing and password is provided, validate it
      if (nuevoUser.password && !validationPassword(nuevoUser.password)) {
        showErrorToast('Password inválida. Debe tener entre 4 y 10 caracteres')
        return
      }
    }

      if (!nuevoUser.role) {
        showErrorToast('Seleccione un rol válido')
        return
      }

    console.log('Enviando usuario al backend:', nuevoUser)
    try {
      if (editingUser) {
        // update path
        // build payload and avoid sending empty password
        const payload = { ...nuevoUser }
        if (!payload.password) delete payload.password
        // try API updateUser first, fallback to localStorage updateUserAdmin
        if (typeof updateUser === 'function') {
          await updateUser(editingUser, payload)
        } else {
          // fallback local function kept in localStorage service
          updateUserAdmin(editingUser, payload)
        }
        showSuccessToast('Usuario actualizado')
        setEditingUser(null)
      } else {
        const createdResp = await createUser(nuevoUser)
        // backend returns { message, user }
        const created = createdResp.user || createdResp
        const displayName = created.firstName || created.nombre || created.email || created.run || 'usuario'
        showSuccessToast(`Usuario ${displayName} creado`)
      }
      setNuevoUser({ run: '', firstName: '', lastName: '', email: '', password: '', role: '' })
      await refreshAll()
    } catch (err) {
      console.error('Error creating/updating user via API', err)
      // try to extract backend message
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Error creando/actualizando usuario'
      showErrorToast(msg)
    }
  }

  const handleStartEditUser = (u) => {
    // fill form with user data and set editing id
    setNuevoUser({ run: u.run || '', firstName: u.firstName || u.nombre || '', lastName: u.lastName || '', email: u.email || '', password: '', role: u.role || '' })
    setEditingUser(u.id || u._id || u.email)
    // scroll to top of admin panel or focus first input if desired
  }

  const handleCancelEditUser = () => {
    setNuevoUser({ run: '', firstName: '', lastName: '', email: '', password: '', role: '' })
    setEditingUser(null)
  }

  const handleDeleteUser = (id) => {
    confirmAction({ title: 'Eliminar usuario', text: '¿Eliminar usuario?', confirmText: 'Eliminar' }).then(async ok => {
      if (!ok) return
      try {
        await deleteUser(id)
        await refreshAll()
        showSuccessToast('Usuario eliminado')
      } catch (err) {
        console.error('Error deleting user via API', err)
        showErrorToast('Error eliminando usuario')
      }
    })
  }

  const nuevaToArray = (val) => {
    if (!val) return []
    return val.split(',').map(s => s.trim()).filter(Boolean)
  }

  return (
    <div className="container admin-wrapper">
      <h3>Panel de Administración</h3>
      <ul className="nav nav-tabs">
        <li className="nav-item"><button className={`nav-color nav-link ${tab==='productos'?'active':''}`} onClick={()=>setTab('productos')}>Productos</button></li>
        <li className="nav-item"><button className={`nav-color nav-link ${tab==='categorias'?'active':''}`} onClick={()=>setTab('categorias')}>Categorías</button></li>
        <li className="nav-item"><button className={`nav-color nav-link ${tab==='plataformas'?'active':''}`} onClick={()=>setTab('plataformas')}>Plataformas</button></li>
        <li className="nav-item"><button className={`nav-color nav-link ${tab==='roles'?'active':''}`} onClick={()=>setTab('roles')}>Roles</button></li>
        <li className="nav-item"><button className={`nav-color nav-link ${tab==='usuarios'?'active':''}`} onClick={()=>setTab('usuarios')}>Usuarios</button></li>
      </ul>

      <div className="tab-content p-3 border border-top-0">
        {tab === 'productos' && (
          <div>
            <h6>Crear producto</h6>
            <form onSubmit={handleCreateProducto} className="admin-action-row mb-3">
              <div className="admin-action-inputs">
                <div className="d-flex gap-2">
                  <input className="form-control" placeholder="Imagen URL" value={nuevoProducto.imagenUrl} onChange={e=>setNuevoProducto({...nuevoProducto,imagenUrl:e.target.value})} />
                  <input className="form-control" type="file" accept="image/*" onChange={async e=>{
                    const file = e.target.files && e.target.files[0]
                    if (!file) return
                    const uploaded = await handleUploadImage(file)
                    if (uploaded) setNuevoProducto({...nuevoProducto, imagenUrl: uploaded})
                  }} />
                </div>
                <input className="form-control" placeholder="Título" value={nuevoProducto.titulo} onChange={e=>setNuevoProducto({...nuevoProducto,titulo:e.target.value})} />
                <input className="form-control" placeholder="Atributos" value={nuevoProducto.atributos} onChange={e=>setNuevoProducto({...nuevoProducto,atributos:e.target.value})} />
                <input className="form-control" type="number" placeholder="Precio" value={nuevoProducto.precio} onChange={e=>setNuevoProducto({...nuevoProducto,precio:parseInt(e.target.value||0)})} />
                <select className="form-select" value={nuevoProducto.categoria} onChange={e=>setNuevoProducto({...nuevoProducto,categoria:e.target.value})}>
                  <option value="">--Categoria--</option>
                  {categorias.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="form-control" placeholder="Plataformas (comma)" value={nuevoProducto.plataforma} onChange={e=>setNuevoProducto({...nuevoProducto,plataforma:e.target.value})} />
                <div className="d-flex gap-2 align-items-center">
                  <input type="checkbox" id="enOferta" checked={nuevoProducto.enOferta} onChange={e=>setNuevoProducto({...nuevoProducto,enOferta:e.target.checked})} />
                  <label htmlFor="enOferta">En oferta</label>
                  <input className="form-control" type="number" placeholder="Descuento %" value={nuevoProducto.descuento} onChange={e=>setNuevoProducto({...nuevoProducto,descuento:parseInt(e.target.value||0)})} />
                  <input className="form-control" type="date" placeholder="Fecha Inicio" value={nuevoProducto.fechaInicioOferta} onChange={e=>setNuevoProducto({...nuevoProducto,fechaInicioOferta:e.target.value})} />
                  <input className="form-control" type="date" placeholder="Fecha Fin" value={nuevoProducto.fechaFinOferta} onChange={e=>setNuevoProducto({...nuevoProducto,fechaFinOferta:e.target.value})} />
                </div>
              </div>
              <div className="admin-action-btn">
                <button className="btn btn-primary-admin" type="submit">AGREGAR</button>
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
        )}

        {tab === 'categorias' && (
          <div>
            <h6>Crear categoría</h6>
            <form onSubmit={handleCreateCategoria} className="d-flex gap-2 mb-3">
              <input className="form-control" placeholder="Ingrese categoría" value={nuevaCategoria} onChange={e=>setNuevaCategoria(e.target.value)} />
              <button className="btn btn-primary-admin">{editingCategoria ? 'Actualizar' : 'Agregar'}</button>
              {editingCategoria && <button type="button" className="btn btn-secondary" onClick={handleCancelEditCategoria}>Cancelar</button>}
            </form>
            <h5>Categorías</h5>
            <ul className="list-group mb-2">
              {categorias.map(c=> (
                <li key={c} className="list-group-item d-flex justify-content-between align-items-center">
                  {c}
                  <div>
                    <button className="btn-editar me-2" onClick={()=>handleStartEditCategoria(c)}>Editar</button>
                    <button className="btn-eliminar" onClick={()=>handleDeleteCategoria(c)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'plataformas' && (
          <div>
            <h6>Crear plataforma</h6>
            <form onSubmit={handleCreatePlataforma} className="d-flex gap-2 mb-3">
              <input className="form-control" placeholder="Ingresar plataforma" value={nuevaPlataforma} onChange={e=>setNuevaPlataforma(e.target.value)} />
              <button className="btn btn-primary-admin">{editingPlataforma ? 'Actualizar' : 'Agregar'}</button>
              {editingPlataforma && <button type="button" className="btn btn-secondary" onClick={handleCancelEditPlataforma}>Cancelar</button>}
            </form>
            <h5>Plataformas</h5>
            <ul className="list-group mb-2">
              {plataformas.map(p=> (
                <li key={p} className="list-group-item d-flex justify-content-between align-items-center">
                  {p}
                  <div>
                    <button className="btn-editar me-2" onClick={()=>handleStartEditPlataforma(p)}>Editar</button>
                    <button className="btn-eliminar" onClick={()=>handleDeletePlataforma(p)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'roles' && (
          <div>
            <h5>Roles</h5>
            <form onSubmit={handleSubmitRole} className="d-flex gap-2">
              <input className="form-control" placeholder="Ingrese rol" value={nuevoRole} onChange={e=>setNuevoRole(e.target.value)} />
              <button className="btn btn-primary-admin">{editingRole ? 'Actualizar' : 'Agregar'}</button>
              {editingRole && <button type="button" className="btn btn-secondary" onClick={handleCancelEditRole}>Cancelar</button>}
            </form>
            <br></br>
            <ul className="list-group mb-2">
              {roles.map(r=> (
                <li key={r} className="list-group-item d-flex justify-content-between align-items-center">
                  {r}
                  <div>
                    <button className="btn-editar me-2" onClick={()=>handleStartEditRole(r)}>Editar</button>
                    <button className="btn-eliminar" onClick={()=>handleDeleteRole(r)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'usuarios' && (
          <div>
            <h6>Crear usuario</h6>
            <form onSubmit={handleCreateUser} className="admin-action-row mb-3">
              <div className="admin-action-inputs">
                <input className="form-control" placeholder="RUN" value={nuevoUser.run} onChange={e=>setNuevoUser({...nuevoUser,run:e.target.value})} />
                <input className="form-control" placeholder="Nombre" value={nuevoUser.firstName} onChange={e=>setNuevoUser({...nuevoUser,firstName:e.target.value})} />
                <input className="form-control" placeholder="Apellido" value={nuevoUser.lastName} onChange={e=>setNuevoUser({...nuevoUser,lastName:e.target.value})} />
                <input className="form-control" placeholder="Email" value={nuevoUser.email} onChange={e=>setNuevoUser({...nuevoUser,email:e.target.value})} />
                <input className="form-control" placeholder={editingUser ? 'Password (opcional para editar)' : 'Password'} type='password' value={nuevoUser.password} onChange={e=>setNuevoUser({...nuevoUser,password:e.target.value})} />
                <select className="form-select" value={nuevoUser.role} onChange={e=>setNuevoUser({...nuevoUser,role:e.target.value})}>
                  <option value="">--Seleccione rol--</option>
                  {roles.map(r=> <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="admin-action-btn">
                <br />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary-admin" type="submit">{editingUser ? 'Actualizar' : 'AGREGAR'}</button>
                  {editingUser && <button type="button" className="btn btn-secondary" onClick={handleCancelEditUser}>Cancelar</button>}
                </div>
              </div>
            </form>

            <h5>Usuarios registrados</h5>
            <table className="table table-sm">
              <thead><tr><th>RUN</th><th>Nombre</th><th>Email</th><th>Role</th><th>Acciones</th></tr></thead>
              <tbody>
                {users.map(u=> (
                  <tr key={u.id}>
                    <td>{u.run || ''}</td>
                    <td>{(u.firstName || u.nombre || '') + ' ' + (u.lastName || '')}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <div className="user-row-actions">
                        <button className="btn-editar me-2" onClick={()=>handleStartEditUser(u)}>Editar</button>
                        <button className="btn-eliminar" onClick={()=>handleDeleteUser(u.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
