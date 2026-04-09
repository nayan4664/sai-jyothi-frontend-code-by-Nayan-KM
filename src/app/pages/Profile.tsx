import React, { useEffect, useState } from 'react';
import { Heart, LockKeyhole, UserRound } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { accountApi } from '../lib/account-api';
import type { PasswordChangePayload, ProfilePayload, WishlistItem } from '../types/account';

export const Profile: React.FC = () => {
  const { authToken, user, updateUser } = useAuth();
  const { language, t, categoryLabel, locale } = useLanguage();
  const [profileForm, setProfileForm] = useState<ProfilePayload>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [passwordForm, setPasswordForm] = useState<PasswordChangePayload>({
    currentPassword: '',
    newPassword: '',
  });
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

  const copy =
    language === 'hi'
      ? {
          title: 'मेरा प्रोफ़ाइल',
          subtitle: 'अपने अकाउंट की जानकारी, पासवर्ड और पसंदीदा पुस्तकों को एक जगह मैनेज करें।',
          profileDetails: 'प्रोफ़ाइल विवरण',
          profileHelp: 'यह जानकारी आपके अकाउंट और ऑर्डर अनुभव में उपयोग होगी।',
          currentPassword: 'मौजूदा पासवर्ड',
          newPassword: 'नया पासवर्ड',
          updateProfile: 'प्रोफ़ाइल अपडेट करें',
          changePassword: 'पासवर्ड बदलें',
          passwordSection: 'पासवर्ड सुरक्षा',
          passwordHelp: 'अपने अकाउंट को सुरक्षित रखने के लिए नियमित रूप से पासवर्ड बदलें।',
          wishlist: 'मेरी विशलिस्ट',
          wishlistHelp: 'यहां आपकी सेव की हुई पुस्तकें दिखाई देंगी।',
          emptyWishlist: 'आपकी विशलिस्ट अभी खाली है।',
          emptyWishlistText: 'पसंदीदा पुस्तकें सेव करने के लिए किताबों के पेज पर हार्ट बटन इस्तेमाल करें।',
          remove: 'हटाएं',
          loading: 'प्रोफ़ाइल लोड हो रही है...',
          profileSaved: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हुई।',
          passwordSaved: 'पासवर्ड सफलतापूर्वक बदल गया।',
          wishlistRemoved: 'पुस्तक विशलिस्ट से हटा दी गई।',
          saveError: 'प्रोफ़ाइल अपडेट नहीं हो सकी।',
          passwordError: 'पासवर्ड अपडेट नहीं हो सका।',
          wishlistError: 'विशलिस्ट लोड नहीं हो सकी।',
          fullName: 'पूरा नाम',
          email: 'ईमेल',
          phone: 'फ़ोन नंबर',
          city: 'शहर',
          state: 'राज्य',
          pincode: 'पिन कोड',
          address: 'पता',
          wishlistAddedOn: 'सेव किया गया',
        }
      : {
          title: 'My Profile',
          subtitle: 'Manage your account details, password, and saved books in one place.',
          profileDetails: 'Profile Details',
          profileHelp: 'This information is used for your account and order experience.',
          currentPassword: 'Current Password',
          newPassword: 'New Password',
          updateProfile: 'Update Profile',
          changePassword: 'Change Password',
          passwordSection: 'Password Security',
          passwordHelp: 'Change your password regularly to keep your account secure.',
          wishlist: 'My Wishlist',
          wishlistHelp: 'Your saved books appear here.',
          emptyWishlist: 'Your wishlist is empty.',
          emptyWishlistText: 'Use the heart button on a book page to save books here.',
          remove: 'Remove',
          loading: 'Loading profile...',
          profileSaved: 'Profile updated successfully.',
          passwordSaved: 'Password changed successfully.',
          wishlistRemoved: 'Book removed from wishlist.',
          saveError: 'Could not update profile.',
          passwordError: 'Could not update password.',
          wishlistError: 'Could not load wishlist.',
          fullName: 'Full Name',
          email: 'Email',
          phone: 'Phone Number',
          city: 'City',
          state: 'State',
          pincode: 'PIN Code',
          address: 'Address',
          wishlistAddedOn: 'Saved on',
        };

  useEffect(() => {
    if (!authToken) {
      return;
    }

    let isActive = true;

    const loadData = async () => {
      setIsLoading(true);
      setIsLoadingWishlist(true);

      try {
        const [profile, wishlistItems] = await Promise.all([
          accountApi.getProfile(authToken),
          accountApi.getWishlist(authToken),
        ]);

        if (!isActive) {
          return;
        }

        setProfileForm({
          name: profile.name,
          email: profile.email,
          phone: profile.phone ?? '',
          address: profile.address ?? '',
          city: profile.city ?? '',
          state: profile.state ?? '',
          pincode: profile.pincode ?? '',
        });
        setWishlist(wishlistItems);
      } catch (error) {
        if (!isActive) {
          return;
        }
        toast.error(error instanceof Error ? error.message : copy.wishlistError);
      } finally {
        if (isActive) {
          setIsLoading(false);
          setIsLoadingWishlist(false);
        }
      }
    };

    void loadData();

    return () => {
      isActive = false;
    };
  }, [authToken, copy.wishlistError]);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authToken || !user) {
      return;
    }

    setIsSavingProfile(true);
    try {
      const updatedProfile = await accountApi.updateProfile(authToken, profileForm);
      updateUser({
        id: updatedProfile.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
      });
      toast.success(copy.profileSaved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.saveError);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authToken) {
      return;
    }

    setIsSavingPassword(true);
    try {
      await accountApi.changePassword(authToken, passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success(copy.passwordSaved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.passwordError);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleRemoveWishlist = async (bookId: number) => {
    if (!authToken) {
      return;
    }

    try {
      const items = await accountApi.removeWishlistItem(authToken, bookId);
      setWishlist(items);
      toast.success(copy.wishlistRemoved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.wishlistError);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-black text-slate-900">{copy.loading}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <h1 className="text-4xl font-black text-slate-900">{copy.title}</h1>
          <p className="mt-3 text-slate-600">{copy.subtitle}</p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{copy.profileDetails}</h2>
                  <p className="text-sm text-slate-500">{copy.profileHelp}</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.fullName}</label>
                  <input
                    value={profileForm.name}
                    onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder={copy.fullName}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.email}</label>
                  <input
                    value={profileForm.email}
                    onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.phone}</label>
                  <input
                    value={profileForm.phone}
                    onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                    placeholder={copy.phone}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.city}</label>
                  <input
                    value={profileForm.city}
                    onChange={(event) => setProfileForm((current) => ({ ...current, city: event.target.value }))}
                    placeholder={copy.city}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.state}</label>
                  <input
                    value={profileForm.state}
                    onChange={(event) => setProfileForm((current) => ({ ...current, state: event.target.value }))}
                    placeholder={copy.state}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.pincode}</label>
                  <input
                    value={profileForm.pincode}
                    onChange={(event) => setProfileForm((current) => ({ ...current, pincode: event.target.value }))}
                    placeholder={copy.pincode}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.address}</label>
                  <textarea
                    value={profileForm.address}
                    onChange={(event) => setProfileForm((current) => ({ ...current, address: event.target.value }))}
                    placeholder={copy.address}
                    rows={4}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="md:col-span-2 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingProfile ? t('common.loading') : copy.updateProfile}
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{copy.passwordSection}</h2>
                  <p className="text-sm text-slate-500">{copy.passwordHelp}</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="mt-6 grid gap-4">
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                  placeholder={copy.currentPassword}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                  placeholder={copy.newPassword}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingPassword ? t('common.loading') : copy.changePassword}
                </button>
              </form>
            </section>
          </div>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-rose-500" />
              <div>
                <h2 className="text-2xl font-black text-slate-900">{copy.wishlist}</h2>
                <p className="text-sm text-slate-500">{copy.wishlistHelp}</p>
              </div>
            </div>

            {isLoadingWishlist ? (
              <div className="mt-6 text-slate-500">{t('common.loading')}</div>
            ) : wishlist.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <h3 className="text-lg font-bold text-slate-900">{copy.emptyWishlist}</h3>
                <p className="mt-2 text-sm text-slate-500">{copy.emptyWishlistText}</p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <img src={item.image} alt={item.title} className="h-28 w-20 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/book/${item.id}`} className="text-lg font-bold text-slate-900 hover:text-blue-600">
                        {item.title}
                      </Link>
                      <p className="text-sm text-slate-500">{t('common.by')} {item.author}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {categoryLabel(item.category)}
                      </p>
                      <p className="mt-3 text-lg font-bold text-slate-900">{formatPrice(Number(item.price))}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {copy.wishlistAddedOn}{' '}
                        {new Date(item.addedAt).toLocaleDateString(locale, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <button
                        onClick={() => void handleRemoveWishlist(item.id)}
                        className="mt-3 text-sm font-semibold text-rose-600 hover:text-rose-700"
                      >
                        {copy.remove}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
