import React, { useState, useEffect } from 'react';
import { useExamStore } from '../store/examStore';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Home, 
  Trophy, 
  Award, 
  Star, 
  Target, 
  TrendingUp,
  Zap,
  Flame,
  Sparkles,
  Eye,
  Brain,
  Rocket,
  Crown,
  Medal,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckSquare,
  XSquare,
  MinusSquare,
  Gem,
  Heart,
  MessageCircle
} from 'lucide-react';

const ResultsScreen = () => {
  const examStore = useExamStore();
  const {
    examResults,
    resetExam,
    examQuestions,
    userAnswers,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions
  } = examStore;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsAnimating(false), 1000);
    
    // Show celebration for high scores
    const percentage = examResults?.totalQuestions > 0 
      ? ((examResults.correctAnswers / examResults.totalQuestions) * 100)
      : 0;
    if (percentage >= 80) {
      setTimeout(() => setShowCelebration(true), 1500);
    }
  }, []);

  if (!examResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gray-900 rounded-full p-6 border border-gray-800">
                <Brain className="h-12 w-12 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">جاري تحليل النتائج</h2>
          <p className="text-gray-400">لحظات قليلة...</p>
        </div>
      </div>
    );
  }

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setDisplayedQuestions([]);
    } else {
      setSelectedCategory(category);
      let questionsToShow = [];
      
      if (examQuestions && examQuestions.length > 0) {
        let questionNumbers = [];
        
        switch (category) {
          case 'correct':
            questionNumbers = correctAnswers || [];
            break;
          case 'incorrect':
            questionNumbers = incorrectAnswers || [];
            break;
          case 'unanswered':
            questionNumbers = unansweredQuestions || [];
            break;
          default:
            questionNumbers = [];
        }
        
        if (questionNumbers.length === 0) {
          examQuestions.forEach(q => {
            const userAnswer = userAnswers[q.question_number];
            const isAnswered = userAnswer !== undefined && userAnswer !== null;
            const isCorrect = isAnswered && userAnswer === q.answer;
            
            switch (category) {
              case 'correct':
                if (isCorrect) questionNumbers.push(q.question_number);
                break;
              case 'incorrect':
                if (isAnswered && !isCorrect) questionNumbers.push(q.question_number);
                break;
              case 'unanswered':
                if (!isAnswered) questionNumbers.push(q.question_number);
                break;
            }
          });
        }
        
        questionsToShow = examQuestions.filter(q => 
          questionNumbers.includes(q.question_number)
        ).map(q => ({
          ...q,
          userAnswer: userAnswers[q.question_number],
          correctAnswer: q.answer
        }));
      }
      
      setDisplayedQuestions(questionsToShow);
    }
  };

  const percentage = examResults.totalQuestions > 0 
    ? parseFloat(((examResults.correctAnswers / examResults.totalQuestions) * 100).toFixed(1))
    : 0;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { 
      title: "أداء استثنائي! 🌟", 
      message: "أنت في القمة! استمر في هذا المستوى الرائع",
      icon: Crown,
      color: "from-yellow-400 to-amber-500"
    };
    if (percentage >= 80) return { 
      title: "ممتاز جداً! 🎯", 
      message: "أداء متميز يستحق الإشادة",
      icon: Trophy,
      color: "from-purple-400 to-pink-500"
    };
    if (percentage >= 70) return { 
      title: "جيد جداً! 💪", 
      message: "في الطريق الصحيح، واصل التقدم",
      icon: Star,
      color: "from-blue-400 to-cyan-500"
    };
    if (percentage >= 60) return { 
      title: "جيد! 👍", 
      message: "أداء جيد مع مساحة للتحسين",
      icon: Target,
      color: "from-green-400 to-emerald-500"
    };
    return { 
      title: "لا تيأس! 💡", 
      message: "كل محاولة خطوة نحو النجاح",
      icon: Lightbulb,
      color: "from-orange-400 to-red-500"
    };
  };

  const performance = getPerformanceMessage();
  const PerformanceIcon = performance.icon;

  const getQuestionTypeIcon = (type) => {
    const icons = {
      analogy: Brain,
      completion: Sparkles,
      error: AlertCircle,
      rc: BookOpen,
      odd: Eye
    };
    return icons[type] || Star;
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      analogy: 'التناظر اللفظي',
      completion: 'إكمال الجمل',
      error: 'الخطأ السياقي',
      rc: 'استيعاب المقروء',
      odd: 'المفردة الشاذة'
    };
    return labels[type] || type;
  };

  // Analyze performance by question type
  const analyzePerformanceByType = () => {
    const typeStats = {};
    
    examQuestions?.forEach(q => {
      if (!typeStats[q.type]) {
        typeStats[q.type] = { correct: 0, total: 0 };
      }
      typeStats[q.type].total++;
      
      const userAnswer = userAnswers[q.question_number];
      const isCorrect = userAnswer !== undefined && userAnswer !== null && userAnswer === q.answer;
      
      if (isCorrect) {
        typeStats[q.type].correct++;
      }
    });

    return Object.entries(typeStats).map(([type, stats]) => ({
      type,
      label: getQuestionTypeLabel(type),
      icon: getQuestionTypeIcon(type),
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));
  };

  const typePerformance = analyzePerformanceByType();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white" dir="rtl">
      {/* Celebration Animation */}
      {showCelebration && percentage >= 80 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              نتائج الاختبار
            </h1>
            <Button
              onClick={() => window.location.href = '/'}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Home className="h-5 w-5 ml-2" />
              الرئيسية
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Score Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Score Circle */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 754} 754`}
                className="transition-all duration-2000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-white mb-2">
                {percentage}%
              </div>
              <div className="text-gray-400">
                {examResults.correctAnswers} من {examResults.totalQuestions}
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${performance.color} mb-4`}>
            <PerformanceIcon className="h-6 w-6 text-white" />
            <span className="text-lg font-bold text-white">{performance.title}</span>
          </div>
          <p className="text-gray-300 text-lg">{performance.message}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            onClick={() => handleCategoryClick('correct')}
            className={`group relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 ${
              selectedCategory === 'correct' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckSquare className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-3xl font-bold text-green-400">{examResults.correctAnswers}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">إجابات صحيحة</h3>
            <p className="text-sm text-gray-400">انقر لعرض التفاصيل</p>
          </div>

          <div 
            onClick={() => handleCategoryClick('incorrect')}
            className={`group relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 ${
              selectedCategory === 'incorrect' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <XSquare className="h-6 w-6 text-red-400" />
              </div>
              <span className="text-3xl font-bold text-red-400">{examResults.incorrectAnswers}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">إجابات خاطئة</h3>
            <p className="text-sm text-gray-400">انقر للمراجعة</p>
          </div>

          <div 
            onClick={() => handleCategoryClick('unanswered')}
            className={`group relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 ${
              selectedCategory === 'unanswered' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <MinusSquare className="h-6 w-6 text-amber-400" />
              </div>
              <span className="text-3xl font-bold text-amber-400">
                {examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">لم يتم حلها</h3>
            <p className="text-sm text-gray-400">انقر لعرض الأسئلة</p>
          </div>
        </div>

        {/* Performance by Type */}
        {typePerformance.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">أداءك حسب نوع السؤال</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typePerformance.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <div key={type.type} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <TypeIcon className="h-5 w-5 text-gray-300" />
                      </div>
                      <h3 className="font-semibold text-white">{type.label}</h3>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {type.correct} من {type.total} صحيح
                      </span>
                      <span className={`text-sm font-bold ${
                        type.percentage >= 80 ? 'text-green-400' : 
                        type.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {type.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          type.percentage >= 80 ? 'bg-green-400' : 
                          type.percentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Questions Display */}
        {selectedCategory && displayedQuestions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {selectedCategory === 'correct' ? 'الأسئلة الصحيحة' :
               selectedCategory === 'incorrect' ? 'الأسئلة الخاطئة' :
               'الأسئلة غير المحلولة'}
            </h2>
            
            <div className="space-y-4">
              {displayedQuestions.map((question, index) => {
                const isExpanded = expandedQuestion === index;
                const TypeIcon = getQuestionTypeIcon(question.type);
                
                return (
                  <div 
                    key={question.question_number}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
                  >
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
                      onClick={() => setExpandedQuestion(isExpanded ? null : index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-700 rounded-lg">
                            <TypeIcon className="h-5 w-5 text-gray-300" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">
                              السؤال {question.question_number}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {getQuestionTypeLabel(question.type)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {selectedCategory === 'correct' && (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          )}
                          {selectedCategory === 'incorrect' && (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                          {selectedCategory === 'unanswered' && (
                            <MinusSquare className="h-5 w-5 text-amber-400" />
                          )}
                          
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-700">
                        {/* Passage for RC questions */}
                        {question.passage && (
                          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">النص:</h5>
                            <p className="text-gray-200 text-sm leading-relaxed">{question.passage}</p>
                          </div>
                        )}

                        {/* Question */}
                        <div className="mt-4">
                          <h5 className="text-sm font-semibold text-gray-300 mb-2">السؤال:</h5>
                          <p className="text-white">{question.question}</p>
                        </div>

                        {/* Choices */}
                        {question.choices && (
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">الخيارات:</h5>
                            <div className="space-y-2">
                              {question.choices.map((choice, choiceIndex) => {
                                const isUserAnswer = question.userAnswer === choiceIndex;
                                const isCorrectAnswer = question.correctAnswer === choiceIndex;
                                
                                return (
                                  <div
                                    key={choiceIndex}
                                    className={`p-3 rounded-lg border ${
                                      isCorrectAnswer
                                        ? 'border-green-500 bg-green-500/10 text-green-300'
                                        : isUserAnswer
                                        ? 'border-red-500 bg-red-500/10 text-red-300'
                                        : 'border-gray-600 bg-gray-700/30 text-gray-300'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{choice}</span>
                                      {isCorrectAnswer && (
                                        <span className="text-xs font-semibold text-green-400">الإجابة الصحيحة</span>
                                      )}
                                      {isUserAnswer && !isCorrectAnswer && (
                                        <span className="text-xs font-semibold text-red-400">إجابتك</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedCategory && displayedQuestions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              لا توجد أسئلة في هذه الفئة
            </h3>
            <p className="text-gray-500">
              {selectedCategory === 'correct' ? 'لا توجد إجابات صحيحة' :
               selectedCategory === 'incorrect' ? 'لا توجد إجابات خاطئة' :
               'تم الإجابة على جميع الأسئلة'}
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">نصائح للتحسين</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl h-fit">
                <Lightbulb className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">راجع الأسئلة الخاطئة</h3>
                <p className="text-gray-300 text-sm">
                  خصص وقتاً لفهم سبب الخطأ في كل سؤال وتعلم من أخطائك
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl h-fit">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">ركز على نقاط الضعف</h3>
                <p className="text-gray-300 text-sm">
                  حدد أنواع الأسئلة التي تحتاج لتحسين وتدرب عليها أكثر
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl h-fit">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">إدارة الوقت</h3>
                <p className="text-gray-300 text-sm">
                  تدرب على حل الأسئلة بسرعة مع الحفاظ على الدقة
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl h-fit">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">فهم الأنماط</h3>
                <p className="text-gray-300 text-sm">
                  تعرف على أنماط الأسئلة المتكررة واستراتيجيات الحل
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.href = '/'}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Home className="h-5 w-5 ml-2" />
            العودة للرئيسية
          </Button>
          
          <Button
            onClick={resetExam}
            size="lg"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold px-8 py-3 rounded-xl"
          >
            <Rocket className="h-5 w-5 ml-2" />
            اختبار جديد
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
