from fastapi import FastAPI, Response, status, Request
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.agents import load_tools
from langchain.agents import initialize_agent
from langchain.agents import AgentType
from langchain.llms import OpenAI



import os
from io import BytesIO
import base64 
import json

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
SERPAPI_API_KEY = os.environ.get("SERPAPI_API_KEY")


from fastapi import FastAPI, Response, status, Request
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import os
from io import BytesIO
import base64 
import json

app = FastAPI()
handler = Mangum(app)

app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)
from pydantic import BaseModel

class CompanyTemplate(BaseModel):
    company: str
class TweetRequest(BaseModel):
    plugin_name: str

def prompt_industry(company):
  return """
      Respond in the following format for the upcoming query:
      [{"industry":"name", "competitors":[{"company":"value", "market_cap": "value"},{"company":"value", "market_cap": "value"},{"company":"value", "market_cap": "value"},{"company":"value", "market_cap": "value"}]}]

      If you do not know the answer, respond in the following format:, 
      {"industry":"", "companies":[]}

      Think step by step.
      The output should always be in a valid json format.
      Now the query is as follows:
      query: What industry is """+company+""" a part of and what are its major competitors in this market space, and what are the market caps of its competitors in Billions
      """
def prompt_email(company):
  return """
  Respond in the following format for the upcoming query:
  [{"email": "email_id", "name": "name", "subject":"subject", "email_content": "email_content"}]

  If you do not know the answer, respond as follows:
  [{}]
  Think step by step.
  The output should always be in a valid json format.
  Ensure you only give one name, email_id, subject, email_content
  email_id should follow the regex: r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
  email_content should always contain the name of the person
  Below is the query:
  query: Get me a single name and email id of a top level excecutive at the company """+company+""" \
    and write a demo email introducing them to a new web plugin (MarketGPT) that uses ChatGPT to give market insights. It's functuinalities include personalised emails, market cap analysis and automatic tweet generation. 
  """
  
def prompt_tweet(plugin_name):
  return """ 
  Respond in the following format for the upcoming query:
  {"twitter_content": "tweet"}

  If you do not know the answer, respond as follows:
  {}
  Think step by step.
  The output should always be a valid json format.
  Ensure that you only give a single response.
  Ensure the response contains the plugin_name and the generated content and the hashtags
  Below is the query:
  query: Generate a tweet with the relevant hashtags introducing them to a new web plugin """+plugin_name+"""  /
    elaborate a bit based on the plugin's name (plugin type is based on the name). Be creative
  """
  


@app.get('/')
async def home():
  return JSONResponse({"APP":"Market GPT"})
  
@app.post('/market')
def get_market_share_details(request: CompanyTemplate):
  company = request.company
  llm = OpenAI(temperature=0.4)
  tools = load_tools(["serpapi"], llm=llm)
  agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, early_stopping_method="generate", verbose=True)
  competition = agent.run(prompt_industry(company))
  print(competition)
  json_obj = json.loads(competition)
  print(json_obj)
  return JSONResponse(json_obj)

@app.post('/tweets')
def get_tweet(request: TweetRequest):
  plugin_name = request.plugin_name
  print(plugin_name)
  llm = OpenAI(temperature=0.8)
  plugin = llm(prompt_tweet(plugin_name))
  json_obj = json.loads(plugin)
  print(json_obj)
  return JSONResponse(json_obj)


@app.post('/ggpost')
def mex(request: CompanyTemplate):
  #print(request)
  print(request)
  var = request.company
  print("Successful Test Execution")
  return JSONResponse({"APP":var})
  
@app.exception_handler(Exception)
async def handle_exception(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            'message': f'Something went wrong. Please try again'
        }
    )




@app.post('/email')
def get_email_from_company(request: CompanyTemplate):
  company = request.company
  llm = OpenAI(temperature=0.55)
  tools = load_tools(["serpapi"], llm=llm)
  agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, early_stopping_method="generate", verbose=True)
  email = agent.run(prompt_email(company))
  print(email)
  json_obj = json.loads(email)
  print(json_obj)
  return JSONResponse(json_obj)
  
