import type { TranslationKeys } from './translations';

export const lt: TranslationKeys = {
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

  // Sort options
  sort_newest: 'Naujausi',
  sort_price_low_high: 'Kaina: nuo mažiausios',
  sort_price_high_low: 'Kaina: nuo didžiausios',
  sort_name_a_z: 'Pavadinimas: A-Z',
  sort_name_z_a: 'Pavadinimas: Z-A',

  // Favorites
  add_to_favorites: 'Pridėti į mėgstamus',
  remove_from_favorites: 'Pašalinti iš mėgstamų',

  // Review actions
  edit: 'Redaguoti',
  delete: 'Pašalinti',
  review_updated: 'Atsiliepimas sėkmingai atnaujintas',
  review_deleted: 'Atsiliepimas sėkmingai pašalintas',
  review_error: 'Klaida pateikiant atsiliepimą. Bandykite dar kartą.',
  delete_confirm: 'Ar tikrai norite pašalinti šį atsiliepimą?',
  error_deleting_review: 'Klaida pašalinant atsiliepimą',

  // Dialog actions
  cancel: 'Atšaukti',
  confirm: 'Patvirtinti'
} as const; 