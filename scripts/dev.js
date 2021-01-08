const {
  zip,
  tar
} = require('..')
const path = require('path')
async function main () {
  // await zip('node_modules')
  const dirpath = path.resolve(__dirname, '../node_modules')
  const destpath = path.resolve(__dirname, '../.serverless/layer/node_modules.zip')
  const res = await zip(dirpath, destpath, {
    innerPath: 'node_modules'
  })
  console.log(res)
  console.log('successfully')
}

main()
