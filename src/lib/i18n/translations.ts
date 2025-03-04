export type Language = 'en' | 'lt';

// Define the base translation keys and their English values
export type TranslationKeys = {
  // Navigation
  home: string;
  login: string;
  register: string;
  logout: string;
  profile: string;
  settings: string;
  cart: string;
  favorites: string;
  filter: string;
  search: string;
  admin_panel: string;
  users: string;
  products: string;
  logged_in_as: string;

  // Admin panel
  dashboard: string;
  orders: string;
  access_denied: string;
  access_denied_message: string;
  return_to_home: string;
  bulk_operations: string;
  admin_dashboard: string;
  manage_users: string;
  manage_products: string;
  manage_categories: string;
  monitor_reviews: string;
  import_export: string;
  admin_users_description: string;
  admin_products_description: string;
  admin_categories_description: string;
  admin_reviews_description: string;
  admin_bulk_description: string;

  // Categories
  categories: string;
  laptops: string;
  desktops: string;
  phones: string;
  tablets: string;
  monitors: string;
  keyboards: string;
  mice: string;
  headphones: string;
  graphics_cards: string;
  processors: string;
  memory: string;
  storage: string;
  power_supplies: string;
  cooling: string;
  cases: string;
  motherboards: string;
  networking: string;
  software: string;
  gaming: string;
  printers: string;

  // Product related
  in_stock: string;
  out_of_stock: string;
  add_to_cart: string;
  continue_shopping: string;
  productSpecifications: string;
  writeReview: string;
  submitReview: string;
  updateReview: string;
  reviews: string;
  similarProducts: string;
  sortReviews: string;
  reviewSortNewest: string;
  reviewSortOldest: string;
  reviewSortHighest: string;
  reviewSortLowest: string;
  noReviews: string;
  loginToReview: string;
  reviewUpdated: string;
  reviewSubmitted: string;
  errorSubmittingReview: string;
  errorLoadingReviews: string;
  product_details: string;
  product_description: string;
  product_price: string;
  product_stock: string;

  // Auth related
  email: string;
  password: string;
  confirm_password: string;
  name: string;
  logging_in: string;
  registering: string;
  dont_have_account: string;
  already_have_account: string;

  // Profile
  profile_settings: string;
  profile_picture: string;
  change_picture: string;
  current_password: string;
  new_password: string;
  update_password: string;
  updating: string;

  // Footer
  about_us: string;
  about_description: string;
  quick_links: string;
  about: string;
  contact: string;
  shipping_info: string;
  customer_service: string;
  faq: string;
  returns: string;
  support: string;
  contact_us: string;
  phone: string;
  address: string;
  all_rights_reserved: string;

  // Additional translations
  sort_by: string;
  price_low_high: string;
  price_high_low: string;
  newest: string;
  loading: string;
  load_more: string;

  // Form
  select_category: string;

  // Admin
  admin: {
    products: {
      edit: string;
      productImage: string;
      uploadImage: string;
    }
  };

  // Error messages
  invalid_credentials: string;
  registration_failed: string;
  passwords_dont_match: string;
  email_already_exists: string;
  invalid_email: string;
  password_too_short: string;
  name_required: string;
  email_required: string;
  password_required: string;
  invalid_email_format: string;
  server_unavailable: string;
  username_already_exists: string;

  // Error handling
  try_again: string;
  error_loading: string;

  // Search
  search_products: string;
  search_results_for: string;
  no_results_found: string;
  no_products_found: string;
  
  // Error messages
  something_went_wrong: string;
  product_not_found: string;

  // Favorites
  add_to_favorites: string;
  remove_from_favorites: string;

  // Sort options
  sort_newest: string;
  sort_price_low_high: string;
  sort_price_high_low: string;
  sort_name_a_z: string;
  sort_name_z_a: string;

  // New translations
  edit: string;
  delete: string;
  review_updated: string;
  review_deleted: string;
  review_error: string;
  delete_confirm: string;
  error_deleting_review: string;
  cancel: string;
  confirm: string;

  // Price range
  price_range: string;
  invalid_price_range_negative: string;
  invalid_price_range_order: string;

  // Returns page
  return_policy: string;
  return_policy_description: string;
  return_policy_point_1: string;
  return_policy_point_2: string;
  return_policy_point_3: string;
  return_process: string;
  return_process_step_1: string;
  return_process_step_2: string;
  return_process_step_3: string;
  return_process_step_4: string;

  // New translations
  select_language: string;
  language_en: string;
  language_lt: string;
  search_placeholder: string;

  // User roles
  super_admin: string;
  user: string;
};

