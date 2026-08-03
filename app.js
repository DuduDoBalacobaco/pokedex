import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pokedex.html"));
});

app.get("/pokemon/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pokemon.html"));
})

app.listen(3000);