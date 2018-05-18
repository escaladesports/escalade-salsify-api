require('envdotjs').load();
import config from '../config.json';
import path from 'path';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import fetch from 'isomorphic-fetch';
import axios from 'axios';
import { connectToDatabase } from '../utils/db';
import Sheet from '../models/Sheet';

const listToJSON = async jsonSheet => {
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
    if (!Array.isArray(jsonSheet)) {
      reject('Wrong Sheet Format');
      return;
    }
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
      updatedList.forEach(async (list, index) => {
        let updatedProducts = [];
        const name = list.name
          .replace(/^\s+|[^\s\w]+|\s+$/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase();
        const products = await fetch(
          `${options.baseUrl}/products?filter==list:${list.id}&per_page=250`,
          {
            method: 'GET',
            headers: options.headers
          }
        )
          .then(res => res.json())
          .catch(err => reject(err));

        products.products.map(product =>
          updatedProducts.push(
            jsonSheet.find(
              item =>
                item['Item Number'].toLowerCase() === product.id.toLowerCase()
            ) || product
          )
        );

        const productPages = Math.ceil(
          products.meta.total_entries / products.meta.per_page
        );

        if (productPages > 1) {
          for (let i = products.meta.current_page + 1; i <= productPages; i++) {
            const response = await fetch(
              `${options.baseUrl}/products?filter==list:${
                list.id
              }&per_page=250&page=${i}`,
              {
                method: 'GET',
                headers: options.headers
              }
            )
              .then(response => response.json())
              .catch(err => reject(err));
            if (response) {
              response.products.map(product =>
                updatedProducts.push(
                  jsonSheet.find(
                    item =>
                      item['Item Number'].toLowerCase() ===
                      product.id.toLowerCase()
                  ) || product
                )
              );
            }
          }
        }
        await fs.outputJson(
          path.resolve(__dirname, `../dist/JSON/lists/${name}.json`),
          updatedProducts
        );
        if (updatedProducts.length === products.meta.total_entries) {
          productList.push(updatedProducts);
        }
        const string = `${(
          productList.length /
          updatedList.length *
          100
        ).toFixed(2)} %  -  lists completed`;
        process.stdout.write(`${string}\r`);

        if (productList.length === updatedList.length) {
          resolve('success');
        }
      });
    }
  });
};

const fetchSheet = async () => {
  return new Promise(async (resolve, reject) => {
    await connectToDatabase();
    const storedData = await Sheet.find({});
    if (storedData.length > 0) {
      const storedSheet = storedData[0];
      if (storedSheet.status === 'completed' && storedSheet.url !== null) {
        const res = await fetch(storedSheet.url).then(res => res);
        if (res.status === 403) {
          await Sheet.findByIdAndRemove(storedSheet._id);
          resolve('FILE HAS EXPIRED, REMOVING AND CREATING A NEW ONE');
          return;
        }
        const xlsxFile = await fetch(storedSheet.url).then(res => res.buffer());
        let workbook;
        try {
          workbook = XLSX.read(xlsxFile, { type: 'buffer' });
        } catch (e) {
          reject(e);
        }
        const sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(y => {
          const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
          let itemList = [];
          let sheetProgress = 0;
          sheet.forEach(async (item, i) => {
            try {
              await fs.outputJson(
                path.resolve(
                  __dirname,
                  `../dist/JSON/${item['Item Number']}.json`
                ),
                item
              );
              const data = await fs.readJson(
                path.resolve(
                  __dirname,
                  `../dist/JSON/${item['Item Number']}.json`
                )
              );
              itemList.push(data);
            } catch (e) {
              reject(e);
            }
            sheetProgress = (itemList.length / sheet.length * 100).toFixed(2);
            // const string = `${(itemList.length / sheet.length * 100).toFixed(
            //   2
            // )} %  -  sheet completed`;
            // process.stdout.write(`${string}\r`);
            if (sheet.length === itemList.length) {
              await Sheet.findByIdAndRemove(storedSheet._id);
              resolve(sheet);
            }
          });
          if (sheetProgress >= 25 && sheetProgress <= 26) {
            console.log(sheetProgress);
          }
        });
      } else {
        resolve('SHEET CURRENTLY BUILDING');
      }
    } else if (storedData.length === 0) {
      resolve('NO SHEETS IN DB');
    }
  });
};

const runApi = async () => {
  const sheetRes = await fetchSheet().catch(err => {
    console.log(err);
    process.exit(1);
  });
  if (Array.isArray(sheetRes)) {
    console.log('SHEET UPLOADED TO SERVER AND REMOVED FROM DB');
    const listRes = await listToJSON(sheetRes).catch(err => {
      console.log(err);
      process.exit(1);
    });
    if (listRes === 'success') {
      console.log('LISTS CREATED');
      process.exit(0);
    }
  } else {
    console.log(sheetRes);
    process.exit(0);
  }
};

runApi();
