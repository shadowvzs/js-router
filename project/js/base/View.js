class View {
    constructor(type = null, attr = null, childs = null) {
        type && (this.DOM = this.ce(type, childs, attr));
    }

    ce(type, childs = null, attr = null) {
        const e = document.createElement(type);
        if (childs && childs.length) {
            for (const child of childs) {
                e.appendChild(child);
            }
        }
        if (attr) {
            for (const key in attr) {
                e[key] = attr[key];
            }
        }
        return e;
    }
}
