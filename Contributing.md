## Steps:
1) Fork the project
2) Create new branch
3) Make a pull request :D


## Development Setup

#### Prerequisites
1) [Node.js](https://nodejs.org/en/) installed (v18+).
2) [pnpm](https://pnpm.io/) installed (`npm install -g pnpm`).

#### Commonly used scripts
``` bash
# install dependencies
$ pnpm install

# start dev server with HMR (auto-loads extension in Chrome)
$ pnpm dev

# production build
$ pnpm build

# build + zip for Chrome Web Store
$ pnpm zip

# format code
$ pnpm format
```

#### Steps for development
1) `pnpm install`
2) `pnpm dev`
3) WXT will automatically open Chrome with the extension loaded. If not, load `.output/chrome-mv3/` as an unpacked extension in `chrome://extensions`.
