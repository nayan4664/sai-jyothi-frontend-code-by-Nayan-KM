import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookCopy,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  IndianRupee,
  PackageSearch,
  Pencil,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { adminApi } from '../lib/admin-api';
import type { AdminBook, AdminBookPayload, AdminOrder, AdminUser, DashboardStats } from '../types/admin';

const emptyBookForm: AdminBookPayload = {
  title: '',
  author: '',
  price: 0,
  category: '',
  rating: 4,
  image: '',
  description: '',
  isbn: '',
  pages: 1,
  publisher: '',
  language: 'English',
  stock: 0,
};

const orderStatuses = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const userRoles = ['ROLE_USER', 'ROLE_ADMIN'];
const booksPerPage = 4;

export const AdminDashboard: React.FC = () => {
  const { authToken, user } = useAuth();
  const { language, orderStatusLabel, locale } = useLanguage();
  const editorRef = useRef<HTMLElement | null>(null);

  const copy =
    language === 'hi'
      ? {
          loading: 'एडमिन वर्कस्पेस लोड हो रहा है...',
          loadError: 'एडमिन डैशबोर्ड लोड नहीं हो सका।',
          adminCommandCenter: 'एडमिन कमांड सेंटर',
          adminTitle: 'आधुनिक स्टोर ऑपरेशंस वर्कस्पेस',
          adminSubtitle: 'क्लीनर डैशबोर्ड से कैटलॉग अपडेट करें, ग्राहकों को मैनेज करें और ऑर्डर संभालें।',
          signedInAs: 'साइन इन किया है',
          revenue: 'राजस्व',
          orders: 'ऑर्डर',
          books: 'पुस्तकें',
          customers: 'ग्राहक',
          pendingOrders: 'लंबित ऑर्डर',
          lowStockBooks: 'कम स्टॉक वाली पुस्तकें',
          adminAccounts: 'एडमिन अकाउंट',
          catalogEditor: 'कैटलॉग एडिटर',
          createNewBook: 'नई पुस्तक बनाएं',
          updateSelectedBook: 'चुनी हुई पुस्तक अपडेट करें',
          createBookText: 'इस पैनल का उपयोग करके नई पुस्तक को लाइव कैटलॉग में प्रकाशित करें।',
          updateBookText: 'आप लाइव कैटलॉग एंट्री एडिट कर रहे हैं। बदलाव सेव करने पर स्टोरफ्रंट अपडेट होगा।',
          clearEditor: 'एडिटर साफ करें',
          editingBook: (id: number) => `पुस्तक आईडी #${id} एडिट हो रही है।`,
          title: 'शीर्षक',
          author: 'लेखक',
          category: 'श्रेणी',
          publisher: 'प्रकाशक',
          price: 'कीमत',
          rating: 'रेटिंग',
          pages: 'पृष्ठ',
          stock: 'स्टॉक',
          bookLanguage: 'भाषा',
          isbn: 'आईएसबीएन',
          imageUrl: 'इमेज URL',
          description: 'विवरण',
          saving: 'सेव हो रहा है...',
          createBook: 'पुस्तक बनाएं',
          saveChanges: 'बदलाव सेव करें',
          userAccess: 'यूज़र एक्सेस',
          userAccessText: 'एडमिन प्रमोट करें और ऑपरेशनल ओनरशिप साफ रखें।',
          admin: 'एडमिन',
          userRole: 'यूज़र',
          updatingRole: 'रोल अपडेट हो रहा है...',
          compactInventory: 'कॉम्पैक्ट इन्वेंटरी',
          catalogInventory: 'कैटलॉग इन्वेंटरी',
          catalogInventoryText: 'लंबी वर्टिकल सूची की जगह पेजों में टाइटल देखें और एडिट करें।',
          searchPlaceholder: 'शीर्षक, लेखक, श्रेणी, ISBN खोजें...',
          booksCount: (count: number) => `${count} पुस्तकें`,
          editing: 'एडिट हो रही है',
          units: 'यूनिट',
          reviews: 'रिव्यू',
          deleting: 'हटाया जा रहा है...',
          noBooksFound: 'इस खोज से कोई पुस्तक नहीं मिली',
          noBooksFoundText: 'दूसरा शीर्षक, लेखक, श्रेणी या ISBN आज़माएं।',
          pageOf: (page: number, total: number) => `पेज ${page} / ${total}`,
          orderOperations: 'ऑर्डर ऑपरेशंस',
          orderOperationsText: 'डैशबोर्ड छोड़े बिना ऑर्डर स्टेटस मैनेज करें।',
          items: 'आइटम',
          payment: 'भुगतान',
          placedOn: 'तारीख',
          updatingStatus: 'स्टेटस अपडेट हो रहा है...',
          noOrders: 'अभी कोई ऑर्डर उपलब्ध नहीं है',
          noOrdersText: 'जैसे ही ग्राहक ऑर्डर करेंगे, वे यहां दिखेंगे।',
          noUsers: 'कोई यूज़र उपलब्ध नहीं है',
          noUsersText: 'रजिस्टर्ड यूज़र यहां दिखाई देंगे।',
          status: 'स्थिति',
          editToast: (title: string) => `"${title}" एडिट हो रही है`,
          createSuccess: 'पुस्तक सफलतापूर्वक बनाई गई।',
          updateSuccess: 'पुस्तक सफलतापूर्वक अपडेट हुई।',
          deleteConfirm: (title: string) => `क्या आप "${title}" को हटाना चाहते हैं?`,
          deleteSuccess: 'पुस्तक सफलतापूर्वक हटाई गई।',
          saveError: 'पुस्तक सेव नहीं हो सकी।',
          deleteError: 'पुस्तक हटाई नहीं जा सकी।',
          orderUpdateSuccess: 'ऑर्डर स्टेटस अपडेट हो गया।',
          orderUpdateError: 'ऑर्डर स्टेटस अपडेट नहीं हो सका।',
          userRoleSuccess: 'यूज़र रोल अपडेट हो गया।',
          userRoleError: 'यूज़र रोल अपडेट नहीं हो सका।',
          edit: 'संपादित करें',
          delete: 'हटाएं',
          previous: 'पिछला',
          next: 'अगला',
        }
      : {
          loading: 'Loading admin workspace...',
          loadError: 'Could not load admin dashboard.',
          adminCommandCenter: 'Admin Command Center',
          adminTitle: 'Modern store operations workspace',
          adminSubtitle: 'Update the catalog, manage customers, and handle orders from a cleaner dashboard.',
          signedInAs: 'Signed in as',
          revenue: 'Revenue',
          orders: 'Orders',
          books: 'Books',
          customers: 'Customers',
          pendingOrders: 'Pending orders',
          lowStockBooks: 'Low stock books',
          adminAccounts: 'Admin accounts',
          catalogEditor: 'Catalog editor',
          createNewBook: 'Create new book',
          updateSelectedBook: 'Update selected book',
          createBookText: 'Use this panel to publish a new title into the live catalog.',
          updateBookText: 'You are editing a live catalog entry. Save changes to update the storefront.',
          clearEditor: 'Clear editor',
          editingBook: (id: number) => `Editing book ID #${id}.`,
          title: 'Title',
          author: 'Author',
          category: 'Category',
          publisher: 'Publisher',
          price: 'Price',
          rating: 'Rating',
          pages: 'Pages',
          stock: 'Stock',
          bookLanguage: 'Language',
          isbn: 'ISBN',
          imageUrl: 'Image URL',
          description: 'Description',
          saving: 'Saving...',
          createBook: 'Create book',
          saveChanges: 'Save changes',
          userAccess: 'User access',
          userAccessText: 'Promote admins and keep operational ownership clear.',
          admin: 'Admin',
          userRole: 'User',
          updatingRole: 'Updating role...',
          compactInventory: 'Compact inventory',
          catalogInventory: 'Catalog inventory',
          catalogInventoryText: 'Review titles in pages instead of one long vertical list.',
          searchPlaceholder: 'Search title, author, category, ISBN...',
          booksCount: (count: number) => `${count} books`,
          editing: 'Editing',
          units: 'units',
          reviews: 'Reviews',
          deleting: 'Deleting...',
          noBooksFound: 'No books match this search',
          noBooksFoundText: 'Try another title, author, category, or ISBN.',
          pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
          orderOperations: 'Order operations',
          orderOperationsText: 'Move orders through fulfillment without leaving the dashboard.',
          items: 'Items',
          payment: 'Payment',
          placedOn: 'Placed on',
          updatingStatus: 'Updating status...',
          noOrders: 'No orders available yet',
          noOrdersText: 'Orders will appear here as soon as customers place them.',
          noUsers: 'No users available yet',
          noUsersText: 'Registered users will appear here.',
          status: 'Status',
          editToast: (title: string) => `Editing "${title}"`,
          createSuccess: 'Book created.',
          updateSuccess: 'Book updated.',
          deleteConfirm: (title: string) => `Delete "${title}" from the catalog?`,
          deleteSuccess: 'Book deleted.',
          saveError: 'Could not save this book.',
          deleteError: 'Could not delete this book.',
          orderUpdateSuccess: 'Order status updated.',
          orderUpdateError: 'Could not update order status.',
          userRoleSuccess: 'User role updated.',
          userRoleError: 'Could not update user role.',
          edit: 'Edit',
          delete: 'Delete',
          previous: 'Previous',
          next: 'Next',
        };

  const statCards = (stats: DashboardStats) => [
    { label: copy.revenue, value: `₹${stats.totalRevenue.toLocaleString(locale)}`, icon: IndianRupee, accent: 'from-emerald-500 to-teal-500' },
    { label: copy.orders, value: stats.totalOrders.toLocaleString(locale), icon: ClipboardList, accent: 'from-blue-500 to-cyan-500' },
    { label: copy.books, value: stats.totalBooks.toLocaleString(locale), icon: BookCopy, accent: 'from-violet-500 to-fuchsia-500' },
    { label: copy.customers, value: stats.totalUsers.toLocaleString(locale), icon: Users, accent: 'from-amber-500 to-orange-500' },
  ];

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString(locale)}`;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [bookForm, setBookForm] = useState<AdminBookPayload>(emptyBookForm);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [inventoryQuery, setInventoryQuery] = useState('');
  const [currentBookPage, setCurrentBookPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSavingBook, setIsSavingBook] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!authToken) return;

    let isActive = true;

    const loadAdminData = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [dashboardStats, adminBooks, adminOrders, adminUsers] = await Promise.all([
          adminApi.getDashboardStats(authToken),
          adminApi.getBooks(authToken),
          adminApi.getOrders(authToken),
          adminApi.getUsers(authToken),
        ]);

        if (!isActive) return;

        setStats(dashboardStats);
        setBooks(adminBooks);
        setOrders(adminOrders);
        setUsers(adminUsers);
      } catch (error) {
        if (!isActive) return;
        const message = error instanceof Error ? error.message : copy.loadError;
        setLoadError(message);
        toast.error(message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadAdminData();

    return () => {
      isActive = false;
    };
  }, [authToken, copy.loadError]);

  useEffect(() => {
    setCurrentBookPage(1);
  }, [inventoryQuery]);

  const lowStockBooks = useMemo(() => books.filter((book) => book.stock <= 5).length, [books]);
  const activeAdmins = useMemo(() => users.filter((entry) => entry.role === 'ROLE_ADMIN').length, [users]);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = inventoryQuery.trim().toLowerCase();
    if (!normalizedQuery) return books;

    return books.filter((book) =>
      [book.title, book.author, book.category, book.publisher, book.isbn].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      )
    );
  }, [books, inventoryQuery]);

  const totalBookPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentBookPage - 1) * booksPerPage;
    return filteredBooks.slice(startIndex, startIndex + booksPerPage);
  }, [currentBookPage, filteredBooks]);

  useEffect(() => {
    if (currentBookPage > totalBookPages) setCurrentBookPage(totalBookPages);
  }, [currentBookPage, totalBookPages]);

  const resetBookForm = () => {
    setBookForm(emptyBookForm);
    setEditingBookId(null);
  };

  const handleBookFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const numericFields = new Set(['price', 'rating', 'pages', 'stock']);

    setBookForm((current) => ({
      ...current,
      [name]: numericFields.has(name) ? Number(value) : value,
    }));
  };

  const focusEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEditBook = (book: AdminBook) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title,
      author: book.author,
      price: book.price,
      category: book.category,
      rating: book.rating,
      image: book.image,
      description: book.description,
      isbn: book.isbn,
      pages: book.pages,
      publisher: book.publisher,
      language: book.language,
      stock: book.stock,
    });
    focusEditor();
    toast.success(copy.editToast(book.title));
  };

  const handleBookSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authToken) return;

    setIsSavingBook(true);

    try {
      const savedBook =
        editingBookId === null
          ? await adminApi.createBook(authToken, bookForm)
          : await adminApi.updateBook(authToken, editingBookId, bookForm);

      setBooks((current) => {
        if (editingBookId === null) return [...current, savedBook].sort((left, right) => left.id - right.id);
        return current.map((book) => (book.id === savedBook.id ? savedBook : book)).sort((left, right) => left.id - right.id);
      });

      setStats((current) =>
        current ? { ...current, totalBooks: editingBookId === null ? current.totalBooks + 1 : current.totalBooks } : current
      );

      toast.success(editingBookId === null ? copy.createSuccess : copy.updateSuccess);
      resetBookForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.saveError);
    } finally {
      setIsSavingBook(false);
    }
  };

  const handleDeleteBook = async (book: AdminBook) => {
    if (!authToken) return;
    if (!window.confirm(copy.deleteConfirm(book.title))) return;

    setDeletingBookId(book.id);
    try {
      await adminApi.deleteBook(authToken, book.id);
      setBooks((current) => current.filter((entry) => entry.id !== book.id));
      setStats((current) => (current ? { ...current, totalBooks: Math.max(current.totalBooks - 1, 0) } : current));
      if (editingBookId === book.id) resetBookForm();
      toast.success(copy.deleteSuccess);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.deleteError);
    } finally {
      setDeletingBookId(null);
    }
  };

  const handleOrderStatusChange = async (orderId: number | undefined, status: string) => {
    if (!authToken || !orderId) return;
    setUpdatingOrderId(orderId);

    try {
      const updatedOrder = await adminApi.updateOrderStatus(authToken, orderId, status);
      setOrders((current) => current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
      setStats((current) => {
        if (!current) return current;
        const nextPendingOrders = orders.reduce((count, order) => {
          const nextStatus = order.id === orderId ? status : order.status ?? 'PLACED';
          return count + Number(nextStatus === 'PLACED' || nextStatus === 'PROCESSING');
        }, 0);
        return { ...current, pendingOrders: nextPendingOrders };
      });
      toast.success(copy.orderUpdateSuccess);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.orderUpdateError);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleUserRoleChange = async (userId: number, role: string) => {
    if (!authToken) return;
    setUpdatingUserId(userId);

    try {
      const updatedUser = await adminApi.updateUserRole(authToken, userId, role);
      setUsers((current) => current.map((entry) => (entry.id === updatedUser.id ? updatedUser : entry)));
      toast.success(copy.userRoleSuccess);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.userRoleError);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black">{copy.loading}</h1>
        </div>
      </div>
    );
  }

  if (loadError || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-rose-400/30 bg-white/5 p-8 backdrop-blur">
          <h1 className="text-3xl font-black">{copy.loadError}</h1>
          <p className="mt-3 text-slate-300">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#06111e_0%,#0c1930_28%,#eaf2ff_28%,#f7fbff_100%)]">
      <section className="relative overflow-hidden px-4 pb-16 pt-12 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                <ShieldCheck className="mr-2 h-4 w-4" />
                {copy.adminCommandCenter}
              </div>
              <h1 className="mt-4 text-4xl font-black md:text-5xl">{copy.adminTitle}</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">{copy.adminSubtitle}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 px-6 py-5 shadow-2xl shadow-slate-950/20 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">{copy.signedInAs}</p>
              <p className="mt-2 text-xl font-bold">{user?.name}</p>
              <p className="text-sm text-slate-300">{user?.email}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statCards(stats).map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.label}
                  className="rounded-[1.75rem] border border-white/12 bg-white/8 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">{card.label}</p>
                      <p className="mt-3 text-3xl font-black">{card.value}</p>
                    </div>
                    <div className={`rounded-2xl bg-gradient-to-br ${card.accent} p-3 text-white shadow-lg`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur">
              <p className="text-sm text-slate-300">{copy.pendingOrders}</p>
              <p className="mt-2 text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur">
              <p className="text-sm text-slate-300">{copy.lowStockBooks}</p>
              <p className="mt-2 text-2xl font-bold">{lowStockBooks}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur">
              <p className="text-sm text-slate-300">{copy.adminAccounts}</p>
              <p className="mt-2 text-2xl font-bold">{activeAdmins}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
        <div className="space-y-8">
          <section
            ref={editorRef}
            className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">{copy.catalogEditor}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {editingBookId === null ? copy.createNewBook : copy.updateSelectedBook}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {editingBookId === null ? copy.createBookText : copy.updateBookText}
                </p>
              </div>
              {editingBookId !== null && (
                <button
                  type="button"
                  onClick={resetBookForm}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
                >
                  {copy.clearEditor}
                </button>
              )}
            </div>

            {editingBookId !== null && (
              <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                {copy.editingBook(editingBookId)}
              </div>
            )}

            <form onSubmit={handleBookSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <input name="title" value={bookForm.title} onChange={handleBookFieldChange} placeholder={copy.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="author" value={bookForm.author} onChange={handleBookFieldChange} placeholder={copy.author} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="category" value={bookForm.category} onChange={handleBookFieldChange} placeholder={copy.category} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="publisher" value={bookForm.publisher} onChange={handleBookFieldChange} placeholder={copy.publisher} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="price" type="number" step="0.01" min="0" value={bookForm.price} onChange={handleBookFieldChange} placeholder={copy.price} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="rating" type="number" step="0.1" min="0" max="5" value={bookForm.rating} onChange={handleBookFieldChange} placeholder={copy.rating} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="pages" type="number" min="1" value={bookForm.pages} onChange={handleBookFieldChange} placeholder={copy.pages} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="stock" type="number" min="0" value={bookForm.stock} onChange={handleBookFieldChange} placeholder={copy.stock} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="language" value={bookForm.language} onChange={handleBookFieldChange} placeholder={copy.bookLanguage} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="isbn" value={bookForm.isbn} onChange={handleBookFieldChange} placeholder={copy.isbn} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <input name="image" value={bookForm.image} onChange={handleBookFieldChange} placeholder={copy.imageUrl} className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <textarea name="description" value={bookForm.description} onChange={handleBookFieldChange} placeholder={copy.description} rows={5} className="md:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" required />
              <button
                type="submit"
                disabled={isSavingBook}
                className="md:col-span-2 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSavingBook ? copy.saving : editingBookId === null ? copy.createBook : copy.saveChanges}
              </button>
            </form>
          </section>
          
          <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-cyan-700" />
              <div>
                <h2 className="text-2xl font-black text-slate-900">{copy.userAccess}</h2>
                <p className="text-sm text-slate-500">{copy.userAccessText}</p>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <h3 className="text-lg font-bold text-slate-900">{copy.noUsers}</h3>
                <p className="mt-2 text-sm text-slate-500">{copy.noUsersText}</p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {users.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{entry.name}</p>
                      <p className="text-sm text-slate-500">{entry.email}</p>
                    </div>
                    <select
                      value={entry.role}
                      onChange={(event) => void handleUserRoleChange(entry.id, event.target.value)}
                      disabled={updatingUserId === entry.id}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-cyan-500"
                    >
                      {userRoles.map((role) => (
                        <option key={role} value={role}>
                          {role === 'ROLE_ADMIN' ? copy.admin : copy.userRole}
                        </option>
                      ))}
                    </select>
                    {updatingUserId === entry.id && (
                      <p className="text-xs font-semibold text-cyan-700">{copy.updatingRole}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 text-white shadow-lg">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <div className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    {copy.compactInventory}
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-slate-900">{copy.catalogInventory}</h2>
                  <p className="text-sm text-slate-500">{copy.catalogInventoryText}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative block min-w-[250px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={inventoryQuery}
                    onChange={(event) => setInventoryQuery(event.target.value)}
                    placeholder={copy.searchPlaceholder}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {copy.booksCount(filteredBooks.length)}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {paginatedBooks.map((book) => {
                const isEditing = editingBookId === book.id;
                const isDeleting = deletingBookId === book.id;

                return (
                  <article
                    key={book.id}
                    className={`rounded-[1.75rem] border p-5 shadow-sm transition ${
                      isEditing
                        ? 'border-cyan-300 bg-cyan-50 shadow-cyan-100'
                        : 'border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <img src={book.image} alt={book.title} className="h-36 w-24 rounded-2xl object-cover shadow-md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                                {book.category}
                              </p>
                              <h3 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900">{book.title}</h3>
                              <p className="text-sm text-slate-500">by {book.author}</p>
                            </div>
                            {isEditing && (
                              <span className="rounded-full bg-cyan-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                {copy.editing}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                            <div className="rounded-2xl bg-white px-3 py-3">
                              <p className="text-xs uppercase tracking-wide text-slate-400">{copy.price}</p>
                              <p className="mt-1 font-semibold text-slate-900">{formatCurrency(book.price)}</p>
                            </div>
                            <div className="rounded-2xl bg-white px-3 py-3">
                              <p className="text-xs uppercase tracking-wide text-slate-400">{copy.stock}</p>
                              <p className={`mt-1 font-semibold ${book.stock <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                                {book.stock} {copy.units}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white px-3 py-3">
                              <p className="text-xs uppercase tracking-wide text-slate-400">{copy.rating}</p>
                              <p className="mt-1 font-semibold text-slate-900">{book.rating} / 5</p>
                            </div>
                            <div className="rounded-2xl bg-white px-3 py-3">
                              <p className="text-xs uppercase tracking-wide text-slate-400">{copy.reviews}</p>
                              <p className="mt-1 font-semibold text-slate-900">{book.reviewCount}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditBook(book)}
                              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              {copy.edit}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteBook(book)}
                              disabled={isDeleting}
                              className="inline-flex items-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {isDeleting ? copy.deleting : copy.delete}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {paginatedBooks.length === 0 && (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <h3 className="text-lg font-bold text-slate-900">{copy.noBooksFound}</h3>
                <p className="mt-2 text-sm text-slate-500">{copy.noBooksFoundText}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">{copy.pageOf(currentBookPage, totalBookPages)}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentBookPage((page) => Math.max(page - 1, 1))}
                  disabled={currentBookPage === 1}
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {copy.previous}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentBookPage((page) => Math.min(page + 1, totalBookPages))}
                  disabled={currentBookPage === totalBookPages}
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copy.next}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="flex items-center gap-3">
              <PackageSearch className="h-5 w-5 text-cyan-700" />
              <div>
                <h2 className="text-2xl font-black text-slate-900">{copy.orderOperations}</h2>
                <p className="text-sm text-slate-500">{copy.orderOperationsText}</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <h3 className="text-lg font-bold text-slate-900">{copy.noOrders}</h3>
                <p className="mt-2 text-sm text-slate-500">{copy.noOrdersText}</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {orders.map((order) => (
                  <article key={order.id ?? order.orderId} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{order.orderId}</p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">{order.customerInfo.fullName}</h3>
                        <p className="text-sm text-slate-500">{order.customerInfo.email}</p>
                      </div>
                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <p className="text-lg font-black text-slate-900">{formatCurrency(order.total)}</p>
                        {updatingOrderId === order.id && <p className="text-xs font-semibold text-cyan-700">{copy.updatingStatus}</p>}
                        <select
                          value={order.status ?? 'PLACED'}
                          onChange={(event) => void handleOrderStatusChange(order.id, event.target.value)}
                          disabled={updatingOrderId === order.id}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-cyan-500"
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {orderStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-4">
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">{copy.items}</p>
                        <p className="mt-1 font-semibold text-slate-900">{order.items.length}</p>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">{copy.payment}</p>
                        <p className="mt-1 font-semibold text-slate-900 uppercase">{order.customerInfo.paymentMethod}</p>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">{copy.placedOn}</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {new Date(order.orderDate).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">{copy.status}</p>
                        <p className="mt-1 font-semibold text-slate-900">{orderStatusLabel(order.status ?? 'PLACED')}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
