import React, { useState } from 'react';
import Icon from './Icon';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    age: '',
    gender: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phoneNumber, age, gender } = formData;
    if (!name.trim() || !phoneNumber.trim() || !age.trim() || !gender) {
      setError('يرجى ملء جميع الحقول.');
      return;
    }
    if (phoneNumber.trim().length < 9) {
      setError('يرجى إدخال رقم هاتف صحيح.');
      return;
    }
    setError('');
    setStep(2);
    // In a real app, an SMS would be sent here.
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 4) {
      setError('رمز التأكيد غير صحيح.');
      return;
    }
    setError('');
    setStep(3);
    // Simulate network delay for verification
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleRegistrationSubmit} className="w-full max-w-sm mt-8 text-start">
            <h2 className="text-xl font-semibold text-white text-center mb-6">إنشاء حساب جديد</h2>
            <div className="mb-4">
              <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="name">
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                placeholder="مثال: خالد العامري"
              />
            </div>
            <div className="mb-4">
               <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="phoneNumber">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 tracking-wider"
                placeholder="123-4567 (555) 1+"
                dir="ltr"
              />
            </div>
            <div className="flex space-x-4 mb-4 rtl:space-x-reverse">
              <div className="w-1/2">
                <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="age">
                  العمر
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  placeholder="25"
                />
              </div>
              <div className="w-1/2">
                 <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="gender">
                  الجنس
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                >
                  <option value="">اختر...</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
            </div>
            {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg mt-4 transition duration-300"
            >
              إنشاء حساب
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerificationSubmit} className="w-full max-w-sm mt-10">
            <h2 className="text-xl font-semibold text-white">تأكيد رقم الهاتف</h2>
            <p className="text-slate-300 mt-2">
              أدخل رمز التأكيد المكون من 4 أرقام الذي تم إرساله إلى:
            </p>
            <p className="text-white font-semibold my-2 tracking-wider" dir="ltr">{formData.phoneNumber}</p>
            <div className="mt-6">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={4}
                className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-3 text-white text-center text-3xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 tracking-[1em]"
                placeholder="----"
                dir="ltr"
              />
            </div>
             {error && <p className="text-red-400 text-center text-sm mt-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-300"
            >
              تأكيد
            </button>
             <div className="text-center mt-4">
                <button type="button" className="text-sm text-slate-400 hover:text-white">
                    لم تستلم الرمز؟ إعادة الإرسال
                </button>
             </div>
          </form>
        );
      case 3:
        return (
          <div className="w-full max-w-sm mt-10 flex flex-col items-center">
              <p className="text-slate-300">جاري تأكيد حسابك...</p>
              <div className="mt-6 flex items-center space-x-2 text-teal-400">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                   <span className="text-lg">لحظات من فضلك...</span>
              </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full login-bg p-8 text-center">
      <div className="text-teal-400">
        <Icon as="Lock" className="w-16 h-16 mx-auto"/>
      </div>
      <h1 className="text-3xl font-bold text-white mt-4">HAGO</h1>
      <p className="text-slate-400 mt-2">مراسلة آمنة وخاصة</p>

      {renderStep()}

      <div className="mt-auto pt-10 text-xs text-slate-500">
          بالمتابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.
      </div>
    </div>
  );
};

export default LoginScreen;