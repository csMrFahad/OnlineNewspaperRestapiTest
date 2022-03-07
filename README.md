# OnlineNewspaperRestapiTest
## RESTAPI for Online Newspaper using Nodejs


### Problem Description
Develop a solution for a simple online newspaper. They publish 10-15 articles on a daily basis. Articles are published by an editor. There is **only one editor active at any point in time**. They have 1 administrator who adds/removes editors. The newspaper recruits a new editor every month and they let go the previous editor thus ensuring there is **only one active editor** in the system. Build a nodejs(express) system capable of running CRUD operations in this newspaper system.

### Schema Diagram
![NewspaperMongoSchema](/OnlineNewspaperMongoSchema.jpg)

### Routes
**/user/signup** POST\
Signup new user.\
Sample json body
```
{
	"name": "testUser",
	"email": "testuser@test.com",
	"password": "pass"
}
```
<br/>


**/user/login** POST\
Login with an existing user. If successful, will get a JWT token. In future requests user needs to use this valid token for protected routes.\
Sample json body
```
{
	"email": "testuser@test.com",
	"password": "pass"
}
```
<br/>


**/user/editors** GET\
Get current editor.\
Route accessible only by administrator->Requires Bearer jwttoken.\
We can modify source code slightly to get all users, previous editors etc.
<br/>


**/user/editor** POST\
Modify editor.\
Route accessible only by administrator->Requires Bearer jwttoken.\
Sample json body
```
{
	"email": "testuser@test.com"
}
```
<br/>


**/article** GET\
Get count and details of all articles in newspaper.
<br/>


**/article** POST\
Create a new post.
Route accessible only by current editor->Requires Bearer jwttoken.\
Sample json body
```
{
	"content": {
		"title": "test heading3 by test2",
		"body": "contentfortest3.test1contenttest.."
	}
}
```
<br/>


**/article/:articleId** GET\
Get a specific article using articleID
<br/>
