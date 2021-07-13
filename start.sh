#!/bin/sh

ROOT_DIR=/app/dist

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"
for file in $ROOT_DIR/js/app.*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  echo "Processing $file ...";

  sed -i 's|§VUE_APP_MAPS_API_KEY|'${MAPS_API_KEY}'|g' $file 

done

http-server dist
