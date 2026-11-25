/* ============================================================
   BayuGO-Konsulta — front-end app logic
   Demo build: data lives in localStorage on this device.
   ============================================================ */
(() => {
  'use strict';

  /* ---------------- helpers ---------------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const peso = (n) => '₱' + Number(n).toLocaleString('en-PH');
  const pad = (n) => String(n).padStart(2, '0');
  const isoLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayISO = () => isoLocal(new Date());
  const addDays = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return isoLocal(d);
  };
  const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initialsOf = (name) =>
    String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || 'BK';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------------- i18n ---------------- */

  const I18N = {
    en: {
      'nav.home': 'Home',
      'nav.appointments': 'Appointments',
      'nav.services': 'Services',
      'nav.profile': 'Profile',
      'nav.notif': 'Notifications',
      'nav.cart': 'Open cart',

      'brand.tagline': 'Your barangay health center, now in your pocket.',
      'auth.perk1': 'Free consultations for residents',
      'auth.perk2': 'Vital kits delivered to your barangay',
      'auth.perk3': 'Your health record, always on hand',
      'auth.welcome': 'Welcome Back!',
      'auth.loginSub': 'Log in to continue',
      'auth.userPh': 'Username or Email',
      'auth.passPh': 'Password',
      'auth.forgot': 'Forgot password?',
      'auth.login': 'Log In',
      'auth.demo': 'Try the demo account',
      'auth.newResident': 'New Resident?',
      'auth.register': 'Register here',
      'auth.fine': 'Your information is protected under the Data Privacy Act.',

      'home.searchPh': 'Search vital kits, promos...',
      'home.featured': 'Featured Vital Kits',
      'home.seeAll': 'See All',
      'home.catalog': 'All Products',
      'home.catalogSub': 'Health essentials curated by our barangay health workers.',
      'home.resultsFor': 'Results for',
      'home.noResults': 'No products found',
      'home.noResultsSub': 'Try a different search or category.',
      'home.reset': 'Reset filters',
      'home.deliveryTitle': 'Free delivery for orders over ₱1,500',
      'home.deliverySub': 'Delivered to Barangay Bayugo in 2–3 days. Cash on delivery or GCash accepted.',
      'home.browse': 'Browse kits',
      'home.trusted': 'Trusted by 2,400+ residents',
      'home.reviews': 'reviews',
      'home.add': 'Add to cart',
      'home.buyNow': 'Buy now',
      'home.save': 'Save',
      'home.inStock': 'In stock — ready to deliver',
      'home.products': 'products',
      'home.product': 'product',

      'cat.all': 'All Kits',
      'cat.vital': 'Vital Kits',
      'cat.promos': 'Promos',
      'cat.best': 'Best Sellers',

      'appt.title': 'My Appointments',
      'appt.sub': 'Book, reschedule, or cancel your visit in a few taps.',
      'appt.upcoming': 'Upcoming visits',
      'appt.book': 'Book an Appointment',
      'appt.service': 'Service',
      'appt.date': 'Date',
      'appt.time': 'Time',
      'appt.notes': 'Notes (optional)',
      'appt.notesPh': 'Symptoms, concerns, or reminders',
      'appt.confirm': 'Confirm Booking',
      'appt.hint': 'Walk-ins are still welcome. Booking just saves your slot.',
      'appt.empty': 'No appointments yet',
      'appt.emptySub': 'Book a visit and it will show up here.',
      'appt.cancel': 'Cancel',
      'appt.cancelled': 'Cancelled',
      'appt.confirmed': 'Confirmed',
      'appt.select': 'Select a service',
      'appt.selectDate': 'Please choose a date.',

      'services.title': 'Health Services',
      'services.sub': 'Free and low-cost services for Barangay Bayugo residents.',
      'services.book': 'Book now',
      'services.free': 'Free',
      'services.note': 'Bring a valid ID and your barangay health record. For emergencies, please call 911 or visit the nearest hospital.',

      'profile.title': 'My Profile',
      'profile.manage': 'Manage your account',
      'profile.verified': 'Verified resident',
      'profile.edit': 'Edit Personal Info',
      'profile.patientNo': 'Patient No.',
      'profile.email': 'Email',
      'profile.phone': 'Mobile',
      'profile.address': 'Address',
      'profile.download': 'Download Health Record',
      'profile.downloadSub': 'Complete record in PDF format',
      'profile.personal': 'Personal Information',
      'profile.security': 'Security & Password',
      'profile.languageLabel': 'Language:',
      'profile.help': 'Help & Support',
      'profile.logout': 'Log Out',
      'profile.note': 'Your records are private and only visible to you and the health center staff.',
      'profile.preparing': 'Preparing PDF…',

      'footer.tagline': 'Health essentials and barangay services, in one place for every family in Bayugo.',
      'footer.hours': 'Mon–Sat · 8:00 AM – 5:00 PM',
      'footer.shop': 'Shop',
      'footer.center': 'Health Center',
      'footer.contact': 'Contact',
      'footer.help': 'Help & Support',
      'footer.note': 'For emergencies, call 911 or go to the nearest hospital.',
      'footer.made': 'Made for the people of Bayugo',

      'cart.title': 'Your Cart',
      'cart.empty': 'Your cart is empty',
      'cart.emptySub': 'Add vital kits to get started.',
      'cart.browse': 'Browse vital kits',
      'cart.subtotal': 'Subtotal',
      'cart.delivery': 'Delivery',
      'cart.free': 'Free',
      'cart.total': 'Total',
      'cart.checkout': 'Checkout',
      'cart.note': 'Cash on delivery or GCash. Delivered within 2–3 days.',
      'cart.items': 'items',
      'cart.item': 'item',

      'notif.title': 'Notifications',
      'notif.markAll': 'Mark all as read',

      'register.title': 'Create your account',
      'register.sub': 'Register as a resident of Barangay Bayugo.',
      'register.name': 'Full name',
      'register.namePh': 'Juan Dela Cruz',
      'register.email': 'Email',
      'register.pass': 'Password',
      'register.passPh': 'At least 6 characters',
      'register.confirm': 'Confirm password',
      'register.confirmPh': 'Repeat password',
      'register.address': 'Purok / Address',
      'register.addressPh': 'Purok 3, Pag-asa St.',
      'register.submit': 'Create account',
      'register.have': 'Already registered?',
      'register.login': 'Log in',

      'forgot.title': 'Reset your password',
      'forgot.sub': 'We will send a reset link to your registered email.',
      'forgot.submit': 'Send reset link',
      'forgot.sent': 'Check your inbox',

      'edit.title': 'Personal Information',
      'edit.sub': 'Keep your details up to date for your health records.',
      'edit.name': 'Full name',
      'edit.phone': 'Mobile number',
      'edit.birthday': 'Birthday',
      'edit.blood': 'Blood type',

      'security.title': 'Security & Password',
      'security.sub': 'Update the password you use to sign in.',
      'security.current': 'Current password',
      'security.new': 'New password',
      'security.hint': 'Use at least 6 characters.',
      'security.submit': 'Update password',
      'security.lastUpdated': 'Last updated: today',

      'language.title': 'Language',
      'language.sub': 'Choose the language used across the app.',
      'language.enSub': 'Default language',
      'language.filSub': 'Wikang Filipino',
      'language.save': 'Save language',

      'help.title': 'Help & Support',
      'help.sub': 'Answers to common questions, plus ways to reach the health center.',
      'help.q1': 'How do I book an appointment?',
      'help.a1': 'Open the Appointments tab, pick a service, date, and time, then confirm. You will receive a notification once the health worker accepts your slot.',
      'help.q2': 'Where do you deliver vital kits?',
      'help.a2': 'We deliver anywhere in Barangay Bayugo within 2–3 days. Delivery is free for orders over ₱1,500. You may pay by cash on delivery or GCash.',
      'help.q3': 'Is my health record private?',
      'help.a3': 'Yes. Your record is protected under the Data Privacy Act and is only visible to you and authorized health center staff.',
      'help.q4': 'Can I still walk in without booking?',
      'help.a4': 'Of course. Walk-ins are welcome during clinic hours, Monday to Saturday, 8:00 AM to 5:00 PM. Booking simply saves you a slot.',
      'help.call': 'Call the health center',
      'help.email': 'Email us',

      'checkout.title': 'Checkout',
      'checkout.sub': 'Confirm your delivery details and payment method.',
      'checkout.address': 'Delivery address',
      'checkout.phone': 'Contact number',
      'checkout.payment': 'Payment method',
      'checkout.cod': 'Cash on Delivery',
      'checkout.place': 'Place order',
      'checkout.hint': 'You will pay when your order arrives (COD) or via the GCash prompt we send.',

      'success.title': 'Order placed!',
      'success.sub': 'Salamat! Your vital kit will be delivered to your barangay in 2–3 days.',
      'success.continue': 'Continue shopping',

      'common.cancel': 'Cancel',
      'common.saveChanges': 'Save changes',
      'common.done': 'Done',
      'common.confirm': 'Confirm',
      'common.close': 'Close',
      'common.qty': 'Qty',

      'greet.morning': 'Good Morning',
      'greet.afternoon': 'Good Afternoon',
      'greet.evening': 'Good Evening',

      'toast.welcomeBack': 'Welcome back',
      'toast.loggedOut': 'You have been logged out.',
      'toast.loginRequired': 'Please enter your username and password.',
      'toast.loginFail': 'Account not found. Try the demo account or register.',
      'toast.wrongPass': 'Incorrect password. Please try again.',
      'toast.demoFilled': 'Demo account filled in. Press Log In.',
      'toast.registered': 'Account created! Welcome to BayuGO-Konsulta.',
      'toast.fillFields': 'Please complete the required fields.',
      'toast.passShort': 'Password must be at least 6 characters.',
      'toast.passMismatch': 'Passwords do not match.',
      'toast.emailInvalid': 'Please enter a valid email address.',
      'toast.saved': 'Your details have been saved.',
      'toast.apptBooked': 'Appointment booked. See you at the health center!',
      'toast.apptCancelled': 'Appointment cancelled.',
      'toast.added': 'added to cart',
      'toast.removed': 'Item removed from cart.',
      'toast.orderPlaced': 'Order placed! Salamat sa pagtangkilik.',
      'toast.pdfReady': 'Health record downloaded.',
      'toast.langChanged': 'Language updated.',
      'toast.resetSent': 'Reset link sent. Please check your email.',
      'toast.passUpdated': 'Password updated successfully.',
      'toast.markedRead': 'All notifications marked as read.',
      'toast.selectService': 'Please select a service.',
      'toast.selectDate': 'Please choose a valid date.',
      'toast.selectTime': 'Please choose a time.',
      'toast.checkoutFields': 'Please complete your delivery details.',
      'toast.emptyCart': 'Your cart is empty.',
      'toast.required': 'Please fill in the required fields.',
      'toast.wrongCurrent': 'Current password is incorrect.',
      'toast.notifRead': 'Notification marked as read.',
      'toast.resetSentDemo': 'In this demo, no email is actually sent.',
      'toast.emailTaken': 'An account with this email already exists.',
      'toast.pdfError': 'Could not create the PDF. Please try again.',

      'logout.title': 'Log out?',
      'logout.msg': 'You can sign back in anytime with your account.',
      'logout.ok': 'Log out'
    },
    fil: {
      'nav.home': 'Home',
      'nav.appointments': 'Appointments',
      'nav.services': 'Serbisyo',
      'nav.profile': 'Profile',
      'nav.notif': 'Mga Abiso',
      'nav.cart': 'Buksan ang cart',

      'brand.tagline': 'Ang inyong barangay health center, nasa bulsa mo na.',
      'auth.perk1': 'Libreng konsultasyon para sa mga residente',
      'auth.perk2': 'Vital kits na hatid sa inyong barangay',
      'auth.perk3': 'Health record mo, laging dala',
      'auth.welcome': 'Maligayang Pagbabalik!',
      'auth.loginSub': 'Mag-log in upang magpatuloy',
      'auth.userPh': 'Username o Email',
      'auth.passPh': 'Password',
      'auth.forgot': 'Nakalimutan ang password?',
      'auth.login': 'Mag-log In',
      'auth.demo': 'Subukan ang demo account',
      'auth.newResident': 'Bagong Residente?',
      'auth.register': 'Magrehistro dito',
      'auth.fine': 'Protektado ang iyong impormasyon sa ilalim ng Data Privacy Act.',

      'home.searchPh': 'Maghanap ng vital kits, promo...',
      'home.featured': 'Tampok na Vital Kits',
      'home.seeAll': 'Tingnan Lahat',
      'home.catalog': 'Lahat ng Produkto',
      'home.catalogSub': 'Mga health essential na pinili ng ating barangay health workers.',
      'home.resultsFor': 'Mga resulta para sa',
      'home.noResults': 'Walang nahanap na produkto',
      'home.noResultsSub': 'Subukan ang ibang paghahanap o kategorya.',
      'home.reset': 'I-reset ang filter',
      'home.deliveryTitle': 'Libreng delivery sa order na lampas ₱1,500',
      'home.deliverySub': 'Ihahatid sa Barangay Bayugo sa loob ng 2–3 araw. Tumatanggap ng cash on delivery o GCash.',
      'home.browse': 'Tingnan ang mga kit',
      'home.trusted': '2,400+ residente ang nagtiwala',
      'home.reviews': 'review',
      'home.add': 'Idagdag sa cart',
      'home.buyNow': 'Bilhin na',
      'home.save': 'Tipid',
      'home.inStock': 'Available ngayon — pwedeng ihatid agad',
      'home.products': 'produkto',
      'home.product': 'produkto',

      'cat.all': 'Lahat ng Kit',
      'cat.vital': 'Vital Kits',
      'cat.promos': 'Mga Promo',
      'cat.best': 'Best Sellers',

      'appt.title': 'Aking mga Appointment',
      'appt.sub': 'I-book, i-reschedule, o i-cancel ang iyong pagbisita sa ilang tap lang.',
      'appt.upcoming': 'Mga darating na pagbisita',
      'appt.book': 'Mag-book ng Appointment',
      'appt.service': 'Serbisyo',
      'appt.date': 'Petsa',
      'appt.time': 'Oras',
      'appt.notes': 'Tala (opsyonal)',
      'appt.notesPh': 'Mga sintomas, alalahanin, o paalala',
      'appt.confirm': 'Kumpirmahin ang Booking',
      'appt.hint': 'Welcome pa rin ang walk-in. Ang pag-book ay nagsasave lang ng slot mo.',
      'appt.empty': 'Wala pang appointment',
      'appt.emptySub': 'Mag-book ng pagbisita at lalabas ito dito.',
      'appt.cancel': 'I-cancel',
      'appt.cancelled': 'Kinansela',
      'appt.confirmed': 'Kumpirmado',
      'appt.select': 'Pumili ng serbisyo',
      'appt.selectDate': 'Pumili ng petsa.',

      'services.title': 'Mga Serbisyong Pangkalusugan',
      'services.sub': 'Libre at murang serbisyo para sa mga residente ng Barangay Bayugo.',
      'services.book': 'Mag-book na',
      'services.free': 'Libre',
      'services.note': 'Magdala ng valid ID at barangay health record. Sa emergency, tumawag sa 911 o pumunta sa pinakamalapit na ospital.',

      'profile.title': 'Aking Profile',
      'profile.manage': 'Pamahalaan ang iyong account',
      'profile.verified': 'Beripikadong residente',
      'profile.edit': 'I-edit ang Personal na Impormasyon',
      'profile.patientNo': 'Patient No.',
      'profile.email': 'Email',
      'profile.phone': 'Mobile',
      'profile.address': 'Address',
      'profile.download': 'I-download ang Health Record',
      'profile.downloadSub': 'Kumpletong record sa PDF format',
      'profile.personal': 'Personal na Impormasyon',
      'profile.security': 'Seguridad at Password',
      'profile.languageLabel': 'Wika:',
      'profile.help': 'Tulong at Suporta',
      'profile.logout': 'Mag-log Out',
      'profile.note': 'Pribado ang iyong record — ikaw at ang health center staff lang ang makakakita.',
      'profile.preparing': 'Inihahanda ang PDF…',

      'footer.tagline': 'Health essentials at serbisyo ng barangay, nasa isang lugar para sa bawat pamilya ng Bayugo.',
      'footer.hours': 'Lun–Sab · 8:00 AM – 5:00 PM',
      'footer.shop': 'Shop',
      'footer.center': 'Health Center',
      'footer.contact': 'Kontak',
      'footer.help': 'Tulong at Suporta',
      'footer.note': 'Sa emergency, tumawag sa 911 o pumunta sa pinakamalapit na ospital.',
      'footer.made': 'Para sa mga taga-Bayugo',

      'cart.title': 'Iyong Cart',
      'cart.empty': 'Walang laman ang cart',
      'cart.emptySub': 'Magdagdag ng vital kits upang magsimula.',
      'cart.browse': 'Tingnan ang vital kits',
      'cart.subtotal': 'Subtotal',
      'cart.delivery': 'Delivery',
      'cart.free': 'Libre',
      'cart.total': 'Kabuuan',
      'cart.checkout': 'Mag-checkout',
      'cart.note': 'Cash on delivery o GCash. Ihahatid sa loob ng 2–3 araw.',
      'cart.items': 'items',
      'cart.item': 'item',

      'notif.title': 'Mga Abiso',
      'notif.markAll': 'Markahan lahat bilang nabasa',

      'register.title': 'Gumawa ng account',
      'register.sub': 'Magrehistro bilang residente ng Barangay Bayugo.',
      'register.name': 'Buong pangalan',
      'register.namePh': 'Juan Dela Cruz',
      'register.email': 'Email',
      'register.pass': 'Password',
      'register.passPh': 'Hindi bababa sa 6 na character',
      'register.confirm': 'Kumpirmahin ang password',
      'register.confirmPh': 'Ulitin ang password',
      'register.address': 'Purok / Address',
      'register.addressPh': 'Purok 3, Pag-asa St.',
      'register.submit': 'Gumawa ng account',
      'register.have': 'May account na?',
      'register.login': 'Mag-log in',

      'forgot.title': 'I-reset ang password',
      'forgot.sub': 'Magpapadala kami ng reset link sa iyong registered email.',
      'forgot.submit': 'Ipadala ang reset link',
      'forgot.sent': 'Tingnan ang iyong inbox',

      'edit.title': 'Personal na Impormasyon',
      'edit.sub': 'Panatilihing updated ang iyong detalye para sa health records.',
      'edit.name': 'Buong pangalan',
      'edit.phone': 'Mobile number',
      'edit.birthday': 'Kaarawan',
      'edit.blood': 'Blood type',

      'security.title': 'Seguridad at Password',
      'security.sub': 'I-update ang password na ginagamit mo sa pag-sign in.',
      'security.current': 'Kasalukuyang password',
      'security.new': 'Bagong password',
      'security.hint': 'Gumamit ng hindi bababa sa 6 na character.',
      'security.submit': 'I-update ang password',
      'security.lastUpdated': 'Huling update: ngayon',

      'language.title': 'Wika',
      'language.sub': 'Piliin ang wikang gagamitin sa app.',
      'language.enSub': 'Default na wika',
      'language.filSub': 'Wikang Filipino',
      'language.save': 'I-save ang wika',

      'help.title': 'Tulong at Suporta',
      'help.sub': 'Mga sagot sa karaniwang tanong, at paraan para makontak ang health center.',
      'help.q1': 'Paano mag-book ng appointment?',
      'help.a1': 'Buksan ang Appointments tab, pumili ng serbisyo, petsa, at oras, pagkatapos kumpirmahin. Makakatanggap ka ng abiso kapag tinanggap ng health worker ang slot mo.',
      'help.q2': 'Saan kayo naghahatid ng vital kits?',
      'help.a2': 'Naghahatid kami kahit saan sa Barangay Bayugo sa loob ng 2–3 araw. Libre ang delivery sa order na lampas ₱1,500. Pwedeng cash on delivery o GCash.',
      'help.q3': 'Pribado ba ang health record ko?',
      'help.a3': 'Oo. Protektado ang record mo sa ilalim ng Data Privacy Act at ikaw at awtorisadong staff lang ang makakakita.',
      'help.q4': 'Pwede pa bang mag-walk in nang walang booking?',
      'help.a4': 'Siyempre. Welcome ang walk-in tuwing clinic hours, Lunes hanggang Sabado, 8:00 AM hanggang 5:00 PM. Ang pag-book ay nagsasave lang ng slot mo.',
      'help.call': 'Tumawag sa health center',
      'help.email': 'Mag-email sa amin',

      'checkout.title': 'Checkout',
      'checkout.sub': 'Kumpirmahin ang delivery details at payment method.',
      'checkout.address': 'Delivery address',
      'checkout.phone': 'Contact number',
      'checkout.payment': 'Paraan ng pagbabayad',
      'checkout.cod': 'Cash on Delivery',
      'checkout.place': 'Ilagay ang order',
      'checkout.hint': 'Magbabayad ka pagdating ng order (COD) o sa GCash prompt na ipapadala namin.',

      'success.title': 'Naipakita na ang order!',
      'success.sub': 'Salamat! Ihahatid ang vital kit sa inyong barangay sa loob ng 2–3 araw.',
      'success.continue': 'Magpatuloy sa pamimili',

      'common.cancel': 'Kanselahin',
      'common.saveChanges': 'I-save ang mga pagbabago',
      'common.done': 'Tapos na',
      'common.confirm': 'Kumpirmahin',
      'common.close': 'Isara',
      'common.qty': 'Dami',

      'greet.morning': 'Magandang Umaga',
      'greet.afternoon': 'Magandang Hapon',
      'greet.evening': 'Magandang Gabi',

      'toast.welcomeBack': 'Maligayang pagbabalik',
      'toast.loggedOut': 'Naka-log out ka na.',
      'toast.loginRequired': 'Pakilagay ang username at password.',
      'toast.loginFail': 'Hindi mahanap ang account. Subukan ang demo o mag-register.',
      'toast.wrongPass': 'Mali ang password. Subukan ulit.',
      'toast.demoFilled': 'Na-fill ang demo account. Pindutin ang Log In.',
      'toast.registered': 'Nagawa ang account! Maligayang pagdating sa BayuGO-Konsulta.',
      'toast.fillFields': 'Pakikumpleto ang mga kailangang field.',
      'toast.passShort': 'Dapat hindi bababa sa 6 na character ang password.',
      'toast.passMismatch': 'Hindi tugma ang password.',
      'toast.emailInvalid': 'Maglagay ng valid na email address.',
      'toast.saved': 'Na-save ang iyong mga detalye.',
      'toast.apptBooked': 'Na-book ang appointment. Kita tayo sa health center!',
      'toast.apptCancelled': 'Kinansela ang appointment.',
      'toast.added': 'naidagdag sa cart',
      'toast.removed': 'Tinanggal sa cart.',
      'toast.orderPlaced': 'Naipakita ang order! Salamat sa pagtangkilik.',
      'toast.pdfReady': 'Na-download ang health record.',
      'toast.langChanged': 'Na-update ang wika.',
      'toast.resetSent': 'Naipadala ang reset link. Tingnan ang email.',
      'toast.passUpdated': 'Matagumpay na na-update ang password.',
      'toast.markedRead': 'Markado lahat ng abiso bilang nabasa.',
      'toast.selectService': 'Pumili ng serbisyo.',
      'toast.selectDate': 'Pumili ng tamang petsa.',
      'toast.selectTime': 'Pumili ng oras.',
      'toast.checkoutFields': 'Pakikumpleto ang delivery details.',
      'toast.emptyCart': 'Walang laman ang cart.',
      'toast.required': 'Pakikumpleto ang mga kailangang field.',
      'toast.wrongCurrent': 'Mali ang kasalukuyang password.',
      'toast.notifRead': 'Nabasa na ang abiso.',
      'toast.resetSentDemo': 'Sa demo na ito, walang email na talagang ipinapadala.',
      'toast.emailTaken': 'May account na gumagamit ng email na ito.',
      'toast.pdfError': 'Hindi magawa ang PDF. Subukan ulit.',

      'logout.title': 'Mag-log out?',
      'logout.msg': 'Pwede kang mag-sign in ulit anumang oras gamit ang account mo.',
      'logout.ok': 'Mag-log Out'
    }
  };

  /* ---------------- catalogue ---------------- */

  const DEMO_USER = {
    name: 'Katherine C. Salvacion',
    email: 'katherine.salvacion@email.com',
    phone: '0917 555 0142',
    address: 'Purok 3, Barangay Bayugo, Pag-asa St., Bulacan',
    patientNo: '2026-1029',
    birthday: '1994-06-12',
    blood: 'O+',
    sex: 'Female'
  };

  const PRODUCTS = [
    {
      id: 'bp-monitor',
      name: 'Blood Pressure Kit',
      tag: 'Best Seller',
      cat: 'vital',
      price: 1899,
      old: 2299,
      rating: 4.9,
      reviews: 126,
      desc: 'Monitor your blood pressure at home with a clinically validated upper-arm monitor.',
      features: [
        'Clinically validated readings',
        'Irregular heartbeat detection',
        '2-user memory, 120 readings',
        'Adult cuff 22–42 cm'
      ]
    },
    {
      id: 'glucose-kit',
      name: 'Blood Sugar Kit',
      tag: 'Popular',
      cat: 'vital',
      price: 1249,
      old: null,
      rating: 4.8,
      reviews: 98,
      desc: 'Track your blood sugar levels easily with a starter glucose monitoring kit.',
      features: [
        'Results in 5 seconds',
        'Tiny blood sample (0.5 µL)',
        'Includes 25 test strips',
        'Carry case included'
      ]
    },
    {
      id: 'oximeter',
      name: 'Pulse Oximeter',
      tag: 'Vital',
      cat: 'vital',
      price: 749,
      old: 899,
      rating: 4.7,
      reviews: 74,
      desc: 'Check your oxygen level and pulse in seconds — handy for asthma and flu season.',
      features: [
        'SpO₂ and pulse readings',
        'Clear OLED display',
        'Auto power-off',
        'Lanyard included'
      ]
    },
    {
      id: 'thermometer',
      name: 'Digital Thermometer',
      tag: 'Vital',
      cat: 'vital',
      price: 329,
      old: null,
      rating: 4.8,
      reviews: 210,
      desc: 'Fast, accurate temperature readings for the whole family, day or night.',
      features: [
        '10-second reading',
        'Fever alert tone',
        'Flexible tip',
        'Water-resistant body'
      ]
    },
    {
      id: 'nebulizer',
      name: 'Nebulizer Kit',
      tag: 'Save 15%',
      cat: 'promo',
      price: 2199,
      old: 2599,
      rating: 4.9,
      reviews: 63,
      desc: 'Quiet compressor nebulizer with adult and child masks for home breathing care.',
      features: [
        'Low-noise compressor',
        'Adult and child masks',
        'Medicine cup and tubing',
        '2-year warranty'
      ]
    },
    {
      id: 'weighing-scale',
      name: 'Digital Weighing Scale',
      tag: 'Best Seller',
      cat: 'best',
      price: 899,
      old: null,
      rating: 4.6,
      reviews: 151,
      desc: 'Track weight and BMI at home with a slim, easy-to-read digital scale.',
      features: [
        'Reads up to 180 kg',
        'BMI and weight memory',
        'Tempered glass platform',
        'Auto on and off'
      ]
    },
    {
      id: 'first-aid',
      name: 'Family First Aid Kit',
      tag: 'Best Seller',
      cat: 'best',
      price: 649,
      old: 799,
      rating: 4.7,
      reviews: 88,
      desc: 'A complete first aid kit for home, school, or the sari-sari store.',
      features: [
        '42 essential items',
        'Waterproof pouch',
        'Emergency guide',
        'Refillable compartments'
      ]
    },
    {
      id: 'glucose-strips',
      name: 'Glucose Test Strips (50s)',
      tag: 'Promo',
      cat: 'promo',
      price: 499,
      old: null,
      rating: 4.5,
      reviews: 47,
      desc: 'Replacement glucose test strips, sealed for accuracy and freshness.',
      features: [
        '50 strips per box',
        'Compatible with our meter',
        'Long expiry date',
        'Sealed foil packs'
      ]
    }
  ];

  const FEATURED = ['bp-monitor', 'glucose-kit', 'oximeter', 'weighing-scale'];

  const CATS = [
    { id: 'vital', icon: 'heart', key: 'cat.vital' },
    { id: 'promo', icon: 'diamond', key: 'cat.promos' },
    { id: 'best', icon: 'star', key: 'cat.best' },
    { id: 'all', icon: 'grid', key: 'cat.all' }
  ];

  const SERVICES = [
    {
      id: 'bp',
      icon: 'heart',
      free: true,
      name: { en: 'Blood Pressure Monitoring', fil: 'Pagsubaybay sa Presyon ng Dugo' },
      desc: {
        en: 'Walk-in BP checks and follow-ups for hypertension, with free readings and advice.',
        fil: 'Walk-in BP check at follow-up para sa hypertension, may libreng reading at payo.'
      },
      hours: { en: 'Mon–Sat · 8:00 AM–4:00 PM', fil: 'Lun–Sab · 8:00 AM–4:00 PM' }
    },
    {
      id: 'sugar',
      icon: 'spark',
      free: false,
      price: 50,
      name: { en: 'Blood Sugar Screening', fil: 'Screening ng Blood Sugar' },
      desc: {
        en: 'Fasting and random blood sugar tests for diabetes screening and monitoring.',
        fil: 'Fasting at random blood sugar test para sa screening at monitoring ng diabetes.'
      },
      hours: { en: 'Mon–Fri · 7:00 AM–10:00 AM', fil: 'Lun–Biy · 7:00 AM–10:00 AM' }
    },
    {
      id: 'prenatal',
      icon: 'user',
      free: true,
      name: { en: 'Prenatal Check-up', fil: 'Prenatal Check-up' },
      desc: {
        en: 'Monthly prenatal visits with our midwife, including weight and BP monitoring.',
        fil: 'Buwanang prenatal visit kasama ang midwife, may weight at BP monitoring.'
      },
      hours: { en: 'Tue & Thu · 9:00 AM–3:00 PM', fil: 'Mar & Huw · 9:00 AM–3:00 PM' }
    },
    {
      id: 'immunization',
      icon: 'shield',
      free: true,
      name: { en: 'Child Immunization', fil: 'Immunization ng Bata' },
      desc: {
        en: 'Routine vaccines for infants and children, tracked in the barangay health record.',
        fil: 'Rutinang bakuna para sa sanggol at bata, nakatala sa barangay health record.'
      },
      hours: { en: 'Wed · 8:00 AM–12:00 PM', fil: 'Miy · 8:00 AM–12:00 PM' }
    },
    {
      id: 'consult',
      icon: 'help',
      free: true,
      name: { en: 'Medical Consultation', fil: 'Konsultasyong Medikal' },
      desc: {
        en: 'General check-ups and prescriptions with the barangay physician.',
        fil: 'Pangkalahatang check-up at reseta kasama ang doktor ng barangay.'
      },
      hours: { en: 'Mon–Fri · 1:00 PM–4:00 PM', fil: 'Lun–Biy · 1:00 PM–4:00 PM' }
    },
    {
      id: 'certificate',
      icon: 'file',
      free: false,
      price: 100,
      name: { en: 'Health Certificate', fil: 'Health Certificate' },
      desc: {
        en: 'Health certificates for food handlers, employment, and school requirements.',
        fil: 'Health certificate para sa food handlers, trabaho, at school requirements.'
      },
      hours: { en: 'Mon–Fri · 8:00 AM–11:00 AM', fil: 'Lun–Biy · 8:00 AM–11:00 AM' }
    }
  ];

  const TIME_SLOTS = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
  ];

  const SLIDES = [
    {
      filter: 'vital',
      art: ['bp-monitor', 'glucose-kit', 'oximeter'],
      kicker: { en: 'Everyday health essentials', fil: 'Araw-araw na health essentials' },
      title: { en: 'Vital Kits', fil: 'Vital Kits' },
      sub: { en: 'for a Healthier Community', fil: 'para sa Malusog na Komunidad' },
      copy: {
        en: 'Essential monitoring tools for you and your family — delivered right to your barangay.',
        fil: 'Mahahalagang kagamitan sa pagmonitor ng kalusugan para sa iyo at sa pamilya — hatid sa inyong barangay.'
      },
      cta: { en: 'Shop Vital Kits', fil: 'Bumili ng Vital Kits' }
    },
    {
      filter: 'promo',
      art: ['nebulizer', 'thermometer', 'first-aid'],
      kicker: { en: 'Barangay promos', fil: 'Mga promo ng barangay' },
      title: { en: 'Save up to 15%', fil: 'Makatipid ng 15%' },
      sub: { en: 'on family health kits', fil: 'sa family health kits' },
      copy: {
        en: 'Limited-time barangay prices on nebulizers, thermometers, and first aid essentials.',
        fil: 'Limitadong presyo ng barangay sa nebulizer, thermometer, at first aid essentials.'
      },
      cta: { en: 'Shop Promos', fil: 'Tingnan ang Promos' }
    },
    {
      filter: 'best',
      art: ['weighing-scale', 'bp-monitor', 'glucose-kit'],
      kicker: { en: 'Loved by residents', fil: 'Gusto ng mga residente' },
      title: { en: 'Best Sellers', fil: 'Best Sellers' },
      sub: { en: 'trusted by 2,400+ families', fil: 'pinagkakatiwalaan ng 2,400+ pamilya' },
      copy: {
        en: 'The kits our barangay health workers recommend most — restocked every week.',
        fil: 'Ang mga kit na pinakairekomenda ng ating barangay health workers — nire-restock kada linggo.'
      },
      cta: { en: 'See Best Sellers', fil: 'Tingnan ang Best Sellers' }
    }
  ];

  /* ---------------- illustrations ---------------- */

  const ART = {
    'bp-monitor': `
      <ellipse cx="120" cy="177" rx="78" ry="9" fill="#0a2a63" opacity=".10"/>
      <g transform="rotate(-6 120 104)">
        <rect x="64" y="46" width="112" height="98" rx="18" fill="#ffffff" stroke="#cbd7e7" stroke-width="2"/>
        <rect x="78" y="58" width="84" height="52" rx="8" fill="#14233c"/>
        <text x="120" y="80" text-anchor="middle" font-family="Poppins, sans-serif" font-size="22" font-weight="700" fill="#79edc1">120</text>
        <text x="120" y="99" text-anchor="middle" font-family="Poppins, sans-serif" font-size="14" font-weight="600" fill="#8ea7c8">80</text>
        <text x="86" y="99" font-family="Poppins, sans-serif" font-size="7" fill="#8ea7c8">mmHg</text>
        <circle cx="87" cy="126" r="7" fill="#c8102e"/>
        <rect x="104" y="123" width="20" height="6" rx="3" fill="#dde7f4"/>
        <rect x="132" y="123" width="20" height="6" rx="3" fill="#dde7f4"/>
        <path d="M176 72c18 5 20 30 6 38" stroke="#123c7a" stroke-width="8" fill="none" stroke-linecap="round"/>
        <rect x="163" y="104" width="38" height="48" rx="9" fill="#eef3fa" stroke="#cbd7e7" stroke-width="2"/>
        <path d="M173 116h18M173 127h18M173 138h12" stroke="#c3d2e6" stroke-width="3" stroke-linecap="round"/>
      </g>`,
    'glucose-kit': `
      <ellipse cx="120" cy="177" rx="70" ry="9" fill="#0a2a63" opacity=".10"/>
      <g transform="rotate(8 120 108)">
        <rect x="92" y="44" width="58" height="116" rx="15" fill="#12203a"/>
        <rect x="100" y="56" width="42" height="42" rx="6" fill="#d8efe4"/>
        <text x="121" y="79" text-anchor="middle" font-family="Poppins, sans-serif" font-size="19" font-weight="700" fill="#0f3a2a">98</text>
        <text x="121" y="90" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="6" fill="#3d6b58">mg/dL</text>
        <circle cx="108" cy="112" r="5" fill="#c8102e"/>
        <rect x="118" y="109" width="20" height="5" rx="2.5" fill="#31445f"/>
        <rect x="131" y="30" width="14" height="18" rx="2" fill="#ffffff" stroke="#c8102e" stroke-width="3"/>
      </g>
      <g transform="rotate(-16 58 118)">
        <rect x="46" y="66" width="22" height="96" rx="11" fill="#eef3fa" stroke="#cbd7e7" stroke-width="2"/>
        <circle cx="57" cy="66" r="11" fill="#c8102e"/>
        <rect x="52" y="88" width="10" height="34" rx="5" fill="#c9d7e8"/>
        <rect x="52" y="132" width="10" height="20" rx="5" fill="#dce6f3"/>
      </g>`,
    oximeter: `
      <ellipse cx="120" cy="177" rx="76" ry="9" fill="#0a2a63" opacity=".10"/>
      <g transform="rotate(-8 120 108)">
        <rect x="52" y="74" width="136" height="66" rx="26" fill="#f6f9fd" stroke="#c8d5e6" stroke-width="2"/>
        <path d="M146 78h20a20 20 0 0 1 0 40h-20Z" fill="#dbe7f5" opacity=".8"/>
        <rect x="74" y="86" width="64" height="42" rx="9" fill="#14233c"/>
        <text x="98" y="108" text-anchor="middle" font-family="Poppins, sans-serif" font-size="19" font-weight="700" fill="#79edc1">98</text>
        <text x="111" y="108" font-family="Poppins, sans-serif" font-size="7" fill="#8ea7c8">%</text>
        <path d="M82 118h6l3-7 4 12 4-9 3 3h6" stroke="#79edc1" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="158" cy="106" r="4" fill="#c8102e"/>
        <circle cx="120" cy="140" r="3" fill="#c8d5e6"/>
      </g>`,
    thermometer: `
      <ellipse cx="120" cy="177" rx="58" ry="8" fill="#0a2a63" opacity=".10"/>
      <g transform="rotate(12 120 108)">
        <rect x="98" y="30" width="44" height="138" rx="22" fill="#ffffff" stroke="#c8d5e6" stroke-width="2"/>
        <rect x="106" y="44" width="28" height="46" rx="6" fill="#14233c"/>
        <text x="120" y="67" text-anchor="middle" font-family="Poppins, sans-serif" font-size="14" font-weight="700" fill="#79edc1">36.6</text>
        <text x="120" y="80" text-anchor="middle" font-family="Poppins, sans-serif" font-size="7" fill="#8ea7c8">°C</text>
        <circle cx="120" cy="108" r="7" fill="#dbe7f5"/>
        <rect x="117" y="118" width="6" height="22" rx="3" fill="#e6edf7"/>
        <path d="M98 146a22 22 0 0 0 44 0Z" fill="#c8102e"/>
      </g>`,
    nebulizer: `
      <ellipse cx="120" cy="177" rx="82" ry="9" fill="#0a2a63" opacity=".10"/>
      <rect x="46" y="76" width="104" height="92" rx="20" fill="#f8fbfe" stroke="#c8d5e6" stroke-width="2"/>
      <rect x="46" y="76" width="104" height="28" rx="14" fill="#dbe9fb"/>
      <circle cx="76" cy="122" r="14" fill="#eef4fb" stroke="#c8d5e6" stroke-width="2"/>
      <path d="M76 114v16M68 122h16" stroke="#c8102e" stroke-width="3" stroke-linecap="round"/>
      <rect x="102" y="110" width="36" height="10" rx="5" fill="#cfe0f3"/>
      <rect x="102" y="128" width="24" height="8" rx="4" fill="#e2ecf7"/>
      <rect x="102" y="144" width="34" height="8" rx="4" fill="#e2ecf7"/>
      <path d="M150 112c24 0 30 12 30 26" stroke="#c8d5e6" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M168 138c0-10 8-16 17-16s17 6 17 16c0 9-7 14-17 14s-17-5-17-14Z" fill="#dbe9fb" stroke="#b9cde4" stroke-width="2"/>
      <path d="M174 138h22" stroke="#b9cde4" stroke-width="2"/>`,
    'weighing-scale': `
      <ellipse cx="120" cy="177" rx="74" ry="9" fill="#0a2a63" opacity=".10"/>
      <rect x="58" y="56" width="124" height="116" rx="24" fill="#ffffff" stroke="#c8d5e6" stroke-width="2"/>
      <rect x="58" y="56" width="124" height="44" rx="22" fill="#e8f1fb"/>
      <rect x="88" y="68" width="64" height="26" rx="7" fill="#14233c"/>
      <text x="120" y="86" text-anchor="middle" font-family="Poppins, sans-serif" font-size="14" font-weight="700" fill="#79edc1">62.4</text>
      <circle cx="160" cy="81" r="4" fill="#c8102e"/>
      <ellipse cx="100" cy="138" rx="12" ry="19" fill="#dbe7f5"/>
      <ellipse cx="142" cy="136" rx="12" ry="19" fill="#dbe7f5"/>
      <circle cx="93" cy="118" r="4" fill="#dbe7f5"/><circle cx="101" cy="116" r="4" fill="#dbe7f5"/>
      <circle cx="135" cy="116" r="4" fill="#dbe7f5"/><circle cx="143" cy="118" r="4" fill="#dbe7f5"/>`,
    'first-aid': `
      <ellipse cx="120" cy="177" rx="76" ry="9" fill="#0a2a63" opacity=".10"/>
      <path d="M98 58h44v22" fill="none" stroke="#a70c26" stroke-width="8" stroke-linecap="round"/>
      <rect x="56" y="86" width="128" height="78" rx="16" fill="#cf1433"/>
      <rect x="56" y="86" width="128" height="26" rx="13" fill="#e0193c"/>
      <rect x="101" y="102" width="16" height="48" rx="3" fill="#ffffff"/>
      <rect x="85" y="118" width="48" height="16" rx="3" fill="#ffffff"/>
      <rect x="152" y="120" width="22" height="32" rx="5" fill="#ffffff" opacity=".18"/>
      <circle cx="70" cy="101" r="3" fill="#ffffff" opacity=".45"/>`,
    'glucose-strips': `
      <ellipse cx="120" cy="177" rx="66" ry="8" fill="#0a2a63" opacity=".10"/>
      <rect x="70" y="64" width="100" height="96" rx="12" fill="#ffffff" stroke="#c8d5e6" stroke-width="2"/>
      <rect x="70" y="64" width="100" height="32" rx="12" fill="#0a2a63"/>
      <text x="120" y="85" text-anchor="middle" font-family="Poppins, sans-serif" font-size="11" font-weight="600" fill="#ffffff">GLUCOSE</text>
      <rect x="86" y="106" width="68" height="12" rx="3" fill="#e8f1fb"/>
      <rect x="86" y="124" width="68" height="12" rx="3" fill="#e8f1fb"/>
      <rect x="86" y="142" width="42" height="8" rx="3" fill="#eef4fb"/>
      <rect x="136" y="52" width="12" height="26" rx="2" fill="#ffffff" stroke="#c8102e" stroke-width="2"/>`
  };

  const art = (id) =>
    `<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${ART[id] || ART['bp-monitor']}</svg>`;

  /* ---------------- state ---------------- */

  const LS_KEY = 'bayugo-konsulta:v1';

  function defaultState() {
    return {
      session: false,
      lang: 'en',
      user: { ...DEMO_USER },
      accounts: [],
      password: 'demo123',
      cart: {},
      orders: [],
      filter: 'all',
      search: '',
      appointments: [
        {
          id: 'apt_seed',
          service: 'Blood Pressure Monitoring',
          serviceId: 'bp',
          date: addDays(3),
          time: '9:30 AM',
          notes: 'Follow-up check for maintenance medicine.',
          status: 'Confirmed'
        }
      ],
      notifications: [
        {
          id: 'n1',
          icon: 'calendar',
          title: 'Appointment confirmed',
          body: 'Your BP monitoring visit is booked at the Barangay Health Center.',
          time: '2 hours ago',
          unread: true,
          page: 'appointments'
        },
        {
          id: 'n2',
          icon: 'tag',
          title: 'Barangay promo: save 15%',
          body: 'Nebulizer kits are on promo this week only.',
          time: 'Yesterday',
          unread: true,
          page: 'home'
        },
        {
          id: 'n3',
          icon: 'file',
          title: 'Your health record is ready',
          body: 'Download your complete PDF record from your profile.',
          time: '3 days ago',
          unread: false,
          page: 'profile'
        }
      ]
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      return {
        ...base,
        ...saved,
        user: { ...base.user, ...(saved.user || {}) },
        cart: saved.cart && typeof saved.cart === 'object' ? saved.cart : {},
        appointments: Array.isArray(saved.appointments) ? saved.appointments : base.appointments,
        notifications: Array.isArray(saved.notifications) ? saved.notifications : base.notifications,
        accounts: Array.isArray(saved.accounts) ? saved.accounts : []
      };
    } catch (err) {
      return base;
    }
  }

  let state = loadState();
  let heroIndex = 0;
  let quickQty = 1;
  let quickViewId = null;
  let lastDelivery = 0;
  let confirmResolver = null;
  const modalStack = [];

  const save = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (err) {
      /* storage may be unavailable — app still works for this session */
    }
  };

  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
  const L = (obj) => (obj ? obj[state.lang] || obj.en : '');
  const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
  const starRow = (rating) => {
    const full = Math.round(rating);
    return `<span class="stars">${Array.from({ length: 5 }, (_, i) =>
      `<svg class="icon" style="opacity:${i < full ? 1 : 0.25}"><use href="#i-star"/></svg>`).join('')}</span>`;
  };

  /* ---------------- rendering ---------------- */

  function renderHero() {
    const s = SLIDES[heroIndex];
    $('#heroCard').innerHTML = `
      <div class="hero__grid">
        <div class="hero__copy">
          <span class="hero__eyebrow"><svg class="icon"><use href="#i-heart"/></svg>${esc(L(s.kicker))}</span>
          <h2 class="hero__title"><strong>${esc(L(s.title))}</strong><span>${esc(L(s.sub))}</span></h2>
          <p class="hero__lead">${esc(L(s.copy))}</p>
          <div class="hero__actions">
            <button type="button" class="btn btn--red" data-hero-cta="${s.filter}">
              ${esc(L(s.cta))}
              <svg class="icon"><use href="#i-arrow-right"/></svg>
            </button>
          </div>
          <div class="hero__trust">
            ${starRow(4.9)}
            <span>4.9 · ${esc(t('home.trusted'))}</span>
          </div>
        </div>
        <div class="hero__art" aria-hidden="true">
          <div class="hero__glow"></div>
          <div class="hero__device hero__device--main">${art(s.art[0])}</div>
          <div class="hero__device hero__device--a">${art(s.art[1])}</div>
          <div class="hero__device hero__device--b">${art(s.art[2])}</div>
        </div>
      </div>
      <div class="hero__dots">
        ${SLIDES.map((_, i) => `
          <button type="button" class="hero__dot ${i === heroIndex ? 'is-active' : ''}"
            data-slide="${i}" aria-label="Slide ${i + 1}" aria-current="${i === heroIndex}"></button>`).join('')}
      </div>`;
  }

  function renderCats() {
    $('#catGrid').innerHTML = CATS.map((c) => `
      <button type="button" class="cat ${state.filter === c.id ? 'is-active' : ''}"
        data-filter="${c.id}" aria-pressed="${state.filter === c.id}">
        <span class="cat__icon"><svg class="icon icon--fill"><use href="#i-${c.icon}"/></svg></span>
        <span class="cat__label">${esc(t(c.key))}</span>
      </button>`).join('');
  }

  function productCard(p) {
    if (!p) return '';
    return `
      <article class="product">
        <button type="button" class="product__media" data-view="${p.id}" aria-label="${esc(t('home.add'))} — ${esc(p.name)}">
          ${p.tag ? `<span class="product__tag ${p.old && p.old > p.price ? 'product__tag--sale' : ''}">${esc(p.tag)}</span>` : ''}
          <span class="product__art">${art(p.id)}</span>
        </button>
        <div class="product__body">
          <h3 class="product__name">${esc(p.name)}</h3>
          <p class="product__desc">${esc(p.desc)}</p>
          <div class="product__rating"><svg class="icon"><use href="#i-star"/></svg> ${p.rating} <span>· ${p.reviews} ${esc(t('home.reviews'))}</span></div>
          <div class="product__foot">
            <div class="product__prices">
              <span class="product__price">${peso(p.price)}</span>
              ${p.old && p.old > p.price ? `<span class="product__old">${peso(p.old)}</span>` : ''}
            </div>
            <button type="button" class="add-btn" data-add="${p.id}" aria-label="${esc(t('home.add'))}: ${esc(p.name)}">
              <svg class="icon"><use href="#i-cart"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderFeatured() {
    $('#featuredGrid').innerHTML = FEATURED.map((id) => productCard(getProduct(id))).join('');
  }

  function filteredProducts() {
    const q = state.search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const inCat = state.filter === 'all' || p.cat === state.filter;
      const haystack = `${p.name} ${p.desc} ${p.tag}`.toLowerCase();
      return inCat && (!q || haystack.includes(q));
    });
  }

  function renderCatalog() {
    const chips = [{ id: 'all', key: 'cat.all' }, ...CATS.filter((c) => c.id !== 'all')];
    $('#filterChips').innerHTML = chips.map((c) => `
      <button type="button" class="chip ${state.filter === c.id ? 'is-active' : ''}"
        data-filter="${c.id}" role="tab" aria-selected="${state.filter === c.id}">${esc(t(c.key))}</button>`).join('');

    const q = state.search.trim();
    const items = filteredProducts();
    const catLabel = { all: t('cat.all'), vital: t('cat.vital'), promo: t('cat.promos'), best: t('cat.best') }[state.filter];

    $('#catalogTitle').textContent = q
      ? `${t('home.resultsFor')} “${q}”`
      : state.filter === 'all' ? t('home.catalog') : catLabel;

    $('#catalogSub').textContent = `${items.length} ${items.length === 1 ? t('home.product') : t('home.products')} · ${t('home.catalogSub')}`;

    $('#productGrid').innerHTML = items.map(productCard).join('');
    $('#productGrid').hidden = items.length === 0;
    $('#emptyState').hidden = items.length > 0;
    renderCats();
  }

  function greetingText() {
    const h = new Date().getHours();
    return t(h < 12 ? 'greet.morning' : h < 18 ? 'greet.afternoon' : 'greet.evening');
  }

  function renderProfile() {
    const u = state.user;
    const initials = initialsOf(u.name);
    $('#headerInitials').textContent = initials;
    $('#profileInitials').textContent = initials;
    $('#profileName').textContent = u.name;
    $('#profileGreetName').textContent = u.name;
    $('#greetingText').textContent = `${greetingText()},`;
    $('#profilePatientNo').textContent = u.patientNo || '—';
    $('#profileEmail').textContent = u.email || '—';
    $('#profilePhone').textContent = u.phone || '—';
    $('#profileAddress').textContent = u.address || '—';
    $('#languageValue').textContent = state.lang === 'fil' ? 'Filipino' : 'English';
  }

  function renderBookingSelects() {
    const serviceSel = $('#apptService');
    const prev = serviceSel.value;
    serviceSel.innerHTML = `<option value="">${esc(t('appt.select'))}</option>` +
      SERVICES.map((s) => `<option value="${s.id}">${esc(L(s.name))}</option>`).join('');
    if (prev) serviceSel.value = prev;

    const timeSel = $('#apptTime');
    const prevTime = timeSel.value;
    timeSel.innerHTML = `<option value="">—</option>` +
      TIME_SLOTS.map((tm) => `<option value="${tm}">${tm}</option>`).join('');
    if (prevTime) timeSel.value = prevTime;
    else timeSel.value = '9:30 AM';

    const dateInput = $('#apptDate');
    dateInput.min = todayISO();
    if (!dateInput.value) dateInput.value = addDays(2);
  }

  function renderAppointments() {
    const sorted = [...state.appointments].sort((a, b) => {
      const aCancelled = a.status === 'Cancelled' ? 1 : 0;
      const bCancelled = b.status === 'Cancelled' ? 1 : 0;
      if (aCancelled !== bCancelled) return aCancelled - bCancelled;
      return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    });

    $('#apptCount').textContent = sorted.filter((a) => a.status !== 'Cancelled').length;
    $('#apptEmpty').hidden = sorted.length > 0;
    $('#apptList').hidden = sorted.length === 0;

    $('#apptList').innerHTML = sorted.map((a) => {
      const dt = new Date(`${a.date}T00:00:00`);
      const valid = !Number.isNaN(dt.getTime());
      const locale = state.lang === 'fil' ? 'fil-PH' : 'en-PH';
      const day = valid ? dt.getDate() : '—';
      const month = valid ? dt.toLocaleDateString(locale, { month: 'short' }) : '—';
      const weekday = valid ? dt.toLocaleDateString(locale, { weekday: 'short' }) : '—';
      const cancelled = a.status === 'Cancelled';
      const svc = SERVICES.find((s) => s.id === a.serviceId);
      const serviceName = svc ? L(svc.name) : a.service;
      return `
        <article class="appt-card">
          <div class="appt-date"><b>${day}</b><span>${month}</span><small>${weekday}</small></div>
          <div class="appt-main">
            <h3>${esc(serviceName)}</h3>
            <div class="appt-meta">
              <span><svg class="icon"><use href="#i-clock"/></svg> ${esc(a.time)}</span>
              <span><svg class="icon"><use href="#i-pin"/></svg> Barangay Health Center</span>
            </div>
            ${a.notes ? `<p class="appt-note">“${esc(a.notes)}”</p>` : ''}
            <div class="appt-foot">
              <span class="status ${cancelled ? 'status--cancelled' : ''}">${esc(t(cancelled ? 'appt.cancelled' : 'appt.confirmed'))}</span>
              ${cancelled ? '' : `<button type="button" class="appt-cancel" data-cancel-appt="${a.id}">${esc(t('appt.cancel'))}</button>`}
            </div>
          </div>
        </article>`;
    }).join('');
  }

  function renderServices() {
    $('#serviceGrid').innerHTML = SERVICES.map((s) => `
      <article class="service-card">
        <span class="service-card__icon"><svg class="icon"><use href="#i-${s.icon}"/></svg></span>
        <h3>${esc(L(s.name))}</h3>
        <p>${esc(L(s.desc))}</p>
        <div class="service-card__meta">
          <span class="pill"><svg class="icon"><use href="#i-clock"/></svg> ${esc(L(s.hours))}</span>
          <span class="pill ${s.free ? 'pill--free' : ''}">${s.free ? esc(t('services.free')) : peso(s.price)}</span>
        </div>
        <button type="button" class="btn btn--ghost btn--sm" data-book-service="${s.id}">${esc(t('services.book'))}</button>
      </article>`).join('');
  }

  function cartEntries() {
    return Object.entries(state.cart)
      .map(([id, qty]) => {
        const p = getProduct(id);
        return p ? { ...p, qty } : null;
      })
      .filter(Boolean);
  }

  const cartCount = () => Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
  const cartSubtotal = () => cartEntries().reduce((sum, it) => sum + it.price * it.qty, 0);

  function renderCart() {
    const items = cartEntries();
    const count = cartCount();
    const subtotal = cartSubtotal();
    const delivery = count === 0 || subtotal >= 1500 ? 0 : 79;
    lastDelivery = delivery;

    $('#cartCount').textContent = count;
    $('#cartCount').classList.toggle('has-items', count > 0);
    $('#cartSummary').textContent = count === 0
      ? t('cart.emptySub')
      : `${count} ${count === 1 ? t('cart.item') : t('cart.items')}`;

    $('#cartItems').innerHTML = items.map((it) => `
      <div class="cart-item">
        <div class="cart-item__media">${art(it.id)}</div>
        <div class="cart-item__main">
          <p class="cart-item__name">${esc(it.name)}</p>
          <p class="cart-item__price">${peso(it.price)}</p>
          <div class="cart-item__row">
            <div class="qty">
              <button type="button" data-cart-minus="${it.id}" aria-label="Decrease quantity"><svg class="icon"><use href="#i-minus"/></svg></button>
              <span>${it.qty}</span>
              <button type="button" data-cart-plus="${it.id}" aria-label="Increase quantity"><svg class="icon"><use href="#i-plus"/></svg></button>
            </div>
            <button type="button" class="cart-remove" data-cart-remove="${it.id}" aria-label="Remove ${esc(it.name)}">
              <svg class="icon"><use href="#i-trash"/></svg>
            </button>
          </div>
        </div>
      </div>`).join('');

    $('#cartEmpty').hidden = items.length > 0;
    $('#cartItems').hidden = items.length === 0;
    $('#cartFoot').hidden = items.length === 0;

    $('#cartSubtotal').textContent = peso(subtotal);
    $('#cartDelivery').textContent = delivery === 0 ? t('cart.free') : peso(delivery);
    $('#cartTotal').textContent = peso(subtotal + delivery);
  }

  function renderNotif() {
    const unread = state.notifications.some((n) => n.unread);
    $('#notifDot').hidden = !unread;
    $('#notifList').innerHTML = state.notifications.map((n) => `
      <button type="button" class="notif-item ${n.unread ? 'is-unread' : ''}" data-notif="${n.id}">
        <span class="notif-item__icon"><svg class="icon"><use href="#i-${n.icon}"/></svg></span>
        <span class="notif-item__body">
          <strong>${esc(n.title)}</strong>
          <p>${esc(n.body)}</p>
          <small>${esc(n.time)}</small>
        </span>
      </button>`).join('');
  }

  function renderAll() {
    renderHero();
    renderCats();
    renderFeatured();
    renderCatalog();
    renderProfile();
    renderBookingSelects();
    renderAppointments();
    renderServices();
    renderCart();
    renderNotif();
  }

  function applyI18n() {
    document.documentElement.lang = state.lang === 'fil' ? 'fil' : 'en';
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    renderAll();
  }

  /* ---------------- shell, nav, overlays ---------------- */

  function syncLock() {
    const locked = modalStack.length > 0 || $('#cartDrawer').classList.contains('is-open');
    document.body.classList.toggle('no-scroll', locked);
  }

  function go(page, opts = {}) {
    const valid = ['home', 'appointments', 'services', 'profile'];
    if (!valid.includes(page)) page = 'home';
    $$('.page').forEach((p) => p.classList.toggle('is-active', p.dataset.page === page));
    $$('.topnav__link, .tabbar__item').forEach((b) => b.classList.toggle('is-active', b.dataset.page === page));
    if (opts.push !== false) {
      try { history.replaceState(null, '', `#/${page}`); } catch (err) { /* ignore */ }
    }
    window.scrollTo({ top: 0, behavior: opts.smooth ? 'smooth' : 'auto' });
  }

  function showApp() {
    $('#authScreen').hidden = true;
    $('#app').hidden = false;
    renderAll();
    const hashPage = (location.hash || '').replace(/^#\/?/, '');
    go(['home', 'appointments', 'services', 'profile'].includes(hashPage) ? hashPage : 'home', { push: false });
    startHeroAuto();
  }

  function showAuth() {
    stopHeroAuto();
    $('#app').hidden = true;
    $('#authScreen').hidden = false;
    closeCart({ instant: true });
    closeNotif();
    closeAllModals();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (err) { /* ignore */ }
    $('#loginError').textContent = '';
  }

  function signIn(user, opts = {}) {
    state.user = { ...DEMO_USER, ...user };
    state.session = true;
    save();
    $('#loginPass').value = '';
    showApp();
    if (!opts.silent) toast(`${t('toast.welcomeBack')}, ${String(state.user.name).split(' ')[0]}!`);
  }

  /* ---------------- cart drawer ---------------- */

  let cartCloseTimer = null;

  function openCart() {
    closeNotif();
    renderCart();
    clearTimeout(cartCloseTimer);
    $('#scrim').hidden = false;
    requestAnimationFrame(() => {
      $('#scrim').classList.add('is-open');
      $('#cartDrawer').classList.add('is-open');
      $('#cartDrawer').setAttribute('aria-hidden', 'false');
    });
    syncLock();
    setTimeout(() => {
      const btn = $('#cartDrawer .drawer-close');
      if (btn) btn.focus({ preventScroll: true });
    }, 90);
  }

  function closeCart(opts = {}) {
    const drawer = $('#cartDrawer');
    if (!drawer.classList.contains('is-open')) {
      $('#scrim').hidden = true;
      return;
    }
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    $('#scrim').classList.remove('is-open');
    syncLock();
    if (opts.instant) {
      $('#scrim').hidden = true;
      return;
    }
    clearTimeout(cartCloseTimer);
    cartCloseTimer = setTimeout(() => {
      if (!drawer.classList.contains('is-open')) $('#scrim').hidden = true;
    }, 340);
  }

  /* ---------------- notifications ---------------- */

  function openNotif() {
    renderNotif();
    $('#notifPanel').hidden = false;
  }

  function closeNotif() {
    $('#notifPanel').hidden = true;
  }

  /* ---------------- modals ---------------- */

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    if (!modalStack.includes(id)) modalStack.push(id);
    syncLock();
    setTimeout(() => {
      const target = modal.querySelector('input:not([type="radio"]), select, textarea, button[type="submit"]') ||
        modal.querySelector('button');
      if (target) target.focus({ preventScroll: true });
    }, 80);
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    const idx = modalStack.indexOf(id);
    if (idx > -1) modalStack.splice(idx, 1);
    syncLock();
    if (id === 'confirmModal' && confirmResolver) {
      const resolve = confirmResolver;
      confirmResolver = null;
      resolve(false);
    }
  }

  function closeAllModals() {
    [...modalStack].forEach((id) => closeModal(id));
  }

  function askConfirm({ title, message, ok, danger = false }) {
    return new Promise((resolve) => {
      confirmResolver = resolve;
      $('#confirmTitle').textContent = title;
      $('#confirmMsg').textContent = message;
      $('#confirmOk').textContent = ok || t('common.confirm');
      $('#confirmOk').className = `btn ${danger ? 'btn--red' : 'btn--navy'}`;
      $('#confirmCancel').textContent = t('common.cancel');
      openModal('confirmModal');
    });
  }

  /* ---------------- toasts ---------------- */

  function toast(message, type = 'success') {
    const host = $('#toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = `toast${type === 'error' ? ' toast--error' : ''}`;
    el.innerHTML = `<svg class="icon"><use href="#i-${type === 'error' ? 'info' : 'check'}"/></svg><span>${esc(message)}</span>`;
    host.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 240);
    }, 2800);
  }

  /* ---------------- cart actions ---------------- */

  function addToCart(id, qty = 1, opts = {}) {
    const product = getProduct(id);
    if (!product) return;
    state.cart[id] = (state.cart[id] || 0) + qty;
    save();
    renderCart();
    const badge = $('#cartCount');
    badge.classList.remove('is-bumped');
    void badge.offsetWidth;
    badge.classList.add('is-bumped');
    if (!opts.silent) toast(`${product.name} ${t('toast.added')}`);
  }

  function setCartQty(id, qty) {
    if (!getProduct(id)) return;
    if (qty <= 0) {
      delete state.cart[id];
      toast(t('toast.removed'));
    } else {
      state.cart[id] = Math.min(qty, 99);
    }
    save();
    renderCart();
  }

  function openCheckout() {
    if (!cartCount()) {
      toast(t('toast.emptyCart'), 'error');
      return;
    }
    const subtotal = cartSubtotal();
    const delivery = subtotal >= 1500 ? 0 : 79;
    lastDelivery = delivery;
    $('#checkoutSummary').innerHTML = `
      <div class="checkout-summary__row"><span>${esc(t('cart.subtotal'))} (${cartCount()})</span><b>${peso(subtotal)}</b></div>
      <div class="checkout-summary__row"><span>${esc(t('cart.delivery'))}</span><b>${delivery === 0 ? esc(t('cart.free')) : peso(delivery)}</b></div>
      <div class="checkout-summary__total"><span>${esc(t('cart.total'))}</span><span>${peso(subtotal + delivery)}</span></div>`;
    $('#checkoutTotal').textContent = peso(subtotal + delivery);
    $('#checkoutAddress').value = state.user.address || '';
    $('#checkoutPhone').value = state.user.phone || '';
    $('#checkoutError').textContent = '';
    closeCart();
    openModal('checkoutModal');
  }

  function pushNotification({ icon = 'bell', title, body, page = 'home' }) {
    state.notifications.unshift({
      id: uid('n'),
      icon,
      title,
      body,
      time: 'Just now',
      unread: true,
      page
    });
    save();
    renderNotif();
  }

  /* ---------------- quick view ---------------- */

  function openQuickView(id) {
    const p = getProduct(id);
    if (!p) return;
    quickViewId = id;
    quickQty = 1;
    $('#quickViewBody').innerHTML = `
      <div class="qv">
        <div class="qv__media">
          <span class="qv__media-tag">${esc(p.tag || t('cat.vital'))}</span>
          ${art(p.id)}
        </div>
        <div class="qv__body">
          <div class="qv__rating">
            ${starRow(p.rating)} <b>${p.rating}</b> <span>(${p.reviews} ${esc(t('home.reviews'))})</span>
          </div>
          <h2 class="qv__title" id="quickViewTitle">${esc(p.name)}</h2>
          <div class="qv__price-row">
            <span class="qv__price">${peso(p.price)}</span>
            ${p.old && p.old > p.price
              ? `<span class="qv__old">${peso(p.old)}</span><span class="qv__save">${esc(t('home.save'))} ${peso(p.old - p.price)}</span>`
              : ''}
          </div>
          <p class="qv__desc">${esc(p.desc)}</p>
          <ul class="qv__features">
            ${p.features.map((f) => `<li><svg class="icon"><use href="#i-check"/></svg>${esc(f)}</li>`).join('')}
          </ul>
          <div class="qv__qty">
            <span>${esc(t('common.qty'))}</span>
            <div class="qty">
              <button type="button" data-qv-minus aria-label="Decrease quantity"><svg class="icon"><use href="#i-minus"/></svg></button>
              <span id="qvQty">1</span>
              <button type="button" data-qv-plus aria-label="Increase quantity"><svg class="icon"><use href="#i-plus"/></svg></button>
            </div>
          </div>
          <div class="qv__actions">
            <button type="button" class="btn btn--ghost" data-qv-add="${p.id}">${esc(t('home.add'))}</button>
            <button type="button" class="btn btn--red" data-qv-buy="${p.id}">${esc(t('home.buyNow'))}</button>
          </div>
          <span class="qv__stock"><svg class="icon"><use href="#i-check"/></svg> ${esc(t('home.inStock'))}</span>
        </div>
      </div>`;
    openModal('quickViewModal');
  }

  /* ---------------- filters & search ---------------- */

  function applyFilter(filter) {
    state.filter = filter || 'all';
    state.search = '';
    $('#searchInput').value = '';
    $('#searchClear').hidden = true;
    if (!$('#page-home').classList.contains('is-active')) go('home', { push: false });
    renderCatalog();
    setTimeout(() => {
      const section = $('#catalogSection');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  }

  function resetCatalog() {
    state.filter = 'all';
    state.search = '';
    $('#searchInput').value = '';
    $('#searchClear').hidden = true;
    if (!$('#page-home').classList.contains('is-active')) go('home', { push: false });
    renderCatalog();
  }

  /* ---------------- hero carousel ---------------- */

  let heroTimer = null;

  function startHeroAuto() {
    stopHeroAuto();
    heroTimer = setInterval(() => {
      if (document.hidden) return;
      heroIndex = (heroIndex + 1) % SLIDES.length;
      renderHero();
    }, 7000);
  }

  function stopHeroAuto() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = null;
  }

  /* ---------------- health record PDF ---------------- */

  function pdfSafe(value) {
    return String(value == null ? '' : value)
      .replace(/₱/g, 'PHP ')
      .replace(/[–—]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/…/g, '...')
      .replace(/·/g, '-')
      .replace(/[^\x20-\x7E\n]/g, '');
  }

  function pdfEscape(value) {
    return pdfSafe(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  function pdfWrap(value, maxChars) {
    const words = pdfSafe(value).replace(/\s+/g, ' ').trim().split(' ');
    const lines = [];
    let line = '';
    words.forEach((word) => {
      if (!word) return;
      const next = line ? `${line} ${word}` : word;
      if (next.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function pdfTruncate(value, maxChars) {
    const text = pdfSafe(value);
    return text.length > maxChars ? `${text.slice(0, Math.max(0, maxChars - 3))}...` : text;
  }

  function buildHealthRecordPdf() {
    const W = 595.28;
    const H = 841.89;
    const NAVY = '0.039 0.165 0.388';
    const RED = '0.784 0.063 0.180';
    const INK = '0.043 0.102 0.173';
    const BODY = '0.251 0.318 0.416';
    const MUTED = '0.424 0.490 0.576';
    const LINE = '0.890 0.922 0.965';
    const LIGHT = '0.949 0.973 0.992';
    const WHITE = '1 1 1';
    const GREEN = '0.078 0.588 0.435';
    const cmds = [];
    const n = (value) => Number(value).toFixed(2);
    const put = (value) => cmds.push(value);

    const fillRect = (x, y, w, h, color) => {
      put(`${color} rg ${n(x)} ${n(y)} ${n(w)} ${n(h)} re f`);
    };
    const strokeLine = (x1, y1, x2, y2, color, width = 1) => {
      put(`${color} RG ${n(width)} w ${n(x1)} ${n(y1)} m ${n(x2)} ${n(y2)} l S`);
    };
    const txt = (x, y, size, bold, value, color = INK) => {
      put(`BT ${color} rg /${bold ? 'F2' : 'F1'} ${n(size)} Tf 1 0 0 1 ${n(x)} ${n(y)} Tm (${pdfEscape(value)}) Tj ET`);
    };
    const circle = (cx, cy, r, color) => {
      const k = 0.5522847498;
      const o = r * k;
      put(`${color} rg
${n(cx + r)} ${n(cy)} m
${n(cx + r)} ${n(cy + o)} ${n(cx + o)} ${n(cy + r)} ${n(cx)} ${n(cy + r)} c
${n(cx - o)} ${n(cy + r)} ${n(cx - r)} ${n(cy + o)} ${n(cx - r)} ${n(cy)} c
${n(cx - r)} ${n(cy - o)} ${n(cx - o)} ${n(cy - r)} ${n(cx)} ${n(cy - r)} c
${n(cx + o)} ${n(cy - r)} ${n(cx + r)} ${n(cy - o)} ${n(cx + r)} ${n(cy)} c f`);
    };
    const sectionTitle = (title, y) => {
      fillRect(48, y - 3, 3, 16, RED);
      txt(58, y + 1, 11.5, true, title, NAVY);
    };

    const u = state.user || {};
    const now = new Date();
    const generated = now.toLocaleString('en-PH', {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });

    /* header */
    fillRect(0, H - 96, W, 96, NAVY);
    fillRect(0, H - 100, W, 4, RED);
    circle(64, H - 48, 26, WHITE);
    circle(64, H - 48, 20, NAVY);
    fillRect(61.5, H - 54, 5, 12, RED);
    fillRect(58, H - 50.5, 12, 5, RED);
    txt(104, H - 34, 20, true, 'BayuGO-Konsulta', WHITE);
    txt(104, H - 51, 9, false, 'Barangay Bayugo Health Center', '0.78 0.85 0.94');
    txt(104, H - 65, 7.5, false, 'Pag-asa St., Barangay Bayugo, Bulacan  |  0917 555 0142  |  health@bayugo.ph', '0.78 0.85 0.94');
    txt(430, H - 34, 10, true, 'HEALTH RECORD', WHITE);
    txt(430, H - 49, 7.5, false, 'Confidential', '0.78 0.85 0.94');

    txt(48, 716, 15, true, 'Patient Health Record', INK);
    txt(48, 700, 8.5, false, `Generated ${generated}`, MUTED);

    /* patient details */
    sectionTitle('Patient Information', 682);
    fillRect(48, 580, 499, 88, LIGHT);
    txt(64, 648, 13, true, u.name || 'Patient', INK);
    txt(64, 632, 8.8, false, `Email: ${u.email || 'Not provided'}`, BODY);
    txt(64, 618, 8.8, false, `Mobile: ${u.phone || 'Not provided'}`, BODY);
    const addressLines = pdfWrap(`Address: ${u.address || 'Not provided'}`, 74).slice(0, 2);
    addressLines.forEach((line, i) => txt(64, 604 - i * 11, 8.8, false, line, BODY));
    txt(340, 632, 8.8, false, `Patient No.: ${u.patientNo || '—'}`, BODY);
    txt(340, 618, 8.8, false, `Birthday: ${u.birthday || 'Not provided'}`, BODY);
    txt(340, 604, 8.8, false, `Blood type: ${u.blood || 'Not provided'}`, BODY);

    /* vitals */
    sectionTitle('Latest Recorded Vitals', 560);
    const vitals = [
      ['Blood pressure', '120/80 mmHg'],
      ['Heart rate', '72 bpm'],
      ['Oxygen level', '98% SpO2'],
      ['Weight', '58 kg']
    ];
    vitals.forEach((item, i) => {
      const x = 48 + i * 125;
      fillRect(x, 500, 116, 50, i % 2 === 0 ? LIGHT : WHITE);
      txt(x + 10, 529, 10.5, true, item[1], NAVY);
      txt(x + 10, 513, 7.5, false, item[0], MUTED);
    });

    /* appointments */
    sectionTitle('Upcoming Appointments', 478);
    const appts = [...state.appointments]
      .sort((a, b) => {
        const ac = a.status === 'Cancelled' ? 1 : 0;
        const bc = b.status === 'Cancelled' ? 1 : 0;
        if (ac !== bc) return ac - bc;
        return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
      })
      .slice(0, 4);

    if (!appts.length) {
      txt(60, 448, 9, false, 'No appointments on file. Book a visit at the health center anytime.', BODY);
    } else {
      appts.forEach((appt, i) => {
        const y = 452 - i * 30;
        fillRect(48, y - 8, 499, 28, i % 2 === 0 ? LIGHT : WHITE);
        const svc = SERVICES.find((s) => s.id === appt.serviceId);
        const serviceName = svc ? L(svc.name) : appt.service;
        txt(60, y + 5, 8.8, true, pdfTruncate(serviceName, 38), INK);
        txt(300, y + 5, 8, false, `${appt.date}  |  ${appt.time}`, BODY);
        txt(470, y + 5, 7.5, true, appt.status || 'Confirmed', appt.status === 'Cancelled' ? MUTED : GREEN);
      });
    }

    /* notes */
    const notesTitle = 452 - appts.length * 30 - 8;
    sectionTitle('Notes', notesTitle);
    const notes = [
      'This record summarizes your registered profile and barangay health center appointments.',
      'For questions or corrections, contact the Barangay Bayugo Health Center at 0917 555 0142.',
      'For emergencies, call 911 or go to the nearest hospital.'
    ];
    notes.forEach((note, i) => {
      txt(58, notesTitle - 20 - i * 12, 8.5, false, note, BODY);
    });

    /* contact strip */
    const infoTop = notesTitle - 68;
    fillRect(48, infoTop - 30, 499, 30, LIGHT);
    txt(60, infoTop - 19, 8.5, false, 'Barangay Bayugo Health Center  |  Mon-Sat 8:00 AM - 5:00 PM  |  0917 555 0142', BODY);

    /* footer */
    strokeLine(48, 60, 547, 60, LINE, 1);
    txt(48, 44, 7.5, false, 'Generated by BayuGO-Konsulta. This document is for personal health monitoring only.', MUTED);
    txt(48, 32, 7.5, false, 'For emergencies, call 911 or go to the nearest hospital.', MUTED);
    txt(510, 44, 7.5, false, 'Page 1 of 1', MUTED);

    const content = cmds.join('\n');
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((obj, i) => {
      offsets.push(pdf.length);
      pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i += 1) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return pdf;
  }

  function downloadHealthRecord() {
    const btn = $('#downloadBtn');
    if (!btn) return;
    const label = btn.querySelector('strong');
    const oldLabel = label ? label.textContent : '';
    const patientNo = String(state.user.patientNo || 'record').replace(/[^a-z0-9]+/gi, '-');
    try {
      btn.disabled = true;
      if (label) label.textContent = t('profile.preparing');
      const blob = new Blob([buildHealthRecordPdf()], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BayuGO-Health-Record-${patientNo}.pdf`;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast(t('toast.pdfReady'));
    } catch (err) {
      console.error('Health record PDF failed', err);
      toast(t('toast.pdfError'), 'error');
    } finally {
      setTimeout(() => {
        if (label) label.textContent = oldLabel || t('profile.download');
        btn.disabled = false;
      }, 900);
    }
  }

  /* ---------------- form helpers ---------------- */

  function setError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message || '';
  }

  function accountForCurrentUser() {
    const email = String(state.user.email || '').toLowerCase();
    return state.accounts.find((account) =>
      account.patientNo === state.user.patientNo ||
      (account.email && email && account.email.toLowerCase() === email)
    );
  }

  function openRegister() {
    const form = $('#registerForm');
    if (form) form.reset();
    setError('regError', '');
    openModal('registerModal');
  }

  function openForgot() {
    $('#forgotForm').hidden = false;
    $('#forgotSuccess').hidden = true;
    $('#forgotEmail').value = $('#loginUser').value.includes('@') ? $('#loginUser').value.trim() : '';
    setError('forgotError', '');
    openModal('forgotModal');
  }

  function openEdit() {
    const u = state.user;
    $('#editName').value = u.name || '';
    $('#editEmail').value = u.email || '';
    $('#editPhone').value = u.phone || '';
    $('#editBirthday').value = u.birthday || '';
    $('#editBlood').value = u.blood || '';
    $('#editAddress').value = u.address || '';
    setError('editError', '');
    openModal('editModal');
  }

  function openSecurity() {
    $('#securityForm').reset();
    $('#secStrengthBar').style.width = '0%';
    $('#secStrengthBar').style.background = 'var(--red)';
    $('#secStrengthText').textContent = t('security.hint');
    setError('secError', '');
    openModal('securityModal');
  }

  function openLanguage() {
    const current = document.querySelector(`input[name="lang"][value="${state.lang}"]`);
    if (current) current.checked = true;
    openModal('languageModal');
  }

  function openHelp() {
    $$('.faq__a', $('#helpModal')).forEach((answer) => { answer.hidden = true; });
    $$('.faq__q', $('#helpModal')).forEach((button) => button.setAttribute('aria-expanded', 'false'));
    openModal('helpModal');
  }

  /* ---------------- form handlers ---------------- */

  function handleLogin(event) {
    event.preventDefault();
    const user = $('#loginUser').value.trim();
    const password = $('#loginPass').value;
    setError('loginError', '');

    if (!user || !password) {
      setError('loginError', t('toast.loginRequired'));
      (!user ? $('#loginUser') : $('#loginPass')).focus();
      return;
    }

    const key = user.toLowerCase();
    const account = state.accounts.find((item) =>
      item.email.toLowerCase() === key || item.name.toLowerCase() === key
    );

    if (account) {
      if (account.password !== password) {
        setError('loginError', t('toast.wrongPass'));
        $('#loginPass').select();
        return;
      }
      const { password: _password, ...profile } = account;
      signIn(profile);
      return;
    }

    const demoKeys = ['demo', 'demo123', 'katherine', 'katherine.salvacion@email.com', 'katherine c. salvacion'];
    if (demoKeys.includes(key)) {
      const currentPassword = state.password || 'demo123';
      if (password === currentPassword || password === 'demo123') {
        signIn(DEMO_USER);
        return;
      }
      setError('loginError', t('toast.wrongPass'));
      $('#loginPass').select();
      return;
    }

    setError('loginError', t('toast.loginFail'));
  }

  function handleRegister(event) {
    event.preventDefault();
    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim();
    const password = $('#regPass').value;
    const confirm = $('#regConfirm').value;
    const address = $('#regAddress').value.trim();
    setError('regError', '');

    if (!name || !email || !password || !confirm || !address) {
      setError('regError', t('toast.fillFields'));
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('regError', t('toast.emailInvalid'));
      $('#regEmail').focus();
      return;
    }
    if (state.accounts.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      setError('regError', t('toast.emailTaken'));
      $('#regEmail').focus();
      return;
    }
    if (password.length < 6) {
      setError('regError', t('toast.passShort'));
      $('#regPass').focus();
      return;
    }
    if (password !== confirm) {
      setError('regError', t('toast.passMismatch'));
      $('#regConfirm').focus();
      return;
    }

    const account = {
      name,
      email,
      password,
      address,
      phone: '',
      birthday: '',
      blood: '',
      sex: '',
      patientNo: `2026-${String(1030 + state.accounts.length).padStart(4, '0')}`
    };
    state.accounts.push(account);
    save();
    $('#registerForm').reset();
    closeModal('registerModal');
    const { password: _password, ...profile } = account;
    signIn(profile, { silent: true });
    toast(t('toast.registered'));
  }

  function handleForgot(event) {
    event.preventDefault();
    const email = $('#forgotEmail').value.trim();
    setError('forgotError', '');
    if (!email) {
      setError('forgotError', t('toast.fillFields'));
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('forgotError', t('toast.emailInvalid'));
      $('#forgotEmail').focus();
      return;
    }
    $('#forgotForm').hidden = true;
    $('#forgotSuccess').hidden = false;
    $('#forgotSentText').textContent = `${email} — ${t('toast.resetSentDemo')}`;
    toast(t('toast.resetSent'));
  }

  function handleEdit(event) {
    event.preventDefault();
    const name = $('#editName').value.trim();
    const email = $('#editEmail').value.trim();
    const phone = $('#editPhone').value.trim();
    const birthday = $('#editBirthday').value;
    const blood = $('#editBlood').value;
    const address = $('#editAddress').value.trim();
    setError('editError', '');

    if (!name || !email) {
      setError('editError', t('toast.required'));
      (!name ? $('#editName') : $('#editEmail')).focus();
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('editError', t('toast.emailInvalid'));
      $('#editEmail').focus();
      return;
    }

    const account = accountForCurrentUser();
    const duplicate = state.accounts.find((item) =>
      item !== account && item.email && item.email.toLowerCase() === email.toLowerCase()
    );
    if (duplicate) {
      setError('editError', t('toast.emailTaken'));
      $('#editEmail').focus();
      return;
    }

    const profile = { name, email, phone, birthday, blood, address };
    state.user = { ...state.user, ...profile };
    if (account) Object.assign(account, profile);
    save();
    renderProfile();
    closeModal('editModal');
    toast(t('toast.saved'));
  }

  function handleSecurity(event) {
    event.preventDefault();
    const current = $('#secCurrent').value;
    const next = $('#secNew').value;
    const confirm = $('#secConfirm').value;
    setError('secError', '');

    if (!current || !next || !confirm) {
      setError('secError', t('toast.fillFields'));
      return;
    }

    const account = accountForCurrentUser();
    const expected = account ? account.password : (state.password || 'demo123');
    const demoFallback = !account && current === 'demo123';
    if (current !== expected && !demoFallback) {
      setError('secError', t('toast.wrongCurrent'));
      $('#secCurrent').focus();
      return;
    }
    if (next.length < 6) {
      setError('secError', t('toast.passShort'));
      $('#secNew').focus();
      return;
    }
    if (next !== confirm) {
      setError('secError', t('toast.passMismatch'));
      $('#secConfirm').focus();
      return;
    }

    if (account) account.password = next;
    else state.password = next;
    save();
    closeModal('securityModal');
    toast(t('toast.passUpdated'));
  }

  function handleLanguage(event) {
    event.preventDefault();
    const choice = document.querySelector('input[name="lang"]:checked');
    if (!choice) return;
    state.lang = choice.value === 'fil' ? 'fil' : 'en';
    save();
    applyI18n();
    closeModal('languageModal');
    toast(t('toast.langChanged'));
  }

  function handleBooking(event) {
    event.preventDefault();
    const serviceId = $('#apptService').value;
    const date = $('#apptDate').value;
    const time = $('#apptTime').value;
    const notes = $('#apptNotes').value.trim();
    const service = SERVICES.find((item) => item.id === serviceId);
    setError('bookError', '');

    if (!service) {
      setError('bookError', t('toast.selectService'));
      $('#apptService').focus();
      return;
    }
    if (!date || Number.isNaN(Date.parse(`${date}T00:00:00`)) || date < todayISO()) {
      setError('bookError', t('toast.selectDate'));
      $('#apptDate').focus();
      return;
    }
    if (!time) {
      setError('bookError', t('toast.selectTime'));
      $('#apptTime').focus();
      return;
    }

    state.appointments.unshift({
      id: uid('apt'),
      service: L(service.name),
      serviceId,
      date,
      time,
      notes,
      status: 'Confirmed'
    });
    save();
    renderAppointments();
    $('#apptNotes').value = '';
    pushNotification({
      icon: 'calendar',
      title: t('appt.book'),
      body: `${L(service.name)} · ${date} · ${time}`,
      page: 'appointments'
    });
    toast(t('toast.apptBooked'));
  }

  function handleCheckout(event) {
    event.preventDefault();
    const address = $('#checkoutAddress').value.trim();
    const phone = $('#checkoutPhone').value.trim();
    const paymentInput = document.querySelector('input[name="payment"]:checked');
    const payment = paymentInput ? paymentInput.value : 'Cash on Delivery';
    setError('checkoutError', '');

    if (!address || address.length < 5 || phone.replace(/\D/g, '').length < 7) {
      setError('checkoutError', t('toast.checkoutFields'));
      (!address ? $('#checkoutAddress') : $('#checkoutPhone')).focus();
      return;
    }
    if (!cartCount()) {
      setError('checkoutError', t('toast.emptyCart'));
      return;
    }

    const items = cartEntries().map((item) => ({
      id: item.id, name: item.name, price: item.price, qty: item.qty
    }));
    const subtotal = cartSubtotal();
    const delivery = subtotal >= 1500 ? 0 : 79;
    const total = subtotal + delivery;
    const orderNo = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

    state.orders.unshift({
      id: uid('ord'),
      no: orderNo,
      items,
      subtotal,
      delivery,
      total,
      address,
      phone,
      payment,
      status: 'Preparing',
      date: new Date().toISOString()
    });
    state.user.address = address;
    state.user.phone = phone;
    state.cart = {};
    save();
    renderCart();
    closeModal('checkoutModal');
    $('#successOrderNo').textContent = `Order #${orderNo}`;
    openModal('successModal');
    pushNotification({
      icon: 'truck',
      title: t('success.title'),
      body: `${orderNo} · ${peso(total)}`,
      page: 'home'
    });
    toast(t('toast.orderPlaced'));
  }

  async function cancelAppointment(id) {
    const appt = state.appointments.find((item) => item.id === id);
    if (!appt) return;
    const ok = await askConfirm({
      title: t('appt.cancel'),
      message: `${appt.service} · ${appt.date} · ${appt.time}`,
      ok: t('appt.cancel'),
      danger: true
    });
    if (!ok) return;
    appt.status = 'Cancelled';
    save();
    renderAppointments();
    pushNotification({
      icon: 'calendar',
      title: t('appt.cancelled'),
      body: `${appt.service} · ${appt.date}`,
      page: 'appointments'
    });
    toast(t('toast.apptCancelled'));
  }

  function bookService(serviceId) {
    const service = SERVICES.find((item) => item.id === serviceId);
    if (!service) return;
    go('appointments');
    $('#apptService').value = serviceId;
    setError('bookError', '');
    setTimeout(() => {
      const panel = $('#bookPanel');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('#apptService').focus({ preventScroll: true });
    }, 60);
  }

  function updateStrength() {
    const value = $('#secNew').value;
    let score = 0;
    if (value.length >= 6) score += 1;
    if (value.length >= 10) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    score = Math.min(score, 4);
    const bar = $('#secStrengthBar');
    bar.style.width = `${score * 25}%`;
    bar.style.background = score <= 1 ? 'var(--red)' : score === 2 ? 'var(--gold)' : 'var(--green)';
  }

  /* ---------------- event bindings ---------------- */

  function bindForms() {
    const on = (id, handler) => {
      const form = document.getElementById(id);
      if (form) form.addEventListener('submit', handler);
    };
    on('loginForm', handleLogin);
    on('registerForm', handleRegister);
    on('forgotForm', handleForgot);
    on('editForm', handleEdit);
    on('securityForm', handleSecurity);
    on('languageForm', handleLanguage);
    on('bookForm', handleBooking);
    on('checkoutForm', handleCheckout);
  }

  function bindStatic() {
    $('#pwToggle').addEventListener('click', () => {
      const pass = $('#loginPass');
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      $('#pwToggle').setAttribute('aria-pressed', String(show));
      $('#pwToggle').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      $('#pwIcon use').setAttribute('href', show ? '#i-eye-off' : '#i-eye');
    });

    $('#demoFill').addEventListener('click', () => {
      $('#loginUser').value = 'demo';
      $('#loginPass').value = 'demo123';
      setError('loginError', '');
      toast(t('toast.demoFilled'));
      $('#loginPass').focus();
    });

    $('#registerLink').addEventListener('click', openRegister);
    $('#forgotBtn').addEventListener('click', openForgot);

    $('#searchInput').addEventListener('input', (event) => {
      state.search = event.target.value;
      $('#searchClear').hidden = !state.search;
      renderCatalog();
    });

    $('#searchClear').addEventListener('click', () => {
      state.search = '';
      $('#searchInput').value = '';
      $('#searchClear').hidden = true;
      renderCatalog();
      $('#searchInput').focus();
    });

    $('#notifBtn').addEventListener('click', () => {
      if ($('#notifPanel').hidden) openNotif();
      else closeNotif();
    });

    $('#notifClose').addEventListener('click', closeNotif);
    $('#cartBtn').addEventListener('click', openCart);
    $('#avatarBtn').addEventListener('click', () => go('profile'));
    $('#scrim').addEventListener('click', () => closeCart());

    $('#featuredSeeAll').addEventListener('click', () => applyFilter('all'));
    $('#browseBtn').addEventListener('click', () => {
      resetCatalog();
      setTimeout(() => $('#catalogSection').scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
    });
    $('#resetFilters').addEventListener('click', resetCatalog);

    $('#downloadBtn').addEventListener('click', downloadHealthRecord);
    $('#editInfoBtn').addEventListener('click', openEdit);
    $('#editInfoBtn2').addEventListener('click', openEdit);
    $('#securityBtn').addEventListener('click', openSecurity);
    $('#languageBtn').addEventListener('click', openLanguage);
    $('#helpBtn').addEventListener('click', openHelp);
    $('#footerHelp').addEventListener('click', openHelp);

    $('#logoutBtn').addEventListener('click', async () => {
      const ok = await askConfirm({
        title: t('logout.title'),
        message: t('logout.msg'),
        ok: t('logout.ok'),
        danger: true
      });
      if (!ok) return;
      state.session = false;
      save();
      $('#loginUser').value = '';
      $('#loginPass').value = '';
      showAuth();
      toast(t('toast.loggedOut'));
    });

    $('#checkoutBtn').addEventListener('click', openCheckout);
    $('#cartBrowse').addEventListener('click', () => {
      closeCart();
      applyFilter('all');
    });
    $('#successDone').addEventListener('click', () => {
      closeModal('successModal');
      go('home');
    });

    $('#markAllRead').addEventListener('click', () => {
      state.notifications.forEach((item) => { item.unread = false; });
      save();
      renderNotif();
      toast(t('toast.markedRead'));
    });

    $('#confirmCancel').addEventListener('click', () => closeModal('confirmModal'));
    $('#confirmOk').addEventListener('click', () => {
      const resolve = confirmResolver;
      confirmResolver = null;
      closeModal('confirmModal');
      if (resolve) resolve(true);
    });

    $('#secNew').addEventListener('input', updateStrength);

    ['loginUser', 'loginPass'].forEach((id) => {
      document.getElementById(id).addEventListener('input', () => setError('loginError', ''));
    });

    const hero = $('#heroCard');
    hero.addEventListener('mouseenter', stopHeroAuto);
    hero.addEventListener('mouseleave', () => {
      if (state.session) startHeroAuto();
    });
  }

  function bindDelegates() {
    document.addEventListener('click', (event) => {
      const closeEl = event.target.closest('[data-close]');
      if (closeEl) {
        const modal = closeEl.closest('.modal');
        if (modal) closeModal(modal.id);
        return;
      }

      const closeDrawer = event.target.closest('[data-close-drawer]');
      if (closeDrawer) {
        closeCart();
        return;
      }

      const pageEl = event.target.closest('button[data-page], a[data-page]');
      if (pageEl) {
        event.preventDefault();
        closeNotif();
        closeCart({ instant: true });
        go(pageEl.dataset.page);
        return;
      }

      const filterEl = event.target.closest('[data-filter]');
      if (filterEl) {
        applyFilter(filterEl.dataset.filter);
        return;
      }

      const addEl = event.target.closest('[data-add]');
      if (addEl) {
        addToCart(addEl.dataset.add);
        return;
      }

      const viewEl = event.target.closest('[data-view]');
      if (viewEl) {
        openQuickView(viewEl.dataset.view);
        return;
      }

      const slideEl = event.target.closest('[data-slide]');
      if (slideEl) {
        heroIndex = Number(slideEl.dataset.slide) || 0;
        renderHero();
        if (state.session) startHeroAuto();
        return;
      }

      const heroCta = event.target.closest('[data-hero-cta]');
      if (heroCta) {
        applyFilter(heroCta.dataset.heroCta);
        return;
      }

      const plusEl = event.target.closest('[data-cart-plus]');
      if (plusEl) {
        const id = plusEl.dataset.cartPlus;
        setCartQty(id, (state.cart[id] || 0) + 1);
        return;
      }

      const minusEl = event.target.closest('[data-cart-minus]');
      if (minusEl) {
        const id = minusEl.dataset.cartMinus;
        setCartQty(id, (state.cart[id] || 0) - 1);
        return;
      }

      const removeEl = event.target.closest('[data-cart-remove]');
      if (removeEl) {
        setCartQty(removeEl.dataset.cartRemove, 0);
        return;
      }

      const cancelEl = event.target.closest('[data-cancel-appt]');
      if (cancelEl) {
        void cancelAppointment(cancelEl.dataset.cancelAppt);
        return;
      }

      const bookEl = event.target.closest('[data-book-service]');
      if (bookEl) {
        bookService(bookEl.dataset.bookService);
        return;
      }

      const notifEl = event.target.closest('[data-notif]');
      if (notifEl) {
        const item = state.notifications.find((entry) => entry.id === notifEl.dataset.notif);
        if (item) {
          if (item.unread) {
            item.unread = false;
            save();
            renderNotif();
            toast(t('toast.notifRead'));
          }
          closeNotif();
          if (['home', 'appointments', 'services', 'profile'].includes(item.page)) go(item.page);
        }
        return;
      }

      const qvPlus = event.target.closest('[data-qv-plus]');
      if (qvPlus) {
        quickQty = Math.min(99, quickQty + 1);
        $('#qvQty').textContent = quickQty;
        return;
      }

      const qvMinus = event.target.closest('[data-qv-minus]');
      if (qvMinus) {
        quickQty = Math.max(1, quickQty - 1);
        $('#qvQty').textContent = quickQty;
        return;
      }

      const qvAdd = event.target.closest('[data-qv-add]');
      if (qvAdd) {
        addToCart(qvAdd.dataset.qvAdd, quickQty);
        closeModal('quickViewModal');
        return;
      }

      const qvBuy = event.target.closest('[data-qv-buy]');
      if (qvBuy) {
        const id = qvBuy.dataset.qvBuy;
        const product = getProduct(id);
        addToCart(id, quickQty, { silent: true });
        closeModal('quickViewModal');
        openCart();
        if (product) toast(`${product.name} ${t('toast.added')}`);
        return;
      }

      const faq = event.target.closest('[data-faq]');
      if (faq) {
        const answer = faq.nextElementSibling;
        const willOpen = answer && answer.hidden;
        $$('.faq__a', $('#helpModal')).forEach((el) => { el.hidden = true; });
        $$('.faq__q', $('#helpModal')).forEach((button) => button.setAttribute('aria-expanded', 'false'));
        if (willOpen) {
          answer.hidden = false;
          faq.setAttribute('aria-expanded', 'true');
        }
      }
    });

    document.addEventListener('click', (event) => {
      const panel = $('#notifPanel');
      if (!panel || panel.hidden) return;
      if (event.target.closest('#notifPanel') || event.target.closest('#notifBtn')) return;
      closeNotif();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (modalStack.length) {
        closeModal(modalStack[modalStack.length - 1]);
        return;
      }
      if ($('#cartDrawer').classList.contains('is-open')) {
        closeCart();
        return;
      }
      if (!$('#notifPanel').hidden) closeNotif();
    });
  }

  /* ---------------- boot ---------------- */

  function init() {
    applyI18n();
    $('#searchInput').value = state.search || '';
    $('#searchClear').hidden = !state.search;
    bindForms();
    bindStatic();
    bindDelegates();
    if (state.session) showApp();
    else showAuth();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

