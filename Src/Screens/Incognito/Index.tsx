import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Contact } from 'react-native-contacts/type';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import { FONTS } from '../../Common/Theme';
import { GradientBorderView } from '../../Components/GradientBorder';
import { useTheme } from '../../Contexts/ThemeContext';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import SettingFlexView from '../Setting/Components/SettingFlexView';
import EmailInputModal from './Components/EmailInputModal';
import IncognitoFlexView from './Components/IncognitoFlexView';
import SelectContactModal from './Components/SelectContactModal';

interface EmailItem {
  id: string;
  email: string;
}

const IncognitoScreen = () => {
  const { colors, isDark } = useTheme();
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [emailItems, setEmailItems] = useState<EmailItem[]>([]);
  const [isIncognitoEnabled, setIsIncognitoEnabled] = useState(false);

  const handleSelectContacts = (contacts: Contact[]) => {
    setSelectedContacts(contacts);
  };

  const handleAddEmail = (email: string) => {
    const newEmailItem: EmailItem = {
      id: Date.now().toString(),
      email: email,
    };
    setEmailItems([...emailItems, newEmailItem]);
  };

  const toggleIncognitoMode = () => {
    setIsIncognitoEnabled(!isIncognitoEnabled);
  };

  const getContactDisplayName = (contact: Contact): string => {
    return contact.displayName || `${contact.givenName} ${contact.familyName}`.trim();
  };

  const removeContact = (id: string) => {
    setSelectedContacts(selectedContacts.filter((contact) => contact.recordID !== id));
  };

  const removeEmail = (id: string) => {
    setEmailItems(emailItems.filter((item) => item.id !== id));
  };

  return (
    <GradientView>
      <ProfileAndSettingHeader Title="Incognito" showRightIcon={false} />

      <View style={styles.detailContainerView}>
        <EditProfileTitleView
          style={styles.titleViewStyle}
          isIcon={false}
          Icon={CommonIcons.LightProfileTab}
          Title="Incognito"
        />
        <GradientBorderView
          gradientProps={{ colors: colors.editFiledBackground }}
          style={{
            backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <EditProfileBoxView IsViewLoading={false}>
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
          gradientProps={{ colors: colors.editFiledBackground }}
          style={{
            backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <EditProfileBoxView IsViewLoading={false}>
            <View>
              <IncognitoFlexView
                style={styles.switchContainer}
                title={'My contact incognito:'}
                onPress={() => setContactModalVisible(true)}
              />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 15 }}>
                {selectedContacts.length > 0 ? (
                  selectedContacts.map((contact) => (
                    <Pressable key={contact.recordID} onPress={() => removeContact(contact.recordID)}>
                      <Text
                        style={[
                          styles.listText,
                          {
                            color: colors.TextColor,
                            backgroundColor: isDark ? colors.lightBackground : colors.InputBackground,
                          },
                        ]}
                      >
                        {getContactDisplayName(contact)} ✕
                      </Text>
                    </Pressable>
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: colors.SecondaryTextColor }]}>No contacts selected</Text>
                )}
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
          gradientProps={{ colors: colors.editFiledBackground }}
          style={{
            backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <EditProfileBoxView IsViewLoading={false}>
            <View>
              <IncognitoFlexView
                style={styles.switchContainer}
                title={'My email incognito:'}
                onPress={() => setEmailModalVisible(true)}
              />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 15 }}>
                {emailItems.length > 0 ? (
                  emailItems.map((item) => (
                    <Pressable key={item.id} onPress={() => removeEmail(item.id)}>
                      <Text
                        style={[
                          styles.listText,
                          {
                            color: colors.TextColor,
                            backgroundColor: isDark ? colors.lightBackground : colors.InputBackground,
                          },
                        ]}
                      >
                        {item.email} ✕
                      </Text>
                    </Pressable>
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: colors.SecondaryTextColor }]}>No emails added</Text>
                )}
              </View>
            </View>
          </EditProfileBoxView>
        </GradientBorderView>
      </View>

      <SelectContactModal
        isVisible={isContactModalVisible}
        onClose={() => setContactModalVisible(false)}
        onSelectContacts={handleSelectContacts}
        multipleSelection={true}
        selectedContacts={selectedContacts}
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
    justifyContent: 'center',
  },
  titleViewStyle: {
    marginTop: 20,
  },
  switchContainer: {
    marginVertical: 5,
  },
  listText: {
    padding: 10,
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
