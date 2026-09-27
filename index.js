// Punto de entrada: lee el comando de la terminal y lo deriva al handler que corresponde.
// Ejemplo: npm run start GET products/15  →  method = "GET", resource = "products/15"

import { USAGE, handleDelete, handleGet, handlePost } from "./src/commands.js";

// Las dos primeras posiciones de process.argv son la ruta de node y la de este archivo
const [method, resource, ...params] = process.argv.slice(2);

switch (method?.toUpperCase()) {
    case "GET":
        await handleGet(resource);
        break;
    case "POST":
        await handlePost(resource, params);
        break;
    case "DELETE":
        await handleDelete(resource);
        break;
    default:
        if (method) console.error(`❌ Método no soportado: "${method}"\n`);
        console.log(USAGE);
        process.exitCode = 1;
}
