import React from "react"
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer"
import ReactPDF from "@react-pdf/renderer"
import PRODUCTS from "./_assets/products.json"
import _chunk from "lodash.chunk"
import { IAttributes, ICustomParametersAttributes, IProductAttributes, TRowStyleType, TTableHeader } from "./types"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF"
  },
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    padding: 10
  },
  tableContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#373d5d",
    borderWidth: "2px",
    flex: 1,
    marginTop: 0,
    padding: 0
  },
  tableRowHeader: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 40
  },
  tableColumnHeader: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#373d5d",
    flex: 1
  },
  tableColumn: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 1
  },
  tableRowOdd: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 80,
    borderBottom: "1px solid #6D769C",
    backgroundColor: "#E7EBF2",
    padding: "5px"
  },
  tableRowEven: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 80,
    borderBottom: "1px solid #6D769C",
    backgroundColor: "#FFFFFF",
    padding: "5px"
  },
  textItemHeader: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 11,
    flexWrap: "wrap"
  },
  textItem: {
    color: "#363E5C",
    fontSize: 10
  },
  image: {
    padding: "5px"
  }
})

const tableHeaders: readonly TTableHeader[] = [
  { type: "image", key: "images", displayName: "Image" },
  { type: "prop", key: "title", displayName: "SKU" },
  { type: "prop", key: "price", displayName: "Price" },
  { type: "attribute", key: "parameters", attributeId: 89118, displayName: "Product Type" },
  { type: "attribute", key: "parameters", attributeId: 79858, displayName: "Description" },
  { type: "attribute", key: "parameters", attributeId: 84488, displayName: "Detailed Title" },
  { type: "qr", key: "qrcode", displayName: "QR" }
] as const

type TExactTableHeaders = Readonly<Array<TTableHeader & {
  key: typeof tableHeaders[number]["key"],
}>>

type TRowContent = IProductAttributes & {
  [key in (typeof tableHeaders[number]["key"])]?: IProductAttributes[keyof IProductAttributes]
}

const productsList = PRODUCTS as unknown as IProductAttributes[]
const MAX_PRODUCTS = 12;

const TableRow = ({ styleKey, headers, rowContent }: { styleKey: TRowStyleType, headers: TExactTableHeaders, rowContent: TRowContent }) => {
  return (
    <View style={styles[styleKey]}>
      {headers.map((header, i) =>
        <View style={styles.tableColumn} key={`${rowContent.title}-${header.key}-${i}`}>
          {(() => {
            switch (header.type) {
              case "image":
                let src = "src/_assets/image.png"
                if (rowContent.images?.length) {
                  const img = rowContent.images.pop()
                  if (img) {
                    if (typeof img === "string") {
                      src = img
                    } else if ("file" in img && img.file) {
                      src = img.file.medium ?? src
                    } else if ("medium" in img && img.medium) {
                      src = img.medium
                    }
                  }
                }

                return <Image src={src} style={styles.image}/>
              case "prop":
                return <Text style={styles.textItem}>{rowContent[header.key]}</Text>
              case "attribute":
                const attribute: ICustomParametersAttributes | undefined = rowContent[header.key].find((a: IAttributes) => a.id === header.attributeId)
                if (attribute == null) {
                  return <Text style={styles.textItem}/>
                }
                return <Text style={styles.textItem}>{attribute.value}</Text>
              case "qr":
                return <Image src={"src/_assets/qr.png"} style={styles.image}/>
              default:
                return <Text style={styles.textItem}/>
            }
          })()}
        </View>
      )}
    </View>
  )
}

const TableHeader = ({ headers }: { headers: TExactTableHeaders }) => (
  <View style={styles.tableRowHeader}>
    {headers.map((col, i) =>
      <View style={styles.tableColumnHeader} key={`${col.key}-${i}`}>
        <Text style={styles.textItemHeader}>{col.displayName}</Text>
      </View>
    )}
  </View>
)


const OnePage = ({ headers, products }: { headers: TExactTableHeaders, products: IProductAttributes[] }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.container}>
      <View style={styles.tableContainer}>

        <TableHeader headers={headers}/>
        {products.map((product, i) => {
            return <TableRow
              styleKey={(i % 2 == 0) ? "tableRowEven" : "tableRowOdd"}
              headers={headers} key={product.title}
              rowContent={product}
            />
          }
        )}

      </View>
    </View>
  </Page>
)

const MyDocument = ({products, headers}: {products: IProductAttributes[], headers: TExactTableHeaders}) => {
  const pages = _chunk(products, MAX_PRODUCTS)
  return (
    <Document>
      {pages.map((pageProducts, i) =>
        <OnePage key={`item-${i.toString()}`} headers={headers} products={pageProducts}/>
      )}
    </Document>
  )
};

export async function renderPdf (destSrc: string, products: IProductAttributes[], tableHeaders: TExactTableHeaders ) {
  await ReactPDF.render(<MyDocument headers={tableHeaders} products={products}/>, destSrc)
}


// Generate example:
(async () => {
  await renderPdf(`tmp/example.pdf`, productsList, tableHeaders)
})()
