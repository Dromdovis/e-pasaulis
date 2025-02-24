export type Language = 'en' | 'lt';

// We don't need to import TranslationKey here since it's only used in the LanguageContext
export const translations = {
  en: {
    // Navigation
    home: 'Home',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    cart: 'Cart',
    favorites: 'Favorites',

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
    all_rights_reserved: 'All rights reserved.',
    customer_service: 'Customer Service',
    faq: 'FAQ',
    returns: 'Returns',
    support: 'Support',
    contact_us: 'Contact Us',
    phone: 'Phone',
    address: 'Address',
    
    // Additional translations
    search: 'Search',
    filter: 'Filter',
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
    
    // Error messages
    something_went_wrong: 'Something went wrong',
    product_not_found: 'Product not found',
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
    all_rights_reserved: 'Visos teisės saugomos.',
    customer_service: 'Klientų Aptarnavimas',
    faq: 'DUK',
    returns: 'Grąžinimai',
    support: 'Pagalba',
    contact_us: 'Susisiekite',
    phone: 'Telefonas',
    address: 'Adresas',
    
    // Additional translations
    search: 'Paieška',
    filter: 'Filtruoti',
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
    
    // Error messages
    something_went_wrong: 'Įvyko klaida',
    product_not_found: 'Produktas nerastas',
  }
} as const; 

// Update the TranslationKey type
export type TranslationKey = keyof typeof translations.en; 