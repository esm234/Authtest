import React, { useState } from 'react';
import { useExamStore } from './store/examStore';
import StartScreen from './components/StartScreen';
import QuestionDisplay from './components/QuestionDisplay';
import SectionReview from './components/SectionReview';
import ReviewScreen from './components/ReviewScreen';
import ResultsScreen from './components/ResultsScreen';
import FolderManagement from './components/FolderManagement';
import TelegramLogin from './components/TelegramLogin';
import './App.css';
import { Analytics } from "@vercel/analytics/react"

function App() {
  const { 
    examStarted, 
    examCompleted, 
    reviewMode, 
    sectionReviewMode,
    examResults 
  } = useExamStore();
  
  const [showFolderManagement, setShowFolderManagement] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // التحقق من المصادقة عند تحميل التطبيق
  React.useEffect(() => {
    const savedUser = localStorage.getItem('telegramUser');
    if (savedUser) {
      // يمكن إضافة تحقق إضافي من حالة التفعيل هنا
      setIsAuthenticated(true);
    }
  }, []);

  // إذا لم يكن المستخدم مصادق، عرض صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <>
        <TelegramLogin onLoginSuccess={() => setIsAuthenticated(true)} />
        <Analytics />
      </>
    );
  }

  // If folder management is active, show it
  if (showFolderManagement && !examStarted) {
    return (
      <>
        <FolderManagement onBack={() => setShowFolderManagement(false)} />
        <Analytics />
      </>
    );
  }

  return (
    <><div className="App">
      {/* Show results screen if exam is completed */}
      {examCompleted && examResults && <ResultsScreen />}

      {/* Show section review if in section review mode */}
      {examStarted && sectionReviewMode && !examCompleted && <SectionReview />}

      {/* Show review screen if in review mode */}
      {examStarted && reviewMode && !sectionReviewMode && !examCompleted && <ReviewScreen />}

      {/* Show question display if exam is started */}
      {examStarted && !reviewMode && !sectionReviewMode && !examCompleted && <QuestionDisplay />}

      {/* Show start screen by default */}
      {!examStarted && !examCompleted && (
        <StartScreen onShowFolderManagement={() => setShowFolderManagement(true)} />
      )}
    </div><Analytics /></>
  );
}

export default App;

