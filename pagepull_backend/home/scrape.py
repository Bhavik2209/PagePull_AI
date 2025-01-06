from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
import logging
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def setup_driver():
    options = ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--headless')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument(f'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('--disable-extensions')
    options.add_argument('--window-size=1920,1080')
    options.page_load_strategy = 'eager'  # Don't wait for all resources to load
    
    try:
        webdriver_url = os.getenv('SBR_WEBDRIVER')
        if not webdriver_url:
            raise ValueError("SBR_WEBDRIVER environment variable is not set")

        return Remote(command_executor=webdriver_url, options=options)
    except Exception as e:
        logger.error(f"Driver setup failed: {str(e)}")
        raise

def scrape_with_timeout(website, timeout=15):
    def _scrape():
        driver = setup_driver()
        try:
            driver.set_page_load_timeout(timeout)
            driver.get(website)
            
            WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            return driver.page_source
        finally:
            driver.quit()
    
    with ThreadPoolExecutor(max_workers=1) as executor:
        try:
            return executor.submit(_scrape).result(timeout=timeout)
        except TimeoutError:
            logger.error(f'Scraping timed out after {timeout} seconds')
            raise

def scrape_website_data(website):
    try:
        logger.info('Connecting to Scraping Browser...')
        return scrape_with_timeout(website)
    except Exception as e:
        logger.error(f'Error during scraping: {str(e)}')
        raise

def extract_body_content(html_content):
    try:
        soup = BeautifulSoup(html_content, 'html.parser')  # Using default parser instead of lxml
        body_content = soup.body
        return str(body_content) if body_content else ""
    except Exception as e:
        logger.error(f'Error extracting body content: {str(e)}')
        return ""

def clean_body_content(body_content):
    try:
        soup = BeautifulSoup(body_content, "html.parser")  # Using default parser instead of lxml
        
        # Remove script and style elements
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