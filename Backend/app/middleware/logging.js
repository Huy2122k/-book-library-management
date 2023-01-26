const elastic = require("../config/logging.config")

elastic.cluster.health({},function(err,resp,status) {  
    console.log("-- Client Health --",resp);
});

const index_log = {
    logAuth : "book_library_log_auth",
    logUser : "book_library_log_user",
    logBook : "book_library_log_book",
    logLending : "book_library_log_lending",
    logWishList: "book_library_log_wishlist"
}


const logError = (message, object) => {
    elastic.index({
        index: "book_library_log_error",
        body: {
            object: object,
            message: JSON.stringify(message)
        }
    })
    .then((response)=>{
        console.log(response)
    }, (err)=>{
        console.log(err.message)
    })
    .catch((err)=>{
        console.log(err)
    })
}

const logInfo = (index, action, data) => {
    elastic.index({
        index: index,
        body: {
            action: action,
            ...data
        }
    })
    .then((response)=>{
        console.log(response)
    }, (err)=>{
        console.log(err.message)
    })
    .catch((err)=>{
        console.log(err)
    })
}

const logging = {
    logError: logError,
    logInfo: logInfo,
    index: index_log
};

module.exports = logging