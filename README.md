# nyaaff

Pretty simple setup. We use GitHub pages to host since it's all static. Node is
used for development.

Website is made in ejs templating language.

The website is hosted from `docs` directory.

`data` directory is pretty self-explanatory. You can update everything on the
site by changing the files in there.

`src/public` contains all the static assets such as the PDFs. When you build,
this directory is copied to `docs`. Make sure you add the new files (such as
PDFs) to Git or you will get 404 on the website.

Take a look in `package.json` for the scripts.

`dev` sets up an express server (express is not used in production obviously)
that should server everything properly on localhost:3000.

`build` script runs the `buildScript.js` which takes the data directory and the
ejs files and renders the site, then puts the HTML files in docs. Then it copys
the `public` to `docs`.

To deploy make your changes, add all the files to git, commit, push, and GH
pages should deploy it within a couple minutes.

Domain is controlled by `docs/CNAME` which is `nyaaff.com` right now.
