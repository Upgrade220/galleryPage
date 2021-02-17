import fs from "fs";
import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = process.env.PORT || 5000;
const app = express();

let models = [
    { name: "First Kitty", paragraph: "Some text ♥", 
    frontAvifImg: "model1.avif", frontWebpImg: "model1.webp", frontJpegImg: "model1.jpeg", 
    backAvifImg: "model1back.avif", backWebpImg: "model1back.webp", backJpegImg: "model1back.jpg" },
    { name: "Second Kitty", paragraph: "Some text ♥", 
    frontAvifImg: "model2.avif", frontWebpImg: "model2.webp", frontJpegImg: "model2.jpg", 
    backAvifImg: "model2back.avif", backWebpImg: "model2back.webp", backJpegImg: "model2back.jpg" },
    { name: "Third Kitty", paragraph: "Some text ♥", 
    frontAvifImg: "model3.avif", frontWebpImg: "model3.webp", frontJpegImg: "model3.jpeg", 
    backAvifImg: "model3back.avif", backWebpImg: "model3back.webp", backJpegImg: "model3back.jpg" }
]

let galleries = [
    {link: "0", paragraph:"Some Kitty", avifImg: "cat1.avif", webpImg: "cat1.webp", jpegImg: "cat1.jpg"},
    {link: "1", paragraph:"Some Kitty", avifImg: "cat2.avif", webpImg: "cat2.webp", jpegImg: "cat2.jpg"},
    {link: "2", paragraph:"Some Kitty", avifImg: "cat3.avif", webpImg: "cat3.webp", jpegImg: "cat3.jpg"}
]

let galleryPages = [
    { pictures:
            [{avifImg: "cat1.avif", webpImg: "cat1.webp", jpegImg: "cat1.jpg", name: "cat1"},
                {avifImg: "cat2.avif", webpImg: "cat2.webp", jpegImg: "cat2.jpg", name: "cat2"},
                {avifImg: "cat3.avif", webpImg: "cat3.webp", jpegImg: "cat3.jpg", name: "cat3"}],
        pageTitle: "0",
        pageP: "Cute kitties"},
    { pictures:
            [{avifImg: "cat2.avif", webpImg: "cat2.webp", jpegImg: "cat2.jpg", name: "cat2"},
                {avifImg: "cat3.avif", webpImg: "cat3.webp", jpegImg: "cat3.jpg", name: "cat3"},
                {avifImg: "cat4.avif", webpImg: "cat4.webp", jpegImg: "cat4.jpg", name: "cat4"}],
        pageTitle: "1",
        pageP: "Cute kitties"},
    { pictures:
            [{avifImg: "cat3.avif", webpImg: "cat3.webp", jpegImg: "cat3.jpg", name: "cat3"},
                {avifImg: "cat4.avif", webpImg: "cat4.webp", jpegImg: "cat4.jpg", name: "cat4"},
                {avifImg: "cat5.avif", webpImg: "cat5.webp", jpegImg: "cat5.jpg", name: "cat5"}],
        pageTitle: "2",
        pageP: "Cute kitties"}
]

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

console.log(getDirectories('./static'));

app.use("/static", express.static(path.join(rootDir, 'static')));
app.use(cookieParser());

app.set("view engine", "hbs");

app.engine(
    "hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "/views/layouts/"),
        partialsDir: path.join(rootDir, "/views/partials/"),
    })
);

app.get("/", (_, res) => {
    res.render("index", {
        layout: "default",
        title: "Welcome",
        HomeStyle: "active",
        stylesheet: "index.css",
    })
});

app.get("/galleries", (_, res) => {
    res.render("galleries", {
        layout: "default",
        title: "About",
        GalleryStyle: "active",
        stylesheet: "galleries.css",
        pageTitle: "Galleries",
        galleries: galleries,
    })
});

app.get("/gallery/:part", (_, res) => {
    let part = _.url.split("/")[2];
    res.render("gallery", {
        layout: "default",
        title: "Gallery",
        GalleryStyle: "active",
        stylesheet: "gallery.css",
        pageTitle: galleryPages[parseInt(part)].pageTitle,
        pageP: galleryPages[parseInt(part)].pageP,
        pictures: galleryPages[parseInt(part)].pictures,
    })
});

app.get("/models", (_, res) => {
    res.render("models", {
        layout: "default",
        title: "About",
        ModelsStyle: "active",
        stylesheet: "models.css",
        pageTitle: "My Lovely Models",
        models: models,
    })
});

app.get("/about", (_, res) => {
    res.render("about", {
        layout: "default",
        title: "About",
        AboutStyle: "active",
        stylesheet: "models.css",
        pageTitle: "About Me",
        avifImg: "photographer.avif",
        webpImg: "photographer.webp",
        jpegImg: "photographer.jpeg",
        sectionTitle: "Photographer",
        paragraph: "Some Text",
    })
});

app.listen(port, () => console.log(`App listening on port ${port}`));