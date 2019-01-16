angular.module('common').directive('uiPdfViewer', uiPdfViewer);

function uiPdfViewer($document, $window) {
  var directive = {
    restrict: 'A',
    templateUrl: './ui-pdf-viewer.html',
    link: function (scope, element, attr) {
      scope.$watch(attr.pdfRawData, function (n, o) {
        var clientWidth;
        function renderCanvasToImg(canvas) {
          var img = angular.element('<img><br/>')[0];
          img.src = canvas.toDataURL('image/png');
          angular.element(canvas).replaceWith(img);
        }

        function renderPage(page) {
          var containerElement = element.find('#request-pdf-container')[0];
          var scale = 1;
          var viewport = page.getViewport(scale);

          if (!clientWidth) {
            clientWidth = containerElement.clientWidth;
          }
          scale = (clientWidth - 5) / viewport.width;
          viewport = page.getViewport(scale);

          var canvas = angular.element('<canvas></canvas>')[0];
          var context = canvas.getContext('2d');

          canvas.height = viewport.height;
          canvas.width = viewport.width;
          containerElement.appendChild(canvas);
          // context.scale(5, $window.devicePixelRatio);

          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          page.render(renderContext).then(function () {
            // var el = element.find('#request-pdf-container');
            // var canvas = el[0].children[page.pageIndex];
            // renderCanvasToImg(canvas);
            renderToContainer('#request-pdf-container', page);
          });
        }

        var renderToContainer = function (containerId, page) {
          var el = element.find(containerId);
          var canvas = el[0].children[page.pageIndex];
          renderCanvasToImg(canvas);
        };

        function renderPages(pdfDoc) {
          for (var i = 1; i <= pdfDoc.numPages; i++) {
            pdfDoc.getPage(i).then(renderPage);
          }
        }
        if (n) {
          var el = element.find('#request-pdf-container');
          el.empty();
          PDFJS.getDocument({ data: n }).then(renderPages);
        }
      });
    }
  };

  return directive;
}