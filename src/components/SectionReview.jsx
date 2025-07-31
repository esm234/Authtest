import React, { useState } from "react";
import { useExamStore } from "../store/examStore";
import { Button } from "./ui/button";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  AlertTriangle,
  Zap,
  Target,
  Eye,
  Flame,
  Star,
  Sparkles,
  ChevronRight,
  Play,
  BarChart4,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';

const SectionReview = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [animatingCard, setAnimatingCard] = useState(null);
  
  const {
    currentSection,
    examQuestions,
    userAnswers,
    deferredQuestions,
    exitSectionReview,
    goToQuestion,
    timerActive,
    timeRemaining,
    examMode,
    completeExam,
    moveToNextSectionFromReview
  } = useExamStore();

  // Fix: In single mode, show all questions instead of filtering by section
  const isSingleMode = examMode === 'single';
  const totalSections = isSingleMode ? 1 : Math.max(...examQuestions.map(q => q.section));
  const isLastSection = isSingleMode || currentSection === totalSections;
  
  // Fix: Show all questions in single mode, or filter by section in sectioned mode
  const sectionQuestions = isSingleMode 
    ? examQuestions // Show all questions in single mode
    : examQuestions.filter(q => q.section === currentSection);
  
  const sectionStats = {
    total: sectionQuestions.length,
    answered: 0,
    unanswered: 0,
    deferred: 0
  };

  sectionQuestions.forEach(question => {
    const isAnswered = userAnswers[question.question_number] !== undefined;
    const isDeferred = deferredQuestions[question.question_number];

    if (isDeferred) { // Priority to deferred
      sectionStats.deferred++;
    } else if (isAnswered) { // Then answered
      sectionStats.answered++;
    } else { // Finally unanswered
      sectionStats.unanswered++;
    }
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeIcon = (type) => {
    const icons = {
      analogy: Layers,
      completion: Sparkles,
      error: Target,
      rc: Eye,
      odd: Star
    };
    return icons[type] || Circle;
  };

  const getQuestionTypeStyle = (type) => {
    const styles = {
      analogy: 'from-violet-500 to-purple-600',
      completion: 'from-emerald-500 to-teal-600',
      error: 'from-rose-500 to-pink-600',
      rc: 'from-amber-500 to-orange-600',
      odd: 'from-cyan-500 to-blue-600'
    };
    return styles[type] || 'from-gray-500 to-gray-600';
  };

  const handleQuestionClick = (questionNumber) => {
    setAnimatingCard(questionNumber);
    setTimeout(() => {
      const globalIndex = examQuestions.findIndex(q => q.question_number === questionNumber);
      if (globalIndex !== -1) {
        goToQuestion(globalIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  };

  const handleNextSection = () => {
    setShowConfirmModal(true);
  };

  const confirmNextSection = () => {
    setShowConfirmModal(false);
    if (isLastSection || isSingleMode) {
      completeExam();
    } else {
      moveToNextSectionFromReview();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelNextSection = () => {
    setShowConfirmModal(false);
  };

  const getCompletionPercentage = () => {
    return Math.round((sectionStats.answered / sectionStats.total) * 100);
  };

  // Fix: Dynamic title based on mode
  const getReviewTitle = () => {
    if (isSingleMode) {
      return "مراجعة الاختبار";
    }
    return `مراجعة القسم ${currentSection}`;
  };

  const getReviewSubtitle = () => {
    if (isSingleMode) {
      return `${sectionStats.answered} من ${sectionStats.total} مُجابة`;
    }
    return `${sectionStats.answered} من ${sectionStats.total} مُجابة`;
  };

  const getSectionDisplayText = () => {
    if (isSingleMode) {
      return "الاختبار الكامل";
    }
    return `القسم ${currentSection} من ${totalSections}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white overflow-hidden relative" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Dynamic Progress */}
        <div className="sticky top-0 bg-black/40 backdrop-blur-xl border-b border-gray-700/50 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {getReviewTitle()}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {getReviewSubtitle()}
                  </p>
                </div>
              </div>
              
              {/* Timer Display */}
              {timerActive && (
                <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 rounded-full px-4 py-2">
                  <Clock className="h-5 w-5 text-red-400 animate-pulse" />
                  <span className="text-red-300 font-bold font-mono">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}

              <Button 
                onClick={() => window.location.href = '/'}
                variant="ghost"
                className="text-white hover:bg-white/10 bg-white/5 border border-white/20 rounded-xl"
              >
                <Home className="h-5 w-5 ml-2" />
                <span className="hidden sm:inline">الرئيسية</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-6 py-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Progress Circle */}
            <div className="relative mx-auto mb-12 w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#progressGradientSection)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(getCompletionPercentage() / 100) * 283} 283`}
                  className="transition-all duration-1000 ease-out drop-shadow-lg"
                />
                <defs>
                  <linearGradient id="progressGradientSection" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#06D6A0" />
                    <stop offset="100%" stopColor="#00F5FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {getCompletionPercentage()}%
                </div>
                <div className="text-gray-400 text-sm mt-1">مكتمل</div>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {getSectionDisplayText()}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              {isSingleMode 
                ? "راجع أداءك في جميع الأسئلة قبل إنهاء الاختبار"
                : "راجع أداءك وتأكد من إجاباتك قبل المتابعة"
              }
            </p>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Answered Questions */}
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/30 text-green-400 mx-auto mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-green-400 mb-2">{sectionStats.answered}</h3>
              <p className="text-green-300">أسئلة مُجابة</p>
              <div className="mt-4 bg-green-500/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(sectionStats.answered / sectionStats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Deferred Questions */}
            <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-amber-500/30 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/30 text-amber-400 mx-auto mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-amber-400 mb-2">{sectionStats.deferred}</h3>
              <p className="text-amber-300">أسئلة مؤجلة</p>
              <div className="mt-4 bg-amber-500/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(sectionStats.deferred / sectionStats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Unanswered Questions */}
            <div className="bg-gradient-to-br from-red-900/50 to-rose-900/50 border border-red-500/30 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/30 text-red-400 mx-auto mb-6">
                <Circle className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-red-400 mb-2">{sectionStats.unanswered}</h3>
              <p className="text-red-300">أسئلة غير مُجابة</p>
              <div className="mt-4 bg-red-500/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-400 to-rose-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(sectionStats.unanswered / sectionStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-200 mb-4">
              {isSingleMode ? "جميع الأسئلة" : "أسئلة القسم"}
            </h3>
            <p className="text-gray-400">انقر على أي سؤال للانتقال إليه مباشرة</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sectionQuestions.sort((a, b) => a.question_number - b.question_number).map((question) => {
              const isAnswered = userAnswers[question.question_number] !== undefined;
              const isDeferred = deferredQuestions[question.question_number];
              const TypeIcon = getQuestionTypeIcon(question.type);
              const typeStyle = getQuestionTypeStyle(question.type);
              
              return (
                <div
                  key={question.question_number}
                  onClick={() => handleQuestionClick(question.question_number)}
                  className={`group relative bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-gray-500 hover:shadow-xl hover:scale-105 ${
                    animatingCard === question.question_number ? 'animate-pulse scale-95' : ''
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="absolute -top-2 -right-2">
                    {isDeferred ? ( // Check deferred first
                      <div className="bg-amber-500 rounded-full p-2 shadow-lg shadow-amber-500/50">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                    ) : isAnswered ? ( // Then answered
                      <div className="bg-green-500 rounded-full p-2 shadow-lg shadow-green-500/50">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    ) : ( // Finally unanswered
                      <div className="bg-red-500 rounded-full p-2 shadow-lg shadow-red-500/50">
                        <Circle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Question Type Icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${typeStyle} mb-4 mx-auto`}>
                    <TypeIcon className="h-6 w-6 text-white" />
                  </div>

                  {/* Question Number */}
                  <h4 className="text-2xl font-bold text-center mb-2 text-white">
                    {question.question_number}
                  </h4>

                  {/* Question Preview */}
                  <p className="text-gray-300 text-sm text-center line-clamp-2 mb-4">
                    {question.question.substring(0, 80)}...
                  </p>

                  {/* Status Badge */}
                  <div className="text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      isDeferred // Check deferred first
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isAnswered 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {isDeferred ? 'مؤجلة' : isAnswered ? 'مُجابة' : 'غير مُجابة'}
                    </span>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              onClick={() => { 
                exitSectionReview(); 
                // Fix: In single mode, go to first question, in sectioned mode go to first question of current section
                const targetQuestion = isSingleMode 
                  ? examQuestions[0] // First question overall
                  : examQuestions.find(q => q.section === currentSection); // First question of current section
                
                if (targetQuestion) {
                  const questionIndex = examQuestions.findIndex(q => q.question_number === targetQuestion.question_number);
                  if (questionIndex !== -1) {
                    goToQuestion(questionIndex);
                  }
                }
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              size="lg"
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowRight className="h-5 w-5 ml-2" />
              {isSingleMode ? "العودة للاختبار" : `العودة للقسم ${currentSection}`}
            </Button>
            
            <Button
              onClick={handleNextSection}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isLastSection || isSingleMode ? (
                <>
                  <Award className="h-5 w-5 ml-2" />
                  إنهاء الاختبار
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 ml-2" />
                  الانتقال للقسم {currentSection + 1}
                </>
              )}
              <ArrowLeft className="h-5 w-5 mr-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                تأكيد الانتقال
              </h3>
              <p className="text-red-100 text-sm">
                هذا الإجراء لا يمكن التراجع عنه
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-300 text-base leading-relaxed">
                  هل أنت متأكد من رغبتك في {isLastSection || isSingleMode ? 'إنهاء الاختبار' : `الانتقال للقسم ${currentSection + 1}`}؟ 
                  {!isSingleMode && !isLastSection && " لن تكون هناك إمكانية للعودة إلى هذا القسم."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={cancelNextSection}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 transition-all duration-300 py-3 rounded-xl font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={confirmNextSection}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white transition-all duration-300 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl"
                >
                  نعم، متابعة
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionReview;
