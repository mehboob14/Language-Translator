const axios = require("axios");
const { URLSearchParams } = require("url");
const express = require("express");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { translation: null, error: null });
});
app.post("/translate", async(req, res) => {

    const { text, targetLang } = req.body;

    const encodedParams = new URLSearchParams();
    encodedParams.set('source_language', 'en');
    encodedParams.set('target_language', targetLang);
    encodedParams.set('text', text);

    const options = {
        method: 'POST',
        url: 'https://text-translator2.p.rapidapi.com/translate',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '5a8da76c0dmshc24703e70106fc0p1f69f2jsn122184bb6413',
            'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        data: encodedParams
    };
    try {

        const response = await axios.request(options);

        if (response.data && response.data.translatedText) {
            res.render('index.ejs', {
                translation: response.data.translatedText,
                error: null
            });
        } else {

            res.render("index", {
                translation: null,
                error: "Translation not available!"
            });
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        res.render("index", {
            translation: null,
            error: "Error fetching data!"
        });
    }
});


app.listen(3000, () => {
    console.log("Server runing!");
});