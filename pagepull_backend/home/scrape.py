from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv()

SBR_WEBDRIVER = os.getenv('SBR_WEBDRIVER')
SELENIUM_USER = os.getenv('SELENIUM_USER')
SELENIUM_PASS = os.getenv('SELENIUM_PASS')

def scrape_website_data(website):
    print('Connecting to Bright Data Scraping Browser...')
    
    # Add Bright Data credentials to the connection URL
    if SELENIUM_USER and SELENIUM_PASS and SBR_WEBDRIVER:
        # Construct the full URL
        connection_url = f"https://{SELENIUM_USER}:{SELENIUM_PASS}{SBR_WEBDRIVER}"
    else:
        raise ValueError("Bright Data credentials or SBR_WEBDRIVER are missing. Check your .env file.")

    print("Connecting with URL:", connection_url)  # Debug: Verify the constructed URL

    sbr_connection = ChromiumRemoteConnection(connection_url, 'goog', 'chrome')
    
    # Establish a remote connection
    with Remote(sbr_connection, options=ChromeOptions()) as driver:
        print('Connected! Navigating to website...')
        driver.get(website)

        # Optional: Handle CAPTCHA if needed
        print('Waiting for CAPTCHA to solve...')
        try:
            solve_res = driver.execute('executeCdpCommand', {
                'cmd': 'Captcha.waitForSolve',
                'params': {'detectTimeout': 10000},
            })
            print('CAPTCHA solve status:', solve_res.get('value', {}).get('status', 'unknown'))
        except Exception as e:
            print('CAPTCHA solving not supported or failed:', e)

        print('Navigated! Scraping page content...')
        html = driver.page_source
        return html

# Test function if needed
# html_content = scrape_website_data("https://example.com")
# print(html_content)


# Other functions remain unchanged


def extract_body_content(html_content):
    soup = BeautifulSoup(html_content,'html.parser')
    body_content = soup.body
    if body_content:
        return str(body_content)
    return ""

def clean_body_content(body_content):
    soup = BeautifulSoup(body_content, "html.parser")

    for script_or_style in soup(["script", "style"]):
        script_or_style.extract()

    # Get text or further process the content
    cleaned_content = soup.get_text(separator="\n")
    cleaned_content = "\n".join(
        line.strip() for line in cleaned_content.splitlines() if line.strip()
    )

    return cleaned_content



def split_dom_content(dom_content, max_length=6000):
    split_content = []
    for i in range(0, len(dom_content), max_length):
        split_content.append(dom_content[i:i + max_length])
    return split_content