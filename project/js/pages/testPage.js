import { View } from "js/base/View";

class TestPage extends View {
    constructor() {
        const attr = {
            textContent: "Test Page"
        }
        super('div', attr);
    }

    render(routerData) {
        this.DOM.innerHTML = ` <h1> Test Page </h1> <div> json params: ${JSON.stringify(routerData)}</div>`;
        return this.DOM;
    }
}
