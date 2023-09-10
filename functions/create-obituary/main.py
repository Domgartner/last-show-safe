
import boto3
import requests
import json
import hashlib
import time
import json

dynamodb_resource = boto3.resource("dynamodb",region_name="ca-central-1") # create a resource object for DynamoDB
table = dynamodb_resource.Table("LS-ob-30143419") 
ssm = boto3.client("ssm", region_name="ca-central-1")
polly = boto3.client("polly", "ca-central-1")

def get_cloudinary_secret():
    response = ssm.get_parameters(
        Names=["SecretCloudinary"],WithDecryption=True
    )
    for parameter in response["Parameters"]:
        return parameter["Value"]

def get_accessCloud():
    response = ssm.get_parameters(
        Names=["accessCloudinary"],WithDecryption=True
    )
    for parameter in response["Parameters"]:
        return parameter["Value"]

def gpt_Getter():
    response = ssm.get_parameters(
        Names=["ChatBot"],WithDecryption=True
    )
    for parameter in response["Parameters"]:
        return parameter["Value"]


def upload_and_generate_secure_url(image_bytes):
    timeStamp = str(time.time())
    api_key = str(get_accessCloud())
    secret1 = get_cloudinary_secret().strip()
    signature = "timestamp=" + timeStamp + secret1
    api_key = str(get_accessCloud())
    signature = signature.encode()
    signature = hashlib.sha1(signature)
    signature = signature.hexdigest()
    Cloudpayload = {"api_key": api_key, "timestamp": timeStamp,"signature": signature}
    files = {'file': image_bytes}
    ImageCloudResponse = requests.post("https://api.cloudinary.com/v1_1/dzpamqv6d/auto/upload", data=Cloudpayload, files=files)
    tempURL = ImageCloudResponse.json()["secure_url"]
    version = tempURL.split("/")[-2]
    FinalImageURL = f"{tempURL.split(version)[0].rstrip('/')}/e_art:zorro/{version}/{tempURL.split(version)[1]}"
    return FinalImageURL


def polly_func(desc):
    response = polly.synthesize_speech(OutputFormat="mp3",Text=desc,VoiceId="Matthew")
    timeStamp = str(time.time())
    api_key = str(get_accessCloud())
    secret1 = get_cloudinary_secret().strip()
    signature = "timestamp=" + timeStamp + secret1
    api_key = str(get_accessCloud())
    signature = signature.encode()
    signature = hashlib.sha1(signature)
    signature = signature.hexdigest()
    Cloudpayload = {"api_key": api_key, "timestamp": timeStamp,"signature": signature}
    files = {'file': response["AudioStream"]}
    ImageCloudResponse = requests.post("https://api.cloudinary.com/v1_1/dzpamqv6d/auto/upload", data=Cloudpayload, files=files)
    pollyurl = ImageCloudResponse.json()["secure_url"]
    return pollyurl


def chatgpt_gen(name,deathdate,birthdate):
        prompt="write a 300 character obituary about a fictional character named {} who was born on {} and died on {}".format(name, birthdate, deathdate)
        api_key =str(gpt_Getter())
        url = "https://api.openai.com/v1/completions"
        headers = {"Content-Type": "application/json", "Authorization": "Bearer " +api_key}
        data = {"model": "text-davinci-003", "prompt": prompt, "max_tokens":150}
        GPTresponse = requests.post(url, headers=headers, json=data)
        obituary_desc= GPTresponse.json()["choices"][0]["text"]
        return obituary_desc

def handler(event, context):
    body = event["body"]
    try:
        data = json.loads(body)
        name = data["name"]
        birthdate = data["birthdate"]
        deathdate = data["deathdate"]
        id = data["id"]
        image_base64 = data["image"]
        secure_url =  upload_and_generate_secure_url(image_base64)
        obituary_desc = chatgpt_gen(name,deathdate,birthdate)
        pollyurl = polly_func(obituary_desc)
        Items={"id":id,"name": name,"died":deathdate, "born":birthdate, "desc":obituary_desc,"imageURL":secure_url,"pollyurl":pollyurl}
        response = table.put_item(Item=Items)

        return {
           "isBase64Encoded": "false",
           "statusCode": 200,
           "body": json.dumps({"message": "success", "image": secure_url, "description": obituary_desc, "pollyurl":pollyurl}),
           "headers": {"Content-Type": "application/json"}
       }

    except Exception as e:
        return {
            "statusCode":500, 
            "body": json.dumps(
                { "message":str(e) } 
            )
        }