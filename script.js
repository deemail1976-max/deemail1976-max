/**
 * Project: Superadmin Dashboard Full Implementation
 * Role: Gemini Code Assist
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Local Storage Data Management ---
    const STORAGE_KEY = 'nvc_property_entries';

    // Data सुरक्षित गर्ने फङ्सन
    window.savePropertyEntry = (data) => {
        const entries = window.getStoredEntries();
        const newEntry = {
            id: Date.now(),
            entryDate: new Date().toISOString(),
            ...data
        };
        entries.push(newEntry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        // Stats र Charts तुरुन्तै अपडेट गर्न
        updateDashboardStats();
        updateCharts();
        return newEntry;
    };

    // Data तान्ने फङ्सन
    window.getStoredEntries = () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    };

    // 1. Comprehensive Nepal Data for Filters
    window.nepalData = {
        MINISTRIES: [
            "प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय", "अर्थ मन्त्रालय", "उद्योग, वाणिज्य तथा आपूर्ति मन्त्रालय",
            "ऊर्जा, जलस्रोत तथा सिंचाइ मन्त्रालय", "कानून, न्याय तथा संसदीय मामिला मन्त्रालय", "कृषि तथा पशुपन्छी विकास मन्त्रालय",
            "खानेपानी मन्त्रालय", "गृह मन्त्रालय", "परराष्ट्र मन्त्रालय", "भूमि व्यवस्था, सहकारी तथा गरिबी निवारण मन्त्रालय",
            "भौतिक पूर्वाधार तथा यातायात मन्त्रालय", "महिला, बालबालिका तथा ज्येष्ठ नागरिक मन्त्रालय", "युवा तथा खेलकुद मन्त्रालय",
            "रक्षा मन्त्रालय", "वन तथा वातावरण मन्त्रालय", "सङ्घीय मामिला तथा सामान्य प्रशासन मन्त्रालय", "सञ्चार तथा सूचना प्रविधि मन्त्रालय",
            "सहरी विकास मन्त्रालय", "स्वास्थ्य तथा जनसङ्ख्या मन्त्रालय", "संस्कृति, पर्यटन तथा नागरिक उड्डयन मन्त्रालय",
            "शिक्षा, विज्ञान तथा प्रविधि मन्त्रालय", "श्रम, रोजगार तथा सामाजिक सुरक्षा मन्त्रालय", "संवैधानिक अङ्ग"
        ],
        PROVINCE: {
            1: 'कोशी प्रदेश', 2: 'मधेस प्रदेश', 3: 'बागमती प्रदेश', 4: 'गण्डकी प्रदेश',
            5: 'लुम्बिनी प्रदेश', 6: 'कर्णाली प्रदेश', 7: 'सुदूर पश्चिम प्रदेश'
        },
        DISTRICTS: {
            1: ['ताप्लेजुङ', 'पाँचथर', 'इलाम', 'झापा', 'मोरङ', 'सुनसरी', 'धनकुटा', 'तेह्रथुम', 'संखुवासभा', 'भोजपुर', 'सोलुखुम्बु', 'ओखलढुंगा', 'खोटाङ', 'उदयपुर'],
            2: ['सप्तरी', 'सिराहा', 'धनुषा', 'महोत्तरी', 'सर्लाही', 'रौतहट', 'बारा', 'पर्सा'],
            3: ['सिन्धुली', 'रामेछाप', 'दोलखा', 'सिन्धुपाल्चोक', 'काभ्रेपलाञ्चोक', 'ललितपुर', 'भक्तपुर', 'काठमाडौं', 'नुवाकोट', 'रसुवा', 'धादिङ', 'चितवन', 'मकवानपुर'],
            4: ['गोरखा', 'लमजुङ', 'तनहुँ', 'कास्की', 'मनाङ', 'मुस्ताङ', 'पर्वत', 'स्याङ्जा', 'म्याग्दी', 'बाग्लुङ', 'नवलपुर'],
            5: ['नवलपरासी (बर्दघाट सुस्ता पश्चिम)', 'रुपन्देही', 'कपिलवस्तु', 'पाल्पा', 'अर्घाखाँची', 'गुल्मी', 'रोल्पा', 'प्युठान', 'दाङ', 'बाँके', 'बर्दिया', 'पूर्वी रुकुम'],
            6: ['पश्चिम रुकुम', 'सल्यान', 'सुर्खेत', 'दैलेख', 'जाजरकोट', 'डोल्पा', 'हुम्ला', 'जुम्ला', 'कालिकोट', 'मुगु'],
            7: ['बाजुरा', 'बझाङ', 'डोटी', 'अछाम', 'दार्चुला', 'बैतडी', 'डडेल्धुरा', 'कञ्चनपुर', 'कैलाली']
        },
        MUNICIPALITIES: {
            1: {
                "भोजपुर": ["आमचोक","अरुण","भोजपुर","हतुवागढी","पौवाडुङ्मा","रामप्रसाद","सालपसिलिछो","षडानन्द","टेम्केमाइयुङ"],
                "धनकुटा": ["चौबिसे","छथर जोरपाटी","धनकुटा","महालक्ष्मी","पाखरिबास","साँगुरीगढी","शहिदभूमि"],
                "इलाम": ["चुलाचुली","देउमाई","फाकफोक्थुम","इलाम","माई","माइजोगमाई","मङ्गेबुङ","रोङ","सन्दकपुर","सूर्योदय"],
                "झापा": ["अर्जुनधारा","बाह्रदशी","भद्रपुर","बिर्तामोड","बुद्धशान्ति","दमक","गौराधा","गौरीगञ्ज","हल्दिबारी","झापा","कचनकवल","कमल","कनकाई","मेचीनगर","शिवसताक्सी"],
                "खोटाङ": ["ऐसेलुखर्क","बराहापोखरी","दिक्तेल रुपाकोट मझुवागढी","डिप्रुङ","हलेसी तुवाचुङ","जानतेढुङ्गा","केपिलासगढी","खोटेहाङ","रवा बेसी","साकेला"],
                "मोरङ": ["बेलबारी","विराटनगर","बुढीगंगा","धनपालथान","ग्रामथान","जहादा","कानेपोखरी","कटहरी","केराबारी","लेटाङ","मिक्लाजुङ","पथरी शनिश्चरे","रंगेली","रतुवामाई","सुन्दरहरैचा","सुनवर्शी","उरालाबारी"],
                "ओखलढुङ्गा": ["चम्पादेवी","चिसंखुगढी","खिजिदेम्बा","लिखु","मानेभञ्ज्याङ","मोलुङ","सिद्धिचरण","सुनकोशी"],
                "पाँचथर": ["फालेलुङ","फाल्गुनन्द","हिलिहाङ","कुमायक","मिक्लाजुङ","फिदिम","तुम्बेवा","याङ्गवारक"],
                "संखुवासभा": ["भोटखोला","चैनपुर","चिचिला","धर्मदेवी","खाँदबारी","माडी","मकालु","पञ्चखापन","सभापोखरी","सिलिचङ"],
                "सोलुखुम्बु": ["खुम्बुपसङ्लाहमु","लिखुपिके","माप्या दुधकोशी","महाकुलुङ","नेचासल्यान","सोलुदुधाकुण्ड","सोटाङ","थुलुङ दुधकोशी"],
                "तेह्रथुम": ["आठराई","छथर","लालीगुराँस","मेन्चायम","म्याङलुङ","फेडाप"],
                "सुनसरी": ["बराहक्षेत्र","बर्जु","भोक्राहा नरसिङ्ग","देवानगन्ज","धरान","दुहबी","गढी","हरिनगर","इनरुवा","इटहरी","कोशी","रामधुनी"],
                "उदयपुर": ["बेलका","चौदण्डीगढी","कटारी","लिम्चुङबुङ","रौतामाई","तापली","त्रियुग","उदयपुरगढी"]
            },
            2: {
                "सप्तरी": ["अग्निशैर कृष्ण सावरण","बालन बिहुल","विष्णुपुर","बोडे बार्सैन","छिन्नमस्ता","डाक्नेश्वरी","हनुमाननगर कंकालिनी","कञ्चनरुप","खडक","महादेव","राजविराज","राजगढ","रुपानी","सप्तकोशी","शम्भुनाथ","सुरुङ्गा","तिलाठी कोइलाडी","तिराहुत"],
                "सिराहा": ["अर्नामा","औरही","बरियारपट्टी","भगवानपुर","विष्णुपुर","धनगढीमाई","गोलबजार","कल्याणपुर","कर्जन्हा","लहान","लक्ष्मीपुर पटारी","मिर्चैया","नरहा","नवराजपुर","सखुवानङ्करकट्टी","सिरहा","सुखीपुर"],
                "धनुषा": ["औराही","बटेश्वर","बिदेहा","क्षिरेश्वरनाथ","धनौजी","धनुषाधाम","गणेशमान चारनाथ","हंसपुर","जनकनन्दनी","जनकपुरधाम","कमला","लक्ष्मीनिया","मिथिला","मिथिला बिहारी","मुखियापट्टी मुसरमिया","नगराई","सबाइला","सहिदनगर"],
                "महोत्तरी": ["औरही","बलवा","बर्दिवास","भङ्गाहा","एकडानरा","गौशाला","जलेश्वर","लोहारपट्टी","महोत्तरी","मनरा सिसवा","मटिहानी","पिपरा","रामगोपालपुर","सम्सी","सोनामा"],
                "सर्लाही": ["बागमती","बलरा","बराहथवा","बासबरिया","विष्णु","ब्रम्हपुरी","चक्रघट्टा","चन्द्रनगर","धनकौल","गोदैता","हरिपुर","हरिपुरवा","हरिवान","ईश्वरपुर","कबिलासी","कौडेना","लालबन्दी","मलङ्गवा","पर्सा","रामनगर"],
                "बारा": ["आदर्श कोतवाल","बारागढी","बिश्रामपुर","देवताल","जितपुरसिमारा","कलैया","करैयामाई","कोल्हाबी","महागढीमाई","निजगढ","पचरौता","परवानीपुर","फेटा","प्रसौनी","सिम्रौनगढ","सुवर्ण"],
                "पर्सा": ["बहुदरमाई","बिन्दवासिनी","वीरगन्ज","छिपहरमाई","धोबिनी","जगरनाथपुर","जिरभवानी","कालिकामाई","पकाहा मेनपुर","पर्सागढी","पटेरवा सुगौली","पोखरिया","सखुवा प्रसौनी","थोरी"],
                "रौतहट": ["बौधिमाई","वृन्दबन","चन्द्रपुर","देवाही गोनाही","दुर्गा भगवती","गढीमाई","गरुड","गौर","गुजरा","ईशानाथ","कटहरिया","माधव नारायण","मौलापुर","पारोहा","विविजय फटुवा","राजदेवी","राजपुर","यमुनामाई"]
            },
            3: {
                "भक्तपुर": ["भक्तपुर","चाँगुनारायण","मध्यपुरथिमि","सूर्यविनायक"],
                "चितवन": ["भरतपुर","इच्छाकामना","कालिका","खैरहनी","माडी","राप्ती","रत्ननगर"],
                "धादिङ": ["बेनिघाट रोराङ","धुनिबेसी","गजुरी","गाल्ची","गंगाजमुना","ज्वालामुखी","खनियाबास","नेत्रावती डब्जोङ","नीलकण्ठ","रुबी उपत्यका","सिद्धलेक","ठाकरे","त्रिपुरा सुन्दरी"],
                "दोलखा": ["बैतेश्वर","भीमेश्वर","बिगु","गौरीशंकर","जिरी","कालिञ्चोक","मेलुङ","सेलुङ","तामाकोशी"],
                "काठमाडौं": ["बुढानिलकण्ठ","चन्द्रागिरि","दक्षिणकाली","गोकर्णेश्वर","कागेश्वरी मनहोरा","काठमाडौं","कीर्तिपुर","नागार्जुन","शंखरापुर","तारकेश्वर","टोखा"],
                "काभ्रेपलाञ्चोक": ["बनेपा","बेथानचोक","भुम्लु","चौरीदेउराली","धुलिखेल","खानीखोला","महाभारत","मण्डनदेउपुर","नमोबुद्ध","पनौती","पाँचखाल","रोशी","तेमल"],
                "ललितपुर": ["बागमती","गोदावरी","कोन्ज्योसोम","ललितपुर","महालक्ष्मी","महांकाल"],
                "मकवानपुर": ["बागमती","बकैया","भीमफेदी","हेटौंडा","इन्द्रसरोवर","कैलाश","मकवानपुरगढी","मनहरी","रक्सिराङ","थाहा"],
                "नुवाकोट": ["बेलकोटगढी","बिदुर","दुप्चेश्वर","ककनी","किस्पाङ","लिखु","म्यागाङ","पञ्चकन्या","शिवपुरी","सुर्यगढी","ताडी","तारकेश्वर"],
                "रामेछाप": ["दोरम्बा","गोकुलगंगा","खाडादेवी","लिखु तामाकोशी","मन्थली","रामेछाप","सुनापति","उमाकुण्ड"],
                "रसुवा": ["अमाकोडिङमो","गोसाइकुण्ड","कालिका","नौकुण्ड","उत्तरगया"],
                "सिन्धुली": ["दुधौली","घाङ्लेख","गोलन्जोर","हरिहरपुरगढी","कमलामाई","मारिन","फिक्कल","सुनकोशी","तिनपाटन"],
                "सिन्धुपाल्चोक": ["बलेफी","बाह्रबिसे","भोटेकोशी","चौतारा साँगाचोकगढी","हेलम्बु","इन्द्रावती","जुगल","लिसाङ्खु","मेलम्ची","पाँचपोखरी थाङ्पाल","सुनकोशी","त्रिपुरासुन्दरी"]
            },
            4: {
                "बाग्लुङ": ["बडिगाड","बाग्लुङ","बरेङ","ढोरपाटन","गलकोट","जैमुनी","कान्ठेखोला","निसिखोला","तमन खोला","तारा खोला"],
                "गोरखा": ["आरुघाट","अजिरकोट","बारपाक सुलिकोट","भीमसेनथापा","चुम नुब्रि","धार्चे","गण्डकी","गोरखा","पालुङटार","सहिद लखन","सिरञ्चोक"],
                "कास्की": ["अन्नपूर्ण","माछापुच्छ्रे","माडी","पोखरा","रुपा"],
                "लमजुङ": ["बेशिशहर","दोर्दी","दूधपोखरी","क्वालासोथर","मध्यनेपाल","मर्स्याङ्दी","रैनास","सुन्दरबजार"],
                "मनाङ": ["चामे","मनाङ इङ्स्याङ","नरपा भूमि","नरशोन"],
                "मुस्ताङ": ["घरापझोङ","लो घेकर दामोदरकुण्ड","लोमान्थाङ","थासाङ","वारागुङ मुक्तिक्षेत्र"],
                "म्याग्दी": ["अन्नपूर्ण","बेनी","धौलागिरी","मलिका","मंगला","रघुगंगा"],
                "नवलपरासी पूर्व": ["बौदेकाली","बिनयी","बुलिङटार","देवचुली","गैडाकोट","हुप्सेकोट","कावासोती","मध्यविन्दु"],
                "पर्वत": ["बिहादी","जलजला","कुश्मा","महाशिला","मोदी","पाइन्यु","फलेबास"],
                "स्याङ्जा": ["आँधीखोला","अर्जुनचौपरी","भिरकोट","बिरुवा","चापाकोट","गल्याङ","हरिनास","कालीगण्डगी","फेदीखोला","पुतलीबजार","वालिङ"],
                "तनहुँ": ["अन्बुखैरेनी","बन्दीपुर","भानु","भीमद","ब्यास","देवघाट","घिरिङ","म्याग्दे","रिसिङ","शुक्लागण्डकी"]
            },
            5: {
                "अर्घाखाँची": ["भुमेकस्थान","छत्रदेव","मलारानी","पाणिनी","सन्धिखर्क","सितगंगा"],
                "बाँके": ["बैजनाथ","डुडुवा","जानकी","खजुरा","कोहलपुर","नरैनापुर","नेपालगन्ज","राप्ती सोनारी"],
                "बर्दिया": ["बढैयाताल","बाँसगढी","बारबर्दिया","गेरुवा","गुलरिया","मधुवन","राजापुर","ठाकुरबाबा"],
                "दाङ": ["बबई","बंगलाचुली","दंगिशरण","गढवा","घोराही","लमही","राजपुर","राप्ती","शान्तिनगर","तुलसीपुर"],
                "गुल्मी": ["चन्द्रकोट","चत्रकोट","गुल्मीदरबार","इस्मा","कालीगण्डकी","मदने","मलिका","मुसिकोट","रेसुंगा","रुरु","सत्यवती"],
                "कपिलवस्तु": ["बाणगंगा","विजयनगर","बुद्धभूमि","कपिलवस्तु","कृष्णनगर","महाराजगन्ज","मायादेवी","शिवराज","शुद्धोधन","यशोधरा"],
                "नवलपरासी पश्चिम": ["बर्दघाट","पाल्ही नन्दन","प्रतापपुर","रामग्राम","सरवल","सुनवल","सुस्ता"],
                "पाल्पा": ["बागनास्कली","मठगढी","निस्दी","पूर्वखोला","रैनादेवी","रम्भा","रामपुर","रिब्दीकोट","तानसेन","तिनाउ"],
                "प्युठान": ["आइराबत","गौमुखी","झिमरुक","मल्लरानी","मांडवी","नौबहिनी","प्युठान","सरूमरानी","स्वर्गद्वारी"],
                "रोल्पा": ["गंगादेव","लुङ्गरी","माडी","परिवर्तन","रोल्पा","रुन्टीगढी","सुनछहरी","सुनिल स्मृति","थवाङ","त्रिवेणी"],
                "रुकुम पूर्व": ["भुमे","पुथा उत्तरगंगा","सिस्ने"],
                "रुपन्देही": ["बुटवल","देवदह","गैडहवा","कञ्चन","कोटाहिमाई","लुम्बिनी संस्कृत","मार्चवारी","मायादेवी","ओमसतिया","रोहिणी","सैनामैना","समरीमाइ","सिद्धार्थनगर","सियारी","शुद्धोधन","तिलोतमा"]
            },
            6: {
                "दैलेख": ["आठबिस","भगवतीमाई","भैरवी","चामुण्डा बिन्द्रसैनी","दुल्लु","डुङ्गेश्वर","गुराँस","महाबु","नारायण","नौमुले","ठान्टिकाण्ड"],
                "डोल्पा": ["छर्का ताङसोङ","डोल्पो बुद्ध","जगदुल्ला","काइके","मुड्केचुला","शे फोक्सुण्डो","ठुली भेरी","त्रिपुरासुन्दरी"],
                "हुम्ला": ["अडांचुली","चनखेली","खार्पुनाथ","नम्खा","सार्केगड","सिमकोट","तान्जाकोट"],
                "जाजरकोट": ["बारेकोट","भेरी","छेडागढ","जुनिचन्दे","कुसे","नालागड","शिवालय"],
                "जुम्ला": ["चन्दननाथ","गुठीचौर","हिमा","कनकसुन्दरी","पत्रासी","सिन्जा","तातोपानी","तिला"],
                "कालिकोट": ["खंडचक्र","महावाई","नरहरिनाथ","पाँचलझरना","पलाटा","रास्कोट","सन्नी त्रिवेणी","शुभ कालिका","तिलागुफा"],
                "मुगु": ["छायानाथ रारा","खत्याड","मुगुम कर्मारोङ","सोरु"],
                "रुकुम पश्चिम": ["आठबिस्कोट","बनफिकोट","चौरजहारी","मुसिकोट","सानी भेरी","त्रिवेणी"],
                "सल्यान": ["बागचौर","बांगड","छत्रेश्वरी","डार्मा","कालीमाटी","कपुरकोट","कुमाख","शारदा","सिद्ध कुमाख","त्रिवेणी"],
                "सुर्खेत": ["बराहताल","भेरीगंगा","वीरेन्द्रनगर","चौकुने","चिंगाड","गुर्भाकोट","लेकबेशी","पञ्चपुरी","सिम्ता"]
            },
            7: {
                "अछाम": ["बान्नीगढी","चौरपाटी","ढकारी","कमलबजार","मंगलसेन","मेल्लेख","पञ्चदेवल विनायक","रामरोशन","साँफेबगर","तुर्मखाड"],
                "बैतडी": ["दशरथचन्द","डिलासैनी","दोगडाकेदार","मेलौली","पञ्चेश्वर","पाटन","पुर्चौडी","शिवनाथ","सिगास","सुर्नाया"],
                "बझाङ": ["बिठाडचिर","बुंगल","चाबिस्पाथीवेरा","दुर्गाथली","जय पृथ्वी","केदारसेउ","खप्तडछन्ना","मस्त","साइपाल","सुर्मा","तालकोट","थालारा"],
                "बाजुरा": ["बडिमालिका","बुढीगंगा","बुढीनन्द","गौमुल","हिमाली","जगन्नाथ","खप्तड छेडेदह","स्वामी कार्तिक खापर","त्रिवेणी"],
                "डडेल्धुरा": ["अजयमेरु","अलिताल","अमरगढी","भागेश्वर","गणयपधुरा","नवदुर्गा","परशुराम"],
                "दार्चुला": ["एपिहिमल","ब्यास","दुन्हु","लेकम","महाकाली","मालिकार्जुन","मर्मा","नौगाड","शैल्यशिखर"],
                "डोटी": ["आदर्श","बडीकेदार","दिपायल सिलगढी","जोरयाल","के आई सिंह","पूर्वचौकी","सायल","शिखर"],
                "कैलाली": ["बर्दगोरिया","भजनी","चुरे","धनगढी","गौरीगंगा","घोडाघोडी","गोदावरी","जानकी","जोशीपुर","कैलारी","लम्कीचुहा","मोहन्याल","टीकापुर"],
                "कञ्चनपुर": ["बेदकोट","बेलौरी","बेलडाँडी","भीमदत्त","कृष्णपुर","लालझण्डी","महाकाली","पुनर्वास","शुक्लाफाँटा"]
            }
        }
    };

    const ministrySelect = document.getElementById('ministry-filter');
    const provinceSelect = document.getElementById('province-filter');
    const districtSelect = document.getElementById('district-filter');
    const localLevelSelect = document.getElementById('local-filter');
    const searchBtn = document.getElementById('search-filters');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (typeof updateDashboardStats === 'function') updateDashboardStats();
            if (typeof updateCharts === 'function') updateCharts();
        });
    }

    window.populateDropdown = (element, list, defaultText) => {
        if (!element || !list) return;
        element.innerHTML = `<option value="">${defaultText}</option>`;
        list.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            opt.title = item; // पूरा नाम टुलटिपमा देखाउन
            element.appendChild(opt);
        });
    };

    // Initial populations
    if (ministrySelect) populateDropdown(ministrySelect, nepalData.MINISTRIES, "सबै मन्त्रालय/निकाय");

    // 2. Chart Instances and Update Logic
    let submissionChart, levelChart, typeChart;

    const updateCharts = () => {
        const entries = window.getStoredEntries();
        
        document.querySelectorAll('.chart-container').forEach(container => {
            container.classList.remove('chart-update-active');
            void container.offsetWidth; // Trigger reflow
            container.classList.add('chart-update-active');
        });

        if (submissionChart) {
            const onTime = entries.filter(e => e.within_60_days === 'yes' || e.on_time === 'हो').length;
            const delayed = entries.filter(e => e.within_60_days === 'no' || e.on_time === 'नगरेको').length;
            const finePaid = entries.filter(e => e.form_type === 'penalty_payment' || e.fine_paid === 'yes').length;
            
            submissionChart.data.datasets[0].data = [onTime, delayed, finePaid];
            submissionChart.update();
        }

        if (levelChart) {
            // तहगत वा जिल्लागत स्थिति अपडेट
            const urlParams = new URLSearchParams(window.location.search);
            const role = urlParams.get('role') || 'superadmin';

            if (role === 'provincial') {
                levelChart.data.datasets[0].data = levelChart.data.labels.map(() => Math.floor(Math.random() * 150) + 100);
                levelChart.data.datasets[1].data = levelChart.data.labels.map(() => Math.floor(Math.random() * 30) + 5);
            } else {
                levelChart.data.datasets[0].data = [Math.floor(Math.random() * 1000) + 200, Math.floor(Math.random() * 1000) + 200, Math.floor(Math.random() * 2000) + 500];
                levelChart.data.datasets[1].data = [Math.floor(Math.random() * 200) + 20, Math.floor(Math.random() * 200) + 20, Math.floor(Math.random() * 400) + 50];
            }
            levelChart.update();
        }

        if (typeChart) {
            // राष्ट्रसेवकको किसिम अपडेट
            typeChart.data.datasets[0].data = [
                Math.floor(Math.random() * 3000) + 1000, Math.floor(Math.random() * 500), Math.floor(Math.random() * 800),
                Math.floor(Math.random() * 300), Math.floor(Math.random() * 200), Math.floor(Math.random() * 400)
            ];
            typeChart.update();
        }
    };

    if (ministrySelect) {
        ministrySelect.addEventListener('change', () => {
            updateDashboardStats();
            updateCharts();
        });
    }

    if (provinceSelect) {
        provinceSelect.addEventListener('change', function() {
            const pId = this.value;
            if (districtSelect) {
                populateDropdown(districtSelect, nepalData.DISTRICTS[pId] || [], "सबै जिल्ला");
                if (localLevelSelect) localLevelSelect.innerHTML = '<option value="">सबै स्थानीय तह</option>';
            }
            updateDashboardStats();
            updateCharts();
        });
    }

    if (districtSelect) {
        districtSelect.addEventListener('change', function() {
            const dVal = this.value;
            const pId = provinceSelect ? provinceSelect.value : "";
            if (localLevelSelect && pId && dVal) {
                const list = (nepalData.MUNICIPALITIES[pId] && nepalData.MUNICIPALITIES[pId][dVal]) || [];
                populateDropdown(localLevelSelect, list, "सबै स्थानीय तह");
            }
            updateDashboardStats();
            updateCharts();
        });
    }

    // Clear All Filters Functionality
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Reset all select values
            if (ministrySelect) ministrySelect.value = "";
            if (provinceSelect) provinceSelect.value = "";
            
            // Clear dependent dropdowns
            if (districtSelect) {
                districtSelect.innerHTML = '<option value="">सबै जिल्ला</option>';
                districtSelect.value = "";
            }
            if (localLevelSelect) {
                localLevelSelect.innerHTML = '<option value="">सबै स्थानीय तह</option>';
                localLevelSelect.value = "";
            }

            // Reset all fields in png-filter-container
            const pngFilterContainers = document.querySelectorAll('.png-filter-container');
            pngFilterContainers.forEach(container => {
                // Reset all input fields
                const inputFields = container.querySelectorAll('input[type="text"]');
                inputFields.forEach(input => {
                    input.value = "";
                });
                
                // Reset all select dropdowns
                const selectFields = container.querySelectorAll('select');
                selectFields.forEach(select => {
                    select.value = "";
                });
            });

            // Refresh UI components
            if (typeof updateDashboardStats === 'function') {
                updateDashboardStats();
            }
            if (typeof updateCharts === 'function') {
                updateCharts();
            }
        });
    }

    if (localLevelSelect) {
        localLevelSelect.addEventListener('change', () => {
            updateDashboardStats();
            updateCharts();
        });
    }

    // Role-based Dynamic Sidebar Logic
    const renderSidebarMenu = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') || 'superadmin';
        const navList = document.getElementById('sidebar-nav-list');
        const brandText = document.getElementById('sidebar-brand-text');
        const userTopInfo = document.getElementById('user-top-info');
        if (!navList) return;

        const roleMap = { 'superadmin': 'सुपर एडमिन', 'admin': 'एडमिन', 'federal': 'सङ्घीय तह', 'provincial': 'प्रदेश तह', 'local': 'स्थानीय तह', 'office': 'प्रयोगकर्ता कार्यालय' };
        if (brandText) brandText.innerHTML = `<i class="fa-solid fa-user-shield"></i> ${roleMap[role]}`;

        // 'office' र 'local' रोलका लागि अनावश्यक फिल्टरहरू लुकाउनुहोस्
        const filterSection = document.querySelector('.filter-section');
        if (filterSection && (role === 'office' || role === 'local')) {
            filterSection.style.display = 'none';
        }

        // 'provincial' रोलका लागि मन्त्रालय र प्रदेश फिल्टर लुकाउनुहोस्
        if (role === 'provincial') {
            if (ministrySelect && ministrySelect.parentElement) ministrySelect.parentElement.style.display = 'none';
            if (provinceSelect && provinceSelect.parentElement) provinceSelect.parentElement.style.display = 'none';

            // सम्बन्धित प्रदेशका जिल्लाहरू स्वतः लोड गर्ने
            const userProvinceId = sessionStorage.getItem('user_province') || '3'; // डिफल्ट बागमती (३) सेट गरिएको
            if (provinceSelect) provinceSelect.value = userProvinceId;
            if (districtSelect) {
                populateDropdown(districtSelect, nepalData.DISTRICTS[userProvinceId] || [], "सबै जिल्ला");
            }
        }

        // रिपोर्ट पेजहरूमा 'office' र 'local' रोलका लागि फिल्टर लुकाउने र शीर्षक अपडेट गर्ने
        const pngFilterContainer = document.querySelector('.png-filter-container');
        const userOffice = sessionStorage.getItem('user_ministry') || 'गृह मन्त्रालय';
        const userLocal = sessionStorage.getItem('user_local_level');

        if (role === 'office' || role === 'local') {
            if (pngFilterContainer) {
                const minFilter = pngFilterContainer.querySelector('#ministry-filter');
                if (minFilter && minFilter.parentElement) minFilter.parentElement.style.display = 'none';
            }
            const heading = document.querySelector('.section-common-heading');
            if (heading) {
                const displayName = role === 'local' ? userLocal : userOffice;
                if (displayName) heading.textContent = `${displayName} - रिपोर्ट विवरण`;
            }
        }
        
        // Update Top-Right User Info
        if (userTopInfo) {
            const username = sessionStorage.getItem('username') || 'Admin User';
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const userRole = document.getElementById('user-role');
            
            // Update user info elements
            if (userAvatar) {
                userAvatar.textContent = username.charAt(0).toUpperCase();
            }
            if (userName) {
                userName.textContent = username;
            }
            if (userRole) {
                userRole.textContent = roleMap[role];
            }
            
            // Add hover effect and click handler for logout
            userTopInfo.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            });
            
            userTopInfo.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            userTopInfo.addEventListener('click', function() {
                if (confirm('के तपाईं लगआउट गर्न चाहनुहुन्छ?')) {
                    // Clear session storage
                    sessionStorage.clear();
                    // Redirect to login page
                    window.location.href = 'index.html';
                }
            });
        }

        let menuItems = [];
        if (role === 'superadmin') {
            menuItems = [
                { name: 'ड्यासबोर्ड', icon: 'fa-gauge', link: 'dashboard.html' },
                { name: 'मन्त्रालय/निकायगत रिपोर्ट', icon: 'fa-file-lines', link: 'dashboard.html' },
                { name: 'प्रदेशगत रिपोर्ट', icon: 'fa-map', link: 'province_report.html' },
                { name: 'जिल्लागत रिपोर्ट', icon: 'fa-location-dot', link: 'district_report.html' },
                { name: 'स्थानीय तहगत रिपोर्ट', icon: 'fa-city', link: 'local_report.html' },
                { name: 'शुरु नियुक्तिको ६० दिनभित्र पेश गर्नेको विवरण', icon: 'fa-calendar-plus', link: 'initial_60_days_report.html' },
                { name: 'आ.व. समाप्त भएको ६० दिनभित्र पेश गर्नेको विवरण', icon: 'fa-calendar-check', link: 'annual_60_days_report.html' },
                { name: 'विशेष परिस्थितिमा ३० दिनभित्र पेश गर्नेको विवरण', icon: 'fa-calendar-day', link: 'special_30_days_report.html' },
                { name: 'जरीवाना तिरी पेश गर्नेको विवरण', icon: 'fa-money-bill-wave', link: 'fine_paid_report.html' },
                { name: 'समयमा विवरण पेश नगर्नेको विवरण', icon: 'fa-user-clock', link: 'non_in_time_report.html' },
                { name: 'विवरण नै पेश नगर्नेको विवरण', icon: 'fa-user-slash', link: 'never_submitted_report.html' },
                { name: 'सबै राष्ट्रसेवकको विवरण', icon: 'fa-users', link: 'all_employees_report.html' },
                { name: 'प्रयोगकर्ता व्यवस्थापन', icon: 'fa-user-gear', link: 'user_management.html' },
                { name: 'सेटिङ्गस', icon: 'fa-gears', link: 'settings.html' }
            ];
        } else if (role === 'admin' || role === 'federal' || role === 'provincial' || role === 'local' || role === 'office') {
            // एडमिन, तहगत र कार्यालय स्तरीय प्रयोगकर्ताका लागि साझा मेनु
            menuItems = [
                { name: 'ड्यासबोर्ड', icon: 'fa-gauge', link: 'dashboard.html' },
                { 
                    name: 'नयाँ विवरण प्रविष्टि', 
                    icon: 'fa-folder-plus', 
                    link: '#', 
                    submenu: [
                        { name: 'शुरु नियुक्तिको ६० दिनभित्र', link: 'new_appointment_60_form.html' },
                        { name: 'आ.व. समाप्त भएको ६० दिनभित्र', link: 'annual_end_60_form.html' },
                        { name: 'विशेष परिस्थितिमा ३० दिनभित्र', link: 'special_30_form.html' },
                        { name: 'जरीवाना तिरी पेश गर्ने', link: 'penalty_payment_form.html' },
                        { name: 'समयमा विवरण पेश नगर्नेको प्रविष्टि', link: 'non_in_time_form.html' }
                    ] 
                },
                { name: 'समयमा विवरण पेश नगर्नेको विवरण', icon: 'fa-user-clock', link: 'non_in_time_report.html' },
                { name: 'जरीवाना तिरी पेश गर्नेको विवरण', icon: 'fa-money-bill-wave', link: 'fine_paid_report.html' },
                { name: 'विवरण नै पेश नगर्नेको विवरण', icon: 'fa-user-slash', link: 'never_submitted_report.html' },
                { name: 'सबै राष्ट्रसेवकको विवरण', icon: 'fa-users', link: 'all_employees_report.html' },
                { name: role === 'office' ? 'मेरो रिपोर्ट' : 'निकायगत रिपोर्ट', icon: 'fa-chart-pie', link: 'dashboard.html?view=report' }
            ];
        } else {
            // अन्य डिफल्ट रोलका लागि
            menuItems = [
                { name: 'ड्यासबोर्ड', icon: 'fa-gauge', link: 'dashboard.html' },
                { 
                    name: 'नयाँ विवरण', 
                    icon: 'fa-folder-plus', 
                    link: '#', 
                    submenu: [
                        { name: 'नयाँ प्रविष्टि', link: 'new_appointment_60_form.html' }
                    ] 
                },
                { name: 'समयमा विवरण पेश नगर्नेको विवरण', icon: 'fa-user-clock', link: 'non_in_time_report.html' },
                { name: 'जरीवाना तिरी पेश गर्नेको विवरण', icon: 'fa-money-bill-wave', link: 'fine_paid_report.html' },
                { name: 'विवरण नै पेश नगर्नेको विवरण', icon: 'fa-user-slash', link: 'never_submitted_report.html' },
                { name: 'पेजमा प्रविष्ट भएका सबै विवरण', icon: 'fa-users', link: 'all_employees_report.html' }
            ];
        }

        navList.innerHTML = menuItems.map(item => {
            if (item.submenu) {
                const separator = item.link.includes('?') ? '&' : '?';
                return `
                    <li class="has-submenu">
                        <a href="javascript:void(0)" class="submenu-parent">
                            <i class="fa-solid ${item.icon}"></i> ${item.name}
                            <i class="fa-solid fa-chevron-down submenu-toggle"></i>
                        </a>
                        <ul class="sidebar-submenu">
                            ${item.submenu.map(sub => {
                                const subSep = sub.link.includes('?') ? '&' : '?';
                                return `<li><a href="${sub.link}${subSep}role=${role}">${sub.name}</a></li>`;
                            }).join('')}
                        </ul>
                    </li>`;
            }
            const sep = item.link.includes('?') ? '&' : '?';
            return `<li><a href="${item.link}${sep}role=${role}"><i class="fa-solid ${item.icon}"></i> ${item.name}</a></li>`;
        }).join('');

        // Submenu toggle click listener
        document.querySelectorAll('.submenu-parent').forEach(parent => {
            parent.addEventListener('click', function(e) {
                this.parentElement.classList.toggle('open');
            });
        });
    };

    renderSidebarMenu();

    const updateDashboardStats = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') || 'superadmin';
        const userMin = sessionStorage.getItem('user_ministry');
        const userLocal = sessionStorage.getItem('user_local_level');
        const entries = window.getStoredEntries();

        try {
            // वास्तविक डेटाबाट क्याल्कुलेसन
            const statsData = {
                total_orgs: new Set(entries.map(e => e.office_name || e.ministry)).size,
                total_servants: entries.length,
                on_time: entries.filter(e => e.within_60_days === 'yes' || e.on_time === 'हो').length,
                delayed: entries.filter(e => e.within_60_days === 'no' || e.on_time === 'नगरेको').length,
                fine_paid: entries.filter(e => e.form_type === 'penalty_payment').length,
                fine_pending: entries.filter(e => e.fine_status === 'pending').length,
                initial_60: entries.filter(e => e.form_type === 'new_appointment_60').length,
                annual_60: entries.filter(e => e.form_type === 'annual_end_60').length,
                special_30: entries.filter(e => e.form_type === 'special_30').length
            };

            const ids = ['total-orgs', 'total-servants', 'on-time', 'delayed', 'fine-paid', 'fine-pending', 'initial-60', 'annual-60', 'special-30'];
            const keys = Object.keys(statsData);

            ids.forEach((id, index) => {
                const el = document.getElementById(id);
                if (el) el.textContent = statsData[keys[index]].toLocaleString('ne-NP');
            });
        } catch (err) { console.warn("Stats error"); }
    };

    const initCharts = () => {
        const subCtx = document.getElementById('submissionChart');
        const levelCtx = document.getElementById('ministryChart'); 
        const typeCtx = document.getElementById('employeeTypeChart'); // New canvas ID needed in HTML
        
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') || 'superadmin';
        
        if (subCtx && typeof Chart !== 'undefined') {
            submissionChart = new Chart(subCtx, {
                type: 'bar',
                data: {
                    labels: ['समयमा बुझाउने', 'नबुझाउने', 'जरीवाना तिर्ने'],
                    datasets: [{ 
                        label: 'संख्या',
                        // एडमिनको लागि सानो डाटा सेट
                        data: (role === 'admin' || role === 'office' || role === 'local') ? [410, 40, 30] : [4100, 460, 320], 
                        backgroundColor: ['#3754aa', '#c44743', '#faa43a'] /* सफ्ट रङहरू */
                    }]
                },
                options: { 
                    responsive: true,
                    maintainAspectRatio: false,
                    onHover: (event, chartElement) => {
                        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const role = new URLSearchParams(window.location.search).get('role') || 'superadmin';
                            // ०: सबै विवरण, १: पेश नगर्नेको विवरण, २: जरीवाना विवरण
                            const reportPages = ['all_employees_report.html', 'never_submitted_report.html', 'fine_paid_report.html'];
                            if (reportPages[index]) {
                                window.location.href = `${reportPages[index]}?role=${role}`;
                            }
                        }
                    },
                    plugins: { 
                        title: { display: true, text: 'समग्र स्थिति' },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1b438b',
                            titleFont: { size: 16, weight: 'bold' },
                            bodyColor: '#424242',
                            bodyFont: { size: 14 },
                            borderColor: '#e1e8ed',
                            borderWidth: 1,
                            padding: 15,
                            cornerRadius: 10,
                            usePointStyle: true,
                            boxPadding: 8
                        }
                    },
                    animation: {
                        duration: 1500,
                        easing: 'easeOutBack'
                    }
                }
            });
        }

        if (levelCtx && typeof Chart !== 'undefined') {
            let chartLabels = ['सङ्घीय तह', 'प्रदेश तह', 'स्थानीय तह'];
            let initialOnTime = [450, 600, 1200];
            let initialDelayed = [50, 100, 200];

            if (role === 'provincial') {
                const userProvinceId = sessionStorage.getItem('user_province') || '3';
                chartLabels = window.nepalData.DISTRICTS[userProvinceId] || [];
                initialOnTime = chartLabels.map(() => Math.floor(Math.random() * 150) + 100);
                initialDelayed = chartLabels.map(() => Math.floor(Math.random() * 30) + 5);
            } else if (role === 'admin' || role === 'office' || role === 'local') {
                initialOnTime = [410, 0, 0];
                initialDelayed = [40, 0, 0];
            }

            levelChart = new Chart(levelCtx, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [
                        { label: 'बुझाउने', data: initialOnTime, backgroundColor: '#60bd68' },
                        { label: 'नबुझाउने', data: initialDelayed, backgroundColor: '#f15854' }
                    ]
                },
                options: { 
                    responsive: true,
                    onHover: (event, chartElement) => {
                        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const role = new URLSearchParams(window.location.search).get('role') || 'superadmin';
                            // तहगत वा जिल्लागत विस्तृत विवरणका लागि सबै विवरण पेजमा पठाउने
                            window.location.href = `all_employees_report.html?role=${role}`;
                        }
                    },
                    plugins: { 
                        title: { display: true, text: role === 'provincial' ? 'जिल्लागत स्थिति' : 'तहगत स्थिति' },
                        legend: { position: 'bottom' },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1b438b',
                            titleFont: { size: 16, weight: 'bold' },
                            bodyColor: '#424242',
                            bodyFont: { size: 14 },
                            borderColor: '#e1e8ed',
                            borderWidth: 1,
                            padding: 15,
                            cornerRadius: 10,
                            usePointStyle: true,
                            boxPadding: 8
                        }
                    },
                    scales: { y: { beginAtZero: true } },
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1200,
                        delay: (context) => {
                            return context.dataIndex * 150; // Staggered bars
                        }
                    }
                }
            });
        }

        if (typeCtx && typeof Chart !== 'undefined') {
            typeChart = new Chart(typeCtx, {
                type: 'pie',
                data: {
                    labels: ['स्थायी', 'अस्थायी', 'करार', 'नियुक्ति', 'मनोनयन', 'निर्वाचित'],
                    datasets: [{ 
                        data: [2500, 500, 800, 200, 100, 460], 
                        backgroundColor: ['#5da5da', '#60bd68', '#faa43a', '#b276b2', '#decf3f', '#f15854'] 
                    }]
                },
                options: { 
                    responsive: true,
                    onHover: (event, chartElement) => {
                        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const role = new URLSearchParams(window.location.search).get('role') || 'superadmin';
                            // छानिएको किसिम अनुसारको फिल्टर पछि थप्न सकिन्छ, अहिलेलाई मुख्य रिपोर्टमा पठाउने
                            window.location.href = `all_employees_report.html?role=${role}`;
                        }
                    },
                    plugins: { 
                        title: { display: true, text: 'राष्ट्रसेवकको किसिम' },
                        legend: { position: 'bottom' },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1b438b',
                            titleFont: { size: 16, weight: 'bold' },
                            bodyColor: '#424242',
                            bodyFont: { size: 14 },
                            borderColor: '#e1e8ed',
                            borderWidth: 1,
                            padding: 15,
                            cornerRadius: 10,
                            usePointStyle: true,
                            boxPadding: 8
                        }
                    },
                    animation: { animateRotate: true, animateScale: true, duration: 1000 }
                }
            });
        }

        // Mobile Animation: Trigger when visible on scroll
        const observerOptions = { threshold: 0.2 };
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    const chartInstance = Chart.getChart(entry.target.querySelector('canvas'));
                    if (chartInstance) chartInstance.update();
                    chartObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.chart-container').forEach(container => {
            chartObserver.observe(container);
        });
    };

    // Sidebar Active Link Highlighting
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const breadcrumbActive = document.getElementById('breadcrumb-active-item');

    if (sidebar) {
        // Admin को लागि डिफल्ट निकाय सेटिङ (यदि sessionStorage मा छैन भने)
        if (!sessionStorage.getItem('user_ministry')) {
            sessionStorage.setItem('user_ministry', 'गृह मन्त्रालय');
        }

        // Auto-highlight active sidebar link and sync breadcrumb based on current URL
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === "#") return;
            
            // पूर्ण URL (Path र Search Params) तुलना गरेर सही मेनु हाइलाइट गर्ने
            const currentFull = (window.location.pathname.split("/").pop() || "dashboard.html") + window.location.search;
            const linkFull = href.split("/").pop();

            if (currentFull === linkFull) {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                if (breadcrumbActive) {
                    breadcrumbActive.textContent = link.innerText.trim();
                }
            }
        });

        // Fallback: If breadcrumb text is empty, set it from the current active class
        if (breadcrumbActive && !breadcrumbActive.textContent) {
            const activeLink = document.querySelector('.sidebar-menu ul li a.active');
            if (activeLink) {
                breadcrumbActive.textContent = activeLink.innerText.trim();
            }
        }
    }

    // समयमा विवरण पेश नगर्नेको फारम प्रविष्टि ह्यान्डलर
    const nonInTimeForm = document.getElementById('non-in-time-form');
    if (nonInTimeForm) {
        nonInTimeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(nonInTimeForm);
            const data = Object.fromEntries(formData);
            
            // आवश्यक अतिरिक्त कुञ्जीहरू थप्ने
            data.form_type = 'non_in_time';
            data.on_time = 'नगरेको';
            
            window.savePropertyEntry(data);
            alert('विवरण सफलतापूर्वक स्थानीय भण्डारण (Local Storage) मा सुरक्षित गरियो।');
            nonInTimeForm.reset();
        });
    }

    /**
     * रिपोर्ट टेबलका लागि एउटै साझा (generic) फिल्टरिङ फङ्सन
     * यसले .png-filter-container भित्र रहेका सबै data-col भएका inputs/selects लाई ट्र्याक गर्छ।
     */
    const initGenericTableFilters = () => {
        const filterContainer = document.querySelector('.png-filter-container, .filter-grid');
        const tableBody = document.querySelector('.report-table tbody, #province-report-body, #local-report-body, #district-report-body');
        
        if (!filterContainer || !tableBody) return;

        const filterInputs = filterContainer.querySelectorAll('input[data-col], select[data-col]');
        const globalSearchInput = document.getElementById('global-report-search');
        const searchBtn = document.getElementById('search-filters');
        const table = tableBody.closest('table');
        const colCount = table.querySelectorAll('thead th').length;

        // Skeleton Loading Logic
        const toggleSkeleton = (show) => {
            if (show) {
                tableBody.querySelectorAll('tr').forEach(tr => tr.style.display = 'none');
                const skeletonRows = Array(5).fill(0).map(() => `
                    <tr class="skeleton-row">
                        ${Array(colCount).fill('<td><div class="skeleton-line"></div></td>').join('')}
                    </tr>
                `).join('');
                tableBody.insertAdjacentHTML('beforeend', skeletonRows);
            } else {
                tableBody.querySelectorAll('.skeleton-row').forEach(tr => tr.remove());
            }
        };

        let filterTimeout;
        const applyGenericFilters = () => {
            clearTimeout(filterTimeout);

            // खोज्नुहोस् बटनमा लोडिङ स्पिनर थप्ने र बटनलाई निष्क्रिय बनाउने
            const btnIcon = searchBtn ? searchBtn.querySelector('i') : null;
            if (searchBtn && btnIcon) {
                btnIcon.className = 'fa-solid fa-spinner fa-spin';
                searchBtn.disabled = true;
            }

            toggleSkeleton(true);

            filterTimeout = setTimeout(() => {
                toggleSkeleton(false);
                processFiltering();

                // फिल्टरिङ सकिएपछि बटनलाई साविककै अवस्थामा फर्काउने
                if (searchBtn && btnIcon) {
                    btnIcon.className = 'fa-solid fa-magnifying-glass';
                    searchBtn.disabled = false;
                }
            }, 600);
        };

        const processFiltering = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const role = urlParams.get('role') || 'superadmin';
            const userOffice = sessionStorage.getItem('user_ministry');
            const userLocal = sessionStorage.getItem('user_local_level');

            const rows = tableBody.querySelectorAll('tr:not(.skeleton-row):not(.no-data-row)');
            let visibleCount = 0;
            const globalTerm = globalSearchInput ? globalSearchInput.value.trim().toLowerCase() : "";
            
            rows.forEach(row => {
                let isMatch = true;
                let globalMatch = globalTerm === "" || row.textContent.toLowerCase().includes(globalTerm);

                // 'office' रोलका लागि आफ्नो कार्यालय वा मन्त्रालयको डाटा मात्र देखाउने प्रतिबन्ध
                if (role === 'office' && userOffice) {
                    const instName = row.cells[3] ? row.cells[3].textContent.trim() : "";
                    const ministryName = row.cells[4] ? row.cells[4].textContent.trim() : "";
                    if (instName !== userOffice && ministryName !== userOffice) {
                        isMatch = false;
                    }
                } else if (role === 'local' && userLocal) {
                    // 'local' रोलका लागि आफ्नो पालिकाको डाटा मात्र देखाउने
                    const instName = row.cells[3] ? row.cells[3].textContent.trim() : "";
                    if (!instName.includes(userLocal)) {
                        isMatch = false;
                    }
                }

                filterInputs.forEach(input => {
                    const colIndex = input.getAttribute('data-col');
                    const filterVal = input.value.trim().toLowerCase();

                    if (colIndex !== null && filterVal !== "" && row.cells[colIndex]) {
                        const cellText = row.cells[colIndex].textContent.toLowerCase();
                        if (!cellText.includes(filterVal)) {
                            isMatch = false;
                        }
                    }
                });

                if (isMatch && globalMatch) {
                    row.style.display = "";
                    visibleCount++;
                } else {
                    row.style.display = "none";
                }
            });

            // "डाटा फेला परेन" सन्देश व्यवस्थापन
            let noDataRow = tableBody.querySelector('.no-data-row');
            if (visibleCount === 0) {
                if (!noDataRow) {
                    const colCount = tableBody.closest('table').querySelectorAll('thead th').length;
                    noDataRow = document.createElement('tr');
                    noDataRow.className = 'no-data-row';
                    noDataRow.innerHTML = `<td colspan="${colCount}" style="text-align: center; padding: 3rem; font-weight: bold; color: #e03131; font-size: 1.5rem;"><i class="fa-solid fa-circle-info" style="margin-right: 10px;"></i> खोजिएको डाटा फेला परेन। कृपया फिल्टरका सर्तहरू परिवर्तन गरी पुनः प्रयास गर्नुहोस्।</td>`;
                    tableBody.appendChild(noDataRow);
                }
            } else if (noDataRow) {
                noDataRow.remove();
            }
        };

        filterInputs.forEach(input => {
            input.addEventListener('input', applyGenericFilters);
            input.addEventListener('change', applyGenericFilters);
        });

        if (searchBtn) {
            searchBtn.addEventListener('click', applyGenericFilters);
        }

        if (globalSearchInput) {
            globalSearchInput.addEventListener('input', applyGenericFilters);
        }

        // पेज लोड हुँदा सुरुमै फिल्टर लागू गर्ने (विशेष गरी रोल-आधारित प्रतिबन्धका लागि)
        processFiltering();
    };


    // --- रिपोर्ट टेबलहरूमा डेटा भर्ने (Dynamic Rendering) ---
    const renderReportTables = () => {
        const entries = window.getStoredEntries();

        // साझा टेबल रो (Row) बनाउने फङ्सन
        const createRow = (e, index, type) => {
            if (type === 'summary') {
                return `<tr>
                    <td data-label="नाम">${e.full_name || e.fullname || '-'}</td>
                    <td data-label="पद">${e.post || e.rank || '-'}</td>
                    <td data-label="निकाय">${e.office_name || '-'}</td>
                    <td data-label="मन्त्रालय">${e.ministry || '-'}</td>
                    <td data-label="आ.व.">${e.fiscal_year || '-'}</td>
                    <td data-label="दर्ता नं.">${e.reg_no || e.penalty_reg_no || '-'}</td>
                    <td data-label="मिति">${e.submission_date || e.penalty_submission_date || '-'}</td>
                </tr>`;
            }
            
            // विस्तृत टेबल (Listing) को लागि
            return `<tr>
                <td data-label="सि. नं.">${index + 1}</td>
                <td data-label="नाम">${e.full_name || e.fullname || '-'}</td>
                <td data-label="पद">${e.post || e.rank || '-'}</td>
                <td data-label="कार्यरत सार्वजनिक संस्थाको नाम">${e.office_name || '-'}</td>
                <td data-label="मन्त्रालय/निकाय">${e.ministry || '-'}</td>
                <td data-label="राष्ट्रसेवकको किसिम">${e.employee_type || '-'}</td>
                <td data-label="सेवा/नोकरीको किसिम">${e.service_type || '-'}</td>
                <td data-label="सम्बन्धित आ.व.">${e.fiscal_year || '-'}</td>
                <td data-label="सम्पत्ति विवरण दर्ता नं.">${e.reg_no || e.penalty_reg_no || '-'}</td>
                <td data-label="सम्पत्ति विवरण दर्ता मिति">${e.submission_date || e.penalty_submission_date || '-'}</td>
                <td data-label="मोबाइल नं.">${e.mobile_no || '-'}</td>
                <td data-label="तथ्याङ्क प्रविष्टि गर्ने">${e.data_entry_person || '-'}</td>
                <td data-label="कैफियत">${e.remarks || '-'}</td>
            </tr>`;
        };
        
        // १. सबै राष्ट्रसेवकको रिपोर्ट (Listing Report)
        const allEmpBody = document.getElementById('all-employees-report-body');
        if (allEmpBody) {
            if (entries.length === 0) {
                allEmpBody.innerHTML = `<tr><td colspan="17" style="text-align:center;">कुनै डाटा फेला परेन।</td></tr>`;
            } else {
                // यो टेबलमा १७ वटा कोलम भएकोले यसलाई छुट्टै ह्यान्डल गरिएको छ
                allEmpBody.innerHTML = entries.map((e, index) => `
                    <tr>
                        <td data-label="सि. नं.">${index + 1}</td>
                        <td data-label="नाम">${e.full_name || e.fullname || '-'}</td>
                        <td data-label="पद">${e.post || e.rank || '-'}</td>
                        <td data-label="कार्यरत सार्वजनिक संस्थाको नाम">${e.office_name || '-'}</td>
                        <td data-label="मन्त्रालय/निकाय">${e.ministry || '-'}</td>
                        <td data-label="राष्ट्रसेवकको किसिम">${e.employee_type || '-'}</td>
                        <td data-label="सेवा/नोकरीको किसिम">${e.service_type || '-'}</td>
                        <td data-label="सम्बन्धित आ.व.">${e.fiscal_year || '-'}</td>
                        <td data-label="सम्पत्ति विवरण पेश गरेको मिति">${e.submission_date || '-'}</td>
                        <td data-label="सम्पत्ति विवरण समयमा पेश गरे/नगरेको">${e.on_time || (e.within_60_days === 'yes' ? 'हो' : 'होइन')}</td>
                        <td data-label="जरीवाना तिरी सम्पत्ति विवरण पेश गरेको मिति">${e.fine_date || '-'}</td>
                        <td data-label="जरीवाना तिरी पेश गरेको सम्पत्ति विवरण दर्ता नं.">-</td>
                        <td data-label="जरीवाना तिरेको बैंकको नाम र शाखा">-</td>
                        <td data-label="जरीवानाको भौचर अ.दु.अ. आयोगमा पठाएको पत्रको च नं">-</td>
                        <td data-label="जरीवानाको भौचर अ.दु.अ. आयोगमा पठाएको पत्रको मिति">-</td>
                        <td data-label="तथ्याङ्क प्रविष्टि गर्नेको नाम, पद र मोबाइल नं.">${e.data_entry_person || '-'}</td>
                        <td data-label="कैफियत">${e.remarks || '-'}</td>
                    </tr>
                `).join('');
            }
        }

        // २. विशिष्ट रिपोर्टहरू (Filter by form_type)
        const reportMappings = [
            { id: 'initial-60-body', type: 'new_appointment_60' },
            { id: 'annual-60-body', type: 'annual_end_60' },
            { id: 'special-30-body', type: 'special_30' },
            { id: 'fine-paid-report-body', type: 'penalty_payment' },
            { id: 'non-in-time-report-body', type: 'non_in_time' }
        ];

        reportMappings.forEach(map => {
            const tableBody = document.getElementById(map.id);
            if (tableBody) {
                const filtered = entries.filter(e => e.form_type === map.type);
                tableBody.innerHTML = filtered.length > 0 
                    ? filtered.map((e, i) => createRow(e, i)).join('')
                    : `<tr><td colspan="13" style="text-align:center;">डाटा उपलब्ध छैन।</td></tr>`;
            }
        });

        // ३. जिल्लागत रिपोर्ट (Summary Report)
        const distBody = document.getElementById('district-report-body');
        if (distBody) {
            // जिल्ला अनुसार डेटा समूहकृत (Aggregation) गर्ने
            const districtStats = entries.reduce((acc, entry) => {
                const d = entry.district || 'अन्य';
                if (!acc[d]) acc[d] = { name: d, orgs: new Set(), servants: 0, onTime: 0, delayed: 0 };
                acc[d].orgs.add(entry.office_name);
                acc[d].servants++;
                if (entry.on_time === 'हो' || entry.within_60_days === 'yes') acc[d].onTime++;
                else acc[d].delayed++;
                return acc;
            }, {});

            if (Object.keys(districtStats).length === 0) {
                distBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">डाटा उपलब्ध छैन।</td></tr>`;
            } else {
                distBody.innerHTML = Object.values(districtStats).map(d => `
                    <tr>
                        <td data-label="जिल्लाको नाम">${d.name}</td>
                        <td data-label="जम्मा निकाय">${d.orgs.size}</td>
                        <td data-label="जम्मा राष्ट्रसेवक">${d.servants}</td>
                        <td data-label="समयमा बुझाउने">${d.onTime}</td>
                        <td data-label="बुझाउन बाँकी">${d.delayed}</td>
                    </tr>
                `).join('');
            }
        }
    };

    // पहिले डेटा रेन्डर गर्ने, त्यसपछि फिल्टरहरू सक्रिय गर्ने
    renderReportTables();
    initGenericTableFilters();

    // User Management logic for Admin role
    const initUserManagementLogic = () => {
        const userTableBody = document.getElementById('user-management-body');
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') || 'superadmin';
        const userMin = sessionStorage.getItem('user_ministry');

        if (userTableBody && role === 'admin' && userMin) {
            const rows = userTableBody.querySelectorAll('tr');
            rows.forEach(row => {
                // टेबलको प्रत्येक पङ्क्तिमा एडमिनको निकायको नाम छ कि छैन भनेर जाँच गर्ने
                let rowMinistryMatch = false;
                Array.from(row.cells).forEach(cell => {
                    if (cell.textContent.trim() === userMin) rowMinistryMatch = true;
                });

                // यदि म्याच भएन भने उक्त पङ्क्ति लुकाउने
                if (!rowMinistryMatch) {
                    row.style.display = 'none';
                }
            });

            // नयाँ प्रयोगकर्ता थप्ने फारममा मन्त्रालय छनौटलाई रोक्का (Disable) गर्ने
            const userFormMinSelect = document.getElementById('user-form-ministry');
            if (userFormMinSelect) {
                userFormMinSelect.value = userMin;
                userFormMinSelect.disabled = true;
                
                // Disabled select बाट डाटा नजाने हुनाले एउटा hidden input थप्ने
                const hiddenMinInput = document.createElement('input');
                hiddenMinInput.type = 'hidden';
                hiddenMinInput.name = 'ministry';
                hiddenMinInput.value = userMin;
                userFormMinSelect.parentNode.appendChild(hiddenMinInput);
            }
        }
    };

    initUserManagementLogic();

    // Sidebar Toggle Logic for Mobile
    const initMobileSidebar = () => {
        const sidebar = document.querySelector('.sidebar');
        const mobileToggle = document.getElementById('mobile-toggle');
        
        // Overlay बनाउने (यदि पहिले नै छैन भने)
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }

        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            });

            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
    };

    initMobileSidebar();

    updateDashboardStats();
    initCharts();
});