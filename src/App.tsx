import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Sparkles,
  Brain,
  FileText,
  ChevronRight,
  ChevronLeft,
  Award,
  Search,
  Layers,
  FlaskConical,
  Loader2,
  AlertCircle,
  Check,
  Video,
  Globe,
  GraduationCap,
  Mic
} from 'lucide-react';

// ============================================================================
// SAFE REACT CHILD & ERROR BOUNDARY GUARD
// ============================================================================

function safeText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

class StudioErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || 'Unexpected rendering error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
            <h2 className="text-lg font-bold text-rose-400">Chemistry Studio View Recovered</h2>
            <p className="text-xs text-slate-400">{this.state.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
            >
              Reload Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// MULTILINGUAL TRANSLATIONS & SINGLE BOLD INDIAN MALE VOICE CONFIGURATION
// ============================================================================

type LangCode = 'en' | 'ta' | 'hi' | 'ml' | 'te' | 'kn';

interface LanguageOption {
  code: LangCode;
  name: string;
  nativeName: string;
  bcp47: string;
  ttsInstruction: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English (India)',
    nativeName: 'English (IN)',
    bcp47: 'en-IN',
    ttsInstruction:
      'You are ONE single senior Indian male chemistry professor from Chennai speaking in a deep, bold, authoritative Indian male accent voice. Do NOT say good morning, vanakkam, hello, or greetings. Jump straight into explaining every unit concept, reaction mechanism, equation, and law clearly with strong Indian male cadence:'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    bcp47: 'ta-IN',
    ttsInstruction:
      'நீங்கள் சென்னையைச் சேர்ந்த கம்பீரமான, தாழ்ந்த குரலில் பேசும் ஒரே ஒரு மூத்த ஆண் வேதியியல் பேராசிரியர். அமெரிக்க அல்லது பிரிட்டிஷ் உச்சரிப்பு பயன்படுத்த வேண்டாம். இந்தியத் தமிழ் உச்சரிப்பில், ஆண் கருவி குரலில், வணக்கம் இல்லாமல், அனைத்துப் பாடத்தைக் முழுவதும் தமிழிலேயே தெளிவாகப் பேசுங்கள்:'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    ttsInstruction:
      'आप एक वरिष्ठ पुरुष भारतीय रसायन विज्ञान प्रोफेसर हैं जो बुलंद, स्पष्ट और दमदार पुरुष भारतीय उच्चारण में बोलते हैं। नमस्ते या सुप्रभात जैसे अभिवादन न कहें। हर इकाई की रासायनिक अवधारणा, अभिक्रिया, समीकरण और नियम को सीधे और स्पष्ट रूप से समझाएं:'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    bcp47: 'ml-IN',
    ttsInstruction:
      'നിങ്ങൾ ഗംഭീരവും ശക്തവുമായ പുരുഷ ഇന്ത്യൻ ഉച്ചാരണത്തിൽ സംസാരിക്കുന്ന ഒരൊറ്റ മുതിർന്ന പുരുഷ രസതന്ത്ര പ്രൊഫസറാണ്. നമസ്കാരം അല്ലെങ്കിൽ സുപ്രഭാതം എന്ന് പറയരുത്. എല്ലാ യൂണിറ്റുകളുടെയും രാസ ആശയവും സമവാക്യവും നിയമവും നേരിട്ട് വ്യക്തമായി വിശദീകരിക്കുക:'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    bcp47: 'te-IN',
    ttsInstruction:
      'మీరు గంభీరమైన, స్పష్టమైన పురుష భారతీయ ఉచ్చారణతో మాట్లాడే ఒక సీనియర్ పురుష రసాయన శాస్త్ర ప్రొఫెసర్. నమస్కారం లేదా శుభోదయం అని చెప్పకండి. ప్రతి యూనిట్ యొక్క రసాయన భావన, సమీకరణం మరియు నియమాన్ని నేరుగా స్పష్టంగా వివరించండి:'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    bcp47: 'kn-IN',
    ttsInstruction:
      'ನೀವು ಗಂಭೀರವಾದ ಮತ್ತು ಸ್ಪಷ್ಟವಾದ ಪುರುಷ ಭಾರತೀಯ ಉಚ್ಚಾರಣೆಯಲ್ಲಿ ಮಾತನಾಡುವ ಒಬ್ಬ ಹಿರಿಯ ಪುರುಷ ರಸಾಯನಶಾಸ್ತ್ರ ಪ್ರಾಧ್ಯಾಪಕರು. ನಮಸ್ಕಾರ ಅಥವಾ ಶುಭೋದಯ ಎಂದು ಹೇಳಬೇಡಿ. ಪ್ರತಿಯೊಂದು ಘಟಕದ ರಾಸಾಯನಿಕ ಪರಿಕಲ್ಪನೆ, ಸಮೀಕರಣ ಮತ್ತು ನಿಯಮವನ್ನು ನೇರವಾಗಿ ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ:'
  }
];

const UI_STRINGS: Record<
  LangCode,
  {
    appSubtitle: string;
    tabStudio: string;
    tabSyllabus: string;
    tabPractice: string;
    tabPast: string;
    syllabusMastery: string;
    studioHeader: string;
    studioSub: string;
    topicLabel: string;
    generateBtn: string;
    generatingBtn: string;
    watchLesson: string;
    syllabusHeader: string;
    syllabusSub: string;
    practiceHeader: string;
    pastHeader: string;
    askTutorTitle: string;
    solveBtn: string;
  }
> = {
  en: {
    appSubtitle: 'TN Class 12 (+2) Samacheer Kalvi Chemistry AI',
    tabStudio: 'AI Video Studio',
    tabSyllabus: 'All 15 Units Syllabus',
    tabPractice: 'Practice',
    tabPast: 'HSC Board Papers',
    syllabusMastery: 'Class 12 Mastery',
    studioHeader: 'TN Class 12 (+2) State Board Chemistry AI Video Studio',
    studioSub: 'Complete 15-Unit animated molecular & reaction video lessons with single bold Indian male professor voice.',
    topicLabel: 'TN Class 12 Samacheer Kalvi Chemistry Unit, Lesson, Reaction or Concept',
    generateBtn: 'Generate AI Video Lesson',
    generatingBtn: 'Preparing Video & Male Audio...',
    watchLesson: 'Explain in AI Video',
    syllabusHeader: 'Tamil Nadu Government Class 12 (+2) Chemistry Full Syllabus',
    syllabusSub: 'Complete Samacheer Kalvi Higher Secondary Second Year curriculum: Volume 1 (Units 1–7) & Volume 2 (Units 8–15) — Every Lesson Covered.',
    practiceHeader: 'TN Class 12 Chemistry Practice Arena',
    pastHeader: 'TN Class 12 (+2) HSC Chemistry Public Exam Archive',
    askTutorTitle: 'Ask Avichi ChemNova AI (Class 12)',
    solveBtn: 'Explain Step-by-Step'
  },
  ta: {
    appSubtitle: '12-ஆம் வகுப்பு சமச்சீர் கல்வி வேதியியல் AI',
    tabStudio: 'AI வீடியோ பாடம்',
    tabSyllabus: '15 அலகுகள் பாடத்திட்டம்',
    tabPractice: 'பயிற்சி வினாக்கள்',
    tabPast: 'பொதுத்தேர்வு வினாக்கள்',
    syllabusMastery: 'பாடத்திட்ட தேர்ச்சி',
    studioHeader: 'தமிழ்நாடு 12-ஆம் வகுப்பு (+2) சமச்சீர் கல்வி வேதியியல் AI வீடியோ வகுப்பறை',
    studioSub: 'கம்பீரமான ஆண் இந்திய குரல் விளக்கத்துடன் கூடிய 15 அலகுகள் அனிமேஷன் வேதியியல் பாடங்கள்.',
    topicLabel: '12-ஆம் வகுப்பு வேதியியல் அலகு, பாடம் அல்லது வினையைத் தேர்ந்தெடுக்கவும்',
    generateBtn: 'AI வீடியோ பாடம் உருவாக்கு',
    generatingBtn: 'வீடியோ & ஆண் குரல் தயாராகிறது...',
    watchLesson: 'AI வீடியோவில் விளக்கு',
    syllabusHeader: 'தமிழ்நாடு அரசு 12-ஆம் வகுப்பு (+2) வேதியியல் முழுப் பாடத்திட்டம்',
    syllabusSub: 'தொகுதி 1 (அலகுகள் 1–7) மற்றும் தொகுதி 2 (அலகுகள் 8–15) அனைத்துப் பாடங்களும்.',
    practiceHeader: '12-ஆம் வகுப்பு வேதியியல் பயிற்சி அரங்கம்',
    pastHeader: '12-ஆம் வகுப்பு (+2) வேதியியல் பொதுத்தேர்வு வினாத்தாள்கள்',
    askTutorTitle: 'Avichi ChemNova AI ஆசிரியரிடம் கேளுங்கள்',
    solveBtn: 'படிப்படியாக விளக்கவும்'
  },
  hi: {
    appSubtitle: 'TN कक्षा 12 (+2) समचीर कल्वी रसायन विज्ञान AI',
    tabStudio: 'AI वीडियो स्टूडियो',
    tabSyllabus: 'सभी 15 इकाइयां पाठ्यक्रम',
    tabPractice: 'अभ्यास प्रश्न',
    tabPast: 'HSC बोर्ड परीक्षा पत्र',
    syllabusMastery: 'कक्षा 12 प्रगति',
    studioHeader: 'तमिलनाडु कक्षा 12 (+2) स्टेट बोर्ड रसायन विज्ञान AI वीडियो स्टूडियो',
    studioSub: 'एकल बुलंद पुरुष भारतीय आवाज और लाइव रासायनिक एनीमेशन के साथ सभी 15 इकाइयों के वीडियो पाठ।',
    topicLabel: 'कक्षा 12 रसायन विज्ञान इकाई, अध्याय या अभिक्रिया दर्ज करें',
    generateBtn: 'AI वीडियो पाठ बनाएं',
    generatingBtn: 'वीडियो और पुरुष ऑडियो तैयार हो रहा है...',
    watchLesson: 'AI वीडियो में समझाएं',
    syllabusHeader: 'तमिलनाडु कक्षा 12 (+2) रसायन विज्ञान संपूर्ण पाठ्यक्रम',
    syllabusSub: 'संपूर्ण समचीर कल्वी पाठ्यक्रम: खंड 1 (इकाई 1–7) और खंड 2 (इकाई 8–15) — हर पाठ शामिल।',
    practiceHeader: 'कक्षा 12 रसायन अभ्यास क्षेत्र',
    pastHeader: 'कक्षा 12 (+2) रसायन बोर्ड परीक्षा प्रश्न पत्र',
    askTutorTitle: 'Avichi ChemNova AI शिक्षक से पूछें',
    solveBtn: 'चरण-दर-चरण समझाएं'
  },
  ml: {
    appSubtitle: 'TN ക്ലാസ് 12 (+2) സമച്ചീർ കൽവി കെമിസ്ട്രി AI',
    tabStudio: 'AI വീഡിയോ സ്റ്റുഡിയോ',
    tabSyllabus: '15 യൂണിറ്റുകൾ സിലബസ്',
    tabPractice: 'പരിശീലനം',
    tabPast: 'HSC ബോർഡ് പരീക്ഷകൾ',
    syllabusMastery: 'പഠന പുരോഗതി',
    studioHeader: 'തമിഴ്നാട് ക്ലാസ് 12 (+2) സ്റ്റേറ്റ് ബോർഡ് കെമിസ്ട്രി AI വീഡിയോ സ്റ്റുഡിയോ',
    studioSub: 'ഒരൊറ്റ ഗംഭീരമായ പുരുഷ ഇന്ത്യൻ ശബ്ദവിവരണത്തോടുകൂടിയ 15 യൂണിറ്റുകളുടെ രസതന്ത്ര വീഡിയോ ക്ലാസുകൾ.',
    topicLabel: 'ക്ലാസ് 12 കെമിസ്ട്രി യൂണിറ്റ് അല്ലെങ്കിൽ പാഠം നൽകുക',
    generateBtn: 'AI വീഡിയോ പാഠം നിർമ്മിക്കുക',
    generatingBtn: 'വീഡിയോയും ശബ്ദവും തയ്യാറാക്കുന്നു...',
    watchLesson: 'AI വീഡിയോ കാണുക',
    syllabusHeader: 'തമിഴ്നാട് ക്ലാസ് 12 (+2) കെമിസ്ട്രി സമ്പൂർണ്ണ സിലബസ്',
    syllabusSub: 'സമ്പൂർണ്ണ സമച്ചീർ കൽവി സിലബസ്: വാല്യം 1 (യൂണിറ്റ് 1–7), വാല്യം 2 (യൂണിറ്റ് 8–15).',
    practiceHeader: 'ക്ലാസ് 12 കെമിസ്ട്രി പരിശീലന ചോദ്യങ്ങൾ',
    pastHeader: 'മുൻവർഷ HSC കെമിസ്ട്രി ചോദ്യപേപ്പറുകൾ',
    askTutorTitle: 'Avichi ChemNova AI അധ്യാപകനോട് ചോദിക്കുക',
    solveBtn: 'ഘട്ടം ഘട്ടമായി വിശദീകരിക്കുക'
  },
  te: {
    appSubtitle: 'TN క్లాస్ 12 (+2) సమచీర్ కల్వి కెమిస్ట్రీ AI',
    tabStudio: 'AI వీడియో స్టూడియో',
    tabSyllabus: '15 యూనిట్ల సిలబస్',
    tabPractice: 'ప్రాక్టీస్',
    tabPast: 'HSC బోర్డ్ పేపర్లు',
    syllabusMastery: 'సిలబస్ పురోగతి',
    studioHeader: 'తమిళనాడు క్లాస్ 12 (+2) స్టేట్ బోర్డ్ కెమిస్ట్రీ AI వీడియో స్టూడియో',
    studioSub: 'ఒకే గంభీరమైన పురుష భారతీయ స్వరంతో కూడిన 15 యూనిట్ల యానిమేటెడ్ కెమిస్ట్రీ పాఠాలు.',
    topicLabel: 'క్లాస్ 12 కెమిస్ట్రీ యూనిట్ లేదా పాఠాన్ని నమోదు చేయండి',
    generateBtn: 'AI వీడియో పాఠం రూపొందించండి',
    generatingBtn: 'వీడియో & ఆడియో సిద్ధమవుతోంది...',
    watchLesson: 'AI వీడియో చూడండి',
    syllabusHeader: 'తమిళనాడు క్లాస్ 12 (+2) కెమిస్ట్రీ పూర్తి సిలబస్',
    syllabusSub: 'పూర్తి సమచీర్ కల్వి సిలబస్: వాల్యూమ్ 1 (యూనిట్లు 1–7) & వాల్యూమ్ 2 (యూనిట్లు 8–15).',
    practiceHeader: 'క్లాస్ 12 కెమిస్ట్రీ అభ్యాస ప్రశ్నలు',
    pastHeader: 'గత HSC కెమిస్ట్రీ బోర్డు పరీక్ష ప్రశ్నాపత్రాలు',
    askTutorTitle: 'Avichi ChemNova AI గురువును అడగండి',
    solveBtn: 'దశలవారీగా వివరించండి'
  },
  kn: {
    appSubtitle: 'TN ಕ್ಲಾಸ್ 12 (+2) ಸಮಚೀರ್ ಕಲ್ವಿ ರಸಾಯನಶಾಸ್ತ್ರ AI',
    tabStudio: 'AI ವೀಡಿಯೊ ಸ್ಟುಡಿಯೋ',
    tabSyllabus: '15 ಘಟಕಗಳ ಪಠ್ಯಕ್ರಮ',
    tabPractice: 'ಅಭ್ಯಾಸ',
    tabPast: 'HSC ಬೋರ್ಡ್ ಪತ್ರಿಕೆಗಳು',
    syllabusMastery: 'ಪಠ್ಯಕ್ರಮ ಪ್ರಗತಿ',
    studioHeader: 'ತಮಿಳುನಾಡು ಕ್ಲಾಸ್ 12 (+2) ಸ್ಟೇಟ್ ಬೋರ್ಡ್ ಕೆಮಿಸ್ಟ್ರಿ AI ವೀಡಿಯೊ ಸ್ಟುಡಿಯೋ',
    studioSub: 'ಒಂದೇ ಗಂಭೀರವಾದ ಪುರುಷ ಭಾರತೀಯ ಧ್ವನಿಯೊಂದಿಗೆ 15 ಘಟಕಗಳ ಸಂವಾದಾತ್ಮಕ ರಸಾಯನಶಾಸ್ತ್ರ ಪಾಠಗಳು.',
    topicLabel: 'ಕ್ಲಾಸ್ 12 ಕೆಮಿಸ್ಟ್ರಿ ಘಟಕ ಅಥವಾ ಪಾಠವನ್ನು ನಮೂದಿಸಿ',
    generateBtn: 'AI ವೀಡಿಯೊ ಪಾಠ ರಚಿಸಿ',
    generatingBtn: 'ವೀಡಿಯೊ ಮತ್ತು ಆಡಿಯೊ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...',
    watchLesson: 'AI ವೀಡಿಯೊ ವೀಕ್ಷಿಸಿ',
    syllabusHeader: 'ತಮಿಳುನಾಡು ಕ್ಲಾಸ್ 12 (+2) ರಸಾಯನಶಾಸ್ತ್ರ ಪೂರ್ಣ ಪಠ್ಯಕ್ರಮ',
    syllabusSub: 'ಸಂಪೂರ್ಣ ಸಮಚೀರ್ ಕಲ್ವಿ ಪಠ್ಯಕ್ರಮ: ಸಂಪುಟ 1 (ಘಟಕ 1–7) ಮತ್ತು ಸಂಪುಟ 2 (ಘಟಕ 8–15).',
    practiceHeader: 'ಕ್ಲಾಸ್ 12 ಕೆಮಿಸ್ಟ್ರಿ ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು',
    pastHeader: 'ಹಿಂದಿನ HSC ಕೆಮಿಸ್ಟ್ರಿ ಬೋರ್ಡ್ ಪರೀಕ್ಷಾ ಪತ್ರಿಕೆಗಳು',
    askTutorTitle: 'Avichi ChemNova AI ಶಿಕ್ಷಕರನ್ನು ಕೇಳಿ',
    solveBtn: 'ಹಂತ-ಹಂತವಾಗಿ ವಿವರಿಸಿ'
  }
};

