#!/bin/bash

export NPM_NEW_VERSION=$(node -e \
    "var pj=require('./package.json'); console.log(\`v\${pj.version}\`)");

echo "### INFO: Pushing tag $NPM_NEW_VERSION"
git push origin $NPM_NEW_VERSION

echo "### INFO: Publishing version $NPM_NEW_VERSION"
npm publish --access=public
