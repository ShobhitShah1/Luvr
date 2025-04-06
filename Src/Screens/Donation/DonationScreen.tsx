import React, { memo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import GradientView from '../../Common/GradientView';
import SubscriptionView from '../../Components/Subscription/SubscriptionView';

export const subscriptionData = {
  subscriptions: [
    {
      key: 'com.luvr.platinum.monthly',
      title: 'Platinum',
      description: 'This is a paid membership that includes all the features of Gold Membership plus additional perks.',
      price: '$45',
      popularityTag: 'Most popular',
      icon: 'ic_dark_heart_purple',
      colors: {
        light: {
          title: 'rgba(18, 18, 19, 1)',
          secondary: 'rgba(235, 235, 235, 1)',
          background: 'rgba(255, 255, 255, 1)',
          border: 'rgba(130, 130, 130, 1)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(255, 255, 255, 1)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          crownBackground: 'rgba(255, 255, 255, 1)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          gradientColors: ['rgba(240, 236, 255, 0.01)', 'rgba(240, 236, 255, 0.04)', 'rgba(240, 236, 255, 0.9)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'rgba(130, 130, 130, 1)',
        },
        dark: {
          title: 'rgba(255, 255, 255, 1)',
          secondary: 'rgba(43, 47, 59, 1)',
          background: 'rgba(35, 35, 36, 1)',
          border: 'rgba(219, 219, 219, 1)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(0, 0, 0, 0.5)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          crownBackground: 'rgba(17, 16, 16, 0.3)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          gradientColors: ['rgba(22, 3, 42, 0)', 'rgba(22, 3, 42, 0.88)', 'rgba(22, 3, 42, 1)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'transparent',
        },
      },
      benefits: [
        'All the features of free membership',
        'Incognito mode',
        'Ability to make yourself visible offline',
        'Hide yourself from users who signed up with your contact list',
        'Control who you see',
      ],
    },
    {
      key: 'com.luvr.gold.monthly',
      title: 'Gold',
      description: 'This is a paid membership that includes all the features of free membership plus additional perks.',
      price: '$45',
      popularityTag: 'Popular',
      icon: 'ic_dark_heart_gold_focus',
      colors: {
        light: {
          title: 'rgba(255, 184, 0, 1)',
          secondary: 'rgba(251, 239, 204, 1)',
          background: 'rgba(255, 255, 255, 1)',
          border: 'rgba(255, 215, 0, 0.5)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(255, 255, 255, 1)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          crownBackground: 'rgba(255, 255, 255, 1)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          gradientColors: ['rgba(240, 236, 255, 0.01)', 'rgba(240, 236, 255, 0.04)', 'rgba(240, 236, 255, 0.9)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'rgba(255, 215, 0, 0.5)',
        },
        dark: {
          title: 'rgba(255, 184, 0, 1)',
          secondary: 'rgba(43, 47, 59, 1)',
          background: 'rgba(35, 35, 36, 1)',
          border: 'rgba(255, 215, 0, 0.5)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(0, 0, 0, 0.5)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          crownBackground: 'rgba(17, 16, 16, 0.3)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          gradientColors: ['rgba(22, 3, 42, 0)', 'rgba(22, 3, 42, 0.88)', 'rgba(22, 3, 42, 1)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'transparent',
        },
      },
      benefits: [
        'All the features of free membership',
        'Chatting feature',
        'See who likes you',
        'Block user',
        'Top pick limit',
        'Share profile',
        'No advertisement',
        'See who is online',
      ],
    },
    {
      key: 'Free',
      title: 'Free',
      description: 'This is a paid membership that includes all the features of Gold Membership plus additional perks.',
      price: '$0',
      popularityTag: 'Most popular',
      icon: 'ic_dark_heart_purple',
      colors: {
        light: {
          title: 'rgba(157, 133, 240, 1)',
          secondary: 'rgba(240, 236, 255, 1)',
          background: 'rgba(255, 255, 255, 1)',
          border: 'rgba(157, 133, 240, 1)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(255, 255, 255, 1)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          crownBackground: 'rgba(255, 255, 255, 1)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          gradientColors: ['rgba(240, 236, 255, 0.01)', 'rgba(240, 236, 255, 0.04)', 'rgba(240, 236, 255, 0.9)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'rgba(157, 133, 240, 1)',
        },
        dark: {
          title: 'rgba(157, 133, 240, 1)',
          secondary: 'rgba(43, 47, 59, 1)',
          background: 'rgba(35, 35, 36, 1)',
          border: 'rgba(157, 133, 240, 1)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(0, 0, 0, 0.5)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          crownBackground: 'rgba(17, 16, 16, 0.3)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          gradientColors: ['rgba(22, 3, 42, 0)', 'rgba(22, 3, 42, 0.88)', 'rgba(22, 3, 42, 1)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'transparent',
        },
      },
      benefits: [
        'All the features of free membership',
        'Incognito mode',
        'Ability to make yourself visible offline',
        'Hide yourself from users who signed up with your contact list',
        'Control who you see',
      ],
    },
  ],
};

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState(subscriptionData.subscriptions[0].key);

  const handlePlanSelection = (planKey: any) => {
    setSelectedPlan(planKey);
  };

  return (
    <GradientView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SubscriptionView selectedPlan={selectedPlan} handlePlanSelection={handlePlanSelection} />
      </ScrollView>
    </GradientView>
  );
};

export default memo(SubscriptionScreen);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
});
