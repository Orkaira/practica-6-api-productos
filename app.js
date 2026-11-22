const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// TODO: POST /productos - Crear nuevo producto
// POST - Crear un producto nuevo
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body

    // Validar que todos los campos sean obligatorios
    if (!nombre || !descripcion || precio === undefined || precio === '') {
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        })
    }

    const nuevoId = productos.length > 0
        ? Math.max(...productos.map(p => p.id)) + 1
        : 1

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        descripcion,
        precio: parseFloat(precio)
    }

    productos.push(nuevoProducto)

    res.status(201).json(nuevoProducto)
})

// TODO: PUT /productos/:id - Actualizar producto
// PUT - Actualizar un producto existente
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // Buscar la posición del producto
    const indice = productos.findIndex(p => p.id === id)

    // Comprobar si el producto existe
    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        })
    }

    const { nombre, descripcion, precio } = req.body

    // Validar los campos obligatorios
    if (!nombre || !descripcion || precio === undefined || precio === '') {
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        })
    }

    const precioNumerico = parseFloat(precio)

    if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un número mayor que cero'
        })
    }

    // Actualizar los datos conservando el mismo id
    const productoActualizado = {
        id: productos[indice].id,
        nombre,
        descripcion,
        precio: precioNumerico
    }

    productos[indice] = productoActualizado

    res.status(200).json(productoActualizado)
})

// TODO: DELETE /productos/:id - Eliminar producto
// DELETE - Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // Buscar la posición del producto
    const indice = productos.findIndex(p => p.id === id)

    // Comprobar si el producto existe
    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        })
    }

    // Guardar los datos antes de eliminarlo
    const productoEliminado = productos[indice]

    // Eliminar el producto del arreglo
    productos.splice(indice, 1)

    // Enviar la respuesta
    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: productoEliminado
    })
})

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