// ============================================================================
// COMPLETE TAMIL NADU STATE BOARD (SAMACHEER KALVI) CLASS 12 (+2) CHEMISTRY
// ALL 15 UNITS & ALL LESSONS (VOLUME 1: UNITS 1-7 & VOLUME 2: UNITS 8-15)
// ============================================================================

type VolumeFilter = 'all' | 'Volume 1' | 'Volume 2';

interface Topic {
  id: string;
  title: string;
  tamilTitle: string;
  description: string;
  subTopics: string[];
  keyFormulas: string[];
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
}

interface Unit {
  id: string;
  grade: '12';
  volume: 'Volume 1' | 'Volume 2';
  number: number;
  title: string;
  tamilTitle: string;
  topics: Topic[];
}

interface PracticeQuestion {
  id: string;
  grade: '12';
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface PastQuestion {
  id: string;
  grade: '12';
  year: number;
  paper: string;
  topic: string;
  marks: number;
  question: string;
  solutionSteps: string[];
  finalAnswer: string;
}

const TN_CHEMISTRY_SYLLABUS: Unit[] = [
  // ==================== VOLUME 1 (UNITS 1 TO 7) ====================
  {
    id: 'tn12-ch1',
    grade: '12',
    volume: 'Volume 1',
    number: 1,
    title: 'Metallurgy',
    tamilTitle: 'உலோகவியல்',
    topics: [
      {
        id: 'tn12-c1-t1',
        title: 'Complete Unit 1: Concentration, Extraction, Ellingham Diagram & Refining of Metals',
        tamilTitle: 'செறிவூட்டல், பிரித்தெடுத்தல், எல்லிங்கம் வரைபடம் மற்றும் சுத்திகரிப்பு',
        description:
          'Minerals vs ores, gravity separation, froth flotation, leaching (cyanide, ammonia, alkali, acid), magnetic separation, roasting & calcination, smelting, Ellingham diagram applications, electrochemical extraction of aluminium (Hall-Heroult), and refining (distillation, liquation, electrolytic, zone refining, Mond & van Arkel processes).',
        subTopics: [
          '1.1–1.2 Occurrence of Metals & Concentration of Ores (Froth Flotation, Leaching, Magnetic Separation)',
          '1.3 Extraction of Crude Metal: Calcination, Roasting, Smelting & Aluminothermic Reduction',
          '1.4 Thermodynamic Principles of Metallurgy & Ellingham Diagram Observations',
          '1.5–1.6 Electrochemical Extraction (Hall–Héroult) & Refining (Zone, Mond, van Arkel)'
        ],
        keyFormulas: ['ΔG° = ΔH° - TΔS°', 'Ni(s) + 4CO(g) ⇌ Ni(CO)₄(g)', 'TiI₄(g) → Ti(s) + 2I₂(g) (1800 K)'],
        difficulty: 'Intermediate',
        estimatedMinutes: 30
      }
    ]
  },
  {
    id: 'tn12-ch2',
    grade: '12',
    volume: 'Volume 1',
    number: 2,
    title: 'p-Block Elements - I',
    tamilTitle: 'p - தொகுதி தனிமங்கள் - I',
    topics: [
      {
        id: 'tn12-c2-t1',
        title: 'Complete Unit 2: Group 13 (Boron Family) & Group 14 (Carbon Family)',
        tamilTitle: 'தொகுதி 13 (போரான்) மற்றும் தொகுதி 14 (கார்பன்) தனிமங்கள்',
        description:
          'General trends in p-block elements, inert pair effect, anomalous properties of boron, borax & borax bead test, boric acid structure, diborane (3c-2e banana bond), boron trifluoride, alum, catenation & allotropes of carbon, CO, CO₂, silicates (ortho, pyro, cyclic, chain, sheet, 3D), silicones, and zeolites.',
        subTopics: [
          '2.1 General Trends, Inert Pair Effect & Anomalous Nature of Boron',
          '2.2 Compounds of Boron: Borax, Boric Acid, Diborane (B₂H₆), BF₃ & Potash Alum',
          '2.3 Group 14 Carbon Family: Catenation, Allotropes (Diamond, Graphite, Fullerene, Graphene)',
          '2.4 Carbon Monoxide, Carbon Dioxide, Silicates Classification, Silicones & Zeolites'
        ],
        keyFormulas: ['Na₂B₄O₇·10H₂O', 'B₂H₆ (Two 3c-2e B-H-B bridges)', 'K₂SO₄·Al₂(SO₄)₃·24H₂O'],
        difficulty: 'Intermediate',
        estimatedMinutes: 30
      }
    ]
  },
  {
    id: 'tn12-ch3',
    grade: '12',
    volume: 'Volume 1',
    number: 3,
    title: 'p-Block Elements - II',
    tamilTitle: 'p - தொகுதி தனிமங்கள் - II',
    topics: [
      {
        id: 'tn12-c3-t1',
        title: 'Complete Unit 3: Group 15 (Nitrogen), Group 16 (Oxygen), Group 17 (Halogens) & Group 18 (Noble Gases)',
        tamilTitle: 'நைட்ரஜன், ஆக்ஸிஜன், ஆலஜன்கள் மற்றும் மந்த வாயுக்கள்',
        description:
          'Nitrogen preparation & Haber ammonia, Ostwald nitric acid & oxides of nitrogen, phosphorus allotropes, PH₃, PCl₃, PCl₅ & oxoacids of phosphorus; oxygen, ozone, sulfur allotropes, SO₂, Contact process H₂SO₄ & oxoacids of sulfur; chlorine, Deacon process, bleaching powder, HCl, interhalogens & oxoacids of halogens; noble gases & xenon fluorides/oxyfluorides.',
        subTopics: [
          '3.1 Group 15: Nitrogen, Ammonia, Ostwald HNO₃, Oxides & Oxoacids of Phosphorus',
          '3.2 Group 16: Oxygen, Ozone, Sulfur Allotropes, SO₂ & Contact Process for H₂SO₄',
          '3.3 Group 17: Chlorine, Bleaching Powder, Interhalogen Compounds & Oxoacids of Halogens',
          '3.4 Group 18: Inert Gases Electronic Configuration, Xenon Compounds (XeF₂, XeF₄, XeF₆, XeOF₄)'
        ],
        keyFormulas: ['4NH₃ + 5O₂ → 4NO + 6H₂O', '2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅)', 'Ca(OCl)Cl (Bleaching Powder)'],
        difficulty: 'Advanced',
        estimatedMinutes: 35
      }
    ]
  },
  {
    id: 'tn12-ch4',
    grade: '12',
    volume: 'Volume 1',
    number: 4,
    title: 'Transition and Inner Transition Elements',
    tamilTitle: 'இடைநிலை மற்றும் உள் இடைநிலைத் தனிமங்கள்',
    topics: [
      {
        id: 'tn12-c4-t1',
        title: 'Complete Unit 4: d-Block (3d, 4d, 5d Series) & f-Block (Lanthanoids & Actinoids)',
        tamilTitle: 'd-தொகுதி தனிமங்கள், K₂Cr₂O₇, KMnO₄, லாந்தனைடுகள் மற்றும் ஆக்டினைடுகள்',
        description:
          'Position in periodic table, electronic configuration, metallic character, atomic/ionic radii, ionization enthalpy, variable oxidation states, standard electrode potentials, magnetic properties (μ = √n(n+2)), catalytic properties, alloy & interstitial compounds, K₂Cr₂O₇ & KMnO₄ preparation & oxidizing reactions, lanthanoid contraction, and actinoids.',
        subTopics: [
          '4.1–4.2 d-Block General Properties: Oxidation States, Magnetic Moment, Colour & Catalysts',
          '4.3 Potassium Dichromate (K₂Cr₂O₇) & Potassium Permanganate (KMnO₄) Preparation & Reactions',
          '4.4 Inner Transition Elements (f-Block): Lanthanoids & Lanthanoid Contraction Causes/Effects',
          '4.5 Actinoids: Oxidation States, Comparison between Lanthanoids and Actinoids'
        ],
        keyFormulas: ['μ = √[n(n + 2)] BM', 'Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O', 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O'],
        difficulty: 'Intermediate',
        estimatedMinutes: 30
      }
    ]
  },
  {
    id: 'tn12-ch5',
    grade: '12',
    volume: 'Volume 1',
    number: 5,
    title: 'Coordination Chemistry',
    tamilTitle: 'அணைவு வேதியியல்',
    topics: [
      {
        id: 'tn12-c5-t1',
        title: 'Complete Unit 5: Werner’s Theory, IUPAC Nomenclature, Isomerism, VBT, CFT & Stability',
        tamilTitle: 'வெர்னரின் கொள்கை, IUPAC பெயரிடுதல், மாற்றியம், VBT மற்றும் CFT',
        description:
          'Double salts vs coordination compounds, Werner’s primary & secondary valency, coordination sphere, ligands & denticity, IUPAC naming rules, structural isomerism (linkage, coordination, ionization, solvate) & stereoisomerism (geometrical & optical), Valence Bond Theory (VBT), Crystal Field Theory (CFT, Δₒ & Δₜ), spectrochemical series, colour, metal carbonyls & biological importance.',
        subTopics: [
          '5.1–5.3 Werner’s Theory, Terms in Coordination Chemistry & IUPAC Nomenclature',
          '5.4 Isomerism in Coordination Compounds: Structural & Stereoisomerism (Geometrical & Optical)',
          '5.5 Theories of Coordination Compounds: Valence Bond Theory (VBT) & Limitations',
          '5.6–5.8 Crystal Field Theory (CFT), Colour, Metal Carbonyls & Applications'
        ],
        keyFormulas: ['Δₜ = (4/9) Δₒ', 'CFSE = [-0.4 t₂g + 0.6 eg] Δₒ', '[Co(NH₃)₆]Cl₃'],
        difficulty: 'Advanced',
        estimatedMinutes: 32
      }
    ]
  },
  {
    id: 'tn12-ch6',
    grade: '12',
    volume: 'Volume 1',
    number: 6,
    title: 'Solid State',
    tamilTitle: 'திட நிலைமை',
    topics: [
      {
        id: 'tn12-c6-t1',
        title: 'Complete Unit 6: Crystal Lattices, Unit Cells, Packing Efficiency, Density & Imperfections',
        tamilTitle: 'படிக அணிக்கோவை, அலகு கூடுகள், பொதிவுத் திறன் மற்றும் படிகக் குறைபாடுகள்',
        description:
          'General characteristics of solids, amorphous vs crystalline solids (isotropy vs anisotropy), classification of crystalline solids (ionic, covalent, molecular, metallic), crystal lattice & 7 crystal systems, primitive & centred unit cells (SC, BCC, FCC), Bragg’s equation, density of unit cell, close packing in 1D/2D/3D, packing efficiency, radius ratio, and crystal defects (Schottky, Frenkel, metal excess/deficiency).',
        subTopics: [
          '6.1–6.3 Classification of Solids, Crystal Lattice, 7 Crystal Systems & Unit Cells (SC, BCC, FCC)',
          '6.4–6.5 Bragg’s Equation, Number of Atoms per Unit Cell & Density Calculation',
          '6.6 Packing in Crystals: Close Packing, Tetrahedral/Octahedral Voids & Packing Efficiency',
          '6.7 Imperfections in Solids: Stoichiometric (Schottky & Frenkel) & Non-Stoichiometric Defects'
        ],
        keyFormulas: ['ρ = (Z · M) / (N_A · a³)', 'nλ = 2d sinθ (Bragg’s Equation)', 'FCC: 74%, BCC: 68%, SC: 52.4%'],
        difficulty: 'Intermediate',
        estimatedMinutes: 28
      }
    ]
  },
  {
    id: 'tn12-ch7',
    grade: '12',
    volume: 'Volume 1',
    number: 7,
    title: 'Chemical Kinetics',
    tamilTitle: 'வேதி இயக்கவியல்',
    topics: [
      {
        id: 'tn12-c7-t1',
        title: 'Complete Unit 7: Rate of Reaction, Rate Law, Order, Integrated Rate Equations & Arrhenius Theory',
        tamilTitle: 'வினை வேகம், வினை வகை, தொகைப்படுத்தப்பட்ட வேக சமன்பாடு மற்றும் அர்ஹீனியஸ் கொள்கை',
        description:
          'Average & instantaneous rate of chemical reaction, rate law & rate constant, elementary vs complex reactions, order vs molecularity, integrated rate law for first-order & zero-order reactions, half-life period (t₁/₂), pseudo first-order reactions, collision theory, Arrhenius equation, activation energy (Eₐ), and factors affecting reaction rate.',
        subTopics: [
          '7.1–7.3 Rate of Reaction, Rate Law, Rate Constant Units & Order vs Molecularity',
          '7.4 Integrated Rate Law for First-Order & Zero-Order Reactions and Half-Life Period',
          '7.5 Pseudo First-Order Reactions & Experimental Determination of Order',
          '7.6–7.7 Collision Theory, Arrhenius Equation, Activation Energy & Catalyst Effect'
        ],
        keyFormulas: ['k = (2.303 / t) log₁₀([A]₀ / [A])', 't₁/₂ (1st order) = 0.693 / k', 'k = A · e^(-Eₐ/RT)'],
        difficulty: 'Advanced',
        estimatedMinutes: 30
      }
    ]
  },

  // ==================== VOLUME 2 (UNITS 8 TO 15) ====================
  {
    id: 'tn12-ch8',
    grade: '12',
    volume: 'Volume 2',
    number: 8,
    title: 'Ionic Equilibrium',
    tamilTitle: 'அயனிச் சமநிலை',
    topics: [
      {
        id: 'tn12-c8-t1',
        title: 'Complete Unit 8: Acids & Bases, pH Scale, Ostwald Law, Buffers, Salt Hydrolysis & Ksp',
        tamilTitle: 'அமிலங்கள்-காரங்கள், pH மதிப்பு, தாங்கல் கரைசல்கள் மற்றும் கரைதிறன் பெருக்கம்',
        description:
          'Arrhenius, Lowry-Brønsted & Lewis concepts of acids and bases, strength of acids & bases, ionization of water (K_w), pH scale & pH calculations, Ostwald’s dilution law, common ion effect, buffer solutions (acidic & basic) & Henderson-Hasselbalch equation, salt hydrolysis, and solubility product (K_sp) & precipitation conditions.',
        subTopics: [
          '8.1–8.3 Acid-Base Theories, Ionic Product of Water (K_w) & pH Scale Calculations',
          '8.4–8.5 Ostwald’s Dilution Law & Common Ion Effect',
          '8.6 Buffer Solutions, Buffer Action & Henderson–Hasselbalch Equation',
          '8.7–8.8 Salt Hydrolysis (Types & Constants) & Solubility Product (K_sp)'
        ],
        keyFormulas: ['pH = -log₁₀[H₃O⁺]', 'Kₐ = α²C / (1 - α)', 'pH = pKₐ + log₁₀([Salt]/[Acid])'],
        difficulty: 'Advanced',
        estimatedMinutes: 30
      }
    ]
  },
  {
    id: 'tn12-ch9',
    grade: '12',
    volume: 'Volume 2',
    number: 9,
    title: 'Electrochemistry',
    tamilTitle: 'மின் வேதியியல்',
    topics: [
      {
        id: 'tn12-c9-t1',
        title: 'Complete Unit 9: Conductivity, Kohlrausch’s Law, Galvanic Cells, Nernst Equation, Faraday’s Laws & Batteries',
        tamilTitle: 'மின்கடத்துத்திறன், கோல்ராஷ் விதி, நெர்ன்ஸ்ட் சமன்பாடு, ஃபாரடே விதிகள் மற்றும் மின்கலன்கள்',
        description:
          'Conductance of electrolytic solutions, specific, equivalent & molar conductivity, variation with dilution, Debye-Hückel-Onsager equation, Kohlrausch’s law & applications, galvanic cells, SHE, electrochemical series, Nernst equation, ΔG° = -nFE°_cell, electrolytic cells & Faraday’s first & second laws, primary & secondary batteries (Leclanché, Mercury, Lead storage, Li-ion), H₂-O₂ fuel cell, and corrosion.',
        subTopics: [
          '9.1–9.2 Electrolytic Conductance, Molar Conductivity & Kohlrausch’s Law Applications',
          '9.3 Galvanic Cells, Standard Hydrogen Electrode (SHE) & Nernst Equation',
          '9.4 Thermodynamics of Cell Reactions (ΔG° = -nFE°) & Faraday’s Laws of Electrolysis',
          '9.5–9.6 Batteries, Hydrogen–Oxygen Fuel Cell & Electrochemical Mechanism of Corrosion'
        ],
        keyFormulas: ['E_cell = E°_cell - (0.0591 / n) log₁₀ Q', 'ΔG° = -n F E°_cell', 'm = Z · I · t'],
        difficulty: 'Advanced',
        estimatedMinutes: 35
      }
    ]
  },
  {
    id: 'tn12-ch10',
    grade: '12',
    volume: 'Volume 2',
    number: 10,
    title: 'Surface Chemistry',
    tamilTitle: 'புறப்பரப்பு வேதியியல்',
    topics: [
      {
        id: 'tn12-c10-t1',
        title: 'Complete Unit 10: Adsorption, Catalysis, Colloids, Emulsions & Hardy-Schulze Rule',
        tamilTitle: 'பரப்புக் கவர்தல், வினையூக்கம், கூழ்மங்கள், பால்மங்கள் மற்றும் ஹார்டி-ஷுல்ஸ் விதி',
        description:
          'Adsorption vs absorption, physisorption vs chemisorption, factors affecting adsorption, Freundlich adsorption isotherm, catalysis (positive, negative, auto, promoters & poisons), homogeneous & heterogeneous catalysis, enzyme catalysis & zeolites, colloids (lyophilic & lyophobic), preparation (dispersion & condensation), purification (dialysis, electrodialysis, ultrafiltration), Tyndall effect, Brownian movement, Helmholtz electrical double layer, electrophoresis, electroosmosis, coagulation (Hardy-Schulze rule), gold number & emulsions.',
        subTopics: [
          '10.1 Adsorption: Physisorption vs Chemisorption & Freundlich Adsorption Isotherm',
          '10.2 Catalysis: Homogeneous, Heterogeneous, Intermediate Compound & Adsorption Theories',
          '10.3 Colloids: Classification, Preparation, Purification & Kinetic/Optical/Electrical Properties',
          '10.4–10.5 Coagulation (Hardy–Schulze Rule), Gold Number, Emulsions & Applications'
        ],
        keyFormulas: ['x/m = k · P^(1/n)', 'log(x/m) = log k + (1/n) log P', 'Coagulation power ∝ Valency of flocculating ion'],
        difficulty: 'Foundation',
        estimatedMinutes: 26
      }
    ]
  },
  {
    id: 'tn12-ch11',
    grade: '12',
    volume: 'Volume 2',
    number: 11,
    title: 'Hydroxy Compounds and Ethers',
    tamilTitle: 'ஹைட்ராக்சி சேர்மங்கள் மற்றும் ஈதர்கள்',
    topics: [
      {
        id: 'tn12-c11-t1',
        title: 'Complete Unit 11: Alcohols (1°, 2°, 3°), Phenols, Named Reactions & Ethers',
        tamilTitle: 'ஆல்கஹால்கள், பீனால்கள், முக்கிய பெயர் வினைகள் மற்றும் ஈதர்கள்',
        description:
          'Classification & IUPAC nomenclature of alcohols, preparation (from haloalkanes, alkenes, Grignard reagents, reduction of carbonyls), Lucas test & Victor Meyer’s test to distinguish 1°, 2° & 3° alcohols, physical & chemical properties (esterification, dehydration, oxidation, dehydrogenation), polyhydric alcohols (ethylene glycol, glycerol); preparation & acidic nature of phenols, Kolbe’s reaction, Reimer-Tiemann reaction, Schotten-Baumann, Phthalein & Coupling reactions; ethers preparation (Williamson synthesis) & reactions.',
        subTopics: [
          '11.1–11.2 Alcohols: Classification, Preparation & Distinguishing Tests (Lucas & Victor Meyer)',
          '11.3 Chemical Properties of Alcohols, Ethylene Glycol & Glycerol Reactions',
          '11.4 Phenols: Acidity, Kolbe’s, Reimer–Tiemann, Schotten–Baumann & Coupling Reactions',
          '11.5 Ethers: Nomenclature, Williamson Ether Synthesis, Reactions with HI & Aromatic Ethers'
        ],
        keyFormulas: ['R-X + R\'-O⁻Na⁺ → R-O-R\' + NaX', 'Phenol + CHCl₃ + NaOH → Salicylaldehyde', 'Lucas Reagent: Anhyd. ZnCl₂ + conc. HCl'],
        difficulty: 'Advanced',
        estimatedMinutes: 35
      }
    ]
  },
  {
    id: 'tn12-ch12',
    grade: '12',
    volume: 'Volume 2',
    number: 12,
    title: 'Carbonyl Compounds and Carboxylic Acids',
    tamilTitle: 'கார்பனைல் சேர்மங்கள் மற்றும் கார்பாக்சிலிக் அமிலங்கள்',
    topics: [
      {
        id: 'tn12-c12-t1',
        title: 'Complete Unit 12: Aldehydes, Ketones, Carboxylic Acids & Functional Derivatives',
        tamilTitle: 'ஆல்டிஹைடுகள், கீட்டோன்கள், கார்பாக்சிலிக் அமிலங்கள் மற்றும் பெறுதிகள்',
        description:
          'Structure of carbonyl group, preparation of aldehydes & ketones (ozonolysis, Rosenmund, Stephen, Etard, Gattermann-Koch, Friedel-Crafts acylation), nucleophilic addition reactions (HCN, NaHSO₃, Grignard, alcohols, ammonia derivatives), Clemmensen & Wolff-Kishner reductions, Haloform reaction, Aldol & Crossed Aldol condensation, Cannizzaro & Crossed Cannizzaro, Benzoin, Perkin, Knoevenagel, Tollens & Fehling tests; carboxylic acids acidity, Kolbe’s electrolysis, HVZ reaction, and derivatives (acid chlorides, anhydrides, esters, amides).',
        subTopics: [
          '12.1–12.2 Aldehydes & Ketones: Preparation (Rosenmund, Stephen, Etard, Friedel–Crafts)',
          '12.3 Nucleophilic Addition, Reductions (Clemmensen, Wolff–Kishner) & Oxidation Tests',
          '12.4 Condensation Reactions: Aldol, Cannizzaro, Benzoin, Perkin & Knoevenagel',
          '12.5–12.6 Carboxylic Acids: Acidity, HVZ Reaction & Acid Derivatives (Esters, Amides)'
        ],
        keyFormulas: ['2CH₃CHO (dil. NaOH) → CH₃CH(OH)CH₂CHO', '2HCHO + conc. NaOH → CH₃OH + HCOONa', 'R-CH₂COOH + Br₂/Red P → R-CH(Br)COOH'],
        difficulty: 'Advanced',
        estimatedMinutes: 35
      }
    ]
  },
  {
    id: 'tn12-ch13',
    grade: '12',
    volume: 'Volume 2',
    number: 13,
    title: 'Organic Nitrogen Compounds',
    tamilTitle: 'கரிம நைட்ரஜன் சேர்மங்கள்',
    topics: [
      {
        id: 'tn12-c13-t1',
        title: 'Complete Unit 13: Nitro Compounds, Amines (1°, 2°, 3°), Diazonium Salts & Cyanides',
        tamilTitle: 'நைட்ரோ சேர்மங்கள், அமீன்கள், டையசோனியம் உப்புகள் மற்றும் சயனைடுகள்',
        description:
          'Nitroalkanes & nitrobenzene (tautomerism, reduction in acidic, neutral, alkaline & electrolytic media), amines classification & basicity (gas phase vs aqueous phase inductive, solvation & steric effects), preparation (Gabriel phthalimide, Hoffmann bromamide degradation), reactions (acylation, carbylamine test, mustard oil reaction, Hinsberg test, electrophilic substitution of aniline), benzene diazonium chloride (Sandmeyer, Gattermann, Balz-Schiemann, Gomberg, coupling reactions), cyanides & isocyanides.',
        subTopics: [
          '13.1 Nitro Compounds: Isomerism, Preparation & Reduction of Nitrobenzene in Different Media',
          '13.2 Amines: Basicity Order, Gabriel Phthalimide Synthesis & Hoffmann Bromamide Reaction',
          '13.3 Distinguishing 1°, 2°, 3° Amines: Carbylamine, Mustard Oil & Hinsberg Tests',
          '13.4–13.5 Benzene Diazonium Chloride (Sandmeyer, Gattermann, Coupling) & Cyanides'
        ],
        keyFormulas: ['R-CONH₂ + Br₂ + 4KOH → R-NH₂ + K₂CO₃', 'R-NH₂ + CHCl₃ + 3KOH → R-NC', 'C₆H₅N₂⁺Cl⁻ + CuCl/HCl → C₆H₅Cl + N₂'],
        difficulty: 'Advanced',
        estimatedMinutes: 32
      }
    ]
  },
  {
    id: 'tn12-ch14',
    grade: '12',
    volume: 'Volume 2',
    number: 14,
    title: 'Biomolecules',
    tamilTitle: 'உயிரியல் மூலக்கூறுகள்',
    topics: [
      {
        id: 'tn12-c14-t1',
        title: 'Complete Unit 14: Carbohydrates, Proteins, Enzymes, Lipids, Vitamins & Nucleic Acids',
        tamilTitle: 'கார்போஹைட்ரேட்டுகள், புரதங்கள், நொதிகள், வைட்டமின்கள் மற்றும் நியூக்ளிக் அமிலங்கள்',
        description:
          'Carbohydrates classification (monosaccharides, oligosaccharides, polysaccharides), glucose & fructose preparation, open-chain & cyclic Haworth structures, anomers & mutarotation, epimers, sucrose (invert sugar), lactose, maltose, starch, cellulose & glycogen; amino acids (essential/non-essential, zwitterion, isoelectric point), peptide bond, protein structures (1°, 2°, 3°, 4°) & denaturation; enzymes, lipids, fat-soluble & water-soluble vitamins, and nucleic acids (DNA vs RNA, nucleosides, nucleotides, double helix, DNA fingerprinting).',
        subTopics: [
          '14.1 Carbohydrates: Glucose & Fructose Structures, Mutarotation, Disaccharides & Polysaccharides',
          '14.2 Proteins: Amino Acids, Zwitterion, Peptide Bond, 1°–4° Structures & Denaturation',
          '14.3–14.5 Enzymes, Lipids & Classification of Vitamins (Fat & Water Soluble)',
          '14.6 Nucleic Acids: DNA vs RNA Composition, Watson–Crick Double Helix & Biological Functions'
        ],
        keyFormulas: ['C₆H₁₂O₆ (D-Glucose & D-Fructose)', 'Zwitterion: ⁺H₃N-CHR-COO⁻', 'DNA Base Pairing: A=T, G≡C'],
        difficulty: 'Intermediate',
        estimatedMinutes: 28
      }
    ]
  },
  {
    id: 'tn12-ch15',
    grade: '12',
    volume: 'Volume 2',
    number: 15,
    title: 'Chemistry in Everyday Life',
    tamilTitle: 'அன்றாட வாழ்வில் வேதியியல்',
    topics: [
      {
        id: 'tn12-c15-t1',
        title: 'Complete Unit 15: Drugs & Medicines, Food Additives, Cleansing Agents & Polymers',
        tamilTitle: 'மருந்துகள், உணவு சேர்க்கைகள், சோப்புகள்-சலவைத் தூள்கள் மற்றும் பலபடிகள்',
        description:
          'Drug-target interaction (enzymes & receptors), therapeutic action of different classes of drugs (analgesics, tranquilizers, antiseptics, disinfectants, antimicrobials/antibiotics, antacids, antihistamines, antifertility drugs); chemicals in food (preservatives, antioxidants, artificial sweetening agents); cleansing agents (soaps via saponification, synthetic detergents: anionic, cationic & non-ionic, cleansing action); and important polymers (addition & condensation polymers, polythene, Teflon, Nylon-6,6, Bakelite, rubber vulcanization & biodegradable polymers like PHBV).',
        subTopics: [
          '15.1 Drugs & Medicines: Analgesics, Antiseptics, Antibiotics, Antacids & Tranquilizers',
          '15.2 Food Additives: Preservatives (Sodium Benzoate), Antioxidants (BHT, BHA) & Sweeteners',
          '15.3 Cleansing Agents: Soaps (Saponification) vs Synthetic Detergents & Cleansing Action',
          '15.4 Polymers: Nylon-6,6, Teflon, Bakelite, Vulcanization of Rubber & Biodegradable Polymers'
        ],
        keyFormulas: ['Triglyceride + 3NaOH → Glycerol + 3RCOONa', 'Sodium Benzoate: C₆H₅COONa', 'PHBV: Biodegradable Polymer'],
        difficulty: 'Foundation',
        estimatedMinutes: 25
      }
    ]
  }
];

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'pq-chem-1',
    grade: '12',
    topicId: 'tn12-c1-t1',
    question: 'Which of the following ores is concentrated by the Froth Flotation process? (TN Class 12 Unit 1)',
    options: ['Galena (PbS)', 'Haematite (Fe₂O₃)', 'Bauxite (Al₂O₃·2H₂O)', 'Cassiterite (SnO₂)'],
    correctIndex: 0,
    explanation: 'Froth flotation is preferentially used for sulphide ores such as Galena (PbS) and Zinc blende (ZnS) because pine oil wets sulphide ores preferentially.',
    difficulty: 'Easy'
  },
  {
    id: 'pq-chem-2',
    grade: '12',
    topicId: 'tn12-c2-t1',
    question: 'How many 3-centre 2-electron (banana) B–H–B bridge bonds are present in diborane (B₂H₆)? (TN Class 12 Unit 2)',
    options: ['2', '4', '6', '1'],
    correctIndex: 0,
    explanation: 'Diborane (B₂H₆) contains four terminal 2c-2e B–H bonds and two bridging 3c-2e (banana) B–H–B bonds.',
    difficulty: 'Easy'
  },
  {
    id: 'pq-chem-3',
    grade: '12',
    topicId: 'tn12-c6-t1',
    question: 'What is the packing efficiency of a Face-Centred Cubic (FCC) unit cell? (TN Class 12 Unit 6)',
    options: ['74%', '68%', '52.4%', '60%'],
    correctIndex: 0,
    explanation: 'In an FCC lattice (Z = 4), spheres occupy 74% of the total volume of the unit cell (compared to 68% in BCC and 52.4% in simple cubic).',
    difficulty: 'Easy'
  },
  {
    id: 'pq-chem-4',
    grade: '12',
    topicId: 'tn12-c7-t1',
    question: 'For a first-order reaction, if the half-life t₁/₂ is 69.3 seconds, what is the rate constant k? (TN Class 12 Unit 7)',
    options: ['0.01 s⁻¹', '0.1 s⁻¹', '1.0 s⁻¹', '6.93 s⁻¹'],
    correctIndex: 0,
    explanation: 'For a first-order reaction, k = 0.693 / t₁/₂ = 0.693 / 69.3 = 0.01 s⁻¹.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-chem-5',
    grade: '12',
    topicId: 'tn12-c9-t1',
    question: 'Which law relates limiting molar conductivity of an electrolyte to the individual ionic conductivities? (TN Class 12 Unit 9)',
    options: ['Kohlrausch’s Law', 'Henry’s Law', 'Raoult’s Law', 'Hess’s Law'],
    correctIndex: 0,
    explanation: 'Kohlrausch’s Law of independent migration of ions states that at infinite dilution, each ion makes a definite contribution to total molar conductivity.',
    difficulty: 'Easy'
  },
  {
    id: 'pq-chem-6',
    grade: '12',
    topicId: 'tn12-c12-t1',
    question: 'Which carbonyl compound undergoes Cannizzaro reaction when treated with concentrated NaOH? (TN Class 12 Unit 12)',
    options: ['Formaldehyde (HCHO)', 'Acetaldehyde (CH₃CHO)', 'Acetone (CH₃COCH₃)', 'Propanal (CH₃CH₂CHO)'],
    correctIndex: 0,
    explanation: 'Aldehydes lacking α-hydrogen atoms, such as formaldehyde (HCHO) and benzaldehyde (C₆H₅CHO), undergo disproportionation (Cannizzaro reaction) with concentrated alkali.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-chem-7',
    grade: '12',
    topicId: 'tn12-c13-t1',
    question: 'Which test is specifically given by primary amines (aliphatic and aromatic) to detect them? (TN Class 12 Unit 13)',
    options: ['Carbylamine Test', 'Iodoform Test', 'Lucas Test', 'Silver Mirror Test'],
    correctIndex: 0,
    explanation: 'Primary amines (R–NH₂) heated with chloroform (CHCl₃) and alcoholic KOH form foul-smelling isocyanides (R–NC), known as the Carbylamine reaction.',
    difficulty: 'Easy'
  }
];

