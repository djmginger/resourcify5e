var express = require('express');
var router = express.Router();

router.post('/', function(request, response){
    console.log(request.body);      // your JSON
    response.send(request.body);    // echo the result back
});

module.exports = router;