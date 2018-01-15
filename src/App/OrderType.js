// @flow

// key is "YYYY-MM-DD-email-type"
export type OrderType = {
  date: string,    // 'YYYY-MM-DD'
  userId: string,  // email
  type: 'lunch' | 'dinner',
  menuId: string,
  lastUpdate: Date,
}
