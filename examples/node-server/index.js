const bundle = require("jcode-bundler").default;
const express = require("express");
const app = express();

app.use(express.json());

app.post("/bundle", async (req, res) => {
    try {
        const rawUrl = req.body.rawUrl;
        if (rawUrl) {
            console.log("bundle " + rawUrl); 
            res.json(await bundle(rawUrl));
            return;
        }
    } catch {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(400);
})

const listener = app.listen(process.env.PORT || 3080, function() {
    console.log("Listening on port " + listener.address().port);
});