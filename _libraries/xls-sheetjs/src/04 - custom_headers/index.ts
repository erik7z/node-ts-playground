import XLSX from 'xlsx'

(() => {
  const rows = [
    {service_id: 'ID Сервиса', service_name: 'Название сервиса', status: "Статус", duplicates: "Дубликаты", error: "Описание ошибки", fields_updated: "Изменения"},
    {service_id: '123213', service_name: 'Batareykin', status: "cool", duplicates: "nope", error: "very bad", fields_updated: "field1,field2"},
    {service_id: 'wew32324', service_name: 'Batareykin1', status: "cool1", duplicates: "nope1", error: "very bad1", fields_updated: "field11,field21"},
  ]
  const options = {
    header: ["service_id", "service_name", "status", "duplicates", "error", "fields_updated"],
    skipHeader:true
  }

  const worksheet = XLSX.utils.json_to_sheet(rows, options);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  XLSX.writeFile(workbook, "files/simple.xlsx", { compression: true });
})()

