# [content-mmd-to-html.html](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/html/content-mmd-to-html.html)


``` html
  <script>
    let script = document.createElement('script');
    script.src = "../../es5/bundle.js";
    document.head.append(script);

    script.onload = function() {
      const isLoaded = window.loadMathJax();
      if (isLoaded) {
        console.log('Styles loaded!')
      }

      const el = window.document.getElementById('content-text');
      if (el) {
        const options = {
          htmlTags: true
        };
        const html = window.render(text, options);
        el.outerHTML = html;
      }
    };
  </script>
```


```
<div id="content"><div id="content-text"></div></div>
```

[Run the example](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/html/content-mmd-to-html.html)
