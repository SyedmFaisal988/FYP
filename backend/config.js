exports.hostName = process.env.PORT? '0.0.0.0' : '192.168.4.100'
exports.port = process.env.PORT || 4000
exports.db_url =  "mongodb://localhost:27017"  
exports.db_name = "location"
exports.secretKey = "12345-67890-09876-54321"