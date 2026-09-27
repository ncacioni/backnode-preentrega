// Funciones que hablan con FakeStore API. Solo hacen el fetch y devuelven los datos;
// mostrar resultados por consola es responsabilidad de commands.js.

const BASE_URL = "https://fakestoreapi.com";

// Hace la petición y devuelve el cuerpo ya convertido a objeto.
// FakeStore responde 200 con el cuerpo vacío cuando el producto no existe,
// así que leemos el texto primero y devolvemos null en ese caso.
async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}/${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
    });

    if (!response.ok) {
        throw new Error(`La API respondió ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// path puede ser "products" (todos) o "products/15" (uno solo)
export async function getProducts(path) {
    return request(path);
}

export async function createProduct(product) {
    return request("products", {
        method: "POST",
        body: JSON.stringify(product),
    });
}

export async function deleteProduct(path) {
    return request(path, { method: "DELETE" });
}
