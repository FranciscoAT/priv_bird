# Extension to Privacy Bird 

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](./LICENSE)


Privacy Bird was an old Internet Explorer [extension](http://www.privacybird.org/). This project was constructed as part of an Honours Project to bring Privacy Bird to Google Chrome. Using [P3P](https://www.w3.org/P3P/), this extension will analyze websites that publish a `p3p.xml` and determine whether or not the website violates and Privacy Policies set by the user. Additionally Privacy Bird will encrypt any outgoing form data using [Identity Based Encryption](https://en.wikipedia.org/wiki/ID-based_encryption), IBE, should a valid P3P spec exist on the website.

## Getting Started

There are three components as part of this project.

- [Extension](./extension), unpacked source code for the Chrome extensions
- [Sample Site](./sample-site), sample test site for testing the Chrome extension
- [Remote Site](./remote-site), acts as simple key authority for IBE

### Prerequisites

Non-Dev:

- Chrome
- `npm` / `node`

Dev:

- Non-dev Requirements
- `gulp`
- `tmux` (optional but nice if want to use the [`setup.sh`](./setup.sh) script)


### Installing

#### Extension

To install the extension follow the [README](./extension/README.md) in the extension [directory](./extension).

An important note is that currently the extension is hard-coded to not work on any sites other than `localhost:3000`. Therefore you are required to run the Sample Site as described below to play with the extension. Should you want to remove this feature it is recommended to change the source code, in particular you should just need to change the [`checkURL()`](./extension/src/lib_scripts/local_lib.js).

As an additional note if you are planning to dev run `npm install` inside the directory as well. 

#### Sample Site

To install run `npm install` in the Sample Site [directory](./sample-site).

#### Remote Site

To install run `npm install` in the Remote Site [directory](./remote-site).

### Running Services

It is highly recommended to use [`setup.sh`](./setup.sh) script. However if you do not simply run:

```
npm run --prefix ./sample-site start-dev
npm run --prefix ./remote-site start-dev

# Dev additionals

npm run --prefix ./extension start # Runs gulp for generating bundles from encrypt.src.js
```

## Authors

[Francisco Trindade :coffee:](http://franciscot.me)

[Catherine DesOrmeaux](https://github.com/minoucatou)

[NamChi Nguyen](https://github.com/namichie)


## Acknowledgments

Tip of the hat to everyone who worked on the JavaScript IBE.js library: https://www.npmjs.com/package/ibejs

Big thanks to our Supervising Professor, [Professor Adams](http://www.site.uottawa.ca/~cadams/)
