/**
 * ----------------------------------------
 * SIMPLE IN-MEMORY CACHE
 * ----------------------------------------
 */

const cacheStore = new Map();


/**
 * ----------------------------------------
 * SET CACHE
 * ----------------------------------------
 */
function setCache(key, value, ttl = 300000) {

    const expiresAt = Date.now() + ttl;

    cacheStore.set(key, {
        value,
        expiresAt
    });
}


/**
 * ----------------------------------------
 * GET CACHE
 * ----------------------------------------
 */
function getCache(key) {

    const cached = cacheStore.get(key);

    if (!cached) {
        return null;
    }

    /**
     * Remove expired cache
     */
    if (Date.now() > cached.expiresAt) {

        cacheStore.delete(key);

        return null;
    }

    return cached.value;
}


/**
 * ----------------------------------------
 * DELETE CACHE
 * ----------------------------------------
 */
function deleteCache(key) {

    cacheStore.delete(key);
}


/**
 * ----------------------------------------
 * CLEAR ALL CACHE
 * ----------------------------------------
 */
function clearCache() {

    cacheStore.clear();
}


/**
 * ----------------------------------------
 * CACHE SIZE
 * ----------------------------------------
 */
function cacheSize() {

    return cacheStore.size;
}


module.exports = {
    setCache,
    getCache,
    deleteCache,
    clearCache,
    cacheSize
};