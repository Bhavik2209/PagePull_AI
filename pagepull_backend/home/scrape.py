from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection, ClientConfig
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def scrape_website_data(website):
    print('Connecting to Scraping Browser...')
    
    # Secure ClientConfig setup
    client_config = ClientConfig(
        username=os.getenv("SELENIUM_USER"),
        password=os.getenv("SELENIUM_PASS"),
        keep_alive=True  # Optional: Use persistent connections if needed
    )
    
    # Establish connection using WebDriver URL from environment
    sbr_connection = ChromiumRemoteConnection(os.getenv('SBR_WEBDRIVER'), client_config)
    
    with Remote(sbr_connection, options=ChromeOptions()) as driver:
        print('Connected! Navigating to website...')
        driver.get(website)
        
        # CAPTCHA handling (if applicable)
        print('Waiting for CAPTCHA to solve...')
        solve_res = driver.execute('executeCdpCommand', {
            'cmd': 'Captcha.waitForSolve',
            'params': {'detectTimeout': 10000},
        })
        print('Captcha solve status:', solve_res['value']['status'])
        
        # Scrape content
        print('Navigated! Scraping page content...')
        html = driver.page_source
        return html

def extract_body_content(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    body_content = soup.body
    return str(body_content) if body_content else ""

def clean_body_content(body_content):
    soup = BeautifulSoup(body_content, "html.parser")
    for script_or_style in soup(["script", "style"]):
        script_or_style.extract()

    # Get and clean text
    cleaned_content = soup.get_text(separator="\n")
    return "\n".join(line.strip() for line in cleaned_content.splitlines() if line.strip())

def split_dom_content(dom_content, max_length=6000):
    return [dom_content[i:i + max_length] for i in range(0, len(dom_content), max_length)]
