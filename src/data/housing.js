export const studentHousings = [
  {
    id: 'H-201',
    title: 'شقق النخبة الفندقية للطلاب',
    type: 'شقة طلابية مفروشة بالكامل',
    targetGender: 'طلاب (شباب)',
    location: 'حي المعلمين - قرب مجمع الكليات الطبية (300 متر مشياً)',
    priceMonthly: 125000,
    priceNote: 'للشخص الواحد شامل الخدمات',
    roomsCount: 3,
    bathroomsCount: 2,
    currentResidents: 4,
    maxResidents: 6,
    availableSpots: 2,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'
    ],
    features: [
      'مولدة سحب 24 ساعة (تكييف مستمر)',
      'إنترنت فايبر ضوئي فائق السرعة',
      'غسالة أتوماتيك + ثلاجة ومجمدة',
      'طباخ ومطبخ مؤثث بالكامل',
      'مكتب دراسة مستقل لكل طالب'
    ],
    ownerName: 'أبو أحمد العقاري',
    ownerPhone: '07809988776',
    verified: true,
    rating: 4.9,
    distanceToCampus: '5 دقائق مشياً للطب وطب الأسنان'
  },
  {
    id: 'H-202',
    title: 'سكن الزهراء الجامعي للطالبات (موثق وآمن)',
    type: 'قسم داخلي أهلي راقي',
    targetGender: 'طالبات فقط',
    location: 'شارع دجلة - الماجدية (قريب من جامعة ميسان)',
    priceMonthly: 140000,
    priceNote: 'شامل كافة الخدمات وكهرباء مستمرة',
    roomsCount: 6,
    bathroomsCount: 4,
    currentResidents: 10,
    maxResidents: 14,
    availableSpots: 4,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'
    ],
    features: [
      'مشرفة سكن وحارسة متواجدة على مدار الساعة',
      'كاميرات مراقبة خارجية وحماية أمنية',
      'كهرباء خط ذهبي + مولدة تلقائية',
      'صالات مذاكرة هادئة ومكيفة',
      'خدمة تنظيف أسبوعية للمرافق العامة'
    ],
    ownerName: 'إدارة سكن الزهراء (أم كرار)',
    ownerPhone: '07712244668',
    verified: true,
    rating: 5.0,
    distanceToCampus: 'توصيل باص خاص للكلية يومياً'
  },
  {
    id: 'H-203',
    title: 'ملحق طلابي هادئ قرب موقع 110',
    type: 'غرفة استوديو مستقلة لـ شخصين',
    targetGender: 'طلاب (شباب)',
    location: 'حي الحسين القديم - مجاور بوابة موقع 110',
    priceMonthly: 90000,
    priceNote: 'للشخص الواحد مع عداد كهرباء مستقل',
    roomsCount: 1,
    bathroomsCount: 1,
    currentResidents: 1,
    maxResidents: 2,
    availableSpots: 1,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600'
    ],
    features: [
      'مكيف سبليت طن ونصف',
      'قريب جداً من كليات الهندسة والعلوم والقانون',
      'هدوء تام مناسب جداً لطلبة المراحل المنتهية',
      'سخان ماء وغسالة عادية'
    ],
    ownerName: 'سعد التميمي',
    ownerPhone: '07833322110',
    verified: true,
    rating: 4.6,
    distanceToCampus: '200 متر عن بوابة الهندسة'
  }
];

export const roommateRequests = [
  {
    id: 'RM-1',
    studentName: 'مرتضى سلام',
    college: 'كلية الهندسة (قسم النفط - مرحلة ثالثة)',
    fromDistrict: 'المجر الكبير',
    budgetMonthly: '100,000 د.ع',
    desiredLocation: 'حي المعلمين أو قرب موقع 110',
    habits: ['غير مدخن', 'أدرس ليلاً بهدوء', 'ألتزم بنظافة المكان'],
    lookingFor: 'طالب أو طالبين من كلية الهندسة أو العلوم لتشارك شقة',
    phone: '07801456789'
  },
  {
    id: 'RM-2',
    studentName: 'زينب عادل',
    college: 'كلية الصيدلة (مرحلة رابعة)',
    fromDistrict: 'علي الغربي',
    budgetMonthly: '130,000 د.ع',
    desiredLocation: 'حي المعلمين قرب الكليات الطبية',
    habits: ['غير مدخنة', 'ساعات دراسة طويلة', 'أبحث عن سكن طالبات ملتزم'],
    lookingFor: 'طالبة من المجموعة الطبية للمشاركة في غرفة ثنائية',
    phone: '07709876543'
  }
];
