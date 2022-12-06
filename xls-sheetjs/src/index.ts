import XLSX, { Sheet2CSVOpts, WorkSheet, writeFileAsync } from 'xlsx'
import { Readable } from 'stream';
import * as fs from 'fs';

// // -- standard streaming to csv
// (() => {
//   const rows = [
//     {name: 'Vasya', surname: 'Batareykin'},
//     {name: 'Petya', surname: 'Kryshkin'}
//   ]
//
//   XLSX.stream.set_readable(Readable);
//
//   const worksheet = XLSX.utils.json_to_sheet(rows);
//
//   const stream = XLSX.stream.to_csv(worksheet);
//
//   stream.pipe(fs.createWriteStream("files/out.csv"));
// })()
//

// // -- creating custom stream
// function sheet_to_csv_cb(ws: WorkSheet, cb: Function, opts: Sheet2CSVOpts = {}, batch = 1000) {
//   XLSX.stream.set_readable(() => ({
//     __done: false,
//     // this function will be assigned by the SheetJS stream methods
//     _read: function() { this.__done = true; },
//     // this function is called by the stream methods
//     push: function(d: any) {
//       if (!this.__done) cb(d);
//       if (d == null) this.__done = true;
//     },
//     resume: function pump() {
//       for (var i = 0; i < batch && !this.__done; ++i) this._read();
//       if (!this.__done) setTimeout(pump.bind(this), 0);
//     }
//   }));
//   return XLSX.stream.to_csv(ws, opts);
// }
//
//
// (() => {
//   const rows = [
//     { name: 'Vasya', surname: 'Batareykin' },
//     { name: 'Petya', surname: 'Kryshkin' }
//   ]
//
//   XLSX.stream.set_readable(Readable);
//
//   const worksheet = XLSX.utils.json_to_sheet(rows);
//
//   const strm = sheet_to_csv_cb(worksheet, (csv: any)=>{
//     if(csv != null) {
//       console.log(csv);
//     }
//   });
//   strm.resume();
// })()

// // -- adding rows as arrays of arrays
// (() => {
//   const rows = [
//     { name: 'Vasya', surname: 'Batareykin' },
//     { name: 'Petya', surname: 'Kryshkin' }
//   ]
//
//   XLSX.stream.set_readable(Readable);
//
//   const worksheet = XLSX.utils.json_to_sheet(rows);
//
//
//   const cellRef = XLSX.utils.encode_cell({c: 0, r: 3});
//   const cell = worksheet[cellRef];
//
//   if (cell) {
//     // update existing cell
//     cell.v = 'YourValue';
//   } else {
//     // add new cell
//     XLSX.utils.sheet_add_aoa(worksheet, [['Grisha', 'Kukushkin']], {origin: cellRef});
//   }
//
//   // XLSX.utils.sheet_add_json(worksheet, [{ name: 'Grisha', surname: 'Kukushkin' }, { name: 'Misha', surname: 'Mulkin' }])
//   // XLSX.utils.sheet_add_json(worksheet, [{ name: 'Grisha', surname: 'Kukushkin' }, { name: 'Misha', surname: 'Mulkin' }])
//
//     const stream = XLSX.stream.to_csv(worksheet);
//     stream.pipe(fs.createWriteStream("files/out.csv"));
// })()

// -- create large file with 50k+ records with dinamically adding rows
// (async () => {
//
//   const headersMapping = { service_id: 'ID Сервиса', service_name: 'Название сервиса', status: 'Статус', duplicates: 'Дубликаты', error: 'Описание ошибки', fields_updated: 'Изменения' }
//   const oneRow = {
//     service_id: 2,
//     service_name: 'Р‘РѕСЏСЂРєР°РІРѕРґРѕРєР°РЅР°Р» РљРџ',
//     status: 'DUPLICATE',
//     duplicates: `[ { "active": true, "account": "", "service_id": 40552, "receiver_id": 1576, "service_name": "Бояркаводоканал КП тест" } ]`,
//     error: 'Описание ошибки',
//     fields_updated: `{ "fields": { "created": [], "deleted": [], "updated": [ { "companyID": { "newValues": { "name_en": "companyID", "group_alias": "" }, "oldValues": { "name_en": "" } } }, { "serviceID": { "newValues": { "name_en": "serviceID", "group_alias": "" }, "oldValues": { "name_en": "" } } }, { "LS": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "COMPANY_OKPO": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "FIO": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "SUM": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "PHONE": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "COUNTERS": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "ADDRESS": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "COMPANY": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "ACCOUNT": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "DEST": { "newValues": { "group_alias": "" }, "oldValues": {} } } ] }, "service": { "id": 27997, "mfo": "", "icon": "data:image/png;base64,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", "name": "Р‘РѕСЏСЂРєР°РІРѕРґРѕРєР°РЅР°Р» РљРџ", "okpo": "30687118", "active": false, "period": 0, "account": "", "subsidy": false, "synonyms": [ "30687118", "UA933226690000026002300839187" ], "amount_max": 399999.99, "amount_min": 2.02, "service_id": 48, "destination": "", "kass_symbol": "5", "payment_ttd": 0, "receiver_id": 1576, "account_name": "privat", "counter_type": "basic", "name_visible": true, "support_debt": false, "use_two_step": false, "payments_type": "next_day_by_receiver", "period_active": [ 0, 0 ], "process_delay": 0, "payments_count": 0, "create_template": true, "registry_period": "next_bank_day", "transfer_method": "get.B2.08", "show_cash_symbol": false, "masterpass_enabled": true, "destination_visible": false, "consolidation_method": "get.DP.Payment.PA00068", "destination_editable": false, "receiver_destination": "{{destination}}", "registry_item_active": false, "consolidation_account": "2902915173", "commission_destination": "Назначение на комиссию", "template_show_field_id": 0, "show_mobile_phone_field": false, "account_accrued_expenses": "0", "account_commission_accrual": "0", "destination_driver_rewrite": false, "transaction_status_conducted": false }, "locations": [], "duplicates": [ { "active": true, "account": "", "service_id": 40552, "receiver_id": 1576, "service_name": "Бояркаводоканал КП тест" } ], "active_status": "SHOULD_BE_ACTIVATED" }`
//   }
//   const rows = [
//     headersMapping,
//     oneRow
//   ]
//
//   const worksheet = XLSX.utils.json_to_sheet(rows, { header: Object.keys(headersMapping), skipHeader: true })
//
//   XLSX.stream.set_readable(Readable);
//
//   let currentRow = 2
//   for (let i of Array.from({length: 30_000})) {
//     const cellRef = XLSX.utils.encode_cell({c: 0, r: currentRow});
//     if (!worksheet[cellRef]) XLSX.utils.sheet_add_json(worksheet, [
//       {...oneRow, service_id: currentRow}
//     ], {origin: cellRef, skipHeader: true});
//     currentRow++
//     console.log(currentRow)
//   }
//
//
//   const stream = XLSX.stream.to_csv(worksheet);
//   stream.pipe(fs.createWriteStream("files/out.csv"));
// })()



