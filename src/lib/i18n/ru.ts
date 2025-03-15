import type { TranslationKeys } from './translations';

/**
 * Russian translations
 */
export const ru: TranslationKeys = {
  // Navigation
  home: 'Главная',
  login: 'Вход',
  register: 'Регистрация',
  logout: 'Выход',
  profile: 'Профиль',
  cart: 'Корзина',
  favorites: 'Избранное',
  filter: 'Фильтр',
  search: 'Поиск',
  admin_panel: 'Панель администратора',
  users: 'Пользователи',
  products: 'Продукты',
  settings: 'Настройки',
  logged_in_as: 'Вы вошли как',

  // Theme
  theme_switch_light: 'Переключить на светлую тему',
  theme_switch_dark: 'Переключить на темную тему',

  // Admin panel
  dashboard: 'Панель управления',
  orders: 'Заказы',
  access_denied: 'Доступ запрещен',
  access_denied_message: 'У вас нет разрешения на доступ к панели администратора.',
  return_to_home: 'Вернуться на главную',
  bulk_operations: 'Массовые операции',
  admin_dashboard: 'Панель администратора',
  manage_users: 'Управление пользователями',
  manage_products: 'Управление продуктами',
  manage_categories: 'Управление категориями',
  monitor_reviews: 'Мониторинг отзывов',
  import_export: 'Импорт/Экспорт',
  admin_users_description: 'Управление учетными записями, ролями и разрешениями пользователей',
  admin_products_description: 'Добавление, редактирование и управление списками продуктов',
  admin_categories_description: 'Организация и структурирование категорий продуктов',
  admin_reviews_description: 'Мониторинг и модерация отзывов о продуктах',
  admin_bulk_description: 'Импорт/экспорт данных и выполнение массовых операций',

  // Categories
  categories: 'Категории',
  laptops: 'Ноутбуки',
  desktops: 'Настольные компьютеры',
  phones: 'Мобильные телефоны',
  tablets: 'Планшеты',
  monitors: 'Мониторы',
  keyboards: 'Клавиатуры',
  mice: 'Мыши',
  headphones: 'Наушники',
  graphics_cards: 'Видеокарты',
  processors: 'Процессоры',
  memory: 'Оперативная память',
  storage: 'Накопители',
  power_supplies: 'Блоки питания',
  cooling: 'Охлаждение',
  cases: 'Корпуса',
  motherboards: 'Материнские платы',
  networking: 'Сетевое оборудование',
  software: 'Программное обеспечение',
  gaming: 'Игровое оборудование',
  printers: 'Принтеры',

  // Auth related
  email: 'Электронная почта',
  password: 'Пароль',
  confirm_password: 'Подтвердите пароль',
  name: 'Имя',
  logging_in: 'Выполняется вход...',
  registering: 'Регистрация...',
  already_have_account: 'Уже есть аккаунт? Войти',
  dont_have_account: 'Нет аккаунта? Зарегистрироваться',
  invalid_credentials: 'Неверная электронная почта или пароль',
  register_with_google: 'Зарегистрироваться с Google',

  // Product related
  in_stock: 'В наличии',
  out_of_stock: 'Нет в наличии',
  add_to_cart: 'Добавить в корзину',
  continue_shopping: 'Продолжить покупки',
  productSpecifications: 'Технические характеристики',
  writeReview: 'Написать отзыв',
  submitReview: 'Отправить отзыв',
  updateReview: 'Обновить отзыв',
  reviews: 'Отзывы',
  similarProducts: 'Похожие продукты',
  sortReviews: 'Сортировка отзывов',
  reviewSortNewest: 'Сначала новые',
  reviewSortOldest: 'Сначала старые',
  reviewSortHighest: 'С высоким рейтингом',
  reviewSortLowest: 'С низким рейтингом',
  noReviews: 'Отзывов пока нет',
  loginToReview: 'Войдите, чтобы оставить отзыв',
  reviewUpdated: 'Отзыв успешно обновлен',
  reviewSubmitted: 'Отзыв успешно отправлен',
  errorSubmittingReview: 'Ошибка при отправке отзыва',
  errorLoadingReviews: 'Ошибка при загрузке отзывов',
  product_details: 'Детали продукта',
  product_description: 'Описание',
  product_price: 'Цена',
  product_stock: 'Наличие',

  // Profile
  profile_settings: 'Настройки профиля',
  profile_picture: 'Изображение профиля',
  change_picture: 'Изменить изображение',
  current_password: 'Текущий пароль',
  new_password: 'Новый пароль',
  update_password: 'Обновить пароль',
  updating: 'Обновление...',

  // Footer
  about_us: 'О нас',
  about_description: 'Ваш надежный источник качественной электроники и компьютерных комплектующих.',
  quick_links: 'Быстрые ссылки',
  about: 'О компании',
  contact: 'Контакты',
  shipping_info: 'Информация о доставке',
  customer_service: 'Обслуживание клиентов',
  faq: 'ЧаВо',
  returns: 'Возвраты',
  support: 'Поддержка',
  contact_us: 'Связаться с нами',
  phone: 'Телефон',
  address: 'Адрес',
  all_rights_reserved: 'Все права защищены.',

  // Additional translations
  sort_by: 'Сортировать по',
  price_low_high: 'Цена: по возрастанию',
  price_high_low: 'Цена: по убыванию',
  newest: 'Новинки',
  loading: 'Загрузка...',
  load_more: 'Загрузить еще',

  // Form
  select_category: 'Выберите категорию',

  // Admin
  admin: {
    products: {
      edit: 'Редактировать продукт',
      productImage: 'Изображение продукта',
      uploadImage: 'Загрузить изображение'
    }
  },

  // Error messages
  registration_failed: 'Регистрация не удалась. Пожалуйста, проверьте ваши данные.',
  passwords_dont_match: 'Пароли не совпадают',
  email_already_exists: 'Такой email уже существует',
  invalid_email: 'Неверный формат email',
  password_too_short: 'Пароль должен содержать не менее 8 символов',
  name_required: 'Имя обязательно',
  email_required: 'Email обязателен',
  password_required: 'Пароль обязателен',
  invalid_email_format: 'Неверный формат электронной почты',
  server_unavailable: 'Сервер недоступен',
  username_already_exists: 'Имя пользователя уже занято',

  // Error handling
  try_again: 'Попробовать снова',
  error_loading: 'Ошибка при загрузке',

  // Search
  search_products: 'Поиск продуктов',
  search_results_for: 'Результаты поиска',
  no_results_found: 'Результаты не найдены',
  no_products_found: 'Продукты не найдены',
  
  // Error messages
  something_went_wrong: 'Что-то пошло не так',
  product_not_found: 'Продукт не найден',

  // Favorites
  add_to_favorites: 'Добавить в избранное',
  remove_from_favorites: 'Удалить из избранного',

  // Sort options
  sort_newest: 'Новейшие',
  sort_price_low_high: 'Цена: от низкой к высокой',
  sort_price_high_low: 'Цена: от высокой к низкой',
  sort_name_a_z: 'Название: А-Я',
  sort_name_z_a: 'Название: Я-А',

  // New translations
  edit: 'Редактировать',
  delete: 'Удалить',
  review_updated: 'Отзыв успешно обновлен',
  review_deleted: 'Отзыв успешно удален',
  review_error: 'Не удалось отправить отзыв. Пожалуйста, попробуйте еще раз.',
  delete_confirm: 'Вы уверены, что хотите удалить этот отзыв?',
  error_deleting_review: 'Ошибка при удалении отзыва',
  cancel: 'Отмена',
  confirm: 'Подтвердить',

  // Price range
  price_range: 'Диапазон цен',
  invalid_price_range_negative: 'Цена не может быть отрицательной',
  invalid_price_range_order: 'Максимальная цена должна быть больше минимальной',

  // Returns page
  return_policy: 'Политика возврата',
  return_policy_description: 'Наша политика возврата проста и удобна',
  return_policy_point_1: 'Вы можете вернуть товар в течение 14 дней с момента получения',
  return_policy_point_2: 'Товар должен быть неповрежденным и в оригинальной упаковке',
  return_policy_point_3: 'Мы возвращаем полную стоимость, за исключением стоимости доставки',
  return_process: 'Процесс возврата',
  return_process_step_1: 'Свяжитесь с службой поддержки клиентов',
  return_process_step_2: 'Получите подтверждение возврата',
  return_process_step_3: 'Отправьте товар по указанному адресу',
  return_process_step_4: 'После получения товара мы вернем вам деньги',

  // New translations
  select_language: 'RU',
  language_en: 'Английский',
  language_lt: 'Литовский',
  search_placeholder: 'Поиск среди {{count}} товаров...',

  // User roles
  super_admin: 'Супер Администратор',
  user: 'Пользователь',

  // Registration Banner
  close: 'Закрыть',
  'register.specialOffer': 'Специальное предложение',
  'register.discountDescription': 'Получите скидку на первую покупку',
  'register.signUpNow': 'Зарегистрируйтесь сейчас',
  'register.newCustomersOnly': 'Только для новых клиентов'
}; 