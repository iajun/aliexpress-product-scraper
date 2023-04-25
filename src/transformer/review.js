const { ProductName } = require('./config')
const dayjs = require('dayjs')

// Define the headers for the CSV file
const Headers = [
  "Handle(Handle is the content after the last slash of the product link, that is, the product name)",
  "Name(not required, up to 100 characters)","Rating(required,must be integer from 1-5)",
  "Review content(optional，this can be up to 1000 characters long)",
  "Review image URL(optional,multiple URLs must be separated by line break，this can be up to 9 pictures)",
  "Review time(required,format：YYYY/MM/DD)",
  "Helpful times(The maximum value of the help number is 100000, only positive integer numbers are supported)",
  "Is it a good review(If it is a good review, please enter \"Yes\", if it is empty, it will default to non-good review)"
];

function transform(data) {
  const {feedback, productId, title} = data;
  const rows = [];
  const productConfig = ProductName[productId];

  feedback.forEach(feedback => {
    const { photos: images, rating, displayName: name, date, content } = feedback;
    const row = [
      productConfig ? productConfig.handle : title,
      name,
      rating,
      content,
      images.join('\n'),
      dayjs(date).format('YYYY/MM/DD'),
      '',
      ''
    ];
    rows.push(row);
  })
  return rows;
}


module.exports = function (productList) {
  const rows = productList.map(transform).flat();

  return {
    name: 'review-list',
    rows: [
      Headers,
      ...rows
    ]
  }
}