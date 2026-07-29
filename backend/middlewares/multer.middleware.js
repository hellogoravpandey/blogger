import multer from 'multer';
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("inside multer diskstorage destination", file);
    cb(null, path.resolve('./public/uploads'))
  },
  filename: function (req, file, cb) {
    console.log("inside multer diskstorage filename", file);
    console.log("file, inside the multer", file);
    cb(null, Date.now() + '-' + file.originalname)
  }
})

function coverImageFilter(req, file, cb){
  if(file.fieldname === "coverImageURL"){
     if(file.mimetype=="image/jpeg" || file.mimetype=="image/png"){
             return cb(null, true);
         }
      return cb(new Error("File type should be jpeg/png"));
  }
  return cb(new Error("Unexpected fieldname"));
}

function avatarFilter(req, file, cb){
   if(file.fieldname === "profileImageURL"){
     if(file.mimetype=="image/jpeg" || file.mimetype=="image/png"){
             return cb(null, true);
         }
      return cb(new Error("File type should be jpeg/png"));
  }
  return cb(new Error("Unexpected fieldname"));
}

export const uploadAvatar = multer({
    storage,
    fileFilter: avatarFilter,
    limits: {
        fileSize: 2 * 1024 * 1024    // 5 mb limit
    }
});

export const uploadBlogCoverImage = multer({
    storage,
    fileFilter: coverImageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5mb limit
    }
});

