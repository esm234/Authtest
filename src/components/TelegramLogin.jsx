import React, { useState, useEffect } from 'react';
import { 
  validateTelegramAuth, 
  createOrUpdateUser, 
  checkUserActivation,
  saveUserToLocalStorage,
  getUserFromLocalStorage,
  logout
} from '../utils/auth';

const TelegramLogin = ({ onLoginSuccess }) => {
  const [user, setUser] = useState(null);
  const [isActivated, setIsActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingActivation, setCheckingActivation] = useState(false);

  useEffect(() => {
    // تحقق من وجود بيانات المستخدم في localStorage
    const savedUser = getUserFromLocalStorage();
    if (savedUser) {
      console.log('Found saved user:', savedUser);
      setUser(savedUser);
      checkUserActivationStatus(savedUser.id);
    }

    // إضافة سكريبت Telegram Login Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'Ourgoalauthbot'); // اسم البوت
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', window.location.origin + '/telegram-auth');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    // إضافة دالة callback عامة
    window.onTelegramAuth = handleTelegramAuth;

    const container = document.getElementById('telegram-login-container');
    if (container && !user) {
      container.appendChild(script);
    }

    return () => {
      window.onTelegramAuth = null;
    };
  }, [user]);

  const handleTelegramAuth = async (telegramUser) => {
    console.log('Telegram auth received:', telegramUser);
    setLoading(true);
    try {
      // إنشاء أو تحديث المستخدم في قاعدة البيانات
      const userData = await createOrUpdateUser(telegramUser);
      console.log('User data from database:', userData);

      // حفظ بيانات المستخدم محلياً
      const userToSave = { 
        ...telegramUser, 
        id: userData.id,
        database_id: userData.id 
      };
      saveUserToLocalStorage(userToSave);
      setUser(userToSave);

      // التحقق من حالة التفعيل
      await checkUserActivationStatus(userData.id);

    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
      alert("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const checkUserActivationStatus = async (userId) => {
    console.log('Checking activation status for user:', userId);
    setCheckingActivation(true);
    try {
      const isActive = await checkUserActivation(userId);
      console.log('User activation status:', isActive);
      setIsActivated(isActive);
      
      if (isActive && onLoginSuccess) {
        console.log('User is activated, calling onLoginSuccess');
        onLoginSuccess();
      }
    } catch (error) {
      console.error('خطأ في التحقق من التفعيل:', error);
    } finally {
      setCheckingActivation(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsActivated(false);
  };

  const handleRefreshActivation = async () => {
    if (user && user.id) {
      await checkUserActivationStatus(user.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  if (user && !isActivated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">الحساب غير مفعل</h2>
            <p className="text-gray-600 mb-6">
              مرحباً {user.first_name}! تم تسجيل دخولك بنجاح، لكن حسابك غير مفعل حالياً.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              معرف المستخدم: {user.id}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm mb-3">
              للحصول على تفعيل حسابك، يرجى التواصل مع فريق الدعم:
            </p>
            <a 
              href="https://t.me/Ourgoalauthbot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              تواصل مع الدعم
            </a>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRefreshActivation}
              disabled={checkingActivation}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {checkingActivation ? 'جاري التحقق...' : 'تحديث حالة التفعيل'}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user && isActivated) {
    return null; // سيتم استدعاء onLoginSuccess
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مرحباً بك</h1>
          <p className="text-gray-600">يرجى تسجيل الدخول للوصول إلى الاختبارات</p>
        </div>
        
        <div className="mb-6">
          <div id="telegram-login-container" className="flex justify-center"></div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>بتسجيل الدخول، أنت توافق على شروط الاستخدام</p>
        </div>
      </div>
    </div>
  );
};

export default TelegramLogin;

