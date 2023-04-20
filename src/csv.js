const fs = require('fs');
const { stringify } = require('csv-stringify');
const AliexpressProductScraper = require('./aliexpressProductScraper');
const { chain, range } = require('lodash')
const os = require('os');
const path = require('path');
 
dir_home = os.homedir();

// Define the headers for the CSV file
const headers = [
  'Handle',
  'Title*',
  'Subtitle',
  'Product description html',
  'Vendor',
  'Tags',
  'Standardized Product Type',
  'Custom Product Type',
  'Collections',
  'Master image',
  'SEO title',
  'SEO description',
  'SEO keywords',
  'Status',
  'SKU',
  'Option1 name',
  'Option1 value',
  'Option2 name',
  'Option2 value',
  'Option3 name',
  'Option3 value',
  'Option4 name',
  'Option4 value',
  'Option5 name',
  'Option5 value',
  'Image',
  'SKU price',
  'SKU compare at price',
  'SKU weight',
  'SKU weight unit',
  'SKU Inventory Tracker',
  'SKU Inventory Policy',
  'SKU Inventory Quantity',
  'Cost per item',
  'Barcode (ISBN, UPC, GTIN, etc.)'
];

// Define a function to map your data object to the CSV format
const mapDataToCSV = (data) => {
  const { title, variants, images, originalPrice, salePrice } = data;
  const rows = [];

  const optionMap = chain(variants.options).map(option => option.values.map(value => ({ ...value, optionName: option.name }))).flatten().keyBy('id').value()

  variants.prices.forEach(priceObj => {
    const { skuId: sku, salePrice: price, originalPrice: compareAtPrice, optionValueIds, availableQuantity } = priceObj;
    let image = ''
    let optionArrIds = optionValueIds.split(',')
    let optionIds = range(0, 5).map(idx => optionArrIds[idx] || '');
    const optionValues = optionIds.map(id => {
      if (!optionMap[id]) return ['', '']
      image = optionMap[id].image;
      return [optionMap[id].optionName, optionMap[id].name]
    }).flat()
    const row = [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'active',
      sku,
      ...optionValues,
      image,
      price,
      compareAtPrice,
      '',
      '',
      '',
      '',
      '',
      availableQuantity,
      '',
      ''
    ]

    if (!rows.length) {
      row[1] = title;
      row[0] = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      row[3] = data.description
    }

    rows.push(row)
  })
  return rows;
};

async function generateProductsCsv(ids) {
  const list = await Promise.all(ids.map(id => AliexpressProductScraper(id)))
  // Convert the data to a CSV string
  stringify([headers, ...list.map(data => mapDataToCSV(data)).flat()], (err, output) => {
    if (err) {
      console.error(err);
      return;
    }

    // Write the CSV string to a file
    fs.writeFile(path.join(dir_home, 'Desktop/output.csv'), output, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log('CSV file saved successfully!');
    });
  });
}

generateProductsCsv([3256804696361589])