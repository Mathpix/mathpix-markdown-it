module.exports = [
  {
    html:     '<div><p>Hello <b>there</b></p></div>',
    dirty:    '<div><p>Hello <b>there</b></p></div>',
    discard:  `<div><p>Hello <b>there</b></p></div>`,
    sanitize: '<div><p>Hello <b>there</b></p></div>'

  },
  {
    html:     `<div><wiggly worms="ewww">hello</wiggly></div>`,
    dirty:    `<div><wiggly worms="ewww">hello</wiggly></div>`,
    discard:  `<div>hello</div>`,
    sanitize: '<div>&lt;wiggly&gt;hello&lt;/wiggly&gt;</div>'
  },
  {
    html:     `<div><wiggly>Hello</wiggly></div>`,
    dirty:    `<div><wiggly>Hello</wiggly></div>`,
    discard:  `<div>Hello</div>`,
    sanitize: '<div>&lt;wiggly&gt;Hello&lt;/wiggly&gt;</div>'
  },
  {
    html:     `<a href="foo.html" whizbang="whangle">foo</a>`,
    dirty:    `<div><a href="foo.html" whizbang="whangle">foo</a></div>`,
    discard:  `<div><a href="foo.html">foo</a></div>`,
    sanitize: '<div><a href="foo.html">foo</a></div>'
  },
  {
    html:     `Text before html tag<html><div><p>Hello <b>there</b></p></div></html>Text after html tag!`,
    dirty:    `<div>Text before html tag<html><div><p>Hello <b>there</b></p></div></html>Text after html tag!</div>`,
    discard:  `<div>Text before html tag<div><p>Hello <b>there</b></p></div>Text after html tag!</div>`,
    sanitize: '<div>Text before html tag&lt;html&gt;<div><p>Hello <b>there</b></p></div>&lt;/html&gt;Text after html tag!</div>'
  },
  {
    html:     `Text before div tag<div><p>Hello <b>there</b></p></div>Text after div tag!`,
    dirty:    `<div>Text before div tag<div><p>Hello <b>there</b></p></div>Text after div tag!</div>`,
    discard:  `<div>Text before div tag<div><p>Hello <b>there</b></p></div>Text after div tag!</div>`,
    sanitize: '<div>Text before div tag<div><p>Hello <b>there</b></p></div>Text after div tag!</div>'
  },
  {
    html:     `<blue><red><green>Cheese</green></red></blue>`,
    dirty:    `<div><blue><red><green>Cheese</green></red></blue></div>`,
    discard:  `<div>Cheese</div>`,
    sanitize: '<div>&lt;blue&gt;&lt;red&gt;&lt;green&gt;Cheese&lt;/green&gt;&lt;/red&gt;&lt;/blue&gt;</div>'
  },
  {
    html:     `<img src="foo.jpg"><p>Whee<p>Again<p>Wow<b>cool</b>`,
    dirty:    `<div><img src="foo.jpg"><p>Whee<p>Again<p>Wow<b>cool</b></div>`,
    discard:  `<div><img src="foo.jpg" /><p>Whee<p>Again<p>Wow<b>cool</b></div>`,
    sanitize: '<div><img src="foo.jpg" /><p>Whee<p>Again<p>Wow<b>cool</b></div>'
  },
  {
    html:     `<a href="http://google.com">google</a><a href="https://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href="javascript:alert(0)">javascript</a>`,
    dirty:    `<div><a href="http://google.com">google</a><a href="https://google.com">https google</a><a href="ftp://example.com">ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a href="javascript:alert(0)">javascript</a></div>`,
    discard:  `<div><a href="http://google.com">google</a><a href="https://google.com">https google</a><a>ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a>javascript</a></div>`,
    sanitize: '<div><a href="http://google.com">google</a><a href="https://google.com">https google</a><a>ftp</a><a href="mailto:test@test.com">mailto</a><a href="/relative.html">relative</a><a>javascript</a></div>'
  },
  {
    html:     `<script>alert("ruhroh!");</script><p>Paragraph</p>`,
    dirty:    `<script>alert("ruhroh!");</script><p>Paragraph</p>`,
    discard:  `<p>Paragraph</p>`,
    sanitize: '&lt;script&gt;alert("ruhroh!");&lt;/script&gt;<p>Paragraph</p>'
  },
  {
    html:     `<style>.foo { color: blue; }</style><p>Paragraph</p>`,
    dirty:    `<style>.foo { color: blue; }</style><p>Paragraph</p>`,
    discard:  `<p>Paragraph</p>`,
    sanitize: '&lt;style&gt;.foo { color: blue; }&lt;/style&gt;<p>Paragraph</p>'
  },
  {
    html:     `<textarea>Nifty</textarea><p>Paragraph</p>`,
    dirty:    `<div><textarea>Nifty</textarea><p>Paragraph</p></div>`,
    discard:  `<div>Nifty<p>Paragraph</p></div>`,
    sanitize: '<div>&lt;textarea&gt;Nifty&lt;/textarea&gt;<p>Paragraph</p></div>'
  },
  {
    html:     `<select><option>one</option><option>two</option></select><p>Paragraph</p>`,
    dirty:    `<div><select><option>one</option><option>two</option></select><p>Paragraph</p></div>`,
    discard:  `<div>onetwo<p>Paragraph</p></div>`,
    sanitize: '<div>&lt;select&gt;&lt;option&gt;one&lt;/option&gt;&lt;option&gt;two&lt;/option&gt;&lt;/select&gt;<p>Paragraph</p></div>'
  },
  {
    html:     `<p>Paragraph<textarea>Nifty</textarea></p>`,
    dirty:    `<p>Paragraph<textarea>Nifty</textarea></p>`,
    discard:  `<p>Paragraph</p>`,
    sanitize: '<p>Paragraph&lt;textarea&gt;Nifty&lt;/textarea&gt;</p>'
  },
  {
    html:     `<fibble>Nifty</fibble><p>Paragraph</p>`,
    dirty:    `<div><fibble>Nifty</fibble><p>Paragraph</p></div>`,
    discard:  `<div>Nifty<p>Paragraph</p></div>`,
    sanitize: '<div>&lt;fibble&gt;Nifty&lt;/fibble&gt;<p>Paragraph</p></div>'
  },
  {
    html:     `<fibble>Ni<em>f</em>ty</fibble><p>Paragraph</p>`,
    dirty:    `<div><fibble>Ni<em>f</em>ty</fibble><p>Paragraph</p></div>`,
    discard:  `<div>Ni<em>f</em>ty<p>Paragraph</p></div>`,
    sanitize: '<div>&lt;fibble&gt;Ni<em>f</em>ty&lt;/fibble&gt;<p>Paragraph</p></div>'
  },
  {
    html:     `<textarea>Nifty</textarea><p>Paragraph</p>`,
    dirty:    `<div><textarea>Nifty</textarea><p>Paragraph</p></div>`,
    discard:  `<div>Nifty<p>Paragraph</p></div>`,
    sanitize: '<div>&lt;textarea&gt;Nifty&lt;/textarea&gt;<p>Paragraph</p></div>'
  },
  {
    html:     `<a name="&lt;silly&gt;">&lt;Kapow!&gt;</a>`,
    dirty:    `<div><a name="&lt;silly&gt;">&lt;Kapow!&gt;</a></div>`,
    discard:  `<div><a name="&lt;silly&gt;">&lt;Kapow!&gt;</a></div>`,
    sanitize: '<div><a name="&lt;silly&gt;">&lt;Kapow!&gt;</a></div>'
  },
  {
    html:     `<p><!-- Blah blah -->Whee</p>`,
    dirty:    `<p><!-- Blah blah -->Whee</p>`,
    discard:  `<p>Whee</p>`,
    sanitize: '<p>Whee</p>'
  },
  {
    html:     `<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Hax</a>`,
    dirty:    `<div><a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Hax</a></div>`,
    discard:  `<div><a>Hax</a></div>`,
    sanitize: '<div><a>Hax</a></div>'
  },
  {
    html:     `<a href="JAVASCRIPT:alert('foo')">Hax</a>`,
    dirty:    `<div><a href="JAVASCRIPT:alert('foo')">Hax</a></div>`,
    discard:  `<div><a>Hax</a></div>`,
    sanitize: `<div><a>Hax</a></div>`
  },
  {
    html:     `<a href="java<!-- -->script:alert('foo')">Hax</a>`,
    dirty:    `<div><a href="java<!-- -->script:alert('foo')">Hax</a></div>`,
    discard:  `<div><a>Hax</a></div>`,
    sanitize: `<div><a>Hax</a></div>`
  },
  {
    html:     `<a href="awesome.html#this:stuff">Hi</a>`,
    dirty:    `<div><a href="awesome.html#this:stuff">Hi</a></div>`,
    discard:  `<div><a href="awesome.html#this:stuff">Hi</a></div>`,
    sanitize: '<div><a href="awesome.html#this:stuff">Hi</a></div>'
  },
  //'<a href="java\0&#14;\t\r\n script:alert(\'foo\')">Hax</a>'
  // {
  //   html:    '<a href="java\0&#14;\t\r\n script:alert(\'foo\')">Hax</a>',
  //   dirty:    ``,
  //   discard: ``
  // },
  // // '<a href="java&#0000001script:alert(\'foo\')">Hax</a>'
  // '<a href="java&#0000000script:alert(\'foo\')">Hax</a>'
  {
    html:     '<a href="http://google.com/">Hi</a>',
    dirty:    `<div><a href="http://google.com/">Hi</a></div>`,
    discard:  `<div><a href="http://google.com/">Hi</a></div>`,
    sanitize: '<div><a href="http://google.com/">Hi</a></div>'
  },
  {
    html:     '<a href="java&#0000001script:alert(\'foo\')">Hax</a>',
    dirty:    `<div><a href="java&#0000001script:alert('foo')">Hax</a></div>`,
    discard:  `<div><a>Hax</a></div>`,
    sanitize: `<div><a>Hax</a></div>`
  },
  {
    html:     '<a href="hello.html">Hi</a>',
    dirty:    `<div><a href="hello.html">Hi</a></div>`,
    discard:  `<div><a href="hello.html">Hi</a></div>`,
    sanitize: '<div><a href="hello.html">Hi</a></div>'
  },
  {
    html:     '<ol><li>Hello world</li></ol>',
    dirty:    `<ol><li>Hello world</li></ol>`,
    discard:  `<ol><li>Hello world</li></ol>`,
    sanitize: '<ol><li>Hello world</li></ol>'
  },
  {
    html:     '<ol foo="foo" bar="bar" baz="baz"><li>Hello world</li></ol>',
    dirty:    `<ol foo="foo" bar="bar" baz="baz"><li>Hello world</li></ol>`,
    discard:  `<ol><li>Hello world</li></ol>`,
    sanitize: '<ol><li>Hello world</li></ol>'
  },
   {
      html:     '<ol><li>Hello world</li></ol>',
      dirty:    `<ol><li>Hello world</li></ol>`,
      discard:  `<ol><li>Hello world</li></ol>`,
      sanitize: '<ol><li>Hello world</li></ol>'
   },
   {
      html:     '<a href="http://somelink">some text</a>',
      dirty:    `<div><a href="http://somelink">some text</a></div>`,
      discard:  `<div><a href="http://somelink">some text</a></div>`,
      sanitize: '<div><a href="http://somelink">some text</a></div>'
   },
   {
      html:     '<p>This is <a href="http://www.linux.org"></a><br/>Linux</p>',
      dirty:    `<p>This is <a href="http://www.linux.org"></a><br/>Linux</p>`,
      discard:  `<p>This is <a href="http://www.linux.org"></a><br />Linux</p>`,
      sanitize: '<p>This is <a href="http://www.linux.org"></a><br />Linux</p>'
   },
   {
      html:     '<IMG SRC= onmouseover="alert(\'XSS\');">',
      dirty:    `<div>&lt;IMG SRC= onmouseover=“alert(‘XSS’);”&gt;</div>`,
      discard:  `<div>&lt;IMG SRC= onmouseover=“alert(‘XSS’);”&gt;</div>`,
      sanitize: `<div>&lt;IMG SRC= onmouseover=“alert(‘XSS’);”&gt;</div>`
   },
   {
      html:     '<table bgcolor="1" align="left" notlisted="0"><img src="1.gif" align="center" alt="not listed too"/></table>',
      dirty:    `<table bgcolor="1" align="left" notlisted="0"><img src="1.gif" align="center" alt="not listed too"/></table>`,
      discard:  `<table bgcolor="1" align="left"><img src="1.gif" align="center" alt="not listed too" /></table>`,
      sanitize: '<table bgcolor="1" align="left"><img src="1.gif" align="center" alt="not listed too" /></table>'
   },
   {
      html:     '<<img src="javascript:evil"/>img src="javascript:evil"/>',
      dirty:    `<div>&lt;<img src="javascript:evil"/>img src=“javascript:evil”/&gt;</div>`,
      discard:  `<div>&lt;<img />img src=“javascript:evil”/&gt;</div>`,
      sanitize: '<div>&lt;<img />img src=“javascript:evil”/&gt;</div>'
   },
   {
      html:     '<a data-target="#test" data-foo="hello">click me</a>',
      dirty:    `<div><a data-target="#test" data-foo="hello">click me</a></div>`,
      discard:  `<div><a>click me</a></div>`,
      sanitize: '<div><a>click me</a></div>'
   },
   {
      html:     '<a data-target="#test" data-my-foo="hello">click me</a>',
      dirty:    `<div><a data-target="#test" data-my-foo="hello">click me</a></div>`,
      discard:  `<div><a>click me</a></div>`,
      sanitize: '<div><a>click me</a></div>'
   },
   {
      html:     '<div>"normal text"</div><script>"this is code"</script>',
      dirty:    `<div>"normal text"</div><script>"this is code"</script>`,
      discard:  `<div>"normal text"</div>`,
      sanitize: '<div>"normal text"</div>&lt;script&gt;"this is code"&lt;/script&gt;'
   },
   {
      html:     '<div>"normal text"</div><style>body { background-image: url("image.test"); }</style>',
      dirty:    `<div>"normal text"</div><style>body { background-image: url("image.test"); }</style>`,
      discard:  `<div>"normal text"</div>`,
      sanitize: '<div>"normal text"</div>&lt;style&gt;body { background-image: url("image.test"); }&lt;/style&gt;'
   },
   {
      html:     '<script>alert("&quot;This is cool but just ironically so I quoted it&quot;")</script>',
      dirty:    `<script>alert("&quot;This is cool but just ironically so I quoted it&quot;")</script>`,
      discard:  ``,
      sanitize: '&lt;script&gt;alert("&amp;quot;This is cool but just ironically so I quoted it&amp;quot;")&lt;/script&gt;'
   },
   {
      html:     '<Archer><Sterling>I am</Sterling></Archer>',
      dirty:    `<div><Archer><Sterling>I am</Sterling></Archer></div>`,
      discard:  `<div>I am</div>`,
      sanitize: '<div>&lt;archer&gt;&lt;sterling&gt;I am&lt;/Sterling&gt;&lt;/Archer&gt;</div>'
   },
   {
      html:     '!<textarea>&lt;/textarea&gt;&lt;svg/onload=prompt`xs`&gt;</textarea>!',
      dirty:    `<div>!<textarea>&lt;/textarea&gt;&lt;svg/onload=prompt<code>xs</code>&gt;</textarea>!</div>`,
      discard:  `<div>!&lt;/textarea&gt;&lt;svg/onload=prompt<code>xs</code>&gt;!</div>`,
      sanitize: '<div>!&lt;textarea&gt;&lt;/textarea&gt;&lt;svg/onload=prompt<code>xs</code>&gt;&lt;/textarea&gt;!</div>'
   },
   {
      html:     '<a href="//cnn.com/example">test</a>',
      dirty:    `<div><a href="//cnn.com/example">test</a></div>`,
      discard:  `<div><a href="//cnn.com/example">test</a></div>`,
      sanitize: '<div><a href="//cnn.com/example">test</a></div>'
   },
   {
      html:     '<a href="/\\cnn.com/example">test</a>',
      dirty:    `<div><a href="/\\cnn.com/example">test</a></div>`,
      discard:  `<div><a href="/\\cnn.com/example">test</a></div>`,
      sanitize: '<div><a href="/\\cnn.com/example">test</a></div>'
   },
   {
      html:     '<a href="\\\\cnn.com/example">test</a>',
      dirty:    `<div><a href="\\\\cnn.com/example">test</a></div>`,
      discard:  `<div><a href="\\\\cnn.com/example">test</a></div>`,
      sanitize: '<div><a href="\\\\cnn.com/example">test</a></div>'
   },
   {
      html:     '<a href="\\/cnn.com/example">test</a>',
      dirty:    `<div><a href="\\/cnn.com/example">test</a></div>`,
      discard:  `<div><a href="\\/cnn.com/example">test</a></div>`,
      sanitize: '<div><a href="\\/cnn.com/example">test</a></div>'
   },
   {
      html:     '<a href="/welcome">test</a>',
      dirty:    `<div><a href="/welcome">test</a></div>`,
      discard:  `<div><a href="/welcome">test</a></div>`,
      sanitize: '<div><a href="/welcome">test</a></div>'
   },
   {
      html:     '<img src="fallback.jpg" srcset="foo.jpg 100w 2x, bar.jpg 200w 1x" />',
      dirty:    `<img src="fallback.jpg" srcset="foo.jpg 100w 2x, bar.jpg 200w 1x" />`,
      discard:  `<img src="fallback.jpg" />`,
      sanitize: '<img src="fallback.jpg" />'
   },
   {
      html:     '<img src="fallback.jpg" srcset="foo.jpg 100w, bar.jpg 200w" />',
      dirty:    `<img src="fallback.jpg" srcset="foo.jpg 100w, bar.jpg 200w" />`,
      discard: `<img src="fallback.jpg" />`,
      sanitize: '<img src="fallback.jpg" />'
   },
   {
      html:     '<img src="fallback.jpg" srcset="foo.jpg 100w, bar.jpg 200w, javascript:alert(1) 100w" />',
      dirty:    `<img src="fallback.jpg" srcset="foo.jpg 100w, bar.jpg 200w, javascript:alert(1) 100w" />`,
      discard:  `<img src="fallback.jpg" />`,
      sanitize: '<img src="fallback.jpg" />'
   },
  {
    html:     '<img src="fallback.jpg" srcset="/upload/f_auto,q_auto:eco,c_fit,w_1460,h_2191/abc.jpg 1460w, /upload/f_auto,q_auto:eco,c_fit,w_1360,h_2041/abc.jpg" />',
    dirty:    `<img src="fallback.jpg" srcset="/upload/f_auto,q_auto:eco,c_fit,w_1460,h_2191/abc.jpg 1460w, /upload/f_auto,q_auto:eco,c_fit,w_1360,h_2041/abc.jpg" />`,
    discard:  `<img src="fallback.jpg" />`,
    sanitize: '<img src="fallback.jpg" />'
  },
  {
    html:     '<span data-<script>alert(1)//>',
    dirty:    `<div>&lt;span data-<script>alert(1)//&gt;</div>`,
    discard:  `<div>&lt;span data-alert(1)//&gt;</div>`,
    sanitize: '<div>&lt;span data-&lt;script&gt;alert(1)//&gt;</div>'

  },
  {
    html:     '<p dir="ltr"><strong>beste</strong><em>testestes</em><s>testestset</s><u>testestest</u></p><ul dir="ltr"> <li><u>test</u></li></ul><blockquote dir="ltr"> <ol> <li><u>​test</u></li><li><u>test</u></li><li style="text-align: right"><u>test</u></li><li style="text-align: justify"><u>test</u></li></ol> <p><u><span style="color:#00FF00">test</span></u></p><p><span style="color:#00FF00"><span style="font-size:36px">TESTETESTESTES</span></span></p></blockquote>',
    dirty:    `<p dir="ltr"><strong>beste</strong><em>testestes</em><s>testestset</s><u>testestest</u></p><ul dir="ltr"> <li><u>test</u></li></ul><blockquote dir="ltr"> <ol> <li><u>​test</u></li><li><u>test</u></li><li style="text-align: right"><u>test</u></li><li style="text-align: justify"><u>test</u></li></ol> <p><u><span style="color:#00FF00">test</span></u></p><p><span style="color:#00FF00"><span style="font-size:36px">TESTETESTESTES</span></span></p></blockquote>`,
    discard:  `<p dir="ltr"><strong>beste</strong><em>testestes</em><s>testestset</s>testestest</p><ul dir="ltr"> <li>test</li></ul><blockquote dir="ltr"> <ol> <li>​test</li><li>test</li><li style="text-align:right">test</li><li style="text-align:justify">test</li></ol> <p><span style="color:#00FF00">test</span></p><p><span style="color:#00FF00"><span style="font-size:36px">TESTETESTESTES</span></span></p></blockquote>`,
    sanitize: '<p dir="ltr"><strong>beste</strong><em>testestes</em><s>testestset</s>&lt;u&gt;testestest&lt;/u&gt;</p><ul dir="ltr"> <li>&lt;u&gt;test&lt;/u&gt;</li></ul><blockquote dir="ltr"> <ol> <li>&lt;u&gt;​test&lt;/u&gt;</li><li>&lt;u&gt;test&lt;/u&gt;</li><li style="text-align:right">&lt;u&gt;test&lt;/u&gt;</li><li style="text-align:justify">&lt;u&gt;test&lt;/u&gt;</li></ol> <p>&lt;u&gt;&lt;span style="color:#00FF00"&gt;test&lt;/span&gt;&lt;/u&gt;</p><p><span style="color:#00FF00"><span style="font-size:36px">TESTETESTESTES</span></span></p></blockquote>'
  },
  {
    html:     '<span style=\'\'></span>',
    dirty:    `<div><span style=''></span></div>`,
    discard: `<div><span></span></div>`,
    sanitize: `<div><span></span></div>`
  },
  {
    html:     '<span style=\'color: blue; text-align: justify\'></span>',
    dirty:    `<div><span style='color: blue; text-align: justify'></span></div>`,
    discard:  `<div><span style="color:blue;text-align:justify"></span></div>`,
    sanitize: `<div><span style="color:blue;text-align:justify"></span></div>`
  },
  {
    html:     '<span style=\'color: yellow; text-align: center; font-family: helvetica\'></span>',
    dirty:    `<div><span style='color: yellow; text-align: center; font-family: helvetica'></span></div>`,
    discard:  `<div><span style="color:yellow;text-align:center;font-family:helvetica"></span></div>`,
    sanitize: `<div><span style="color:yellow;text-align:center;font-family:helvetica"></span></div>`
  },
  {
    html:     '<iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
    dirty:    `<iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>`,
    discard:  `<iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>`,
    sanitize: `<iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>`
  },
  {
    html:     '<iframe src="https://www.embed.vevo.com/USUV71704255"></iframe>',
    dirty:    `<iframe src="https://www.embed.vevo.com/USUV71704255"></iframe>`,
    discard:  `<iframe src="https://www.embed.vevo.com/USUV71704255"></iframe>`,
    sanitize: '<iframe src="https://www.embed.vevo.com/USUV71704255"></iframe>'
  },
  {
    html:     '<iframe src="https://www.foo.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>',
    dirty:    `<iframe src="https://www.foo.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>`,
    discard:  `<iframe src="https://www.foo.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>`,
    sanitize: '<iframe src="https://www.foo.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>'
  },
  {
    html:     '<iframe src="https://zoom.us/embed/c2IlcS7AHxM"></iframe>',
    dirty:    `<iframe src="https://zoom.us/embed/c2IlcS7AHxM"></iframe>`,
    discard:  `<iframe src="https://zoom.us/embed/c2IlcS7AHxM"></iframe>`,
    sanitize: '<iframe src="https://zoom.us/embed/c2IlcS7AHxM"></iframe>'
  },
  {
    html:     '<iframe src="https://www.prefix.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>',
    dirty:    `<iframe src="https://www.prefix.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>`,
    discard:  `<iframe src="https://www.prefix.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>`,
    sanitize: '<iframe src="https://www.prefix.us02web.zoom.us/embed/c2IlcS7AHxM"></iframe>'
  },
  {
    html:     '<iframe src="/foo"></iframe>',
    dirty:    `<iframe src="/foo"></iframe>`,
    discard:  `<iframe src="/foo"></iframe>`,
    sanitize: '<iframe src="/foo"></iframe>'
  },
  {
    html:     '<iframe src="/foo"></iframe><iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
    dirty:    `<iframe src="/foo"></iframe><iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>`,
    discard:  `<iframe src="/foo"></iframe><iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>`,
    sanitize: '<iframe src="/foo"></iframe><iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>'
  },
  {
    html:     '<iframe src="//www.youtube.com/embed/c2IlcS7AHxM"></iframe>',
    dirty:    `<iframe src="//www.youtube.com/embed/c2IlcS7AHxM"></iframe>`,
    discard:  `<iframe src="//www.youtube.com/embed/c2IlcS7AHxM"></iframe>`,
    sanitize: '<iframe src="//www.youtube.com/embed/c2IlcS7AHxM"></iframe>'
  },
  {
    html:     '<iframe name=\"IFRAME\" allowfullscreen=\"true\" sandbox=\"allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation\"></iframe>',
    dirty:    `<iframe name="IFRAME" allowfullscreen="true" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"></iframe>`,
    discard:  `<iframe allowfullscreen="true"></iframe>`,
    sanitize: `<iframe allowfullscreen="true"></iframe>`
  },
  {
    html:     '<q cite=\"http://www.google.com\">HTTP</q><q cite=\"https://www.google.com\">HTTPS</q><q cite=\"mailto://www.google.com\">MAILTO</q><q cite=\"tel://www.google.com\">TEL</q><q cite=\"ftp://www.google.com\">FTP</q><q cite=\"data://www.google.com\">DATA</q><q cite=\"ldap://www.google.com\">LDAP</q><q cite=\"acrobat://www.google.com\">ACROBAT</q><q cite=\"vbscript://www.google.com\">VBSCRIPT</q><q cite=\"file://www.google.com\">FILE</q><q cite=\"rlogin://www.google.com\">RLOGIN</q><q cite=\"webcal://www.google.com\">WEBCAL</q><q cite=\"javascript://www.google.com\">JAVASCRIPT</q><q cite=\"mms://www.google.com\">MMS</q>',
    dirty:    `<div><q cite="http://www.google.com">HTTP</q><q cite="https://www.google.com">HTTPS</q><q cite="mailto://www.google.com">MAILTO</q><q cite="tel://www.google.com">TEL</q><q cite="ftp://www.google.com">FTP</q><q cite="data://www.google.com">DATA</q><q cite="ldap://www.google.com">LDAP</q><q cite="acrobat://www.google.com">ACROBAT</q><q cite="vbscript://www.google.com">VBSCRIPT</q><q cite="file://www.google.com">FILE</q><q cite="rlogin://www.google.com">RLOGIN</q><q cite="webcal://www.google.com">WEBCAL</q><q cite="javascript://www.google.com">JAVASCRIPT</q><q cite="mms://www.google.com">MMS</q></div>`,
    discard:  `<div><q cite="http://www.google.com">HTTP</q><q cite="https://www.google.com">HTTPS</q><q cite="mailto://www.google.com">MAILTO</q><q>TEL</q><q>FTP</q><q cite="data://www.google.com">DATA</q><q>LDAP</q><q>ACROBAT</q><q>VBSCRIPT</q><q>FILE</q><q>RLOGIN</q><q>WEBCAL</q><q>JAVASCRIPT</q><q>MMS</q></div>`,
    sanitize: '<div><q cite="http://www.google.com">HTTP</q><q cite="https://www.google.com">HTTPS</q><q cite="mailto://www.google.com">MAILTO</q><q>TEL</q><q>FTP</q><q cite="data://www.google.com">DATA</q><q>LDAP</q><q>ACROBAT</q><q>VBSCRIPT</q><q>FILE</q><q>RLOGIN</q><q>WEBCAL</q><q>JAVASCRIPT</q><q>MMS</q></div>'
  },
  {
    html:     '<img src="<0&0;0.2&" />',
    dirty:    `<img src="<0&0;0.2&" />`,
    discard:  `<img src="&lt;0&amp;0;0.2&amp;" />`,
    sanitize: '<img src="&lt;0&amp;0;0.2&amp;" />'
  },
  {
    html:     '<div><wiggly>Hello<p>World</p></wiggly></div>',
    dirty:    `<div><wiggly>Hello<p>World</p></wiggly></div>`,
    discard:  `<div>Hello<p>World</p></div>`,
    sanitize: '<div>&lt;wiggly&gt;Hello&lt;p&gt;World&lt;/p&gt;&lt;/wiggly&gt;</div>'
  }
];
