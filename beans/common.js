const {
    usersController,
    adminController,
    clientController
} = require('../controllers');
const signup = async (body) => {
    // apply validation for users here
    if (!body.userName) {
        return Promise.reject({ error: "userName is required" });
    }
    if (!body.password) {
        return Promise.reject({ error: "password is required" });
    }
    if (!body.userType) {
        return Promise.reject({ error: "userType is required" });
    }
    if (!body.data) { // data represents public info of the user e.g firstName ,age etc
        return Promise.reject({ error: "data is required" });
    }

    try {
        let result = null;
        const userType = body.userType;
        switch (userType) {
            case 'admin':
                // apply admin fields validation here
                
                if (!body.data.firstName){
                    return Promise.reject({error : "firstName is required"});
                }
                if (!body.data.lastName){
                    return Promise.reject({error : "lastName is required"});
                }
                
                result = await adminController.addAdmin(body.data);
                break;

            case 'client':
                // apply client fields validation here
                
                if(!body.data.firstName){
                    return Promise.reject({error : "firstName is required"});
                }
                if(!body.data.lastName){
                    return Promise.reject({error : "lastName is required"});

                }
                if(!body.data.age){
                    return Promise.reject({error : "age is required"});
                }

                if(!body.data.dob){
                    return Promise.reject({error : "dob is required"});
                }
                  
                result = await clientController.addClient(body.data);
                break;
            default:
                return Promise.reject({ error: "userType is invalid" });
        }
        const userJson = {
            userName: body.userName,
            password: body.password,  // make this password encrypted
            userType: {
                kind: userType,
                item: result._id
            }
            
        };   
        const user = await usersController.addUser(userJson);
        return user;
    } catch (ex) {
        return Promise.reject({ error: ex });
    }
}


module.exports = {
    signup
}