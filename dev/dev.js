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
    let updatedProducts = [];
    updatedList.forEach(async item => {
      const name = item.name
        .replace(/^\s+|[^\s\w]+|\s+$/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      const products = await fetch(
        `${options.baseUrl}/products?filter==list:${item.id}&per_page=250`,
        {
          method: 'GET',
          headers: options.headers
        }
      ).then(res => res.json());
      updatedProducts = updatedProducts.concat(products.lists);
      const productPages = Math.ceil(
        products.meta.total_entries / products.meta.per_page
      );
      if (productPages > 1) {
        for (i = products.meta.current_page + 1; i < productPages; i++) {
          const response = await fetch(`${options.url}&page=${i}`, {
            method: 'GET',
            headers: options.headers
          }).then(response => response.json());
          if (response) {
            updatedProducts = updatedProducts.concat(response.lists);
          }
        }
      }
      await fs.outputJson(
        path.resolve(__dirname, `../dist/JSON/lists/${name}.json`),
        updatedProducts
      );
    });
  }
};

listToJSON();
