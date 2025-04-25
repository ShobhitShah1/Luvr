import React, { memo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Contact } from 'react-native-contacts/type';
import { useDispatch, useSelector } from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import { FONTS } from '../../Common/Theme';
import { GradientBorderView } from '../../Components/GradientBorder';
import { useTheme } from '../../Contexts/ThemeContext';
import {
  EmailItem,
  saveContactsToApi,
  saveEmailsToApi,
  toggleIncognitoModeCall,
} from '../../Redux/Action/IncognitoActions';
import { IncognitoState } from '../../Redux/Reducer/IncognitoReducer';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import SettingFlexView from '../Setting/Components/SettingFlexView';
import EmailInputModal from './Components/EmailInputModal';
import IncognitoFlexView from './Components/IncognitoFlexView';
import SelectContactModal from './Components/SelectContactModal';

const IncognitoScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { isIncognitoEnabled, contacts, emails, isLoading } = useSelector(
    (state: { incognito: IncognitoState }) => state.incognito
  );

  const [isContactModalVisible, setContactModalVisible] = useState<boolean>(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState<boolean>(false);

  const handleSelectContacts = (selectedContacts: Contact[]) => {
    dispatch(saveContactsToApi(selectedContacts) as any);
    setContactModalVisible(false);
  };

  const handleAddEmail = (email: string) => {
    const newEmailItem: EmailItem = { id: Date.now().toString(), email };
    const updatedEmails: EmailItem[] = [...emails, newEmailItem];
    dispatch(saveEmailsToApi(updatedEmails) as any);
    setEmailModalVisible(false);
  };

  const removeContact = (contactId: string) => {
    const updatedContacts = contacts.filter((contact) => contact.recordID !== contactId);
    dispatch(saveContactsToApi(updatedContacts) as any);
  };

  const removeEmail = (emailId: string) => {
    const updatedEmails = emails.filter((email) => email.id !== emailId);
    dispatch(saveEmailsToApi(updatedEmails) as any);
  };

  const toggleIncognitoMode = () => {
    dispatch(toggleIncognitoModeCall(!isIncognitoEnabled) as any);
  };

  const getContactDisplayName = (contact: Contact): string => {
    return contact.displayName || `${contact.givenName} ${contact.familyName}`.trim();
  };

  return (
    <GradientView>
      <ProfileAndSettingHeader Title="Incognito" showRightIcon={false} />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.detailContainerView}
        contentContainerStyle={styles.containContainer}
      >
        <EditProfileTitleView
          style={styles.titleViewStyle}
          isIcon={false}
          Icon={CommonIcons.LightProfileTab}
          Title="Incognito"
        />
        <GradientBorderView
          gradientProps={{ colors: isDark ? colors.editFiledBackground : colors.ButtonGradient }}
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <EditProfileBoxView IsViewLoading={isLoading}>
            <SettingFlexView
              isActive={isIncognitoEnabled}
              style={styles.switchContainer}
              Item={'Incognito mode'}
              onPress={toggleIncognitoMode}
              IsSwitch={true}
              onSwitchPress={toggleIncognitoMode}
            />
          </EditProfileBoxView>
        </GradientBorderView>

        <EditProfileTitleView
          style={styles.titleViewStyle}
          isIcon={false}
          Icon={CommonIcons.LightProfileTab}
          Title="My contact"
        />
        <GradientBorderView
          gradientProps={{ colors: isDark ? colors.editFiledBackground : colors.ButtonGradient }}
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 10,
            opacity: isIncognitoEnabled ? 0.5 : 1,
          }}
        >
          <EditProfileBoxView IsViewLoading={isLoading}>
            <View>
              <IncognitoFlexView
                style={styles.switchContainer}
                title={'My contact incognito:'}
                onPress={() => setContactModalVisible(true)}
              />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 15 }}>
                {contacts.length > 0 &&
                  contacts.map((contact) => (
                    <Pressable
                      disabled={isIncognitoEnabled}
                      key={contact.recordID}
                      onPress={() => removeContact(contact.recordID)}
                    >
                      <Text
                        style={[
                          styles.listText,
                          {
                            color: isDark ? colors.TextColor : colors.Primary,
                            borderWidth: 1,
                            borderColor: !isDark ? colors.Primary : 'transparent',
                            backgroundColor: isDark ? colors.lightBackground : colors.InputBackground,
                          },
                        ]}
                      >
                        {getContactDisplayName(contact)?.trim()}
                      </Text>
                    </Pressable>
                  ))}
              </View>
            </View>
          </EditProfileBoxView>
        </GradientBorderView>

        <EditProfileTitleView
          style={styles.titleViewStyle}
          isIcon={false}
          Icon={CommonIcons.LightProfileTab}
          Title="My email"
        />
        <GradientBorderView
          gradientProps={{ colors: isDark ? colors.editFiledBackground : colors.ButtonGradient }}
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 10,
            opacity: isIncognitoEnabled ? 0.5 : 1,
          }}
        >
          <EditProfileBoxView IsViewLoading={isLoading}>
            <View>
              <IncognitoFlexView
                style={styles.switchContainer}
                title={'My email incognito:'}
                onPress={() => setEmailModalVisible(true)}
              />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 15 }}>
                {emails.length > 0 &&
                  emails.map((item) => (
                    <Pressable disabled={isIncognitoEnabled} key={item.id} onPress={() => removeEmail(item.id)}>
                      <Text
                        style={[
                          styles.listText,
                          {
                            color: isDark ? colors.TextColor : colors.Primary,
                            borderWidth: 1,
                            borderColor: !isDark ? colors.Primary : 'transparent',
                            backgroundColor: isDark ? colors.lightBackground : colors.InputBackground,
                          },
                        ]}
                      >
                        {item.email?.trim()}
                      </Text>
                    </Pressable>
                  ))}
              </View>
            </View>
          </EditProfileBoxView>
        </GradientBorderView>
      </ScrollView>

      <SelectContactModal
        isVisible={isContactModalVisible}
        onClose={() => setContactModalVisible(false)}
        onSelectContacts={handleSelectContacts}
        multipleSelection={true}
        selectedContacts={contacts}
      />

      <EmailInputModal
        isVisible={isEmailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        onAddEmail={handleAddEmail}
      />
    </GradientView>
  );
};

export default memo(IncognitoScreen);

const styles = StyleSheet.create({
  detailContainerView: {
    width: '90%',
    marginTop: 5,
    alignSelf: 'center',
  },
  containContainer: {
    paddingBottom: 20,
  },
  titleViewStyle: {
    marginTop: 20,
  },
  switchContainer: {
    marginVertical: 5,
  },
  listText: {
    padding: 9,
    paddingHorizontal: 15,
    borderRadius: 15,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    fontStyle: 'italic',
    padding: 5,
  },
});
