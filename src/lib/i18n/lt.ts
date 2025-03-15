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
  settings: 'Nustatymai',
  logged_in_as: 'Prisijungęs kaip',

  // Theme
  theme_switch_light: 'Pakeisti į šviesią temą',
  theme_switch_dark: 'Pakeisti į tamsią temą',

  // Admin panel
  dashboard: 'Valdymo skydelis',
  orders: 'Užsakymai',
  access_denied: 'Prieiga uždrausta',
  access_denied_message: 'Jūs neturite teisių pasiekti administratoriaus skydelį.',
  return_to_home: 'Grįžti į pagrindinį puslapį',
  bulk_operations: 'Masinės operacijos',
  admin_dashboard: 'Administratoriaus skydelis',
  manage_users: 'Valdyti vartotojus',
  manage_products: 'Valdyti produktus',
  manage_categories: 'Valdyti kategorijas',
  monitor_reviews: 'Stebėti atsiliepimus',
  import_export: 'Importuoti/Eksportuoti',
  admin_users_description: 'Valdyti vartotojų paskyras, roles ir leidimus',
  admin_products_description: 'Pridėti, redaguoti ir valdyti produktų sąrašus',
  admin_categories_description: 'Organizuoti ir struktūrizuoti produktų kategorijas',
  admin_reviews_description: 'Stebėti ir moderuoti produktų atsiliepimus',
  admin_bulk_description: 'Importuoti/eksportuoti duomenis ir atlikti masines operacijas',

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
  register_with_google: 'Registruotis su Google',

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
  name_required: 'Vardas privalomas',
  email_required: 'El. paštas privalomas',
  password_required: 'Slaptažodis privalomas',
  invalid_email_format: 'Neteisingas el. pašto formatas',
  server_unavailable: 'Serveris nepasiekiamas',
  username_already_exists: 'Vartotojo vardas jau egzistuoja',

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
  invalid_price_range_order: 'Maksimali kaina turi būti didesnė už minimalią',

  // Returns page
  return_policy: 'Grąžinimo politika',
  return_policy_description: 'Mūsų grąžinimo politika yra paprasta ir lanksti',
  return_policy_point_1: 'Galite grąžinti produktą per 14 dienų nuo gavimo',
  return_policy_point_2: 'Produktas turi būti nepažeistas ir originalioje pakuotėje',
  return_policy_point_3: 'Grąžiname visą sumą, išskyrus siuntimo išlaidas',
  return_process: 'Grąžinimo procesas',
  return_process_step_1: 'Susisiekite su klientų aptarnavimu',
  return_process_step_2: 'Gaukite grąžinimo patvirtinimą',
  return_process_step_3: 'Išsiųskite produktą nurodytu adresu',
  return_process_step_4: 'Gavę produktą, atliksime pinigų grąžinimą',

  // New translations
  select_language: 'LT',
  language_en: 'Anglų',
  language_lt: 'Lietuvių',
  search_placeholder: 'Ieškokite tarp {{count}} prekių...',

  // User roles
  super_admin: 'Vyriausiasis administratorius',
  user: 'Vartotojas',

  // Registration Banner
  close: 'Uždaryti',
  'register.specialOffer': 'Specialus pasiūlymas',
  'register.discountDescription': 'Gaukite nuolaidą pirmajam pirkiniui',
  'register.signUpNow': 'Registruokitės dabar',
  'register.newCustomersOnly': 'Tik naujiems klientams'
} as const; 