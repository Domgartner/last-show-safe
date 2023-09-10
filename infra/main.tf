terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
  access_key = ""
  secret_key = ""
}

locals {
  func_create = "create-obituary-30154504"
  func_get = "get-obituary-30154504"
  handler_name = "main.handler"
  artifact_create = "artifact_create.zip"
  artifact_get = "artifact_get.zip"
}

# two lambda functions w/ function url

# create Lambda functions

resource "aws_iam_role" "lambda_exec" {
  name               = "iam-obituary"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_exec_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec.name
}
resource "aws_iam_role_policy_attachment" "lambda_polly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonPollyFullAccess"
  role       = aws_iam_role.lambda_exec.name
}
resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = aws_iam_role.lambda_exec.name
}
resource "aws_iam_role_policy_attachment" "lambda_SSM" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMFullAccess"
  role       = aws_iam_role.lambda_exec.name
}

resource "aws_lambda_function" "lambda-create" {
  role             = aws_iam_role.lambda_exec.arn
  function_name    = local.func_create
  handler          = local.handler_name
  filename         = local.artifact_create
  source_code_hash = data.archive_file.data_create_zip.output_base64sha256
  runtime = "python3.9"
  timeout = 30
}

resource "aws_lambda_function" "lambda-get" {
  role             = aws_iam_role.lambda_exec.arn
  function_name    = local.func_get
  handler          = local.handler_name
  filename         = local.artifact_get
  source_code_hash = data.archive_file.data_get_zip.output_base64sha256
  runtime = "python3.9"
}


# create a Function URL for Lambda 
resource "aws_lambda_function_url" "url-create" {
  function_name      = aws_lambda_function.lambda-create.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}
resource "aws_lambda_function_url" "url-get" {
  function_name      = aws_lambda_function.lambda-get.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}


# data "archive_file" "data_create_zip" {
#   type = "zip"
#   source_file = "../functions/create-obituary/main.py"
#   output_path = local.artifact_create

# }

data "archive_file" "data_create_zip" {
type        = "zip"
source_dir  = "../functions/create-obituary"
output_path = local.artifact_create
}

data "archive_file" "data_get_zip" {
  type = "zip"
  source_file = "../functions/get-obituaries/main.py"
  output_path = local.artifact_get
}

# one dynamodb table
resource "aws_dynamodb_table" "LS-30143419" {
  name           = "LS-ob-30143419"
  hash_key       = "id"
  range_key      = "name"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "name"
    type = "S"
  }
  attribute {
    name = "id"
    type = "S"
  }
}



# roles and policies as needed

# create a role for the Lambda function to assume
# resource "aws_iam_role" "lambda" {
#   name               = "iam_for_lambda"
#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": "sts:AssumeRole",
#       "Principal": {
#         "Service": "lambda.amazonaws.com"
#       },
#       "Effect": "Allow",
#       "Sid": ""
#     }
#   ]
# }
# EOF
# }

# create a policy for publishing logs to CloudWatch
resource "aws_iam_policy" "logs" {
  name        = "lambda_logs"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource":["arn:aws:dynamodb:::table/","arn:aws:logs:::","arn:aws:dynamodb:ca-central-1:409601214226:table/LS-30143419"],
      "Effect": "Allow"
    }
  ]
}
EOF
}
output "lambda_url_create" {
  value = aws_lambda_function_url.url-create.function_url
}
output "lambda_url_get" {
  value = aws_lambda_function_url.url-get.function_url
}