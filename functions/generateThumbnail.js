const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
import * as sharp from "sharp";
// helloGCS = async (img) => {
//   //   const gcsEvent = event;
//   const bucket = "codecamp-storage10/thumb";
//   const storage = new Storage({
//     projectId: "vibrant-arcana-370212",
//     keyFilename: "gcp-file-storage.json",
//   }).bucket(bucket);
//   const result = await new Promise((resolve, reject) => {
//     const image = sharp(img).resize(320).png().toFile("small.png");
//     resolve(image);
//   });
//   const result1 = await new Promise((resolve, reject) => {
//     const image = sharp(img).resize(640).png().toFile("medium.png");
//     resolve(image);
//   });
//   const result2 = await new Promise((resolve, reject) => {
//     const image = sharp(img).resize(1280).png().toFile("large.png");
//     resolve(image);
//   });
//   console.log(result, result1, result2);
// };

// helloGCS("시바견2.png");

const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

exports.helloGCS = async (event, context) => {
  const gcsEvent = event;
  const storage = new Storage();
  const storageT = storage.bucket(gcsEvent.bucket);
  console.log(gcsEvent.name);
  if (gcsEvent.name.includes("thumb/s")) return;
  if (gcsEvent.name.includes("thumb/m")) return;
  if (gcsEvent.name.includes("thumb/l")) return;
  const size = ["small", "medium", "large"];
  const sizes = [
    { width: 320, height: 240, size: "s" },
    { width: 640, height: 480, size: "m" },
    { width: 1280, height: 960, size: "l" },
  ];
  //   const result = await new Promise((resolve, reject) => {
  //     storageT
  //       .file(gcsEvent.name)
  //       .createReadStream()
  //       .pipe(sharp().resize(320, 240).png())
  //       .pipe(storageT.file(`thumb/s/${gcsEvent.name}`).createWriteStream())
  //       .on("finish", () => {
  //         resolve("success");
  //       })
  //       .on("error", () => {
  //         reject("error");
  //       });
  //   });

  const result = await Promise.all(
    sizes.map((el) => {
      new Promise((resolve, reject) =>
        storageT
          .file(gcsEvent.name)
          .createReadStream()
          .pipe(sharp().resize({ width: el.width, height: el.height }).png())
          .pipe(
            storageT
              .file(`thumb/${el.size}/${gcsEvent.name}`)
              .createWriteStream()
          )
          .on("finish", () => {
            resolve("success");
          })
          .on("error", () => {
            reject("error");
          })
      );
    })
  );
  return result;
};
