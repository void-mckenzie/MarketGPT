# Deploying React App to AWS S3

This guide provides a step-by-step process to deploy a React application to Amazon S3.

## Prerequisites:

1. Ensure you have [Node.js](https://nodejs.org/) and npm installed.
2. A React application ready for deployment.
3. An AWS account. If you don't have one, sign up [here](https://aws.amazon.com/).

## Deployment Steps:

### 1. Build Your React App for Production:

Navigate to your React app directory and run:

```
npm run build
```

This command will create a `build` directory with a production-ready build of your app.

### 2. Login to AWS Management Console:

- Navigate to the AWS Management Console.
- Search for "S3" and select the S3 service.

### 3. Create an S3 Bucket:

- Click on "Create Bucket".
- Provide a unique name for your bucket (e.g., `my-react-app-deployment`).
- Choose a region that's closest to your target audience for reduced latency.
- Leave the default configurations and proceed to create the bucket.

### 4. Configure the S3 Bucket for Static Website Hosting:

- Select your bucket from the S3 dashboard.
- Click on the "Properties" tab.
- Navigate to "Static website hosting".
- Choose "Use this bucket to host a website".
- Enter `index.html` for both the "Index Document" and "Error Document" fields (the latter is to ensure client-side routing works properly).
- Save your changes.

### 5. Upload Your React App to the S3 Bucket:

- Select the "Objects" tab in your bucket.
- Click "Upload".
- Drag and drop the contents of your `build` directory (not the directory itself) into the upload area.
- Finish the upload process.

### 6. Set Bucket Permissions:

To ensure that the contents of your bucket are publicly accessible:

- Navigate to the "Permissions" tab of your bucket.
- Click "Bucket Policy".
- Add the following policy (replace `YOUR_BUCKET_NAME` with the name of your bucket):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::YOUR_BUCKET_NAME/*"]
    }
  ]
}
```

Click "Save".

### 7. Access Your Deployed React App:

You can now navigate to your app using the S3 static website hosting endpoint URL. The URL format typically is:

```
http://YOUR_BUCKET_NAME.s3-website-YOUR_REGION.amazonaws.com/
```

Replace `YOUR_BUCKET_NAME` with the name of your bucket, and `YOUR_REGION` with the region code you chose (e.g., `us-west-1`, `us-east-2`, etc.).

---

And that's it! Your React application is now deployed on AWS S3.


---

### 8. Bonus: Create scripts in your React app for CI/CD:

In order to streamline the deployment process, we can utilize AWS CLI. This requires setting up AWS CLI on your local machine and configuring it for your AWS account.

**A. Install AWS CLI on your computer:**
```bash
// Navigate to your home folder
$ cd
// Confirm you're in the home folder
$ ~ 
```
Download and install AWS CLI:
```bash
$ curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
$ sudo installer -pkg AWSCLIV2.pkg -target /
```
For additional installation methods or other OS, refer to: [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html).

**B. Verify AWS CLI Installation:**
```bash
aws --version
```

**C. Configure AWS CLI:**
Start the configuration process:
```bash
aws configure
```
- It will prompt you for `AWS Access Key`. You can get this from your AWS account: Go to the IAM service, find your user account, select `Security Credentials`, and generate an Access key.
- It will then ask for `AWS Secret Access Key`. Obtain it from the same IAM step.

**D. Automate Deployment in your React app:**
In your `package.json` file, add the following scripts (ensure to replace `YOUR_BUCKET_NAME` with the name of your S3 bucket):
```json
"scripts": {
   //... your existing scripts ...
   "deploy": "aws s3 sync build/ s3://YOUR_BUCKET_NAME",
   "prod": "yarn build && yarn deploy" 
   // or if using npm:
   //"prod": "npm run build && npm run deploy"
}
```
Now, by running `yarn prod` or `npm run prod`, your React app will automatically build and deploy to your specified S3 bucket.

--- 

I hope this helps streamline your deployment process!