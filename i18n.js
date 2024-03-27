// i18n.js
import { I18n } from "i18n-js";
// import * as Localization from "expo-localization";

const translations = {
  en: {
    welcome: "Welcome to GhostChat",
    username: "Username",
    password: "Password",
    confirmpassword: "Confirm Password",
    enablebiometrics: "Enable Biometrics",
    register: "Register",
    goToLogin: "Go Back to Login",
    home: "Home",
    settings: "Settings",
    contacts: "Contacts",
    login: "Login",
    changeusername: "Change Username",
    changelanguage: "Change Language",
    logout: "Logout",
    deleteaccount: "Delete Account",
    goback: "Go Back",
    confirmlogout: "Are you sure you want to logout?",
    confirmLogouttitle: "Confirm Logout",
    cancel: "Cancel",
    save: "Save",
    selectlanguage: "Select Language",
    chinese: "Chinese",
    english: "English",
    ok: "Ok",
    warning: "Warning",
    warnings:
      "This will delete your account and all your contacts. Do you want to continue?",
    yes: "Yes",
    no: "No",
    newUsernamePlaceholder: "Please enter a new username",
    activechat: "Active Chat",
    unavailable: "Unavailable",
    deviceNotSupported: "Your device does not support biometrics",
    noBiometrics: "No Biometrics",
    setBiometrics:
      "Please set up biometric authentication in your device settings",
    disableBiometricsTitle: "Disable Biometrics",
    disableBiometricsMessage: "Are you sure you want to disable biometrics?",
    biometricsDisabledConfirmation: "Biometrics has been disabled",
    enableBiometricsTitle: "Enable Biometrics",
    enableBiometricsMessage: "Are you sure you want to enable biometrics?",
    authenticatePrompt: "please certify",
    fallbackLabel: "Enter Password",
    biometricsEnabledConfirmation: "Biometrics has been enabled",
    authenticationFailedTitle: "Authentication Failed",
    authenticationFailedMessage: "Unable to pass the recognition",
    biometrics: "Biometrics",
    loginWithBiometrics: "Login with Biometrics",
  },

  zh: {
    welcome: "欢迎来到GhostChat",
    username: "用户名",
    password: "密码",
    confirmpassword: "确认密码",
    enablebiometrics: "启用生物识别技术",
    register: "注册",
    goToLogin: "返回登录页面",
    home: "主页",
    settings: "设置",
    contacts: "联系人",
    login: "登录",
    changeusername: "更改用户名",
    changelanguage: "更改语言",
    logout: "退出",
    deleteaccount: "删除账户",
    goback: "返回",
    confirmlogout: "你确认退出账户？",
    confirmLogouttitle: "退出账户",
    cancel: "取消",
    save: "保存",
    selectlanguage: "选择语言",
    chinese: "中文",
    english: "英文",
    ok: "确认",
    warning: "警告",
    warnings: "这将删除您的帐户和所有联系人。 你想继续吗？",
    yes: "是",
    no: "否",
    newUsernamePlaceholder: "请输入新的用户名",
    activechat: "当前聊天",
    unavailable: "生物识别不可用",
    deviceNotSupported: "你的设备不支持生物识别技术",
    noBiometrics: "没有生物识别",
    setBiometrics: "请在你的设备设置中设置生物识别认证",
    disableBiometricsTitle: "禁用生物识别",
    disableBiometricsMessage: "你确定要禁用生物识别吗？",
    biometricsDisabledConfirmation: "生物识别已禁用",
    enableBiometricsTitle: "启用生物识别",
    enableBiometricsMessage: "你确定要启用生物识别吗？",
    authenticatePrompt: "请认证",
    fallbackLabel: "请输入密码",
    biometricsEnabledConfirmation: "生物识别已启用",
    authenticationFailedTitle: "认证失败",
    authenticationFailedMessage: "无法通过认证",
    biometrics: "生物识别",
    loginWithBiometrics: "使用生物识别登录",
  },
};

const i18n = new I18n(translations);

// Enable fallbacks to English if translations in the current locale are not available
i18n.fallbacks = true;

// Set the default locale to English
i18n.defaultLocale = "en";

// Set the current locale, this could be dynamically determined
i18n.locale = "en"; // You might want to set this according to the user preference

i18n.changeLanguage = (languageCode) => {
  i18n.locale = languageCode;
};

export default i18n;
