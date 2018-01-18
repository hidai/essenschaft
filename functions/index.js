const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
var rp = require('request-promise');

const bucket_name = process.env.GCLOUD_PROJECT + '.appspot.com';

const func = (event) => {
  const menu = event.data.data();
  return rp({url: menu.imgurl, encoding: null})
    .then((body) => {
      const bucket = gcs.bucket(bucket_name);
      const gcsname = event.params.menuId + '.jpg';
      const file = bucket.file(gcsname);
      return file.save(body, {metadata: {contentType: 'image/jpeg'}});
    });
};
exports.createMenu = functions.firestore.document('menu/{menuId}').onCreate(func);
exports.updateMenu = functions.firestore.document('menu/{menuId}').onUpdate(func);
