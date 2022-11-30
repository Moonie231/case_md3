class NotFound {
    static default (req, res) {
        res.end('404 not found');
    }
}

module.exports = NotFound;