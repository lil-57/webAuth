export const emailRegex = new RegExp(
  // début de chaîne
  "^" +
    // partie locale
    "(?:" +
    // 1) un dot-atom
    "(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+" +
    "(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)" +
    "|" +
    // 2) ou un quoted-string
    '"(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]' +
    '|\\\\[\\x01-\\x09\\x0B\\x0C\\x0E-\\x7F])*"' +
    ")" +
    // arobase
    "@" +
    // domaine (nom de domaine classique ou literal entre crochets)
    "(?:" +
    // a) nom de domaine : labels + extension
    "(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+" +
    "[A-Za-z]{2,}" +
    "|" +
    // b) ou adresse IP littérale [IPv4 ou IPv6]
    "\\[" +
    "(?:" +
    // IPv4
    "(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)" +
    "(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)){3}" +
    "|" +
    // IPv6 (simplifié pour couvrir la majorité des cas)
    "IPv6:[A-Fa-f0-9:.]+" +
    ")" +
    "\\]" +
    ")" +
    "$",
)
