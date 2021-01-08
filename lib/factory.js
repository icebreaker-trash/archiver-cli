const { directorySize, bytesToSize, getAbsolutePath } = require('./util.js')
const fs = require('fs')
const archiver = require('archiver')
const path = require('path')
const cliProgress = require('cli-progress')

/**
 * @readonly
 * @enum {Object}
 */
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

/**
 * @param {String} format
 * @param {Object} option
 */
function getExtname (format, option) {
  if (format === 'tar' && option.gzip) {
    return 'tar.gz'
  } else {
    return format
  }
}

/**
 *
 * @param {String} format
 */
function compressFactory (format) {
  const fileFormat = format
  const defaultOption = defaultOptions[fileFormat]

  if (!defaultOption) {
    throw new Error('invalid file format!')
  }
  const destExtname = getExtname(format, defaultOption)

  /**
   * @typedef {Object} Option
   * @property {String|Boolean} innerPath
   * @param {String} dirpath
   * @param {String} destpath
   * @param {Option} option
   */
  return async function (dirpath, destpath, option) {
    const _option = Object.assign({ innerPath: false }, option)

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
        fs.mkdirSync(destdir, {
          recursive: true
        })
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
        archive.pipe(output)
        archive.file(targetPath, {
          name: path.basename(targetPath)
        })
      } else {
        console.log('Starting computing totalSize ...')
        totalSize = await directorySize(targetPath)
        archive.directory(targetPath, _option.innerPath)
      }
      console.log('totalSize:', bytesToSize(totalSize))
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
        filename: path.basename(zipPath),
        stat: fs.statSync(zipPath),
        size
      }
      return result
    } else {
      throw new Error('The file or folder does not exist.')
    }
  }
}

module.exports = compressFactory
