import fetch from 'node-fetch'
import XLSX from 'xlsx'

async function run() {
  const url = "https://sheetjs.com/data/executive.json"
  const raw_data = await (await fetch(url)).json()

  const prez = raw_data.filter((row: { terms: any[]; }) => row.terms.some(term => term.type === "prez"));

  const rows = prez.map((row: { name: { first: string; last: string; }; bio: { birthday: any; }; }) => ({
    name: row.name.first + " " + row.name.last,
    birthday: row.bio.birthday
  }));


  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  XLSX.writeFile(workbook, "files/Presidents.xlsx", { compression: true });


  console.log(rows)
}

run();
