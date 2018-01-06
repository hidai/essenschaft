// @flow

export type MenuType = {
  id?: string,  // Random ID as Firestore document
  name: string,
  imgurl: string,
  vendor: string,
  lunchOnly?: boolean,
  lastUpdate: Date,
}
