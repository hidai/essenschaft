// @flow

export type MenuType = {
  id?: string,  // Random ID as Firestore document
  name: string,
  imgurl: string,
  lunchOnly?: boolean,
  lastUpdate: Date,
}
