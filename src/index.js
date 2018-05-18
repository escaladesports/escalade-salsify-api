require('envdotjs').load();
import config from '../config.json';
import path from 'path';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import fetch from 'isomorphic-fetch';
import axios from 'axios';
import { connectToDatabase } from '../utils/db';
import Sheet from '../models/Sheet';
import camelCase from 'camelcase';
import brandList from '../list.json';

const listToJSON = () => {
  const listPerPage = 250;
  const options = {
    baseUrl: `https://app.salsify.com/api/orgs/${process.env.SALSIFY_ORG_ID}`,
    url: `https://app.salsify.com/api/orgs/${
      process.env.SALSIFY_ORG_ID
    }/lists?per_page=${listPerPage}`,
    headers: {
      Authorization: `Bearer ${process.env.SALSIFY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise(async (resolve, reject) => {
    let updatedList = [];

    const res = await fetch(options.url, {
      method: 'GET',
      headers: options.headers
    })
      .then(res => res.json())
      .catch(err => reject(err));

    if (res) {
      const { lists, meta } = res;
      updatedList = updatedList.concat(lists);
      const { total_entries, per_page, current_page } = meta;
      const pages = Math.ceil(total_entries / per_page);
      let i;
      if (pages > 1) {
        for (i = current_page + 1; i < pages; i++) {
          const response = await fetch(`${options.url}&page=${i}`, {
            method: 'GET',
            headers: options.headers
          })
            .then(response => response.json())
            .catch(err => reject(err));
          if (response) {
            updatedList = updatedList.concat(response.lists);
          }
        }
      }
    }
    let productList = [];
    if (updatedList.length > 0) {
      const selectedList = updatedList.filter(l => {
        const name = l.name
          .replace(/^\s+|[^\s\w]+|\s+$/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase();
        return brandList.includes(name);
      });

      selectedList.forEach(async (list, index) => {
        let updatedProducts = [];
        const name = list.name
          .replace(/^\s+|[^\s\w]+|\s+$/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase();
        const products = await fetch(
          `${options.baseUrl}/products?filter==list:${
            list.id
          }&per_page=250&view=30478`,
          {
            method: 'GET',
            headers: options.headers
          }
        )
          .then(res => {
            if (res.status === 200) {
              return res.json();
            }
          })
          .catch(err => reject(err));

        products.products.map(product => {
          let updatedProduct = { ...product };
          product.properties.forEach(p => {
            if (p.values.length === 0) {
              return;
            }
            let updatedName = camelCase(
              p.id.replace(/^\s+|[^\s\w]+|\s+$/g, '')
            );

            updatedProduct[updatedName] =
              p.values.length > 1
                ? p.values.map(value => value.id || value.name)
                : p.values[0].id || p.values[0].name;
          });
          delete updatedProduct['properties'];
          updatedProducts.push(updatedProduct);
        });

        const productPages = Math.ceil(
          products.meta.total_entries / products.meta.per_page
        );

        if (productPages > 1) {
          for (let i = products.meta.current_page + 1; i <= productPages; i++) {
            const response = await fetch(
              `${options.baseUrl}/products?filter==list:${
                list.id
              }&per_page=250&view=30478&page=${i}`,
              {
                method: 'GET',
                headers: options.headers
              }
            )
              .then(response => response.json())
              .catch(err => reject(err));
            if (response) {
              response.products.map(product => {
                let updatedProduct = { ...product };
                product.properties.forEach(p => {
                  if (p.values.length === 0) {
                    return;
                  }
                  let updatedName = camelCase(
                    p.id.replace(/^\s+|[^\s\w]+|\s+$/g, '')
                  );

                  updatedProduct[updatedName] =
                    p.values.length > 1
                      ? p.values.map(value => value.id || value.name)
                      : p.values[0].id || p.values[0].name;
                });
                delete updatedProduct['properties'];
                updatedProducts.push(updatedProduct);
              });
            }
          }
        }
        const productProgress = (
          updatedProducts.length /
          product.meta.total_entries *
          100
        ).toFixed(2);
        const productProgressString = `${productProgress} % - of products built`;
        console.log(`${productProgressString}`);
        if (updatedProducts.length === products.meta.total_entries) {
          productList.push(updatedProducts);
          const progress = (
            productList.length /
            brandList.length *
            100
          ).toFixed(2);
          const string = `${progress} %  -  lists completed`;
          console.log(`${string}`);
        }
        await fs.outputJson(
          path.resolve(__dirname, `../dist/JSON/lists/${name}.json`),
          updatedProducts
        );
        if (productList.length === brandList.length) {
          resolve('success');
        }
      });
    }
  });
};

const runApi = async () => {
  const listRes = await listToJSON().catch(err => {
    console.log(err);
    process.exit(1);
  });
  if (listRes === 'success') {
    console.log('LISTS CREATED');
    process.exit(0);
  } else {
    console.log(listRes);
    process.exit(1);
  }
};

runApi();

// const fetchSheet = () => {
//   return new Promise(async (resolve, reject) => {
//     await connectToDatabase();
//     const storedData = await Sheet.find({});
//     if (storedData.length > 0) {
//       const storedSheet = storedData[0];
//       if (storedSheet.status === 'completed' && storedSheet.url !== null) {
//         const res = await fetch(storedSheet.url).then(res => res);
//         if (res.status === 403) {
//           await Sheet.findByIdAndRemove(storedSheet._id);
//           resolve('FILE HAS EXPIRED, REMOVING AND CREATING A NEW ONE');
//           return;
//         }
//         const xlsxFile = await fetch(storedSheet.url).then(res => res.buffer());
//         let workbook;
//         try {
//           workbook = XLSX.read(xlsxFile, { type: 'buffer' });
//         } catch (e) {
//           reject(e);
//         }
//         const sheet_name_list = workbook.SheetNames;
//         sheet_name_list.forEach(y => {
//           const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
//           let itemList = [];
//           sheet.forEach(async (item, i) => {
//             try {
//               await fs.outputJson(
//                 path.resolve(
//                   __dirname,
//                   `../dist/JSON/${item['Item Number']}.json`
//                 ),
//                 item
//               );
//               const data = await fs.readJson(
//                 path.resolve(
//                   __dirname,
//                   `../dist/JSON/${item['Item Number']}.json`
//                 )
//               );
//               itemList.push(data);
//             } catch (e) {
//               reject(e);
//             }
//             const progress = (itemList.length / sheet.length * 100).toFixed(2);
//             for (let i = 0; i <= 100; i += 25) {
//               if (i === Math.round(progress)) {
//                 const string = `${progress} %  -  sheet completed`;
//                 console.log(`${string}`);
//               }
//             }

//             if (sheet.length === itemList.length) {
//               await Sheet.findByIdAndRemove(storedSheet._id);
//               resolve(sheet);
//             }
//           });
//         });
//       } else {
//         resolve('SHEET CURRENTLY BUILDING');
//       }
//     } else if (storedData.length === 0) {
//       resolve('NO SHEETS IN DB');
//     }
//   });
// };
