import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Flame, 
  SkipForward, 
  List, 
  ArrowRight,
  Home,
  Eye,
  BookOpen,
  Target,
  Circle,
  Flag
} from 'lucide-react';
import { useExamStore } from '../store/examStore';

const ReviewScreen = () => {
  const {
    examQuestions,
    userAnswers,
    deferredQuestions,
    reviewFilter,
    examMode,
    currentSection,
    exitReviewMode,
    goToQuestion,
    completeExam,
    getQuestionStats,
    toggleReviewFilter
  } = useExamStore();

  const [activeTab, setActiveTab] = useState('all');
  const stats = getQuestionStats();

  // Filter questions based on active tab
  const getFilteredQuestions = () => {
    switch (activeTab) {
      case 'answered':
        return examQuestions.filter(q => userAnswers[q.question_number] !== undefined);
      case 'unanswered':
        return examQuestions.filter(q => userAnswers[q.question_number] === undefined);
      case 'deferred':
        return examQuestions.filter(q => deferredQuestions[q.question_number]);
      default:
        return examQuestions;
    }
  };

  const getQuestionStatusIcon = (questionNumber) => {
    const isAnswered = userAnswers[questionNumber] !== undefined;
    const isDeferred = deferredQuestions[questionNumber];

    if (isAnswered && isDeferred) return <SkipForward className="h-5 w-5 text-blue-500" />;
    if (isAnswered) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (isDeferred) return <Clock className="h-5 w-5 text-yellow-500" />;
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white" dir="rtl">
      {/* Floating Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-xl border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Button 
            onClick={exitReviewMode}
            variant="ghost"
            className="flex items-center gap-2 text-white hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="hidden sm:inline">عودة للاختبار</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              لوحة المراجعة
            </h1>
            <List className="h-6 w-6 text-orange-400" />
          </div>
          
          <Button 
            onClick={() => window.location.href = '/'}
            variant="ghost"
            className="flex items-center gap-2 text-white hover:text-white hover:bg-white/10"
          >
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">الرئيسية</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Floating Stats Summary */}
        <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-md z-40 border-y border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 gap-1 py-3 text-center">
              <div className="bg-gradient-to-br from-green-900/50 to-gray-800/70 border border-gray-700 rounded-lg p-2">
                <div className="text-green-400 font-bold text-lg">{stats.answered}</div>
                <div className="text-xs text-gray-400">مُجابة</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-900/50 to-gray-800/70 border border-gray-700 rounded-lg p-2">
                <div className="text-yellow-400 font-bold text-lg">{stats.deferred}</div>
                <div className="text-xs text-gray-400">مؤجلة</div>
              </div>
              <div className="bg-gradient-to-br from-red-900/50 to-gray-800/70 border border-gray-700 rounded-lg p-2">
                <div className="text-red-400 font-bold text-lg">{stats.unanswered}</div>
                <div className="text-xs text-gray-400">غير مُجابة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-2xl mx-auto mt-20 mb-8">
          <div className="flex justify-center space-x-1 sm:space-x-2 px-4">
            {[
              { id: 'all', label: 'الكل', icon: Eye },
              { id: 'answered', label: 'المُجابة', icon: CheckCircle },
              { id: 'unanswered', label: 'غير المُجابة', icon: Circle },
              { id: 'deferred', label: 'المؤجلة', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1 px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {getFilteredQuestions().map((question) => {
            const questionNumber = examQuestions.findIndex(q => q.question_number === question.question_number) + 1;
            const isAnswered = userAnswers[question.question_number] !== undefined;
            const isDeferred = deferredQuestions[question.question_number];
            const answerChoice = isAnswered ? question.choices[userAnswers[question.question_number]] : null;

            return (
              <div 
                key={question.question_number}
                onClick={() => goToQuestion(questionNumber - 1)}
                className="group relative bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-xl p-4 hover:border-orange-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {getQuestionStatusIcon(question.question_number)}
                      <span>السؤال {questionNumber}</span>
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        {question.type === 'rc' ? 'استيعاب المقروء' : 
                         question.type === 'analogy' ? 'التناظر اللفظي' :
                         question.type === 'completion' ? 'إكمال الجمل' :
                         question.type === 'error' ? 'الخطأ السياقي' : 'المفردة الشاذة'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {examMode === 'sectioned' && (
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                        القسم {Math.floor((questionNumber - 1) / 13) + 1}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Content */}
                <div className="mt-3">
                  {question.passage && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                      {question.passage.substring(0, 100)}...
                    </p>
                  )}
                  <p className="text-gray-200 line-clamp-2">
                    {question.question.substring(0, 120)}...
                  </p>
                </div>

                {/* Answer Preview */}
                {isAnswered && (
                  <div className="mt-3 bg-gray-700/30 border-l-2 border-green-500 rounded-r-lg p-2">
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">إجابتك:</span>
                      <span className="text-green-300">{answerChoice}</span>
                    </p>
                  </div>
                )}
                
                {/* View Button */}
                <div className="mt-3 flex justify-end">
                  <button className="flex items-center gap-1 text-orange-400 group-hover:text-orange-300 text-sm font-medium">
                    <span>عرض السؤال</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {getFilteredQuestions().length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 border border-gray-700 rounded-xl p-8 mx-auto max-w-md">
                <div className="mx-auto w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <Flag className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">
                  {activeTab === 'answered' && 'لا توجد أسئلة مُجابة'}
                  {activeTab === 'unanswered' && 'لا توجد أسئلة غير مُجابة'} 
                  {activeTab === 'deferred' && 'لا توجد أسئلة مؤجلة'}
                  {activeTab === 'all' && 'لا توجد أسئلة'}
                </h3>
                <p className="text-gray-400 mb-6">يمكنك العودة للاختبار لمراجعة المزيد</p>
                <Button 
                  onClick={exitReviewMode}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                  العودة للاختبار
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-gray-700/50 py-3 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Button 
              onClick={completeExam}
              size="lg"
              className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 flex items-center gap-2"
            >
              <Flag className="h-5 w-5" />
              إنهاء الاختبار
            </Button>
            
            <span className="text-gray-400 text-sm">
              {getFilteredQuestions().length} من {examQuestions.length} سؤال
            </span>
            
            <Button 
              onClick={exitReviewMode}
              variant="secondary"
              size="lg"
              className="bg-gradient-to-r from-gray-700 to-gray-800 flex items-center gap-2"
            >
              <ChevronRight className="h-5 w-5" />
              إنهاء المراجعة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
