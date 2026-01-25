"""
Web scraping service for solar panels, inverters, and batteries
Uses Selenium with Firefox browser

CONFIGURATION INSTRUCTIONS:
===========================

To configure this scraper for real websites:

1. Update the website URLs in the scrape_solar_panels(), scrape_inverters(), 
   and scrape_batteries() methods with actual URLs you want to scrape.

2. Adapt the CSS selectors in _scrape_generic_solar_panel(), _scrape_generic_inverter(),
   and _scrape_generic_battery() methods to match the HTML structure of your target websites.

3. For each website, you may need to:
   - Inspect the HTML structure using browser developer tools
   - Identify the correct CSS selectors for product cards, prices, specifications, etc.
   - Add website-specific scraping logic if needed

4. Test the scraper with a single website first before adding multiple sources.

5. Make sure Firefox and geckodriver are properly installed on your system.

EXAMPLE:
--------
To add a new website, modify the websites list like this:

websites = [
    {
        'url': 'https://www.real-solar-website.com/products',
        'scraper': self._scrape_custom_website  # Custom scraper function
    }
]

Then create a custom scraper function that extracts data based on that website's structure.
"""
import time
import re
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from django.utils import timezone
from django.conf import settings
from .models import Product


class PriceTrackerScraper:
    """Main scraper class for fetching product data from various websites"""
    
    def __init__(self):
        self.driver = None
        self.setup_driver()
    
    def setup_driver(self):
        """Setup Firefox WebDriver with appropriate options"""
        firefox_options = Options()
        firefox_options.add_argument('--headless')  # Run in background
        firefox_options.add_argument('--no-sandbox')
        firefox_options.add_argument('--disable-dev-shm-usage')
        firefox_options.set_preference('dom.webdriver.enabled', False)
        firefox_options.set_preference('useAutomationExtension', False)
        
        # Try to use geckodriver from project directory if it exists
        geckodriver_path = None
        base_dir = Path(settings.BASE_DIR)
        geckodriver_file = base_dir / 'geckodriver.exe'
        
        if geckodriver_file.exists():
            geckodriver_path = str(geckodriver_file)
        
        try:
            if geckodriver_path:
                # For Selenium 4.x, use Service without executable_path parameter
                try:
                    service = Service(geckodriver_path)
                except TypeError:
                    # Fallback for older Selenium versions
                    service = Service(executable_path=geckodriver_path)
                self.driver = webdriver.Firefox(service=service, options=firefox_options)
            else:
                self.driver = webdriver.Firefox(options=firefox_options)
            self.driver.implicitly_wait(10)
            self.driver.set_page_load_timeout(30)
        except Exception as e:
            print(f"Error setting up Firefox driver: {e}")
            raise
    
    def close(self):
        """Close the browser driver"""
        if self.driver:
            self.driver.quit()
    
    def extract_price(self, text):
        """Extract price from text string"""
        if not text:
            return None
        
        # Remove commas and extract numbers
        price_match = re.search(r'[\d,]+\.?\d*', text.replace(',', ''))
        if price_match:
            try:
                return float(price_match.group().replace(',', ''))
            except ValueError:
                return None
        return None
    
    def scrape_solar_panels(self):
        """Scrape solar panel data from various websites"""
        products = []
        
        # Example websites - you can add more
        websites = [
            {
                'url': 'https://www.example-solar.com/panels',  # Replace with actual URLs
                'scraper': self._scrape_generic_solar_panel
            }
        ]
        
        for site in websites:
            try:
                print(f"Scraping solar panels from {site['url']}")
                self.driver.get(site['url'])
                time.sleep(3)  # Wait for page to load
                
                scraped_products = site['scraper']()
                products.extend(scraped_products)
                
            except Exception as e:
                print(f"Error scraping {site['url']}: {e}")
                continue
        
        return products
    
    def scrape_inverters(self):
        """Scrape inverter data from various websites"""
        products = []
        
        websites = [
            {
                'url': 'https://www.example-solar.com/inverters',  # Replace with actual URLs
                'scraper': self._scrape_generic_inverter
            }
        ]
        
        for site in websites:
            try:
                print(f"Scraping inverters from {site['url']}")
                self.driver.get(site['url'])
                time.sleep(3)
                
                scraped_products = site['scraper']()
                products.extend(scraped_products)
                
            except Exception as e:
                print(f"Error scraping {site['url']}: {e}")
                continue
        
        return products
    
    def scrape_batteries(self):
        """Scrape battery data from various websites"""
        products = []
        
        websites = [
            {
                'url': 'https://www.example-solar.com/batteries',  # Replace with actual URLs
                'scraper': self._scrape_generic_battery
            }
        ]
        
        for site in websites:
            try:
                print(f"Scraping batteries from {site['url']}")
                self.driver.get(site['url'])
                time.sleep(3)
                
                scraped_products = site['scraper']()
                products.extend(scraped_products)
                
            except Exception as e:
                print(f"Error scraping {site['url']}: {e}")
                continue
        
        return products
    
    def _scrape_generic_solar_panel(self):
        """Generic scraper for solar panels - adapt based on actual website structure"""
        products = []
        
        try:
            # Wait for product cards/elements to load
            wait = WebDriverWait(self.driver, 10)
            
            # This is a generic example - adapt selectors based on actual website
            product_elements = self.driver.find_elements(By.CSS_SELECTOR, '.product-card, .product-item, [class*="product"]')
            
            for element in product_elements[:10]:  # Limit to first 10 products
                try:
                    product_data = {
                        'category': 'solar_panel',
                        'company': '',
                        'model': '',
                        'price': None,
                        'description': '',
                        'website': self.driver.current_url,
                        'cell_type': '',
                        'glass_thickness': '',
                        'max_power': '',
                        'max_system_voltage': '',
                        'operating_temperature': '',
                        'efficiency': '',
                        'type': '',
                        'features': ''
                    }
                    
                    # Extract company name
                    try:
                        company_elem = element.find_element(By.CSS_SELECTOR, '.company, .brand, [class*="company"], [class*="brand"]')
                        product_data['company'] = company_elem.text.strip()
                    except:
                        pass
                    
                    # Extract model
                    try:
                        model_elem = element.find_element(By.CSS_SELECTOR, '.model, .name, h3, h4, [class*="model"], [class*="name"]')
                        product_data['model'] = model_elem.text.strip()
                    except:
                        pass
                    
                    # Extract price
                    try:
                        price_elem = element.find_element(By.CSS_SELECTOR, '.price, [class*="price"]')
                        price_text = price_elem.text.strip()
                        product_data['price'] = self.extract_price(price_text)
                    except:
                        pass
                    
                    # Extract description
                    try:
                        desc_elem = element.find_element(By.CSS_SELECTOR, '.description, [class*="description"]')
                        product_data['description'] = desc_elem.text.strip()
                    except:
                        pass
                    
                    # Extract specifications (these selectors need to be adapted)
                    try:
                        specs = element.find_elements(By.CSS_SELECTOR, '.spec, .specification, [class*="spec"]')
                        for spec in specs:
                            spec_text = spec.text.lower()
                            if 'power' in spec_text or 'watt' in spec_text:
                                product_data['max_power'] = spec.text.strip()
                            elif 'cell' in spec_text:
                                product_data['cell_type'] = spec.text.strip()
                            elif 'glass' in spec_text or 'thickness' in spec_text:
                                product_data['glass_thickness'] = spec.text.strip()
                            elif 'voltage' in spec_text:
                                product_data['max_system_voltage'] = spec.text.strip()
                            elif 'temperature' in spec_text or 'temp' in spec_text:
                                product_data['operating_temperature'] = spec.text.strip()
                            elif 'efficiency' in spec_text:
                                product_data['efficiency'] = spec.text.strip()
                    except:
                        pass
                    
                    if product_data['company'] and product_data['model']:
                        products.append(product_data)
                        
                except Exception as e:
                    print(f"Error extracting product data: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error in generic solar panel scraper: {e}")
        
        return products
    
    def _scrape_generic_inverter(self):
        """Generic scraper for inverters"""
        products = []
        
        try:
            product_elements = self.driver.find_elements(By.CSS_SELECTOR, '.product-card, .product-item, [class*="product"]')
            
            for element in product_elements[:10]:
                try:
                    product_data = {
                        'category': 'inverter',
                        'company': '',
                        'model': '',
                        'price': None,
                        'description': '',
                        'website': self.driver.current_url,
                        'type': '',
                        'features': '',
                        'max_power': '',
                        'efficiency': ''
                    }
                    
                    try:
                        company_elem = element.find_element(By.CSS_SELECTOR, '.company, .brand, [class*="company"]')
                        product_data['company'] = company_elem.text.strip()
                    except:
                        pass
                    
                    try:
                        model_elem = element.find_element(By.CSS_SELECTOR, '.model, .name, h3, h4')
                        product_data['model'] = model_elem.text.strip()
                    except:
                        pass
                    
                    try:
                        price_elem = element.find_element(By.CSS_SELECTOR, '.price, [class*="price"]')
                        product_data['price'] = self.extract_price(price_elem.text.strip())
                    except:
                        pass
                    
                    try:
                        desc_elem = element.find_element(By.CSS_SELECTOR, '.description, [class*="description"]')
                        product_data['description'] = desc_elem.text.strip()
                    except:
                        pass
                    
                    if product_data['company'] and product_data['model']:
                        products.append(product_data)
                        
                except Exception as e:
                    print(f"Error extracting inverter data: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error in generic inverter scraper: {e}")
        
        return products
    
    def _scrape_generic_battery(self):
        """Generic scraper for batteries"""
        products = []
        
        try:
            product_elements = self.driver.find_elements(By.CSS_SELECTOR, '.product-card, .product-item, [class*="product"]')
            
            for element in product_elements[:10]:
                try:
                    product_data = {
                        'category': 'battery',
                        'company': '',
                        'model': '',
                        'price': None,
                        'description': '',
                        'website': self.driver.current_url,
                        'type': '',
                        'features': '',
                        'max_power': ''  # Capacity for batteries
                    }
                    
                    try:
                        company_elem = element.find_element(By.CSS_SELECTOR, '.company, .brand, [class*="company"]')
                        product_data['company'] = company_elem.text.strip()
                    except:
                        pass
                    
                    try:
                        model_elem = element.find_element(By.CSS_SELECTOR, '.model, .name, h3, h4')
                        product_data['model'] = model_elem.text.strip()
                    except:
                        pass
                    
                    try:
                        price_elem = element.find_element(By.CSS_SELECTOR, '.price, [class*="price"]')
                        product_data['price'] = self.extract_price(price_elem.text.strip())
                    except:
                        pass
                    
                    try:
                        desc_elem = element.find_element(By.CSS_SELECTOR, '.description, [class*="description"]')
                        product_data['description'] = desc_elem.text.strip()
                    except:
                        pass
                    
                    if product_data['company'] and product_data['model']:
                        products.append(product_data)
                        
                except Exception as e:
                    print(f"Error extracting battery data: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error in generic battery scraper: {e}")
        
        return products


