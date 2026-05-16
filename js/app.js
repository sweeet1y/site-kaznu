/* ==========================================
   EduFlow LMS — app.js  v8
   All issues fixed:
   1. Notifications: only NEW REGISTRATIONS trigger red dot
   2. Assignments/Quizzes/Grades fully functional
   3. openEmptyForm removed from admin courses
   4. Page persists on refresh (sessionStorage)
   5. LocalStorage note removed from profile
   6. Register page layout fixed
   7. Courses connected: seed data + teacher creates → main page
   ========================================== */

const LS = {
  ROLE:      'lms_role',
  NAME:      'lms_name',
  USERS:     'lms_users',
  SETTINGS:  'lms_settings',
  ACTIVITY:  'lms_activity',
  COURSES:   'lms_courses',       // все курсы платформы
  ENROLLED:  'lms_enrolled',      // {userId:[courseId,...]}
  ASSIGNMENTS:'lms_assignments',  // задания
  QUIZZES:   'lms_quizzes',       // тесты
  SUBMISSIONS:'lms_submissions',  // сданные работы
  GRADES:    'lms_grades',        // оценки
  NOTIF_READ:'lms_notif_read',
  LAST_PAGE: 'lms_last_page',
  COURSE_REQUESTS:'lms_course_requests',
  TEACHER_COURSES:'lms_teacher_courses',
  SURVEY_RESULTS: 'lms_survey_results',
  SURVEY_DONE:    'lms_survey_done',
  ACHIEVEMENTS:   'lms_achievements',
  DISMISSED_REJECTS:'lms_dismissed_rejects',
  EVENTS:          'lms_events',
  EVENT_REQUESTS:  'lms_event_requests',
};

/* ── SVG иконки ── */
const SVG = {
  home:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  users:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  book:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  chart:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  settings:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  folder:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  clipboard:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>`,
  quiz:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  award:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  logout:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  bell:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  search:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  download:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  plus:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  check:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>`,
  user:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  activity:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>`,
  trendUp:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>`,
  upload:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  star:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
};

/* ===========================================================
   ДАННЫЕ: SEED-КУРСЫ (предустановленные, от Препод_1)
   Загружаются один раз и хранятся в localStorage.
=========================================================== */
const SEED_COURSES = [
  { id:'c_ai_intro', title:'Основы искусственного интеллекта', category:'ИИ / МО', level:'Начальный', levelClass:'badge-success', teacher:'Кафедра ИИ и Big Data', teacherLogin:'КафедраИИ_КазНУ', rating:4.9, studentsCount:120, hours:72, modules:6, lessons:34, grad:'linear-gradient(135deg,#6366f1,#4338ca)', icon:'ai', desc:'Фундаментальный курс по ИИ: история, концепции, алгоритмы поиска, экспертные системы и современные подходы. Без предварительных знаний в программировании.', tags:['ИИ','Введение','Python'], outcomes:['Понимать ключевые парадигмы ИИ','Применять алгоритмы поиска и оптимизации','Строить простые экспертные системы','Оценивать применимость ИИ в конкретных задачах'], program:[{n:1,name:'История и парадигмы ИИ',l:5,h:'10'},{n:2,name:'Алгоритмы поиска',l:6,h:'12'},{n:3,name:'Логика и знания',l:5,h:'11'},{n:4,name:'Машинное обучение: обзор',l:6,h:'14'},{n:5,name:'Нейронные сети: введение',l:6,h:'14'},{n:6,name:'Применение ИИ на практике',l:6,h:'11'}], status:'published', createdAt:'2024-01-01T00:00:00.000Z' },
  { id:'c_ml1', title:'Машинное обучение I', category:'ИИ / МО', level:'Средний', levelClass:'badge-warning', teacher:'Кафедра ИИ и Big Data', teacherLogin:'КафедраИИ_КазНУ', rating:4.8, studentsCount:88, hours:72, modules:5, lessons:28, grad:'linear-gradient(135deg,#3b82f6,#1d4ed8)', icon:'ml', desc:'Классические алгоритмы МО: регрессия, классификация, деревья решений, SVM, кластеризация. Реализация на scikit-learn с разбором математики.', tags:['ML','scikit-learn','Python'], outcomes:['Применять алгоритмы классификации и регрессии','Оценивать качество моделей по ключевым метрикам','Выполнять предобработку и feature engineering','Выбирать алгоритм под задачу'], program:[{n:1,name:'Линейные модели',l:6,h:'14'},{n:2,name:'Деревья решений и ансамбли',l:6,h:'14'},{n:3,name:'SVM и KNN',l:5,h:'12'},{n:4,name:'Кластеризация',l:5,h:'14'},{n:5,name:'Оценка моделей и проект',l:6,h:'18'}], status:'published', createdAt:'2024-01-02T00:00:00.000Z' },
  { id:'c_dl', title:'Глубокое обучение', category:'ИИ / МО', level:'Продвинутый', levelClass:'badge-danger', teacher:'Кафедра ИИ и Big Data', teacherLogin:'КафедраИИ_КазНУ', rating:4.8, studentsCount:54, hours:72, modules:5, lessons:26, grad:'linear-gradient(135deg,#7c3aed,#5b21b6)', icon:'dl', desc:'Архитектуры нейронных сетей: MLP, CNN, RNN/LSTM, Transformer. PyTorch с нуля, обучение на GPU, transfer learning и дообучение.', tags:['PyTorch','CNN','Transformer'], outcomes:['Реализовывать нейросети на PyTorch','Обучать CNN для задач CV','Применять RNN/LSTM для последовательностей','Использовать transfer learning'], program:[{n:1,name:'Основы нейронных сетей и PyTorch',l:6,h:'14'},{n:2,name:'CNN и компьютерное зрение',l:5,h:'14'},{n:3,name:'RNN, LSTM, GRU',l:5,h:'14'},{n:4,name:'Transformer и Attention',l:5,h:'16'},{n:5,name:'Transfer Learning и проект',l:5,h:'14'}], status:'published', createdAt:'2024-01-03T00:00:00.000Z' },
  { id:'c_nlp', title:'NLP и анализ текстовых данных', category:'NLP', level:'Средний', levelClass:'badge-warning', teacher:'Кафедра ИИ и Big Data', teacherLogin:'КафедраИИ_КазНУ', rating:4.9, studentsCount:67, hours:72, modules:6, lessons:30, grad:'linear-gradient(135deg,#10b981,#047857)', icon:'nlp', desc:'Полный курс NLP: токенизация, эмбеддинги (Word2Vec, fastText), тематическое моделирование, классификация текста и работа с казахскоязычными данными.', tags:['NLP','BERT','Казахский'], outcomes:['Предобрабатывать и токенизировать тексты','Строить и обучать эмбеддинги','Применять BERT/GPT к задачам NLP','Работать с казахскоязычными корпусами'], program:[{n:1,name:'Основы NLP и предобработка',l:5,h:'11'},{n:2,name:'Word2Vec, fastText, GloVe',l:5,h:'12'},{n:3,name:'Классификация текста',l:5,h:'13'},{n:4,name:'Seq2Seq и генерация',l:5,h:'13'},{n:5,name:'BERT и Transformer-модели',l:5,h:'13'},{n:6,name:'Казахский NLP: ресурсы и практика',l:5,h:'10'}], status:'published', createdAt:'2024-01-04T00:00:00.000Z' },
  { id:'c_ds', title:'Наука о данных: базовый курс', category:'Наука о данных', level:'Начальный', levelClass:'badge-success', teacher:'Кафедра ИИ и Big Data', teacherLogin:'КафедраИИ_КазНУ', rating:4.7, studentsCount:145, hours:72, modules:5, lessons:32, grad:'linear-gradient(135deg,#f59e0b,#b45309)', icon:'data', desc:'Полный цикл Data Science: сбор, очистка, анализ и визуализация данных. Python, Pandas, Matplotlib, Seaborn и основы статистики.', tags:['Python','Pandas','EDA'], outcomes:['Загружать и очищать реальные датасеты','Выполнять EDA и статистический анализ','Строить интерактивные визуализации','Оформлять аналитические отчёты'], program:[{n:1,name:'Python для Data Science',l:6,h:'13'},{n:2,name:'Pandas и NumPy',l:7,h:'16'},{n:3,name:'Очистка и предобработка данных',l:6,h:'14'},{n:4,name:'Визуализация: Matplotlib и Seaborn',l:7,h:'16'},{n:5,name:'Итоговый проект',l:6,h:'13'}], status:'published', createdAt:'2024-01-05T00:00:00.000Z' },
  { id:'c_mlops', title:'MLOps', category:'MLOps', level:'Продвинутый', levelClass:'badge-danger', teacher:'Кафедра ИИ и Big Data', teacherLogin:'КафедраИИ_КазНУ', rating:4.7, studentsCount:39, hours:72, modules:5, lessons:24, grad:'linear-gradient(135deg,#ec4899,#9d174d)', icon:'mlops', desc:'MLOps на практике: CI/CD для ML, MLflow, DVC, Docker, Kubernetes, мониторинг моделей и автоматизация пайплайнов обучения и деплоя.', tags:['MLflow','Docker','CI/CD'], outcomes:['Строить ML-пайплайны с DVC и MLflow','Контейнеризировать модели с Docker','Настраивать CI/CD для ML-проектов','Мониторить качество моделей в production'], program:[{n:1,name:'Введение в MLOps и MLflow',l:5,h:'14'},{n:2,name:'Версионирование данных с DVC',l:5,h:'14'},{n:3,name:'Docker и контейнеризация',l:5,h:'14'},{n:4,name:'CI/CD и автоматизация',l:5,h:'16'},{n:5,name:'Мониторинг и проект',l:4,h:'14'}], status:'published', createdAt:'2024-01-06T00:00:00.000Z' },
  { id:'c_llm', title:'LLM и генеративный ИИ', category:'ИИ / МО', level:'Продвинутый', levelClass:'badge-danger', teacher:'Кафедра ИИ и Big Data', teacherLogin:'КафедраИИ_КазНУ', rating:5.0, studentsCount:76, hours:72, modules:5, lessons:26, grad:'linear-gradient(135deg,#06b6d4,#0369a1)', icon:'llm', desc:'Архитектура LLM, prompt engineering, RAG, fine-tuning (LoRA/QLoRA), оценка качества и разработка LLM-приложений. Работа с Qwen, LLaMA и Hugging Face.', tags:['LLM','RAG','LoRA'], outcomes:['Применять prompt engineering системно','Строить RAG-пайплайны','Дообучать LLM через LoRA/QLoRA','Оценивать качество генерации'], program:[{n:1,name:'Архитектура Transformer и LLM',l:5,h:'14'},{n:2,name:'Prompt Engineering',l:5,h:'13'},{n:3,name:'RAG: Retrieval-Augmented Generation',l:5,h:'14'},{n:4,name:'Fine-tuning: LoRA и QLoRA',l:6,h:'17'},{n:5,name:'Оценка и деплой LLM',l:5,h:'14'}], status:'published', createdAt:'2024-01-07T00:00:00.000Z' },
  { id:'c_de', title:'Инженерия данных', category:'Наука о данных', level:'Средний', levelClass:'badge-warning', teacher:'Кафедра ИИ и Big Data', teacherLogin:'КафедраИИ_КазНУ', rating:4.6, studentsCount:48, hours:72, modules:5, lessons:26, grad:'linear-gradient(135deg,#14b8a6,#0f766e)', icon:'data', desc:'Data Engineering: проектирование ETL/ELT пайплайнов, Apache Airflow, Spark, хранилища данных, векторные БД и оркестрация.', tags:['Airflow','Spark','ETL'], outcomes:['Проектировать ETL-пайплайны','Оркестрировать задачи с Airflow','Обрабатывать большие данные с Spark','Работать с векторными базами данных'], program:[{n:1,name:'Основы Data Engineering',l:5,h:'13'},{n:2,name:'ETL и хранилища данных',l:5,h:'14'},{n:3,name:'Apache Airflow',l:5,h:'14'},{n:4,name:'Apache Spark',l:6,h:'17'},{n:5,name:'Векторные БД и проект',l:5,h:'14'}], status:'published', createdAt:'2024-01-08T00:00:00.000Z' },
];

const COURSE_ICON_SVG = {
  ai:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
  ml:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/></svg>`,
  dl:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  nlp:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  data:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  mlops:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="16,3 21,3 21,8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21,16 21,21 16,21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>`,
  llm:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M22 2l-5 5"/><path d="M17 2h5v5"/></svg>`,
  python:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round"><path d="M12 2C6.48 2 4 4.48 4 7v2h8V8h4v3h-8c-2.21 0-4 1.79-4 4v2c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.52-2.48-5-8-5z"/></svg>`,
  web:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/></svg>`,
  algo:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>`,
  linalg:`<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
};

/* Инициализация seed-курсов один раз */
function initSeedCourses() {
  const existing = getCourses();
  // Re-seed if empty OR if still has old generic courses (Python/web/linalg)
  const hasOldCourses = existing.some(c => c.id === 'c_python' || c.id === 'c_linalg' || c.id === 'c_web');
  if (existing.length === 0 || hasOldCourses) {
    saveCourses(SEED_COURSES);
  }
}

/* ===========================================================
   АВТОРИЗАЦИЯ
=========================================================== */
function exportUsersToCSV(){
  const users=getUsers();
  let csv='ФИО,Логин,Роль,Телефон,Email,Дата регистрации,Направления\n';
  users.forEach(u=>{
    const areas=(u.teachingAreas||[]).join('; ');
    csv+=`"${u.displayName}","${u.login}","${roleLabel(u.role)}","${u.phone||''}","${u.email||''}","${new Date(u.createdAt).toLocaleDateString('ru-RU')}","${areas}"\n`;
  });
  const bom='\uFEFF';
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([bom+csv],{type:'text/csv;charset=utf-8'}));
  a.download=`kaznu_cdpo_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();showToast('CSV скачан','success');
}
function getRole()  { return localStorage.getItem(LS.ROLE); }
function getName()  { return localStorage.getItem(LS.NAME); }
function setSession(role, name) {
  localStorage.setItem(LS.ROLE, role);
  localStorage.setItem(LS.NAME, name);
}
function logout() {
  const name = getName();
  if (name) logActivity('logout', `${name} вышел из системы`);
  localStorage.removeItem(LS.ROLE);
  localStorage.removeItem(LS.NAME);
  sessionStorage.removeItem(LS.LAST_PAGE);
  window.location.href = 'login.html';
}
function requireAuth() { if (!getRole()) window.location.href = 'login.html'; }
function roleLabel(r) { return {admin:'Администратор',teacher:'Преподаватель',student:'Студент'}[r]||r; }
function getAvatar(name) {
  if (!name) return '?';
  const p = name.split(/[\s_]/);
  return p.length>=2&&p[0]&&p[1] ? p[0][0].toUpperCase()+p[1][0].toUpperCase() : name.slice(0,2).toUpperCase();
}

/* ── localStorage helpers ── */
function getUsers()         { return JSON.parse(localStorage.getItem(LS.USERS)||'[]'); }
function saveUsers(u)       { localStorage.setItem(LS.USERS, JSON.stringify(u)); }
function getSettings()      {
  const d={platformName:'КазНУ — Центр ДПО (ИИ и Big Data)',email:'talshyn.sagdatbek@kaznu.edu.kz',maxStudents:'150',notifEmail:true,notifNewUser:true,notifComplete:false,notifWeekly:true};
  return {...d,...JSON.parse(localStorage.getItem(LS.SETTINGS)||'{}')};
}
function saveSettings(s)    { localStorage.setItem(LS.SETTINGS, JSON.stringify(s)); }
function getCourses()       { return JSON.parse(localStorage.getItem(LS.COURSES)||'[]'); }
function saveCourses(c)     { localStorage.setItem(LS.COURSES, JSON.stringify(c)); }
function getEnrolled(uid)   { const all=JSON.parse(localStorage.getItem(LS.ENROLLED)||'{}'); return all[uid]||[]; }
function setEnrolled(uid,ids){ const all=JSON.parse(localStorage.getItem(LS.ENROLLED)||'{}'); all[uid]=ids; localStorage.setItem(LS.ENROLLED,JSON.stringify(all)); }
function getAssignments()   { return JSON.parse(localStorage.getItem(LS.ASSIGNMENTS)||'[]'); }
function saveAssignments(a) { localStorage.setItem(LS.ASSIGNMENTS, JSON.stringify(a)); }
function getQuizzes()       { return JSON.parse(localStorage.getItem(LS.QUIZZES)||'[]'); }
function saveQuizzes(q)     { localStorage.setItem(LS.QUIZZES, JSON.stringify(q)); }
function getSubmissions()   { return JSON.parse(localStorage.getItem(LS.SUBMISSIONS)||'[]'); }
function saveSubmissions(s) { localStorage.setItem(LS.SUBMISSIONS, JSON.stringify(s)); }
function getGrades()        { return JSON.parse(localStorage.getItem(LS.GRADES)||'[]'); }
function saveGrades(g)      { localStorage.setItem(LS.GRADES, JSON.stringify(g)); }
function getSurveyResults() { return JSON.parse(localStorage.getItem(LS.SURVEY_RESULTS)||'[]'); }
function saveSurveyResults(r){ localStorage.setItem(LS.SURVEY_RESULTS, JSON.stringify(r)); }
function isSurveyDone(userId){ return !!(JSON.parse(localStorage.getItem(LS.SURVEY_DONE)||'{}')[userId]); }
function markSurveyDone(userId){ const d=JSON.parse(localStorage.getItem(LS.SURVEY_DONE)||'{}'); d[userId]=true; localStorage.setItem(LS.SURVEY_DONE, JSON.stringify(d)); }
function getDismissedRejects(){ return JSON.parse(localStorage.getItem(LS.DISMISSED_REJECTS)||'[]'); }
function dismissReject(reqId){ const d=getDismissedRejects(); if(!d.includes(reqId)){d.push(reqId);localStorage.setItem(LS.DISMISSED_REJECTS,JSON.stringify(d));} }
function getCourseRequests()   { return JSON.parse(localStorage.getItem(LS.COURSE_REQUESTS)||'[]'); }
function saveCourseRequests(r) { localStorage.setItem(LS.COURSE_REQUESTS, JSON.stringify(r)); }
function getTeacherCourses(login){ const all=JSON.parse(localStorage.getItem(LS.TEACHER_COURSES)||'{}'); return all[login]||[]; }
function setTeacherCourses(login,ids){ const all=JSON.parse(localStorage.getItem(LS.TEACHER_COURSES)||'{}'); all[login]=ids; localStorage.setItem(LS.TEACHER_COURSES,JSON.stringify(all)); }
function getMyApprovedCourses(){ return getCourses().filter(c=>getTeacherCourses(getName()).includes(c.id)); }

/* ── Активность ── */
function getActivityLog()   { return JSON.parse(localStorage.getItem(LS.ACTIVITY)||'[]'); }
function logActivity(type, message) {
  const log = getActivityLog();
  log.unshift({type, message, time: new Date().toISOString()});
  localStorage.setItem(LS.ACTIVITY, JSON.stringify(log.slice(0,100)));
  updateBell();
}

/* ── Уведомления: красная точка ТОЛЬКО для новых регистраций ── */
function updateBell() {
  const dot = document.querySelector('.notif-dot');
  if (!dot) return;
  const readTs = parseInt(localStorage.getItem(LS.NOTIF_READ)||'0');
  const newRegs = getActivityLog().filter(e => e.type==='register' && new Date(e.time).getTime() > readTs);
  const pendingReqs = getCourseRequests().filter(r => r.status==='pending').length;
  dot.style.display = (newRegs.length > 0 || pendingReqs > 0) ? 'block' : 'none';
}
function markNotifsRead() {
  localStorage.setItem(LS.NOTIF_READ, Date.now().toString());
  updateBell();
}

/* ── Текущий пользователь ── */
function getCurrentUser() {
  const name=getName(), role=getRole();
  if (!name||role==='admin') return null;
  return getUsers().find(u=>u.displayName===name||u.login===name)||null;
}

/* ===========================================================
   TOAST
=========================================================== */
function showToast(msg, type='default', duration=2800) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${{default:'ℹ',success:'✓',error:'✕'}[type]||'i'}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity 0.3s';setTimeout(()=>t.remove(),300);}, duration);
}

/* ===========================================================
   УТИЛИТЫ
=========================================================== */
function timeAgo(iso) {
  const diff=Math.floor((Date.now()-new Date(iso))/1000);
  if(diff<60)return'только что';
  if(diff<3600)return`${Math.floor(diff/60)} мин назад`;
  if(diff<86400)return`${Math.floor(diff/3600)} ч назад`;
  return new Date(iso).toLocaleDateString('ru-RU');
}
function uid()    { return Math.random().toString(36).slice(2,10); }
function fmtDate(iso) { return new Date(iso).toLocaleDateString('ru-RU'); }
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

/* ── Открытие модального окна ── */
function openModal(html) {
  let overlay = document.getElementById('globalModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'globalModal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto';
    overlay.addEventListener('click', e=>{ if(e.target===overlay) closeModal(); });
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = html;
  overlay.style.opacity='0'; overlay.style.display='flex';
  requestAnimationFrame(()=>{overlay.style.transition='opacity 0.2s';overlay.style.opacity='1';});
}
function closeModal() {
  const m=document.getElementById('globalModal');
  if(m){m.style.opacity='0';setTimeout(()=>m.remove(),200);}
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

function modalBox(title, body, footer='') {
  return `<div style="background:#fff;border-radius:18px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.22)">
    <div style="padding:24px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <h3 style="font-size:18px;font-weight:700">${title}</h3>
      <button onclick="closeModal()" style="width:30px;height:30px;border-radius:50%;background:var(--bg);border:none;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center">✕</button>
    </div>
    <div style="padding:24px 28px">${body}</div>
    ${footer?`<div style="padding:16px 28px;border-top:1px solid var(--border);display:flex;gap:10px">${footer}</div>`:''}
  </div>`;
}
function mField(label, inputHtml) {
  return `<div style="margin-bottom:16px"><label style="display:block;font-size:14px;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">${label}</label>${inputHtml}</div>`;
}
const mInput = (id,type='text',ph='',val='') =>
  `<input type="${type}" id="${id}" value="${val}" placeholder="${ph}" style="width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">`;
const mTextarea = (id,ph='',val='',rows=3) =>
  `<textarea id="${id}" placeholder="${ph}" rows="${rows}" style="width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box;resize:vertical">${val}</textarea>`;
const mSelect = (id, opts, val='') =>
  `<select id="${id}" style="width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">${opts.map(o=>`<option value="${o.v||o}" ${(o.v||o)===val?'selected':''}>${o.l||o}</option>`).join('')}</select>`;
const mBtn = (label, onclick, cls='btn-primary') =>
  `<button onclick="${onclick}" class="btn ${cls}" style="padding:10px 22px">${label}</button>`;

/* ===========================================================
   ПОИСК
=========================================================== */
let _sd=null;
function initSearch() {
  const inp = document.querySelector('.topbar-search input');
  if (!inp) return;
  inp.addEventListener('input', ()=>{clearTimeout(_sd);_sd=setTimeout(()=>applySearch(inp.value.trim().toLowerCase()),200);});
  inp.addEventListener('keydown', e=>{if(e.key==='Escape'){inp.value='';applySearch('');}});
}
function applySearch(q) {
  let found=0;
  const hasCatSearch=!!document.getElementById('catSearch');
  document.querySelectorAll('.my-course-card,.catalog-card,.assignment-item').forEach(el=>{
    if(hasCatSearch&&el.classList.contains('catalog-card'))return; // catalog has its own search
    const m=!q||el.textContent.toLowerCase().includes(q);
    el.style.display=m?'':'none'; if(m)found++;
  });
  document.querySelectorAll('tbody tr').forEach(el=>{
    const m=!q||el.textContent.toLowerCase().includes(q);
    el.style.display=m?'':'none'; if(m)found++;
  });
  let nr=document.getElementById('searchNoResults');
  if(q&&found===0){
    if(!nr){nr=document.createElement('div');nr.id='searchNoResults';nr.className='search-no-results';document.getElementById('mainContent')?.appendChild(nr);}
    nr.innerHTML=`<div style="font-size:36px;margin-bottom:10px">🔍</div><div>По запросу <b>«${q}»</b> ничего не найдено</div>`;
    nr.style.display='block';
  } else if(nr) nr.style.display='none';
}

function initModuleToggles() {
  document.querySelectorAll('.module-header').forEach(h=>{
    h.addEventListener('click',()=>{
      const b=h.nextElementSibling,o=h.classList.contains('open');
      h.classList.toggle('open',!o);
      if(b)b.style.display=o?'none':'block';
    });
    if(h.dataset.default==='open')h.click();
  });
}
function initSidebarNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item=>{
    item.addEventListener('click',()=>{
      document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
      item.classList.add('active');
      renderPage(item.dataset.page);
    });
  });
}

/* ===========================================================
   ВХОД
=========================================================== */
function initLogin() {
  let role = document.getElementById('hiddenRole')?.value||'student';
  document.querySelectorAll('.role-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); role=btn.dataset.role;
    });
  });
  const li=document.getElementById('loginInput'), pi=document.getElementById('passwordInput');
  const le=document.getElementById('loginError'),   pe=document.getElementById('passwordError');
  li?.addEventListener('input',()=>clearErr(li,le));
  pi?.addEventListener('input',()=>clearErr(pi,pe));
function openForgotPassword(){
  openModal(modalBox('Восстановление доступа',
    `<div style="text-align:center;padding:16px 0 8px">
      <div style="font-size:40px;margin-bottom:16px">🔑</div>
      <p style="font-size:15px;color:var(--text-secondary);line-height:1.7;margin-bottom:20px">
        Для восстановления доступа обратитесь к администратору платформы:
      </p>
      <div style="padding:16px;background:var(--bg);border-radius:12px;margin-bottom:16px">
        <div style="font-size:14px;font-weight:700;margin-bottom:6px">Контакт центра</div>
        <a href="mailto:talshyn.sagdatbek@kaznu.edu.kz" style="color:var(--accent);font-size:14px">talshyn.sagdatbek@kaznu.edu.kz</a><br>
        <span style="font-size:14px;color:var(--text-secondary)">+7 (707) 570-36-30</span>
      </div>
      <p style="font-size:13px;color:var(--text-muted)">Администратор сбросит пароль и пришлёт новые данные для входа.</p>
    </div>`,
    mBtn('Закрыть','closeModal()','btn-secondary')
  ));
}
  document.getElementById('loginForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const login=li.value.trim(), pwd=pi.value; let ok=true;
    if(!login){showErr(li,le,'Введите логин');ok=false;}else markOk(li,le);
    if(!pwd){showErr(pi,pe,'Введите пароль');ok=false;}
    if(!ok)return;
    if(role==='admin'){
      if(login!=='admin'){showErr(li,le,'Логин администратора: admin');return;}
      if(pwd!=='admin'){showErr(pi,pe,'Неверный пароль');return;}
      setSession('admin','Администратор');
      logActivity('login_admin','Администратор вошёл в систему');
      window.location.href='dashboard.html'; return;
    }
    const users=getUsers();
    const found=users.find(u=>u.login.toLowerCase()===login.toLowerCase()&&u.role===role);
    if(!found){showErr(li,le,'Пользователь не найден. Сначала зарегистрируйтесь.');return;}
    if(found.password!==pwd){showErr(pi,pe,'Неверный пароль');return;}
    setSession(found.role,found.displayName);
    logActivity('login',`${found.displayName} (${roleLabel(found.role)}) вошёл в систему`);
    window.location.href='dashboard.html';
  });
}

