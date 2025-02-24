export type Language = 'en' | 'lt';

// Define the base translation keys and their English values
export type TranslationKeys = {
  // Navigation
  home: string;
  login: string;
  register: string;
  logout: string;
  profile: string;
  cart: string;
  favorites: string;
  filter: string;
  search: string;
  admin_panel: string;
  users: string;
  products: string;

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
    cart: 'Cart',
    favorites: 'Favorites',
    filter: 'Filter',
    search: 'Search',
    admin_panel: 'Admin Panel',
    users: 'Users',
    products: 'Products',

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
    sort_name_z_a: 'Name: Z-A'
  },
  lt: {
    // Navigation
    home: 'Pradžia',
    login: 'Prisijungti',
    register: 'Registruotis',
    logout: 'Atsijungti',
    profile: 'Profilis',
    cart: 'Krepšelis',
    favorites: 'Mėgstami',
    filter: 'Filtruoti',
    search: 'Ieškoti',
    admin_panel: 'Administratoriaus skydelis',
    users: 'Vartotojai',
    products: 'Produktai',

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
    sort_name_z_a: 'Pavadinimas: Z-A'
  }
} as const;

// Export the type of translations
export type TranslationKey = keyof TranslationKeys; 