const scraper = require('./scraper');
const transformers = require('./transformer')
const writeCSV = require('./util/writeCSV')

async function main(productIds) {
  const productList = await Promise.all(productIds.map(scraper))
  transformers.forEach(transformer => {
    const csvData = transformer(productList)
    writeCSV(csvData.rows, csvData.name)
    transformer(productList)
  })
}

main([3256804696361589])