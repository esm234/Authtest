import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Folder, 
  Trash2, 
  Edit2, 
  Play, 
  BookOpen,
  Target,
  Brain,
  Lightbulb,
  Sparkles,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { useExamStore } from '../store/examStore';
import { getAllQuestions } from '../utils/dataLoader';

const FolderView = ({ folderId, onBack, onStartTest }) => {
  const { folders, removeQuestionFromFolder } = useFolderStore();
  const [allQuestions, setAllQuestions] = useState([]);
  
  const folder = folders.find(f => f.id === folderId);

  useEffect(() => {
    // Use the getAllQuestions function from dataLoader
    const questions = getAllQuestions();
    setAllQuestions(questions);
    console.log('Loaded questions in FolderView:', questions.length);
  }, []);

  if (!folder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex items-center justify-center" dir="rtl">
        <div className="text-center p-8 bg-gray-800/60 border border-gray-700 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-red-400 mb-6">المجلد غير موجود</h2>
          <p className="text-gray-300 text-lg mb-8">يبدو أن هذا المجلد قد تم حذفه أو لا وجود له.</p>
          <Button 
            onClick={onBack} 
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة إلى المجلدات
          </Button>
        </div>
      </div>
    );
  }

  const folderQuestions = allQuestions.filter(q => {
    const isIncluded = folder.questionIds.includes(q.id);
    if (isIncluded) {
      console.log('Found question in folder:', q.id, q.question.substring(0, 50));
    }
    return isIncluded;
  });

  console.log('Folder questions found:', folderQuestions.length);
  console.log('Folder question IDs:', folder.questionIds);

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'analogy': return Brain;
      case 'completion': return BookOpen;
      case 'error': return Target;
      case 'rc': return Lightbulb;
      case 'odd': return Sparkles;
      default: return FileText;
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'analogy': return 'التناظر اللفظي';
      case 'completion': return 'إكمال الجمل';
      case 'error': return 'الخطأ السياقي';
      case 'rc': return 'استيعاب المقروء';
      case 'odd': return 'المفردة الشاذة';
      default: return type;
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'analogy': return 'bg-purple-600/80 text-purple-100';
      case 'completion': return 'bg-emerald-600/80 text-emerald-100';
      case 'error': return 'bg-rose-600/80 text-rose-100';
      case 'rc': return 'bg-amber-600/80 text-amber-100';
      case 'odd': return 'bg-cyan-600/80 text-cyan-100';
      default: return 'bg-gray-600/80 text-gray-100';
    }
  };

  const handleRemoveQuestion = (questionId) => {
    if (window.confirm('هل أنت متأكد من إزالة هذا السؤال من المجلد؟')) {
      removeQuestionFromFolder(folderId, questionId);
    }
  };

  const handleStartTest = () => {
    if (folderQuestions.length === 0) {
      alert('لا توجد أسئلة في هذا المجلد لبدء الاختبار');
      return;
    }
    onStartTest(folderQuestions);
  };

  // Helper function to get correct answer text
  const getCorrectAnswerText = (question) => {
    if (!question.choices || question.choices.length === 0) {
      return question.answer;
    }
    
    if (typeof question.answer === 'number' && question.answer < question.choices.length) {
      return question.choices[question.answer];
    }
    
    if (typeof question.answer === 'string') {
      return question.answer;
    }
    
    return question.choices[0]; // fallback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2020%200%20L%200%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%220.5%22%20opacity%3D%220.03%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
            <div className="flex items-center gap-3">
              <Folder className="w-9 h-9 text-blue-400" />
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {folder.name}
                </h1>
                <p className="text-gray-400 text-lg">{folderQuestions.length} سؤال</p>
              </div>
            </div>
          </div>

          {folderQuestions.length > 0 && (
            <Button
              onClick={handleStartTest}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
            >
              <Play className="w-5 h-5" />
              بدء الاختبار
            </Button>
          )}
        </div>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-xs border border-gray-700">
            <p className="text-gray-400">Total questions loaded: <span className="text-blue-300">{allQuestions.length}</span></p>
            <p className="text-gray-400">Folder question IDs count: <span className="text-blue-300">{folder.questionIds.length}</span></p>
            <p className="text-gray-400">Matched questions: <span className="text-blue-300">{folderQuestions.length}</span></p>
          </div>
        )}

        {/* Questions List */}
        {folderQuestions.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/40 border border-gray-700 rounded-2xl shadow-xl">
            <FileText className="w-20 h-20 mx-auto mb-6 text-gray-500" />
            <h3 className="text-3xl font-bold text-gray-300 mb-4">لا توجد أسئلة في هذا المجلد</h3>
            <p className="text-gray-400 text-lg">يمكنك إضافة أسئلة من شاشة التدريب الرئيسية.</p>
            {folder.questionIds.length > 0 && (
              <p className="text-red-400 text-sm mt-4">
                تحذير: يحتوي المجلد على {folder.questionIds.length} معرف سؤال لكن لم يتم العثور على الأسئلة المطابقة في قاعدة البيانات.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {folderQuestions.map((question, index) => {
              const TypeIcon = getQuestionTypeIcon(question.type);
              const correctAnswerText = getCorrectAnswerText(question);
              
              return (
                <Card key={question.id} className="bg-gray-800/60 border border-gray-700 rounded-xl shadow-lg">
                  <CardHeader className="pb-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getQuestionTypeColor(question.type)}`}>
                          <TypeIcon className="w-4 h-4" />
                          {getQuestionTypeLabel(question.type)}
                        </Badge>
                        <span className="text-lg text-gray-400 font-medium">
                          السؤال #{index + 1}
                        </span>
                        {process.env.NODE_ENV === 'development' && (
                          <span className="text-xs text-gray-500">
                            ID: {question.id}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full p-2 transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Question Text */}
                    <div className="mb-5">
                      <p className="text-white text-lg leading-relaxed font-medium">
                        {question.question}
                      </p>
                    </div>

                    {/* Passage (for RC questions) */}
                    {question.passage && (
                      <div className="mb-5 p-5 bg-gray-700/50 rounded-lg border border-gray-600 shadow-inner">
                        <h4 className="text-base font-semibold text-gray-300 mb-3 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-300" />
                          النص:
                        </h4>
                        <p className="text-gray-200 text-base leading-relaxed">
                          {question.passage}
                        </p>
                      </div>
                    )}

                    {/* Choices */}
                    {question.choices && question.choices.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-300 mb-3">الخيارات:</h4>
                        {question.choices.map((choice, choiceIndex) => {
                          const isCorrect = (
                            (typeof question.answer === 'number' && choiceIndex === question.answer) ||
                            (typeof question.answer === 'string' && choice === question.answer)
                          );
                          
                          return (
                            <div
                              key={choiceIndex}
                              className={`p-4 rounded-lg border ${
                                isCorrect
                                  ? 'bg-green-900/30 border-green-600 text-green-200 shadow-md'
                                  : 'bg-gray-700/30 border-gray-600 text-gray-300'
                              } flex items-center gap-3`}
                            >
                              <span className="font-bold text-lg">
                                {String.fromCharCode(65 + choiceIndex)}.
                              </span>
                              <span className="flex-1">{choice}</span>
                              {isCorrect && (
                                <Badge className="bg-green-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  الإجابة الصحيحة
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Show correct answer if no choices available */}
                    {(!question.choices || question.choices.length === 0) && question.answer && (
                      <div className="mt-5 p-4 bg-green-900/30 border border-green-600 rounded-lg shadow-md flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span className="text-green-200 font-medium">الإجابة الصحيحة: </span>
                        <span className="text-green-100 font-semibold">{question.answer}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderView;
