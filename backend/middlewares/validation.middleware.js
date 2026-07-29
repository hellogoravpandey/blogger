
// generic validation middleware
export function validate(validators){
    return (req, res, next)=>{
        try {
            if(!req.body){
                throw new Error("Body is empty");
            }
            for (const item of validators){
                const {field, validator}=item;
                req.body[field]=validator(req.body[field]);
            }
            next();
        } catch (error) {
            console.log("error in validator: ", error);
            return res.status(400).json({
                message: error.message
            });
        }
    };
}