import { TutorialStep } from './tutorial-context'

export const chatTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Chriki!',
    description: 'Let me show you around! Chriki is your Algerian AI assistant that speaks authentic Darija and understands your culture.',
    target: '[data-tutorial="chat-header"]',
    position: 'bottom',
    actionText: 'Ready to explore? Let\'s start the tour!',
    nextText: 'START TOUR'
  },
  {
    id: 'location-status',
    title: 'Location Services',
    description: 'This shows your location status. Enable it to get location-based assistance like finding nearby hospitals, restaurants, or banks.',
    target: '[data-tutorial="location-status"]',
    position: 'bottom',
    actionText: 'Try clicking "ENABLE" to allow location access!',
    action: 'click'
  },
  {
    id: 'message-input',
    title: 'Chat with Chriki',
    description: 'Type your message here in any language! Chriki understands Arabic, French, Darija, and English. Try mixing languages naturally!',
    target: '[data-tutorial="message-input"]',
    position: 'top',
    actionText: 'Try typing: "Salam! Kifach rak?" or "Where can I find good couscous?"',
    action: 'type'
  },

  {
    id: 'settings',
    title: 'Settings & Profile',
    description: 'Access your settings, profile, and preferences here. You can customize your experience and manage your account.',
    target: '[data-tutorial="settings-button"]',
    position: 'left',
    actionText: 'Click to explore settings and personalization options.'
  },
  {
    id: 'conversation-tips',
    title: 'Conversation Tips',
    description: 'Chriki works best when you chat naturally! Ask about Algerian culture, get local recommendations, or practice your Darija.',
    target: '[data-tutorial="chat-messages"]',
    position: 'right',
    actionText: 'Examples: "What\'s happening in Algiers today?" or "أين أفضل مطعم في وهران؟"'
  },
  {
    id: 'features-overview',
    title: 'What Chriki Can Do',
    description: 'Chriki can help with local knowledge, language learning, cultural questions, location services, and authentic Algerian conversations.',
    target: '[data-tutorial="chat-container"]',
    position: 'top',
    actionText: 'Try asking about Algerian traditions, local places, or practice speaking Darija!'
  },
  {
    id: 'tour-complete',
    title: 'You\'re All Set! 🎉',
    description: 'Welcome to the Chriki community! Start chatting and discover how Chriki understands your Algerian way of speaking. Bsahtek!',
    target: '[data-tutorial="chat-container"]',
    position: 'top',
    nextText: 'START CHATTING',
    skipable: false
  }
]
