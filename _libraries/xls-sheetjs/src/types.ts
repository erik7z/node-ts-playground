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


export type TRowStyleType = "tableRowOdd" | "tableRowEven"

export type THeaderImage = {
  type: "image"
  uniqueKey: "images"
}

export type THeaderProp = {
  type: "prop"
  uniqueKey: keyof IProductAttributes
}

export type THeaderAttribute = {
  type: "attribute"
  uniqueKey: string // stringified attribute_id
}

export type THeaderQR = {
  type: "qr"
  uniqueKey: "qrcode"
}

export type TTableHeader = {
  displayName: string,
  position: number,
  width: number,
} & (THeaderProp | THeaderAttribute | THeaderImage | THeaderQR)