/* ===========================================================
   РЕГИСТРАЦИЯ
=========================================================== */
function initRegister() {
  let role='student';
  document.querySelectorAll('.role-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      role=btn.dataset.role;
      // Toggle teacher areas block
      const block=document.getElementById('teacherAreasBlock');
      if(block) block.style.display=role==='teacher'?'block':'none';
    });
  });
  document.querySelector('[data-role="student"]')?.classList.add('active');
  const ids=['lastNameInput','firstNameInput','phoneInput','emailInput','passwordInput','password2Input'];
  const errIds=['lastNameError','firstNameError','phoneError','emailError','passwordError','password2Error'];
  ids.forEach((id,i)=>document.getElementById(id)?.addEventListener('input',()=>clearErr(document.getElementById(id),document.getElementById(errIds[i]))));
  document.getElementById('registerForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const ln=document.getElementById('lastNameInput').value.trim();
    const fn=document.getElementById('firstNameInput').value.trim();
    const ph=document.getElementById('phoneInput').value.trim();
    const em=document.getElementById('emailInput').value.trim();
    const pw=document.getElementById('passwordInput').value;
    const p2=document.getElementById('password2Input').value;
    let ok=true;
    if(!ln){showErr(document.getElementById('lastNameInput'),document.getElementById('lastNameError'),'Введите фамилию');ok=false;}
    else markOk(document.getElementById('lastNameInput'),document.getElementById('lastNameError'));
    if(!fn){showErr(document.getElementById('firstNameInput'),document.getElementById('firstNameError'),'Введите имя');ok=false;}
    else markOk(document.getElementById('firstNameInput'),document.getElementById('firstNameError'));
    const digits=ph.replace(/\D/g,'');
    if(!ph){showErr(document.getElementById('phoneInput'),document.getElementById('phoneError'),'Введите номер телефона');ok=false;}
    else if(digits.length<11){showErr(document.getElementById('phoneInput'),document.getElementById('phoneError'),'Введите полный номер');ok=false;}
    else markOk(document.getElementById('phoneInput'),document.getElementById('phoneError'));
    if(!em){showErr(document.getElementById('emailInput'),document.getElementById('emailError'),'Введите электронную почту');ok=false;}
    else if(!isValidEmail(em)){showErr(document.getElementById('emailInput'),document.getElementById('emailError'),'Формат: name@domain.com');ok=false;}
    else markOk(document.getElementById('emailInput'),document.getElementById('emailError'));
    if(!pw||pw.length<6){showErr(document.getElementById('passwordInput'),document.getElementById('passwordError'),'Минимум 6 символов');ok=false;}
    else markOk(document.getElementById('passwordInput'),document.getElementById('passwordError'));
    if(pw!==p2){showErr(document.getElementById('password2Input'),document.getElementById('password2Error'),'Пароли не совпадают');ok=false;}
    else if(p2) markOk(document.getElementById('password2Input'),document.getElementById('password2Error'));
    if(!ok)return;
    const login=`${ln}_${fn}`, displayName=`${ln} ${fn}`;
    const users=getUsers();
    if(users.find(u=>u.login.toLowerCase()===login.toLowerCase()&&u.role===role)){
      showErr(document.getElementById('lastNameInput'),document.getElementById('lastNameError'),`Пользователь «${login}» уже зарегистрирован`);
      return;
    }
    if(em&&users.find(u=>u.email&&u.email.toLowerCase()===em.toLowerCase())){
      showErr(document.getElementById('emailInput'),document.getElementById('emailError'),'Этот email уже используется другим пользователем');
      return;
    }
    // Validate + collect teacher areas
    let teachingAreas=[];
    if(role==='teacher'){
      const areas=typeof getSelectedAreas==='function'?getSelectedAreas():[];
      if(areas.length===0){
        const err=document.getElementById('areasError');
        if(err){err.textContent='Выберите хотя бы одно направление преподавания';err.style.display='block';}
        return;
      }
      teachingAreas=areas;
    }
    users.push({login,displayName,password:pw,role,phone:ph,email:em,createdAt:new Date().toISOString(),courses:[],teachingAreas});
    saveUsers(users);
    const areasText=teachingAreas.length>0?` · Направлений: ${teachingAreas.length}`:'';
    logActivity('register',`Новый пользователь: ${displayName} (${roleLabel(role)}${areasText})`);
    showToast(`Регистрация успешна! Ваш логин: ${login}`,'success',2000);
    setTimeout(()=>{window.location.href='login.html';},1800);
  });
}

function showErr(i,e,m){i?.classList.add('is-error');i?.classList.remove('is-ok');if(e){e.textContent=m;e.style.display='block';}}
function clearErr(i,e){i?.classList.remove('is-error');if(e)e.style.display='none';}
function markOk(i,e){i?.classList.remove('is-error');i?.classList.add('is-ok');if(e)e.style.display='none';}

/* ===========================================================
   DASHBOARD
=========================================================== */
function initDashboard() {
  requireAuth();
  initSeedCourses();
  const role=getRole(), name=getName(), av=getAvatar(name);
  document.querySelectorAll('.js-user-name').forEach(el=>el.textContent=name);
  document.querySelectorAll('.js-user-role').forEach(el=>el.textContent=roleLabel(role));
  document.querySelectorAll('.js-user-avatar').forEach(el=>el.textContent=av);
  document.querySelectorAll('.role-nav').forEach(n=>n.classList.add('hidden'));
  document.getElementById(`nav-${role}`)?.classList.remove('hidden');
  const rb=document.querySelector('.sidebar-user-info .user-role');
  if(rb)rb.style.color={admin:'#f59e0b',teacher:'#10b981',student:'#6366f1'}[role];
  updateBell();
  initSearch();
  initSidebarNav();
  document.querySelectorAll('.logout-btn').forEach(b=>b.addEventListener('click',logout));
  document.querySelectorAll('.js-open-profile').forEach(el=>el.addEventListener('click',openProfile));

  /* Уведомления: показываем список только для admin/teacher */
  document.querySelectorAll('.notif-btn').forEach(btn=>btn.addEventListener('click',()=>{
    if(role==='admin'){
      showNotifPanel();
    } else {
      showToast('Нет новых уведомлений','default');
    }
  }));

  /* Восстанавливаем последнюю страницу (issue 4) */
  const savedPage = sessionStorage.getItem(LS.LAST_PAGE);
  const defaults  = {admin:'dashboard',teacher:'my-courses',student:'my-courses'};
  const startPage = savedPage || defaults[role];
  renderPage(startPage);

  // Опросник для новых студентов
  if(role==='student'){
    const myId=getCurrentUser()?.login||getName();
    if(myId&&!isSurveyDone(myId)) setTimeout(showOnboardingSurvey, 800);
  }
}

/* Панель уведомлений для администратора */
function showNotifPanel() {
  const regs = getActivityLog().filter(e=>e.type==='register').slice(0,20);
  const html = modalBox('Уведомления',
    regs.length===0
      ? `<div style="text-align:center;padding:40px;color:var(--text-muted)"><div style="font-size:40px;margin-bottom:12px">🔔</div><div>Новых уведомлений нет</div></div>`
      : `<div style="display:flex;flex-direction:column;gap:0">${regs.map(r=>`
          <div style="padding:14px 0;border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:flex-start">
            <div style="width:36px;height:36px;border-radius:10px;background:var(--success-light);display:flex;align-items:center;justify-content:center;color:var(--success);flex-shrink:0">${SVG.users}</div>
            <div><div style="font-size:14px;font-weight:600">${r.message}</div><div style="font-size:12px;color:var(--text-muted);margin-top:3px">${timeAgo(r.time)}</div></div>
          </div>`).join('')}</div>`,
    mBtn('Отметить всё прочитанным','markNotifsRead();closeModal()','btn-secondary')
  );
  openModal(html);
  markNotifsRead();
}

/* ===========================================================
   РЕНДЕР СТРАНИЦ
=========================================================== */
function renderPage(page) {
  const content=document.getElementById('mainContent');
  if(!content)return;
  const role=getRole();
  /* Сохраняем текущую страницу */
  sessionStorage.setItem(LS.LAST_PAGE, page);
  const map={
    'dashboard':      renderAdminDashboard,
    'users':          renderUsersPage,
    'courses':        renderAdminCourses,
    'statistics':     renderStatisticsPage,
    'settings':       renderSettingsPage,
    'about-center':   renderAboutCenter,
    'my-courses':     role==='teacher'?renderTeacherCourses:renderStudentCourses,
    'catalog':        renderStudentCatalog,
    'teacher-catalog':renderTeacherCourseCatalog,
    'create-course':  renderCourseRequestForm, 
    'materials':      renderMaterials,
    'assignments':    role==='teacher'?renderTeacherAssignments:renderStudentAssignments,
    'quizzes':        role==='teacher'?renderTeacherQuizzes:renderStudentQuizzes,
    'quiz-builder':   (c)=>renderQuizBuilder(c, window._qbEditId||null),
    'grades':         role==='teacher'?renderTeacherGrades:renderStudentGrades,
    'my-analytics':   renderStudentAnalytics,
    'my-achievements':renderStudentAchievements,
    'teacher-requests':renderTeacherRequests,
    'admin-events':   renderAdminEvents,
    'teacher-events': renderTeacherEvents,
  };
  content.innerHTML='';
  if(page==='quizzes') window._qbEditId=null;
  map[page]?.(content);
  setTimeout(()=>{const i=document.querySelector('.topbar-search input');if(i&&i.value.trim())applySearch(i.value.trim().toLowerCase());},0);
  const titles={
    'dashboard':     ['Панель управления','Обзор платформы'],
    'users':         ['Пользователи','Управление пользователями'],
    'courses':       ['Курсы','Все курсы платформы'],
    'statistics':    ['Статистика','Аналитика и отчёты'],
    'settings':      ['Настройки','Конфигурация платформы'],
    'about-center':  ['О центре','Центр дополнительного профессионального образования КазНУ'],
    'my-courses':    ['Мои курсы',role==='teacher'?'Курсы, которые вы ведёте':'Ваши курсы'],
    'catalog':       ['Каталог курсов','Все доступные курсы'],
    'teacher-catalog':['Каталог курсов','Выберите курсы для преподавания'],
    'create-course': ['Предложить новый курс','Заявка на создание — требует одобрения администратора'],    'materials':     ['Материалы','Учебные ресурсы'],
    'assignments':   ['Задания',role==='teacher'?'Управление заданиями':'Ваши задания'],
    'quizzes':       ['Тесты',role==='teacher'?'Управление тестами':'Ваши тесты'],
    'quiz-builder':  ['Конструктор теста','Создание и редактирование теста'],
    'grades':        ['Оценки',role==='teacher'?'Журнал оценок':'Ваша успеваемость'],
    'my-analytics':  ['Мои рекомендации','Аналитика на основе ваших ответов'],
    'my-achievements':['Достижения и сертификаты','Ваш прогресс и награды'],
    'teacher-requests':['Мои заявки','История и статус заявок'],
    'admin-events':   ['Мероприятия','Управление мероприятиями и заявками преподавателей'],
    'teacher-events': ['Мои мероприятия','Предложить мероприятие и отследить статус заявки'],
  };
  const t=titles[page]||[page,''];
  const h=document.querySelector('.topbar-left h1'),p=document.querySelector('.topbar-left p');
  if(h)h.textContent=t[0]; if(p)p.textContent=t[1];
  /* Подсвечиваем активный пункт меню */
  document.querySelectorAll('.nav-item[data-page]').forEach(item=>item.classList.toggle('active',item.dataset.page===page));
}

/* ── Компоненты ── */
function statCard(icon,color,num,label,change,dir){
  return`<div class="stat-card"><div class="stat-card-icon ${color}">${icon}</div><div><div class="stat-card-num">${num}</div><div class="stat-card-label">${label}</div>${change?`<div class="stat-card-change ${dir}">${change}</div>`:''}</div></div>`;
}
function emptyState(icon,title,text){
  return`<div style="text-align:center;padding:60px 20px"><div style="width:60px;height:60px;background:var(--bg);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:var(--text-muted)">${icon}</div><h3 style="font-size:19px;font-weight:700;margin-bottom:8px">${title}</h3><p style="font-size:14px;color:var(--text-secondary);line-height:1.6;max-width:340px;margin:0 auto">${text}</p></div>`;
}
function quickLink(icon,color,label,action){
  const bgs={purple:'var(--accent-light)',green:'var(--success-light)',orange:'var(--warning-light)',blue:'#dbeafe'};
  return`<div class="quick-link" onclick="${action}" style="cursor:pointer"><div class="quick-link-icon" style="background:${bgs[color]};color:var(--accent)">${icon}</div><span>${label}</span><span style="margin-left:auto;color:var(--text-muted)">→</span></div>`;
}
function toggleRow(label,key,initial){
  const on=getSettings()[key]!==undefined?getSettings()[key]:initial;
  return`<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border)"><span style="font-size:15px;font-weight:500">${label}</span><div onclick="toggleSetting(this)" data-key="${key}" data-on="${on}" style="width:44px;height:24px;border-radius:12px;background:${on?'var(--accent)':'var(--border)'};cursor:pointer;position:relative;transition:background 0.2s;flex-shrink:0"><div style="position:absolute;top:3px;left:${on?'22':'3'}px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.2)"></div></div></div>`;
}
function toggleSetting(el){const on=el.dataset.on==='true';el.dataset.on=(!on).toString();el.style.background=!on?'var(--accent)':'var(--border)';el.querySelector('div').style.left=!on?'22px':'3px';const s=getSettings();s[el.dataset.key]=!on;saveSettings(s);}

/* ===========================================================
   О ЦЕНТРЕ
=========================================================== */
function renderAboutCenter(c){
  c.innerHTML=`
  <style>
    .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
    .about-card{background:#fff;border-radius:14px;border:1px solid var(--border);padding:24px}
    .about-tag{display:inline-flex;align-items:center;gap:6px;background:var(--accent-light);color:var(--accent);border-radius:8px;padding:5px 12px;font-size:12px;font-weight:700;margin-bottom:12px;text-transform:uppercase;letter-spacing:.6px}
    .price-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border);font-size:14px}
    .price-row:last-child{border-bottom:none}
    .price-val{font-size:17px;font-weight:800;color:var(--accent)}
    .dir-item{padding:9px 12px;background:var(--bg);border-radius:8px;font-size:13px;font-weight:500;margin-bottom:6px;display:flex;align-items:center;gap:8px}
    .dir-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0}
    @media(max-width:768px){.about-grid{grid-template-columns:1fr}}
  </style>

  <!-- ШАПКА ЦЕНТРА -->
  <div class="card" style="margin-bottom:20px;background:linear-gradient(135deg,#0f0c29,#302b63);border:none">
    <div class="card-body" style="padding:32px">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(165,180,252,0.7);margin-bottom:12px">НАО «Казахский национальный университет имени аль-Фараби»</div>
      <h2 style="font-family:'Sora',sans-serif;font-size:24px;font-weight:800;color:#fff;margin-bottom:8px">Центр дополнительного профессионального образования</h2>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;max-width:600px;line-height:1.7">Кафедра искусственного интеллекта и Big Data · Факультет информационных технологий и искусственного интеллекта</p>
      <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:20px">
        <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.7);font-size:14px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          г. Алматы, проспект аль-Фараби 71
        </div>
        <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.7);font-size:14px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          +7 (707) 570-36-30
        </div>
        <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.7);font-size:14px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          talshyn.sagdatbek@kaznu.edu.kz
        </div>
      </div>
    </div>
  </div>

  <div class="about-grid">
    <!-- ЦЕЛИ -->
    <div class="about-card">
      <div class="about-tag">${SVG.award} Цели центра</div>
      <div style="font-size:14px;color:var(--text-secondary);line-height:1.75">
        <div class="dir-item"><div class="dir-dot"></div>Реализация научно-образовательного потенциала кафедры ИИ и Big Data</div>
        <div class="dir-item"><div class="dir-dot"></div>Непрерывное образование и повышение квалификации IT-специалистов</div>
        <div class="dir-item"><div class="dir-dot"></div>Профессиональная переподготовка в области цифровых технологий</div>
        <div class="dir-item"><div class="dir-dot"></div>Интеграция академического образования с IT-индустрией</div>
        <div class="dir-item"><div class="dir-dot"></div>Поддержка двуязычного и многоязычного обучения (каз/рус/англ)</div>
      </div>
    </div>

    <!-- ПРАЙС -->
    <div class="about-card">
      <div class="about-tag">${SVG.chart} Стоимость обучения</div>
      <div class="price-row">
        <div>
          <div style="font-weight:600;margin-bottom:3px">Курсы повышения квалификации</div>
          <div style="font-size:12px;color:var(--text-muted)">72 академических часа · от 2 недель</div>
        </div>
        <div class="price-val">от 25 000 ₸</div>
      </div>
      <div class="price-row">
        <div>
          <div style="font-weight:600;margin-bottom:3px">Летние / зимние школы</div>
          <div style="font-size:12px;color:var(--text-muted)">Интенсивный формат</div>
        </div>
        <div class="price-val">от 10 000 ₸</div>
      </div>
      <div class="price-row">
        <div>
          <div style="font-weight:600;margin-bottom:3px">Онлайн-конференции и семинары</div>
          <div style="font-size:12px;color:var(--text-muted)">Дистанционный формат, PDF-сборник</div>
        </div>
        <div class="price-val">от 10 000 ₸</div>
      </div>
      <div style="margin-top:14px;padding:12px;background:var(--success-light);border-radius:8px;font-size:13px;color:var(--success);font-weight:600">
        ✓ По завершении — удостоверение о повышении квалификации
      </div>
    </div>
  </div>

  <!-- НАПРАВЛЕНИЯ ОБУЧЕНИЯ -->
  <div class="about-card" style="margin-bottom:20px">
    <div class="about-tag">${SVG.book} Направления обучения</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;margin-top:4px">
      ${['Основы искусственного интеллекта','Машинное обучение I и II','Глубокое обучение','NLP и анализ текстовых данных','LLM и генеративный ИИ','Data Engineering','MLOps','Наука о данных','Бизнес-аналитика','Основы IoT','Облачные технологии','DevOps-практики','SCADA-системы','Робототехника','ИИ в медицине','ИИ в научных исследованиях','ИИ в образовании','Управление IT-проектами','Основы программирования','Low code/no code разработка'].map(d=>`<div class="dir-item"><div class="dir-dot"></div>${d}</div>`).join('')}
    </div>
  </div>

  <!-- ФОРМАТЫ -->
  <div class="stats-grid">
    ${statCard(`<span style="color:#6366f1">${SVG.book}</span>`,'purple','72 ч','Академических часов на курс повышения квалификации','','') }
    ${statCard(`<span style="color:#10b981">${SVG.users}</span>`,'green','2021','Год основания центра','','') }
    ${statCard(`<span style="color:#f59e0b">${SVG.activity}</span>`,'orange','Офлайн / Онлайн','Форматы проведения занятий','','') }
    ${statCard(`<span style="color:#3b82f6">${SVG.award}</span>`,'blue','3 языка','Каз · Рус · Англ','','') }
  </div>`;
}

/* ===========================================================
   АДМИНИСТРАТОР
=========================================================== */
function renderAdminDashboard(c){
  const users=getUsers(), log=getActivityLog().slice(0,6);
  const pendingReqs=getCourseRequests().filter(r=>r.status==='pending');
  c.innerHTML=`
    <div class="stats-grid">
      ${statCard(`<span style="color:#6366f1">${SVG.users}</span>`,'purple',users.filter(u=>u.role==='student').length,'Студентов','','')}
      ${statCard(`<span style="color:#10b981">${SVG.user}</span>`,'green',users.filter(u=>u.role==='teacher').length,'Преподавателей','','')}
      ${statCard(`<span style="color:#f59e0b">${SVG.book}</span>`,'orange',getCourses().length,'Курсов на платформе','','')}
      ${statCard(`<span style="color:#3b82f6">${SVG.activity}</span>`,'blue',users.length,'Всего пользователей','','')}
    </div>
    ${pendingReqs.length>0?`
    <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid #f59e0b;border-radius:14px;
      padding:18px 22px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;border-radius:10px;background:#f59e0b;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px">📋</div>
        <div>
          <div style="font-weight:700;font-size:15px">Заявки на курсы: ${pendingReqs.length} ожидают рассмотрения</div>
          <div style="font-size:13px;color:#78350f;margin-top:2px">Преподаватели запросили доступ или предложили новые курсы</div>
        </div>
      </div>
      <button onclick="renderPage('courses')" class="btn btn-primary" style="background:#f59e0b;border-color:#f59e0b">Рассмотреть →</button>
    </div>`:``}
    <div class="content-grid">
      <div>
        <div class="section-title">Пользователи <a href="#" class="btn btn-sm btn-secondary" onclick="renderPage('users');return false">Все →</a></div>
        ${users.length===0
          ?`<div class="card"><div class="card-body">${emptyState(SVG.users,'Нет пользователей','Зарегистрированные пользователи появятся здесь')}</div></div>`
          :`<div class="card"><div class="card-body" style="padding:0"><table class="data-table"><thead><tr><th>Пользователь</th><th>Роль</th><th>Email</th><th>Дата</th></tr></thead><tbody>
            ${users.slice(0,5).map(u=>`<tr>
              <td><div class="table-user"><div class="avatar avatar-purple" style="font-size:13px">${getAvatar(u.displayName)}</div><div class="table-user-info"><div class="t-name">${u.displayName}</div><div class="t-email">${u.login}</div></div></div></td>
              <td><span class="badge ${u.role==='teacher'?'badge-success':'badge-primary'}">${roleLabel(u.role)}</span></td>
              <td style="font-size:13px;color:var(--text-secondary)">${u.email||'—'}</td>
              <td style="font-size:13px;color:var(--text-muted)">${fmtDate(u.createdAt)}</td>
            </tr>`).join('')}
          </tbody></table></div></div>`
        }
      </div>
      <div class="quick-panel">
        <div class="card"><div class="card-header"><h3>Быстрые действия</h3></div><div class="card-body"><div class="quick-links">
          ${quickLink(SVG.users,'purple','Пользователи','renderPage("users")')}
          ${quickLink(SVG.book,'green','Курсы','renderPage("courses")')}
          ${quickLink(SVG.chart,'orange','Статистика','renderPage("statistics")')}
          ${quickLink(SVG.download,'blue','Экспорт данных','exportUsersToText()')}
        </div></div></div>
        <div class="card"><div class="card-header"><h3>Последние регистрации</h3></div><div class="card-body" style="padding:0 24px">
          ${log.filter(e=>e.type==='register').length===0
            ?`<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:14px">Новых регистраций нет</div>`
            :`<div class="activity-list">${log.filter(e=>e.type==='register').map(e=>`<div class="activity-item"><div class="activity-dot" style="background:var(--success-light)">${SVG.users}</div><div><div class="a-title">${e.message}</div><div class="a-time">${timeAgo(e.time)}</div></div></div>`).join('')}</div>`
          }
        </div></div>
      </div>
    </div>`;
}

function renderUsersPage(c){
  const users=getUsers();
  c.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px"><div class="section-title" style="margin:0">Все пользователи (${users.length})</div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary" onclick="exportUsersToText()">${SVG.download} .txt</button>
      <button class="btn btn-secondary" onclick="exportUsersToCSV()">${SVG.download} .csv</button>
    </div></div>
    ${users.length===0
      ?`<div class="card"><div class="card-body">${emptyState(SVG.users,'Нет пользователей','Зарегистрированные пользователи появятся здесь')}</div></div>`
      :`<div class="card"><div class="card-body" style="padding:0"><table class="data-table"><thead><tr><th>Пользователь</th><th>Роль</th><th>Телефон</th><th>Email</th><th>Дата</th><th>Направления</th><th></th></tr></thead><tbody>
        ${users.map(u=>`<tr>
          <td><div class="table-user"><div class="avatar avatar-purple" style="font-size:12px">${getAvatar(u.displayName)}</div><div class="table-user-info"><div class="t-name">${u.displayName}</div><div class="t-email">${u.login}</div></div></div></td>
          <td><span class="badge ${u.role==='teacher'?'badge-success':'badge-primary'}">${roleLabel(u.role)}</span></td>
          <td style="font-size:14px;color:var(--text-secondary)">${u.phone||'—'}</td>
          <td style="font-size:14px;color:var(--text-secondary)">${u.email||'—'}</td>
          <td style="font-size:13px;color:var(--text-muted)">${fmtDate(u.createdAt)}</td>
          <td style="max-width:200px">${u.role==='teacher'&&u.teachingAreas?.length?`<span style="font-size:11px;color:var(--text-muted)">${u.teachingAreas.slice(0,2).join(', ')}${u.teachingAreas.length>2?` +${u.teachingAreas.length-2}`:''}</span>`:'—'}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deleteUser('${u.login}','${u.role}')">${SVG.trash}</button></td>
        </tr>`).join('')}
      </tbody></table></div></div>`
    }`;
}
function deleteUser(login,role){if(!confirm(`Удалить ${login}?`))return;saveUsers(getUsers().filter(u=>!(u.login===login&&u.role===role)));showToast('Удалён','error');renderUsersPage(document.getElementById('mainContent'));}

function renderAdminCourses(c){
  const courses=getCourses();
  const requests=getCourseRequests();
  const pending=requests.filter(r=>r.status==='pending');

  function renderTab(){
    const cont=document.getElementById('adminCoursesContent');
    if(!cont)return;
    const tab=window._adminCoursesTab||'courses';
    if(tab==='courses'){
      const teachers=getUsers().filter(u=>u.role==='teacher');
      cont.innerHTML=`
      <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
        <button class="btn btn-primary" onclick="openAdminCourseForm(null)">${SVG.plus} Создать курс</button>
      </div>
      <div class="card"><div class="card-body" style="padding:0"><table class="data-table">
        <thead><tr><th>Название курса</th><th>Описание</th><th>Направление</th><th>Автор / Преподаватель</th><th>Студентов</th><th>Статус</th><th></th></tr></thead>
        <tbody>${courses.map(cc=>{
          const assigned=teachers.filter(u=>getTeacherCourses(u.login).includes(cc.id)).map(u=>u.displayName);
          const author=assigned.length>0?assigned.join(', '):(cc.teacher||'—');
          return`<tr>
            <td><b>${cc.title}</b></td>
            <td style="max-width:180px;font-size:12px;color:var(--text-secondary)">${(cc.desc||'').slice(0,55)}${(cc.desc||'').length>55?'…':''}</td>
            <td><span class="badge badge-primary">${cc.category||'—'}</span></td>
            <td style="font-size:13px;color:var(--text-secondary)">${author}</td>
            <td>${cc.studentsCount||0}</td>
            <td><span class="badge ${cc.status==='published'?'badge-success':'badge-warning'}">${cc.status==='published'?'Опубликован':'Черновик'}</span></td>
            <td><div style="display:flex;gap:6px">
              <button class="btn btn-sm btn-secondary" onclick="openAdminCourseForm('${cc.id}')">${SVG.edit}</button>
              <button class="btn btn-sm btn-danger" onclick="adminDeleteCourse('${cc.id}')">${SVG.trash}</button>
            </div></td>
          </tr>`;}).join('')}
        </tbody></table></div></div>`;
    } else {
      const reqs=getCourseRequests().sort((a,b)=>new Date(b.requestedAt)-new Date(a.requestedAt));
      cont.innerHTML=reqs.length===0
        ?`<div class="card"><div class="card-body">${emptyState(SVG.clipboard,'Заявок нет','Заявки от преподавателей появятся здесь')}</div></div>`
        :`<div style="display:flex;flex-direction:column;gap:12px">${reqs.map(r=>adminRequestCard(r)).join('')}</div>`;    }
  }

  c.innerHTML=`
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div class="section-title" style="margin:0">Курсы платформы</div>
    <div style="display:flex;gap:8px">
      <button onclick="window._adminCoursesTab='courses';document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');renderTab()"
        class="btn admin-tab-btn ${(window._adminCoursesTab||'courses')==='courses'?'btn-primary':'btn-secondary'}">Все курсы (${courses.length})</button>
      <button onclick="window._adminCoursesTab='requests';document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');renderTab()"
        class="btn admin-tab-btn ${window._adminCoursesTab==='requests'?'btn-primary':'btn-secondary'}" style="position:relative">
        Заявки (${requests.length})
        ${pending.length>0?`<span style="position:absolute;top:-6px;right:-6px;background:#ef4444;color:#fff;border-radius:50%;width:18px;height:18px;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center">${pending.length}</span>`:''}
      </button>
    </div>
  </div>
  <div id="adminCoursesContent"></div>`;

  window.renderTab=renderTab;
  renderTab();
}

