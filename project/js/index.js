import { Request } from "js/modules/Request";
import { Router } from "js/base/Router";

import { HomePage } from "js/pages/homePage";
import { ErrorPage } from "js/pages/errorPage";
import { TestPage } from "js/pages/testPage";

const tunnel = {
    components: {
        pages: {
            HomePage: new HomePage,
            ErrorPage: new ErrorPage,
            TestPage: new TestPage
        }
    },
    store: {}
}

const req = new Request();
const router = new Router(tunnel);
global.g = req;
global.r = router;
