let dirs = fs.readdirSync('static/gallery_pics', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(function (d) { return { dir: d, bdate: fs.statSync('static/gallery_pics/' + d.name).birthtime.getTime() } })
    .sort((a,b) => a.bdate - b.bdate)
    .map(o => o.dir.name);