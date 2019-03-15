import { View } from "js/base/View";

/*
  if you want you can use nodes and not attribute
*/

const content = `
    <h1>Home Page</h1>

    <h4> Features </h4>
    <ul>
        <li> Lightweight client side page router </li>
        <li> catch both regular pieces ("/"), query strings ("?/&"), hash ("#") </li>
        <li> Work well with any url rewrite services <i>(example: apache2 with .htaccess)</i> </li>
        <li> Routes declareable separate in <strong>routes</strong> object </li>
        <li> Parameters in like ex. <strong>:slug</strong> and validation <strong>(Validator.js)</strong> for it</li>
        <li> Parameters can be <strong>optional</strong> if you use <strong>"."</strong> (dot) at end of parameter <li>
        <li> You can assign name which will handle the route: ex <strong>TestPage</strong> object <i>(Routers.js:133)</i> </li>
        <li> If you use link which start with <strong>"/"</strong> then it will be internal link, router handle that </li>
    </ul>

    <h4>Example</h4>
    <small>['/atm/dadam/:slug.', null, ['SLUG'], "TestPage" ],</small>
`;

class HomePage extends View {
    constructor() {
        const attr = {
            innerHTML: content,
            className: 'homepage pages'
        }
        super('div', attr);
    }

    render(params) {
        return this.DOM;
    }
}
