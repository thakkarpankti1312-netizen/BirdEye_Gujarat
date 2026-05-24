import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({

  resources: {

    en: {
      translation: {

        upload: "Upload Bird Image",
        drag: "Drag & drop your bird image",
        browse: "or click to browse — PNG / JPG",
        analyzing: "Analyzing Bird...",
        identifying: "Our AI is identifying the species",
        accuracy: "Accuracy",
        detection: "Detection Complete",
        showInfo: "Show Bird Information",
        hideInfo: "Hide Bird Information",
        rareAlert: "Rare Bird Alert",
        rareMessage:
          "This is a rare/protected bird species found in Gujarat.",

      },
    },

    gu: {
      translation: {

        upload: "પક્ષીની તસવીર અપલોડ કરો",
        drag: "પક્ષીની તસવીર અહીં મૂકો",
        browse: "અથવા PNG / JPG પસંદ કરો",
        analyzing: "પક્ષી ઓળખાઈ રહ્યું છે...",
        identifying: "અમારું AI પક્ષીની ઓળખ કરી રહ્યું છે",
        accuracy: "ચોકસાઈ",
        detection: "ઓળખ પૂર્ણ",
        showInfo: "પક્ષીની માહિતી જુઓ",
        hideInfo: "માહિતી છુપાવો",
        rareAlert: "દુર્લભ પક્ષી ચેતવણી",
        rareMessage:
          "આ ગુજરાતમાં મળતું દુર્લભ/સંરક્ષિત પક્ષી છે.",

      },
    },

    hi: {
      translation: {

        upload: "पक्षी की तस्वीर अपलोड करें",
        drag: "पक्षी की तस्वीर यहाँ डालें",
        browse: "या PNG / JPG चुनें",
        analyzing: "पक्षी की पहचान हो रही है...",
        identifying: "हमारा AI पक्षी की पहचान कर रहा है",
        accuracy: "सटीकता",
        detection: "पहचान पूरी हुई",
        showInfo: "पक्षी की जानकारी दिखाएं",
        hideInfo: "जानकारी छुपाएं",
        rareAlert: "दुर्लभ पक्षी चेतावनी",
        rareMessage:
          "यह गुजरात में पाया जाने वाला दुर्लभ/संरक्षित पक्षी है।",

      },
    },

  },

  lng: "en",

  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },

});

export default i18n;