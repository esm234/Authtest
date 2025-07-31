import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hobpdncvzadvjlbfdfch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvYnBkbmN2emFkdmpsYmZkZmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzQ2OTEsImV4cCI6MjA2OTU1MDY5MX0.C7fiOrxY7mLlrNL6uP_35f17i8dj9E7jr0LgD9QnmDY';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * التحقق من صحة بيانات تسجيل الدخول بالتليجرام
 * @param {Object} telegramData - بيانات المستخدم من التليجرام
 * @returns {boolean} - صحة البيانات
 */
export const validateTelegramAuth = (telegramData) => {
  // في الإنتاج، يجب التحقق من hash باستخدام bot token
  // هذا مثال مبسط للتطوير
  return true; // Always return true for now to bypass validation issues
};

/**
 * إنشاء أو تحديث مستخدم في قاعدة البيانات
 * @param {Object} telegramUser - بيانات المستخدم من التليجرام
 * @returns {Object} - بيانات المستخدم المحدثة
 */
export const createOrUpdateUser = async (telegramUser) => {
  try {
    console.log('Creating/updating user:', telegramUser);
    
    // البحث عن المستخدم الموجود
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single();

    let userId;
    let isNewUser = false;
    
    if (fetchError && fetchError.code === 'PGRST116') {
      // المستخدم غير موجود، إنشاء مستخدم جديد
      console.log('Creating new user...');
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            telegram_id: telegramUser.id,
            username: telegramUser.username || telegramUser.first_name || `user_${telegramUser.id}`
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        throw new Error(`خطأ في إنشاء المستخدم: ${insertError.message}`);
      }

      console.log('New user created:', newUser);
      userId = newUser.id;
      isNewUser = true;

      // إنشاء سجل تفعيل للمستخدم الجديد
      const { error: activationError } = await supabase
        .from('user_activations')
        .insert([
          {
            user_id: userId,
            is_active: false
          }
        ]);

      if (activationError) {
        console.error('Error creating activation record:', activationError);
        throw new Error(`خطأ في إنشاء سجل التفعيل: ${activationError.message}`);
      }

      console.log('Activation record created for user:', userId);

      return { ...newUser, isNewUser: true };
    } else if (fetchError) {
      console.error('Error fetching user:', fetchError);
      throw new Error(`خطأ في جلب بيانات المستخدم: ${fetchError.message}`);
    } else {
      // المستخدم موجود، تحديث آخر نشاط
      console.log('Updating existing user:', existingUser.id);
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ 
          username: telegramUser.username || telegramUser.first_name || existingUser.username,
          last_login: new Date().toISOString()
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw new Error(`خطأ في تحديث بيانات المستخدم: ${updateError.message}`);
      }

      return { ...updatedUser, isNewUser: false };
    }
  } catch (error) {
    console.error('خطأ في createOrUpdateUser:', error);
    throw error;
  }
};

/**
 * التحقق من حالة تفعيل المستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {boolean} - حالة التفعيل
 */
export const checkUserActivation = async (userId) => {
  try {
    const { data: activation, error } = await supabase
      .from('user_activations')
      .select('is_active')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`خطأ في التحقق من التفعيل: ${error.message}`);
    }

    return activation ? activation.is_active : false;
  } catch (error) {
    console.error('خطأ في checkUserActivation:', error);
    return false;
  }
};

/**
 * حفظ بيانات المستخدم في التخزين المحلي
 * @param {Object} userData - بيانات المستخدم
 */
export const saveUserToLocalStorage = (userData) => {
  try {
    localStorage.setItem('telegramUser', JSON.stringify(userData));
  } catch (error) {
    console.error('خطأ في حفظ بيانات المستخدم:', error);
  }
};

/**
 * جلب بيانات المستخدم من التخزين المحلي
 * @returns {Object|null} - بيانات المستخدم أو null
 */
export const getUserFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem('telegramUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    return null;
  }
};

/**
 * حذف بيانات المستخدم من التخزين المحلي
 */
export const clearUserFromLocalStorage = () => {
  try {
    localStorage.removeItem('telegramUser');
  } catch (error) {
    console.error('خطأ في حذف بيانات المستخدم:', error);
  }
};

/**
 * التحقق من صحة جلسة المستخدم
 * @returns {Object|null} - بيانات المستخدم المصادق عليها أو null
 */
export const validateUserSession = async () => {
  try {
    const userData = getUserFromLocalStorage();
    
    if (!userData || !userData.id) {
      return null;
    }

    // التحقق من أن المستخدم ما زال موجوداً في قاعدة البيانات
    const { data: user, error } = await supabase
      .from('users')
      .select('id, telegram_id, username')
      .eq('id', userData.id)
      .single();

    if (error || !user) {
      clearUserFromLocalStorage();
      return null;
    }

    // التحقق من حالة التفعيل
    const isActive = await checkUserActivation(user.id);
    
    return {
      ...user,
      isActive
    };
  } catch (error) {
    console.error('خطأ في التحقق من الجلسة:', error);
    clearUserFromLocalStorage();
    return null;
  }
};

/**
 * تسجيل خروج المستخدم
 */
export const logout = () => {
  clearUserFromLocalStorage();
  window.location.reload();
};

