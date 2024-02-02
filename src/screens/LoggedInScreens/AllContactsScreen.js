import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import Contacts from 'react-native-contacts';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  PermissionsAndroid,
  Modal,
  ScrollView,
  TextInput,
  SectionList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../../context/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import styles from '../../styles/LoggedInScreenStyles/AllContactsScreenStyle';
import ToastContext from '../../context/ToastContext';
import auth from '@react-native-firebase/auth';

const AllContactsScreen = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const {showToast} = useContext(ToastContext);

  const [contactColors, setContactColors] = useState({});
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isSearchVisible, setSearchVisibility] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userPhoneNumbers, setUserPhoneNumbers] = useState([]);
  const [userImages, setUserImages] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userUids, setUserUids] = useState({});
  const [usernames, setUsernames] = useState({});
const [currentUID, setCurrentUID] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  //! If Build Does Not Work in Production app then look at its npm docs and proguard code file.

  //* to convert +91 12345 67890 to +911234567890
  const sanitizePhoneNumber = number => {
    let sanitizedNumber = number.replace(/[^0-9]/g, ''); // Removes all non-numeric characters

    // If the number starts with '0', remove the '0'
    if (sanitizedNumber.startsWith('0')) {
      sanitizedNumber = sanitizedNumber.substring(1);
    }

    // If the number doesn't start with '+91', prepend it
    if (!sanitizedNumber.startsWith('+91')) {
      sanitizedNumber = '+91' + sanitizedNumber;
    }

    return sanitizedNumber;
  };

  const openImageModal = useCallback(uri => {
    setSelectedImageUri(uri);
    setImageModalVisible(true);
  }, []);

  const HighlightedText = React.memo(({text, highlight}) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <Text style={[styles.profileName, {color: theme.text}]}>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Text key={index} style={styles.highlighted}>
              {part}
            </Text>
          ) : (
            part
          ),
        )}
      </Text>
    );
  });

  // const requestContactsPermission = useCallback(async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  //       {
  //         title: 'Contacts Permission',
  //         message: 'This app would like to view your contacts.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );

  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       fetchContacts();
  //     } else {
  //       console.warn('Contacts permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // });

 const requestContactsPermission = useCallback(async () => {
   try {
     const granted = await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
       {
         title: 'Contacts Permission',
         message: 'This app would like to view your contacts.',
         buttonNeutral: 'Ask Me Later',
         buttonNegative: 'Cancel',
         buttonPositive: 'OK',
       },
     );

     console.log('Permission status:', granted);

     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       fetchContacts();
       setPermissionGranted(true);
     } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
       // User denied permission. You might want to disable features or
       // try requesting permission again after a certain interval or user action.
       showToast('Contact Access Permission Denied');
        // setPermissionGranted(false);
       navigation.navigate('Home');

     } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
       // User denied permission and selected "Never ask again".
       // You might want to explain to users that they need to enable the permission manually.
       showToast(
         'Please enable contact permission in settings to use this feature.',
       );
       navigation.navigate('Home')
     }
   } catch (err) {
     console.warn('Permissions error:', err);
     showToast('An error occurred while requesting permissions');
   }
 }, [fetchContacts, showToast]);


  const sortContactsByName = (a, b) => {
    const nameA = (a.givenName || '').toUpperCase();
    const nameB = (b.givenName || '').toUpperCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    // If given names are the same, compare by family name
    const familyNameA = (a.familyName || '').toUpperCase();
    const familyNameB = (b.familyName || '').toUpperCase();

    if (familyNameA < familyNameB) return -1;
    if (familyNameA > familyNameB) return 1;

    return 0;
  };

  const fetchContacts = useCallback(async (showToastOnCompletion = false) => {
    setIsRefreshing(true);
    if (!permissionGranted) return;
    
    try {
      let contactsList = await Contacts.getAll();

      // Filter out any contacts that are null or don't have a phone number
      contactsList = contactsList.filter(
        contact => contact && contact.phoneNumbers && contact.phoneNumbers[0],
      );

      // Transform userPhoneNumbers into an indexed object for O(1) lookups
      const userPhoneNumbersIndex = userPhoneNumbers.reduce((acc, number) => {
        acc[number] = true;
        return acc;
      }, {});

      contactsList = contactsList.map(contact => {
        const sanitizedContactNumber = sanitizePhoneNumber(
          contact.phoneNumbers[0].number,
        );
        const isMember = !!userPhoneNumbersIndex[sanitizedContactNumber];
        return {
          ...contact,
          isMember,
        };
      });

      // Sort the entire contacts list
      contactsList.sort(sortContactsByName);

      setContacts(contactsList);

      // Generate colors for each contact
      const newContactColors = {};
      contactsList.forEach(contact => {
        newContactColors[contact.recordID] = generateRandomDarkColor(
          contact.recordID,
        );
      });
      setContactColors(newContactColors);
      if (showToastOnCompletion) {
        showToast('Contacts refreshed successfully!');
      }
    } catch (err) {
      console.warn('Error fetching contacts', err);
    } finally {
      // Ensure isRefreshing is set to false at the end, regardless of success or failure
      setIsRefreshing(false);
    }
  });

  const colorPalette = [
    '#E57373',
    '#F06292',
    '#BA68C8',
    '#9575CD',
    '#7986CB',
    '#64B5F6',
    '#4FC3F7',
    '#4DD0E1',
    '#4DB6AC',
    '#81C784',
    '#AED581',
    '#FFD54F',
    // ... add more colors as required
  ];

  const hashString = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  const getColorForContact = contactID => {
    const index = Math.abs(hashString(contactID)) % colorPalette.length;
    return colorPalette[index];
  };

  const generateRandomDarkColor = contactID => {
    // Instead of generating a random color, use the getColorForContact function
    return getColorForContact(contactID);
  };

  useEffect(() => {
    console.log(permissionGranted);
    if (!permissionGranted) {
      requestContactsPermission();
    }
  }, []);

  // useEffect(() => {
  //   // Fetch all users from Firestore
  //   const unsubscribe = firestore()
  //     .collection('users')
  //     .onSnapshot(snapshot => {
  //       const phoneNumbers = [];
  //       const fetchedUserImages = {};

  //       snapshot.forEach(doc => {
  //         const userData = {
  //           ...doc.data(),
  //           id: doc.id,
  //         };

  //         if (userData.phoneNumber) {
  //           phoneNumbers.push(userData.phoneNumber);

  //           // If the user has an image, store it in the fetchedUserImages object
  //           if (userData.userImage) {
  //             fetchedUserImages[userData.phoneNumber] = userData.userImage;
  //           }
  //         }
  //       });

  //       setUserPhoneNumbers(phoneNumbers);
  //       setUserImages(fetchedUserImages);
  //       console.log(userImages);

  //       if (phoneNumbers.length === 0) {
  //         console.log('userPhoneNumbers is blank!');
  //       }
  //     });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    // Fetch all users from Firestore
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const phoneNumbers = [];
        const fetchedUserImages = {};
        const fetchedUserUids = {};
        const fetchedUsernames = {};

        snapshot.forEach(doc => {
          const userData = {
            ...doc.data(),
            id: doc.id,
          };

          if (userData.phoneNumber) {
            phoneNumbers.push(userData.phoneNumber);

            // If the user has an image, store it in the fetchedUserImages object
            if (userData.userImage) {
              fetchedUserImages[userData.phoneNumber] = userData.userImage;
            }

            fetchedUserUids[userData.phoneNumber] = doc.id;
            fetchedUsernames[userData.phoneNumber] = userData.username;
          }
        });

        setUserPhoneNumbers(phoneNumbers);
        setUserImages(fetchedUserImages);
        setUserUids(fetchedUserUids);
        setUsernames(fetchedUsernames);
      });

    return () => unsubscribe();
  }, []);

  // New useEffect to call fetchContacts when userPhoneNumbers changes
  useEffect(() => {
    if (userPhoneNumbers.length > 0) {
      fetchContacts();
    }
  }, [userPhoneNumbers]);

  useEffect(() => {
  const user = auth().currentUser;
  if (user) {
    setCurrentUID(user.uid);
  }
}, []);

  const sectionedContacts = useMemo(() => {
    const filterContacts = contactList => {
      return contactList.filter(contact => {
        const name = `${contact.givenName} ${contact.familyName}`;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    };

    return [
      {
        title: 'Members',
        data: filterContacts(contacts.filter(contact => contact.isMember)),
      },
      {
        title: 'Non-Members',
        data: filterContacts(contacts.filter(contact => !contact.isMember)),
      },
    ];
  }, [contacts, searchTerm]);

  return (
    <>
      <StatusBar
        barStyle={
          theme.containerBackground === '#000'
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={theme.containerBackground}
      />
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <View
          style={[
            styles.toolbar,
            {backgroundColor: theme.containerBackground},
          ]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#7A7A7A" />
          </TouchableOpacity>
          {isSearchVisible ? (
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
              placeholder="Search..."
              autoFocus={true}
            />
          ) : (
            <Text style={styles.title}>All Contacts</Text>
          )}

          {
            // Step 3: Conditionally render Icon or ActivityIndicator
            isRefreshing ? (
              <ActivityIndicator size="large" color="#7A7A7A" />
            ) : (
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => fetchContacts(true)}>
                <Icon name="refresh" size={30} color="#7A7A7A" />
              </TouchableOpacity>
            )
          }
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              if (isSearchVisible) {
                setSearchTerm(''); // Clear the searchTerm when deactivating the search mode
              }
              setSearchVisibility(!isSearchVisible);
            }}>
            <Icon
              name={isSearchVisible ? 'close' : 'search'}
              size={30}
              color="#7A7A7A"
            />
          </TouchableOpacity>
        </View>

        {/* <FlatList */}
        <SectionList
          // data={filteredContacts}
          sections={sectionedContacts}
          keyExtractor={item => item.recordID}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          renderItem={({item}) => {
            const backgroundColor = contactColors[item.recordID];
            const name = `${item.givenName} ${item.familyName}`;
            // Extract the phone number from the item, then sanitize it
            const sanitizedPhoneNumber = sanitizePhoneNumber(
              item.phoneNumbers[0]?.number || '',
            );

            // Fetch the userImage from userImages using the sanitized phone number
            const userImage = userImages[sanitizedPhoneNumber];
            return (
              <TouchableOpacity  onPress={() => {
        if (item.isMember) {
          navigation.navigate('ChatDetails', {
            UID: currentUID,
            receiverUID: userUids[sanitizedPhoneNumber],
            user: usernames[sanitizedPhoneNumber],
            userImage: userImages[sanitizedPhoneNumber],
          });
        }
      }}
      activeOpacity={0.7}>
                <View style={styles.profileContainer}>
                  {item.thumbnailPath || userImage ? (
                    <TouchableOpacity
                      onPress={() =>
                        openImageModal(
                          userImage ? userImage : item.thumbnailPath,
                        )
                      }>
                      <Image
                        source={{
                          uri: userImage ? userImage : item.thumbnailPath,
                        }}
                        style={styles.profileImage}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.initialsContainer, {backgroundColor}]}>
                      <Text style={styles.initialsText}>
                        {item.givenName ? item.givenName.charAt(0) : ''}
                        {item.familyName ? item.familyName.charAt(0) : ''}
                      </Text>
                    </View>
                  )}

                  <HighlightedText text={name} highlight={searchTerm} />

                  {/* <Text style={[styles.profilePhone, {color: theme.text}]}>
                  {item.phoneNumbers && item.phoneNumbers[0]
                    ? item.phoneNumbers[0].number
                    : 'N/A'}
                </Text> */}
                  <View style={styles.border}></View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ScrollView
            style={styles.imageScrollView}
            contentContainerStyle={styles.imageScrollViewContent}
            maximumZoomScale={3}
            minimumZoomScale={1}
            centerContent={true}>
            <Image
              source={{uri: selectedImageUri}}
              style={styles.enlargedImage}
            />
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}>
            {/* <Text style={styles.closeButtonText}>Close</Text> */}
            <Icon name="close" size={30} color="#7A7A7A" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default AllContactsScreen;
