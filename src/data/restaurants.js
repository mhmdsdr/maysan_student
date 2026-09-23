const restaurants = [
  {
    id: '1',
    name: 'مطعم السلطان',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: '25-35',
    deliveryFee: 1500,
    minOrder: 10000,
    open: true,
    tags: ['مشاوي', 'عراقي', 'أسرة'],
    category: 'مشاوي',
    menu: [
      {
        category: 'مشاوي',
        items: [
          { id: 'r1i1', name: 'تكة دجاج', description: 'تكة دجاج طازجة متبلة مع مخلل وخبز', price: 12000, image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400' },
          { id: 'r1i2', name: 'دجاج مشوي كامل', description: 'دجاج مشوي على الفحم مع أرز وسلطة', price: 18000, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400' },
          { id: 'r1i3', name: 'كباب لحم', description: 'كباب لحم طازج مشوي مع خبز ومخلل', price: 15000, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },
          { id: 'r1i4', name: 'تكة لحم', description: 'تكة لحم خروف مشوية على الفحم', price: 16000, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400' },
        ],
      },
      {
        category: 'مقبلات',
        items: [
          { id: 'r1i5', name: 'حمص بالطحينة', description: 'حمص كريمي مع زيت زيتون ونعناع', price: 4000, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' },
          { id: 'r1i6', name: 'سلطة عراقية', description: 'سلطة طازجة بالخضار الموسمية', price: 3500, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
        ],
      },
      {
        category: 'مشروبات',
        items: [
          { id: 'r1i7', name: 'عصير رمان', description: 'عصير رمان طبيعي طازج', price: 3000, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
          { id: 'r1i8', name: 'مياه معدنية', description: 'مياه معدنية 500 مل', price: 500, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'حلويات الشرق',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    rating: 4.9,
    reviewCount: 521,
    deliveryTime: '20-30',
    deliveryFee: 1000,
    minOrder: 5000,
    open: true,
    tags: ['حلويات', 'كيك', 'حلو عربي'],
    category: 'حلويات',
    menu: [
      {
        category: 'حلويات شرقية',
        items: [
          { id: 'r2i1', name: 'كنافة نابلسية', description: 'كنافة بالجبنة العكاوية وقطر', price: 8000, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' },
          { id: 'r2i2', name: 'بقلاوة مشكلة', description: 'صينية بقلاوة مشكلة بالمكسرات والعسل', price: 15000, image: 'https://images.unsplash.com/photo-1571167530149-c1105da4c2b8?w=400' },
          { id: 'r2i3', name: 'أم علي', description: 'حلى أم علي بالكريمة والمكسرات', price: 6000, image: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=400' },
        ],
      },
      {
        category: 'كيك وتورتات',
        items: [
          { id: 'r2i4', name: 'كيك شوكولاتة', description: 'كيك شوكولاتة داكنة بالكريمة الفرنسية', price: 12000, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
          { id: 'r2i5', name: 'تارت فراولة', description: 'تارت بالكريمة والفراولة الطازجة', price: 9000, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
          { id: 'r2i6', name: 'كيك تيراميسو', description: 'كيك تيراميسو إيطالي أصيل', price: 11000, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'برغر ميسان',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    rating: 4.6,
    reviewCount: 198,
    deliveryTime: '20-30',
    deliveryFee: 1000,
    minOrder: 7000,
    open: true,
    tags: ['برغر', 'وجبات سريعة', 'دجاج'],
    category: 'برغر',
    menu: [
      {
        category: 'برغر',
        items: [
          { id: 'r3i1', name: 'برغر كلاسيك', description: 'برغر لحم بقري مع جبنة وخضار طازجة', price: 8000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
          { id: 'r3i2', name: 'دبل برغر', description: 'برغر مزدوج مع صوص خاص البيت', price: 12000, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400' },
          { id: 'r3i3', name: 'برغر دجاج كريسبي', description: 'دجاج مقرمش محمر مع مايونيز وخس', price: 9000, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400' },
        ],
      },
      {
        category: 'وجبات',
        items: [
          { id: 'r3i4', name: 'وجبة برغر + بطاطا', description: 'برغر كلاسيك مع بطاطا مقلية ومشروب', price: 12000, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
          { id: 'r3i5', name: 'بطاطا مقلية', description: 'بطاطا مقلية مقرمشة مع صوص', price: 3000, image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'مطعم الدجيلة',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    rating: 4.7,
    reviewCount: 275,
    deliveryTime: '30-45',
    deliveryFee: 2000,
    minOrder: 15000,
    open: true,
    tags: ['أسماك', 'مأكولات بحرية', 'مسكوف'],
    category: 'أسماك',
    menu: [
      {
        category: 'أسماك مشوية',
        items: [
          { id: 'r4i1', name: 'سمكة مسكوف', description: 'سمكة مسكوف بالنار مع الطماطم والبصل', price: 25000, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
          { id: 'r4i2', name: 'سمك مشوي كامل', description: 'سمك طازج مشوي مع الخضار والليمون', price: 20000, image: 'https://images.unsplash.com/photo-1555982260-28a0f8e44d49?w=400' },
          { id: 'r4i3', name: 'روبيان مقلي', description: 'روبيان خليجي طازج مقلي مع صوص ليمون', price: 22000, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400' },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'بيتزا ميسان',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    rating: 4.5,
    reviewCount: 142,
    deliveryTime: '25-35',
    deliveryFee: 1500,
    minOrder: 8000,
    open: false,
    tags: ['بيتزا', 'إيطالي', 'عائلي'],
    category: 'بيتزا',
    menu: [
      {
        category: 'بيتزا',
        items: [
          { id: 'r5i1', name: 'بيتزا مارغريتا', description: 'صوص طماطم وجبنة موزاريلا وريحان طازج', price: 10000, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
          { id: 'r5i2', name: 'بيتزا دجاج', description: 'دجاج متبل وفلفل ملون وجبنة شيدر', price: 14000, image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400' },
          { id: 'r5i3', name: 'بيتزا مكس', description: 'لحم مفروم ودجاج وخضار مشكلة', price: 16000, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
          { id: 'r5i4', name: 'بيتزا خضار', description: 'مشروم وفلفل ملون وأوليف وجبنة', price: 12000, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400' },
        ],
      },
    ],
  },
  {
    id: '6',
    name: 'مقهى ميسان',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    rating: 4.7,
    reviewCount: 389,
    deliveryTime: '15-25',
    deliveryFee: 1000,
    minOrder: 5000,
    open: true,
    tags: ['قهوة', 'مشروبات', 'كافيه'],
    category: 'مشروبات',
    menu: [
      {
        category: 'قهوة وشاي',
        items: [
          { id: 'r6i1', name: 'قهوة عربية', description: 'قهوة عربية أصيلة بالهيل والزعفران', price: 2000, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400' },
          { id: 'r6i2', name: 'كابتشينو', description: 'كابتشينو إيطالي بالحليب المبخر', price: 3500, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
          { id: 'r6i3', name: 'لاتيه', description: 'لاتيه بالحليب الكامل الدسم', price: 3500, image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400' },
          { id: 'r6i4', name: 'شاي كرك', description: 'شاي كرك إماراتي بالحليب والبهارات', price: 2500, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400' },
        ],
      },
      {
        category: 'عصائر وموهيتو',
        items: [
          { id: 'r6i5', name: 'موهيتو ليمون', description: 'موهيتو بالليمون الطازج والنعناع والصودا', price: 4000, image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400' },
          { id: 'r6i6', name: 'عصير فراولة', description: 'عصير فراولة طازج بالحليب وأيس كريم', price: 4500, image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400' },
          { id: 'r6i7', name: 'عصير مانغو', description: 'عصير مانغو طبيعي بارد', price: 4000, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
        ],
      },
    ],
  },
]

export default restaurants
