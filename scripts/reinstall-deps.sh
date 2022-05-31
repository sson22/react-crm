cd $(dirname $0)
cd ..

rm -rf node_modules
rm package-lock.json

rm -rf client/node_modules
rm client/package-lock.json

npm i
cd client
npm i
cd ..

npm i --save-dev cross-env
npm i -G nodemon typescript
