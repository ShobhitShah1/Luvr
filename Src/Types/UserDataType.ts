import {LocalStorageFields} from './LocalStorageFields';

type HopingType = {
  Title: string;
  Emoji: string;
  Icon: string;
};
export interface UserDataType {
  [LocalStorageFields._id]: number;
  [LocalStorageFields.eventName]: string;
  [LocalStorageFields.loginType]: string;
  [LocalStorageFields.userFrom]: string;
  [LocalStorageFields.mobileNo]: string;
  [LocalStorageFields.identity]: string;
  [LocalStorageFields.profileImage]: string;
  [LocalStorageFields.fullName]: string;
  [LocalStorageFields.birthdate]: string;
  [LocalStorageFields.gender]: string;
  [LocalStorageFields.city]: string;
  [LocalStorageFields.orientation]: string[];
  [LocalStorageFields.isOrientationVisible]: false;
  [LocalStorageFields.hoping]: HopingType;
  [LocalStorageFields.educationDegree]: string;
  [LocalStorageFields.collegeName]: string;
  [LocalStorageFields.habitsExercise]: string;
  [LocalStorageFields.habitsSmoke]: string;
  [LocalStorageFields.habitsMovies]: string;
  [LocalStorageFields.habitsDrink]: string;
  [LocalStorageFields.magicalPersonCommunicationStr]: string;
  [LocalStorageFields.magicalPersonReceivedLove]: string;
  [LocalStorageFields.magicalPersonEducationLevel]: string;
  [LocalStorageFields.magicalPersonStarSign]: string;
  [LocalStorageFields.likesInto]: string[];
  [LocalStorageFields.isBlockContact]: false;
  [LocalStorageFields.latitude]: number;
  [LocalStorageFields.longitude]: number;
  [LocalStorageFields.radius]: number;
  [LocalStorageFields.recentPik]: string[];
  [LocalStorageFields.OTP]: number;
  [LocalStorageFields.Token]: string;
  [LocalStorageFields.isVerified]: false;
  [LocalStorageFields.isImageUploaded]: false;
}

export default UserDataType;
