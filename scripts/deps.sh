cd $(dirname $0)
cd ..

npm i
cd client
npm i
cd ..

npm i --save-dev cross-env @types/bson
npm i -G nodemon typescript
