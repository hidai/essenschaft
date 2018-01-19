// @flow

export type MenuType = {
  id?: string,  // Random ID as Firestore document
  name: string,
  imgurl: string,  // original image url
  vendor: string,
  lunchOnly: boolean,
  lastUpdate: Date,
  lastUpdatedBy: string,  // user name
  gsimgurl?: string,  // copied image url in Cloud Storage
}
