# Pre-entrega Node.js - Gestión de productos desde la terminal

Programa de consola que administra los productos de una tienda en línea usando [FakeStore API](https://fakestoreapi.com/docs). Recibe el comando por terminal, hace la petición a la API con `fetch` y muestra la respuesta.

Trabajo práctico del curso de Back End con Node.js de Talento Tech.

## Requisitos

- Node.js 18 o superior (trae `fetch` incorporado). No hace falta instalar dependencias.

## Uso

```bash
npm run start GET products                              # lista todos los productos
npm run start GET products/<productId>                  # muestra un producto
npm run start POST products <title> <price> <category>  # crea un producto
npm run start DELETE products/<productId>               # elimina un producto
```

### Ejemplos

```bash
npm run start GET products
npm run start GET products/15
npm run start POST products T-Shirt-Rex 300 remeras
npm run start DELETE products/7
```

Salida de `POST`:

```
Producto creado con id 21:

{ title: 'T-Shirt-Rex', price: 300, category: 'remeras', id: 21 }
```

## Estructura

```
index.js          → punto de entrada: lee process.argv y deriva al handler de cada método
src/commands.js   → valida cada comando, llama a la API y muestra el resultado
src/api.js        → funciones que hacen los fetch a FakeStore API
```

## Validaciones

| Caso | Respuesta |
|---|---|
| Método distinto de GET / POST / DELETE | `Método no soportado` y la lista de comandos |
| Recurso que no es `products` o `products/<id>` (ej. `productsXYZ`, `users`) | `Recurso inválido` |
| `POST` sin título, precio o categoría | `Comando incompleto` |
| `POST` con precio que no es número (ej. `abc`) | `El precio tiene que ser un número mayor a 0` |
| `DELETE` sin id | `Falta el id del producto` |
| Id que no existe (ej. `products/999`) | `No existe el producto 999` |
| Falla de red o error de la API | Mensaje de error capturado con `try/catch` |

El método no distingue mayúsculas (`get products` funciona igual que `GET products`). Si el comando falla, el programa termina con código de salida `1`.

## Notas sobre FakeStore API

- El `POST` y el `DELETE` se **simulan**: la API responde como si hubiera creado o eliminado el producto, pero no guarda cambios. Por eso el producto creado siempre recibe el id `21`, y un producto "eliminado" sigue apareciendo en `GET`.
- Cuando se pide un id que no existe, la API responde `200` con el cuerpo vacío en lugar de un `404`. El programa lo detecta y muestra `No existe el producto`.
