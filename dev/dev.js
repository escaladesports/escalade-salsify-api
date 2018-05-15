require('envdotjs').load();
import config from '../config.json';
import path from 'path';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import fetch from 'isomorphic-fetch';
import axios from 'axios';
import { connectToDatabase } from '../utils/db';
import Sheet from '../models/Sheet';

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

const fetchSheet = async () => {
  await connectToDatabase();
  const storedData = await Sheet.find({});
  if (storedData.length > 0) {
    const storedSheet = storedData[0];
    if (storedSheet.status === 'completed' && storedSheet.url !== null) {
      const xlsxFile = await fetch(storedSheet.url).then(res => res.buffer());
      sheetToJSON(xlsxFile, storedSheet);
    }
  }
};

const sheetToJSON = async (xlsxFile, storedSheet) => {
  const workbook = XLSX.read(xlsxFile, { type: 'buffer' });
  const sheet_name_list = workbook.SheetNames;
  sheet_name_list.forEach(y => {
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
    sheet.map(async item => {
      console.log(item);
      try {
        await fs.outputJson(
          path.resolve(__dirname, `../dist/JSON/${item['Item Number']}.json`),
          item
        );
        await Sheet.findByIdAndRemove(storedSheet._id);
        process.exit(0);
      } catch (e) {
        console.log(e);
        process.exit(1);
      }
    });
  });
};

const listToJSON = async () => {
  let updatedList = [];
  const res = await fetch(options.url, {
    method: 'GET',
    headers: options.headers
  }).then(res => res.json());

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
        }).then(response => response.json());
        if (response) {
          updatedList = updatedList.concat(response.lists);
        }
      }
    }
  }
  if (updatedList.length > 0) {
    updatedList.forEach(async item => {
      const name = item.name
        .replace(/^\s+|[^\s\w]+|\s+$/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      const products = await fetch(
        `${options.baseUrl}/products?filter==list:${item.id}`,
        {
          method: 'GET',
          headers: options.headers
        }
      ).then(res => res.json());
      await fs.outputJson(
        path.resolve(__dirname, `../dist/JSON/lists/${name}.json`),
        products
      );
    });
  }
};

listToJSON();