// Define the translations object with language-specific values
export const translations: Record<Language, TranslationKeys> = {
  en: {
    // Navigation
    home: 'Home',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
    cart: 'Cart',
    favorites: 'Favorites',
    filter: 'Filter',
    search: 'Search',
    admin_panel: 'Admin Panel',
    users: 'Users',
    products: 'Products',
    logged_in_as: 'Logged in as',

    // Admin panel
    dashboard: 'Dashboard',
    orders: 'Orders',
    access_denied: 'Access Denied',
    access_denied_message: 'You do not have permission to access the admin panel.',
    return_to_home: 'Return to Home',
    bulk_operations: 'Bulk Operations',
    admin_dashboard: 'Admin Dashboard',
    manage_users: 'User Management',
    manage_products: 'Product Management',
    manage_categories: 'Category Management',
    monitor_reviews: 'Review Management',
    import_export: 'Import/Export',
    admin_users_description: 'Manage user accounts, roles, and permissions',
    admin_products_description: 'Add, edit, and manage product listings',
    admin_categories_description: 'Organize and structure product categories',
    admin_reviews_description: 'Monitor and moderate product reviews',
    admin_bulk_description: 'Import/export data and perform bulk operations',

    // Categories
    categories: 'Categories',
    laptops: 'Laptops',
    desktops: 'Desktop Computers',
    phones: 'Mobile Phones',
    tablets: 'Tablets',
    monitors: 'Monitors',
    keyboards: 'Keyboards',
    mice: 'Mice',
    headphones: 'Headphones',
    graphics_cards: 'Graphics Cards',
    processors: 'Processors',
    memory: 'Memory',
    storage: 'Storage',
    power_supplies: 'Power Supplies',
    cooling: 'Cooling',
    cases: 'Cases',
    motherboards: 'Motherboards',
    networking: 'Networking',
    software: 'Software',
    gaming: 'Gaming Equipment',
    printers: 'Printers',

    // Product related
    in_stock: 'in stock',
    out_of_stock: 'Out of stock',
    add_to_cart: 'Add to cart',
    continue_shopping: 'Continue Shopping',
    productSpecifications: 'Specifications',
    writeReview: 'Write a review',
    submitReview: 'Submit review',
    updateReview: 'Update review',
    reviews: 'Reviews',
    similarProducts: 'Similar Products',
    sortReviews: 'Sort Reviews',
    reviewSortNewest: 'Newest First',
    reviewSortOldest: 'Oldest First',
    reviewSortHighest: 'Highest Rating',
    reviewSortLowest: 'Lowest Rating',
    noReviews: 'No reviews yet',
    loginToReview: 'Login to write a review',
    reviewUpdated: 'Review updated successfully',
    reviewSubmitted: 'Review submitted successfully',
    errorSubmittingReview: 'Error submitting review',
    errorLoadingReviews: 'Error loading reviews',
    product_details: 'Product details',
    product_description: 'Description',
    product_price: 'Price',
    product_stock: 'Stock',

    // Auth related
    email: 'Email',
    password: 'Password',
    confirm_password: 'Confirm Password',
    name: 'Name',
    logging_in: 'Logging in...',
    registering: 'Registering...',
    dont_have_account: "Don't have an account?",
    already_have_account: 'Already have an account?',

    // Profile
    profile_settings: 'Profile Settings',
    profile_picture: 'Profile Picture',
    change_picture: 'Change Picture',
    current_password: 'Current Password',
    new_password: 'New Password',
    update_password: 'Update Password',
    updating: 'Updating...',

    // Footer
    about_us: 'About Us',
    about_description: 'Your trusted source for quality electronics and computer parts.',
    quick_links: 'Quick Links',
    about: 'About',
    contact: 'Contact',
    shipping_info: 'Shipping Info',
    customer_service: 'Customer Service',
    faq: 'FAQ',
    returns: 'Returns',
    support: 'Support',
    contact_us: 'Contact Us',
    phone: 'Phone',
    address: 'Address',
    all_rights_reserved: 'All rights reserved.',

    // Additional translations
    sort_by: 'Sort by',
    price_low_high: 'Price: Low to High',
    price_high_low: 'Price: High to Low',
    newest: 'Newest',
    loading: 'Loading...',
    load_more: 'Load More',

    // Form
    select_category: 'Select category',

    // Admin
    admin: {
      products: {
        edit: 'Edit Product',
        productImage: 'Product Image',
        uploadImage: 'Upload Image'
      }
    },

    // Error messages
    invalid_credentials: 'Invalid credentials',
    registration_failed: 'Registration failed. Please check your details.',
    passwords_dont_match: 'Passwords do not match',
    email_already_exists: 'Email already exists',
    invalid_email: 'Invalid email address',
    password_too_short: 'Password must be at least 8 characters long',
    name_required: 'Name is required',
    email_required: 'Email is required',
    password_required: 'Password is required',
    invalid_email_format: 'Invalid email format',
    server_unavailable: 'Server is currently unavailable. Please try again later.',
    username_already_exists: 'Username already exists',

    // Error handling
    try_again: 'Try again',
    error_loading: 'Error loading content',

    // Search
    search_products: 'Search products',
    search_results_for: 'Search results for',
    no_results_found: 'No results found',
    no_products_found: 'No products found',
    
    // Error messages
    something_went_wrong: 'Something went wrong',
    product_not_found: 'Product not found',

    // Favorites
    add_to_favorites: 'Add to favorites',
    remove_from_favorites: 'Remove from favorites',

    // Sort options
    sort_newest: 'Newest',
    sort_price_low_high: 'Price: Low to High',
    sort_price_high_low: 'Price: High to Low',
    sort_name_a_z: 'Name: A-Z',
    sort_name_z_a: 'Name: Z-A',

    // New translations
    edit: 'Edit',
    delete: 'Delete',
    review_updated: 'Review updated successfully',
    review_deleted: 'Review deleted successfully',
    review_error: 'Failed to submit review. Please try again.',
    delete_confirm: 'Are you sure you want to delete this review?',
    error_deleting_review: 'Error deleting review',
    cancel: 'Cancel',
    confirm: 'Confirm',

    // Price range
    price_range: 'Price Range',
    invalid_price_range_negative: 'Price cannot be negative',
    invalid_price_range_order: 'Minimum price must be less than maximum price',

    // Returns page
    return_policy: 'Return Policy',
    return_policy_description: 'At e-pasaulis, we want you to be completely satisfied with your purchase. If you are not satisfied, you may return most products within 30 days of delivery for a full refund.',
    return_policy_point_1: 'Items must be returned in original, undamaged packaging',
    return_policy_point_2: 'Products must be in new, unused condition with all original tags and labels attached',
    return_policy_point_3: 'Digital downloads, opened software, and personalized items are not eligible for return',
    return_process: 'Return Process',
    return_process_step_1: 'Login to your account and navigate to your order history',
    return_process_step_2: 'Select the order containing the item(s) you wish to return',
    return_process_step_3: 'Complete the return form with the reason for your return',
    return_process_step_4: 'Print the provided return label and ship the package back to us',

    // New translations
    select_language: 'Language',
    language_en: 'English',
    language_lt: 'Lithuanian',
    search_placeholder: 'Search among {{count}} products...',

    // User roles
    super_admin: 'Super Administrator',
    user: 'User',
  },
  lt: {
    // Navigation
    home: 'Pradžia',
    login: 'Prisijungti',
    register: 'Registruotis',
    logout: 'Atsijungti',
    profile: 'Profilis',
    settings: 'Nustatymai',
    cart: 'Krepšelis',
    favorites: 'Mėgstami',
    filter: 'Filtruoti',
    search: 'Ieškoti',
    admin_panel: 'Administratoriaus skydelis',
    users: 'Vartotojai',
    products: 'Produktai',
    logged_in_as: 'Prisijungęs kaip',

    // Admin panel
    dashboard: 'Valdymo skydelis',
    orders: 'Užsakymai',
    access_denied: 'Prieiga uždrausta',
    access_denied_message: 'Jūs neturite teisių pasiekti administratoriaus skydelį.',
    return_to_home: 'Grįžti į pradžią',
    bulk_operations: 'Masinės operacijos',
    admin_dashboard: 'Administratoriaus skydelis',
    manage_users: 'Vartotojų Valdymas',
    manage_products: 'Produktų Valdymas',
    manage_categories: 'Kategorijų Valdymas',
    monitor_reviews: 'Atsiliepimų Valdymas',
    import_export: 'Importuoti/Eksportuoti',
    admin_users_description: 'Valdykite vartotojų paskyras, roles ir teises',
    admin_products_description: 'Pridėkite, redaguokite ir valdykite produktų sąrašus',
    admin_categories_description: 'Organizuokite ir struktūrizuokite produktų kategorijas',
    admin_reviews_description: 'Stebėkite ir moderuokite produktų atsiliepimus',
    admin_bulk_description: 'Importuokite/eksportuokite duomenis ir atlikite masines operacijas',

    // Categories
    categories: 'Kategorijos',
    laptops: 'Nešiojami kompiuteriai',
    desktops: 'Stacionarūs kompiuteriai',
    phones: 'Mobilieji telefonai',
    tablets: 'Planšetiniai kompiuteriai',
    monitors: 'Monitoriai',
    keyboards: 'Klaviatūros',
    mice: 'Pelės',
    headphones: 'Ausinės',
    graphics_cards: 'Vaizdo plokštės',
    processors: 'Procesoriai',
    memory: 'Atmintis',
    storage: 'Kietieji diskai',
    power_supplies: 'Maitinimo blokai',
    cooling: 'Aušintuvai',
    cases: 'Korpusai',
    motherboards: 'Pagrindinės plokštės',
    networking: 'Tinklo įranga',
    software: 'Programinė įranga',
    gaming: 'Žaidimų įranga',
    printers: 'Spausdintuvai',

    // Product related
    in_stock: 'yra sandėlyje',
    out_of_stock: 'Išparduota',
    add_to_cart: 'Į krepšelį',
    continue_shopping: 'Tęsti apsipirkimą',
    productSpecifications: 'Specifikacijos',
    writeReview: 'Parašyti atsiliepimą',
    submitReview: 'Pateikti atsiliepimą',
    updateReview: 'Atnaujinti atsiliepimą',
    reviews: 'Atsiliepimai',
    similarProducts: 'Panašūs produktai',
    sortReviews: 'Rūšiuoti atsiliepimus',
    reviewSortNewest: 'Naujausi',
    reviewSortOldest: 'Seniausi',
    reviewSortHighest: 'Geriausiai įvertinti',
    reviewSortLowest: 'Prasčiausiai įvertinti',
    noReviews: 'Atsiliepimų dar nėra',
    loginToReview: 'Prisijunkite, kad galėtumėte parašyti atsiliepimą',
    reviewUpdated: 'Atsiliepimas sėkmingai atnaujintas',
    reviewSubmitted: 'Atsiliepimas sėkmingai pateiktas',
    errorSubmittingReview: 'Klaida pateikiant atsiliepimą',
    errorLoadingReviews: 'Klaida įkeliant atsiliepimus',
    product_details: 'Produkto informacija',
    product_description: 'Aprašymas',
    product_price: 'Kaina',
    product_stock: 'Kiekis',

    // Auth related
    email: 'El. paštas',
    password: 'Slaptažodis',
    confirm_password: 'Pakartokite slaptažodį',
    name: 'Vardas',
    logging_in: 'Jungiamasi...',
    registering: 'Registruojama...',
    dont_have_account: 'Neturite paskyros?',
    already_have_account: 'Jau turite paskyrą?',

    // Profile
    profile_settings: 'Profilio nustatymai',
    profile_picture: 'Profilio nuotrauka',
    change_picture: 'Keisti nuotrauką',
    current_password: 'Dabartinis slaptažodis',
    new_password: 'Naujas slaptažodis',
    update_password: 'Atnaujinti slaptažodį',
    updating: 'Atnaujinama...',

    // Footer
    about_us: 'Apie mus',
    about_description: 'Jūsų patikimas elektronikos ir kompiuterių dalių šaltinis.',
    quick_links: 'Greitos nuorodos',
    about: 'Apie',
    contact: 'Kontaktai',
    shipping_info: 'Pristatymo informacija',
    customer_service: 'Klientų aptarnavimas',
    faq: 'D.U.K.',
    returns: 'Grąžinimai',
    support: 'Pagalba',
    contact_us: 'Susisiekite',
    phone: 'Telefonas',
    address: 'Adresas',
    all_rights_reserved: 'Visos teisės saugomos.',

    // Additional translations
    sort_by: 'Rūšiuoti pagal',
    price_low_high: 'Kaina: nuo mažiausios',
    price_high_low: 'Kaina: nuo didžiausios',
    newest: 'Naujausi',
    loading: 'Kraunama...',
    load_more: 'Rodyti daugiau',

    // Form
    select_category: 'Pasirinkite kategoriją',

    // Admin
    admin: {
      products: {
        edit: 'Redaguoti produktą',
        productImage: 'Produkto nuotrauka',
        uploadImage: 'Įkelti nuotrauką'
      }
    },

    // Error messages
    invalid_credentials: 'Neteisingi prisijungimo duomenys',
    registration_failed: 'Registracija nepavyko. Patikrinkite savo duomenis.',
    passwords_dont_match: 'Slaptažodžiai nesutampa',
    email_already_exists: 'Toks el. paštas jau egzistuoja',
    invalid_email: 'Neteisingas el. pašto adresas',
    password_too_short: 'Slaptažodis turi būti bent 8 simbolių ilgio',
    name_required: 'Vardas yra privalomas',
    email_required: 'El. paštas yra privalomas',
    password_required: 'Slaptažodis yra privalomas',
    invalid_email_format: 'Neteisingas el. pašto formatas',
    server_unavailable: 'Serveris šiuo metu nepasiekiamas. Bandykite vėliau.',
    username_already_exists: 'Toks vartotojo vardas jau egzistuoja',

    // Error handling
    try_again: 'Bandyti dar kartą',
    error_loading: 'Klaida įkeliant turinį',

    // Search
    search_products: 'Ieškoti produktų',
    search_results_for: 'Paieškos rezultatai',
    no_results_found: 'Rezultatų nerasta',
    no_products_found: 'Tokių prekių nerasta',
    
    // Error messages
    something_went_wrong: 'Įvyko klaida',
    product_not_found: 'Produktas nerastas',

    // Favorites
    add_to_favorites: 'Pridėti į mėgstamus',
    remove_from_favorites: 'Pašalinti iš mėgstamų',

    // Sort options
    sort_newest: 'Naujausi',
    sort_price_low_high: 'Kaina: nuo mažiausios',
    sort_price_high_low: 'Kaina: nuo didžiausios',
    sort_name_a_z: 'Pavadinimas: A-Z',
    sort_name_z_a: 'Pavadinimas: Z-A',

    // New translations
    edit: 'Redaguoti',
    delete: 'Pašalinti',
    review_updated: 'Atsiliepimas sėkmingai atnaujintas',
    review_deleted: 'Atsiliepimas sėkmingai pašalintas',
    review_error: 'Klaida pateikiant atsiliepimą. Bandykite dar kartą.',
    delete_confirm: 'Ar tikrai norite pašalinti šį atsiliepimą?',
    error_deleting_review: 'Klaida pašalinant atsiliepimą',
    cancel: 'Atšaukti',
    confirm: 'Patvirtinti',

    // Price range
    price_range: 'Kainų diapazonas',
    invalid_price_range_negative: 'Kaina negali būti neigiama',
    invalid_price_range_order: 'Minimali kaina turi būti mažesnė už maksimalią kainą',

    // Returns page
    return_policy: 'Grąžinimo politika',
    return_policy_description: 'E-pasaulis nori, kad jūs būtumėte visiškai patenkinti savo pirkiniu. Jei nesate patenkinti, daugelį produktų galite grąžinti per 30 dienų nuo pristatymo ir gauti visą pinigų grąžinimą.',
    return_policy_point_1: 'Prekės turi būti grąžinamos originalioje, nepažeistoje pakuotėje',
    return_policy_point_2: 'Produktai turi būti nauji, nenaudoti, su visomis originaliomis etiketėmis',
    return_policy_point_3: 'Skaitmeniniai atsisiuntimai, atidaryti programinės įrangos paketai ir personalizuotos prekės negali būti grąžintos',
    return_process: 'Grąžinimo procesas',
    return_process_step_1: 'Prisijunkite prie savo paskyros ir eikite į užsakymų istoriją',
    return_process_step_2: 'Pasirinkite užsakymą, kuriame yra prekė(-s), kurią(-as) norite grąžinti',
    return_process_step_3: 'Užpildykite grąžinimo formą, nurodydami grąžinimo priežastį',
    return_process_step_4: 'Atsispausdinkite pateiktą grąžinimo etiketę ir išsiųskite paketą atgal mums',

    // New translations
    select_language: 'Kalba',
    language_en: 'Anglų',
    language_lt: 'Lietuvių',
    search_placeholder: 'Ieškoti tarp {{count}} produktų...',

    // User roles
    super_admin: 'Super Administratorius',
    user: 'Vartotojas',
  }
} as const;

// Export the type of translations
export type TranslationKey = keyof TranslationKeys; 