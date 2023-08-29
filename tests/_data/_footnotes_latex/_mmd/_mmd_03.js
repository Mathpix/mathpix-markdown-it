module.exports = "MD footnote marker [^1] should be 1\n" +
  "[^1]: MD footnote text should be 1\n" +
  "\n" +
  "MD inline footnote ^[MD Automatically generated footnote markers work fine!] should be 2.\n" +
  "\n" +
  "I'm writing to demonstrate use of automatically-generated footnote markers\\footnote{Automatically generated footnote markers work fine!} and footnotes which use a marker value provided to the command\\footnote[42]{...is that the answer to everything?}.\n" +
  "\n" +
  "\\footnote[-42]{...is that the answer to everything?}.\n" +
  "\n" +
  "MD inline footnote ^[MD Automatically generated footnote markers work fine!] should be 4.\n" +
  "\n" +
  "\\footnote[0]{...0 is that the answer to everything?}.\n" +
  "\n" +
  "\\footnote[0]{q...is that the answer to everything?}.\n" +
  "\n" +
  "Automatically-generated footnote marker\\footnote{Now, footnote should be 5}.\n" +
  "\n" +
  "Without text \\footnote{} should be 6\n" +
  "\n" +
  "[^2] MD footnote [^2] \n" +
  "[^2]: MD footnote text should be 7\n" +
  "\n" +
  "\n" +
  "\n"
