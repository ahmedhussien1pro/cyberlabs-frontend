export default {
  landingData: {
    title: {
      en: "Broken Access Control",
      ar: "ثغرات التحكم في الوصول (Access Control)",
    },
    description: {
      en: "Learn how authorization failures allow users to access data or perform actions outside their intended permissions. Master IDOR, horizontal/vertical privilege escalation, and insecure API endpoints.",
      ar: "تعلم كيف تؤدي إخفاقات التفويض إلى السماح للمستخدمين بالوصول لبيانات أو تنفيذ إجراءات خارج صلاحياتهم. أتقن ثغرات IDOR، وتصعيد الصلاحيات الأفقي والرأسي، ونقاط اتصال API غير الآمنة.",
    },
    difficulty: { en: "Intermediate", ar: "متوسط" },
    duration: { en: "45 min", ar: "45 دقيقة" },
    instructor: "CyberLab",
    rating: "4.9",
    students: "3400",
    labsLink: "/AC-Vuln/AC_Vuln_labs",
  },

  topics: [
    {
      id: "intro",
      title: {
        en: "introduction to Access Control",
        ar: " التعرف على التحكم في الوصول",
      },
      elements: [
        {
          type: "title",
          value: {
            en: "What is Access Control?",
            ar: "ما هو التحكم في الوصول؟",
          },
        },
        {
          type: "text",
          value: {
            en: "Access control is a security mechanism used to control which users or systems are allowed to access a particular resource or system. Access control is implemented in computer systems to ensure that only authorized users have access to resources, such as files, directories, databases, and web pages. The primary goal of access control is to protect sensitive data and ensure that it is only accessible to those who are authorized to access it.",
            ar: "التحكم في الوصول هو آلية أمنية تُستخدم للتحكم في المستخدمين أو الأنظمة المسموح لها بالوصول إلى مورد أو نظام معين. يتم تنفيذ التحكم في الوصول في أنظمة الكمبيوتر لضمان وصول المستخدمين المصرح لهم فقط إلى الموارد، مثل الملفات والأدلة وقواعد البيانات وصفحات الويب. الهدف الأساسي من التحكم في الوصول هو حماية البيانات الحساسة وضمان عدم إمكانية الوصول إليها إلا لمن صرح لهم.",
          },
        },
        { type: "image", srcKey: "IntroImage", size: "small" },
        { type: "hr" },
        {
          type: "text",
          value: {
            en: "Access control can be implemented in different ways, depending on the type of resource being protected and the security requirements of the system. Some common access control mechanisms include:",
            ar: "يمكن تنفيذ التحكم في الوصول بطرق مختلفة، اعتماداً على نوع المورد الذي يتم حمايته والمتطلبات الأمنية للنظام. تشمل بعض آليات التحكم في الوصول الشائعة ما يلي:",
          },
        },
        {
          type: "title",
          value: {
            en: "Types of Access Control",
            ar: "أنواع التحكم في الوصول",
          },
        },
        {
          type: "orderedList",
          items: [
            {
              subtitle: {
                en: "Discretionary Access Control (DAC):",
                ar: "التحكم الاختياري في الوصول (DAC):",
              },
              text: {
                en: "DAC allows resource owners to define who can access their data. It provides flexibility but can lead to security risks if permissions are misconfigured.",
                ar: "يسمح DAC لأصحاب الموارد بتحديد من يمكنه الوصول إلى بياناتهم. يوفر المرونة ولكنه قد يؤدي إلى مخاطر أمنية إذا تم تكوين الأذونات بشكل خاطئ.",
              },
              example: {
                en: "Example: A system where a user (owner) grants file access to others, similar to a homeowner giving keys to specific guests.",
                ar: "مثال: نظام يمنح فيه المستخدم (المالك) حق الوصول إلى الملفات للآخرين، على غرار صاحب المنزل الذي يعطي المفاتيح لضيوف محددين.",
              },
            },
            {
              subtitle: {
                en: "Mandatory Access Control (MAC):",
                ar: "التحكم الإجباري في الوصول (MAC):",
              },
              text: {
                en: "MAC enforces strict security policies predefined by the system, restricting access based on security classifications.",
                ar: "يفرض MAC سياسات أمنية صارمة محددة مسبقاً بواسطة النظام، مما يقيد الوصول بناءً على التصنيفات الأمنية.",
              },
              example: {
                en: "Example: A government network where access to classified documents is determined by security clearance levels.",
                ar: "مثال: شبكة حكومية حيث يتم تحديد الوصول إلى المستندات السرية من خلال مستويات التصريح الأمني.",
              },
            },
            {
              subtitle: {
                en: "Role-Based Access Control (RBAC):",
                ar: "التحكم القائم على الأدوار (RBAC):",
              },
              text: {
                en: "RBAC assigns permissions based on a user's role within an organization, ensuring least privilege access.",
                ar: "يعين RBAC الأذونات بناءً على دور المستخدم داخل المؤسسة، مما يضمن وصول أقل الامتيازات.",
              },
              example: {
                en: "Example: In a corporate system, managers can approve expenses while employees can only submit them.",
                ar: "مثال: في نظام الشركة، يمكن للمديرين الموافقة على النفقات بينما يمكن للموظفين تقديمها فقط.",
              },
            },
            {
              subtitle: {
                en: "Attribute-Based Access Control (ABAC):",
                ar: "التحكم القائم على السمات (ABAC):",
              },
              text: {
                en: "ABAC evaluates attributes such as user roles, device type, time of access, and location to determine access permissions.",
                ar: "يقيم ABAC السمات مثل أدوار المستخدم ونوع الجهاز ووقت الوصول والموقع لتحديد أذونات الوصول.",
              },
              example: {
                en: "Example: A cloud service restricting admin logins to office hours and corporate devices only.",
                ar: "مثال: خدمة سحابية تقيد تسجيل دخول المسؤول بساعات العمل وأجهزة الشركة فقط.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "topic1",
      title: {
        en: "Discretionary Access Control (DAC)",
        ar: " التحكم الاختياري في الوصول (DAC)",
      },
      elements: [
        {
          type: "subtitle",
          value: {
            en: "Discretionary Access Control (DAC):",
            ar: "التحكم الاختياري في الوصول (DAC):",
          },
        },
        {
          type: "text",
          value: {
            en: "In this type of access control, the resource owner or administrator determines who is allowed to access a resource and what actions they are allowed to perform. DAC is commonly used in operating systems and file systems. In layman's terms, imagine a castle where the king can give keys to his advisors, allowing them to open any doors they like, whenever they want. That's DAC for you. It's the liberty to control access to your own resources. The one in charge, like the king of the castle, can hand out permissions to whomever they please, dictating who can come in and out.",
            ar: "في هذا النوع من التحكم في الوصول، يحدد مالك المورد أو المسؤول من يسمح له بالوصول إلى مورد وما هي الإجراءات المسموح بها. يستخدم DAC بشكل شائع في أنظمة التشغيل وأنظمة الملفات. ببساطة، تخيل قلعة حيث يمكن للملك إعطاء المفاتيح لمستشاريه، مما يسمح لهم بفتح أي أبواب يريدونها، وقتما يشاءون. هذا هو DAC. إنها حرية التحكم في الوصول إلى مواردك الخاصة. المسؤول، مثل ملك القلعة، يمكنه توزيع الأذونات على من يشاء، ويحدد من يمكنه الدخول والخروج.",
          },
        },
        { type: "image", srcKey: "DacImage", size: "small" },
        { type: "hr" },
      ],
    },
    {
      id: "topic2",
      title: {
        en: "Mandatory Access Control (MAC)",
        ar: " التحكم الإجباري في الوصول (MAC)",
      },
      elements: [
        {
          type: "subtitle",
          value: {
            en: "Mandatory Access Control (MAC):",
            ar: "التحكم الإجباري في الوصول (MAC):",
          },
        },
        {
          type: "text",
          value: {
            en: "In this type of access control, access to resources is determined by a set of predefined rules or policies that are enforced by the system. MAC is commonly used in highly secure environments, such as government and military systems. In layman's terms, picture a fort with an iron-clad security protocol. Only specific individuals with particular security clearances can access certain areas, and this is non-negotiable. The high commander sets the rules, and they are rigorously followed. That's how MAC works. It's like the stern security officer who allows no exceptions to the rule.",
            ar: "في هذا النوع من التحكم في الوصول، يتم تحديد الوصول إلى الموارد من خلال مجموعة من القواعد أو السياسات المحددة مسبقاً التي يفرضها النظام. يستخدم MAC بشكل شائع في البيئات عالية الأمان، مثل الأنظمة الحكومية والعسكرية. ببساطة، تخيل حصناً ببروتوكول أمني حديدي. يمكن فقط لأفراد محددين ذوي تصاريح أمنية معينة الوصول إلى مناطق معينة، وهذا غير قابل للتفاوض. القائد الأعلى يضع القواعد، ويتم اتباعها بصرامة. هكذا يعمل MAC. إنه مثل ضابط الأمن الصارم الذي لا يسمح بأي استثناءات للقاعدة.",
          },
        },
        { type: "image", srcKey: "MacImage", size: "small" },
        { type: "hr" },
      ],
    },
    {
      id: "topic3",
      title: {
        en: "Role-Based Access Control (RBAC)",
        ar: " التحكم القائم على الأدوار (RBAC)",
      },
      elements: [
        {
          type: "subtitle",
          value: {
            en: "Role-Based Access Control (RBAC):",
            ar: "التحكم القائم على الأدوار (RBAC):",
          },
        },
        {
          type: "text",
          value: {
            en: "In this type of access control, users are assigned roles that define their level of access to resources. RBAC is commonly used in enterprise systems, where users have different levels of authority based on their job responsibilities. In layman's terms, imagine a modern corporation. You have your managers, your executives, your sales staff, etc. They each have different access to the building. Some can enter the boardroom, others can access the sales floor, and so on. That's the essence of RBAC - assigning access based on a person's role within an organization.",
            ar: "في هذا النوع من التحكم في الوصول، يتم تعيين أدوار للمستخدمين تحدد مستوى وصولهم إلى الموارد. يستخدم RBAC بشكل شائع في أنظمة المؤسسات، حيث يتمتع المستخدمون بمستويات مختلفة من السلطة بناءً على مسؤولياتهم الوظيفية. ببساطة، تخيل شركة حديثة. لديك المديرون والتنفيذيون وموظفو المبيعات وما إلى ذلك. كل منهم لديه وصول مختلف إلى المبنى. البعض يمكنه دخول قاعة الاجتماعات، والآخرون يمكنهم الوصول إلى صالة المبيعات، وهكذا. هذا هو جوهر RBAC - تعيين الوصول بناءً على دور الشخص داخل المؤسسة.",
          },
        },
        { type: "image", srcKey: "RbacImage", size: "medium" },
        { type: "hr" },
      ],
    },
    {
      id: "topic4",
      title: {
        en: "Attribute-Based Access Control (ABAC)",
        ar: "  التحكم القائم على السمات (ABAC)",
      },
      elements: [
        {
          type: "subtitle",
          value: {
            en: "Attribute-Based Access Control (ABAC):",
            ar: "التحكم القائم على السمات (ABAC):",
          },
        },
        {
          type: "text",
          value: {
            en: "In this type of access control, access to resources is determined by a set of attributes, such as user role, time of day, location, and device. ABAC is commonly used in cloud environments and web applications. In layman's terms, think of a highly advanced sci-fi security system that scans individuals for certain attributes. Maybe it checks whether they're from a particular planet, whether they're carrying a specific device, or if they're trying to access a resource at a specific time. That's ABAC. It's like the smart, flexible security of the future.",
            ar: "في هذا النوع من التحكم في الوصول، يتم تحديد الوصول إلى الموارد من خلال مجموعة من السمات، مثل دور المستخدم ووقت اليوم والموقع والجهاز. يستخدم ABAC بشكل شائع في البيئات السحابية وتطبيقات الويب. ببساطة، فكر في نظام أمني متقدم للغاية من الخيال العلمي يفحص الأفراد بحثاً عن سمات معينة. ربما يتحقق مما إذا كانوا من كوكب معين، أو ما إذا كانوا يحملون جهازاً معيناً، أو إذا كانوا يحاولون الوصول إلى مورد في وقت محدد. هذا هو ABAC. إنه مثل الأمن الذكي والمرن للمستقبل.",
          },
        },
        { type: "image", srcKey: "AbacImage", size: "medium" },
        { type: "hr" },
        {
          type: "text",
          value: {
            en: "Implementing access control can help prevent security breaches and unauthorized access to sensitive data. However, access control is not foolproof and can be vulnerable to various types of attacks, such as privilege escalation and broken access control vulnerabilities. Therefore, it is important to regularly review and test access control mechanisms to ensure that they are working as intended.",
            ar: "يمكن أن يساعد تنفيذ التحكم في الوصول في منع الانتهاكات الأمنية والوصول غير المصرح به إلى البيانات الحساسة. ومع ذلك، فإن التحكم في الوصول ليس معصوماً من الخطأ ويمكن أن يكون عرضة لأنواع مختلفة من الهجمات، مثل تصعيد الامتيازات وثغرات التحكم في الوصول المكسورة. لذلك، من المهم مراجعة واختبار آليات التحكم في الوصول بانتظام للتأكد من أنها تعمل كما هو مقصود.",
          },
        },
      ],
    },
    {
      id: "topic5",
      title: {
        en: "Access control vulnerabilities and privilege escalation",
        ar: " ثغرات التحكم في الوصول وتصعيد الصلاحيات",
      },
      elements: [
        {
          type: "title",
          value: {
            en: "In this section, we describe:",
            ar: "في هذا القسم، نصف:",
          },
        },
        {
          type: "list",
          items: {
            en: [
              "Privilege escalation.",
              "The types of vulnerabilities that can arise with access control.",
              "How to prevent access control vulnerabilities.",
            ],
            ar: [
              "تصعيد الصلاحيات.",
              "أنواع الثغرات التي يمكن أن تنشأ مع التحكم في الوصول.",
              "كيفية منع ثغرات التحكم في الوصول.",
            ],
          },
        },
        {
          type: "note",
          isLab: true,
          value: {
            en: "Labs If you're familiar with the basic concepts behind access control vulnerabilities and want to practice exploiting them on some realistic, deliberately vulnerable targets, you can access labs in this topic from this link",
            ar: "المعامل: إذا كنت على دراية بالمفاهيم الأساسية وراء ثغرات التحكم في الوصول وتريد ممارسة استغلالها على بعض الأهداف الواقعية الضعيفة عمداً، يمكنك الوصول إلى المعامل في هذا الموضوع من هذا الرابط",
          },
          link: "/AC-Vuln/AC_Vuln_labs",
        },
        {
          type: "title",
          value: {
            en: "What is access control?",
            ar: "ما هو التحكم في الوصول؟",
          },
        },
        {
          type: "text",
          value: {
            en: "Access control is the application of constraints on who or what is authorized to perform actions or access resources. In the context of web applications, access control is dependent on authentication and session management:",
            ar: "التحكم في الوصول هو تطبيق القيود على من أو ما هو مصرح له بأداء إجراءات أو الوصول إلى الموارد. في سياق تطبيقات الويب، يعتمد التحكم في الوصول على المصادقة وإدارة الجلسة:",
          },
        },
        {
          type: "list",
          items: {
            en: [
              "Authentication confirms that the user is who they say they are.",
              "Session management identifies which subsequent HTTP requests are being made by that same user.",
              "Access control determines whether the user is allowed to carry out the action that they are attempting to perform.",
            ],
            ar: [
              "تؤكد المصادقة أن المستخدم هو من يقول إنه هو.",
              "تحدد إدارة الجلسة طلبات HTTP اللاحقة التي يقوم بها نفس المستخدم.",
              "يحدد التحكم في الوصول ما إذا كان المستخدم مسموحاً له بتنفيذ الإجراء الذي يحاول القيام به.",
            ],
          },
        },
        {
          type: "text",
          value: {
            en: "Broken access controls are common and often present a critical security vulnerability. Design and management of access controls is a complex and dynamic problem that applies business, organizational, and legal constraints to a technical implementation. Access control design decisions have to be made by humans so the potential for errors is high.",
            ar: "عناصر التحكم في الوصول المكسورة شائعة وغالباً ما تمثل ثغرة أمنية خطيرة. يعد تصميم وإدارة عناصر التحكم في الوصول مشكلة معقدة وديناميكية تطبق قيود الأعمال والتنظيمية والقانونية على التنفيذ الفني. يجب اتخاذ قرارات تصميم التحكم في الوصول من قبل البشر لذا فإن احتمالية الخطأ عالية.",
          },
        },
        {
          type: "note",
          value: {
            en: "You can Read more from this link",
            ar: "يمكنك قراءة المزيد من هذا الرابط",
          },
          link: "https://portswigger.net/web-security/access-control/security-models",
        },
        { type: "image", srcKey: "ACVImage", size: "medium" },
        { type: "hr" },
      ],
    },
    {
      id: "topic6",
      title: {
        en: "Broken Access Control",
        ar: "كسر التحكم في الوصول",
      },
      elements: [
        {
          type: "title",
          value: {
            en: "Broken Access Control:",
            ar: "كسر التحكم في الوصول:",
          },
        },
        {
          type: "text",
          value: {
            en: "Broken access control vulnerabilities refer to situations where access control mechanisms fail to enforce proper restrictions on user access to resources or data. Here are some common exploits for broken access control and examples:",
            ar: "تشير ثغرات كسر التحكم في الوصول إلى الحالات التي تفشل فيها آليات التحكم في الوصول في فرض قيود مناسبة على وصول المستخدم إلى الموارد أو البيانات. فيما يلي بعض الاستغلالات الشائعة لكسر التحكم في الوصول وأمثلة:",
          },
        },
        {
          type: "orderedList",
          items: [
            {
              subtitle: {
                en: "Horizontal privilege escalation:",
                ar: "تصعيد الصلاحيات الأفقي:",
              },
              text: {
                en: "occurs when an attacker can access resources or data belonging to other users with the same level of access. For example, a user might be able to access another user's account by changing the user ID in the URL.",
                ar: "يحدث عندما يتمكن المهاجم من الوصول إلى الموارد أو البيانات التي تنتمي لمستخدمين آخرين بنفس مستوى الوصول. على سبيل المثال، قد يتمكن المستخدم من الوصول إلى حساب مستخدم آخر عن طريق تغيير معرف المستخدم في الرابط.",
              },
            },
            {
              subtitle: {
                en: "Vertical privilege escalation:",
                ar: "تصعيد الصلاحيات الرأسي:",
              },
              text: {
                en: "occurs when an attacker can access resources or data belonging to users with higher access levels. For example, a regular user can access administrative functions by manipulating a hidden form field or URL parameter.",
                ar: "يحدث عندما يتمكن المهاجم من الوصول إلى الموارد أو البيانات التي تنتمي لمستخدمين ذوي مستويات وصول أعلى. على سبيل المثال، يمكن للمستخدم العادي الوصول إلى الوظائف الإدارية عن طريق التلاعب بحقل نموذج مخفي أو معلمة URL.",
              },
              image: { srcKey: "BrokenAccImage", size: "small" },
            },
            {
              subtitle: {
                en: "Insufficient access control checks",
                ar: "فحوصات التحكم في الوصول غير الكافية",
              },
              text: {
                en: "occur when access control checks are not performed correctly or consistently, allowing an attacker to bypass them. For example, an application might allow users to view sensitive data without verifying their proper permissions.",
                ar: "تحدث عندما لا يتم إجراء فحوصات التحكم في الوصول بشكل صحيح أو متسق، مما يسمح للمهاجم بتجاوزها. على سبيل المثال، قد يسمح التطبيق للمستخدمين بعرض البيانات الحساسة دون التحقق من أذوناتهم المناسبة.",
              },
            },
            {
              subtitle: {
                en: "Insecure direct object references",
                ar: "مرجع الكائن المباشر غير الآمن",
              },
              text: {
                en: "occur when an attacker can access a resource or data by exploiting a weakness in the application's access control mechanisms. For example, an application might use predictable or easily guessable identifiers for sensitive data, making it easier for an attacker to access. You may refer to this room in Topic #4 to learn more about this.",
                ar: "يحدث عندما يتمكن المهاجم من الوصول إلى مورد أو بيانات من خلال استغلال ضعف في آليات التحكم في الوصول للتطبيق. على سبيل المثال، قد يستخدم التطبيق معرفات متوقعة أو سهلة التخمين للبيانات الحساسة، مما يسهل على المهاجم الوصول. يمكنك الرجوع إلى هذا الموضوع في الموضوع رقم 4 لمعرفة المزيد حول هذا.",
              },
              image: { srcKey: "IdorImage", size: "medium" },
            },
          ],
        },
        { type: "hr" },
        {
          type: "text",
          value: {
            en: "These exploits can be prevented by implementing strong access control mechanisms and regularly reviewing and testing them to ensure they are functioning as intended.",
            ar: "يمكن منع هذه الاستغلالات من خلال تنفيذ آليات قوية للتحكم في الوصول ومراجعتها واختبارها بانتظام لضمان عملها كما هو مقصود.",
          },
        },
      ],
    },
    {
      id: "topic7",
      title: {
        en: "Examples of broken access controls",
        ar: "أمثلة على كسر التحكم في الوصول",
      },
      elements: [
        {
          type: "text",
          value: {
            en: "Broken access control vulnerabilities exist when a user can access resources or perform actions that they are not supposed to be able to.",
            ar: "توجد ثغرات كسر التحكم في الوصول عندما يتمكن المستخدم من الوصول إلى الموارد أو تنفيذ إجراءات لا يفترض أن يتمكن من القيام بها.",
          },
        },
        {
          type: "title",
          value: {
            en: "Vertical privilege escalation",
            ar: "تصعيد الصلاحيات الرأسي",
          },
        },
        {
          type: "text",
          value: {
            en: "If a user can gain access to functionality that they are not permitted to access then this is vertical privilege escalation. For example, if a non-administrative user can gain access to an admin page where they can delete user accounts, then this is vertical privilege escalation.",
            ar: "إذا تمكن المستخدم من الوصول إلى وظائف غير مسموح له بالوصول إليها، فهذا تصعيد رأسي للصلاحيات. على سبيل المثال، إذا تمكن مستخدم غير إداري من الوصول إلى صفحة المسؤول حيث يمكنه حذف حسابات المستخدمين، فهذا تصعيد رأسي للصلاحيات.",
          },
        },
        {
          type: "title",
          value: {
            en: "Unprotected functionality",
            ar: "الوظائف غير المحمية",
          },
        },
        {
          type: "text",
          value: {
            en: "At its most basic, vertical privilege escalation arises where an application does not enforce any protection for sensitive functionality. For example, administrative functions might be linked from an administrator's welcome page but not from a user's welcome page. However, a user might be able to access the administrative functions by browsing to the relevant admin URL.",
            ar: "في أبسط صوره، ينشأ تصعيد الصلاحيات الرأسي عندما لا يفرض التطبيق أي حماية للوظائف الحساسة. على سبيل المثال، قد يتم ربط الوظائف الإدارية من صفحة ترحيب المسؤول ولكن ليس من صفحة ترحيب المستخدم. ومع ذلك، قد يتمكن المستخدم من الوصول إلى الوظائف الإدارية عن طريق الانتقال إلى رابط المسؤول ذي الصلة.",
          },
        },
        {
          type: "text",
          value: {
            en: "For example, a website might host sensitive functionality at the following URL:",
            ar: "على سبيل المثال، قد يستضيف موقع ويب وظائف حساسة على الرابط التالي:",
          },
        },
        {
          type: "terminal",
          value: "https://insecure-website.com/admin",
          label: { en: "Sensitive URL", ar: "رابط حساس" },
        },
        {
          type: "text",
          value: {
            en: "This might be accessible by any user, not only administrative users who have a link to the functionality in their user interface. In some cases, the administrative URL might be disclosed in other locations, such as the robots.txt file:",
            ar: "قد يكون هذا متاحاً لأي مستخدم، وليس فقط للمستخدمين الإداريين الذين لديهم رابط للوظيفة في واجهة المستخدم الخاصة بهم. في بعض الحالات، قد يتم الكشف عن رابط المسؤول في مواقع أخرى، مثل ملف robots.txt:",
          },
        },
        {
          type: "terminal",
          value: "https://insecure-website.com/robots.txt",
          label: { en: "Robots File", ar: "ملف الروبوتات" },
        },
        {
          type: "text",
          value: {
            en: "Even if the URL isn't disclosed anywhere, an attacker may be able to use a wordlist to brute-force the location of the sensitive functionality.",
            ar: "حتى لو لم يتم الكشف عن الرابط في أي مكان، فقد يتمكن المهاجم من استخدام قائمة كلمات لفرض الموقع الخاص بالوظيفة الحساسة بالقوة.",
          },
        },
      ],
    },
  ],
};
