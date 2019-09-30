# Abe's Autolaoder

## To Publish

You will need access to the `@abeai` domain on npm.

    npm login --scope=@abeai
    npm version [patch|minor|major]
    # check package.json
    cat package.json | grep version

    # This script will push the tag to the github repo and then publish to npm.
    ./scripts/publish.sh

