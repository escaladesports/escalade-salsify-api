import config from '../config.json';
import path from 'path';
import XLSX from 'xlsx';
import fs from 'fs-extra';

const itemsToJSON = async () => {
  await fs.outputJson(path.resolve(__dirname, '../dist/JSON/test.json'), {
    hello: 'World'
  });

  // const workbook = XLSX.readFile(path.resolve(__dirname, '../src/export.xlsx'));
  // const sheet_name_list = workbook.SheetNames;
  // sheet_name_list.forEach(y => {
  //   const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
  //   sheet.map(async item => {
  //     await fs.outputJson(
  //       path.resolve(__dirname, `../dist/JSON/${item['Item Number']}.json`),
  //       item
  //     );
  //   });
  // });
};
itemsToJSON();
// const options = {
//   url:
//     'https://app.salsify.com/api/orgs/s-9c2a072b-2f59-495e-b089-121deba82448/export_runs/',
//   headers: {
//     Authorization:
//       'Bearer f2653e0a682e8f524222533233bad7c54a0f5377d3920ddd302353bdb3652f42',
//     'Content-Type': 'application/json'
//   }
// };
// fetch(options.url, {
//   method: 'POST',
//   headers: options.headers,
//   body: JSON.stringify(config)
// })
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.log(err));
