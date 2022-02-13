const Jimp = require("jimp");

function textureLoader(buffer) {

    const callback = this.async();

    Jimp.read(buffer).then((image) => {
        const data = new Uint8ClampedArray(image.bitmap.data.buffer);
        const { width, height } = image.bitmap;
        const content = `export default new ImageData(new Uint8ClampedArray([${data.toString()}]), ${width},${height});`;
        callback(null, content);
    }).catch((err) => {
        callback(err);
    });
}

module.exports = textureLoader;
module.exports.raw = true;