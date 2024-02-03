import {LocalStorageFields} from '../Types/LocalStorageFields';
import {UserDataType} from '../Types/UserDataType';

const transformUserDataForApi = (
  userData: UserDataType,
): Record<string, any> => {
  return {
    eventName: userData[LocalStorageFields.eventName] || 'app_user_register',
    login_type: userData[LocalStorageFields.login_type] || '',
    user_from: userData[LocalStorageFields.user_from] || 'app',
    mobile_no: userData[LocalStorageFields.mobile_no] || '',
    identity: userData[LocalStorageFields.identity] || '',
    profile_image: userData[LocalStorageFields.profile_image] || '',
    full_name: userData[LocalStorageFields.full_name] || '',
    birthdate: userData[LocalStorageFields.birthdate] || '',
    gender: userData[LocalStorageFields.gender] || '',
    city: userData[LocalStorageFields.city] || '',
    orientation: userData[LocalStorageFields.orientation] || [],
    is_orientation_visible:
      userData[LocalStorageFields.is_orientation_visible] || false,
    hoping: userData[LocalStorageFields.hoping] || '',
    education: {
      digree: userData[LocalStorageFields.digree] || '',
      college_name: userData[LocalStorageFields.college_name] || '',
    },
    habits: {
      exercise: userData[LocalStorageFields.exercise] || '',
      smoke: userData[LocalStorageFields.smoke] || '',
      movies: userData[LocalStorageFields.movies] || '',
      drink: userData[LocalStorageFields.drink] || '',
    },
    magical_person: {
      communication_stry: userData[LocalStorageFields.communication_stry] || '',
      recived_love: userData[LocalStorageFields.recived_love] || '',
      education_level: userData[LocalStorageFields.education_level] || '',
      star_sign: userData[LocalStorageFields.star_sign] || '',
    },
    likes_into: userData[LocalStorageFields.likes_into] || [],
    is_block_contact: userData[LocalStorageFields.is_block_contact] || false,
    latitude: userData[LocalStorageFields.latitude] || 0,
    longitude: userData[LocalStorageFields.longitude] || 0,
    radius: userData[LocalStorageFields.radius] || 0,
    recent_pik: userData[LocalStorageFields.recent_pik] || [],
  };
};

export {transformUserDataForApi};
