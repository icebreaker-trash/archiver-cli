const { directorySize, bytesToSize, getAbsolutePath } = require('./util.js')
const fs = require('fs')
const archiver = require('archiver')
const path = require('path')
const cliProgress = require('cli-progress')

const defaultOptions = {
  zip: {
    zlib: {
      level: 9
    }
  },
  tar: {
    gzip: true
  }
}

function getExtname (format, option) {
  if (format === 'tar' && option.gzip) {
    return 'tar.gz'
  } else {
    return format
  }
}

function compressFactory (format) {
  const fileFormat = format
  const defaultOption = defaultOptions[fileFormat]

  if (!defaultOption) {
    throw new Error('invalid file format!')
  }
  const destExtname = getExtname(format, defaultOption)
  return async function (dirpath, destpath) {
    const cwdPath = process.cwd()
    const targetPath = getAbsolutePath(dirpath, cwdPath)
    if (!destpath) {
      const extname = path.extname(dirpath)
      destpath = getAbsolutePath(
        path.basename(dirpath, extname) + '.' + destExtname
      )
    }
    const bar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    )

    const archive = archiver(fileFormat, defaultOption)

    if (fs.existsSync(targetPath)) {
      const stat = fs.statSync(targetPath)
      const zipPath = getAbsolutePath(destpath, cwdPath)
      const destdir = path.dirname(zipPath)
      if (!fs.existsSync(destdir)) {
        fs.mkdirSync(destdir)
      }

      const output = fs.createWriteStream(zipPath)
      const wsPromise = new Promise((resolve, reject) => {
        output.on('close', () => {
          const archiveSize = archive.pointer()
          console.log('Archiver wrote %s bytes', bytesToSize(archiveSize))
          console.log(
            'Compression ratio: %d:1',
            Math.round(totalSize / archiveSize)
          )
          console.log(
            'Space savings: %d %',
            (1 - archiveSize / totalSize) * 100
          )
          resolve(archiveSize)
        })
      })
      archive.pipe(output)

      archive.on('error', (err) => {
        throw err
      })

      archive.on('finish', () => {
        bar.stop()
      })
      let totalSize
      if (!stat.isDirectory()) {
        totalSize = stat.size
        console.log('totalSize:', bytesToSize(totalSize))
        archive.pipe(output)
        archive.file(targetPath, false)
      } else {
        totalSize = await directorySize(targetPath)
        console.log('totalSize:', bytesToSize(totalSize))
        archive.directory(targetPath, false)
      }
      archive.on('progress', ({ fs }) => {
        const percent =
          100 - ((totalSize - fs.processedBytes) / totalSize) * 100
        bar.update(parseFloat(percent.toFixed(2)))
      })
      bar.start(100, 0)
      await archive.finalize()
      const size = await wsPromise
      const result = {
        path: zipPath,
        size
      }
      return result
    } else {
      throw new Error('The file or folder does not exist.')
    }
  }
}

module.exports = compressFactory