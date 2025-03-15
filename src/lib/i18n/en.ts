import type { TranslationKeys } from './translations';

export const en: TranslationKeys = {
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
  settings: 'Settings',
  logged_in_as: 'Logged in as',

  // Theme
  theme_switch_light: 'Switch to Light Theme',
  theme_switch_dark: 'Switch to Dark Theme',

  // Registration Banner
  close: 'Close',
  'register.specialOffer': 'Special Offer',
  'register.discountDescription': 'Get a discount on your first purchase',
  'register.signUpNow': 'Sign Up Now',
  'register.newCustomersOnly': 'New customers only',

  // Admin panel
  dashboard: 'Dashboard',
  orders: 'Orders',
  access_denied: 'Access Denied',
  access_denied_message: 'You do not have permission to access the admin panel.',
  return_to_home: 'Return to Home',
  bulk_operations: 'Bulk Operations',
  admin_dashboard: 'Admin Dashboard',
  manage_users: 'Manage Users',
  manage_products: 'Manage Products',
  manage_categories: 'Manage Categories',
  monitor_reviews: 'Monitor Reviews',
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
  register_with_google: 'Register with Google',

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
  server_unavailable: 'Server unavailable',
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
  invalid_price_range_order: 'Maximum price must be greater than minimum price',

  // Returns page
  return_policy: 'Return Policy',
  return_policy_description: 'Our return policy is simple and flexible',
  return_policy_point_1: 'You can return an item within 14 days of receipt',
  return_policy_point_2: 'The item must be undamaged and in its original packaging',
  return_policy_point_3: 'We refund the full amount excluding shipping costs',
  return_process: 'Return Process',
  return_process_step_1: 'Contact customer service',
  return_process_step_2: 'Get a return authorization',
  return_process_step_3: 'Ship the item to the specified address',
  return_process_step_4: 'Once we receive the item, we will process your refund',

  // New translations
  select_language: 'EN',
  language_en: 'English',
  language_lt: 'Lithuanian',
  search_placeholder: 'Search among {{count}} products...',

  // User roles
  super_admin: 'Super Administrator',
  user: 'User'
} as const; 