import React, { Component } from "react"
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"
import ReactPDF from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4"
  },
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: "#ffffff"
  },
  HeadStyle: {
    height: 50,
    alignContent: "center",
    backgroundColor: "#ffe0f0"
  },
  TableText: {
    margin: 10
  }
})

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
          <View style={{ flex: 1, alignSelf: "stretch" }}>
            <Text>#1</Text>
          </View>
        </View>

      </View>

    </Page>
  </Document>
);

(async () => {
  await ReactPDF.render(<MyDocument/>, `tmp/example.pdf`)

})()
