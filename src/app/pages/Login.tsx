import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Eye, EyeOff, BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { authApi } from '../lib/auth-api';
import { toast } from 'sonner';

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type AuthField = keyof AuthFormData;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z][A-Za-z .'-]{1,254}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,255}$/;

const emptyForm: AuthFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<AuthField, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<AuthField, boolean>>>({});

  const { language } = useLanguage();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LoginLocationState | null)?.from?.pathname || '/';
  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isForgotPassword = mode === 'forgot';

  const copy =
    language === 'hi'
      ? {
          registerHeroTitle: 'कुछ ही सेकंड में अपना रीडर अकाउंट बनाएं।',
          forgotHeroTitle: 'नए पासवर्ड के साथ अपना अकाउंट सुरक्षित करें।',
          loginHeroTitle: 'अपनी रीडिंग दुनिया में फिर से स्वागत है।',
          heroText:
            'अपना कार्ट ट्रैक करें, ऑर्डर मैनेज करें, और प्रोग्रामिंग, फिक्शन, अकादमिक और अन्य श्रेणियों की चुनी हुई किताबें खोजें।',
          forgotHeroTip: 'अपने रजिस्टर्ड ईमेल से जल्दी एक्सेस रीसेट करें।',
          loginHeroTip: 'डेमो एक्सेस के लिए सुरक्षित और आसान साइन-इन फ्लो।',
          forgotHeroSubTip: 'कम से कम एक अक्षर और एक नंबर वाला मजबूत पासवर्ड चुनें।',
          loginHeroSubTip: 'सेव्ड यूज़र सेशन के साथ व्यक्तिगत शॉपिंग अनुभव।',
          memberLogin: 'मेंबर लॉगिन',
          newAccount: 'नया अकाउंट',
          resetPassword: 'पासवर्ड रीसेट',
          loginTitle: 'लॉगिन करें और पढ़ना जारी रखें।',
          registerTitle: 'जुड़ें और अपनी पसंदीदा लाइब्रेरी बनाएं।',
          forgotTitle: 'पासवर्ड रीसेट करें और फिर से शुरू करें।',
          loginSubtitle: 'अपने ईमेल और पासवर्ड से तुरंत अकाउंट एक्सेस करें।',
          registerSubtitle: 'अभी साइन अप करें और बेहतरीन किताबें खोजें।',
          forgotSubtitle: 'अपना ईमेल दर्ज करें और नया पासवर्ड सेट करें।',
          fullName: 'पूरा नाम',
          emailAddress: 'ईमेल पता',
          password: 'पासवर्ड',
          newPassword: 'नया पासवर्ड',
          confirmPassword: 'पासवर्ड की पुष्टि करें',
          fullNamePlaceholder: 'John Doe',
          emailPlaceholder: 'you@example.com',
          passwordPlaceholder: 'पासवर्ड दर्ज करें',
          confirmPasswordPlaceholder: 'पासवर्ड फिर से दर्ज करें',
          pleaseWait: 'कृपया प्रतीक्षा करें...',
          login: 'लॉगिन',
          createAccount: 'अकाउंट बनाएं',
          resetPasswordButton: 'पासवर्ड रीसेट करें',
          noAccount: 'क्या आपका अकाउंट नहीं है? साइन अप करें',
          backToLogin: 'लॉगिन पर वापस जाएं',
          forgotPasswordLink: 'पासवर्ड भूल गए?',
          forgotFooter: 'अपने रजिस्टर्ड ईमेल का उपयोग करें और मजबूत नया पासवर्ड चुनें।',
          loginFooter: 'पहले अकाउंट बनाएं, फिर उसी ईमेल और पासवर्ड से लॉगिन करें।',
          fixFields: 'हाइलाइट किए गए फ़ील्ड पहले ठीक करें।',
          loginSuccess: 'लॉगिन सफल रहा!',
          registerSuccess: 'अकाउंट सफलतापूर्वक बन गया!',
          forgotSuccess: 'पासवर्ड सफलतापूर्वक रीसेट हो गया। अब नए पासवर्ड से लॉगिन करें।',
          genericError: 'कुछ गलत हो गया।',
          requiredName: 'पूरा नाम आवश्यक है।',
          validName: 'कृपया सही पूरा नाम दर्ज करें।',
          requiredEmail: 'ईमेल आवश्यक है।',
          validEmail: 'कृपया सही ईमेल पता दर्ज करें।',
          requiredPassword: 'पासवर्ड आवश्यक है।',
          validPassword: 'पासवर्ड कम से कम 6 अक्षरों का हो और उसमें एक अक्षर व एक संख्या हो।',
          confirmRequired: 'कृपया पासवर्ड की पुष्टि करें।',
          passwordMismatch: 'पासवर्ड मेल नहीं खा रहे हैं।',
        }
      : {
          registerHeroTitle: 'Create your reader account in seconds.',
          forgotHeroTitle: 'Secure your account with a fresh password.',
          loginHeroTitle: 'Welcome back to your reading universe.',
          heroText:
            'Track your cart, manage orders, and discover hand-picked books across programming, fiction, academics, and more.',
          forgotHeroTip: 'Reset access quickly with your registered email.',
          loginHeroTip: 'Secure and simple sign-in flow for demo access.',
          forgotHeroSubTip: 'Choose a stronger password with at least one letter and one number.',
          loginHeroSubTip: 'Personalized shopping journey with saved user session.',
          memberLogin: 'Member Login',
          newAccount: 'New Account',
          resetPassword: 'Reset Password',
          loginTitle: 'Sign in and continue reading.',
          registerTitle: 'Join and build your dream library.',
          forgotTitle: 'Reset your password and get back in.',
          loginSubtitle: 'Access your account instantly with your email and password.',
          registerSubtitle: 'Sign up now and start exploring top-rated books today.',
          forgotSubtitle: 'Enter your email and set a new password for your account.',
          fullName: 'Full Name',
          emailAddress: 'Email Address',
          password: 'Password',
          newPassword: 'New Password',
          confirmPassword: 'Confirm Password',
          fullNamePlaceholder: 'John Doe',
          emailPlaceholder: 'you@example.com',
          passwordPlaceholder: 'Enter password',
          confirmPasswordPlaceholder: 'Re-enter password',
          pleaseWait: 'Please wait...',
          login: 'Login',
          createAccount: 'Create Account',
          resetPasswordButton: 'Reset Password',
          noAccount: "Don't have an account? Sign up",
          backToLogin: 'Back to login',
          forgotPasswordLink: 'Forgot password?',
          forgotFooter: 'Use your registered email and choose a strong new password.',
          loginFooter: 'Create an account once, then log in with the same email and password.',
          fixFields: 'Please fix the highlighted fields.',
          loginSuccess: 'Login successful!',
          registerSuccess: 'Account created successfully!',
          forgotSuccess: 'Password reset successful. Please login with your new password.',
          genericError: 'Something went wrong.',
          requiredName: 'Full name is required.',
          validName: 'Enter a valid full name.',
          requiredEmail: 'Email is required.',
          validEmail: 'Enter a valid email address.',
          requiredPassword: 'Password is required.',
          validPassword: 'Password must be at least 6 characters and include a letter and a number.',
          confirmRequired: 'Please confirm your password.',
          passwordMismatch: 'Passwords do not match.',
        };

  const title = useMemo(() => {
    if (isRegister) return copy.registerTitle;
    if (isForgotPassword) return copy.forgotTitle;
    return copy.loginTitle;
  }, [copy.forgotTitle, copy.loginTitle, copy.registerTitle, isForgotPassword, isRegister]);

  const subtitle = useMemo(() => {
    if (isRegister) return copy.registerSubtitle;
    if (isForgotPassword) return copy.forgotSubtitle;
    return copy.loginSubtitle;
  }, [copy.forgotSubtitle, copy.loginSubtitle, copy.registerSubtitle, isForgotPassword, isRegister]);

  const validateField = (field: AuthField, value: string, currentMode: AuthMode = mode) => {
    const normalized = value.trim();

    switch (field) {
      case 'name':
        if (currentMode !== 'register') return '';
        if (!normalized) return copy.requiredName;
        if (!nameRegex.test(normalized)) return copy.validName;
        return '';
      case 'email':
        if (!normalized) return copy.requiredEmail;
        if (!emailRegex.test(normalized)) return copy.validEmail;
        return '';
      case 'password':
        if (!normalized) return copy.requiredPassword;
        if (!passwordRegex.test(value)) {
          return copy.validPassword;
        }
        return '';
      case 'confirmPassword':
        if (currentMode === 'login') return '';
        if (!value) return copy.confirmRequired;
        if (value !== formData.password) return copy.passwordMismatch;
        return '';
      default:
        return '';
    }
  };

  const getFieldClassName = (field: AuthField) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:bg-white focus:ring-2 dark:bg-slate-800 dark:text-slate-100 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-300/40 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400/25'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-300/40 dark:border-slate-700 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/25'
    }`;

  const resetForm = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFormData(emptyForm);
    setErrors({});
    setTouchedFields({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as AuthField;

    setFormData((current) => {
      const nextForm = {
        ...current,
        [field]: value,
      };

      if (touchedFields[field] || (field === 'password' && touchedFields.confirmPassword)) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          [field]: validateField(field, value),
          ...(field === 'password'
            ? { confirmPassword: validateField('confirmPassword', nextForm.confirmPassword) }
            : {}),
        }));
      }

      return nextForm;
    });
  };

  const handleBlur = (field: AuthField) => {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, formData[field]),
    }));
  };

  const validateForm = () => {
    const activeFields: AuthField[] = isLogin
      ? ['email', 'password']
      : isRegister
        ? ['name', 'email', 'password', 'confirmPassword']
        : ['email', 'password', 'confirmPassword'];

    const nextErrors = activeFields.reduce<Partial<Record<AuthField, string>>>((accumulator, field) => {
      accumulator[field] = validateField(field, formData[field], mode);
      return accumulator;
    }, {});

    setErrors(nextErrors);
    setTouchedFields(activeFields.reduce<Partial<Record<AuthField, boolean>>>((accumulator, field) => {
      accumulator[field] = true;
      return accumulator;
    }, {}));

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(copy.fixFields);
      return;
    }

    setIsSubmitting(true);

    try {
      const email = formData.email.trim();
      const password = formData.password;

      if (isLogin) {
        await login(email, password);
        toast.success(copy.loginSuccess);
        navigate(from, { replace: true });
      } else if (isRegister) {
        await register(formData.name.trim(), email, password);
        toast.success(copy.registerSuccess);
        navigate(from, { replace: true });
      } else {
        await authApi.forgotPassword(email, password);
        toast.success(copy.forgotSuccess);
        resetForm('login');
        setFormData({
          ...emptyForm,
          email,
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl dark:bg-cyan-500/20" />
        <div className="absolute top-1/2 -right-24 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-400/25 blur-3xl dark:bg-blue-600/25" />
        <div className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/25 blur-3xl dark:bg-teal-500/20" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/60 lg:grid-cols-2">
        <div className="relative hidden bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-500 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_50%)]" />
          <div className="relative">
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-2 backdrop-blur-sm"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.16em]">Sai Jyothi Publication</span>
            </Link>
            <h1 className="mt-10 text-4xl font-black leading-tight">
              {isRegister
                ? copy.registerHeroTitle
                : isForgotPassword
                  ? copy.forgotHeroTitle
                  : copy.loginHeroTitle}
            </h1>
            <p className="mt-5 max-w-md text-base text-white/90">{copy.heroText}</p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5" />
                <p className="text-sm">{isForgotPassword ? copy.forgotHeroTip : copy.loginHeroTip}</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
                <p className="text-sm">{isForgotPassword ? copy.forgotHeroSubTip : copy.loginHeroSubTip}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-white lg:hidden">
              <BookOpen className="h-7 w-7 text-blue-600 dark:text-cyan-300" />
              <span className="text-lg font-bold">Sai Jyothi Publication</span>
            </Link>

            <p className="mt-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300">
              {isLogin ? copy.memberLogin : isRegister ? copy.newAccount : copy.resetPassword}
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {copy.fullName}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  className={getFieldClassName('name')}
                  placeholder={copy.fullNamePlaceholder}
                />
                {touchedFields.name && errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                {copy.emailAddress}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={getFieldClassName('email')}
                placeholder={copy.emailPlaceholder}
              />
              {touchedFields.email && errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                {isForgotPassword ? copy.newPassword : copy.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={getFieldClassName('password')}
                  placeholder={copy.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {touchedFields.password && errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {(isRegister || isForgotPassword) && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  {copy.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={getFieldClassName('confirmPassword')}
                    placeholder={copy.confirmPasswordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {touchedFields.confirmPassword && errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? copy.pleaseWait
                : isLogin
                  ? copy.login
                  : isRegister
                    ? copy.createAccount
                    : copy.resetPasswordButton}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            {isLogin ? (
              <button
                onClick={() => resetForm('register')}
                className="text-sm font-semibold text-blue-700 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                {copy.noAccount}
              </button>
            ) : (
              <button
                onClick={() => resetForm('login')}
                className="text-sm font-semibold text-blue-700 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                {copy.backToLogin}
              </button>
            )}
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => resetForm('forgot')}
                className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {copy.forgotPasswordLink}
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {isForgotPassword ? copy.forgotFooter : copy.loginFooter}
          </p>
        </div>
      </div>
    </div>
  );
};
