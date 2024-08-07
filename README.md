# API Endpoints

## User Authentication

### Register User
**URL:** `http://localhost:3000/api/auth/registeruser`  
**Method:** POST  
**Body:**
{
  "fullname": "",
  "username": "",
  "email": "",
  "phoneNumber": "",
  "address": "",
  "password": ""
}

## Friend Request

### 1. Send Request
**URL:** `http://localhost:3000/api/friendReq/sendreq`  
**Method:** POST  
**Body:**
{
  "from": "",
  "to": ""
}

### 2. Receive Request
**URL:** `http://localhost:3000/api/friendReq/receivereq/`  
**Method:** POST  
**Body:**
{
  "username": ""
}

### 3. Accept Request
**URL:** `http://localhost:3000/api/friendReq/acceptreq/{requestid}`  
**Method:** GET  
**Parameter:** `requestid`

### 4. Reject Request
**URL:** `http://localhost:3000/api/friendReq/rejectreq/{requestid}`  
**Method:** GET  
**Parameter:** `requestid`

## Post

### 1. Create Post
**URL:** `http://localhost:3000/api/post/createpost`  
**Method:** POST  
**Body:**
{
  "username": "",
  "title": "",
  "description": ""
}

### 2. View Post
**URL:** `http://localhost:3000/api/post/viewpost/{username}`  
**Method:** GET  
**Parameter:** `username`

### 3. Add Comment
**URL:** `http://localhost:3000/api/post/addcomment/{postid}`  
**Method:** POST  
**Body:**
{
  "username": "",
  "comment": ""
}
