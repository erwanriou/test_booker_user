# CHECK IF ENV LOCAL EXIST
if
  [ ! -f .npmrc ]
then
  echo "@erwanriou:registry=https://npm.pkg.github.com/erwanriou \nregistry=https://registry.npmjs.org" > .npmrc
  echo "semi: false \ntrailingComma: \"none\" \narrowParens: \"avoid\" \nprintWidth: 150" > .prettierrc.yml
fi
