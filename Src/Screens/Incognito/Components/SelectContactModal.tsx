import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import type { Contact } from 'react-native-contacts/type';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import CommonIcons from '../../../Common/CommonIcons';
import { FONTS, SIZES } from '../../../Common/Theme';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';

interface SelectContactModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectContacts: (contacts: Contact[]) => void;
  multipleSelection?: boolean;
  selectedContacts: Contact[];
}

const SelectContactModal: FC<SelectContactModalProps> = ({
  isVisible,
  onClose,
  onSelectContacts,
  multipleSelection = true,
  selectedContacts = [],
}) => {
  const { colors, isDark } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isVisible && selectedContacts.length > 0) {
      const newSelectedIds: Record<string, boolean> = {};
      selectedContacts.forEach(contact => {
        if (contact.recordID) {
          newSelectedIds[contact.recordID] = true;
        }
      });

      setSelectedContactIds(newSelectedIds);
    } else if (isVisible && selectedContacts.length === 0) {
      setSelectedContactIds({});
    }
  }, [isVisible, selectedContacts]);

  useEffect(() => {
    if (isVisible) {
      requestContactsPermission();
    }
  }, [isVisible]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(
        contact =>
          contact.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.givenName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.familyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (contact.phoneNumbers[0]?.number && contact.phoneNumbers[0].number.includes(searchQuery)),
      );

      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const requestContactsPermission = async () => {
    try {
      setLoading(contacts.length === 0);
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          loadContacts();
        } else {
          setLoading(false);
        }
      } else {
        const permission = await Contacts.requestPermission();
        if (permission === 'authorized') {
          loadContacts();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const loadContacts = () => {
    Contacts.getAll()
      .then(contactsResult => {
        const formattedContacts = contactsResult.filter(
          contact =>
            (contact.givenName || contact.familyName) &&
            contact.phoneNumbers &&
            contact.phoneNumbers.length > 0,
        );

        setContacts(formattedContacts);
        setFilteredContacts(formattedContacts);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const toggleContactSelection = (id: string) => {
    if (!multipleSelection) {
      const newSelectedIds: Record<string, boolean> = {};
      newSelectedIds[id] = true;
      setSelectedContactIds(newSelectedIds);
    } else {
      setSelectedContactIds(prev => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const isContactSelected = (id: string): boolean => {
    return !!selectedContactIds[id];
  };

  const handleDone = () => {
    const selectedContacts = contacts.filter(contact => isContactSelected(contact.recordID));
    onSelectContacts(selectedContacts);
    onClose();
  };

  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+${cleaned.substring(0, 2)} ${cleaned.substring(2, 7)} ${cleaned.substring(7)}`;
    }

    return phoneNumber;
  };

  const getPhoneNumber = (contact: Contact): string => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      return formatPhoneNumber(contact.phoneNumbers[0].number);
    }

    return '';
  };

  const getSelectedContactsCount = (): number => {
    return Object.values(selectedContactIds).filter(selected => selected).length;
  };

  return (
    <Modal
      isVisible={isVisible}
      style={styles.container}
      useNativeDriver
      hasBackdrop
      useNativeDriverForBackdrop
      backdropOpacity={0.8}
      customBackdrop={
        <View
          style={{ flex: 1, backgroundColor: isDark ? 'rgba(13, 1, 38, 1)' : 'rgba(0, 0, 0, 0.5)' }}
        />
      }
      onBackdropPress={onClose}
    >
      <GradientBorderView
        gradientProps={{ colors: colors.ButtonGradient }}
        style={{
          width: '90%',
          height: '90%',
          alignSelf: 'center',
          borderWidth: 1,
          borderRadius: 20,
          backgroundColor: isDark ? 'rgba(13, 1, 38, 0.8)' : 'rgba(255, 255, 255, 0.98)',
          overflow: 'hidden',
        }}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.closeButtonText, { color: colors.TextColor }]}>✕</Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.searchContainer,
              {
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(198, 198, 198, 1)',
              },
            ]}
          >
            <Image
              source={CommonIcons.Search}
              style={{ width: 18, height: 18, marginRight: 10 }}
              tintColor={isDark ? colors.White : colors.Gray}
            />
            {/* <Text style={[styles.searchIcon, { color: isDark ? colors.White : colors.Gray }]}>🔍</Text> */}
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: isDark ? colors.White : colors.TextColor,
                  fontFamily: FONTS.SemiBold,
                },
              ]}
              placeholder="Search contact"
              placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.6)' : colors.Placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.Primary} />
              <Text
                style={[styles.loaderText, { color: isDark ? colors.White : colors.TextColor }]}
              >
                Loading contacts...
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.contactsList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {filteredContacts.length === 0 ? (
                <View style={styles.noContactsContainer}>
                  <Text
                    style={[
                      styles.noContactsText,
                      { color: isDark ? colors.White : colors.TextColor },
                    ]}
                  >
                    {searchQuery ? 'No contacts match your search' : 'No contacts found'}
                  </Text>
                </View>
              ) : (
                filteredContacts.map(contact => (
                  <Pressable
                    key={contact.recordID}
                    style={[
                      styles.contactItem,
                      {
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.Primary,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      },
                    ]}
                    onPress={() => toggleContactSelection(contact.recordID)}
                  >
                    <View style={styles.contactInfo}>
                      <Text
                        style={[
                          styles.contactName,
                          {
                            color: isDark ? colors.White : colors.TextColor,
                            fontFamily: FONTS.SemiBold,
                          },
                        ]}
                      >
                        {contact.displayName || `${contact.givenName} ${contact.familyName}`.trim()}
                      </Text>
                      <Text
                        style={[
                          styles.contactPhone,
                          {
                            color: isDark ? 'rgba(255, 255, 255, 0.7)' : colors.SecondaryTextColor,
                            fontFamily: FONTS.SemiBold,
                          },
                        ]}
                      >
                        {getPhoneNumber(contact)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.checkCircle,
                        isContactSelected(contact.recordID)
                          ? {
                              backgroundColor: isDark ? colors.Primary : colors.Primary,
                              borderColor: 'transparent',
                            }
                          : {
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.4)'
                                : 'rgba(0, 0, 0, 0.2)',
                            },
                      ]}
                    >
                      {isContactSelected(contact.recordID) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </Pressable>
                ))
              )}
              <View style={styles.bottomPadding} />
            </ScrollView>
          )}

          <LinearGradient colors={colors.ButtonGradient} style={styles.addButton}>
            <Pressable
              style={styles.doneButton}
              onPress={handleDone}
              disabled={loading || getSelectedContactsCount() === 0}
            >
              <Text style={[styles.doneButtonText, { color: colors.White }]}>Done</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </GradientBorderView>
    </Modal>
  );
};

export default SelectContactModal;

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: SIZES.radius,
    height: 55,
    justifyContent: 'center',
    marginTop: SIZES.base * 2,
    width: '100%',
  },
  bottomPadding: {
    height: 20,
  },
  checkCircle: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactItem: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    marginBottom: 13,
    padding: SIZES.base * 2,
    paddingVertical: 13,
    width: '95%',
  },
  contactName: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  contactPhone: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
  },
  contactsList: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  doneButton: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    padding: SIZES.base * 2,
    width: '100%',
  },
  doneButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: SIZES.base,
  },
  loaderContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loaderText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    marginTop: SIZES.base * 2,
  },
  modalContent: {
    flex: 1,
    padding: 10,
  },
  noContactsContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  noContactsText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  searchContainer: {
    alignItems: 'center',
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    marginBottom: 10,
    padding: SIZES.base,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SIZES.base,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    height: 40,
    padding: 0,
  },
});
