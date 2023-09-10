[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/o-xnQ34X)
# The Last Show

In this assignment, you will create a full stack application with React and AWS that generates obituaries for people (fictional or otherwise). You will use [ChatGPT](https://openai.com/blog/chatgpt) to generate an obituary, [Amazon Polly](https://aws.amazon.com/polly/) to turn the obituary into speech, and [Cloudinary](https://cloudinary.com/) to store the speech and a picture of the deceased (may they rest in peace).

## Architecture Overview

<br/>
<p align="center">
  <img src="https://res.cloudinary.com/mkf/image/upload/v1680411648/last-show_dvjjez.svg" alt="the-last-show-architecture" width="800"/>
</p>
<br/>

## :foot: Steps

- Make sure to see the demo video on D2L
- Clone the repo
- Make sure you're inside the root directory of the repo and then run `npm install` to install all the necessary packages
- Run `npm start` and you should be able to see the page open up on your default browser
- Add your infrastructure code in the `main.tf` file
- Add your function code for the `get-obituaries-<your-ucid>` function in the [`functions/get-obituaries/main.py`](functions/get-obituaries/main.py) file
- Add your function code for the `create-obituary-<your-ucid>` function in the [`functions/create-obituary/main.py`](functions/create-obituary/main.py) file
- Push your changes to the `main` branch before the deadline to be graded
- This assignment has a DEMO component that's 50% of the grade

## :page_with_curl: Notes

- You must create all your resources on AWS with Terraform. Put all your configuration in the [`main.tf`](infra/main.tf) file
- You must use AWS DynamoDB for the database
- You must use [Lambda Function URLs](https://masoudkarimif.github.io/posts/aws-lambda-function-url/) for this assignment to connect your backend to the frontend
- You must create 2 Lambda functions for this assignment:

  - `get-obituaries-<your-ucid>`: to retrieve all the obituaries. Function URL only allows `GET` requests
  - `create-obituary-<your-ucid>`: to create a new obituary. The function reads all the data (including the picture) from the body of the request. Function URL only allows `POST` requests

- You must use Python to write the functions
- The only external libraries allowed to be used in the functions are [`requests`](https://pypi.org/project/requests/) for sending HTTPS requests to ChatGPT and Cloudinary, and [requests-toolbelt](https://pypi.org/project/requests-toolbelt/) for decoding the body of the request received from the front-end. No other external libraries are allowed
- You must use the [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference) and **not the SDK** to interact with Cloudinary. You will need to generate a signature for your requests. See how you can do it [here](https://cloudinary.com/documentation/upload_images#generating_authentication_signatures)
- You must use the [ChatGPT API](https://platform.openai.com/docs/api-reference/making-requests) and **not the SDK** to interact with ChatGPT
- To interact with Cloudinary and ChatGPT, you need keys. You must use [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) and the `SecureString` data type to store the keys for your Cloudinary and ChatGPT accounts. The `create-obituary` Lambda function will read the keys from the Parameter Store using the `boto3` library. The keys must not be present in your application or infra code in the repo. You can create these keys using the AWS CLI, or manually on the AWS Console. Read more about the AWS Systems Manager API [here](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ssm.html#client). Depending on your solution, you need one of these two methods: [`get_parameters`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ssm/client/get_parameters.html) or [`get_parameters_by_path`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ssm/client/get_parameters_by_path.html). The Demo uses the last one
- You must use [Amazon Polly](https://aws.amazon.com/polly/) to turn the obituary written by ChatGPT to speech and then upload the `mp3` version of that to Cloudinary. Read more about the Polly API [here](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/polly.html). What you need is the [`synthesize_speech`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/polly/client/synthesize_speech.html) method
- The Demo uses the `text-curie-001` model from ChatGPT. Feel free to use another [model](https://platform.openai.com/docs/models/gpt-3). Be careful about the cost of the model you choose!
- The Demo sets the `max_tokens` to 600. However, you could change this number as long as it still works properly. You don't have to go over 600. Bigger numbers are more expensive!
- The Demo uses the [Completions API](https://platform.openai.com/docs/api-reference/completions) and not the [Chat API](https://platform.openai.com/docs/api-reference/chat), as the application doesn't need to have a continuous discussion with the model. This makes the application less expensive. However, feel free to use the Chat API instead
- The Demo uses the following prompt to interact with the model: `write an obituary about a fictional character named {name} who was born on {born_year} and died on {died_year}.` You may use a different prompt as long as it still works
- The Demo uses FlexBox for the layout. However, feel free to use another approach or framework
- The Demo uses Joanna as the voice id for the speech. Feel free to use another [voice id](https://docs.aws.amazon.com/polly/latest/dg/voicelist.html)
- The Demo uses the `e_art:zorro` enhancement from Cloudinary to create black edges for the picture. Read more [here](https://cloudinary.com/documentation/effects_and_artistic_enhancements). You only need to add `e_art:zorro` in a certain part of the image URL
- You probably need to set a bigger timeout for your Lambda function, as it takes ChatGPT a few seconds to generate an obituary. The default timeout is 3 seconds. You can set the timeout to 20
- The Demo uses a font from the Google Fonts library named [Satisfy](https://fonts.google.com/specimen/Satisfy?query=satisfy) to show the obituaries on the front-end,
- The Demo doesn't use any external library for the front-end
- In order to get the full mark, you need to **DEMO your work in PERSON**. You could either demo it to a TA or the instructor. Demo is 50% of the assignment

## :couple: Group Assignment

In case you're doing the assignment as part of a group, pay attention to the following so you won't lose any points:

- Use the UCID of one team member to name the Lambdas, and the other one to name the DynamoDB table
- Put the names and UCIDs of the team members in the [Team-Members](./Team-Members.md) file
- Both members must commit to the group repo. If a student has no commit after the deadline, their grade will be Zero. Things like "I sent the code over TikTok or Discord" are not acceptable. **No commmit = No grade**
- Try to split the work as evenly as possible between team members
- Both members must be present for the Demo. If you're not present, your grade will be Zero for the Demo

## :heavy_check_mark: Things you may change

- You may use a CSS framework to build the UI. The Demo only uses FlexBox
- You may use a different voice id with Amazon Polly. The Demo uses Joanna
- You may use a different model for your ChatGPT integration. The Demo uses `text-curie-001`
- You may use a different prompt for the model as long as the final result is the same. The Demo uses `write an obituary about a fictional character named {name} who was born on {born_year} and died on {died_year}.`
- You may use a different font. The Demo uses [Satisfy](https://fonts.google.com/specimen/Satisfy?query=satisfy)

## :moneybag: Cost

- This assignment won't cost you anything if you follow the best practices discussed in the class
- Use the `PROVISIONED` billing mode, and only 1 RCU and WCU for your DynamoDB table as shown in the [lecture notes](https://masoudkarimif.github.io/posts/aws-dynamodb-crud-with-lambda-terraform/#create-a-dynamodb-table-with-terraform)
- Don't use a memory configuration bigger than 128MB for your Lambdas. Use the [lecture notes](https://masoudkarimif.github.io/posts/aws-lambda-with-terraform/#create-a-lambda-function) to create Lambda functions. When you don't specify the `memory_size` field, it will default to 128MB which is the minimum amount
- Don't send a huge number of requests to your Lambdas using automated scripts. You have 1 Million free requests, and up to 3.2 million seconds of free compute time under the [Free Tier](https://aws.amazon.com/free/)
- Remember to enable Free Tier notifications on your account before building anything as shown in the videos on D2L
- If you go over the Free Tier (you would have to screw it up really bad, honestly), you can create a new Free AWS account and build your infrastructure there instead. Thankfully, Terraform makes that process super easy for you
- Cloudinary has a generous free tier. If you don't send thousands of requests for large files, you won't have to pay anything. If you're over the free tier, you could create a new free account (will give you new keys)
- ChatGPT has a free tier. If you're careful, you won't have to pay anything. If you're over the free tier, you could create a new free account (will give you new API Key)


## :heavy_plus_sign: Bonus Marks
- You can grab 10 extra points if you orchestrate different steps of the `create-obituary` Lambda function with [AWS Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html). You would have to orchestrate 4 Lambda functions:
  - `generate-obituary` that uses ChatGPT
  - `read-obituary` that uses Amazon Polly
  - `store-files` that uses Cloudinary to store both the picture and speech
  - `save-item` that uses DynamoDB to store a new item
- You must create all the infra using Terraform
- Step Functions won't send you a response right away, but the app still needs to find out when the workflow is finished and add a new obituary to the front-end
- No partial implementation is considered. If the implementation doesn't work properly from beginning to end, there will be no bonus marks for the assignment