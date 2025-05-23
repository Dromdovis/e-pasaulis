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

  // Registration Banner
  close: 'Закрыть',
  register_special_offer: 'Специальное предложение',
  register_discount_description: 'Получите скидку на первую покупку',
  register_sign_up_now: 'Зарегистрируйтесь сейчас',
  register_new_customers_only: 'Только для новых клиентов',

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

  // Product related
  in_stock: 'В наличии',
  out_of_stock: 'Нет в наличии',
  add_to_cart: 'Добавить в корзину',
  continue_shopping: 'Продолжить покупки',
  product_specifications: 'Технические характеристики',
  write_review: 'Написать отзыв',
  submit_review: 'Отправить отзыв',
  update_review: 'Обновить отзыв',
  reviews: 'Отзывы',
  similar_products: 'Похожие продукты',
  sort_reviews: 'Сортировка отзывов',
  review_sort_newest: 'Сначала новые',
  review_sort_oldest: 'Сначала старые',
  review_sort_highest: 'С высоким рейтингом',
  review_sort_lowest: 'С низким рейтингом',
  no_reviews: 'Отзывов пока нет',
  login_to_review: 'Войдите, чтобы оставить отзыв',
  review_updated: 'Отзыв успешно обновлен',
  review_submitted: 'Отзыв успешно отправлен',
  error_submitting_review: 'Ошибка при отправке отзыва',
  error_loading_reviews: 'Ошибка при загрузке отзывов',
  product_details: 'Детали продукта',
  product_description: 'Описание',
  product_price: 'Цена',
  product_stock: 'Наличие',

  // Auth related
  email: 'Электронная почта',
  password: 'Пароль',
  confirm_password: 'Подтвердите пароль',
  name: 'Имя',
  logging_in: 'Выполняется вход',
  registering: 'Регистрация',
  dont_have_account: 'Нет аккаунта?',
  already_have_account: 'Уже есть аккаунт?',
  register_with_google: 'Зарегистрироваться с Google',
  
  // Login page
  login_title: 'Вход',
  login_email_placeholder: 'Электронная почта',
  login_password_placeholder: 'Пароль',
  login_button: 'Войти',
  login_with_google: 'Войти с Google',
  continue_with_google: 'Продолжить с Google',
  hide_password: 'Скрыть пароль',
  show_password: 'Показать пароль',
  google_login_failed: 'Не удалось войти с Google',
  
  // Register page
  register_title: 'Регистрация',
  register_name_placeholder: 'Полное имя',
  register_email_placeholder: 'Электронная почта',
  register_password_placeholder: 'Пароль',
  register_confirm_password_placeholder: 'Подтвердите пароль',
  register_button: 'Зарегистрироваться',
  or_use_google: 'Или используйте Google',
  failed_to_register_with_google: 'Не удалось зарегистрироваться с Google',

  // Profile
  profile_settings: 'Настройки профиля',
  profile_picture: 'Изображение профиля',
  change_picture: 'Изменить изображение',
  current_password: 'Текущий пароль',
  new_password: 'Новый пароль',
  update_password: 'Обновить пароль',
  updating: 'Обновление',
  profile_photo: 'Фото профиля',
  profile_change_photo: 'Изменить фото',
  profile_uploading: 'Загрузка...',
  profile_change_password: 'Изменить пароль',
  profile_current_password: 'Текущий пароль',
  profile_new_password: 'Новый пароль',
  profile_update_password: 'Обновить пароль',
  profile_updating: 'Обновление...',

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
  all_rights_reserved: 'Все права защищены',
  
  // Footer sections
  footer_about_us: 'О нас',
  footer_quick_links: 'Быстрые ссылки',
  footer_customer_service: 'Обслуживание клиентов',
  footer_contact_us: 'Связаться с нами',
  footer_copyright: 'Все права защищены',
  footer_about_description: 'Ваш надежный источник качественной электроники и компьютерных комплектующих.',
  footer_email: 'Электронная почта',
  footer_phone: 'Телефон',
  footer_address: 'Адрес',
  footer_social_media: 'Социальные сети',
  footer_shop: 'Магазин',
  footer_faq: 'ЧаВо',
  footer_returns: 'Возвраты',
  footer_support: 'Поддержка',
  footer_terms: 'Условия использования',
  footer_privacy: 'Политика конфиденциальности',
  footer_contact: 'Контакты',
  footer_shipping: 'Доставка',
  footer_about: 'О нас',

  // Additional translations
  sort_by: 'Сортировать по',
  price_low_high: 'Цена: по возрастанию',
  price_high_low: 'Цена: по убыванию',
  newest: 'Новинки',
  loading: 'Загрузка',
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
  invalid_credentials: 'Неверная электронная почта или пароль',
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
  
  // Filter options
  filter_title: 'Фильтры',
  filter_price_range: 'Диапазон цен',
  filter_in_stock_only: 'Только в наличии',
  filter_apply: 'Применить',
  filter_reset: 'Сбросить',
  filter_categories: 'Категории',
  filter_price_min: 'Мин',
  filter_price_max: 'Макс',
  filter_specifications: 'Характеристики товара',
  filter_clear_all: 'Очистить все',
  filter_no_specifications: 'Нет доступных характеристик',
  
  // Apply filters button
  apply_filters: 'Применить фильтры',
  active_filters: 'Активные фильтры',
  remove: 'Удалить',
  
  // Common specifications
  spec_brand: 'Бренд',
  spec_processor: 'Процессор',
  spec_memory: 'Память',
  spec_storage: 'Хранилище',
  spec_graphics: 'Видеокарта',
  spec_display: 'Дисплей',
  spec_keyboard: 'Клавиатура',
  spec_color: 'Цвет',
  spec_weight: 'Вес',
  spec_dimensions: 'Размеры',
  spec_battery: 'Батарея',
  spec_operating_system: 'Операционная система',
  spec_warranty: 'Гарантия',
  spec_connectivity: 'Подключение',
  spec_ports: 'Порты',
  spec_camera: 'Камера',
  spec_audio: 'Аудио',
  spec_screen_size: 'Размер экрана',
  spec_resolution: 'Разрешение',
  spec_refresh_rate: 'Частота обновления',
  spec_form_factor: 'Форм-фактор',
  spec_touch_screen: 'Сенсорный экран',
  spec_backlit_keyboard: 'Подсветка клавиатуры',
  spec_ssd: 'SSD',
  spec_hdd: 'HDD',
  spec_ram: 'RAM',
  spec_ram_type: 'Тип RAM',
  spec_cpu_cores: 'Количество ядер CPU',
  spec_cpu_speed: 'Частота CPU',
  spec_gpu_memory: 'Память GPU',

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

  // Stock status
  stock_status_in_stock: '{{count}} в наличии',
  stock_status_out_of_stock: 'Нет в наличии',
  stock_status_last_item: 'Последний экземпляр',
  stock_status_low_stock: 'Осталось всего {{count}}',
  
  // Product actions
  products_actions_add_to_cart: 'Добавить в корзину',
  products_actions_view_details: 'Просмотреть детали',
  products_actions_buy_now: 'Купить сейчас',
  products_actions_add_to_favorites: 'Добавить в избранное',
  products_actions_remove_from_favorites: 'Удалить из избранного',

  // Language selector
  select_language: 'RU',
  language_en: 'Английский',
  language_lt: 'Литовский',
  language_ru: 'Русский',
  
  // Search
  search_placeholder: 'Поиск...',
  search_among_items: 'Искать среди {{count}} товаров...',
  search_count: 'Найдено {{count}} результатов',
  search_no_results: 'Результатов не найдено',

  // User roles
  super_admin: 'Супер Администратор',
  user: 'Пользователь',

  // Admin panel
  admin_panel_title: 'Панель администратора',
  admin_users_title: 'Пользователи',
  admin_products_title: 'Продукты',
  admin_categories_title: 'Категории',
  admin_reviews_title: 'Отзывы',
  admin_bulk_title: 'Массовые операции',
  admin_settings_title: 'Настройки',
  admin_users_management: 'Управление пользователями',
  admin_products_management: 'Управление продуктами',
  admin_categories_management: 'Управление категориями',
  admin_reviews_management: 'Мониторинг отзывов',
  admin_bulk_management: 'Массовые операции',
  admin_export_products: 'Экспорт продуктов',
  admin_export_users: 'Экспорт пользователей',
  admin_export_orders: 'Экспорт заказов',
  admin_import_products: 'Импорт продуктов',
  admin_import_users: 'Импорт пользователей',
  admin_save_button: 'Сохранить',
  admin_loading: 'Загрузка...',
  admin_export_title: 'Экспорт',
  admin_export_description: 'Экспортируйте данные в формате CSV для резервных копий или внешней обработки',
  export_products_description: 'Экспортируйте каталог продуктов в формате CSV. Этот файл можно использовать для резервных копий или массового редактирования.',
  export_users_description: 'Экспортируйте базу данных пользователей в формате CSV. Конфиденциальная информация, например пароли, не включается.',
  export_orders_description: 'Экспортируйте данные о заказах для учета, выполнения или анализа.',
  export: 'Экспорт',

  // Pages
  // About page
  about_page_title: 'О E-Pasaulis',
  about_page_subtitle: 'Ваш надежный источник качественной электроники',
  about_page_section1_title: 'Наша история',
  about_page_section1_content: 'Основанная в 2020 году, компания E-Pasaulis родилась из страсти к технологиям и желания предоставить качественную электронику клиентам по всей Литве и за ее пределами. То, что начиналось как небольшой интернет-магазин, выросло в надежное место для энтузиастов технологий и повседневных пользователей.',
  about_page_section2_title: 'Наша миссия',
  about_page_section2_content: 'В E-Pasaulis наша миссия заключается в том, чтобы сделать высококачественные технологии доступными для всех. Мы тщательно отбираем каждый продукт в нашем ассортименте, гарантируя, что он соответствует нашим высоким стандартам качества, эффективности и ценности. Мы верим, что каждый заслуживает надежных технологий, которые улучшают повседневную жизнь.',
  about_page_section3_title: 'Наша команда',
  about_page_section3_content: 'Наша команда состоит из страстных технологических экспертов, которые стремятся обеспечить наилучший опыт покупок для наших клиентов. От наших специалистов по продуктам, которые курируют наш ассортимент, до нашей команды обслуживания клиентов, которая всегда готова помочь, все в E-Pasaulis привержены стремлению к совершенству.',
  
  // FAQ page
  faq_page_title: 'Часто задаваемые вопросы',
  faq_page_subtitle: 'Ответы на наиболее распространенные вопросы о нашем магазине и услугах',
  faq_general_section: 'Общие вопросы',
  faq_orders_section: 'Заказы',
  faq_shipping_section: 'Доставка',
  faq_returns_section: 'Возвраты',
  faq_question_1: 'Как создать учетную запись?',
  faq_answer_1: 'Чтобы создать учетную запись, нажмите на кнопку "Регистрация" в верхнем правом углу страницы. Заполните необходимую информацию и следуйте инструкциям для завершения процесса регистрации.',
  faq_question_2: 'Как отследить мой заказ?',
  faq_answer_2: 'После размещения заказа вы получите электронное письмо с подтверждением и номером для отслеживания. Вы можете использовать этот номер на нашем сайте в разделе "Отслеживание заказа" или в своем профиле, чтобы проверить статус вашего заказа.',
  faq_question_3: 'Какие способы оплаты вы принимаете?',
  faq_answer_3: 'Мы принимаем различные способы оплаты, включая кредитные/дебетовые карты (Visa, MasterCard, American Express), PayPal, банковские переводы и оплату при получении (для определенных регионов).',
  faq_question_4: 'Как долго занимает доставка?',
  faq_answer_4: 'Время доставки зависит от вашего местоположения и выбранного способа доставки. Обычно стандартная доставка занимает 3-7 рабочих дней, а экспресс-доставка - 1-3 рабочих дня. Международные заказы могут занять 7-14 рабочих дней.',
  faq_question_5: 'Как вернуть товар?',
  faq_answer_5: 'Если вы хотите вернуть товар, пожалуйста, свяжитесь с нашей службой поддержки в течение 14 дней с момента получения. Мы предоставим вам инструкции по возврату и номер разрешения на возврат (RMA). Обратите внимание, что товар должен быть в оригинальной упаковке и в неиспользованном состоянии.',
  faq_question_6: 'Предоставляете ли вы международную доставку?',
  faq_answer_6: 'Да, мы осуществляем доставку в большинство стран мира. Стоимость и время доставки зависят от страны назначения. Вы можете увидеть доступные варианты доставки и их стоимость во время оформления заказа.',
  
  // Privacy Policy page
  privacy_page_title: 'Политика конфиденциальности',
  privacy_page_subtitle: 'Как мы собираем, используем и защищаем вашу персональную информацию',
  privacy_section1_title: 'Сбор информации',
  privacy_section1_content: 'Мы собираем личные данные, такие как ваше имя, адрес электронной почты, адрес доставки и платежные данные, когда вы размещаете заказ или создаете учетную запись. Мы также собираем неперсональные данные, такие как тип браузера, IP-адрес и файлы cookie, чтобы улучшить ваш опыт просмотра.',
  privacy_section2_title: 'Использование информации',
  privacy_section2_content: 'Мы используем вашу личную информацию для обработки заказов, предоставления обслуживания клиентов и отправки важных обновлений о ваших покупках. С вашего согласия мы также можем использовать вашу информацию для отправки маркетинговых сообщений о наших продуктах и акциях.',
  privacy_section3_title: 'Безопасность данных',
  privacy_section3_content: 'Мы применяем различные меры безопасности для обеспечения безопасности вашей личной информации. Ваша личная информация находится за защищенными сетями и доступна только ограниченному числу лиц, имеющих специальные права доступа.',
  privacy_section4_title: 'Ваши права',
  privacy_section4_content: 'Вы имеете право в любое время получать доступ, исправлять или удалять свою личную информацию. Вы также можете отказаться от получения маркетинговых сообщений от нас. Чтобы воспользоваться этими правами, обратитесь в нашу службу поддержки клиентов.',
  
  // Terms and Conditions page
  terms_page_title: 'Условия использования',
  terms_page_subtitle: 'Пожалуйста, внимательно прочитайте эти условия перед использованием наших услуг',
  terms_section1_title: 'Принятие условий',
  terms_section1_content: 'Получая доступ или используя наш веб-сайт, вы соглашаетесь соблюдать настоящие Условия использования и все применимые законы и правила. Если вы не согласны с какими-либо из этих условий, вам запрещено использовать или получать доступ к этому сайту.',
  terms_section2_title: 'Продукты и цены',
  terms_section2_content: 'Все продукты зависят от наличия. Мы оставляем за собой право прекратить выпуск любого продукта в любое время. Цены на наши продукты могут быть изменены без предварительного уведомления. Мы оставляем за собой право отклонить любой заказ, размещенный у нас.',
  terms_section3_title: 'Учетные записи пользователей',
  terms_section3_content: 'Когда вы создаете учетную запись у нас, вы должны предоставлять точную, полную и актуальную информацию в любое время. Невыполнение этого требования является нарушением Условий, что может привести к немедленному прекращению действия вашей учетной записи.',
  terms_section4_title: 'Интеллектуальная собственность',
  terms_section4_content: 'Содержание, дизайн и макет нашего веб-сайта, включая, но не ограничиваясь текстом, графикой, логотипами и изображениями, принадлежат или лицензированы E-Pasaulis и защищены законами об авторском праве и товарных знаках.',
  
  // Contact page
  contact_page_title: 'Свяжитесь с нами',
  contact_page_subtitle: 'Мы здесь, чтобы помочь с любыми вопросами или проблемами',
  contact_form_name: 'Ваше имя',
  contact_form_email: 'Адрес электронной почты',
  contact_form_subject: 'Тема',
  contact_form_message: 'Сообщение',
  contact_form_submit: 'Отправить сообщение',
  contact_success_message: 'Ваше сообщение было успешно отправлено. Мы свяжемся с вами в ближайшее время.',
  contact_error_message: 'Произошла ошибка при отправке вашего сообщения. Пожалуйста, попробуйте еще раз.',
  contact_info_title: 'Контактная информация',
  contact_address_title: 'Наш адрес',
  contact_phone_title: 'Телефон',
  contact_email_title: 'Электронная почта',
  contact_hours_title: 'Часы работы',
  contact_hours_content: 'Понедельник - Пятница: 9:00 - 18:00\nСуббота: 10:00 - 16:00\nВоскресенье: Выходной',
  
  // Shipping page
  shipping_page_title: 'Информация о доставке',
  shipping_page_subtitle: 'Все, что вам нужно знать о наших правилах доставки',
  shipping_section1_title: 'Способы доставки',
  shipping_section1_content: 'Мы предлагаем различные способы доставки для удовлетворения ваших потребностей, включая стандартную доставку, экспресс-доставку и международную доставку. Доступность этих вариантов может варьироваться в зависимости от вашего местоположения.',
  shipping_section2_title: 'Время обработки',
  shipping_section2_content: 'Заказы обычно обрабатываются в течение 1-2 рабочих дней. В пиковые сезоны или рекламные периоды время обработки может быть дольше. Мы уведомим вас, если возникнут задержки с обработкой вашего заказа.',
  shipping_section3_title: 'Отслеживание вашего заказа',
  shipping_section3_content: 'После отправки вашего заказа вы получите электронное письмо с подтверждением с номером для отслеживания. Вы можете использовать этот номер для отслеживания вашего заказа на нашем веб-сайте или непосредственно на сайте курьера.',
  shipping_table_country: 'Страна',
  shipping_table_method: 'Способ доставки',
  shipping_table_cost: 'Стоимость',
  shipping_table_time: 'Время доставки',
  
  // Support page
  support_page_title: 'Поддержка клиентов',
  support_page_subtitle: 'Мы здесь, чтобы помочь вам с любыми проблемами или вопросами',
  support_section1_title: 'Техническая поддержка',
  support_section1_content: 'Если у вас возникли технические проблемы с продуктом, наша команда технической поддержки готова помочь вам. Пожалуйста, предоставьте как можно больше информации о проблеме, включая модель продукта и когда началась проблема.',
  support_section2_title: 'Поддержка заказов',
  support_section2_content: 'Если у вас есть вопросы о вашем заказе, включая обновления статуса, изменения или отмены, обратитесь в нашу службу поддержки заказов. Подготовьте номер вашего заказа, чтобы мы могли быстрее предоставить помощь.',
  support_contact_title: 'Связаться с поддержкой',
  support_contact_content: 'Вы можете связаться с нашей командой поддержки по электронной почте support@e-pasaulis.lt или по телефону +370 600 00000 в рабочее время.',

  // Returns page detailed
  returns_page_title: 'Возвраты и возмещения',
  returns_page_subtitle: 'Наше полное руководство по возврату товаров и получению возмещений',
  returns_section1_title: 'Политика возврата',
  returns_section1_content: 'В E-Pasaulis мы хотим, чтобы вы были полностью удовлетворены своей покупкой. Если это не так, мы предлагаем простой процесс возврата. Вы можете вернуть большинство товаров, приобретенных у нас, в течение 14 дней с момента доставки для полного возмещения стоимости покупки.',
  returns_section2_title: 'Обработка возмещения',
  returns_section2_content: 'После получения и проверки вашего возврата мы отправим вам электронное письмо с уведомлением о том, что мы получили ваш возвращенный товар. Мы также уведомим вас об одобрении или отклонении вашего возмещения. Если одобрено, ваше возмещение будет обработано, и кредит будет автоматически применен к вашему первоначальному способу оплаты в течение 5-7 рабочих дней.',
  returns_section3_title: 'Обратная доставка',
  returns_section3_content: 'Вы будете ответственны за оплату собственных расходов на доставку при возврате товара. Стоимость доставки не возмещается. Если вы получаете возмещение, стоимость обратной доставки будет вычтена из вашего возмещения.',
  returns_eligible_title: 'Товары, подлежащие возврату',
  returns_eligible_content: 'Большинство новых, неиспользованных товаров в их оригинальной упаковке подлежат возврату. Некоторые продукты имеют особые требования к возврату, которые будут указаны на странице продукта. Если у вас есть вопросы о том, подлежит ли товар возврату, пожалуйста, свяжитесь с службой поддержки клиентов перед совершением покупки.',
  returns_not_eligible_title: 'Товары, не подлежащие возврату',
  returns_not_eligible_content: 'Следующие предметы не могут быть возвращены: открытое программное обеспечение, загружаемые продукты, подарочные карты, некоторые предметы личной гигиены и товары специального заказа. Кроме того, любой товар, который возвращается более чем через 14 дней после доставки, или поврежден, использован или отсутствуют части, не подлежит возврату.',
  returns_process_title: 'Процесс возврата',
  returns_process_step1: '1. Начните процесс возврата, войдя в свою учетную запись и выбрав заказ, содержащий товар, который вы хотите вернуть.',
  returns_process_step2: '2. Выберите товары, которые вы хотите вернуть, и укажите причину возврата.',
  returns_process_step3: '3. Распечатайте этикетку для обратной отправки и форму авторизации возврата, которые будут отправлены вам по электронной почте.',
  returns_process_step4: '4. Надежно упакуйте товар в его оригинальную упаковку, если это возможно, включите форму авторизации возврата и прикрепите этикетку для обратной отправки к внешней стороне упаковки.',

  // Table actions
  actions: 'Действия',
  previous: 'Предыдущая',
  next: 'Следующая',
  showing: 'Показано',
  to: 'до',
  of: 'из',
  results: 'результатов',
  no_data: 'Нет данных',
  
  // Product in stock indicator
  product_in_stock: 'В наличии: {{count}}',
  product_out_of_stock: 'Нет в наличии',
  product_added_to_cart: 'Товар добавлен в корзину',

  // Stats for About page
  about_happyCustomers: 'Довольных клиентов',
  about_productsDelivered: 'Доставленных товаров',
  about_satisfactionRate: 'Уровень удовлетворенности',
  
  // User roles display
  user_role_admin: 'Администратор',
  user_role_super_admin: 'Супер администратор',
  user_role_user: 'Пользователь',
  
  // Export formats
  export_format_pdf: 'PDF',
  export_format_csv: 'CSV',
  export_format_excel: 'Excel',
  export_format_json: 'JSON',
  export_button: 'Экспорт',
  export_format_select: 'Выберите формат',

  // Admin table and reviews
  all_ratings: 'Все оценки',
  rating: 'Оценка',
  stars: 'звезд',
  comment: 'Комментарий',
  created: 'Создано',
  unknown_user: 'Неизвестный пользователь'
}; 