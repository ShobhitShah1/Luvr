/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import {CardDetailType} from '../../../Types/CardDetailType';
import CommonImages from '../../../Common/CommonImages';
import DetailCardHeader from './Components/DetailCardHeader';
import {DummyImage} from '../../../Config/Setting';
import ApiConfig from '../../../Config/ApiConfig';

type DetailCardRouteParams = {
  props: CardDetailType;
};

// const screenWidth = Dimensions.get('window').width;

const ExploreCardDetailScreen = () => {
  // const carouselWidth = screenWidth * 0.9;
  const CardDetail =
    useRoute<RouteProp<Record<string, DetailCardRouteParams>, string>>();

  const item = CardDetail.params.props || {};
  console.log('item', item);
  return (
    <View style={styles.Container}>
      <DetailCardHeader props={item} />
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.White} />

      <View style={styles.ContentView}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollViewContentContainerStyle}>
          <View style={styles.ProfileImageView}>
            <Image
              resizeMode="cover"
              style={{width: '100%', height: 350}}
              source={{
                uri: item?.recent_pik
                  ? `${ApiConfig.IMAGE_BASE_URL}${item.recent_pik[0]}`
                  : DummyImage,
              }}
            />
          </View>

          {/* About Me */}
          <View style={styles.DetailBoxContainerView}>
            <View style={styles.TitleAndIconView}>
              <Image
                style={styles.DetailIconsView}
                resizeMode="contain"
                source={CommonIcons.about_me_icon}
              />
              <Text style={styles.TitleText} numberOfLines={1}>
                About me
              </Text>
            </View>
            <Text style={styles.DetailText}>{item.bio || 'Write BIO'}</Text>
          </View>

          {/* Birthday */}
          <View style={styles.DetailBoxContainerView}>
            <View style={styles.TitleAndIconView}>
              <Image
                style={styles.DetailIconsView}
                resizeMode="contain"
                source={CommonIcons.birthday_icon}
              />
              <Text style={styles.TitleText} numberOfLines={1}>
                Birthday
              </Text>
            </View>
            <Text style={styles.DetailText}>{item.birthdate || 0}</Text>
          </View>

          {/* Looking for */}
          <View style={styles.DetailBoxContainerView}>
            <View style={styles.TitleAndIconView}>
              <Image
                style={styles.DetailIconsView}
                resizeMode="contain"
                source={CommonIcons.looking_for_icon}
              />
              <Text style={styles.TitleText} numberOfLines={1}>
                Looking for
              </Text>
            </View>
            <Text style={styles.DetailText}>{item?.hoping}</Text>
          </View>

          {/* Interested in */}
          {/* {item?.magical_person.length !== 0 && (
            <View style={styles.DetailBoxContainerView}>
              <View style={styles.TitleAndIconView}>
                <Image
                  style={styles.DetailIconsView}
                  resizeMode="contain"
                  source={CommonIcons.interested_in_icon}
                />
                <Text style={styles.TitleText} numberOfLines={1}>
                  Interested in
                </Text>
              </View>
              <View style={styles.MultipleBoxFlexView}>
                {item?.magical_person &&
                  item?.magical_person?.map((interestedInItem, index) => {
                    return (
                      <View key={index} style={styles.MultipleBoxView}>
                        <Text style={styles.MultipleDetailText} key={index}>
                          {`${interestedInItem}` || 'ERROR 404'}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          )} */}

          {/* Location */}
          <View style={styles.DetailBoxContainerView}>
            <View style={styles.TitleAndIconView}>
              <Image
                style={styles.DetailIconsView}
                resizeMode="contain"
                source={CommonIcons.location_icon}
              />
              <Text style={styles.TitleText} numberOfLines={1}>
                Location
              </Text>
            </View>
            <Text style={styles.DetailText}>{item?.city || 'City'}</Text>
          </View>

          {/* Education */}
          <View style={styles.DetailBoxContainerView}>
            <View style={styles.TitleAndIconView}>
              <Image
                style={styles.DetailIconsView}
                resizeMode="contain"
                source={CommonIcons.education_icon}
              />
              <Text style={styles.TitleText} numberOfLines={1}>
                Education
              </Text>
            </View>
            <Text style={styles.DetailText}>
              {item.education?.college_name || 'Error 404'},{' '}
              {item.education?.digree || 'Error 404'}
            </Text>
          </View>

          {/* I like */}
          <View style={styles.DetailBoxContainerView}>
            <View style={styles.TitleAndIconView}>
              <Image
                style={styles.DetailIconsView}
                resizeMode="contain"
                source={CommonIcons.i_like_icon}
              />
              <Text style={styles.TitleText} numberOfLines={1}>
                I like
              </Text>
            </View>
            <View style={styles.MultipleBoxFlexView}>
              {item?.likes_into &&
                item?.likes_into?.map((ILikeItem, index) => {
                  return (
                    <View key={index} style={styles.MultipleBoxView}>
                      <Text style={styles.MultipleDetailText} key={index}>
                        {`${ILikeItem}` || 'ERROR 404'}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>

          {/* Block And Report Profile */}
          <View style={styles.BlockAndReportProfileView}>
            {/* Block Profile */}
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={styles.BlockAndReportButtonView}>
              <Image
                resizeMode="contain"
                style={styles.BlockAndReportIcon}
                source={CommonIcons.block_profile_icon}
              />
              <Text style={styles.BlockAndReportText}>Block Profile</Text>
            </TouchableOpacity>

            {/* Report Profile */}
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={styles.BlockAndReportButtonView}>
              <Image
                resizeMode="contain"
                style={styles.BlockAndReportIcon}
                source={CommonIcons.report_profile_icon}
              />
              <Text style={styles.BlockAndReportText}>Report Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Like And Reject View */}
          <View style={styles.LikeAndRejectView}>
            {/* Reject Button */}
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={styles.LikeAndRejectButtonView}>
              <Image
                resizeMode="contain"
                style={styles.DislikeButton}
                source={CommonIcons.dislike_button}
              />
            </TouchableOpacity>

            {/* Like Button */}
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={styles.LikeAndRejectButtonView}>
              <Image
                resizeMode="contain"
                style={styles.LikeButton}
                source={CommonIcons.like_button}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ExploreCardDetailScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  ImageCarousel: {
    alignSelf: 'center',
    borderRadius: hp('4%'),
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  ContentView: {
    width: '100%',
    alignSelf: 'center',
  },
  ScrollViewContentContainerStyle: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: hp('10%'),
  },
  ProfileImageView: {
    width: '100%',
    height: 350,
    borderRadius: 25,
    overflow: 'hidden',
    marginVertical: 10,
    marginTop: 15,
  },
  DetailBoxContainerView: {
    width: '100%',
    borderRadius: hp('4%'),
    marginVertical: hp('1%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: hp('2%'),
    backgroundColor: COLORS.White,
  },
  TitleAndIconView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DetailIconsView: {
    width: hp('2.6%'),
    height: hp('2.6%'),
  },
  TitleText: {
    ...GROUP_FONT.h3,
    justifyContent: 'center',
    paddingHorizontal: hp('0.7%'),
  },
  DetailText: {
    fontFamily: FONTS.Regular,
    fontSize: hp('1.8%'),
    width: '91.5%',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
    color: 'rgba(130, 130, 130, 1)',
  },
  MultipleBoxFlexView: {
    flexDirection: 'row',
    width: '92.5%',
    alignSelf: 'flex-end',
  },
  MultipleBoxView: {
    marginTop: hp('1%'),
    borderRadius: hp('2%'),
    borderWidth: hp('0.15%'),
    borderColor: COLORS.Black,
    paddingHorizontal: hp('1.5%'),
    marginRight: hp('1%'),
  },
  MultipleDetailText: {
    fontFamily: FONTS.Regular,
    fontSize: hp('1.8%'),
    alignSelf: 'flex-end',
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
    color: 'rgba(108, 108, 108, 1)',
  },
  BlockAndReportProfileView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BlockAndReportButtonView: {
    width: '47%',
    overflow: 'hidden',
    height: hp('7.5%'),
    marginVertical: hp('2%'),
    borderRadius: hp('5%'),
    backgroundColor: COLORS.White,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.Black,
    paddingHorizontal: hp('1%'),
    marginHorizontal: hp('0.5%'),
  },
  BlockAndReportIcon: {
    width: hp('2.5%'),
    height: hp('2.5%'),
  },
  BlockAndReportText: {
    fontFamily: FONTS.Bold,
    color: COLORS.Black,
    fontSize: hp('1.9%'),
    marginHorizontal: hp('0.8%'),
  },
  LikeAndRejectView: {
    marginTop: hp('3%'),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  LikeAndRejectButtonView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  DislikeButton: {
    padding: 0,
    width: hp('10%'),
    height: hp('10%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LikeButton: {
    padding: 0,
    width: hp('13%'),
    height: hp('13%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
