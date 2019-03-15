const serialize = (obj, prefix) => {
    let str = [], p;
    for(p in obj) {
        if (obj.hasOwnProperty(p)) {
          let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
          str.push((v !== null && typeof v === "object") ?
            serialize(v, k) :

            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};

const defaultConfig = {
    timout: 15000,
    middleware: {
        success: console.log,
        error: console.log,
        timeout: console.log,
    }
};

class Request {

    constructor(config = null) {
        this.config = defaultConfig;
        config && Object.assign(this.config, config);
    }

    setCredentials(credentials) {
        this._credentials['Authorization'] = 'token:'+credentials;
    }

    promise(url, method, meta) {
        return new Promise((resolve, reject) => {
            const { 
                success = meta.success || console.info, 
                error = meta.error || console.error
            } = meta;
            meta.success = (success) => resolve(success);
            meta.error = (error) => reject(error);
            this._xhr(url, method, meta)
        })
    }

    _xhr(url, method, meta) {
        const { 
            data = null, 
            header = { 'Content-Type': 'application/x-www-form-urlencoded' },
            success = console.info, 
            error = console.error
        } = meta;
        if (typeof error != "function" || typeof success != "function") { 
            return alert('Missing classback(s)....'); 
        }
        if (!url) { return error('no settings for request'); }
        method = (!/(GET|POST|PUT|DELETE|FILE)/.test(method)) ? "GET": method;

        const isFile = method === 'FILE',
            xhr = new XMLHttpRequest(),
            { timeout, middleware } = this.config;

        if (this._credentials) {
            Object.assign(header, this._credentials);
        }

        if (isFile) {
            method = 'POST';
            header['Content-Type'] = 'multipart/form-data';
        } else if (data) {
            if (method === "GET" || typeof data !== 'object') {
                method === 'GET' && (url += (~url.indexOf("?") ? "&" : "?") + serialize(data));
                data = null;
            }
        }

        // xhr.withCredentials = true; // only if needed
        xhr.onreadystatechange = function(event) {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    if (!this.response) { error("no returned data"); return false; }
                    //if (notifyMsg) { notify.add(...notifyMsg); }
                    middleware.success && middleware.success(this.response);
                    //if (!this.response.success) { return error(this.response); }
                    success (this.response.data || this.response);

                } else {
                    middleware.error && middleware.error(this.status);
                    error(this.status);
                }
            }
        };

        xhr.responseType = 'json';
        xhr.open(method, url, true);
        xhr.timeout = timeout; 

        xhr.ontimeout = e => {
            let loader = document.body.querySelector('.loader.middle');
            if (loader) { loader.remove(); }
            if (middleware.timeout) {
                const msg = `Request time limit (${~~(timeout/1000)}sec) expired!`;
                middleware.timeout(msg);
            }
        };

        for (const key in header) {
            xhr.setRequestHeader(key, header[key]);
        }

        if (method !== "POST" || !data) {
            xhr.send();
        } else if (isFile) {
            xhr.send(data);
        } else {
            xhr.send(serialize(data));
        }
    }


    get(url, success = null, error = null) {
        return this.promise(url, 'GET', {
            data: null, success, error
        })
    }

    post(url, data = null, success = null, error = null) {
        return this.promise(url, 'POST', { data, success, error })        
    }

    raw(setup, success, error) {
        this._xhr(setup.url, setup.method, { ...setup.data });
    }

    file(url, data = null, success = null, error = null) {
        this._xhr(url, 'FILE', { data, success, error });
    }

}