def create_sample_data():
    """
    Create sample data for testing purposes
    This function can be used to populate the database with sample products
    """
    sample_products = [
        {
            'category': 'solar_panel',
            'company': 'Canadian Solar',
            'model': 'CS3K-550MS',
            'price': 25000.00,
            'description': 'High-efficiency monocrystalline solar panel',
            'website': 'https://www.canadiansolar.com',
            'cell_type': 'Monocrystalline',
            'glass_thickness': '3.2mm',
            'max_power': '550W',
            'max_system_voltage': '1500V',
            'operating_temperature': '-40°C to +85°C',
            'efficiency': '21.5%',
            'type': 'Monocrystalline PERC',
            'features': 'Anti-PID, High efficiency, Weather resistant'
        },
        {
            'category': 'solar_panel',
            'company': 'Jinko Solar',
            'model': 'Tiger Pro 600W',
            'price': 28000.00,
            'description': 'Advanced bifacial solar panel',
            'website': 'https://www.jinkosolar.com',
            'cell_type': 'Monocrystalline',
            'glass_thickness': '3.2mm',
            'max_power': '600W',
            'max_system_voltage': '1500V',
            'operating_temperature': '-40°C to +85°C',
            'efficiency': '22.3%',
            'type': 'Bifacial Monocrystalline',
            'features': 'Bifacial technology, High power output, Durable'
        },
        {
            'category': 'inverter',
            'company': 'Sungrow',
            'model': 'SG125HV',
            'price': 150000.00,
            'description': 'High voltage string inverter',
            'website': 'https://www.sungrowpower.com',
            'type': 'String Inverter',
            'features': 'High efficiency, Smart monitoring, IP65 protection',
            'max_power': '125kW',
            'efficiency': '98.5%'
        },
        {
            'category': 'inverter',
            'company': 'Huawei',
            'model': 'SUN2000-100KTL',
            'price': 180000.00,
            'description': 'Smart string inverter with AI optimization',
            'website': 'https://www.huawei.com',
            'type': 'String Inverter',
            'features': 'AI optimization, Cloud monitoring, High reliability',
            'max_power': '100kW',
            'efficiency': '98.6%'
        },
        {
            'category': 'battery',
            'company': 'Tesla',
            'model': 'Powerwall 2',
            'price': 350000.00,
            'description': 'Home energy storage system',
            'website': 'https://www.tesla.com',
            'type': 'Lithium-ion',
            'features': '13.5kWh capacity, 10-year warranty, Smart control',
            'max_power': '5kW continuous, 7kW peak'
        },
        {
            'category': 'battery',
            'company': 'LG Chem',
            'model': 'RESU 10H',
            'price': 320000.00,
            'description': 'Residential energy storage unit',
            'website': 'https://www.lgchem.com',
            'type': 'Lithium-ion NMC',
            'features': '9.8kWh capacity, Compact design, Long lifespan',
            'max_power': '5kW'
        }
    ]
    
    created_count = 0
    for product_data in sample_products:
        try:
            product, created = Product.objects.update_or_create(
                company=product_data['company'],
                model=product_data['model'],
                category=product_data['category'],
                defaults=product_data
            )
            if created:
                created_count += 1
        except Exception as e:
            print(f"Error creating sample product {product_data['model']}: {e}")
    
    return created_count


