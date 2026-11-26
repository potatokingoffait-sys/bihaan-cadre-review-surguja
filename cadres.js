/**
 * Complete KPI, Section-E, and Consolidation Schemas for all 10 CGSRLM Surguja Cadres
 * Extracted directly from the official Surguja SRLM Monthly Review Formats
 */
const SURGUJA_BLOCKS = [
  "अंबिकापुर (Ambikapur)",
  "लखनपुर (Lakhanpur)",
  "उदयपुर (Udaipur)",
  "लुण्ड्रा (Lundra)",
  "बतौली (Batouli)",
  "सीतापुर (Sitapur)",
  "मैनपाट (Mainpat)",
  "अन्य / विशेष संकुल"
];

const CADRE_SCHEMAS = {
  PRP: {
    code: "PRP",
    titleHi: "पीआरपी (PRP) का मासिक कार्य प्रतिवेदन",
    titleEn: "Cluster Coordinator / PRP Monthly Progress Report",
    hierarchy: "CLF → BMMU → DMMU",
    hasScoring: false,
    unitLabel: "मासिक भौतिक लक्ष्य / उपलब्धि",
    sections: [
      {
        name: "मुख्य निष्पादन संकेतक (KPI Points - SOP आधार)",
        maxMarks: 0,
        kpis: [
          { id: 1, text: "संस्थागत विकास एवं बैठकें: संकुल अंतर्गत निर्धारित कुल ग्राम संगठनों (VOs) की नियमित मासिक बैठकों का आयोजन एवं समीक्षा ई सी के माध्यम से सुनिश्चित कराना", defaultTarget: "", evidence: "बैठक पंजी" },
          { id: 2, text: "सीएलएफ कार्यकारिणी समिति (EC) बैठक का नियमित एवं कोरम (1/3) सहित आयोजन (SOP अनुसार) सुनिश्चित कराना", defaultTarget: "01 बैठक", evidence: "प्रस्ताव पंजी" },
          { id: 3, text: "उप-समितियों की सक्रियता: सीएलएफ की उप-समितियों (निगरानी, सामाजिक, आजीविका आदि) की मासिक बैठक व समीक्षा कराना", defaultTarget: "मासिक", evidence: "उप-समिति मिनिट्स" },
          { id: 4, text: "विशेष व वंचित परिवारों का समावेशन: एससी/एसटी, अति-गरीब व छूटे परिवारों का नवीन समूह गठन/जुड़ाव सुनिश्चित कराना", defaultTarget: "", evidence: "सदस्यता पंजी" },
          { id: 5, text: "स्व-सहायता समूहों की 05 सूत्र अनुपालन निगरानी एवं 'ए' ग्रेडिंग में उन्नयन (कम से कम 80% 'ए' ग्रेड) सुनिश्चित कराना", defaultTarget: "", evidence: "ग्रेडिंग रजिस्टर" },
          { id: 6, text: "सामुदायिक निवेश निधि (CIF) एवं चक्रीय निधि (RF) वितरण: अनुमोदित एमसीपी (MCP) अनुसार पूंजी प्रदाय सुनिश्चित कराना", defaultTarget: "", evidence: "वितरण पंजी" },
          { id: 7, text: "ऋण वापसी एवं डीसीबी (DCB) अनुश्रवण: ग्राम संगठनों से सीएलएफ को निर्धारित मासिक किस्त व ब्याज की शत-प्रतिशत री-पेमेंट सुनिश्चित कराना", defaultTarget: "", evidence: "डीसीबी रजिस्टर" },
          { id: 8, text: "बैंक क्रेडिट लिंकेज (CCL): बैंक शाखाओं से समन्वय कर समूहों का क्रेडिट लिंकेज व नवीनीकरण प्रकरण तैयार/स्वीकृत कराना", defaultTarget: "", evidence: "बैंक स्वीकृति पत्र" },
          { id: 9, text: "आदर्श वित्तीय नियमावली: सीएलएफ में दोहरी लेखा प्रणाली, कैश लिमिट (अधिकतम 5000) एवं चेक संचालन अनुपालन कराना", defaultTarget: "अनिवार्य", evidence: "लेखा बही" },
          { id: 10, text: "आंतरिक एवं वैधानिक अंकेक्षण (Audit): समयबद्ध ऑडिट कराना एवं पाई गई त्रुटियों का निराकरण (SOP पृ. 56) कराना", defaultTarget: "", evidence: "ऑडिट प्रतिवेदन" },
          { id: 11, text: "सामुदायिक कैडर प्रबंधन: आरबीके, एफएलसीआरपी, उद्योग सखी, बैंक सखी आदि के कार्यों का पाक्षिक/मासिक मूल्यांकन व मानदेय प्रस्ताव कराना", defaultTarget: "मासिक", evidence: "कार्य मूल्यांकन पंजी" },
          { id: 12, text: "कैडर्स की क्षमता संवर्धन: प्रशिक्षण आवश्यकता पहचान (TNA) कर संकुल स्तर पर रिफ्रेशर प्रशिक्षण का आयोजन कराना", defaultTarget: "", evidence: "प्रशिक्षण पंजी" },
          { id: 13, text: "LokOS / MIS डेटा अद्यतनीकरण: कम्प्यूटर ऑपरेटर के माध्यम से प्रति माह 10 तारीख तक समस्त प्रोफाइल्स व ट्रांजैक्शन अपडेट कराना", defaultTarget: "10 तारीख तक", evidence: "MIS स्टेटस रिपोर्ट" },
          { id: 14, text: "सीएलएफ रिकॉर्ड सुरक्षा: आवक-जावक, स्थायी संपत्ति, स्टॉक, बिल-वाउचर व बैंक रिकंसिलिएशन अद्यतन संधारण कराना", defaultTarget: "नियमित", evidence: "सत्यापन टीप" },
          { id: 15, text: "आजीविका गतिविधियों का विस्तार: कृषि, पशुपालन व गैर-कृषि व्यक्तिगत/सामूहिक सूक्ष्म उद्यमों का संचालन व लिंकेज कराना", defaultTarget: "", evidence: "आजीविका रजिस्टर" },
          { id: 16, text: "युवा कौशल प्रशिक्षण नामांकन: DDU-GKY, R-SETI एवं लाइवलीहुड कॉलेज हेतु पात्र ग्रामीण युवाओं का चिन्हांकन व मोबिलाइजेशन कराना", defaultTarget: "", evidence: "नामांकन सूची" },
          { id: 17, text: "शासकीय योजनाओं से अभिसरण (Convergence): मनरेगा (VBG-RAM-G), स्वास्थ्य, पोषण, पेंशन, पीएम आवास आदि से वंचित परिवारों को जोड़ना", defaultTarget: "", evidence: "लाभान्वित सूची" },
          { id: 18, text: "वार्षिक आमसभा (GB): वित्तीय वर्ष समाप्ति के 3 माह भीतर वार्षिक आमसभा तैयारी व सफल क्रियान्वयन कराना", defaultTarget: "वार्षिक", evidence: "जीबी मिनिट्स" }
        ]
      }
    ],
    sectionEFields: [
      { key: "district_extra_task", label: "जिला कार्यालय द्वारा दिया गया अतिरिक्त कार्य का विवरण", type: "text" },
      { key: "janpad_extra_task", label: "जनपद कार्यालय द्वारा दिया गया अतिरिक्त कार्य का विवरण", type: "text" }
    ]
  },

  SVEP_CRP_EP: {
    code: "SVEP_CRP_EP",
    titleHi: "SVEP CRP-EP (Non-Farm Cadre) मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "Start-up Village Entrepreneurship Programme (Non-Farm)",
    hierarchy: "CLF → BMMU/BRC → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: संभावित उद्यमी पहचान, उद्यामिता प्रशिक्षण (EDP) एवं व्यवसाय योजना निर्माण",
        maxMarks: 30,
        kpis: [
          { id: 1, text: "SHG परिवारों में गैर-कृषि स्टार्ट-अप (विनिर्माण, व्यापार व सेवा क्षेत्र) हेतु उद्यमी चिन्हांकन", maxMarks: 10, evidence: "उद्यमी सर्वे पंजी" },
          { id: 2, text: "चिन्हित उद्यमियों को RSETI / BRC के माध्यम से उद्यामिता विकास प्रशिक्षण (EDP / Skill)", maxMarks: 10, evidence: "प्रशिक्षण प्रमाण पत्र" },
          { id: 3, text: "व्यवहार्य व्यवसाय योजना (Viable Business Plan) तैयार कर CLF/BRC में अनुमोदन हेतु प्रस्तुति", maxMarks: 10, evidence: "अनुमोदित बिजनेस प्लान" }
        ]
      },
      {
        name: "खंड-ब: उद्यम वित्त पोषण (CEF / बैंक लिंकेज), इकाई स्थापना एवं ऋण वसूली",
        maxMarks: 30,
        kpis: [
          { id: 4, text: "सामुदायिक उद्यम निधि (CEF) / CIF के माध्यम से स्वीकृत व्यवसाय योजना पर ऋण वितरण", maxMarks: 9, evidence: "CLF CEF वितरण पंजी" },
          { id: 5, text: "बैंक लिंकेज (मुद्रा ऋण, PMEGP, PMFME, स्टैंड-अप इंडिया) हेतु पत्रावली व ऋण स्वीकृति", maxMarks: 7, evidence: "बैंक स्वीकृति पत्र" },
          { id: 6, text: "नई गैर-कृषि स्टार्ट-अप इकाइयों की भौतिक स्थापना एवं मौजूदा उद्यमों का विस्तार (Scale-up)", maxMarks: 7, evidence: "भौतिक सत्यापन व फोटो" },
          { id: 7, text: "वितरित CEF / उद्यम ऋण की समय पर मासिक किश्त वसूली (100% Repayment) फॉलो-अप", maxMarks: 7, evidence: "CLF CEF वसूली पंजी" }
        ]
      },
      {
        name: "खंड-स: उद्यम बहीखाता, वैधानिक पंजीयन एवं बाजार लिंकेज (OSF Services)",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "उद्यमियों की दैनिक आय-व्यय पुस्तिका (Business Bookkeeping) व मासिक लाभ-हानि (P&L) लेखन", maxMarks: 9, evidence: "उद्यम रोकड़ बही/P&L" },
          { id: 9, text: "उद्यम पंजीयन (Udyam), FSSAI फूड लाइसेंस, GST या स्थानीय गुमाश्ता पंजीयन पूर्ण कराना", maxMarks: 8, evidence: "पंजीयन प्रमाण पत्र" },
          { id: 10, text: "पैकेजिंग-ब्रांडिंग सुधार व बिहान बाजार / स्थानीय हाट / संस्थागत खरीदारों से बाजार जुड़ाव", maxMarks: 8, evidence: "विक्रय व प्रदर्शनी पंजी" }
        ]
      },
      {
        name: "खंड-द: लखपति दीदी ट्रैकिंग, डिजिटल प्रविष्टि एवं संस्थागत अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "गैर-कृषि उद्यम से ₹1 लाख+ वार्षिक आय अर्जित करने वाली 'लखपति दीदी' उद्यमियों की ट्रैकिंग", maxMarks: 8, evidence: "लखपति दीदी प्रोफाइल" },
          { id: 12, text: "SVEP MIS / LokOS पोर्टल पर मासिक प्रविष्टि व CLF/VO समीक्षा बैठकों में उपस्थिति", maxMarks: 7, evidence: "MIS / CLF पंजी", defaultTarget: "2" }
        ]
      }
    ],
    sectionEFields: [
      { key: "active_enterprises", label: "कुल कार्यरत SVEP उद्यम", type: "number" },
      { key: "new_enterprises", label: "माह में स्थापित नए उद्यम", type: "number" },
      { key: "cef_disbursed", label: "कुल CEF ऋण वितरण (₹)", type: "number" },
      { key: "cef_repayment_pct", label: "CEF ऋण वसूली दर (%)", type: "number" },
      { key: "monthly_turnover", label: "उद्यमों का कुल मासिक टर्नओवर (₹)", type: "number" },
      { key: "lakhpati_didi_count", label: "लखपति दीदी उद्यमी संख्या", type: "number" }
    ]
  },

  RBK: {
    code: "RBK",
    titleHi: "रिसोर्स बुककीपर (Resource Bookkeeper - RBK) मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "Resource Bookkeeper (RBK) Monthly Review",
    hierarchy: "VO → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: संस्थागत बैठक एवं बही-खाता अद्यतनीकरण (Bookkeeping & Registers)",
        maxMarks: 30,
        kpis: [
          { id: 1, text: "आवंटित ग्राम संगठनों (VO) की मासिक बैठकों में उपस्थिति एवं कार्यवृत्त लेखन", maxMarks: 10, evidence: "VO बैठक पंजी" },
          { id: 2, text: "समस्त सक्रिय SHG की पंचसूत्र पुस्तिका व रोकड़ बही (Cashbook) अद्यतन", maxMarks: 10, evidence: "SHG रोकड़ बही" },
          { id: 3, text: "VO स्तर पर रोकड़ बही, सामान्य खाता बही (General Ledger) व स्टॉक पंजी पूर्ण", maxMarks: 10, evidence: "VO लेजर व क्लोजिंग" }
        ]
      },
      {
        name: "खंड-ब: वित्तीय लेनदेन, ऋण वसूली एवं बैंक लिंकेज प्रबंधन",
        maxMarks: 30,
        kpis: [
          { id: 4, text: "मासिक बचत एवं आंतरिक ऋण (Internal Lending) वसूली की लेखा प्रविष्टि", maxMarks: 8, evidence: "बचत-ऋण पुस्तिका" },
          { id: 5, text: "VO को प्राप्त RF / CIF / VRF निधि का उपयोग एवं 100% लेखांकन", maxMarks: 8, evidence: "CIF वाउचर व पासबुक" },
          { id: 6, text: "बैंक लिंकेज (CCL) स्वीकृत व नवीनीकरण हेतु पात्र SHG की फाइल व लेखा तैयारी", maxMarks: 7, evidence: "MCP व बैंक पत्रावली" },
          { id: 7, text: "अतिदेय ऋण (Overdue / NPA) वाले SHG/सदस्यों की सूची व फॉलो-अप लेखांकन", maxMarks: 7, evidence: "डिफॉल्टर ट्रैकिंग शीट" }
        ]
      },
      {
        name: "खंड-स: डिजिटल पोर्टल (LokOS) एवं मासिक वित्तीय समाधान (Reconciliation)",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "LokOS ऐप/पोर्टल पर SHG एवं VO के मासिक लेनदेन (Cut-off) की लाइव प्रविष्टि", maxMarks: 10, evidence: "LokOS डैशबोर्ड" },
          { id: 9, text: "नवीन सदस्यों/समूहों का प्रोफाइल एवं बैंक खाता सत्यापन (LokOS Sync)", maxMarks: 7, evidence: "LokOS अप्रूवल स्टेटस" },
          { id: 10, text: "माह के अंत में बैंक पासबुक शेष और रोकड़ बही शेष का मिलान (BRS)", maxMarks: 8, evidence: "बैंक समाधान विवरण" }
        ]
      },
      {
        name: "खंड-द: प्रशिक्षण, ऑडिट सहयोग एवं अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "नवगठित / कमजोर SHG के पदाधिकारियों (अध्यक्ष/सचिव/कोषाध्यक्ष) को बही लेखन प्रशिक्षण", maxMarks: 8, evidence: "प्रशिक्षण उपस्थिति" },
          { id: 12, text: "CLF की मासिक बैठक में समय पर उपस्थिति व पिछले माह की त्रुटियों का निराकरण", maxMarks: 7, evidence: "CLF कार्यवाही पंजी", defaultTarget: "1" }
        ]
      }
    ],
    sectionEFields: [
      { key: "total_savings", label: "कुल बचत राशि (माह अंत तक ₹)", type: "number" },
      { key: "total_cif_rf", label: "कुल CIF/RF प्राप्त राशि (₹)", type: "number" },
      { key: "monthly_loan_disbursed", label: "माह में कुल ऋण वितरण (₹)", type: "number" },
      { key: "monthly_loan_recovered", label: "माह में कुल ऋण वसूली (₹)", type: "number" },
      { key: "total_overdue", label: "कुल अतिदेय (Overdue) राशि (₹)", type: "number" },
      { key: "recovery_pct", label: "मांग के विरुद्ध वसूली (%)", type: "number" }
    ]
  },

  POSHAN_SAKHI: {
    code: "POSHAN_SAKHI",
    titleHi: "FNHW - पोषण सखी मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "Food, Nutrition, Health & WASH (Poshan Sakhi) Review",
    hierarchy: "VO → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: संस्थागत बैठकों में FNHW चर्चा एवं व्यवहार परिवर्तन (SBCC)",
        maxMarks: 30,
        kpis: [
          { id: 1, text: "आवंटित ग्राम संगठनों (VO) की मासिक बैठक व FNHW उप-समिति बैठक में सहभागिता", maxMarks: 10, evidence: "VO बैठक पंजी" },
          { id: 2, text: "समस्त SHG की साप्ताहिक/मासिक बैठक में दस्तक/PLA मॉड्यूल पर स्वास्थ्य-पोषण चर्चा", maxMarks: 10, evidence: "SHG कार्यवाही पंजी" },
          { id: 3, text: "ग्राम स्तर पर पोषण रैली, अन्नप्राशन, गोदभराई या स्वच्छता जागरूकता अभियान आयोजन", maxMarks: 10, evidence: "फोटो व उपस्थिति पंजी" }
        ]
      },
      {
        name: "खंड-ब: लक्षित परिवार गृह भेंट (Home Visit) एवं मातृ-शिशु स्वास्थ्य निगरानी",
        maxMarks: 30,
        kpis: [
          { id: 4, text: "गर्भवती महिलाओं (PW) के परिवारों में गृह भेंट (ANC जांच, IFA गोली व पोषण आहार सलाह)", maxMarks: 8, evidence: "गृह भेंट डायरी" },
          { id: 5, text: "धात्री माताओं एवं 0–2 वर्ष के बच्चों के परिवारों में गृह भेंट (स्तनपान व ऊपरी आहार)", maxMarks: 8, evidence: "गृह भेंट डायरी" },
          { id: 6, text: "चिन्हित अति-कुपोषित (SAM/MAM) बच्चों व एनीमिक किशोरियों/महिलाओं का विशेष फॉलो-अप", maxMarks: 7, evidence: "ट्रैकिंग रजिस्टर" },
          { id: 7, text: "ग्राम स्वास्थ्य, स्वच्छता एवं पोषण दिवस (VHSND) में SHG सदस्यों की उपस्थिति सुनिश्चित करना", maxMarks: 7, evidence: "AWW/ANM सत्यापन" }
        ]
      },
      {
        name: "खंड-स: पोषण संवेदनशील आजीविका (Agri-Nutri) एवं स्वच्छता (WASH)",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "SHG परिवारों में पोषण वाटिका (Nutri-Garden) की स्थापना एवं मौसमी साग-सब्जी उत्पादन", maxMarks: 10, evidence: "VO सर्वे व फोटो" },
          { id: 9, text: "बैकयार्ड पोल्ट्री / बकरीपालन / श्रीअन्न (Millets) व स्थानीय पौष्टिक आहार उपभोग प्रोत्साहन", maxMarks: 8, evidence: "SHG रिपोर्ट" },
          { id: 10, text: "SHG परिवारों में शौचालय उपयोग, हाथ धुलाई, स्वच्छ पेयजल व मासिक धर्म स्वच्छता (MHM)", maxMarks: 7, evidence: "WASH चेकलिस्ट" }
        ]
      },
      {
        name: "खंड-द: अंतर-विभागीय अभिसरण (Convergence), डिजिटल प्रविष्टि एवं अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "आंगनबाड़ी (ICDS), मितानिन (ASHA) व स्वास्थ्य केंद्र से समन्वय कर सरकारी योजनाओं का लाभ", maxMarks: 8, evidence: "अभिसरण सूची" },
          { id: 12, text: "LokOS / FNHW डिजिटल पोर्टल पर मासिक डेटा अपलोड एवं CLF समीक्षा बैठक में उपस्थिति", maxMarks: 7, evidence: "LokOS / CLF पंजी", defaultTarget: "1" }
        ]
      }
    ],
    sectionEFields: [
      { key: "pw_lm_total", label: "कुल गर्भवती व धात्री महिलाएं", type: "number" },
      { key: "sam_mam_count", label: "कुल चिन्हित SAM / MAM बच्चे", type: "number" },
      { key: "active_nutri_gardens", label: "सक्रिय पोषण वाटिका (कुल संख्या)", type: "number" },
      { key: "vhsnd_beneficiaries", label: "VHSND में लाभान्वित SHG सदस्य", type: "number" },
      { key: "vrf_health_loan", label: "VRF / स्वास्थ्य ऋण लाभार्थी", type: "number" },
      { key: "children_normalized", label: "सामान्य श्रेणी में आए बच्चे (माह में)", type: "number" }
    ]
  },

  PASHU_SAKHI: {
    code: "PASHU_SAKHI",
    titleHi: "पशु सखी (Pashu Sakhi) मासिक कार्य प्रगति प्रतिवेदन एवं VO समीक्षा",
    titleEn: "Pashu Sakhi (Livestock Cadre) Monthly Review",
    hierarchy: "Pashu Sakhi → VO → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: पशु स्वास्थ्य संरक्षण, टीकाकरण एवं प्राथमिक उपचार सेवाएं",
        maxMarks: 35,
        kpis: [
          { id: 1, text: "बकरी, कुक्कुट, सूकर व गोवंश का मौसमी टीकाकरण (PPR, FMD, रानीखेत आदि)", maxMarks: 12, evidence: "टीकाकरण पंजी व AVFO" },
          { id: 2, text: "पशुओं में नियमित कृमिनाशन (Deworming) एवं बाह्य परजीवी नियंत्रण (Tix/Mites)", maxMarks: 10, evidence: "सेवा रजिस्टर व रसीद" },
          { id: 3, text: "बीमार पशुओं का प्राथमिक उपचार (First Aid) एवं समय पर बधियाकरण (Castration)", maxMarks: 13, evidence: "केस डायरी व शुल्क पंजी" }
        ]
      },
      {
        name: "खंड-ब: उन्नत पशु प्रबंधन, पशु पोषण एवं आश्रय (Shed) सुधार",
        maxMarks: 25,
        kpis: [
          { id: 4, text: "SHG परिवारों में कम लागत के उन्नत बकरी/कुक्कुट आवास (Raised Shed / Night Shelter)", maxMarks: 8, evidence: "भौतिक सत्यापन व फोटो" },
          { id: 5, text: "संतुलित पशु आहार, मिनरल मिक्सचर, चारा वृक्षारोपण व अजोला उत्पादन प्रोत्साहन", maxMarks: 7, evidence: "SHG/VO रिपोर्ट" },
          { id: 6, text: "गर्भवती व नवजात मेमनों/चूजों की विशेष देखभाल कर पशु मृत्यु दर में कमी लाना", maxMarks: 5, evidence: "गृह भेंट डायरी" },
          { id: 7, text: "उन्नत नस्ल सुधार (प्रजनन हेतु उन्नत बकरा/चूजा उपलब्धता व कृत्रिम गर्भाधान सहयोग)", maxMarks: 5, evidence: "कृत्रिम गर्भाधान/प्रजनन अभिलेख" }
        ]
      },
      {
        name: "खंड-स: पशुपालन आजीविका संवर्धन, विपणन एवं पशु बीमा",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "नवीन SHG परिवारों को बकरीपालन / बैकयार्ड कुक्कुट / डेयरी से जोड़ना", maxMarks: 7, evidence: "आजीविका रजिस्टर" },
          { id: 13, text: "सूकरपालन (Piggery) गतिविधि में कितने नए लोग / परिवार जोड़े गए एवं इकाई विस्तार", maxMarks: 3, evidence: "सूकरपालन लाभार्थी पंजी" },
          { id: 9, text: "उत्पादक समूह (PG) / सामूहिक विपणन (बकरा/अंडा/दूध बिक्री) व वजन आधारित बिक्री", maxMarks: 8, evidence: "विक्रय एवं PG पंजी" },
          { id: 10, text: "पशुधन बीमा आच्छादन एवं CIF / बैंक ऋण से पशु क्रय हेतु पत्रावली तैयारी में सहयोग", maxMarks: 7, evidence: "बीमा पॉलिसी / MCP" }
        ]
      },
      {
        name: "खंड-द: संस्थागत सहभागिता, अभिसरण (Convergence) एवं अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "पशु चिकित्सा विभाग (पशु चिकित्सालय) से समन्वय कर पशु स्वास्थ्य शिविर में सहभागिता", maxMarks: 8, evidence: "पशु चिकित्सक प्रमाणन" },
          { id: 12, text: "SHG व VO की मासिक बैठकों में नियमित उपस्थिति एवं LokOS / आजीविका डेटा प्रविष्टि", maxMarks: 7, evidence: "VO कार्यवाही पंजी", defaultTarget: "2" }
        ]
      }
    ],
    sectionEFields: [
      { key: "livestock_families", label: "कुल पशुपालक SHG परिवार", type: "number" },
      { key: "vaccinated_animals", label: "माह में कुल टीकाकृत पशु/पक्षी", type: "number" },
      { key: "dewormed_animals", label: "माह में कुल कृमिनाशित पशु", type: "number" },
      { key: "improved_shed_families", label: "उन्नत शेड वाले कुल परिवार", type: "number" },
      { key: "animal_mortality", label: "माह में पशु मृत्यु संख्या", type: "number" },
      { key: "user_charge_income", label: "पशु सखी की यूजर चार्ज आय (₹)", type: "number" }
    ]
  },

  OSF_CRP: {
    code: "OSF_CRP",
    titleHi: "One-Stop Facility (OSF) CRP (Non-Farm) मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "One-Stop Facility (OSF-CRP) Business Support Cadre",
    hierarchy: "OSF-CRP → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: उद्यमी परामर्श (Business Counseling) एवं वैधानिक लाइसेंस/पंजीयन सेवाएं",
        maxMarks: 30,
        kpis: [
          { id: 1, text: "OSF केंद्र व फील्ड में गैर-कृषि (Non-Farm) उद्यमियों को व्यवसाय चयन व समस्या समाधान परामर्श", maxMarks: 10, evidence: "OSF विजिटर/परामर्श पंजी" },
          { id: 2, text: "उद्यम पंजीयन (Udyam), FSSAI फूड लाइसेंस, GST, पैन व गुमाश्ता पंजीयन ऑनलाइन पूर्ण कराना", maxMarks: 12, evidence: "पंजीयन प्रमाण पत्र" },
          { id: 3, text: "शासकीय योजनाओं (PMFME, PMEGP, मुद्रा ऋण, मुख्यमंत्री स्वरोजगार) हेतु ऑनलाइन आवेदन सहयोग", maxMarks: 8, evidence: "आवेदन पावती / पोर्टल" }
        ]
      },
      {
        name: "खंड-ब: व्यवसाय योजना (Business Plan / DPR) निर्माण एवं वित्त पोषण सहायता",
        maxMarks: 30,
        kpis: [
          { id: 4, text: "नए स्टार्ट-अप व विस्तारशील उद्यमों हेतु बैंक/CEF योग्य व्यवसाय योजना (DPR / Cashflow) तैयारी", maxMarks: 10, evidence: "DPR फाइल / OSF रिकॉर्ड" },
          { id: 5, text: "सामुदायिक उद्यम निधि (CEF) / CIF स्वीकृति एवं बैंक ऋण (Mudra / CCL) वितरण में समन्वय", maxMarks: 8, evidence: "स्वीकृति पत्र / CLF पंजी" },
          { id: 6, text: "कच्चा माल (Raw Material) व मशीनरी/उपकरण आपूर्तिकर्ताओं से सस्ते दर पर लिंकेज कराना", maxMarks: 6, evidence: "वेंडर लिंकेज रजिस्टर" },
          { id: 7, text: "वित्त पोषित उद्यमों का नियमित फॉलो-अप कर 100% मासिक ऋण किश्त वसूली सुनिश्चित करना", maxMarks: 6, evidence: "CLF ऋण वसूली पंजी" }
        ]
      },
      {
        name: "खंड-स: पैकेजिंग-ब्रांडिंग, अकाउंटिंग सहायता एवं डिजिटल/बाजार लिंकेज",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "उत्पाद की पैकेजिंग, लेबलिंग, बारकोड व गुणवत्ता सुधार हेतु डिज़ाइन/तकनीकी सेवा प्रदान करना", maxMarks: 9, evidence: "उत्पाद सैंपल / फोटो" },
          { id: 9, text: "उद्यमियों को दैनिक बहीखाता (Bookkeeping), लागत गणना व मासिक लाभ-हानि (P&L) तैयार कराना", maxMarks: 8, evidence: "उद्यम P&L विवरण" },
          { id: 10, text: "ई-कॉमर्स (ONDC / GeM / Amazon / Meesho) व बिहान बाजार/हाट से बिक्री लिंकेज कराना", maxMarks: 8, evidence: "विक्रय व ऑनबोर्डिंग पंजी" }
        ]
      },
      {
        name: "खंड-द: OSF सेवा शुल्क (User Fee) राजस्व सृजन, डिजिटल प्रविष्टि एवं अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "OSF की सशुल्क सेवाओं से निर्धारित सेवा शुल्क (User Fee) संग्रहण कर CLF/OSF खाते में जमा करना", maxMarks: 8, evidence: "रसीद बुक व बैंक पासबुक" },
          { id: 12, text: "OSF पोर्टल / LokOS पर मासिक डेटा अपलोड व CLF समीक्षा बैठक में समय पर उपस्थिति", maxMarks: 7, evidence: "पोर्टल / CLF पंजी", defaultTarget: "2" }
        ]
      }
    ],
    sectionEFields: [
      { key: "counseled_entrepreneurs", label: "कुल परामर्श प्राप्त उद्यमी", type: "number" },
      { key: "registrations_done", label: "कुल वैधानिक पंजीयन पूर्ण", type: "number" },
      { key: "dpr_prepared", label: "तैयार व्यवसाय योजना (DPR)", type: "number" },
      { key: "loan_sanctioned_amt", label: "कुल ऋण स्वीकृति राशि (₹)", type: "number" },
      { key: "market_linked", label: "ई-मार्केट/बाजार जुड़े उद्यम", type: "number" },
      { key: "user_fee_collected", label: "माह में संकलित यूजर फीस (₹)", type: "number" }
    ]
  },

  MED_CRP: {
    code: "MED_CRP",
    titleHi: "Micro Enterprise Development CRP (MED-CRP) मासिक प्रतिवेदन",
    titleEn: "MED-CRP (Non-Farm Micro Enterprise) Monthly Review",
    hierarchy: "MED-CRP → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: उद्यमी चिन्हांकन, उद्यामिता प्रशिक्षण (EDP) एवं व्यवसाय योजना निर्माण",
        maxMarks: 30,
        kpis: [
          { id: 1, text: "SHG परिवारों में गैर-कृषि सूक्ष्म उद्यम (विनिर्माण, प्रसंस्करण, व्यापार व सेवा) हेतु उद्यमी चयन", maxMarks: 10, evidence: "उद्यमी सर्वे पंजी" },
          { id: 2, text: "चिन्हित उद्यमियों को RSETI / संकुल स्तर पर उद्यामिता विकास व कौशल प्रशिक्षण (EDP) दिलाना", maxMarks: 10, evidence: "प्रशिक्षण प्रमाण पत्र" },
          { id: 3, text: "बाजार व्यवहार्यता (Feasibility) आधारित व्यवसाय योजना (Business Plan / DPR) तैयार करना", maxMarks: 10, evidence: "व्यवसाय योजना फाइल" }
        ]
      },
      {
        name: "खंड-ब: पूंजी निवेश (CEF / CIF / बैंक लिंकेज), इकाई स्थापना एवं वसूली",
        maxMarks: 30,
        kpis: [
          { id: 4, text: "सामुदायिक उद्यम निधि (CEF) / CIF के माध्यम से स्वीकृत व्यवसाय योजना पर ऋण वितरण", maxMarks: 9, evidence: "CLF CEF वितरण पंजी" },
          { id: 5, text: "बैंक लिंकेज (मुद्रा ऋण, PMEGP, PMFME, स्टैंड-अप इंडिया) हेतु पत्रावली व ऋण स्वीकृति", maxMarks: 7, evidence: "बैंक स्वीकृति पत्र" },
          { id: 6, text: "नई गैर-कृषि सूक्ष्म उद्यम इकाइयों की भौतिक स्थापना एवं मौजूदा उद्यमों का विस्तार (Scale-up)", maxMarks: 7, evidence: "भौतिक सत्यापन व फोटो" },
          { id: 7, text: "वितरित CEF / उद्यम ऋण की समय पर मासिक किश्त वसूली (100% Repayment) फॉलो-अप", maxMarks: 7, evidence: "CLF ऋण वसूली पंजी" }
        ]
      },
      {
        name: "खंड-स: उद्यम प्रबंधन, वैधानिक पंजीयन एवं बाजार लिंकेज (Market Linkage)",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "उद्यमियों की दैनिक आय-व्यय पुस्तिका (Bookkeeping), लागत निर्धारण व लाभ-हानि लेखन", maxMarks: 9, evidence: "उद्यम रोकड़ बही/P&L" },
          { id: 9, text: "उद्यम पंजीयन (Udyam), FSSAI फूड लाइसेंस, GST या स्थानीय गुमाश्ता पंजीयन पूर्ण कराना", maxMarks: 8, evidence: "पंजीयन प्रमाण पत्र" },
          { id: 10, text: "पैकेजिंग-ब्रांडिंग सुधार व बिहान बाजार / स्थानीय हाट / संस्थागत खरीदारों से बाजार जुड़ाव", maxMarks: 8, evidence: "विक्रय व प्रदर्शनी पंजी" }
        ]
      },
      {
        name: "खंड-द: लखपति दीदी ट्रैकिंग, डिजिटल प्रविष्टि एवं संस्थागत अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "गैर-कृषि उद्यम से ₹1 लाख+ वार्षिक आय अर्जित करने वाली 'लखपति दीदी' उद्यमियों की ट्रैकिंग", maxMarks: 8, evidence: "लखपति दीदी प्रोफाइल" },
          { id: 12, text: "LokOS / उद्यम पोर्टल पर मासिक डेटा अपलोड व CLF/VO समीक्षा बैठकों में उपस्थिति", maxMarks: 7, evidence: "LokOS / CLF पंजी", defaultTarget: "2" }
        ]
      }
    ],
    sectionEFields: [
      { key: "active_micro_ent", label: "कुल कार्यरत सूक्ष्म उद्यम", type: "number" },
      { key: "new_micro_ent", label: "माह में स्थापित नए उद्यम", type: "number" },
      { key: "cef_loan_disbursed", label: "कुल CEF/ऋण वितरण (₹)", type: "number" },
      { key: "registered_units", label: "Udyam/FSSAI पंजीकृत इकाई", type: "number" },
      { key: "monthly_turnover", label: "उद्यमों का कुल मासिक टर्नओवर (₹)", type: "number" },
      { key: "lakhpati_didi", label: "लखपति दीदी उद्यमी संख्या", type: "number" }
    ]
  },

  KRISHI_UDYOG_SAKHI: {
    code: "KRISHI_UDYOG_SAKHI",
    titleHi: "कृषि उद्योग सखी (Producer Group Cadre) मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "Krishi Udyog Sakhi (Producer Group) Monthly Review",
    hierarchy: "Krishi Udyog Sakhi → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: उत्पादक समूह (PG) गठन, शासन एवं पूंजी निर्माण",
        maxMarks: 25,
        kpis: [
          { id: 1, text: "आवंटित उत्पादक समूहों (PG) की मासिक कार्यकारिणी बैठक एवं वार्षिक कार्ययोजना समीक्षा", maxMarks: 9, evidence: "PG कार्यवाही पंजी" },
          { id: 2, text: "पात्र SHG उत्पादक दीदियों को PG से जोड़ना व शत-प्रतिशत सदस्यता व शेयर पूंजी संग्रहण", maxMarks: 8, evidence: "शेयर पूंजी रसीद/पंजी" },
          { id: 3, text: "PG को कार्यशील पूंजी (Working Capital / CIF / PG निधि) स्वीकृति एवं सदुपयोग सुनिश्चित करना", maxMarks: 8, evidence: "CLF निधि स्वीकृति पत्र" }
        ]
      },
      {
        name: "खंड-ब: सामूहिक आदान आपूर्ति (Input Aggregation) एवं मूल्य संवर्धन (Value Addition)",
        maxMarks: 30,
        kpis: [
          { id: 4, text: "PG सदस्यों हेतु गुणवत्तापूर्ण बीज, जैविक खाद, पैकेजिंग सामग्री व पशु आहार का सामूहिक क्रय", maxMarks: 8, evidence: "सामूहिक क्रय बिल/पंजी" },
          { id: 5, text: "उत्पाद की सफाई, छंटाई (Sorting), ग्रेडिंग, प्रसंस्करण एवं ब्रांडिंग-पैकेजिंग कार्य", maxMarks: 8, evidence: "प्रसंस्करण लॉगबुक" },
          { id: 6, text: "सामान्य सुविधा केंद्र (CFC / Collection Center) या प्रसंस्करण मशीनरी का नियमित संचालन", maxMarks: 7, evidence: "CFC संचालन पंजी" },
          { id: 7, text: "गुणवत्ता मानक (FSSAI / Agmark / जैविक प्रमाणीकरण) एवं उत्पादन लागत गणना में सहयोग", maxMarks: 7, evidence: "गुणवत्ता जांच रिकॉर्ड" }
        ]
      },
      {
        name: "खंड-स: सामूहिक विपणन (Collective Marketing), बाजार लिंकेज एवं FPO जुड़ाव",
        maxMarks: 30,
        kpis: [
          { id: 8, text: "PG के माध्यम से कृषि/उद्यानिकी/वनोपज/पशुधन उपज का एकत्रीकरण एवं सामूहिक बिक्री", maxMarks: 12, evidence: "विक्रय रजिस्टर व बिल" },
          { id: 9, text: "क्रेता-विक्रेता अनुबंध (Buy-back), स्थानीय मंडी, संस्थागत खरीदार व बिहान बाजार से जुड़ाव", maxMarks: 10, evidence: "खरीदार अनुबंध / रसीद" },
          { id: 10, text: "उत्पादक समूहों (PG) को किसान उत्पादक संगठन (FPO) से जोड़ना एवं सदस्यों को समय पर भुगतान", maxMarks: 8, evidence: "सदस्य भुगतान वाउचर" }
        ]
      },
      {
        name: "खंड-द: वित्तीय बहीखाता, डिजिटल प्रविष्टि (LokOS) एवं संस्थागत अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "PG स्तर पर रोकड़ बही, स्टॉक पंजी, विक्रय पंजी व सदस्य पासबुक का मासिक अद्यतनीकरण", maxMarks: 8, evidence: "PG लेजर व पासबुक" },
          { id: 12, text: "LokOS / PG पोर्टल पर मासिक कारोबार प्रविष्टि एवं CLF समीक्षा बैठक में समय पर उपस्थिति", maxMarks: 7, evidence: "LokOS / CLF पंजी", defaultTarget: "1" }
        ]
      }
    ],
    sectionEFields: [
      { key: "active_pg_members", label: "कुल सक्रिय PG सदस्य संख्या", type: "number" },
      { key: "share_capital_amt", label: "कुल शेयर पूंजी संकलन (₹)", type: "number" },
      { key: "collective_input_amt", label: "माह में सामूहिक आदान क्रय (₹)", type: "number" },
      { key: "collective_sale_qtl", label: "माह में सामूहिक उपज बिक्री (क्विं.)", type: "number" },
      { key: "sales_turnover_amt", label: "माह का कुल बिक्री टर्नओवर (₹)", type: "number" },
      { key: "pg_net_profit", label: "PG का शुद्ध लाभ / बचत (₹)", type: "number" }
    ]
  },

  KRISHI_SAKHI: {
    code: "KRISHI_SAKHI",
    titleHi: "कृषि सखी (Krishi Sakhi - Agro-Ecological) मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "Krishi Sakhi (Agro-Ecological Cadre) Monthly Review",
    hierarchy: "Krishi Sakhi → VO → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: उन्नत एवं प्राकृतिक खेती (Agro-Ecological Practices) विस्तार",
        maxMarks: 35,
        kpis: [
          { id: 1, text: "बीजोपचार (बीजामृत/जैविक), कतार बोनी, श्री-विधि (SRI) व अंतरवर्तीय फसल अपनाने वाले कृषक", maxMarks: 12, evidence: "फसल प्रदर्शन पंजी" },
          { id: 2, text: "प्राकृतिक व जैविक खेती (Non-Pesticide Management - NPM) अंतर्गत आच्छादित परिवार व रकबा", maxMarks: 12, evidence: "खेत सत्यापन व फोटो" },
          { id: 3, text: "नगदी फसल (सब्जी, दलहन, तिलहन, श्रीअन्न/रागी-कोदो व फलदार वृक्षारोपण) विस्तार", maxMarks: 8, evidence: "आजीविका रजिस्टर" },
          { id: 13, text: "मशरूम खेती (Mushroom Farming) इकाई स्थापना, स्पॉन/बैग उत्पादन एवं विपणन विस्तार", maxMarks: 3, evidence: "मशरूम उत्पादन पंजी व फोटो" }
        ]
      },
      {
        name: "खंड-ब: किसान पाठशाला (FFS), मृदा स्वास्थ्य एवं स्थानीय जैविक आदान निर्माण",
        maxMarks: 25,
        kpis: [
          { id: 4, text: "ग्राम स्तर पर किसान पाठशाला (Farmer Field School) / प्रदर्शन प्लॉट (CRP-AE) का आयोजन", maxMarks: 8, evidence: "FFS उपस्थिति पंजी" },
          { id: 5, text: "घरेलू जैविक खाद व कीटनाशक (केंचुआ खाद/वर्मीकम्पोस्ट, जीवामृत, नीमास्त्र, दशपर्णी) निर्माण", maxMarks: 7, evidence: "भौतिक निरीक्षण" },
          { id: 6, text: "मृदा स्वास्थ्य कार्ड (Soil Health Card) हेतु मिट्टी नमूना संग्रहण व संतुलित उर्वरक सलाह", maxMarks: 5, evidence: "कृषि विभाग रसीद" },
          { id: 7, text: "स्वदेशी/उन्नत बीज संरक्षण (Seed Bank) व सामुदायिक नर्सरी प्रबंधन में सहयोग", maxMarks: 5, evidence: "बीज पंजी / फोटो" }
        ]
      },
      {
        name: "खंड-स: उत्पादक समूह (PG), कस्टम हायरिंग सेंटर (CHC) एवं सामूहिक विपणन",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "कस्टम हायरिंग सेंटर (CHC) / टूल बैंक से आधुनिक कृषि यंत्र किराये पर उपलब्ध कराना", maxMarks: 8, evidence: "CHC लॉगबुक व रसीद" },
          { id: 9, text: "उत्पादक समूह (PG) / किसान उत्पादक संगठन (FPO) के माध्यम से उपज का सामूहिक विपणन", maxMarks: 9, evidence: "विक्रय व PG पंजी" },
          { id: 10, text: "कृषि आजीविका हेतु CIF / बैंक ऋण (KCC/CCL) पत्रावली व फसल बीमा आच्छादन", maxMarks: 8, evidence: "MCP / बीमा रसीद" }
        ]
      },
      {
        name: "खंड-द: संस्थागत सहभागिता, अंतर-विभागीय अभिसरण (Convergence) एवं अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "कृषि, उद्यानिकी विभाग व कृषि विज्ञान केंद्र (KVK) से समन्वय कर सरकारी योजनाओं का लाभ", maxMarks: 8, evidence: "अभिसरण सूची" },
          { id: 12, text: "SHG व VO की मासिक बैठकों में नियमित उपस्थिति एवं LokOS / आजीविका डेटा प्रविष्टि", maxMarks: 7, evidence: "VO कार्यवाही पंजी", defaultTarget: "2" }
        ]
      }
    ],
    sectionEFields: [
      { key: "farmer_shg_families", label: "कुल कृषक SHG परिवार", type: "number" },
      { key: "natural_farming_acres", label: "प्राकृतिक खेती रकबा (एकड़)", type: "number" },
      { key: "active_vermi_units", label: "सक्रिय वर्मी/जैविक इकाई", type: "number" },
      { key: "chc_machine_users", label: "CHC यंत्र उपयोगकर्ता कृषक", type: "number" },
      { key: "pg_collective_sale_qtl", label: "PG से सामूहिक बिक्री (क्विंटल)", type: "number" },
      { key: "crop_insurance_kcc", label: "फसल बीमा / KCC लाभार्थी", type: "number" }
    ]
  },

  IFC_CADRE: {
    code: "IFC_CADRE",
    titleHi: "Integrated Farming Cluster (IFC) कैडर मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "IFC Cadre (Multi-Enterprise Farming) Monthly Review",
    hierarchy: "IFC-CRP → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: एकीकृत कृषि प्रणाली (Multi-Enterprise Farming Model) विस्तार",
        maxMarks: 35,
        kpis: [
          { id: 1, text: "लक्षित SHG परिवारों को 2 या अधिक आजीविका घटकों (कृषि + उद्यानिकी + पशुपालन/मत्स्य) से जोड़ना", maxMarks: 13, evidence: "IFC लाभार्थी सर्वे पंजी" },
          { id: 2, text: "उन्नत फसल पद्धति (सब्जी, दलहन, तिलहन, श्रीअन्न, फलदार बगीचा) व प्राकृतिक खेती विस्तार", maxMarks: 11, evidence: "खेत सत्यापन व फोटो" },
          { id: 3, text: "पशुधन एवं मत्स्य घटक (बकरीपालन, बैकयार्ड कुक्कुट, सूकरपालन, डेयरी/मत्स्य) इकाई स्थापना", maxMarks: 11, evidence: "VO आजीविका रिपोर्ट" }
        ]
      },
      {
        name: "खंड-ब: आजीविका सेवा केंद्र (ASC), कस्टम हायरिंग सेंटर (CHC) एवं उत्पादक समूह (PG)",
        maxMarks: 25,
        kpis: [
          { id: 4, text: "आजीविका सेवा केंद्र (Agri-Nutri / Input Shop) से गुणवत्तापूर्ण बीज, जैविक खाद व आदान आपूर्ति", maxMarks: 7, evidence: "ASC विक्रय रजिस्टर" },
          { id: 5, text: "कस्टम हायरिंग सेंटर (CHC) के कृषि यंत्रों (रोटावेटर, स्प्रेयर, थ्रेशर आदि) का नियमित संचालन", maxMarks: 6, evidence: "CHC लॉगबुक व रसीद" },
          { id: 6, text: "उत्पादक समूह (PG) की मासिक बैठक, शेयर पूंजी संग्रहण एवं उपज का सामूहिक विपणन", maxMarks: 7, evidence: "PG कार्यवाही व बिक्री" },
          { id: 7, text: "ग्राम स्तर पर किसान पाठशाला (FFS) व डेमो प्लॉट के माध्यम से कृषक क्षमतावर्धन", maxMarks: 5, evidence: "FFS उपस्थिति पंजी" }
        ]
      },
      {
        name: "खंड-स: वित्तीय समावेशन, IFC निधि उपयोग एवं लखपति दीदी संवर्धन",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "IFC / CIF / VRF / बैंक ऋण (CCL/KCC) हेतु आजीविका निवेश योजना (LIP) व पत्रावली तैयारी", maxMarks: 9, evidence: "LIP व बैंक स्वीकृति" },
          { id: 9, text: "वितरित आजीविका ऋण की समय पर किश्त वसूली (100% Repayment) हेतु नियमित फॉलो-अप", maxMarks: 8, evidence: "VO/CLF ऋण पंजी" },
          { id: 10, text: "लखपति दीदी पहल अंतर्गत परिवारवार वार्षिक आय वृद्धि ट्रैकिंग (₹1 लाख+ लक्ष्य)", maxMarks: 8, evidence: "लखपति दीदी प्रोफाइल" }
        ]
      },
      {
        name: "खंड-द: अंतर-विभागीय अभिसरण (Convergence), डिजिटल प्रविष्टि एवं अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "मनरेगा (डबरी, भूमि सुधार, शेड), कृषि, उद्यानिकी व पशुपालन विभाग से अभिसरण स्वीकृति", maxMarks: 8, evidence: "अभिसरण पत्रावली" },
          { id: 12, text: "LokOS / आजीविका पोर्टल पर मासिक प्रविष्टि व CLF/VO समीक्षा बैठकों में नियमित उपस्थिति", maxMarks: 7, evidence: "LokOS / CLF पंजी", defaultTarget: "2" }
        ]
      }
    ],
    sectionEFields: [
      { key: "targeted_ifc_families", label: "कुल लक्षित IFC परिवार", type: "number" },
      { key: "two_plus_components", label: "2+ घटक अपनाने वाले परिवार", type: "number" },
      { key: "active_chc_asc", label: "सक्रिय CHC / ASC केंद्र", type: "number" },
      { key: "chc_asc_income", label: "माह में CHC/ASC आय (₹)", type: "number" },
      { key: "pg_collective_sales", label: "PG सामूहिक बिक्री (₹)", type: "number" },
      { key: "convergence_works", label: "अभिसरण से स्वीकृत कार्य", type: "number" }
    ]
  },

  GENDER_BRP: {
    code: "GENDER_BRP",
    titleHi: "जेंडर BRP (Gender Block Resource Person) मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "Gender BRP Monthly Progress & SAC Review",
    hierarchy: "Gender BRP → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: संस्थागत जेंडर संरचना (SAC / Gender Forum) एवं क्षमतावर्धन",
        maxMarks: 30,
        kpis: [
          { id: 1, text: "आवंटित ग्राम संगठनों (VO) की सामाजिक कार्य समिति (SAC) की मासिक बैठक व समीक्षा", maxMarks: 10, evidence: "VO SAC कार्यवाही पंजी" },
          { id: 2, text: "संकुल स्तरीय जेंडर फोरम (Gender Forum) की मासिक बैठक एवं जेंडर बिंदु सखी प्रशिक्षण", maxMarks: 10, evidence: "CLF जेंडर फोरम पंजी" },
          { id: 3, text: "SHG/ग्राम स्तर पर जेंडर संवेदनशीलता (नई चेतना / कुरीति उन्मूलन / बाल विवाह रोकथाम) अभियान", maxMarks: 10, evidence: "फोटो व उपस्थिति पंजी" }
        ]
      },
      {
        name: "खंड-ब: लैंगिक हिंसा निवारण (GBV Prevention), परामर्श एवं प्रकरण समाधान",
        maxMarks: 30,
        kpis: [
          { id: 4, text: "संकुल/VO में चिन्हित जेंडर हिंसा/प्रताड़ना प्रकरणों की पहचान एवं पंजीकरण (Case Registry)", maxMarks: 8, evidence: "गोपनीय केस रजिस्टर" },
          { id: 5, text: "सामुदायिक स्तर (VO SAC / जेंडर फोरम) पर परामर्श द्वारा निवारित प्रकरणों की संख्या", maxMarks: 8, evidence: "समाधान सहमति पत्र" },
          { id: 6, text: "गंभीर प्रकरणों का वन स्टॉप सेंटर (सखी केंद्र), महिला थाना, DLSA या चाइल्डलाइन को रेफरल", maxMarks: 7, evidence: "रेफरल पावती व फॉलो-अप" },
          { id: 7, text: "निवारित एवं रेफरल प्रकरणों के पीड़ितों का नियमित मासिक गृह भेंट फॉलो-अप व पुनर्वास", maxMarks: 7, evidence: "फॉलो-अप डायरी" }
        ]
      },
      {
        name: "खंड-स: महिला अधिकार, संपत्ति स्वामित्व एवं आर्थिक सशक्तिकरण",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "महिलाओं के नाम भूमि/आवास पट्टा (संयुक्त स्वामित्व) व वनाधिकार (FRA) दावा हेतु सहयोग", maxMarks: 9, evidence: "राजस्व/ग्राम सभा सूची" },
          { id: 9, text: "एकल महिला, परित्यक्ता, विधवा व दिव्यांग महिलाओं को SHG एवं लखपति दीदी पहल से जोड़ना", maxMarks: 8, evidence: "सामाजिक समावेशन सूची" },
          { id: 10, text: "संकुल क्षेत्र में जेंडर-आधारित उद्यम / कार्यस्थल सुरक्षा एवं महिला श्रम सहभागिता बढ़ावा", maxMarks: 8, evidence: "CLF आजीविका रिपोर्ट" }
        ]
      },
      {
        name: "खंड-द: अंतर-विभागीय अभिसरण (Convergence), डिजिटल प्रविष्टि एवं अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "महिला एवं बाल विकास, पुलिस, विधिक सेवा (DLSA) व पंचायत विभाग से अभिसरण लाभ", maxMarks: 8, evidence: "अभिसरण प्रमाणन" },
          { id: 12, text: "LokOS / जेंडर पोर्टल पर मासिक डेटा अपलोड एवं CLF समीक्षा बैठक में समय पर उपस्थिति", maxMarks: 7, evidence: "LokOS / CLF पंजी", defaultTarget: "1" }
        ]
      }
    ],
    sectionEFields: [
      { key: "active_vo_sac", label: "सक्रिय VO SAC की संख्या", type: "number" },
      { key: "cases_registered", label: "माह में दर्ज कुल जेंडर प्रकरण", type: "number" },
      { key: "cases_resolved_community", label: "समुदाय स्तर पर निवारित प्रकरण", type: "number" },
      { key: "cases_referred", label: "सखी केंद्र / पुलिस रेफरल प्रकरण", type: "number" },
      { key: "cases_pending", label: "लंबित (Pending) प्रकरण संख्या", type: "number" },
      { key: "scheme_beneficiaries", label: "शासकीय योजना लाभान्वित महिलाएं", type: "number" }
    ]
  },

  FLCRP: {
    code: "FLCRP",
    titleHi: "FLCRP (वित्तीय साक्षरता कैडर) मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "Financial Literacy CRP (FLCRP) Monthly Review",
    hierarchy: "FLCRP → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: वित्तीय साक्षरता प्रशिक्षण, घरेलू बजट एवं बचत आदत संवर्धन",
        maxMarks: 30,
        kpis: [
          { id: 1, text: "SHG व ग्राम स्तर पर वित्तीय साक्षरता (FL) प्रशिक्षण सत्र एवं घरेलू आय-व्यय बजट कार्यशाला", maxMarks: 12, evidence: "प्रशिक्षण उपस्थिति पंजी" },
          { id: 2, text: "छूटे हुए पात्र SHG सदस्यों व परिवारों के व्यक्तिगत बचत बैंक खाते (PMJDY) खुलवाना", maxMarks: 9, evidence: "खाता खोलने की सूची" },
          { id: 3, text: "अनौपचारिक/महंगे साहूकारी ऋण से मुक्ति हेतु समूह व बैंक ऋण के लाभ पर परामर्श अभियान", maxMarks: 9, evidence: "SHG कार्यवाही पंजी" }
        ]
      },
      {
        name: "खंड-ब: सामाजिक सुरक्षा बीमा (PMJJBY / PMSBY), अटल पेंशन (APY) एवं दावा निपटान",
        maxMarks: 30,
        kpis: [
          { id: 4, text: "प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY - ₹20) में पात्र सदस्यों व परिवारों का नया नामांकन", maxMarks: 8, evidence: "बीमा रसीद / बैंक सूची" },
          { id: 5, text: "प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY - ₹436) में पात्र सदस्यों का नया नामांकन", maxMarks: 8, evidence: "बीमा रसीद / बैंक सूची" },
          { id: 6, text: "अटल पेंशन योजना (APY) एवं सुकन्या समृद्धि योजना से पात्र परिवारों को जोड़ना", maxMarks: 7, evidence: "PRAN / पासबुक प्रति" },
          { id: 7, text: "मृत्यु/दुर्घटना होने पर लंबित बीमा दावों (Insurance Claim) का दस्तावेज तैयार कर निपटान कराना", maxMarks: 7, evidence: "क्लेम सेटलमेंट रिकॉर्ड" }
        ]
      },
      {
        name: "खंड-स: डिजिटल बैंकिंग साक्षरता, साइबर सुरक्षा एवं ऋण अनुशासन",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "डिजिटल लेनदेन (UPI, BHIM, AePS, BC सखी सेवा) उपयोग हेतु ग्रामीण महिलाओं को प्रशिक्षित करना", maxMarks: 9, evidence: "डिजिटल साक्षरता सूची" },
          { id: 9, text: "साइबर धोखाधड़ी (OTP/फर्जी कॉल) से बचाव जागरूकता एवं निष्क्रिय बैंक खातों का पुनः सक्रियण (KYC)", maxMarks: 8, evidence: "e-KYC / जागरूकता पंजी" },
          { id: 10, text: "बैंक लिंकेज (CCL) व CIF ऋण की समय पर किश्त वापसी एवं अच्छे क्रेडिट स्कोर (CIBIL) पर मार्गदर्शन", maxMarks: 8, evidence: "VO FI उप-समिति पंजी" }
        ]
      },
      {
        name: "खंड-द: डिजिटल डेटा प्रविष्टि (LokOS / FI पोर्टल) एवं संस्थागत अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "LokOS ऐप / FI ट्रैकर पर सदस्यों के बीमा व बैंक खाता विवरण की शत-प्रतिशत प्रविष्टि", maxMarks: 8, evidence: "LokOS डैशबोर्ड" },
          { id: 12, text: "CLF की मासिक समीक्षा बैठक व बैंक सखी समन्वय बैठक में समय पर उपस्थिति", maxMarks: 7, evidence: "CLF कार्यवाही पंजी", defaultTarget: "2" }
        ]
      }
    ],
    sectionEFields: [
      { key: "fl_beneficiaries", label: "कुल FL प्रशिक्षण लाभार्थी", type: "number" },
      { key: "new_pmsby", label: "माह में नए PMSBY नामांकन", type: "number" },
      { key: "new_pmjjby", label: "माह में नए PMJJBY नामांकन", type: "number" },
      { key: "new_apy", label: "माह में नए APY नामांकन", type: "number" },
      { key: "claims_settled", label: "निवारित बीमा दावे (Claims)", type: "number" },
      { key: "digital_enabled", label: "डिजिटल लेनदेन सक्षम सदस्य", type: "number" }
    ]
  },

  BANK_MITRA: {
    code: "BANK_MITRA",
    titleHi: "बैंक मित्र / बैंक सखी मासिक कार्य प्रगति प्रतिवेदन",
    titleEn: "Bank Mitra / Bank Sakhi (FI Cadre) Monthly Review",
    hierarchy: "Bank Mitra → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: बचत खाता खोलना, लेनदेन सहायता एवं बैंक शाखा समन्वय",
        maxMarks: 25,
        kpis: [
          { id: 1, text: "नवगठित एवं छूटे हुए SHG / VO / PG के बचत बैंक खाते खोलना व पासबुक उपलब्ध कराना", maxMarks: 9, evidence: "बैंक पासबुक प्रति" },
          { id: 2, text: "SHG सदस्यों को बैंक शाखा में जमा-निकासी वाउचर भरने, केवाईसी (KYC) व चेक क्लियरेंस सहयोग", maxMarks: 8, evidence: "बैंक मित्र सेवा पंजी" },
          { id: 3, text: "शाखा प्रबंधक एवं ग्राम संगठनों के मध्य मासिक बैंक-समूह समन्वय बैठक (CBRM) आयोजन", maxMarks: 8, evidence: "CBRM कार्यवाही पंजी" }
        ]
      },
      {
        name: "खंड-ब: बैंक लिंकेज (CCL - प्रथम/द्वितीय/तृतीय डोज) एवं उद्यम ऋण वितरण",
        maxMarks: 35,
        kpis: [
          { id: 4, text: "पात्र SHG की बैंक लिंकेज (CCL) व नवीनीकरण (Enhancement) पत्रावली तैयार कर बैंक में जमा करना", maxMarks: 10, evidence: "बैंक पावती रजिस्टर" },
          { id: 5, text: "बैंक शाखा से समन्वय कर जमा की गई CCL की स्वीकृति (Sanction) सुनिश्चित करना", maxMarks: 10, evidence: "स्वीकृति पत्र / पोर्टल" },
          { id: 6, text: "स्वीकृत CCL खातों से प्रथम निकासी (Disbursement) एवं कार्यशील पूंजी उपयोग सुनिश्चित करना", maxMarks: 8, evidence: "बैंक स्टेटमेंट / पासबुक" },
          { id: 7, text: "लखपति दीदी / उद्यमी सदस्यों को व्यक्तिगत उद्यम ऋण (मुद्रा / PMFME / KCC) दिलाने में सहयोग", maxMarks: 7, evidence: "व्यक्तिगत ऋण सूची" }
        ]
      },
      {
        name: "खंड-स: समय पर ऋण वापसी, अतिदेय (Overdue) वसूली एवं NPA नियंत्रण",
        maxMarks: 25,
        kpis: [
          { id: 8, text: "बैंक लिंकेज (CCL) प्राप्त समस्त सक्रिय SHG की मासिक ऋण किश्त जमा कराना (95%+ वसूली)", maxMarks: 10, evidence: "बैंक ऋण वसूली शीट" },
          { id: 9, text: "अतिदेय (Overdue) एवं संभावित NPA वाले SHG का ग्राम संगठन (VO) के साथ गृह भेंट फॉलो-अप", maxMarks: 8, evidence: "डिफॉल्टर ट्रैकिंग पंजी" },
          { id: 10, text: "NPA हो चुके समूह खातों का समझौता / नियमितीकरण (Upgradation) कर पुनः सक्रिय कराना", maxMarks: 7, evidence: "बैंक शाखा प्रमाणन" }
        ]
      },
      {
        name: "खंड-द: डिजिटल डेटा प्रविष्टि (LokOS / बैंक लिंकेज पोर्टल) एवं संस्थागत अनुपालन",
        maxMarks: 15,
        kpis: [
          { id: 11, text: "LokOS ऐप एवं NRLM बैंक लिंकेज पोर्टल पर नए खाते, स्वीकृति व वितरण की शत-प्रतिशत प्रविष्टि", maxMarks: 8, evidence: "LokOS / BL पोर्टल" },
          { id: 12, text: "CLF की मासिक समीक्षा बैठक व BMMU बैंकर्स बैठक में समय पर उपस्थिति", maxMarks: 7, evidence: "CLF कार्यवाही पंजी", defaultTarget: "2" }
        ]
      }
    ],
    sectionEFields: [
      { key: "new_savings_accounts", label: "माह में खुले नए बचत खाते", type: "number" },
      { key: "ccl_submitted", label: "माह में जमा CCL पत्रावली", type: "number" },
      { key: "ccl_sanctioned", label: "माह में स्वीकृत CCL संख्या", type: "number" },
      { key: "loan_disbursed_amt", label: "माह में कुल ऋण वितरण (₹)", type: "number" },
      { key: "bank_repayment_pct", label: "वर्तमान बैंक ऋण वापसी (%)", type: "number" },
      { key: "remaining_npa", label: "कुल शेष NPA खाता संख्या", type: "number" }
    ]
  },

  ACTIVE_WOMEN: {
    code: "ACTIVE_WOMEN",
    titleHi: "सक्रिय महिला (Active Women - AW) मासिक प्रतिवेदन एवं VO समीक्षा",
    titleEn: "Active Women (AW) Monthly Progress & VO Review",
    hierarchy: "Active Women → VO → CLF → BMMU → DMMU",
    hasScoring: true,
    sections: [
      {
        name: "खंड-अ: सामाजिक समावेशन (Social Inclusion), समूह गठन एवं पुनर्जीवन",
        maxMarks: 25,
        kpis: [
          { id: 1, text: "छूटे हुए पात्र गरीब परिवारों की पहचान कर नए SHG में जुड़ाव", maxMarks: 10, evidence: "सदस्य सूची" },
          { id: 2, text: "छूटे हुए पात्र जनजातीय (PVTG) परिवारों की पहचान कर नए SHG में जुड़ाव", maxMarks: 10, evidence: "PIP सदस्य सूची" },
          { id: 3, text: "नवीन SHG का गठन अथवा निष्क्रिय/कमजोर (Grade C/D) समूहों का पुनर्जीवन", maxMarks: 8, evidence: "समूह गठन प्रस्ताव" },
          { id: 4, text: "समस्त पात्र SHG को ग्राम संगठन (VO) की सदस्यता दिलाना व शेयर पूंजी जमा कराना", maxMarks: 7, evidence: "VO सदस्यता पंजी" }
        ]
      },
      {
        name: "खंड-ब: संस्थागत सुदृढ़ीकरण एवं पंचसूत्र अनुपालन (Institutional Strengthening)",
        maxMarks: 30,
        kpis: [
          { id: 5, text: "आवंटित SHG की साप्ताहिक/मासिक बैठकों में नियमित उपस्थिति एवं पंचसूत्र पालन", maxMarks: 10, evidence: "SHG बैठक पंजी" },
          { id: 6, text: "SHG की मूल पुस्तिकाओं (कार्यवाही, बचत, ऋण व रोकड़ बही) के लेखन में सहयोग", maxMarks: 8, evidence: "RBK / SHG पुस्तिका" },
          { id: 7, text: "समूह पदाधिकारियों (अध्यक्ष/सचिव/कोषाध्यक्ष) का क्षमतावर्धन व नेतृत्व बदलाव", maxMarks: 6, evidence: "प्रशिक्षण रिपोर्ट" },
          { id: 8, text: "ग्राम संगठन (VO) की मासिक कार्यकारिणी व उप-समिति बैठकों में सक्रिय भागीदारी", maxMarks: 6, evidence: "VO कार्यवाही पंजी", defaultTarget: "2" }
        ]
      },
      {
        name: "खंड-स: वित्तीय समावेशन, ऋण वसूली एवं डिजिटल प्रगति",
        maxMarks: 25,
        kpis: [
          { id: 9, text: "पात्र SHG के बैंक खाता खुलवाने, RF/CIF मांग पत्र (MCP) व बैंक लिंकेज (CCL) तैयारी", maxMarks: 9, evidence: "MCP व बैंक फाइल" },
          { id: 10, text: "CIF / VRF / CCL ऋण की समय पर किश्त वसूली (100% Repayment) हेतु फॉलो-अप", maxMarks: 9, evidence: "VO ऋण वसूली पंजी" },
          { id: 11, text: "LokOS ऐप पर समूह/सदस्य प्रोफाइल अद्यतन व बीमा (PMJJBY/PMSBY) आच्छादन", maxMarks: 7, evidence: "LokOS / बीमा रसीद" }
        ]
      },
      {
        name: "खंड-द: आजीविका संवर्धन, ग्राम सभा अभिसरण एवं अनुपालन",
        maxMarks: 20,
        kpis: [
          { id: 12, text: "लखपति दीदी पहल अंतर्गत SHG परिवारों को कृषि/पशुपालन/गैर-कृषि आजीविका से जोड़ना", maxMarks: 10, evidence: "आजीविका रजिस्टर" },
          { id: 13, text: "ग्राम सभा/मनरेगा/आवास/पेंशन योजना अभिसरण एवं समय पर VO को रिपोर्ट प्रस्तुति", maxMarks: 10, evidence: "अभिसरण व VO पंजी" }
        ]
      }
    ],
    sectionEFields: [
      { key: "active_shg_families", label: "कुल सक्रिय SHG परिवार", type: "number" },
      { key: "new_families_joined", label: "माह में जुड़े नए परिवार", type: "number" },
      { key: "panchsutra_shg_pct", label: "पंचसूत्र पालक SHG (%)", type: "number" },
      { key: "cif_ccl_recovery_pct", label: "CIF/CCL ऋण वसूली (%)", type: "number" },
      { key: "livelihood_families", label: "आजीविका से जुड़े परिवार", type: "number" },
      { key: "insured_members", label: "बीमा आच्छादित सदस्य", type: "number" }
    ]
  }
};
