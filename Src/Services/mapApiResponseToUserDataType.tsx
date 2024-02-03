import {LocalStorageFields} from '../Types/LocalStorageFields';
import UserDataType from '../Types/UserDataType';

export function mapApiResponseToUserDataType(
  apiData: any,
): Partial<UserDataType> {
  const mappedData: Partial<UserDataType> = {};

  if (apiData && typeof apiData === 'object') {
    mappedData[LocalStorageFields._id] = apiData._id;
    mappedData[LocalStorageFields.mobile_no] = apiData.mobile_no;
    mappedData[LocalStorageFields.birthdate] = apiData.birthdate;
    mappedData[LocalStorageFields.city] = apiData.city;
    mappedData[LocalStorageFields.digree] = apiData.education?.digree || '';
    mappedData[LocalStorageFields.college_name] =
      apiData.education?.college_name || '';
    mappedData[LocalStorageFields.exercise] = apiData.habits?.exercise || '';
    mappedData[LocalStorageFields.smoke] = apiData.habits?.smoke || '';
    mappedData[LocalStorageFields.movies] = apiData.habits?.movies || '';
    mappedData[LocalStorageFields.drink] = apiData.habits?.drink || '';
    mappedData[LocalStorageFields.hoping] = apiData.hoping;
    mappedData[LocalStorageFields.identity] = apiData.identity;
    mappedData[LocalStorageFields.is_block_contact] = apiData.is_block_contact;
    mappedData[LocalStorageFields.is_orientation_visible] =
      apiData.is_orientation_visible;
    mappedData[LocalStorageFields.likes_into] = apiData.likes_into;
    mappedData[LocalStorageFields.latitude] =
      apiData.location?.coordinates[1] || 0;
    mappedData[LocalStorageFields.longitude] =
      apiData.location?.coordinates[0] || 0;
    mappedData[LocalStorageFields.radius] = apiData.radius;
    mappedData[LocalStorageFields.communication_stry] =
      apiData.magical_person?.communication_stry || '';
    mappedData[LocalStorageFields.recived_love] =
      apiData.magical_person?.recived_love || '';
    mappedData[LocalStorageFields.education_level] =
      apiData.magical_person?.education_level || '';
    mappedData[LocalStorageFields.star_sign] =
      apiData.magical_person?.star_sign || '';
    mappedData[LocalStorageFields.user_from] = apiData.user_from;
    mappedData[LocalStorageFields.profile_image] = apiData.profile_image;
    mappedData[LocalStorageFields.login_type] = apiData.login_type;
  }

  return mappedData;
}
