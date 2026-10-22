/**
 * Web Speech API Voice Synthesizer for "KBC WITH ANSH ANAND".
 * Delivers deep, resonant baritone Hindi / Indian English voice announcements:
 * "Deviyon aur sajjanon...", "Computer ji, lock kiya jaye!", "Sahi Jawab! Aap jeet chuke hain... [amount]!"
 */

let speechEnabled = true;

// Helper to convert prize money into Hindi spoken phrasing
export function formatPrizeForHindiSpeech(prizeMoney: string): string {
  switch (prizeMoney) {
    case '₹1,000': return 'Ek Hazaar rupaye';
    case '₹2,000': return 'Do Hazaar rupaye';
    case '₹3,000': return 'Teen Hazaar rupaye';
    case '₹5,000': return 'Paanch Hazaar rupaye';
    case '₹10,000': return 'Dus Hazaar rupaye';
    case '₹20,000': return 'Bees Hazaar rupaye';
    case '₹40,000': return 'Chaalees Hazaar rupaye';
    case '₹80,000': return 'Assi Hazaar rupaye';
    case '₹1,60,000': return 'Ek Laakh Saath Hazaar rupaye';
    case '₹3,20,000': return 'Teen Laakh Bees Hazaar rupaye';
    case '₹6,40,000': return 'Chheh Laakh Chaalees Hazaar rupaye';
    case '₹12,50,000': return 'Baarah Laakh Pachaas Hazaar rupaye';
    case '₹25,00,000': return 'Pachchees Laakh rupaye';
    case '₹50,00,000': return 'Pachaas Laakh rupaye';
    case '₹1,00,00,000': return 'Ek Crore rupaye';
    case '₹7,00,00,000': return 'Saat Crore rupaye';
    case '₹0': return 'Shunya rupaye';
    default: return prizeMoney.replace('₹', '') + ' rupaye';
  }
}

function speakText(text: string, pitch = 0.84, rate = 0.90) {
  if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize deep natural Indian voice
    const preferredVoice = voices.find(v => 
      (v.lang === 'hi-IN' || v.lang.startsWith('hi')) && !v.name.includes('Google female')
    ) || voices.find(v => 
      v.lang === 'en-IN' || v.name.includes('India') || v.name.includes('Hindi')
    ) || voices.find(v => v.lang.startsWith('en')) || null;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export const speechManager = {
  isEnabled: () => speechEnabled,
  setEnabled: (enabled: boolean) => {
    speechEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
  toggleEnabled: () => {
    speechEnabled = !speechEnabled;
    if (!speechEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return speechEnabled;
  },

  // Show intro
  announceShowIntro: () => {
    speakText("Deviyon aur sajjanon, main Ansh Anand, swagat karta hoon aapka KBC WITH ANSH ANAND mein! Chaliye shuru karte hain!");
  },

  // Lock confirmation
  announceLockPrompt: (optionLetter: string) => {
    speakText(`Computer ji, Option ${optionLetter} ko lock kiya jaye!`);
  },

  // Correct answer with amount
  announceCorrectAnswer: (prizeMoney: string, isPadhaav = false) => {
    const hindiAmount = formatPrizeForHindiSpeech(prizeMoney);
    if (isPadhaav) {
      speakText(`Sahi jawab! Shandaar! Aapne padhaav paar kar liya hai aur jeet chuke hain ${hindiAmount}! Computer ji inke naam ka digital cheque pesh kiya jaye!`);
    } else {
      speakText(`Sahi jawab! Shandaar! Aap jeet chuke hain... ${hindiAmount}!`);
    }
  },

  // Wrong answer
  announceWrongAnswer: (safeAmount: string) => {
    const hindiAmount = formatPrizeForHindiSpeech(safeAmount);
    speakText(`Afsos, yeh galat uttar hai. Lekin aapne behtareen khel dikhaya. Aap le ja rahe hain ${hindiAmount}.`);
  },

  // Walk Away
  announceWalkAway: (prizeMoney: string) => {
    const hindiAmount = formatPrizeForHindiSpeech(prizeMoney);
    speakText(`Bahut samajhdaari bhara faisla! Aap surakshit dhanraashi jeet chuke hain ${hindiAmount}!`);
  },

  // 7 Crore Jackpot
  announceJackpot: () => {
    speakText("Adbhut! Avismarniya! Itihaas rach diya aapne! Aap jeet chuke hain pure Saat Crore rupaye! Many congratulations, Crorepati!");
  },

  // Phone A Friend
  announcePhoneAFriend: () => {
    speakText("Chaliye aapke expert dost ko phone lagate hain. Shrimati Tik-tiki ji, samay shuru kijiye!");
  },

  // Fastest Finger First announcement
  announceFFFStart: () => {
    speakText("Fastest Finger First! Jo contestant sabse kam samay mein sahi kram lagayega, wahi aayega Ansh Anand ke saamne hotseat par!");
  },

  // Read Question text
  announceQuestion: (questionNumber: number, questionText: string) => {
    speakText(`Prashna sankhya ${questionNumber}. ${questionText}`);
  }
};
