module.exports = [
  {
    latex: '\\pagebreak',
    html: ``,
    showPageBreaks: `<div>
<div class="page-break d-flex" style="display:flex; font-size:0.9rem;"><hr style="flex-grow:1; border:0; border-top:0.025rem solid #999; margin:auto"/><span style="padding-left:0.5rem; padding-right:0.5rem; color:#999;">Page Break</span><hr style="flex-grow:1; border:0; border-top:0.025rem solid #999; margin:auto"/></div></div>`
  },  
  {
    latex: '\\pagebreak 456',
    html: `<div>
 456</div>`,
    showPageBreaks: `<div>
<div class="page-break d-flex" style="display:flex; font-size:0.9rem;"><hr style="flex-grow:1; border:0; border-top:0.025rem solid #999; margin:auto"/><span style="padding-left:0.5rem; padding-right:0.5rem; color:#999;">Page Break</span><hr style="flex-grow:1; border:0; border-top:0.025rem solid #999; margin:auto"/></div> 456</div>`
  },  
  {
    latex: '123 \\pagebreak 456',
    html: `<div>123  456</div>`,
    showPageBreaks: `<div>123 <div class="page-break d-flex" style="display:flex; font-size:0.9rem;"><hr style="flex-grow:1; border:0; border-top:0.025rem solid #999; margin:auto"/><span style="padding-left:0.5rem; padding-right:0.5rem; color:#999;">Page Break</span><hr style="flex-grow:1; border:0; border-top:0.025rem solid #999; margin:auto"/></div> 456</div>`
  },
];
