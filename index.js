const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");

// Serve static files (CSS, images)
app.use(express.static("public"));

// Homepage route
app.get("/", async (req, res) => {
    try {
        // Fetch the list of breeds
        const response = await axios.get("https://dog.ceo/api/breeds/list/all");
        const breeds = Object.keys(response.data.message);
        res.render("index", { breeds, images: [],selectedBreed: null });
    } catch (error) {
        res.status(500).send("Error fetching breeds");
    }
});

// Route to fetch dog images for a selected breed
app.get("/images", async (req, res) => {
    const breed = req.query.breed;
    if (!breed) return res.redirect("/");

    try {
        const breedListResponse = await axios.get("https://dog.ceo/api/breeds/list/all");
        const breeds = Object.keys(breedListResponse.data.message);

        const response = await axios.get(`https://dog.ceo/api/breed/${breed}/images`);
        res.render("index", { breeds, images: response.data.message, selectedBreed: breed });
    } catch (error) {
        res.status(500).send("Error fetching images");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
