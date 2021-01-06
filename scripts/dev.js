const {
  zip,
  tar
} = require('..')
const path = require('path')
async function main () {
  // await zip('node_modules')
  const dirpath = path.resolve(__dirname, '../node_modules')
  const destpath = path.resolve(__dirname, '../.serverless/layer/node_modules.zip')
  await zip(dirpath, destpath)
  console.log('successfully')
}

main()
