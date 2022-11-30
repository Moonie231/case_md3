class NotFound {
    static view (req, res) {
        res.end('404 not found');
    }
}

module.exports = NotFound;