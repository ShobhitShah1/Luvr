export const LocalStorageFields = {
  eventName: 'eventName',
  loginType: 'loginType',
  userFrom: 'userFrom',
  mobileNo: 'mobileNo',
  identity: 'identity',
  profileImage: 'profileImage',
  fullName: 'fullName',
  birthdate: 'birthdate',
  gender: 'gender',
  city: 'city',
  orientation: 'orientation',
  isOrientationVisible: 'isOrientationVisible',
  hoping: 'hoping',
  educationDegree: 'educationDegree',
  collegeName: 'collegeName',
  habitsExercise: 'habitsExercise',
  habitsSmoke: 'habitsSmoke',
  habitsMovies: 'habitsMovies',
  habitsDrink: 'habitsDrink',
  magicalPersonCommunicationStr: 'magicalPersonCommunicationStr',
  magicalPersonReceivedLove: 'magicalPersonReceivedLove',
  magicalPersonEducationLevel: 'magicalPersonEducationLevel',
  magicalPersonStarSign: 'magicalPersonStarSign',
  likesInto: 'likesInto',
  isBlockContact: 'isBlockContact',
  latitude: 'latitude',
  longitude: 'longitude',
  radius: 'radius',
  recentPik: 'recentPik',
} as const;

export type UserField = keyof typeof LocalStorageFields;

// export const LocalStorageFields = {
//   firstName: 'firstName',
//   dob: 'dob',
//   gender: 'gender',
//   sexualOrientation: 'sexualOrientation',
// } as const;

// export type UserField = keyof typeof LocalStorageFields;
