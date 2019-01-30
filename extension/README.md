# Extension for Chrome

## Table of Contents

1. [Setup](#setup)
1. [Reloading](#reloading)

--------

## Setup

1. Go to `chrome://extensions` in Chrome Browser
1. Toggle the "Developer mode" switch
1. Click on "Load Unpacked" then navigate to `.../priv_bird/extension` and select `src/`

You should now see it up in the top right corner.

--------

## Reloading

**Note**: 

- Install this chrome extension!! https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid
- Also run `npm install` on this directory

1. Running `npm start` or `gulp` will have `gulp` constatly watch the contents of `src/*` and on save will cause a reload of `http://reload.extensions`. However this will cause my screen to activate on chrome which is a little annoying when dealing w/ constant saving in dev
1. Running `npm reload` or `gulp reload` will just run the reload extension. Not automatic but a bit nicer when dealing with only run things when you want.