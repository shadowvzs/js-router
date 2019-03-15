# js-router
Router for (vanilla) JS and apache

#### Note:
* you can see alot files but the router itself mostly only:
    * Router.js (or Router class)
    * Routes.js (or routes object)
    * Validator.js (regex validator object)

#### Features
   * Lightweight client side page router
   * Catch both regular pieces ("/"), query strings ("?/&"), hash ("#")
   * Work well with any url rewrite services *(example: apache2 with .htaccess)*
   * Routes declareable separate in **routes** object
   * Parameters in like ex. **:slug** and validation **(Validator.js)** for it
   * Parameters can be **optional** if you use **"."** (dot) at end of parameter
   * You can assign name which will handle the route: ex **TestPage** object *(Routers.js:133)*
   * If you use link which start with **"/"** then it will be internal link, router handle that

#### Example

```javascript
const routes = [
    ['/atm/dadam/:slug.', null, ['SLUG'], "TestPage" ],
    ['/home', null, false, "HomePage" ],
    ['/error/:id', null, ['NUMBER'], "ErrorPage" ],
];
```

 ----------------------------------------------

#### How it's work - Video
[![Test](http://img.youtube.com/vi/UAD_L7VCCe4/0.jpg)](http://www.youtube.com/watch?v=UAD_L7VCCe4)

--------------------------------------------
