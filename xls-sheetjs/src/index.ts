import XLSX from "xlsx"
import { Readable } from "stream"
import { IProductAttributes, TTableHeader } from "./types"
const PRODUCTS = require("./_assets/products.json")

const DEFAULT_COLUMN_WIDTH = 50;

type TExactTableHeaders = Readonly<Array<TTableHeader & {
  uniqueKey: TTableHeader[][number]["uniqueKey"],
}>>

type TRowContent = IProductAttributes & {
  [key in (TTableHeader[][number]["uniqueKey"])]?: IProductAttributes[keyof IProductAttributes]
}

type THeadersMapping = { [key in TTableHeader["uniqueKey"]]: TTableHeader["displayName"] }

type TProductItem = { [key in TTableHeader["uniqueKey"]]: string }

const productsList = PRODUCTS as unknown as IProductAttributes[]


const tableHeaders: readonly TTableHeader[] = [
  { type: "image", uniqueKey: "images", displayName: "Image", position: 5, width: 50 },
  { type: "prop", uniqueKey: "title", displayName: "SKU", position: 0, width: 100 },
  { type: "prop", uniqueKey: "price", displayName: "Price", position: 1, width: 50 },
  { type: "attribute", uniqueKey: "89118", displayName: "Product Type", position: 2, width: 50 },
  { type: "attribute", uniqueKey: "79858", displayName: "Description", position: 3, width: 50 },
  { type: "attribute", uniqueKey: "84488", displayName: "Detailed Title", position: 4, width: 50 },
  { type: "qr", uniqueKey: "qrcode", displayName: "QR", position: 6, width: 50 }
] as const

const renderTableRow = (headers: TExactTableHeaders, rowContent: TRowContent): TProductItem => {
  return headers.reduce((acc, header) => {
    switch (header.type) {
      case "image": {
        let src = ""
        if (rowContent.images?.length) {
          const img = rowContent.images.pop()
          if (img) {
            if (typeof img === "string") {
              src = img
            } else if ("file" in img && img.file) {
              src = img.file.small ?? src
            } else if ("small" in img && img.small) {
              src = img.small
            }
          }
        }

        acc[header.uniqueKey] = src
        break
      }
      case "prop": {
        acc[header.uniqueKey] = rowContent[header.uniqueKey] ?? ""
        break
      }
      case "attribute": {
        let value = ""
        const parameters = rowContent["parameters"]
        if(parameters && parameters.length) {
          const attr = parameters.find((p) => String(p.id) === header.uniqueKey)
          value = attr?.value ?? ""
        }
        acc[String(header.uniqueKey) as keyof TProductItem] = value
        break
      }
    }
    return acc
  }, {} as TProductItem)
}


// -- stream to xls file
(async () => {


  // xlsx requires to have mapping {header_unique_id: header_display_name} to properly fill fields with same header names
  const headersMapping: THeadersMapping = tableHeaders.reduce((acc, header) => {
    acc[header.uniqueKey] = header.displayName
    return acc
  }, {} as any)

  // xlsx requires array of headers to be sorted according to position
  const headersSorting = Object.keys(headersMapping).sort((aKey, bKey) => {
    const hOptsA = tableHeaders.find(th => th.uniqueKey === aKey)
    const hOptsB = tableHeaders.find(th => th.uniqueKey === bKey)
    if(hOptsA != null && hOptsB != null) {
      return hOptsA.position - hOptsB.position
    }
    return 0
  })

  // creating worksheet:
  const worksheet = XLSX.utils.json_to_sheet([headersMapping], { header: headersSorting, skipHeader: true })

  // setting column widths:
  worksheet["!cols"] = headersSorting.map((hKey) => {
    const hOpts = tableHeaders.find((h) => h.uniqueKey === hKey)
    return {
      wch: hOpts?.width || DEFAULT_COLUMN_WIDTH
    }
  })

  XLSX.stream.set_readable(Readable)

  // adding data to worksheet, starting from second row
  productsList.forEach((product, prevRowNum) => {
    const initialRowsCount = 1
    const productRow = renderTableRow(tableHeaders, product)
    const cellRef = XLSX.utils.encode_cell({ c: 0, r: prevRowNum + initialRowsCount })
    if (!worksheet[cellRef]) XLSX.utils.sheet_add_json(worksheet, [productRow], { origin: cellRef, skipHeader: true })
  })

  // creating workbook and adding worksheet
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, worksheet, "exported_products")

  const filename = "_tmp/out.xlsx"
  XLSX.writeFile(wb, filename, { bookType: "xlsx", type: "binary", compression: true })
})()
