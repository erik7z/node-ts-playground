import QRcode from "qrcode"

QRcode.toDataURL("I am a pony!", function(err: any, url: any) {
  console.log(url)
})
