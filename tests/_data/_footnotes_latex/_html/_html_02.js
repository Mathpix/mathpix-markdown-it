const htmlContent_autonumbers = "<div>Automatically-generated footnote marker 1 <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup>.</div>\n" +
  "<div>Footnote marker set to 11 <sup class=\"footnote-ref\"><a href=\"#fn2\" id=\"fnref2\">[11]</a></sup>.</div>\n" +
  "<div>Automatically-generated footnote marker 2 <sup class=\"footnote-ref\"><a href=\"#fn3\" id=\"fnref3\">[2]</a></sup>.</div>\n" +
  "<div>Automatically-generated footnote marker 3 <sup class=\"footnote-ref\"><a href=\"#fn4\" id=\"fnref4\">[3]</a></sup> </div>\n" +
  "<div>Automatically-generated footnote markers 4 <sup class=\"footnote-ref\">[4]</sup>, 5<sup class=\"footnote-ref\"><a href=\"#fn6\" id=\"fnref6\">[5]</a></sup></div>\n" +
  "<div>Marker set to 20 <sup class=\"footnote-ref\"><a href=\"#fn7\" id=\"fnref7\">[20]</a></sup> </div>\n" +
  "<div></div>\n" +
  "<div></div>\n" +
  "<hr class=\"footnotes-sep\">\n" +
  "<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n" +
  "<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n" +
  "<li id=\"fn1\" class=\"footnote-item\"><div>First footnote should be 1 <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn2\" class=\"footnote-item\" value=\"11\"><div>First footnote should be 11 <a href=\"#fnref2\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn3\" class=\"footnote-item\" value=\"2\"><div>First footnote should be 2 <a href=\"#fnref3\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn4\" class=\"footnote-item\"><div>Text of footnote with marker 3. <a href=\"#fnref4\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn6\" class=\"footnote-item\" value=\"5\"><div>Text of last footnote marker <a href=\"#fnref6\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn6\" class=\"footnote-item\" value=\"5\"><div>Text of last footnote marker <a href=\"#fnref6\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn7\" class=\"footnote-item\" value=\"20\"><div>Text of footnote with marker 20 <a href=\"#fnref7\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "</ol>\n" +
  "</section>";

const htmlContent = "<div>Automatically-generated footnote marker 1 <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup>.</div>\n" +
  "<div>Footnote marker set to 11 <sup class=\"footnote-ref\"><a href=\"#fn2\" id=\"fnref2\">[11]</a></sup>.</div>\n" +
  "<div>Automatically-generated footnote marker 2 <sup class=\"footnote-ref\"><a href=\"#fn3\" id=\"fnref3\">[2]</a></sup>.</div>\n" +
  "<div>Automatically-generated footnote marker 3 <sup class=\"footnote-ref\"><a href=\"#fn4\" id=\"fnref4\">[3]</a></sup> </div>\n" +
  "<div>Automatically-generated footnote markers 4 <sup class=\"footnote-ref\">[4]</sup>, 5<sup class=\"footnote-ref\"><a href=\"#fn6\" id=\"fnref6\">[5]</a></sup></div>\n" +
  "<div>Marker set to 20 <sup class=\"footnote-ref\"><a href=\"#fn7\" id=\"fnref7\">[20]</a></sup> </div>\n" +
  "<div></div>\n" +
  "<div></div>\n" +
  "<hr class=\"footnotes-sep\">\n" +
  "<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n" +
  "<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n" +
  "<li id=\"fn1\" class=\"footnote-item\"><div>First footnote should be 1 <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn2\" class=\"footnote-item\" value=\"11\"><div>First footnote should be 11 <a href=\"#fnref2\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn3\" class=\"footnote-item\" value=\"2\"><div>First footnote should be 2 <a href=\"#fnref3\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "</ol>\n" +
  "<ol class=\"footnotes-list\" style=\"padding-left: 20px; margin-bottom: 0;\">\n" +
  "<li id=\"fn4\" class=\"footnote-item\" style=\"list-style-type: none;\"><div>Text of footnote with marker 3. <a href=\"#fnref4\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn6\" class=\"footnote-item\" style=\"list-style-type: none;\"><div>Text of last footnote marker <a href=\"#fnref6\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn6\" class=\"footnote-item\" style=\"list-style-type: none;\"><div>Text of last footnote marker <a href=\"#fnref6\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "</ol>\n" +
  "<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n" +
  "<li id=\"fn7\" class=\"footnote-item\" value=\"20\"><div>Text of footnote with marker 20 <a href=\"#fnref7\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "</ol>\n" +
  "</section>";

module.exports = {
  htmlContent,
  htmlContent_autonumbers
};