// // -- stream to xls file
// (async () => {
//
//   const headersMapping = { service_id: 'ID Сервиса', service_name: 'Название сервиса', status: 'Статус', duplicates: 'Дубликаты', error: 'Описание ошибки', fields_updated: 'Изменения' }
//   const oneRow = {
//     service_id: 2,
//     service_name: 'Р‘РѕСЏСЂРєР°РІРѕРґРѕРєР°РЅР°Р» РљРџ',
//     status: 'DUPLICATE',
//     duplicates: `[ { "active": true, "account": "", "service_id": 40552, "receiver_id": 1576, "service_name": "Бояркаводоканал КП тест" } ]`,
//     error: 'Описание ошибки',
//     fields_updated: `{ "fields": { "created": [], "deleted": [], "updated": [ { "companyID": { "newValues": { "name_en": "companyID", "group_alias": "" }, "oldValues": { "name_en": "" } } }, { "serviceID": { "newValues": { "name_en": "serviceID", "group_alias": "" }, "oldValues": { "name_en": "" } } }, { "LS": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "COMPANY_OKPO": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "FIO": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "SUM": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "PHONE": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "COUNTERS": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "ADDRESS": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "COMPANY": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "ACCOUNT": { "newValues": { "group_alias": "" }, "oldValues": {} } }, { "DEST": { "newValues": { "group_alias": "" }, "oldValues": {} } } ] }, "service": { "id": 27997, "mfo": "", "icon": "data:image/png;base64,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", "name": "Р‘РѕСЏСЂРєР°РІРѕРґРѕРєР°РЅР°Р» РљРџ", "okpo": "30687118", "active": false, "period": 0, "account": "", "subsidy": false, "synonyms": [ "30687118", "UA933226690000026002300839187" ], "amount_max": 399999.99, "amount_min": 2.02, "service_id": 48, "destination": "", "kass_symbol": "5", "payment_ttd": 0, "receiver_id": 1576, "account_name": "privat", "counter_type": "basic", "name_visible": true, "support_debt": false, "use_two_step": false, "payments_type": "next_day_by_receiver", "period_active": [ 0, 0 ], "process_delay": 0, "payments_count": 0, "create_template": true, "registry_period": "next_bank_day", "transfer_method": "get.B2.08", "show_cash_symbol": false, "masterpass_enabled": true, "destination_visible": false, "consolidation_method": "get.DP.Payment.PA00068", "destination_editable": false, "receiver_destination": "{{destination}}", "registry_item_active": false, "consolidation_account": "2902915173", "commission_destination": "Назначение на комиссию", "template_show_field_id": 0, "show_mobile_phone_field": false, "account_accrued_expenses": "0", "account_commission_accrual": "0", "destination_driver_rewrite": false, "transaction_status_conducted": false }, "locations": [], "duplicates": [ { "active": true, "account": "", "service_id": 40552, "receiver_id": 1576, "service_name": "Бояркаводоканал КП тест" } ], "active_status": "SHOULD_BE_ACTIVATED" }`
//   }
//   const rows = [
//     headersMapping,
//     oneRow
//   ]
//
//   const worksheet = XLSX.utils.json_to_sheet(rows, { header: Object.keys(headersMapping), skipHeader: true })
//
//   XLSX.stream.set_readable(Readable);
//
//   let currentRow = 2
//   for (let i of Array.from({length: 50_000})) {
//     const cellRef = XLSX.utils.encode_cell({c: 0, r: currentRow});
//     if (!worksheet[cellRef]) XLSX.utils.sheet_add_json(worksheet, [
//       {...oneRow, service_id: currentRow}
//     ], {origin: cellRef, skipHeader: true});
//     currentRow++
//     console.log(currentRow)
//   }
//
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, worksheet, 'PRIVAT');
//
//   const filename = "files/out.xlsx";
//   XLSX.writeFile(wb, filename,  {bookType: 'xlsx', type: 'binary', compression: true});
// })()
