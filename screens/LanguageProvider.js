// LanguageProvider.js
import React, { createContext, useState, useContext } from "react";
import i18n from "../i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale);

  const changeLanguage = (languageCode) => {
    i18n.locale = languageCode;
    setLocale(languageCode); //
  };

  return (
    //Children represent other components in the application wrapped by LanguageProvider.
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
