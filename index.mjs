import fs from "fs";
import http2 from "http2";
import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = process.env.PORT || 5000;
const app = express();

const galleryPath = './static/gallery_pics/';
const galleryPFileName = 'p.txt';
const galleryMImgFileName = 'mainImg.txt';

let models = [
    {
        name: "First Kitty", paragraph: "Some text ♥",
        frontAvifImg: "model1.avif", frontWebpImg: "model1.webp", frontJpegImg: "model1.jpeg",
        backAvifImg: "model1back.avif", backWebpImg: "model1back.webp", backJpegImg: "model1back.jpg"
    },
    {
        name: "Second Kitty", paragraph: "Some text ♥",
        frontAvifImg: "model2.avif", frontWebpImg: "model2.webp", frontJpegImg: "model2.jpg",
        backAvifImg: "model2back.avif", backWebpImg: "model2back.webp", backJpegImg: "model2back.jpg"
    },
    {
        name: "Third Kitty", paragraph: "Some text ♥",
        frontAvifImg: "model3.avif", frontWebpImg: "model3.webp", frontJpegImg: "model3.jpeg",
        backAvifImg: "model3back.avif", backWebpImg: "model3back.webp", backJpegImg: "model3back.jpg"
    }
]

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

const getFiles = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);

const parseGalleryDirs = function (path) {
    let result = [];
    let dirs = getDirectories(path);
    for (let dir of dirs) {
        let dirContent = { pictures: [], pageTitle: '', pageP: '', mainImg: '' };
        let dirFiles = getFiles(path + dir).sort();
        let jpegImgs = [];
        let webpImgs = [];
        let avifImgs = [];
        for (let file of dirFiles) {
            let ext = file.split('.').pop();;
            switch (ext) {
                case 'jpg':
                    jpegImgs.push(file);
                    break;
                case 'webp':
                    webpImgs.push(file);
                    break;
                case 'avif':
                    avifImgs.push(file);
                    break;
            }
        }
        if (jpegImgs.length === webpImgs.length && jpegImgs.length === avifImgs.length) {
            for (let i = 0; i < jpegImgs.length; i++) {
                dirContent.pictures.push({ avifImg: avifImgs[i], webpImg: webpImgs[i], jpegImg: jpegImgs[i], name: jpegImgs[i].replace('.jpg', '') })
            }
            dirContent.pageTitle = dir;
            dirContent.pageP = fs.readFileSync(path + dir + '/' + galleryPFileName, 'utf-8');
            dirContent.mainImg = fs.readFileSync(path + dir + '/' + galleryMImgFileName, 'utf-8');
            result.push(dirContent);
        }
    }
    return result;
}

const parseGalleries = function (galleryPages) {
    let result = [];
    let i = 0;
    for (let page of galleryPages) {
        let p = { link: i, paragraph: page.pageTitle, avifImg: `${page.mainImg}.avif`, webpImg: `${page.mainImg}.webp`, jpegImg: `${page.mainImg}.jpg` }
        i++;
        result.push(p);
    }
    return result;
}

let galleryPages = parseGalleryDirs(galleryPath);
let galleries = parseGalleries(galleryPages);

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