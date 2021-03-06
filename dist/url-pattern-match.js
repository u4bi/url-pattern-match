(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.match = factory());
}(this, (function () { 'use strict';

var patternEscape = (pattern) => pattern.replace(/[\?\&\.]/g, '\\$&');
var expression = (pattern) => new RegExp(`^${ pattern.replace(/\:[^\/\&\.\?]+/g, '([^\/]+)').replace(/\)\?/, ')\\?') }$`);

var getKeys = (pattern) => {
    try {
        return pattern.match(/\:([^\?\/\\]+)/g).map(e => e.slice(1));
    } catch(e) {
        return null;
    }
};

var getMatch = (url, keys, regex) => url.match(regex);

var isMatch = (state, pattern, children = {} ) => {
    return { state : state, pattern : pattern, children : children };
};

var match = (pattern, url) => {
    if (pattern === url) return isMatch(true, pattern);
    
    let _pattern = patternEscape(pattern);

    let keys = getKeys(_pattern),
        results = getMatch(url, keys, expression(_pattern));

    if(!keys || !results ) return isMatch(false);
    
    return isMatch(true, pattern, results.splice(1, keys.length)
                                .reduce((obj, e, index) => {
                                    obj[keys[index]] = e;
                                    return obj;
                                }, {} ));
};

return match;

})));
