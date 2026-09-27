// Un handler por cada método: valida lo que llegó por terminal, llama a la API
// y muestra el resultado. Todos los errores se capturan acá con try/catch.

import { createProduct, deleteProduct, getProducts } from "./api.js";

// "products" o "products/<id numérico>", nada más
const ALL_PRODUCTS = /^products$/;
const ONE_PRODUCT = /^products\/\d+$/;

export const USAGE = `Comandos disponibles:
  npm run start GET products                              → lista todos los productos
  npm run start GET products/<productId>                  → muestra un producto
  npm run start POST products <title> <price> <category>  → crea un producto
  npm run start DELETE products/<productId>               → elimina un producto`;

function showError(message) {
    console.error(`❌ ${message}`);
    process.exitCode = 1;
}

export async function handleGet(resource) {
    if (!ALL_PRODUCTS.test(resource) && !ONE_PRODUCT.test(resource)) {
        return showError(`Recurso inválido: "${resource ?? ""}". Usá products o products/<productId>.\n\n${USAGE}`);
    }

    try {
        const data = await getProducts(resource);
        if (data === null) {
            return showError(`No existe el producto ${resource.split("/")[1]}.`);
        }

        if (Array.isArray(data)) {
            console.log(`✅ ${data.length} productos encontrados:\n`);
        } else {
            console.log(`✅ Producto ${data.id}:\n`);
        }
        console.log(data);
    } catch (error) {
        showError(`No se pudieron obtener los productos: ${error.message}`);
    }
}

export async function handlePost(resource, params) {
    const [title, price, category] = params;

    if (!ALL_PRODUCTS.test(resource) || !title || !price || !category) {
        return showError(`Comando incompleto. Formato: POST products <title> <price> <category>\n\n${USAGE}`);
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
        return showError(`El precio tiene que ser un número mayor a 0 (llegó "${price}").`);
    }

    const product = { title, price: numericPrice, category };

    try {
        const created = await createProduct(product);
        console.log(`✅ Producto creado con id ${created.id}:\n`);
        console.log({ ...product, ...created });
    } catch (error) {
        showError(`No se pudo crear el producto: ${error.message}`);
    }
}

export async function handleDelete(resource) {
    if (!ONE_PRODUCT.test(resource)) {
        return showError(`Falta el id del producto. Formato: DELETE products/<productId>\n\n${USAGE}`);
    }

    try {
        const deleted = await deleteProduct(resource);
        if (deleted === null) {
            return showError(`No existe el producto ${resource.split("/")[1]}.`);
        }
        console.log(`✅ Producto ${deleted.id} eliminado:\n`);
        console.log(deleted);
    } catch (error) {
        showError(`No se pudo eliminar el producto: ${error.message}`);
    }
}
