const asyncHandler = (requestHandler) =>{
    (req,res,next )=>{
        Promise.resolve(requestHandler(req,res,nest))
        .catch((err)=> next(err));
    }
}

module.export = asyncHandeler






// const asyncHandeler = (fn)=> async (req,res,next) => {
//     try{
//         await fn(req,res,next);
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }
// }