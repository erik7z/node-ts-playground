import React from "react"
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer"
import ReactPDF from "@react-pdf/renderer"
import PRODUCTS from "./_assets/products.json"
import _chunk from "lodash.chunk"

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

// PRODUCTS TYPING --->>>
export enum SYNC_STATUS {
  started = "started",
  in_progress = "in_progress",
  reseted = "reseted",
  pending = "pending",
  syncing = "syncing",
  completed = "completed",
  canceled = "canceled",
  aborting = "aborting",
  error = "error",
}

export enum EMediaType {
  image = "image",
  video = "video",
  video360 = "video360",
  blink = "blink",
}

export enum ResourceTypes {
  PRODUCT = "product",
  MEDIA = "media",
  MEDIA_COLLECTION = "media_collection",
  CATALOG = "catalog",
}

export enum EAttributeTypes {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  MULTISELECT = "multiselect",
}

export enum EAttributeKinds {
  DEFAULT = "default",
  CUSTOM = "custom",
}

export enum ESyncIntegrations {
  rapnet = "rapnet",
  shopify = "shopify",
  chotaifook = "chotaifook",
}

export interface IFileTypes {
  small?: string;
  medium?: string;
  compressed?: string;
  original: string;
  createdAt?: Date;
  filename?: string;
  interactive?: string;
  preview?: string;
  gif?: string;
  size?: number;
}

export interface IMediaAttributes {
  id?: number;
  type?: EMediaType | string;
  user_id?: number;
  size?: number;
  file?: IFileTypes;
  arData?: IARData;
  metaData?: IMetadata;
  guid?: string;
  products?: IProductAttributes[];
  links?: ILinkAttributes;
  remoteId?: string;
  createdAt?: Date;
  views?: number;
  shares?: number;
  whatsappClicks?: number;
  tryMeOnClicks?: number;
  count?: number;
}

export interface ILinkAttributes {
  password?: string | null;
  salt?: string | null;
  resourceID: number;
  id?: number;
  resourceType: ResourceTypes;
  uuid: string;
  createdAt?: Date;
}

export interface IARData {
  blinkFile?: IFileTypes;
  cropFile?: IFileTypes;
  arHeight?: number;
  arWidth?: number;
  arHeightUnit?: string;
  arWidthUnit?: string;
  productTypeId?: number;
  productType?: string;
}

export interface IMetadata {
  template?: {
    positioning?: {
      width: number,
      height: number,
      x: number,
      y: number
    }
  }
}

export interface IMediaIds {
  file: IFileTypes;
  id: number;
}

export interface ICustomParametersAttributes {
  id?: number;
  product_id: number;
  attribute_id: number;
  order?: number;
  value: any;
}

export interface IAttributes {
  id?: number;
  product_id?: number;
  media_id?: number;
  name?: string;
  order_gallery?: number;
  required?: boolean | null;
  prefix?: string;
  suffix?: string;
  values?: | string[] | null | { [key: string]: string; };
  user_id?: number;
  type?: EAttributeTypes;
  kind?: EAttributeKinds;
  order?: number;
  description?: string;
  displayName?: string;
  integratedTo?: ESyncIntegrations | null;
  isHidden?: boolean | null;
  isPublic?: boolean | null;
  suffixValues?: | string[] | null | { [key: string]: string; };
  createdAt?: Date;
}

export interface IProductAttributes {
  user_id?: number;
  title?: string;
  currency?: string;
  name?: string;
  detailedTitle?: string;
  description?: string;
  caratWeight?: number;
  quantity?: number;
  link?: any;
  links?: any;
  creator?: string;
  images?: IFileTypes[] | IMediaAttributes[] | string[];
  parameters?: IAttributes & ICustomParametersAttributes[];
  newImages?: IFileTypes[] | string[];
  price?: number;
  isHidden?: boolean;
  media_ids?: IMediaIds[] | null;
  discount?: number;
  productType?: string;
  stoneType?: string;
  category?: string;
  subcategory?: string;
  sku?: number;
  parameterIDS?: number[];
  remoteId?: number | string;
  lastSync?: string;
  syncStatus?: SYNC_STATUS;
  syncMessage?: {
    type?: string;
    shortMessage?: string,
    detailedMessage?: string,
    filename?: string,
  };
  views?: number;
  shares?: number;
  whatsappClicks?: number;
  tryMeOnClicks?: number;
  ARViewTime?: number;
  shop_id?: number
}

// <<<---


type TRowStyleType = "tableRowOdd" | "tableRowEven"

type THeaderImage = {
  type: "image"
  key: "images"
}

type THeaderProp = {
  type: "prop"
  key: keyof IProductAttributes
}

type THeaderAttribute = {
  type: "attribute"
  key: "parameters"
  attributeId: number
}

type THeaderQR = {
  type: "qr"
  key: "qrcode"
}

type TTableHeader = {
  displayName: string,
} & (THeaderProp | THeaderAttribute | THeaderImage | THeaderQR)

type TExactTableHeaders = Readonly<Array<TTableHeader & {
  key: typeof tableHeaders[number]["key"],
}>>

type TRowContent = IProductAttributes & {
  [key in (typeof tableHeaders[number]["key"])]?: IProductAttributes[keyof IProductAttributes]
}

const tableHeaders: readonly TTableHeader[] = [
  { type: "image", key: "images", displayName: "Image" },
  { type: "prop", key: "title", displayName: "SKU" },
  { type: "prop", key: "price", displayName: "Price" },
  { type: "attribute", key: "parameters", attributeId: 89118, displayName: "Product Type" },
  { type: "attribute", key: "parameters", attributeId: 79858, displayName: "Description" },
  { type: "attribute", key: "parameters", attributeId: 84488, displayName: "Detailed Title" },
  { type: "qr", key: "qrcode", displayName: "QR" }
] as const

const products = PRODUCTS as unknown as IProductAttributes[]

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


const MyDocument = () => {

  const pages = _chunk(products, 12)

  return (
    <Document>
      {pages.map((pageProducts, i) =>
        <OnePage key={`item-${i.toString()}`} headers={tableHeaders} products={pageProducts}/>
      )}
    </Document>
  )
};

(async () => {
  await ReactPDF.render(<MyDocument/>, `tmp/example.pdf`)
})()
