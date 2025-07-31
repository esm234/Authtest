import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  Brain, 
  Trophy, 
  Rocket, 
  Star, 
  Timer, 
  Layers, 
  Shuffle, 
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Check,
  Settings2,
  Sparkles,
  Flame,
  Target,
  BookText,
  Lightbulb,
  ArrowUpRight,
  FolderOpen,
  Sparkle, // Added for more sparkle effects
  Globe // Added for a global feel
} from 'lucide-react';
import { useExamStore } from '../store/examStore';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

// Variants for Framer Motion animations
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      delayChildren: 0.2, 
      staggerChildren: 0.1 
    } 
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  initial: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
  hover: { scale: 1.03, boxShadow: '0px 10px 30px rgba(0,0,0,0.3)' },
  selected: { scale: 1.02, boxShadow: '0px 10px 40px rgba(0,0,0,0.4)', transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const StartScreen = ({ onShowFolderManagement }) => {
  const { initializeExam } = useExamStore();
  
  useEffect(() => {
    document.documentElement.style.overflowY = 'scroll';
    return () => {
      document.documentElement.style.overflowY = '';
    };
  }, []);

  const loadSavedSettings = () => {
    try {
      const saved = localStorage.getItem('examSettings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
    return {
      examMode: 'sectioned',
      timerMode: 'none',
      selectedTimerDuration: 30, // Changed default to 30 for better UX
      questionTypeFilter: 'all',
      selectedQuestionType: 'analogy',
      rcQuestionOrder: 'sequential'
    };
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState(loadSavedSettings());
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    examMode,
    timerMode,
    selectedTimerDuration,
    questionTypeFilter,
    selectedQuestionType,
    rcQuestionOrder
  } = settings;

  useEffect(() => {
    localStorage.setItem('examSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const questionTypeOptions = [
    { 
      id: 'analogy', 
      title: 'التناظر اللفظي', 
      subtitle: 'العلاقات والمقارنات', 
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
      stats: '1200+ سؤال'
    },
    { 
      id: 'completion', 
      title: 'إكمال الجمل', 
      subtitle: 'ملء الفراغات بدقة', 
      icon: BookText,
      color: 'from-emerald-500 to-teal-600',
      stats: '900+ سؤال'
    },
    { 
      id: 'error', 
      title: 'الخطأ السياقي', 
      subtitle: 'تحديد الأخطاء', 
      icon: Target,
      color: 'from-rose-500 to-pink-600',
      stats: '800+ سؤال'
    },
    { 
      id: 'rc', 
      title: 'استيعاب المقروء', 
      subtitle: 'فهم النصوص', 
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-600',
      stats: '2800+ سؤال'
    },
    { 
      id: 'odd', 
      title: 'المفردة الشاذة', 
      subtitle: 'تحديد المختلف', 
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-600',
      stats: '400+ سؤال'
    }
  ];

  const timerDurations = [
    { value: 30, label: '30 دقيقة', recommended: true },
    { value: 45, label: '45 دقيقة', recommended: false },
    { value: 60, label: 'ساعة كاملة', recommended: false },
    { value: 90, label: 'ساعة ونصف', recommended: false },
    { value: 120, label: 'ساعتان', recommended: false },
    { value: 180, label: '3 ساعات', recommended: false },
  ];

  const handleStepChange = (step) => {
    if (step === currentStep) return; // Prevent re-animating if clicking current step
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsAnimating(false);
    }, 300); // Match this duration with AnimatePresence exit duration
  };

  const handleNext = () => {
    if (currentStep < 3) {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      handleStepChange(currentStep - 1);
    }
  };

  const handleStartExam = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const config = {
      examMode,
      timerMode,
      timerDuration: timerMode === 'none' ? 0 : selectedTimerDuration,
      shuffleQuestions: true,
      shuffleAnswers: false,
      questionTypeFilter,
      selectedQuestionType: questionTypeFilter === 'specific' ? selectedQuestionType : null,
      rcQuestionOrder
    };
    initializeExam(config);
  };

  const getCurrentQuestionType = () => {
    return questionTypeOptions.find(type => type.id === selectedQuestionType);
  };

  const getSelectedTimerInfo = () => {
    return timerDurations.find(timer => timer.value === selectedTimerDuration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-zinc-950 text-white overflow-hidden relative font-cairo" dir="rtl">
      {/* Animated Background Elements - More vibrant and dynamic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-700/30 to-purple-700/30 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-20 left-10 w-100 h-100 bg-gradient-to-r from-emerald-700/25 to-cyan-700/25 rounded-full blur-3xl animate-blob-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-700/20 to-rose-700/20 rounded-full blur-3xl animate-blob-3"></div>
        {/* Subtle particle effect overlay */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h3v3H0V0zm3 3h3v3H3V3z\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '6px 6px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header with Dynamic Progress */}
        <div className="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-gray-700/50 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Right section with title */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <Globe className="h-6 w-6 text-blue-400 mr-2 hidden sm:block" /> {/* Added Globe icon */}
                <div>
                  <h1 className="text-base sm:text-xl font-extrabold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-md">
                    <span className="hidden sm:inline">محاكي أور جول</span>
                    <span className="sm:hidden">أور جول</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400">المرحلة {currentStep} من 3</p>
                </div>
              </motion.div>

              {/* Middle section with Progress Steps */}
              <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                {[1, 2, 3].map((step) => (
                  <motion.button
                    key={step}
                    onClick={() => handleStepChange(step)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 text-sm sm:text-base relative overflow-hidden
                      ${currentStep >= step
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                  >
                    {currentStep > step ? <Check className="h-4 w-4 sm:h-5 sm:w-5 animate-scale-in" /> : step}
                    {currentStep === step && (
                      <motion.span 
                        className="absolute inset-0 rounded-full bg-white opacity-10 animate-ping-slow" 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1.5 }} 
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Left section with My Folders button */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  onClick={onShowFolderManagement}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base relative overflow-hidden group"
                >
                  <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-6 transition-transform duration-300" />
                  <span className="hidden sm:inline">مجلداتي</span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                </motion.button>
              </motion.div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <AnimatePresence mode='wait'>
            {currentStep === 1 && (
              <motion.div 
                key="step1" 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                exit="exit"
              >
                <motion.div variants={itemVariants} className="text-center mb-12">
                  <div className="flex justify-center mb-6">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-xl"
                    >
                      <BarChart3 className="h-16 w-16 text-white animate-pulse-slow" />
                    </motion.div>
                  </div>
                  <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-lg">
                    اختر نمط التدريب
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    حدد المجال الذي تريد التركيز عليه في رحلتك التدريبية
                  </p>
                </motion.div>

                {/* Question Type Filter Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* All Types Option */}
                  <motion.div 
                    onClick={() => updateSetting('questionTypeFilter', 'all')}
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                    animate={questionTypeFilter === 'all' ? "selected" : "initial"}
                    className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      questionTypeFilter === 'all'
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 shadow-xl shadow-emerald-500/20'
                        : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-xl ${
                        questionTypeFilter === 'all' ? 'bg-emerald-600' : 'bg-gray-700 group-hover:bg-gray-600'
                      } transition-colors duration-300`}>
                        <Layers className="h-8 w-8 text-white" />
                      </div>
                      {questionTypeFilter === 'all' && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                          className="p-2 bg-emerald-600 rounded-full shadow-lg"
                        >
                          <Check className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">تدريب شامل</h3>
                    <p className="text-gray-300 mb-4">اختبار متكامل يغطي جميع أنواع الأسئلة</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full">الأكثر شمولية</span>
                      <span className="text-gray-400">5000+ سؤال</span>
                    </div>
                  </motion.div>

                  {/* Specific Type Option */}
                  <motion.div 
                    onClick={() => updateSetting('questionTypeFilter', 'specific')}
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                    animate={questionTypeFilter === 'specific' ? "selected" : "initial"}
                    className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      questionTypeFilter === 'specific'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 shadow-xl shadow-purple-500/20'
                        : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-xl ${
                        questionTypeFilter === 'specific' ? 'bg-purple-600' : 'bg-gray-700 group-hover:bg-gray-600'
                      } transition-colors duration-300`}>
                        <Target className="h-8 w-8 text-white" />
                      </div>
                      {questionTypeFilter === 'specific' && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                          className="p-2 bg-purple-600 rounded-full shadow-lg"
                        >
                          <Check className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">تدريب مُركز</h3>
                    <p className="text-gray-300 mb-4">تركيز عالي على نوع محدد من الأسئلة</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full">تخصصي</span>
                      <span className="text-gray-400">
                        {questionTypeFilter === 'specific' && selectedQuestionType 
                          ? getCurrentQuestionType()?.stats 
                          : 'متغير'}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Question Type Selection Grid */}
                {questionTypeFilter === 'specific' && (
                  <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible" 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {questionTypeOptions.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <motion.div
                          key={type.id}
                          onClick={() => updateSetting('selectedQuestionType', type.id)}
                          variants={cardVariants}
                          initial="initial"
                          whileHover="hover"
                          animate={selectedQuestionType === type.id ? "selected" : "initial"}
                          className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedQuestionType === type.id
                              ? 'border-white bg-gradient-to-br from-white/10 to-white/5 shadow-2xl shadow-white/20'
                              : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color}`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            {selectedQuestionType === type.id && (
                              <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                className="p-1 bg-white rounded-full shadow-lg"
                              >
                                <Check className="h-4 w-4 text-gray-900" />
                              </motion.div>
                            )}
                          </div>
                          <h4 className="text-lg font-bold mb-2">{type.title}</h4>
                          <p className="text-gray-400 text-sm mb-3">{type.subtitle}</p>
                          <div className="text-xs text-gray-500">{type.stats}</div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Exam Mode & Timer */}
            {currentStep === 2 && (
              <motion.div 
                key="step2" 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                exit="exit"
              >
                <motion.div variants={itemVariants} className="text-center mb-12">
                  <div className="flex justify-center mb-6">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl"
                    >
                      <Settings2 className="h-16 w-16 text-white animate-spin-slow" />
                    </motion.div>
                  </div>
                  <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
                    إعدادات التجربة
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    اختر نمط الاختبار والمؤقت المناسب لمستواك
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Exam Mode Section */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-blue-300">
                      <Shuffle className="h-6 w-6 text-blue-400" />
                      نمط الاختبار
                    </h3>
                    
                    <div className="space-y-4">
                      <motion.div
                        onClick={() => updateSetting('examMode', 'sectioned')}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        animate={examMode === 'sectioned' ? "selected" : "initial"}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          examMode === 'sectioned'
                            ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 shadow-lg shadow-blue-500/20'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${examMode === 'sectioned' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                              <Layers className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold">أقسام مع مراجعة</h4>
                          </div>
                          {examMode === 'sectioned' && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              transition={{ type: "spring", stiffness: 500, damping: 20 }}
                              className="p-1 bg-blue-600 rounded-full shadow-lg"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">
                          الاختبار مقسم إلى أجزاء مع إمكانية مراجعة ومعاينة الإجابات
                        </p>
                      </motion.div>

                      <motion.div
                        onClick={() => updateSetting('examMode', 'single')}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        animate={examMode === 'single' ? "selected" : "initial"}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          examMode === 'single'
                            ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 shadow-lg shadow-blue-500/20'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${examMode === 'single' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                              <Zap className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold">متتالي ومجمع</h4>
                          </div>
                          {examMode === 'single' && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              transition={{ type: "spring", stiffness: 500, damping: 20 }}
                              className="p-1 bg-blue-600 rounded-full shadow-lg"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">
                          جميع الأسئلة في قسم واحد متواصل بدون توقف أو مراجعة
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Timer Settings */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-emerald-300">
                      <Timer className="h-6 w-6 text-emerald-400" />
                      إعدادات المؤقت
                    </h3>
                    
                    <div className="space-y-4">
                      <motion.div
                        onClick={() => updateSetting('timerMode', 'none')}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        animate={timerMode === 'none' ? "selected" : "initial"}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          timerMode === 'none'
                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 shadow-lg shadow-emerald-500/20'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${timerMode === 'none' ? 'bg-emerald-600' : 'bg-gray-700'}`}>
                              <Star className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold">بدون مؤقت</h4>
                          </div>
                          {timerMode === 'none' && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              transition={{ type: "spring", stiffness: 500, damping: 20 }}
                              className="p-1 bg-emerald-600 rounded-full shadow-lg"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">
                          وقت مفتوح للتركيز الكامل على الإجابات بدون ضغط زمني
                        </p>
                      </motion.div>

                      <motion.div
                        onClick={() => updateSetting('timerMode', 'total')}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        animate={timerMode === 'total' ? "selected" : "initial"}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          timerMode === 'total'
                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 shadow-lg shadow-emerald-500/20'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${timerMode === 'total' ? 'bg-emerald-600' : 'bg-gray-700'}`}>
                              <Timer className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold">مع مؤقت زمني</h4>
                          </div>
                          {timerMode === 'total' && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              transition={{ type: "spring", stiffness: 500, damping: 20 }}
                              className="p-1 bg-emerald-600 rounded-full shadow-lg"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                          تدريب واقعي مع مؤقت لمحاكاة ظروف الاختبار الحقيقي
                        </p>
                        
                        {timerMode === 'total' && (
                          <motion.div 
                            variants={containerVariants} 
                            initial="hidden" 
                            animate="visible" 
                            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"
                          >
                            {timerDurations.map((timer) => (
                              <motion.button
                                key={timer.value}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateSetting('selectedTimerDuration', timer.value);
                                }}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  selectedTimerDuration === timer.value
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {timer.recommended && (
                                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse-fast border border-yellow-500"></span>
                                )}
                                {timer.label}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Reading Comprehension Order */}
                {(questionTypeFilter === 'all' || (questionTypeFilter === 'specific' && selectedQuestionType === 'rc')) && (
                  <motion.div variants={itemVariants} className="mt-12 p-8 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-2xl border border-amber-700/30 shadow-xl">
                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-amber-300">
                      <BookText className="h-6 w-6 text-amber-400" />
                      ترتيب أسئلة استيعاب المقروء
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        onClick={() => updateSetting('rcQuestionOrder', 'sequential')}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        animate={rcQuestionOrder === 'sequential' ? "selected" : "initial"}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          rcQuestionOrder === 'sequential'
                            ? 'border-amber-500 bg-amber-900/40 shadow-lg shadow-amber-500/20'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">ترتيب متتالي</h4>
                          {rcQuestionOrder === 'sequential' && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              transition={{ type: "spring", stiffness: 500, damping: 20 }}
                              className="p-1 bg-amber-600 rounded-full shadow-lg"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">
                          أسئلة النص الواحد تأتي متتابعة ومجمعة
                        </p>
                      </motion.div>

                      <motion.div
                        onClick={() => updateSetting('rcQuestionOrder', 'random')}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        animate={rcQuestionOrder === 'random' ? "selected" : "initial"}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          rcQuestionOrder === 'random'
                            ? 'border-amber-500 bg-amber-900/40 shadow-lg shadow-amber-500/20'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">ترتيب عشوائي</h4>
                          {rcQuestionOrder === 'random' && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              transition={{ type: "spring", stiffness: 500, damping: 20 }}
                              className="p-1 bg-amber-600 rounded-full shadow-lg"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">
                          توزيع عشوائي كامل لجميع الأسئلة
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3: Review & Start */}
            {currentStep === 3 && (
              <motion.div 
                key="step3" 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                exit="exit"
              >
                <motion.div variants={itemVariants} className="text-center mb-12">
                  <div className="flex justify-center mb-6">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="p-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl shadow-xl"
                    >
                      <Rocket className="h-16 w-16 text-white animate-bounce-slow" />
                    </motion.div>
                  </div>
                  <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent drop-shadow-lg">
                    كل شيء جاهز!
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    راجع إعداداتك النهائية قبل بدء رحلة التدريب
                  </p>
                </motion.div>

                {/* Settings Summary Cards */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {/* Question Type Summary */}
                  <motion.div variants={itemVariants} className="p-6 bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl border border-violet-700/30 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-violet-600 rounded-lg">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-violet-300">نوع التدريب</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white font-medium text-xl">
                        {questionTypeFilter === 'all' ? 'تدريب شامل' : 'تدريب مُركز'}
                      </p>
                      {questionTypeFilter === 'specific' && (
                        <p className="text-violet-300 text-sm">
                          {getCurrentQuestionType()?.title}
                        </p>
                      )}
                      <p className="text-gray-400 text-xs">
                        {questionTypeFilter === 'all' ? '5000+ سؤال' : getCurrentQuestionType()?.stats}
                      </p>
                    </div>
                  </motion.div>

                  {/* Exam Mode Summary */}
                  <motion.div variants={itemVariants} className="p-6 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/30 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Layers className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-300">نمط الاختبار</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white font-medium text-xl">
                        {examMode === 'sectioned' ? 'أقسام مع مراجعة' : 'متتالي ومجمع'}
                      </p>
                      <p className="text-blue-300 text-sm">
                        {examMode === 'sectioned' 
                          ? 'مع إمكانية المراجعة' 
                          : 'بدون توقف'}
                      </p>
                    </div>
                  </motion.div>

                  {/* Timer Summary */}
                  <motion.div variants={itemVariants} className="p-6 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl border border-emerald-700/30 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-600 rounded-lg">
                        <Timer className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-emerald-300">المؤقت</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white font-medium text-xl">
                        {timerMode === 'none' ? 'بدون مؤقت' : getSelectedTimerInfo()?.label}
                      </p>
                      <p className="text-emerald-300 text-sm">
                        {timerMode === 'none' ? 'وقت مفتوح' : 'تدريب واقعي'}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Start Button */}
                <motion.div variants={itemVariants} className="text-center">
                  <motion.button
                    onClick={handleStartExam}
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(16, 185, 129, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative inline-flex items-center gap-3 px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl shadow-2xl shadow-emerald-500/25 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      <Rocket className="h-7 w-7 animate-rocket-shake" />
                      ابدأ الاختبار الآن
                      <ArrowUpRight className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                    <motion.span 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <Sparkle className="h-10 w-10 animate-sparkle" />
                    </motion.span>
                  </motion.button>
                  
                  <p className="text-gray-400 text-sm mt-4">
                    * يمكنك تغيير الإعدادات في أي وقت من لوحة التحكم
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-xl border-t border-gray-700/50 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <motion.button
                onClick={handlePrev}
                disabled={currentStep === 1}
                whileHover={currentStep !== 1 ? "hover" : ""}
                whileTap={currentStep !== 1 ? "tap" : ""}
                variants={buttonVariants}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden group
                  ${currentStep === 1
                    ? 'text-gray-500 cursor-not-allowed bg-gray-800/50'
                    : 'text-white bg-gray-700 hover:bg-gray-600 shadow-md'
                  }`}
              >
                <ChevronRight className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                السابق
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></span>
              </motion.button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {currentStep === 1 && 'اختر نمط التدريب المناسب'}
                  {currentStep === 2 && 'تخصيص إعدادات التجربة'}
                  {currentStep === 3 && 'مراجعة نهائية وبدء التدريب'}
                </p>
              </div>

              {currentStep < 3 ? (
                <motion.button
                  onClick={handleNext}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-md relative overflow-hidden group"
                >
                  التالي
                  <ChevronLeft className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></span>
                </motion.button>
              ) : (
                <div className="w-20"></div> // Placeholder to maintain layout
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
