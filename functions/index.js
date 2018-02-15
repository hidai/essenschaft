const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const req = require('request-promise');

const bucket_name = process.env.GCLOUD_PROJECT + '.appspot.com';

const func = (event) => {
  const menu = event.data.data();
  if (!menu.imgurl) {
    return;
  }
  return req({
             uri: menu.imgurl,
             encoding: null,
             resolveWithFullResponse: true,
  }).then((response) => {
    return gcs
      .bucket(bucket_name)
      .file(event.params.menuId)
      .save(response.body, {
        metadata: {
          contentType: response.headers['content-type'],
        },
      });
  });
};
exports.createMenu = functions.firestore.document('menu/{menuId}').onCreate(func);
exports.updateMenu = functions.firestore.document('menu/{menuId}').onUpdate(func);
