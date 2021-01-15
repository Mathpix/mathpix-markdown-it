# [input-mmd-to-html.html](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/html/input-mmd-to-html.html)


``` html
  <script>
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathpix-markdown-it@1.0.40/es5/bundle.js";
    document.head.append(script);

    script.onload = function() {
      const isLoaded = window.loadMathJax();
      if (isLoaded) {
        console.log('Styles loaded!')
      }
    }
  </script>
```

``` html
  <script>
    function convert() {
      const input = document.getElementById("input").value.trim();
      const output = document.getElementById('output');
      output.innerHTML = '';

      const options = {
        htmlTags: true
      };
      const html = window.markdownToHTML(input, options);
      output.innerHTML = html;

    }
  </script>
```


``` html
<div id="frame">
  <h1>Convert markdown to html </h1>

  <textarea id="input" rows="15" cols="10">$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$

$$
x = \frac { - b \pm \sqrt { b ^ { 2 } - 4 a c } } { 2 a }
$$

\(
y = \frac { \sum _ { i } w _ { i } y _ { i } } { \sum _ { i } w _ { i } } , i = 1,2 \ldots k
\)

\[
y = \frac { \sum _ { i } w _ { i } y _ { i } } { \sum _ { i } w _ { i } } , i = 1,2 \ldots k
\]
</textarea>

  <br>

  <div class="right">
    <input type="button" value="Convert" id="render" onclick="convert()">
  </div>
  <br clear="all">
  <div id="output"></div>

</div>
```

[Run the example](https://htmlpreview.github.io/?https://github.com/Mathpix/mathpix-markdown-it/blob/master/examples/html/input-mmd-to-html.html)
