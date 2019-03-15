import { VALIDATOR } from "js/base/Validator";
import { routes, errors } from "js/base/Routes";

const Auth = {
   role: 1
 };

class Router {

    constructor(tunnel) {
        const { protocol, hostname } = location;
        const baseDir = '';   // it is empty if project is in root directory
        this.URL_DATA = {
            BASE: Object.freeze({
                PROTOCOL: protocol,
                HOSTNAME: hostname,
                DIR: baseDir,
                ROOT: protocol+'//'+hostname+baseDir,
            }),
            DYNAMIC: {
                HASH: null,
                QUERY: {},
                URL: null,
                PARAMS: {}
            }
        }

        this.tunnel = tunnel;

        this.MOUSE_BUTTON = ['left', 'middle', 'right'];

        if (document.readyState === 'complete') {
            this.globalEventRegistration();
        } else {
            document.onreadystatechange = () => {
                document.readyState === 'complete' && this.globalEventRegistration();
            };
        }
        this.validateRoute();
    }

    globalEventRegistration() {
        // dispatch the click event
        document.addEventListener("click", e => this.eventDispatch(e));
        // event handler if user click to BACK button
        window.addEventListener('popstate', e => this.back(e), false);
    }

    getPath() {
        const { ROOT } = this.URL_DATA.BASE;
        const HASH = window.location.hash;
        const href = encodeURI(location.href);
        const full_url = href.substring(ROOT.length + 1, href.length - HASH.length);
        const QUERY = {};
        const [ URL, queries = false ] = full_url.split('?');

        if (queries && queries.length) {
            queries.split('&').forEach( q => {
                const [key, value] = q.split('=');
                QUERY[key] = value;
            });
        }

        return this.URL_DATA.DYNAMIC = {
            ...this.URL_DATA.DYNAMIC,
            HASH: HASH.replace('#', ''),
            QUERY,
            URL
        };
    }

    validateRoute() {
        const { URL } = this.getPath();
        const urlArray = URL.split('/');
        const params = {};
        let len, i, route_url, route;

        for ( const [route, requirement, validation, component = null ] of routes ) {
            const routeArray = route.substr(1).split('/');
            const strictLength = routeArray.reduce((t, c) => {
                return t + (c.substr(-1) !== "." ? 1 : 0);
            }, 0);

            len = urlArray.length;

            if (strictLength > len ) {
                continue;
            }

            for (i = 0; i < len; i++ ) {

                if (!routeArray[i]) {
                    return this.finalValidation(requirement, params, component);
                }

                if (routeArray[i].charAt(0) === ":") {
                    if (routeArray[i].substr(-1) === ".") {
                        routeArray[i] = routeArray[i].slice(0, -1);
                    }
                    // verification for dynamic params like :id
                    if (Array.isArray(validation)) {
                        const paramCount = Object.keys(params).length;
                        if (VALIDATOR[validation[paramCount]].test(urlArray[i])) {
                            params[routeArray[i].substr(1)] = urlArray[i];
                        } else {
                            // if incorrect data with dynamic param like :id
                            return this.redirect(errors.NOT_FOUND_URL, 'Not Found');
                        }
                    }
                } else if (routeArray[i] === urlArray[i]) {
                    //verification or static url piece
                } else {
                    // skip every checking
                    break;
                }

                if (i === len - 1 || i === routeArray.length ) {
                    return this.finalValidation(requirement, params, component);
                }
            }
        }
        return this.redirect(errors.NOT_FOUND_URL, 'Not Found');
    }

    finalValidation(requirement, params, component) {

        if (!isNaN(parseInt(requirement)) && Auth.role < requirement ) {
            return this.redirect(errors.NO_ACCESS_URL, 'Forbidden');
        }

        this.URL_DATA.DYNAMIC.PARAMS = params;

        // this is oonly an example about how to use route handlers
        const root = document.getElementById('root');
        root.innerHTML = '';
        const page = this.tunnel.components.pages[component];
        root.appendChild(page.render(this.URL_DATA));
        // ------------------------------------

        return this.URL_DATA.DYNAMIC;
    }

    redirect(newUrl = null, title = null, obj = null) {
        const { ROOT } = this.URL_DATA.BASE;
        const { URL } = this.getPath();

        if (newUrl) {
            if (newUrl === URL) { return; }
            history.pushState( null , title, ROOT + '/' + URL );
            history.replaceState( null , title, ROOT + newUrl );
        }

        const data = this.validateRoute();
        if (data) {
            console.log('Redirecting in router: ' + JSON.stringify(data));
            //middleware.run("redirect", data );
        }
    }

    back(e) {
        let href = location.href;
        redirect();
        // history.back();
        e.preventDefault();
        // Uncomment below line to redirect to the previous page instead.
        // window.location = document.referrer // Note: IE11 is not supporting this.
        // history.pushState(null, null, window.location.pathname);
    }

    eventDispatch (e) {
        if (e.button > 0) {
            return console.log('it was not left click, it was '+(this.MOUSE_BUTTON[e.button] || 'unknow')+' button');
        }
        let t = e.target, depth = 3, i = 0, href;
        for (; i < depth; i++) {
            if (t.hasAttribute("href")){
                href = t.getAttribute("href");
                break;
            } else {
                if (!t.parentElement) { return 'no href on clicked target also no parent';}
                t = t.parentElement;
            }
        }

        // no href then no action

        if (!href) { return console.log('no href where i clicked'); }
        // internal link handle redirect(url)
        if (href.charAt(0) === "/") {
            console.log('internal page link was detected');
            e.preventDefault();
            this.redirect(href);
        // special link - components
        // component cn be any object, like a audio player, login modal etc
        /*
        } else if (href === '*') {
            console.log('special link was detected');
            let action = (t.dataset.action || []).split('/');
            if (!action) { return console.log('Warning: data-action is empty'); }
            let actionType = action.splice(0, 1)[0],
                actionData = action.join('/');

            if (!t.dataset.allow) {
                e.preventDefault();
            }

            if (actionType === 'submit') {
                model.submitForm(actionData+"_Form");
            } else if (actionType === 'update') {
                // form update
                // not used
            } else if (actionType === 'component') {
                let component = pages.current.component[action[0]];
                if (component) {
                    component[action[1]](...action.slice(2));
                } else {
                    console.log("missing component", action);
                }
            }
        */
        } else {
            console.log('normal link redirect to other page');
        }
    }

    url() {
        return this.getPath();
    }

    virtualRedirect(newUrl) {
        history.pushState( null, null, location.href );
        history.replaceState( null, null, newUrl );
        console.log(newUrl);
    }

    setUrl(urlAddon=false) {
        let newUrl = BASE_ROOT+'/';
        const r = pages.current.routeData,
            paramKeys = Object.keys(r.param || {});

        if (r.prefix) {
            newUrl += r.prefix;
        }

        newUrl += r.controller+'/'+r.action;
        if (paramKeys.length) {
            for (let key of paramKeys) {
                newUrl += '/'+r.param[key];
            }
        }

        if (urlAddon) {
            newUrl += '/'+urlAddon;
        }
        this.virtualRedirect(newUrl);
    }
};
