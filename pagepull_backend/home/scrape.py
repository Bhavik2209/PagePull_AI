from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def scrape_website_data(website):
    try:
        logger.info('Connecting to Scraping Browser...')
        
        # Get the webdriver URL from environment variables
        sbr_webdriver = os.getenv('SBR_WEBDRIVER')
        if not sbr_webdriver:
            raise ValueError("SBR_WEBDRIVER environment variable is not set")

        # Create connection and options
        options = ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--headless')
        
        sbr_connection = ChromiumRemoteConnection(sbr_webdriver, 'goog', 'chrome')
        
        with Remote(sbr_connection, options=options) as driver:
            logger.info('Connected! Navigating to website...')
            driver.get(website)
            
            # CAPTCHA handling
            logger.info('Waiting for captcha to solve...')
            try:
                solve_res = driver.execute('executeCdpCommand', {
                    'cmd': 'Captcha.waitForSolve',
                    'params': {'detectTimeout': 10000},
                })
                logger.info(f'Captcha solve status: {solve_res["value"]["status"]}')
            except Exception as e:
                logger.warning(f'Captcha handling error: {str(e)}')
            
            logger.info('Scraping page content...')
            html = driver.page_source
            return html
            
    except Exception as e:
        logger.error(f'Error during scraping: {str(e)}')
        raise

def extract_body_content(html_content):
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        body_content = soup.body
        return str(body_content) if body_content else ""
    except Exception as e:
        logger.error(f'Error extracting body content: {str(e)}')
        return ""

def clean_body_content(body_content):
    try:
        soup = BeautifulSoup(body_content, "html.parser")
        
        # Remove script and style elements
        for script_or_style in soup(["script", "style"]):
            script_or_style.extract()
        
        # Clean and format text
        cleaned_content = soup.get_text(separator="\n")
        cleaned_content = "\n".join(
            line.strip() for line in cleaned_content.splitlines() if line.strip()
        )
        
        return cleaned_content
    except Exception as e:
        logger.error(f'Error cleaning body content: {str(e)}')
        return ""

def split_dom_content(dom_content, max_length=6000):
    try:
        return [dom_content[i:i + max_length] 
                for i in range(0, len(dom_content), max_length)]
    except Exception as e:
        logger.error(f'Error splitting content: {str(e)}')
        return []