from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection, ClientConfig
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def scrape_website_data(website):
    print('Connecting to Scraping Browser...')
    
    # Extract WebDriver details from the environment variable
    webdriver_url = os.getenv("SBR_WEBDRIVER")
    if not webdriver_url:
        raise ValueError("SBR_WEBDRIVER environment variable is not set.")
    
    remote_server_addr = webdriver_url.split('@')[-1].split(':')[0]

    client_config = ClientConfig(
        remote_server_addr=remote_server_addr,
        username=os.getenv("SELENIUM_USER"),
        password=os.getenv("SELENIUM_PASS"),
        keep_alive=True
    )
    
    try:
        sbr_connection = ChromiumRemoteConnection(webdriver_url, client_config, browser_name="chrome")
        with Remote(sbr_connection, options=ChromeOptions()) as driver:
            print('Connected! Navigating to website...')
            driver.get(website)
            
            # CAPTCHA handling
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
    except Exception as e:
        print(f"An error occurred: {e}")
        return None  # or handle the error as needed

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
