# dynamo-merge

## Installation

    yarn add dynamo-merge

## Usage

    import merge from "dynamo-merge";
    
    const result = await documentClient.update({
        TableName: "users",
        Key: {email},
        ...merge(updatedUserAttributes),
    })