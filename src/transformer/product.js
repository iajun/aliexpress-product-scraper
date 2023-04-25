const { chain, range } = require('lodash')
const { ProductName } = require('./config')

// Define the headers for the CSV file
const ProductHeaders = [
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

function transform(data) {
  const { title, variants } = data;
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
      row[0] = ProductName[data.productId].handle;
      row[1] = ProductName[data.productId].title;
      row[3] = data.description
    }

    rows.push(row)
  })
  return rows;
}


module.exports = function (productList) {
  const rows = productList.map(transform).flat();

  return {
    name: 'product-list',
    rows: [
      ProductHeaders,
      ...rows
    ]
  }
}