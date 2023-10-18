## Market GPT Deployment to AWS Lambda with Mangum: README.md

### Prerequisites

1. AWS Account.
2. Market GPT application source code.
3. Knowledge of FastAPI and AWS Lambda.

### Packaging for Deployment

1. **Prepare for Deployment**:
    - Make sure your application is using the Mangum adapter.
    - Your main application's entry point (the handler for AWS Lambda) should look something like:
      ```python
      handler = Mangum(app)
      ```

2. **Package Your Application**:
    - Compress your FastAPI application and all its dependencies into a ZIP file. If you've separated your dependencies into layers, then just package the main application.

### Deployment to AWS Lambda

1. **Lambda Configuration**:
    - Navigate to the AWS Management Console, select Lambda, and click on **Create function**.
    - Define a name and runtime (e.g., Python 3.7).
    - In the **Code** section, choose **Upload from** and select **.zip file**. Upload your application ZIP.
    - Set the Lambda handler to `your_file_name.handler` (The `handler` refers to the Mangum instance).

2. **Using Lambda Layers**:
    - In the **Function code** section, in the **Layers** subsection, click on **Add a layer**.
    - Choose **Specify an ARN** and add the ARN for each layer you've created.

3. **Environment Variables**:
    - Set up the necessary environment variables in AWS Lambda, such as `OPENAI_API_KEY` and `SERPAPI_API_KEY`.

4. **Permissions & Execution Role**:
    - Ensure your Lambda function has the required permissions, especially if your function communicates with other AWS services.

5. **Increase Timeout**: 
    - AWS Lambda's default timeout is short. Increase the timeout in the function's configuration, especially if your FastAPI app will run long tasks.

6. **API Gateway Configuration**:
    - Under **Designer**, add an API Gateway trigger.
    - Configure API Gateway to create a new REST API.
    - Ensure that the deployment stage is added.
    - Make a note of the provided API Gateway URL.

### Testing the Deployment

1. Use tools like Postman, or `curl` in the terminal, to make requests to your deployed FastAPI application.

2. For example:

```bash
curl -X POST https://YOUR_API_GATEWAY_URL/market -d '{"company":"Apple Inc"}'
```

### Troubleshooting & Tips

- If you face issues, always check the CloudWatch logs for specific error details. 
- If your Lambda function runs longer than expected, consider increasing the function's timeout setting.
- Always secure your API keys. Don't hard-code them. Instead, pass them as environment variables or use AWS Secrets Manager.

### Conclusion

Your FastAPI application, with the help of the Mangum adapter, should now be running smoothly on AWS Lambda and accessible via API Gateway. Monitor its performance, ensure security best practices are followed, and scale as needed.