def update_prices(category=None):
    """
    Main function to update prices in the database
    category: 'solar_panel', 'inverter', 'battery', or None for all
    """
    scraper = PriceTrackerScraper()
    updated_count = 0
    
    try:
        categories_to_scrape = []
        
        if category:
            categories_to_scrape = [category]
        else:
            categories_to_scrape = ['solar_panel', 'inverter', 'battery']
        
        for cat in categories_to_scrape:
            print(f"Scraping {cat}...")
            
            if cat == 'solar_panel':
                products = scraper.scrape_solar_panels()
            elif cat == 'inverter':
                products = scraper.scrape_inverters()
            elif cat == 'battery':
                products = scraper.scrape_batteries()
            else:
                continue
            
            # Save products to database
            for product_data in products:
                try:
                    # Check if product already exists
                    product, created = Product.objects.update_or_create(
                        company=product_data.get('company', ''),
                        model=product_data.get('model', ''),
                        category=cat,
                        defaults={
                            'price': product_data.get('price'),
                            'description': product_data.get('description', ''),
                            'website': product_data.get('website', ''),
                            'cell_type': product_data.get('cell_type', ''),
                            'glass_thickness': product_data.get('glass_thickness', ''),
                            'max_power': product_data.get('max_power', ''),
                            'max_system_voltage': product_data.get('max_system_voltage', ''),
                            'operating_temperature': product_data.get('operating_temperature', ''),
                            'efficiency': product_data.get('efficiency', ''),
                            'type': product_data.get('type', ''),
                            'features': product_data.get('features', ''),
                            'last_scraped': timezone.now()
                        }
                    )
                    updated_count += 1
                except Exception as e:
                    print(f"Error saving product: {e}")
                    continue
        
        print(f"Updated {updated_count} products")
        return updated_count
        
    except Exception as e:
        print(f"Error in update_prices: {e}")
        raise
    finally:
        scraper.close()
