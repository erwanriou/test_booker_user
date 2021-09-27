# CHECK IF ENV LOCAL EXIST
if
  [ ! -f .npmrc ]
then
  # CREATE NEEDED RESSOURCES
  echo "@archsplace:registry=https://npm.pkg.github.com/archsplace \nregistry=https://registry.npmjs.org" > .npmrc
  echo "semi: false \ntrailingComma: \"none\" \narrowParens: \"avoid\" \nprintWidth: 150" > .prettierrc.yml
fi
