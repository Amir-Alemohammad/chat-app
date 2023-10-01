const multer = require("multer");
const path = require("path");
const { createRoute,fileFilter } = require("./function");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file?.originalname) {
        const filePath = createRoute(req);
        return cb(null, filePath);
      }
      cb(null, null);
    },
    filename: (req, file, cb) => {
      if (file.originalname) {
        const ext = path.extname(file.originalname);
        const fileName = String(new Date().getTime() + ext);
        req.body.filename = fileName;
        req.body.image = path.join(req.body.fileUploadPath , req.body.filename).replace(/\\/g,"/");
        return cb(null, fileName);
      }
      cb(null, null);
    },
});
const fileMaxSize = 1 * 1000 * 1000;
const uploadFile = multer({ storage, fileFilter, limits: { fileSize: fileMaxSize } });
module.exports ={
    uploadFile
}