function adminRequestCard(r){
  const statusColors={pending:'#f59e0b',approved:'#10b981',rejected:'#ef4444'};
  const statusLabels={pending:'На рассмотрении',approved:'Одобрено',rejected:'Отклонено'};
  const statusBadge={pending:'badge-warning',approved:'badge-success',rejected:'badge-danger'};
  const user=getUsers().find(u=>u.login===r.teacherLogin);
  const existingCourse=r.existingCourseId?getCourses().find(c=>c.id===r.existingCourseId):null;
  const dtFmt=iso=>iso?new Date(iso).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
  return`<div class="card" style="border-left:4px solid ${statusColors[r.status]||'#6366f1'}">
    <div class="card-body">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div style="flex:1;min-width:0">

          <!-- Статус и тип -->
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">
            <span class="badge ${statusBadge[r.status]}">${statusLabels[r.status]}</span>
            <span class="badge ${r.type==='existing'?'badge-primary':'badge-success'}">${r.type==='existing'?'Существующий курс':'Новый курс'}</span>
          </div>

          <!-- Название -->
          <div style="font-size:16px;font-weight:700;margin-bottom:10px">${r.courseTitle}</div>

          <!-- Даты -->
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;margin-bottom:12px">
            <div style="padding:8px 12px;background:var(--bg);border-radius:8px;font-size:12px">
              <div style="color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px">📅 Дата подачи</div>
              <div style="font-weight:600;color:var(--text)">${dtFmt(r.requestedAt)}</div>
            </div>
            ${r.reviewedAt?`<div style="padding:8px 12px;background:var(--bg);border-radius:8px;font-size:12px">
              <div style="color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px">✅ Дата решения</div>
              <div style="font-weight:600;color:var(--text)">${dtFmt(r.reviewedAt)}</div>
            </div>`:''}
          </div>

          <!-- Детали -->
          <div style="display:flex;flex-direction:column;gap:6px;font-size:13px;color:var(--text-secondary)">
            <div><b>Преподаватель:</b> ${user?.displayName||r.teacherLogin} · <b>Направление:</b> ${r.category||'—'} · <b>Уровень:</b> ${r.level||'—'}</div>
            ${r.hours?`<div><b>Часов:</b> ${r.hours} · <b>Модулей:</b> ${(r.program||[]).length}</div>`:''}
            ${r.description?`<div style="margin-top:4px"><b>Описание:</b> ${r.description}</div>`:''}
            ${r.motivation?`<div style="margin-top:4px"><b>Мотивация:</b> ${r.motivation}</div>`:''}
          </div>

          ${existingCourse?`<div style="font-size:13px;padding:8px 12px;background:var(--accent-light);border-radius:8px;margin-top:10px">
            📚 Запрошенный курс: <b>${existingCourse.title}</b> · ${existingCourse.category}
          </div>`:''}

          ${(r.program||[]).length>0?`<div style="margin-top:10px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--text-muted);margin-bottom:6px">Содержание курса</div>
            <div style="display:flex;flex-direction:column;gap:4px">
              ${r.program.map(m=>`<div style="font-size:12px;padding:6px 10px;background:var(--bg);border-radius:6px;display:flex;gap:8px">
                <span style="font-weight:700;color:var(--accent)">${m.n}.</span><span>${m.name}</span>
              </div>`).join('')}
            </div>
          </div>`:''}

          ${r.adminComment?`<div style="font-size:13px;padding:10px 14px;background:${r.status==='rejected'?'#fee2e2':'#dcfce7'};border-radius:8px;margin-top:10px">
            <b>Комментарий администратора:</b> ${r.adminComment}
          </div>`:''}
        </div>

        ${r.status==='pending'?`<div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0">
          <button class="btn btn-primary" onclick="approveRequest('${r.id}')" style="min-width:140px">${SVG.check} Одобрить</button>
          <button class="btn btn-danger"  onclick="rejectRequest('${r.id}')"  style="min-width:140px">${SVG.trash} Отклонить</button>
        </div>`:''}
      </div>
    </div>
  </div>`;
}

function openAdminCourseForm(courseId){
  const cc=courseId?getCourses().find(c=>c.id===courseId):null;
  const teachers=getUsers().filter(u=>u.role==='teacher');
  // Get currently assigned teachers for this course
  const assignedLogins=cc
    ? teachers.filter(t=>getTeacherCourses(t.login).includes(cc.id)).map(t=>t.login)
    : (cc?.teacherLogin?[cc.teacherLogin]:[]);
  const cats=['ИИ / МО','Наука о данных','NLP','MLOps','Глубокое обучение','Облачные технологии','DevOps','IoT / Робототехника','SCADA / Автоматизация','Разработка приложений','Информатика','Математика','ИИ в медицине','ИИ в образовании','Другое'];

  openModal(`<div style="background:#fff;border-radius:18px;width:100%;max-width:660px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.22)">
    <div style="padding:22px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:10">
      <h3 style="font-size:18px;font-weight:700">${cc?'Редактировать курс':'Создать курс'}</h3>
      <button onclick="closeModal()" style="width:30px;height:30px;border-radius:50%;background:var(--bg);border:none;cursor:pointer;font-size:18px">✕</button>
    </div>
    <div style="padding:24px 28px;display:flex;flex-direction:column;gap:14px">
      ${mField('Название курса *',mInput('ac_title','text','Название',cc?.title||''))}
      ${mField('Описание *',mTextarea('ac_desc','Описание курса',cc?.desc||'',3))}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        ${mField('Направление *',`<select id="ac_cat" style="width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">
          ${cats.map(cat=>`<option value="${cat}" ${(cc?.category||'')=== cat?'selected':''}>${cat}</option>`).join('')}
        </select>`)}
        ${mField('Уровень',`<select id="ac_level" style="width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">
          ${['Начальный','Средний','Продвинутый'].map(l=>`<option value="${l}" ${(cc?.level||'Начальный')===l?'selected':''}>${l}</option>`).join('')}
        </select>`)}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        ${mField('Академических часов',mInput('ac_hours','number','72',String(cc?.hours||72)))}
        ${mField('Статус',`<select id="ac_status" style="width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">
          <option value="published" ${(cc?.status||'published')==='published'?'selected':''}>Опубликован</option>
          <option value="draft" ${cc?.status==='draft'?'selected':''}>Черновик</option>
        </select>`)}
      </div>
      ${mField('Преподаватели (можно выбрать несколько)',`
        <div style="border:1.5px solid var(--border);border-radius:10px;padding:10px 14px;max-height:180px;overflow-y:auto;background:#fff">
          ${teachers.length===0
            ?'<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:10px">Преподавателей нет</div>'
            :teachers.map(t=>`<label style="display:flex;align-items:center;gap:9px;padding:7px 4px;font-size:13px;cursor:pointer;border-radius:6px" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <input type="checkbox" name="ac_teachers" value="${t.login}" ${assignedLogins.includes(t.login)?'checked':''} style="width:15px;height:15px;accent-color:var(--accent);flex-shrink:0">
              ${t.displayName} <span style="font-size:11px;color:var(--text-muted);margin-left:4px">${t.email||t.login}</span>
            </label>`).join('')}
        </div>
      `)}
      ${mField('Содержание курса (каждый модуль с новой строки)',mTextarea('ac_program','Модуль 1: Введение\nМодуль 2: Основы...',cc?(cc.program||[]).map(m=>m.name).join('\n'):'',4))}
    </div>
    <div style="padding:16px 28px;border-top:1px solid var(--border);display:flex;gap:10px;position:sticky;bottom:0;background:#fff">
      ${mBtn('Сохранить',`saveAdminCourse('${courseId||''}')`,'btn-primary')}
      ${mBtn('Отмена','closeModal()','btn-secondary')}
    </div>
  </div>`);
}

function saveAdminCourse(courseId){
  // Read form values reliably
  const titleEl=document.getElementById('ac_title');
  const descEl=document.getElementById('ac_desc');
  const catEl=document.getElementById('ac_cat');
  const levelEl=document.getElementById('ac_level');
  const hoursEl=document.getElementById('ac_hours');
  const statusEl=document.getElementById('ac_status');
  const progEl=document.getElementById('ac_program');

  const title=(titleEl?.value||'').trim();
  const desc=(descEl?.value||'').trim();
  const cat=catEl?.value||'';
  if(!title){showToast('Введите название курса','error');return;}
  if(!desc){showToast('Добавьте описание','error');return;}
  if(!cat){showToast('Выберите направление','error');return;}

  const level=levelEl?.value||'Начальный';
  const lvlClass={Начальный:'badge-success',Средний:'badge-warning',Продвинутый:'badge-danger'};
  const hours=parseInt(hoursEl?.value)||72;
  const status=statusEl?.value||'published';

  // Multi-teacher checkboxes
  const checkedTeacherEls=[...document.querySelectorAll('input[name="ac_teachers"]:checked')];
  const teacherLogins=checkedTeacherEls.map(el=>el.value);
  const allUsers=getUsers();
  const teacherNames=teacherLogins.map(login=>allUsers.find(u=>u.login===login)?.displayName||login);

  const grads={'ИИ / МО':'linear-gradient(135deg,#3b82f6,#1d4ed8)','NLP':'linear-gradient(135deg,#10b981,#047857)','MLOps':'linear-gradient(135deg,#ec4899,#9d174d)','Глубокое обучение':'linear-gradient(135deg,#7c3aed,#5b21b6)','Наука о данных':'linear-gradient(135deg,#f59e0b,#b45309)','Облачные технологии':'linear-gradient(135deg,#0ea5e9,#0369a1)','DevOps':'linear-gradient(135deg,#64748b,#334155)','IoT / Робототехника':'linear-gradient(135deg,#22c55e,#15803d)','SCADA / Автоматизация':'linear-gradient(135deg,#f97316,#c2410c)','Разработка приложений':'linear-gradient(135deg,#6366f1,#4338ca)','Информатика':'linear-gradient(135deg,#667eea,#764ba2)','Математика':'linear-gradient(135deg,#14b8a6,#0d9488)','ИИ в медицине':'linear-gradient(135deg,#e11d48,#9f1239)','ИИ в образовании':'linear-gradient(135deg,#8b5cf6,#6d28d9)'};

  // Собираем программу из текста
  const progText=(progEl?.value||'');
  const program=progText.split('\n').map((s,i)=>({n:i+1,name:s.trim(),l:0,h:'—'})).filter(m=>m.name);

  const courses=getCourses();
  const effectiveCourseId=courseId&&courseId!==''?courseId:null;

  if(effectiveCourseId){
    const idx=courses.findIndex(c=>c.id===effectiveCourseId);
    if(idx===-1){showToast('Курс не найден','error');return;}
    courses[idx]={
      ...courses[idx],
      title,desc,category:cat,level,
      levelClass:lvlClass[level]||'badge-success',
      hours,status,program,modules:program.length,
      grad:grads[cat]||courses[idx].grad||'linear-gradient(135deg,#6366f1,#818cf8)',
      teacher:teacherNames.join(', ')||courses[idx].teacher||'',
      teacherLogin:teacherLogins[0]||courses[idx].teacherLogin||'',
      teacherLogins:teacherLogins,
      updatedAt:new Date().toISOString()
    };
    // Sync teacher access: add new teachers, leave existing ones
    teacherLogins.forEach(login=>{
      const ids=getTeacherCourses(login);
      if(!ids.includes(effectiveCourseId)){ids.push(effectiveCourseId);setTeacherCourses(login,ids);}
    });
    saveCourses(courses);
    showToast(`Курс «${title}» обновлён`,'success');
  } else {
    const newId=uid();
    const newCourse={
      id:newId,title,desc,category:cat,level,
      levelClass:lvlClass[level]||'badge-success',
      teacher:teacherNames.join(', ')||'',
      teacherLogin:teacherLogins[0]||'',
      teacherLogins:teacherLogins,
      grad:grads[cat]||'linear-gradient(135deg,#6366f1,#818cf8)',
      icon:'',rating:0,studentsCount:0,hours,
      modules:program.length,lessons:0,
      outcomes:[],program,tags:[cat],status,
      createdAt:new Date().toISOString()
    };
    saveCourses([...courses,newCourse]);
    teacherLogins.forEach(login=>{
      const ids=getTeacherCourses(login);
      ids.push(newId);
      setTeacherCourses(login,ids);
    });
    showToast(`Курс «${title}» создан`,'success');
  }
  closeModal();
  window._adminCoursesTab='courses';
  renderAdminCourses(document.getElementById('mainContent'));
}

function adminDeleteCourse(courseId){
  const cc=getCourses().find(c=>c.id===courseId);
  if(!cc)return;
  if(!confirm(`Удалить курс «${cc.title}»? Это действие нельзя отменить.`))return;
  saveCourses(getCourses().filter(c=>c.id!==courseId));
  showToast(`Курс «${cc.title}» удалён`,'error');
  renderAdminCourses(document.getElementById('mainContent'));
}

function approveRequest(reqId){
  const reqs=getCourseRequests(), r=reqs.find(x=>x.id===reqId);
  if(!r)return;
  const comment=prompt('Комментарий для преподавателя (необязательно):')||'';
  if(r.type==='existing'){
    const ids=getTeacherCourses(r.teacherLogin);
    if(!ids.includes(r.existingCourseId)){ids.push(r.existingCourseId);setTeacherCourses(r.teacherLogin,ids);}
    const courses=getCourses(), ci=courses.findIndex(c=>c.id===r.existingCourseId);
    if(ci!==-1){const user=getUsers().find(u=>u.login===r.teacherLogin);if(user){courses[ci].teacher=user.displayName;courses[ci].teacherLogin=r.teacherLogin;}saveCourses(courses);}
  } else {
    const user=getUsers().find(u=>u.login===r.teacherLogin);
    const grads={'ИИ / МО':'linear-gradient(135deg,#3b82f6,#1d4ed8)','NLP':'linear-gradient(135deg,#10b981,#047857)','MLOps':'linear-gradient(135deg,#ec4899,#9d174d)','Глубокое обучение':'linear-gradient(135deg,#7c3aed,#5b21b6)','Наука о данных':'linear-gradient(135deg,#f59e0b,#b45309)'};
    const lvl={Начальный:'badge-success',Средний:'badge-warning',Продвинутый:'badge-danger'};
    const newCourse={id:uid(),title:r.courseTitle,desc:r.description||'',category:r.category||'Другое',level:r.level||'Начальный',levelClass:lvl[r.level]||'badge-success',teacher:user?.displayName||r.teacherLogin,teacherLogin:r.teacherLogin,grad:grads[r.category]||'linear-gradient(135deg,#6366f1,#818cf8)',icon:'',rating:0,studentsCount:0,hours:r.hours||72,modules:(r.program||[]).length||1,lessons:0,outcomes:r.outcomes||[],program:r.program||[],tags:[r.category||'Другое'],status:'published',createdAt:new Date().toISOString()};
    saveCourses([...getCourses(),newCourse]);
    const ids=getTeacherCourses(r.teacherLogin);ids.push(newCourse.id);setTeacherCourses(r.teacherLogin,ids);
  }
  r.status='approved';r.adminComment=comment;r.reviewedAt=new Date().toISOString();
  saveCourseRequests(reqs);
  logActivity('course_request_approved',`Заявка одобрена: «${r.courseTitle}» для ${r.teacherLogin}`);
  showToast('Заявка одобрена. Преподаватель получил доступ.','success');
  window._adminCoursesTab='requests';
  renderAdminCourses(document.getElementById('mainContent'));
}

function rejectRequest(reqId){
  const reqs=getCourseRequests(), r=reqs.find(x=>x.id===reqId);
  if(!r)return;
  const comment=prompt('Причина отказа (обязательно):');
  if(!comment){showToast('Укажите причину','error');return;}
  r.status='rejected';r.adminComment=comment;r.reviewedAt=new Date().toISOString();
  saveCourseRequests(reqs);
  logActivity('course_request_rejected',`Заявка отклонена: «${r.courseTitle}» от ${r.teacherLogin}`);
  showToast('Заявка отклонена','error');
  window._adminCoursesTab='requests';
  renderAdminCourses(document.getElementById('mainContent'));
}

