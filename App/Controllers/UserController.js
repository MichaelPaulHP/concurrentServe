'use strict'

var UserAuthSchema = require("../Models/Schemas/UserAuthSchema");
var Participant = require("../Models/Participant");
var fs = require("fs");
var path = require("path");


exports.loginUser= function (req,res){

    var params=req.body;

    var email=params.email;
    var password=params.password;

    UserAuthSchema.findOne({email:email},function(err,user){
        if (err){
           
            res.status(500).send({"message":err  });
        }
        else{
            if(user){
                
                if(user.validPassword(password)){
                    var token = user.generateJWT();
                    res.status(200).send({token:token});
                }
                else{
                    res.status(400).send({"message":"password invalid"});
                }
            }
            else{
                res.status(400).send({"message":"User Not Found"});
            }
        }
    });

}

exports.saveUser =async function(req,res){

    try {
        let params=req.body;
        let user = new UserAuthSchema();
        user.name=params.userName;
        user.email=params.email;
        user.setPassword(params.password);
        //user.role=params.role;
        let userStored = await UserAuthSchema.create(user);
        let participant= await Participant.createParticipant(params.userId,params.userName);

        res.status(200).send({ "user":userStored.toAuthJSON() });
    }catch (e) {
        res.status(500).send({"message":e.message });
    }

};

exports.updateUser = function(req,res){

    var userId=req.params.id;
    var body=req.body;
    UserAuthSchema.findByIdAndUpdate(userId,body,(err,user)=>{
        if (err){
           
            res.status(500).send({"message":err});
        }
        else{
            if(user){
                res.status(200).send({ user });
            }
            else{
                res.status(404).send({"message":"User Not Found"});
            }
        }    
    });

    
}


//[HTTP POST]
exports.uploadImage = function(req, res) {
    var userID = req.params.id;

    var file_name = "none";

    if (req.files.image) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
            UserAuthSchema.findByIdAndUpdate(userID, { image: file_name }, (err, userUpdated) => {
                if (err){
           
                    res.status(500).send({"message":err.message  });
                }
                if (!userUpdated) {
                    res.status(404).send({ "message": "User Not Found" });
                } else {
                    res.status(200).send({image:file_name });
                }
            });
        }
    } else {
        res.status(400).send({ message: "File Not Found " });
    }
}
//Retorla la imagen 
exports.getImageFile = function (req, res) {
    var imageFile = req.params.imageFile;
    var path_file = "./Uploads/Users/" + imageFile;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "imagen no existe" });
        }
    });
}
