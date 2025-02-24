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
  product_not_found: 'Product not found'
} as const; 