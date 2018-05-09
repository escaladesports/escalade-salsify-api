import config from '../config.json';
import path from 'path';
import XLSX from 'xlsx';
import fs from 'fs-extra';
import fetch from 'isomorphic-fetch';
import axios from 'axios';
import { connectToDatabase } from '../utils/db';
import Sheet from '../models/Sheet';

const fetchSheet = async () => {
  await connectToDatabase();
  const storedData = await Sheet.find({});
  if (storedData.length > 0) {
    const storedSheet = storedData[0];
    if (storedSheet.status === 'completed' && storedSheet.url !== null) {
      const xlsxFile = await fetch(storedSheet.url).then(res => res.buffer());
      sheetToJSON(xlsxFile, storedSheet);
    } else {
      console.log('SHEET CURRENTLY BUILDING');
      process.exit(0);
    }
  } else if (storedData.length === 0) {
    await fs.mkdir(path.resolve(__dirname, `../dist/`));
    console.log('NO SHEETS IN DB');
    process.exit(0);
  }
};

const sheetToJSON = async (xlsxFile, storedSheet) => {
  let workbook;
  try {
    workbook = XLSX.read(xlsxFile, { type: 'buffer' });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  const sheet_name_list = workbook.SheetNames;
  sheet_name_list.forEach(y => {
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
    sheet.map(async item => {
      try {
        await fs.outputJson(
          path.resolve(__dirname, `../dist/JSON/${item['Item Number']}.json`),
          item
        );
        await Sheet.findByIdAndRemove(storedSheet._id);
        console.log('SHEET UPLOADED TO SERVER AND REMOVED FROM DB');
        process.exit(0);
      } catch (e) {
        console.log(e);
        process.exit(1);
      }
    });
  });
};

fetchSheet();
