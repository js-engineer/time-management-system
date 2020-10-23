# Rest API for Time Management System
## About
Node based backend for time management system

## Install 
```
npm install
```
```
npm start
```
You will need a mongoDB instance running for storing data.

## Routes
### Signup
```
/api/register
```
Takes email and password, checks if email already exists and if not creates a new user. Returns either a 200 status for success or 500 status for error.

### Login
```
/api/login
```
Takes a user email and password, finds user in database, checks if password matches with bcrypt, if success returns a 200 status with JWT Token. 

### Get User (requires JWT Token)
```
/api/user
```
Takes user ID, checks if JWT Token is authentic, if successful returns a 200 status with user's email and "User found" message.

