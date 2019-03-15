const routes = [
    ['/atm/dadam/:slug.', null, ['SLUG'], "TestPage" ],
    ['/home', null, false, "HomePage" ],
    ['/error/:id', null, ['NUMBER'], "ErrorPage" ],
];


const errors = {
    INTERNAL_ERROR_URL: '/error/500',
    NOT_FOUND_URL: '/error/404',
    NO_ACCESS_URL: '/error/403',
};
