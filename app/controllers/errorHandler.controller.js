const {StatusCodes: HttpStatus} = require("http-status-codes")

class ErrorController{
    get404(req,res){
        res.status(HttpStatus.NOT_FOUND).render("errors/404.ejs",{
            pageTitle: "صفحه مورد نظر یافت نشد | 404",
            path : "/404",
        });
    }
}
module.exports = {
    ErrorController: new ErrorController
}