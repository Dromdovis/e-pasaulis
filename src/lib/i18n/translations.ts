export type Language = 'en' | 'lt' | 'ru';

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
  settings: string;
  logged_in_as: string;

  // Theme
  theme_switch_light: string;
  theme_switch_dark: string;

  // Registration Banner
  close: string;
  register_special_offer: string;
  register_discount_description: string;
  register_sign_up_now: string;
  register_new_customers_only: string;

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
  product_specifications: string;
  write_review: string;
  submit_review: string;
  update_review: string;
  reviews: string;
  similar_products: string;
  sort_reviews: string;
  review_sort_newest: string;
  review_sort_oldest: string;
  review_sort_highest: string;
  review_sort_lowest: string;
  no_reviews: string;
  login_to_review: string;
  review_updated: string;
  review_submitted: string;
  error_submitting_review: string;
  error_loading_reviews: string;
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
  register_with_google: string;
  
  // Login page
  login_title: string;
  login_email_placeholder: string;
  login_password_placeholder: string;
  login_button: string;
  login_with_google: string;
  continue_with_google: string;
  hide_password: string;
  show_password: string;
  google_login_failed: string;
  
  // Register page
  register_title: string;
  register_name_placeholder: string;
  register_email_placeholder: string;
  register_password_placeholder: string;
  register_confirm_password_placeholder: string;
  register_button: string;
  or_use_google: string;
  failed_to_register_with_google: string;

  // Profile
  profile_settings: string;
  profile_picture: string;
  change_picture: string;
  profile_photo: string;
  profile_change_photo: string;
  profile_uploading: string;
  profile_change_password: string;
  profile_current_password: string;
  profile_new_password: string;
  profile_update_password: string;
  profile_updating: string;
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
  
  // Footer sections
  footer_about_us: string;
  footer_quick_links: string;
  footer_customer_service: string;
  footer_contact_us: string;
  footer_copyright: string;
  footer_about_description: string;
  footer_email: string;
  footer_phone: string;
  footer_address: string;
  footer_social_media: string;
  footer_shop: string;
  footer_faq: string;
  footer_returns: string;
  footer_support: string;
  footer_terms: string;
  footer_privacy: string;
  footer_contact: string;
  footer_shipping: string;
  footer_about: string;

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
  
  // Filter options
  filter_title: string;
  filter_price_range: string;
  filter_in_stock_only: string;
  filter_apply: string;
  filter_reset: string;
  filter_categories: string;
  filter_price_min: string;
  filter_price_max: string;
  filter_specifications: string;
  filter_clear_all: string;
  filter_no_specifications: string;
  apply_filters: string;
  active_filters: string;
  remove: string;
  
  // Common specification names
  spec_brand: string;
  spec_processor: string;
  spec_memory: string;
  spec_storage: string;
  spec_graphics: string;
  spec_display: string;
  spec_keyboard: string;
  spec_color: string;
  spec_weight: string;
  spec_dimensions: string;
  spec_battery: string;
  spec_operating_system: string;
  spec_warranty: string;
  spec_connectivity: string;
  spec_ports: string;
  spec_camera: string;
  spec_audio: string;
  spec_screen_size: string;
  spec_resolution: string;
  spec_refresh_rate: string;
  spec_form_factor: string;
  spec_touch_screen: string;
  spec_backlit_keyboard: string;
  spec_ssd: string;
  spec_hdd: string;
  spec_ram: string;
  spec_ram_type: string;
  spec_cpu_cores: string;
  spec_cpu_speed: string;
  spec_gpu_memory: string;

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
  
  // Returns page detailed
  returns_page_title: string;
  returns_page_subtitle: string;
  returns_section1_title: string;
  returns_section1_content: string;
  returns_section2_title: string;
  returns_section2_content: string;
  returns_section3_title: string;
  returns_section3_content: string;
  returns_eligible_title: string;
  returns_eligible_content: string;
  returns_not_eligible_title: string;
  returns_not_eligible_content: string;
  returns_process_title: string;
  returns_process_step1: string;
  returns_process_step2: string;
  returns_process_step3: string;
  returns_process_step4: string;
  
  // Stock status
  stock_status_in_stock: string;
  stock_status_out_of_stock: string;
  stock_status_last_item: string;
  stock_status_low_stock: string;
  
  // Product actions
  products_actions_add_to_cart: string;
  products_actions_view_details: string;
  products_actions_buy_now: string;
  products_actions_add_to_favorites: string;
  products_actions_remove_from_favorites: string;

  // Language selector
  select_language: string;
  language_en: string;
  language_lt: string;
  language_ru: string;
  search_placeholder: string;
  search_among_items: string;
  search_count: string;
  search_no_results: string;

  // User roles
  super_admin: string;
  user: string;

  // Admin panel
  admin_panel_title: string;
  admin_users_title: string;
  admin_products_title: string;
  admin_categories_title: string;
  admin_reviews_title: string;
  admin_bulk_title: string;
  admin_settings_title: string;
  admin_users_management: string;
  admin_products_management: string;
  admin_categories_management: string;
  admin_reviews_management: string;
  admin_bulk_management: string;
  admin_export_products: string;
  admin_export_users: string;
  admin_export_orders: string;
  admin_import_products: string;
  admin_import_users: string;
  admin_save_button: string;
  admin_loading: string;
  admin_export_title: string;
  admin_export_description: string;
  export_products_description: string;
  export_users_description: string;
  export_orders_description: string;
  export: string;

  // Table actions
  actions: string;
  previous: string;
  next: string;
  showing: string;
  to: string;
  of: string;
  results: string;
  no_data: string;
  
  // Product in stock indicator
  product_in_stock: string;
  product_out_of_stock: string;
  product_added_to_cart: string;

  // Pages
  // About page
  about_page_title: string;
  about_page_subtitle: string;
  about_page_section1_title: string;
  about_page_section1_content: string;
  about_page_section2_title: string;
  about_page_section2_content: string;
  about_page_section3_title: string;
  about_page_section3_content: string;
  
  // Stats for About page
  about_happyCustomers: string;
  about_productsDelivered: string;
  about_satisfactionRate: string;
  
  // FAQ page
  faq_page_title: string;
  faq_page_subtitle: string;
  faq_general_section: string;
  faq_orders_section: string;
  faq_shipping_section: string;
  faq_returns_section: string;
  faq_question_1: string;
  faq_answer_1: string;
  faq_question_2: string;
  faq_answer_2: string;
  faq_question_3: string;
  faq_answer_3: string;
  faq_question_4: string;
  faq_answer_4: string;
  faq_question_5: string;
  faq_answer_5: string;
  faq_question_6: string;
  faq_answer_6: string;
  
  // Privacy Policy page
  privacy_page_title: string;
  privacy_page_subtitle: string;
  privacy_section1_title: string;
  privacy_section1_content: string;
  privacy_section2_title: string;
  privacy_section2_content: string;
  privacy_section3_title: string;
  privacy_section3_content: string;
  privacy_section4_title: string;
  privacy_section4_content: string;
  
  // Terms and Conditions page
  terms_page_title: string;
  terms_page_subtitle: string;
  terms_section1_title: string;
  terms_section1_content: string;
  terms_section2_title: string;
  terms_section2_content: string;
  terms_section3_title: string;
  terms_section3_content: string;
  terms_section4_title: string;
  terms_section4_content: string;
  
  // Contact page
  contact_page_title: string;
  contact_page_subtitle: string;
  contact_form_name: string;
  contact_form_email: string;
  contact_form_subject: string;
  contact_form_message: string;
  contact_form_submit: string;
  contact_success_message: string;
  contact_error_message: string;
  contact_info_title: string;
  contact_address_title: string;
  contact_phone_title: string;
  contact_email_title: string;
  contact_hours_title: string;
  contact_hours_content: string;
  
  // Shipping page
  shipping_page_title: string;
  shipping_page_subtitle: string;
  shipping_section1_title: string;
  shipping_section1_content: string;
  shipping_section2_title: string;
  shipping_section2_content: string;
  shipping_section3_title: string;
  shipping_section3_content: string;
  shipping_table_country: string;
  shipping_table_method: string;
  shipping_table_cost: string;
  shipping_table_time: string;
  
  // Support page
  support_page_title: string;
  support_page_subtitle: string;
  support_section1_title: string;
  support_section1_content: string;
  support_section2_title: string;
  support_section2_content: string;
  support_contact_title: string;
  support_contact_content: string;

  // User roles display
  user_role_admin: string;
  user_role_super_admin: string;
  user_role_user: string;
  
  // Export formats
  export_format_pdf: string;
  export_format_csv: string;
  export_format_excel: string;
  export_format_json: string;
  export_button: string;
  export_format_select: string;

  // Admin table and reviews
  all_ratings: string;
  rating: string;
  stars: string;
  comment: string;
  created: string;
  unknown_user: string;
};

// Define the translations object with language-specific values
export const translations: Record<Language, TranslationKeys> = {
  en: require('./en').en,
  lt: require('./lt').lt,
  ru: require('./ru').ru
};

// Export the type of translations
export type TranslationKey = keyof TranslationKeys; 