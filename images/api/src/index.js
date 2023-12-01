const app = require("./app.js");
const port = 8080;


app.listen(port, (error)=> {
    if(!error){
        console.log(`running on port ${port}`);
    }
    else {
        console.error(error)
    }
})

