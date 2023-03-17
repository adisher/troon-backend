const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const usersSchema = new mongoose.Schema({   //schema is class of mongoose library whic is used to describe the table elements like column,rows etc
    userName : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String ,
        required : true
    },
    userType : {
        kind : {
            type : String ,
             enum : ['admin','client']},

        item : {
            type : mongoose.Types.ObjectId,
            refPath : 'userType.kind'}
    }
    
},

{
    collection : 'users'    //users is the name of table in database
});



module.exports = mongoose.model('users' , usersSchema);

//Password Hashing

/*   
usersSchema.pre('signup', async function (next){
    console.log("Hi there .....");
   if(this.isModified('password'))
   {
     this.password=bcrypt.hash(this.password, 12);
   }
   next();
});
*/

