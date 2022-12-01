import XLSX from 'xlsx'

(() => {
  const rows = [
    {name: 'Vasya', surname: 'Batareykin'},
    {name: 'Petya', surname: 'Kryshkin'}
  ]

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  XLSX.writeFile(workbook, "files/simple.xlsx", { compression: true });
})()

