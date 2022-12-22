import XLSX from "xlsx"
import { Readable } from "stream"
import { IProductAttributes, TTableHeader } from "./types"
const PRODUCTS = require("./_assets/products.json")


const tableHeaders: readonly TTableHeader[] = [
  { type: "image", key: "images", displayName: "Image" },
  { type: "prop", key: "title", displayName: "SKU" },
  { type: "prop", key: "price", displayName: "Price" },
  { type: "attribute", key: "parameters", attributeId: 89118, displayName: "Product Type" },
  { type: "attribute", key: "parameters", attributeId: 79858, displayName: "Description" },
  { type: "attribute", key: "parameters", attributeId: 84488, displayName: "Detailed Title" },
  { type: "qr", key: "qrcode", displayName: "QR" }
] as const

const colsOrder: TTableHeader["key"][] = [
  "title", "price", "parameters", "images", "qrcode"
]

type TExactTableHeaders = Readonly<Array<TTableHeader & {
  key: typeof tableHeaders[number]["key"],
}>>

type TRowContent = IProductAttributes & {
  [key in (typeof tableHeaders[number]["key"])]?: IProductAttributes[keyof IProductAttributes]
}

type THeadersMapping = { [key in TTableHeader["key"]]: TTableHeader["displayName"] }

type TProductItem = { [key in TTableHeader["key"]]: string }

const productsList = PRODUCTS as unknown as IProductAttributes[]


const mapProductRow = (headers: TExactTableHeaders, rowContent: TRowContent): TProductItem => {
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

        acc[header.key] = src
        break
      }
      case "prop": {
        acc[header.key] = rowContent[header.key] ?? ""
        break
      }
      case "attribute": {
        const attribute = rowContent[header.key].find((a: { id: number }) => a.id === header.attributeId)
        acc[String(header.attributeId) as keyof TProductItem] = attribute?.value ?? ""
        break
      }
    }
    return acc
  }, {} as TProductItem)
}


// -- stream to xls file
(async () => {

  const sortMapping: any = {}
  const headersMapping: THeadersMapping = tableHeaders.reduce((acc, header) => {
    if (header.type === "attribute") {
      acc[header.attributeId] = header.displayName
      sortMapping[header.attributeId] = header.key
    } else {
      acc[header.key] = header.displayName
      sortMapping[header.key] = header.key
    }
    return acc
  }, {} as any)

  const sortedHeaders = Object.keys(headersMapping).sort((a, b) => colsOrder.indexOf(sortMapping[a]) - colsOrder.indexOf(sortMapping[b]))

  const worksheet = XLSX.utils.json_to_sheet([headersMapping], { header: sortedHeaders, skipHeader: true })

  worksheet['!cols'] = [{wch:10}, {wch:60}, {wch:8}, {wch:60}, {wch:15}, {wch:80},{wch:80},]

  XLSX.stream.set_readable(Readable)

  let rowNumber = 2
  for (let product of productsList) {
    const productRow = mapProductRow(tableHeaders, product)
    const cellRef = XLSX.utils.encode_cell({ c: 0, r: rowNumber })
    if (!worksheet[cellRef]) XLSX.utils.sheet_add_json(worksheet, [productRow], { origin: cellRef, skipHeader: true })
    rowNumber++
    console.log(rowNumber)
  }

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, worksheet, "exported_products")

  const filename = "_tmp/out.xlsx"
  XLSX.writeFile(wb, filename, { bookType: "xlsx", type: "binary", compression: true })
})()
