# Oversecured Backend Serverless
This README provides instructions for installing and running a local instance of Amazon DynamoDB v2.x

## Installation and Setup✨

    git clone https://github.com/Oversecured-traine/ovsrd-trainee-back-serverless.git
    
    cd ovsrd-trainee-back-serverless
	
	npm install
	
	node src/local-usage-scripts/cards-table.js

	node src/local-usage-scripts/columns-table.js

Download and extract DynamoDB v2.x archive from the following link:

-   [DynamoDB Local v2.x Download](https://dynamodb.amazonaws.com/dynamodb-local.zip) 

	Then run this command:
- `java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar`

	
	 `serverless offline start  `

