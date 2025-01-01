from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver import ChromiumOptions
from urllib.parse import urlparse
import os
from dotenv import load_dotenv
import logging
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def create_driver_with_auth():
    logger.info('Setting up Selenium driver...')
    
    # Get the webdriver URL from environment
    webdriver_url = os.getenv('SBR_WEBDRIVER')
    if not webdriver_url:
        raise ValueError("SBR_WEBDRIVER environment variable is not set")
    
    # Parse the URL to separate credentials
    parsed_url = urlparse(webdriver_url)
    auth = parsed_url.netloc.split('@')[0]
    username, password = auth.split(':')
    
    # Reconstruct the URL without credentials
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc.split('@')[1]}{parsed_url.path}"
    
    # Set up ChromeOptions
    options = ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--headless')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.page_load_strategy = 'eager'
    
    # Create connection with separate auth configuration
    capabilities = {
        'browserName': 'chrome',
        'goog:chromeOptions': options.to_capabilities()['goog:chromeOptions'],
        'sbr:auth': {
            'username': username,
            'password': password
        }
    }
    
    connection = ChromiumRemoteConnection(
        base_url,
        keep_alive=True
    )
    
    return Remote(
        command_executor=connection,
        options=options,
        desired_capabilities=capabilities
    )

def scrape_website_data(website):
    driver = None
    try:
        logger.info('Connecting to Scraping Browser...')
        driver = create_driver_with_auth()
        
        logger.info('Connected! Navigating to website...')
        driver.set_page_load_timeout(20)  # Increased timeout
        driver.get(website)
        
        # Wait for body to be present with timeout
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # Handle CAPTCHA if present
        try:
            logger.info('Checking for CAPTCHA...')
            solve_res = driver.execute('executeCdpCommand', {
                'cmd': 'Captcha.waitForSolve',
                'params': {'detectTimeout': 5000},
            })
            logger.info(f'CAPTCHA solve status: {solve_res["value"]["status"]}')
        except Exception as e:
            logger.warning(f'No CAPTCHA detected or handling failed: {str(e)}')
        
        logger.info('Getting page content...')
        return driver.page_source
        
    except Exception as e:
        logger.error(f'Error during scraping: {str(e)}')
        raise
        
    finally:
        if driver:
            try:
                driver.quit()
            except Exception as e:
                logger.warning(f'Error closing driver: {str(e)}')

def extract_body_content(html_content):
    try:
        soup = BeautifulSoup(html_content, 'lxml')
        body_content = soup.body
        return str(body_content) if body_content else ""
    except Exception as e:
        logger.error(f'Error extracting body content: {str(e)}')
        return ""

def clean_body_content(body_content):
    try:
        soup = BeautifulSoup(body_content, "lxml")
        
        # Remove unnecessary elements
        for element in soup(["script", "style", "meta", "link"]):
            element.decompose()
        
        # Clean and format text
        cleaned_content = soup.get_text(separator="\n", strip=True)
        return "\n".join(line for line in cleaned_content.splitlines() if line)
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