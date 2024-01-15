import {LocalStorageFields} from '../Types/LocalStorageFields';
import {UserDataType} from '../Types/UserDataType';

const transformUserDataForApi = (
  userData: UserDataType,
): Record<string, any> => {
  return {
    eventName: userData[LocalStorageFields.eventName] || 'app_user_register',
    login_type: userData[LocalStorageFields.loginType],
    user_from: userData[LocalStorageFields.userFrom] || 'app',
    mobile_no: userData[LocalStorageFields.mobileNo],
    identity: userData[LocalStorageFields.identity],
    profile_image: userData[LocalStorageFields.profileImage],
    full_name: userData[LocalStorageFields.fullName],
    birthdate: userData[LocalStorageFields.birthdate],
    gender: userData[LocalStorageFields.gender],
    city: userData[LocalStorageFields.city],
    orientation: userData[LocalStorageFields.orientation],
    is_orientation_visible: userData[LocalStorageFields.isOrientationVisible],
    hoping: userData[LocalStorageFields.hoping]?.Title,
    education: {
      digree: userData[LocalStorageFields.educationDegree],
      college_name: userData[LocalStorageFields.collegeName],
    },
    habits: {
      exercise: userData[LocalStorageFields.habitsExercise],
      smoke: userData[LocalStorageFields.habitsSmoke],
      movies: userData[LocalStorageFields.habitsMovies],
      drink: userData[LocalStorageFields.habitsDrink],
    },
    magical_person: {
      communication_stry:
        userData[LocalStorageFields.magicalPersonCommunicationStr],
      recived_love: userData[LocalStorageFields.magicalPersonReceivedLove],
      education_level: userData[LocalStorageFields.magicalPersonEducationLevel],
      star_sign: userData[LocalStorageFields.magicalPersonStarSign],
    },
    likes_into: userData[LocalStorageFields.likesInto],
    is_block_contact: userData[LocalStorageFields.isBlockContact],
    latitude: userData[LocalStorageFields.latitude] || 0,
    longitude: userData[LocalStorageFields.longitude] || 0,
    radius: userData[LocalStorageFields.radius],
    recent_pik: userData[LocalStorageFields.recentPik],
  };
};

export {transformUserDataForApi};
