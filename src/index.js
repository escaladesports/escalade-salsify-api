import config from '../config.json';
import path from 'path';
import XLSX from 'xlsx';
import fs from 'fs-extra';

const workbook = XLSX.readFile(path.resolve(__dirname, '../src/export.xlsx'));
const sheet_name_list = workbook.SheetNames;
sheet_name_list.forEach(async y => {
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
  await fs.outputJson(path.resolve(__dirname, `../dist/JSON/${y}.json`), sheet);
});