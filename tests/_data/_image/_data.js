module.exports = [
  {
    latex: "![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png)",
    html: "<div><figure style=\"text-align: center\"><img src=\"https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png\" alt=\"original image\" data-align=\"center\"></figure></div>",
    html_notCenterImages: "<div><figure><img src=\"https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png\" alt=\"original image\"></figure></div>",
  },
  {
    latex: "![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width=10%}",
    html: "<div><figure style=\"text-align: center\"><img src=\"https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png\" alt=\"original image\" width=\"10%\" data-align=\"center\" style=\"width: 10%;\"></figure></div>",
    html_notCenterImages: `<div><figure><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="10%" style="width: 10%;"></figure></div>`
  },  
  {
    latex: "![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width=30px, align=\"left\"}",
    html: `<div><figure style="text-align: left"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="30px" data-align="left" style="width: 30px;"></figure></div>`,
    html_notCenterImages: `<div><figure style="text-align: left"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="30px" data-align="left" style="width: 30px;"></figure></div>`
  },  
  {
    latex: `![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px", right}`,
    html: `<div><figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure></div>`,
    html_notCenterImages: `<div><figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure></div>`
  },  
  {
    latex: `test
![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px", right}`,
    html: `<div>test<br>
<figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure></div>`,
    html_notCenterImages: `<div>test<br>
<figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure></div>`
  },  
  {
    latex: `test1
![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px", right}
test2`,
    html: `<div>test1<br>
<figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure><br>
test2</div>`,
    html_notCenterImages: `<div>test1<br>
<figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure><br>
test2</div>`
  },
  {
    latex: `test1![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px", right}
test2`,
    html: `<div>test1<img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" style="width: 50px;height: 40px;"><br>
test2</div>`,
    html_notCenterImages: `<div>test1<img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" style="width: 50px;height: 40px;"><br>
test2</div>`
  },  
  {
    latex: `![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px"}test2`,
    html: `<div><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" style="width: 50px;height: 40px;">test2</div>`,
    html_notCenterImages: `<div><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" style="width: 50px;height: 40px;">test2</div>`
  },  
  // {
  //   latex: ``,
  //   html: ``,
  //   html_notCenterImages: ``
  // },
];
