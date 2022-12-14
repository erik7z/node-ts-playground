import React, { Component } from "react"
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"
import ReactPDF from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4"
  },
  gridContainer: {
    width: 220
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  cellStyle: {
    flex: 1,
    margin: 10
  }
})

// @ts-ignore
function Row({ column }) {
  return (
    <View style={styles.rowStyle}>
      {column.map((data: any, i: number) => (
        <Cell data={data} key={`row-${i}`}/>
      ))}
    </View>
  )
}

// @ts-ignore
function Cell({ data }) {
  return (
    <View style={styles.cellStyle}>
      <Text>{data}</Text>
    </View>
  )
}

function Grid() {
  const data = [
    [15, 14, 13, 12],
    [11, 10, 9, 8],
    [7, 6, 5, 4],
    [0, 1, 2, 3]
  ]
  return (
    <View style={styles.gridContainer}>
      {data.map((column, i: number) => (
        <Row column={column} key={`col-${i}`}/>
      ))}
    </View>
  )
}


const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Grid/>
    </Page>
  </Document>
);

(async () => {
  await ReactPDF.render(<MyDocument/>, `tmp/example.pdf`)
})()