const PAST_QUESTIONS: PastQuestion[] = [
  {
    id: 'tn-chem-past-2025-1',
    grade: '12',
    year: 2025,
    paper: 'TN HSC March Public Exam - Chemistry (5 Marks)',
    topic: 'Unit 6: Solid State',
    marks: 5,
    question: 'An element has a face-centred cubic (FCC) crystal lattice with edge length a = 400 pm. Calculate the density of the unit cell if the molar mass of the element is 60 g mol⁻¹ (N_A = 6.022 × 10²³ mol⁻¹).',
    solutionSteps: [
      'Step 1: Identify parameters for an FCC unit cell: Z = 4 atoms/unit cell, M = 60 g mol⁻¹, a = 400 pm = 400 × 10⁻¹⁰ cm = 4 × 10⁻⁸ cm.',
      'Step 2: Calculate volume of unit cell: a³ = (4 × 10⁻⁸ cm)³ = 64 × 10⁻²⁴ cm³.',
      'Step 3: Apply density formula ρ = (Z × M) / (N_A × a³) = (4 × 60) / (6.022 × 10²³ × 64 × 10⁻²⁴).',
      'Step 4: Simplify: 240 / (6.022 × 6.4) = 240 / 38.54 ≈ 6.23 g cm⁻³.'
    ],
    finalAnswer: 'ρ ≈ 6.23 g cm⁻³'
  },
  {
    id: 'tn-chem-past-2025-2',
    grade: '12',
    year: 2025,
    paper: 'TN HSC March Public Exam - Chemistry (5 Marks)',
    topic: 'Unit 7: Chemical Kinetics',
    marks: 5,
    question: 'Show that for a first-order reaction, the time required for 99% completion is twice the time required for 90% completion.',
    solutionSteps: [
      'Step 1: First-order integrated rate equation is t = (2.303 / k) log₁₀([A]₀ / [A]).',
      'Step 2: For 90% completion, [A] = 0.1[A]₀ ⇒ t₉₀% = (2.303 / k) log₁₀(10) = 2.303 / k.',
      'Step 3: For 99% completion, [A] = 0.01[A]₀ ⇒ t₉₉% = (2.303 / k) log₁₀(100) = 2 × (2.303 / k).',
      'Step 4: Comparing both gives t₉₉% = 2 × t₉₀%.'
    ],
    finalAnswer: 't₉₉% = 2 × t₉₀%'
  },
  {
    id: 'tn-chem-past-2024',
    grade: '12',
    year: 2024,
    paper: 'TN HSC Public Exam - Chemistry (5 Marks)',
    topic: 'Unit 9: Electrochemistry',
    marks: 5,
    question: 'Calculate the standard EMF (E°_cell) and ΔG° for the Daniel cell reaction: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), given E°(Cu²⁺/Cu) = +0.34 V and E°(Zn²⁺/Zn) = -0.76 V (F = 96500 C mol⁻¹).',
    solutionSteps: [
      'Step 1: Cathode (reduction): Cu²⁺ + 2e⁻ → Cu (E°_cathode = +0.34 V). Anode (oxidation): Zn → Zn²⁺ + 2e⁻ (E°_anode = -0.76 V).',
      'Step 2: E°_cell = E°_cathode - E°_anode = 0.34 - (-0.76) = 1.10 V.',
      'Step 3: Number of electrons transferred n = 2. Using ΔG° = -n F E°_cell = -2 × 96500 × 1.10 = -212300 J mol⁻¹ = -212.3 kJ mol⁻¹.'
    ],
    finalAnswer: 'E°_cell = 1.10 V, ΔG° = -212.3 kJ mol⁻¹'
  },
  {
    id: 'tn-chem-past-2023',
    grade: '12',
    year: 2023,
    paper: 'TN HSC Public Exam - Chemistry (5 Marks)',
    topic: 'Unit 12: Carbonyl Compounds and Carboxylic Acids',
    marks: 5,
    question: 'Explain Aldol Condensation with a suitable example and write the mechanism.',
    solutionSteps: [
      'Step 1: Aldehydes or ketones containing at least one α-hydrogen atom condense in the presence of dilute alkali (dil. NaOH) to form β-hydroxy aldehyde (aldol) or β-hydroxy ketone.',
      'Step 2: Step 1 (Enolate formation): OH⁻ abstracts an α-proton from CH₃CHO to form resonance-stabilized carbanion ⁻CH₂CHO.',
      'Step 3: Step 2 (Nucleophilic attack): ⁻CH₂CHO attacks the carbonyl carbon of a second CH₃CHO molecule followed by protonation to give 3-hydroxybutanal (aldol).',
      'Step 4: Step 3 (Dehydration on warming): Loss of H₂O yields but-2-enal (crotonaldehyde), CH₃CH=CHCHO.'
    ],
    finalAnswer: '2CH₃CHO (dil. NaOH) → CH₃CH(OH)CH₂CHO → CH₃CH=CHCHO + H₂O'
  }
];

