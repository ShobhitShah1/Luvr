import React, { memo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Contact } from 'react-native-contacts/type';
import { useDispatch, useSelector } from 'react-redux';

import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import { FONTS } from '../../Common/Theme';
import { GradientBorderView } from '../../Components/GradientBorder';
import { useTheme } from '../../Contexts/ThemeContext';
import {
  saveContactsToApi,
  saveEmailsToApi,
  toggleIncognitoModeCall,
} from '../../Redux/Action/IncognitoActions';
import type { EmailItem } from '../../Redux/Action/IncognitoActions';
import type { IncognitoState } from '../../Redux/Reducer/IncognitoReducer';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/profile-and-setting-header';
import SettingFlexView from '../Setting/Components/SettingFlexView';

import EmailInputModal from './Components/EmailInputModal';
import IncognitoFlexView from './Components/IncognitoFlexView';
import SelectContactModal from './Components/SelectContactModal';

const IncognitoScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { isIncognitoEnabled, contacts, emails, isLoading } = useSelector(
    (state: { incognito: IncognitoState }) => state.incognito,
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
    const updatedContacts = contacts.filter(contact => contact.recordID !== contactId);
    dispatch(saveContactsToApi(updatedContacts) as any);
  };

  const removeEmail = (emailId: string) => {
    const updatedEmails = emails.filter(email => email.id !== emailId);
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
              Item="Incognito mode"
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
                title="My contact incognito:"
                disabled={isIncognitoEnabled}
                onPress={() => setContactModalVisible(true)}
              />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 15 }}>
                {contacts.length > 0 &&
                  contacts.map(contact => (
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
                            backgroundColor: isDark
                              ? colors.lightBackground
                              : colors.InputBackground,
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
                title="My email incognito:"
                disabled={isIncognitoEnabled}
                onPress={() => setEmailModalVisible(true)}
              />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 15 }}>
                {emails.length > 0 &&
                  emails.map(item => (
                    <Pressable
                      disabled={isIncognitoEnabled}
                      key={item.id}
                      onPress={() => removeEmail(item.id)}
                    >
                      <Text
                        style={[
                          styles.listText,
                          {
                            color: isDark ? colors.TextColor : colors.Primary,
                            borderWidth: 1,
                            borderColor: !isDark ? colors.Primary : 'transparent',
                            backgroundColor: isDark
                              ? colors.lightBackground
                              : colors.InputBackground,
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
  containContainer: {
    paddingBottom: 20,
  },
  detailContainerView: {
    alignSelf: 'center',
    marginTop: 5,
    width: '90%',
  },
  listText: {
    borderRadius: 15,
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    padding: 9,
    paddingHorizontal: 15,
  },
  switchContainer: {
    marginVertical: 5,
  },
  titleViewStyle: {
    marginTop: 20,
  },
});
