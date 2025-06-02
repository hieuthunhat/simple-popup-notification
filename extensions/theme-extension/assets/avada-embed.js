(function() {
  const BASE_URL =
    'https://cdn.shopify.com/extensions/ced9f8d1-f2fe-42d7-9fb8-f93eabec885b/0.0.0/assets';

  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.async = !0;
  scriptElement.src = BASE_URL + `/avada-sale-pop.min.js?v=${new Date().getTime()}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(scriptElement, firstScript);
})();