// ============================================================================
// HELPER UTILITIES: EXPONENTIAL BACKOFF & BASE64 DECODING FOR GEMINI TTS
// ============================================================================

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 900): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retries > 0 && (response.status === 429 || response.status >= 500)) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    return response;
  } catch (err) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ============================================================================
// AI CHEMISTRY LESSON STUDIO COMPONENT (4-DIVISION ANIMATED VIDEO + MALE VOICE)
// ============================================================================

interface LessonSlide {
  slideNumber: number;
  title: string;
  visualType: 'molecular_orbit' | 'wave_energy' | 'reaction_kinetics' | 'equilibrium_curve' | 'formula_board';
  equation: string;
  bulletPoints: string[];
  narration: string;
}

interface GeneratedLesson {
  lessonTitle: string;
  topicSummary: string;
  slides: LessonSlide[];
  quickCheckQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const AiChemistryStudio: React.FC<{
  initialTopic?: string;
  language: LangCode;
}> = ({ initialTopic, language }) => {
  const langConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const ui = UI_STRINGS[language];

  const [promptTopic, setPromptTopic] = useState(
    initialTopic || 'TN Class 12 Unit 9: Nernst Equation, Kohlrausch’s Law & Faraday’s Laws'
  );
  const [difficultyLevel, setDifficultyLevel] = useState<'Foundation' | 'Intermediate' | 'Exam Mastery'>('Intermediate');
  const [visualTheme, setVisualTheme] = useState<'lab_dark' | 'chalkboard' | 'blueprint'>('lab_dark');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);

  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioBuffers, setAudioBuffers] = useState<Record<string, AudioBuffer>>({});

  const [quizChoice, setQuizChoice] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const audioFinishedRef = useRef<boolean>(false);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechKeepAliveRef = useRef<number | null>(null);
  const playbackSessionIdRef = useRef<number>(0);
  const lockedWebVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const unlockedAudioCtxRef = useRef<AudioContext | null>(null);
  const activeWebAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const webAudioTimingRef = useRef<{ startTime: number; duration: number } | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const fallbackTimingRef = useRef<{ startMs: number; durationMs: number } | null>(null);
  const audioBufferCacheRef = useRef<Record<string, AudioBuffer>>({});
  const lessonCacheRef = useRef<Record<string, GeneratedLesson>>({});

  const [audioStatusLabel, setAudioStatusLabel] = useState<string>('Ready');

  useEffect(() => {
    if (initialTopic) {
      setPromptTopic(initialTopic);
    }
  }, [initialTopic]);

  const unlockBrowserAudio = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        if (!unlockedAudioCtxRef.current || unlockedAudioCtxRef.current.state === 'closed') {
          unlockedAudioCtxRef.current = new AudioCtx();
        }
        if (unlockedAudioCtxRef.current.state === 'suspended') {
          unlockedAudioCtxRef.current.resume().catch(() => {});
        }
        const silentBuf = unlockedAudioCtxRef.current.createBuffer(1, 1, 22050);
        const src = unlockedAudioCtxRef.current.createBufferSource();
        src.buffer = silentBuf;
        src.connect(unlockedAudioCtxRef.current.destination);
        src.start(0);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
      }
    } catch {
      // Ignore audio unlock error
    }
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const stopAllAudio = useCallback(() => {
    playbackSessionIdRef.current += 1;
    webAudioTimingRef.current = null;
    fallbackTimingRef.current = null;

    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (speechKeepAliveRef.current !== null) {
      window.clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    if (activeWebAudioSourceRef.current) {
      try {
        activeWebAudioSourceRef.current.onended = null;
        activeWebAudioSourceRef.current.stop();
        activeWebAudioSourceRef.current.disconnect();
      } catch {
        // Already stopped
      }
      activeWebAudioSourceRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  // STRICT MALE VOICE FILTER: Excludes all female voices and locks single bold Indian male voice
  const selectSingleIndianMaleWebVoice = useCallback(
    (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
      const targetBcp = langConfig.bcp47.toLowerCase();
      const targetLangPrefix = langConfig.code.toLowerCase();

      const tamilMaleKeywords = [
        'தமிழ்',
        'tamil',
        'valluvar',
        'ravi',
        'arjun',
        'kumar',
        'male',
        'man'
      ];

      const maleKeywords = [
        'ravi',
        'prabhat',
        'hemant',
        'madhur',
        'valluvar',
        'male',
        'man',
        'kumar',
        'arjun',
        'suresh',
        'david',
        'mark',
        'george',
        'daniel',
        'rishi'
      ];
      const femaleKeywords = [
        'heera',
        'swara',
        'neerja',
        'kalpana',
        'pallavi',
        'shruti',
        'female',
        'woman',
        'priya',
        'ananya',
        'lakshmi',
        'zira',
        'susan',
        'hazel',
        'samantha',
        'veena',
        'lekha',
        'vani',
        'kavya'
      ];

      const isNotFemale = (v: SpeechSynthesisVoice) =>
        !femaleKeywords.some((k) => v.name.toLowerCase().includes(k));

      const isExplicitMale = (v: SpeechSynthesisVoice) =>
        isNotFemale(v) && maleKeywords.some((k) => v.name.toLowerCase().includes(k));

      if (targetLangPrefix === 'ta') {
        const exactTamilMale = voices.find(
          (v) =>
            v.lang.toLowerCase().replace(/_/g, '-') === 'ta-in' &&
            isNotFemale(v) &&
            tamilMaleKeywords.some((k) => v.name.toLowerCase().includes(k))
        );
        if (exactTamilMale) return exactTamilMale;

        const exactTamilVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().replace(/_/g, '-') === 'ta-in' &&
            isNotFemale(v)
        );
        if (exactTamilVoice) return exactTamilVoice;

        const anyTamilMale = voices.find(
          (v) =>
            v.lang.toLowerCase().replace(/_/g, '-').startsWith('ta') &&
            isNotFemale(v) &&
            tamilMaleKeywords.some((k) => v.name.toLowerCase().includes(k))
        );
        if (anyTamilMale) return anyTamilMale;

        return undefined;
      }

      const exactLocaleMale = voices.find(
        (v) => v.lang.toLowerCase() === targetBcp && isExplicitMale(v)
      );
      if (exactLocaleMale) return exactLocaleMale;

      const exactLocaleNonFemale = voices.find(
        (v) => v.lang.toLowerCase() === targetBcp && isNotFemale(v)
      );
      if (exactLocaleNonFemale) return exactLocaleNonFemale;

      const anyIndianMale = voices.find(
        (v) =>
          (v.lang.toLowerCase().includes('-in') || v.name.toLowerCase().includes('india')) &&
          isExplicitMale(v)
      );
      if (anyIndianMale) return anyIndianMale;

      const anyIndianNonFemale = voices.find(
        (v) =>
          (v.lang.toLowerCase().includes('-in') || v.name.toLowerCase().includes('india')) &&
          isNotFemale(v)
      );
      if (anyIndianNonFemale) return anyIndianNonFemale;

      const anyLangMale = voices.find(
        (v) => v.lang.toLowerCase().startsWith(targetLangPrefix) && isExplicitMale(v)
      );
      if (anyLangMale) return anyLangMale;

      return voices.find((v) => isExplicitMale(v));
    },
    [langConfig.bcp47, langConfig.code]
  );

  useEffect(() => {
    lockedWebVoiceRef.current = null;
  }, [language]);

  const speakSentenceChainFallback = useCallback(
    (fullText: string, sessionId: number, labelSuffix = '') => {
      if (playbackSessionIdRef.current !== sessionId || isMuted) {
        audioFinishedRef.current = true;
        return;
      }

      if (typeof window.speechSynthesis === 'undefined') {
        setAudioStatusLabel('இந்த உலாவியில் குரல் வசதி இல்லை');
        const words = fullText.trim().split(/\s+/).length;
        const estimatedMs = Math.max(6000, words * 380);
        fallbackTimingRef.current = { startMs: performance.now(), durationMs: estimatedMs };
        fallbackTimerRef.current = window.setTimeout(() => {
          if (playbackSessionIdRef.current === sessionId) {
            audioFinishedRef.current = true;
            fallbackTimingRef.current = null;
          }
        }, estimatedMs);
        return;
      }

      const rawSentences = fullText
        .split(/(?<=[.!?।,;:])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const sentences: string[] = [];
      for (const piece of rawSentences.length > 0 ? rawSentences : [fullText]) {
        if (piece.length <= 95) {
          sentences.push(piece);
        } else {
          const words = piece.split(/\s+/);
          let currentChunk = '';
          for (const w of words) {
            if ((currentChunk + ' ' + w).trim().length > 95 && currentChunk) {
              sentences.push(currentChunk.trim());
              currentChunk = w;
            } else {
              currentChunk = (currentChunk + ' ' + w).trim();
            }
          }
          if (currentChunk) sentences.push(currentChunk);
        }
      }

      const cleanCharCount = fullText.replace(/\s+/g, '').length;
      const estimatedTotalMs = Math.max(7000, cleanCharCount * 72);
      fallbackTimingRef.current = { startMs: performance.now(), durationMs: estimatedTotalMs };
      setAudioStatusLabel(
        language === 'ta' ? 'சாதனத்தின் தமிழ் குரலில் பேசுகிறது...' : 'Using device voice...'
      );

      if (speechKeepAliveRef.current !== null) {
        window.clearInterval(speechKeepAliveRef.current);
      }
      speechKeepAliveRef.current = window.setInterval(() => {
        if (playbackSessionIdRef.current !== sessionId) {
          if (speechKeepAliveRef.current !== null) {
            window.clearInterval(speechKeepAliveRef.current);
            speechKeepAliveRef.current = null;
          }
          return;
        }
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 6000);

      const speakIndex = (idx: number) => {
        if (playbackSessionIdRef.current !== sessionId || isMuted) return;
        if (idx >= sentences.length) {
          const elapsed = performance.now() - (fallbackTimingRef.current?.startMs || performance.now());
          const remaining = Math.max(150, estimatedTotalMs - elapsed);
          fallbackTimerRef.current = window.setTimeout(() => {
            if (playbackSessionIdRef.current === sessionId) {
              audioFinishedRef.current = true;
              fallbackTimingRef.current = null;
              setAudioStatusLabel('Division Complete');
            }
          }, remaining);
          if (speechKeepAliveRef.current !== null) {
            window.clearInterval(speechKeepAliveRef.current);
            speechKeepAliveRef.current = null;
          }
          return;
        }

        const chunkText = sentences[idx];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        activeUtteranceRef.current = utterance;

        if (!lockedWebVoiceRef.current) {
          const voices = window.speechSynthesis.getVoices();
          const chosen = selectSingleIndianMaleWebVoice(voices);
          if (chosen) lockedWebVoiceRef.current = chosen;
        }
        if (lockedWebVoiceRef.current) {
          utterance.voice = lockedWebVoiceRef.current;
        }

        utterance.lang = langConfig.bcp47;
        // Deep bold male pitch & measured Indian professor rate
        utterance.pitch = 0.72;
        utterance.rate = language === 'ta' ? 0.84 : 0.92;
        utterance.volume = 1.0;

        let chunkSettled = false;
        const advanceChunk = () => {
          if (chunkSettled) return;
          chunkSettled = true;
          window.clearTimeout(chunkSafetyTimer);
          if (playbackSessionIdRef.current === sessionId) {
            window.setTimeout(() => speakIndex(idx + 1), 90);
          }
        };

        const chunkChars = chunkText.replace(/\s+/g, '').length;
        const maxChunkMs = Math.max(4500, chunkChars * 95);
        const chunkSafetyTimer = window.setTimeout(advanceChunk, maxChunkMs);

        utterance.onstart = () => {
          if (playbackSessionIdRef.current === sessionId) {
            setAudioStatusLabel(
              language === 'ta'
                ? `${labelSuffix} • கம்பீரமான ஆண் பேராசிரியர் விளக்கம்`
                : `Explaining ${labelSuffix} • Bold Male Professor`
            );
          }
        };

        utterance.onend = advanceChunk;
        utterance.onerror = () => {
          setAudioStatusLabel(
            language === 'ta'
              ? 'தமிழ் குரல் கிடைக்கவில்லை. Gemini TTS நிலையைச் சரிபார்க்கவும்.'
              : 'Device voice playback failed.'
          );
          advanceChunk();
        };

        window.speechSynthesis.speak(utterance);
      };

      const startChain = () => {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
          window.setTimeout(() => speakIndex(0), 120);
        } else {
          speakIndex(0);
        }
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        startChain();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', () => startChain(), { once: true });
        window.setTimeout(startChain, 200);
      }
    },
    [isMuted, language, langConfig.bcp47, selectSingleIndianMaleWebVoice]
  );

  const sanitizeTextForTts = useCallback((raw: string): string => {
    return raw
      .replace(/⇒/g, ' implies ')
      .replace(/⇌/g, ' in equilibrium with ')
      .replace(/→/g, ' gives ')
      .replace(/≠/g, ' not equal to ')
      .replace(/≤/g, ' less than or equal to ')
      .replace(/≥/g, ' greater than or equal to ')
      .replace(/Δ/g, ' delta ')
      .replace(/Λ/g, ' lambda ')
      .replace(/μ/g, ' mu ')
      .replace(/°/g, ' degree ')
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  const fetchSingleSlideAudioBuffer = useCallback(
    async (textToSpeak: string, lang: LanguageOption): Promise<AudioBuffer | null> => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        if (!apiKey) {
          setAudioStatusLabel('Gemini API key is missing');
          return null;
        }
        const ttsModel =
          lang.code === 'ta' ? 'gemini-3.1-flash-tts-preview' : 'gemini-2.5-flash-preview-tts';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`;

        // Locked deep bold male voice ('Charon') across all languages
        const singleMaleVoiceName = 'Charon';
        const ttsCleanText = sanitizeTextForTts(textToSpeak);
        const tamilVoiceInstruction =
          lang.code === 'ta'
            ? 'அமெரிக்க அல்லது பிரிட்டிஷ் உச்சரிப்பு முற்றிலும் வேண்டாம். கட்டாயம் முழு விளக்கத்தையும் சென்னையைச் சேர்ந்த கம்பீரமான, தாழ்ந்த குரலில் பேசும் ஒரு மூத்த ஆண் பேராசிரியர் போலத் தெளிவான இந்தியத் தமிழில் முழுமையாகப் பேசுங்கள். ஒரு சொல் கூட ஆங்கில உச்சரிப்பில் பேச வேண்டாம்.'
            : '';

        const payload = {
          contents: [
            {
              parts: [
                {
                  text: `${lang.ttsInstruction}\n${tamilVoiceInstruction}\n\nLanguage: ${lang.name} (${lang.bcp47}). Read every single word completely in a deep, bold, authoritative Indian male professor voice:\n${ttsCleanText}`
                }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: singleMaleVoiceName }
              }
            }
          },
          model: ttsModel
        };

        const response = await fetchWithRetry(
          apiUrl,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          },
          0,
          1000
        );

        if (!response.ok) {
          setAudioStatusLabel(
            lang.code === 'ta'
              ? `Gemini தமிழ் குரல் கிடைக்கவில்லை (HTTP ${response.status})`
              : `Gemini voice unavailable (HTTP ${response.status})`
          );
          console.error(`Gemini TTS request failed with HTTP ${response.status}.`);
          return null;
        }

        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;

        if (audioData && mimeType && mimeType.startsWith('audio/')) {
          const rateMatch = mimeType.match(/rate=(\d+)/);
          const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
          const pcmBuffer = base64ToArrayBuffer(audioData);
          const pcm16 = new Int16Array(pcmBuffer);

          const expectedMinSamples = sampleRate * 0.15;
          if (pcm16.length < expectedMinSamples) {
            setAudioStatusLabel('Gemini TTS returned empty or incomplete audio');
            return null;
          }

          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (!unlockedAudioCtxRef.current || unlockedAudioCtxRef.current.state === 'closed') {
            unlockedAudioCtxRef.current = new AudioCtx();
          }
          const ctx = unlockedAudioCtxRef.current;

          const audioBuffer = ctx.createBuffer(1, pcm16.length, sampleRate);
          const channelData = audioBuffer.getChannelData(0);
          for (let i = 0; i < pcm16.length; i++) {
            channelData[i] = pcm16[i] / 32768.0;
          }
          return audioBuffer;
        }
        setAudioStatusLabel('Gemini TTS response did not contain audio');
        return null;
      } catch (error) {
        console.error('Gemini TTS playback request failed:', error);
        setAudioStatusLabel(
          lang.code === 'ta'
            ? 'தமிழ் குரல் சேவையை அணுக முடியவில்லை'
            : 'Could not reach the voice service'
        );
        return null;
      }
    },
    [sanitizeTextForTts]
  );

  const playDecodedBuffer = useCallback(
    async (buffer: AudioBuffer, sessionId: number, divisionLabel: string) => {
      if (playbackSessionIdRef.current !== sessionId || isMuted) return;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!unlockedAudioCtxRef.current || unlockedAudioCtxRef.current.state === 'closed') {
        unlockedAudioCtxRef.current = new AudioCtx();
      }
      const ctx = unlockedAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (playbackSessionIdRef.current !== sessionId || isMuted) return;

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 1.45;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      activeWebAudioSourceRef.current = source;
      webAudioTimingRef.current = {
        startTime: ctx.currentTime,
        duration: buffer.duration
      };

      setAudioStatusLabel(`Explaining ${divisionLabel} • Bold Male Professor`);

      source.onended = () => {
        if (playbackSessionIdRef.current === sessionId) {
          audioFinishedRef.current = true;
          webAudioTimingRef.current = null;
          setAudioStatusLabel('Division Complete');
        }
      };

      source.start(0);
    },
    [isMuted]
  );

  const playSlideAudio = useCallback(
    async (
      slideIndex: number,
      textToSpeak?: string,
      preloadedBufferMap?: Record<string, AudioBuffer>
    ) => {
      stopAllAudio();
      audioFinishedRef.current = false;

      if (!textToSpeak || isMuted) {
        audioFinishedRef.current = true;
        setAudioStatusLabel(isMuted ? 'Muted' : 'Ready');
        return;
      }

      const sessionId = playbackSessionIdRef.current;
      const divisionLabel = `Div ${slideIndex + 1}/4`;
      const cacheKey = `${language}-${slideIndex}-${textToSpeak.slice(0, 32)}`;
      const existingBuffer =
        preloadedBufferMap?.[cacheKey] ||
        audioBufferCacheRef.current[cacheKey] ||
        audioBuffers[cacheKey];

      if (existingBuffer) {
        await playDecodedBuffer(existingBuffer, sessionId, divisionLabel);
        return;
      }

      setIsAudioLoading(true);
      setAudioStatusLabel(`Narrating ${divisionLabel}...`);
      const fetchedBuffer = await fetchSingleSlideAudioBuffer(textToSpeak, langConfig);
      setIsAudioLoading(false);

      if (playbackSessionIdRef.current !== sessionId || isMuted) return;

      if (fetchedBuffer) {
        audioBufferCacheRef.current[cacheKey] = fetchedBuffer;
        setAudioBuffers((prev) => ({ ...prev, [cacheKey]: fetchedBuffer }));
        await playDecodedBuffer(fetchedBuffer, sessionId, divisionLabel);
      } else {
        speakSentenceChainFallback(textToSpeak, sessionId, divisionLabel);
      }
    },
    [
      audioBuffers,
      fetchSingleSlideAudioBuffer,
      isMuted,
      langConfig,
      language,
      playDecodedBuffer,
      speakSentenceChainFallback,
      stopAllAudio
    ]
  );

  const prebufferRemainingDivisions = useCallback(
    async (slides: LessonSlide[], activeLang: LanguageOption) => {
      for (let idx = 1; idx < slides.length; idx++) {
        const slide = slides[idx];
        if (!slide?.narration) continue;
        const cacheKey = `${activeLang.code}-${idx}-${slide.narration.slice(0, 32)}`;
        if (audioBufferCacheRef.current[cacheKey]) continue;

        const buf = await fetchSingleSlideAudioBuffer(slide.narration, activeLang);
        if (buf) {
          audioBufferCacheRef.current[cacheKey] = buf;
          setAudioBuffers((prev) => ({ ...prev, [cacheKey]: buf }));
        }
      }
    },
    [fetchSingleSlideAudioBuffer]
  );

  const handleGenerateLesson = async () => {
    if (!promptTopic.trim()) return;

    unlockBrowserAudio();

    const normalizedTopic = promptTopic.trim();
    const lessonCacheKey = `${language}-${difficultyLevel}-${normalizedTopic.toLowerCase()}`;

    setErrorMsg(null);
    setQuizChoice(null);
    stopAllAudio();

    const cachedLesson = lessonCacheRef.current[lessonCacheKey];
    if (cachedLesson) {
      setLesson(cachedLesson);
      setIsGenerating(false);
      setGenerationStep('');
      setCurrentSlideIdx(0);
      setSlideProgress(0);
      setIsPlaying(true);
      playSlideAudio(0, cachedLesson.slides[0]?.narration);
      prebufferRemainingDivisions(cachedLesson.slides, langConfig);
      return;
    }

    setIsGenerating(true);
    setIsPlaying(false);
    setCurrentSlideIdx(0);
    setSlideProgress(0);

    try {
      setGenerationStep(`Creating 4-division ${langConfig.name} chemistry video lesson...`);

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const singleSpeakerLabel = 'single senior Indian male chemistry professor';

      const systemPrompt = `You are a ${singleSpeakerLabel} teaching the COMPLETE Tamil Nadu State Board (Samacheer Kalvi) Class 12 (+2) Chemistry syllabus across ALL 15 units (Volume 1 Units 1–7: Metallurgy, p-Block Elements-I, p-Block Elements-II, Transition & Inner Transition Elements, Coordination Chemistry, Solid State, Chemical Kinetics; Volume 2 Units 8–15: Ionic Equilibrium, Electrochemistry, Surface Chemistry, Hydroxy Compounds & Ethers, Carbonyl Compounds & Carboxylic Acids, Organic Nitrogen Compounds, Biomolecules, Chemistry in Everyday Life).
Create a comprehensive 4-division (4-slide) animated video lesson on the requested Class 12 Chemistry unit/lesson at the ${difficultyLevel} level, covering EVERY lesson concept within that unit and showing how it connects to surrounding units in the Samacheer Kalvi textbook.

STRICT CONTENT & BOLD INDIAN MALE VOICE RULES:
1. NEVER include greetings or filler like "Good morning", "Vanakkam", "Hello students", "Welcome", or "Today we will learn". Start EVERY division immediately with the chemistry concept itself in a bold, authoritative Indian male professor tone!
2. Structure the 4 divisions so every lesson concept in the unit is thoroughly explained:
   - Division 1: Core Chemical Concept, Definitions, Bonding / Structure & Full Unit Overview in TN Class 12 Chemistry.
   - Division 2: Key Laws, Governing Equations, Reagents, Conditions & Mechanisms across all lessons of the unit.
   - Division 3: Step-by-Step Worked TN HSC Board Exam Numerical Problem or Named Reaction Mechanism.
   - Division 4: Exceptions, Cross-Unit Connections, Common Exam Pitfalls & Board Exam 5-Mark Takeaways.
3. Each division's 'narration' MUST be 45 to 60 words of pure, thorough chemistry explanation written in a bold, clear spoken lecture style using only ONE single male speaker (${singleSpeakerLabel}) with a strong Indian accent. Never write two voices or a dialogue.
4. CRITICAL LANGUAGE RULE: Write ALL text fields (lessonTitle, topicSummary, slide titles, bulletPoints, narration, quickCheckQuestion prompt/options/explanation) strictly in ${langConfig.name} (${langConfig.nativeName}). Keep chemical formulas & equations clear.
${language === 'ta' ? "5. TAMIL VOICE CONTENT RULE: Every narration and every text field MUST contain natural Chennai colloquial Tamil language, not English sentences. English brand names or chemical symbols may remain only when scientifically necessary; never convert the whole explanation to English." : ''}
5. Choose 'visualType' for each division from: "molecular_orbit", "wave_energy", "reaction_kinetics", "equilibrium_curve", "formula_board".`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Create a detailed 4-division Tamil Nadu Class 12 (+2) Samacheer Kalvi Chemistry conceptual video lesson in ${langConfig.name} explaining every lesson concept of: "${normalizedTopic}". Do not use any greetings; explain thoroughly across all 4 divisions.`
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              lessonTitle: { type: 'STRING' },
              topicSummary: { type: 'STRING' },
              slides: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    slideNumber: { type: 'INTEGER' },
                    title: { type: 'STRING' },
                    visualType: {
                      type: 'STRING',
                      enum: ['molecular_orbit', 'wave_energy', 'reaction_kinetics', 'equilibrium_curve', 'formula_board']
                    },
                    equation: { type: 'STRING' },
                    bulletPoints: {
                      type: 'ARRAY',
                      items: { type: 'STRING' }
                    },
                    narration: { type: 'STRING' }
                  },
                  required: ['slideNumber', 'title', 'visualType', 'equation', 'bulletPoints', 'narration']
                }
              },
              quickCheckQuestion: {
                type: 'OBJECT',
                properties: {
                  prompt: { type: 'STRING' },
                  options: {
                    type: 'ARRAY',
                    items: { type: 'STRING' }
                  },
                  correctIndex: { type: 'INTEGER' },
                  explanation: { type: 'STRING' }
                },
                required: ['prompt', 'options', 'correctIndex', 'explanation']
              }
            },
            required: ['lessonTitle', 'topicSummary', 'slides', 'quickCheckQuestion']
          }
        }
      };

      const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini service returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty response received from Gemini.');
      }

      const parsedRaw = JSON.parse(rawText);
      const parsedLesson: GeneratedLesson = {
        lessonTitle: safeText(parsedRaw?.lessonTitle) || normalizedTopic,
        topicSummary: safeText(parsedRaw?.topicSummary),
        slides: Array.isArray(parsedRaw?.slides)
          ? parsedRaw.slides.map((s: Record<string, unknown>, idx: number) => ({
              slideNumber: Number(s?.slideNumber) || idx + 1,
              title: safeText(s?.title) || `Division ${idx + 1}`,
              visualType: [
                'molecular_orbit',
                'wave_energy',
                'reaction_kinetics',
                'equilibrium_curve',
                'formula_board'
              ].includes(String(s?.visualType))
                ? (s?.visualType as LessonSlide['visualType'])
                : 'formula_board',
              equation: safeText(s?.equation),
              bulletPoints: Array.isArray(s?.bulletPoints)
                ? s.bulletPoints.map((bp: unknown) => safeText(bp)).filter(Boolean)
                : [],
              narration: safeText(s?.narration) || safeText(s?.title)
            }))
          : [],
        quickCheckQuestion: {
          prompt: safeText(parsedRaw?.quickCheckQuestion?.prompt),
          options: Array.isArray(parsedRaw?.quickCheckQuestion?.options)
            ? parsedRaw.quickCheckQuestion.options.map((o: unknown) => safeText(o))
            : [],
          correctIndex: Number(parsedRaw?.quickCheckQuestion?.correctIndex) || 0,
          explanation: safeText(parsedRaw?.quickCheckQuestion?.explanation)
        }
      };

      lessonCacheRef.current[lessonCacheKey] = parsedLesson;
      setLesson(parsedLesson);
      setIsGenerating(false);
      setGenerationStep('');

      setCurrentSlideIdx(0);
      setSlideProgress(0);
      setIsPlaying(true);
      playSlideAudio(0, parsedLesson.slides[0]?.narration);
      prebufferRemainingDivisions(parsedLesson.slides, langConfig);
    } catch (err: unknown) {
      console.error('Chemistry lesson generation error:', err);
      const fallbackMessage =
        err instanceof Error ? err.message : safeText(err) || 'Unable to generate AI lesson. Please try again.';
      setErrorMsg(fallbackMessage);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  useEffect(() => {
    if (!isPlaying || !lesson) return;

    const interval = setInterval(() => {
      if (
        webAudioTimingRef.current &&
        unlockedAudioCtxRef.current &&
        webAudioTimingRef.current.duration > 0
      ) {
        const elapsed =
          unlockedAudioCtxRef.current.currentTime - webAudioTimingRef.current.startTime;
        const pct = Math.min(99, (elapsed / webAudioTimingRef.current.duration) * 100);
        setSlideProgress(pct);
        return;
      }

      if (fallbackTimingRef.current && fallbackTimingRef.current.durationMs > 0) {
        const elapsedMs = performance.now() - fallbackTimingRef.current.startMs;
        const pct = Math.min(99, (elapsedMs / fallbackTimingRef.current.durationMs) * 100);
        setSlideProgress(pct);
        return;
      }

      if (!audioFinishedRef.current && !isMuted) {
        setSlideProgress((prev) => (prev >= 99 ? 99 : prev + 0.5));
        return;
      }

      setSlideProgress(100);
      if (currentSlideIdx < lesson.slides.length - 1) {
        const nextIdx = currentSlideIdx + 1;
        setCurrentSlideIdx(nextIdx);
        setSlideProgress(0);
        playSlideAudio(nextIdx, lesson.slides[nextIdx]?.narration);
      } else {
        setIsPlaying(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, lesson, currentSlideIdx, isMuted, playSlideAudio]);

  const togglePlayPause = () => {
    if (!lesson) return;
    unlockBrowserAudio();
    if (isPlaying) {
      setIsPlaying(false);
      stopAllAudio();
      setAudioStatusLabel('Paused');
    } else {
      if (slideProgress >= 100 && currentSlideIdx === lesson.slides.length - 1) {
        setCurrentSlideIdx(0);
        setSlideProgress(0);
        playSlideAudio(0, lesson.slides[0]?.narration);
      } else {
        playSlideAudio(currentSlideIdx, lesson.slides[currentSlideIdx]?.narration);
      }
      setIsPlaying(true);
    }
  };

  const handleSelectSlide = (idx: number) => {
    if (!lesson) return;
    unlockBrowserAudio();
    setCurrentSlideIdx(idx);
    setSlideProgress(0);
    stopAllAudio();
    if (isPlaying) {
      playSlideAudio(idx, lesson.slides[idx]?.narration);
    }
  };

  useEffect(() => {
    if (lesson && isPlaying) {
      playSlideAudio(currentSlideIdx, lesson.slides[currentSlideIdx]?.narration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // ============================================================================
  // INTERACTIVE HTML5 CANVAS RENDERER FOR 4-DIVISION CHEMISTRY VIDEO LESSONS
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationTime = 0;

    const render = () => {
      animationTime += 0.03;
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }

      const w = canvas.width;
      const h = canvas.height;

      const bgMap = {
        lab_dark: '#09131c',
        chalkboard: '#133126',
        blueprint: '#0a2240'
      };
      const gridMap = {
        lab_dark: 'rgba(45, 212, 191, 0.07)',
        chalkboard: 'rgba(255, 255, 255, 0.07)',
        blueprint: 'rgba(56, 189, 248, 0.14)'
      };
      const accentMap = {
        lab_dark: '#14b8a6',
        chalkboard: '#fbbf24',
        blueprint: '#38bdf8'
      };

      ctx.fillStyle = bgMap[visualTheme];
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = gridMap[visualTheme];
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const currentSlide = lesson?.slides[currentSlideIdx];
      const progressRatio = Math.min(1, Math.max(0.15, slideProgress / 65));

      const isCompact = w < 640;
      const vizCenterX = isCompact ? w * 0.5 : w * 0.72;
      const vizCenterY = isCompact ? h * 0.72 : h * 0.54;
      const vizRadius = isCompact ? Math.min(w, h) * 0.22 : Math.min(w * 0.22, h * 0.34);

      if (!currentSlide) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.strokeStyle = accentMap[visualTheme];
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.rotate(animationTime * 0.6);
        ctx.beginPath();
        ctx.ellipse(0, 0, 74, 26, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 18px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Avichi ChemNova AI Video Studio Ready (All 15 Units)', 0, -68);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px Inter, system-ui, sans-serif';
        ctx.fillText('Select any TN Class 12 Unit/Lesson above & click "Generate AI Video Lesson"', 0, 88);
        ctx.restore();
      } else {
        ctx.fillStyle = accentMap[visualTheme];
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`DIVISION ${currentSlideIdx + 1} OF ${lesson.slides.length}`, 28, 36);

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${isCompact ? 18 : 22}px Inter, system-ui, sans-serif`;
        ctx.fillText(currentSlide.title, 28, 66);

        const eqBoxW = isCompact ? w - 56 : w * 0.44;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.roundRect(28, 84, eqBoxW, 46, 10);
        ctx.fill();
        ctx.strokeStyle = accentMap[visualTheme];
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#5eead4';
        ctx.font = `600 ${isCompact ? 14 : 16}px monospace`;
        ctx.fillText(currentSlide.equation, 42, 112);

        const bullets = currentSlide.bulletPoints || [];
        bullets.forEach((bp, idx) => {
          const threshold = (idx + 1) / (bullets.length + 1);
          const alpha = slideProgress >= threshold * 45 ? 1 : 0.35;
          ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
          ctx.font = `${isCompact ? 12 : 14}px Inter, system-ui, sans-serif`;
          const yPos = 158 + idx * 32;
          if (!isCompact || yPos < h * 0.46) {
            const truncated = bp.length > 54 ? bp.slice(0, 51) + '...' : bp;
            ctx.fillText(`•  ${truncated}`, 30, yPos);
          }
        });

        ctx.save();
        ctx.translate(vizCenterX, vizCenterY);

        const vType = currentSlide.visualType;
        ctx.strokeStyle = accentMap[visualTheme];
        ctx.lineWidth = 2.5;

        if (vType === 'molecular_orbit') {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();

          [0.55, 0.85].forEach((scale, orbitIdx) => {
            const r = vizRadius * scale;
            ctx.strokeStyle = 'rgba(94, 234, 212, 0.35)';
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();

            const angle = animationTime * (orbitIdx === 0 ? 1.4 : -0.9);
            const ex = Math.cos(angle) * r;
            const ey = Math.sin(angle) * r;
            ctx.fillStyle = orbitIdx === 0 ? '#38bdf8' : '#fb7185';
            ctx.beginPath();
            ctx.arc(ex, ey, 6, 0, Math.PI * 2);
            ctx.fill();
          });
        } else if (vType === 'reaction_kinetics') {
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.moveTo(-vizRadius, vizRadius * 0.6);
          ctx.lineTo(-vizRadius, -vizRadius * 0.6);
          ctx.moveTo(-vizRadius, vizRadius * 0.6);
          ctx.lineTo(vizRadius, vizRadius * 0.6);
          ctx.stroke();

          ctx.strokeStyle = accentMap[visualTheme];
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let i = -50; i <= 50; i++) {
            const t = (i + 50) / 100;
            const px = -vizRadius * 0.85 + t * vizRadius * 1.7;
            const barrier = Math.exp(-Math.pow((t - 0.45) / 0.18, 2)) * vizRadius * 0.9;
            const py = vizRadius * 0.25 - t * vizRadius * 0.25 - barrier;
            if (i === -50) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          const markerT = (animationTime * 0.25) % 1;
          const mx = -vizRadius * 0.85 + markerT * vizRadius * 1.7;
          const mBarrier = Math.exp(-Math.pow((markerT - 0.45) / 0.18, 2)) * vizRadius * 0.9;
          const my = vizRadius * 0.25 - markerT * vizRadius * 0.25 - mBarrier;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(mx, my, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (vType === 'equilibrium_curve') {
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.moveTo(-vizRadius, vizRadius * 0.6);
          ctx.lineTo(-vizRadius, -vizRadius * 0.6);
          ctx.moveTo(-vizRadius, vizRadius * 0.6);
          ctx.lineTo(vizRadius, vizRadius * 0.6);
          ctx.stroke();

          const eqX = -vizRadius + vizRadius * 1.2 * progressRatio;
          const eqY = 0;

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-vizRadius, -vizRadius * 0.45);
          ctx.quadraticCurveTo(-vizRadius * 0.2, eqY + 12, eqX, eqY);
          ctx.stroke();

          ctx.strokeStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(-vizRadius, vizRadius * 0.55);
          ctx.quadraticCurveTo(-vizRadius * 0.2, eqY - 12, eqX, eqY);
          ctx.stroke();
        } else {
          ctx.strokeStyle = accentMap[visualTheme];
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let i = -60; i <= 60; i++) {
            const px = (i / 60) * vizRadius;
            const py = -Math.sin((i / 60) * Math.PI * 2 + animationTime * 0.7) * (vizRadius * 0.5);
            if (i === -60) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [lesson, currentSlideIdx, slideProgress, visualTheme]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {ui.topicLabel}
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'எ.கா., 12-ஆம் வகுப்பு அலகு 12 ஆல்டால் மற்றும் கனிசரோ வினை...'
                    : 'e.g., TN Class 12 Unit 12 Aldol Condensation & Cannizzaro Reaction...'
                }
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {language === 'ta' ? 'தரம்' : 'Level'}
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value as 'Foundation' | 'Intermediate' | 'Exam Mastery')}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Foundation">{language === 'ta' ? 'அடிப்படை' : 'Foundation'}</option>
                <option value="Intermediate">{language === 'ta' ? 'நடுத்தரம்' : 'Intermediate'}</option>
                <option value="Exam Mastery">{language === 'ta' ? 'பொதுத்தேர்வு தேர்ச்சி' : 'Public Exam Mastery'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {language === 'ta' ? 'பாடகுழு வடிவம்' : 'Lab Board'}
              </label>
              <select
                value={visualTheme}
                onChange={(e) => setVisualTheme(e.target.value as 'lab_dark' | 'chalkboard' | 'blueprint')}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="lab_dark">{language === 'ta' ? 'வேதியியல் ஆய்வகம் - இருண்டது' : 'Chemistry Lab Dark'}</option>
                <option value="chalkboard">{language === 'ta' ? 'கறுப்புப் பலகை' : 'Chalkboard'}</option>
                <option value="blueprint">{language === 'ta' ? 'வரைபடத் திட்டம்' : 'Blueprint'}</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateLesson}
            disabled={isGenerating || !promptTopic.trim()}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{ui.generatingBtn}</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>{ui.generateBtn}</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {language === 'ta' ? '15 அலகுகளின் விரைவு வீடியோ பாடங்கள்:' : 'All 15 Units Quick Video Presets:'}
          </span>
          {[
            'Unit 1: Metallurgy & Ellingham Diagram',
            'Unit 2: p-Block I (Diborane & Silicones)',
            'Unit 3: p-Block II (Ostwald & Contact Process)',
            'Unit 4: d & f Block (KMnO4 & Lanthanide Contraction)',
            'Unit 5: Coordination Chemistry (VBT & CFT)',
            'Unit 6: Solid State (FCC Packing & Defects)',
            'Unit 7: Chemical Kinetics (1st Order & Arrhenius)',
            'Unit 8: Ionic Equilibrium (pH, Buffers & Ksp)',
            'Unit 9: Electrochemistry (Nernst & Kohlrausch Law)',
            'Unit 10: Surface Chemistry (Adsorption & Colloids)',
            'Unit 11: Hydroxy Compounds & Ethers (Phenols)',
            'Unit 12: Carbonyls & Carboxylic Acids (Aldol)',
            'Unit 13: Organic Nitrogen Compounds (Amines)',
            'Unit 14: Biomolecules (Glucose, Proteins & DNA)',
            'Unit 15: Chemistry in Everyday Life (Drugs & Polymers)'
          ].map((preset, presetIndex) => (
            <button
              type="button"
              key={preset}
              onClick={() => setPromptTopic(`TN Class 12 Chemistry ${preset}`)}
              className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-900/40 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-colors cursor-pointer"
            >
              {language === 'ta'
                ? `அலகு ${presetIndex + 1}: ${TN_CHEMISTRY_SYLLABUS[presetIndex].tamilTitle}`
                : preset}
            </button>
          ))}
        </div>

        {isGenerating && (
          <div className="mt-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-center gap-3 text-sm text-teal-700 dark:text-teal-300">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{safeText(generationStep)}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-between gap-3 text-sm text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{safeText(errorMsg)}</span>
            </div>
            <button
              type="button"
              onClick={handleGenerateLesson}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 cursor-pointer"
            >
            {language === 'ta' ? 'மீண்டும் முயல்க' : 'Retry'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative w-full h-[360px] sm:h-[430px]">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {lesson && lesson.slides[currentSlideIdx] && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-xl px-4 py-2.5 text-center">
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                {lesson.slides[currentSlideIdx].narration}
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-3">
          {lesson && (
            <div className="grid grid-cols-4 gap-2">
              {lesson.slides.map((s, idx) => {
                let fill = 0;
                if (idx < currentSlideIdx) fill = 100;
                else if (idx === currentSlideIdx) fill = slideProgress;

                return (
                  <button
                    type="button"
                    key={s.slideNumber}
                    onClick={() => handleSelectSlide(idx)}
                    className="group text-left focus:outline-none cursor-pointer"
                  >
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-teal-500 transition-all duration-100"
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                    <p
                      className={`text-[11px] truncate ${
                        idx === currentSlideIdx
                          ? 'text-teal-400 font-semibold'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      Div {idx + 1}: {s.title}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayPause}
                disabled={!lesson}
                className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleSelectSlide(Math.max(0, currentSlideIdx - 1))}
                disabled={!lesson || currentSlideIdx === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
                title="Previous Division"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectSlide(Math.min((lesson?.slides.length || 1) - 1, currentSlideIdx + 1))
                }
                disabled={!lesson || currentSlideIdx === (lesson?.slides.length || 1) - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
                title="Next Division"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectSlide(0)}
                disabled={!lesson}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
                title="Restart Lesson"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px] text-slate-300">
                {isAudioLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-teal-400" />
                ) : (
                  <Mic className={`w-3 h-3 ${isMuted ? 'text-rose-400' : 'text-emerald-400'}`} />
                )}
                <span className="truncate max-w-[180px] sm:max-w-[260px]">
                  {isMuted ? 'Audio Muted' : audioStatusLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  unlockBrowserAudio();
                  const nextMute = !isMuted;
                  setIsMuted(nextMute);
                  if (nextMute) {
                    stopAllAudio();
                  } else if (lesson && isPlaying) {
                    playSlideAudio(currentSlideIdx, lesson.slides[currentSlideIdx]?.narration);
                  }
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Bold Male Voice' : 'Mute Voice'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {lesson && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{lesson.lessonTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI Generated Chemistry Video Notes (4 Divisions)</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lesson.topicSummary}
            </p>
            <div className="space-y-2 pt-2">
              {lesson.slides.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSlide(idx)}
                  className={`p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                    idx === currentSlideIdx
                      ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                    <span>
                      Division {idx + 1}. {s.title}
                    </span>
                    <code className="text-xs px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-teal-700 dark:text-teal-300">
                      {s.equation}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Lesson Mastery Check</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Test your chemistry concept immediately</p>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {lesson.quickCheckQuestion.prompt}
              </p>

              <div className="space-y-2">
                {lesson.quickCheckQuestion.options.map((opt, idx) => {
                  const isSelected = quizChoice === idx;
                  const isCorrect = idx === lesson.quickCheckQuestion.correctIndex;
                  let btnStyle =
                    'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                  if (quizChoice !== null) {
                    if (isCorrect) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-medium';
                    } else if (isSelected) {
                      btnStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setQuizChoice(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizChoice !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {quizChoice !== null && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {quizChoice !== null && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-white">Explanation: </span>
                {lesson.quickCheckQuestion.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

function ChemNovaStudioContent() {
  const [language, setLanguage] = useState<LangCode>('ta');
  const [activeTab, setActiveTab] = useState<'studio' | 'syllabus' | 'practice' | 'past'>('studio');
  const [selectedVolume, setSelectedVolume] = useState<VolumeFilter>('all');
  const [studioTopic, setStudioTopic] = useState<string | undefined>(undefined);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({
    'tn12-c1-t1': true
  });

  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [searchPast, setSearchPast] = useState('');

  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorAnswer, setTutorAnswer] = useState<string | null>(null);
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  const ui = UI_STRINGS[language];
  const langConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    document.documentElement.lang = langConfig.bcp47;
    document.title =
      language === 'ta'
        ? 'அவிச்சி கெம்நோவா - 12-ஆம் வகுப்பு வேதியியல் AI வீடியோ பாடம்'
        : 'Avichi ChemNova - TN Class 12 (+2) Chemistry AI Video Studio';
  }, [language, langConfig.bcp47]);

  const launchLessonForTopic = (topicTitle: string) => {
    setStudioTopic(topicTitle);
    setActiveTab('studio');
  };

  const toggleTopicComplete = (id: string) => {
    setCompletedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredChapters =
    selectedVolume === 'all'
      ? TN_CHEMISTRY_SYLLABUS
      : TN_CHEMISTRY_SYLLABUS.filter((u) => u.volume === selectedVolume);
  const totalTopicsCount = TN_CHEMISTRY_SYLLABUS.reduce((acc, u) => acc + u.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const masteryPercentage = Math.round((completedCount / totalTopicsCount) * 100);

  const filteredPractice =
    selectedTopicFilter === 'all'
      ? PRACTICE_QUESTIONS
      : PRACTICE_QUESTIONS.filter((q) => q.topicId === selectedTopicFilter);

  const filteredPastQuestions = PAST_QUESTIONS.filter(
    (pq) =>
      pq.topic.toLowerCase().includes(searchPast.toLowerCase()) ||
      pq.question.toLowerCase().includes(searchPast.toLowerCase()) ||
      pq.year.toString().includes(searchPast)
  );

  const handleAskTutor = async () => {
    if (!tutorQuestion.trim()) return;
    setIsTutorThinking(true);
    setTutorAnswer(null);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: tutorQuestion }]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: `You are Avichi ChemNova AI Tutor for Tamil Nadu State Board Class 12 (+2) Samacheer Kalvi Chemistry. Provide concise, crystal-clear step-by-step chemical explanations, reactions, and numericals strictly in ${langConfig.name} (${langConfig.nativeName}).`
            }
          ]
        }
      };

      const res = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setTutorAnswer(reply || 'Could not generate a response. Please rephrase your chemistry question.');
    } catch {
      setTutorAnswer('Connection issue while reaching Gemini AI. Please try again.');
    } finally {
      setIsTutorThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Avichi ChemNova
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800">
                  {ui.appSubtitle}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl overflow-x-auto">
            {[
              { id: 'studio', label: ui.tabStudio, icon: Video },
              { id: 'syllabus', label: ui.tabSyllabus, icon: Layers },
              { id: 'practice', label: ui.tabPractice, icon: Brain },
              { id: 'past', label: ui.tabPast, icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'studio' | 'syllabus' | 'practice' | 'past')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LangCode)}
                aria-label="Select Lesson & Male Voice Language"
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-white dark:bg-slate-900">
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden xl:flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{ui.syllabusMastery}</p>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {completedCount}/{totalTopicsCount} ({masteryPercentage}%)
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
                <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ui.studioHeader}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{ui.studioSub}</p>
              </div>
            </div>

            <AiChemistryStudio initialTopic={studioTopic} language={language} />
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ui.syllabusHeader}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{ui.syllabusSub}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {[
                  {
                    vol: 'all' as VolumeFilter,
                    title: language === 'ta' ? '12-ஆம் வகுப்பு அனைத்தும்' : 'All Class 12',
                    badge: language === 'ta' ? '15 அலகுகள்' : '15 Units'
                  },
                  {
                    vol: 'Volume 1' as VolumeFilter,
                    title: language === 'ta' ? 'தொகுதி 1' : 'Volume 1',
                    badge: language === 'ta' ? 'அலகுகள் 1–7' : 'Units 1–7'
                  },
                  {
                    vol: 'Volume 2' as VolumeFilter,
                    title: language === 'ta' ? 'தொகுதி 2' : 'Volume 2',
                    badge: language === 'ta' ? 'அலகுகள் 8–15' : 'Units 8–15'
                  }
                ].map((v) => {
                  const active = selectedVolume === v.vol;
                  return (
                    <button
                      type="button"
                      key={v.vol}
                      onClick={() => setSelectedVolume(v.vol)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>{v.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          active
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {v.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChapters.map((unit) => (
                <div
                  key={unit.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-start gap-3">
                        <span className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 font-bold text-sm flex items-center justify-center shrink-0">
                          {unit.number < 10 ? `0${unit.number}` : unit.number}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                              {language === 'ta'
                                ? `அலகு ${unit.number}: ${unit.tamilTitle}`
                                : `Unit ${unit.number}: ${unit.title}`}
                            </h2>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-300 border border-cyan-200/70 dark:border-cyan-800">
                              {language === 'ta'
                                ? unit.volume === 'Volume 1'
                                  ? 'தொகுதி 1'
                                  : 'தொகுதி 2'
                                : unit.volume}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mt-0.5">
                            {language === 'ta' ? 'தமிழ்நாடு சமச்சீர் கல்வி பாடத்திட்டம்' : unit.tamilTitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {unit.topics.map((topic) => {
                      const isDone = !!completedTopics[topic.id];
                      return (
                        <div key={topic.id} className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {language === 'ta' ? topic.tamilTitle : topic.description}
                            </p>
                            <button
                              type="button"
                              onClick={() => toggleTopicComplete(topic.id)}
                              className={`p-1.5 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-teal-500'
                              }`}
                              title="Mark Unit Complete"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-800 space-y-2">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                          {language === 'ta'
                                            ? 'சமச்சீர் கல்வி 12-ஆம் வகுப்பு வேதியியல் பாடங்கள் (வீடியோ விளக்கத்திற்கு கிளிக் செய்யவும்):'
                                            : 'Samacheer Kalvi Class 12 Chemistry Lessons (Click for Video Explanation):'}
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {topic.subTopics.map((sub, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 group"
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                                    <span>{language === 'ta' ? `${topic.tamilTitle} - பகுதி ${sIdx + 1}` : sub}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      launchLessonForTopic(
                                        `TN Class 12 Chemistry Unit ${unit.number} (${unit.title}) - Lesson ${sub}`
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-600 dark:bg-teal-950/80 dark:hover:bg-teal-600 text-[11px] text-teal-600 hover:text-white dark:text-teal-300 dark:hover:text-white font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                                  >
                                    <Play className="w-3 h-3" />
                                    <span>{language === 'ta' ? 'வீடியோ பாடம்' : 'Video Lesson'}</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {topic.keyFormulas.map((f, i) => (
                              <code
                                key={i}
                                className="text-[11px] px-2.5 py-1 rounded-md bg-teal-50/60 dark:bg-slate-800 border border-teal-200/60 dark:border-slate-700 text-teal-700 dark:text-teal-300"
                              >
                                {f}
                              </code>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'ta'
                        ? `12-ஆம் வகுப்பு (+2) வேதியியல் • ${unit.volume === 'Volume 1' ? 'தொகுதி 1' : 'தொகுதி 2'}`
                        : `Class 12 (+2) Chemistry • ${unit.volume}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        launchLessonForTopic(
                          `TN State Board Class 12 Chemistry (${unit.volume}) Complete Unit ${unit.number}: ${unit.title}`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{ui.watchLesson}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ui.practiceHeader}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Tamil Nadu State Board Class 12 (+2) Chemistry practice questions with worked explanations.
                  </p>
                </div>

                <select
                  value={selectedTopicFilter}
                  onChange={(e) => setSelectedTopicFilter(e.target.value)}
                  className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 max-w-xs"
                >
                  <option value="all">All Class 12 Chemistry Units (1–15)</option>
                  {TN_CHEMISTRY_SYLLABUS.flatMap((u) =>
                    u.topics.map((t) => ({
                      id: t.id,
                      label: `Unit ${u.number}: ${u.title}`
                    }))
                  ).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {filteredPractice.map((pq, index) => {
                  const chosen = userAnswers[pq.id];
                  const hasAnswered = chosen !== undefined;

                  return (
                    <div
                      key={pq.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                          Question {index + 1}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {pq.difficulty}
                        </span>
                      </div>

                      <p className="text-base font-medium text-slate-900 dark:text-white">
                        {pq.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {pq.options.map((opt, optIdx) => {
                          const isThisSelected = chosen === optIdx;
                          const isThisCorrect = optIdx === pq.correctIndex;

                          let style =
                            'border-slate-200 dark:border-slate-800 hover:border-teal-400 text-slate-700 dark:text-slate-300';
                          if (hasAnswered) {
                            if (isThisCorrect) {
                              style =
                                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold';
                            } else if (isThisSelected) {
                              style =
                                'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                            }
                          }

                          return (
                            <button
                              type="button"
                              key={optIdx}
                              onClick={() =>
                                setUserAnswers((prev) => ({ ...prev, [pq.id]: optIdx }))
                              }
                              className={`px-4 py-3 rounded-xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${style}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && isThisCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {hasAnswered && isThisSelected && !isThisCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Explanation:{' '}
                          </span>
                          {pq.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 sticky top-24">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-600 text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{ui.askTutorTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Responds in {langConfig.nativeName}
                    </p>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={tutorQuestion}
                  onChange={(e) => setTutorQuestion(e.target.value)}
                  placeholder="Ask any TN Class 12 Chemistry reaction, law, or numerical..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <button
                  type="button"
                  onClick={handleAskTutor}
                  disabled={isTutorThinking || !tutorQuestion.trim()}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isTutorThinking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Solving...</span>
                    </>
                  ) : (
                    <span>{ui.solveBtn}</span>
                  )}
                </button>

                {tutorAnswer && (
                  <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {tutorAnswer}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ui.pastHeader}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tamil Nadu HSC (+2) Chemistry 5-Mark Public Exam questions with step-by-step markscheme solutions.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchPast}
                  onChange={(e) => setSearchPast(e.target.value)}
                  placeholder="Search year or unit..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredPastQuestions.map((item) => {
                const isOpen = !!expandedSolutions[item.id];
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 text-xs font-bold">
                          {item.year}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.paper}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {item.topic}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800">
                        [{item.marks} Marks]
                      </span>
                    </div>

                    <p className="text-base text-slate-900 dark:text-white leading-relaxed">
                      {item.question}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSolutions((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id]
                          }))
                        }
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        {isOpen ? 'Hide Markscheme Solution' : 'Reveal Markscheme Solution'}
                      </button>

                      <button
                        type="button"
                        onClick={() => launchLessonForTopic(item.topic)}
                        className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-xs font-semibold text-teal-600 dark:text-teal-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Generate Video Walkthrough</span>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                        {item.solutionSteps.map((st, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                          >
                            {st}
                          </p>
                        ))}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                            Final Answer:{' '}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.finalAnswer}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StudioErrorBoundary>
      <ChemNovaStudioContent />
    </StudioErrorBoundary>
  );
}
