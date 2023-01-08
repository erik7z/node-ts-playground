import Handlebars from "handlebars"


const source = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      td {
        text-align: center;
        border-bottom: 1px solid black;
        font-size: 14px;
        color: #7c7f84;
        text-overflow: ellipsis;
        overflow: hidden;
        max-height: 52px;
        line-height: 1.8em;
      }

      tr:nth-child(odd) {
        background: #F0F8FF;
      }

      img {
        border-style: none;
      }

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        line-height: 1.2;
        max-height: 104px;
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;

      }

      th {
        background: #373d5d;
        font-size: 14px;
        color: white;
        font-weight: bold;
        border-bottom: 1px solid black;
        height: 48px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        border-style: hidden !important;
        table-layout: fixed
      }

      section {
        margin-top: 30px;
        border: 1px solid black;
        page-break-after: always;
      }

    </style>
  </head>
  <body>
  {{#each payload.rows as |rowsPage|}}
  <section>
    <table>
      <thead>
      <tr>
        {{#each ../payload.columns as |columnHeader|}}
        <th>{{columnHeader}}</th>
        {{/each}}
      </tr>
      </thead>
      <tbody>
      {{#each rowsPage as |row| }}
      <tr>
        {{#each row as |col|}}
          <td>
            {{~#ifEquals col.type "image"~}}
              <img src="{{{col.value}}}" width=75px height=75px>
            {{~/ifEquals~}}

            {{~#ifEquals col.type "code"~}}
              <code><pre>{{{col.value}}}</pre></code>
            {{~/ifEquals~}}

            {{~#ifEquals col.type "plain"~}}
              <p>{{{col.value}}}</p>
            {{~/ifEquals~}}
          </td>
        {{/each}}
      </tr>
      {{/each}}
      </tbody>
    </table>
  </section>
  {{/each}}
  </body>
</html>

`

Handlebars.registerHelper("ifEquals", function(arg1: string, arg2: string, options: any) {
  // @ts-ignore
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
})

const template = Handlebars.compile(source)

const payload = {
  "columns": [
    "Image",
    "SKU",
    "Price",
    "Product Type",
    "Description",
    "Detailed Title",
    "QR"
  ],
  "rows": [ // rows pages
    [ // rows
      [ // one row
        { type: "image", key: "images", value: "https://dev.static.cloud.picupmedia.com/gallery/2003/1656595492336-c777d3a66cec61bd95d6-163110606459830f3306af1051dc5b962darkestmedium.jpeg" },
        { type: "plain", key: "title", value: "MOC013B-21" },
        { type: "plain", key: "price", value: 1234 },
        { type: "plain", key: "type", value: null },
        { type: "plain", key: "description", value: null },
        { type: "plain", key: "detailedTitle", value: null },
        { type: "image", key: "qrcode", value: "https://dev.static.cloud.picupmedia.com/gallery/2003/1656595492336-c777d3a66cec61bd95d6-163110606459830f3306af1051dc5b962darkestmedium.jpeg" },
        { type: "code", key: "code", value: "HTML CODE" }
      ],
      [ // one product
        { type: "image", key: "images", value: "https://dev.static.cloud.picupmedia.com/gallery/2003/1656595492336-c777d3a66cec61bd95d6-163110606459830f3306af1051dc5b962darkestmedium.jpeg" },
        { type: "plain", key: "title", value: "MOC013B-21" },
        { type: "plain", key: "price", value: 1234 },
        { type: "plain", key: "type", value: null },
        { type: "plain", key: "description", value: null },
        { type: "plain", key: "detailedTitle", value: null },
        { type: "image", key: "qrcode", value: "https://dev.static.cloud.picupmedia.com/gallery/2003/1656595492336-c777d3a66cec61bd95d6-163110606459830f3306af1051dc5b962darkestmedium.jpeg" },
        { type: "code", key: "code", value: "HTML CODE" }
      ]
    ]
  ]
}

const result = template({ payload })

console.log(result)
