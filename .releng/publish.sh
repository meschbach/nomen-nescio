#!/bin/bash

export NODE_ENV=production
npm run webpack
cp -R htdocs/* ../nomen-nescio-gh/
