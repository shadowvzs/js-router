import { View } from "js/base/View";

const MESSAGES = {
        '403': 'Cannot access page',
        '404': 'Page not found',
        '500': 'Internal server error',
}

class ErrorPage extends View {
    constructor() {
        super('div');
    }

    render(routeData) {
        const id = routeData.DYNAMIC.PARAMS.id;
        this.DOM.innerHTML = `<h1>Error Page</h1> <div>[${id}]: ${MESSAGES[id]} </div>`;
        return this.DOM;
    }
}
