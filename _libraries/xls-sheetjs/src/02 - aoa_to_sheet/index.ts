import XLSX from 'xlsx'

(() => {
  const rows = [
    ['name', 'vasya'],
    ['name', 'kostya']
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  XLSX.writeFile(workbook, "files/simple.xlsx", { compression: true });
})()