function renderStatisticsPage(c){
  const users=getUsers(), log=getActivityLog(), courses=getCourses();
  const students=users.filter(u=>u.role==='student');
  const teachers=users.filter(u=>u.role==='teacher');
  const surveys=getSurveyResults();
  const allEnrolled=JSON.parse(localStorage.getItem(LS.ENROLLED)||'{}');

  // Enrollment counts per course
  const enrollCounts={};
  Object.values(allEnrolled).forEach(ids=>ids.forEach(id=>{ enrollCounts[id]=(enrollCounts[id]||0)+1; }));
  const topCourses=courses.map(cc=>({...cc,cnt:enrollCounts[cc.id]||0}))
    .sort((a,b)=>b.cnt-a.cnt).slice(0,10);

  // Survey interest counts
  const interestCounts={};
  surveys.forEach(s=>(s.interests||[]).forEach(area=>{
    interestCounts[area]=(interestCounts[area]||0)+1;
  }));
  const topInterests=Object.entries(interestCounts).sort((a,b)=>b[1]-a[1]).slice(0,12);
  const maxI=topInterests[0]?.[1]||1;
  const maxE=topCourses[0]?.cnt||1;

  c.innerHTML=`
  <style>
    .stab{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
    .stab-btn{padding:8px 20px;border-radius:20px;border:1.5px solid var(--border);background:#fff;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-secondary);transition:all .15s}
    .stab-btn:hover,.stab-btn.active{background:var(--accent);border-color:var(--accent);color:#fff}
    .bar-bg{height:10px;background:var(--border);border-radius:5px;overflow:hidden;margin-top:5px}
    .bar-fill{height:100%;border-radius:5px;transition:width .5s}
  </style>

  <!-- Карточки-счётчики -->
  <div class="stats-grid" style="margin-bottom:20px">
    ${statCard(`<span style="color:#6366f1">${SVG.users}</span>`,'purple',
      users.length,`Пользователей всего`,
      students.length+' студентов · '+teachers.length+' преподавателей','')}
    ${statCard(`<span style="color:#10b981">${SVG.activity}</span>`,'green',
      log.filter(e=>e.type==='register').length,'Регистраций','','')}
    ${statCard(`<span style="color:#f59e0b">${SVG.book}</span>`,'orange',
      courses.length,'Курсов на платформе','','')}
    ${statCard(`<span style="color:#3b82f6">${SVG.award||SVG.chart}</span>`,'blue',
      surveys.length,'Опросников заполнено','','')}
  </div>

  <!-- Вкладки -->
  <div class="stab">
    <button class="stab-btn active" onclick="stSwitch('users',this)">👥 Пользователи</button>
    <button class="stab-btn" onclick="stSwitch('enroll',this)">📚 Записи на курсы</button>
    <button class="stab-btn" onclick="stSwitch('survey',this)">📊 Опросник</button>
    <button class="stab-btn" onclick="stSwitch('log',this)">📋 Журнал</button>
  </div>

  <!-- Вкладка: Пользователи -->
  <div id="st_users">
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><h3>Пользователи по ролям</h3></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
          ${[['Студентов',students.length,'#6366f1'],
             ['Преподавателей',teachers.length,'#10b981'],
             ['Администраторов',users.filter(u=>u.role==='admin').length,'#f59e0b']
            ].map(([l,n,col])=>`
            <div style="text-align:center;padding:20px;background:${col}18;border-radius:12px;border:1.5px solid ${col}30">
              <div style="font-size:38px;font-weight:800;color:${col};font-family:'Sora',sans-serif">${n}</div>
              <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;font-weight:600">${l}</div>
            </div>`).join('')}
        </div>
        <table class="data-table">
          <thead><tr><th>Пользователь</th><th>Роль</th><th>Email</th><th>Дата регистрации</th><th>Направления</th></tr></thead>
          <tbody>
            ${users.slice(-20).reverse().map(u=>`<tr>
              <td><b>${u.displayName}</b></td>
              <td><span class="badge ${u.role==='teacher'?'badge-warning':u.role==='admin'?'badge-danger':'badge-primary'}">${roleLabel(u.role)}</span></td>
              <td style="font-size:13px;color:var(--text-muted)">${u.email||'—'}</td>
              <td style="font-size:13px;color:var(--text-muted)">${fmtDate(u.createdAt)}</td>
              <td style="font-size:11px;color:var(--text-muted)">${u.teachingAreas?.slice(0,2).join(', ')||'—'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Вкладка: Записи на курсы -->
  <div id="st_enroll" style="display:none">
    <div class="card">
      <div class="card-header"><h3>Самые популярные курсы</h3></div>
      <div class="card-body">
        ${topCourses.length===0
          ?`<div style="text-align:center;padding:32px;color:var(--text-muted)">Записей пока нет</div>`
          :topCourses.map((cc,i)=>`
            <div style="margin-bottom:16px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
                <span style="font-size:14px;font-weight:600">${i+1}. ${cc.title}</span>
                <span style="font-size:13px;font-weight:700;color:var(--accent)">${cc.cnt} записей</span>
              </div>
              <div class="bar-bg"><div class="bar-fill" style="width:${Math.round(cc.cnt/maxE*100)}%;background:linear-gradient(90deg,#6366f1,#4338ca)"></div></div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:3px">${cc.category||''} · ${cc.level||''}</div>
            </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Вкладка: Опросник -->
  <div id="st_survey" style="display:none">
    <div class="card" style="margin-bottom:16px">
      <div class="card-header" style="display:flex;align-items:center;justify-content:space-between">
        <h3>Интересы слушателей — что важно и что добавить</h3>
        <span style="font-size:13px;color:var(--text-muted)">${surveys.length} ответов</span>
      </div>
      <div class="card-body">
        ${topInterests.length===0
          ?`<div style="text-align:center;padding:40px;color:var(--text-muted)">
              <div style="font-size:40px;margin-bottom:12px">📊</div>
              <div>Опросников пока не заполнено.<br>Они появятся когда студенты войдут в систему впервые.</div>
            </div>`
          :topInterests.map(([name,cnt])=>`
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <span style="font-size:14px;font-weight:600">${name}</span>
                <span style="font-size:13px;font-weight:700;color:var(--accent)">${cnt} / ${surveys.length}</span>
              </div>
              <div class="bar-bg">
                <div class="bar-fill" style="width:${Math.round(cnt/maxI*100)}%;background:linear-gradient(90deg,#10b981,#047857)"></div>
              </div>
            </div>`).join('')}
        ${surveys.filter(s=>s.comment).length>0?`
          <div style="margin-top:24px;border-top:1px solid var(--border);padding-top:18px">
            <div style="font-size:13px;font-weight:700;color:var(--text-secondary);margin-bottom:12px">
              💬 Комментарии и пожелания студентов
            </div>
            ${surveys.filter(s=>s.comment).slice(0,10).map(s=>`
              <div style="padding:12px 14px;background:var(--bg);border-radius:10px;margin-bottom:8px;font-size:13px;line-height:1.6;border-left:3px solid var(--accent)">
                «${s.comment}»
                <div style="font-size:12px;color:var(--text-muted);margin-top:4px">— ${s.userName}, ${fmtDate(s.createdAt)}</div>
              </div>`).join('')}
          </div>`:``}
      </div>
    </div>
  </div>

  <!-- Вкладка: Журнал -->
  <div id="st_log" style="display:none">
    <div class="card">
      <div class="card-header"><h3>Журнал активности</h3></div>
      <div class="card-body" style="padding:0 24px;max-height:420px;overflow-y:auto">
        ${log.length===0
          ?`<div style="text-align:center;padding:32px;color:var(--text-muted)">Активности пока нет</div>`
          :`<div class="activity-list">${log.map(e=>`
              <div class="activity-item">
                <div class="activity-dot">${e.type==='register'?SVG.users:SVG.activity}</div>
                <div><div class="a-title">${e.message}</div><div class="a-time">${timeAgo(e.time)}</div></div>
              </div>`).join('')}</div>`}
      </div>
    </div>
  </div>`;
}

function stSwitch(tab, btn){
  ['users','enroll','survey','log'].forEach(t=>{
    const el=document.getElementById('st_'+t);
    if(el) el.style.display = t===tab ? 'block' : 'none';
  });
  document.querySelectorAll('.stab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

function renderSettingsPage(c){
  const s=getSettings();
  c.innerHTML=`<div class="content-grid">
    <div style="display:flex;flex-direction:column;gap:20px">
      <div class="card"><div class="card-header"><h3>Настройки платформы</h3></div><div class="card-body" style="display:flex;flex-direction:column;gap:16px">
        <div class="form-group" style="margin:0"><label class="form-label">Название</label><input type="text" id="stgName" class="form-control" value="${s.platformName}"></div>
        <div class="form-group" style="margin:0"><label class="form-label">Email</label><input type="email" id="stgEmail" class="form-control" value="${s.email}"></div>
        <div class="form-group" style="margin:0"><label class="form-label">Макс. студентов на курс</label><input type="number" id="stgMax" class="form-control" value="${s.maxStudents}"></div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" onclick="doSaveSettings()">${SVG.check} Сохранить</button>
          <button class="btn btn-secondary" onclick="exportUsersToText()">${SVG.download} Экспорт</button>
        </div>
      </div></div>
      <div class="card"><div class="card-header"><h3>Уведомления</h3></div><div class="card-body">
        ${toggleRow('Email-уведомления','notifEmail',s.notifEmail)}
        ${toggleRow('Новые пользователи','notifNewUser',s.notifNewUser)}
        ${toggleRow('Еженедельные отчёты','notifWeekly',s.notifWeekly)}
      </div></div>
    </div>
    <div class="card" style="align-self:start"><div class="card-header"><h3>Система</h3></div><div class="card-body"><div class="info-list">
      <div class="info-item"><div class="icon">${SVG.settings}</div><div><div class="label">Версия платформы</div><div class="value">КазНУ ЦДПО v2.4</div></div></div>
      <div class="info-item"><div class="icon">${SVG.users}</div><div><div class="label">Пользователей</div><div class="value">${getUsers().length}</div></div></div>
      <div class="info-item"><div class="icon">${SVG.book}</div><div><div class="label">Курсов</div><div class="value">${getCourses().length}</div></div></div>
      <div class="info-item"><div class="icon">${SVG.activity}</div><div><div class="label">Адрес</div><div class="value">пр. аль-Фараби 71, Алматы</div></div></div>
      <div class="info-item"><div class="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div><div><div class="label">Телефон</div><div class="value">+7 (707) 570-36-30</div></div></div>
    </div></div></div>
  </div>`;
}
function doSaveSettings(){const s=getSettings();s.platformName=document.getElementById('stgName')?.value||s.platformName;s.email=document.getElementById('stgEmail')?.value||s.email;s.maxStudents=document.getElementById('stgMax')?.value||s.maxStudents;saveSettings(s);showToast('Сохранено','success');}

function exportUsersToText(){
  const users=getUsers(), log=getActivityLog();
  let txt=`КазНУ ЦДПО — Данные пользователей\nДата экспорта: ${new Date().toLocaleString('ru-RU')}\n${'═'.repeat(60)}\n\nВсего: ${users.length}\n\n`;
  users.forEach((u,i)=>{txt+=`─── Пользователь ${i+1} ───\n  Имя: ${u.displayName}\n  Логин: ${u.login}\n  Роль: ${roleLabel(u.role)}\n  Телефон: ${u.phone||'—'}\n  Email: ${u.email||'—'}\n  Регистрация: ${new Date(u.createdAt).toLocaleString('ru-RU')}\n\n`;});
  txt+=`\n${'═'.repeat(60)}\nЖУРНАЛ АКТИВНОСТИ (последние 30)\n${'═'.repeat(60)}\n\n`;
  log.slice(0,30).forEach(e=>{txt+=`[${new Date(e.time).toLocaleString('ru-RU')}] ${e.message}\n`;});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));
  a.download=`eduflow_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();showToast('Файл скачан','success');
}

/* ===========================================================
   ПРЕПОДАВАТЕЛЬ — МОИ КУРСЫ
=========================================================== */
function renderTeacherCourses(c){
  const name=getName();
  // Показываем ТОЛЬКО курсы, по которым сам преподаватель подал заявку и она одобрена
  const allReqs=getCourseRequests().filter(r=>r.teacherLogin===name);
  const approvedReqs=allReqs.filter(r=>r.status==='approved');
  const approvedIds=approvedReqs.map(r=>r.existingCourseId||r.courseId).filter(Boolean);
  // Также включить новые курсы, созданные по одобренной заявке (type==='new')
  const allCourses=getCourses();
  const myCourses=allCourses.filter(cc=>
    approvedIds.includes(cc.id) ||
    (cc.teacherLogin===name && approvedReqs.some(r=>r.type!=='existing'&&cc.title===r.courseTitle))
  );
  const allReqs=getCourseRequests().filter(r=>r.teacherLogin===name);
  const pending=allReqs.filter(r=>r.status==='pending');
  const dismissed=getDismissedRejects();
  const newRejected=allReqs.filter(r=>r.status==='rejected'&&!dismissed.includes(r.id));

  c.innerHTML=`
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div class="section-title" style="margin:0">Мои курсы${myCourses.length>0?` (${myCourses.length})`:''}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary" onclick="renderPage('teacher-requests')" style="position:relative">
        ${SVG.clipboard} Мои заявки
        ${(pending.length+newRejected.length)>0?`<span style="position:absolute;top:-6px;right:-6px;background:#ef4444;color:#fff;border-radius:50%;width:18px;height:18px;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center">${pending.length+newRejected.length}</span>`:''}
      </button>
      <button class="btn btn-secondary" onclick="renderPage('teacher-catalog')">${SVG.book} Выбрать курс</button>
      <button class="btn btn-primary"   onclick="renderPage('create-course')">${SVG.plus} Новый курс</button>
    </div>
  </div>

  ${pending.length>0?`<div style="background:#fef9c3;border:1.5px solid #f59e0b;border-radius:12px;padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
    <div style="font-size:14px;font-weight:700;color:#92400e">⏳ ${pending.length} заявок на рассмотрении у администратора</div>
    <button class="btn btn-sm btn-secondary" onclick="renderPage('teacher-requests')">Смотреть →</button>
  </div>`:''}

  ${newRejected.length>0?`<div style="background:#fee2e2;border:1.5px solid #ef4444;border-radius:12px;padding:14px 18px;margin-bottom:16px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">
      <div style="font-size:14px;font-weight:700;color:#991b1b">❌ ${newRejected.length} заявок отклонено</div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-sm btn-secondary" onclick="renderPage('teacher-requests')">Все заявки →</button>
      </div>
    </div>
    ${newRejected.map(r=>`<div style="background:rgba(255,255,255,0.7);border-radius:8px;padding:10px 14px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
      <div>
        <b style="font-size:13px">${r.courseTitle}</b>
        ${r.adminComment?`<div style="font-size:12px;color:#991b1b;margin-top:3px">Причина: ${r.adminComment}</div>`:''}
      </div>
      <button onclick="dismissSingleReject('${r.id}')" class="btn btn-sm btn-secondary" style="flex-shrink:0">Скрыть</button>
    </div>`).join('')}
  </div>`:''}

  ${myCourses.length===0
    ?`<div class="card"><div class="card-body" style="text-align:center;padding:60px 24px">
        <div style="width:60px;height:60px;background:var(--bg);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:var(--text-muted)">${SVG.book}</div>
        <h3 style="font-size:19px;font-weight:700;margin-bottom:8px">Вам пока не назначены курсы</h3>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:24px;max-width:380px;margin-left:auto;margin-right:auto">
          Выберите существующий курс или предложите новый. После одобрения администратора курс появится здесь.
        </p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button onclick="renderPage('teacher-catalog')" class="btn btn-secondary">Выбрать из списка</button>
          <button onclick="renderPage('create-course')"   class="btn btn-primary">Предложить новый →</button>
        </div>
      </div></div>`
    :`<div class="my-courses-grid">${myCourses.map(cc=>uniformCourseCard(cc,'teacher')).join('')}</div>`
  }`;
}

function dismissSingleReject(reqId){
  dismissReject(reqId);
  renderTeacherCourses(document.getElementById('mainContent'));
}
function dismissAllRejects(){
  const name=getName();
  getCourseRequests().filter(r=>r.teacherLogin===name&&r.status==='rejected')
    .forEach(r=>dismissReject(r.id));
  renderTeacherCourses(document.getElementById('mainContent'));
}

/* ===========================================================
   ЕДИНАЯ КАРТОЧКА КУРСА (для всех ролей)
=========================================================== */
function uniformCourseCard(cc, role, extra={}){
  const enrolled=JSON.parse(localStorage.getItem(LS.ENROLLED)||'{}');
  const enrolledCount=Object.values(enrolled).filter(ids=>ids.includes(cc.id)).length;
  const isEnrolled=extra.isEnrolled||false;
  const author=getCourseAuthor(cc.id)||cc.teacher||'';

  // Footer buttons по роли
  let footer='';
  if(role==='teacher'){
    footer=`<button class="btn btn-sm btn-primary" style="flex:1" onclick="window.location.href='course.html?id=${cc.id}'">Открыть курс →</button>`;
  } else if(role==='student-enrolled'){
    footer=`<button class="btn btn-sm btn-primary" style="flex:1" onclick="window.location.href='course.html?id=${cc.id}'">Продолжить →</button>`;
  } else if(role==='catalog'){
    footer=`
      <button onclick="openCourseDetail('${cc.id}')" style="flex:1;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:#fff;font-size:13px;font-weight:600;cursor:pointer">Подробнее</button>
      <button class="enroll-btn-sm ${isEnrolled?'enrolled':''}" id="enroll_${cc.id}"
        ${isEnrolled?'disabled':''}
        onclick="${isEnrolled?`showToast('Вы уже записаны на этот курс','default')`:`enrollCourse('${cc.id}',this)`}">${isEnrolled?'✓ Записан':'Записаться'}</button>`;
  } else if(role==='tc'){
    const isPending=extra.isPending||false;
    footer=isPending
      ?`<span class="badge badge-warning" style="padding:9px 16px;font-size:13px;width:100%;text-align:center">⏳ Заявка отправлена</span>`
      :`<button class="btn btn-primary" style="width:100%" onclick="openTeachRequest('${cc.id}')">Запросить доступ</button>`;
  }

  return`<div class="my-course-card${role==='catalog'?' catalog-card':''}" data-cat="${cc.category}" data-title="${cc.title.toLowerCase()}">
    <div class="mc-thumb" style="background:${cc.grad||'#6366f1'}">${COURSE_ICON_SVG[cc.icon]||SVG.book}</div>
    <div class="mc-body">
      <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
        <span class="badge badge-primary" style="font-size:11px">${cc.category||'Курс'}</span>
        <span class="badge ${cc.levelClass||'badge-muted'}" style="font-size:11px">${cc.level||''}</span>
      </div>
      <div class="mc-title">${cc.title}</div>
      <div style="font-size:12px;color:${author?'var(--text-secondary)':'var(--text-muted)'};margin-top:4px">
        ${author?`👤 ${author}`:'<span style="font-style:italic">Преподаватель не назначен</span>'}
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:4px">
        ${cc.modules>0?`${cc.modules} модулей · `:''}${cc.hours||72} ч
        ${role==='teacher'?` · ${enrolledCount} записей`:''}
        ${role==='student-enrolled'?`<div class="mc-progress-label"><span>Прогресс</span><span>0%</span></div><div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>`:''}
      </div>
    </div>
    <div class="mc-footer" style="display:flex;gap:8px">${footer}</div>
  </div>`;
}

/* ===========================================================
   ПРЕПОДАВАТЕЛЬ — МОИ ЗАЯВКИ
=========================================================== */
function renderTeacherRequests(c){
  const name=getName();
  const allReqs=getCourseRequests().filter(r=>r.teacherLogin===name).sort((a,b)=>new Date(b.requestedAt)-new Date(a.requestedAt));
  const pending=allReqs.filter(r=>r.status==='pending');
  const approved=allReqs.filter(r=>r.status==='approved');
  const rejected=allReqs.filter(r=>r.status==='rejected');

  const statusBadge={pending:'badge-warning',approved:'badge-success',rejected:'badge-danger'};
  const statusLabel={pending:'⏳ На рассмотрении',approved:'✓ Одобрено',rejected:'✗ Отклонено'};

  const reqRow=r=>`<div class="card" style="margin-bottom:12px;border-left:4px solid ${r.status==='approved'?'#10b981':r.status==='rejected'?'#ef4444':'#f59e0b'}">
    <div class="card-body" style="padding:16px 20px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
            <span class="badge ${statusBadge[r.status]}">${statusLabel[r.status]}</span>
            <span class="badge ${r.type==='existing'?'badge-primary':'badge-success'}" style="font-size:11px">${r.type==='existing'?'Существующий курс':'Новый курс'}</span>
          </div>
          <div style="font-size:15px;font-weight:700;margin-bottom:6px">${r.courseTitle}</div>
          <div style="font-size:13px;color:var(--text-muted)">
            ${r.category||''} · ${r.level||''} · Подана: ${fmtDate(r.requestedAt)}
            ${r.reviewedAt?` · Рассмотрена: ${fmtDate(r.reviewedAt)}`:''}
          </div>
          ${r.adminComment?`<div style="margin-top:8px;padding:10px 14px;background:${r.status==='rejected'?'#fee2e2':'#dcfce7'};border-radius:8px;font-size:13px">
            <b>Комментарий администратора:</b> ${r.adminComment}
          </div>`:''}
        </div>
        ${r.status==='approved'?`<span class="badge badge-success" style="font-size:13px;padding:8px 14px;align-self:flex-start">Курс доступен</span>`:''}
      </div>
    </div>
  </div>`;

  c.innerHTML=`
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div class="section-title" style="margin:0">Мои заявки (${allReqs.length})</div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-secondary" onclick="renderPage('my-courses')">← Мои курсы</button>
      <button class="btn btn-primary" onclick="renderPage('create-course')">${SVG.plus} Новая заявка</button>
    </div>
  </div>

  ${allReqs.length===0?`<div class="card"><div class="card-body" style="text-align:center;padding:60px 24px">
    <div style="font-size:48px;margin-bottom:16px">📋</div>
    <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">Заявок пока нет</h3>
    <p style="color:var(--text-secondary);margin-bottom:20px">Подайте заявку на существующий или новый курс</p>
    <div style="display:flex;gap:12px;justify-content:center">
      <button onclick="renderPage('teacher-catalog')" class="btn btn-secondary">Выбрать из каталога</button>
      <button onclick="renderPage('create-course')" class="btn btn-primary">Предложить новый</button>
    </div>
  </div></div>`:''}

  ${pending.length>0?`
  <div class="section-title" style="color:#b45309">⏳ На рассмотрении (${pending.length})</div>
  ${pending.map(reqRow).join('')}`:''}

  ${approved.length>0?`
  <div class="section-title" style="color:var(--success)">✓ Одобренные (${approved.length})</div>
  ${approved.map(reqRow).join('')}`:''}

  ${rejected.length>0?`
  <div class="section-title" style="color:var(--danger)">✗ Отклонённые (${rejected.length})</div>
  ${rejected.map(reqRow).join('')}`:''}`;
}

function teacherCourseCard(cc){
  const enrolled=JSON.parse(localStorage.getItem(LS.ENROLLED)||'{}');
  const enrolledCount=Object.values(enrolled).filter(ids=>ids.includes(cc.id)).length;
  return`<div class="my-course-card">
    <div class="mc-thumb" style="background:${cc.grad||'#6366f1'}">${COURSE_ICON_SVG[cc.icon]||SVG.book}</div>
    <div class="mc-body">
      <div class="mc-title">${cc.title}</div>
      <div class="mc-teacher">${cc.category||''} · ${cc.level||''}</div>
      <div style="font-size:13px;color:var(--text-muted);margin-top:6px">${enrolledCount} студентов записаны</div>
    </div>
    <div class="mc-footer" style="display:flex;gap:8px">
      <button class="btn btn-sm btn-primary" onclick="window.location.href='course.html?id=${cc.id}'">Открыть</button>
    </div>
  </div>`;
}

function renderTeacherCourseCatalog(c){
  const name=getName();
  const approvedIds=getTeacherCourses(name);
  const pendingIds=getCourseRequests().filter(r=>r.teacherLogin===name&&r.status==='pending'&&r.type==='existing').map(r=>r.existingCourseId);
  const courses=getCourses().filter(cc=>cc.status==='published');
  const cats=['Все',...[...new Set(courses.map(cc=>cc.category))]];
  c.innerHTML=`
  <style>
    .tc-card{background:#fff;border-radius:14px;border:1.5px solid var(--border);overflow:hidden;transition:all 0.2s}
    .tc-card:hover{border-color:var(--accent);box-shadow:0 6px 28px rgba(99,102,241,.12);transform:translateY(-2px)}
    .tc-cat-btn{padding:7px 16px;border-radius:20px;border:1.5px solid var(--border);background:#fff;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-secondary);transition:all 0.15s}
    .tc-cat-btn:hover,.tc-cat-btn.active{background:var(--accent);border-color:var(--accent);color:#fff}
  </style>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px">
    <div>
      <div class="section-title" style="margin:0">Каталог курсов для преподавания</div>
      <div style="font-size:13px;color:var(--text-muted);margin-top:4px">Выберите курс и отправьте заявку администратору</div>
    </div>
    <button onclick="renderPage('my-courses')" class="btn btn-secondary">← Назад</button>
  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
    ${cats.map((cat,i)=>`<button class="tc-cat-btn ${i===0?'active':''}" onclick="tcFilter('${cat}',this)">${cat}</button>`).join('')}
  </div>
  <div class="my-courses-grid" id="tcGrid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
    ${courses.map(cc=>{
      const isApproved=approvedIds.includes(cc.id);
      const isPending=pendingIds.includes(cc.id);
      if(isApproved){
        const enrolled=JSON.parse(localStorage.getItem(LS.ENROLLED)||'{}');
        const cnt=Object.values(enrolled).filter(ids=>ids.includes(cc.id)).length;
        const author=getCourseAuthor(cc.id)||cc.teacher||'';
        return`<div class="my-course-card" data-cat="${cc.category}">
          <div class="mc-thumb" style="background:${cc.grad||'#6366f1'}">${COURSE_ICON_SVG[cc.icon]||SVG.book}</div>
          <div class="mc-body">
            <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
              <span class="badge badge-primary" style="font-size:11px">${cc.category||''}</span>
              <span class="badge ${cc.levelClass||'badge-muted'}" style="font-size:11px">${cc.level||''}</span>
              <span class="badge badge-success" style="font-size:11px">✓ Веду</span>
            </div>
            <div class="mc-title">${cc.title}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:4px">${cc.hours||72} ч · ${cnt} записей</div>
          </div>
          <div class="mc-footer" style="display:flex;gap:8px">
            <button class="btn btn-sm btn-primary" style="flex:1" onclick="window.location.href='course.html?id=${cc.id}'">Открыть курс →</button>
          </div>
        </div>`;
      }
      return uniformCourseCard(cc,'tc',{isPending});
    }).join('')}
  </div>`;
  window.tcFilter=function(cat,btn){
    document.querySelectorAll('.tc-cat-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#tcGrid .tc-card').forEach(card=>{
      card.style.display=(cat==='Все'||card.dataset.cat===cat)?'':'none';
    });
  };
}

function openTeachRequest(courseId){
  const cc=getCourses().find(c=>c.id===courseId);
  if(!cc)return;
  openModal(modalBox('Запрос на преподавание курса',
    `<div style="padding:14px;background:var(--accent-light);border-radius:10px;margin-bottom:18px">
      <div style="font-weight:700;font-size:15px">${cc.title}</div>
      <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">${cc.category} · ${cc.level}</div>
    </div>
    <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;line-height:1.6">
      После одобрения администратором вы сможете загружать материалы, задания и тесты по этому курсу.
    </div>
    ${mField('Сопроводительное сообщение',mTextarea('tr_motivation','Опишите ваш опыт и почему хотите вести этот курс...','',4))}`,
    mBtn('Отправить заявку',`submitTeachRequest('${courseId}')`) + mBtn('Отмена','closeModal()','btn-secondary')
  ));
}

function submitTeachRequest(courseId){
  const cc=getCourses().find(c=>c.id===courseId);
  if(!cc)return;
  const motivation=document.getElementById('tr_motivation')?.value.trim()||'';
  const name=getName();
  const reqs=getCourseRequests();
  if(reqs.find(r=>r.teacherLogin===name&&r.existingCourseId===courseId&&r.status==='pending')){
    showToast('Заявка уже отправлена и ожидает рассмотрения','default');closeModal();return;
  }
  reqs.push({id:uid(),type:'existing',teacherLogin:name,existingCourseId:courseId,courseTitle:cc.title,category:cc.category,description:cc.desc||'',motivation,status:'pending',requestedAt:new Date().toISOString()});
  saveCourseRequests(reqs);
  logActivity('course_request',`Преподаватель ${name} запросил доступ к «${cc.title}»`);
  closeModal();
  showToast(`✅ Заявка на «${cc.title}» отправлена. Ожидайте решения администратора.`,'success',4000);
  renderPage('teacher-requests');
}

/* ===========================================================
   МАТЕРИАЛЫ
=========================================================== */
function renderMaterials(c){
  const role = getRole();
  if (role === 'student') { renderStudentMaterials(c); return; }
  const mats=JSON.parse(localStorage.getItem('lms_mats_list')||'[]').filter(m=>m.teacher===getName());
  c.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
    <div class="section-title" style="margin:0">Учебные материалы${mats.length?` (${mats.length})`:''}</div>
    <button class="btn btn-primary" onclick="openUploadMaterial()">${SVG.upload} Загрузить</button>
  </div>
  ${mats.length===0
    ?`<div class="card"><div class="card-body">${emptyState(SVG.folder,'Материалы не загружены','Загрузите PDF, видео и другие ресурсы для ваших курсов')}</div></div>`
    :`<div class="card"><div class="card-body" style="padding:0"><table class="data-table">
        <thead><tr><th>Файл</th><th>Тип</th><th>Курс</th><th>Размер</th><th>Дата</th><th></th></tr></thead>
        <tbody>${mats.map(m=>`<tr>
          <td><b>${m.name}</b></td>
          <td><span class="badge badge-muted">${m.type}</span></td>
          <td style="color:var(--text-secondary)">${m.courseName||'—'}</td>
          <td style="color:var(--text-muted)">${m.size||'—'}</td>
          <td style="color:var(--text-muted);font-size:13px">${m.date}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deleteMaterial('${m.id}')">${SVG.trash}</button></td>
        </tr>`).join('')}</tbody>
      </table></div></div>`
  }`;
}
function renderStudentMaterials(c){
  const me=getCurrentUser(), myId=me?.login||getName();
  const enrolled=getEnrolled(myId);
  const allMats=JSON.parse(localStorage.getItem('lms_mats_list')||'[]');
  const mats=allMats.filter(m=>!m.courseId||enrolled.includes(m.courseId));
  c.innerHTML=`<div class="section-title">Учебные материалы${mats.length?` (${mats.length})`:''}</div>
  ${mats.length===0
    ?`<div class="card"><div class="card-body">${emptyState(SVG.folder,'Материалов пока нет','Материалы появятся после записи на курс и загрузки их преподавателем')}</div></div>`
    :`<div class="card"><div class="card-body" style="padding:0"><table class="data-table">
        <thead><tr><th>Файл</th><th>Тип</th><th>Курс</th><th>Дата</th></tr></thead>
        <tbody>${mats.map(m=>`<tr>
          <td><b>${m.name}</b></td>
          <td><span class="badge badge-muted">${m.type}</span></td>
          <td style="color:var(--text-secondary)">${m.courseName||'Общий'}</td>
          <td style="color:var(--text-muted);font-size:13px">${m.date}</td>
        </tr>`).join('')}</tbody>
      </table></div></div>`
  }`;
}
function deleteMaterial(id){
  const mats=JSON.parse(localStorage.getItem('lms_mats_list')||'[]').filter(m=>m.id!==id);
  localStorage.setItem('lms_mats_list',JSON.stringify(mats));
  showToast('Удалено','error');
  renderMaterials(document.getElementById('mainContent'));
}
function openUploadMaterial(){
  const myCourses=getMyApprovedCourses();
  if(myCourses.length===0){showToast('Нет доступных курсов. Получите доступ к курсу через администратора.','error',4000);return;}  openModal(modalBox('Загрузить материал',
    mField('Название',mInput('mat_name','text','Например: Лекция 1 — Введение'))
    +mField('Тип материала',mSelect('mat_type',[{v:'PDF',l:'PDF-документ'},{v:'Видео',l:'Видеолекция'},{v:'Презентация',l:'Презентация'},{v:'Архив',l:'Архив (.zip)'},{v:'Другое',l:'Другой тип'}]))
    +mField('Курс',mSelect('mat_course',[{v:'',l:'Общий (все курсы)'},...myCourses.map(c=>({v:c.id,l:c.title}))]))
    +`<div id="dropZone" style="border:2px dashed var(--border);border-radius:12px;padding:32px 20px;text-align:center;color:var(--text-muted);margin-top:4px;transition:all 0.2s;cursor:pointer;position:relative"
        onclick="document.getElementById('fileInput').click()"
        ondragover="event.preventDefault();this.style.borderColor='var(--accent)';this.style.background='var(--accent-light)'"
        ondragleave="this.style.borderColor='var(--border)';this.style.background=''"
        ondrop="handleFileDrop(event)">
        <div style="font-size:28px;margin-bottom:10px">${SVG.upload}</div>
        <div style="font-size:15px;font-weight:600;margin-bottom:6px">Перетащите файл сюда</div>
        <div style="font-size:13px;margin-bottom:14px;color:var(--text-muted)">или</div>
        <button type="button" onclick="event.stopPropagation();document.getElementById('fileInput').click()" 
          style="padding:9px 22px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">
          Выбрать файл
        </button>
        <div style="font-size:12px;color:var(--text-muted);margin-top:10px">PDF, MP4, DOCX, PPTX, ZIP до 500 МБ</div>
        <input type="file" id="fileInput" style="display:none" accept=".pdf,.mp4,.docx,.pptx,.zip,.rar,.txt" onchange="handleFileSelect(this)">
      </div>
      <div id="filePreview" style="display:none;margin-top:12px;padding:12px 14px;background:var(--success-light);border-radius:8px;font-size:14px;color:var(--success);display:flex;align-items:center;gap:10px">
        <span style="font-size:20px">✓</span><span id="filePreviewName"></span>
      </div>`,
    mBtn('Загрузить','saveMaterial()') + mBtn('Отмена','closeModal()','btn-secondary')
  ));
}
function handleFileDrop(event){
  event.preventDefault();
  const file=event.dataTransfer.files[0];
  if(file) showFilePreview(file);
  const dz=document.getElementById('dropZone');
  if(dz){dz.style.borderColor='var(--border)';dz.style.background='';}
}
function handleFileSelect(input){
  if(input.files[0]) showFilePreview(input.files[0]);
}
function showFilePreview(file){
  window._selectedFile=file;
  const el=document.getElementById('filePreview');
  const nm=document.getElementById('filePreviewName');
  if(el&&nm){
    const sz=file.size>1024*1024?`${(file.size/1024/1024).toFixed(1)} МБ`:`${Math.round(file.size/1024)} КБ`;
    nm.textContent=`${file.name} (${sz})`;
    el.style.display='flex';
  }
  const nameInp=document.getElementById('mat_name');
  if(nameInp&&!nameInp.value) nameInp.value=file.name.replace(/\.[^.]+$/,'');
}
function saveMaterial(){
  const name=document.getElementById('mat_name')?.value.trim();
  if(!name){showToast('Введите название','error');return;}
  const courseId=document.getElementById('mat_course')?.value;
  const course=getCourses().find(c=>c.id===courseId);
  const mats=JSON.parse(localStorage.getItem('lms_mats_list')||'[]');
  const file=window._selectedFile;
  mats.push({
    id:uid(), teacher:getName(), name,
    type:document.getElementById('mat_type')?.value||'PDF',
    courseId, courseName:course?.title||'Общий',
    size:file?`${Math.round(file.size/1024)} КБ`:'—',
    date:new Date().toLocaleDateString('ru-RU'),
  });
  localStorage.setItem('lms_mats_list',JSON.stringify(mats));
  window._selectedFile=null;
  closeModal(); showToast(`Материал «${name}» загружен`,'success');
  renderMaterials(document.getElementById('mainContent'));
}

/* ===========================================================
   ЗАДАНИЯ — ПРЕПОДАВАТЕЛЬ
=========================================================== */
function renderTeacherAssignments(c){
  const assignments=getAssignments().filter(a=>a.teacherName===getName());
  c.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
    <div class="section-title" style="margin:0">Задания${assignments.length>0?` (${assignments.length})`:''}</div>
    <button class="btn btn-primary" onclick="openCreateAssignment()">${SVG.plus} Новое задание</button>
  </div>
  ${assignments.length===0
    ?`<div class="card"><div class="card-body">${emptyState(SVG.clipboard,'Заданий пока нет','Создайте первое задание для студентов ваших курсов')}</div></div>`
    :`<div style="display:flex;flex-direction:column;gap:12px">${assignments.map(a=>assignmentTeacherCard(a)).join('')}</div>`
  }`;
}
function assignmentTeacherCard(a){
  const subs=getSubmissions().filter(s=>s.assignmentId===a.id);
  const graded=subs.filter(s=>s.grade!==undefined).length;
  return`<div class="assignment-item">
    <div class="ai-left">
      <div class="ai-icon" style="background:var(--accent-light)">${SVG.clipboard}</div>
      <div>
        <div class="ai-title">${a.title}</div>
        <div class="ai-course">${a.courseName||'Все курсы'} · Срок: ${a.deadline||'—'}</div>
        <div style="display:flex;gap:8px;margin-top:6px">
          <span class="badge badge-success">${graded} проверено</span>
          <span class="badge badge-warning">${subs.length-graded} ожидает</span>
          <span class="badge badge-muted">Макс: ${a.maxScore||100} б.</span>
        </div>
      </div>
    </div>
    <div class="ai-right">
      <button class="btn btn-sm btn-primary" onclick="openSubmissions('${a.id}')">Работы (${subs.length})</button>
      <button class="btn btn-sm btn-danger" onclick="deleteAssignment('${a.id}')">${SVG.trash}</button>
    </div>
  </div>`;
}
function openCreateAssignment(){
  const myCourses=getMyApprovedCourses();
  if(myCourses.length===0){showToast('Нет доступных курсов. Получите доступ к курсу через администратора.','error',4000);return;}  openModal(modalBox('Новое задание',
    mField('Название задания',mInput('asgn_title','text','Например: Практика ООП на Python'))
    +mField('Описание задания',mTextarea('asgn_desc','Опишите что нужно сделать, требования к работе...','',4))
    +mField('Курс',mSelect('asgn_course',[{v:'',l:'Все мои курсы'},...myCourses.map(c=>({v:c.id,l:c.title}))]))
    +mField('Максимальный балл',mInput('asgn_score','number','100','100'))
    +mField('Срок сдачи',mInput('asgn_date','date')),
    mBtn('Создать задание','saveAssignment()') + mBtn('Отмена','closeModal()','btn-secondary')
  ));
}
function saveAssignment(){
  const title=document.getElementById('asgn_title')?.value.trim();
  if(!title){showToast('Введите название','error');return;}
  const courseId=document.getElementById('asgn_course')?.value;
  const course=getCourses().find(c=>c.id===courseId);
  const a={
    id:uid(), teacherName:getName(), title,
    desc:document.getElementById('asgn_desc')?.value||'',
    courseId, courseName:course?.title||'Все курсы',
    maxScore:parseInt(document.getElementById('asgn_score')?.value)||100,
    deadline:document.getElementById('asgn_date')?.value||'',
    createdAt:new Date().toISOString(),
  };
  saveAssignments([...getAssignments(),a]);
  closeModal(); showToast(`Задание «${title}» создано`,'success');
  renderTeacherAssignments(document.getElementById('mainContent'));
}
function deleteAssignment(id){if(!confirm('Удалить задание?'))return;saveAssignments(getAssignments().filter(a=>a.id!==id));showToast('Удалено','error');renderTeacherAssignments(document.getElementById('mainContent'));}
function openSubmissions(assignmentId){
  const a=getAssignments().find(x=>x.id===assignmentId);
  const subs=getSubmissions().filter(s=>s.assignmentId===assignmentId);
  if(subs.length===0){showToast('Пока нет сданных работ','default');return;}
  openModal(modalBox(`Работы: ${a?.title||''}`,
    `<table class="data-table" style="width:100%"><thead><tr><th>Студент</th><th>Сдано</th><th>Оценка</th><th></th></tr></thead><tbody>
    ${subs.map(s=>`<tr>
      <td>${s.studentName}</td>
      <td style="font-size:13px;color:var(--text-muted)">${fmtDate(s.submittedAt)}</td>
      <td>${s.grade!==undefined?`<b>${s.grade}/${a?.maxScore||100}</b>`:'<span class="badge badge-warning">Не проверено</span>'}</td>
      <td><button class="btn btn-sm btn-secondary" onclick="gradeSubmission('${s.id}','${a?.maxScore||100}')">Оценить</button></td>
    </tr>`).join('')}</tbody></table>`
  ));
}
function gradeSubmission(subId, maxScore){
  const score=prompt(`Введите оценку (0–${maxScore}):`);
  if(score===null)return;
  const n=parseInt(score);
  if(isNaN(n)||n<0||n>parseInt(maxScore)){showToast('Некорректная оценка','error');return;}
  const subs=getSubmissions();
  const idx=subs.findIndex(s=>s.id===subId);
  if(idx!==-1){subs[idx].grade=n; saveSubmissions(subs);}
  // Добавляем в журнал оценок
  const sub=subs[idx];
  if(sub){
    const grades=getGrades();
    const gi=grades.findIndex(g=>g.subId===subId);
    const entry={subId,studentName:sub.studentName,studentLogin:sub.studentLogin,courseId:sub.courseId,assignmentId:sub.assignmentId,grade:n,maxScore:parseInt(maxScore),gradedAt:new Date().toISOString()};
    if(gi!==-1)grades[gi]=entry; else grades.push(entry);
    saveGrades(grades);
  }
  showToast(`Оценка ${n}/${maxScore} сохранена`,'success');
  closeModal();
}

/* ===========================================================
   ТЕСТЫ — ПРЕПОДАВАТЕЛЬ (новый конструктор)
=========================================================== */
function renderTeacherQuizzes(c){
  const quizzes=getQuizzes().filter(q=>q.teacherName===getName());
  c.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
    <div class="section-title" style="margin:0">Тесты${quizzes.length>0?` (${quizzes.length})`:''}</div>
    <button class="btn btn-primary" onclick="renderPage('quiz-builder')">${SVG.plus} Создать тест</button>
  </div>
  ${quizzes.length===0
    ?`<div class="card"><div class="card-body">${emptyState(SVG.quiz,'Тестов пока нет','Создайте первый тест для студентов')}</div></div>`
    :`<div class="card"><div class="card-body" style="padding:0"><table class="data-table">
        <thead><tr><th>Тест</th><th>Курс</th><th>Вопросов</th><th>Статус</th><th></th></tr></thead>
        <tbody>${quizzes.map(q=>`<tr>
          <td><b>${q.title}</b></td>
          <td style="color:var(--text-secondary)">${q.courseName||'—'}</td>
          <td>${(q.questions||[]).length}</td>
          <td><span class="badge ${q.status==='active'?'badge-success':'badge-muted'}">${q.status==='active'?'Активен':'Черновик'}</span></td>
          <td><div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="editQuiz('${q.id}')">${SVG.edit} Редактировать</button>
            <button class="btn btn-sm btn-danger" onclick="deleteQuiz('${q.id}')">${SVG.trash}</button>
          </div></td>
        </tr>`).join('')}</tbody>
      </table></div></div>`
  }`;
}
function deleteQuiz(id){if(!confirm('Удалить тест?'))return;saveQuizzes(getQuizzes().filter(q=>q.id!==id));showToast('Удалён','error');renderTeacherQuizzes(document.getElementById('mainContent'));}

/* ── Роутинг для конструктора ── */
const _origRenderPage = renderPage;

/* Конструктор тестов — отдельная страница */
function renderQuizBuilder(c, editId){
  const myCourses=getMyApprovedCourses();
  const existing=editId?getQuizzes().find(q=>q.id===editId):null;
  const questions=existing?[...(existing.questions||[])]:[];

  // Сохраняем вопросы в window для редактирования
  window._qbQuestions=questions.map(q=>({...q,options:[...(q.options||[])]}));
  window._qbEditId=editId||null;

  function render(){
    c.innerHTML=`
      <style>
        .qb-card{background:#fff;border-radius:14px;border:1px solid var(--border);margin-bottom:20px;overflow:hidden}
        .qb-head{padding:18px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
        .qb-body{padding:22px 24px}
        .qb-field{margin-bottom:14px}
        .qb-label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:var(--text-secondary)}
        .qb-inp{width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box;transition:border-color 0.15s}
        .qb-inp:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
        .question-block{border:1.5px solid var(--border);border-radius:12px;padding:18px;margin-bottom:14px;background:#fff;transition:border-color 0.15s}
        .question-block:hover{border-color:rgba(99,102,241,.25)}
        .question-block.editing{border-color:var(--accent);background:#fafbff}
        .option-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
        .option-radio{width:18px;height:18px;accent-color:var(--success);flex-shrink:0;cursor:pointer}
        .option-inp{flex:1;padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;transition:border-color 0.15s}
        .option-inp:focus{outline:none;border-color:var(--accent)}
        .option-inp.correct{border-color:var(--success);background:#f0fdf4}
        .rm-opt{width:28px;height:28px;border:none;background:transparent;color:var(--text-muted);cursor:pointer;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;transition:all 0.15s}
        .rm-opt:hover{background:var(--danger-light);color:var(--danger)}
        .add-opt-btn{padding:7px 14px;border:1.5px dashed var(--border);border-radius:8px;background:transparent;color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;width:100%;margin-top:4px}
        .add-opt-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}
        .q-actions{display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
        .save-bar{background:#fff;border-top:1px solid var(--border);padding:16px 24px;display:flex;gap:12px;align-items:center;position:sticky;bottom:0;z-index:10}
      </style>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
        <div>
          <div class="section-title" style="margin:0">${editId?'Редактировать тест':'Создать тест'}</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">Заполните настройки и добавьте вопросы</div>
        </div>
        <button onclick="renderPage('quizzes')" class="btn btn-secondary">← К тестам</button>
      </div>

      <!-- Настройки теста -->
      <div class="qb-card">
        <div class="qb-head">
          <div style="width:32px;height:32px;border-radius:10px;background:var(--accent-light);color:var(--accent);font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center">1</div>
          <div><div style="font-size:15px;font-weight:700">Настройки теста</div></div>
        </div>
        <div class="qb-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="qb-field"><label class="qb-label">Название теста *</label>
              <input type="text" id="qb_title" class="qb-inp" placeholder="Например: Тест по основам Python" value="${existing?.title||''}"></div>
            <div class="qb-field"><label class="qb-label">Курс</label>
              <select id="qb_course" class="qb-inp" style="appearance:none">
                <option value="">Все мои курсы</option>
                ${myCourses.map(cc=>`<option value="${cc.id}" ${existing?.courseId===cc.id?'selected':''}>${cc.title}</option>`).join('')}
              </select></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="qb-field"><label class="qb-label">Лимит времени (мин)</label>
              <input type="number" id="qb_time" class="qb-inp" min="1" value="${existing?.timeLimit||30}"></div>
            <div class="qb-field"><label class="qb-label">Статус</label>
              <select id="qb_status" class="qb-inp" style="appearance:none">
                <option value="draft" ${(!existing||existing.status==='draft')?'selected':''}>Черновик</option>
                <option value="active" ${existing?.status==='active'?'selected':''}>Активен — студенты могут проходить</option>
              </select></div>
          </div>
        </div>
      </div>

      <!-- Вопросы -->
      <div class="qb-card">
        <div class="qb-head">
          <div style="width:32px;height:32px;border-radius:10px;background:var(--accent-light);color:var(--accent);font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center">2</div>
          <div>
            <div style="font-size:15px;font-weight:700">Вопросы теста</div>
            <div style="font-size:13px;color:var(--text-muted)">${window._qbQuestions.length} вопросов · Отметьте правильный ответ галочкой</div>
          </div>
        </div>
        <div class="qb-body" id="qbQuestionsList">
          ${window._qbQuestions.map((q,i)=>questionBlockHtml(q,i)).join('')}
        </div>
        <div style="padding:0 24px 20px">
          <button onclick="addQuizQuestion()" class="add-opt-btn" style="font-size:14px;padding:12px">
            + Добавить вопрос
          </button>
        </div>
      </div>

      <div class="save-bar">
        <button onclick="saveQuizBuilder()" class="btn btn-primary" style="font-size:15px;padding:13px 28px">${SVG.check} Сохранить тест</button>
        <button onclick="renderPage('quizzes')" class="btn btn-secondary">Отмена</button>
        <span style="font-size:13px;color:var(--text-muted)">${window._qbQuestions.length} вопросов · * обязательные поля</span>
      </div>`;
  }

  window._renderQB = render;
  render();
}

function questionBlockHtml(q, idx){
  const opts=q.options||['','','',''];
  return`<div class="question-block" id="qblock_${idx}">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.8px">Вопрос ${idx+1}</div>
      <div style="display:flex;gap:6px">
        <button onclick="moveQuestion(${idx},-1)" title="Вверх" class="rm-opt" style="font-size:14px">↑</button>
        <button onclick="moveQuestion(${idx},1)"  title="Вниз"  class="rm-opt" style="font-size:14px">↓</button>
        <button onclick="removeQuestion(${idx})" title="Удалить" class="rm-opt">${SVG.trash}</button>
      </div>
    </div>
    <div class="qb-field">
      <label class="qb-label">Текст вопроса *</label>
      <textarea oninput="updateQText(${idx},this.value)" rows="2" style="width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box;resize:vertical"
        placeholder="Введите вопрос...">${q.text||''}</textarea>
    </div>
  <div style="margin-bottom:12px">
      <label class="qb-label">Тип ответа</label>
      <select onchange="updateQType(${idx},this.value)" style="padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;appearance:none">
        <option value="single" ${(!q.type||q.type==='single')?'selected':''}>Один вариант</option>
        <option value="multiple" ${q.type==='multiple'?'selected':''}>Несколько вариантов</option>
        <option value="text" ${q.type==='text'?'selected':''}>Развёрнутый ответ</option>
      </select>
    </div>
    ${q.type==='text'
      ? `<div style="padding:10px 12px;background:var(--bg);border-radius:8px;font-size:13px;color:var(--text-muted)">
          Студент введёт текстовый ответ — проверяется вручную.
          <div style="margin-top:8px"><label class="qb-label">Опорный ответ / критерий</label>
          <input type="text" class="qb-inp" value="${q.correctText||''}" oninput="updateQCorrectText(${idx},this.value)"
            placeholder="Ключевые слова или правильный ответ для себя"></div>
        </div>`
      : `<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);margin-bottom:10px">
          Варианты · <span style="color:var(--success);font-weight:600">${q.type==='multiple'?'Отметьте все правильные':'Отметьте правильный'}</span>
        </div>
        <div id="opts_${idx}">
          ${opts.map((opt,oi)=>`<div class="option-row" id="optrow_${idx}_${oi}">
            <input type="${q.type==='multiple'?'checkbox':'radio'}" name="correct_${idx}" class="option-radio"
              value="${oi}"
              ${q.type==='multiple'
                ? `${(q.correctIndexes||[]).includes(oi)?'checked':''} onchange="updateCorrectMulti(${idx},${oi},this.checked)"`
                : `${q.correctIndex===oi?'checked':''} onchange="updateCorrect(${idx},${oi})"`}
              title="Отметить как правильный ответ">
            <input type="text" class="option-inp ${(q.type==='multiple'?(q.correctIndexes||[]).includes(oi):q.correctIndex===oi)?'correct':''}"
              value="${opt}" placeholder="Вариант ${String.fromCharCode(65+oi)}"
              oninput="updateOption(${idx},${oi},this.value)">
            <button class="rm-opt" onclick="removeOption(${idx},${oi})" title="Удалить вариант">✕</button>
          </div>`).join('')}
        </div>
        <button onclick="addOption(${idx})" class="add-opt-btn">+ Добавить вариант ответа</button>`
    }
  </div>`;
}

function addQuizQuestion(){
  window._qbQuestions.push({id:uid(),text:'',type:'single',options:['','','',''],correctIndex:0,correctIndexes:[],correctText:''});
  window._renderQB();
  // Скролл к новому вопросу
  setTimeout(()=>document.getElementById('qbQuestionsList')?.lastElementChild?.scrollIntoView({behavior:'smooth'}),100);
}
function removeQuestion(idx){
  window._qbQuestions.splice(idx,1);
  window._renderQB();
}
function moveQuestion(idx,dir){
  const qs=window._qbQuestions, ni=idx+dir;
  if(ni<0||ni>=qs.length)return;
  [qs[idx],qs[ni]]=[qs[ni],qs[idx]];
  window._renderQB();
}
function updateQText(idx,val){window._qbQuestions[idx].text=val;}
function updateOption(idx,oi,val){window._qbQuestions[idx].options[oi]=val;}
function updateCorrect(idx,oi){
  window._qbQuestions[idx].correctIndex=oi;
  // Обновляем стиль инпутов
  document.querySelectorAll(`#opts_${idx} .option-inp`).forEach((inp,i)=>{
    inp.classList.toggle('correct',i===oi);
  });
}

function updateQType(idx,val){window._qbQuestions[idx].type=val;window._renderQB();}
function updateQCorrectText(idx,val){window._qbQuestions[idx].correctText=val;}
function updateCorrectMulti(idx,oi,checked){
  const idxs=window._qbQuestions[idx].correctIndexes||[];
  if(checked){if(!idxs.includes(oi))idxs.push(oi);}
  else{const p=idxs.indexOf(oi);if(p>-1)idxs.splice(p,1);}
  window._qbQuestions[idx].correctIndexes=idxs;
  document.querySelectorAll(`#opts_${idx} .option-inp`).forEach((inp,i)=>{
    inp.classList.toggle('correct',idxs.includes(i));
  });
}

function addOption(idx){
  window._qbQuestions[idx].options.push('');
  window._renderQB();
}
function removeOption(idx,oi){
  const q=window._qbQuestions[idx];
  if(q.options.length<=2){showToast('Минимум 2 варианта','error');return;}
  q.options.splice(oi,1);
  if(q.correctIndex>=q.options.length)q.correctIndex=0;
  window._renderQB();
}
function saveQuizBuilder(){
  const title=document.getElementById('qb_title')?.value.trim();
  if(!title){showToast('Введите название теста','error');return;}
  const qs=window._qbQuestions;
  if(qs.length===0){showToast('Добавьте хотя бы один вопрос','error');return;}
  // Проверяем, что у каждого вопроса есть текст и хотя бы 2 непустых варианта
  for(let i=0;i<qs.length;i++){
    if(!qs[i].text.trim()){showToast(`Вопрос ${i+1}: введите текст вопроса`,'error');return;}
    const nonEmpty=qs[i].options.filter(o=>o.trim());
    if(nonEmpty.length<2){showToast(`Вопрос ${i+1}: минимум 2 варианта ответа`,'error');return;}
  }
  const courseId=document.getElementById('qb_course')?.value;
  const course=getCourses().find(c=>c.id===courseId);
  const quizData={
    id:window._qbEditId||uid(),
    teacherName:getName(),
    title,
    courseId, courseName:course?.title||'Все курсы',
    timeLimit:parseInt(document.getElementById('qb_time')?.value)||30,
    status:document.getElementById('qb_status')?.value||'draft',
    questions:qs.map(q=>({
      id:q.id||uid(),
      text:q.text,
      options:q.options.filter(o=>o.trim()),
      correct:q.options[q.correctIndex]||q.options[0],
      correctIndex:q.correctIndex,
    })),
    createdAt:window._qbEditId?(getQuizzes().find(q=>q.id===window._qbEditId)?.createdAt||new Date().toISOString()):new Date().toISOString(),
    updatedAt:new Date().toISOString(),
  };
  const quizzes=getQuizzes();
  if(window._qbEditId){
    const idx=quizzes.findIndex(q=>q.id===window._qbEditId);
    if(idx!==-1)quizzes[idx]=quizData; else quizzes.push(quizData);
  } else {
    quizzes.push(quizData);
  }
  saveQuizzes(quizzes);
  showToast(`Тест «${title}» сохранён (${qs.length} вопросов)`,'success');
  setTimeout(()=>renderPage('quizzes'),800);
}
function editQuiz(id){
  window._qbEditId=id;
  const c=document.getElementById('mainContent');
  renderQuizBuilder(c,id);
}

/* ===========================================================
   ОЦЕНКИ — ПРЕПОДАВАТЕЛЬ
=========================================================== */
function renderTeacherGrades(c){
  const grades=getGrades().filter(g=>{
    const a=getAssignments().find(x=>x.id===g.assignmentId);
    return a?.teacherName===getName();
  });
  const students=[...new Set(grades.map(g=>g.studentName))];
  const myCourses=getCourses().filter(cc=>cc.teacherLogin===getName()||cc.teacher===getName());

  c.innerHTML=`
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      ${statCard(`<span style="color:#6366f1">${SVG.users}</span>`,'purple',students.length,'Студентов с оценками','','')}
      ${statCard(`<span style="color:#10b981">${SVG.check}</span>`,'green',grades.length,'Выставлено оценок','','')}
      ${statCard(`<span style="color:#f59e0b">${SVG.award}</span>`,'orange',grades.length>0?Math.round(grades.reduce((s,g)=>s+g.grade/g.maxScore*100,0)/grades.length)+'%':'—','Средний результат','','')}
    </div>
    <div class="section-title" style="margin-top:4px">Журнал оценок</div>
    ${grades.length===0
      ?`<div class="card"><div class="card-body">${emptyState(SVG.award,'Оценок пока нет','Оценки появятся после проверки работ студентов')}</div></div>`
      :`<div class="card"><div class="card-body" style="padding:0"><table class="data-table">
          <thead><tr><th>Студент</th><th>Задание</th><th>Балл</th><th>%</th><th>Оценка</th><th>Дата</th></tr></thead>
          <tbody>${grades.map(g=>{
            const pct=Math.round(g.grade/g.maxScore*100);
            const mark=pct>=90?'Отл.':pct>=75?'Хор.':pct>=60?'Удовл.':'Неуд.';
            const mc=pct>=90?'badge-success':pct>=75?'badge-primary':pct>=60?'badge-warning':'badge-danger';
            const a=getAssignments().find(x=>x.id===g.assignmentId);
            return`<tr>
              <td><div class="table-user"><div class="avatar avatar-purple" style="font-size:12px">${getAvatar(g.studentName)}</div><div class="table-user-info"><div class="t-name">${g.studentName}</div></div></div></td>
              <td style="font-size:14px">${a?.title||'—'}</td>
              <td><b>${g.grade}/${g.maxScore}</b></td>
              <td>${pct}%</td>
              <td><span class="badge ${mc}">${mark}</span></td>
              <td style="font-size:13px;color:var(--text-muted)">${fmtDate(g.gradedAt)}</td>
            </tr>`;}).join('')}</tbody>
        </table></div></div>`
    }`;
}

/* ===========================================================
   СТУДЕНТ — МОИ КУРСЫ
=========================================================== */
function renderStudentCourses(c){
  const me=getCurrentUser();
  const enrolledIds=getEnrolled(me?.login||getName());
  const enrolled=getCourses().filter(cc=>enrolledIds.includes(cc.id));
  c.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <div class="section-title" style="margin:0">Мои курсы${enrolled.length>0?` (${enrolled.length})`:''}</div>
      <button onclick="renderPage('catalog')" class="btn btn-secondary">${SVG.book} Каталог курсов</button>
    </div>
    ${enrolled.length===0
      ?`<div class="card"><div class="card-body" style="text-align:center;padding:60px 24px">
          <div style="width:60px;height:60px;background:var(--bg);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:var(--text-muted)">${SVG.book}</div>
          <h3 style="font-size:19px;font-weight:700;margin-bottom:8px">Вы ещё не записаны ни на один курс</h3>
          <p style="font-size:14px;color:var(--text-secondary);margin-bottom:24px;max-width:360px;margin-left:auto;margin-right:auto">Откройте каталог, изучите программы курсов и запишитесь на интересующий вас.</p>
          <button onclick="renderPage('catalog')" class="btn btn-primary" style="font-size:15px;padding:12px 28px">Открыть каталог →</button>
        </div></div>`
      :`<div class="my-courses-grid">${enrolled.map(cc=>uniformCourseCard(cc,'student-enrolled')).join('')}</div>`
    }`;
}
function studentCourseCard(cc){ return uniformCourseCard(cc,'student-enrolled'); }

/* ===========================================================
   КАТАЛОГ КУРСОВ — СТУДЕНТ
=========================================================== */
function renderStudentCatalog(c){
  const me=getCurrentUser();
  const myId=me?.login||getName();
  const enrolledIds=getEnrolled(myId);
  const courses=getCourses().filter(cc=>cc.status==='published');
  const cats=['Все',...[...new Set(courses.map(cc=>cc.category))]];

  c.innerHTML=`
    <style>
      .catalog-card{background:#fff;border-radius:14px;border:1px solid var(--border);overflow:hidden;transition:all 0.2s;cursor:default}
      .catalog-card:hover{border-color:var(--accent);box-shadow:0 6px 28px rgba(99,102,241,.12);transform:translateY(-2px)}
      .cat-filter{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
      .cat-filter-btn{padding:7px 16px;border-radius:20px;border:1.5px solid var(--border);background:#fff;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-secondary);transition:all 0.15s}
      .cat-filter-btn:hover,.cat-filter-btn.active{background:var(--accent);border-color:var(--accent);color:#fff}
      .enroll-btn-sm{padding:8px 18px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s}
      .enroll-btn-sm:hover{background:var(--accent-hover)}
      .enroll-btn-sm.enrolled{background:var(--success-light);color:var(--success);cursor:default}
    </style>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px">
      <div class="section-title" style="margin:0">Каталог курсов (${courses.length})</div>
      <div style="display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:9px 13px;min-width:220px">
        ${SVG.search}
        <input id="catSearch" type="text" placeholder="Поиск..." style="border:none;outline:none;font-size:14px;flex:1;font-family:inherit" oninput="filterCatalogSearch(this.value)">
      </div>
    </div>
    <div class="cat-filter" id="catFilter">
      ${cats.map((cat,i)=>`<button class="cat-filter-btn ${i===0?'active':''}" onclick="filterCatalogCat('${cat}',this)">${cat}</button>`).join('')}
    </div>
    <div class="my-courses-grid" id="catalogGrid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
      ${courses.map(cc=>uniformCourseCard(cc,'catalog',{isEnrolled:enrolledIds.includes(cc.id)})).join('')}
    </div>
    ${courses.length===0?`<div class="card"><div class="card-body">${emptyState(SVG.book,'Курсов пока нет','Курсы появятся после того, как преподаватели создадут и опубликуют их')}</div></div>`:''}`;
}

function getCourseAuthor(courseId){
  const allUsers=getUsers().filter(u=>u.role==='teacher');
  // Check explicit teacherLogins array first (multi-teacher)
  const cc=getCourses().find(c=>c.id===courseId);
  if(cc?.teacherLogins?.length>0){
    return cc.teacherLogins.map(login=>allUsers.find(u=>u.login===login)?.displayName||login).join(', ');
  }
  // Fallback: check teacher_courses map
  const assigned=allUsers.filter(u=>getTeacherCourses(u.login).includes(courseId)).map(u=>u.displayName);
  if(assigned.length>0)return assigned.join(', ');
  // Fallback: direct field
  return(cc?.teacher&&cc.teacher!=='Кафедра ИИ и Big Data')?cc.teacher:'';
}

function catalogCard(cc, isEnrolled){
  const author=getCourseAuthor(cc.id);  // ← здесь, ДО return
  return`<div class="catalog-card my-course-card" data-cat="${cc.category}" data-title="${cc.title.toLowerCase()}">
    <div class="mc-thumb" style="background:${cc.grad||'#6366f1'}">${COURSE_ICON_SVG[cc.icon]||SVG.book}</div>
    <div class="mc-body">
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <span class="badge badge-primary" style="font-size:12px">${cc.category}</span>
        <span class="badge ${cc.levelClass||'badge-muted'}" style="font-size:12px">${cc.level}</span>
      </div>
      <div class="mc-title">${cc.title}</div>
      <div style="font-size:12px;color:${author?'var(--text-secondary)':'var(--text-muted)'};margin-top:4px;font-style:${author?'normal':'italic'}">
        ${author?`👤 ${author}`:'Преподаватель не назначен'} · ⭐ ${cc.rating||'—'}
      </div>
      <div style="font-size:13px;color:var(--text-muted);margin-top:4px">${cc.modules} модулей · ${cc.hours} ч · ${cc.studentsCount} студентов</div>
      <div style="font-size:13px;color:var(--text-secondary);margin-top:8px;line-height:1.5">${(cc.desc||'').slice(0,80)}${cc.desc?.length>80?'…':''}</div>
    </div>
    <div class="mc-footer" style="display:flex;gap:8px">
      <button onclick="openCourseDetail('${cc.id}')" style="flex:1;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:#fff;font-size:13px;font-weight:600;cursor:pointer">Подробнее</button>
      <button class="enroll-btn-sm ${isEnrolled?'enrolled':''}" id="enroll_${cc.id}"
        ${isEnrolled?'disabled':''}
        onclick="${isEnrolled?`showToast('Вы уже записаны на этот курс','default')`:`enrollCourse('${cc.id}',this)`}">${isEnrolled?'✓ Записан':'Записаться'}</button>
    </div>
  </div>`;
}

let _activeCat='Все';
function filterCatalogCat(cat, btn){
  _activeCat=cat;
  document.querySelectorAll('.cat-filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  _applyAllCatalogFilters();
}
function filterCatalogSearch(q){
  _applyAllCatalogFilters(q);
}
function _applyAllCatalogFilters(q){
  const lq=(q!==undefined?q:(document.getElementById('catSearch')?.value||'')).toLowerCase();
  document.querySelectorAll('#catalogGrid .catalog-card').forEach(card=>{
    const catOk=_activeCat==='Все'||card.dataset.cat===_activeCat;
    const searchOk=!lq||card.dataset.title.includes(lq)||card.dataset.cat?.toLowerCase().includes(lq);
    card.style.display=(catOk&&searchOk)?'':'none';
  });
}
function enrollCourse(courseId, btn){
  const me=getCurrentUser();
  const myId=me?.login||getName();
  const enrolled=getEnrolled(myId);
  if(enrolled.includes(courseId)){showToast('Вы уже записаны на этот курс','default');return;}
  // Check max students limit
  const course=getCourses().find(c=>c.id===courseId);
  const settings=getSettings();
  const maxSt=parseInt(settings.maxStudents)||150;
  if(course){
    const allEnrolled=JSON.parse(localStorage.getItem('lms_enrolled')||'{}');
    const count=Object.values(allEnrolled).filter(ids=>ids.includes(courseId)).length;
    if(count>=maxSt){showToast(`Достигнут лимит записи (${maxSt} слушателей)`, 'error');return;}
  }
  enrolled.push(courseId);
  setEnrolled(myId, enrolled);
  if(btn){btn.textContent='✓ Записан';btn.classList.add('enrolled');btn.disabled=true;}
  showToast('Вы записаны на курс!','success');
}
function openCourseDetail(id){
  const cc=getCourses().find(c=>c.id===id);
  if(!cc)return;
  const me=getCurrentUser();
  const myId=me?.login||getName();
  const isEnrolled=getEnrolled(myId).includes(id);
  const author=getCourseAuthor(id);
  const hasAuthor=author.length>0;
  openModal(modalBox(cc.title,
    `<div style="height:130px;background:${cc.grad||'#6366f1'};border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:18px">${COURSE_ICON_SVG[cc.icon]||SVG.book}</div>
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <span class="badge badge-primary">${cc.category}</span>
      <span class="badge ${cc.levelClass||'badge-muted'}">${cc.level}</span>
      ${cc.rating?`<span class="badge badge-muted">⭐ ${cc.rating}</span>`:''}
    </div>
    <div style="border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:16px">
      <div style="display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid var(--border)">
        <div style="padding:12px 14px;background:var(--bg);font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.7px">Направление</div>
        <div style="padding:12px 14px;font-size:14px;font-weight:600;color:var(--accent)">${cc.category||'—'}</div>
      </div>
      <div style="display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid var(--border)">
        <div style="padding:12px 14px;background:var(--bg);font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.7px">Автор</div>
        <div style="padding:12px 14px;font-size:14px">${hasAuthor?`<span style="font-weight:600">${author}</span>`:`<span style="color:var(--text-muted);font-style:italic">Не назначен — базовые материалы в наличии</span>`}</div>
      </div>
      <div style="display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid var(--border)">
        <div style="padding:12px 14px;background:var(--bg);font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.7px;padding-top:14px">Описание</div>
        <div style="padding:12px 14px;font-size:14px;color:var(--text-secondary);line-height:1.65">${cc.desc||'—'}</div>
      </div>
      <div style="display:grid;grid-template-columns:130px 1fr">
        <div style="padding:12px 14px;background:var(--bg);font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.7px">Объём</div>
        <div style="padding:12px 14px;font-size:14px">${cc.modules} модулей · ${cc.hours} ч · ${cc.studentsCount} студентов</div>
      </div>
    </div>
    ${(cc.program||[]).length>0?`
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:10px">Содержание курса</div>
    <div>${(cc.program||[]).map(m=>`<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--bg);border-radius:8px;margin-bottom:6px;font-size:13px"><div style="width:22px;height:22px;border-radius:6px;background:var(--accent);color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${m.n}</div><span style="flex:1;font-weight:600">${m.name}</span><span style="color:var(--text-muted)">${m.l||''} ур. · ${m.h||''} ч</span></div>`).join('')}</div>`:''}
    ${(cc.outcomes||[]).length>0?`
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin:14px 0 10px">Чему вы научитесь</div>
    <div>${(cc.outcomes||[]).map(o=>`<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;font-size:13px;color:var(--text-secondary)"><span style="color:var(--success);font-weight:700;flex-shrink:0">✓</span>${o}</div>`).join('')}</div>`:''}`,
    isEnrolled
      ?`<span class="badge badge-success" style="padding:10px 18px;font-size:14px">✓ Вы уже записаны</span>` + mBtn('Закрыть','closeModal()','btn-secondary')
      : mBtn('Записаться на курс',`enrollCourse('${id}',null);closeModal();renderPage('catalog')`) + mBtn('Закрыть','closeModal()','btn-secondary')
  ));
}

/* ===========================================================
   ЗАДАНИЯ / ТЕСТЫ / ОЦЕНКИ — СТУДЕНТ
=========================================================== */
function renderStudentAssignments(c){
  const me=getCurrentUser(), myId=me?.login||getName();
  const enrolled=getEnrolled(myId);
  const assignments=getAssignments().filter(a=>!a.courseId||enrolled.includes(a.courseId));
  const subs=getSubmissions();
  c.innerHTML=`<div class="section-title">Мои задания</div>
    ${assignments.length===0
      ?`<div class="card"><div class="card-body">${emptyState(SVG.clipboard,'Заданий пока нет','Задания появятся после записи на курс и публикации их преподавателем')}</div></div>`
      :`<div style="display:flex;flex-direction:column;gap:12px">${assignments.map(a=>{
          const mySub=subs.find(s=>s.assignmentId===a.id&&s.studentLogin===myId);
          return`<div class="assignment-item">
            <div class="ai-left">
              <div class="ai-icon" style="background:var(--accent-light)">${SVG.clipboard}</div>
              <div>
                <div class="ai-title">${a.title}</div>
                <div class="ai-course">${a.courseName||''} · Срок: ${a.deadline||'—'}</div>
                <div style="margin-top:6px">${mySub?`<span class="badge ${mySub.grade!==undefined?'badge-success':'badge-primary'}">${mySub.grade!==undefined?`Оценка: ${mySub.grade}/${a.maxScore}`:'Сдано'}</span>`:'<span class="badge badge-warning">Ожидается</span>'}</div>
              </div>
            </div>
            <div class="ai-right">${!mySub?`<button class="btn btn-sm btn-primary" onclick="submitAssignment('${a.id}','${getName()}','${myId}','${a.courseId||''}')">Сдать</button>`:''}</div>
          </div>`;}).join('')}</div>`
    }`;
}
function submitAssignment(assignmentId,studentName,studentLogin,courseId){
  openModal(modalBox('Сдать задание',
    mField('Текст ответа',mTextarea('sub_text','Введите ответ или описание выполненной работы...','',5))
    +`<div style="border:2px dashed var(--border);border-radius:10px;padding:24px;text-align:center;color:var(--text-muted);margin-top:4px"><div style="font-size:28px;margin-bottom:6px">${SVG.upload}</div><div style="font-size:13px">Прикрепить файл (в разработке)</div></div>`,
    mBtn('Отправить работу',`doSubmit('${assignmentId}','${studentName}','${studentLogin}','${courseId}')`) + mBtn('Отмена','closeModal()','btn-secondary')
  ));
}
function doSubmit(assignmentId,studentName,studentLogin,courseId){
  const text=document.getElementById('sub_text')?.value.trim();
  if(!text){showToast('Напишите ответ','error');return;}
  const subs=getSubmissions();
  subs.push({id:uid(),assignmentId,studentName,studentLogin,courseId,text,submittedAt:new Date().toISOString()});
  saveSubmissions(subs);
  closeModal(); showToast('Работа отправлена преподавателю','success');
  renderStudentAssignments(document.getElementById('mainContent'));
}

function renderStudentQuizzes(c){
  const me=getCurrentUser(), myId=me?.login||getName();
  const enrolled=getEnrolled(myId);
  const quizzes=getQuizzes().filter(q=>q.status==='active'&&(!q.courseId||enrolled.includes(q.courseId)));
  c.innerHTML=`<div class="section-title">Мои тесты</div>
    ${quizzes.length===0
      ?`<div class="card"><div class="card-body">${emptyState(SVG.quiz,'Тестов пока нет','Тесты появятся после записи на курс, когда преподаватель их опубликует')}</div></div>`
      :`<div style="display:flex;flex-direction:column;gap:12px">${quizzes.map(q=>`<div class="assignment-item">
          <div class="ai-left"><div class="ai-icon" style="background:var(--warning-light)">${SVG.quiz}</div>
            <div><div class="ai-title">${q.title}</div>
            <div class="ai-course">${q.courseName||''} · ${(q.questions||[]).length} вопросов · ${q.timeLimit} мин</div></div>
          </div>
          <div class="ai-right"><button class="btn btn-sm btn-primary" onclick="startQuiz('${q.id}')">Пройти тест</button></div>
        </div>`).join('')}</div>`
    }`;
}
function startQuiz(qid){
  const q=getQuizzes().find(x=>x.id===qid);
  if(!q)return;
  if(!(q.questions||[]).length){showToast('В тесте нет вопросов','default');return;}
  let current=0, answers=[];
  function renderQ(){
    const qq=q.questions[current];
    const progress=Math.round((current/q.questions.length)*100);
    openModal(`<div style="background:#fff;border-radius:18px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.22)">
      <div style="padding:20px 28px;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <h3 style="font-size:17px;font-weight:700">${q.title}</h3>
          <span style="font-size:13px;color:var(--text-muted)">Вопрос ${current+1} / ${q.questions.length}</span>
        </div>
        <div style="height:6px;background:var(--border);border-radius:3px"><div style="width:${progress}%;height:100%;background:var(--accent);border-radius:3px;transition:width 0.3s"></div></div>
      </div>
      <div style="padding:28px">
        <div style="font-size:17px;font-weight:600;margin-bottom:20px;line-height:1.5">${qq.text}</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${(qq.options||[]).map((opt,i)=>`<label style="display:flex;align-items:center;gap:12px;padding:13px 16px;border:2px solid ${answers[current]===opt?'var(--accent)':'var(--border)'};border-radius:10px;cursor:pointer;transition:all 0.15s;font-size:15px;background:${answers[current]===opt?'var(--accent-light)':''}" onmouseover="if(!this.querySelector('input').checked)this.style.borderColor='var(--accent)'" onmouseout="if(!this.querySelector('input').checked)this.style.borderColor='var(--border)'">
            <input type="radio" name="q_opt" value="${opt}" ${answers[current]===opt?'checked':''} style="width:18px;height:18px;accent-color:var(--accent)" onchange="this.closest('label').parentElement.querySelectorAll('label').forEach(l=>{l.style.borderColor='var(--border)';l.style.background='';});this.closest('label').style.borderColor='var(--accent)';this.closest('label').style.background='var(--accent-light)'">
            ${opt}
          </label>`).join('')}
        </div>
        <div style="display:flex;gap:10px;margin-top:24px">
          ${current>0?`<button onclick="quizPrev()" class="btn btn-secondary">← Назад</button>`:''}
          <button onclick="quizNext('${qid}',${current},${q.questions.length})" class="btn btn-primary" style="flex:1">${current===q.questions.length-1?'Завершить тест':'Следующий вопрос →'}</button>
        </div>
      </div>
    </div>`);
  }
  window._quizState={q,answers,renderQ,current:0};
  renderQ();
}
function quizNext(qid,current,total){
  const sel=document.querySelector('input[name="q_opt"]:checked');
  if(!sel){showToast('Выберите ответ','error');return;}
  window._quizState.answers[current]=sel.value;
  window._quizState.current=current+1;
  if(current+1<total){window._quizState.renderQ();}
  else{finishQuiz(qid);}
}
function quizPrev(){
  window._quizState.current=Math.max(0,window._quizState.current-1);
  window._quizState.renderQ();
}
function finishQuiz(qid){
  const {q,answers}=window._quizState;
  let correct=0;
  q.questions.forEach((qq,i)=>{if(answers[i]===qq.correct)correct++;});
  const score=Math.round(correct/q.questions.length*100);
  openModal(modalBox('Результаты теста',
    `<div style="text-align:center;padding:20px 0">
      <div style="width:80px;height:80px;border-radius:50%;background:${score>=70?'var(--success-light)':'var(--warning-light)'};display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:${score>=70?'var(--success)':'var(--warning)'}">${score}%</div>
      <div style="font-size:20px;font-weight:700;margin-bottom:6px">${score>=90?'Отлично!':score>=70?'Хорошо!':score>=50?'Удовлетворительно':'Попробуйте ещё раз'}</div>
      <div style="font-size:14px;color:var(--text-secondary)">Правильных ответов: ${correct} из ${q.questions.length}</div>
    </div>`,
    mBtn('Закрыть','closeModal()','btn-secondary')
  ));
}

function renderStudentGrades(c){
  const me=getCurrentUser(), myId=me?.login||getName();
  const grades=getGrades().filter(g=>g.studentLogin===myId);
  const avg=grades.length>0?Math.round(grades.reduce((s,g)=>s+g.grade/g.maxScore*100,0)/grades.length):0;
  c.innerHTML=`
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      ${statCard(`<span style="color:#6366f1">${SVG.award}</span>`,'purple',grades.length?avg+'%':'—','Средний результат','','')}
      ${statCard(`<span style="color:#10b981">${SVG.check}</span>`,'green',grades.length,'Проверено работ','','')}
      ${statCard(`<span style="color:#f59e0b">${SVG.clipboard}</span>`,'orange',getSubmissions().filter(s=>s.studentLogin===myId).length,'Сдано заданий','','')}
    </div>
    <div class="section-title">Мои оценки</div>
    ${grades.length===0
      ?`<div class="card"><div class="card-body">${emptyState(SVG.award,'Оценок пока нет','Оценки появятся после того, как преподаватель проверит ваши работы')}</div></div>`
      :`<div class="card"><div class="card-body" style="padding:0"><table class="data-table">
        <thead><tr><th>Задание</th><th>Балл</th><th>%</th><th>Оценка</th><th>Дата</th></tr></thead>
        <tbody>${grades.map(g=>{
          const pct=Math.round(g.grade/g.maxScore*100);
          const mark=pct>=90?'Отл.':pct>=75?'Хор.':pct>=60?'Удовл.':'Неуд.';
          const mc=pct>=90?'badge-success':pct>=75?'badge-primary':pct>=60?'badge-warning':'badge-danger';
          const a=getAssignments().find(x=>x.id===g.assignmentId);
          return`<tr>
            <td><b>${a?.title||'—'}</b><br><small style="color:var(--text-muted)">${a?.courseName||''}</small></td>
            <td><b>${g.grade}/${g.maxScore}</b></td>
            <td>${pct}%</td>
            <td><span class="badge ${mc}">${mark}</span></td>
            <td style="font-size:13px;color:var(--text-muted)">${fmtDate(g.gradedAt)}</td>
          </tr>`;}).join('')}
        </tbody></table></div></div>`
    }`;
}

/* ===========================================================
   КОНСТРУКТОР КУРСА — ПРЕПОДАВАТЕЛЬ
=========================================================== */
let _moduleCount=1, _lessonCounts={};
function renderCourseRequestForm(c){
  _moduleCount=1; _lessonCounts={};
  c.innerHTML=`
  <style>
    .cc-card{background:#fff;border-radius:14px;border:1px solid var(--border);margin-bottom:20px;overflow:hidden}
    .cc-head{padding:18px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
    .cc-num{width:32px;height:32px;border-radius:10px;background:var(--accent-light);color:var(--accent);font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .cc-body{padding:24px}
    .cc-row2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
    .cc-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
    .cc-field{margin-bottom:16px}
    .cc-label{display:block;font-size:14px;font-weight:600;margin-bottom:6px;color:var(--text-secondary)}
    .cc-inp{width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box;transition:border-color 0.15s}
    .cc-inp:focus{outline:none;border-color:var(--accent)}
    .cc-ta{resize:vertical;min-height:90px}
    .cc-sel{appearance:none;background-color:#fff}
    .module-block{border:1.5px solid var(--border);border-radius:10px;padding:16px;margin-bottom:12px}
    .mod-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
    .mod-n{width:28px;height:28px;border-radius:8px;background:var(--accent);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .lesson-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}
    .rm-btn{padding:7px;border:1.5px solid var(--border);border-radius:7px;background:#fff;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s}
    .rm-btn:hover{border-color:var(--danger);color:var(--danger);background:var(--danger-light)}
    .add-mod-btn{width:100%;padding:12px;border:2px dashed var(--border);border-radius:10px;background:transparent;color:var(--text-muted);font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:8px}
    .add-mod-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}
    .save-bar{background:#fff;border-top:1px solid var(--border);padding:16px 24px;display:flex;gap:12px;align-items:center;position:sticky;bottom:0;z-index:10}
    .tip{background:var(--accent-light);border-radius:10px;padding:11px 14px;font-size:13px;color:var(--accent);display:flex;gap:8px;align-items:flex-start;line-height:1.6}
  </style>

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px">
    <div>
      <div class="section-title" style="margin:0">Заявка на создание нового курса</div>
      <div style="font-size:13px;color:var(--text-muted);margin-top:4px">Требует одобрения администратора</div>
    </div>
    <button onclick="renderPage('my-courses')" class="btn btn-secondary">← К моим курсам</button>
  </div>

  <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #7dd3fc;border-radius:12px;padding:18px 22px;margin-bottom:24px;display:flex;gap:14px">
    <div style="font-size:24px;flex-shrink:0">ℹ️</div>
    <div>
      <div style="font-weight:700;margin-bottom:6px;color:#0c4a6e">Как работает процесс</div>
      <div style="font-size:13px;color:#0369a1;line-height:1.7">
        1. Заполните детали курса и отправьте заявку<br>
        2. Администратор рассмотрит и примет решение<br>
        3. После одобрения курс появится в «Мои курсы»<br>
        4. Хотите преподавать существующий курс? →
        <a href="#" onclick="renderPage('teacher-catalog');return false" style="color:#0369a1;font-weight:600">Каталог курсов</a>
      </div>
    </div>
  </div>

  <div class="cc-card">
    <div class="cc-head"><div class="cc-num">1</div><div><div style="font-size:15px;font-weight:700">Основная информация</div></div></div>
    <div class="cc-body">
      <div class="cc-field"><label class="cc-label">Название курса *</label><input type="text" id="cc_title" class="cc-inp" placeholder="Название курса"></div>
      <div class="cc-field"><label class="cc-label">Описание *</label><textarea id="cc_desc" class="cc-inp cc-ta" placeholder="Что изучат студенты?"></textarea></div>
      <div class="cc-row2">
        <div class="cc-field"><label class="cc-label">Направление *</label>
          <select id="cc_cat" class="cc-inp cc-sel"><option value="">Выберите...</option>
            <option>ИИ / МО</option><option>Наука о данных</option><option>NLP</option><option>MLOps</option>
            <option>Глубокое обучение</option><option>Облачные технологии</option><option>DevOps</option>
            <option>IoT / Робототехника</option><option>SCADA / Автоматизация</option>
            <option>Разработка приложений</option><option>Информатика</option><option>Математика</option>
            <option>ИИ в медицине</option><option>ИИ в образовании</option><option>Другое</option>
          </select>
        </div>
        <div class="cc-field"><label class="cc-label">Уровень</label>
          <select id="cc_level" class="cc-inp cc-sel">
            <option value="Начальный">Начальный</option><option value="Средний">Средний</option><option value="Продвинутый">Продвинутый</option>
          </select>
        </div>
      </div>
      <div class="cc-row3">
        <div class="cc-field"><label class="cc-label">Язык</label>
          <select id="cc_lang" class="cc-inp cc-sel"><option>Русский</option><option>Казахский</option><option>Казахский / Русский</option><option>Английский</option></select>
        </div>
        <div class="cc-field"><label class="cc-label">Академических часов</label><input type="number" id="cc_hours" class="cc-inp" value="72" min="1"></div>
        <div class="cc-field"><label class="cc-label">Макс. студентов</label><input type="number" id="cc_max" class="cc-inp" placeholder="50"></div>
      </div>
      <div class="cc-field"><label class="cc-label">Чему научатся (каждый навык с новой строки)</label>
        <textarea id="cc_outcomes" class="cc-inp cc-ta" placeholder="Навык 1&#10;Навык 2&#10;Навык 3"></textarea>
      </div>
    </div>
  </div>

  <div class="cc-card">
    <div class="cc-head"><div class="cc-num">2</div><div><div style="font-size:15px;font-weight:700">Содержание курса</div></div></div>
    <div class="cc-body">
      <div class="tip" style="margin-bottom:20px">Модуль — тематический блок. Внутри — уроки: видео, PDF, задания, тесты.</div>
      <div id="cc_modules">${buildModuleHtml(1)}</div>
      <button class="add-mod-btn" onclick="ccAddModule()">+ Добавить модуль</button>
    </div>
  </div>

  <div class="cc-card">
    <div class="cc-head"><div class="cc-num">3</div><div><div style="font-size:15px;font-weight:700">Обоснование заявки</div></div></div>
    <div class="cc-body">
      <div class="cc-field"><label class="cc-label">Сопроводительное сообщение администратору *</label>
        <textarea id="cc_motivation" class="cc-inp cc-ta" rows="4"
          placeholder="Опишите ваш опыт, почему этот курс нужен платформе, целевая аудитория..."></textarea>
      </div>
    </div>
  </div>

  <div class="save-bar">
    <button onclick="ccSubmitRequest()" class="btn btn-primary" style="font-size:15px;padding:13px 30px">📋 Отправить заявку</button>
    <button onclick="renderPage('my-courses')" class="btn btn-secondary">Отмена</button>
    <span style="font-size:13px;color:var(--text-muted)">* Обязательные поля</span>
  </div>`;
}

function buildModuleHtml(n){
  return`<div class="module-block" id="ccmod${n}">
    <div class="mod-header"><div class="mod-n">${n}</div>
      <input type="text" class="cc-inp" style="flex:1" placeholder="Название модуля (например: Основы синтаксиса)">
      ${n>1?`<button class="rm-btn" onclick="ccRemoveModule(${n})">${SVG.trash}</button>`:''}
    </div>
    <div id="cclessons${n}">${buildLessonHtml(n,1)}</div>
    <button onclick="ccAddLesson(${n})" style="padding:7px 14px;border:1.5px dashed var(--border);border-radius:8px;background:transparent;color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;margin-top:4px"
      onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'"
      onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">+ Добавить урок</button>
  </div>`;
}
function buildLessonHtml(mod,n){
  return`<div class="lesson-row" id="ccl${mod}_${n}">
    <select class="cc-inp" style="width:130px;flex-shrink:0">
      <option>Видеолекция</option><option>PDF-материал</option><option>Тест</option><option>Задание</option><option>Текст</option>
    </select>
    <input type="text" class="cc-inp" placeholder="Название урока" style="flex:1">
    <input type="text" class="cc-inp" placeholder="Мин" style="width:70px">
    <button class="rm-btn" onclick="document.getElementById('ccl${mod}_${n}')?.remove()">${SVG.trash}</button>
  </div>`;
}
function ccAddModule(){_moduleCount++;const c=document.getElementById('cc_modules');const d=document.createElement('div');d.innerHTML=buildModuleHtml(_moduleCount);c.appendChild(d.firstElementChild);}
function ccRemoveModule(n){document.getElementById(`ccmod${n}`)?.remove();}
function ccAddLesson(mod){_lessonCounts[mod]=(_lessonCounts[mod]||1)+1;const c=document.getElementById(`cclessons${mod}`);if(!c)return;const d=document.createElement('div');d.innerHTML=buildLessonHtml(mod,_lessonCounts[mod]);c.appendChild(d.firstElementChild);}
function ccSubmitRequest(){
  const title=document.getElementById('cc_title')?.value.trim();
  const desc=document.getElementById('cc_desc')?.value.trim();
  const cat=document.getElementById('cc_cat')?.value;
  const motivation=document.getElementById('cc_motivation')?.value.trim();
  if(!title){showToast('Введите название курса','error');return;}
  if(!desc){showToast('Добавьте описание','error');return;}
  if(!cat){showToast('Выберите направление','error');return;}
  if(!motivation){showToast('Добавьте сопроводительное сообщение','error');return;}
  const level=document.getElementById('cc_level')?.value||'Начальный';
  const hours=parseInt(document.getElementById('cc_hours')?.value)||72;
  const outcomes=(document.getElementById('cc_outcomes')?.value||'').split('\n').map(s=>s.trim()).filter(Boolean);
  const program=[];
  let mi=1;
  while(document.getElementById(`ccmod${mi}`)){
    const inp=document.getElementById(`ccmod${mi}`)?.querySelector('input[type="text"]');
    const name=inp?.value.trim()||`Модуль ${mi}`;
    let lessons=0;
    document.querySelectorAll(`#cclessons${mi} .lesson-row`).forEach(()=>lessons++);
    program.push({n:mi,name,l:lessons,h:'—'});
    mi++;
  }
  const reqs=getCourseRequests();
  if(reqs.find(r=>r.teacherLogin===getName()&&r.courseTitle===title&&r.status==='pending')){
    showToast('Заявка с таким названием уже на рассмотрении','default');return;
  }
  reqs.push({id:uid(),type:'new',teacherLogin:getName(),courseTitle:title,category:cat,level,description:desc,motivation,hours,outcomes,program,status:'pending',requestedAt:new Date().toISOString()});
  saveCourseRequests(reqs);
  logActivity('course_request',`Преподаватель ${getName()} подал заявку на курс «${title}»`);
  showToast(`✅ Заявка «${title}» отправлена. Вы будете уведомлены о решении.`,'success',4000);
  renderPage('teacher-requests');
}
function ccSaveDraft(){
  const title=document.getElementById('cc_title')?.value.trim()||'Без названия';
  document.getElementById('cc_status').value='draft';
  ccSaveCourse();
}

/* ===========================================================
   ПРОФИЛЬ
=========================================================== */
/* ===========================================================
   СПИСОК НАПРАВЛЕНИЙ ПРЕПОДАВАНИЯ
=========================================================== */
const TEACHING_AREAS = [
  'Основы искусственного интеллекта',
  'Введение в современные интеллектуальные системы',
  'Практический ИИ: от теории к прикладным решениям',
  'Архитектура и применение интеллектуальных систем',
  'Генеративный искусственный интеллект: инструменты и сценарии применения',
  'Большие языковые модели (LLM): основы и прикладное использование',
  'Нейронные сети: базовые принципы и архитектуры',
  'Искусственный интеллект для профессиональной деятельности',
  'Машинное обучение I',
  'Машинное обучение II',
  'Наука о данных: базовый курс',
  'Data Science для начинающих',
  'Прикладная наука о данных и аналитика',
  'Интеллектуальный анализ данных',
  'Бизнес-аналитика и data-driven принятие решений',
  'Основы Data Engineering',
  'Основы программирования',
  'Основы IoT',
  'Основы облачных вычислений',
  'Основы SCADA-систем',
  'Практическое машинное обучение',
  'NLP и анализ текстовых данных',
  'Разработка web-приложений',
  'DevOps-практики',
  'Инженерия данных',
  'Промышленный IoT',
  'Управление IT-проектами',
  'Глубокое обучение',
  'MLOps',
  'Цифровые двойники',
  'Архитектура интеллектуальных систем',
  'LLM и генеративный ИИ',
  'ИИ в медицине',
  'ИИ в научных исследованиях',
  'Проектирование интеллектуальных решений',
  'Инженерное моделирование и проектирование',
  'Low code/no code разработка',
  'Основы устойчивого развития и ESG',
];
function pfSelectAllAreas(val){
  document.querySelectorAll('[id^="pf_area_"]').forEach(cb=>cb.checked=val);
  pfUpdateAreasCount();
}
function pfUpdateAreasCount(){
  const n=document.querySelectorAll('[id^="pf_area_"]:checked').length;
  const el=document.getElementById('pf_areas_count');
  if(el) el.textContent=n+' выбрано';
}
function pfGetSelectedAreas(){
  return [...document.querySelectorAll('[id^="pf_area_"]:checked')].map(cb=>cb.value);
}

function openProfile(){
  const role=getRole(), name=getName(), av=getAvatar(name), me=getCurrentUser();
  const isAdmin=role==='admin';
  const dn=isAdmin?'Администратор':(me?.displayName||name||'—');
  const lg=isAdmin?'admin':(me?.login||'—');
  const ph=me?.phone||''; const em=me?.email||'';
  const rd=me?.createdAt?fmtDate(me.createdAt):'—';
  openModal(`
    <div style="background:#fff;border-radius:20px;width:100%;max-width:480px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.25)">
      <div style="background:linear-gradient(135deg,#1e1b4b,#312e81);padding:28px 28px 24px;position:relative;display:flex;align-items:center;gap:18px">
        <div id="profAv" style="width:64px;height:64px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;border:3px solid rgba(255,255,255,0.2);flex-shrink:0">${av}</div>
        <div>
          <div id="profName" style="font-size:19px;font-weight:800;color:#fff;margin-bottom:3px">${dn}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.55)">Логин: ${lg}</div>
          <div style="display:inline-block;margin-top:6px;background:rgba(99,102,241,0.35);color:#a5b4fc;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700">${roleLabel(role)}</div>
        </div>
        <button onclick="closeModal()" style="position:absolute;top:12px;right:12px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
      </div>
      <div style="padding:24px 28px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:14px">Личные данные</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <div><label style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--text-secondary)">Отображаемое имя</label>
            <input type="text" id="pf_name" value="${dn}" ${isAdmin?'readonly':''} style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box;${isAdmin?'background:var(--bg);':''}" onchange="updateProfilePreview(this.value)"></div>
          <div><label style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--text-secondary)">Логин (неизменяемый)</label>
            <input type="text" value="${lg}" readonly style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box;background:var(--bg);color:var(--text-secondary)"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <div><label style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--text-secondary)">Телефон</label>
            <input type="tel" id="pf_phone" value="${ph}" ${isAdmin?'readonly':''} placeholder="+7 (___) ___-__-__" style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box"></div>
          <div><label style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--text-secondary)">Email</label>
            <input type="email" id="pf_email" value="${em}" ${isAdmin?'readonly':''} placeholder="email@domain.com" style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box"></div>
        </div>
        <div style="margin-bottom:${!isAdmin?'16':'0'}px"><label style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--text-secondary)">Дата регистрации</label>
          <input type="text" value="${rd}" readonly style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box;background:var(--bg);color:var(--text-secondary)"></div>
        ${!isAdmin?`<div style="margin-top:16px"><label style="display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--text-secondary)">Новый пароль <span style="color:var(--text-muted);font-weight:400">(оставьте пустым, если не меняете)</span></label>
          <input type="password" id="pf_pwd" placeholder="Минимум 6 символов" style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box"></div>
        `:''}\
        <div style="margin-top:20px;display:flex;gap:10px">
          ${!isAdmin?`<button onclick="saveProfile()" class="btn btn-primary">${SVG.check} Сохранить</button>`:''}
          <button onclick="closeModal()" class="btn btn-secondary">Закрыть</button>
        </div>
      </div>
    </div>`);
}
function updateProfilePreview(name){
  const av=getAvatar(name);
  const el=document.getElementById('profAv'); if(el)el.textContent=av;
  const nl=document.getElementById('profName'); if(nl)nl.textContent=name;
}
function saveProfile(){
  const name=document.getElementById('pf_name')?.value.trim();
  const phone=document.getElementById('pf_phone')?.value.trim();
  const email=document.getElementById('pf_email')?.value.trim();
  const pwd=document.getElementById('pf_pwd')?.value;
  if(!name){showToast('Имя не может быть пустым','error');return;}
  if(email&&!isValidEmail(email)){showToast('Некорректный email','error');return;}
  if(pwd&&pwd.length<6){showToast('Пароль минимум 6 символов','error');return;}
  const role=getRole();
  // Validate teacher areas
  let teachingAreas=undefined;
  if(role==='teacher'){
    const sel=pfGetSelectedAreas();
    if(sel.length===0){showToast('Выберите хотя бы одно направление преподавания','error');return;}
    teachingAreas=sel;
  }
  const curName=getName(), users=getUsers();
  const idx=users.findIndex(u=>u.displayName===curName||u.login===curName);
  if(idx!==-1){
    users[idx].displayName=name;
    users[idx].phone=phone;
    users[idx].email=email;
    if(pwd)users[idx].password=pwd;
    if(teachingAreas!==undefined)users[idx].teachingAreas=teachingAreas;
    saveUsers(users);
  }
  setSession(getRole(),name);
  const av=getAvatar(name);
  document.querySelectorAll('.js-user-name').forEach(el=>el.textContent=name);
  document.querySelectorAll('.js-user-avatar').forEach(el=>el.textContent=av);
  showToast('Профиль обновлён','success');
  closeModal();
}

/* ===========================================================
   СТРАНИЦА КУРСА
=========================================================== */
function initCourse(){
  requireAuth();
  const role=getRole(), name=getName(), av=getAvatar(name);
  document.querySelectorAll('.js-user-name').forEach(el=>el.textContent=name);
  document.querySelectorAll('.js-user-avatar').forEach(el=>el.textContent=av);
  document.querySelectorAll('.js-user-role').forEach(el=>el.textContent=roleLabel(role));
  document.querySelectorAll('.teacher-only').forEach(el=>el.classList.toggle('hidden',role!=='teacher'));
  document.querySelectorAll('.student-only').forEach(el=>el.classList.toggle('hidden',role!=='student'));
  updateBell();
  initModuleToggles();
  document.querySelectorAll('.logout-btn').forEach(b=>b.addEventListener('click',logout));
  document.querySelectorAll('.js-open-profile').forEach(el=>el.addEventListener('click',openProfile));
  document.querySelectorAll('.lesson-check:not(.done)').forEach(b=>{
    b.addEventListener('click',e=>{e.stopPropagation();b.classList.add('done');showToast('Отмечено выполненным','success');});
  });
}


/* ===========================================================
   АНАЛИТИКА СТУДЕНТА — рекомендации на основе ответов
=========================================================== */
function renderStudentAnalytics(c){
  const me=getCurrentUser(), myId=me?.login||getName();
  const enrolled=getEnrolled(myId);
  const grades=getGrades().filter(g=>g.studentLogin===myId);
  const subs=getSubmissions().filter(s=>s.studentLogin===myId);
  const quizzes=getQuizzes();
  const courses=getCourses();

  // Собираем статистику из результатов тестов (по категориям/курсам)
  const catStats={};
  grades.forEach(g=>{
    const a=getAssignments().find(x=>x.id===g.assignmentId);
    const course=courses.find(c=>c.id===g.courseId||(a&&c.id===a.courseId));
    const cat=course?.category||'Общее';
    const pct=Math.round(g.grade/g.maxScore*100);
    if(!catStats[cat])catStats[cat]={cat,total:0,sum:0,count:0,courseIds:new Set()};
    catStats[cat].sum+=pct; catStats[cat].count++; catStats[cat].total++;
    if(course)catStats[cat].courseIds.add(course.id);
  });

  // Рекомендации на основе записанных курсов и оценок
  const enrolledCourses=courses.filter(c=>enrolled.includes(c.id));
  const notEnrolled=courses.filter(c=>c.status==='published'&&!enrolled.includes(c.id));

  // Сортировка категорий: слабые результаты = высокий приоритет
  const catArr=Object.values(catStats).map(s=>({...s,avg:Math.round(s.sum/s.count),courseIds:[...s.courseIds]}));
  catArr.sort((a,b)=>a.avg-b.avg);

  const hasData=catArr.length>0;

  c.innerHTML=`
  <style>
    .analytics-card{background:#fff;border-radius:14px;border:1px solid var(--border);padding:24px;margin-bottom:16px}
    .bar-wrap{height:10px;background:var(--border);border-radius:5px;overflow:hidden;margin-top:8px}
    .bar-fill{height:100%;border-radius:5px;transition:width 0.6s}
    .rec-card{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border)}
    .rec-card:last-child{border-bottom:none}
    .rec-badge{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px}
    .priority-high{background:#fee2e2}
    .priority-mid{background:#fef9c3}
    .priority-ok{background:#dcfce7}
  </style>

  ${!hasData?`
  <div class="analytics-card" style="text-align:center;padding:48px 24px">
    <div style="font-size:52px;margin-bottom:16px">📊</div>
    <h3 style="font-size:19px;font-weight:700;margin-bottom:10px">Данных пока недостаточно</h3>
    <p style="color:var(--text-secondary);max-width:360px;margin:0 auto 20px;line-height:1.6">
      Пройдите хотя бы одно задание или тест — и здесь появятся персональные рекомендации по курсам.
    </p>
    <button onclick="renderPage('catalog')" class="btn btn-primary">Перейти в каталог →</button>
  </div>`:`

  <!-- ОБЩАЯ СТАТИСТИКА -->
  <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
    ${statCard(`<span style="color:#6366f1">${SVG.award}</span>`,'purple',grades.length?Math.round(grades.reduce((s,g)=>s+g.grade/g.maxScore*100,0)/grades.length)+'%':'—','Средний балл','','')}
    ${statCard(`<span style="color:#10b981">${SVG.check}</span>`,'green',grades.length,'Проверено работ','','')}
    ${statCard(`<span style="color:#f59e0b">${SVG.clipboard}</span>`,'orange',subs.length,'Сдано заданий','','')}
    ${statCard(`<span style="color:#3b82f6">${SVG.book}</span>`,'blue',enrolled.length,'Курсов в обучении','','')}
  </div>

  <!-- РЕЗУЛЬТАТЫ ПО КАТЕГОРИЯМ -->
  <div class="analytics-card">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:18px">📈 Результаты по направлениям</div>
    ${catArr.map(s=>{
      const color=s.avg>=80?'#10b981':s.avg>=60?'#f59e0b':'#ef4444';
      const label=s.avg>=80?'Хорошо':s.avg>=60?'Средне':'Нужно улучшить';
      return`<div style="margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-size:14px;font-weight:600">${s.cat}</span>
          <span style="font-size:13px;font-weight:700;color:${color}">${s.avg}% · ${label}</span>
        </div>
        <div class="bar-wrap"><div class="bar-fill" style="width:${s.avg}%;background:${color}"></div></div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px">${s.count} работ оценено</div>
      </div>`;
    }).join('')}
  </div>

  <!-- РЕКОМЕНДУЕМЫЕ КУРСЫ -->
  <div class="analytics-card">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:6px">🎯 Рекомендуемые курсы</div>
    <div style="font-size:13px;color:var(--text-secondary);margin-bottom:18px">Основано на ваших результатах — приоритет отдан направлениям, где есть пробелы</div>
    ${(()=>{
      const weakCats=catArr.filter(s=>s.avg<75).map(s=>s.cat);
      const recs=notEnrolled.filter(c=>weakCats.includes(c.category)||weakCats.length===0).slice(0,5);
      if(recs.length===0)return`<div style="text-align:center;padding:20px;color:var(--text-muted)">Вы записаны на все рекомендуемые курсы или данных недостаточно.</div>`;
      return recs.map(r=>{
        const isWeak=weakCats.includes(r.category);
        return`<div class="rec-card">
          <div class="rec-badge ${isWeak?'priority-high':'priority-ok'}">${isWeak?'⚠️':'✨'}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700">${r.title}</div>
            <div style="font-size:12px;color:var(--text-muted)">${r.category} · ${r.level} · ${r.hours} ч</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
            ${isWeak?`<span class="badge badge-danger" style="font-size:11px">Приоритет</span>`:`<span class="badge badge-success" style="font-size:11px">Рекомендован</span>`}
            <button onclick="openCourseDetail('${r.id}')" class="btn btn-sm btn-secondary">Подробнее</button>
          </div>
        </div>`;
      }).join('');
    })()}
  </div>

  <!-- ВАЖНОСТЬ КУРСОВ (из ответов) -->
  <div class="analytics-card">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:6px">💡 Важность направлений по вашим данным</div>
    <div style="font-size:13px;color:var(--text-secondary);margin-bottom:18px">Чем ниже результат — тем важнее пройти соответствующий курс</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px">
      ${catArr.map(s=>{
        const importance=s.avg>=80?'Освоено':s.avg>=60?'Нужна практика':'Высокий приоритет';
        const bg=s.avg>=80?'#f0fdf4':s.avg>=60?'#fefce8':'#fef2f2';
        const fc=s.avg>=80?'#15803d':s.avg>=60?'#a16207':'#dc2626';
        return`<div style="background:${bg};border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:${fc}">${s.avg}%</div>
          <div style="font-size:12px;font-weight:700;margin:4px 0">${s.cat}</div>
          <div style="font-size:11px;color:${fc}">${importance}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`}`;
}

/* ===========================================================
   ТОЧКА ВХОДА
=========================================================== */
/* ===========================================================
   ОПРОСНИК ДЛЯ НОВЫХ СТУДЕНТОВ
=========================================================== */
function showOnboardingSurvey(){
  const areas = typeof TEACHING_AREAS!=='undefined' ? TEACHING_AREAS : [];
  openModal(`
    <div style="background:#fff;border-radius:20px;width:100%;max-width:600px;max-height:92vh;overflow-y:auto">
      <div style="background:linear-gradient(135deg,#312e81,#6366f1);padding:26px 28px;border-radius:20px 20px 0 0;position:relative">
        <button onclick="skipSurvey()" style="position:absolute;top:14px;right:14px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
        <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:6px">👋 Добро пожаловать!</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.65)">Пройдите короткий опрос — это поможет нам улучшить программы. Займёт 1 минуту.</div>
      </div>
      <div style="padding:24px 28px">
        <div style="font-size:14px;font-weight:700;margin-bottom:6px">
          Какие направления вас больше всего интересуют?
          <span style="font-weight:400;color:var(--text-muted)"> (выберите все подходящие)</span>
        </div>
        <div style="border:1.5px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:20px">
          <div style="padding:10px 14px;background:var(--bg);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
            <span id="sv_count" style="font-size:12px;color:var(--text-muted)">0 выбрано</span>
            <div style="display:flex;gap:8px">
              <button type="button" onclick="svSelectAll(true)" style="font-size:11px;padding:3px 10px;border:1px solid var(--border);border-radius:5px;background:#fff;cursor:pointer;color:var(--accent)">Все</button>
              <button type="button" onclick="svSelectAll(false)" style="font-size:11px;padding:3px 10px;border:1px solid var(--border);border-radius:5px;background:#fff;cursor:pointer;color:var(--text-muted)">Сбросить</button>
            </div>
          </div>
          <div style="max-height:260px;overflow-y:auto;padding:8px 14px">
            ${areas.map((a,i)=>`
              <label style="display:flex;align-items:center;gap:9px;padding:6px 4px;font-size:13px;cursor:pointer;border-radius:6px"
                onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                <input type="checkbox" id="sv_${i}" value="${a}"
                  onchange="document.getElementById('sv_count').textContent=document.querySelectorAll('[id^=sv_]:checked').length+' выбрано'"
                  style="width:15px;height:15px;accent-color:var(--accent);flex-shrink:0">
                ${a}
              </label>`).join('')}
          </div>
        </div>
        <div style="font-size:14px;font-weight:700;margin-bottom:8px">
          Комментарий или пожелания
          <span style="font-weight:400;color:var(--text-muted)"> (необязательно)</span>
        </div>
        <textarea id="sv_comment" rows="3" class="form-control"
          placeholder="Каких курсов не хватает? Чему хотите научиться? Любые пожелания..."></textarea>
      </div>
      <div style="padding:0 28px 24px;display:flex;gap:10px">
        <button onclick="submitSurvey()" class="btn btn-primary" style="flex:1;padding:13px;font-size:15px">
          ${SVG.check} Отправить и начать обучение
        </button>
        <button onclick="skipSurvey()" class="btn btn-secondary">Пропустить</button>
      </div>
    </div>`);
}

function svSelectAll(val){
  document.querySelectorAll('[id^="sv_"]').forEach(cb=>{ if(cb.type==='checkbox') cb.checked=val; });
  document.getElementById('sv_count').textContent =
    document.querySelectorAll('[id^="sv_"]:checked').length + ' выбрано';
}

function submitSurvey(){
  const me=getCurrentUser(), myId=me?.login||getName();
  const interests=[...document.querySelectorAll('[id^="sv_"]:checked')].map(cb=>cb.value);
  const comment=(document.getElementById('sv_comment')?.value||'').trim();
  const result={
    id:'sv_'+Date.now(),
    userId:myId,
    userName:me?.displayName||myId,
    interests,
    comment,
    createdAt:new Date().toISOString()
  };
  const results=getSurveyResults();
  results.push(result);
  saveSurveyResults(results);
  markSurveyDone(myId);
  closeModal();
  showToast('Спасибо! Ваши ответы помогут улучшить наши программы 🎓','success',3500);
}

function skipSurvey(){
  const myId=getCurrentUser()?.login||getName();
  if(myId) markSurveyDone(myId);
  closeModal();
}

/* ===========================================================
   СТУДЕНТ — ДОСТИЖЕНИЯ И СЕРТИФИКАТЫ
=========================================================== */
function renderStudentAchievements(c){
  const me=getCurrentUser(), myId=me?.login||getName();
  const enrolled=getEnrolled(myId);
  const grades=getGrades().filter(g=>g.studentLogin===myId);
  const courses=getCourses();
  const subs=getSubmissions().filter(s=>s.studentLogin===myId);

  // Средний балл по каждому курсу
  const cgMap={};
  grades.forEach(g=>{
    if(!cgMap[g.courseId]) cgMap[g.courseId]=[];
    cgMap[g.courseId].push(g.grade/g.maxScore*100);
  });
  const completedIds=enrolled.filter(id=>{
    const cg=cgMap[id];
    return cg&&cg.length>0 && cg.reduce((s,v)=>s+v,0)/cg.length>=70;
  });

  const avgAll=grades.length
    ? Math.round(grades.reduce((s,g)=>s+g.grade/g.maxScore*100,0)/grades.length)
    : 0;

  // Определения достижений
  const ACHS=[
    {id:'first_enroll', icon:'🎓', title:'Первый шаг',       desc:'Записались на первый курс',           earned:enrolled.length>=1},
    {id:'three_enroll', icon:'📚', title:'Активный учащийся',desc:'Записаны на 3 и более курса',          earned:enrolled.length>=3},
    {id:'first_grade',  icon:'✅', title:'Первая оценка',     desc:'Получили первую оценку',               earned:grades.length>=1},
    {id:'five_tasks',   icon:'📝', title:'Трудолюбивый',      desc:'Сдали 5 заданий',                      earned:subs.length>=5},
    {id:'good_avg',     icon:'⭐', title:'Отличник',           desc:'Средний балл выше 90% (≥3 работ)',     earned:grades.length>=3&&avgAll>=90},
    {id:'completer',    icon:'🏆', title:'Завершил курс',      desc:'Средний балл ≥70% по одному курсу',   earned:completedIds.length>=1},
    {id:'multi',        icon:'🌟', title:'Многозадачный',      desc:'Завершили 3 курса',                    earned:completedIds.length>=3},
  ];

  c.innerHTML=`
  <style>
    .ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;margin-bottom:24px}
    .ach-card{background:#fff;border-radius:14px;border:1.5px solid var(--border);padding:20px;text-align:center;transition:all .2s}
    .ach-card.earned{border-color:var(--accent);background:linear-gradient(135deg,#f8f9ff,#eff0ff)}
    .ach-card.locked{opacity:.45;filter:grayscale(.5)}
    .cert-wrap{background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:16px;padding:36px;color:#fff;text-align:center;margin-bottom:16px;position:relative;overflow:hidden}
    .cert-wrap::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:28px 28px}
    .cert-inner{position:relative;z-index:1}
  </style>

  <!-- Счётчики -->
  <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
    ${statCard(`<span style="color:#6366f1">${SVG.book}</span>`,'purple',enrolled.length,'Курсов записано','','')}
    ${statCard(`<span style="color:#10b981">${SVG.check}</span>`,'green',completedIds.length,'Курсов завершено','','')}
    ${statCard(`<span style="color:#f59e0b">${SVG.award||SVG.chart}</span>`,'orange',ACHS.filter(a=>a.earned).length,'Достижений получено','из '+ACHS.length,'')}
    ${statCard(`<span style="color:#3b82f6">${SVG.clipboard}</span>`,'blue',grades.length,'Работ оценено','','')}
  </div>

  <!-- Достижения -->
  <div class="section-title">🏅 Достижения</div>
  <div class="ach-grid">
    ${ACHS.map(a=>`
      <div class="ach-card ${a.earned?'earned':'locked'}">
        <div style="font-size:36px;margin-bottom:10px">${a.icon}</div>
        <div style="font-size:14px;font-weight:700;margin-bottom:4px">${a.title}</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">${a.desc}</div>
        <div style="margin-top:10px">
          ${a.earned
            ?`<span class="badge badge-success" style="font-size:11px">✓ Получено</span>`
            :`<span style="font-size:11px;color:var(--text-muted)">🔒 Не получено</span>`}
        </div>
      </div>`).join('')}
  </div>

  <!-- Сертификаты -->
  <div class="section-title" style="margin-top:8px">🎓 Сертификаты о завершении курса</div>
  ${completedIds.length===0
    ?`<div class="card"><div class="card-body" style="text-align:center;padding:40px">
        <div style="font-size:44px;margin-bottom:14px">🎓</div>
        <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">Сертификатов пока нет</h3>
        <p style="color:var(--text-secondary);max-width:380px;margin:0 auto;font-size:14px;line-height:1.6">
          Завершите курс со средним баллом ≥70%, чтобы получить сертификат.
        </p>
      </div></div>`
    :completedIds.map(id=>{
        const course=courses.find(cc=>cc.id===id);
        if(!course)return'';
        const cg=cgMap[id];
        const avg=Math.round(cg.reduce((s,v)=>s+v,0)/cg.length);
        return`
        <div class="cert-wrap">
          <div class="cert-inner">
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(165,180,252,.65);margin-bottom:10px">
              НАО «КазНУ им. аль-Фараби» · Центр ДПО
            </div>
            <div style="font-size:11px;color:rgba(255,255,255,.35);margin-bottom:18px;letter-spacing:1px">УДОСТОВЕРЕНИЕ О ПОВЫШЕНИИ КВАЛИФИКАЦИИ</div>
            <div style="font-size:22px;font-weight:800;margin-bottom:8px">${me?.displayName||myId}</div>
            <div style="font-size:14px;color:rgba(255,255,255,.6);margin-bottom:14px">успешно завершил(а) курс</div>
            <div style="font-size:20px;font-weight:700;color:#a5b4fc;margin-bottom:18px">«${course.title}»</div>
            <div style="display:flex;justify-content:center;gap:36px;font-size:13px;color:rgba(255,255,255,.5);margin-bottom:20px">
              <span>Средний балл: <b style="color:#fff">${avg}%</b></span>
              <span>72 академических часа</span>
              <span>${new Date().toLocaleDateString('ru-RU')}</span>
            </div>
            <button onclick="printCert('${id}')" class="btn btn-secondary"
              style="background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.2)">
              🖨️ Распечатать сертификат
            </button>
          </div>
        </div>`;
      }).join('')}`;
}

function printCert(courseId){
  const course=getCourses().find(c=>c.id===courseId);
  const me=getCurrentUser(), myId=me?.login||getName();
  if(!course)return;
  const grades=getGrades().filter(g=>g.studentLogin===myId&&g.courseId===courseId);
  const avg=grades.length?Math.round(grades.reduce((s,g)=>s+g.grade/g.maxScore*100,0)/grades.length):0;
  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Сертификат — ${course.title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Georgia',serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#e8ecff;padding:40px}
    .cert{width:760px;padding:60px 70px;border:4px double #302b63;border-radius:4px;background:#fff;text-align:center;position:relative}
    .cert::before{content:'';position:absolute;inset:10px;border:1px solid rgba(48,43,99,.2);pointer-events:none}
    .univ{font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#6366f1;margin-bottom:6px}
    .center{font-size:12px;color:#888;margin-bottom:40px}
    .head{font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#302b63;margin-bottom:40px;font-family:'Arial',sans-serif}
    .body-text{font-size:16px;color:#555;margin-bottom:20px;line-height:1.8}
    .name{font-size:30px;font-weight:bold;color:#1e1b4b;border-bottom:2px solid #6366f1;display:inline-block;padding-bottom:4px;margin-bottom:20px}
    .course{font-size:20px;color:#302b63;font-style:italic;margin-bottom:30px;line-height:1.4}
    .meta{font-size:13px;color:#999;margin-top:40px;border-top:1px solid #ddd;padding-top:20px}
  </style></head><body>
  <div class="cert">
    <div class="univ">Казахский национальный университет имени аль-Фараби</div>
    <div class="center">Центр дополнительного профессионального образования · Кафедра ИИ и Big Data</div>
    <div class="head">Удостоверение о повышении квалификации</div>
    <div class="body-text">Настоящим удостоверяется, что</div>
    <div class="name">${me?.displayName||myId}</div>
    <div class="body-text">успешно прошёл(ла) курс повышения квалификации</div>
    <div class="course">«${course.title}»</div>
    <div class="body-text">в объёме <strong>72 академических часа</strong> · Средний балл: <strong>${avg}%</strong></div>
    <div class="meta">Дата выдачи: ${new Date().toLocaleDateString('ru-RU')} · г. Алматы · пр. аль-Фараби 71</div>
  </div>
  </body></html>`);
  w.print();
}

document.addEventListener('DOMContentLoaded',()=>{
  initSeedCourses();
  seedEvents();
  const page=document.body.dataset.page;
  if(page==='login')    initLogin();
  if(page==='register') initRegister();
  if(page==='dashboard')initDashboard();
  if(page==='course')   initCourse();
});

/* ══════════════════════════════════════════════════════════════════════
   МЕРОПРИЯТИЯ — Events module
══════════════════════════════════════════════════════════════════════ */

function getEvents()         { return JSON.parse(localStorage.getItem(LS.EVENTS)||'[]'); }
function saveEvents(ev)      { localStorage.setItem(LS.EVENTS, JSON.stringify(ev)); }
function getEventRequests()  { return JSON.parse(localStorage.getItem(LS.EVENT_REQUESTS)||'[]'); }
function saveEventRequests(r){ localStorage.setItem(LS.EVENT_REQUESTS, JSON.stringify(r)); }

function seedEvents(){
  if(getEvents().length) return;
  saveEvents([
    {
      id:'ev_summer_2024', type:'summer', eventStatus:'past',
      title:'Летняя школа по машинному обучению 2024',
      description:'Интенсивная двухнедельная школа для студентов и аспирантов. Практические занятия по ML, DL и NLP с ведущими специалистами кафедры ИИ и Big Data КазНУ.\n\nПрограмма включала лекции, воркшопы и командный проект с последующей защитой.',
      dateStart:'2024-07-01', dateEnd:'2024-07-14',
      location:'КазНУ им. аль-Фараби, г. Алматы', format:'Очно',
      seats:30, tags:['ML','Python','NLP','Командный проект'],
      publishedBy:'Администратор', status:'published', createdAt:'2024-05-01T00:00:00.000Z'
    },
    {
      id:'ev_conf_2024', type:'conference', eventStatus:'past',
      title:'Дистанционная конференция «ИИ в образовании» 2024',
      description:'Учебно-методическая конференция о применении технологий искусственного интеллекта в системе высшего образования Казахстана.\n\nДокладчики из 12 университетов, 48 статей в сборнике, онлайн-трансляция.',
      dateStart:'2024-11-15', dateEnd:'2024-11-15',
      location:'Дистанционно (Zoom)', format:'Онлайн',
      seats:200, tags:['ИИ','Образование','EdTech','Казахстан'],
      publishedBy:'Администратор', status:'published', createdAt:'2024-09-01T00:00:00.000Z'
    },
    {
      id:'ev_winter_2025', type:'winter', eventStatus:'past',
      title:'Зимняя школа по LLM и генеративному ИИ',
      description:'Пятидневный интенсив по большим языковым моделям: архитектура Transformer, prompt engineering, RAG-пайплайны, fine-tuning через LoRA.\n\nОрганизован совместно с индустриальными партнёрами.',
      dateStart:'2025-01-20', dateEnd:'2025-01-24',
      location:'КазНУ им. аль-Фараби, г. Алматы', format:'Гибридный',
      seats:40, tags:['LLM','RAG','LoRA','Qwen','HuggingFace'],
      publishedBy:'Администратор', status:'published', createdAt:'2024-12-01T00:00:00.000Z'
    },
    {
      id:'ev_conf_2025_spring', type:'conference', eventStatus:'past',
      title:'Конференция «Казахский NLP: ресурсы и инструменты»',
      description:'Специализированная конференция, посвящённая задачам обработки казахского языка: корпусные ресурсы, языковые модели, задачи NER, машинный перевод.\n\nКлючевые темы: низкоресурсный NLP, мультиязычные модели, бенчмарки для казахского языка.',
      dateStart:'2025-04-10', dateEnd:'2025-04-11',
      location:'Дистанционно', format:'Онлайн',
      seats:150, tags:['NLP','Казахский язык','LLM','Корпус'],
      publishedBy:'Администратор', status:'published', createdAt:'2025-02-01T00:00:00.000Z'
    },
    {
      id:'ev_summer_2025', type:'summer', eventStatus:'upcoming',
      title:'Летняя школа по ИИ и Big Data 2025',
      description:'Флагманское мероприятие центра: трёхнедельная интенсивная программа для студентов, аспирантов и специалистов. Охватывает весь стек современного ИИ — от классического ML до LLM и MLOps.\n\nПо итогам выдаётся удостоверение о повышении квалификации государственного образца.',
      dateStart:'2025-07-07', dateEnd:'2025-07-25',
      location:'КазНУ им. аль-Фараби, г. Алматы', format:'Очно',
      seats:50, tags:['ML','LLM','MLOps','Удостоверение','Летняя школа'],
      publishedBy:'Администратор', status:'published', createdAt:'2025-04-01T00:00:00.000Z'
    },
    {
      id:'ev_conf_2025_fall', type:'conference', eventStatus:'upcoming',
      title:'Учебно-методическая конференция ЦДПО 2025',
      description:'Ежегодная дистанционная конференция Центра дополнительного профессионального образования. Темы: инновационные методики, дистанционное обучение, оценка компетенций в области ИИ.\n\nПриём тезисов открыт до 1 сентября 2025.',
      dateStart:'2025-10-20', dateEnd:'2025-10-21',
      location:'Дистанционно (MS Teams)', format:'Онлайн',
      seats:300, tags:['Методика','ДПО','Дистанционное обучение','Сборник'],
      publishedBy:'Администратор', status:'published', createdAt:'2025-05-01T00:00:00.000Z'
    },
  ]);
}

/* ══════════════════════════════════════════════
   ADMIN — управление мероприятиями
══════════════════════════════════════════════ */
function renderAdminEvents(c){
  const events=getEvents();
  const requests=getEventRequests();
  const pendingCount=requests.filter(r=>r.status==='pending').length;
  const dot=document.getElementById('eventReqDot');
  if(dot) dot.style.display=pendingCount?'block':'none';

  c.innerHTML=`
  <style>
    .ev-adm-tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;}
    .ev-adm-tab{padding:9px 20px;border-radius:10px;border:1.5px solid var(--border);background:#fff;font-size:13px;font-weight:700;color:var(--text-secondary);cursor:pointer;transition:all .2s;}
    .ev-adm-tab.active{background:var(--accent);color:#fff;border-color:var(--accent);}
    .ev-adm-tab .tbadge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:99px;font-size:11px;font-weight:800;margin-left:6px;padding:0 4px;}
    .ev-tbl{width:100%;border-collapse:collapse;font-size:14px;}
    .ev-tbl th{text-align:left;padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);border-bottom:2px solid var(--border);white-space:nowrap;}
    .ev-tbl td{padding:13px 14px;border-bottom:1px solid var(--border);vertical-align:middle;}
    .ev-tbl tr:last-child td{border-bottom:none;}
    .ev-tbl tr:hover td{background:#f8f9fb;}
    .ev-type-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;}
    .tp-summer{background:#fef3c7;color:#b45309;} .tp-winter{background:#cffafe;color:#0369a1;}
    .tp-conference{background:#f5f3ff;color:#7c3aed;} .tp-workshop{background:#dcfce7;color:#166534;}
    .ev-sdot{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;}
    .ev-sdot::before{content:'';width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0;}
    .esd-upcoming::before{background:#10b981;} .esd-past::before{background:#9ca3af;} .esd-ongoing::before{background:#f59e0b;}
    .ev-req-card{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:20px 22px;margin-bottom:14px;transition:box-shadow .2s;}
    .ev-req-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.08);}
    .ev-form-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;align-items:center;justify-content:center;padding:20px;}
    .ev-form-overlay.open{display:flex;}
    .ev-form-box{background:#fff;border-radius:20px;max-width:640px;width:100%;max-height:88vh;overflow-y:auto;padding:32px;}
    .ev-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
    @media(max-width:600px){
      .ev-tbl thead{display:none;}
      .ev-tbl tr{display:block;border:1px solid var(--border);border-radius:12px;margin-bottom:10px;padding:10px 14px;}
      .ev-tbl td{display:flex;justify-content:space-between;align-items:center;border:none;padding:6px 0;}
      .ev-tbl td:first-child{font-weight:700;}
      .ev-form-box{padding:20px;border-radius:16px;}
      .ev-form-grid{grid-template-columns:1fr!important;}
      .ev-req-card{padding:14px 16px;}
    }
  </style>

  <div class="ev-adm-tabs">
    <button class="ev-adm-tab active" id="tabEvList" onclick="evTab('list')">
      Опубликованные <span class="tbadge" style="background:var(--accent-light);color:var(--accent);">${events.filter(e=>e.status==='published').length}</span>
    </button>
    <button class="ev-adm-tab" id="tabEvReq" onclick="evTab('req')">
      Заявки от преподавателей
      <span class="tbadge" style="background:${pendingCount?'#fee2e2':'rgba(0,0,0,.08)'};color:${pendingCount?'#ef4444':'#9ca3af'};">${pendingCount}</span>
    </button>
  </div>

  <!-- ── Список событий ── -->
  <div id="evPanelList">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
      <div style="font-size:15px;font-weight:700;color:#111827;">Все мероприятия</div>
      <button class="btn btn-primary" onclick="evOpenForm()" style="font-size:13px;padding:9px 18px;">${SVG.plus} Добавить</button>
    </div>
    <div style="background:#fff;border-radius:16px;border:1px solid var(--border);overflow:auto;">
      <table class="ev-tbl">
        <thead><tr><th>Название</th><th>Тип</th><th>Дата</th><th>Формат</th><th>Статус</th><th></th></tr></thead>
        <tbody>
        ${events.length ? events.map(e=>`
          <tr>
            <td><div style="font-weight:700;color:#111827;max-width:260px;">${e.title}</div><div style="font-size:11px;color:var(--text-muted);">${e.location||''}</div></td>
            <td><span class="ev-type-pill tp-${e.type}">${{summer:'☀️ Летняя',winter:'❄️ Зимняя',conference:'🎓 Конф.',workshop:'🛠️ Воркшоп'}[e.type]||e.type}</span></td>
            <td style="font-size:13px;white-space:nowrap;">${e.dateStart?new Date(e.dateStart).toLocaleDateString('ru-RU'):'—'}</td>
            <td style="font-size:13px;">${e.format||'—'}</td>
            <td><span class="ev-sdot esd-${e.eventStatus||'past'}">${{upcoming:'Предстоящее',ongoing:'Идёт',past:'Завершено'}[e.eventStatus]||'—'}</span></td>
            <td style="white-space:nowrap;">
              <button class="btn btn-sm btn-secondary" onclick="evOpenForm('${e.id}')" style="margin-right:4px;" title="Редактировать">${SVG.edit}</button>
              <button class="btn btn-sm btn-secondary" onclick="evDel('${e.id}')" style="color:var(--danger);border-color:var(--danger);" title="Удалить">${SVG.trash}</button>
            </td>
          </tr>`).join('')
        :`<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--text-muted);">Нет мероприятий. Нажмите «Добавить».</td></tr>`}
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Заявки преподавателей ── -->
  <div id="evPanelReq" style="display:none;">
    <div style="font-size:15px;font-weight:700;color:#111827;margin-bottom:16px;">Заявки от преподавателей</div>
    ${requests.length ? requests.slice().reverse().map(r=>`
    <div class="ev-req-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px;flex-wrap:wrap;">
        <div>
          <div style="font-weight:800;font-size:15px;color:#111827;">${r.title}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:3px;">От: ${r.authorName} · ${new Date(r.createdAt).toLocaleDateString('ru-RU')} · <span class="ev-type-pill tp-${r.type}" style="padding:2px 8px;font-size:10px;">${{summer:'Летняя школа',winter:'Зимняя школа',conference:'Конференция',workshop:'Воркшоп'}[r.type]||r.type}</span></div>
        </div>
        <span style="padding:4px 12px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;background:${r.status==='pending'?'#fef3c7':r.status==='approved'?'#dcfce7':'#fee2e2'};color:${r.status==='pending'?'#92400e':r.status==='approved'?'#166534':'#991b1b'};">${{pending:'⏳ На рассмотрении',approved:'✓ Одобрена',rejected:'✕ Отклонена'}[r.status]}</span>
      </div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:10px;">${(r.description||'').slice(0,200)}${(r.description||'').length>200?'...':''}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">📅 ${r.dateStart||'—'} ${r.dateEnd?'— '+r.dateEnd:''} &nbsp;·&nbsp; 📍 ${r.location||'—'} &nbsp;·&nbsp; 🖥 ${r.format||'—'} &nbsp;·&nbsp; 👥 ${r.seats||'—'} мест</div>
      ${r.status==='rejected'&&r.rejectReason?`<div style="padding:10px 14px;background:#fef2f2;border-radius:10px;font-size:12px;color:#b91c1c;margin-bottom:12px;">Причина отказа: ${r.rejectReason}</div>`:''}
      ${r.status==='pending'?`<div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="evApprove('${r.id}')" style="font-size:13px;padding:8px 18px;">${SVG.check} Одобрить и опубликовать</button>
        <button class="btn btn-secondary" onclick="evReject('${r.id}')" style="font-size:13px;padding:8px 18px;color:var(--danger);border-color:var(--danger);">${SVG.trash} Отклонить</button>
      </div>`:''}
    </div>`).join('')
    :`<div style="text-align:center;padding:60px;color:var(--text-muted);background:#fff;border-radius:16px;border:1px solid var(--border);">Заявок от преподавателей нет.</div>`}
  </div>

  <!-- ── Форма создания/редактирования ── -->
  <div class="ev-form-overlay" id="evFormOverlay">
    <div class="ev-form-box">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;">
        <h3 id="evFormHeading" style="font-family:'Sora',sans-serif;font-size:19px;font-weight:800;margin:0;">Новое мероприятие</h3>
        <button onclick="evCloseForm()" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <input type="hidden" id="evFId">
      <div class="ev-form-grid">
        <div style="grid-column:1/-1;">
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Название *</label>
          <input id="evFTitle" class="form-control" placeholder="Летняя школа по ML 2026">
        </div>
        <div>
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Тип *</label>
          <select id="evFType" class="form-control">
            <option value="summer">☀️ Летняя школа</option>
            <option value="winter">❄️ Зимняя школа</option>
            <option value="conference">🎓 Конференция</option>
            <option value="workshop">🛠️ Воркшоп</option>
          </select>
        </div>
        <div>
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Статус события</label>
          <select id="evFStatus" class="form-control">
            <option value="upcoming">Предстоящее</option>
            <option value="ongoing">Идёт сейчас</option>
            <option value="past">Завершено</option>
          </select>
        </div>
        <div>
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Дата начала</label>
          <input id="evFDateStart" type="date" class="form-control">
        </div>
        <div>
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Дата окончания</label>
          <input id="evFDateEnd" type="date" class="form-control">
        </div>
        <div>
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Место проведения</label>
          <input id="evFLocation" class="form-control" placeholder="КазНУ, Алматы / Онлайн">
        </div>
        <div>
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Формат</label>
          <select id="evFFormat" class="form-control">
            <option value="Очно">Очно</option>
            <option value="Онлайн">Онлайн</option>
            <option value="Гибридный">Гибридный</option>
          </select>
        </div>
        <div>
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Количество мест</label>
          <input id="evFSeats" type="number" class="form-control" placeholder="50">
        </div>
        <div style="grid-column:1/-1;">
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Описание *</label>
          <textarea id="evFDesc" class="form-control" rows="5" placeholder="Подробное описание, программа, цели мероприятия..."></textarea>
        </div>
        <div style="grid-column:1/-1;">
          <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Теги (через запятую)</label>
          <input id="evFTags" class="form-control" placeholder="ML, Python, Казахстан">
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:22px;">
        <button class="btn btn-primary" onclick="evSave()" style="flex:1;padding:13px;font-size:15px;">Сохранить и опубликовать</button>
        <button class="btn btn-secondary" onclick="evCloseForm()" style="padding:13px 20px;">Отмена</button>
      </div>
    </div>
  </div>`;
}

function evTab(t){
  document.getElementById('tabEvList').classList.toggle('active',t==='list');
  document.getElementById('tabEvReq').classList.toggle('active',t==='req');
  document.getElementById('evPanelList').style.display=t==='list'?'block':'none';
  document.getElementById('evPanelReq').style.display=t==='req'?'block':'none';
}
function evOpenForm(id){
  document.getElementById('evFormOverlay').classList.add('open');
  if(id){
    const e=getEvents().find(x=>x.id===id)||{};
    document.getElementById('evFormHeading').textContent='Редактировать';
    document.getElementById('evFId').value=id;
    document.getElementById('evFTitle').value=e.title||'';
    document.getElementById('evFType').value=e.type||'summer';
    document.getElementById('evFStatus').value=e.eventStatus||'upcoming';
    document.getElementById('evFDateStart').value=e.dateStart||'';
    document.getElementById('evFDateEnd').value=e.dateEnd||'';
    document.getElementById('evFLocation').value=e.location||'';
    document.getElementById('evFFormat').value=e.format||'Очно';
    document.getElementById('evFSeats').value=e.seats||'';
    document.getElementById('evFDesc').value=e.description||'';
    document.getElementById('evFTags').value=(e.tags||[]).join(', ');
  } else {
    document.getElementById('evFormHeading').textContent='Новое мероприятие';
    document.getElementById('evFId').value='';
    ['evFTitle','evFDateStart','evFDateEnd','evFLocation','evFSeats','evFDesc','evFTags'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('evFType').value='summer';
    document.getElementById('evFStatus').value='upcoming';
    document.getElementById('evFFormat').value='Очно';
  }
}
function evCloseForm(){ document.getElementById('evFormOverlay').classList.remove('open'); }
function evSave(){
  const title=document.getElementById('evFTitle').value.trim();
  const desc=document.getElementById('evFDesc').value.trim();
  if(!title||!desc){alert('Заполните название и описание.');return;}
  const events=getEvents();
  const eid=document.getElementById('evFId').value;
  const obj={
    id:eid||'ev_'+Date.now(),
    type:document.getElementById('evFType').value,
    eventStatus:document.getElementById('evFStatus').value,
    title,description:desc,
    dateStart:document.getElementById('evFDateStart').value,
    dateEnd:document.getElementById('evFDateEnd').value,
    location:document.getElementById('evFLocation').value,
    format:document.getElementById('evFFormat').value,
    seats:parseInt(document.getElementById('evFSeats').value)||null,
    tags:document.getElementById('evFTags').value.split(',').map(t=>t.trim()).filter(Boolean),
    publishedBy:'Администратор',status:'published',
    createdAt:eid?(events.find(e=>e.id===eid)||{}).createdAt||new Date().toISOString():new Date().toISOString(),
  };
  if(eid){const i=events.findIndex(e=>e.id===eid);i>=0?events[i]=obj:events.push(obj);}
  else events.push(obj);
  saveEvents(events);
  evCloseForm();
  renderAdminEvents(document.getElementById('mainContent'));
}
function evDel(id){
  if(!confirm('Удалить мероприятие?'))return;
  saveEvents(getEvents().filter(e=>e.id!==id));
  renderAdminEvents(document.getElementById('mainContent'));
}
function evApprove(id){
  const reqs=getEventRequests(), req=reqs.find(r=>r.id===id);
  if(!req)return;
  req.status='approved'; saveEventRequests(reqs);
  const events=getEvents();
  events.push({
    id:'ev_req_'+id,type:req.type||'conference',eventStatus:'upcoming',
    title:req.title,description:req.description,
    dateStart:req.dateStart,dateEnd:req.dateEnd,
    location:req.location,format:req.format,
    seats:parseInt(req.seats)||null,
    tags:(req.tags||'').split(',').map(t=>t.trim()).filter(Boolean),
    publishedBy:req.authorName,status:'published',createdAt:new Date().toISOString(),
  });
  saveEvents(events);
  logActivity('event_approved',`Мероприятие «${req.title}» одобрено и опубликовано`);
  renderAdminEvents(document.getElementById('mainContent'));
}
function evReject(id){
  const reason=prompt('Причина отклонения (необязательно):');
  if(reason===null)return;
  const reqs=getEventRequests(),req=reqs.find(r=>r.id===id);
  if(!req)return;
  req.status='rejected';req.rejectReason=reason;
  saveEventRequests(reqs);
  logActivity('event_rejected',`Заявка «${req.title}» отклонена`);
  renderAdminEvents(document.getElementById('mainContent'));
}

/* ══════════════════════════════════════════════
   TEACHER — предложить мероприятие
══════════════════════════════════════════════ */
function renderTeacherEvents(c){
  const user=getCurrentUser();
  const myReqs=getEventRequests().filter(r=>r.authorLogin===(user?user.login:''));

  c.innerHTML=`
  <style>
    .te-req-card{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:18px 20px;margin-bottom:12px;}
    .te-st{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:700;}
    @media(max-width:700px){
      .te-ev-layout{grid-template-columns:1fr!important;}
      .te-ev-sidebar{display:none!important;}
      .te-ev-form-grid{grid-template-columns:1fr!important;}
      .te-ev-form-grid>div[style*="grid-column:1/-1"]{grid-column:1!important;}
    }
  </style>
  <div style="display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:start;" class="te-ev-layout">

    <div>
      <!-- Форма -->
      <div style="background:#fff;border:1px solid var(--border);border-radius:18px;padding:28px;margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
          <div style="width:44px;height:44px;background:linear-gradient(135deg,var(--accent),#818cf8);border-radius:12px;display:flex;align-items:center;justify-content:center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
          </div>
          <div>
            <div style="font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#111827;">Предложить мероприятие</div>
            <div style="font-size:13px;color:var(--text-muted);">Заявка поступит администратору на рассмотрение</div>
          </div>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:12px 16px;margin-bottom:18px;font-size:13px;color:#1e40af;line-height:1.55;">
          ℹ️ Одобренные мероприятия автоматически публикуются на публичной странице центра. Ответ — в течение 1–2 рабочих дней.
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;" class="te-ev-form-grid">
          <div style="grid-column:1/-1;">
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Название *</label>
            <input id="teTitle" class="form-control" placeholder="Зимняя школа по NLP 2026">
          </div>
          <div>
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Тип *</label>
            <select id="teType" class="form-control">
              <option value="summer">☀️ Летняя школа</option>
              <option value="winter">❄️ Зимняя школа</option>
              <option value="conference">🎓 Конференция</option>
              <option value="workshop">🛠️ Воркшоп</option>
            </select>
          </div>
          <div>
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Формат</label>
            <select id="teFormat" class="form-control">
              <option value="Очно">Очно</option>
              <option value="Онлайн">Онлайн</option>
              <option value="Гибридный">Гибридный</option>
            </select>
          </div>
          <div>
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Дата начала</label>
            <input id="teDateStart" type="date" class="form-control">
          </div>
          <div>
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Дата окончания</label>
            <input id="teDateEnd" type="date" class="form-control">
          </div>
          <div style="grid-column:1/-1;">
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Место проведения</label>
            <input id="teLocation" class="form-control" placeholder="КазНУ, Алматы / Дистанционно (Zoom)">
          </div>
          <div>
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Ожидаемое число участников</label>
            <input id="teSeats" type="number" class="form-control" placeholder="30">
          </div>
          <div style="grid-column:1/-1;">
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Описание и программа *</label>
            <textarea id="teDesc" class="form-control" rows="5" placeholder="Цели, программа, целевая аудитория, ожидаемые результаты..."></textarea>
          </div>
          <div style="grid-column:1/-1;">
            <label style="font-size:13px;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Теги (через запятую)</label>
            <input id="teTags" class="form-control" placeholder="NLP, Казахский, ML">
          </div>
        </div>
        <button class="btn btn-primary" onclick="teSubmit()" style="margin-top:18px;width:100%;padding:14px;font-size:15px;">
          ${SVG.plus} Отправить заявку администратору
        </button>
      </div>

      <!-- История заявок -->
      <div style="font-family:'Sora',sans-serif;font-size:16px;font-weight:800;color:#111827;margin-bottom:14px;">Мои заявки (${myReqs.length})</div>
      ${myReqs.length ? myReqs.slice().reverse().map(r=>`
      <div class="te-req-card">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
          <div style="font-weight:800;font-size:15px;color:#111827;">${r.title}</div>
          <span class="te-st" style="background:${r.status==='pending'?'#fef3c7':r.status==='approved'?'#dcfce7':'#fee2e2'};color:${r.status==='pending'?'#92400e':r.status==='approved'?'#166534':'#991b1b'};">${{pending:'⏳ На рассмотрении',approved:'✓ Одобрена',rejected:'✕ Отклонена'}[r.status]}</span>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Подано: ${new Date(r.createdAt).toLocaleDateString('ru-RU')} &nbsp;·&nbsp; ${{summer:'Летняя школа',winter:'Зимняя школа',conference:'Конференция',workshop:'Воркшоп'}[r.type]||r.type} &nbsp;·&nbsp; ${r.format||'—'}</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">${(r.description||'').slice(0,180)}${(r.description||'').length>180?'...':''}</div>
        ${r.status==='rejected'&&r.rejectReason?`<div style="margin-top:10px;padding:10px 14px;background:#fef2f2;border-radius:10px;font-size:12px;color:#b91c1c;">Причина отказа: ${r.rejectReason}</div>`:''}
      </div>`).join('')
      :`<div style="text-align:center;padding:40px;color:var(--text-muted);background:#fff;border-radius:14px;border:1px solid var(--border);">Вы ещё не подавали заявок на мероприятия.</div>`}
    </div>

    <!-- Sidebar -->
    <div style="position:sticky;top:80px;" class="te-ev-sidebar">
      <div style="background:linear-gradient(135deg,var(--accent),#818cf8);border-radius:16px;padding:22px;color:#fff;margin-bottom:16px;">
        <div style="font-family:'Sora',sans-serif;font-size:16px;font-weight:800;margin-bottom:8px;">Публичная страница</div>
        <p style="font-size:13px;opacity:.85;line-height:1.6;margin-bottom:16px;">Одобренные мероприятия автоматически появляются на сайте центра.</p>
        <a href="events.html" target="_blank" style="display:block;background:rgba(255,255,255,.2);border-radius:10px;padding:11px;text-align:center;color:#fff;font-weight:700;font-size:13px;text-decoration:none;">Открыть страницу →</a>
      </div>
      <div style="background:#fff;border:1px solid var(--border);border-radius:16px;padding:20px;">
        <div style="font-family:'Sora',sans-serif;font-size:15px;font-weight:800;color:#111827;margin-bottom:14px;">Как это работает</div>
        ${[['1','Заполните форму','Название, тип, даты, описание'],['2','Заявка к администратору','Уведомление поступает автоматически'],['3','Рассмотрение','1–2 рабочих дня'],['4','Публикация','Мероприятие появляется на сайте']].map(([n,t,d])=>`
        <div style="display:flex;gap:10px;margin-bottom:12px;align-items:flex-start;">
          <div style="width:26px;height:26px;border-radius:50%;background:var(--accent-light);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">${n}</div>
          <div><div style="font-size:13px;font-weight:700;color:#111827;">${t}</div><div style="font-size:12px;color:var(--text-muted);margin-top:1px;">${d}</div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function teSubmit(){
  const title=document.getElementById('teTitle').value.trim();
  const desc=document.getElementById('teDesc').value.trim();
  if(!title||!desc){alert('Заполните обязательные поля: название и описание.');return;}
  const user=getCurrentUser();
  const req={
    id:'req_'+Date.now(),title,description:desc,
    type:document.getElementById('teType').value,
    format:document.getElementById('teFormat').value,
    dateStart:document.getElementById('teDateStart').value,
    dateEnd:document.getElementById('teDateEnd').value,
    location:document.getElementById('teLocation').value,
    seats:document.getElementById('teSeats').value,
    tags:document.getElementById('teTags').value,
    authorLogin:user?user.login:'',
    authorName:user?user.displayName:getName(),
    status:'pending',createdAt:new Date().toISOString(),
  };
  const reqs=getEventRequests();reqs.push(req);saveEventRequests(reqs);
  logActivity('event_request',`Заявка на мероприятие «${title}» отправлена`);
  alert('✓ Заявка отправлена! Следите за статусом в разделе «Мои заявки».');
  ['teTitle','teDateStart','teDateEnd','teLocation','teSeats','teDesc','teTags'].forEach(i=>document.getElementById(i).value='');
  renderTeacherEvents(document.getElementById('mainContent'));
}
